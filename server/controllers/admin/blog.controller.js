
// giao diện trang quản lý tin tức
module.exports.list = async (req, res) => {
  res.render("admin/pages/blog-list.pug", {
    pageTitle: "Quản lý tin tức"
  })
};

// giao diện trang tạo tin tức
module.exports.create = async (req, res) => {
  res.render("admin/pages/blog-create.pug", {
    pageTitle: "Tạo tin tức"
  })
};

// giao diện trang thùng rác tin tức
module.exports.trash = async (req, res) => {
  res.render("admin/pages/blog-trash.pug", {
    pageTitle: "Thùng rác tin tức"
  })
};