const User = require('../../../models/user');

module.exports = async function(username, currency) {
    const user = await User.findOne({username});
    const arr = [...user.accounts];
    const account = arr.find((el) => el.currency === currency);
    const success = account ? true : false;
    return {
        success,
        message: success ? 'Success' : 'Error! Not found account',
        user
    }
}