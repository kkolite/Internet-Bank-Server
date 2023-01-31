// rs2022school5543
// qftlbygmvdthtopj
// 0217 4097
// 1126 1306
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZDUxNGZkMmY4MzMyODExZGRjZjEyNiIsImlhdCI6MTY3NDkyOTI0N30.1VUkbUkSl-UoAsNIMKlNoJdqUzS6xL-ryMQS6-snCuo

import User from '../../models/user.js';
import sendEmail from './sendEmail.js';

export function randomKey() {
    const one = Math.floor(Math.random() * 10);
    const two = Math.floor(Math.random() * 10);
    const three = Math.floor(Math.random() * 10);
    const four = Math.floor(Math.random() * 10);
    const key = `${one}${two}${three}${four}`;
    return +key;
}

export default async function(username) {
    const verifyCode = randomKey();
    const user = await User.findOne({username});
    if(!user) {
        return {
            success: false,
            message: 'User not found during creating secure code'
        }
    }
    await User.updateOne({username}, {
        verifyCode
    });

    const text = `You code - ${verifyCode}`;
    const sendStatus = await sendEmail(user.email, text);
    return sendStatus;
}