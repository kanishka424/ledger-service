const config = require('config')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { User, validate } = require('../models/user');
const mongooes = require('mongoose');
const express = require('express');
const router = express.Router();


router.post('/', async (req, res) => {//for initially registering users
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);// validating object (name,eamil,pw) when a user registers
    
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');//check if already a user exists before registering
   
    user = new User(_.pick(req.body, ['name', 'email', 'password']))
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)//hasing the password with a Salt
    await user.save();

    const token = user.generateAuthToken();
    res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
    //res.send(_.pick(user, ['name', 'email']));//can filter only the properties we need and returns an object with only those properties
});



module.exports = router;