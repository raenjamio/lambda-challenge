const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient();

/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };
    
    var mysql = require('mysql');
    
    var connection = mysql.createConnection({
        host: process.env.dbhost,
        user: process.env.dbuser,
        password: process.env.dbpassword,
        database: process.env.dbdatabase
    });
    

    try {
        switch (event.httpMethod) {
            case 'DELETE':
                body = await dynamo.delete(JSON.parse(event.body)).promise();
                break;
            case 'GET':
                getDataFromRDS(connection, event)
                body = await dynamo.scan({ TableName: event.queryStringParameters.TableName }).promise();
                break;
            case 'POST':
                body = await dynamo.put(JSON.parse(event.body)).promise();
                break;
            case 'PUT':
                body = await dynamo.update(JSON.parse(event.body)).promise();
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};


function  getDataFromRDS(connection, event) { 
   if (event.queryStringParameters.TableNameRDS) {
           
    connection.connect(function(err) {
      if (err) {
        console.error('Database rds connection failed: ' + err.stack);
        return;
      }
      
        connection.query('SELECT * from ' + event.queryStringParameters.TableNameRDS, function (error, results, fields) {

        // Handle error after the release.
        if (error) throw error;
        else console.log(results[0].name); 
      });
    
      console.log('Connected rds to database.');
      connection.end();
    });
   }
} 