const { ironOptions } = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';
const { generateBearerToken } = require('skyflow-node');

const {
  SERVICE_ACCOUNT_FILE
} = require('../../util/config');

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const user = req.session.user;
    let skyflowId = user.fields.skyflow_id;

    res.send({ skyflowId: skyflowId });
  }, ironOptions,
);