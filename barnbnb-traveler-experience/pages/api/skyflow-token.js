const { ironOptions } = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';
const { generateBearerToken } = require('skyflow-node');

const {
  SERVICE_ACCOUNT_FILE
} = require('../../util/config');

export default withIronSessionApiRoute(
  async function handler(req, res) {
    let authToken = await generateBearerToken(SERVICE_ACCOUNT_FILE);

    res.send({ accessToken: authToken.accessToken });
  }, ironOptions,
);