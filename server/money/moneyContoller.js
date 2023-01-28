const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const commission = require('./commission');
const config = require('../config');
const update = require('../statistics/update');

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

            const {money, operationID} = req.body;
            const {operation} = req.query;
            console.log(money, operation, operationID);
            if(operation !== 'add' && operation !== 'remove' || !money) {
                return res.status(400).json({
                    message: 'Error! Incorrect query string or money',
                    success: false,
                })
            }

            const token = req.headers.authorization.split(' ')[1];
            const payload = jwt.verify(token, secret);
            const user = await User.findOne({_id: payload.id});

            let newMoney = 0;

            if(operation === 'add') {
                newMoney = user.money + money;
            }
            if(operation === 'remove') {
                if(money > user.money) {
                    return res.status(400).json({
                        message: 'No enough money!',
                        success: false,
                    })
                }

                newMoney = user.money - money;
            }

            await User.updateOne({_id: payload.id}, {
                money: newMoney
            });
            await update(operationID, money);

            return res
            .status(200)
            .json({
                message: 'Success!',
                success: true,
            });
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

            const {toUsername, money, operationID} = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const payload = jwt.verify(token, secret);
            const userOne = await User.findOne({_id: payload.id});

            if(money > userOne.money) {
                return res.status(400).json({
                    message: 'No enough money!',
                    success: false,
                })
            }

            const userTwo = await User.findOne({username: toUsername});
            if (!userTwo) {
                return res
                .status(404)
                .json({
                    success: false,
                    message: 'User not found!'
                })
            }

            const moneyOne = userOne.money - money;
            const moneyTwo = userTwo.money + money;

            await User.updateOne({_id: payload.id}, {
                money: moneyOne
            });
            await User.updateOne({username: toUsername}, {
                money: moneyTwo
            });

            await update(operationID, money);

            return res
            .status(200)
            .json({
                success: true,
                message: 'Success!'
            })
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