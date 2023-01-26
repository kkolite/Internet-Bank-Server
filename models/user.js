const {Schema, model} = require('mongoose')

const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    isAdmin: [{type: Boolean, default: false}],
    isBlock: [{type: Boolean, default: false}],
    money: {type: Number, default: 100}
})

module.exports = model('User', User)