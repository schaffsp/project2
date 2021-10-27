const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
let connection = null;

async function createSQLConnection() {
    const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
    connection = mysql.createConnection(credentials);
    await new Promise((resolve) => {
        connection.connect(error => {
            if (error) {
                console.error(error);
                process.exit(-1);
            }
            console.log("An SQL connection was established to: " + credentials.database + " at: " + credentials.host + " by: " + credentials.user + ".");
            resolve(0);
        })
    });
}

let service = null;
async function setupService() {
    service = express();
    service.use(express.json());

    var meas_tracker = 100;
    var opt_tracker = 100;

    service.use((request, response, next) => {
        response.set('Access-Control-Allow-Origin', '*');
        next();
    });

    /*--------------------------------------/
    /                                       /
    /              MEASUREMENT              /
    /                                       /
    /--------------------------------------*/

    // Post a new measurement to the database
    service.post('/measurement', (request, response) => {
        if (request.body.hasOwnProperty('rest_id') &&
            request.body.hasOwnProperty('meas_time_in') &&
            request.body.hasOwnProperty('meas_time_out') &&
            request.body.hasOwnProperty('meas_drive_through')) 
        {
            const parameters = [
                meas_tracker + 1,
                parseInt(request.body.rest_id),
                request.body.meas_time_in,
                request.body.meas_time_out,
                request.body.meas_drive_through,
            ];

            const query = `INSERT INTO drivethru.measurement (drivethru.measurement.MEAS_ID, drivethru.measurement.REST_ID, drivethru.measurement.MEAS_TIME_IN, drivethru.measurement.MEAS_TIME_OUT, drivethru.measurement.MEAS_DRIVETHROUGH) VALUES(?, ?, ?, ?, ?)`;
            connection.query(query, parameters, (error, rows) => {
                if (error) {
                    response.status(500);
                    response.json({
                        ok: false,
                        results: error.message,
                    });
                } else {
                    response.json({
                        ok: true,
                        results: 'Success!',
                    });
                    meas_tracker += 1;
                }
            });
        } else {
            response.status(400);
            response.json({
              ok: false,
              results: 'Incomplete measurement.',
            });
          }
    });

    // Get a measurement from the database based on its id
    service.get('/measurement/:id', (request, response) => {
        const parameters = [parseInt(request.params.id)];
        const query = `SELECT * FROM drivethru.measurement WHERE drivethru.measurement.meas_id = ?`;
        connection.query(query, parameters, (error, rows) => {
            if (error) {
                response.status(500);
                response.json({
                    ok: false,
                        results: error.message,
                });
            } else {
                response.json({
                    ok: true,
                    results: rows.map(parseRow),
                });
            }
        });
    });

    // Delete a measurement in the database
    service.delete('/measurement/:id', (request, response) => {
        const parameters = [parseInt(request.params.id)];
        const query = `DELETE FROM drivethru.measurement WHERE drivethru.measurement.meas_id = ?`;
        connection.query(query, parameters, (error, rows) => {
            if (error) {
                response.status(500);
                response.json({
                    ok: false,
                    results: error.message,
                });
            } else {
                response.json({
                    ok: true,
                    results: "id: " + request.params.id + " has been deleted from the database."
                });
            }
        });
    });

    // Update a measurement in the database
    service.patch('/measurement/:id', (request, response) => {
        if (request.body.hasOwnProperty('rest_id') &&
            request.body.hasOwnProperty('meas_time_in') &&
            request.body.hasOwnProperty('meas_time_out') &&
            request.body.hasOwnProperty('meas_drive_through')) 
        {
            const parameters = [
                parseInt(request.body.rest_id),
                request.body.meas_time_in,
                request.body.meas_time_out,
                request.body.meas_drive_through,
                parseInt(request.params.id),
            ];

            const query = `UPDATE drivethru.measurement SET drivethru.measurement.REST_ID = ?, drivethru.measurement.MEAS_TIME_IN = ?, drivethru.measurement.MEAS_TIME_OUT = ?, drivethru.measurement.MEAS_DRIVETHROUGH = ? WHERE drivethru.measurement.MEAS_ID = ?`;
            connection.query(query, parameters, (error, rows) => {
                if (error) {
                    response.status(404);
                    response.json({
                        ok: false,
                        results: error.message,
                    });
                } else {
                    response.json({
                        ok: true,
                    });
                }
            });
        } else {
            response.status(400);
            response.json({
              ok: false,
              results: 'Incomplete measurement.',
            });
          }
    });

    /*--------------------------------------/
    /                                       /
    /                OPTION                 /
    /                                       /
    /--------------------------------------*/

    // Post a new option to the database
    service.post('/option', (request, response) => {
        if (request.body.hasOwnProperty('option_name'))
        {
            const parameters = [
                opt_tracker + 1,
                request.body.option_name,
            ];

            const query = `INSERT INTO drivethru.option (drivethru.option.OPTION_ID, drivethru.option.OPTION_NAME) VALUES (?, ?)`;
            connection.query(query, parameters, (error, rows) => {
                if (error) {
                    response.status(500);
                    response.json({
                        ok: false,
                        results: error.message,
                    });
                } else {
                    response.json({
                        ok: true,
                        results: 'Success!',
                    });
                    opt_tracker += 1;
                }
            });
        } else {
            response.status(400);
            response.json({
              ok: false,
              results: 'Incomplete measurement.',
            });
          }
    });

    // Get an option from the database based on its id
    service.get('/option/:id', (request, response) => {
        const parameters = [parseInt(request.params.id)];
        const query = `SELECT * FROM drivethru.option WHERE drivethru.option.OPTION_ID = ?`;
        connection.query(query, parameters, (error, rows) => {
            if (error) {
                response.status(500);
                response.json({
                    ok: false,
                        results: error.message,
                });
            } else {
                response.json({
                    ok: true,
                    results: rows.map(parseRow),
                });
            }
        });
    });

    // Delete an option in the database
    service.delete('/option/:id', (request, response) => {
        const parameters = [parseInt(request.params.id)];
        const query = `DELETE FROM drivethru.option WHERE drivethru.option.option_id = ?`;
        connection.query(query, parameters, (error, rows) => {
            if (error) {
                response.status(500);
                response.json({
                    ok: false,
                    results: error.message,
                });
            } else {
                response.json({
                    ok: true,
                    results: "id: " + request.params.id + " has been deleted from the database."
                });
            }
        });
    });

    // Update an option in the database
    service.patch('/option/:id', (request, response) => {
        if (request.body.hasOwnProperty('option_name'))
        {
            const parameters = [
                request.body.option_name,
                parseInt(request.params.id),
            ];

            const query = `UPDATE drivethru.option SET drivethru.option.OPTION_NAME = ? WHERE drivethru.option.OPTION_ID = ?`;
            connection.query(query, parameters, (error, rows) => {
                if (error) {
                    response.status(404);
                    response.json({
                        ok: false,
                        results: error.message,
                    });
                } else {
                    response.json({
                        ok: true,
                    });
                }
            });
        } else {
            response.status(400);
            response.json({
              ok: false,
              results: 'Incomplete option.',
            });
          }
    });
}

function parseRow(row) {
    var output = [];
    const result = Object.values(JSON.parse(JSON.stringify(row)));
    result.forEach((v) => {
        output.push(v);
    });

    return output;
}

(async function () {
    await createSQLConnection();
    await setupService();

    const port = 8443;
    service.listen(port, () => {
        console.log("The webservice is live.");
    });
})();