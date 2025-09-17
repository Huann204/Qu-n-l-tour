const Tour = require("../../models/tour.model");
const moment = require("moment");
const slugify = require('slugify');
const City = require("../../models/city.model");



module.exports.list = async (req, res) => {
  const find = {
    status: "active",
    deleted: false
  };

  // Điểm đi
  if(req.query.locationForm) {
    find.locations = req.query.locationForm;
  }
  // Hết Điểm đi

  // Điểm đến
  if(req.query.locationTo) {
    const locationTo = slugify(req.query.locationTo, {
      lower: true
    })

    const keywordRegex = new RegExp(locationTo);
      find.slug = keywordRegex;
  }
  // Hết Điểm đến

  // Ngày khởi hành
  if(req.query.departureDate) {
    const date = new Date(req.query.departureDate);
    find.departureDate = date;
  }
  // Hết Ngày khởi hành

  // Số lượng hành khách
  // Người lớn
  if(req.query.stockAdult) {
    find.stockAdult = {
      $gte: parseInt(req.query.stockAdult)
    }
  }

  // Trẻ em
  if(req.query.stockChildren) {
    find.stockChildren = {
      $gte: parseInt(req.query.stockChildren)
    }
  }

  // Em bé
  if(req.query.stockBaby) {
    find.stockBaby = {
      $gte: parseInt(req.query.stockBaby)
    }
  }

  // Hết Số lượng hành khách

   // Mức giá
  if(req.query.price) {
    const [priceMin, priceMax] = req.query.price.split("-").map(item => parseInt(item));
    
    find.priceNewAdult = {
      $gte: priceMin,
      $lte: priceMax
    };
  }
  // Hết Mức giá

  const tourList = await Tour
    .find(find)
    .sort({
      position: "asc"
    })

    for (const item of tourList) {
      item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
      item.ratingStars = 5;
      item.ratingTotal = 5;
    }

    const cityList = await City.find({});


  res.render("client/pages/search", {
    pageTitle: "Kết quả tìm kiếm",
    tourList: tourList,
    cityList: cityList
  });
}
