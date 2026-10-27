const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema(
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
    dateLost: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["lost", "recovered"],
      default: "lost",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LostItem", lostItemSchema);