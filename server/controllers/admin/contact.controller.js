const Contact = require("../../models/contact.model");
const moment = require("moment");


module.exports.list = async (req, res) => {
  const find = {
    deleted: false
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

  // Pagination
  const limitItems = 5;
  let page = 1;

  if(req.query.page) {
    const currentPage = parseInt(req.query.page);

    if(currentPage > 0) {
      page = currentPage;
    };
  };
  
  const totalRecord = await Contact.countDocuments(find);
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

  const contactList = await Contact
    .find(find)
    .sort({
      createdAt: "desc"
    });

  for (const item of contactList) {
    item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YYYY");
  }


  res.render("admin/pages/contact-list", {
    pageTitle: "Thông tin liên hệ",
    contactList: contactList,
    pagination: pagination
  })
}

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Contact.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    });
    

    req.flash("success", "Xóa liên hệ thành công!");

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
      case "delete":
        await Contact.updateMany({
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