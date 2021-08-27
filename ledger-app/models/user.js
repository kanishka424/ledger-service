const config = require('config')
const jwt = require('jsonwebtoken');
const Joi = require('Joi');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlenth: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlenth: 5,
        maxLength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlenth: 5,
        maxLength: 1024,
        unique: true
    }



})


userSchema.methods.generatAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'))
    return token;
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
    let schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user)
}

exports.User = User;
exports.validate = validateUser;
