const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    websiteName: String,
    phone: String,
    email: String,
    address: String,
    logo: String,
    favicon: String,
  }
);

const SettingWebsiteInfo = mongoose.model('SettingWebsiteInfo', schema, "setting-website-info");

module.exports = SettingWebsiteInfo;