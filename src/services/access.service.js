const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
      const holderShop = await shopModel.findOne({ email }).lean();

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
        });

        console.log({ privateKey, publicKey });
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
