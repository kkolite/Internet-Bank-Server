const Statistics = require('../models/statistics');

module.exports = async function(operationID, money) {
    const statistics = new Statistics({
        operationID,
        count: 1,
        money
    });
    await statistics.save();
    return {
        success: true,
        message: 'Success'
    }
}