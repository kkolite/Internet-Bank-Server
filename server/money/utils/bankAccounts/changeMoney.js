import { OPERATIONS_ACTION } from '../../../config.js';
import User from '../../../models/user.js';
import findAccount from './findAccount.js';

export default async function(username, money, currency, operation) {
    const result = await findAccount(username,currency);
    if(!result.success) {
        return {
            success: false,
            message: 'Error! Not found account'
        }
    }

    let newMoney;
    if (operation === OPERATIONS_ACTION.ADD) {
        newMoney = result.account.money + money;
    }
    if (operation === OPERATIONS_ACTION.REMOVE) {
        const isEnough = result.account.money >= money;
        if (!isEnough) {
            return {
                success: false,
                message: 'Error! Not enough money'
            }
        }
        newMoney = result.account.money - money;
    }
    const arr = [...result.user.accounts];
    const newArr = arr.map((el) => {
        if(el.currency === currency) {
            return {
                currency,
                money: newMoney
            }
        }
        return el;
    });

    await User.updateOne({username}, {
        accounts: newArr,
    })
    return {
        success: true,
        message: 'Success'
    }
}
