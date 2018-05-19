const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String },
    description: String,
    type: String,
    price: { type: String },
    time: String,
    location: String,
    lang: String,
    long: String,
    contact: String,
    email: String,
    category:String,
    user:String,
    productImage: [String]
});

module.exports = mongoose.model('Product', productSchema);