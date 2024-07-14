const mongoose = require('./db');
const Users = require('./models/Users');
const fetchUser = require('./fetchUser');

module.exports = async (req, res) => {
    await fetchUser(req, res, async () => {
        let userData = await Users.findOne({ _id: req.user.id });
        if (userData.cartData[req.body.itemId] > 0)
            userData.cartData[req.body.itemId] -= 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Removed");
    });
};
