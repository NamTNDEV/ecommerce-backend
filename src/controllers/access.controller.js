const {
  CreatedSuccessResponse,
  SuccessResponse,
} = require("../core/success.response");
const AccessServiceSimple = require("../services/access_simple.service");

class AccessController {
  signUp = async (req, res) => {
    new CreatedSuccessResponse({
      message: "Registered OK!",
      metadata: await AccessServiceSimple.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  signIn = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessServiceSimple.signIn(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
