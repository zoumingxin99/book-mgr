const mongoose = require("mongoose");
const { getMate } = require('../helpers');

const InviteCodeSchema = new mongoose.Schema({
    //邀请码
    code: String,
    //用来注册哪个用户
    user: String,
    //源信息
    meta: getMate(),
});

mongoose.model('InviteCode', InviteCodeSchema);