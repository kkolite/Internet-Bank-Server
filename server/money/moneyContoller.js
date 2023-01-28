const commission = require('./utils/commission');
const config = require('../config');
const update = require('../statistics/update');
const changeMoney = require('./utils/changeMoney');
const transferMoney = require('./utils/transferMoney');

class moneyController {
    async change(req, res) {
        try {
            const header = req.headers.authorization;
            if (!header) {
                return res.status(403).json({
                    message: 'Error! No token. Need to login',
                    success: false,
                })
            }

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
            const header = req.headers.authorization;
            if (!header) {
                return res.status(403).json({
                    message: 'Error! No token. Need to login',
                    success: false,
                })
            }

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
            await commission(money, config.commission);
            const moneyPay = money * ((100 - 2)/100);

            await update(operationID, money);

            return res
            .status(200)
            .json({
                success: true,
                message: 'Success',
                moneyPay,
                commission: config.commission
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            })
        }
    }
}

module.exports = new moneyController();