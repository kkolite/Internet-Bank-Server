import { CURRENCY_COMMISSION, USD } from "../../config.js";
import update from "../../statistics/update.js";
import exchangeRate from "./bankAccounts/exchangeRate.js";
import commission from "./commission.js";

export default async function(req, isClient) {
    const {currencyOne, money} = req.body;
    if (!currencyOne || !money) {
        return {
            success: false,
            message: 'Invalid req body'
        }
    }
    let bankCurrency = money;
    const percent = CURRENCY_COMMISSION;
    if (currencyOne !== USD) {
        const data = await exchangeRate(currencyOne, USD, money);
        bankCurrency = data.new_amount;
    }

    if (isClient) {
        const bankCommission = await commission(bankCurrency, percent);
    }

    const clearMoney = bankCurrency * ((100 - percent) / 100);
    const statistics = await update(1, clearMoney);
    return statistics;
}
