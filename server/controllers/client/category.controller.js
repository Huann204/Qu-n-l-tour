const Category = require("../../models/category.model");

module.exports.list = async (req, res) => {
  // Lấy slug từ params
  const slug = req.params.slug;

  // Tìm danh mục theo slug
  const category = await Category.findOne({
    slug: slug,
    deleted: false,
    status: "active"
  });

  if(category) {
    // Breadcrumb
    var breadcrumb = {
        image: category.avatar,
        title: category.name,
        list: [
          {
            link: "/",
            title: "Trang chủ"
          },
        ]
      };

      // Tìm danh mục cha
      if(category.parent) {
        const parentCategory = await Category.findOne({
          _id: category.parent,
          deleted: false,
          status: "active"
        });

        if(parentCategory) {
          breadcrumb.list.push({
            link: `/category/${parentCategory.slug}`,
            title: `${parentCategory.name}`
          })
        }
      }

      // Thêm danh mục hiện tại
      breadcrumb.list.push({
        link: `/category/${category.slug}`,
        title: `${category.name}`
      })
      
    // End breadcrumb

    res.render("client/pages/tour-list.pug", {
      pageTitle: "Danh sách tour",
      breadcrumb: breadcrumb
    })

  }else {
    res.redirect("/");
  }
};
