const Blog = require("../../models/blog.model");
const CategoryBlog = require("../../models/category-blog.model");
const AccountAdmin = require("../../models/account-admin.model");
const moment = require("moment");
const slugify = require('slugify');

// giao diện trang quản lý tin tức
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
  
  const totalRecord = await Blog.countDocuments(find);
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

  if(req.query.category) {
    find.parent = req.query.category;
  };

  const blogList = await Blog.find(find)
  .sort({
    position: "asc"
  })
  .limit(limitItems)
  .skip(skip)
  ;
  

  for (const item of blogList) {
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

  const categoryBlogList = await CategoryBlog
    .find({})
    .select("id name")


  res.render("admin/pages/blog-list.pug", {
    pageTitle: "Quản lý tin tức",
    accountAdminList: accountAdminList,
    blogList: blogList,
    pagination: pagination,
    categoryBlogList: categoryBlogList
  })
};

// giao diện trang tạo tin tức
module.exports.create = async (req, res) => {
  const categoryBlogList = await CategoryBlog.find({
    deleted: false
  });

  res.render("admin/pages/blog-create.pug", {
    pageTitle: "Tạo tin tức",
    categoryBlogList: categoryBlogList
  })
};

// Chức năng tạo tin tuc
module.exports.createPost = async (req, res) => {
  if(req.body.position) {
    req.body.position = parseInt(req.body.position)
  }else {
    const totalRecord = await Blog.countDocuments({});
    req.body.position = totalRecord + 1;
  };

  req.body.createdBy = req.account.id;
  req.body.updatedBy = req.account.id;
  req.body.avatar = req.file ? req.file.path : "";

  const newRecord = new Blog(req.body);
  await newRecord.save();

  req.flash('success', 'Tạo tin tức thành công!');
  
  res.json({
    code: "success",
  })
};

module.exports.edit = async (req, res) => {
  try {
    const categoryBlogList= await CategoryBlog.find({
      deleted: false
    });

    const id = req.params.id;
    const blogDetail = await Blog.findOne({
      _id: id,
      deleted: false
    });

    
    res.render("admin/pages/blog-edit.pug", {
      pageTitle: "Chỉnh sửa danh mục tin tức",
      categoryBlogList: categoryBlogList,
      blogDetail: blogDetail
    });
  } catch (error) {
    res.redirect(`/${pathAdmin}/blog/list`);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    if(req.body.position) {
      req.body.position = parseInt(req.body.position)
    }else {
      const totalRecord = await Blog.countDocuments({});
      req.body.position = totalRecord + 1;
    };

    req.body.updatedBy = req.account.id;
    if(req.file) {
      req.body.avatar = req.file.path;
    }else {
      delete req.body.avatar
    };

    await Blog.updateOne({
      _id: id,
      deleted: false
    }, req.body);

    req.flash('success', 'Cập nhật tin tức thành công!');
    
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

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Blog.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    });
    

    req.flash("success", "Xóa tin tức thành công!");

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
        await Blog.updateMany({
          _id: { $in: ids }
        }, {
          status: option,
          updatedAt: Date.now(),
          updatedBy: req.account.id,
        });
        req.flash("success", "Đổi trạng thái thành công!");
        break;
      case "delete":
        await Blog.updateMany({
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

// giao diện trang thùng rác tin tức
module.exports.trash = async (req, res) => {
  const find = {
    deleted: true,
  };

  // pagination
  let limitItems = 3;
  let page = 1;

  if(req.query.page) {
    const currentPage = parseInt(req.query.page);

    if(currentPage > 0) {
      page = currentPage;
    };
  }

  const totalRecord = await Blog.countDocuments(find);
  const totalPage = Math.ceil(totalRecord / limitItems);

  if(page > totalPage) {
    page = totalPage;
  };

  if(totalPage === 0) {
    page = 1;
  };

  const skip = (page - 1) * limitItems;
  const pagination = {
    skip: skip,
    totalRecord: totalRecord,
    totalPage: totalPage
  };

  // End pagination

  const blogList = await Blog
    .find(find)
    .sort({
      position: "asc"
    })

    for (const item of blogList) {
      if(item.createdBy) {
        const infoAccountCreated = await AccountAdmin.findOne({
          _id: item.createdBy
        });

        item.createdByFullName = infoAccountCreated.fullName;
      }

      if(item.deletedBy) {
      const infoAccountDeleted = await AccountAdmin.findOne({
        _id: item.deletedBy
      })
      item.deletedByFullName = infoAccountDeleted.fullName;
    }


      item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
      item.deletedAtFormat = moment(item.deletedAt).format("HH:mm - DD/MM/YYYY");
    }

  res.render("admin/pages/blog-trash", {
    pageTitle: "Thùng rác tin tức",
    blogList: blogList,
    pagination: pagination
  })
};

module.exports.undoPatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    await Blog.updateOne({
      _id: id
    },{
      deleted: false,
    });

    req.flash("success", "Khôi phục tin tức thành công!");
        
    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ"
    })
  }
};

module.exports.deleteDestroyPatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    await Blog.deleteOne({
      _id: id
    });

    req.flash("success", "Đã xóa tin tức khỏi cơ sở dữ liệu!");
        
    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ"
    })
  }
};

module.exports.trashChangeMultiPatch = async(req, res ) => {
  try {
    const { option, ids } = req.body;

    switch (option) {
      case "undo":
        await Blog.updateMany({
          _id: { $in: ids}
        }, {
          deleted: false
        });
        req.flash("success", "Khôi phục tin tức thành công!");
        break;
      case "delete-destroy":
        await Blog.deleteMany({
          _id: { $in: ids }
        });
        req.flash("success", "Đã xóa tin tức khỏi cơ sở dữ liệu!");
        break;
    }
    
    res.json({
      code: "success"
    })
    
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không tồn tại trong hệ thông!"
    });
  }
}
