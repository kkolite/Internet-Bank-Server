import User from '../../models/user.js';

export default async function(username, code) {
    const user = await User.findOne({username});
    if(!user) {
        return {
            success: false,
            message: 'User not found during check secure code'
        }
    }

    if(user.verifyCode == code || user.pinCode == code) {
        return {
            success: true,
            message: 'Success'
        }
    }

    return {
        success: false,
        message: 'Invalid code'
    }
}
