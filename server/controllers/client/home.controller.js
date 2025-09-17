const Tour = require("../../models/tour.model");
const moment = require("moment");
const categoryHelper = require("../../helpers/category.helper");

module.exports.home = async (req, res) => {
  // section 2
  const tourListSection2 = await Tour.find({
    deleted: false,
    status: "active"
  })
  .sort({
    position: "asc"
  })
  .limit(6)

  for (const item of tourListSection2) {
    item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    item.ratingStars = 5;
    item.ratingTotal = 5;
  }

  // end section 2

  // Section 4: Tour trong nuoc
  const categoryIdSection4 = "68b85db5dcbd3cba8791d932"; // id danh muc tour trong nuoc
  const listCategoryId = await categoryHelper.getAllSubcategoryIds(categoryIdSection4);

  const tourListSection4 = await Tour.find({
    category: { $in: listCategoryId},
    deleted: false,
    status: "active"
  })
  .sort({
    position: "asc"
  })
  .limit(8)

  for (const item of tourListSection4) {
    item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    item.ratingStars = 5;
    item.ratingTotal = 5;
  }

  // End section 6

  // Section 6: Tour trong nuoc
  const categoryIdSection6 = "68b85f6373d5fe01048d11e8"; // id danh muc tour trong nuoc
  const listCategoryIdSection6 = await categoryHelper.getAllSubcategoryIds(categoryIdSection6);

  const tourListSection6 = await Tour.find({
    category: { $in: listCategoryIdSection6},
    deleted: false,
    status: "active"
  })
  .sort({
    position: "asc"
  })
  .limit(8)

  for (const item of tourListSection6) {
    item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    item.ratingStars = 5;
    item.ratingTotal = 5;
  }

  // End section 6


  res.render("client/pages/home", {
    pageTitle: "Trang chủ",
    tourListSection2: tourListSection2,
    tourListSection4: tourListSection4,
    tourListSection6: tourListSection6
  })
}
