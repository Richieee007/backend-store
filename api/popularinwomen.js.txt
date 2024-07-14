const mongoose = require('./db');
const Product = require('./models/Product');

module.exports = async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular = products.slice(0, 4);
    res.send(popular);
};
