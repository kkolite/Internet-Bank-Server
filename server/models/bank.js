import mng from 'mongoose';
const { Schema, model } = mng;

const Bank = new Schema({
    bankname: {type: String, unique: true, required: true},
    money: {type: Number, default: 0}
})

export default model('Bank', Bank);