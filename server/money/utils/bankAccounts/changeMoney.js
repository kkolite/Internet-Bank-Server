const User = require('../../../models/user');
const checkMoney = require('./checkMoney');
const findAccount = require('./findAccount');

module.exports = async function(username, money, currency, operation) {
    const result = await findAccount(username,currency);
    if(!result.success) {
        return {
            success: false,
            message: 'Error! Not found account'
        }
    }

    let newMoney;
    if (operation === 'add') {
        newMoney = result.user.money + money;
    }
    if (operation === 'remove') {
        const isEnough = await checkMoney(username, money, currency);
        if (!isEnough.success) {
            return {
                success: false,
                message: 'Error! Not enough money'
            }
        }
    }
    const arr = [...result.user.accounts];
    const newArr = arr.map((el) => {
        if(el.currency === currency) {
            return {
                currency,
                money: newMoney
            }
        }
    });

    await User.updateOne({username}, {
        accounts: newArr,
    })
    return {
        success: true,
        message: 'Success'
    }
}