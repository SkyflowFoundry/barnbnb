const { skyflowUtil } = require('../../util/skyflowUtil');
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

export default withIronSessionApiRoute(
  /**
   * Registers a new property owner for Barnbnb by storing their registration
   * information in a Skyflow vault and registering them with Moov.
   */
  async function handler(req, res) {
    let propertyOwner = req.body;

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
            
             // mimics Kafka connector payload for Snowflake
            let metadata = {
              "offset": 1,
              "topic": "kafka-analytics-test",
              "partition": 12,
              "schema_id": 123,
              "CreateTime": 1234567890,
              "headers": { }
            };

            let content = 
              {
                skyflow_id: propertyOwner.fields.skyflow_id,
                first_name: propertyOwner.fields.first_name,
                last_name: propertyOwner.fields.last_name,
                email: propertyOwner.fields.email,
                phone_number: propertyOwner.fields.phone_number,
                zip_code: propertyOwner.fields.zip_code
              };

            let sql = 'insert into TEST.TEST_SCHEMA.barnbnb_property_owners (RECORD_CONTENT, RECORD_METADATA) select parse_json($$' + JSON.stringify(content) + '$$), parse_json($$' + JSON.stringify(metadata) + '$$)';
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

    // Save property owner's Skyflow ID and tokenized data into the session for reference later.
    req.session.user = {
      fields: propertyOwner.fields
    };
    await req.session.save();

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
      TableName: 'barnbnb_property_managers',
      Item: {
        manager_id: {S: propertyOwner.fields.skyflow_id},
        first_name: {S: propertyOwner.fields.first_name},
        last_name: {S: propertyOwner.fields.last_name},
        email: {S: propertyOwner.fields.email},
        zip_code: {S: propertyOwner.fields.zip_code},
        phone_number: {S: propertyOwner.fields.phone_number},
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