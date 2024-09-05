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
 * Creates a Moov account for the property owner using the stored tokens for the host's first name,
 * last name, and email. The tokens are sent to a Skyflow connection and the connection
 * detokenizes the tokens and passes the values securely to Moov to register the account.
 */
export default withIronSessionApiRoute(
  async function handler(req, res) {
    const propertyOwner = req.session.user;

    // Body for the API call to Skyflow connections. The individual values here are tokens.
    const body = {
      accountType: 'individual',
      capabilities: ['transfers'],
      profile: {
        individual: {
          name: {
            firstName: propertyOwner.fields.first_name,
            lastName: propertyOwner.fields.last_name
          },
          email: propertyOwner.fields.email
        }
      }
    };

    // Generate Moov auth token, this is a passthrough for the Skyflow Connection call.
    let moovAuthToken = await moov.generateToken([SCOPES.ACCOUNTS_CREATE]);

    // The Skyflow API bearer token for the Skyflow connection to Moov.
    let authToken
        = await generateBearerToken(CONNECTIONS_SERVICE_ACCOUNT);

    // The connection route URL to create the Moov account.
    let connectionsRouteUrl = 'https://ebfc9bee4242.gateway.skyflowapis.com/v1/gateway/outboundRoutes/a1f87726bfc8425b9bcc2d3424c884ca/accounts';
    try {
      const response = await axios.post(connectionsRouteUrl, body, { 
        headers: {
          'Content-Type': 'application/json',
          'X-Skyflow-Authorization': authToken.accessToken,
          'Authorization': 'Bearer ' + moovAuthToken.token,
          'Origin': MOOV_DOMAIN
        }
      });

      // Save the Moov account ID to the session.
      req.session.moovAccountId = response.data.accountID;
      await req.session.save();
    } catch(e) {
      console.dir(e);
    }

    res.send({ ok: true, skyflowId: propertyOwner.fields.skyflow_id });
  }, ironOptions,
);