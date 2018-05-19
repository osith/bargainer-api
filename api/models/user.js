const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name: String,
    last_name: String,
    display_name: String,
    type: String,
    contact_no: String,
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: { type: String, require: true },
    push: String,
    comments: { type: [JSON] }
});

module.exports = mongoose.model('User', userSchema);