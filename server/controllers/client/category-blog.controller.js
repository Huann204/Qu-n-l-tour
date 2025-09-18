const Blog = require("../../models/blog.model");
const CategoryBlog = require("../../models/category-blog.model")


module.exports.list = async (req, res) => {

  const categoryBlogList = await CategoryBlog
    .find({
      deleted: false
    })
    .sort({
      position: "asc"
    });

    for (const item of categoryBlogList) {
        const totalBlog = await Blog.countDocuments({
          parent: item.id,
          deleted: false
        })

        item.totalBlog = totalBlog;
    }

  const newBlogList = await Blog.find({
    deleted: false,
    status: "active"
  })
  .sort({
    createdAt: "asc"
  })
  .limit(4);

  res.render("client/pages/category-blog.pug", {
    pageTitle: "Liên hệ",
    categoryBlogList: categoryBlogList,
    newBlogList: newBlogList
  })
}