const mongoose = require('mongoose');
const Product = require('../models/Product'); // Adjust the path based on your project structure

module.exports = async (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    await product.save();
    res.json({ success: true, name: req.body.name });
};
