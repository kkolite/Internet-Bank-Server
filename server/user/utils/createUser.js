import User from '../../models/user.js';
import pkg from 'bcryptjs';
import { randomKey } from './createCode.js';

export default async function createUser(req) {
    const { hashSync } = pkg;
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

    const cryptoPassword = hashSync(password, 6);
    const pinCode = randomKey();
    const userConfig = {
        username,
        password: cryptoPassword,
        email,
        pinCode,

    }
    const user = new User(userConfig);
    await user.save();

    return {
        message: 'New user create!',
        success: true,
        pinCode
    };
}
