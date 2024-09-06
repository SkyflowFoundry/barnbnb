const { skyflowUtil } = require('../../util/skyflowUtil');
const { ironOptions } = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';

const stores = [
  {
    store_id: 1,
    store_name: 'Safeway',
    street_address: '1343 Taravel Street',
    city: 'San Francisco',
    state: 'California',
    zip_code: '94113'
  },
  {
    store_id: 2,
    store_name: 'Lucky\'s Supermarket',
    street_address: '4502 Sloat Avenue',
    city: 'San Francisco',
    state: 'California',
    zip_code: '94113'
  },
  {
    store_id: 3,
    store_name: 'Wholefoods',
    street_address: '457 Water Street',
    city: 'San Francisco',
    state: 'California',
    zip_code: '94113'
  },
  {
    store_id: 4,
    store_name: 'Trae Joes',
    street_address: '96523 John Daly',
    city: 'San Francisco',
    state: 'California',
    zip_code: '94113'
  },
]

export default withIronSessionApiRoute(
  /**
   * Shopper chooses which stores they want to buy bread from.
   * Data is stored in the vault since it could be used to
   * figure out the neighborhood someone lives in.
   */
  async function handler(req, res) {
    const user = req.session.user;
    let skyflowId = user.fields.skyflow_id;

    res.send({ ok: true });
  }, ironOptions,
);