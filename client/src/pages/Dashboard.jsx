import {
  ArrowRight,
  Camera,
  MapPin,
} from "lucide-react";

import AuthorityResponsibility from "../components/AuthorityResponsibility";
import FeatureJourney from "../components/FeatureJourney";
import LiveRoadActivity from "../components/LiveRoadActivity";
import SiteFooter from "../components/SiteFooter";

function Dashboard({
  reports = [],
  setActivePage,
}) {
  return (
    <div className="dashboardPage">
      <section className="dashboardHero">
        <img
          className="dashboardHeroImage"
          src="/road-reporting.jpg"
          alt="Citizen reporting a damaged road"
        />

        <div className="dashboardHeroShade" />

        <div className="dashboardHeroContent">
          <p className="dashboardHeroEyebrow">
            India&apos;s intelligent road-safety reporting network
          </p>

          <h1
            className="animatedRoadRakshak"
            aria-label="RoadRakshak"
          >
            {"RoadRakshak".split("").map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                style={{ "--letter-index": index }}
              >
                {letter}
              </span>
            ))}
          </h1>

          <div className="animatedRoadLine">
            <span />
          </div>

          <h2>
            Report road damage. Reach the right authority. Track
            action.
          </h2>

          <p className="dashboardHeroDescription">
            Capture road issues with location and photographic
            evidence. RoadRakshak identifies the responsible
            authority, prepares the complaint and tracks progress
            from reporting to resolution.
          </p>

          <blockquote>
            Every road issue reported is one step toward a safer
            India.
          </blockquote>

          <div className="dashboardHeroActions">
            <button
              className="dashboardPrimaryAction"
              type="button"
              onClick={() => setActivePage("new-report")}
            >
              <Camera size={19} />
              Report an Issue
              <ArrowRight size={18} />
            </button>

            <button
              className="dashboardSecondaryAction"
              type="button"
              onClick={() => setActivePage("issue-map")}
            >
              <MapPin size={19} />
              Explore the Map
            </button>
          </div>
        </div>
      </section>

      <FeatureJourney />

      <AuthorityResponsibility
        setActivePage={setActivePage}
      />

      <LiveRoadActivity
        reports={reports}
        setActivePage={setActivePage}
      />

      <SiteFooter setActivePage={setActivePage} />
    </div>
  );
}

export default Dashboard;