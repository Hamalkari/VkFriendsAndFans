const Router = require('koa-router');
const router = new Router();

const BASE_URL = `/friends`;

const { getUserFriends } = require('../parser/index');

router.get(BASE_URL,async (ctx) => {
  try {
    const { user_id, city} = ctx.request.query;
    if (user_id) {
      let friends = await getUserFriends(user_id,city);
      await ctx.render('friends_list',{
        pageTitle: `Друзья пользователя - ${user_id}`,
        user_id,
        friends,
      });
    } else {
      await ctx.render('friends_form',{
        pageTitle: 'Друзья'
      });
    }
  } catch (error) {
    await ctx.render('friends_form',{
      pageTitle: 'Друзья',
      error: error.message
    })
  }
});



module.exports = router;