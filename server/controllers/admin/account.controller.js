const AccountAdmin = require("../../models/account-admin.model");
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
const ForgotPassowrd = require("../../models/forgot-password.model");

const generateHelper = require("../../helpers/generate.helpers");
const emailHelpers = require("../../helpers/email.helper");

// giao diện trang đăng nhập
module.exports.login = async (req, res) => {
  res.render("admin/pages/login.pug", {
    pageTitle: "Đăng nhập"
  })
};

// chức năng đăng nhập
module.exports.loginPost = async (req, res) => {
  const { email, password, rememberPassword } = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email
  });

  if(!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!"
    });
    return;
  };

  const isPasswordValid = await bcrypt.compare(password, existAccount.password);
  if(!isPasswordValid) {
    res.json({
      code: "error",
      message: "Mật khẩu không đúng!"
    });
    return;
  };

  if(existAccount.status !== "active") {
    res.json({
      code: "error",
      message: "Tài khoản chưa được kích hoạt!"
    });
    return;
  };


   // Tạo JWT
  const token = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberPassword ? '30d' : '1d' // Token có thời hạn 30 ngày hoặc 1 ngày
    }
  )

  // Lưu token vào cookie
  res.cookie("token", token, {
    maxAge: rememberPassword ? 30*(24 * 60 * 60 * 1000) :24 * 60 * 60 * 1000, // Token có hiệu lực trong 1 ngày
    httpOnly: true,
    sameSite: "strict"
  })

  res.json({
    code: "success",
    message: "Đăng nhâp thành công!"
  });
};

// giao diện trang đăng ký
module.exports.register = async (req, res) => {
  res.render("admin/pages/register.pug", {
    pageTitle: "Đăng ký"
  })
};

// tính năng đăng ký
module.exports.registerPost = async (req, res) => {
  const { fullName, email, password } = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email
  });

  if(existAccount) {
    res.json({
      code: "error",
      message: "Email đã  tồn tại trong hệ thống!"
    });
    return;
  };

  // mã hóa mật khẩu với bcrypt
  const salt = bcrypt.genSaltSync(10); // tạo chuỗi ngẫu nhiên 10 kí tự
  const hashedPassword = bcrypt.hashSync(password, salt);


  const newAccount = new AccountAdmin({
    fullName: fullName,
    email: email,
    password: hashedPassword,
    status: "initial"
  });

  await newAccount.save();
  

  res.json({
    code: "success",
    message: "Đăng ký tài khoản thành công!"
  });
};

// giao diện trang đăng ký thành công
module.exports.registerInitial = async (req, res) => {
  res.render("admin/pages/register-initial.pug", {
    pageTitle: "Tài khoản đã được khởi tạo"
  })
};

// giao diện trang quên mật khẩu
module.exports.forgotPassword = async (req, res) => {
  res.render("admin/pages/forgot-password", {
    pageTitle: "Đăng ký"
  })
};

// Tính năng quên mật khẩu
module.exports.forgotPasswordPost = async (req, res) => {
  const { email } = req.body;

  const existAccount = await AccountAdmin.findOne({
    email: email
  });

  if(!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!"
    });
    return;
  };

  // Kiểm tra email đã tồn tại trong ForgotPassword chưa? - ý là kiểm tra email có gửi yêu cầu trong vòng 3' trước chưa?
  const existEmailInForgotPassowrd = await ForgotPassowrd.findOne({
    email: email
  });

  if(existEmailInForgotPassowrd) {
    res.json({
      code: "error",
      message: "Vui lòng gửi lại yêu cầu sau 3 phút!"
    });
    return;
  }

  // Tạo mã OTP
  const otp = generateHelper.generateRandomNumber(6);
  
  // lưu vào database: Email, OTP. sau 3 phút sẽ tự động xóa bản ghi
  const newRecord = new ForgotPassowrd({
    email: existAccount.email,
    otp: otp,
    expireAt: Date.now() + 3*60*1000
  });

  await newRecord.save();

  // gửi mã OTP qua email cho người dùng (tự động)
  const subject = `Mã OTP lấy lại mật khẩu`;
  const content = `Mã OTP của bạn là <b style="color: green";>${otp}</b>. Mã OTP có hiệu lực trong 3 phút, vui lòng không cung cấp cho bất kì ai.`;
  emailHelpers.sendEmail(email, subject, content);
  
  res.json({
    code: "success",
    message: "gửi mã OTP thành công!"
  });
};

// giao diện trang gửi mã OTP
module.exports.otpPassword = async (req, res) => {
  res.render("admin/pages/otp-password.pug", {
    pageTitle: "Đăng ký"
  })
};

// Tính năng xác nhận OTP
module.exports.otpPasswordPost = async (req, res) => {
  const { otp, email } = req.body;
  
  // Kiểm tra có tồn tại trong ForgotPassword
  const existAccount = await ForgotPassowrd.findOne({
    otp: otp,
    email: email
  });

  if(!existAccount) {
    res.json({
      code: "error",
      message: "Mã OTP không chính xác!"
    });
    return;
  }

  // Tìm thông tin của người dùng trong AccountAdmin
  const account = await AccountAdmin.findOne({
    email: email
  });

  // Tạo JWT
  const token = jwt.sign(
    {
      id: account.id,
      email: account.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d' // Token có thời hạn 1 ngày
    }
  );

  // Lưu token vào cookie
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000, // Token có hiệu lực trong 1 ngày
    httpOnly: true,
    sameSite: "strict"
  });

  res.json({
    code: "success",
    message: "Gửi mã OTP thành công! "
  });
  
};

// giao diện trang đổi lại mất khẩu
module.exports.resetPassword = async (req, res) => {
  res.render("admin/pages/reset-password.pug", {
    pageTitle: "Đăng ký"
  })
};

// tính năng đổi mật khẩu (khi quên mật khẩu)
module.exports.resetPasswordPost = async (req, res) => {
  const { password } = req.body;

   // mã hóa mật khẩu với bcrypt
  const salt = bcrypt.genSaltSync(10); // tạo chuỗi ngẫu nhiên 10 kí tự
  const hashedPassword = bcrypt.hashSync(password, salt);
  
  await AccountAdmin.updateOne({
    _id: req.account.id,
    deleted: false,
    status: "active"
  }, {
    password: hashedPassword
  });


  res.json({
    code: "success",
    message: "Đổi mật khẩu thành công!"
  })
};

// Tinh nang dang xuat
module.exports.logoutPost = async (req, res) => {
  res.clearCookie("token");
  res.json({
    code: "success",
    message: "Đăng xuất thành công!"
  });
};