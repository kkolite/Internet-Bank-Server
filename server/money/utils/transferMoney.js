import User from '../../models/user.js';
import update from '../../statistics/update.js';
import updateLastFive from '../../statistics/updateLastFive.js';

export default async function(req) {
    const {toUsername, money} = req.body;
    const {user} = req;
    const userOne = await User.findOne({username: user.username});

    if(money > userOne.money) {
        return {
            message: 'No enough money!',
            success: false,
        }
    }

    const userTwo = await User.findOne({username: toUsername});
    if (!userTwo) {
        return {
            success: false,
            message: 'User not found!'
        }
    }

    const moneyOne = userOne.money - money;
    const moneyTwo = userTwo.money + money;

    await User.updateOne({username: user.username}, {
        money: moneyOne
    });
    await User.updateOne({username: toUsername}, {
        money: moneyTwo
    });

    await update(8, money);
    await updateLastFive(userOne.username, 8, money);


    return {
        success: true,
        message: 'Success!'
    }
}
