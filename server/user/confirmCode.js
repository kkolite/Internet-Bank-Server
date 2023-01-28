const User = require('../models/user');

module.exports = async function(username, code) {
    const user = await User.findOne({username});
    if(!user) {
        return {
            success: false,
            message: 'User not found during check secure code'
        }
    }

    if(user.verifyCode !== code) {
        return {
            success: false,
            message: 'Invalid code'
        }
    }

    return {
        success: true,
        message: 'Success'
    }
}