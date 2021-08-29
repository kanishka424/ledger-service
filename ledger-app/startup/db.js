const mongoose = require('mongoose');
const config = require('config');


module.exports = function () {//connect to our db
    const db = config.get('db');//uses "defult.json" in "config" folder
    mongoose.connect(db)
        .then(() => console.log(`Connected to ${db}`))

}