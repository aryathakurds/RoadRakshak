import {
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

  const mapUrl =
    selectedReport.latitude && selectedReport.longitude
      ? `https://www.google.com/maps?q=${selectedReport.latitude},${selectedReport.longitude}`
      : "https://www.google.com/maps";

  const complaintPacket = `RoadRakshak Complaint Packet

Report ID: ${selectedReport.id}
Issue: ${selectedReport.issue}
Severity: ${selectedReport.severity}
Status: ${selectedReport.status}
Reporter: ${selectedReport.reporter || "Citizen"}

Location: ${selectedReport.location}
Coordinates: ${selectedReport.latitude || "Not set"}, ${
    selectedReport.longitude || "Not set"
  }

Likely Responsible Authority:
${selectedReport.authority}

Complaint Channel:
${selectedReport.channel}

Description:
${selectedReport.description || "No description provided."}

Complaint:
A ${selectedReport.severity.toLowerCase()} severity road issue has been reported as "${
    selectedReport.issue
  }" at ${selectedReport.location}. Kindly inspect this location and take the required repair action for public safety.`;

  const copyPacket = async () => {
    await navigator.clipboard.writeText(complaintPacket);
  };

  return (
    <div className="modalOverlay" onMouseDown={closeReportDetails}>
      <section
        className="reportModal"
        onMouseDown={(event) => event.stopPropagation()}
      >
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
              Coordinates: {selectedReport.latitude || "Not set"},{" "}
              {selectedReport.longitude || "Not set"}
            </span>
          </div>
        </div>

        <div className="packetBox">
          <div className="sectionHeader">
            <div>
              <p>Ready-to-use complaint</p>
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
          <button
            className="primaryButton"
            type="button"
            onClick={copyPacket}
          >
            <Copy size={18} />
            Copy complaint
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

export default ReportDetailsModal;