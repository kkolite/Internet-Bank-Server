const config = require("../../config");
const update = require("../../statistics/update");
const exchangeRate = require("./bankAccounts/exchangeRate");
const commission = require("./commission");

module.exports = async function(req) {
    const {currencyOne, money} = req.body;
    if (!currencyOne || !money) {
        return {
            success: false,
            message: 'Invalid req body'
        }
    }
    let bankCurrency = money;
    const percent = config.currencyCommission;
    if (currencyOne !== 'USD') {
        const data = await exchangeRate(currencyOne, 'USD', money);
        bankCurrency = data.new_amount;
    }
    const com = await commission(bankCurrency, percent);
    const clearMoney = bankCurrency * ((100 - percent) / 100);
    const stat = await update(1, clearMoney);
    return stat;
}