const SettingWebsiteInfo = require("../../models/setting-website-info.model");
const Role = require("../../models/role.model");
const AccountAdmin = require("../../models/account-admin.model");
const moment = require("moment");

const permissionConfig = require("../../config/permission");
const bcrypt = require("bcryptjs");

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

   if(req.files && req.files.favicon) {
    req.body.favicon = req.files.favicon[0].path;
  } else {
    delete req.body.favicon;
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
  const find = {
     deleted: false,
  };

  if(req.query.status) {
    find.status = req.query.status
  };

  // Lọc theo ngày tạo
  const dataFilter = {};

  if(req.query.startDate) {
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    dataFilter.$gte = startDate;
  };

   if(req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf("date").toDate();
    dataFilter.$lte = endDate;
  };

  
  if(Object.keys(dataFilter).length > 0) {
    find.createAt = dataFilter;
  };

  // hàm toDate() được dùng để chuyển một đối tượng Moment về đối tượng Date chuẩn của JavaScript.
  // const jsDate = momentDate.toDate();
  // console.log(jsDate);
  // Fri Sep 12 2025 10:30:00 GMT+0700 (Indochina Time)

  // Hết lọc theo ngày tạo

  if(req.query.permission) {
    find.role = req.query.permission;
  };

  // pagination
  const limitItems = 3;
  let page = 1;

  if(req.query.page) {
    let currentPage = parseInt(req.query.page);
    if(currentPage > 0) {
      page = currentPage;
    };
  }

  const totalRecord = await AccountAdmin.countDocuments({
    deleted: false
  });

  const totalPage = Math.ceil(totalRecord / limitItems);
  if(page > totalPage ) {
    page = totalPage
  };

  if(totalRecord === 0) {
    page = 1;
  };

  const skip = (page - 1) * limitItems;
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage,
  };
  // End pagination

  const accountAdminList = await AccountAdmin.find(find).sort({
    createAt: "desc"
  })
  .limit(limitItems)
  .skip(skip)
  ;

  for (const item of accountAdminList) {
    if(item.role) {
      const roleInfo = await Role.findOne({
        _id: item.role
      });

      if(roleInfo) {
        item.roleName = roleInfo.name;
      }
    }
  }

  // Danh sách nhóm quyền
  const roleList = await Role.find({});
  
  res.render("admin/pages/setting-account-admin-list", {
    pageTitle: "Tài khoản quản trị",
    accountAdminList: accountAdminList,
    roleList: roleList,
    pagination: pagination
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

module.exports.accountAdminCreatePost = async (req, res) => {
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

  req.flash("success", "Tạo tài khoản quản trị thành công!");

  res.json({
    code: "success",
  })
  
  
}

module.exports.accountAdminEdit = async (req, res) => {
  try {
      const roleList = await Role.find({
      deleted: false
    });
    
    const id = req.params.id;
    const accountAdminDetail = await AccountAdmin.findOne({
      _id: id,
      deleted: false
    });

      if(!accountAdminDetail) {
        res.redirect(`/${pathAdmin}/setting/account-admin/list`);
        return;
      }

    res.render("admin/pages/setting-account-admin-edit", {
      pageTitle: "Sửa tài khoản quản trị",
      roleList: roleList,
      accountAdminDetail: accountAdminDetail
    })
  } catch (error) {
    res.redirect(`/${pathAdmin}/setting/account-admin/list`);
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

module.exports.accountAdminDeletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await AccountAdmin.updateOne({
      _id: id
    },{
      deleted: true,
      deletedAt: Date.now(),
      deletedBy: req.account.id
    });
  
    req.flash("success", "Xóa tài khoản quản trị thành công!");
    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    });
  }
};

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

module.exports.roleDeletePatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    await Role.updateOne({
      _id: id,
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    });
    
    req.flash("success", "Xóa nhóm quyền thành công!");

    res.json({
      code: "success",
    })

  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }

}


module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;
    
    switch (option) {
      case "delete":
        await Role.updateMany({
          _id: { $in: ids}
        }, {
          deleted: true,
          deletedBy: req.account.id,
          deletedAt: Date.now()
        })
        break;
    };

    req.flash("success", "Xóa nhóm quyền thành công!");
    
    res.json({
      code: "success"
    });
    
  } catch (error) {
    res.json({
      code: "error",
      message: "Lỗi"
    })
  }

}

