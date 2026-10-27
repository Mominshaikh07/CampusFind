const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    dateFound: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "returned"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoundItem", foundItemSchema);
