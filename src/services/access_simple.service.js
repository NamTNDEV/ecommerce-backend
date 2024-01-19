const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getIntoData } = require("../utils");

const roleShop = {
  shop: "SHOP",
  writer: "WRITER",
  editor: "EDITOR",
  admin: "ADMIN",
};

class AccessServiceSimple {
  static signUp = async ({ name, email, password }) => {
    try {
      //Step 1: Check email is existed
      const holderShop = await shopModel
        .findOne({ email })
        .collation({ locale: "en", strength: 2 })
        .lean();

      if (holderShop) {
        return {
          code: "xxxx",
          message: "The shop is already registered!",
        };
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
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessServiceSimple;
