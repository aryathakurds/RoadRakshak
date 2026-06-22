import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Camera,
  MapPin,
  Route,
  ShieldCheck,
} from "lucide-react";

const changingActions = [
  "Route it.",
  "Track it.",
  "Resolve it.",
];

const processSteps = [
  {
    label: "Capture",
    icon: Camera,
  },
  {
    label: "Detect",
    icon: BrainCircuit,
  },
  {
    label: "Locate",
    icon: MapPin,
  },
  {
    label: "Route",
    icon: Route,
  },
  {
    label: "Resolve",
    icon: ShieldCheck,
  },
];

function JourneyHeading() {
  const [actionIndex, setActionIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActionIndex(
        (currentIndex) =>
          (currentIndex + 1) % changingActions.length
      );
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <header className="productJourneyHeader journeyIntro">
      <span className="productJourneyEyebrow">
        Citizen evidence. Official accountability.
      </span>

      <h2 className="journeyAnimatedHeading">
        <span>See it. Report it.</span>

        <span
          className="journeyChangingAction"
          key={changingActions[actionIndex]}
        >
          {changingActions[actionIndex]}
        </span>
      </h2>

      <p>
        RoadRakshak converts citizen evidence into verified location
        data, AI-assisted reports, official authority matches and
        trackable action.
      </p>

      <div className="journeyProcess">
        {processSteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div className="journeyProcessItem" key={step.label}>
              <div className="journeyProcessIcon">
                <Icon size={21} />
              </div>

              <span>{step.label}</span>

              {index < processSteps.length - 1 && (
                <div
                  className="journeyProcessConnector"
                  aria-hidden="true"
                >
                  <span />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </header>
  );
}

export default JourneyHeading;