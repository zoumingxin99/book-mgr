const Router = require('@koa/router');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const config = require('../../project.config');
// const { getBody } = require('../../helpers/utils');

const ForgetPassword = mongoose.model('ForgetPassword');
const User = mongoose.model('User');


//ctx 为 context 缩写
const router = new Router({
   prefix: '/forget-password',
});

router.get('/list', async (ctx) => {
    let {
        page,
        size
    } = ctx.request.query;

    page = Number(page);
    size = Number(size);

    const list = await ForgetPassword
        .find({
            status: 1,
        })
        .skip((page - 1) * size)
        .limit(size)
        .exec();
    

    const total = await ForgetPassword
        .find({
            status: 1,
        })
        .countDocuments().exec()
        
    ctx.body = {
        code: 1,
        data: {
            list,
            page,
            size,
            total,
        },
        msg: '获取列表成功',
    };
});

router.post('/add', async (ctx) => {
    const {
        account,
    } = ctx.request.body;

    //账户存在 
    const user = await User.findOne({
        account,
    }).exec();

    if (!user) {
        ctx.body = {
            code: 1,
            msg: '申请成功',
        };
        return;
    }

    //在forget-password 中不存在status=1 的文档
    const one = await ForgetPassword.findOne({
        account,
        status: 1,
    }).exec();

    if (one) {
        ctx.body = {
            code: 1,
            msg: '申请成功',
        };
        return;
    }

    const forgetPwd = new ForgetPassword({
        account,
        status: 1,
    });

    await forgetPwd.save();

    ctx.body = {
        code: 1,
        msg: '申请成功',
    };

});

router.post('/update/status', async (ctx) => {
    const {
        id,
        status,
    } = ctx.request.body;

    const one = await ForgetPassword.findOne({
        _id: id,
    });

    if(!one) {
        ctx.body = {
            msg: '找不到',
            code: 0,
        };

        return;
    }

    one.status = status;

    if (status === 2) {
        const user = await User.findOne({
            account: one.account,
        }).exec();

        if (user) {
            user.password = config.DEFAULT_PASSWORD;
            await user.save();
        }
    };

    await one.save();

    ctx.body = {
        msg: '处理成功',
        code: 1,
    };
});


module.exports = router;  