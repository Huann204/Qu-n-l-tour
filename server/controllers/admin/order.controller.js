const Order = require("../../models/order.model");
const moment = require("moment");
const variableConfig = require("../../config/variable");
const City = require("../../models/city.model");

module.exports.list = async (req, res) => {
  const find = {
    deleted: false
  };

  if(req.query.status) {
    find.status = req.query.status;
  };

  if(req.query.paymentStatus) {
    find.paymentStatus = req.query.paymentStatus;
  }
  

  const dateFilter = {};
  
    if(req.query.startDate) {    
      const startDate = moment(req.query.startDate).startOf("date").toDate();
      dateFilter.$gte = startDate;    
    };
  
     if(req.query.endDate) {
      const endDate = moment(req.query.endDate).endOf("date").toDate();
      dateFilter.$lte = endDate;    
    };

    if(Object.keys(dateFilter).length > 0) {
    find.createdAt = dateFilter;
  };


  // Pagination
  const limitItems = 3;
  let page = 1;

  if(req.query.page) {
    const currentPage = parseInt(req.query.page);

    if(currentPage > 0) {
      page = currentPage;
    };
  };
  
  const totalRecord = await Order.countDocuments(find);
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

  const orderList = await Order
    .find(find)
    .sort({
      createdAt: "desc"
    })
    .limit(limitItems)
    .skip(skip)
    ;

    for (const orderDetail of orderList) {
      const paymentMethodObj = variableConfig.paymentMethod.find(item => item.value == orderDetail.paymentMethod);
        orderDetail.paymentMethodName = paymentMethodObj ? paymentMethodObj.label : "Không xác định";

        const paymentStatusObj = variableConfig.paymentStatus.find(item => item.value == orderDetail.paymentStatus);
        orderDetail.paymentStatusName = paymentStatusObj ? paymentStatusObj.label : "Không xác định";

        const statusObj = variableConfig.orderStatus.find(item => item.value == orderDetail.status);
        orderDetail.statusName = statusObj ? statusObj.label : "Không xác định";


      orderDetail.createdAtTime = moment(orderDetail.createdAt).format("HH:mm");
      orderDetail.createdAtDate = moment(orderDetail.createdAt).format("DD/MM/YYYY");
    }

  res.render("admin/pages/order-list", {
    pageTitle: "Quản lý đơn hàng",
    orderList: orderList,
    pagination: pagination
  })
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const orderDetail = await Order.findOne({
      _id: id,
      deleted: false
    });

    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("YYYY-MM-DDTHH:mm");

    for (const item of orderDetail.items) {
      const city = await City.findOne({
        _id: item.locationFrom
      });

      item.locationFromName = city ? city.name : "Không xác định";
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    };
    res.render("admin/pages/order-edit", {
      pageTitle: `Đơn hàng: ${orderDetail.orderCode}`,
      orderDetail: orderDetail,
      paymentMethod: variableConfig.paymentMethod,
      paymentStatus: variableConfig.paymentStatus,
      orderStatus: variableConfig.orderStatus
    })
  } catch (error) {
    console.log(error)
    res.redirect(`/${pathAdmin}/order/list`);
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.findOne({
      _id: id,
      deleted: false
    });

    if(!order) {
      res.json({
        code: "error",
        message: "Thông tin đơn hàng không hợp lệ!"
      })
      return;
    }

    await Order.updateOne({
      _id: id,
      deleted: false
    }, req.body);

    req.flash("success", "Cập nhật đơn hàng thành công!");

    res.json({
      code: "success"
    })
  } catch (error) {
    res.json({
      code: "error",
      message: "Thông tin đơn hàng không hợp lệ!"
    })
  }
};

module.exports.deletePatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Order.updateOne({
      _id: id
    }, {
      deleted: true,
      deletedBy: req.account.id,
      deletedAt: Date.now()
    });
    
    req.flash("success", "Xóa đơn hàng thành công!");

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