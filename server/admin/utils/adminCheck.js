import User from '../../models/user.js';
import { verify } from 'jsonwebtoken';
import { secret } from '../../config.js';

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

        if (!user.isAdmin) {
            return {
                message: 'Error! No admin!',
                success: false,
            }
        }

        return {
            message: 'Success',
            success: true,
        }
}
