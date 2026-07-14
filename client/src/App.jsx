import { useEffect, useRef, useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AuthModal from "./components/AuthModal";
import ReportDetailsModal from "./components/ReportDetailsModal";

import Dashboard from "./pages/Dashboard";
import NewReport from "./pages/NewReport";
import MyReports from "./pages/MyReports";
import AIDetection from "./pages/AIDetection";
import IssueMap from "./pages/IssueMap";
import Complaints from "./pages/Complaints";
import AuthorityDirectory from "./pages/AuthorityDirectory";
import ReportStatus from "./pages/ReportStatus";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAuthorities from "./pages/AdminAuthorities";
import Profile from "./pages/Profile";
import Unauthorized from "./pages/Unauthorized";

import { useAuth } from "./hooks/useAuth";

import {
  createReport,
  deleteReport,
  getMyReports,
  getReports,
  resolveReport,
  updateReport,
} from "./services/reportApi";

import { matchAuthority } from "./services/authorityApi";

import {
  analyzeRoadPhoto,
  generateAIReport,
} from "./services/aiApi";

const emptyReportForm = {
  issueType: "Pothole",
  severity: "Medium",
  description: "",
  location: "",
  locality: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  latitude: "",
  longitude: "",
  photoName: "",
  photoPreview: "",
  photoFile: null,
};

const emptyAuthorityMatch = {
  id: "",
  name: "Authority will be matched after location is added",
  department: "Road / Civic Department",
  channel: "Complaint channel will appear here",
  confidence: "Waiting",
  complaintUrl: "",
};

const validSeverities = ["Low", "Medium", "High", "Critical"];

const validIssueTypes = [
  "Pothole",
  "Broken road surface",
  "Road crack",
  "Waterlogging",
  "Open manhole",
  "Garbage or obstruction",
  "Damaged divider",
  "Missing road sign",
  "Other road issue",
];

const normalizeReport = (report) => {
  if (!report) {
    return {};
  }

  const id = report.id || report._id || "";

  const longitude =
    report.longitude || report.coordinates?.coordinates?.[0] || "";

  const latitude =
    report.latitude || report.coordinates?.coordinates?.[1] || "";

  return {
    ...report,
    id,
    _id: report._id || id,
    issue: report.issue || report.issueType || "Road issue",
    severity: report.severity || "Medium",
    description: report.description || "",
    location: report.location || "Location not added",
    longitude,
    latitude,
    status: report.status || "Complaint ready",
    authority: report.authority || report.authorityName || "Authority pending",
    channel: report.channel || "Complaint channel pending",
    reporter: report.reporter || report.createdBy?.name || "Citizen",
    complaintReference: report.complaintReference || "",
    photoUrl: report.photoUrl || report.imageUrl || "",
    aiReport: report.aiReport || {},
    aiDetection: report.aiDetection || {},
    createdAt: report.createdAt || new Date().toISOString(),
  };
};

const normalizeAuthority = (data) => {
  const authority = data?.authority || data?.match || data || {};

  return {
    id: authority.id || authority._id || "",
    name: authority.name || "No verified authority found for this location",
    department: authority.department || "Authority coverage is still being added",
    channel:
      authority.channel ||
      authority.complaintChannel ||
      "The report can still be submitted",
    confidence: authority.confidence || "Matched",
    complaintUrl:
      authority.complaintUrl || authority.portalUrl || authority.website || "",
  };
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [reports, setReports] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [myReportsLoading, setMyReportsLoading] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [notification, setNotification] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const [reportForm, setReportForm] = useState(emptyReportForm);
  const [authorityMatch, setAuthorityMatch] = useState(emptyAuthorityMatch);
  const [authorityLoading, setAuthorityLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

  const [aiReportLoading, setAiReportLoading] = useState(false);
  const [aiReportResult, setAiReportResult] = useState(null);
  const [photoAnalysisLoading, setPhotoAnalysisLoading] = useState(false);
  const [photoAnalysisResult, setPhotoAnalysisResult] = useState(null);

  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: "login",
  });

  const notificationTimerRef = useRef(null);
  const previewUrlRef = useRef("");
  const authorityRequestRef = useRef(0);

  const {
    user,
    authLoading,
    signup,
    login,
    logout,
    sessionExpired,
    clearSessionExpired,
  } = useAuth();

  const canManageStatus = ["moderator", "authority", "admin"].includes(
    user?.role
  );

  const canDeleteAnyReport = ["moderator", "admin"].includes(user?.role);

  const canAccessAdmin = ["moderator", "authority", "admin"].includes(
    user?.role
  );

  const isAdministrator = user?.role === "admin";

  const showNotification = (message) => {
    setNotification(message);

    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }

    notificationTimerRef.current = setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const openAuthModal = (mode = "login") => {
    setAuthModal({
      isOpen: true,
      mode,
    });
  };

  const closeAuthModal = () => {
    setAuthModal((current) => ({
      ...current,
      isOpen: false,
    }));
  };

  const getCreatorId = (report) => {
    if (!report?.createdBy) {
      return "";
    }

    if (typeof report.createdBy === "string") {
      return report.createdBy;
    }

    return report.createdBy._id || report.createdBy.id || "";
  };

  const canDeleteSelectedReport = Boolean(
    selectedReport &&
      user &&
      (canDeleteAnyReport || getCreatorId(selectedReport) === user.id)
  );

  const replaceUpdatedReport = (updatedReport) => {
    setReports((current) =>
      current.map((report) =>
        report.id === updatedReport.id ? updatedReport : report
      )
    );

    setMyReports((current) =>
      current.map((report) =>
        report.id === updatedReport.id ? updatedReport : report
      )
    );

    setSelectedReport((current) =>
      current?.id === updatedReport.id ? updatedReport : current
    );
  };

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReports((data.reports || []).map(normalizeReport));
    } catch (error) {
      showNotification(error.message);
    } finally {
      setIsBooting(false);
    }
  };

  const loadMyReports = async () => {
    if (!user) {
      setMyReports([]);
      setMyReportsLoading(false);
      return;
    }

    try {
      setMyReportsLoading(true);
      const data = await getMyReports();
      setMyReports((data.reports || []).map(normalizeReport));
    } catch (error) {
      showNotification(error.message);
    } finally {
      setMyReportsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();

    return () => {
      clearTimeout(notificationTimerRef.current);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    loadMyReports();
  }, [user]);

  useEffect(() => {
    if (!sessionExpired) {
      return;
    }

    setMyReports([]);
    setSelectedReport(null);

    showNotification(
      "Your old login session expired. You can continue browsing in guest mode."
    );

    clearSessionExpired();
  }, [sessionExpired, clearSessionExpired]);

  useEffect(() => {
    const { state, district, city } = reportForm;

    if (!state && !district && !city) {
      authorityRequestRef.current += 1;
      setAuthorityMatch(emptyAuthorityMatch);
      setAuthorityLoading(false);
      return;
    }

    const requestId = authorityRequestRef.current + 1;
    authorityRequestRef.current = requestId;

    const timer = setTimeout(async () => {
      try {
        setAuthorityLoading(true);

        const data = await matchAuthority({
          state,
          district,
          city,
        });

        if (authorityRequestRef.current !== requestId) {
          return;
        }

        setAuthorityMatch(normalizeAuthority(data));
      } catch {
        if (authorityRequestRef.current !== requestId) {
          return;
        }

        setAuthorityMatch({
          ...emptyAuthorityMatch,
          name: "No verified authority found for this location",
          department: "Authority coverage is still being added",
          channel: "The report can still be submitted",
          confidence: "Not found",
        });
      } finally {
        if (authorityRequestRef.current === requestId) {
          setAuthorityLoading(false);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [reportForm.state, reportForm.district, reportForm.city]);

  const filteredReports = reports.filter((report) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSeverity =
      severityFilter === "All" || report.severity === severityFilter;

    const searchableText = [
      report.id,
      report.issue,
      report.location,
      report.severity,
      report.status,
      report.authority,
      report.reporter,
      report.complaintReference,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesSeverity && searchableText.includes(query);
  });

  const complaintText = `To the concerned road authority,

A ${reportForm.severity.toLowerCase()} severity road issue has been reported as: ${
    reportForm.issueType
  }.

Location: ${reportForm.location || "Location will be added here"}
Responsible authority: ${authorityMatch.name}
Department: ${authorityMatch.department}
Description: ${reportForm.description || "Citizen description will be added here"}

Kindly inspect this location and take the required repair action for public safety.`;

  const openReportDetails = (report) => {
    setSelectedReport(report);
  };

  const closeReportDetails = () => {
    setSelectedReport(null);
  };

  const handleReportChange = (event) => {
    const { name, value } = event.target;

    setReportForm((current) => {
      if (name === "location" && value !== current.location) {
        return {
          ...current,
          location: value,
          locality: "",
          city: "",
          district: "",
          state: "",
          pincode: "",
        };
      }

      return {
        ...current,
        [name]: value,
      };
    });

    setSubmitStatus("");
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      showNotification("Use a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification("Photo must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    setReportForm((current) => ({
      ...current,
      photoName: file.name,
      photoPreview: previewUrl,
      photoFile: file,
    }));

    setPhotoAnalysisResult(null);
    setSubmitStatus("");
  };

  const handleUseAIDetection = (detection) => {
    setReportForm((current) => ({
      ...current,
      issueType: detection.label,
      severity: detection.severity,
      description: `AI detected ${detection.label.toLowerCase()} with ${
        detection.confidence
      } confidence. Suggested action: ${detection.action}.`,
      photoName: detection.photoName || current.photoName,
      photoPreview: detection.photoPreview || current.photoPreview,
      photoFile: detection.photoFile || current.photoFile,
    }));

    setActivePage("new-report");
    showNotification("AI detection added to the report.");
  };

  const handleAnalyzeRoadPhoto = async () => {
    if (!user) {
      openAuthModal("login");
      setSubmitStatus("Please sign in before using AI photo detection.");
      showNotification("Sign in before using AI photo detection.");
      return;
    }

    if (!reportForm.photoFile) {
      setSubmitStatus("Upload a road photo before running AI detection.");
      return;
    }

    try {
      setPhotoAnalysisLoading(true);
      setSubmitStatus("Analyzing road photo...");

      const data = await analyzeRoadPhoto(reportForm.photoFile);
      const analysis = data.analysis || {};

      setPhotoAnalysisResult(analysis);

      setReportForm((current) => ({
        ...current,
        issueType: validIssueTypes.includes(analysis.issueType)
          ? analysis.issueType
          : current.issueType,
        severity: validSeverities.includes(analysis.severity)
          ? analysis.severity
          : current.severity,
        description:
          analysis.description || analysis.riskSummary || current.description,
      }));

      setSubmitStatus(
        analysis.isRoadIssue
          ? "AI photo detection completed. Review the details before submitting."
          : "AI could not clearly confirm a road issue. You can still submit manually."
      );

      showNotification("AI photo detection completed.");
    } catch (error) {
      const message = error.message || "Unable to analyze road photo";
      setSubmitStatus(message);
      showNotification(message);
    } finally {
      setPhotoAnalysisLoading(false);
    }
  };

  const handleGenerateAIReport = async () => {
    if (!user) {
      openAuthModal("login");
      setSubmitStatus("Please sign in before using AI report generation.");
      showNotification("Sign in before using AI report generation.");
      return;
    }

    if (!reportForm.issueType?.trim()) {
      setSubmitStatus("Select an issue type before generating an AI report.");
      return;
    }

    if (!reportForm.location?.trim()) {
      setSubmitStatus("Add a location before generating an AI report.");
      return;
    }

    try {
      setAiReportLoading(true);
      setSubmitStatus("Generating AI complaint report...");

      const data = await generateAIReport({
        issueType: reportForm.issueType,
        severity: reportForm.severity,
        description: reportForm.description,
        location: reportForm.location,
        authority: authorityMatch?.name || "Not confirmed",
        department:
          authorityMatch?.department || "Road maintenance department",
        channel: authorityMatch?.channel || "Official civic complaint portal",
      });

      const aiReport = data.aiReport || {};

      setAiReportResult(aiReport);

      setReportForm((current) => ({
        ...current,
        description:
          aiReport.improvedDescription ||
          aiReport.complaintLetter ||
          current.description,
        severity: validSeverities.includes(aiReport.suggestedSeverity)
          ? aiReport.suggestedSeverity
          : current.severity,
      }));

      setSubmitStatus("AI report generated. You can edit it before submitting.");
      showNotification("AI report generated successfully.");
    } catch (error) {
      const message = error.message || "Unable to generate AI report";
      setSubmitStatus(message);
      showNotification(message);
    } finally {
      setAiReportLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Location is not supported on this device.");
      return;
    }

    setLocationStatus("Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);

        setReportForm((current) => ({
          ...current,
          latitude,
          longitude,
          location: `Lat ${latitude}, Lng ${longitude}`,
          locality: "",
          city: "",
          district: "",
          state: "",
          pincode: "",
        }));

        setLocationStatus(
          "GPS coordinates captured. Select the nearby city to match its authority."
        );

        showNotification("GPS location captured.");
      },
      () => {
        setLocationStatus("Please allow location access and try again.");
        showNotification("Unable to capture location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const handleSubmitReport = async () => {
    if (!user) {
      openAuthModal("login");
      showNotification("Sign in before submitting a report.");
      return;
    }

    if (!reportForm.photoFile) {
      setSubmitStatus("Please upload a road photo.");
      return;
    }

    if (!reportForm.location.trim()) {
      setSubmitStatus("Please add a location.");
      return;
    }

    if (!reportForm.description.trim()) {
      setSubmitStatus("Please add a short description.");
      return;
    }

    try {
      setSubmitStatus("Uploading photo and submitting report...");

      const data = await createReport({
        issue: reportForm.issueType,
        severity: reportForm.severity,
        description: reportForm.description.trim(),
        location: reportForm.location.trim(),
        latitude: reportForm.latitude || 22.9734,
        longitude: reportForm.longitude || 78.6569,
        authorityId: authorityMatch.id || "",
        authority: authorityMatch.name,
        channel: authorityMatch.channel,
        complaintPortalUrl: authorityMatch.complaintUrl || "",
        aiReport: aiReportResult || {},
        aiDetection: photoAnalysisResult || {},
        photo: reportForm.photoFile,
      });

      const savedReport = normalizeReport(data.report);

      setReports((current) => [savedReport, ...current]);
      setMyReports((current) => [savedReport, ...current]);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = "";
      }

      setReportForm(emptyReportForm);
      setAuthorityMatch(emptyAuthorityMatch);
      setAiReportResult(null);
      setPhotoAnalysisResult(null);
      setLocationStatus("");
      setSubmitStatus("");
      setSearchQuery("");
      setSeverityFilter("All");
      setActivePage("my-reports");

      showNotification("Report, photo and AI complaint saved successfully.");
    } catch (error) {
      setSubmitStatus(error.message);
      showNotification(error.message);
    }
  };

  const handleUpdateStatus = async (reportId, statusOrChanges) => {
    if (!canManageStatus) {
      showNotification("Your account cannot update official report status.");
      return;
    }

    const changes =
      typeof statusOrChanges === "string"
        ? {
            status: statusOrChanges,
          }
        : statusOrChanges;

    try {
      const data = await updateReport(reportId, changes);
      const updatedReport = normalizeReport(data.report);

      replaceUpdatedReport(updatedReport);

      showNotification(
        changes.complaintReference
          ? "Complaint details saved."
          : `Report updated to ${updatedReport.status}.`
      );

      return updatedReport;
    } catch (error) {
      showNotification(error.message);
      throw error;
    }
  };

  const handleSaveComplaint = async (reportId, complaintDetails) => {
    return handleUpdateStatus(reportId, complaintDetails);
  };

  const handleResolveReport = async (reportId, resolutionData) => {
    if (!canManageStatus) {
      const error = new Error("Your account cannot resolve reports.");
      showNotification(error.message);
      throw error;
    }

    try {
      const data = await resolveReport(reportId, resolutionData);
      const resolvedReport = normalizeReport(data.report);

      replaceUpdatedReport(resolvedReport);

      showNotification("Report resolved with repair evidence.");
      return resolvedReport;
    } catch (error) {
      showNotification(error.message);
      throw error;
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await deleteReport(reportId);

      setReports((current) =>
        current.filter((report) => report.id !== reportId)
      );

      setMyReports((current) =>
        current.filter((report) => report.id !== reportId)
      );

      setSelectedReport(null);

      showNotification("Report deleted.");
    } catch (error) {
      showNotification(error.message);
    }
  };

  const handleCopyComplaint = async () => {
    try {
      await navigator.clipboard.writeText(complaintText);
      showNotification("Complaint draft copied.");
    } catch {
      showNotification("Unable to copy complaint.");
    }
  };

  if (isBooting || authLoading) {
    return (
      <div className="bootScreen">
        <div className="bootLogo">RR</div>
        <h1>RoadRakshak</h1>
        <p>Connecting to road intelligence services...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
      />

      <main className="main">
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          severityFilter={severityFilter}
          setSeverityFilter={setSeverityFilter}
          user={user}
          openAuthModal={openAuthModal}
          setActivePage={setActivePage}
          reports={filteredReports}
          openReportDetails={openReportDetails}
        />

        {activePage === "dashboard" && (
          <Dashboard
            reports={filteredReports}
            setActivePage={setActivePage}
            handleDeleteReport={
              canDeleteAnyReport ? handleDeleteReport : undefined
            }
            openReportDetails={openReportDetails}
          />
        )}

        {activePage === "new-report" && (
          <NewReport
            reportForm={reportForm}
            authorityMatch={authorityMatch}
            authorityLoading={authorityLoading}
            locationStatus={locationStatus}
            submitStatus={submitStatus}
            aiReportLoading={aiReportLoading}
            aiReportResult={aiReportResult}
            photoAnalysisLoading={photoAnalysisLoading}
            photoAnalysisResult={photoAnalysisResult}
            handleReportChange={handleReportChange}
            handlePhotoChange={handlePhotoChange}
            handleGetLocation={handleGetLocation}
            handleAnalyzeRoadPhoto={handleAnalyzeRoadPhoto}
            handleGenerateAIReport={handleGenerateAIReport}
            handleSubmitReport={handleSubmitReport}
          />
        )}

        {activePage === "my-reports" &&
          (user ? (
            <MyReports
              user={user}
              reports={myReports}
              isLoading={myReportsLoading}
              openAuthModal={openAuthModal}
              openReportDetails={openReportDetails}
              handleDeleteReport={handleDeleteReport}
            />
          ) : (
            <Unauthorized
              title="Sign in required"
              message="Sign in to view and manage your submitted reports."
              setActivePage={setActivePage}
            />
          ))}

        {activePage === "ai-detection" && (
          <AIDetection handleUseAIDetection={handleUseAIDetection} />
        )}

        {activePage === "issue-map" && (
          <IssueMap
            reports={filteredReports}
            handleDeleteReport={
              canDeleteAnyReport ? handleDeleteReport : undefined
            }
            openReportDetails={openReportDetails}
          />
        )}

        {activePage === "complaints" && (
          <Complaints
            reports={filteredReports}
            complaintText={complaintText}
            handleCopyComplaint={handleCopyComplaint}
            handleDeleteReport={
              canDeleteAnyReport ? handleDeleteReport : undefined
            }
            openReportDetails={openReportDetails}
          />
        )}

        {activePage === "authorities" && <AuthorityDirectory />}

        {activePage === "status" && (
          <ReportStatus
            reports={filteredReports}
            user={user}
            handleDeleteReport={handleDeleteReport}
            handleUpdateStatus={handleUpdateStatus}
            handleSaveComplaint={handleSaveComplaint}
            handleResolveReport={handleResolveReport}
            openReportDetails={openReportDetails}
          />
        )}

        {activePage === "admin" &&
          (canAccessAdmin ? (
            <AdminDashboard
              reports={filteredReports}
              handleUpdateStatus={handleUpdateStatus}
            />
          ) : (
            <Unauthorized
              title="Admin access restricted"
              message="Only authority, moderator and administrator accounts can access this section."
              setActivePage={setActivePage}
            />
          ))}

        {activePage === "authority-admin" &&
          (isAdministrator ? (
            <AdminAuthorities showNotification={showNotification} />
          ) : (
            <Unauthorized
              title="Administrator access required"
              message="Only administrators can manage official authority records."
              setActivePage={setActivePage}
            />
          ))}

        {activePage === "profile" && (
          <Profile
            user={user}
            authLoading={authLoading}
            signup={signup}
            login={login}
            logout={logout}
            showNotification={showNotification}
          />
        )}
      </main>

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        closeModal={closeAuthModal}
        signup={signup}
        login={login}
        showNotification={showNotification}
      />

      <ReportDetailsModal
        selectedReport={selectedReport}
        closeReportDetails={closeReportDetails}
        handleDeleteReport={handleDeleteReport}
        canDeleteReport={canDeleteSelectedReport}
      />

      {notification && (
        <div className="toastNotification">
          <strong>RoadRakshak</strong>
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
}

export default App;