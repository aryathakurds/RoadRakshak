import {
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  getAuthorities,
  getAuthorityById,
} from "../services/authorityApi";

const indianStates = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const authorityTypes = [
  "NHAI",
  "PWD",
  "Municipal Corporation",
  "Municipality",
  "Nagar Panchayat",
  "Gram Panchayat",
  "Cantonment Board",
  "Development Authority",
  "Other",
];

const getLocation = (authority) => {
  const location = [
    authority.city,
    authority.district,
    authority.state,
  ].filter(Boolean);

  return location.length
    ? location.join(", ")
    : "All India";
};

const getDepartment = (authority) => {
  return authority.departments?.length
    ? authority.departments.join(", ")
    : authority.type || "Road maintenance";
};

const getCoverage = (authority) => {
  return authority.roadTypes?.length
    ? authority.roadTypes.join(", ")
    : authority.jurisdiction ||
        authority.level ||
        "Not specified";
};

const getChannel = (authority) => {
  if (authority.complaintUrl) {
    return "Online complaint portal";
  }

  if (authority.helpline) {
    return `Helpline: ${authority.helpline}`;
  }

  if (authority.email) {
    return authority.email;
  }

  return "Official website";
};

const formatDate = (date) => {
  if (!date) {
    return "Verification date unavailable";
  }

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
};

function AuthorityDirectory() {
  const [authorities, setAuthorities] =
    useState([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [selectedState, setSelectedState] =
    useState("");

  const [selectedType, setSelectedType] =
    useState("");

  const [verifiedOnly, setVerifiedOnly] =
    useState(false);

  const [
    selectedAuthority,
    setSelectedAuthority,
  ] = useState(null);

  const [
    detailsLoading,
    setDetailsLoading,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadAuthorities = useCallback(
    async ({
      query = "",
      state = "",
      type = "",
      verified = false,
    } = {}) => {
      try {
        setLoading(true);
        setError("");

        const data = await getAuthorities({
          q: query,
          state,
          type,
          verified: verified
            ? "true"
            : "",
        });

        setAuthorities(
          data.authorities || []
        );
      } catch (requestError) {
        setAuthorities([]);
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAuthorities({
        query: searchQuery.trim(),
        state: selectedState,
        type: selectedType,
        verified: verifiedOnly,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [
    searchQuery,
    selectedState,
    selectedType,
    verifiedOnly,
    loadAuthorities,
  ]);

  useEffect(() => {
    if (!selectedAuthority) {
      return;
    }

    const closeWithEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedAuthority(null);
      }
    };

    window.addEventListener(
      "keydown",
      closeWithEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        closeWithEscape
      );
    };
  }, [selectedAuthority]);

  const openAuthorityDetails = async (
    authorityId
  ) => {
    try {
      setDetailsLoading(true);

      const data = await getAuthorityById(
        authorityId
      );

      setSelectedAuthority(
        data.authority
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedType("");
    setVerifiedOnly(false);
  };

  const hasFilters = Boolean(
    searchQuery ||
      selectedState ||
      selectedType ||
      verifiedOnly
  );

  return (
    <section className="authorityDirectoryPage">
      <header className="directoryHeader">
        <div>
          <p className="eyebrow">
            Authority directory
          </p>

          <h3>
            Official road maintenance authorities
          </h3>

          <p>
            Find government departments, their
            coverage and official complaint
            channels.
          </p>
        </div>

        <div className="directorySearch">
          <Search size={17} />

          <input
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(
                event.target.value
              )
            }
            placeholder="Search city or authority"
          />
        </div>
      </header>

      <div className="directoryFilters">
        <div className="fieldGroup">
          <label htmlFor="authority-state">
            State or Union Territory
          </label>

          <select
            id="authority-state"
            value={selectedState}
            onChange={(event) =>
              setSelectedState(
                event.target.value
              )
            }
          >
            <option value="">
              All states
            </option>

            {indianStates.map((state) => (
              <option
                value={state}
                key={state}
              >
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="fieldGroup">
          <label htmlFor="authority-type">
            Authority type
          </label>

          <select
            id="authority-type"
            value={selectedType}
            onChange={(event) =>
              setSelectedType(
                event.target.value
              )
            }
          >
            <option value="">
              All authority types
            </option>

            {authorityTypes.map((type) => (
              <option
                value={type}
                key={type}
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        <label className="directoryCheckbox">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(event) =>
              setVerifiedOnly(
                event.target.checked
              )
            }
          />

          <span>
            Show verified records only
          </span>
        </label>

        <button
          type="button"
          className="secondaryButton"
          onClick={clearFilters}
          disabled={!hasFilters}
        >
          Clear filters
        </button>
      </div>

      {loading && (
        <div className="emptyState">
          <RefreshCw size={22} />
          <h3>Loading authorities...</h3>
          <p>
            Reading records from the RoadRakshak
            database.
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="emptyState">
          <h3>
            Unable to load authorities
          </h3>

          <p>{error}</p>

          <button
            type="button"
            className="secondaryButton"
            onClick={() =>
              loadAuthorities({
                query: searchQuery.trim(),
                state: selectedState,
                type: selectedType,
                verified: verifiedOnly,
              })
            }
          >
            <RefreshCw size={17} />
            Try again
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        authorities.length === 0 && (
          <div className="emptyState">
            <Search size={22} />
            <h3>No authorities found</h3>

            <p>
              Authority data may not have been
              added for these filters yet.
            </p>

            {hasFilters && (
              <button
                type="button"
                className="secondaryButton"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

      {!loading &&
        !error &&
        authorities.length > 0 && (
          <>
            <div className="frontendStatusBar">
              <span>
                <ShieldCheck size={16} />
                Official directory
              </span>

              <strong>
                {authorities.length}{" "}
                {authorities.length === 1
                  ? "authority"
                  : "authorities"}
              </strong>

              <small>
                Select a record to see full details
              </small>
            </div>

            <div className="authorityTable">
              <div className="authorityTableHeader">
                <span>Location</span>
                <span>Authority</span>
                <span>Department</span>
                <span>Coverage</span>
                <span>Channel</span>
                <span></span>
              </div>

              {authorities.map(
                (authority) => (
                  <button
                    type="button"
                    className="authorityTableRow authorityRowButton"
                    key={authority._id}
                    onClick={() =>
                      openAuthorityDetails(
                        authority._id
                      )
                    }
                  >
                    <strong>
                      {getLocation(authority)}
                    </strong>

                    <div>
                      <strong>
                        {authority.name}
                      </strong>

                      <small>
                        {authority.shortName
                          ? `${authority.shortName} - `
                          : ""}

                        {authority.verificationStatus ||
                          "Unverified"}
                      </small>
                    </div>

                    <span>
                      {getDepartment(authority)}
                    </span>

                    <span>
                      {getCoverage(authority)}
                    </span>

                    <span>
                      {getChannel(authority)}
                    </span>

                    <span className="directoryLink">
                      {detailsLoading ? (
                        <RefreshCw size={17} />
                      ) : (
                        <ExternalLink size={17} />
                      )}
                    </span>
                  </button>
                )
              )}
            </div>
          </>
        )}

      {selectedAuthority && (
        <div
          className="authorityModalBackdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedAuthority(null);
            }
          }}
        >
          <section
            className="authorityDetailsModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="authority-details-title"
          >
            <header className="authorityDetailsHeader">
              <div>
                <span>
                  {selectedAuthority.shortName ||
                    selectedAuthority.type}
                </span>

                <h2 id="authority-details-title">
                  {selectedAuthority.name}
                </h2>

                <p>
                  {getLocation(
                    selectedAuthority
                  )}
                </p>
              </div>

              <button
                type="button"
                className="modalCloseButton"
                onClick={() =>
                  setSelectedAuthority(null)
                }
                aria-label="Close authority details"
                title="Close"
              >
                <X size={20} />
              </button>
            </header>

            <div className="authorityVerification">
              <ShieldCheck size={19} />

              <div>
                <strong>
                  {selectedAuthority.verificationStatus}
                </strong>

                <span>
                  Last checked:{" "}
                  {formatDate(
                    selectedAuthority.lastVerifiedAt
                  )}
                </span>
              </div>
            </div>

            <div className="authorityDetailsGrid">
              <div>
                <span>Authority level</span>
                <strong>
                  {selectedAuthority.level}
                </strong>
              </div>

              <div>
                <span>Authority type</span>
                <strong>
                  {selectedAuthority.type}
                </strong>
              </div>

              <div>
                <span>Local body</span>
                <strong>
                  {selectedAuthority.localBody ||
                    "Not specified"}
                </strong>
              </div>

              <div>
                <span>Departments</span>
                <strong>
                  {getDepartment(
                    selectedAuthority
                  )}
                </strong>
              </div>
            </div>

            <div className="authorityDetailsSection">
              <h3>Jurisdiction</h3>

              <p>
                {selectedAuthority.jurisdiction}
              </p>

              <div className="authorityLocationLine">
                <MapPin size={17} />
                <span>
                  {getLocation(
                    selectedAuthority
                  )}
                </span>
              </div>
            </div>

            <div className="authorityDetailsSection">
              <h3>Road coverage</h3>

              <p>
                {getCoverage(
                  selectedAuthority
                )}
              </p>
            </div>

            <div className="authorityContactList">
              {selectedAuthority.helpline && (
                <a
                  href={`tel:${selectedAuthority.helpline}`}
                >
                  <Phone size={17} />
                  {selectedAuthority.helpline}
                </a>
              )}

              {selectedAuthority.email && (
                <a
                  href={`mailto:${selectedAuthority.email}`}
                >
                  <Mail size={17} />
                  {selectedAuthority.email}
                </a>
              )}
            </div>

            <footer className="authorityDetailsActions">
              {selectedAuthority.complaintUrl && (
                <a
                  className="primaryButton"
                  href={
                    selectedAuthority.complaintUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={17} />
                  Open complaint portal
                </a>
              )}

              <a
                className="secondaryButton"
                href={
                  selectedAuthority.officialWebsite
                }
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={17} />
                Official website
              </a>

              <a
                className="secondaryButton"
                href={selectedAuthority.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                <ShieldCheck size={17} />
                Verification source
              </a>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}

export default AuthorityDirectory;