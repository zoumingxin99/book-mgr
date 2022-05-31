const Koa = require('koa');
<<<<<<< HEAD
=======
const koaBody = require('koa-body');
const { connect } = require('./db');
const registerRoutes = require('./routers');
const { middleware: koaJwtMiddleware, checkUser, catchTokenError } = require('./helpers/token');
const { logMiddleware } = require('./helpers/log');
const cors = require('@koa/cors');

>>>>>>> 827498f (lastly)

const app = new Koa();


<<<<<<< HEAD
//通过 app.use注册中间键 本质是函数 context:当前请求都在里面
app.use (async(context, next) => {
    const {request: req} = context; //const request = context.request;:重命名
    const{url} = req;

    if(url === '/'){
        context.response.body = '<h1>主页</h1>';
        return;
    }
    if(url === '/user/list'){
        context.response.body = '<h1>用户列表</h1>';
        return;
    }

    context.body = '404';
  
    console.log(1);
    await next();
    console.log(3);
    context.status = 404;
});

app.use(async (context) => {
    console.log(2);
    context.response.body = '找不到资源';
});



// const  getYearByTimeStap =require('./helpers/utils/index');
// console.log(getYearByTimeStamp(new Date().getTime()));

// const utils = require('./helpers/utils/index');
// console.log(utils);

//开启http服务
//接受http 请求 并作处理 处理完后响应
app.listen(3000,() => {
    console.log('启动成功');
});

console.log(112233);
=======
//连接后再启动
connect().then(() => {
    app.use(cors());
    app.use(koaBody({
        multipart: true,
        formidable: {
            maxFieldsSize: 200 * 1024 * 1024,
        },
    }));

    app.use(catchTokenError);
    
    koaJwtMiddleware(app);

    app.use(checkUser);

    app.use(logMiddleware);

    registerRoutes(app);

    //开启http服务
    //接受http 请求 并作处理 处理完后响
    app.listen(3000,() => {
        console.log('启动成功');
    });
});
>>>>>>> 827498f (lastly)
