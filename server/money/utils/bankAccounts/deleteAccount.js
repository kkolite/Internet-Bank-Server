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
