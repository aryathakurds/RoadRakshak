import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
} from "lucide-react";

function ImpactMetrics({
  reports = [],
  setActivePage,
}) {
  const normalizeStatus = (status = "") =>
    status.trim().toLowerCase();

  const resolvedReports = reports.filter((report) => {
    const status = normalizeStatus(report.status);

    return (
      status.includes("resolved") ||
      status.includes("fixed") ||
      status.includes("completed")
    );
  }).length;

  const activeReports = reports.filter((report) => {
    const status = normalizeStatus(report.status);

    return (
      status.includes("progress") ||
      status.includes("submitted") ||
      status.includes("notified") ||
      status.includes("assigned") ||
      status.includes("action")
    );
  }).length;

  const pendingReports = Math.max(
    reports.length - resolvedReports - activeReports,
    0
  );

  const featuredReport =
    reports.find(
      (report) =>
        report.photoUrl || report.photoPreview
    ) || reports[0];

  const featuredImage =
    featuredReport?.photoUrl ||
    featuredReport?.photoPreview ||
    "/road-reporting.jpg";

  const metrics = [
    {
      label: "Reports submitted",
      value: reports.length,
      icon: FileText,
    },
    {
      label: "Under action",
      value: activeReports,
      icon: ShieldCheck,
    },
    {
      label: "Resolved",
      value: resolvedReports,
      icon: CheckCircle2,
    },
    {
      label: "Awaiting action",
      value: pendingReports,
      icon: Clock3,
    },
  ];

  return (
    <section className="networkProof">
      <style>{`
        .utilityActions {
          display: none !important;
        }

        .networkProof {
          width: 100%;
          padding: 82px 64px;
          box-sizing: border-box;
          color: #151816;
          background: #f3f4f2;
        }

        .networkProofInner {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .networkProofHeader {
          display: grid;
          grid-template-columns:
            minmax(300px, 0.9fr)
            minmax(340px, 1.1fr);
          align-items: end;
          gap: 60px;
          margin-bottom: 42px;
        }

        .networkProofEyebrow {
          display: block;
          margin-bottom: 13px;
          color: #636865;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .networkProofHeader h2 {
          max-width: 580px;
          margin: 0;
          color: #111311;
          font-size: clamp(36px, 4.5vw, 56px);
          font-weight: 600;
          line-height: 1.08;
          letter-spacing: 0;
        }

        .networkProofHeader p {
          max-width: 540px;
          margin: 0;
          color: #5d625f;
          font-size: 16px;
          line-height: 1.7;
        }

        .networkProofBody {
          display: grid;
          grid-template-columns:
            minmax(340px, 0.92fr)
            minmax(380px, 1.08fr);
          min-height: 355px;
          border-top: 1px solid #cfd3d0;
          border-bottom: 1px solid #cfd3d0;
          background: #ffffff;
        }

        .networkProofMedia {
          position: relative;
          min-height: 355px;
          overflow: hidden;
          background: #d9dcda;
        }

        .networkProofImage {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
        }

        .networkProofShade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            0deg,
            rgba(7, 9, 8, 0.74),
            transparent 58%
          );
        }

        .networkProofImageContent {
          position: absolute;
          right: 24px;
          bottom: 22px;
          left: 24px;
          color: #ffffff;
        }

        .networkProofImageContent span,
        .networkProofImageContent strong {
          display: block;
        }

        .networkProofImageContent span {
          margin-bottom: 7px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .networkProofImageContent strong {
          max-width: 430px;
          color: #ffffff;
          font-size: 20px;
          font-weight: 550;
          line-height: 1.35;
        }

        .networkProofData {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 38px 42px;
        }

        .networkProofDataHeader {
          margin-bottom: 28px;
        }

        .networkProofDataHeader span {
          display: block;
          margin-bottom: 8px;
          color: #737875;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .networkProofDataHeader h3 {
          margin: 0;
          color: #161916;
          font-size: 27px;
          font-weight: 600;
          line-height: 1.2;
        }

        .networkMetricList {
          border-top: 1px solid #d8dcda;
        }

        .networkMetric {
          display: grid;
          grid-template-columns: 36px 1fr auto;
          align-items: center;
          gap: 13px;
          min-height: 61px;
          border-bottom: 1px solid #d8dcda;
        }

        .networkMetricIcon {
          display: grid;
          width: 31px;
          height: 31px;
          place-items: center;
          color: #1d211f;
          background: #eff1ef;
        }

        .networkMetricLabel {
          color: #4f5551;
          font-size: 14px;
          font-weight: 500;
        }

        .networkMetricValue {
          color: #111311;
          font-size: 22px;
          font-weight: 650;
          font-variant-numeric: tabular-nums;
        }

        .networkProofAction {
          width: fit-content;
          min-height: 42px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 27px;
          padding: 0;
          border: 0;
          color: #161916;
          background: transparent;
          font: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .networkProofAction svg {
          transition: transform 180ms ease;
        }

        .networkProofAction:hover svg {
          transform: translateX(5px);
        }

        @media (max-width: 900px) {
          .networkProof {
            padding: 70px 28px;
          }

          .networkProofHeader {
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .networkProofBody {
            grid-template-columns: 1fr;
          }

          .networkProofMedia {
            min-height: 320px;
          }
        }

        @media (max-width: 600px) {
          .networkProof {
            padding: 58px 18px;
          }

          .networkProofHeader {
            margin-bottom: 32px;
          }

          .networkProofHeader h2 {
            font-size: 37px;
          }

          .networkProofHeader p {
            font-size: 15px;
          }

          .networkProofMedia {
            min-height: 250px;
          }

          .networkProofData {
            padding: 28px 20px;
          }

          .networkProofDataHeader h3 {
            font-size: 23px;
          }
        }
      `}</style>

      <div className="networkProofInner">
        <header className="networkProofHeader">
          <div>
            <span className="networkProofEyebrow">
              RoadRakshak network
            </span>

            <h2>
              Reports become visible public action.
            </h2>
          </div>

          <p>
            Every report creates a documented path from road
            evidence to authority response, helping citizens see
            what is pending, under action and resolved.
          </p>
        </header>

        <div className="networkProofBody">
          <div className="networkProofMedia">
            <img
              className="networkProofImage"
              src={featuredImage}
              alt={
                featuredReport?.issue
                  ? `${featuredReport.issue} road report`
                  : "Reported road issue"
              }
            />

            <div className="networkProofShade" />

            <div className="networkProofImageContent">
              <span>Citizen road evidence</span>

              <strong>
                {featuredReport?.issue
                  ? `${featuredReport.issue} reported at ${
                      featuredReport.location ||
                      "a verified location"
                    }`
                  : "Road evidence connected to a trackable report"}
              </strong>
            </div>
          </div>

          <div className="networkProofData">
            <div className="networkProofDataHeader">
              <span>Current activity</span>
              <h3>A clear view of report progress</h3>
            </div>

            <div className="networkMetricList">
              {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div
                    className="networkMetric"
                    key={metric.label}
                  >
                    <div className="networkMetricIcon">
                      <Icon size={16} />
                    </div>

                    <span className="networkMetricLabel">
                      {metric.label}
                    </span>

                    <strong className="networkMetricValue">
                      {metric.value}
                    </strong>
                  </div>
                );
              })}
            </div>

            <button
              className="networkProofAction"
              type="button"
              onClick={() => setActivePage("status")}
            >
              View report status
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImpactMetrics;