import mng from 'mongoose';
const { Schema, model } = mng;

const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    isBlock: {type: Boolean, default: false},
    verifyCode: {type: Number, default: 0},
    pinCode: {type: Number},
    money: {type: Number, default: 100},
    lastFive: [{operationID: Number, date: Date, money: Number}],
    accounts: [{currency: String, money: Number}],
    cards: [String]
})

export default model('User', User);
