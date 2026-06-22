import {
  CheckCircle2,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  createAuthority,
  disableAuthority,
  getAuthorities,
  updateAuthority,
  verifyAuthority,
} from "../services/authorityApi";

const emptyForm = {
  name: "",
  shortName: "",
  level: "Municipal",
  type: "Municipal Corporation",
  state: "",
  district: "",
  city: "",
  localBody: "",
  jurisdiction: "",
  roadTypes: "",
  departments: "",
  officialWebsite: "",
  complaintUrl: "",
  helpline: "",
  email: "",
  sourceUrl: "",
  verificationStatus:
    "Verification required",
};

const levels = [
  "National",
  "State",
  "District",
  "Municipal",
  "Panchayat",
  "Cantonment",
  "Development Authority",
];

const types = [
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

const verificationOptions = [
  "Verified",
  "Partially verified",
  "Verification required",
];

const toArray = (value) => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const prepareForm = (authority) => ({
  name: authority.name || "",
  shortName: authority.shortName || "",
  level: authority.level || "Municipal",
  type:
    authority.type ||
    "Municipal Corporation",
  state: authority.state || "",
  district: authority.district || "",
  city: authority.city || "",
  localBody: authority.localBody || "",
  jurisdiction:
    authority.jurisdiction || "",
  roadTypes:
    authority.roadTypes?.join(", ") || "",
  departments:
    authority.departments?.join(", ") || "",
  officialWebsite:
    authority.officialWebsite || "",
  complaintUrl:
    authority.complaintUrl || "",
  helpline: authority.helpline || "",
  email: authority.email || "",
  sourceUrl: authority.sourceUrl || "",
  verificationStatus:
    authority.verificationStatus ||
    "Verification required",
});

function AdminAuthorities({
  showNotification,
}) {
  const [authorities, setAuthorities] =
    useState([]);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [
    editingAuthorityId,
    setEditingAuthorityId,
  ] = useState("");

  const [form, setForm] =
    useState(emptyForm);

  const loadAuthorities = useCallback(
    async (query = "") => {
      try {
        setLoading(true);
        setError("");

        const data = await getAuthorities({
          q: query,
        });

        setAuthorities(
          data.authorities || []
        );
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAuthorities(
        searchQuery.trim()
      );
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, loadAuthorities]);

  const updateField = (event) => {
    const { name, value } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openCreateForm = () => {
    setEditingAuthorityId("");
    setForm(emptyForm);
    setIsFormOpen(true);
    setError("");
  };

  const openEditForm = (authority) => {
    setEditingAuthorityId(
      authority._id
    );

    setForm(
      prepareForm(authority)
    );

    setIsFormOpen(true);
    setError("");
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingAuthorityId("");
    setForm(emptyForm);
    setError("");
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "level",
      "type",
      "jurisdiction",
      "officialWebsite",
      "sourceUrl",
    ];

    return requiredFields.every(
      (field) =>
        String(form[field]).trim()
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      setError(
        "Complete all required authority fields."
      );

      return;
    }

    const authorityData = {
      ...form,
      name: form.name.trim(),
      shortName:
        form.shortName.trim(),
      state: form.state.trim(),
      district: form.district.trim(),
      city: form.city.trim(),
      localBody:
        form.localBody.trim(),
      jurisdiction:
        form.jurisdiction.trim(),
      roadTypes: toArray(
        form.roadTypes
      ),
      departments: toArray(
        form.departments
      ),
      officialWebsite:
        form.officialWebsite.trim(),
      complaintUrl:
        form.complaintUrl.trim(),
      helpline:
        form.helpline.trim(),
      email: form.email.trim(),
      sourceUrl:
        form.sourceUrl.trim(),
      lastVerifiedAt:
        form.verificationStatus ===
        "Verified"
          ? new Date().toISOString()
          : null,
    };

    try {
      setSaving(true);
      setError("");

      if (editingAuthorityId) {
        await updateAuthority(
          editingAuthorityId,
          authorityData
        );

        showNotification(
          "Authority updated successfully."
        );
      } else {
        await createAuthority(
          authorityData
        );

        showNotification(
          "Authority added successfully."
        );
      }

      closeForm();
      await loadAuthorities(
        searchQuery.trim()
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async (
    authority
  ) => {
    const confirmed = window.confirm(
      `Mark ${authority.name} as verified?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await verifyAuthority(
        authority._id
      );

      showNotification(
        "Authority marked as verified."
      );

      await loadAuthorities(
        searchQuery.trim()
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleDisable = async (
    authority
  ) => {
    const confirmed = window.confirm(
      `Disable ${authority.name}? It will no longer appear in public results.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await disableAuthority(
        authority._id
      );

      showNotification(
        "Authority disabled."
      );

      await loadAuthorities(
        searchQuery.trim()
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="adminAuthoritiesPage">
      <header className="directoryHeader">
        <div>
          <p className="eyebrow">
            Administration
          </p>

          <h3>
            Authority records
          </h3>

          <p>
            Add, edit, verify and disable official
            road authority records.
          </p>
        </div>

        <button
          type="button"
          className="primaryButton"
          onClick={openCreateForm}
        >
          <Plus size={18} />
          Add authority
        </button>
      </header>

      <div className="directorySearch">
        <Search size={17} />

        <input
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(
              event.target.value
            )
          }
          placeholder="Search authority or location"
        />
      </div>

      {error && (
        <p className="submitStatus">
          {error}
        </p>
      )}

      {loading ? (
        <div className="emptyState">
          <RefreshCw size={22} />
          <h3>Loading records...</h3>
        </div>
      ) : (
        <div className="adminAuthorityTable">
          {authorities.map(
            (authority) => (
              <article
                className="adminAuthorityRow"
                key={authority._id}
              >
                <div>
                  <strong>
                    {authority.name}
                  </strong>

                  <span>
                    {authority.shortName ||
                      authority.type}
                  </span>
                </div>

                <div>
                  <strong>
                    {authority.city ||
                      authority.state ||
                      "All India"}
                  </strong>

                  <span>
                    {authority.level}
                  </span>
                </div>

                <div>
                  <strong>
                    {
                      authority.verificationStatus
                    }
                  </strong>

                  <span>
                    {authority.roadTypes?.join(
                      ", "
                    ) || "Road coverage"}
                  </span>
                </div>

                <div className="adminAuthorityActions">
                  <button
                    type="button"
                    title="Edit authority"
                    onClick={() =>
                      openEditForm(
                        authority
                      )
                    }
                  >
                    <Edit3 size={17} />
                  </button>

                  <button
                    type="button"
                    title="Verify authority"
                    disabled={
                      authority.verificationStatus ===
                      "Verified"
                    }
                    onClick={() =>
                      handleVerify(
                        authority
                      )
                    }
                  >
                    <CheckCircle2
                      size={17}
                    />
                  </button>

                  <button
                    type="button"
                    title="Disable authority"
                    onClick={() =>
                      handleDisable(
                        authority
                      )
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            )
          )}

          {!authorities.length && (
            <div className="emptyState">
              <Search size={22} />
              <h3>
                No authority records found
              </h3>
            </div>
          )}
        </div>
      )}

      {isFormOpen && (
        <div className="authorityModalBackdrop">
          <form
            className="adminAuthorityForm"
            onSubmit={handleSubmit}
          >
            <header className="authorityDetailsHeader">
              <div>
                <span>
                  Admin authority editor
                </span>

                <h2>
                  {editingAuthorityId
                    ? "Edit authority"
                    : "Add authority"}
                </h2>
              </div>

              <button
                type="button"
                className="modalCloseButton"
                onClick={closeForm}
                title="Close"
              >
                <X size={20} />
              </button>
            </header>

            <div className="adminAuthorityFormBody">
              <div className="fieldGroup">
                <label>
                  Official name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Official authority name"
                />
              </div>

              <div className="fieldGroup">
                <label>Short name</label>

                <input
                  name="shortName"
                  value={form.shortName}
                  onChange={updateField}
                  placeholder="Example: NHAI"
                />
              </div>

              <div className="fieldGroup">
                <label>Level *</label>

                <select
                  name="level"
                  value={form.level}
                  onChange={updateField}
                >
                  {levels.map((level) => (
                    <option
                      key={level}
                      value={level}
                    >
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fieldGroup">
                <label>Type *</label>

                <select
                  name="type"
                  value={form.type}
                  onChange={updateField}
                >
                  {types.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fieldGroup">
                <label>State</label>

                <input
                  name="state"
                  value={form.state}
                  onChange={updateField}
                />
              </div>

              <div className="fieldGroup">
                <label>District</label>

                <input
                  name="district"
                  value={form.district}
                  onChange={updateField}
                />
              </div>

              <div className="fieldGroup">
                <label>City</label>

                <input
                  name="city"
                  value={form.city}
                  onChange={updateField}
                />
              </div>

              <div className="fieldGroup">
                <label>Local body</label>

                <input
                  name="localBody"
                  value={form.localBody}
                  onChange={updateField}
                />
              </div>

              <div className="fieldGroup fullWidth">
                <label>Jurisdiction *</label>

                <textarea
                  name="jurisdiction"
                  value={form.jurisdiction}
                  onChange={updateField}
                  rows="3"
                  placeholder="Describe the geographical responsibility"
                />
              </div>

              <div className="fieldGroup">
                <label>Road types</label>

                <input
                  name="roadTypes"
                  value={form.roadTypes}
                  onChange={updateField}
                  placeholder="Municipal roads, ward roads"
                />
              </div>

              <div className="fieldGroup">
                <label>Departments</label>

                <input
                  name="departments"
                  value={form.departments}
                  onChange={updateField}
                  placeholder="Roads, Engineering"
                />
              </div>

              <div className="fieldGroup">
                <label>
                  Official website *
                </label>

                <input
                  type="url"
                  name="officialWebsite"
                  value={
                    form.officialWebsite
                  }
                  onChange={updateField}
                  placeholder="https://..."
                />
              </div>

              <div className="fieldGroup">
                <label>
                  Complaint portal
                </label>

                <input
                  type="url"
                  name="complaintUrl"
                  value={form.complaintUrl}
                  onChange={updateField}
                  placeholder="https://..."
                />
              </div>

              <div className="fieldGroup">
                <label>Helpline</label>

                <input
                  name="helpline"
                  value={form.helpline}
                  onChange={updateField}
                />
              </div>

              <div className="fieldGroup">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                />
              </div>

              <div className="fieldGroup">
                <label>
                  Verification source *
                </label>

                <input
                  type="url"
                  name="sourceUrl"
                  value={form.sourceUrl}
                  onChange={updateField}
                  placeholder="Official source URL"
                />
              </div>

              <div className="fieldGroup">
                <label>
                  Verification status
                </label>

                <select
                  name="verificationStatus"
                  value={
                    form.verificationStatus
                  }
                  onChange={updateField}
                >
                  {verificationOptions.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <footer className="authorityDetailsActions">
              <button
                type="submit"
                className="primaryButton"
                disabled={saving}
              >
                <CheckCircle2 size={18} />

                {saving
                  ? "Saving..."
                  : editingAuthorityId
                    ? "Save changes"
                    : "Add authority"}
              </button>

              <button
                type="button"
                className="secondaryButton"
                onClick={closeForm}
              >
                Cancel
              </button>
            </footer>
          </form>
        </div>
      )}
    </section>
  );
}

export default AdminAuthorities;