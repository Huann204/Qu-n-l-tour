module.exports.cart = async (req, res) => {
  res.render("client/pages/cart.pug", {
    pageTitle: "Giỏ Hàng"
  })
};