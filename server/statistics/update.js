import Statistics from '../models/statistics.js';
import create from './create.js';

export default async function(operationID, money) {
    const statistics = await Statistics.findOne({operationID});
    if (!statistics) {
        return await create(operationID, money);
    }

    const newMoney = statistics.money + money;
    const newCount = statistics.count + 1;

    await Statistics.updateOne({operationID}, {
        count: newCount,
        money: newMoney
    })
    return {
        success: true,
        message: 'Success'
    }
}
