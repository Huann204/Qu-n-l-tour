module.exports.detail = async (req, res) => {
  res.render("client/pages/tour-detail.pug", {
    pageTitle: "Chi tiết tour"
  })
}
