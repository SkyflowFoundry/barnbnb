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
    let guest = req.body;

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
                skyflow_id: guest.fields.skyflow_id,
                first_name: guest.fields.first_name,
                last_name: guest.fields.last_name,
                email: guest.fields.email,
                phone_number: guest.fields.phone_number
              };

            let sql = 'insert into TEST.TEST_SCHEMA.barnbnb_guests (RECORD_CONTENT, RECORD_METADATA) select parse_json($$' + JSON.stringify(content) + '$$), parse_json($$' + JSON.stringify(metadata) + '$$)';
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

    // Save guest's Skyflow ID and tokenized data into the session for reference later.
    req.session.user = {
      fields: guest.fields
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
      TableName: 'barnbnb_guests',
      Item: {
        guest_id: {S: guest.fields.skyflow_id},
        first_name: {S: guest.fields.first_name},
        last_name: {S: guest.fields.last_name},
        email: {S: guest.fields.email},
        phone_number: {S: guest.fields.phone_number},
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