const User = require('../models/user');
const Bank = require('../models/bank');
const config = require('../config');
const adminCheck = require('./adminCheck');

class adminController{
    async check(req,res) {
        try {
            const result = await adminCheck(req);
            const status = result.success ? 200 : 400;
            return res
            .status(status)
            .json(result)
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            });
        }
        
    }

    async getBank(req,res) {
        try {
            const result = await adminCheck(req);
            if (!result.success) {
                return res
                .status(400)
                .json(result)
            }
            const bankname = req.query.bankname || config.bankKey;
            const bank = await Bank.findOne({bankname});
            return res
            .status(200)
            .json({
                success: true,
                message: "Success",
                bank
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            });
        }
    }

    async getDatabase(req,res) {
        try {
            const result = await adminCheck(req);
            if (!result.success) {
                return res
                .status(400)
                .json(result)
            }
            const database = await User.find();
            return res
            .status(200)
            .json({
                success: true,
                message: "Success",
                database
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            });
        }
    }

    async getUser(req,res) {
        try {
            const result = await adminCheck(req);
            if (!result.success) {
                return res
                .status(400)
                .json(result)
            }
            const {username} = req.query.bankname;
            if (!username) {
                return res
                .status(400)
                .json({
                    success: false,
                    message: 'No username in header',
                })
            }

            const user = await User.findOne(username);
            if(!user) {
                return res
                .status(400)
                .json({
                    success: false,
                    message: `Not found user '${username}' in base`,
                })
            }
            return res
            .status(200)
            .json({
                success: true,
                message: 'Success',
                user
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            });
        }
    }
}

module.exports = new adminController();