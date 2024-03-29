const shopModel = require("../models/shop.model");

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1,
  },
}) => {
  const result = await shopModel.findOne({ email }).select(select).lean();
  return result;
};

module.exports = {
  findByEmail,
};
