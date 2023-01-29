import User from '../../models/user.js';
import jwb from 'jsonwebtoken';
import { secret } from '../../config.js';
import update from '../../statistics/update.js';
import updateLastFive from '../../statistics/updateLastFive.js';

const { verify } = jwb;

export default async function(req) {
    const {money} = req.body;
    const {operation} = req.query;

    if(operation !== 'add' && operation !== 'remove' || !money) {
        return {
            message: 'Error! Incorrect query string or money',
            success: false,
        }
    }

    const token = req.headers.authorization.split(' ')[1];
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

    const operationID = operation === 'add' ? 5 : 6;
    await update(operationID, money);
    await updateLastFive(user.username, operationID, money);
    return {
        message: 'Success!',
        success: true,
    }     
}