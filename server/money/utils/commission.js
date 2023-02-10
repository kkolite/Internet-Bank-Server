import Bank from '../../models/bank.js';
import { bankKey } from '../../config.js';
import update from '../../statistics/update.js';

export default async function commission(money, percent) {
    const commPayment = money * (percent / 100);
    const bank = await Bank.findOne({name: bankKey});
    const newMoney = bank.money + commPayment;
    await Bank.updateOne({name: bankKey}, {
        money: newMoney
    })
}
