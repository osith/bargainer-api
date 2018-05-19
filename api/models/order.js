const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', require: true },
    create_user: String,
    product_owner: String,
    type: String,
    category: String,
    add_type: String,
    price: String,
    phone:String,
    time: String,
    datetime: String,
    status: String,
    image: String, //approve or not
    lang: String,
    long: String,
    clang: String,
    clong: String,
    cphone: String
});

module.exports = mongoose.model('Order', orderSchema);