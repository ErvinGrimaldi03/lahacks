const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const plugins = require('../config/plugins');

const adminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    desc: { type: String }, // title of the admin
    username: { type: String, required: true, unique: true },
    institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
    finalized: { type: Boolean, default: false, required: true },
    password: { type: String }
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Admin', adminSchema);

