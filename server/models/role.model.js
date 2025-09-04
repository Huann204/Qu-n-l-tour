const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    permissions: Array,
    createdBy: String,
    updatedBy: String,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true, // Tự động sinh ra trường CreatedAt và updatedAt
  }
);

const Role = mongoose.model('Role', schema, "roles");

module.exports = Role;