const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const {secret} = require('../../config');
const update = require('../../statistics/update');
const updateLastFive = require('../../statistics/updateLastFive');

module.exports = async function(req) {
    const {toUsername, money, operationID} = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, secret);
    const userOne = await User.findOne({_id: payload.id});

    if(money > userOne.money) {
        return {
            message: 'No enough money!',
            success: false,
        }
    }

    const userTwo = await User.findOne({username: toUsername});
    if (!userTwo) {
        return {
            success: false,
            message: 'User not found!'
        }
    }

    const moneyOne = userOne.money - money;
    const moneyTwo = userTwo.money + money;

    await User.updateOne({_id: payload.id}, {
        money: moneyOne
    });
    await User.updateOne({username: toUsername}, {
        money: moneyTwo
    });

    await update(operationID, money);
    await updateLastFive(userOne.username, operationID, money);


    return {
        success: true,
        message: 'Success!'
    }
}