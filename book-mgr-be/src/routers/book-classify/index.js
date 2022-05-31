const Router = require('@koa/router');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// const { getBody } = require('../../helpers/utils');

const BookClassify = mongoose.model('BookClassify');

//ctx 为 context 缩写
const router = new Router({
   prefix: '/book-classify',
});

router.get('/list', async (ctx) => {
    const list = await BookClassify
        .find()
        .sort({
            _id: -1,
        })
        .exec();

    ctx.body = {
        data: list,
        code: 1,
        msg: '获取成功',
    };
});

router.post('/add', async (ctx) => {
    const {
        title,
    } = ctx.request.body;

    const one = await BookClassify.findOne({
        title,
    }).exec();

    if (one) {
        ctx.body ={
            code: 0,
            msg:'书籍分类已经存在',
        };
        return;
    }

    const bookClassify = new BookClassify({
        title,
    });

    const saved = await bookClassify.save();

    ctx.body = {
        data: saved,
        code: 1,
        msg:'创建成功',
    };
});

router.delete('/:id', async (ctx) => {
    const {
        id,
    } = ctx.params;

    const res = await BookClassify.deleteOne({
        _id: id,
    });

    ctx.body ={
        code: 1,
        data: res,
        msg:'删除成功',
    };
    
});

router.post('/update/title', async (ctx) => {
    const {
        id,
        title,
    } = ctx.request.body;

    const one = await BookClassify.findOne({
        _id: id,
    });

    if(!one){
        ctx.body = {
            code: 0,
            msg: '资源不存在',
        };
        return;
    }

    one.title = title;

    const res = await one.save();

    ctx.body ={
        code: 1,
        data: res,
        msg:'修改成功',
    };

});
module.exports = router;  