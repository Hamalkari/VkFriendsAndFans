const Router = require('koa-router');
const router = new Router();

const BASE_URL = '/fans';
const { getUserFans } = require('../parser/index');


router.get(BASE_URL, async (ctx) => {
    try {
      const { user_id,city } = ctx.request.query;
      if (user_id) {
        let fans = await getUserFans(user_id,city);
        await ctx.render('fans_list',{
          pageTitle: `Подписчики пользователя ${user_id}`,
          user_id,
          fans
        });
      } else {
        await ctx.render('fans_form',{
          pageTitle: "Подписчики"
        });
      }
    } catch (error) {
      await ctx.render('fans_form',{
        pageTitle: 'Подписчики',
        error: error.message
      });
    }
});


module.exports = router;