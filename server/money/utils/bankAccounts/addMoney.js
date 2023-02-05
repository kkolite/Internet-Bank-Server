import { OPERATIONS_ACTION, OPERATION_IDS, USD } from "../../../config.js";
import User from "../../../models/user.js";
import update from "../../../statistics/update.js";
import updateLastFive from "../../../statistics/updateLastFive.js";
import changeMoney from "./changeMoney.js";
import exchangeRate from "./exchangeRate.js";
import findAccount from "./findAccount.js";

export default async function(req) {
    const {username, currency, money} = req.body;
    if (!username || !currency || !money) {
        return {
            success: false,
            message: 'Invalid req body',
        }
    }
    const user = await User.findOne({username});
    if (user.money < money) {
        return {
            success: false,
            message: 'Not enough money',
        }
    }

    const check = await findAccount(username, currency);
    if (!check.success) {
        return {
            success: false,
            message: 'Not found account',
        }
    }

    const newMainMoney = user.money - money;

    const data = await exchangeRate(USD, currency, money);
    const newMoney = data.new_amount;

    await User.updateOne({username}, {
        money: newMainMoney
    })
    const updateAccount = await changeMoney(username, newMoney, currency, OPERATIONS_ACTION.ADD);
    await updateLastFive(username, OPERATION_IDS.ADD_MONEY, money);
    await update(OPERATION_IDS.ADD_MONEY, money);
    return updateAccount;
}
