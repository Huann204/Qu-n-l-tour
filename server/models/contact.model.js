const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    email: String,
    fullName: String,
    phone: String,
    subject: String,
    content: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true, // Tự động sinh ra trường createdAt và updatedAt
  }
);

const Contact = mongoose.model('Contact', schema, "contacts");

module.exports = Contact;
