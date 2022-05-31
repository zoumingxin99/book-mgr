var jwt = require('jsonwebtoken');
var token = jwt.sign({ 
    account: 'a.cc.com',
    _id: '123',
}, 'secret');

console.log(token);

//解密
jwt.verify(token, 'secret', (err, payload) => {
    console.log(err, payload);
})