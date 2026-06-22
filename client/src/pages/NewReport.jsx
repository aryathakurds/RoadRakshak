import {
  Building2,
  Camera,
  Check,
  ExternalLink,
  FileText,
  LocateFixed,
  MapPin,
  Navigation,
  ShieldCheck,
  Upload,
} from "lucide-react";

import LocationSearch from "../components/LocationSearch";

function NewReport({
  reportForm,
  authorityMatch,
  authorityLoading,
  locationStatus,
  submitStatus,
  handleReportChange,
  handlePhotoChange,
  handleGetLocation,
  handleSubmitReport,
}) {
  const updateField = (name, value) => {
    handleReportChange({
      target: {
        name,
        value: value || "",
      },
    });
  };

  const handleLocationSelect = (location) => {
    const address = [
      location.locality,
      location.city,
      location.district,
      location.state,
      location.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    updateField("location", address);
    updateField("locality", location.locality);
    updateField("city", location.city);
    updateField("district", location.district);
    updateField("state", location.state);
    updateField("pincode", location.pincode);
    updateField("latitude", String(location.latitude || ""));
    updateField("longitude", String(location.longitude || ""));
  };

  const authorityName =
    authorityMatch?.name ||
    "Location required for authority matching";

  const authorityDepartment =
    authorityMatch?.department ||
    "The responsible road department will appear here.";

  const authorityChannel =
    authorityMatch?.channel ||
    "Official complaint channel pending";

  const authorityConfidence =
    authorityMatch?.confidence || "Pending";

  const complaintUrl = authorityMatch?.complaintUrl || "";

  const hasPhoto = Boolean(
    reportForm.photoPreview || reportForm.photoName
  );

  const hasLocation = Boolean(reportForm.location);

  return (
    <main className="newReportPage">
      <style>{styles}</style>

      <section className="newReportHero">
        <img src="/new-report-banner-v2.png" alt="Road inspection in progress" />

        <div className="newReportHeroOverlay" />

        <div className="newReportHeroContent">
          <p>Citizen road reporting</p>

          <h1>Create a new road report.</h1>

          <span>
            Add photographic evidence, verify the location and
            prepare a structured complaint for the responsible
            authority.
          </span>
        </div>
      </section>

      <section className="newReportWorkspace">
        <div className="newReportSteps">
          <div className={hasPhoto ? "completed" : ""}>
            <span>01</span>
            <p>
              <strong>Evidence</strong>
              <small>Photograph the issue</small>
            </p>
          </div>

          <div className={hasLocation ? "completed" : ""}>
            <span>02</span>
            <p>
              <strong>Location</strong>
              <small>Verify the road</small>
            </p>
          </div>

          <div>
            <span>03</span>
            <p>
              <strong>Issue details</strong>
              <small>Explain the damage</small>
            </p>
          </div>

          <div>
            <span>04</span>
            <p>
              <strong>Submit</strong>
              <small>Route the complaint</small>
            </p>
          </div>
        </div>

        <div className="newReportLayout">
          <form
            className="newReportForm"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitReport();
            }}
          >
            <section className="newReportSection">
              <div className="newReportSectionHeading">
                <div>
                  <span>Step 01</span>
                  <h2>Add road evidence</h2>
                  <p>
                    Upload a clear image that shows the complete
                    road issue.
                  </p>
                </div>

                <Camera size={21} />
              </div>

              <label className="newReportUpload">
                {reportForm.photoPreview ? (
                  <>
                    <img
                      src={reportForm.photoPreview}
                      alt="Selected road evidence"
                    />

                    <div className="newReportPhotoOverlay" />

                    <div className="newReportPhotoDetails">
                      <div>
                        <strong>Evidence selected</strong>
                        <span>{reportForm.photoName}</span>
                      </div>

                      <i>
                        <Check size={17} />
                      </i>
                    </div>
                  </>
                ) : (
                  <div className="newReportUploadEmpty">
                    <span>
                      <Upload size={22} />
                    </span>

                    <strong>
                      Upload or capture a road photograph
                    </strong>

                    <p>
                      JPG, PNG or WebP. Make sure the damage is
                      clearly visible.
                    </p>

                    <b>
                      <Camera size={15} />
                      Choose photograph
                    </b>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  onChange={handlePhotoChange}
                />
              </label>
            </section>

            <section className="newReportSection">
              <div className="newReportSectionHeading">
                <div>
                  <span>Step 02</span>
                  <h2>Verify the location</h2>
                  <p>
                    Search for the road or use your current GPS
                    location.
                  </p>
                </div>

                <MapPin size={21} />
              </div>

              <LocationSearch
                onSelectLocation={handleLocationSelect}
              />

              <div className="newReportLocationActions">
                <button
                  type="button"
                  onClick={handleGetLocation}
                >
                  <LocateFixed size={16} />
                  Use current location
                </button>

                {locationStatus && (
                  <span>{locationStatus}</span>
                )}
              </div>

              <div className="newReportLocationResult">
                <Navigation size={19} />

                <div>
                  <strong>
                    {hasLocation
                      ? "Road location confirmed"
                      : "Location not selected"}
                  </strong>

                  <p>
                    {reportForm.location ||
                      "Search by city, locality, district or PIN code."}
                  </p>

                  {reportForm.latitude &&
                    reportForm.longitude && (
                      <small>
                        {reportForm.latitude},{" "}
                        {reportForm.longitude}
                      </small>
                    )}
                </div>
              </div>

              <label className="newReportField addressField">
                <span>Confirmed address</span>

                <input
                  name="location"
                  value={reportForm.location}
                  onChange={handleReportChange}
                  placeholder="Enter or confirm the road address"
                />
              </label>
            </section>

            <section className="newReportSection">
              <div className="newReportSectionHeading">
                <div>
                  <span>Step 03</span>
                  <h2>Describe the road issue</h2>
                  <p>
                    Provide the details required for inspection and
                    complaint filing.
                  </p>
                </div>

                <FileText size={21} />
              </div>

              <div className="newReportFields">
                <label className="newReportField">
                  <span>Issue type</span>

                  <select
                    name="issueType"
                    value={reportForm.issueType}
                    onChange={handleReportChange}
                  >
                    <option>Pothole</option>
                    <option>Broken road surface</option>
                    <option>Road crack</option>
                    <option>Waterlogging</option>
                    <option>Open manhole</option>
                    <option>Garbage or obstruction</option>
                    <option>Damaged divider</option>
                    <option>Missing road sign</option>
                  </select>
                </label>

                <label className="newReportField">
                  <span>Severity</span>

                  <select
                    name="severity"
                    value={reportForm.severity}
                    onChange={handleReportChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </label>

                <label className="newReportField fullField">
                  <span>Description</span>

                  <textarea
                    name="description"
                    value={reportForm.description}
                    onChange={handleReportChange}
                    placeholder="Describe the damage, nearby landmark and the risk faced by road users."
                    rows="5"
                  />
                </label>
              </div>
            </section>

            {submitStatus && (
              <p className="newReportSubmitStatus">
                {submitStatus}
              </p>
            )}

            <button
              className="newReportSubmit"
              type="submit"
            >
              <FileText size={17} />
              Submit verified road report
            </button>
          </form>

          <aside className="newReportPreview">
            <div className="newReportPreviewHeader">
              <div>
                <span>Complaint preview</span>
                <h2>Report summary</h2>
              </div>

              <ShieldCheck size={21} />
            </div>

            <div className="newReportPreviewEvidence">
              {reportForm.photoPreview ? (
                <img
                  src={reportForm.photoPreview}
                  alt="Road evidence preview"
                />
              ) : (
                <div>
                  <Camera size={23} />
                  <span>No evidence added</span>
                </div>
              )}
            </div>

            <div className="newReportPreviewDetails">
              <div>
                <span>Issue</span>
                <strong>{reportForm.issueType}</strong>
              </div>

              <div>
                <span>Severity</span>
                <strong>{reportForm.severity}</strong>
              </div>

              <div className="fullPreviewDetail">
                <span>Location</span>
                <strong>
                  {reportForm.location ||
                    "Waiting for location"}
                </strong>
              </div>
            </div>

            <div className="newReportAuthority">
              <span className="newReportAuthorityIcon">
                <Building2 size={19} />
              </span>

              <div>
                <small>Likely responsible authority</small>

                <strong>
                  {authorityLoading
                    ? "Finding responsible authority..."
                    : authorityName}
                </strong>

                <p>{authorityDepartment}</p>
                <span>{authorityChannel}</span>

                <b>
                  {authorityLoading
                    ? "Checking jurisdiction"
                    : authorityConfidence}
                </b>
              </div>
            </div>

            {complaintUrl && (
              <a
                className="newReportPortal"
                href={complaintUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={16} />
                Open official portal
              </a>
            )}

            <div className="newReportDraft">
              <div>
                <strong>Complaint draft</strong>

                <span>
                  {hasPhoto
                    ? "Evidence attached"
                    : "Evidence required"}
                </span>
              </div>

              <p>To the concerned road authority,</p>

              <p>
                A <b>{reportForm.severity.toLowerCase()}</b>{" "}
                severity issue has been reported as{" "}
                <b>{reportForm.issueType}</b>.
              </p>

              <p>
                Location:{" "}
                <b>
                  {reportForm.location ||
                    "Location not selected"}
                </b>
              </p>

              <p>
                {reportForm.description ||
                  "The citizen description will appear here."}
              </p>

              <p>
                Kindly inspect the location and take the required
                action for public safety.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

const styles = `
  .newReportPage {
    min-height: 100vh;
    padding: 24px 28px 80px;
    box-sizing: border-box;
    color: #171a18;
    background: #f1f3f1;
  }

  .newReportHero {
    position: relative;
    width: min(1280px, 100%);
    height: 330px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 6px;
    background: #151916;
  }

  .newReportHero > img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }

  .newReportHeroOverlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        90deg,
        rgba(7, 11, 8, 0.92) 0%,
        rgba(7, 11, 8, 0.73) 44%,
        rgba(7, 11, 8, 0.18) 78%
      ),
      linear-gradient(
        0deg,
        rgba(7, 11, 8, 0.28),
        transparent 55%
      );
  }

  .newReportHeroContent {
    position: absolute;
    top: 50%;
    left: clamp(25px, 5vw, 65px);
    width: min(620px, calc(100% - 50px));
    color: #ffffff;
    transform: translateY(-50%);
  }

  .newReportHeroContent > p {
    margin: 0 0 13px;
    color: rgba(255, 255, 255, 0.72);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .newReportHeroContent h1 {
    margin: 0;
    font-size: clamp(37px, 5vw, 63px);
    font-weight: 600;
    line-height: 1.04;
    letter-spacing: 0;
  }

  .newReportHeroContent > span {
    display: block;
    max-width: 570px;
    margin-top: 18px;
    color: rgba(255, 255, 255, 0.78);
    font-size: 15px;
    line-height: 1.65;
  }

  .newReportWorkspace {
    position: relative;
    z-index: 2;
    width: min(1180px, calc(100% - 50px));
    margin: -38px auto 0;
  }

  .newReportSteps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border: 1px solid #cdd3cf;
    background: #ffffff;
    box-shadow: 0 14px 35px rgba(15, 20, 17, 0.09);
  }

  .newReportSteps > div {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 16px 18px;
    border-right: 1px solid #d5dad7;
  }

  .newReportSteps > div:last-child {
    border-right: 0;
  }

  .newReportSteps > div > span {
    display: grid;
    flex: 0 0 29px;
    width: 29px;
    height: 29px;
    place-items: center;
    border: 1px solid #aab3ad;
    border-radius: 50%;
    color: #59625c;
    font-size: 10px;
    font-weight: 700;
  }

  .newReportSteps > div.completed > span {
    color: #ffffff;
    border-color: #171a18;
    background: #171a18;
  }

  .newReportSteps p,
  .newReportSteps strong,
  .newReportSteps small {
    display: block;
    margin: 0;
  }

  .newReportSteps strong {
    font-size: 12px;
  }

  .newReportSteps small {
    margin-top: 2px;
    color: #737b76;
    font-size: 10px;
  }

  .newReportLayout {
    display: grid;
    grid-template-columns:
      minmax(0, 1.35fr)
      minmax(310px, 0.65fr);
    align-items: start;
    gap: 22px;
    margin-top: 22px;
  }

  .newReportForm {
    display: grid;
    gap: 18px;
  }

  .newReportSection,
  .newReportPreview {
    border: 1px solid #d1d7d3;
    background: #ffffff;
  }

  .newReportSection {
    padding: 25px;
  }

  .newReportSectionHeading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;
  }

  .newReportSectionHeading span {
    color: #717974;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .newReportSectionHeading h2 {
    margin: 5px 0 0;
    font-size: 20px;
    font-weight: 600;
  }

  .newReportSectionHeading p {
    margin: 7px 0 0;
    color: #68716b;
    font-size: 12px;
    line-height: 1.5;
  }

  .newReportSectionHeading svg {
    flex: 0 0 auto;
    color: #4f5852;
  }

  .newReportUpload {
    position: relative;
    min-height: 230px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px dashed #9da7a0;
    background: #f6f7f6;
    cursor: pointer;
  }

  .newReportUpload > input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }

  .newReportUpload > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .newReportPhotoOverlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(5, 8, 6, 0.8),
      transparent 60%
    );
  }

  .newReportPhotoDetails {
    position: absolute;
    right: 17px;
    bottom: 17px;
    left: 17px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    color: #ffffff;
  }

  .newReportPhotoDetails strong,
  .newReportPhotoDetails span {
    display: block;
  }

  .newReportPhotoDetails strong {
    font-size: 13px;
  }

  .newReportPhotoDetails span {
    max-width: 330px;
    margin-top: 3px;
    overflow: hidden;
    color: rgba(255, 255, 255, 0.65);
    font-size: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .newReportPhotoDetails i {
    display: grid;
    width: 31px;
    height: 31px;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    font-style: normal;
  }

  .newReportUploadEmpty {
    display: grid;
    justify-items: center;
    padding: 30px;
    text-align: center;
  }

  .newReportUploadEmpty > span {
    display: grid;
    width: 50px;
    height: 50px;
    place-items: center;
    border: 1px solid #b5beb8;
    border-radius: 50%;
    background: #ffffff;
  }

  .newReportUploadEmpty strong {
    margin-top: 15px;
    font-size: 14px;
  }

  .newReportUploadEmpty p {
    max-width: 390px;
    margin: 7px 0 0;
    color: #737b76;
    font-size: 11px;
    line-height: 1.5;
  }

  .newReportUploadEmpty b {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 15px;
    font-size: 11px;
  }

  .newReportLocationActions {
    display: flex;
    align-items: center;
    gap: 13px;
    margin-top: 13px;
  }

  .newReportLocationActions button {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 0 14px;
    border: 1px solid #aeb7b1;
    color: #202521;
    background: #ffffff;
    font: inherit;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }

  .newReportLocationActions > span {
    color: #68716b;
    font-size: 11px;
  }

  .newReportLocationResult {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 12px;
    margin-top: 16px;
    padding: 15px;
    border: 1px solid #d3d9d5;
    background: #f7f8f7;
  }

  .newReportLocationResult strong,
  .newReportLocationResult p,
  .newReportLocationResult small {
    display: block;
    margin: 0;
  }

  .newReportLocationResult strong {
    font-size: 12px;
  }

  .newReportLocationResult p {
    margin-top: 4px;
    color: #626b65;
    font-size: 11px;
    line-height: 1.5;
  }

  .newReportLocationResult small {
    margin-top: 7px;
    color: #858d88;
    font-size: 9px;
  }

  .addressField {
    margin-top: 16px;
  }

  .newReportFields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .newReportField {
    display: grid;
    gap: 7px;
  }

  .newReportField > span {
    font-size: 11px;
    font-weight: 700;
  }

  .newReportField input,
  .newReportField select,
  .newReportField textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #b9c2bc;
    border-radius: 0;
    outline: 0;
    color: #171a18;
    background: #ffffff;
    font: inherit;
    font-size: 12px;
  }

  .newReportField input,
  .newReportField select {
    min-height: 43px;
    padding: 0 12px;
  }

  .newReportField textarea {
    min-height: 125px;
    padding: 12px;
    resize: vertical;
    line-height: 1.6;
  }

  .newReportField input:focus,
  .newReportField select:focus,
  .newReportField textarea:focus {
    border-color: #171a18;
  }

  .fullField {
    grid-column: 1 / -1;
  }

  .newReportSubmitStatus {
    margin: 0;
    padding: 12px 14px;
    border-left: 3px solid #171a18;
    color: #535c56;
    background: #e9ecea;
    font-size: 11px;
  }

  .newReportSubmit {
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    border: 1px solid #151916;
    color: #ffffff;
    background: #151916;
    font: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .newReportSubmit:hover {
    background: #2c322e;
  }

  .newReportPreview {
    position: sticky;
    top: 20px;
    padding: 22px;
  }

  .newReportPreviewHeader {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 15px;
    padding-bottom: 17px;
    border-bottom: 1px solid #d6dbd8;
  }

  .newReportPreviewHeader span {
    color: #737b76;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .newReportPreviewHeader h2 {
    margin: 5px 0 0;
    font-size: 18px;
    font-weight: 600;
  }

  .newReportPreviewEvidence {
    height: 165px;
    margin-top: 18px;
    overflow: hidden;
    border: 1px solid #d1d7d3;
    background: #f2f4f2;
  }

  .newReportPreviewEvidence img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .newReportPreviewEvidence > div {
    width: 100%;
    height: 100%;
    display: grid;
    align-content: center;
    justify-items: center;
    gap: 8px;
    color: #727a75;
    font-size: 10px;
  }

  .newReportPreviewDetails {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 17px;
    border-top: 1px solid #d6dbd8;
    border-left: 1px solid #d6dbd8;
  }

  .newReportPreviewDetails > div {
    padding: 12px;
    border-right: 1px solid #d6dbd8;
    border-bottom: 1px solid #d6dbd8;
  }

  .newReportPreviewDetails span,
  .newReportPreviewDetails strong {
    display: block;
  }

  .newReportPreviewDetails span {
    color: #777f7a;
    font-size: 9px;
    text-transform: uppercase;
  }

  .newReportPreviewDetails strong {
    margin-top: 4px;
    font-size: 11px;
    line-height: 1.4;
  }

  .fullPreviewDetail {
    grid-column: 1 / -1;
  }

  .newReportAuthority {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 11px;
    margin-top: 18px;
    padding: 16px 0;
    border-top: 1px solid #d6dbd8;
    border-bottom: 1px solid #d6dbd8;
  }

  .newReportAuthorityIcon {
    display: grid;
    width: 38px;
    height: 38px;
    place-items: center;
    border: 1px solid #b4bdb7;
    border-radius: 50%;
  }

  .newReportAuthority small,
  .newReportAuthority strong,
  .newReportAuthority p,
  .newReportAuthority div > span,
  .newReportAuthority b {
    display: block;
  }

  .newReportAuthority small {
    color: #747c77;
    font-size: 8px;
    text-transform: uppercase;
  }

  .newReportAuthority strong {
    margin-top: 5px;
    font-size: 12px;
    line-height: 1.4;
  }

  .newReportAuthority p {
    margin: 4px 0 0;
    color: #606963;
    font-size: 10px;
  }

  .newReportAuthority div > span {
    margin-top: 3px;
    color: #818984;
    font-size: 9px;
  }

  .newReportAuthority b {
    width: fit-content;
    margin-top: 8px;
    padding: 4px 6px;
    border: 1px solid #b9c2bc;
    font-size: 8px;
    text-transform: uppercase;
  }

  .newReportPortal {
    min-height: 39px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin-top: 15px;
    border: 1px solid #b2bbb5;
    color: #171a18;
    font-size: 10px;
    font-weight: 700;
    text-decoration: none;
  }

  .newReportDraft {
    margin-top: 18px;
    padding: 16px;
    border: 1px solid #d6dbd8;
    color: #505954;
    background: #fafbfa;
    font-size: 10px;
    line-height: 1.6;
  }

  .newReportDraft > div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .newReportDraft > div strong {
    color: #171a18;
    font-size: 11px;
    text-transform: uppercase;
  }

  .newReportDraft > div span {
    color: #777f7a;
    font-size: 9px;
  }

  .newReportDraft p {
    margin: 0 0 11px;
  }

  .newReportDraft p:last-child {
    margin-bottom: 0;
  }

  .newReportDraft b {
    color: #171a18;
  }

  @media (max-width: 950px) {
    .newReportLayout {
      grid-template-columns: 1fr;
    }

    .newReportPreview {
      position: static;
    }
  }

  @media (max-width: 720px) {
    .newReportPage {
      padding: 16px 15px 55px;
    }

    .newReportHero {
      height: 300px;
    }

    .newReportWorkspace {
      width: calc(100% - 20px);
      margin-top: -28px;
    }

    .newReportSteps {
      grid-template-columns: 1fr 1fr;
    }

    .newReportSteps > div:nth-child(2) {
      border-right: 0;
    }

    .newReportSteps > div:nth-child(-n + 2) {
      border-bottom: 1px solid #d5dad7;
    }

    .newReportSection {
      padding: 19px;
    }

    .newReportFields {
      grid-template-columns: 1fr;
    }

    .fullField {
      grid-column: auto;
    }
  }

  @media (max-width: 480px) {
    .newReportHeroContent {
      left: 22px;
      width: calc(100% - 44px);
    }

    .newReportHeroContent h1 {
      font-size: 37px;
    }

    .newReportSteps {
      grid-template-columns: 1fr;
    }

    .newReportSteps > div {
      border-right: 0;
      border-bottom: 1px solid #d5dad7;
    }

    .newReportSteps > div:last-child {
      border-bottom: 0;
    }

    .newReportLocationActions {
      align-items: stretch;
      flex-direction: column;
    }

    .newReportLocationActions button {
      justify-content: center;
    }
  }
    /* Full-width half-screen New Report hero */
  .newReportPage {
    padding: 0 0 80px;
  }

  .newReportPage ~ * {
    box-sizing: border-box;
  }

  /* Put the existing Search, notification and Sign in over the image */
  .main {
    position: relative;
  }

  .main > .minimalTopbar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 30;
    min-height: 76px;
    padding: 0 42px;
    border: 0;
    color: #ffffff;
    background: linear-gradient(
      to bottom,
      rgba(5, 8, 6, 0.72),
      transparent
    );
  }

  .main > .minimalTopbar button,
  .main > .minimalTopbar span,
  .main > .minimalTopbar svg {
    color: #ffffff;
  }

  .main > .minimalTopbar button {
    border-color: rgba(255, 255, 255, 0.4);
    background: transparent;
  }

  .main > .minimalTopbar .topbarProfileCircle {
    color: #111713;
    background: #ffffff;
  }

  .main > .minimalTopbar .topbarProfileCircle svg {
    color: #111713;
  }

  /* Remove the status strip from the New Report page */
  .main > .frontendStatusBar {
    display: none;
  }

  .newReportHero {
    width: 100%;
    height: clamp(520px, 58vh, 650px);
    margin: 0;
    border-radius: 0;
  }

  .newReportHero > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 42%;
  }

  .newReportHeroOverlay {
    background:
      linear-gradient(
        90deg,
        rgba(5, 8, 6, 0.94) 0%,
        rgba(5, 8, 6, 0.76) 38%,
        rgba(5, 8, 6, 0.25) 70%,
        rgba(5, 8, 6, 0.08) 100%
      ),
      linear-gradient(
        to bottom,
        rgba(5, 8, 6, 0.25),
        transparent 30%,
        rgba(5, 8, 6, 0.32)
      );
  }

  .newReportHeroContent {
    top: 48%;
    left: clamp(36px, 6vw, 100px);
    width: min(670px, calc(100% - 72px));
  }

  .newReportHeroContent > p {
    margin-bottom: 16px;
    color: rgba(255, 255, 255, 0.76);
    font-size: 12px;
    letter-spacing: 0;
  }

  .newReportHeroContent h1 {
    max-width: 650px;
    font-size: clamp(48px, 6vw, 82px);
    font-weight: 600;
    line-height: 0.98;
  }

  .newReportHeroContent > span {
    max-width: 610px;
    margin-top: 23px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 16px;
    line-height: 1.7;
  }

  .newReportWorkspace {
    width: min(1220px, calc(100% - 64px));
    margin-top: -64px;
  }

  .newReportSteps {
    box-shadow: 0 18px 45px rgba(9, 14, 11, 0.16);
  }

  .newReportSteps > div {
    min-height: 82px;
    box-sizing: border-box;
    padding: 17px 22px;
  }

  @media (max-width: 720px) {
    .main > .minimalTopbar {
      min-height: 64px;
      padding: 0 18px;
    }

    .newReportHero {
      height: 540px;
    }

    .newReportHero > img {
      object-position: 64% center;
    }

    .newReportHeroOverlay {
      background:
        linear-gradient(
          to right,
          rgba(5, 8, 6, 0.9),
          rgba(5, 8, 6, 0.48)
        ),
        linear-gradient(
          to top,
          rgba(5, 8, 6, 0.65),
          transparent
        );
    }

    .newReportHeroContent {
      top: 50%;
      left: 24px;
      width: calc(100% - 48px);
    }

    .newReportHeroContent h1 {
      font-size: clamp(43px, 12vw, 58px);
    }

    .newReportHeroContent > span {
      font-size: 14px;
    }

    .newReportWorkspace {
      width: calc(100% - 30px);
      margin-top: -46px;
    }
  }

  @media (max-width: 480px) {
    .main > .minimalTopbar {
      padding: 0 14px;
    }

    .topbarSearchText span {
      display: none;
    }

    .newReportHero {
      height: 510px;
    }

    .newReportHeroContent h1 {
      font-size: 43px;
    }

    .newReportSteps > div {
      min-height: 67px;
    }
  }

`;
export default NewReport;