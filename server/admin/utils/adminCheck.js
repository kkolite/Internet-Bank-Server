import User from '../../models/user.js';
import { verify } from 'jsonwebtoken';
import { SECRET } from '../../config.js';

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

        if (!user.isAdmin) {
            return res
            .status(401)
            .json({
                message: 'Error! No admin!',
                success: false,
            })
        }

        next();
}
