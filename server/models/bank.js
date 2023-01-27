const {Schema, model} = require('mongoose')

const Bank = new Schema({
    bankname: {type: String, unique: true, required: true},
    money: {type: Number, default: 0}
})

module.exports = model('Bank', Bank);