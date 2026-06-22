import { useMemo, useState } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Search,
  SearchX,
  ShieldCheck,
  Trash2,
} from "lucide-react";

function MyReports({
  user,
  reports = [],
  isLoading,
  openAuthModal,
  openReportDetails,
  handleDeleteReport,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const getStatusType = (status = "") => {
    const value = status.toLowerCase();

    if (
      value.includes("resolved") ||
      value.includes("closed") ||
      value.includes("completed")
    ) {
      return "resolved";
    }

    if (
      value.includes("progress") ||
      value.includes("assigned") ||
      value.includes("review")
    ) {
      return "progress";
    }

    return "pending";
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statistics = useMemo(() => {
    return reports.reduce(
      (result, report) => {
        const type = getStatusType(report.status);

        result.total += 1;
        result[type] += 1;

        return result;
      },
      {
        total: 0,
        pending: 0,
        progress: 0,
        resolved: 0,
      }
    );
  }, [reports]);

  const filteredReports = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return reports.filter((report) => {
      const statusType = getStatusType(report.status);

      const matchesStatus =
        statusFilter === "All" ||
        statusType === statusFilter.toLowerCase();

      const searchableContent = [
        report.id,
        report.issue,
        report.location,
        report.authority,
        report.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesStatus &&
        searchableContent.includes(query)
      );
    });
  }, [reports, searchTerm, statusFilter]);

  if (!user) {
    return (
      <main className="myReportsPage">
        <style>{styles}</style>

        <section className="myReportsSignIn">
          <span className="myReportsSignInIcon">
            <ShieldCheck size={25} />
          </span>

          <p className="myReportsEyebrow">
            Citizen report centre
          </p>

          <h1>Sign in to access your reports.</h1>

          <p>
            Review submitted road evidence, matched authorities
            and complaint progress from your RoadRakshak account.
          </p>

          <button
            type="button"
            onClick={() => openAuthModal("login")}
          >
            Sign in
            <ArrowRight size={17} />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="myReportsPage">
      <style>{styles}</style>

      <header className="myReportsHeader">
        <div>
          <p className="myReportsEyebrow">
            Citizen report centre
          </p>

          <h1>Your submitted road issues</h1>

          <p className="myReportsIntroduction">
            Review evidence, responsible authorities and the
            latest action taken on your reports.
          </p>
        </div>

        <div className="myReportsAccount">
          <span>Signed in as</span>
          <strong>{user.name || "Citizen"}</strong>
          <small>{user.email}</small>
        </div>
      </header>

      <section className="myReportsSummary">
        <div>
          <FileText size={18} />
          <strong>{statistics.total}</strong>
          <span>Submitted</span>
        </div>

        <div>
          <Clock3 size={18} />
          <strong>{statistics.pending}</strong>
          <span>Pending</span>
        </div>

        <div>
          <ShieldCheck size={18} />
          <strong>{statistics.progress}</strong>
          <span>In progress</span>
        </div>

        <div>
          <CheckCircle2 size={18} />
          <strong>{statistics.resolved}</strong>
          <span>Resolved</span>
        </div>
      </section>

      <section className="myReportsWorkspace">
        <div className="myReportsWorkspaceHeader">
          <div>
            <p>Report history</p>
            <h2>Road issue records</h2>
          </div>

          <span>
            {filteredReports.length}{" "}
            {filteredReports.length === 1
              ? "record"
              : "records"}
          </span>
        </div>

        <div className="myReportsToolbar">
          <label className="myReportsSearch">
            <Search size={16} />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search reports"
            />
          </label>

          <div className="myReportsFilters">
            {["All", "Pending", "Progress", "Resolved"].map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  className={
                    statusFilter === filter ? "active" : ""
                  }
                  onClick={() => setStatusFilter(filter)}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="myReportsEmpty">
            <span className="myReportsLoader" />
            <strong>Loading reports</strong>
          </div>
        ) : reports.length === 0 ? (
          <div className="myReportsEmpty">
            <Camera size={25} />
            <strong>No reports submitted yet</strong>
            <p>Your first verified report will appear here.</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="myReportsEmpty">
            <SearchX size={25} />
            <strong>No matching reports</strong>
            <p>Try another search or status filter.</p>
          </div>
        ) : (
          <div className="myReportsList">
            <div className="myReportsTableHeading">
              <span>Issue</span>
              <span>Authority</span>
              <span>Status</span>
              <span>Date</span>
              <span />
            </div>

            {filteredReports.map((report) => {
              const statusType = getStatusType(
                report.status
              );

              return (
                <article
                  className="myReportsRecord"
                  key={report.id}
                >
                  <button
                    className="myReportsRecordMain"
                    type="button"
                    onClick={() =>
                      openReportDetails(report)
                    }
                  >
                    <div className="myReportsEvidence">
                      {report.photoUrl ? (
                        <img
                          src={report.photoUrl}
                          alt={report.issue || "Road issue"}
                        />
                      ) : (
                        <Camera size={18} />
                      )}
                    </div>

                    <div className="myReportsIssue">
                      <div>
                        <strong>
                          {report.issue || "Road issue"}
                        </strong>

                        <span
                          className={`myReportsSeverity ${
                            report.severity?.toLowerCase() ||
                            "medium"
                          }`}
                        >
                          {report.severity || "Medium"}
                        </span>
                      </div>

                      <p>
                        <MapPin size={13} />
                        {report.location ||
                          "Location unavailable"}
                      </p>

                      <small>{report.id}</small>
                    </div>

                    <div className="myReportsAuthority">
                      <strong>
                        {report.authority ||
                          "Verification pending"}
                      </strong>

                      <span>
                        {report.channel ||
                          "Complaint channel pending"}
                      </span>
                    </div>

                    <div
                      className={`myReportsStatus ${statusType}`}
                    >
                      <i />
                      {report.status || "Pending review"}
                    </div>

                    <time>
                      {formatDate(report.createdAt)}
                    </time>

                    <span className="myReportsView">
                      View
                      <ArrowRight size={15} />
                    </span>
                  </button>

                  <button
                    className="myReportsDelete"
                    type="button"
                    onClick={() =>
                      handleDeleteReport(report.id)
                    }
                    aria-label={`Delete report ${report.id}`}
                    title="Delete report"
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

const styles = `
  .myReportsPage {
    min-height: 100vh;
    padding: 42px clamp(18px, 4vw, 58px) 70px;
    box-sizing: border-box;
    color: #171a18;
    background: #f3f5f3;
  }

  .myReportsHeader {
    width: min(1180px, 100%);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 35px;
    margin: 0 auto;
    padding-bottom: 25px;
    border-bottom: 1px solid #c9cfcb;
  }

  .myReportsEyebrow {
    margin: 0;
    color: #626b65;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .myReportsHeader h1 {
    margin: 9px 0 0;
    font-size: clamp(31px, 4vw, 50px);
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: 0;
  }

  .myReportsIntroduction {
    max-width: 620px;
    margin: 13px 0 0;
    color: #626a65;
    font-size: 14px;
    line-height: 1.6;
  }

  .myReportsAccount {
    min-width: 190px;
    padding-left: 19px;
    border-left: 1px solid #bbc3be;
  }

  .myReportsAccount span,
  .myReportsAccount strong,
  .myReportsAccount small {
    display: block;
  }

  .myReportsAccount span {
    color: #737b76;
    font-size: 10px;
    text-transform: uppercase;
  }

  .myReportsAccount strong {
    margin-top: 5px;
    font-size: 14px;
  }

  .myReportsAccount small {
    margin-top: 3px;
    color: #727a75;
    font-size: 11px;
  }

  .myReportsSummary {
    width: min(1180px, 100%);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin: 20px auto 0;
    border: 1px solid #ced4d0;
    background: #ffffff;
  }

  .myReportsSummary > div {
    display: grid;
    grid-template-columns: auto auto 1fr;
    align-items: center;
    gap: 9px;
    padding: 14px 18px;
    border-right: 1px solid #d6dbd8;
  }

  .myReportsSummary > div:last-child {
    border-right: 0;
  }

  .myReportsSummary svg {
    color: #636c66;
  }

  .myReportsSummary strong {
    font-size: 19px;
    font-weight: 600;
  }

  .myReportsSummary span {
    color: #68716b;
    font-size: 11px;
  }

  .myReportsWorkspace {
    width: min(1180px, 100%);
    margin: 18px auto 0;
    border: 1px solid #ced4d0;
    background: #ffffff;
  }

  .myReportsWorkspaceHeader {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    padding: 18px 22px;
    border-bottom: 1px solid #d7dcd9;
  }

  .myReportsWorkspaceHeader p {
    margin: 0;
    color: #6b736e;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .myReportsWorkspaceHeader h2 {
    margin: 4px 0 0;
    font-size: 18px;
    font-weight: 600;
  }

  .myReportsWorkspaceHeader > span {
    color: #747c77;
    font-size: 11px;
  }

  .myReportsToolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 12px 22px;
    border-bottom: 1px solid #d7dcd9;
    background: #fafbfa;
  }

  .myReportsSearch {
    width: min(340px, 100%);
    height: 36px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 11px;
    box-sizing: border-box;
    border: 1px solid #bec6c1;
    background: #ffffff;
  }

  .myReportsSearch input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    color: #171a18;
    background: transparent;
    font: inherit;
    font-size: 12px;
  }

  .myReportsFilters {
    display: flex;
    border: 1px solid #bec6c1;
  }

  .myReportsFilters button {
    height: 34px;
    padding: 0 13px;
    border: 0;
    border-right: 1px solid #d3d8d5;
    color: #5e6761;
    background: #ffffff;
    font: inherit;
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
  }

  .myReportsFilters button:last-child {
    border-right: 0;
  }

  .myReportsFilters button.active {
    color: #ffffff;
    background: #171a18;
  }

  .myReportsTableHeading,
  .myReportsRecordMain {
    display: grid;
    grid-template-columns:
      minmax(270px, 1.6fr)
      minmax(180px, 1fr)
      140px
      105px
      50px;
    align-items: center;
    gap: 16px;
  }

  .myReportsTableHeading {
    padding: 10px 20px;
    border-bottom: 1px solid #d7dcd9;
    color: #747c77;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .myReportsRecord {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 38px;
    border-bottom: 1px solid #dde1de;
  }

  .myReportsRecord:last-child {
    border-bottom: 0;
  }

  .myReportsRecordMain {
    min-width: 0;
    padding: 12px 20px;
    border: 0;
    color: inherit;
    background: #ffffff;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  .myReportsRecordMain:hover {
    background: #f7f8f7;
  }

  .myReportsIssue {
    min-width: 0;
    display: grid;
    grid-template-columns: 60px minmax(0, 1fr);
    column-gap: 12px;
    align-items: center;
  }

  .myReportsEvidence {
    grid-row: 1 / 4;
    width: 60px;
    height: 52px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px solid #cad0cc;
    color: #747c77;
    background: #eef1ef;
  }

  .myReportsEvidence img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .myReportsIssue > div {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .myReportsIssue strong {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .myReportsSeverity {
    flex: 0 0 auto;
    padding: 3px 5px;
    border: 1px solid #c8cfca;
    color: #5c655f;
    background: #f3f5f3;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .myReportsSeverity.high,
  .myReportsSeverity.critical {
    border-color: #e2bcb7;
    color: #9e3028;
    background: #fff4f2;
  }

  .myReportsIssue p {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    margin: 4px 0 0;
    overflow: hidden;
    color: #626b65;
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .myReportsIssue small {
    margin-top: 3px;
    color: #89908c;
    font-size: 8px;
  }

  .myReportsAuthority {
    min-width: 0;
  }

  .myReportsAuthority strong,
  .myReportsAuthority span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .myReportsAuthority strong {
    color: #3e4641;
    font-size: 11px;
    font-weight: 600;
  }

  .myReportsAuthority span {
    margin-top: 4px;
    color: #7b837e;
    font-size: 9px;
  }

  .myReportsStatus {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #4f5852;
    font-size: 10px;
    font-weight: 600;
  }

  .myReportsStatus i {
    width: 6px;
    height: 6px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: #8b938e;
  }

  .myReportsStatus.progress i {
    background: #b47c1f;
  }

  .myReportsStatus.resolved i {
    background: #267d50;
  }

  .myReportsRecord time {
    color: #68716b;
    font-size: 10px;
  }

  .myReportsView {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    color: #252a27;
    font-size: 10px;
    font-weight: 700;
  }

  .myReportsDelete {
    display: grid;
    width: 38px;
    height: 100%;
    place-items: center;
    border: 0;
    border-left: 1px solid #dde1de;
    color: #96382f;
    background: #ffffff;
    cursor: pointer;
  }

  .myReportsDelete:hover {
    background: #fff2f0;
  }

  .myReportsEmpty {
    min-height: 230px;
    display: grid;
    align-content: center;
    justify-items: center;
    padding: 30px;
    text-align: center;
  }

  .myReportsEmpty strong {
    margin-top: 12px;
    font-size: 14px;
  }

  .myReportsEmpty p {
    margin: 6px 0 0;
    color: #6b736e;
    font-size: 11px;
  }

  .myReportsLoader {
    width: 25px;
    height: 25px;
    border: 2px solid #d4d9d6;
    border-top-color: #171a18;
    border-radius: 50%;
    animation: myReportsSpin 0.8s linear infinite;
  }

  .myReportsSignIn {
    width: min(700px, 100%);
    min-height: 600px;
    display: grid;
    align-content: center;
    justify-items: start;
    margin: 0 auto;
  }

  .myReportsSignInIcon {
    display: grid;
    width: 48px;
    height: 48px;
    place-items: center;
    border: 1px solid #b4bcb7;
    border-radius: 50%;
    background: #ffffff;
  }

  .myReportsSignIn .myReportsEyebrow {
    margin-top: 20px;
  }

  .myReportsSignIn h1 {
    margin: 10px 0 0;
    font-size: clamp(34px, 5vw, 55px);
    font-weight: 600;
    line-height: 1.08;
  }

  .myReportsSignIn p:not(.myReportsEyebrow) {
    max-width: 570px;
    margin: 17px 0 0;
    color: #626a65;
    line-height: 1.7;
  }

  .myReportsSignIn button {
    min-height: 43px;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    margin-top: 23px;
    padding: 0 17px;
    border: 1px solid #171a18;
    color: #ffffff;
    background: #171a18;
    font: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  @keyframes myReportsSpin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 900px) {
    .myReportsTableHeading {
      display: none;
    }

    .myReportsRecordMain {
      grid-template-columns: 1fr 1fr;
    }

    .myReportsIssue {
      grid-column: 1 / -1;
    }

    .myReportsView {
      justify-content: flex-start;
    }
  }

  @media (max-width: 700px) {
    .myReportsPage {
      padding: 30px 15px 55px;
    }

    .myReportsHeader {
      align-items: flex-start;
      flex-direction: column;
      gap: 20px;
    }

    .myReportsAccount {
      width: 100%;
      box-sizing: border-box;
    }

    .myReportsSummary {
      grid-template-columns: 1fr 1fr;
    }

    .myReportsSummary > div:nth-child(2) {
      border-right: 0;
    }

    .myReportsSummary > div:nth-child(-n + 2) {
      border-bottom: 1px solid #d6dbd8;
    }

    .myReportsToolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .myReportsSearch {
      width: 100%;
    }

    .myReportsFilters {
      overflow-x: auto;
    }

    .myReportsRecordMain {
      grid-template-columns: 1fr;
      padding: 14px;
    }

    .myReportsIssue {
      grid-column: auto;
    }

    .myReportsDelete {
      width: 36px;
    }
  }
`;

export default MyReports;