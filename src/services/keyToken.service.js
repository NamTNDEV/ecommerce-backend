const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      /*Low level

      const tokens = await keyTokenModel.create({
        user: userId,
        privateKey,
        publicKey,
      });
      return tokens ? tokens.publicKey : null; */

      //High level
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUser: [], refreshToken },
        options = {
          upsert: true,
          new: true,
        };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
