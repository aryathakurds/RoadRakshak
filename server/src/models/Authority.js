const mongoose = require("mongoose");

const authoritySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },

    shortName: {
      type: String,
      default: "",
      trim: true,
      maxlength: 40,
    },

    level: {
      type: String,
      required: true,
      enum: [
        "National",
        "State",
        "District",
        "Municipal",
        "Panchayat",
        "Cantonment",
        "Development Authority",
      ],
    },

    type: {
      type: String,
      required: true,
      enum: [
        "NHAI",
        "PWD",
        "Municipal Corporation",
        "Municipality",
        "Nagar Panchayat",
        "Gram Panchayat",
        "Cantonment Board",
        "Development Authority",
        "Other",
      ],
    },

    state: {
      type: String,
      default: "",
      trim: true,
    },

    district: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    localBody: {
      type: String,
      default: "",
      trim: true,
    },

    jurisdiction: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    roadTypes: {
      type: [String],
      default: [],
    },

    departments: {
      type: [String],
      default: [],
    },

    officialWebsite: {
      type: String,
      required: true,
      trim: true,
    },

    complaintUrl: {
      type: String,
      default: "",
      trim: true,
    },

    helpline: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    sourceUrl: {
      type: String,
      required: true,
      trim: true,
    },

    verificationStatus: {
      type: String,
      enum: [
        "Verified",
        "Partially verified",
        "Verification required",
      ],
      default: "Verification required",
    },

    lastVerifiedAt: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

authoritySchema.index({
  name: "text",
  shortName: "text",
  state: "text",
  district: "text",
  city: "text",
  localBody: "text",
});

authoritySchema.index({
  state: 1,
  district: 1,
  city: 1,
  isActive: 1,
});

module.exports = mongoose.model(
  "Authority",
  authoritySchema
);