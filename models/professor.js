const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const plugins = require('../config/plugins');

const professorSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution' },
    password: { type: String }
});

professorSchema.plugin(passportLocalMongoose, { usernameQueryFields: ['email'] });

module.exports = mongoose.model('Professor', professorSchema);

