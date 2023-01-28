const User = require('../../models/user');
const bcrypt = require('bcryptjs');

module.exports = async function createUser(req) {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return {
            message: 'Ooops! Empty field!',
            success: false,
        }
    }

    const isNotUniq = await User.findOne({username});
    if(isNotUniq) {
        return {
            message: 'We already have user with same username/email',
            success: false,
        };
    }

    const cryptoPassword = bcrypt.hashSync(password, 6);
    const userConfig = {
        username,
        password: cryptoPassword,
        email,
    }
    const user = new User(userConfig);
    await user.save();

    return {
        message: 'New user create!',
        success: true,
    };
}