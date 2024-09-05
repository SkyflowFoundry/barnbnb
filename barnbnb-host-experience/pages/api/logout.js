const {ironOptions} = require('../../util/ironOptions');
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  function logoutRoute(req, res) {
    console.log('logging out');
    req.session.destroy();
    
    
  }, ironOptions,
);