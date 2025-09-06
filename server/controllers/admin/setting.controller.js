const SettingWebsiteInfo = require("../../models/setting-website-info.model");
const Role = require("../../models/role.model");
const AccountAdmin = require("../../models/account-admin.model");

const permissionConfig = require("../../config/permission");
const bcrypt = require("bcryptjs");
const { model } = require("mongoose");

module.exports.list = async (req, res) => {
  res.render("admin/pages/setting-list", {
    pageTitle: "Cài đặt chung"
  })
};

module.exports.websiteInfo = async (req, res) => {

  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

  res.render("admin/pages/setting-website-info", {
    pageTitle: "Thông tin website",
    settingWebsiteInfo: settingWebsiteInfo,
  })
}

module.exports.websiteInfoPatch = async (req, res) => {
  if(req.files && req.files.logo){
    req.body.logo = req.files.logo[0].path; 
  }
  else{
    delete req.body.logo;
  }

  const settingWebsiteInfo = await SettingWebsiteInfo.findOne({});

  if(settingWebsiteInfo){
    await SettingWebsiteInfo.updateOne({
      _id: settingWebsiteInfo.id
    }, req.body);
  }
  else{
    const newRecord = new SettingWebsiteInfo(req.body);
    await newRecord.save();
  }

  req.flash("success", "Cập nhật thành công!");

  res.json({
    code: "success"
  })
}

module.exports.accountAdmin = async (req, res) => {
  const accountAdminList = await AccountAdmin
   .find({
    deleted: false
   })
   .sort({ 
    createdAt: "desc" 
  });
  
  for(const item of accountAdminList) {
    if(item.role){
      const roleIfo = await Role.findOne({
        _id: item.role
      });

      if(roleIfo) {
        item.roleName = roleIfo.roleName;
      }
    }

    }

    res.render("admin/pages/setting-account-admin-list", {
      pageTitle: "Quản trị viên",
      accountAdminList: accountAdminList,
    })
}





