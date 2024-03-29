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

class AccessService {
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
        //Create privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        const userIdString = newShop._id.toString();
        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: userIdString,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "publicKeyString error!!!",
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyObject,
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

module.exports = AccessService;
