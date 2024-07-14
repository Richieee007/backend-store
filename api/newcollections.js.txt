const mongoose = require('./db');
const Product = require('./models/Product');

module.exports = async (req, res) => {
    let products = await Product.find({});
    let newCollection = products.slice(1).slice(-8);
    res.send(newCollection);
};
