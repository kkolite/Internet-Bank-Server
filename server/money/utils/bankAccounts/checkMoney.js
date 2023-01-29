const User = require('../../../models/user');
const findAccount = require('./findAccount');

module.exports = async function(username, money, currency) {
    const result = await findAccount(username, currency)
    return {
        success: result.user.money >= money,
        message: success ? 'Success' : 'Not enough money'
    }
}