const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const plugins = require('../config/plugins');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
    password: { type: String }
});

studentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Student', studentSchema);

