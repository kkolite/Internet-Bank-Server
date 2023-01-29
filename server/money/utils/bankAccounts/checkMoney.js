import findAccount from './findAccount.js';

export default async function(username, money, currency) {
    const result = await findAccount(username, currency)
    return {
        success: result.user.money >= money,
        message: result.user.money >= money ? 'Success' : 'Not enough money'
    }
}