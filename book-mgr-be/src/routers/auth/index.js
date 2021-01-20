const Router = require('@koa/router');
const mongoose = require('mongoose');
const { getBody } = require('../../helpers/utils');
const jwt = require('jsonwebtoken');

const User = mongoose.model('User');
const InviteCode = mongoose.model('InviteCode');

//ctx 为 context 缩写
const router = new Router({
   prefix: '/auth',
});
router.post('/register', async (ctx) => {
    const {
        account,
        password,
        inviteCode,
    } = getBody(ctx);


    //服务端表单校验
    if(account === '' || password === '' || inviteCode === ''){
        ctx.body = {
            code: 0,
            msg: '字段不能为空',
            data: null,
        };
        return;
    }

    //去找有无邀请码
    const findCode = await InviteCode.findOne ({
        code: inviteCode,
    }).exec();
    //没找到或者已经用过
    if((!findCode) || findCode.user){
        ctx.body = {
            code: 0,
            msg: '邀请码不正确',
            data: null,
        };
        return;
    }

    //去找account为 传递上来的 "account" 的用户
    const findUser = await User.findOne ({
        account,
    }).exec();

    //判断有无用户
    if (findUser) {
        ctx.body = {
            code: 0,
            msg: '已存在该用户',
            data: null,
        };
        return;
    }

    //创建一个用户
    const user = new User({
        account,
        password,

    });

    //把创建的用户同步到mongodb
    const res = await user.save();
    
    findCode.user = res._id;
    findCode.meta.updatedAt = new Date().getTime();

    await findCode.save();

    //响应成功
    ctx.body = {
        code: 1,
        msg: '注册成功',
        data: res,
    };
});


router.post('/login', async (ctx) => {
    const {
        account,
        password,
    } = getBody(ctx);

    const one = await User.findOne({
        account,
    }).exec();

    //console.log(account, password);
    //console.log(one.account, one.password);
    if(account === '' || password === ''){
        ctx.body = {
            code: 0,
            msg: '字段不能为空',
            data: null,
        };
        return;
    }

    
    //情况1
    if (!one) {
        ctx.body = {
            code: 0,
            msg: '用户名或密码错误',
            data: null,
        };

        return;
    };

    //情况2
    const user ={
        account: one.account,
        _id: one._id,
    };
    // sign中不能处理被mongoose扩展的one对象，需自己构建
    //构建后不向前端返回one,避免PW出现需提出来
    if(one.password === password) {
        ctx.body = {
            code: 1,
            msg: '登入成功',
            data: {
                user,
                token: jwt.sign(user,'book-mgr'),
            },
        };

        return;
    }

    //情况3
    ctx.body = {
        code: 0,
        msg: '用户名或密码错误',
        data: null,
    };

});

module.exports = router;  