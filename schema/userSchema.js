const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", //it means if you dont select then bydefault user will be created or else you select admin for admin user
    },
  },
  { timestamps: true }
);

const userModal = mongoose.model("user", userSchema);
module.exports = userModal;
