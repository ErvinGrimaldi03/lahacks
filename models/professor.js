const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const plugins = require('../config/plugins');

const professorSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
    finalized: { type: Boolean, default: false, required: true },
    password: { type: String }
}, { timestamps: true });

professorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Professor', professorSchema);

