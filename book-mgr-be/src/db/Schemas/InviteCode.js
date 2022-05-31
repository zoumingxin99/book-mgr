const mongoose = require("mongoose");
const { getMeta, preSave } = require('../helpers');

const InviteCodeSchema = new mongoose.Schema({
    //邀请码
    code: String,
    //用来注册哪个用户
    user: String,
    //源信息
    meta: getMeta(),
});

InviteCodeSchema.pre('save', preSave);
mongoose.model('InviteCode', InviteCodeSchema);