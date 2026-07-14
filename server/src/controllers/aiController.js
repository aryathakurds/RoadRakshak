const getGeminiModel = () => {
  return process.env.GEMINI_MODEL || "gemini-3.5-flash";
};

const extractJson = (text) => {
  const cleaned = String(text || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("AI did not return JSON");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
};

const extractOutputText = (data) => {
  if (data?.output_text) {
    return data.output_text;
  }

  const stepOutput = data?.steps
    ?.flatMap((step) => step.content || [])
    ?.find((item) => item.type === "text" && item.text);

  if (stepOutput?.text) {
    return stepOutput.text;
  }

  return "";
};

const callGemini = async (input) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error("Gemini API key is missing in .env");
    error.statusCode = 500;
    throw error;
  }

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/interactions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        model: getGeminiModel(),
        input,
        generation_config: {
          temperature: 0.25,
          thinking_level: "low",
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data?.error?.message || "Gemini API request failed"
    );

    error.statusCode = response.status;
    throw error;
  }

  const text = extractOutputText(data);

  if (!text) {
    throw new Error("Gemini did not return text output");
  }

  return text;
};

const generateRoadReport = async (request, response) => {
  try {
    const {
      issueType,
      issue,
      severity,
      description,
      location,
      authority,
      department,
      channel,
    } = request.body;

    const finalIssue = issueType || issue;

    if (!finalIssue || !location) {
      return response.status(400).json({
        success: false,
        message:
          "Issue type and location are required for AI report generation",
      });
    }

    const prompt = `
You are RoadRakshak AI, a civic road complaint assistant for India.

Create a clear road issue report for a citizen.

Return ONLY valid JSON with these exact keys:
{
  "improvedDescription": "",
  "suggestedSeverity": "",
  "riskSummary": "",
  "suggestedAction": "",
  "complaintLetter": ""
}

Details:
Issue type: ${finalIssue}
Current severity: ${severity || "Medium"}
Location: ${location}
User description: ${description || "No extra description given"}
Responsible authority: ${authority || "Not confirmed"}
Department: ${department || "Road maintenance department"}
Complaint channel: ${channel || "Official civic complaint portal"}

Rules:
- Do not invent fake complaint numbers.
- Do not promise that the issue will be fixed.
- Keep the tone official and practical.
- suggestedSeverity must be only one of: Low, Medium, High, Critical.
`;

    const aiText = await callGemini(prompt);
    const aiReport = extractJson(aiText);

    return response.status(200).json({
      success: true,
      message: "AI report generated successfully",
      aiReport: {
        improvedDescription: aiReport.improvedDescription || "",
        suggestedSeverity: aiReport.suggestedSeverity || severity || "Medium",
        riskSummary: aiReport.riskSummary || "",
        suggestedAction: aiReport.suggestedAction || "",
        complaintLetter: aiReport.complaintLetter || "",
        model: getGeminiModel(),
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("AI report generation error:", error);

    return response.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to generate AI report",
    });
  }
};

const analyzeRoadPhoto = async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).json({
        success: false,
        message: "Road photo is required for AI detection",
      });
    }

    const base64Image = request.file.buffer.toString("base64");

    const prompt = `
You are RoadRakshak Vision AI.

Analyze this uploaded road/public infrastructure photo for India.

Return ONLY valid JSON with these exact keys:
{
  "isRoadIssue": true,
  "issueType": "",
  "confidence": "",
  "severity": "",
  "description": "",
  "riskSummary": "",
  "suggestedAction": "",
  "visibleEvidence": ""
}

Allowed issueType values:
Pothole, Broken road surface, Road crack, Waterlogging, Open manhole, Garbage or obstruction, Damaged divider, Missing road sign, Other road issue

Allowed severity values:
Low, Medium, High, Critical

Rules:
- If the image does not clearly show a road or civic issue, set isRoadIssue to false.
- Do not claim certainty if the image is unclear.
- confidence must be a simple percentage string like "78%".
- Keep the output practical for a citizen complaint.
`;

    const aiText = await callGemini([
      {
        type: "text",
        text: prompt,
      },
      {
        type: "image",
        data: base64Image,
        mime_type: request.file.mimetype,
      },
    ]);

    const analysis = extractJson(aiText);

    return response.status(200).json({
      success: true,
      message: "Road photo analyzed successfully",
      analysis: {
        isRoadIssue: Boolean(analysis.isRoadIssue),
        issueType: analysis.issueType || "Other road issue",
        confidence: analysis.confidence || "Not available",
        severity: analysis.severity || "Medium",
        description: analysis.description || "",
        riskSummary: analysis.riskSummary || "",
        suggestedAction: analysis.suggestedAction || "",
        visibleEvidence: analysis.visibleEvidence || "",
        model: getGeminiModel(),
        analyzedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("AI photo analysis error:", error);

    return response.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to analyze road photo",
    });
  }
};

module.exports = {
  generateRoadReport,
  analyzeRoadPhoto,
};