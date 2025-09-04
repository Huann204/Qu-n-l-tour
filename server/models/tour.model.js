const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schema = new mongoose.Schema(
  {
   name: String,
   category: String,
   position: Number,
   status: String,
   avatar: String,
   priceAdult: Number,
   priceChildren: Number,
   priceBaby: Number,
   priceNewAdult: Number,
   priceNewChildren: Number,
   priceNewBaby: Number,
   stockAdult: Number,
   stockChildren: Number,
   stockBaby: Number,
   locations: Array,
   time: String,
   vehicle: String,
   departureDate: Date,
   information: String,
   schedules: Array,
   images: Array,
   createdBy: String,
   updatedBy: String,
   slug: {
    type: String,
    slug: "name",
    unique: true
   },
   deleted: {
    type: Boolean,
    default: false
   },
   deletedBy: String,
   deletedAt: Date
  },
  {
    timestamps: true,     // tự động sinh ra trường createAt và updateAt
  }
);

const Tour = mongoose.model('Tour', schema, "tours");

module.exports = Tour;