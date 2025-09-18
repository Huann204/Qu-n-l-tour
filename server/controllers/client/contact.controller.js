const Contact = require("../../models/contact.model");


module.exports.createPost = async (req, res) => {
  const { email } = req.body;

  const existEmail = await Contact.findOne({
    email: email
  });

  if(existEmail) {
    res.json({
      code: "error",
      message: "Email của bạn đã được đăng ký!"
    });
    return;
  }

  const newRecord = new Contact(req.body);
  await newRecord.save();

  req.flash("success", "Cảm ơn bạn đã đăng ký nhận tin tức!");

  res.json({
    code: "success"
  });
}

module.exports.list = async (req, res) => {
  res.render("client/pages/contact", {
    pageTitle: "Liên hệ",
  })
}