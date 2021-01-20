//接口注册成中间键
const auth = require('./auth/index');
const inviteCode = require('./invite-code/index');
const book = require('./book/index')
module.exports = (app) => {
    app.use(auth.routes());
    app.use(inviteCode.routes());
    app.use(book.routes());
};