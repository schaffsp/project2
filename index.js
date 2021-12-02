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

    service.get("/report.html", (req, res) => {
        var options = {
            root: path.join(__dirname)
        };
         
        var fileName = 'report.html';
        res.sendFile(fileName, options, function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', fileName);
                next();
            }
        });
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
        const query = `SELECT * FROM drivethru.measurement WHERE drivethru.measurement.rest_id = ?`;
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

    /*--------------------------------------/
    /                                       /
    /            ACCESSIBILITY              /
    /                                       /
    /--------------------------------------*/

    // Post a new accessibility option to the database
    service.post('/accessibility', (request, response) => {
        if (request.body.hasOwnProperty('option_id') && request.body.hasOwnProperty('rest_id'))
        {
            const parameters = [
                request.body.option_id,
                request.body.rest_id,
            ];

            const query = `INSERT INTO drivethru.accessibility (drivethru.accessibility.OPTION_ID, drivethru.accessibility.REST_ID) VALUES (?, ?)`;
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
                }
            });
        } else {
            response.status(400);
            response.json({
              ok: false,
              results: 'Incomplete accessibility.',
            });
          }
    });

    // Get all option_ids that correspond to the given rest_id
    service.get('/accessibility/:rest_id', (request, response) => {
        const parameters = [parseInt(request.params.rest_id)];
        const query = `SELECT * FROM drivethru.accessibility WHERE drivethru.accessibility.REST_ID = ?`;
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

    // Delete an accessibility option in the database
    service.delete('/accessibility/:rest_id', (request, response) => {
        const parameters = [parseInt(request.params.rest_id)];
        const query = `DELETE FROM drivethru.accessibility WHERE drivethru.accessibility.rest_id = ?`;
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
                    results: "id: " + request.params.rest_id + " has been deleted from the database."
                });
            }
        });
    });

    // Update an accessibility option in the database
    service.patch('/accessibility/:rest_id', (request, response) => {
        if (request.body.hasOwnProperty('option_id'))
        {
            const parameters = [
                request.body.option_id,
                parseInt(request.params.rest_id),
            ];

            const query = `UPDATE drivethru.accessibility SET drivethru.accessibility.OPTION_ID = ? WHERE drivethru.accessibility.REST_ID = ?`;
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
              results: 'Incomplete accessibility.',
            });
          }
    });

    /*--------------------------------------/
    /                                       /
    /              RESTAURANT               /
    /                                       /
    /--------------------------------------*/

    // Post a new restaurant to the database
    service.post('/restaurant', (request, response) => {
        if (request.body.hasOwnProperty('rest_id') && request.body.hasOwnProperty('rest_location')  && request.body.hasOwnProperty('chain_id'))
        {
            const parameters = [
                request.body.rest_id,
                request.body.rest_location,
                request.body.chain_id,
            ];

            const query = `INSERT INTO drivethru.restaurant (drivethru.restaurant.REST_ID, drivethru.restaurant.REST_LOCATION, drivethru.restaurant.CHAIN_ID) VALUES (?, ?, ?)`;
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
                }
            });
        } else {
            response.status(400);
            response.json({
              ok: false,
              results: 'Incomplete restaurant.',
            });
          }
    });

    // Get a restaurant given its id
    service.get('/restaurant/:rest_id', (request, response) => {
        const parameters = [parseInt(request.params.rest_id)];
        const query = `SELECT * FROM drivethru.restaurant`;
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

    // Delete an restaurant in the database
    service.delete('/restaurant/:rest_id', (request, response) => {
        const parameters = [parseInt(request.params.rest_id)];
        const query = `DELETE drivethru.accessibility FROM drivethru.accessibility WHERE drivethru.accessibility.REST_ID = 3?;`;
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
                });
            }
        });
        query = 'DELETE drivethru.measurement FROM drivethru.measurement WHERE drivethru.measurement.REST_ID = ?;';
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
                });
            }
        });
        query = 'DELETE drivethru.restaurant FROM drivethru.restaurant WHERE drivethru.restaurant.REST_ID = ?;';
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
                });
            }
        });
    });

    // Update an restaurant in the database
    service.patch('/restaurant/:rest_id', (request, response) => {
        if (request.body.hasOwnProperty('rest_location') && request.body.hasOwnProperty('chain_id'))
        {
            const parameters = [
                request.body.rest_location,
                request.body.chain_id,
                parseInt(request.params.rest_id),
            ];

            const query = `UPDATE drivethru.restaurant SET drivethru.restaurant.REST_LOCATION = ?, drivethru.restaurant.CHAIN_ID = ? WHERE drivethru.restaurant.REST_ID = ?`;
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
              results: 'Incomplete restaurant.',
            });
          }
    });

    /*--------------------------------------/
    /                                       /
    /                CHAIN                  /
    /                                       /
    /--------------------------------------*/

    // Post a new chain to the database
    service.post('/chain', (request, response) => {
        if (request.body.hasOwnProperty('chain_id') && request.body.hasOwnProperty('chain_name')  && request.body.hasOwnProperty('chain_phone'))
        {
            const parameters = [
                request.body.chain_id,
                request.body.chain_name,
                request.body.chain_phone,
            ];

            const query = `INSERT INTO drivethru.chain (drivethru.chain.CHAIN_ID, drivethru.chain.CHAIN_NAME, drivethru.chain.CHAIN_PHONE) VALUES (?, ?, ?)`;
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
                }
            });
        } else {
            response.status(400);
            response.json({
              ok: false,
              results: 'Incomplete restaurant.',
            });
          }
    });

    // Get a chain given its id
    service.get('/chain/:chain_id', (request, response) => {
        const parameters = [parseInt(request.params.chain_id)];
        const query = `SELECT * FROM drivethru.chain WHERE drivethru.chain.chain_id = ?`;
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

    // Delete a chain in the database
    service.delete('/chain/:chain_id', (request, response) => {
        const parameters = [parseInt(request.params.chain_id)];
        const query = `DELETE drivethru.accessibility FROM drivethru.accessibility
            JOIN drivethru.restaurant ON drivethru.accessibility.REST_ID = drivethru.restaurant.REST_ID
            JOIN drivethru.chain ON drivethru.chain.CHAIN_ID = drivethru.restaurant.CHAIN_ID
            WHERE drivethru.chain.CHAIN_ID = ?;`;
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
                });
            }
        });
        query = `DELETE drivethru.measurement FROM drivethru.measurement
        JOIN drivethru.restaurant ON drivethru.measurement.REST_ID = drivethru.restaurant.REST_ID
        JOIN drivethru.chain ON drivethru.chain.CHAIN_ID = drivethru.restaurant.CHAIN_ID
        WHERE drivethru.chain.CHAIN_ID = ?;`;
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
                });
            }
        });
        query = `DELETE drivethru.restaurant FROM drivethru.restaurant
        JOIN drivethru.chain ON drivethru.chain.CHAIN_ID = drivethru.restaurant.CHAIN_ID
        WHERE drivethru.chain.CHAIN_ID = ?;`;
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
                });
            }
        });
        query = `DELETE drivethru.chain FROM drivethru.chain WHERE drivethru.chain.CHAIN_ID = ?;`;
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
                });
            }
        });
        
    });

    // Update a chain in the database
    service.patch('/chain/:chain_id', (request, response) => {
        if (request.body.hasOwnProperty('chain_name') && request.body.hasOwnProperty('chain_phone'))
        {
            const parameters = [
                request.body.chain_name,
                request.body.chain_phone,
                parseInt(request.params.chain_id),
            ];

            const query = `UPDATE drivethru.chain SET drivethru.chain.chain_name = ?, drivethru.chain.chain_phone = ? WHERE drivethru.chain.chain_id = ?`;
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
              results: 'Incomplete chain.',
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