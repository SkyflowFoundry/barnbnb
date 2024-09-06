const { skyflowUtil } = require('./skyflowUtil');

const {
  MOOV_SECRET_KEY,
  MOOV_PUBLIC_KEY,
  MOOV_ACCOUNT_ID,
  MOOV_DOMAIN
} = require('./config');

let zip_codes = ['94110', '94111', '94112', '94113', '94114', '94115', '94116', '94117', '94118', '94119', '94120'];

var snowflake = require('snowflake-sdk');

let shoppers = require('./vault_data.json');

console.log('shopper records: ' + shoppers.length);

main();

async function main() {
// console.log('{ people: [');
  for(let c = 0; c < 10; c++) {
    for(let i = 0; i < shoppers.people.length; i++) {
      // console.log(shoppers.people[i]);
      let shopper = await skyflowUtil.insert('shoppers', [ shoppers.people[i] ]);
    
      // console.log(shopper);
    
      await insertTokens(shopper[0]);
    }
  }
}

function insertTokens(shopper) {
  var connection = snowflake.createConnection({
    account: 'sz84174.us-east-2.aws',
    username: 'thefalc',
    password: 'FPTvTDManGkQ2DB',
    authenticator: 'SNOWFLAKE',
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
            // Optional: store the connection ID.
            // connection_ID = conn.getId();
            }
    }
  );
  
  let metadata = {
      "offset": 1,
      "topic": "kafka-analytics-test",
      "partition": 12,
      "schema_id": 123,
      "CreateTime": 1234567890,
      "headers":
      {
  
      }
    };
  
    let content = 
      {
        skyflow_id: shopper.skyflow_id,
        first_name: shopper.tokens.first_name,
        last_name: shopper.tokens.last_name,
        email: shopper.tokens.email,
        phone_number: shopper.tokens.phone_number,
        zip_code: shopper.tokens.zip_code
      };
  
      let sql = 'insert into TEST.TEST_SCHEMA.INSTABREAD_CUSTOMERS (RECORD_CONTENT, RECORD_METADATA) select parse_json($$' + JSON.stringify(content) + '$$), parse_json($$' + JSON.stringify(metadata) + '$$)';
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
  
  // Load the AWS SDK for Node.js
  // var AWS = require('aws-sdk');
  // // Set the region 
  // AWS.config.update({
  //   region: 'us-east-2',
  //   apiVersion: 'latest'
  // });
  
  // // Create the DynamoDB service object
  // var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
  
  // var params = {
  //   TableName: 'instabread_customers',
  //   Item: {
  //     customer_id: {S: shopper.skyflow_id},
  //     first_name: {S: shopper.tokens.first_name},
  //     last_name: {S: shopper.tokens.last_name},
  //     email: {S: shopper.tokens.email},
  //     zip_code: {S: shopper.tokens.zip_code},
  //     phone_number: {S: shopper.tokens.phone_number},
  //   }
  // };
  
  // // Call DynamoDB to add the item to the table
  // ddb.putItem(params, function(err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     console.log("Success", data);
  //   }
  // });
}
