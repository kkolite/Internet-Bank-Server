const update = require("../../statistics/update");
const changeMoney = require("./bankAccounts/changeMoney");
const User = require("../../models/user");
const exchangeRate = require("./bankAccounts/exchangeRate");
const jwt = require('jsonwebtoken');
const {secret} = require('../../config');

module.exports = async function(req) {
    const header = req.headers.authorization;
    if (!header) {
        return {
            message: 'Error! No token. Need to login',
            success: false,
        }
    }

    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, secret);
    const user = await User.findOne({_id: payload.id});
    const username = user.username;

    const {currencyOne, currencyTwo, money} = req.body;
    if (!username || !currencyOne || !currencyTwo || !money) {
        return {
            success: false,
            message: 'Invalid req body'
        }
    }

    const remove = await changeMoney(username, money, currencyOne, 'remove');
    if (!remove) return remove;

    const data = await exchangeRate(currencyOne, currencyTwo, money);
    const newMoney = data.new_amount;

    const add = await changeMoney(username, newMoney, currencyTwo, 'add');
    if (!add) return add;

    let bankCurrency = money;
    if (currencyOne !== 'USD') {
        const data = await exchangeRate(currencyOne, 'USD', money);
        bankCurrency = data.new_amount;
    }
    const stat = await update(2, bankCurrency);
    return stat;
}