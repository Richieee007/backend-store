const mongoose = require('./db');
const Users = require('./models/Users');
const fetchUser = require('./fetchUser');

module.exports = async (req, res) => {
    await fetchUser(req, res, async () => {
        let userData = await Users.findOne({ _id: req.user.id });
        res.json(userData.cartData);
    });
};
