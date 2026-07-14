import { useMemo, useState } from "react";
import {
  Bell,
  CircleAlert,
  Clock,
  FileText,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

function Topbar({
  searchQuery = "",
  setSearchQuery = () => {},
  user,
  openAuthModal,
  setActivePage,
  reports = [],
  notifications = [],
  openReportDetails,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return [];

    return reports
      .filter((report) => {
        return [
          report.issue,
          report.location,
          report.status,
          report.severity,
          report.authority,
          report._id,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      })
      .slice(0, 6);
  }, [reports, searchQuery]);

  const generatedNotifications = useMemo(() => {
    if (notifications.length) return notifications.slice(0, 6);

    const urgentReports = reports
      .filter((report) => ["Critical", "High"].includes(report.severity))
      .slice(0, 3)
      .map((report) => ({
        id: report._id,
        title: `${report.severity} road issue`,
        message: `${report.issue || "Road issue"} reported near ${
          report.location || "unknown location"
        }.`,
        type: "urgent",
        report,
      }));

    const readyReports = reports
      .filter((report) =>
        String(report.status || "").toLowerCase().includes("complaint")
      )
      .slice(0, 3)
      .map((report) => ({
        id: `${report._id}-ready`,
        title: "Complaint ready",
        message: `${report.issue || "Report"} is ready to file with ${
          report.authority || "the authority"
        }.`,
        type: "ready",
        report,
      }));

    return [...urgentReports, ...readyReports].slice(0, 6);
  }, [notifications, reports]);

  const notificationCount = generatedNotifications.length;

  const profileLabel = user?.name || user?.email || "Sign in";

  const profileInitials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "IN";

  const handleSearchResultClick = (report) => {
    if (openReportDetails) {
      openReportDetails(report);
    } else {
      setActivePage?.("myReports");
    }

    setIsSearchOpen(false);
  };

  const handleNotificationClick = (item) => {
    if (item.report && openReportDetails) {
      openReportDetails(item.report);
    } else {
      setActivePage?.("status");
    }

    setIsNotificationsOpen(false);
  };

  return (
    <header className="roadTopbar">
      <div className="roadTopbarActions">
        <button
          className="roadTopbarTextAction"
          type="button"
          onClick={() => {
            setIsSearchOpen(true);
            setIsNotificationsOpen(false);
          }}
        >
          <Search size={19} />
          <span>Search</span>
        </button>

        <button
          className="roadTopbarIconAction"
          type="button"
          onClick={() => {
            setIsNotificationsOpen((value) => !value);
            setIsSearchOpen(false);
          }}
          aria-label="Open notifications"
        >
          <Bell size={19} />

          {notificationCount > 0 && (
            <span className="roadTopbarDot">{notificationCount}</span>
          )}
        </button>

        <button
          className="roadTopbarProfile"
          type="button"
          onClick={() => {
            if (user) {
              setActivePage?.("profile");
            } else {
              openAuthModal?.("login");
            }
          }}
        >
          {user ? (
            <span className="roadTopbarAvatar">{profileInitials}</span>
          ) : (
            <User size={20} />
          )}

          <span className="roadTopbarProfileName">{profileLabel}</span>
        </button>
      </div>

      {isSearchOpen && (
        <div
          className="roadPanelOverlay"
          onClick={() => setIsSearchOpen(false)}
        >
          <section
            className="roadFloatingPanel searchPanel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="roadPanelHeader">
              <div>
                <p>Search RoadRakshak</p>
                <h3>Find reports, cities or authorities</h3>
              </div>

              <button
                type="button"
                className="roadPanelClose"
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <label className="roadSearchInput">
              <Search size={19} />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                autoFocus
                placeholder="Search city, issue, status or report ID"
              />
            </label>

            <div className="roadSearchResults">
              {searchQuery.trim() && searchResults.length === 0 && (
                <div className="roadEmptySearch">
                  No matching report found yet.
                </div>
              )}

              {!searchQuery.trim() && (
                <div className="roadSearchHint">
                  Start typing a city, road issue, authority name or report ID.
                </div>
              )}

              {searchResults.map((report) => (
                <button
                  type="button"
                  className="roadSearchResult"
                  key={report._id}
                  onClick={() => handleSearchResultClick(report)}
                >
                  <span className="roadResultIcon">
                    <FileText size={18} />
                  </span>

                  <span>
                    <strong>{report.issue || "Road issue"}</strong>
                    <small>
                      {report.location || "Location unavailable"} ·{" "}
                      {report.status || "Submitted"}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {isNotificationsOpen && (
        <section
          className="roadFloatingPanel notificationPanel"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="roadPanelHeader compact">
            <div>
              <p>Notifications</p>
              <h3>Road action updates</h3>
            </div>

            <button
              type="button"
              className="roadPanelClose"
              onClick={(event) => {
                event.stopPropagation();
                setIsNotificationsOpen(false);
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="roadNotificationList">
            {generatedNotifications.length === 0 && (
              <div className="roadEmptySearch">
                No active notifications right now.
              </div>
            )}

            {generatedNotifications.map((item) => (
              <button
                type="button"
                className="roadNotificationItem"
                key={item.id}
                onClick={() => handleNotificationClick(item)}
              >
                <span className={`roadNotificationIcon ${item.type}`}>
                  {item.type === "urgent" ? (
                    <CircleAlert size={18} />
                  ) : item.type === "ready" ? (
                    <ShieldCheck size={18} />
                  ) : (
                    <Clock size={18} />
                  )}
                </span>

                <span>
                  <strong>{item.title}</strong>
                  <small>{item.message}</small>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .roadTopbar {
          position: absolute;
          top: 22px;
          right: 28px;
          z-index: 50;
          display: flex;
          justify-content: flex-end;
          pointer-events: none;
        }

        .roadTopbarActions {
          display: flex;
          align-items: center;
          gap: 22px;
          pointer-events: auto;
        }

        .roadTopbarTextAction,
        .roadTopbarIconAction,
        .roadTopbarProfile {
          border: 0;
          background: transparent;
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
          text-shadow: 0 1px 14px rgba(0, 0, 0, 0.45);
        }

        .roadTopbarIconAction {
          position: relative;
          width: 28px;
          height: 28px;
        }

        .roadTopbarDot {
          position: absolute;
          top: -9px;
          right: -11px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: #f97316;
          color: #fff;
          font-size: 11px;
          line-height: 18px;
          text-align: center;
          text-shadow: none;
        }

        .roadTopbarProfile {
          gap: 10px;
        }

        .roadTopbarAvatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          color: #0f241b;
          display: grid;
          place-items: center;
          font-size: 14px;
          font-weight: 900;
          text-shadow: none;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
        }

        .roadTopbarProfileName {
          max-width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .roadPanelOverlay {
          position: fixed;
          inset: 0;
          z-index: 90;
          background: rgba(7, 12, 10, 0.45);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 86px 34px 24px;
          pointer-events: auto;
        }

        .roadFloatingPanel {
          background: rgba(255, 255, 255, 0.97);
          color: #102018;
          border: 1px solid rgba(16, 32, 24, 0.12);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
          border-radius: 18px;
          pointer-events: auto;
        }

        .searchPanel {
          width: min(520px, calc(100vw - 40px));
          padding: 22px;
        }

        .notificationPanel {
          position: absolute;
          top: 72px;
          right: 0;
          z-index: 100;
          width: min(430px, calc(100vw - 40px));
          padding: 18px;
        }

        .roadPanelHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
        }

        .roadPanelHeader.compact {
          margin-bottom: 14px;
        }

        .roadPanelHeader p {
          margin: 0 0 5px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #66736b;
        }

        .roadPanelHeader h3 {
          margin: 0;
          font-size: 22px;
          line-height: 1.1;
          color: #101816;
        }

        .roadPanelClose {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid rgba(16, 32, 24, 0.15);
          background: #fff;
          color: #102018;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .roadSearchInput {
          height: 54px;
          border-radius: 14px;
          border: 1px solid rgba(16, 32, 24, 0.16);
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          background: #fff;
        }

        .roadSearchInput input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          font-size: 16px;
          color: #102018;
        }

        .roadSearchResults,
        .roadNotificationList {
          display: grid;
          gap: 10px;
          margin-top: 16px;
        }

        .roadSearchResult,
        .roadNotificationItem {
          border: 1px solid rgba(16, 32, 24, 0.1);
          background: #fff;
          border-radius: 14px;
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          cursor: pointer;
          color: #102018;
        }

        .roadSearchResult:hover,
        .roadNotificationItem:hover {
          border-color: rgba(16, 32, 24, 0.28);
          transform: translateY(-1px);
        }

        .roadResultIcon,
        .roadNotificationIcon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #edf2ef;
          color: #153f2f;
          flex: 0 0 auto;
        }

        .roadNotificationIcon.urgent {
          background: #fff0dc;
          color: #a04a00;
        }

        .roadNotificationIcon.ready {
          background: #e8f5ee;
          color: #136f46;
        }

        .roadSearchResult strong,
        .roadNotificationItem strong {
          display: block;
          font-size: 15px;
          margin-bottom: 3px;
        }

        .roadSearchResult small,
        .roadNotificationItem small,
        .roadEmptySearch,
        .roadSearchHint {
          display: block;
          font-size: 13px;
          line-height: 1.45;
          color: #617069;
        }

        .roadEmptySearch,
        .roadSearchHint {
          padding: 16px;
          border-radius: 14px;
          background: #f4f7f5;
        }

        @media (max-width: 760px) {
          .roadTopbar {
            top: 16px;
            right: 16px;
          }

          .roadTopbarActions {
            gap: 14px;
          }

          .roadTopbarProfileName {
            display: none;
          }

          .roadTopbarAvatar {
            width: 38px;
            height: 38px;
          }

          .roadPanelOverlay {
            padding: 74px 16px 18px;
          }

          .notificationPanel {
            top: 66px;
            right: 0;
          }
        }
      `}</style>
    </header>
  );
}

export default Topbar;