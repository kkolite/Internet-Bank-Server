import User from "../../models/user.js";
import jwt from 'jsonwebtoken';
import { secret } from '../../config.js';

const { verify } = jwt;

export default async function(req) {
    const header = req.headers.authorization;
    if (!header) {
        return {
            message: 'Error! No token. Need to login',
            success: false,
        }
    }

    const token = req.headers.authorization.split(' ')[1];
    const payload = verify(token, secret);
    const user = await User.findOne({_id: payload.id});
    return {
        success: user ? true : false,
        message: user ? 'Success' : 'Not found user',
    }
}
