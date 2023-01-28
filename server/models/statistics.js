const {Schema, model} = require('mongoose')

const Statistics = new Schema({
    operationID: {type: Number, unique: true, required: true},
    count: {type: Number, required: true},
    money: {type: Number, required: true},
})

module.exports = model('Statistics', Statistics)