import { useState } from "react";
import { BrainCircuit, Camera, CheckCircle2, Gauge, Upload } from "lucide-react";

function AIDetection({ handleUseAIDetection }) {
  const [scanStatus, setScanStatus] = useState("Waiting for image");
  const [uploadedImage, setUploadedImage] = useState({
    name: "",
    preview: "",
  });

  const [selectedDetection, setSelectedDetection] = useState(null);

  const detections = [
    {
      label: "Pothole",
      confidence: "91%",
      severity: "High",
      action: "Road surface repair required",
    },
    {
      label: "Waterlogging",
      confidence: "76%",
      severity: "Medium",
      action: "Drainage inspection suggested",
    },
    {
      label: "Open manhole",
      confidence: "88%",
      severity: "Critical",
      action: "Immediate barricading and repair required",
    },
  ];

  const handleAIUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    setUploadedImage({
      name: file.name,
      preview,
    });

    setScanStatus("Scanning image...");

    setTimeout(() => {
      setSelectedDetection(detections[0]);
      setScanStatus("Detection complete");
    }, 900);
  };

  const handleUseResult = () => {
    if (!selectedDetection) return;

    handleUseAIDetection({
      ...selectedDetection,
      photoName: uploadedImage.name,
      photoPreview: uploadedImage.preview,
    });
  };

  return (
    <section className="aiPage">
      <div className="formIntro">
        <p className="eyebrow">AI road issue detection</p>
        <h3>Detect road problems from a citizen photo.</h3>
        <p>
          This screen represents RoadRakshak&apos;s computer vision layer. Later we will
          connect it to a trained model for potholes, cracks, waterlogging, open manholes,
          garbage, and road obstructions.
        </p>
      </div>

      <div className="aiGrid">
        <div className="sectionBlock">
          <div className="sectionHeader">
            <div>
              <p>Image scan</p>
              <h3>Upload road image</h3>
            </div>
            <Camera size={20} />
          </div>

          <label className="aiUpload">
            <Upload size={32} />
            <strong>Choose a road photo</strong>
            <span>AI model connection will be added after backend setup</span>
            {uploadedImage.name && <small>{uploadedImage.name}</small>}
            <input type="file" accept="image/*" onChange={handleAIUpload} />
          </label>

          {uploadedImage.preview && (
            <img className="aiPreviewImage" src={uploadedImage.preview} alt="Road scan" />
          )}

          <div className="scanPanel">
            <BrainCircuit size={24} />
            <div>
              <strong>Detection engine</strong>
              <span>{scanStatus}</span>
            </div>
          </div>

          {selectedDetection && (
            <button className="primaryButton useDetectionButton" onClick={handleUseResult}>
              <CheckCircle2 size={18} />
              Use this in New Report
            </button>
          )}
        </div>

        <aside className="sectionBlock">
          <div className="sectionHeader">
            <div>
              <p>Detection output</p>
              <h3>Predicted issues</h3>
            </div>
            <Gauge size={20} />
          </div>

          <div className="detectionList">
            {detections.map((item) => (
              <div
                className={`detectionItem ${
                  selectedDetection?.label === item.label ? "selected" : ""
                }`}
                key={item.label}
                onClick={() => setSelectedDetection(item)}
              >
                <div className="detectionTop">
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.action}</span>
                  </div>
                  <CheckCircle2 size={20} />
                </div>

                <div className="confidenceBar">
                  <div style={{ width: item.confidence }}></div>
                </div>

                <div className="detectionMeta">
                  <span>Confidence: {item.confidence}</span>
                  <span>Severity: {item.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="sectionBlock">
        <div className="sectionHeader">
          <div>
            <p>Supported classes</p>
            <h3>RoadRakshak detection categories</h3>
          </div>
          <BrainCircuit size={20} />
        </div>

        <div className="classGrid">
          <span>Potholes</span>
          <span>Road cracks</span>
          <span>Broken road surface</span>
          <span>Waterlogging</span>
          <span>Open manholes</span>
          <span>Garbage or obstruction</span>
          <span>Damaged dividers</span>
          <span>Missing signs</span>
        </div>
      </div>
    </section>
  );
}

export default AIDetection;