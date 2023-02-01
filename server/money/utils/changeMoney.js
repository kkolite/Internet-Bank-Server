import User from '../../models/user.js';
import jwb from 'jsonwebtoken';
import { secret } from '../../config.js';
import update from '../../statistics/update.js';
import updateLastFive from '../../statistics/updateLastFive.js';

const { verify } = jwb;

export default async function(req) {
    const {money, operationID} = req.body;
    const {operation} = req.query;
    const header = req.headers.authorization;
        if (!header) {
            return res.status(403).json({
                message: 'Error! No token. Need to login',
                success: false,
            })
        }

    if(operation !== 'add' && operation !== 'remove' || !money) {
        return {
            message: 'Error! Incorrect query string or money',
            success: false,
        }
    }

    const token = header.split(' ')[1];
    const payload = verify(token, secret);
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
