const Statistics = require('../models/statistics');

module.exports = async function(operationID) {
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