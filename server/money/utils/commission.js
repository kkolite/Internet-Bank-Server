const Bank = require('../../models/bank');
const {bankKey} = require('../../config');

module.exports = async function commission(money, percent) {
    const commPayment = money * (percent / 100);
    const bank = await Bank.findOne({bankname: bankKey});
    const newMoney = bank.money + commPayment;
    await Bank.updateOne({bankname: bankKey}, {
        money: newMoney
    })
}

//module.exports = commission();