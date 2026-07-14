import {
  BrainCircuit,
  Camera,
  Copy,
  ExternalLink,
  FileText,
  Image,
  MapPin,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

function ReportDetailsModal({
  selectedReport,
  closeReportDetails,
  handleDeleteReport,
  canDeleteReport,
}) {
  if (!selectedReport) return null;

  const aiReport = selectedReport.aiReport || {};
  const aiDetection = selectedReport.aiDetection || {};

  const hasAiReport = Boolean(
    aiReport.complaintLetter ||
      aiReport.riskSummary ||
      aiReport.suggestedAction ||
      aiReport.improvedDescription
  );

  const hasAiDetection = Boolean(
    aiDetection.issueType ||
      aiDetection.confidence ||
      aiDetection.visibleEvidence ||
      aiDetection.description
  );

  const longitude =
    selectedReport.longitude ||
    selectedReport.coordinates?.coordinates?.[0] ||
    "";

  const latitude =
    selectedReport.latitude ||
    selectedReport.coordinates?.coordinates?.[1] ||
    "";

  const mapUrl =
    latitude && longitude
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : "https://www.google.com/maps";

  const defaultComplaint = `RoadRakshak Complaint Packet

Report ID: ${selectedReport.id}
Issue: ${selectedReport.issue}
Severity: ${selectedReport.severity}
Status: ${selectedReport.status}
Reporter: ${selectedReport.reporter || "Citizen"}

Location: ${selectedReport.location}
Coordinates: ${latitude || "Not set"}, ${longitude || "Not set"}

Likely Responsible Authority:
${selectedReport.authority}

Complaint Channel:
${selectedReport.channel}

Description:
${selectedReport.description || "No description provided."}

Complaint:
A ${selectedReport.severity.toLowerCase()} severity road issue has been reported as "${
    selectedReport.issue
  }" at ${
    selectedReport.location
  }. Kindly inspect this location and take the required repair action for public safety.`;

  const complaintPacket = aiReport.complaintLetter
    ? `RoadRakshak AI Complaint Packet

Report ID: ${selectedReport.id}
Issue: ${selectedReport.issue}
Severity: ${selectedReport.severity}
Status: ${selectedReport.status}
Reporter: ${selectedReport.reporter || "Citizen"}

Location: ${selectedReport.location}
Responsible Authority: ${selectedReport.authority}
Complaint Channel: ${selectedReport.channel}

${aiReport.complaintLetter}`
    : defaultComplaint;

  const copyPacket = async () => {
    await navigator.clipboard.writeText(complaintPacket);
  };

  return (
    <div className="modalOverlay" onMouseDown={closeReportDetails}>
      <section
        className="reportModal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <style>{styles}</style>

        <div className="modalHeader">
          <div>
            <p className="eyebrow">Complaint packet</p>
            <h3>{selectedReport.issue}</h3>
            <span>{selectedReport.id}</span>
          </div>

          <button
            className="iconButton"
            type="button"
            onClick={closeReportDetails}
            aria-label="Close report details"
          >
            <X size={19} />
          </button>
        </div>

        {selectedReport.photoUrl ? (
          <img
            className="modalReportImage"
            src={selectedReport.photoUrl}
            alt="Reported road issue"
          />
        ) : (
          <div className="modalImagePlaceholder">
            <Image size={22} />
            <span>No road photo available</span>
          </div>
        )}

        <div className="modalInfoGrid">
          <div>
            <span>Severity</span>
            <strong>{selectedReport.severity}</strong>
          </div>

          <div>
            <span>Status</span>
            <strong>{selectedReport.status}</strong>
          </div>

          <div>
            <span>Reporter</span>
            <strong>{selectedReport.reporter || "Citizen"}</strong>
          </div>

          <div>
            <span>Authority</span>
            <strong>{selectedReport.authority}</strong>
          </div>

          <div>
            <span>Complaint channel</span>
            <strong>{selectedReport.channel}</strong>
          </div>

          <div>
            <span>Created</span>
            <strong>
              {selectedReport.createdAt
                ? new Date(selectedReport.createdAt).toLocaleDateString()
                : "Not available"}
            </strong>
          </div>
        </div>

        <div className="modalLocation">
          <MapPin size={20} />

          <div>
            <strong>{selectedReport.location}</strong>
            <span>
              Coordinates: {latitude || "Not set"}, {longitude || "Not set"}
            </span>
          </div>
        </div>

        {hasAiDetection && (
          <div className="packetBox aiPanelBox">
            <div className="sectionHeader">
              <div>
                <p>AI photo detection</p>
                <h3>Detected road issue</h3>
              </div>

              <Camera size={20} />
            </div>

            <div className="aiDetectionGrid">
              <div>
                <span>Detected issue</span>
                <strong>{aiDetection.issueType || selectedReport.issue}</strong>
              </div>

              <div>
                <span>Confidence</span>
                <strong>{aiDetection.confidence || "Not available"}</strong>
              </div>

              <div>
                <span>Suggested severity</span>
                <strong>{aiDetection.severity || selectedReport.severity}</strong>
              </div>

              <div>
                <span>Result</span>
                <strong>
                  {aiDetection.isRoadIssue
                    ? "Road issue confirmed"
                    : "Manual review needed"}
                </strong>
              </div>
            </div>

            {aiDetection.visibleEvidence && (
              <p className="modalTextBlock">
                <b>Visible evidence:</b> {aiDetection.visibleEvidence}
              </p>
            )}

            {aiDetection.description && (
              <p className="modalTextBlock">
                <b>Description:</b> {aiDetection.description}
              </p>
            )}

            {aiDetection.suggestedAction && (
              <p className="modalTextBlock">
                <b>Suggested action:</b> {aiDetection.suggestedAction}
              </p>
            )}
          </div>
        )}

        {hasAiReport && (
          <div className="packetBox aiPanelBox">
            <div className="sectionHeader">
              <div>
                <p>AI generated civic report</p>
                <h3>Risk and action summary</h3>
              </div>

              <BrainCircuit size={20} />
            </div>

            <div className="aiDetectionGrid">
              <div>
                <span>Suggested severity</span>
                <strong>
                  {aiReport.suggestedSeverity || selectedReport.severity}
                </strong>
              </div>

              <div>
                <span>AI model</span>
                <strong>{aiReport.model || "RoadRakshak AI"}</strong>
              </div>
            </div>

            {aiReport.riskSummary && (
              <p className="modalTextBlock">
                <b>Risk:</b> {aiReport.riskSummary}
              </p>
            )}

            {aiReport.suggestedAction && (
              <p className="modalTextBlock">
                <b>Suggested action:</b> {aiReport.suggestedAction}
              </p>
            )}
          </div>
        )}

        <div className="packetBox">
          <div className="sectionHeader">
            <div>
              <p>{hasAiReport ? "AI-ready complaint" : "Ready-to-use complaint"}</p>
              <h3>Complaint details</h3>
            </div>

            <FileText size={20} />
          </div>

          <pre>{complaintPacket}</pre>
        </div>

        <div className="packetChecklist">
          <div>
            <ShieldCheck size={18} />
            <span>Photographic evidence included</span>
          </div>

          <div>
            <MapPin size={18} />
            <span>GPS location included</span>
          </div>

          <div>
            <FileText size={18} />
            <span>Authority and complaint channel prepared</span>
          </div>
        </div>

        <div className="modalActions">
          <button className="primaryButton" type="button" onClick={copyPacket}>
            <Copy size={18} />
            {hasAiReport ? "Copy AI complaint" : "Copy complaint"}
          </button>

          <a
            className="secondaryButton linkButton"
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={18} />
            Open map
          </a>

          {canDeleteReport && (
            <button
              className="dangerTextButton"
              type="button"
              onClick={() => {
                handleDeleteReport(selectedReport.id);
                closeReportDetails();
              }}
            >
              <Trash2 size={18} />
              Delete report
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

const styles = `
  .aiPanelBox {
    background:
      linear-gradient(135deg, rgba(23, 26, 24, 0.04), transparent),
      #ffffff;
  }

  .aiDetectionGrid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-top: 1px solid #d6dbd8;
    border-left: 1px solid #d6dbd8;
    margin: 14px 0;
  }

  .aiDetectionGrid > div {
    padding: 12px;
    border-right: 1px solid #d6dbd8;
    border-bottom: 1px solid #d6dbd8;
  }

  .aiDetectionGrid span,
  .aiDetectionGrid strong {
    display: block;
  }

  .aiDetectionGrid span {
    color: #717974;
    font-size: 10px;
    text-transform: uppercase;
  }

  .aiDetectionGrid strong {
    margin-top: 5px;
    color: #171a18;
    font-size: 12px;
    line-height: 1.4;
  }

  .modalTextBlock {
    margin: 10px 0 0;
    color: #4f5852;
    font-size: 12px;
    line-height: 1.65;
  }

  .modalTextBlock b {
    color: #171a18;
  }

  @media (max-width: 560px) {
    .aiDetectionGrid {
      grid-template-columns: 1fr;
    }
  }
`;

export default ReportDetailsModal;