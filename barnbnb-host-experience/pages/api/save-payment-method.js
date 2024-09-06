const { skyflowUtil } = require('../../util/skyflowUtil');
const { ironOptions } = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  /**
   * Updates the Skyflow record to include the Moov payment method ID.
   */
  async function handler(req, res) {
    let paymentMethod = req.body;

    console.log(paymentMethod);

    const user = req.session.user;
    let skyflowId = user.fields.skyflow_id;

    let record = {
      fields: {
        moov_payment_method_id: paymentMethod.paymentMethodId
      }
    }

    console.log(record);

    // Update Skyflow record to include the Moov payment method ID
    await skyflowUtil.update('shoppers', skyflowId, record);

    res.send({ ok: true });
  }, ironOptions,
);