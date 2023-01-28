const Statistics = require('../models/statistics');
const create = require('./create');

module.exports = async function(operationID, money) {
    const statistics = await Statistics.findOne({operationID});
    if (!statistics) {
        const result = await create(operationID, money);
        return result;
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