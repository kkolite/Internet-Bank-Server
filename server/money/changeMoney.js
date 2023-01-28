const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const update = require('../statistics/update');
const updateLastFive = require('../statistics/updateLastFive');

module.exports = async function(req) {
    const {money, operationID} = req.body;
    const {operation} = req.query;

    if(operation !== 'add' && operation !== 'remove' || !money) {
        return {
            message: 'Error! Incorrect query string or money',
            success: false,
        }
    }

    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, secret);
    const user = await User.findOne({_id: payload.id});

    let newMoney = 0;

    if(operation === 'add') {
        newMoney = user.money + money;
    }
    if(operation === 'remove') {
        if(money > user.money) {
            return {
                message: 'No enough money!',
                success: false,
            }
        }

        newMoney = user.money - money;
    }

    await User.updateOne({_id: payload.id}, {
        money: newMoney
    });

    await update(operationID, money);
    await updateLastFive(user.username, operationID, money);
    return {
        message: 'Success!',
        success: true,
    }     
}