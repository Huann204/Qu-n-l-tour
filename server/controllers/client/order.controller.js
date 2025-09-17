const Tour = require("../../models/tour.model");
const Order = require("../../models/order.model");
const moment = require("moment");
const City = require("../../models/city.model");

const variableConfig = require("../../config/variable");
const gererateHelper = require("../../helpers/generate.helpers");
const emailHelpers = require("../../helpers/email.helper"); 
const baseURLConfig = require("../../config/base-url");

module.exports.createPost = async (req, res) => {
  try {

    req.body.orderCode = "OD" + gererateHelper.generateRandomNumber(10);
    const existOrderCode = await Order.findOne({
      orderCode: req.body.orderCode
    });

    if(existOrderCode) {
      req.body.orderCode = "OD" + gererateHelper.generateRandomNumber(10);
    }

    // Danh sách tour
    for (const item of req.body.items) {
      const infoTour = await Tour.findOne({
        _id: item.tourId,
        status: "active",
        deleted: false
      });

      if(infoTour) {
        // Thêm giá
        item.priceNewAdult = infoTour.priceNewAdult;
        item.priceNewChildren = infoTour.priceNewChildren;
        item.priceNewBaby = infoTour.priceNewBaby;

         // Ngày khởi hành
        item.departureDate = infoTour.departureDate;

        // Ảnh
        item.avatar = infoTour.avatar;

        // Tiêu đề
        item.name = infoTour.name;

         // Cập nhật lại số lượng còn lại của tour
        if(infoTour.stockAdult < item.quantityAdult || infoTour.stockChildren < item.quantityChildren || infoTour.stockBaby < item.quantityBaby) {
          res.json({
            code: "error",
            message: `Số lượng chỗ của tour ${item.name} đã hết, vui lòng chọn lại`
          })
          return;
        };

        await Tour.updateOne({
          _id: item.tourId
        }, {
          stockAdult: infoTour.stockAdult - item.quantityAdult,
          stockChildren: infoTour.stockChildren - item.quantityChildren,
          stockBaby: infoTour.stockBaby - item.quantityBaby,
        });
      }
    }

    // Tạm tính
    req.body.subTotal = req.body.items.reduce((sum, item) => {
      return sum + ((item.priceNewAdult * item.quantityAdult) 
                 + (item.priceNewChildren * item.quantityChildren) 
                 + (item.priceNewBaby * item.quantityBaby));
    }, 0);

    
    // Giảm
    req.body.discount = 0;

    // Thanh toán
    req.body.total = req.body.subTotal - req.body.discount;

    // Trạng thái thanh toán
    req.body.paymentStatus = "unpaid"; // unpaid: chưa thánh toán, paid: đã thanh toán

    // Trạng thái đơn hàng
    req.body.status = "initial"; // initial: khởi tạo, done: hoàn thành, cancel: hủy
      
    const newRecord = new Order(req.body);
    await newRecord.save();

    const orderUrl = `${baseURLConfig.BASE_URL}/order/success?orderId=${newRecord.id}&email=${req.body.email}`;
    const subject = "Thông báo đặt hàng thành công";
    const content = `
      <h3>Đặt hàng thành công!</h3>
      <p>Xin chào ${req.body.fullName}</p>
      <p>Bạn đã đặt tour thành công với mã đơn hàng: <b>${newRecord.orderCode}</b>.</p>
      <p>Chi tiết đơn hàng, vui lòng nhấn vào link bên dưới:</p>
      <p>
        <a href="${orderUrl}" style="color: darkblue; font-weight: bold; text-decoration: none;">
          Bấm vào đây
        </a>
      </p>
      <p>Cảm ơn bạn đã đặt tour tại chúng tôi!</p>
    `;
    await emailHelpers.sendEmail(req.body.email, subject, content);
    
    res.json({
      code: "success",
      message: "Đặt hàng thành công!",
      orderId: newRecord.id
    })
    
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Đặt hàng không thành công!"
    });
  }
}

module.exports.success = async (req, res) => {
  try {
    const { orderId, email } = req.query;

    const orderDetail = await Order.findOne({
      _id: orderId,
      email: email
    })

    if(!orderDetail) {
      res.redirect("/");
      return;
    }

    orderDetail.paymentMethodName = variableConfig.paymentMethod.find(item => item.value == orderDetail.paymentMethod).label;

    orderDetail.paymentStatusName = variableConfig.paymentStatus.find(item => item.value == orderDetail.paymentStatus).label;

    orderDetail.statusName = variableConfig.orderStatus.find(item => item.value == orderDetail.status).label;

    orderDetail.createdAtFormat = moment(orderDetail.createdAt).format("HH:mm - DD/MM/YYYY");

    for (const item of orderDetail.items) {
      const infoTour = await Tour.findOne({
        _id: item.tourId,
        deleted: false
      })

      if(infoTour) {
        item.slug = infoTour.slug;
      }

      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");

      const city = await City.findOne({
        _id: item.locationFrom
      })

      if(city) {
        item.locationFromName = city.name;
      }
    }

    res.render("client/pages/order-success", {
      pageTitle: "Đặt hàng thành công",
      orderDetail: orderDetail
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
}

