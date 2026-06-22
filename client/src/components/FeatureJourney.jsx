import {
  BrainCircuit,
  Building2,
  Camera,
  Check,
  FileText,
  MapPin,
  Navigation,
  ShieldCheck,
} from "lucide-react";

import JourneyHeading from "./JourneyHeading";

const features = [
  {
    id: "capture",
    label: "Capture evidence",
    title: "Photograph the road issue",
    description:
      "Capture clear evidence of potholes, cracks, waterlogging, damaged signs and other road-safety problems.",
  },
  {
    id: "location",
    label: "Smart location",
    title: "Pinpoint the exact road",
    description:
      "RoadRakshak attaches GPS coordinates and location details so the responsible area can be identified accurately.",
  },
  {
    id: "ai",
    label: "AI reporting",
    title: "Turn evidence into a report",
    description:
      "AI identifies the road issue and prepares a structured complaint description with its category and severity.",
  },
  {
    id: "authority",
    label: "Authority matching",
    title: "Reach the correct department",
    description:
      "The report is matched with the relevant municipal corporation, PWD, NHAI, panchayat or ward authority.",
  },
  {
    id: "tracking",
    label: "Action tracking",
    title: "Follow progress until resolution",
    description:
      "Track complaint details, authority updates and resolution evidence through one connected dashboard.",
  },
];

function CaptureScene() {
  return (
    <div className="productScene captureScene">
      <div className="captureRoad">
        <span className="captureRoadLine" />
        <span className="capturePothole" />
      </div>

      <div className="capturePhone">
        <div className="capturePhoneScreen">
          <Camera size={30} />
          <span className="captureFocusFrame" />
          <span className="captureScanLine" />
        </div>

        <span className="captureButton" />
      </div>

      <div className="captureResult">
        <Check size={15} />
        Evidence captured
      </div>
    </div>
  );
}

function LocationScene() {
  return (
    <div className="productScene locationScene">
      <div className="mapRoad mapRoadOne" />
      <div className="mapRoad mapRoadTwo" />
      <div className="mapRoad mapRoadThree" />

      <span className="mapBlock mapBlockOne" />
      <span className="mapBlock mapBlockTwo" />
      <span className="mapBlock mapBlockThree" />
      <span className="mapBlock mapBlockFour" />

      <div className="locationPulse">
        <span />
        <MapPin size={38} />
      </div>

      <div className="locationCoordinates">
        <Navigation size={15} />
        <span>Location detected</span>
        <small>19.0760, 72.8777</small>
      </div>
    </div>
  );
}

function AIScene() {
  return (
    <div className="productScene aiScene">
      <div className="aiSceneHeader">
        <BrainCircuit size={22} />
        <span>RoadRakshak AI</span>
        <small>Analysing</small>
      </div>

      <div className="aiPhotoPreview">
        <span className="aiDamageMark" />
        <span className="aiScanner" />
      </div>

      <div className="aiReportPreview">
        <div className="aiReportTitle">
          <FileText size={17} />
          Report generated
        </div>

        <span className="aiTextLine aiTextLong" />
        <span className="aiTextLine aiTextMedium" />
        <span className="aiTextLine aiTextShort" />

        <div className="aiReportTags">
          <span>Pothole</span>
          <span>High severity</span>
        </div>
      </div>
    </div>
  );
}

function AuthorityScene() {
  return (
    <div className="productScene authorityScene">
      <div className="authorityReportIcon">
        <FileText size={25} />
        <span>Road report</span>
      </div>

      <div className="authorityRoute">
        <span className="authorityMovingDot" />
      </div>

      <div className="authorityBuilding">
        <Building2 size={42} />
        <strong>Municipal Authority</strong>
        <small>Official department matched</small>
      </div>

      <div className="authorityVerified">
        <ShieldCheck size={16} />
        Verified match
      </div>
    </div>
  );
}

function TrackingScene() {
  return (
    <div className="productScene trackingScene">
      <div className="trackingHeader">
        <ShieldCheck size={21} />
        Complaint progress
      </div>

      <div className="trackingProgress">
        <span className="trackingProgressFill" />
      </div>

      <div className="trackingSteps">
        <div className="trackingStep trackingStepOne">
          <span>
            <Check size={13} />
          </span>

          <div>
            <strong>Report created</strong>
            <small>Evidence received</small>
          </div>
        </div>

        <div className="trackingStep trackingStepTwo">
          <span>
            <Check size={13} />
          </span>

          <div>
            <strong>Authority notified</strong>
            <small>Complaint submitted</small>
          </div>
        </div>

        <div className="trackingStep trackingStepThree">
          <span>
            <Check size={13} />
          </span>

          <div>
            <strong>Issue resolved</strong>
            <small>Repair verified</small>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureVisual({ id }) {
  if (id === "capture") {
    return <CaptureScene />;
  }

  if (id === "location") {
    return <LocationScene />;
  }

  if (id === "ai") {
    return <AIScene />;
  }

  if (id === "authority") {
    return <AuthorityScene />;
  }

  return <TrackingScene />;
}

function FeatureJourney() {
  return (
    <section className="productJourney">
      <JourneyHeading />

      <div className="productJourneyList">
        {features.map((feature, index) => (
          <article
            className={`productFeature ${
              index % 2 !== 0 ? "productFeatureReverse" : ""
            }`}
            key={feature.id}
          >
            <div className="productFeatureCopy">
              <span className="productFeatureLabel">
                {feature.label}
              </span>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>
            </div>

            <div className="productFeatureVisual">
              <FeatureVisual id={feature.id} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeatureJourney;