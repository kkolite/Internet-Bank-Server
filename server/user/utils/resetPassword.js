const User = require("../../models/user");
const sendEmail = require("./sendEmail");

function randomPassword() {
    const one = Math.floor(Math.random() * 100);
    const two = Math.floor(Math.random() * 99);
    const three = Math.floor(Math.random() * 87);
    const four = Math.floor(Math.random() * 17);
    return `${one}${two}${three}${four}`;
}

module.exports = async function(req) {
    const {username, email} = req.body;
    if (!username || !email) {
        return {
            success: false,
            message: 'Invalid req body'
        }
    }

    const user = await User.findOne({username});
    if (!user || user.email !== email) {
        return {
            success: false,
            message: 'Incorrect username or/and email'
        }
    }

    const password = randomPassword();
    const cryptoPassword = bcrypt.hashSync(password, 6);
    await User.updateOne({username}, {
        password: cryptoPassword
    })

    const text = `Your new password - ${password}. Please, update you password after succesfull login and verification`;
    const sendStatus = sendEmail(user.email, text);
    return sendStatus;
}