require('dotenv').config();

// Constants for making Skyflow API calls
const SKYFLOW_VAULT_API_URL = process.env.SKYFLOW_VAULT_API_URL;
const SERVICE_ACCOUNT_FILE = process.env.SERVICE_ACCOUNT_FILE;
const CONNECTIONS_SERVICE_ACCOUNT = process.env.CONNECTIONS_SERVICE_ACCOUNT;
const SNOWFLAKE_PRIVATE_KEY = process.env.SNOWFLAKE_PRIVATE_KEY;
const SNOWFLAKE_ACCOUNT_NAME = process.env.SNOWFLAKE_ACCOUNT_NAME;
const SNOWFLAKE_USERNAME = process.env.SNOWFLAKE_USERNAME;

const AWS_REGION = process.env.AWS_REGION;

// Cookie configuration for iron-session
const COOKIE_NAME = process.env.COOKIE_NAME;
const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;

const MOOV_SECRET_KEY = process.env.MOOV_SECRET_KEY;
const MOOV_PUBLIC_KEY = process.env.MOOV_PUBLIC_KEY;
const MOOV_ACCOUNT_ID = process.env.MOOV_ACCOUNT_ID;
const MOOV_DOMAIN = process.env.MOOV_DOMAIN;

module.exports = {
  SKYFLOW_VAULT_API_URL,
  SERVICE_ACCOUNT_FILE,
  CONNECTIONS_SERVICE_ACCOUNT,
  COOKIE_NAME,
  COOKIE_PASSWORD,
  MOOV_SECRET_KEY,
  MOOV_PUBLIC_KEY,
  MOOV_ACCOUNT_ID,
  AWS_REGION,
  MOOV_DOMAIN,
  SNOWFLAKE_PRIVATE_KEY,
  SNOWFLAKE_ACCOUNT_NAME,
  SNOWFLAKE_USERNAME
};