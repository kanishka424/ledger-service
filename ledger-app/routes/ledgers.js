const auth = require('../middleware/auth')
const moment = require('moment-timezone')
const express = require("express");
const router = express.Router();

let { LineItem } = require("../models/lineItem");
let { Ledger, validateLedger, lineItemCreate } = require("../models/ledger");


router.get("/", auth, (req, res) => {//our main api for creating line items for a ledger
    const { error } = validateLedger(req.query);
    if (error) {

        res.status(400).send(error.details[0].message);
        return;
    }
    const queryStringObject = req.query;
    const leaseStartDate = moment.tz(queryStringObject.startDate, queryStringObject.timeZone);
    const leaseEndDate = moment.tz(queryStringObject.endDate, queryStringObject.timeZone);
    let lineItemsGenerated = lineItemCreate(leaseStartDate.startOf('day'), leaseEndDate.endOf('day'), queryStringObject.paymentFrequency, queryStringObject.weeklyRate)
    res.send(lineItemsGenerated);
})


module.exports = { lineItemCreate, router };
