const SettingWebsiteInfo = require("../../models/setting-website-info.model");

module.exports.WebisteInfo = async (req, res, next) => {
  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

  res.locals.settingWebsiteInfo = settingWebsiteInfo
  next();
}