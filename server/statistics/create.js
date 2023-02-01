import Statistics from '../models/statistics.js';

export default async function(operationID, money) {
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
