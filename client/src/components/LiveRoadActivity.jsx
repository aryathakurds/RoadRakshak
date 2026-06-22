import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  LoaderCircle,
  MapPin,
} from "lucide-react";

function LiveRoadActivity({
  reports = [],
  setActivePage,
}) {
  const normalizedStatus = (report) =>
    String(report.status || "").toLowerCase();

  const resolvedCount = reports.filter((report) => {
    const status = normalizedStatus(report);

    return (
      status.includes("resolved") ||
      status.includes("closed") ||
      status.includes("completed")
    );
  }).length;

  const inProgressCount = reports.filter((report) => {
    const status = normalizedStatus(report);

    return (
      status.includes("progress") ||
      status.includes("assigned") ||
      status.includes("working") ||
      status.includes("submitted")
    );
  }).length;

  const pendingCount = Math.max(
    reports.length - resolvedCount - inProgressCount,
    0
  );

  const statusItems = [
    {
      label: "Reports created",
      value: reports.length,
      icon: FileText,
    },
    {
      label: "Pending action",
      value: pendingCount,
      icon: Clock3,
    },
    {
      label: "In progress",
      value: inProgressCount,
      icon: LoaderCircle,
    },
    {
      label: "Resolved",
      value: resolvedCount,
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="liveRoadActivity">
      <style>{`
        .liveRoadActivity {
          width: 100%;
          padding: 100px 64px 72px;
          box-sizing: border-box;
          overflow: hidden;
          color: #111412;
          background: #f4f5f3;
        }

        .liveRoadActivityMain {
          width: min(1240px, 100%);
          display: grid;
          grid-template-columns:
            minmax(300px, 0.85fr)
            minmax(480px, 1.15fr);
          align-items: center;
          gap: clamp(55px, 8vw, 120px);
          margin: 0 auto;
        }

        .liveRoadActivityCopy {
          max-width: 570px;
        }

        .liveRoadActivityEyebrow {
          display: block;
          margin-bottom: 19px;
          color: #171a18;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .liveRoadActivityHeading {
          margin: 0;
          color: #111412;
          font-size: clamp(44px, 5.4vw, 74px);
          font-weight: 600;
          line-height: 1.03;
          letter-spacing: 0;
        }

        .liveRoadActivityChanging {
          position: relative;
          display: inline-grid;
          min-width: 300px;
          height: 1.08em;
          overflow: hidden;
          vertical-align: bottom;
        }

        .liveRoadActivityChanging span {
          grid-area: 1 / 1;
          color: #656a67;
          opacity: 0;
          transform: translateY(80%);
          animation: liveWordChange 9s ease-in-out infinite;
        }

        .liveRoadActivityChanging span:nth-child(2) {
          animation-delay: 3s;
        }

        .liveRoadActivityChanging span:nth-child(3) {
          animation-delay: 6s;
        }

        .liveRoadActivityDescription {
          max-width: 540px;
          margin: 27px 0 0;
          color: #555c58;
          font-size: 18px;
          line-height: 1.75;
        }

        .liveRoadActivityButton {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 30px;
          padding: 0;
          border: 0;
          color: #111412;
          background: transparent;
          font: inherit;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .liveRoadActivityButton svg {
          transition: transform 180ms ease;
        }

        .liveRoadActivityButton:hover svg {
          transform: translateX(6px);
        }

        .liveRoadActivityVisual {
          position: relative;
          min-width: 0;
          height: 470px;
          overflow: hidden;
          border-radius: 4px;
          background: #171a18;
        }

        .liveRoadActivityImage {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          filter: saturate(0.85) contrast(1.06);
          transform: scale(1.03);
          animation: liveImageMovement 12s ease-in-out infinite;
        }

        .liveRoadActivityShade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(4, 7, 5, 0.08),
              rgba(4, 7, 5, 0.48)
            ),
            linear-gradient(
              90deg,
              rgba(4, 7, 5, 0.23),
              transparent 58%
            );
        }

        .liveRoadActivityScan {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 2px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow:
            0 0 15px rgba(255, 255, 255, 0.8),
            0 0 35px rgba(255, 255, 255, 0.45);
          animation: liveRoadScan 5s ease-in-out infinite;
        }

        .liveRoadActivityVisualTop {
          position: absolute;
          top: 22px;
          right: 22px;
          left: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .liveRoadActivityLive {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .liveRoadActivityLive::before {
          width: 8px;
          height: 8px;
          content: "";
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 12px #ffffff;
          animation: liveStatusPulse 1.8s ease-in-out infinite;
        }

        .liveRoadActivityLocation {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 12px;
        }

        .liveRoadActivityMarker {
          position: absolute;
          display: grid;
          width: 46px;
          height: 46px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.75);
          border-radius: 50%;
          color: #ffffff;
          background: rgba(6, 10, 8, 0.6);
          backdrop-filter: blur(7px);
        }

        .liveRoadActivityMarker::before,
        .liveRoadActivityMarker::after {
          position: absolute;
          content: "";
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          animation: liveMarkerPulse 2.8s ease-out infinite;
        }

        .liveRoadActivityMarker::before {
          width: 65px;
          height: 65px;
        }

        .liveRoadActivityMarker::after {
          width: 88px;
          height: 88px;
          animation-delay: 700ms;
        }

        .liveRoadActivityMarkerOne {
          top: 48%;
          left: 43%;
        }

        .liveRoadActivityMarkerTwo {
          top: 66%;
          left: 23%;
          transform: scale(0.75);
        }

        .liveRoadActivityMarkerThree {
          top: 33%;
          right: 20%;
          transform: scale(0.65);
        }

        .liveRoadActivityReport {
          position: absolute;
          right: 22px;
          bottom: 22px;
          left: 22px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 13px;
          padding: 15px 17px;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-radius: 4px;
          background: rgba(5, 8, 6, 0.8);
          backdrop-filter: blur(10px);
          animation: liveReportReveal 5s ease-in-out infinite;
        }

        .liveRoadActivityReportIcon {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 50%;
        }

        .liveRoadActivityReport strong,
        .liveRoadActivityReport small {
          display: block;
        }

        .liveRoadActivityReport strong {
          font-size: 14px;
          font-weight: 650;
        }

        .liveRoadActivityReport small {
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 11px;
        }

        .liveRoadActivityReportStatus {
          color: rgba(255, 255, 255, 0.76);
          font-size: 11px;
          font-weight: 650;
          text-transform: uppercase;
        }

        .liveRoadActivityStats {
          width: min(1240px, 100%);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin: 72px auto 0;
          border-top: 1px solid #cbd0cc;
          border-bottom: 1px solid #cbd0cc;
        }

        .liveRoadActivityStat {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 15px;
          padding: 27px 25px;
          border-right: 1px solid #cbd0cc;
        }

        .liveRoadActivityStat:last-child {
          border-right: 0;
        }

        .liveRoadActivityStatIcon {
          display: grid;
          width: 44px;
          height: 44px;
          place-items: center;
          border: 1px solid #aeb5b0;
          border-radius: 50%;
        }

        .liveRoadActivityStat strong,
        .liveRoadActivityStat span {
          display: block;
        }

        .liveRoadActivityStat strong {
          font-size: 27px;
          font-weight: 600;
          line-height: 1;
        }

        .liveRoadActivityStat span {
          margin-top: 6px;
          color: #626965;
          font-size: 12px;
        }

        @keyframes liveWordChange {
          0% {
            opacity: 0;
            transform: translateY(80%);
          }

          8%, 27% {
            opacity: 1;
            transform: translateY(0);
          }

          34%, 100% {
            opacity: 0;
            transform: translateY(-80%);
          }
        }

        @keyframes liveImageMovement {
          0%, 100% {
            transform: scale(1.03);
          }

          50% {
            transform: scale(1.09) translateX(-1%);
          }
        }

        @keyframes liveRoadScan {
          0%, 100% {
            left: 5%;
            opacity: 0;
          }

          12%, 88% {
            opacity: 1;
          }

          50% {
            left: 94%;
          }
        }

        @keyframes liveStatusPulse {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes liveMarkerPulse {
          from {
            opacity: 0.8;
            transform: scale(0.45);
          }

          to {
            opacity: 0;
            transform: scale(1.25);
          }
        }

        @keyframes liveReportReveal {
          0%, 15% {
            opacity: 0;
            transform: translateY(16px);
          }

          30%, 85% {
            opacity: 1;
            transform: translateY(0);
          }

          100% {
            opacity: 0;
          }
        }

        @media (max-width: 950px) {
          .liveRoadActivity {
            padding: 78px 28px 60px;
          }

          .liveRoadActivityMain {
            grid-template-columns: 1fr;
            gap: 44px;
          }

          .liveRoadActivityVisual {
            height: 440px;
          }

          .liveRoadActivityStats {
            grid-template-columns: repeat(2, 1fr);
            margin-top: 52px;
          }

          .liveRoadActivityStat:nth-child(2) {
            border-right: 0;
          }
        }

        @media (max-width: 600px) {
          .liveRoadActivity {
            padding: 64px 18px 48px;
          }

          .liveRoadActivityHeading {
            font-size: 42px;
          }

          .liveRoadActivityChanging {
            min-width: 0;
            width: 100%;
          }

          .liveRoadActivityDescription {
            font-size: 16px;
          }

          .liveRoadActivityVisual {
            height: 360px;
          }

          .liveRoadActivityReportStatus {
            display: none;
          }

          .liveRoadActivityStats {
            grid-template-columns: 1fr;
          }

          .liveRoadActivityStat {
            border-right: 0;
            border-bottom: 1px solid #cbd0cc;
          }
        }
      `}</style>

      <div className="liveRoadActivityMain">
        <div className="liveRoadActivityCopy">
          <span className="liveRoadActivityEyebrow">
            Live road intelligence
          </span>

          <h2 className="liveRoadActivityHeading">
            India&apos;s roads,
            <br />

            <span className="liveRoadActivityChanging">
              <span>reported.</span>
              <span>routed.</span>
              <span>resolved.</span>
            </span>
          </h2>

          <p className="liveRoadActivityDescription">
            RoadRakshak converts visible road damage into
            structured evidence, verifies its location and routes
            the report toward the responsible authority.
          </p>

          <button
            className="liveRoadActivityButton"
            type="button"
            onClick={() => setActivePage("new-report")}
          >
            Create a verified report
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="liveRoadActivityVisual">
          <img
            className="liveRoadActivityImage"
            src="/cracked-road-dashboard.png"
            alt="Severely cracked road surface"
          />

          <div className="liveRoadActivityShade" />
          <div className="liveRoadActivityScan" />

          <div className="liveRoadActivityVisualTop">
            <span className="liveRoadActivityLive">
              Road damage detected
            </span>

            <span className="liveRoadActivityLocation">
              <MapPin size={14} />
              Location verification
            </span>
          </div>

          <div className="liveRoadActivityMarker liveRoadActivityMarkerOne">
            <MapPin size={21} />
          </div>

          <div className="liveRoadActivityMarker liveRoadActivityMarkerTwo">
            <MapPin size={21} />
          </div>

          <div className="liveRoadActivityMarker liveRoadActivityMarkerThree">
            <MapPin size={21} />
          </div>

          <div className="liveRoadActivityReport">
            <div className="liveRoadActivityReportIcon">
              <FileText size={18} />
            </div>

            <div>
              <strong>Cracked road surface identified</strong>

              <small>
                Evidence ready for location and authority
                verification
              </small>
            </div>

            <span className="liveRoadActivityReportStatus">
              Analysing damage
            </span>
          </div>
        </div>
      </div>

      <div className="liveRoadActivityStats">
        {statusItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              className="liveRoadActivityStat"
              key={item.label}
            >
              <div className="liveRoadActivityStatIcon">
                <Icon size={20} />
              </div>

              <div>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default LiveRoadActivity;