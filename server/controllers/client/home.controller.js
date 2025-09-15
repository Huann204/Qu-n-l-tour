const Tour = require("../../models/tour.model");
const moment = require("moment");

module.exports.home = async (req, res) => {
  // section 2
  const tourListSection2 = await Tour.find({
    deleted: false,
    status: "active"
  })
  .sort({
    position: "desc"
  })
  .limit(6)

  for (const item of tourListSection2) {
    item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    item.ratingStars = 5;
    item.ratingTotal = 5;
  }

  // end section 2

  res.render("client/pages/home", {
    pageTitle: "Trang chủ",
    tourListSection2: tourListSection2
  })
}
