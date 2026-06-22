import {
  ArrowUpRight,
  Code2,
  Heart,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "Dashboard", page: "dashboard" },
      { label: "Report an Issue", page: "new-report" },
      { label: "AI Detection", page: "ai-detection" },
      { label: "Live Issue Map", page: "issue-map" },
    ],
  },
  {
    title: "Reports",
    links: [
      { label: "My Reports", page: "my-reports" },
      { label: "Complaints", page: "complaints" },
      { label: "Track Status", page: "status" },
      { label: "Report History", page: "my-reports" },
    ],
  },
  {
    title: "Authorities",
    links: [
      { label: "Authority Directory", page: "authorities" },
      { label: "Municipal Bodies", page: "authorities" },
      { label: "Public Works Departments", page: "authorities" },
      { label: "National Highways", page: "authorities" },
      { label: "Ward and Local Offices", page: "authorities" },
    ],
  },
  {
    title: "RoadRakshak",
    links: [
      { label: "About the Project", page: "dashboard" },
      { label: "Citizen Profile", page: "profile" },
      { label: "Road Safety Mission", page: "dashboard" },
      {
        label: "Contact",
        href: "mailto:contact@roadrakshak.in",
      },
    ],
  },
];

function SiteFooter({ setActivePage }) {
  const currentYear = new Date().getFullYear();

  const openLink = (link) => {
    if (link.href) {
      window.location.href = link.href;
      return;
    }

    setActivePage(link.page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="roadRakshakFooter">
      <style>{`
        .roadRakshakFooter {
          width: 100%;
          padding: 80px 64px 30px;
          box-sizing: border-box;
          color: #ffffff;
          background: #050505;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .roadRakshakFooterInner {
          width: min(1240px, 100%);
          display: grid;
          grid-template-columns:
            minmax(240px, 1.35fr)
            repeat(4, 1fr);
          gap: 55px;
          margin: 0 auto;
        }

        .roadRakshakFooterBrand {
          max-width: 310px;
        }

        .roadRakshakFooterLogo {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .roadRakshakFooterLogoIcon {
          display: grid;
          width: 52px;
          height: 52px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.35);
          border-radius: 7px;
          color: #ffffff;
        }

        .roadRakshakFooterLogo strong {
          display: block;
          color: #ffffff;
          font-size: 24px;
          font-weight: 650;
        }

        .roadRakshakFooterLogo span {
          display: block;
          margin-top: 3px;
          color: rgba(255, 255, 255, 0.55);
          font-size: 12px;
        }

        .roadRakshakFooterDescription {
          margin: 25px 0 0;
          color: rgba(255, 255, 255, 0.58);
          font-size: 14px;
          line-height: 1.75;
        }

        .roadRakshakFooterLocation {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 23px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 13px;
        }

        .roadRakshakFooterSocials {
          display: flex;
          gap: 10px;
          margin-top: 26px;
        }

        .roadRakshakFooterSocial {
          display: grid;
          width: 39px;
          height: 39px;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          color: #ffffff;
          background: transparent;
          cursor: pointer;
        }

        .roadRakshakFooterSocial:hover {
          border-color: rgba(255, 255, 255, 0.65);
          background: rgba(255, 255, 255, 0.08);
        }

        .roadRakshakFooterColumn h3 {
          margin: 0 0 20px;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .roadRakshakFooterLinks {
          display: grid;
          gap: 13px;
        }

        .roadRakshakFooterLink {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 6px;
          padding: 0;
          border: 0;
          color: rgba(255, 255, 255, 0.56);
          background: transparent;
          font: inherit;
          font-size: 14px;
          text-align: left;
          cursor: pointer;
          transition:
            color 180ms ease,
            transform 180ms ease;
        }

        .roadRakshakFooterLink:hover {
          color: #ffffff;
          transform: translateX(4px);
        }

        .roadRakshakFooterBottom {
          width: min(1240px, 100%);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin: 70px auto 0;
          padding-top: 25px;
          border-top: 1px solid rgba(255, 255, 255, 0.13);
        }

        .roadRakshakFooterBottom p {
          margin: 0;
          color: rgba(255, 255, 255, 0.45);
          font-size: 12px;
        }

        .roadRakshakFooterMission {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
        }

        @media (max-width: 1050px) {
          .roadRakshakFooterInner {
            grid-template-columns: repeat(2, 1fr);
          }

          .roadRakshakFooterBrand {
            grid-column: 1 / -1;
            max-width: 500px;
          }
        }

        @media (max-width: 650px) {
          .roadRakshakFooter {
            padding: 60px 20px 25px;
          }

          .roadRakshakFooterInner {
            grid-template-columns: 1fr 1fr;
            gap: 45px 24px;
          }

          .roadRakshakFooterBrand {
            grid-column: 1 / -1;
          }

          .roadRakshakFooterBottom {
            align-items: flex-start;
            flex-direction: column;
            margin-top: 55px;
          }
        }

        @media (max-width: 430px) {
          .roadRakshakFooterInner {
            grid-template-columns: 1fr;
          }

          .roadRakshakFooterBrand {
            grid-column: auto;
          }
        }
      `}</style>

      <div className="roadRakshakFooterInner">
        <div className="roadRakshakFooterBrand">
          <div className="roadRakshakFooterLogo">
            <div className="roadRakshakFooterLogoIcon">
              <ShieldCheck size={27} />
            </div>

            <div>
              <strong>RoadRakshak</strong>
              <span>Road intelligence for safer India</span>
            </div>
          </div>

          <p className="roadRakshakFooterDescription">
            Helping citizens document road problems, reach the
            responsible authority and track action through one
            connected civic platform.
          </p>

          <div className="roadRakshakFooterLocation">
            <MapPin size={15} />
            Built for roads across India
          </div>

          <div className="roadRakshakFooterSocials">
            <button
              className="roadRakshakFooterSocial"
              type="button"
              title="Project source"
              aria-label="Open project source"
              onClick={() =>
                window.open(
                  "https://github.com",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <Code2 size={18} />
            </button>

            <button
              className="roadRakshakFooterSocial"
              type="button"
              title="Email RoadRakshak"
              aria-label="Email RoadRakshak"
              onClick={() => {
                window.location.href =
                  "mailto:contact@roadrakshak.in";
              }}
            >
              <Mail size={18} />
            </button>
          </div>
        </div>

        {footerSections.map((section) => (
          <div
            className="roadRakshakFooterColumn"
            key={section.title}
          >
            <h3>{section.title}</h3>

            <div className="roadRakshakFooterLinks">
              {section.links.map((link) => (
                <button
                  className="roadRakshakFooterLink"
                  type="button"
                  key={link.label}
                  onClick={() => openLink(link)}
                >
                  {link.label}

                  {link.href && (
                    <ArrowUpRight size={13} />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="roadRakshakFooterBottom">
        <p>
          Copyright {currentYear} RoadRakshak. All rights reserved.
        </p>

        <span className="roadRakshakFooterMission">
          <Heart size={13} />
          Every report is a step toward safer roads.
        </span>
      </div>
    </footer>
  );
}

export default SiteFooter;