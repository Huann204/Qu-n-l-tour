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
}

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

module.exports.accountAdminList = async (req, res) => {
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

module.exports.accountAdminCreate = async (req, res) => {
  const roleList = await Role.find({
    deleted: false
  })

  res.render("admin/pages/setting-account-admin-create", { 
    pageTitle: "Tạo tài khoản quản trị",
    roleList: roleList
  })
}

module.exports.accountAdmincreatePost = async (req, res) => {
  const exitsAccount = await AccountAdmin.findOne({
    email: req.body.email
  })

  if(exitsAccount) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
    })
    return;
  }

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  req.body.avatar = req.file ? req.file.path : "";

  // Mã hóa mật khẩu với bcrypt
  const salt = await bcrypt.genSalt(10);    // Tạo ra chuỗi ngẫu nhiên 10 ký tự
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const newAccount = new AccountAdmin(req.body);
  await newAccount.save();

  console.log(req.body);
  console.log(req.file);

  req.flash("success", "Tạo tài khoản quản trị thành công!");

  res.json({
    code: "success",
  })
  
  
}

module.exports.accountAdminEdit= async (req, res) => {
  try {
    const roleList = await Role.find({
      deleted: false
    })
  
    const id = req.params.id;
    const accountAdminDetail = await AccountAdmin.findOne({
      _id: id,
      deleted: false
    })
  
    if(accountAdminDetail) {
      res.render("admin/pages/setting-account-admin-edit", { 
        pageTitle: "Chỉnh sửa tài khoản quản trị",
        roleList: roleList,
        accountAdminDetail: accountAdminDetail
      })
    }else{
      res.redirec(`/${pathAdmin}/setting/account-admin/list`);
      return;
    }
  }catch(error) {
    res.redirec(`/${pathAdmin}/setting/account-admin/list`);
  }
}

module.exports.accountAdminEditPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.updatedBy = req.account.id;
    if(req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }
    
    // Mã hóa mật khẩu với bcrypt
    if(req.body.password) {
      const salt = await bcrypt.genSalt(10); // Tạo salt - Chuỗi ngẫu nhiên có 10 ký tự
      req.body.password = await bcrypt.hash(req.body.password, salt); // Mã hóa mật khẩu
    }

    await AccountAdmin.updateOne({
      _id: id,
      deleted: false
    }, req.body);

    req.flash('success', 'Cập nhật tài khoản quản trị thành công!');

    res.json({
      code: "success"
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/setting/account-admin/list`);
  }
}

module.exports.accountAdminChangeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch(option) {
      case "active":
      case "inactive":
        await AccountAdmin.updateMany({
          _id: { $in: ids }
        }, {
          status: option
        });
        req.flash("success", "Đổi trạng thái thành công!");
        break;
      case "delete":
        await AccountAdmin.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deletedAt: Date.now()
        });
        req.flash("success", "Xóa thành công!");
        break;
    }

  res.json({
    code: "success"
  })
  }catch(error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thống!"
    })
  }
}


module.exports.roleList = async (req, res) => {
  const roleList = await Role.find({
    deleted: false,
  })

  res.render("admin/pages/setting-role-list", { 
    pageTitle: "Nhóm quyền",
    roleList: roleList
  })
}

module.exports.roleCreate = async (req, res) => {


  res.render("admin/pages/setting-role-create", { 
    pageTitle: "Tạo nhóm quyền",
    permissionList: permissionConfig.permissionList,
  })
}

module.exports.roleCreatePost = async (req, res) => {
  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;

  const newRecord = new Role(req.body);
  await newRecord.save();
  
  req.flash("success", "Tạo nhóm quyền thành công!");

  res.json({
    code: "success"
  })
}

module.exports.roleEdit = async (req, res) => {
  try {
    const id = req.params.id;

    const roleDetail = await Role.findOne({
      _id: id,
      deleted: false
    })

    if(roleDetail) {
      res.render("admin/pages/setting-role-edit", { 
        pageTitle: "Chỉnh sửa nhóm quyền",
        permissionList: permissionConfig.permissionList,
        roleDetail: roleDetail
        
      })
    }else {
      res.redirec(`/${pathAdmin}/setting/role/list`);
    }
  
    
  }catch(error) {
    res.redirec(`/${pathAdmin}/setting/role/list`);
  }
 
}

module.exports.roleEditPatch = async (req, res) => {
  try {

    const id = req.params.id;
    req.body.updatedBy = req.account.id;
    
    await Role.updateOne({
      _id: id,
      deleted: false
    }, req.body)

    req.flash("success", "Cập nhật nhóm quyền thành công!");

    res.json({
      code: "success"
    })
  }catch(error) {
    res.json({
      code: "error",
      message: "Id không tồn tại!"
    })
  }
 
}



