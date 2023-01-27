// Регистрация - тело с ником, почтой и паролем
// Логин - тело с ником и паролем
// Получение данных - токен в хедере
// Обновление данных - логин (+токен в хедере)
// Удаление - логин, пароль (+токен в хедере)

const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const createUser = require('./createUser');

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

            const user = await User.findOne({username})
            if (!user) {
                return res
                .status(404)
                .json({
                    message: `${username} not found`,
                    success: false,
                });
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password)
            if (!isPasswordValid) {
                return res
                .status(400)
                .json({
                    message: 'Invalid password',
                    success: false,
                });
            }

            const token = jwt.sign({id: user._id}, secret);
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
            const header = req.headers.authorization;
            if (!header) {
                return res.status(403).json({
                    message: 'Error! No token. Need to login',
                    success: false,
                })
            }

            const token = req.headers.authorization.split(' ')[1];
            const payload = jwt.verify(token, secret);
            const user = await User.findOne({_id: payload.id});

            return res
            .status(200)
            .json({
                message: 'Success!',
                success: true,
                userConfig: {
                    username: user.username,
                    money: user.money,
                    isAdmin: user.isAdmin,
                    isBlock: user.isBlock
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
            const header = req.headers.authorization;
            const { password } = req.body;
            if (!header || !password) {
                return res.status(403).json({
                    message: 'Error! No token or/and password. Need to login',
                    success: false,
                })
            }

            const token = req.headers.authorization.split(' ')[1];
            const payload = jwt.verify(token, secret);
            const user = await User.findOne({_id: payload.id});
            const isPasswordValid = bcrypt.compareSync(password, user.password)
            if(isPasswordValid) {
                await User.deleteOne({_id: payload.id});
                console.log(`User ${payload.id} deleted`)
            }

            return res
            .status(200)
            .json({
                message: `User ${payload.id} deleted`,
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
            const header = req.headers.authorization;
            const { username, email, password } = req.body;
            if (!header) {
                return res.status(403).json({
                    message: 'Error! No token. Need to login',
                    success: false,
                })
            }

            if (!username | !email | !password) {
                return res.status(400).json({
                    message: 'Error! Incorrect req body',
                    success: false,
                })
            }

            const cryptoPassword = bcrypt.hashSync(password, 6);
            const token = req.headers.authorization.split(' ')[1];
            const payload = jwt.verify(token, secret);
            await User.updateOne({_id: payload.id}, {
                username,
                email,
                password: cryptoPassword,
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
}

module.exports = new userController();