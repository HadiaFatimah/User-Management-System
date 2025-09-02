const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,   // ✅ ye galti thi
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false, // optional rakha
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
