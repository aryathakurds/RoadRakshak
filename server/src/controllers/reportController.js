const Report = require("../models/Report");
const cloudinary = require("../config/cloudinary");

const validSeverities = ["Low", "Medium", "High", "Critical"];

const validIssueTypes = [
  "Pothole",
  "Broken road surface",
  "Road crack",
  "Waterlogging",
  "Open manhole",
  "Garbage or obstruction",
  "Damaged divider",
  "Missing road sign",
  "Other road issue",
];

const uploadImage = (fileBuffer, folder = "roadrakshak/reports") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

const populateReport = (query) => {
  return query
    .populate("createdBy", "name role")
    .populate("resolvedBy", "name role")
    .populate(
      "authorityId",
      "name shortName type state city complaintUrl officialWebsite"
    )
    .populate("statusHistory.updatedBy", "name role");
};

const cleanText = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

const parseJsonField = (value) => {
  if (!value) {
    return {};
  }

  if (typeof value === "object") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
};

const parseDateOrNull = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const sanitizeAiReport = (value) => {
  const aiReport = parseJsonField(value);

  const cleaned = {
    improvedDescription: cleanText(aiReport.improvedDescription),
    complaintLetter: cleanText(aiReport.complaintLetter),
    riskSummary: cleanText(aiReport.riskSummary),
    suggestedAction: cleanText(aiReport.suggestedAction),
    suggestedSeverity: cleanText(aiReport.suggestedSeverity),
    model: cleanText(aiReport.model),
    generatedAt: parseDateOrNull(aiReport.generatedAt),
  };

  const hasAiContent = Boolean(
    cleaned.improvedDescription ||
      cleaned.complaintLetter ||
      cleaned.riskSummary ||
      cleaned.suggestedAction ||
      cleaned.suggestedSeverity
  );

  if (!hasAiContent) {
    return {};
  }

  if (!validSeverities.includes(cleaned.suggestedSeverity)) {
    cleaned.suggestedSeverity = "";
  }

  if (!cleaned.generatedAt) {
    cleaned.generatedAt = new Date();
  }

  return cleaned;
};

const sanitizeAiDetection = (value) => {
  const aiDetection = parseJsonField(value);

  const cleaned = {
    isRoadIssue:
      aiDetection.isRoadIssue === true || aiDetection.isRoadIssue === "true",

    issueType: cleanText(aiDetection.issueType),
    confidence: cleanText(aiDetection.confidence),
    severity: cleanText(aiDetection.severity),
    description: cleanText(aiDetection.description),
    riskSummary: cleanText(aiDetection.riskSummary),
    suggestedAction: cleanText(aiDetection.suggestedAction),
    visibleEvidence: cleanText(aiDetection.visibleEvidence),
    model: cleanText(aiDetection.model),
    analyzedAt: parseDateOrNull(aiDetection.analyzedAt),
  };

  const hasDetectionContent = Boolean(
    cleaned.issueType ||
      cleaned.confidence ||
      cleaned.severity ||
      cleaned.description ||
      cleaned.riskSummary ||
      cleaned.suggestedAction ||
      cleaned.visibleEvidence
  );

  if (!hasDetectionContent) {
    return {};
  }

  if (!validIssueTypes.includes(cleaned.issueType)) {
    cleaned.issueType = "Other road issue";
  }

  if (!validSeverities.includes(cleaned.severity)) {
    cleaned.severity = "";
  }

  if (!cleaned.analyzedAt) {
    cleaned.analyzedAt = new Date();
  }

  return cleaned;
};

const getReports = async (request, response) => {
  try {
    const reports = await populateReport(
      Report.find().sort({
        createdAt: -1,
      })
    );

    response.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyReports = async (request, response) => {
  try {
    const reports = await populateReport(
      Report.find({
        createdBy: request.user._id,
      }).sort({
        createdAt: -1,
      })
    );

    response.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getReportById = async (request, response) => {
  try {
    const report = await populateReport(Report.findById(request.params.id));

    if (!report) {
      return response.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    response.status(200).json({
      success: true,
      report,
    });
  } catch {
    response.status(400).json({
      success: false,
      message: "Invalid report ID",
    });
  }
};

const createReport = async (request, response) => {
  try {
    let photoUrl = "";

    if (request.file) {
      const image = await uploadImage(request.file.buffer);
      photoUrl = image.secure_url;
    }

    const longitude = Number(request.body.longitude);
    const latitude = Number(request.body.latitude);

    const aiReport = sanitizeAiReport(request.body.aiReport);
    const aiDetection = sanitizeAiDetection(request.body.aiDetection);

    const initialStatus = "Complaint ready";

    const report = await Report.create({
      issue: request.body.issue,
      severity: validSeverities.includes(request.body.severity)
        ? request.body.severity
        : "Medium",

      description: request.body.description,
      location: request.body.location,

      coordinates: {
        type: "Point",
        coordinates: [
          Number.isFinite(longitude) ? longitude : 78.6569,
          Number.isFinite(latitude) ? latitude : 22.9734,
        ],
      },

      authorityId: request.body.authorityId || null,

      authority: request.body.authority || "Authority pending",

      channel: request.body.channel || "Complaint channel pending",

      complaintPortalUrl: request.body.complaintPortalUrl || "",

      aiReport,
      aiDetection,

      status: initialStatus,

      statusHistory: [
        {
          status: initialStatus,
          note:
            aiReport.complaintLetter || aiDetection.issueType
              ? "Road issue report created with AI assistance."
              : "Road issue report created and complaint draft prepared.",
          updatedBy: request.user._id,
          updatedByName: request.user.name,
        },
      ],

      createdBy: request.user._id,
      reporter: request.user.name,
      photoUrl,
    });

    const savedReport = await populateReport(Report.findById(report._id));

    response.status(201).json({
      success: true,
      message: "Road report created",
      report: savedReport,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateReport = async (request, response) => {
  try {
    const report = await Report.findById(request.params.id);

    if (!report) {
      return response.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const editableFields = [
      "issue",
      "severity",
      "description",
      "location",
      "authorityId",
      "authority",
      "channel",
      "complaintPortalUrl",
      "complaintReference",
      "complaintSubmittedAt",
      "resolutionNote",
    ];

    editableFields.forEach((field) => {
      if (request.body[field] !== undefined) {
        report[field] =
          request.body[field] || (field === "authorityId" ? null : "");
      }
    });

    if (request.body.aiReport !== undefined) {
      report.aiReport = sanitizeAiReport(request.body.aiReport);
    }

    if (request.body.aiDetection !== undefined) {
      report.aiDetection = sanitizeAiDetection(request.body.aiDetection);
    }

    const nextStatus = request.body.status;
    const statusNote = String(request.body.statusNote || "").trim();

    if (nextStatus && nextStatus !== report.status) {
      report.status = nextStatus;

      report.statusHistory.push({
        status: nextStatus,
        note: statusNote || `Report status changed to ${nextStatus}.`,
        updatedBy: request.user._id,
        updatedByName: request.user.name,
      });

      if (nextStatus === "Sent to authority") {
        report.complaintSubmittedAt =
          request.body.complaintSubmittedAt ||
          report.complaintSubmittedAt ||
          new Date();
      }

      if (nextStatus === "Resolved") {
        report.resolvedAt = new Date();
        report.resolvedBy = request.user._id;
      } else {
        report.resolvedAt = null;
        report.resolvedBy = null;
      }
    } else if (statusNote) {
      report.statusHistory.push({
        status: report.status,
        note: statusNote,
        updatedBy: request.user._id,
        updatedByName: request.user.name,
      });
    }

    await report.save();

    const updatedReport = await populateReport(Report.findById(report._id));

    response.status(200).json({
      success: true,
      message: "Report updated",
      report: updatedReport,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const resolveReport = async (request, response) => {
  try {
    const report = await Report.findById(request.params.id);

    if (!report) {
      return response.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const resolutionNote = String(request.body.resolutionNote || "").trim();

    if (!resolutionNote) {
      return response.status(400).json({
        success: false,
        message: "Resolution note is required",
      });
    }

    if (!request.file) {
      return response.status(400).json({
        success: false,
        message: "Repair evidence photo is required",
      });
    }

    const image = await uploadImage(
      request.file.buffer,
      "roadrakshak/resolutions"
    );

    report.status = "Resolved";
    report.resolutionNote = resolutionNote;
    report.resolutionEvidenceUrl = image.secure_url;
    report.resolvedAt = new Date();
    report.resolvedBy = request.user._id;

    report.statusHistory.push({
      status: "Resolved",
      note: resolutionNote,
      updatedBy: request.user._id,
      updatedByName: request.user.name,
    });

    await report.save();

    const resolvedReport = await populateReport(Report.findById(report._id));

    response.status(200).json({
      success: true,
      message: "Report resolved with repair evidence",
      report: resolvedReport,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteReport = async (request, response) => {
  try {
    const report = await Report.findById(request.params.id);

    if (!report) {
      return response.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const isOwner =
      report.createdBy &&
      report.createdBy.toString() === request.user._id.toString();

    const canDeleteAny = ["moderator", "admin"].includes(request.user.role);

    if (!isOwner && !canDeleteAny) {
      return response.status(403).json({
        success: false,
        message: "You can only delete your own reports",
      });
    }

    await report.deleteOne();

    response.status(200).json({
      success: true,
      message: "Report deleted",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getReports,
  getMyReports,
  getReportById,
  createReport,
  updateReport,
  resolveReport,
  deleteReport,
};