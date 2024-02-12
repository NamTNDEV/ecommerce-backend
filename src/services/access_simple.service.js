const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getIntoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const roleShop = {
  shop: "SHOP",
  writer: "WRITER",
  editor: "EDITOR",
  admin: "ADMIN",
};

class AccessServiceSimple {
  static signIn = async ({ email, password, refreshToken = null }) => {
    // 1 - check email in db
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered");

    // 2 - match password
    const isMatch = bcrypt.compare(password, foundShop.password);
    if (!isMatch) throw new AuthFailureRequest("Authentication error");

    // 3 - create AT and RT and save
    // 4 - generate tokens
    // 5 - get data return login
  };

  static signUp = async ({ name, email, password }) => {
    //Step 1: Check email is existed
    const holderShop = await shopModel
      .findOne({ email })
      .collation({ locale: "en", strength: 2 })
      .lean();

    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHashed,
      roles: [roleShop.shop],
    });

    if (newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const userIdString = newShop._id.toString();
      const keySotre = await KeyTokenService.createKeyToken({
        userId: userIdString,
        publicKey,
        privateKey,
      });

      if (!keySotre) {
        return {
          code: "xxxx",
          message: "keySotre error!!!",
        };
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getIntoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    } else {
      return {
        code: 200,
        metadata: null,
      };
    }
  };
}

module.exports = AccessServiceSimple;
