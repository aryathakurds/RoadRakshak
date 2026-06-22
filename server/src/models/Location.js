const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    locality: {
      type: String,
      default: "",
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    localBody: {
      type: String,
      default: "",
      trim: true,
    },
    authority: {
      type: String,
      default: "Local municipal or PWD authority",
      trim: true,
    },
    complaintUrl: {
      type: String,
      default: "",
      trim: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

locationSchema.index({
  state: "text",
  district: "text",
  city: "text",
  locality: "text",
  pincode: "text",
});

module.exports = mongoose.model("Location", locationSchema);