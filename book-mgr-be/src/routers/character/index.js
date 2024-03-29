const Router = require('@koa/router');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// const { getBody } = require('../../helpers/utils');

const Character = mongoose.model('Character');

//ctx 为 context 缩写
const router = new Router({
   prefix: '/character',
});

router.get('/list', async (ctx) =>{
    const list = await Character.find().exec();

    ctx.body = {
        data: list,
        code: 1,
        msg: '获取列表成功',
    };
});

module.exports = router;  