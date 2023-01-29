import Bank from '../../models/bank.js';
import { bankKey } from '../../config.js';
import update from '../../statistics/update.js';

export default async function commission(money, percent) {
    const commPayment = money * (percent / 100);
    const bank = await Bank.findOne({bankname: bankKey});
    const newMoney = bank.money + commPayment;
    await Bank.updateOne({bankname: bankKey}, {
        money: newMoney
    })
    await update(7, money);
}

//module.exports = commission();