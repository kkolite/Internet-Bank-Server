const User = require('../../../models/user');

module.exports = async function(username, currency) {
    const user = await User.findOne({username});
    const arr = [...user.accounts];
    const index = arr.findIndex((el) => el.currency === currency);
    if(index === -1) {
        return {
            success: false,
            message: 'Error! Not found account'
        }
    }
    arr.splice(index, 1)
    await User.updateOne({username}, {
        accounts: arr
    })
    return {
        success: true,
        message: 'Success'
    }
}