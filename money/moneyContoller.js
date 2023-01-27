const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');

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
                newMoney = user.money + money
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
}

module.exports = new moneyController();