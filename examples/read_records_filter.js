const Odoo = require('../lib/index');

const odoo = new Odoo({
    url: '<insert server URL>',
    port: '<insert server port default 80>',
    db: '<insert database name>',
    username: '<insert username>',
    password: '<insert password>'
});

odoo.connect(function (err) {
    if (err) {
        return console.log(err);
    }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['is_company', '=', true], ['customer', '=', true]]);
    inParams.push(0);  //offset
    inParams.push(1);  //Limit
    var params = [];
    params.push(inParams);
    odoo.execute_kw('res.partner', 'search', params, function (err, value) {
        if (err) {
            return console.log(err);
        }
        var inParams = [];
        inParams.push(value); //ids
        inParams.push(['name', 'country_id', 'comment']); //fields
        var params = [];
        params.push(inParams);
        odoo.execute_kw('res.partner', 'read', params, function (err2, value2) {
            if (err2) {
                return console.log(err2);
            }
            console.log('Result: ', value2);
        });
    });
});

async function read_records_filter() {
    try {
        const uid = await odoo.promise_connect()
        console.log(`Connected to odoo with UID ${uid}`)
        let result = await odoo.promise_execute_kw('res.partner', 'search_read',
            [[['is_company', '=', true], ['customer', '=', true]]],
            {limit: 1, offset: 0, fields: ['name', 'country_id', 'comment']})

        console.log(`result: ${result}`)
    } catch (e) {
        console.error(e)
    }
}
