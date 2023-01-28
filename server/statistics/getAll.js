const Statistics = require('../models/statistics');

module.exports = async function(){
    const result = await Statistics.find();
    return {
        success: result ? true : false,
        message: result ? 'Success' : 'Error! Empty/broken statistics',
        result
    }
}