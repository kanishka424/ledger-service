const _ = require('lodash')
const bcrypt = require('bcrypt');
const Joi = require('Joi');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });//finding the particular user from db
    if (!user) return res.status(400).send("No such user registered.");

    const validPassword = await bcrypt.compare(req.body.password, user.password)//comparing the password
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generatAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))//sending the generated token in header

})

function validate(user) {
    let schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user)
}


module.exports = router;