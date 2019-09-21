const axios = require('axios').default;
const config = require('../config');
const chalk = require('chalk');

// Node modules
const fs = require('fs');
const util = require('util');
const path = require('path');

const writeFile = util.promisify(fs.writeFile);

// URLS
const BASE_URL = 'https://api.vk.com/method';

const GET_USER_FRIENDS_URL = `${BASE_URL}/friends.get`
const GET_USER_FANS_URL = `${BASE_URL}/users.getFollowers`;
const GET_USER_INFO = `${BASE_URL}/users.get`;

async function getUserFriends(id,city = '') {
  try {
    const { data } = await axios.get(GET_USER_FRIENDS_URL,{
      params: {
        user_id: id,
        access_token: config.access_token,
        v: '5.52',
        fields: 'city,photo_200',
        lang: 0
      }
    });
    if (!data.response) {
      throw new Error('Пользователь с таким ID не найден');
    } else {
      let friends = data.response.items;
      if (city) {
        friends = friends.filter(friend => {
          return 'city' in friend ? friend.city.title == city : false;
        });
      }
      const fileName = city ? `friends_city-${city}_id-${id}.txt` : `friends_id-${id}.txt`;
      await writeFile(path.join(__dirname,'..','assets/files',fileName),JSON.stringify(friends,null,4));
      return friends;
    }
  } catch (error) {
    console.log(chalk.red(error));
    throw error;
  }
}

async function getUserFans(id,city = '') {
  try {
    const countFollowers = await getCountFollowers(id);
    let fans = [];
    let offset = 0;
    let totalCount = 0;
    while(totalCount < countFollowers) {
      const { data } = await axios.get(GET_USER_FANS_URL,{
        params: {
          user_id: id,
          access_token: config.access_token,
          v: '5.52',
          offset: offset,
          count: 1000,
          fields: 'photo_200,city',
          lang: 0
        }
      });
      fans = [...fans,...data.response.items];
      offset += 1000;
      totalCount += 1000;
    }
    if (city) {
      fans = fans.filter(fan => {
        return 'city' in fan ? fan.city.title === city : false;
      });
    }
    const fileName = city ? `fans_city-${city}_id-${id}.txt` : `fans_id-${id}.txt`;
    await writeFile(path.join(__dirname,'..','assets/files',fileName),JSON.stringify(fans,null,4));
    return fans;
  } catch (error) {
    throw error;
  }
}


async function getCountFollowers(id) {
  try {
    const { data } = await axios.get(GET_USER_INFO,{
      params: {
        access_token: config.access_token,
        v: '5.52',
        user_ids: id,
        fields: 'followers_count'
      }
    });
    if (!data.response) {
      throw new Error('Пользователь с таким ID не найден')
    }
    return data.response[0].followers_count;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  getUserFriends,
  getUserFans
}