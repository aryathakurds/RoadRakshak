import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { divIcon } from "leaflet";
import { MapPin, SearchX, Trash2 } from "lucide-react";

const defaultCenter = [22.9734, 78.6569];

const getMarkerClass = (severity) => {
  if (severity === "Critical") return "leafletMarker critical";
  if (severity === "High") return "leafletMarker high";
  if (severity === "Medium") return "leafletMarker medium";

  return "leafletMarker low";
};

const createMarkerIcon = (severity) =>
  divIcon({
    className: getMarkerClass(severity),
    html: "<span></span>",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

const getReportPosition = (report) => {
  const latitude = Number(report.latitude);
  const longitude = Number(report.longitude);

  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return [latitude, longitude];
  }

  return defaultCenter;
};

function IssueMap({
  reports,
  handleDeleteReport,
  openReportDetails,
}) {
  const mapCenter =
    reports.length > 0
      ? getReportPosition(reports[0])
      : defaultCenter;

  return (
    <section className="mapPage">
      <div className="formIntro">
        <p className="eyebrow">Issue map</p>
        <h3>Reported road issues across India</h3>
        <p>
          View GPS-tagged road reports, severity and complaint progress by
          location.
        </p>
      </div>

      <div className="mapGrid">
        <div className="realMapShell">
          {reports.length === 0 ? (
            <div className="mapEmptyState static">
              <SearchX size={30} />
              <strong>No map reports</strong>
              <span>Change the search or severity filter.</span>
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={5}
              className="realMap"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {reports.map((report) => (
                <Marker
                  key={report.id}
                  position={getReportPosition(report)}
                  icon={createMarkerIcon(report.severity)}
                >
                  <Popup>
                    <div className="mapPopup">
                      <strong>{report.issue}</strong>
                      <span>{report.id}</span>
                      <p>{report.location}</p>
                      <small>{report.severity} severity</small>

                      <button
                        type="button"
                        onClick={() => openReportDetails(report)}
                      >
                        View report
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        <aside className="sectionBlock">
          <div className="sectionHeader">
            <div>
              <p>Map reports</p>
              <h3>Visible issues</h3>
            </div>

            <MapPin size={20} />
          </div>

          {reports.length === 0 ? (
            <div className="emptyState compact">
              <SearchX size={28} />
              <strong>No reports found</strong>
              <span>Try another search.</span>
            </div>
          ) : (
            <div className="mapReportList">
              {reports.map((report) => (
                <div
                  className={`mapReportItem ${
                    handleDeleteReport
                      ? "mapReportItemWithAction"
                      : "mapReportItemWithoutAction"
                  }`}
                  key={report.id}
                >
                  <button
                    className="mapReportContent"
                    type="button"
                    onClick={() => openReportDetails(report)}
                  >
                    <div>
                      <strong>{report.issue}</strong>
                      <span>{report.location}</span>
                    </div>

                    <span
                      className={`severity ${report.severity.toLowerCase()}`}
                    >
                      {report.severity}
                    </span>
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

export default IssueMap;