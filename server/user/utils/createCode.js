// rs2022school5543
// qftlbygmvdthtopj
// 0217 4097
// 1126 1306

const User = require('../../models/user');
const nodemailer = require('nodemailer');

function randomKey() {
    const one = Math.floor(Math.random() * 10);
    const two = Math.floor(Math.random() * 10);
    const three = Math.floor(Math.random() * 10);
    const four = Math.floor(Math.random() * 10);
    const key = `${one}${two}${three}${four}`;
    return +key;
}

module.exports = async function(username) {
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

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'rsbank.verify@gmail.com',
          pass: 'qftlbygmvdthtopj',
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    await transporter.sendMail({
        from: '"RSBank Verify" <rsbank.verify@gmail.com>',
        to: `${user.email}`,
        subject: 'Secury code',
        text: `Your code - ${verifyCode}`,
    })
    return {
        success: true,
        message: 'Success'
    }
}