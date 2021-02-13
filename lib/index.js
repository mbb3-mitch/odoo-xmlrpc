/*
 *
 * Original Author: Faisal Sami
 * mail: faisalsami78@gmail.com
 * https://github.com/faisalsami/odoo-xmlrpc
 *
 * Refactored by: Mitchell Burr Bedard
 * mail: m.burrbedard@gmail.com
 * https://github.com/mbb3-mitch/odoo-xmlrpc
 *
 */
const xmlrpc = require('xmlrpc');
const { promisify } = require('util');

class Odoo {
    constructor(config = {}) {
        const url = new URL(config.url);
        this.host = url.hostname;
        this.port = config.port || url.port;
        this.db = config.db;
        this.username = config.username;
        this.password = config.password;
        this.uid = 0;
        this.secure = url.protocol === 'https:';
    }

    connect(callback) {
        const clientOptions = {
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/common',
        };
        if (this.secure == false) {
            this.client = xmlrpc.createClient(clientOptions);
        } else {
            this.client = xmlrpc.createSecureClient(clientOptions);
        }
        const params = [this.db, this.username, this.password, {}];
        this.client.methodCall('authenticate', params, (error, value) => {
            if (error) {
                return callback(error, null);
            }
            if (!value) {
                return callback({ message: 'No UID returned from authentication.' }, null);
            }
            this.uid = value;
            return callback(null, value);
        });
    }

    async promise_connect() {
        const clientOptions = {
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/common',
        };
        if (this.secure == false) {
            this.client = xmlrpc.createClient(clientOptions);
        } else {
            this.client = xmlrpc.createSecureClient(clientOptions);
        }
        this.client.methodCallPromise = promisify(this.client.methodCall);
        const params = [this.db, this.username, this.password, {}];

        try {
            const value = await this.client.methodCallPromise('authenticate', params);
            this.uid = value;
            return this.uid;
        } catch (err) {
            throw err;
        }
    }

    execute_kw(model, method, params, callback) {
        const clientOptions = {
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/object',
        };

        if (this.secure == false) {
            this.client = xmlrpc.createClient(clientOptions);
        } else {
            this.client = xmlrpc.createSecureClient(clientOptions);
        }

        const fparams = [this.db, this.uid, this.password, model, method];

        params.forEach((param) => {
            fparams.push(param);
        });

        this.client.methodCall('execute_kw', fparams, (error, value) => {
            if (error) {
                return callback(error, null);
            }
            return callback(null, value);
        });
    }

    async promise_execute_kw(model, method, positionalParams = [], keyParams = {}) {
        const clientOptions = {
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/object',
        };

        if (this.secure === false) {
            this.client = xmlrpc.createClient(clientOptions);
        } else {
            this.client = xmlrpc.createSecureClient(clientOptions);
        }
        this.client.methodCallPromise = promisify(this.client.methodCall);

        return this.client.methodCallPromise('execute_kw', [
            this.db,
            this.uid,
            this.password,
            model,
            method,
            positionalParams,
            keyParams,
        ]);
    }
}

module.exports = Odoo;
