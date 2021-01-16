require('./Schemas/User');

const mongoose = require('mongoose');

//给哪个数据库:book-mgr
// 哪个集合
// 添加什么格式的文档

//schema 映射了MongoDB下的一个集合 并且内容就是集合下文档的构成
//modal  可以理解为是根据Schema生成的方法，这套方法用来操作mongoDB集合和集合下的文档
const connect = () => {
    return new Promise((resolve) => {
        // 连接DB数据库
        mongoose.connect('mongodb://127.0.0.1:27017/book-mgr');
    
        //当数据库打开时 做的一些事
        mongoose.connection.on('open', () => {
            console.log('连接数据库成功');
            
            resolve();
        }); 
    });
};

module.exports = {
    connect,
};