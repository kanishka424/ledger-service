const auth = require('../middleware/auth')
const Joi = require('joi')
const JoiTimezone = require('joi-tz')
const moment = require('moment-timezone')
const JoiTZ = Joi.extend(JoiTimezone);
const express = require("express");
const router = express.Router();

let { LineItem } = require("../models/lineItem");

router.get("/", auth, (req, res) => {
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
function lineItemCreate(startDate, endDate, frequency, weeklyRate) {
    let lineItems = [];
    let lineItemStartDate = startDate;
    let lineItemEndDate;
    let monthlyDate = startDate.date();



    function createLedgerObject(paymentFrequency) {
        let ledgerObj = {
            lineItemEndDate: null,
            amount: null
        }
        switch (paymentFrequency) {
            case "weekly":
                ledgerObj.lineItemEndDate = moment(lineItemStartDate).add(7, 'days').endOf('day')
                ledgerObj.amount = parseInt(weeklyRate);
                break;
            case "fortnightly":
                ledgerObj.lineItemEndDate = moment(lineItemStartDate).add(14, 'days').endOf('day')
                ledgerObj.amount = parseInt(weeklyRate) * 2;
                break;
            default:
                break;
        }
        return ledgerObj;
    }


    function addLastLineItem(lineItemStartDate, endDate, lineItems) {
        let numlastLineItemDays = endDate.diff(lineItemStartDate, 'days') + 1;
        amount = (weeklyRate / 7) * numlastLineItemDays;
        lineItem = new LineItem(lineItemStartDate.toString(), endDate.toString(), amount.toFixed(2));
        lineItems.push(lineItem);
    }

    while (endDate.isAfter(lineItemStartDate)) {
        let lineItem;
        let amount;

        if (frequency.toLowerCase() === "monthly") {
            endDayOfNextMonth = moment(lineItemStartDate).add(1, "months").endOf('month').endOf('day');
            if (lineItemEndDate === undefined) {
                lineItemEndDate = moment(lineItemStartDate).add(1, "months").set('date', monthlyDate).endOf('day');
            }
            if (lineItemEndDate.isAfter(endDayOfNextMonth)) {
                lineItemEndDate = endDayOfNextMonth;
            }
            if (!lineItemEndDate.isAfter(endDate)) {
                amount = (weeklyRate / 7) * 365 / 12;
                lineItem = new LineItem(lineItemStartDate.toString(), lineItemEndDate.toString(), amount.toFixed(2))
                lineItems.push(lineItem);
                lineItemStartDate = moment(lineItemEndDate).add(1, "day").startOf('day');
                lineItemEndDate = moment(lineItemEndDate).add(1, "month").add(1, "day").endOf('day');
            } else {
                addLastLineItem(lineItemStartDate, endDate, lineItems);
                lineItemStartDate = moment(lineItemEndDate);
            }

        } else {//this logic will execute if we receive "weekly" or "fortnightly"
            let curLedgeObj = createLedgerObject(frequency.toLowerCase());
            lineItemEndDate = curLedgeObj.lineItemEndDate;
            if (!lineItemEndDate.isAfter(endDate)) {
                amount = curLedgeObj.amount;
                lineItem = new LineItem(lineItemStartDate.toString(), lineItemEndDate.toString(), amount.toFixed(2))
                lineItems.push(lineItem);
                lineItemStartDate = moment(lineItemEndDate).add(1, 'day').startOf('day');
            } else {
                addLastLineItem(lineItemStartDate, endDate, lineItems);
                lineItemStartDate = moment(lineItemEndDate);
            }
        }
    }

    return lineItems;
}


function validateLedger(ledger) {
    let schema = Joi.object({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
        paymentFrequency: Joi.string().valid('weekly', 'fortnightly', 'monthly').insensitive().required(),
        weeklyRate: Joi.number().greater(0).required(),
        timeZone: JoiTZ.timezone().required()
    });
    return schema.validate(ledger)
}


module.exports = { lineItemCreate, router };
