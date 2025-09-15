
// giao diện trang quản lý danh mục tin tức
module.exports.list = async (req, res) => {
  res.render("admin/pages/category-blog-list.pug", {
    pageTitle: "Danh mục tin tức"
  })
};

// giao diện trang tạo danh mục tin tức
module.exports.create = async (req, res) => {
  res.render("admin/pages/category-blog-create.pug", {
    pageTitle: "Tạo danh mục tin tức"
  })
};