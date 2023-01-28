const User = require('../models/user');
const Bank = require('../models/bank');
const config = require('../config');
const adminCheck = require('./utils/adminCheck');
const createNew = require('../user/utils/createUser');
const clearDatabase = require('./utils/clearDatabase');
const getAll = require('../statistics/getAll');
const getOne = require('../statistics/getOne');

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
            const safeDatabase = clearDatabase(database);
            return res
            .status(200)
            .json({
                success: true,
                message: "Success",
                safeDatabase
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
                userConfig: {
                    username: user.username,
                    email: user.email,
                    isBlock: user.isBlock,
                    isAdmin: user.isAdmin,
                    lastFive: user.lastFive,
                }
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            });
        }
    }

    async createUser(req,res) {
        try {
            const result = await adminCheck(req);
            if (!result.success) {
                return res
                .status(400)
                .json(result)
            }

            const answer = await createNew(req);
            return res
            .status(answer.success ? 200 : 400)
            .json(answer);
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            });
        }
    }

    async deleteUser(req,res) {
        try {
            const result = await adminCheck(req);
            if (!result.success) {
                return res
                .status(400)
                .json(result)
            }

            const {username} = req.body;
            if (!username) {
                return res
                .status(400)
                .json({
                    success: false,
                    message: 'No username in body',
                })
            }

            const user = await User.findOne({username});
            if (!user) {
                return res
                .status(404)
                .json({
                    success: false,
                    message: `Not found user '${username}' in base`,
                })
            }

            await User.deleteOne({username});
            return res
            .status(200)
            .json({
                success: true,
                message: 'Success'
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            });
        }
    }

    async blockUser(req,res) {
        try {
            const result = await adminCheck(req);
            if (!result.success) {
                return res
                .status(400)
                .json(result)
            }

            const { username, isBlock } = req.body;
            if (!isBlock) {
                return res.status(400).json({
                    message: 'Error! Incorrect req body',
                    success: false,
                })
            }

            const user = await findOne({username});
            if(!user) {
                return res
                .status(404)
                .json({
                    success: false,
                    message: `Not found user '${username}' in base`,
                })
            }

            await User.updateOne({username}, {
                isBlock
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
            });
        }
    }

    async getStatistics(req,res) {
        try {
            const check = await adminCheck(req);
            if (!check.success) {
                    return res
                    .status(400)
                    .json(check)
                }

            const {operationID} = req.query;
            const result = operationID ? await getOne(operationID) : await getAll();
            return res
            .status(result.success ? 200 : 404)
            .json(result);
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