const Category = require("../../models/category.model");
const moment = require("moment");
const categoryHelper = require("../../helpers/category.helper");
const City = require("../../models/city.model");
const Tour = require("../../models/tour.model");
const AccountAdmin = require("../../models/account-admin.model");


module.exports.list = async (req, res) => {
  const find = {
    deleted: false,
  };

  const tourList = await Tour
    .find(find)
    .sort({
      position: "asc"
    })

    for (const item of tourList) {
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
      item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YYYY");
    }


res.render("admin/pages/tour-list", {
    pageTitle: "Quản lý tour",
    tourList: tourList
  })
}

module.exports.create = async (req, res) => {
  const categoryList = await Category.find({
      deleted: false
    });
  
  const categoryTree = categoryHelper.buildCategoryTree(categoryList);

  const cityList = await City.find({});
  
  res.render("admin/pages/tour-create", {
    pageTitle: "Tạo tour",
    categoryList: categoryTree,
    cityList: cityList
  })
}

module.exports.createPost = async (req, res) => {

  try {
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const totalRecord = await Tour.countDocuments({});
      req.body.position = totalRecord + 1;
    }


    req.body.createdBy = req.account.id;
    req.body.updatedBy = req.account.id;
    req.body.avatar = req.file ? req.file.path : "";


    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockChildren ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.schedules ? JSON.parse(req.body.schedules) : [];

    const newRecord = new Tour(req.body);
    await newRecord.save();

    req.flash("success", "Tạo tour thành công!")

    res.json({
      code: "success",
    })
  } catch (error) {
    console.error(error);
    res.json({ 
      code: "error", 
      message: error.message 
    });
  }
  
}

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const tourDetail = await Tour.findOne({
      _id: id,
      deleted: false
    });

    if(tourDetail) {
      tourDetail.departureDateFormat = moment(tourDetail.departureDate).format("YYYY-MM-DD");
    }

    const categoryList = await Category.find({
      deleted: false
    });
  
    const categoryTree = categoryHelper.buildCategoryTree(categoryList);
    const cityList = await City.find({});

    res.render("admin/pages/tour-edit", {
    pageTitle: "Chỉnh sửa tour",
    categoryList: categoryTree,
    cityList: cityList,
    tourDetail: tourDetail
  })
  } catch (error) {
    res.redirect(`/${pathAdmin}/tour/list`);
  }
}

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const totalRecord = await Tour.countDocuments({});
      req.body.position = totalRecord + 1;
    }

    req.body.updatedBy = req.account.id;
    if(req.file) {
      req.body.avatar = req.file.path;
    } else {
      delete req.body.avatar;
    }

    req.body.priceAdult = req.body.priceAdult ? parseInt(req.body.priceAdult) : 0;
    req.body.priceChildren = req.body.priceChildren ? parseInt(req.body.priceChildren) : 0;
    req.body.priceBaby = req.body.priceBaby ? parseInt(req.body.priceBaby) : 0;
    req.body.priceNewAdult = req.body.priceNewAdult ? parseInt(req.body.priceNewAdult) : req.body.priceAdult;
    req.body.priceNewChildren = req.body.priceNewChildren ? parseInt(req.body.priceNewChildren) : req.body.priceChildren;
    req.body.priceNewBaby = req.body.priceNewBaby ? parseInt(req.body.priceNewBaby) : req.body.priceBaby;
    req.body.stockAdult = req.body.stockAdult ? parseInt(req.body.stockAdult) : 0;
    req.body.stockChildren = req.body.stockAdult ? parseInt(req.body.stockChildren) : 0;
    req.body.stockBaby = req.body.stockBaby ? parseInt(req.body.stockBaby) : 0;
    req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
    req.body.departureDate = req.body.departureDate ? new Date(req.body.departureDate) : null;
    req.body.schedules = req.body.locations ? JSON.parse(req.body.schedules) : [];

    await Tour.updateOne({
      _id: id,
      deleted: false
    }, req.body);

    req.flash("success", "Cập nhật tour thành công!")

    res.json({
      code: "success"
    })

  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    });
  }
}

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Tour.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    });
    
    req.flash("success", "Xóa tour thành công!");

    res.json({
      code: "success"
    });
    
  } catch (error) {
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    });
  }
;}

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

  const totalRecord = await Tour.countDocuments(find);
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

  const tourList = await Tour
    .find(find)
    .sort({
      position: "asc"
    })

    for (const item of tourList) {
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

  res.render("admin/pages/tour-trash", {
    pageTitle: "Thùng rác tour",
    tourList: tourList,
    pagination: pagination
  })
};

module.exports.undoPatch = async (req, res) => {
  try {
    const id = req.params.id;
    
    await Tour.updateOne({
      _id: id
    },{
      deleted: false,
    });

    req.flash("success", "Khôi phục tour thành công!");
        
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
    
    await Tour.deleteOne({
      _id: id
    });

    req.flash("success", "Đã xóa tour khỏi cơ sở dữ liệu!");
        
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
        await Tour.updateMany({
          _id: { $in: ids}
        }, {
          deleted: false
        });
        req.flash("success", "Khôi phục tour thành công!");
        break;
      case "delete-destroy":
        await Tour.deleteMany({
          _id: { $in: ids }
        });
        req.flash("success", "Đã xóa tour khỏi cơ sở dữ liệu!");
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

