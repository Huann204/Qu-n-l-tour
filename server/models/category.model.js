const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const schema = new mongoose.Schema(
  {
   name: String,
   parent: String,
   position: Number,
   status: String,
   avatar: String,
   description: String,
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

const Category = mongoose.model('Category', schema, "categories");

module.exports = Category;