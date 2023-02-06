import mng from 'mongoose';
const { Schema, model } = mng;

const Stock = new Schema({
    name: {type: String, unique: true, required: true},
    money: {type: Number, default: 10},
    number: {type: Number},
})

export default model('Stock', Stock);