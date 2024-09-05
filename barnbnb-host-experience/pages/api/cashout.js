const { ironOptions } = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';
import { Moov, SCOPES } from '@moovio/node';
const axios = require('axios');

const {
  MOOV_SECRET_KEY,
  MOOV_PUBLIC_KEY,
  MOOV_ACCOUNT_ID,
  MOOV_DOMAIN,
  MOOV_BUSINESS_PAYMENT_METHOD_ID
} = require('../../util/config');

const moov = new Moov({
  accountID: MOOV_ACCOUNT_ID,
  publicKey: MOOV_PUBLIC_KEY,
  secretKey: MOOV_SECRET_KEY,
  domain: MOOV_DOMAIN
});

export default withIronSessionApiRoute(
  async function handler(req, res) {
    console.log(req.session.moovAccountId);
    // Get the source payment method ID. The source is the Instabread business account.
    const businessPaymentMethodId = await getPaymentMethodId(MOOV_ACCOUNT_ID,
    'ach-debit-fund');

    console.log(businessPaymentMethodId);

    // Get the destination payment method ID. The destination is the shopper's account.
    const destinationPaymentMethodId = await getPaymentMethodId(req.session.moovAccountId,
      'ach-credit-standard');

    console.log(destinationPaymentMethodId);

    // Set the scopes for a transfer.
    await moov.generateToken([SCOPES.TRANSFERS_WRITE, SCOPES.BANK_ACCOUNTS_READ],
      req.session.moovAccountId);

    const transfer = {
      source: { paymentMethodID: businessPaymentMethodId },
      destination: { paymentMethodID: destinationPaymentMethodId },
      amount: {
        value: 44200, // $442.00
        currency: 'USD'
      },
      description: 'Barnbnb host earnings'
    };

    // Execute the transfer from Instabread to the shopper.
    await moov.transfers.create(transfer);

    res.send({ ok: true });
  }, ironOptions,
);

/**
 * Uses the Moov payment methods API to get the payment method IDs required for carrying out a
 * transaction.
 * @param {string} accountId The account owner Moov ID.
 * @param {string} paymentMethodType The payment method type to match on.
 * @returns A payment method ID that matches the paymentMethodType.
 */
async function getPaymentMethodId(accountId, paymentMethodType) {
  let apiUrl = `https://api.moov.io/accounts/${accountId}/payment-methods`;
  try {
    let moovAuthToken = await moov.generateToken([SCOPES.PAYMENT_METHODS_READ], accountId);

    console.log(moovAuthToken);

    const response = await axios.get(apiUrl, { 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + moovAuthToken.token,
        'Origin': MOOV_DOMAIN
      }
    });

    // Loop over the result and match on the payment method type.
    for(let i = 0; i < response.data.length; i++) {
      if(response.data[i].paymentMethodType === paymentMethodType) {
        return response.data[i].paymentMethodID;
      }
    }
  } catch(e) {
    console.dir(JSON.stringify(e));
  }

  return false;
}