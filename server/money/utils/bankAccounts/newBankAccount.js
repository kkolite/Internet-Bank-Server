const User = require('../../../models/user');

module.exports = async function(username, currency) {
    const user = await User.findOne({username});
    const arr = [...user.accounts];
    const isUniq = arr.find((el) => el.currency === currency);
    if (isUniq) {
        return {
            success: false,
            message: `You already have ${currency} account`
        }
    }

    arr.push({
        currency,
        money: 0
    })

    user.accounts = arr;
    await User.updateOne({username}, {
        accounts: arr
    })
    return {
        success: true,
        message: 'Success'
    }
}