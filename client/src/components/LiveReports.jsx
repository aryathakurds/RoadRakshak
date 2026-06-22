import {
  ArrowRight,
  Building2,
  Camera,
  Clock3,
  MapPin,
  SearchX,
  Trash2,
} from "lucide-react";

function formatDate(value) {
  if (!value) {
    return "Recently reported";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusClass(status = "") {
  return status.toLowerCase().replaceAll(" ", "-");
}

function LiveReports({
  reports,
  setActivePage,
  openReportDetails,
  handleDeleteReport,
}) {
  const visibleReports = reports.slice(0, 6);

  return (
    <section className="liveIntelligence">
      <style>{`
        .liveIntelligence {
          width: 100%;
          padding: 88px 64px 96px;
          color: #161b18;
          background: #ffffff;
          box-sizing: border-box;
        }

        .liveIntelligenceHeader {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 30px;
          width: min(1280px, 100%);
          margin: 0 auto 48px;
          padding-bottom: 28px;
          border-bottom: 1px solid #d8dedb;
        }

        .liveIntelligenceEyebrow {
          display: block;
          margin-bottom: 12px;
          color: #626d67;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .liveIntelligenceHeader h2 {
          max-width: 720px;
          margin: 0;
          color: #111512;
          font-size: clamp(38px, 5vw, 66px);
          font-weight: 600;
          line-height: 1.03;
          letter-spacing: 0;
        }

        .liveIntelligenceHeader h2 span {
          color: #737b77;
        }

        .liveIntelligenceHeader p {
          max-width: 560px;
          margin: 18px 0 0;
          color: #68716c;
          font-size: 16px;
          line-height: 1.65;
        }

        .liveIntelligenceViewAll {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 9px;
          min-height: 42px;
          padding: 0;
          border: 0;
          color: #171c19;
          background: transparent;
          font: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .liveIntelligenceViewAll svg {
          transition: transform 180ms ease;
        }

        .liveIntelligenceViewAll:hover svg {
          transform: translateX(5px);
        }

        .liveReportTable {
          width: min(1280px, 100%);
          margin: 0 auto;
          border-top: 1px solid #cfd7d2;
        }

        .liveReportColumns,
        .liveReportRow {
          display: grid;
          grid-template-columns:
            minmax(260px, 1.5fr)
            minmax(190px, 1fr)
            130px
            minmax(180px, 0.9fr)
            150px
            46px;
          align-items: center;
          column-gap: 25px;
        }

        .liveReportColumns {
          min-height: 48px;
          color: #747e78;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .liveReportRow {
          position: relative;
          width: 100%;
          min-height: 118px;
          padding: 14px 0;
          border: 0;
          border-top: 1px solid #e0e5e2;
          color: inherit;
          background: transparent;
          text-align: left;
          transition:
            background 180ms ease,
            padding 180ms ease;
        }

        .liveReportRow:hover {
          padding-right: 14px;
          padding-left: 14px;
          background: #f5f7f6;
        }

        .liveReportMain {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 18px;
          border: 0;
          color: inherit;
          background: transparent;
          text-align: left;
          cursor: pointer;
        }

        .liveReportImage {
          position: relative;
          flex: 0 0 92px;
          width: 92px;
          height: 76px;
          overflow: hidden;
          background: #e5e9e7;
        }

        .liveReportImage img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .liveReportImageFallback {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          color: #69736e;
          background:
            linear-gradient(
              145deg,
              #dce2df,
              #eef1ef
            );
        }

        .liveReportPulse {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          background: #e0463d;
          box-shadow: 0 0 0 0 rgba(224, 70, 61, 0.4);
          animation: liveReportPulse 2s ease-out infinite;
        }

        .liveReportIdentity {
          min-width: 0;
        }

        .liveReportIdentity strong,
        .liveReportIdentity span {
          display: block;
        }

        .liveReportIdentity strong {
          overflow: hidden;
          color: #171c19;
          font-size: 17px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .liveReportIdentity span {
          margin-top: 7px;
          overflow: hidden;
          color: #7a847e;
          font-family: monospace;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .liveReportLocation,
        .liveReportAuthority,
        .liveReportDate {
          min-width: 0;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          color: #4f5954;
          font-size: 14px;
          line-height: 1.45;
        }

        .liveReportLocation svg,
        .liveReportAuthority svg,
        .liveReportDate svg {
          flex: 0 0 auto;
          margin-top: 2px;
          color: #828b86;
        }

        .liveReportLocation span,
        .liveReportAuthority span {
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .liveReportSeverity {
          width: fit-content;
          padding: 7px 10px;
          border: 1px solid #cdd5d1;
          color: #353c38;
          background: #f7f8f7;
          font-size: 12px;
          font-weight: 700;
        }

        .liveReportSeverity.critical {
          border-color: #e6b5b1;
          color: #9c2923;
          background: #fff5f4;
        }

        .liveReportSeverity.high {
          border-color: #ebc9a8;
          color: #8d4d14;
          background: #fff8f0;
        }

        .liveReportSeverity.medium {
          border-color: #b9cde2;
          color: #285982;
          background: #f2f7fc;
        }

        .liveReportSeverity.low {
          border-color: #cbd5cf;
          color: #506159;
          background: #f5f7f6;
        }

        .liveReportStatus {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #303733;
          font-size: 13px;
          font-weight: 650;
        }

        .liveReportStatus::before {
          width: 8px;
          height: 8px;
          flex: 0 0 8px;
          border-radius: 50%;
          content: "";
          background: #8a928e;
        }

        .liveReportStatus.resolved::before {
          background: #2f9960;
        }

        .liveReportStatus.complaint-ready::before {
          background: #3171ad;
        }

        .liveReportStatus.in-progress::before {
          background: #c77b27;
        }

        .liveReportDelete {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid transparent;
          color: #9c3c36;
          background: transparent;
          cursor: pointer;
        }

        .liveReportDelete:hover {
          border-color: #efcbc8;
          background: #fff5f4;
        }

        .liveReportEmpty {
          width: min(1280px, 100%);
          min-height: 300px;
          display: grid;
          place-items: center;
          margin: 0 auto;
          border-top: 1px solid #d7deda;
          border-bottom: 1px solid #d7deda;
          text-align: center;
        }

        .liveReportEmpty div {
          display: grid;
          justify-items: center;
          gap: 12px;
        }

        .liveReportEmpty strong {
          font-size: 20px;
        }

        .liveReportEmpty span {
          max-width: 430px;
          color: #707a74;
          line-height: 1.6;
        }

        @keyframes liveReportPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(224, 70, 61, 0.42);
          }

          100% {
            box-shadow: 0 0 0 9px rgba(224, 70, 61, 0);
          }
        }

        @media (max-width: 1150px) {
          .liveReportColumns,
          .liveReportRow {
            grid-template-columns:
              minmax(250px, 1.4fr)
              minmax(180px, 1fr)
              110px
              minmax(160px, 0.9fr)
              42px;
          }

          .liveReportColumns span:nth-child(5),
          .liveReportDate {
            display: none;
          }
        }

        @media (max-width: 850px) {
          .liveIntelligence {
            padding: 70px 24px 78px;
          }

          .liveIntelligenceHeader {
            display: block;
          }

          .liveIntelligenceViewAll {
            margin-top: 24px;
          }

          .liveReportColumns {
            display: none;
          }

          .liveReportRow {
            grid-template-columns: 1fr auto;
            gap: 15px;
            padding: 22px 0;
          }

          .liveReportRow:hover {
            padding-right: 10px;
            padding-left: 10px;
          }

          .liveReportMain {
            grid-column: 1;
          }

          .liveReportLocation,
          .liveReportSeverity,
          .liveReportAuthority,
          .liveReportStatus {
            grid-column: 1;
            margin-left: 110px;
          }

          .liveReportDelete {
            grid-column: 2;
            grid-row: 1;
          }
        }

        @media (max-width: 560px) {
          .liveIntelligence {
            padding: 58px 17px 68px;
          }

          .liveIntelligenceHeader h2 {
            font-size: 40px;
          }

          .liveReportMain {
            align-items: flex-start;
          }

          .liveReportImage {
            flex-basis: 76px;
            width: 76px;
            height: 68px;
          }

          .liveReportLocation,
          .liveReportSeverity,
          .liveReportAuthority,
          .liveReportStatus {
            margin-left: 94px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .liveReportPulse {
            animation: none;
          }
        }
      `}</style>

      <header className="liveIntelligenceHeader">
        <div>
          <span className="liveIntelligenceEyebrow">
            Live civic intelligence
          </span>

          <h2>
            Road issues reported
            <br />
            <span>across the network.</span>
          </h2>

          <p>
            Current citizen reports with photographic evidence,
            location, severity, authority matching and complaint
            progress.
          </p>
        </div>

        <button
          className="liveIntelligenceViewAll"
          type="button"
          onClick={() => setActivePage("status")}
        >
          View all reports
          <ArrowRight size={18} />
        </button>
      </header>

      {visibleReports.length === 0 ? (
        <div className="liveReportEmpty">
          <div>
            <SearchX size={32} />
            <strong>No matching reports</strong>
            <span>
              New citizen reports will appear here when they match
              the current search and severity filters.
            </span>
          </div>
        </div>
      ) : (
        <div className="liveReportTable">
          <div className="liveReportColumns">
            <span>Report evidence</span>
            <span>Location</span>
            <span>Severity</span>
            <span>Authority and status</span>
            <span>Reported</span>
            <span />
          </div>

          {visibleReports.map((report) => (
            <article className="liveReportRow" key={report.id}>
              <button
                className="liveReportMain"
                type="button"
                onClick={() => openReportDetails(report)}
              >
                <div className="liveReportImage">
                  {report.photoUrl || report.photoPreview ? (
                    <img
                      src={report.photoUrl || report.photoPreview}
                      alt={`${report.issue} road evidence`}
                    />
                  ) : (
                    <div className="liveReportImageFallback">
                      <Camera size={24} />
                    </div>
                  )}

                  <span className="liveReportPulse" />
                </div>

                <div className="liveReportIdentity">
                  <strong>{report.issue}</strong>
                  <span>{report.id}</span>
                </div>
              </button>

              <div className="liveReportLocation">
                <MapPin size={17} />
                <span>{report.location || "Location pending"}</span>
              </div>

              <span
                className={`liveReportSeverity ${(
                  report.severity || "medium"
                ).toLowerCase()}`}
              >
                {report.severity || "Medium"}
              </span>

              <div>
                <div className="liveReportAuthority">
                  <Building2 size={17} />

                  <span>
                    {report.authority || "Authority matching"}
                  </span>
                </div>

                <div
                  className={`liveReportStatus ${getStatusClass(
                    report.status
                  )}`}
                >
                  {report.status || "Report received"}
                </div>
              </div>

              <div className="liveReportDate">
                <Clock3 size={16} />
                <span>{formatDate(report.createdAt)}</span>
              </div>

              {handleDeleteReport && (
                <button
                  className="liveReportDelete"
                  type="button"
                  aria-label={`Delete ${report.id}`}
                  title="Delete report"
                  onClick={() => handleDeleteReport(report.id)}
                >
                  <Trash2 size={17} />
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default LiveReports;