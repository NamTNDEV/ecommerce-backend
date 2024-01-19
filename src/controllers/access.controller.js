const AccessServiceSimple = require("../services/access_simple.service");

class AccessController {
  signUp = async (req, res) => {
    return res.status(201).json(await AccessServiceSimple.signUp(req.body));
  };
}

module.exports = new AccessController();
