export const getAuthorityMatch = (location) => {
  const value = location.toLowerCase();

  if (value.includes("mumbai") || value.includes("andheri")) {
    return {
      name: "Brihanmumbai Municipal Corporation",
      department: "Roads and Traffic / Ward Office",
      channel: "Municipal complaint portal, ward office, or civic helpline",
      confidence: "High",
    };
  }

  if (value.includes("bengaluru") || value.includes("bangalore")) {
    return {
      name: "Bruhat Bengaluru Mahanagara Palike",
      department: "Road Infrastructure Department",
      channel: "BBMP complaint portal or ward office",
      confidence: "High",
    };
  }

  if (value.includes("delhi") || value.includes("karol bagh")) {
    return {
      name: "Municipal Corporation of Delhi",
      department: "Road Maintenance / Local Zone Office",
      channel: "MCD 311 or zonal complaint channel",
      confidence: "High",
    };
  }

  if (value.includes("highway") || value.includes("nh-") || value.includes("nh ")) {
    return {
      name: "National Highways Authority of India",
      department: "Highway maintenance authority",
      channel: "NHAI complaint channel",
      confidence: "Medium",
    };
  }

  if (!value.trim()) {
    return {
      name: "Location needed",
      department: "Enter location or use GPS",
      channel: "Authority route will appear after location is available",
      confidence: "Pending",
    };
  }

  return {
    name: "Likely Municipal / PWD Authority",
    department: "Road maintenance department",
    channel: "City portal, district portal, or public works complaint office",
    confidence: "Medium",
  };
};