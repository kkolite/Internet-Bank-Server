import User from "../../models/user.js";
import jwt from 'jsonwebtoken';
import { SECRET } from '../../config.js';

const { verify } = jwt;

export default async function(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res
        .status(403)
        .json({
            message: 'Error! No token. Need to login',
            success: false,
        })
    }

    const token = req.headers.authorization.split(' ')[1];
    const payload = verify(token, SECRET);
    const user = await User.findOne({_id: payload.id});
    if (!user) {
        return res
        .status(400)
        .json({
            message: 'Error! Not found user / Incorrect token',
            success: false,
        })
    }

    req.user = user;
    next();
}
