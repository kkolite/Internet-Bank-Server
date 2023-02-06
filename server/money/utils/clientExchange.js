import update from "../../statistics/update.js";
import changeMoney from "./bankAccounts/changeMoney.js";
import User from "../../models/user.js";
import exchangeRate from "./bankAccounts/exchangeRate.js";
import jwt from 'jsonwebtoken';
import { OPERATIONS_ACTION, SECRET, USD } from '../../config.js';

const { verify } = jwt;

export default async function(req) {
    const header = req.headers.authorization;
    if (!header) {
        return {
            message: 'Error! No token. Need to login',
            success: false,
        }
    }

    const token = req.headers.authorization.split(' ')[1];
    const payload = verify(token, SECRET);
    const user = await User.findOne({_id: payload.id});
    const username = user.username;

    const {currencyOne, currencyTwo, money} = req.body;
    if (!username || !currencyOne || !currencyTwo || !money) {
        return {
            success: false,
            message: 'Invalid req body'
        }
    }

    const remove = await changeMoney(username, money, currencyOne, OPERATIONS_ACTION.REMOVE);
    if (!remove.success) return remove;

    const data = await exchangeRate(currencyOne, currencyTwo, money);
    const newMoney = data.new_amount;

    const add = await changeMoney(username, newMoney, currencyTwo, OPERATIONS_ACTION.ADD);
    if (!add.success) return add;

    let bankCurrency = money;
    if (currencyOne !== USD) {
        const data = await exchangeRate(currencyOne, USD, money);
        bankCurrency = data.new_amount;
    }
    const stat = await update(2, bankCurrency);
    return stat;
}
