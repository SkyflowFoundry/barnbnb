const { ironOptions } = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';
import { Moov, SCOPES } from '@moovio/node';
const axios = require('axios');
const { generateBearerToken } = require('skyflow-node');

const {
  CONNECTIONS_SERVICE_ACCOUNT,
  MOOV_ACCOUNT_ID,
  MOOV_PUBLIC_KEY,
  MOOV_SECRET_KEY,
  MOOV_DOMAIN
} = require('../../util/config');

const moov = new Moov({
  accountID: MOOV_ACCOUNT_ID,
  publicKey: MOOV_PUBLIC_KEY,
  secretKey: MOOV_SECRET_KEY,
  domain: MOOV_DOMAIN
});

/**
 * Creates a Moov bank account for the property own using the stored bank account tokens. The tokens are
 * sent to a Skyflow Connection and the connection detokenizes the tokens and passes the values
 * securely to Moov to register the account.
 */
export default withIronSessionApiRoute(
  async function handler(req, res) {
    let propertyOwnerBankInformation = req.body;
    const moovAccountId = req.session.moovAccountId;
    
    // Generate Moov auth token, this is a passthrough for the Skyflow Connection call.
    let moovAuthToken = await moov.generateToken([SCOPES.BANK_ACCOUNTS_READ,
      SCOPES.BANK_ACCOUNTS_WRITE], moovAccountId);

    // Body for the API call to Skyflow Connections. The individual values here are tokens.
    const body = {
      account: {
        holderName: propertyOwnerBankInformation.fields.account_holder_name,
        holderType: 'individual',
        accountNumber: propertyOwnerBankInformation.fields.bank_account_number,
        routingNumber: propertyOwnerBankInformation.fields.bank_routing_number,
        bankAccountType: 'checking'
      }
    };

    // The Skyflow API bearer token for the Skyflow Connection to Moov.
    let authToken = await generateBearerToken(CONNECTIONS_SERVICE_ACCOUNT);

    // The Connection route URL to create the Moov bank account for the property owner.
    let connectionsRouteUrl = `https://ebfc9bee4242.gateway.skyflowapis.com/v1/gateway/outboundRoutes/a1f87726bfc8425b9bcc2d3424c884ca/accounts/${moovAccountId}/bank-accounts`;
    try {
      const response = await axios.post(connectionsRouteUrl, body, { 
        headers: {
          'Content-Type': 'application/json',
          'X-Skyflow-Authorization': authToken.accessToken,
          'Authorization': 'Bearer ' + moovAuthToken.token,
          'Origin': MOOV_DOMAIN
        }
      });
    } catch(e) {
      console.dir(JSON.stringify(e));
    }

    res.send({ ok: true });
  }, ironOptions,
);