import { currencyCommission } from "../../config.js";
import update from "../../statistics/update.js";
import exchangeRate from "./bankAccounts/exchangeRate.js";
import commission from "./commission.js";

export default async function(req) {
    const {currencyOne, money} = req.body;
    if (!currencyOne || !money) {
        return {
            success: false,
            message: 'Invalid req body'
        }
    }
    let bankCurrency = money;
    const percent = currencyCommission;
    if (currencyOne !== 'USD') {
        const data = await exchangeRate(currencyOne, 'USD', money);
        bankCurrency = data.new_amount;
    }
    const com = await commission(bankCurrency, percent);
    const clearMoney = bankCurrency * ((100 - percent) / 100);
    const stat = await update(1, clearMoney);
    return stat;
}