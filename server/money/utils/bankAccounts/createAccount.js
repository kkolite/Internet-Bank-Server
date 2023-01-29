import User from '../../../models/user.js';
import userCheck from '../../../user/utils/userCheck.js';

export default async function(req) {
    const check = await userCheck(req);
    if (!check.success) return check;

    const {username, currency} = req.body;
    if(!username || !currency) {
        return {
            success: false,
            message: `Invalid req body`
        }
    }
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