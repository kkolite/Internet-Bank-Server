import mng from 'mongoose';
const { Schema, model } = mng;

const Statistics = new Schema({
    operationID: {type: Number, unique: true, required: true},
    count: {type: Number, required: true},
    money: {type: Number, required: true},
})

export default model('Statistics', Statistics)