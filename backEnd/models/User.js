// iske andar mera user aane vala hai jo login karega bar-bar

const mongoose = require('mongoose');
const { Schema } = mongoose;

// ab hame ek schema banana hai user ke liye moongoose site ke read the docs ke option jayenge or schema ka structure dekh sakte hai 

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

// // ab iss schema se ham ek model banayenge mtlb schema ko models me dala hai
// module.exports = mongoose.model('user', UserSchema); // isme user model ka name hai jo mongo compass me plural me convert ho jayega , second hamare schema ka nam hai jo hamne abhi upar bnaya hai
// // ab is schema ko ham apne routes me use krenge
const User = mongoose.model('user', UserSchema);
// User.createIndexes(); // isse sare indexes ban jayenge // ye hamare email required true ke corresponding ban rhi thi 
module.exports = User;