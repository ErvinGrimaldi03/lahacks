const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const plugins = require('../config/plugins');

const institutionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    domain: { type: String, required: true },
    suggestions: {
        open: { type: Number, default: 0 },
        complete: { type: Number, default: 0 }
    },
    shortId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Institution', institutionSchema);