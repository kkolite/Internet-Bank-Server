import Statistics from '../models/statistics.js';

export default async function(operationID) {
    const operation = await Statistics.findOne({operationID});
    if (!operation) {
        return {
            success: false,
            message: 'Not found operation',
        }
    }
    return {
        success: true,
        message: 'Success',
        operation
    }
}