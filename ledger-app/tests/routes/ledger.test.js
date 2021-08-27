const { lineItemCreate } = require('../../routes/ledgers.js');
const moment = require('moment-timezone');


describe('lineItemCreate start date and end date check', () => {


    it(('first  line item start date must be first day of lease last line item end date must be last day of lease in Monthly payments'), () => {
        const results = lineItemCreate(moment("2020-01-30"), moment("2020-05-01"), "monthly", 555);
        let resultsLength = results.length;
        expect(results[0].lineItemStartDate).toBe(moment("2020-01-30").toString());
        expect(results[resultsLength - 1].lineItemEndDate).toBe(moment("2020-04-30").endOf('day').toString());
    }
    );


    it(('first  line item start date must be first day of lease last line item end date must be last day of lease in weekly payments'), () => {
        const results = lineItemCreate(moment("2020-01-30"), moment("2020-05-01"), "weekly", 555);
        let resultsLength = results.length;
        expect(results[0].lineItemStartDate).toBe(moment("2020-01-30").toString());
        expect(results[resultsLength - 1].lineItemEndDate).toBe(moment("2020-05-01").toString());
    }
    );


    it(('first  line item start date must be first day of lease last line item end date must be last day of lease in fortnightly payments'), () => {
        const results = lineItemCreate(moment("2020-01-30"), moment("2020-05-01"), "fortnightly", 555);
        let resultsLength = results.length;
        expect(results[0].lineItemStartDate).toBe(moment("2020-01-30").toString());
        expect(results[resultsLength - 1].lineItemEndDate).toBe(moment("2020-05-01").toString());
    }
    );

})






describe('Number of line items check', () => {


    test(('Expected line item number should match for monthly payments'), () => {
        const results = lineItemCreate(moment("2020-01-30"), moment("2020-05-01"), "monthly", 555);
        let resultsLength = results.length;
        expect(resultsLength).toBe(3);
    }
    );


    test(('Expected line item number should match for fortnightly payments'), () => {
        const results = lineItemCreate(moment("2020-01-30"), moment("2020-05-01"), "fortnightly", 555);
        let resultsLength = results.length;
        expect(resultsLength).toBe(7);
    }
    );



    test(('Expected line item number should match for weekly payments'), () => {
        const results = lineItemCreate(moment("2020-01-30"), moment("2020-05-01"), "weekly", 555);
        let resultsLength = results.length;
        expect(resultsLength).toBe(12);
    }
    );



})







