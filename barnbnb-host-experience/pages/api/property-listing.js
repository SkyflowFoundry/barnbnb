const { ironOptions } = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';
var snowflake = require('snowflake-sdk');
const fs = require('fs');

const {
  SNOWFLAKE_PRIVATE_KEY,
  SNOWFLAKE_ACCOUNT_NAME,
  SNOWFLAKE_USERNAME,
  AWS_REGION
} = require('../../util/config');

const privateKey = fs.readFileSync(SNOWFLAKE_PRIVATE_KEY, 'utf8');

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

export default withIronSessionApiRoute(
  /**
   * Saves the property listing to the database.
   */
  async function handler(req, res) {
    let property = req.body;
    const user = req.session.user;
    let skyflowId = user.fields.skyflow_id;

    console.log(property);

    var connection = snowflake.createConnection({
      account: SNOWFLAKE_ACCOUNT_NAME,
      username: SNOWFLAKE_USERNAME,
      authenticator: 'SNOWFLAKE_JWT',
      privateKey: privateKey,
      application: 'skyflow_data_privacy_vault',
      clientSessionKeepAlive: true,
    });

    // Try to connect to Snowflake, and check whether the connection was successful.
    connection.connect( 
      function(err, conn) {
          if (err) {
            console.error('Unable to connect: ' + err.message);
          } 
          else {
            console.log('Successfully connected to Snowflake.');
            let sql = `insert into TEST.TEST_SCHEMA.barnbnb_property_listings (skyflow_id, property_name, street_address, city, state, zip_code, cost_per_night, description) values ('${skyflowId}', '${escapeQuotes(property.name)}', '${property.address}', '${property.city}', '${property.state}', '${property.zip}', ${property.cost}, '${escapeQuotes(property.description)}')`;
            console.log(sql);

            const queryResult = connection.execute({
              sqlText: sql,
              complete: (err, stmt, rows) => {
                if (err) {
                  console.log(err.message)
                } else {
                  console.log(`event is sent to Snowflake`)
                }
              }
            });
          }
      }
    );

    // Load the AWS SDK for Node.js
    var AWS = require('aws-sdk');
    // Set the region 
    AWS.config.update({
      region: AWS_REGION,
      apiVersion: 'latest'
    });

    // Create the DynamoDB service object
    var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    var params = {
      TableName: 'barnbnb_property_listings',
      Item: {
        manager_id: {S: skyflowId},
        property_name: {S: property.name},
        street_address: {S: property.address},
        city: {S: property.city},
        state: {S: property.state},
        zip_code: {S: property.zip},
        cost_per_night: {S: property.cost},
        description: {S: property.description}
      }
    };

    // Call DynamoDB to add the item to the table
    ddb.putItem(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });

    res.send({ ok: true });
  }, ironOptions,
);