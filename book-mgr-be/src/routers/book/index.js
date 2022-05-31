const Router = require('@koa/router');
const mongoose = require('mongoose');
const config = require('../../project.config');
const { getBody } = require('../../helpers/utils');
const { loadExcel, getFirstSheet } = require('../../helpers/excel');

const Book_CONST = {
    IN: 'IN_COUNT',
    OUT: 'OUT_COUNT',
};

const Book = mongoose.model('Book');
const InventoryLog = mongoose.model('InventoryLog');
const BookClassify = mongoose.model('BookClassify');

const findBookOne = async (id) => {
    const one = await Book.findOne({
        _id: id,
    }).exec();

    return one;
};
//ctx 为 context 缩写
const router = new Router({
   prefix: '/book',
});

router.post('/add', async (ctx) =>{
    const {
        name,
        price,
        author,
        publishDate,
        classify,
        count,
    } = getBody(ctx);

    const book = new Book({
        name,
        price,
        author,
        publishDate,
        classify,
        count,
    })

    const res = await book.save();
    
    ctx.body = {
        data: res,
        code: 1,
        msg: '添加成功',
    };
});

router.get('/list', async (ctx) => {
    //hhtps://aa.cc.com/user?page=2&size=10&keyword=书名
    const {
        page = 1,
        keyword = '',
    } = ctx.query;
    let = {
        size = 10,
    } = ctx.query;

    size = Number(size);

    // 防止带值keyword为空
    const query = {};
    if(keyword) {
        query.name = keyword;
    }

    const list = await Book
        .find(query)
        .sort({
            _id: -1,
        })
        .skip((page - 1) * size)   //查看第n页,跳过多少条
        .limit(size)
        .exec();
    
    const total = await Book.countDocuments();  //返回总数
    
    ctx.body = {
        data: {
            list,
            total,
            page,
            size,
        },
        code: 1,
        msg: '获取列表成功',
    };

});

router.delete('/:id', async (ctx) => {
    const {
        id,
    } = ctx.params;

    const delMsg = await Book.deleteOne({
        _id: id,
    });

    ctx.body = {
        code: 1,
        msg: '删除成功',
        data: delMsg,
    };
});

router.post('/update/count', async (ctx) => {
    const {
        id,
        type,
    } = ctx.request.body;  //常量

    let {
        num,
    } = ctx.request.body;  //变量
    num = Number(num);

    const book = await findBookOne(id);
    //没找到
    if(!book){
        ctx.body = {
            code: 0,
            msg: '没有找到书',
        };

        return;
    }
    //找到
    if(type === Book_CONST.IN) {
        //入库
        num = Math.abs(num);
    }else {
        //出库
        num = -(Math.abs(num));
    }

    book.count = book.count + num;

    if (book.count < 0){
        ctx.body = {
            code: 0,
            msg: '剩下的量不足以出库',
        };
        return;
    }

    const res = await book.save();

    const log = new InventoryLog({
        num: Math.abs(num),
        type,
    });

    log.save();
    
    ctx.body = {
        code: 1,
        msg: '操作成功',
        data: res,
    };
});

router.post('/update', async (ctx) => {
    const {
        id,
        ...others
        // name,
        // price,
        // author,
        // publishDate,
        // classify,
    } = ctx.request.body;

    const one = await findBookOne(id);
    //没找到书
    if(!one)  {
        ctx.body = {
            msg: '没找到书籍',
            code: 0,
        }
        return;
    }
    //找到书
    const newQuery = {};
    Object.entries(others).forEach(([key, value]) => {
        if(value) {
            newQuery[key] = value;
        }
    });

    Object.assign(one, newQuery);

    const res = await one.save();

    ctx.body = {
        code: 1,
        data: res,
        msg: '保存成功',
    }

});

router.get('/detail/:id', async (ctx) => {
    const {
        id,
    } = ctx.params;

    const one = await findBookOne(id);
    //没找到书
    if(!one)  {
        ctx.body = {
            msg: '没找到书籍',
            code: 0,
        }
        return;
    }

    ctx.body = {
        msg: '查询成功',
        data: one,
        code: 1,
    }

});

router.post('/addMany', async (ctx) => {
    const {
      key = '',
    } = ctx.request.body;
  
    const path = `${config.UPLOAD_DIR}/${key}`;
  
    const excel = loadExcel(path);
  
    const sheet = getFirstSheet(excel);
  
    const arr = [];
    for (let i = 0; i < sheet.length; i++) {
      let record = sheet[i];
  
      const [
          name,
          price,
          author,
          publishDate,
          classify,
          count,
      ] = record;
      
      let classifyId = classify;

      const one = await BookClassify.findOne({
        title: classify,
      });

      if (one) {
          classifyId = one._id;
      }

      arr.push({
          name,
          price,
          author,
          publishDate,
          classify: classifyId,
          count,
      });
    }
  
    await Book.insertMany(arr);
  
    ctx.body = {
      code: 1,
      msg: '添加成功',
      data: {
          addCount: arr.length,
      },
    };
});

module.exports = router;  