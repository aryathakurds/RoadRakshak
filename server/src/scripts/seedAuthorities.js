const dns = require("node:dns");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Authority = require("../models/Authority");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const verifiedDate = new Date("2026-06-21");

const authorities = [
  {
    name: "National Highways Authority of India",
    shortName: "NHAI",
    level: "National",
    type: "NHAI",
    state: "",
    district: "",
    city: "",
    localBody: "",
    jurisdiction:
      "National highways and infrastructure managed by NHAI across India.",
    roadTypes: [
      "National Highway",
      "Expressway",
    ],
    departments: [
      "Highway Operations",
      "Highway Maintenance",
    ],
    officialWebsite: "https://nhai.gov.in/",
    complaintUrl: "https://nhai.gov.in/",
    helpline: "1033",
    email: "",
    sourceUrl: "https://nhai.gov.in/",
    verificationStatus: "Partially verified",
    lastVerifiedAt: verifiedDate,
    isActive: true,
  },

  {
    name: "Brihanmumbai Municipal Corporation",
    shortName: "BMC",
    level: "Municipal",
    type: "Municipal Corporation",
    state: "Maharashtra",
    district: "Mumbai City",
    city: "Mumbai",
    localBody: "Brihanmumbai Municipal Corporation",
    jurisdiction:
      "Municipal roads and civic infrastructure within Brihanmumbai Municipal Corporation limits.",
    roadTypes: [
      "Municipal Road",
      "Ward Road",
      "Local Road",
    ],
    departments: [
      "Roads Department",
      "Ward Office",
    ],
    officialWebsite: "https://portal.mcgm.gov.in/",
    complaintUrl: "https://marg.mcgm.gov.in/",
    helpline: "1916",
    email: "",
    sourceUrl: "https://portal.mcgm.gov.in/",
    verificationStatus: "Verified",
    lastVerifiedAt: verifiedDate,
    isActive: true,
  },

  {
    name: "Municipal Corporation of Delhi",
    shortName: "MCD",
    level: "Municipal",
    type: "Municipal Corporation",
    state: "Delhi",
    district: "Delhi",
    city: "Delhi",
    localBody: "Municipal Corporation of Delhi",
    jurisdiction:
      "Municipal roads and civic infrastructure under Municipal Corporation of Delhi jurisdiction.",
    roadTypes: [
      "Municipal Road",
      "Ward Road",
      "Local Road",
    ],
    departments: [
      "Engineering Department",
      "Road Maintenance",
      "Zonal Office",
    ],
    officialWebsite: "https://mcdonline.nic.in/",
    complaintUrl: "https://mcdonline.nic.in/",
    helpline: "",
    email: "",
    sourceUrl: "https://mcdonline.nic.in/",
    verificationStatus: "Partially verified",
    lastVerifiedAt: verifiedDate,
    isActive: true,
  },

  {
    name: "Greater Bengaluru Authority",
    shortName: "GBA",
    level: "Development Authority",
    type: "Development Authority",
    state: "Karnataka",
    district: "Bengaluru Urban",
    city: "Bengaluru",
    localBody: "Greater Bengaluru Authority",
    jurisdiction:
      "Metropolitan coordination and oversight across the Greater Bengaluru Area.",
    roadTypes: [
      "Municipal Road",
      "Metropolitan Road",
      "Ward Road",
    ],
    departments: [
      "Urban Infrastructure Coordination",
      "City Corporation Coordination",
    ],
    officialWebsite: "https://gba.karnataka.gov.in/",
    complaintUrl: "https://gba.karnataka.gov.in/",
    helpline: "1533",
    email: "",
    sourceUrl: "https://gba.karnataka.gov.in/",
    verificationStatus: "Partially verified",
    lastVerifiedAt: verifiedDate,
    isActive: true,
  },
];

const seedAuthorities = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing from the .env file"
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas connected");

    for (const authority of authorities) {
      await Authority.findOneAndUpdate(
        {
          name: authority.name,
        },
        authority,
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log(
      `${authorities.length} official authorities seeded`
    );
  } catch (error) {
    console.error(
      "Unable to seed authorities:",
      error.message
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAuthorities();