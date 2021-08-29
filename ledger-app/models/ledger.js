const Joi = require('joi')
const JoiTimezone = require('joi-tz')
const moment = require('moment-timezone')
const JoiTZ = Joi.extend(JoiTimezone);


let { LineItem } = require('./lineItem')


class Ledger {
    constructor(ledgerStartday, ledgerEndDate, paymentFrequency, days, amount) {
        this.ledgerStartday = ledgerStartday;
        this.ledgerEndDate = ledgerEndDate;
        this.paymentFrequency = paymentFrequency;
        this.days = days;
        this.amount = amount;


    }
}

function lineItemCreate(startDate, endDate, paymentFrequency, weeklyRate) {//creats the lineItems for particular ledger


    let curLedgerObj = createLedgerObject(startDate, endDate, paymentFrequency.toLowerCase(), weeklyRate);

    let lineItems = [];
    let lineItemStartDate = startDate;
    let lineItemEndDate;
    let monthlyDate = startDate.date();


    while (endDate.isAfter(lineItemStartDate)) {

        let lineItem;
        let amount;

        if (curLedgerObj.paymentFrequency === "monthly") {//executes if the payment frquency is given as "Monthly"
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
            lineItemEndDate = moment(lineItemStartDate).add(curLedgerObj.days - 1, 'days').endOf('day');
          
            if (!lineItemEndDate.isAfter(endDate)) {

                amount = curLedgerObj.amount;
                lineItem = new LineItem(lineItemStartDate.toString(), lineItemEndDate.toString(), amount.toFixed(2))
                lineItems.push(lineItem);
                lineItemStartDate = moment(lineItemEndDate).add(1, 'day').startOf('day');
            } else {
                addLastLineItem(lineItemStartDate, endDate, lineItems);
                lineItemStartDate = moment(lineItemEndDate);
            }
        }
    }


    function createLedgerObject(ledgerStartday, ledgerEndDate, paymentFrequency, weeklyRate) {//creates an object of ledger
        let amount;
        let ledgerObj;

        switch (paymentFrequency) {
            case "weekly":
                amount = parseInt(weeklyRate);
                ledgerObj = new Ledger(ledgerStartday, ledgerEndDate, paymentFrequency, 7, amount)
                break;
            case "fortnightly":
                amount = parseInt(weeklyRate) * 2;
                ledgerObj = new Ledger(ledgerStartday, ledgerEndDate, paymentFrequency, 14, amount)
                break;
            case "monthly":
                amount = parseInt(weeklyRate) / 7 * 365 / 12;
                ledgerObj = new Ledger(ledgerStartday, ledgerEndDate, paymentFrequency, 30, amount)
                break;
            default:
                break;
        }
        return ledgerObj;
    }



    function addLastLineItem(lineItemStartDate, endDate, lineItems) {//creates the final line item of a given ledger
        let numlastLineItemDays = endDate.diff(lineItemStartDate, 'days') + 1;
        amount = (weeklyRate / 7) * numlastLineItemDays;
        lineItem = new LineItem(lineItemStartDate.toString(), endDate.toString(), amount.toFixed(2));
        lineItems.push(lineItem);
    }


    return lineItems;
}


function validateLedger(ledger) {//validates the query parameters sent in the request
    let schema = Joi.object({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
        paymentFrequency: Joi.string().valid('weekly', 'fortnightly', 'monthly').insensitive().required(),
        weeklyRate: Joi.number().greater(0).required(),
        timeZone: JoiTZ.timezone().required()
    });
    return schema.validate(ledger)
}

exports.Ledger = Ledger;
exports.validateLedger = validateLedger;
exports.lineItemCreate = lineItemCreate;

