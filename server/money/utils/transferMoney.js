import User from '../../models/user.js';
import jwt from 'jsonwebtoken';
import { secret } from '../../config.js';
import update from '../../statistics/update.js';
import updateLastFive from '../../statistics/updateLastFive.js';

const { verify } = jwt;

export default async function(req) {
    const {toUsername, money} = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const payload = verify(token, secret);
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

    await update(8, money);
    await updateLastFive(userOne.username, 8, money);


    return {
        success: true,
        message: 'Success!'
    }
}