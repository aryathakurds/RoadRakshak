import {
  Building2,
  Check,
  Landmark,
  MapPin,
  Route,
  ShieldCheck,
} from "lucide-react";

const authorities = [
  {
    icon: Building2,
    name: "Municipal Corporation",
    responsibility: "City and ward roads",
  },
  {
    icon: Landmark,
    name: "Public Works Department",
    responsibility: "State-managed roads",
  },
  {
    icon: Route,
    name: "National Highways Authority",
    responsibility: "National highways",
  },
];

function AuthorityIntelligence() {
  return (
    <section className="authorityIntelligence">
      <div className="authorityBackgroundGrid" aria-hidden="true" />

      <div className="authorityIntelligenceInner">
        <div className="authorityIntelligenceCopy">
          <span className="authorityIntelligenceLabel">
            Intelligent authority routing
          </span>

          <h2>
            Road damage has an owner.
            <strong> RoadRakshak finds it.</strong>
          </h2>

          <p>
            A complaint is useful only when it reaches the department
            responsible for that road. RoadRakshak uses location,
            jurisdiction and road type to identify the most relevant
            official authority.
          </p>

          <div className="authorityBenefits">
            <span>
              <Check size={16} />
              Location-aware matching
            </span>

            <span>
              <Check size={16} />
              Official complaint channels
            </span>

            <span>
              <Check size={16} />
              Trackable authority action
            </span>
          </div>
        </div>

        <div className="authorityRoutingVisual">
          <div className="authoritySource">
            <div className="authoritySourceIcon">
              <MapPin size={25} />
            </div>

            <div>
              <span>Reported location</span>
              <strong>Mumbai, Maharashtra</strong>
            </div>
          </div>

          <div className="authorityRouteLine">
            <span className="authorityRouteSignal" />
          </div>

          <div className="authorityMatches">
            {authorities.map((authority, index) => {
              const Icon = authority.icon;

              return (
                <div
                  className={`authorityMatch authorityMatch${index + 1}`}
                  key={authority.name}
                >
                  <Icon size={22} />

                  <div>
                    <strong>{authority.name}</strong>
                    <span>{authority.responsibility}</span>
                  </div>

                  {index === 0 && (
                    <div className="authorityBestMatch">
                      <ShieldCheck size={14} />
                      Best match
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="authorityRoutingResult">
            <ShieldCheck size={20} />

            <div>
              <span>Responsible authority identified</span>
              <strong>
                Brihanmumbai Municipal Corporation
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthorityIntelligence;