// Notes.js me N ko capital rakhna hai

const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {   // ye kis user ke notes hai ye baat ham yha mention karenge 
        type: mongoose.Schema.Types.ObjectId,  // ye jo user hai kisi dusre model ki object id yha par rakhunga yani ki ek foreign key ki tarah kon sa user iss vale model me link kar rha hai 
        // iss vale user ki kon si vali id yha par aayegi basically user ki jagah ham user id store karenge.jo ki iss user.js me iss model me koi na koi user entry hogi  
        ref: 'user'
    }, // ye karne ke baad me user ko store kar sakta hu
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "General",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('note', NotesSchema);