// Регистрация - тело с ником, почтой и паролем
// Логин - тело с ником и паролем
// Получение данных - токен в хедере
// Обновление данных - логин (+токен в хедере)
// Удаление - логин, пароль (+токен в хедере)

const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret} = require('./config');

class Controller {
    async newUser(req, res) {
        try {
            const { username, email, password } = req.body;

            const isNotUniq = await User.findOne({username});
            if(isNotUniq) {
                return res
                .status(400)
                .json({
                    message: 'We already have user with same username/email',
                    success: false,
                });
            }

            const cryptoPassword = bcrypt.hashSync(password, 6);
            const userConfig = {
                username,
                password: cryptoPassword,
                email,
            }
            const user = new User(userConfig);
            await user.save();

            return res
            .status(200)
            .json({
                message: 'New user create!',
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
                res.status(403).json({
                    message: 'Error! No token. Need to login',
                    success: false,
                })
            }

            const token = reg.headers.authorization.split(' ')[1];
            const payload = jwt.verify(token, secret);
            const user = User.findOne({_id: payload.id});

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
}

module.exports = new Controller();