const { skyflowUtil } = require('../../util/skyflowUtil');
const { ironOptions } = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';
import { Moov, SCOPES } from '@moovio/node';

const {
  MOOV_SECRET_KEY,
  MOOV_PUBLIC_KEY,
  MOOV_ACCOUNT_ID,
  MOOV_DOMAIN
} = require('../../util/config');

const moov = new Moov({
  accountID: MOOV_ACCOUNT_ID,
  publicKey: MOOV_PUBLIC_KEY,
  secretKey: MOOV_SECRET_KEY,
  domain: MOOV_DOMAIN
});

export default withIronSessionApiRoute(
  /**
   * Gets the Moov account ID based on the Skyflow ID stored in the session.
   * Generates an API token for Moov and passes the account ID and token
   * back to the client for client side calls.
   */
  async function handler(req, res) {
    const user = req.session.user;
    let skyflowId = user.fields.skyflow_id;

    // Retrieve shopper data to get Moov account ID.
    let shopper = await skyflowUtil.get('shoppers', skyflowId, {
      fields: ['moov_account_id']}
    );

    const accountId = shopper.fields.moov_account_id;
    console.log('account id: ' + accountId);

    // let { token } = await moov.generateToken([SCOPES.ACCOUNTS_CREATE,
    //   SCOPES.BANK_ACCOUNTS_READ,
    //   SCOPES.BANK_ACCOUNTS_WRITE,
    //   SCOPES.PAYMENT_METHODS_READ,
    //   SCOPES.PROFILE_READ], accountId);

    let { token } = await moov.generateToken([SCOPES.ACCOUNTS_CREATE,
      SCOPES.BANK_ACCOUNTS_READ,
      SCOPES.BANK_ACCOUNTS_WRITE,
      SCOPES.CARDS_READ,
      SCOPES.CARDS_WRITE,
      SCOPES.CAPABILITIES_READ,
      SCOPES.CAPABILITIES_WRITE,
      SCOPES.DOCUMENTS_READ,
      SCOPES.DOCUMENTS_WRITE,
      SCOPES.PAYMENT_METHODS_READ,
      SCOPES.PROFILE_ENRICHMENT_READ,
      SCOPES.PROFILE_READ,
      SCOPES.PROFILE_WRITE,
      SCOPES.REPRESENTATIVE_READ,
      SCOPES.REPRESENTATIVE_WRITE,
      SCOPES.TRANSFERS_READ,
      SCOPES.TRANSFERS_WRITE,
      SCOPES.WALLETS_READ,
      SCOPES.FED_READ,
      SCOPES.PING], accountId);

    console.log(token);

    res.send({ ok: true, accountId: accountId, accessToken: token });
  }, ironOptions,
);