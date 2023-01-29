import User from '../../../models/user.js';

export default async function(username, currency) {
    const user = await User.findOne({username});
    const arr = [...user.accounts];
    const account = arr.find((el) => el.currency === currency);
    const success = account ? true : false;
    return {
        success,
        message: success ? 'Success' : 'Error! Not found account',
        user,
        account
    }
}