const mongoose = require('mongoose');
const express = require('express');
const app = express();




//require("./startup/cors")(app);
require("./startup/routes")(app)
require("./startup/db")();


const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listning on port ${port} `));


module.exports = server;


