const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const {secret} = require('../../config');

module.exports = async function(req) {
    const header = req.headers.authorization;
        if (!header) {
            return {
                message: 'Error! No token. Need to login',
                success: false,
            }
        }

        const token = req.headers.authorization.split(' ')[1];
        const payload = jwt.verify(token, secret);
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