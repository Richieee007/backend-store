const mongoose = require('./db');
const Product = require('./models/Product');

module.exports = async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    res.json({ success: true });
};
