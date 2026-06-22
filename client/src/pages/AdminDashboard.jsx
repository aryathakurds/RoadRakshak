import { AlertTriangle, ClipboardCheck, ShieldCheck, Wrench } from "lucide-react";

function AdminDashboard({ reports, handleUpdateStatus }) {
  const criticalReports = reports.filter((report) => report.severity === "Critical");
  const unresolvedReports = reports.filter((report) => report.status !== "Resolved");
  const resolvedReports = reports.filter((report) => report.status === "Resolved");

  return (
    <section className="adminPage">
      <div className="formIntro">
        <p className="eyebrow">Admin dashboard</p>
        <h3>Review reports, prioritize risk, and update civic progress.</h3>
        <p>
          This page is a frontend preview for authority/admin workflows. Backend will later
          add real roles, moderation, assignment, and official status updates.
        </p>
      </div>

      <section className="adminStatsGrid">
        <div className="adminStatCard">
          <AlertTriangle size={22} />
          <span>Critical reports</span>
          <strong>{criticalReports.length}</strong>
        </div>
        <div className="adminStatCard">
          <Wrench size={22} />
          <span>Unresolved</span>
          <strong>{unresolvedReports.length}</strong>
        </div>
        <div className="adminStatCard">
          <ClipboardCheck size={22} />
          <span>Resolved</span>
          <strong>{resolvedReports.length}</strong>
        </div>
        <div className="adminStatCard">
          <ShieldCheck size={22} />
          <span>Total reports</span>
          <strong>{reports.length}</strong>
        </div>
      </section>

      <div className="sectionBlock">
        <div className="sectionHeader">
          <div>
            <p>Moderation queue</p>
            <h3>Authority review table</h3>
          </div>
          <ShieldCheck size={20} />
        </div>

        <div className="adminTable">
          {reports.map((report) => (
            <div className="adminRow" key={report.id}>
              <div>
                <strong>{report.issue}</strong>
                <span>{report.id}</span>
              </div>

              <p>{report.location}</p>

              <span className={`severity ${report.severity.toLowerCase()}`}>
                {report.severity}
              </span>

              <select
                value={report.status}
                onChange={(event) => handleUpdateStatus(report.id, event.target.value)}
              >
                <option>Complaint ready</option>
                <option>Sent to authority</option>
                <option>Inspection pending</option>
                <option>Repair in progress</option>
                <option>Resolved</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;