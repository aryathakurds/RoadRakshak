import {
  Copy,
  ExternalLink,
  FileText,
  SearchX,
  ShieldCheck,
  Trash2,
} from "lucide-react";

function Complaints({
  reports,
  complaintText,
  handleCopyComplaint,
  handleDeleteReport,
  openReportDetails,
}) {
  return (
    <section className="complaintsPage">
      <div className="formIntro">
        <p className="eyebrow">Complaint routing</p>
        <h3>Prepare reports for the responsible authority</h3>
        <p>
          Each complaint can include photographic evidence, GPS coordinates,
          issue severity and the likely responsible authority.
        </p>
      </div>

      <div className="complaintsGrid">
        <div className="sectionBlock">
          <div className="sectionHeader">
            <div>
              <p>Draft generator</p>
              <h3>Current complaint draft</h3>
            </div>

            <button
              className="copyButton"
              type="button"
              onClick={handleCopyComplaint}
            >
              <Copy size={17} />
              Copy
            </button>
          </div>

          <pre className="complaintDraft">{complaintText}</pre>

          <div className="complaintActions">
            <button className="primaryButton" type="button">
              <FileText size={18} />
              Save complaint
            </button>

            <button className="secondaryButton" type="button">
              <ExternalLink size={18} />
              Open authority portal
            </button>
          </div>
        </div>

        <aside className="sectionBlock">
          <div className="sectionHeader">
            <div>
              <p>Authority routing</p>
              <h3>Report queue</h3>
            </div>

            <ShieldCheck size={20} />
          </div>

          {reports.length === 0 ? (
            <div className="emptyState compact">
              <SearchX size={28} />
              <strong>No routed reports</strong>
              <span>No reports match the current filters.</span>
            </div>
          ) : (
            <div className="routingList">
              {reports.map((report) => (
                <div
                  className={`routingItem ${
                    handleDeleteReport
                      ? "routingItemWithAction"
                      : "routingItemWithoutAction"
                  }`}
                  key={report.id}
                >
                  <button
                    className="routingContent"
                    type="button"
                    onClick={() => openReportDetails(report)}
                  >
                    <div>
                      <strong>{report.id}</strong>
                      <span>{report.issue}</span>
                    </div>

                    <p>{report.authority}</p>
                    <small>{report.channel}</small>
                  </button>

                  {handleDeleteReport && (
                    <button
                      className="dangerIconButton"
                      type="button"
                      onClick={() => handleDeleteReport(report.id)}
                      aria-label={`Delete ${report.id}`}
                      title="Delete report"
                    >
                      <Trash2 size={17} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default Complaints;