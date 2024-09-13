# Barnbnb
Like Airbnb but for your barn!

Barnbnb is a fictitious travel company that supports a marketplace for "barn curious" travelers to book a barn stay with a barn host. Barn hosts are paid based on successful stays at their barn.

This sample code represents the Barnbnb host signup experience. A host uses the application
to list their barn on Barnbnb. A Skyflow Data Privacy Vault stores all sensitive host data. Tokenized
data is sent downstream to DynamoDB and Snowflake. Moov's APIs are used for money movement between the
Instabread business account and the shopper.

This demo shows how to build a privacy-safe travel app.

# Data Privacy and Payments with an API

Instabread is a fictitious company that supports a marketplace for bread enthusiasts (Instabread clients) to shop for and order bread on-demand from the comfort of their homes. Instabread shoppers receive notifications about orders on their mobile device and travel to the stores to pick up and deliver the bread to the Instabread client. Shoppers are paid based on successful delivery of tasty tasty bread goods.

This sample code represents the Instabread shopper signup experience. A shopper uses the application
to become a gig worker for Instabread. A Skyflow Data Privacy Vault stores all sensitive shopper data. Tokenized
data is sent downstream to DynamoDB and Snowflake. Moov's APIs are used for money movement between the
Instabread business account and the shopper.

<p align="center">
  <img src="/images/barnbnb-overview.png" />
</p>

### What you'll need
* A Skyflow trial environment account. If you don't have one, you can register for one on the [Try Skyflow](https://skyflow.com/try-skyflow) page.
* A Moov account. If you don't have one, [sign up here](https://dashboard.moov.io/signup).
* A Snowflake account.
* An AWS account.

## Getting set up

### Get the starter code
In a terminal, clone the Barnbnb sample code to your project's working directory with the following command:

```shell
git clone https://github.com/SkyflowFoundry/barnbnb.git
```

### Understand the starter code

The project uses the Next.js framework. Navigate to the [**/barnbnb-host-experience**](/barnbnb-host-experience) directory within the repository and view its content. It has the following elements:

* **components**: this directory has reusable frontend components
* **pages**: this directory has the individual pages used in the Barnbnb host sign up application. [**index.js**](/barnbnb-host-experience/pages/index.js) is where the app begins
* **pages/api**: this directory has the backend Node.js code
* **public**: this directory has frontend static references like CSS and images
* **util**: this has utility files for session management
* **package.json, package-lock.json**: configuration files for dependencies and running the app

### Run the application

1. In a terminal, navigate to your project directory and open the **/barnbnb-host-experience** folder. Run the app with the following command:

```shell
npm install
npm run dev
```
2. From your browser, navigate to **http://localhost:3000** and you should see the initial Barnbnb host app page.
3. Click on the **Sign Up** button to view the account creation form. Submitting this form will not work as you need to first configure your vault, DynamoDB instance, Snowflake, and Moov.

## Skyflow Studio and API credentials

Skyflow Studio is a web-based app for creating and managing vaults.

### Create the Barnbnb vault

#### Prerequisites

Before you start,

* Log in to your Skyflow account

#### Create the Barnbnb vault

The Barnbnb vault schema defines the tables, columns, and privacy and security options for secure storage of an Instabread shopper account.

1. In the Vault Dashboard, click **Create Vault > Upload Vault Schema**.
1. Drag the [**/data/vault_schema.json**](/data/vaultSchema.json) file and click **Upload**.

#### Understand the schema

Once the vault is created, take a few minutes to explore the schema. There are two tables:
* **property_owners:** has columns representing a Barnbnb hostr account. This is similar to a traditional “users” or “customers” table in a database
* **property_owners_bank_information:** has columns representing the bank account information for the Barnbnb hosts

#### Download service account credentials

In Skyflow Studio, navigate to Service accounts and create a new service account with the role Vault Editor. This will downloads a credentials.json file.

#### Connecting Skyflow to Moov

To collect banking information and be able to make sure a host gets paid, you need to connect Skyflow to your Moov account.

### Create a Skyflow connection

Skyflow Connections is a gateway service that uses Skyflow's underlying tokenization capabilities to securely connect to first party and third party services. This way, your infrastructure is never directly exposed to sensitive data, and you offload security and compliance requirements to Skyflow.

You need to create a connection between Skyflow and Moov so you can pass stored PII to Moov without exposing your backend to the plaintext values.

To create the connection:

1. Open Skyflow Studio to your vault's schema view. Navigate to the Connections UI.
1. Click **Add connection** > **Start from scratch**.
1. Name the connection **Moov**. Optional: Enter a description.
1. Select **Outbound Connection** as the connection mode.
1. Set the Outbound Base URL to **https://api.moov.io** and click **Continue**.

#### Configure the Moov account route

You need to create two routes, one for creating a Moov account and the other for passing bank account data to Moov. Let's start with the Moov account.

To create an individual account with Moov directly, you make an API call:

```javascript
curl -X POST 'https://api.moov.io/accounts'
  -H 'Authorization: Bearer {token}' \
  -H "Content-Type: application/json" \
  -H "Origin: https://api.moov.io" \
  -data-raw '{
    "accountType": "individual",
    "profile": {
      "individual": {
        "name": {
           "firstName": "John",
           "lastName": "Doe",
        }
        "email": "john.doe@email.com",
      }
    },
    "capabilities": ["transfers"]
  }'
```

The Skyflow route has a similar structure, but instead of accepting the plaintext values for **firstName**, **lastName**, and **email**, the API expects Skyflow tokens.

1. Enter the route details including the name, description, path, method, and content type.
    1. **Name**: Moov Account Creation.
    1. **Path**: The path value is **/accounts**. When combined with the outbound base URL, it maps to Moov's API with the full path URL, [https://api.moov.io/accounts](https://api.moov.io/accounts).
    1. **Method**: Skyflow connections support the following http methods: PUT, POST, PATCH, GET, DELETE. For the  account creation, use the **POST** method.
    1. **Content Type**: Skyflow connections support the following content types: JSON, XML, X_WWW_FORM_URLENCODED. Select the raw and JSON content type.
2. Move down the page and complete the route mappings for the request body.

    The request body configures the specific fields in the request that Skyflow processes.  Currently, Skyflow supports two actions that can perform on a field: **Tokenization** and **Detokenization**.

    For this route, configure the connection to detokenize the request and extract the values associated with three fields: **profile.individual.name.firstName**, **profile.individual.name.lastName**, and **profile.individual.email**, like the example below. These field names map to the JSON structure that the Moov API expects in a create account call.

3. Click **Continue > Create Connection**.

#### Authenticate the connection-level service account

To authenticate to a connection endpoint and invoke it, Skyflow requires you to create a dedicated service account with the **Connection Invoker** role assigned to it. This keeps the identity of the client consuming the connection endpoint different from the identity of the service account or the user creating the connection.

Additionally, this means the service account can only make requests to the specific connection. It has no direct read or write access to the data in the vault.

1. Enter a name and description for your new service account like *Your Name* Moov Service Account.
1. Click **Create service account**.
1. Your browser downloads a credentials.json file containing your service account key. Store this file in a secure and accessible location.
1. Click **Finish**.

#### Configure the Moov bank account route

Next create another route to support bank account creation.

1. Select **Connections**, find the Moov connection and click **Edit**.
2. Go to **Route** and click **+ Add route**.
3. Enter the route details including the name, description, path, method, and content type.
    1. **Name**: Enter “Moov Bank Account Creation”
    1. **Path**: **/accounts/{account_id}/bank-accounts**
    1. **Method**: Use the **POST** method.
    1. **Content Type**: Raw and JSON.
4. Scroll down the page and complete the route mappings for the **Request body**.
   For this route, configure the connection to detokenize the request and extract the values associated with three fields: **account.holderName**, **account.accountNumber**, and **account.routingNumber**, like the below example:
5. Click **Save Route** and then click **Save**.

### Complete configuration

1. In DynamoDB, create two tables called **barnbnb_property_owners** and **barnbnb_property_listings**. The first will store tokenized data collected from the app. The second will store plaintext property listing data.
1. In Snowflake, create a table called **barnbnb_property_owners** with two VARCHAR fields **RECORD_CONTENT** and **RECORD_METADATA**. Create another table called **barnbnb_property_listings** with fields: 
    1. skyflow_id (VARCHAR)
    1. property_name (VARCHAR)
    1. street_address (VARCHAR)
    1. city (VARCHAR)
    1. state (VARCHAR)
    1. zip_code (VARCHAR)
    1. cost_per_night (FLOAT)
    1. description (VARCHAR)
1. In the [**/barnbnb-host-experience**](/barnbnb-host-experience) folder, find [**.env.constants**](/barnbnb-host-experience/.env.constants) and rename this file to .env.
1. Open this file and replace all the placeholder values with the correct values from your vault, Snowflake, DynamoDB, and Moov.

### Test the result

From the your terminal, navigate to the [**/barnbnb-host-experience**](/barnbnb-host-experience) directory and enter the following command:

```shell
npm run dev
```

1. Navigate to http://localhost:3000 in your browser.
1. Go through the various screens until you reach the Set up direct deposit page.
    1. Fill in the Holder name with anything you wish.
    1. For the Routing number, enter 322271627, which is Chase Bank's routing number.
    1. For the Account number, enter 0004321567000, which is a valid test bank account number for Moov.

### Further reading

* Learn more about how to govern access to your vault with the [Data governance overview](https://docs.skyflow.com/data-governance-overview/) guide.
* Review additional information about connecting to third-party systems with the [Connections overview](https://docs.skyflow.com/connections-overview/) guide.
* Check out the [Security best practices checklist](https://docs.skyflow.com/security-best-practices-checklist/) to learn more about how to keep data secure.

### Reference docs

* Skyflow:
    * [Insert Record](https://docs.skyflow.com/record/#RecordService_InsertRecord)
* Moov:
    * [Create account](https://docs.moov.io/api/#operation/createAccount)
    * Create [bank account](https://docs.moov.io/api/#operation/bankAccount)
    * [Create a transfer](https://docs.moov.io/api/#operation/createTransfer)
    * [Get payment methods](https://docs.moov.io/api/#tag/Payment-methods)