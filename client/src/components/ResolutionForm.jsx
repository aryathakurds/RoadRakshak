import {
  CheckCircle2,
  ImagePlus,
} from "lucide-react";
import { useEffect, useState } from "react";

function ResolutionForm({
  report,
  handleResolveReport,
}) {
  const [resolutionNote, setResolutionNote] =
    useState("");

  const [evidenceFile, setEvidenceFile] =
    useState(null);

  const [evidencePreview, setEvidencePreview] =
    useState("");

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    return () => {
      if (evidencePreview) {
        URL.revokeObjectURL(
          evidencePreview
        );
      }
    };
  }, [evidencePreview]);

  const handleEvidenceChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    setError("");

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      setError(
        "Use a JPG, PNG or WebP repair photo."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Repair photo must be smaller than 5 MB."
      );

      event.target.value = "";
      return;
    }

    if (evidencePreview) {
      URL.revokeObjectURL(
        evidencePreview
      );
    }

    setEvidenceFile(file);

    setEvidencePreview(
      URL.createObjectURL(file)
    );
  };

  const submitResolution = async (
    event
  ) => {
    event.preventDefault();
    setError("");

    if (!resolutionNote.trim()) {
      setError(
        "Add a short explanation of the completed repair."
      );

      return;
    }

    if (!evidenceFile) {
      setError(
        "Upload a repaired-road evidence photo."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      await handleResolveReport(
        report.id,
        {
          resolutionNote:
            resolutionNote.trim(),

          evidence: evidenceFile,
        }
      );

      if (evidencePreview) {
        URL.revokeObjectURL(
          evidencePreview
        );
      }

      setResolutionNote("");
      setEvidenceFile(null);
      setEvidencePreview("");
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to resolve the report."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="resolutionForm"
      onSubmit={submitResolution}
    >
      <div className="resolutionFormHeader">
        <CheckCircle2 size={20} />

        <div>
          <strong>
            Complete resolution
          </strong>

          <span>
            Add repair details and photographic
            evidence before closing this report.
          </span>
        </div>
      </div>

      <div className="fieldGroup">
        <label
          htmlFor={`resolution-note-${report.id}`}
        >
          Resolution note
        </label>

        <textarea
          id={`resolution-note-${report.id}`}
          value={resolutionNote}
          onChange={(event) =>
            setResolutionNote(
              event.target.value
            )
          }
          rows="4"
          maxLength="1000"
          placeholder="Describe the repair work completed at this location"
        />

        <small>
          {resolutionNote.length}/1000
        </small>
      </div>

      <label className="resolutionEvidenceUpload">
        <ImagePlus size={22} />

        <div>
          <strong>
            Upload repaired-road photo
          </strong>

          <span>
            JPG, PNG or WebP, maximum 5 MB
          </span>

          {evidenceFile && (
            <small>
              {evidenceFile.name}
            </small>
          )}
        </div>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={handleEvidenceChange}
        />
      </label>

      {evidencePreview && (
        <img
          className="resolutionEvidencePreview"
          src={evidencePreview}
          alt="Repair evidence preview"
        />
      )}

      {error && (
        <p className="submitStatus">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="primaryButton"
        disabled={isSubmitting}
      >
        <CheckCircle2 size={18} />

        {isSubmitting
          ? "Uploading evidence..."
          : "Mark report as resolved"}
      </button>
    </form>
  );
}

export default ResolutionForm;