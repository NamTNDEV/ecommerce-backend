const apiKeyModel = require("../models/apiKey.model");

const findById = async (key) => {
  //   const newObjectKey = await apiKeyModel.create({
  //     key: "2002",
  //     permissions: ["0000"],
  //   });
  //   console.log("newObjectKey::", newObjectKey);
  const object = await apiKeyModel
    .findOne({ key: "2002", status: true })
    .lean();
  return object;
};

module.exports = {
  findById,
};
