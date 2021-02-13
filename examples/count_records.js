const Odoo = require('../lib/index');

const odoo = new Odoo({
    url: '<insert server URL>',
    port: '<insert server port default 80>',
    db: '<insert database name>',
    username: '<insert username>',
    password: '<insert password>'
});

odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['is_company', '=', true],['customer', '=', true]]);
    var params = [];
    params.push(inParams);
    odoo.execute_kw('res.partner', 'search_count', params, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});

async function count_records() {
    try {
        const uid = await odoo.promise_connect()
        console.log(`Connected to odoo with UID ${uid}`)
        const result = await odoo.promise_execute_kw('res.partner', 'search_count', [[['is_company', '=', true],['customer', '=', true]]])
        console.log(`result: ${result}`)
    } catch(e){
        console.error(e)
    }

}
