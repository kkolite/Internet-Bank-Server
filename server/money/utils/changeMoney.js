import User from '../../models/user.js';
import { OPERATIONS_ACTION } from '../../config.js';
import update from '../../statistics/update.js';
import updateLastFive from '../../statistics/updateLastFive.js';


export default async function(req) {
    const {money, operationID} = req.body;
    const {operation} = req.query;

    if(operation !== OPERATIONS_ACTION.ADD && operation !== OPERATIONS_ACTION.ADD || !money) {
        return {
            message: 'Error! Incorrect query string or money',
            success: false,
        }
    }

    const user = await User.findOne({username: req.user.username});

    let newMoney = 0;

    if(operation === OPERATIONS_ACTION.ADD) {
        newMoney = user.money + money;
    }
    if(operation === OPERATIONS_ACTION.REMOVE) {
        if(money > user.money) {
            return {
                message: 'No enough money!',
                success: false,
            }
        }

        newMoney = user.money - money;
    }

    await User.updateOne({username: req.user.username}, {
        money: newMoney
    });

    await update(operationID, money);
    await updateLastFive(user.username, operationID, money);
    return {
        message: 'Success!',
        success: true,
    }     
}
