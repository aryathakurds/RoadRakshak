import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  ExternalLink,
  FileText,
  History,
  MapPin,
  Save,
  Search,
  SearchX,
  ShieldCheck,
  Trash2,
  Wrench,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import ResolutionForm from "../components/ResolutionForm";

const statusOptions = [
  "Complaint ready",
  "Sent to authority",
  "Inspection pending",
  "Repair in progress",
  "Resolved",
  "Rejected",
];

const progressStatuses = [
  "Complaint ready",
  "Sent to authority",
  "Inspection pending",
  "Repair in progress",
  "Resolved",
];

const statusContent = {
  "Complaint ready": {
    icon: FileText,
    short: "Prepared",
    description: "Complaint packet is ready",
  },
  "Sent to authority": {
    icon: ShieldCheck,
    short: "Submitted",
    description: "Complaint sent to the authority",
  },
  "Inspection pending": {
    icon: Clock3,
    short: "Inspection",
    description: "Official inspection is pending",
  },
  "Repair in progress": {
    icon: Wrench,
    short: "Repair",
    description: "Repair work is underway",
  },
  Resolved: {
    icon: CheckCircle2,
    short: "Resolved",
    description: "Issue marked as repaired",
  },
  Rejected: {
    icon: XCircle,
    short: "Rejected",
    description: "Complaint closed without repair",
  },
};

const formatDate = (date) => {
  if (!date) return "Not recorded";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getUpdaterName = (historyItem) => {
  if (typeof historyItem.updatedBy === "object") {
    return (
      historyItem.updatedBy?.name ||
      historyItem.updatedByName ||
      "RoadRakshak"
    );
  }

  return historyItem.updatedByName || "RoadRakshak";
};

const getProgressIndex = (status) => {
  if (status === "Rejected") return -1;

  return Math.max(progressStatuses.indexOf(status), 0);
};

const getStepState = (reportStatus, stepIndex) => {
  if (reportStatus === "Rejected") return "pending";

  const currentIndex = getProgressIndex(reportStatus);

  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "active";

  return "pending";
};

const getSeverityClass = (severity = "") =>
  severity.toLowerCase().replace(/\s+/g, "-");

function ReportStatus({
  reports,
  user,
  handleDeleteReport,
  handleUpdateStatus,
  handleSaveComplaint,
  handleResolveReport,
  openReportDetails,
}) {
  const [complaintForms, setComplaintForms] = useState({});
  const [savingReportId, setSavingReportId] = useState("");
  const [expandedReportId, setExpandedReportId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const canManageStatus = [
    "moderator",
    "authority",
    "admin",
  ].includes(user?.role);

  const canDeleteAny = ["moderator", "admin"].includes(user?.role);

  const summary = useMemo(() => {
    return reports.reduce(
      (result, report) => {
        result.total += 1;

        if (report.status === "Resolved") {
          result.resolved += 1;
        } else if (report.status === "Rejected") {
          result.rejected += 1;
        } else if (report.status === "Repair in progress") {
          result.inProgress += 1;
        } else {
          result.pending += 1;
        }

        return result;
      },
      {
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0,
        rejected: 0,
      }
    );
  }, [reports]);

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      const searchableText = [
        report.id,
        report.issue,
        report.location,
        report.authority,
        report.status,
        report.complaintReference,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(query);
    });
  }, [reports, searchQuery, statusFilter]);

  const getComplaintForm = (report) => {
    return (
      complaintForms[report.id] || {
        complaintReference: report.complaintReference || "",
        complaintSubmittedAt: report.complaintSubmittedAt
          ? new Date(report.complaintSubmittedAt)
              .toISOString()
              .slice(0, 10)
          : "",
        statusNote: "",
      }
    );
  };

  const updateComplaintForm = (report, field, value) => {
    setComplaintForms((current) => ({
      ...current,
      [report.id]: {
        ...getComplaintForm(report),
        [field]: value,
      },
    }));
  };

  const saveComplaint = async (report) => {
    const form = getComplaintForm(report);

    if (!form.complaintReference.trim()) return;

    try {
      setSavingReportId(report.id);

      await handleSaveComplaint(report.id, {
        complaintReference: form.complaintReference.trim(),

        complaintSubmittedAt: form.complaintSubmittedAt
          ? new Date(
              `${form.complaintSubmittedAt}T12:00:00`
            ).toISOString()
          : new Date().toISOString(),

        status:
          report.status === "Complaint ready"
            ? "Sent to authority"
            : report.status,

        statusNote:
          form.statusNote.trim() ||
          `Official complaint reference ${form.complaintReference.trim()} recorded.`,
      });

      setComplaintForms((current) => {
        const next = { ...current };
        delete next[report.id];
        return next;
      });
    } finally {
      setSavingReportId("");
    }
  };

  const toggleReport = (reportId) => {
    setExpandedReportId((current) =>
      current === reportId ? "" : reportId
    );
  };

  return (
    <main className="trackingPage">
      <style>{styles}</style>

      <header className="trackingHeader">
        <div>
          <span className="trackingEyebrow">
            Road issue operations
          </span>

          <h1>Complaint status centre</h1>

          <p>
            Track every road report from citizen evidence to
            verified repair.
          </p>
        </div>

        <div
          className={`trackingAccess ${
            canManageStatus ? "enabled" : ""
          }`}
        >
          <ShieldCheck size={19} />

          <div>
            <strong>
              {canManageStatus
                ? "Management access"
                : "Citizen tracking"}
            </strong>

            <span>
              {canManageStatus
                ? `${user?.role || "Authority"} controls enabled`
                : "Official updates are read-only"}
            </span>
          </div>
        </div>
      </header>

      <section className="trackingSummary">
        <div>
          <span>All reports</span>
          <strong>{summary.total}</strong>
          <small>Currently visible</small>
        </div>

        <div>
          <span>Awaiting action</span>
          <strong>{summary.pending}</strong>
          <small>Submitted or under inspection</small>
        </div>

        <div>
          <span>Repair underway</span>
          <strong>{summary.inProgress}</strong>
          <small>Work marked as started</small>
        </div>

        <div>
          <span>Resolved</span>
          <strong>{summary.resolved}</strong>
          <small>Repair completion recorded</small>
        </div>
      </section>

      <section className="trackingToolbar">
        <label className="trackingSearch">
          <Search size={18} />

          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search report, location or complaint number"
          />
        </label>

        <div className="trackingFilters">
          {[
            "All",
            "Complaint ready",
            "Sent to authority",
            "Inspection pending",
            "Repair in progress",
            "Resolved",
          ].map((status) => (
            <button
              className={statusFilter === status ? "active" : ""}
              type="button"
              key={status}
              onClick={() => setStatusFilter(status)}
            >
              {status === "All"
                ? "All"
                : statusContent[status]?.short || status}
            </button>
          ))}
        </div>
      </section>

      {filteredReports.length === 0 ? (
        <section className="trackingEmpty">
          <SearchX size={32} />
          <strong>No matching reports</strong>
          <p>
            Change the search text or select another status.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("All");
            }}
          >
            Clear filters
          </button>
        </section>
      ) : (
        <section className="trackingList">
          {filteredReports.map((report) => {
            const complaintForm = getComplaintForm(report);
            const isExpanded = expandedReportId === report.id;
            const StatusIcon =
              statusContent[report.status]?.icon || Clock3;
            const progressIndex = getProgressIndex(report.status);

            const statusHistory = [
              ...(report.statusHistory || []),
            ].sort(
              (first, second) =>
                new Date(second.createdAt) -
                new Date(first.createdAt)
            );

            return (
              <article
                className={`trackingCase ${
                  isExpanded ? "expanded" : ""
                }`}
                key={report.id}
              >
                <div className="trackingCaseHeader">
                  <button
                    className="trackingCaseIdentity"
                    type="button"
                    onClick={() => openReportDetails(report)}
                  >
                    <span className="trackingCaseIcon">
                      <StatusIcon size={21} />
                    </span>

                    <div>
                      <small>
                        Report {String(report.id).slice(-8)}
                      </small>

                      <h2>{report.issue}</h2>

                      <p>
                        <MapPin size={14} />
                        {report.location || "Location unavailable"}
                      </p>
                    </div>
                  </button>

                  <div className="trackingCaseStatus">
                    <span
                      className={`trackingSeverity ${getSeverityClass(
                        report.severity
                      )}`}
                    >
                      {report.severity}
                    </span>

                    <strong
                      className={`trackingStatusBadge status-${getSeverityClass(
                        report.status
                      )}`}
                    >
                      <StatusIcon size={15} />
                      {report.status}
                    </strong>

                    {canDeleteAny && (
                      <button
                        className="trackingDelete"
                        type="button"
                        onClick={() => handleDeleteReport(report.id)}
                        aria-label={`Delete ${report.id}`}
                        title="Delete report"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>
                </div>

                {report.status === "Rejected" ? (
                  <div className="trackingRejected">
                    <XCircle size={20} />

                    <div>
                      <strong>Complaint closed</strong>
                      <span>
                        This report was rejected or closed without a
                        recorded repair.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="trackingProgress">
                    <div
                      className="trackingProgressLine"
                      aria-hidden="true"
                    >
                      <span
                        style={{
                          width: `${(progressIndex / 4) * 100}%`,
                        }}
                      />
                    </div>

                    {progressStatuses.map((status, index) => {
                      const step = statusContent[status];
                      const StepIcon = step.icon;
                      const state = getStepState(report.status, index);

                      return (
                        <div
                          className={`trackingStep ${state}`}
                          key={status}
                        >
                          <span className="trackingStepIcon">
                            {state === "completed" ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              <StepIcon size={18} />
                            )}
                          </span>

                          <div>
                            <strong>{step.short}</strong>
                            <small>{step.description}</small>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="trackingQuickInfo">
                  <div>
                    <span>Responsible authority</span>
                    <strong>
                      {report.authority || "Authority pending"}
                    </strong>
                  </div>

                  <div>
                    <span>Complaint number</span>
                    <strong>
                      {report.complaintReference || "Not recorded"}
                    </strong>
                  </div>

                  <div>
                    <span>Submitted</span>
                    <strong>
                      {formatDate(report.complaintSubmittedAt)}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleReport(report.id)}
                  >
                    {isExpanded ? (
                      <>
                        Hide case
                        <ChevronUp size={17} />
                      </>
                    ) : (
                      <>
                        Manage case
                        <ChevronDown size={17} />
                      </>
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="trackingExpanded">
                    <section className="trackingCaseDetails">
                      <div className="trackingPanelHeading">
                        <div>
                          <span>Official routing</span>
                          <h3>Complaint information</h3>
                        </div>

                        <Building2 size={20} />
                      </div>

                      <dl className="trackingDefinitionList">
                        <div>
                          <dt>Authority</dt>
                          <dd>
                            {report.authority ||
                              "No authority assigned"}
                          </dd>
                        </div>

                        <div>
                          <dt>Complaint channel</dt>
                          <dd>
                            {report.channel ||
                              "Channel unavailable"}
                          </dd>
                        </div>

                        <div>
                          <dt>Reference number</dt>
                          <dd>
                            {report.complaintReference ||
                              "Not recorded"}
                          </dd>
                        </div>

                        <div>
                          <dt>Submission date</dt>
                          <dd>
                            {formatDate(
                              report.complaintSubmittedAt
                            )}
                          </dd>
                        </div>
                      </dl>

                      <div className="trackingLinkRow">
                        <button
                          type="button"
                          onClick={() => openReportDetails(report)}
                        >
                          <MapPin size={16} />
                          View full report
                        </button>

                        {report.complaintPortalUrl && (
                          <a
                            href={report.complaintPortalUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <ExternalLink size={16} />
                            Official portal
                          </a>
                        )}
                      </div>
                    </section>

                    {canManageStatus && (
                      <section className="trackingManagement">
                        <div className="trackingPanelHeading">
                          <div>
                            <span>Authority controls</span>
                            <h3>Update complaint</h3>
                          </div>

                          <ShieldCheck size={20} />
                        </div>

                        <label className="trackingField">
                          <span>Official status</span>

                          <select
                            value={report.status}
                            onChange={(event) =>
                              handleUpdateStatus(
                                report.id,
                                event.target.value
                              )
                            }
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </label>

                        <div className="trackingFormGrid">
                          <label className="trackingField">
                            <span>Complaint reference</span>

                            <input
                              value={
                                complaintForm.complaintReference
                              }
                              onChange={(event) =>
                                updateComplaintForm(
                                  report,
                                  "complaintReference",
                                  event.target.value
                                )
                              }
                              placeholder="Government complaint number"
                            />
                          </label>

                          <label className="trackingField">
                            <span>Submission date</span>

                            <input
                              type="date"
                              value={
                                complaintForm.complaintSubmittedAt
                              }
                              onChange={(event) =>
                                updateComplaintForm(
                                  report,
                                  "complaintSubmittedAt",
                                  event.target.value
                                )
                              }
                            />
                          </label>
                        </div>

                        <label className="trackingField">
                          <span>Tracking note</span>

                          <textarea
                            rows="3"
                            value={complaintForm.statusNote}
                            onChange={(event) =>
                              updateComplaintForm(
                                report,
                                "statusNote",
                                event.target.value
                              )
                            }
                            placeholder="Add an official update about this complaint"
                          />
                        </label>

                        <button
                          className="trackingSave"
                          type="button"
                          disabled={
                            savingReportId === report.id ||
                            !complaintForm.complaintReference.trim()
                          }
                          onClick={() => saveComplaint(report)}
                        >
                          <Save size={17} />

                          {savingReportId === report.id
                            ? "Saving update..."
                            : "Save complaint details"}
                        </button>
                      </section>
                    )}

                    <section className="trackingHistory">
                      <div className="trackingPanelHeading">
                        <div>
                          <span>Recorded activity</span>
                          <h3>Case history</h3>
                        </div>

                        <History size={20} />
                      </div>

                      {statusHistory.length > 0 ? (
                        <div className="trackingHistoryList">
                          {statusHistory.map((historyItem) => {
                            const HistoryIcon =
                              statusContent[historyItem.status]
                                ?.icon || Clock3;

                            return (
                              <div
                                className="trackingHistoryItem"
                                key={
                                  historyItem._id ||
                                  `${historyItem.status}-${historyItem.createdAt}`
                                }
                              >
                                <span>
                                  <HistoryIcon size={16} />
                                </span>

                                <div>
                                  <strong>{historyItem.status}</strong>

                                  <p>
                                    {historyItem.note ||
                                      "Status updated."}
                                  </p>

                                  <small>
                                    {getUpdaterName(historyItem)}
                                    {" | "}
                                    {formatDateTime(
                                      historyItem.createdAt
                                    )}
                                  </small>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="trackingHistoryEmpty">
                          <Clock3 size={20} />
                          <span>
                            No additional tracking history recorded.
                          </span>
                        </div>
                      )}
                    </section>

                    {canManageStatus &&
                      report.status !== "Resolved" &&
                      report.status !== "Rejected" && (
                        <section className="trackingResolution">
                          <div className="trackingPanelHeading">
                            <div>
                              <span>Repair verification</span>
                              <h3>Close this report</h3>
                            </div>

                            <Wrench size={20} />
                          </div>

                          <ResolutionForm
                            report={report}
                            handleResolveReport={
                              handleResolveReport
                            }
                          />
                        </section>
                      )}

                    {report.status === "Resolved" && (
                      <section className="trackingResolved">
                        <div className="trackingResolvedHeading">
                          <span>
                            <CheckCircle2 size={21} />
                          </span>

                          <div>
                            <strong>Repair verified</strong>
                            <small>
                              {report.resolvedAt
                                ? formatDateTime(report.resolvedAt)
                                : "Resolution date unavailable"}
                            </small>
                          </div>
                        </div>

                        <p>
                          {report.resolutionNote ||
                            "This road issue has been marked as resolved."}
                        </p>

                        <div className="trackingEvidence">
                          {report.photoUrl && (
                            <figure>
                              <img
                                src={report.photoUrl}
                                alt="Road before repair"
                              />
                              <figcaption>Before repair</figcaption>
                            </figure>
                          )}

                          {report.resolutionEvidenceUrl && (
                            <figure>
                              <img
                                src={report.resolutionEvidenceUrl}
                                alt="Road after repair"
                              />
                              <figcaption>After repair</figcaption>
                            </figure>
                          )}
                        </div>
                      </section>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

const styles = `
  .trackingPage,
  .trackingPage * {
    box-sizing: border-box;
  }

  .trackingPage {
    width: min(1380px, 100%);
    min-height: 100vh;
    margin: 0 auto;
    padding: 28px 30px 70px;
    color: #171b18;
    background: #f3f5f3;
  }

  .trackingHeader {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 30px;
    padding: 36px 0 30px;
    border-bottom: 1px solid #cfd5d1;
  }

  .trackingEyebrow {
    color: #626c65;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .trackingHeader h1 {
    max-width: 720px;
    margin: 8px 0 0;
    font-size: clamp(35px, 5vw, 62px);
    font-weight: 600;
    line-height: 1.02;
    letter-spacing: 0;
  }

  .trackingHeader p {
    max-width: 650px;
    margin: 14px 0 0;
    color: #68716b;
    font-size: 15px;
    line-height: 1.6;
  }

  .trackingAccess {
    min-width: 230px;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 14px 16px;
    border: 1px solid #cbd2cd;
    background: #ffffff;
  }

  .trackingAccess.enabled {
    color: #ffffff;
    border-color: #171b18;
    background: #171b18;
  }

  .trackingAccess strong,
  .trackingAccess span {
    display: block;
  }

  .trackingAccess strong {
    font-size: 12px;
  }

  .trackingAccess span {
    margin-top: 3px;
    color: #727b75;
    font-size: 10px;
  }

  .trackingAccess.enabled span {
    color: rgba(255, 255, 255, 0.65);
  }

  .trackingSummary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin-top: 24px;
    border: 1px solid #cfd5d1;
    background: #ffffff;
  }

  .trackingSummary > div {
    min-height: 126px;
    padding: 20px;
    border-right: 1px solid #d7dcd9;
  }

  .trackingSummary > div:last-child {
    border-right: 0;
  }

  .trackingSummary span,
  .trackingSummary strong,
  .trackingSummary small {
    display: block;
  }

  .trackingSummary span {
    color: #657069;
    font-size: 11px;
  }

  .trackingSummary strong {
    margin-top: 10px;
    font-size: 31px;
    font-weight: 600;
  }

  .trackingSummary small {
    margin-top: 7px;
    color: #8a918d;
    font-size: 9px;
  }

  .trackingToolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: 22px;
  }

  .trackingSearch {
    width: min(390px, 100%);
    min-height: 43px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 13px;
    border: 1px solid #bdc6c0;
    background: #ffffff;
  }

  .trackingSearch input {
    width: 100%;
    border: 0;
    outline: 0;
    color: #171b18;
    background: transparent;
    font-size: 12px;
  }

  .trackingFilters {
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
  }

  .trackingFilters button {
    min-height: 38px;
    flex: 0 0 auto;
    padding: 0 13px;
    border: 1px solid #c8cfcb;
    color: #505954;
    background: transparent;
    font: inherit;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .trackingFilters button.active {
    color: #ffffff;
    border-color: #171b18;
    background: #171b18;
  }

  .trackingList {
    display: grid;
    gap: 14px;
    margin-top: 22px;
  }

  .trackingCase {
    overflow: hidden;
    border: 1px solid #cfd5d1;
    background: #ffffff;
    transition:
      border-color 180ms ease,
      box-shadow 180ms ease,
      transform 180ms ease;
  }

  .trackingCase:hover,
  .trackingCase.expanded {
    border-color: #939d96;
    box-shadow: 0 16px 36px rgba(18, 25, 21, 0.07);
  }

  .trackingCaseHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 22px;
    padding: 21px 23px;
  }

  .trackingCaseIdentity {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0;
    border: 0;
    color: inherit;
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  .trackingCaseIcon {
    width: 44px;
    height: 44px;
    display: grid;
    flex: 0 0 44px;
    place-items: center;
    border: 1px solid #b9c2bc;
    border-radius: 50%;
    color: #2a312c;
    background: #f5f6f5;
  }

  .trackingCaseIdentity small {
    display: block;
    color: #7b847e;
    font-size: 9px;
    text-transform: uppercase;
  }

  .trackingCaseIdentity h2 {
    margin: 4px 0 0;
    font-size: 18px;
    font-weight: 600;
  }

  .trackingCaseIdentity p {
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 6px 0 0;
    overflow: hidden;
    color: #626c65;
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trackingCaseStatus {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .trackingSeverity,
  .trackingStatusBadge {
    min-height: 30px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 10px;
    border: 1px solid #c9d0cc;
    font-size: 9px;
    font-weight: 700;
    white-space: nowrap;
  }

  .trackingSeverity.critical {
    color: #9c251c;
    border-color: #e5aaa4;
    background: #fff1ef;
  }

  .trackingSeverity.high {
    color: #855400;
    border-color: #e8ca8e;
    background: #fff8e8;
  }

  .trackingSeverity.medium {
    color: #205b91;
    border-color: #b8d4ec;
    background: #eff7ff;
  }

  .trackingSeverity.low {
    color: #42614f;
    background: #f2f7f3;
  }

  .trackingStatusBadge {
    color: #ffffff;
    border-color: #252b27;
    background: #252b27;
  }

  .trackingStatusBadge.status-resolved {
    border-color: #17623a;
    background: #17623a;
  }

  .trackingStatusBadge.status-rejected {
    border-color: #922b24;
    background: #922b24;
  }

  .trackingDelete {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border: 1px solid #e0aaa6;
    color: #9b2921;
    background: #fff7f6;
    cursor: pointer;
  }

  .trackingProgress {
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding: 25px 25px 23px;
    border-top: 1px solid #d8ddda;
    border-bottom: 1px solid #d8ddda;
    background: #fafbfa;
  }

  .trackingProgressLine {
    position: absolute;
    top: 43px;
    right: 10%;
    left: 10%;
    height: 2px;
    overflow: hidden;
    background: #d4dad6;
  }

  .trackingProgressLine span {
    position: relative;
    display: block;
    height: 100%;
    background: #202622;
    transition: width 500ms ease;
  }

  .trackingProgressLine span::after {
    position: absolute;
    top: 0;
    right: 0;
    width: 70px;
    height: 100%;
    content: "";
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.9)
    );
    animation: trackingProgressShine 2.2s linear infinite;
  }

  .trackingStep {
    position: relative;
    z-index: 2;
    display: grid;
    justify-items: center;
    padding: 0 8px;
    text-align: center;
  }

  .trackingStepIcon {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border: 2px solid #d0d6d2;
    border-radius: 50%;
    color: #89918c;
    background: #fafbfa;
  }

  .trackingStep.completed .trackingStepIcon {
    color: #ffffff;
    border-color: #202622;
    background: #202622;
  }

  .trackingStep.active .trackingStepIcon {
    color: #171b18;
    border-color: #171b18;
    background: #ffffff;
    animation: trackingActivePulse 2s ease-in-out infinite;
  }

  .trackingStep strong,
  .trackingStep small {
    display: block;
  }

  .trackingStep strong {
    margin-top: 10px;
    color: #7c857f;
    font-size: 10px;
  }

  .trackingStep.completed strong,
  .trackingStep.active strong {
    color: #171b18;
  }

  .trackingStep small {
    max-width: 125px;
    margin-top: 4px;
    color: #939a96;
    font-size: 8px;
    line-height: 1.4;
  }

  .trackingQuickInfo {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr 0.7fr auto;
    align-items: stretch;
  }

  .trackingQuickInfo > div {
    padding: 15px 20px;
    border-right: 1px solid #d8ddda;
  }

  .trackingQuickInfo span,
  .trackingQuickInfo strong {
    display: block;
  }

  .trackingQuickInfo span {
    color: #7a837d;
    font-size: 8px;
    text-transform: uppercase;
  }

  .trackingQuickInfo strong {
    margin-top: 5px;
    overflow: hidden;
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trackingQuickInfo > button {
    min-width: 135px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 0;
    color: #ffffff;
    background: #171b18;
    font: inherit;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .trackingExpanded {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    border-top: 1px solid #cfd5d1;
    background: #cfd5d1;
    animation: trackingReveal 260ms ease both;
  }

  .trackingCaseDetails,
  .trackingManagement,
  .trackingHistory,
  .trackingResolution,
  .trackingResolved {
    min-width: 0;
    padding: 23px;
    background: #ffffff;
  }

  .trackingPanelHeading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 19px;
  }

  .trackingPanelHeading span {
    color: #7d857f;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .trackingPanelHeading h3 {
    margin: 5px 0 0;
    font-size: 17px;
    font-weight: 600;
  }

  .trackingDefinitionList {
    margin: 0;
  }

  .trackingDefinitionList > div {
    display: grid;
    grid-template-columns: 145px 1fr;
    gap: 15px;
    padding: 11px 0;
    border-bottom: 1px solid #e0e4e1;
  }

  .trackingDefinitionList dt {
    color: #7a837d;
    font-size: 9px;
  }

  .trackingDefinitionList dd {
    margin: 0;
    font-size: 10px;
    font-weight: 600;
    line-height: 1.5;
  }

  .trackingLinkRow {
    display: flex;
    gap: 9px;
    margin-top: 17px;
  }

  .trackingLinkRow button,
  .trackingLinkRow a {
    min-height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 0 12px;
    border: 1px solid #aeb7b1;
    color: #171b18;
    background: #ffffff;
    font: inherit;
    font-size: 9px;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
  }

  .trackingField {
    display: grid;
    gap: 7px;
    margin-bottom: 13px;
  }

  .trackingField > span {
    font-size: 9px;
    font-weight: 700;
  }

  .trackingField input,
  .trackingField select,
  .trackingField textarea {
    width: 100%;
    border: 1px solid #b9c2bc;
    border-radius: 0;
    outline: 0;
    color: #171b18;
    background: #ffffff;
    font: inherit;
    font-size: 10px;
  }

  .trackingField input,
  .trackingField select {
    min-height: 41px;
    padding: 0 11px;
  }

  .trackingField textarea {
    padding: 11px;
    resize: vertical;
    line-height: 1.5;
  }

  .trackingField input:focus,
  .trackingField select:focus,
  .trackingField textarea:focus {
    border-color: #171b18;
  }

  .trackingFormGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 11px;
  }

  .trackingSave {
    min-height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 15px;
    border: 1px solid #171b18;
    color: #ffffff;
    background: #171b18;
    font: inherit;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .trackingSave:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .trackingHistoryList {
    display: grid;
  }

  .trackingHistoryItem {
    position: relative;
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 11px;
    padding-bottom: 17px;
  }

  .trackingHistoryItem:not(:last-child)::before {
    position: absolute;
    top: 31px;
    bottom: 0;
    left: 15px;
    width: 1px;
    content: "";
    background: #ccd3cf;
  }

  .trackingHistoryItem > span {
    position: relative;
    z-index: 2;
    width: 31px;
    height: 31px;
    display: grid;
    place-items: center;
    border: 1px solid #aeb7b1;
    border-radius: 50%;
    background: #ffffff;
  }

  .trackingHistoryItem strong {
    font-size: 11px;
  }

  .trackingHistoryItem p {
    margin: 4px 0 0;
    color: #646d67;
    font-size: 9px;
    line-height: 1.5;
  }

  .trackingHistoryItem small {
    display: block;
    margin-top: 5px;
    color: #8a918d;
    font-size: 8px;
  }

  .trackingHistoryEmpty {
    min-height: 90px;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 8px;
    border: 1px dashed #bfc7c2;
    color: #747d77;
    font-size: 9px;
  }

  .trackingResolution,
  .trackingResolved {
    grid-column: 1 / -1;
  }

  .trackingResolved {
    color: #ffffff;
    background: #14271d;
  }

  .trackingResolvedHeading {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .trackingResolvedHeading > span {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.45);
    border-radius: 50%;
  }

  .trackingResolvedHeading strong,
  .trackingResolvedHeading small {
    display: block;
  }

  .trackingResolvedHeading small {
    margin-top: 4px;
    color: rgba(255, 255, 255, 0.62);
  }

  .trackingResolved > p {
    max-width: 760px;
    margin: 18px 0 0;
    color: rgba(255, 255, 255, 0.75);
    font-size: 11px;
    line-height: 1.6;
  }

  .trackingEvidence {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 360px));
    gap: 13px;
    margin-top: 18px;
  }

  .trackingEvidence figure {
    margin: 0;
  }

  .trackingEvidence img {
    width: 100%;
    height: 180px;
    display: block;
    object-fit: cover;
  }

  .trackingEvidence figcaption {
    padding: 8px 0;
    color: rgba(255, 255, 255, 0.65);
    font-size: 8px;
    text-transform: uppercase;
  }

  .trackingRejected {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 18px 23px;
    border-top: 1px solid #e0b3af;
    border-bottom: 1px solid #e0b3af;
    color: #81241e;
    background: #fff4f3;
  }

  .trackingRejected strong,
  .trackingRejected span {
    display: block;
  }

  .trackingRejected strong {
    font-size: 11px;
  }

  .trackingRejected span {
    margin-top: 3px;
    color: #93534e;
    font-size: 9px;
  }

  .trackingEmpty {
    min-height: 320px;
    display: grid;
    align-content: center;
    justify-items: center;
    margin-top: 22px;
    padding: 35px;
    border: 1px solid #cfd5d1;
    color: #707973;
    background: #ffffff;
    text-align: center;
  }

  .trackingEmpty strong {
    margin-top: 13px;
    color: #171b18;
    font-size: 17px;
  }

  .trackingEmpty p {
    margin: 7px 0 0;
    font-size: 11px;
  }

  .trackingEmpty button {
    min-height: 38px;
    margin-top: 17px;
    padding: 0 15px;
    border: 1px solid #171b18;
    color: #ffffff;
    background: #171b18;
    font: inherit;
    font-size: 10px;
    font-weight: 700;
  }

  @keyframes trackingReveal {
    from {
      opacity: 0;
      transform: translateY(-7px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes trackingActivePulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 rgba(23, 27, 24, 0.2);
    }

    50% {
      box-shadow: 0 0 0 7px rgba(23, 27, 24, 0);
    }
  }

  @keyframes trackingProgressShine {
    from {
      transform: translateX(-220px);
    }

    to {
      transform: translateX(70px);
    }
  }

  @media (max-width: 1050px) {
    .trackingToolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .trackingSearch {
      width: 100%;
    }

    .trackingSummary {
      grid-template-columns: repeat(2, 1fr);
    }

    .trackingSummary > div:nth-child(2) {
      border-right: 0;
    }

    .trackingSummary > div:nth-child(-n + 2) {
      border-bottom: 1px solid #d7dcd9;
    }

    .trackingQuickInfo {
      grid-template-columns: 1fr 1fr;
    }

    .trackingQuickInfo > div:nth-child(2) {
      border-right: 0;
    }

    .trackingQuickInfo > button {
      min-height: 46px;
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 780px) {
    .trackingPage {
      padding: 20px 16px 55px;
    }

    .trackingHeader {
      align-items: flex-start;
      flex-direction: column;
    }

    .trackingAccess {
      width: 100%;
    }

    .trackingCaseHeader {
      align-items: flex-start;
      flex-direction: column;
    }

    .trackingCaseStatus {
      width: 100%;
      flex-wrap: wrap;
    }

    .trackingProgress {
      grid-template-columns: 1fr;
      gap: 0;
      padding: 20px;
    }

    .trackingProgressLine {
      top: 39px;
      bottom: 39px;
      left: 38px;
      width: 2px;
      height: auto;
    }

    .trackingProgressLine span {
      width: 100% !important;
      height: 0;
    }

    .trackingStep {
      min-height: 61px;
      grid-template-columns: 38px 1fr;
      align-items: center;
      justify-items: stretch;
      gap: 12px;
      padding: 0;
      text-align: left;
    }

    .trackingStep strong {
      margin-top: 0;
    }

    .trackingStep small {
      max-width: none;
    }

    .trackingExpanded {
      grid-template-columns: 1fr;
    }

    .trackingResolution,
    .trackingResolved {
      grid-column: auto;
    }

    .trackingFormGrid {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }

  @media (max-width: 520px) {
    .trackingHeader h1 {
      font-size: 38px;
    }

    .trackingSummary {
      grid-template-columns: 1fr 1fr;
    }

    .trackingSummary > div {
      min-height: 108px;
      padding: 15px;
    }

    .trackingSummary strong {
      font-size: 25px;
    }

    .trackingCaseHeader {
      padding: 18px;
    }

    .trackingCaseIdentity {
      align-items: flex-start;
    }

    .trackingStatusBadge {
      max-width: 100%;
      white-space: normal;
    }

    .trackingQuickInfo {
      grid-template-columns: 1fr;
    }

    .trackingQuickInfo > div {
      border-right: 0;
      border-bottom: 1px solid #d8ddda;
    }

    .trackingQuickInfo > button {
      grid-column: auto;
    }

    .trackingDefinitionList > div {
      grid-template-columns: 1fr;
      gap: 5px;
    }

    .trackingLinkRow {
      flex-direction: column;
    }

    .trackingEvidence {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trackingCase,
    .trackingProgressLine span,
    .trackingProgressLine span::after,
    .trackingStep.active .trackingStepIcon,
    .trackingExpanded {
      animation: none;
      transition: none;
    }
  }
`;

export default ReportStatus;