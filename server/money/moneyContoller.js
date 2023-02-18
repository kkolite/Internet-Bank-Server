import commission from './utils/commission.js';
import { COMMISSION, OPERATIONS_ACTION } from '../config.js';
import update from '../statistics/update.js';
import changeMoney from './utils/changeMoney.js';
import transferMoney from './utils/transferMoney.js';
import anonimExchange from './utils/anonimExchange.js';
import clientExchange from './utils/clientExchange.js';
import createAccount from './utils/bankAccounts/createAccount.js';
import deleteAccount from './utils/bankAccounts/deleteAccount.js';
import addMoney from './utils/bankAccounts/addMoney.js';
import removeMoney from './utils/bankAccounts/removeMoney.js';
import sendEmail from '../user/utils/sendEmail.js';
import operations from '../data/operations.js';

class moneyController {
    async change(req, res) {
        try {
            const result = await changeMoney(req);
            return res
            .status(result.success ? 200 : 400)
            .json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            })
        }
    }

    async transfer(req, res) {
        try {
            const result = await transferMoney(req);

            return res
            .status(result.success ? 200 : 400)
            .json(result)
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            })
        }
    }

    async commissionToBank(req, res) {
        try {
            const {money, operationID} = req.body;
            if(!money) {
                return res.status(400).json({
                    message: 'Error! Invalid body',
                    success: false,
                })
            }
            await commission(money, COMMISSION);
            const moneyPay = money * ((100 - 2)/100);

            await update(operationID, money);

            return res
            .status(200)
            .json({
                success: true,
                message: 'Success',
                moneyPay,
                commission: COMMISSION
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            })
        }
    }

    async currencyExchange(req,res) {
        try {
            const {client} = req.query;
            const header = req.headers.authorization;

            let exchange;
            if (!client) {
                exchange = await anonimExchange(req, false);
            }
            else if (client && !header) {
                exchange = await anonimExchange(req, true);
            } else {
                exchange = await clientExchange(req);
            }
            
            return res
            .status(exchange.success ? 200 : 400)
            .json(exchange);
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            })
        }
    }

    async newCurrencyAccount(req,res) {
        try {
            const create = await createAccount(req);
            return res
            .status(create.success ? 201 : 400)
            .json(create);
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            })
        }
    }

    async deleteCurrencyAccount(req,res) {
        try {
            const result = await deleteAccount(req);
            return res
            .status(result.success ? 201 : 400)
            .json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            })
        }
    }

    async changeAccountMoney(req,res) {
        try {
            const {operation} = req.query;
            if (!operation) {
                return res
                .status(400)
                .json({
                    success: false,
                    message: 'Invalid query'
                })
            }
            let result;
            if (operation === OPERATIONS_ACTION.ADD) {
                result = await addMoney(req);
            }
            if (operation === OPERATIONS_ACTION.REMOVE) {
                result = await removeMoney(req);
            }
            return res
            .status(result.success ? 201 : 400)
            .json(result);
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            })
        }
    }

    async card(req,res) {
        try {
            const {card} = req.body;
            const random = Math.random() * 10;
            return res
            .status(random > 2 ? 200 : 402)
            .json({
                success: random > 2,
                message: random > 2 ? 'Success' : 'Error! Card system error'
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            })
        }
    }

    async check(req, res) {
        try {
            const {email, operationID, money} = req.body;
            const text = `Operation: ${operationID} (${operations[operationID].name})
            Category: ${operations[operationID].category.en}
            Money: ${money} 
            Date: ${new Date().toUTCString}
            
            Your RS Bank`;
            const send = await sendEmail(email, text, 'Check');
            return res
            .status(send.success ? 200 : 400)
            .json(send);    
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            })
        }
    }
}

export default new moneyController();
