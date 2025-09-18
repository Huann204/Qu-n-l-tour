const AccountAdmin = require("../../models/account-admin.model");
const Order = require("../../models/order.model");
const variableConfig = require("../../config/variable");
const moment = require("moment");

module.exports.dashboard = async (req, res) => {
  // Section 1
  const overview = {
    totalAdmin: 0,
    totalUser: 0,
    totalOrder: 0,
    totalPrice: 0
  };

  overview.totalAdmin = await AccountAdmin.countDocuments({
    deleted: false
  });

  const orderList = await Order.find({
    deleted: false
  })

  overview.totalOrder = orderList.length;

  overview.totalPrice = orderList.reduce((sum, item) => {
    return sum + item.total;
  }, 0);
  // End Section 1

  const orderNew = await Order.find({
  deleted: false
  })
  .sort({ createdAt: "desc" }) // mới nhất -> cũ nhất
  .limit(2);

  for (const orderDetail of orderNew) {
      orderDetail.paymentMethodName = variableConfig.paymentMethod.find(item => item.value == orderDetail.paymentMethod).label;
      
      orderDetail.paymentStatusName = variableConfig.paymentStatus.find(item => item.value == orderDetail.paymentStatus).label;

      orderDetail.statusName = variableConfig.orderStatus.find(item => item.value == orderDetail.status).label;

      orderDetail.createdAtTime = moment(orderDetail.createdAt).format("HH:mm");
      orderDetail.createdAtDate = moment(orderDetail.createdAt).format("DD/MM/YYYY");
    }  
  res.render("admin/pages/dashboard", {
    pageTitle: "Tổng quan",
    overview: overview,
    orderNew: orderNew
  })
}

module.exports.revenueChartPost = async (req, res) => {
  const { currentMonth, currentYear, previousMonth, previousYear, arrayDay } = req.body;

  // truy vấn tất cả đơn hàng trong tháng hiện tại
  const orderCurrentMonth = await Order.find({
    deleted: false,
    createdAt: {
      $gte: new Date(currentYear, currentMonth - 1, 1),
      $lte: new Date(currentYear, currentMonth, 1),
    }
  });

  // truy vấn tất cả đơn hàng trong tháng hiện tại
  const orderPreviousMonth = await Order.find({
    deleted: false,
    createdAt: {
      $gte: new Date(previousYear, previousMonth - 1, 1),
      $lte: new Date(previousYear, previousMonth, 1),
    }
  });

  // Tạo mảng doanh thu theo từng ngày
  const dataMonthCurrent = [];
  const dataMonthPrevious = [];

  for (const day of arrayDay) {
    // Tính tổng doanh thu theo từng ngày của tháng này
    let totalCurrent = 0;
    for (const order of orderCurrentMonth) {
      const orderDate = new Date(order.createdAt).getDate();
      if(day === parseInt(orderDate)) {
        totalCurrent += order.total;
      }
    }
    dataMonthCurrent.push(totalCurrent);

    // Tính tổng doanh thu theo từng ngày của tháng trước
    let totalPrevious = 0;
    for (const order of orderPreviousMonth) {
      const orderDate = new Date(order.createdAt).getDate();
      if(day === parseInt(orderDate)) {
        totalPrevious += order.total;
      }
    }
    dataMonthPrevious.push(totalPrevious);
  }
  
  res.json({
    code: "success",
    dataMonthCurrent: dataMonthCurrent,
    dataMonthPrevious: dataMonthPrevious
  })
} 