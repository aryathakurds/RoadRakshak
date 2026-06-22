import {
  ArrowRight,
  Building2,
  Camera,
  Route,
} from "lucide-react";

const authorities = [
  "Municipal Corporation",
  "Public Works Department",
  "NHAI",
  "Panchayat",
  "Ward Office",
  "Highway Authority",
];

const signals = Array.from({ length: 24 }, (_, index) => index);

function AuthorityResponsibility({ setActivePage }) {
  return (
    <section className="responsibilityExperience">
      <style>{`
        .responsibilityExperience {
          position: relative;
          width: 100%;
          min-height: 680px;
          padding: 105px 64px 90px;
          overflow: hidden;
          box-sizing: border-box;
          color: #ffffff;
          background: #05060a;
          isolation: isolate;
        }

        .responsibilityExperienceEdgeFade {
          position: absolute;
          inset: 0;
          z-index: -2;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              rgba(210, 225, 255, 0.3) 0%,
              transparent 17%,
              transparent 82%,
              rgba(205, 180, 255, 0.25) 100%
            ),
            linear-gradient(
              90deg,
              rgba(130, 165, 230, 0.18) 0%,
              transparent 16%,
              transparent 84%,
              rgba(185, 145, 225, 0.17) 100%
            );
          animation: responsibilityEdgeFade 7s ease-in-out infinite;
        }

        .responsibilityExperience::before,
        .responsibilityExperience::after {
          position: absolute;
          right: -8%;
          left: -8%;
          z-index: -3;
          height: 190px;
          content: "";
          pointer-events: none;
          filter: blur(30px);
          animation: authorityEdgeLight 7s ease-in-out infinite;
        }

        .responsibilityExperience::before {
          top: -130px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.9),
            rgba(145, 196, 255, 0.42) 38%,
            rgba(104, 93, 255, 0.2) 68%,
            transparent
          );
        }

        .responsibilityExperience::after {
          bottom: -140px;
          background: linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.68),
            rgba(193, 145, 255, 0.3) 42%,
            rgba(103, 92, 255, 0.14) 70%,
            transparent
          );
          animation-delay: -3.5s;
        }

        .responsibilityExperienceGrid {
          position: absolute;
          inset: 0;
          z-index: -4;
          opacity: 0.13;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.08) 1px,
              transparent 1px
            );
          background-size: 92px 92px;
          mask-image: linear-gradient(
            to bottom,
            transparent,
            #000 18%,
            #000 82%,
            transparent
          );
        }

        .responsibilityExperienceSignals {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }

        .responsibilityExperienceSignals span {
          position: absolute;
          top: var(--top);
          left: var(--left);
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #ffffff;
          opacity: 0.2;
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.8),
            0 0 18px rgba(170, 195, 255, 0.5);
          animation: authoritySignal 4s ease-in-out infinite;
          animation-delay: calc(var(--index) * -230ms);
        }

        .responsibilityExperienceSignals span:nth-child(4n) {
          width: 9px;
          height: 1px;
          border-radius: 0;
        }

        .responsibilityExperienceSignals span:nth-child(5n) {
          width: 1px;
          height: 9px;
          border-radius: 0;
        }

        .responsibilityExperienceInner {
          position: relative;
          z-index: 2;
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .responsibilityExperienceEyebrow {
          display: block;
          margin-bottom: 22px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .responsibilityExperience h2 {
          max-width: 1000px;
          margin: 0;
          color: #ffffff;
          font-size: clamp(42px, 6vw, 76px);
          font-weight: 600;
          line-height: 1.04;
          letter-spacing: 0;
        }

        .responsibilityExperience h2 span {
          color: #9b9da7;
        }

        .responsibilityExperienceDescription {
          max-width: 780px;
          margin: 28px 0 0;
          color: #adafb8;
          font-size: 18px;
          line-height: 1.7;
        }

        .responsibilityExperienceRoute {
          display: grid;
          grid-template-columns:
            max-content minmax(30px, 1fr)
            max-content minmax(30px, 1fr)
            max-content;
          align-items: center;
          gap: 20px;
          width: 100%;
          margin-top: 48px;
          padding: 24px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }

        .responsibilityExperienceStep {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 11px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 650;
          white-space: nowrap;
        }

        .responsibilityExperienceLine {
          position: relative;
          min-width: 30px;
          height: 1px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.22);
        }

        .responsibilityExperienceLine span {
          position: absolute;
          top: 0;
          left: 0;
          width: 38%;
          height: 100%;
          background: #ffffff;
          box-shadow: 0 0 10px #ffffff;
          animation: authorityRouteSignal 2.4s linear infinite;
        }

        .responsibilityExperienceButton {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          gap: 11px;
          margin-top: 30px;
          padding: 0;
          border: 0;
          color: #ffffff;
          background: transparent;
          font: inherit;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .responsibilityExperienceButton svg {
          transition: transform 180ms ease;
        }

        .responsibilityExperienceButton:hover svg {
          transform: translateX(6px);
        }

        .responsibilityExperienceMarquee {
          position: absolute;
          right: 0;
          bottom: 24px;
          left: 0;
          overflow: hidden;
          pointer-events: none;
          mask-image: linear-gradient(
            90deg,
            transparent,
            #000 8%,
            #000 92%,
            transparent
          );
        }

        .responsibilityExperienceMarqueeTrack {
          display: flex;
          align-items: center;
          width: max-content;
          animation: authorityMarqueeMove 30s linear infinite;
        }

        .responsibilityAuthorityName {
          display: inline-flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.48);
          font-size: 17px;
          font-weight: 400;
          letter-spacing: 0;
          white-space: nowrap;
        }

        .responsibilityAuthorityName b {
          margin: 0 30px;
          color: rgba(255, 255, 255, 0.2);
          font-weight: 400;
        }

        @keyframes responsibilityEdgeFade {
          0%,
          100% {
            opacity: 0.58;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes authorityEdgeLight {
          0%,
          100% {
            opacity: 0.55;
            transform: translateX(-3%) scaleX(0.94);
          }

          50% {
            opacity: 0.9;
            transform: translateX(3%) scaleX(1.06);
          }
        }

        @keyframes authoritySignal {
          0%,
          100% {
            opacity: 0.1;
            transform: scale(0.7);
          }

          50% {
            opacity: 0.85;
            transform: scale(1.5);
          }
        }

        @keyframes authorityRouteSignal {
          from {
            transform: translateX(-120%);
          }

          to {
            transform: translateX(370%);
          }
        }

        @keyframes authorityMarqueeMove {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 900px) {
          .responsibilityExperience {
            min-height: 0;
            padding: 84px 28px 105px;
          }

          .responsibilityExperienceRoute {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .responsibilityExperienceStep {
            min-height: 56px;
            white-space: normal;
          }

          .responsibilityExperienceLine {
            width: 1px;
            min-width: 1px;
            height: 28px;
            margin-left: 11px;
          }

          .responsibilityExperienceLine span {
            width: 100%;
            height: 38%;
            animation: authorityRouteSignalMobile 2.4s linear
              infinite;
          }
        }

        @media (max-width: 600px) {
          .responsibilityExperience {
            padding: 70px 19px 92px;
          }

          .responsibilityExperience h2 {
            font-size: 41px;
          }

          .responsibilityExperienceDescription {
            font-size: 16px;
          }

          .responsibilityAuthorityName {
            font-size: 14px;
          }

          .responsibilityAuthorityName b {
            margin: 0 20px;
          }
        }

        @keyframes authorityRouteSignalMobile {
          from {
            transform: translateY(-120%);
          }

          to {
            transform: translateY(370%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .responsibilityExperienceEdgeFade,
          .responsibilityExperience::before,
          .responsibilityExperience::after,
          .responsibilityExperienceSignals span,
          .responsibilityExperienceLine span,
          .responsibilityExperienceMarqueeTrack {
            animation: none;
          }
        }
      `}</style>

      <div
        className="responsibilityExperienceEdgeFade"
        aria-hidden="true"
      />

      <div
        className="responsibilityExperienceGrid"
        aria-hidden="true"
      />

      <div
        className="responsibilityExperienceSignals"
        aria-hidden="true"
      >
        {signals.map((signal) => (
          <span
            key={signal}
            style={{
              "--index": signal,
              "--left": `${(signal * 37 + 8) % 96}%`,
              "--top": `${(signal * 47 + 11) % 85}%`,
            }}
          />
        ))}
      </div>

      <div className="responsibilityExperienceInner">
        <span className="responsibilityExperienceEyebrow">
          Jurisdiction intelligence
        </span>

        <h2>
          The road is public.
          <br />
          <span>Responsibility shouldn&apos;t be hidden.</span>
        </h2>

        <p className="responsibilityExperienceDescription">
          RoadRakshak analyses location, road ownership and
          administrative jurisdiction to connect every report with
          the department responsible for resolving it.
        </p>

        <div className="responsibilityExperienceRoute">
          <div className="responsibilityExperienceStep">
            <Camera size={22} />
            Citizen evidence
          </div>

          <div className="responsibilityExperienceLine">
            <span />
          </div>

          <div className="responsibilityExperienceStep">
            <Route size={22} />
            Verified jurisdiction
          </div>

          <div className="responsibilityExperienceLine">
            <span />
          </div>

          <div className="responsibilityExperienceStep">
            <Building2 size={22} />
            Responsible authority
          </div>
        </div>

        <button
          className="responsibilityExperienceButton"
          type="button"
          onClick={() => setActivePage("authorities")}
        >
          Explore official authorities
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="responsibilityExperienceMarquee">
        <div className="responsibilityExperienceMarqueeTrack">
          {[...authorities, ...authorities].map(
            (authority, index) => (
              <span
                className="responsibilityAuthorityName"
                key={`${authority}-${index}`}
              >
                {authority}
                <b aria-hidden="true">|</b>
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default AuthorityResponsibility;