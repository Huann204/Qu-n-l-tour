const CategoryBlog = require("../../models/category-blog.model");
const moment = require("moment");
const slugify = require('slugify');
const AccountAdmin = require("../../models/account-admin.model");


// giao diện trang quản lý danh mục tin tức
module.exports.list = async (req, res) => {
  const find = {
    deleted: false,
  };

  if(req.query.status) {
    find.status = req.query.status;
  };

  if(req.query.createdBy) {
    find.createdBy = req.query.createdBy;
  };

  const dateFilter = {};

  if(req.query.startDate) {    
    const startDate = moment(req.query.startDate).startOf("date").toDate();
    dateFilter.$gte = startDate;    
  };

   if(req.query.endDate) {
    const endDate = moment(req.query.endDate).endOf("date").toDate();
    dateFilter.$lte = endDate;    
  };
  // gte = greater than or equal
  // lte = less than or equal
  
  if(Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  };

  // Tìm kiếm
  if(req.query.keyword) {
    const keyword = slugify(req.query.keyword, {
      lower: true
    })

    const keywordRegex = new RegExp(keyword);
     find.slug = keywordRegex;

    // const keywordRegex = new RegExp(req.query.keyword, "i");
    // find.name = keywordRegex;
  }
  // Hết Tìm kiếm

  // Pagination
  const limitItems = 3;
  let page = 1;

  if(req.query.page) {
    const currentPage = parseInt(req.query.page);

    if(currentPage > 0) {
      page = currentPage;
    };
  };
  
  const totalRecord = await CategoryBlog.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems);

  if(page > totalPage) {
    page = totalPage
  };

  if(totalPage === 0) {
    page = 1;
  };
  
  const skip = (page - 1) * limitItems;
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage,
  }

  // End Pagination


  const CategoryBlogList = await CategoryBlog.find(find)
  .sort({
    position: "asc"
  })
  .limit(limitItems)
  .skip(skip)
  ;
  

  for (const item of CategoryBlogList) {
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

  res.render("admin/pages/category-blog-list.pug", {
    pageTitle: "Danh mục tin tức",
    CategoryBlogList: CategoryBlogList,
    accountAdminList: accountAdminList,
    pagination: pagination
  })
};

// giao diện trang tạo danh mục tin tức
module.exports.create = async (req, res) => {
  res.render("admin/pages/category-blog-create.pug", {
    pageTitle: "Tạo danh mục tin tức"
  })
};

module.exports.createPost = async (req, res) => {
  if(req.body.position) {
    req.body.position = parseInt(req.body.position)
  }else {
    const totalRecord = await CategoryBlog.countDocuments({});
    req.body.position = totalRecord + 1;
  };

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  req.body.avatar = req.file ? req.file.path : "";

  const newRecord = new CategoryBlog(req.body);
  await newRecord.save();

  req.flash('success', 'Tạo danh mục thành công!');
  
  res.json({
    code: "success",
  })
}

// Giao diện chỉnh sửa danh mục sản phẩm
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const categoryBlogDetail = await CategoryBlog.findOne({
      _id: id,
      deleted: false
    });

    res.render("admin/pages/category-blog-edit.pug", {
      pageTitle: "Chỉnh sửa danh mục tin tức",
      categoryBlogDetail: categoryBlogDetail
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/category-blog/list`);
  }
};

// Chức năng chỉnh sửa danh mục
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    if(req.body.position) {
      req.body.position = parseInt(req.body.position)
    }else {
      const totalRecord = await CategoryBlog.countDocuments({});
      req.body.position = totalRecord + 1;
    };

    req.body.updatedBy = req.account.id;
    if(req.file) {
      req.body.avatar = req.file.path;
    }else {
      delete req.body.avatar
    };

    await CategoryBlog.updateOne({
      _id: id,
      deleted: false
    }, req.body);

    req.flash('success', 'Cập nhật danh mục thành công!');
    
    res.json({
      code: "success",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
};


// // Chức năng xóa danh mục
module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await CategoryBlog.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    });
    

    req.flash("success", "Xóa danh mục thành công!");

    res.json({
      code: "success",
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    });
  };
}

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "active":
      case "inactive":
        await CategoryBlog.updateMany({
          _id: { $in: ids }
        }, {
          status: option,
          updatedAt: Date.now(),
          updatedBy: req.account.id,
        });
        req.flash("success", "Đổi trạng thái thành công!");
        break;
      case "delete":
        await CategoryBlog.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedAt: Date.now(),
          deletedBy: req.account.id,
        });
        req.flash("success", "Xóa thành công!");
        break;
    }
    res.json({
      code: "success",
    });
  } catch (error) {
    res.json({
      code: "error",
      message: "Id tồn tại trong hệ thống!"
    })
  }
}