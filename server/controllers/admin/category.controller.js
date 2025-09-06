const moment = require("moment");
const Category = require("../../models/category.model");
const categoryHelper = require("../../helpers/category.helper");
const AccountAdmin = require("../../models/account-admin.model");

// giao diện danh sách danh mục
module.exports.list = async (req, res) => {

  const find = {
    deleted: false,
  };
  
  const categoryList = await Category.find(find)
  .sort({
    position: "asc"
  });
  

  for (const item of categoryList) {
    if(item.createdBy) {
      const infoAccountCreated = await AccountAdmin.findOne({
        _id: item.createdBy
      });

      item.createdByFullName = infoAccountCreated.fullName;
    }
      
      if(item.updatedBy) {
      const infoAccountUpdated = await AccountAdmin.findOne({
        _id: item.updatedBy
      });

      item.updatedByFullName = infoAccountUpdated.fullName;
    }
    
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
    item.updatedAtAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
  };

  // Danh sách tài khoản quản trị
  const accountAdminList = await AccountAdmin.find({
  })
  .select("id fullName email");
  // Hết Danh sách tài khoản quản trị

  res.render("admin/pages/category-list.pug", {
    pageTitle: "Quản lý danh mục",
    categoryList: categoryList,
    accountAdminList: accountAdminList
  })
};

// giao diện tạo danh mục
module.exports.create = async (req, res) => {
  const categoryList = await Category.find({
    deleted: false
  });

  const categoryTree = categoryHelper.buildCategoryTree(categoryList);
  
  res.render("admin/pages/category-create.pug", {
    pageTitle: "Tạo danh mục",
    categoryList: categoryTree
  });
};

// Chức năng tạo danh mục
module.exports.createPost = async (req, res) => {
  if(req.body.position) {
    req.body.position = parseInt(req.body.position)
  }else {
    const totalRecord = await Category.countDocuments({});
    req.body.position = totalRecord + 1;
  };

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  req.body.avatar = req.file ? req.file.path : "";

  const newRecord = new Category(req.body);
  await newRecord.save();

  req.flash('success', 'Tạo danh mục thành công!');
  
  res.json({
    code: "success",
  })
};