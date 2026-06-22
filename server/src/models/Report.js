const mongoose = require("mongoose");

const statusHistorySchema =
  new mongoose.Schema({
    status: {
      type: String,
      required: true,
      enum: [
        "Complaint ready",
        "Sent to authority",
        "Inspection pending",
        "Repair in progress",
        "Resolved",
        "Rejected",
      ],
    },

    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedByName: {
      type: String,
      default: "RoadRakshak system",
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

const reportSchema = new mongoose.Schema(
  {
    issue: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
        "Critical",
      ],
      default: "Medium",
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

    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [78.6569, 22.9734],
      },
    },

    authorityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Authority",
      default: null,
    },

    authority: {
      type: String,
      default: "Authority pending",
      trim: true,
    },

    channel: {
      type: String,
      default: "Complaint channel pending",
      trim: true,
    },

    complaintPortalUrl: {
      type: String,
      default: "",
      trim: true,
    },

    complaintReference: {
      type: String,
      default: "",
      trim: true,
      maxlength: 120,
    },

    complaintSubmittedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Complaint ready",
        "Sent to authority",
        "Inspection pending",
        "Repair in progress",
        "Resolved",
        "Rejected",
      ],
      default: "Complaint ready",
    },

    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },

    resolutionNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    resolutionEvidenceUrl: {
      type: String,
      default: "",
      trim: true,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reporter: {
      type: String,
      default: "Anonymous citizen",
      trim: true,
    },

    photoUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({
  coordinates: "2dsphere",
});

reportSchema.index({
  createdBy: 1,
  createdAt: -1,
});

reportSchema.index({
  authorityId: 1,
  status: 1,
});

module.exports = mongoose.model(
  "Report",
  reportSchema
);