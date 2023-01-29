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
    const check = await findAccount(username, currency);
    if (!check.success) {
        return {
            success: false,
            message: 'Not found account',
        }
    }
    if (check.account.money < money) {
        return {
            success: false,
            message: 'Not enough money',
        }
    }

    const data = await exchangeRate(currency, 'USD', money);
    const newMainMoney = user.money + data.new_amount;

    await User.updateOne({username}, {
        money: newMainMoney
    })
    const updateAccount = await changeMoney(username, money, currency, 'remove');
    await updateLastFive(username, 4, newMainMoney);
    await update(4, newMainMoney);
    return updateAccount;
}