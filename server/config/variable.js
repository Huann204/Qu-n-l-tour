module.exports.pathAdmin = "admin";

module.exports.paymentMethod = [
  {
    label: "Thanh toán tiền mặt",
    value: "money"
  },
  {
    label: "Ví MoMo",
    value: "momo"
  },
  {
    label: "Chuyển khoản ngân hàng",
    value: "bank"
  }
];

module.exports.paymentStatus = [
  {
    label: "Chưa thanh toán",
    value: "unpaid"
  },
  {
    label: "Đã thanh toán",
    value: "paid"
  }
];

module.exports.orderStatus = [
  {
    label: "Khởi tạo",
    value: "initial"
  },
  {
    label: "Hoàn thành",
    value: "done"
  },
  {
    label: "Hủy",
    value: "cancel"
  }
];
