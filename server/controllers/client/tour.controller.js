const Tour = require("../../models/tour.model");
const Category = require("../../models/category.model");

module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
   
  // Tìm tour theo slug
  const tourDetail = await Tour.findOne({
    slug: slug,
    status: "active",
    deleted: false
  });

  if(tourDetail) {
    // Breadcrumb
    var breadcrumb = {
        image: tourDetail.avatar,
        title: tourDetail.name,
        list: [
          {
            link: "/",
            title: "Trang chủ"
          },
        ]
      };

      // Tìm danh mục cha cấp 1
      const category = await Category.findOne({
        _id: tourDetail.category,
        deleted: false,
        status: "active"
      });

      if(category) {
        // Tìm danh mục cha cấp 2
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
      }

      breadcrumb.list.push({
        link: `/tours/${tourDetail.slug}`,
        title: `${tourDetail.name}`
      })
    // End breadcrumb
    
    res.render("client/pages/tour-detail.pug", {
      pageTitle: "Chi tiết tour",
      breadcrumb: breadcrumb
   })
  }else {
    res.redirect("/");
  }

  // Hết tìm tour theo slug
  
  
}
