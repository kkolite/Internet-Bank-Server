import User from '../models/user.js';

export default async function(username, operationID, money) {
    const user = await User.findOne({username});
    const arr = [...user.lastFive];
    if (arr.length === 5) {
        arr.shift();
    }
    arr.push({
        operationID,
        money,
        date: new Date()
    })
    console.log(arr);
    await User.updateOne({username}, {
        lastFive: arr
    })
    return {
        success: true,
        message: 'Success'
    }
}