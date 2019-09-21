const Koa = require('koa');
const logger = require('koa-logger');
const views = require('koa-views');
const static = require('koa-static');
const mount = require('koa-mount');
const bodyParser = require('koa-bodyparser');

const path = require('path');

const app = new Koa();


app.use(logger());
app.use(bodyParser());


app.use(mount('/assets',static('./assets')));

app.use(views(path.join(__dirname,'views','pages'),{ extension: 'pug' }));

const PORT = process.env.PORT || 5000;

// Routes
const indexRoutes = require('./routes/index');
const fansRoutes = require('./routes/fans');
const friendsRoutes = require('./routes/friends');


app.use(indexRoutes.routes());
app.use(fansRoutes.routes());
app.use(friendsRoutes.routes());

app.listen(PORT,() => {
  console.log(`http://localhost:${PORT}`);
});