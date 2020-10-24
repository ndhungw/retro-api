// import { mongoose } from 'mongoose';
const mongoose = require('mongoose');
const { Schema } = mongoose;

const boardSchema = new Schema({
    name: {
        type: String,
        default: 'New board'
    },
    userId: {
        type: String,
        required: true
    },
    // showHiddenCards: {
    //     type: Boolean,
    //     default: true
    // }
}, {
    timestamps: true
});

const Board = mongoose.model('Board',boardSchema, 'boards');

module.exports = Board;