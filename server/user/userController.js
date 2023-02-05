// Регистрация - тело с ником, почтой и паролем
// Логин - тело с ником и паролем
// Получение данных - токен в хедере
// Обновление данных - логин (+токен в хедере)
// Удаление - логин, пароль (+токен в хедере)

import User from '../models/user.js';
import pkg from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { secret } from '../config.js';
import createUser from './utils/createUser.js';
import createCode from './utils/createCode.js';
import confirmCode from './utils/confirmCode.js';
import resetPassword from './utils/resetPassword.js';
import operations from '../data/operations.js';

const { sign, verify: _verify } = jwt;
const { compareSync, hashSync } = pkg;

class userController {
    async newUser(req, res) {
        try {
            const result = await createUser(req);
            return res
            .status(result.success ? 200 : 400)
            .json(result);

        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            });
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            console.log(req.body);

            const user = await User.findOne({username})
            if (!user) {
                return res
                .status(404)
                .json({
                    message: `${username} not found`,
                    success: false,
                });
            }

            const isPasswordValid = compareSync(password, user.password)
            if (!isPasswordValid) {
                return res
                .status(400)
                .json({
                    message: 'Invalid password',
                    success: false,
                });
            }

            const result = await createCode(user.username)
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

    async verify(req,res) {
        try {
            const {username, code} = req.body;
            if (!username || !code) {
                return res
                .status(400)
                .json({
                    success: false,
                    message: 'Invalid req body'
                })
            }

            const user = await User.findOne({username})
            if (!user) {
                return res
                .status(404)
                .json({
                    message: `${username} not found`,
                    success: false,
                });
            }

            const result = await confirmCode(username, code);
            if (!result.success) {
                return res
                .status(400)
                .json(result)
            }

            const token = sign({id: user._id}, secret);
            return res
            .status(200)
            .json({
                message: 'Success!',
                success: true,
                token,
                userConfig: {
                    username: user.username,
                    money: user.money,
                    isAdmin: user.isAdmin,
                    isBlock: user.isBlock
                }
            })
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            })
        }
    }

    async getInfo(req, res) {
        try {
            /*const header = req.headers.authorization;
            if (!header) {
                return res.status(403).json({
                    message: 'Error! No token. Need to login',
                    success: false,
                })
            }

            /*const token = req.headers.authorization.split(' ')[1];
            const payload = _verify(token, secret);
            const user = await User.findOne({_id: payload.id});
            //const check = await userCheck(req);*/

            const {user} = req;
            return res
            .status(200)
            .json({
                message: 'Success!',
                success: true,
                userConfig: {
                    username: user.username,
                    money: user.money,
                    isAdmin: user.isAdmin,
                    isBlock: user.isBlock,
                    lastFive: user.lastFive
                }
            });
        } catch (error) {
            console.log(error);
            res.status(400).json({
                message: 'Error!',
                success: false,
            })
        }
    }

    async deleteUser(req, res) {
        try {
            //const header = req.headers.authorization;
            /*if (!header || !password) {
                return res.status(403).json({
                    message: 'Error! No token or/and password. Need to login',
                    success: false,
                })
            }
            
            const token = req.headers.authorization.split(' ')[1];
            const payload = _verify(token, secret);
            const user = await User.findOne({_id: payload.id});*/
            const {user} = req;
            const { password } = req.body;

            if (!password) {
                return res.status(403).json({
                    message: 'Error! No token or/and password. Need to login',
                    success: false,
                })
            }

            const isPasswordValid = compareSync(password, user.password)
            if(isPasswordValid) {
                await User.deleteOne({user: user.username});
            }

            return res
            .status(200)
            .json({
                message: `User deleted`,
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

    async updateUser(req, res) {
        try {
            //const header = req.headers.authorization;
            /*if (!header || !currentPassword) {
                return res.status(403).json({
                    message: 'Error! No token or/and password. Need to login',
                    success: false,
                })
            }*/

            /*const token = req.headers.authorization.split(' ')[1];
            const payload = _verify(token, secret);
            const user = await User.findOne({_id: payload.id});*/
            const {user} = req;
            const { currentPassword, username, email, password } = req.body;
            const cryptoPassword = hashSync(password, 6);

            const isPasswordValid = compareSync(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(403).json({
                    message: 'Invalid password',
                    success: false,
                })
            }
            await User.updateOne({username: user.username}, {
                username: username || user.username,
                email: email || user.email,
                password: password ? cryptoPassword : user.password,
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

    async isUser(req, res) {
        const {username} = req.query;
        const user = await User.findOne({username})
        if (!user) {
            return res
            .status(404)
            .json({
                message: `${username} not found`,
                success: false,
            });
        }

        return res
        .status(200)
        .json({
            message: `Success!`,
            success: true,
        });
    }

    async reset(req, res) {
        try {
            const result = await resetPassword(req);
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

    async services(req, res) {
        try {
            return res
            .status(200)
            .json({
                success: true,
                message: 'Success',
                operations
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

export default new userController();
