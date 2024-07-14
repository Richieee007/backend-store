const mongoose = require('./db');
const jwt = require('jsonwebtoken');
const Users = require('./models/Users');

module.exports = async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id,
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: "Wrong password, please try again" });
        }
    } else {
        res.json({ success: false, errors: "Wrong email address, please try again" });
    }
};
