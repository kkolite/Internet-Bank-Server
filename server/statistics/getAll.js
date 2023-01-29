import Statistics from '../models/statistics.js';

export default async function(){
    const result = await Statistics.find();
    return {
        success: result ? true : false,
        message: result ? 'Success' : 'Error! Empty/broken statistics',
        result
    }
}