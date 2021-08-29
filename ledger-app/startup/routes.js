const express = require('express');
const { router } = require('../routes/ledgers');
const ledgers = router;
const users = require('../routes/users')
const auth = require('../routes/auth')


module.exports = function (app) {//the routes we use in our aplication
  app.use(express.json());
  app.use('/api/ledgers', ledgers);
  app.use('/api/users', users);
  app.use('/api/auth', auth)
}
