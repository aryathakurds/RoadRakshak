const dns = require("node:dns");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Location = require("../models/Location");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const locations = [
  {
    state: "Maharashtra",
    district: "Mumbai Suburban",
    city: "Mumbai",
    locality: "Andheri East",
    pincode: "400069",
    localBody: "Brihanmumbai Municipal Corporation",
    authority: "BMC Roads and Traffic Department",
    complaintUrl: "https://portal.mcgm.gov.in",
    latitude: 19.1136,
    longitude: 72.8697,
  },
  {
    state: "Maharashtra",
    district: "Pune",
    city: "Pune",
    locality: "Shivajinagar",
    pincode: "411005",
    localBody: "Pune Municipal Corporation",
    authority: "PMC Road Department",
    complaintUrl: "https://www.pmc.gov.in",
    latitude: 18.5308,
    longitude: 73.8475,
  },
  {
    state: "Karnataka",
    district: "Bengaluru Urban",
    city: "Bengaluru",
    locality: "MG Road",
    pincode: "560001",
    localBody: "Bruhat Bengaluru Mahanagara Palike",
    authority: "BBMP Road Infrastructure Department",
    complaintUrl: "https://site.bbmp.gov.in",
    latitude: 12.9757,
    longitude: 77.6056,
  },
  {
    state: "Delhi",
    district: "Central Delhi",
    city: "New Delhi",
    locality: "Karol Bagh",
    pincode: "110005",
    localBody: "Municipal Corporation of Delhi",
    authority: "MCD Road Maintenance Department",
    complaintUrl: "https://mcdonline.nic.in",
    latitude: 28.6517,
    longitude: 77.1907,
  },
  {
    state: "Telangana",
    district: "Hyderabad",
    city: "Hyderabad",
    locality: "Banjara Hills",
    pincode: "500034",
    localBody: "Greater Hyderabad Municipal Corporation",
    authority: "GHMC Engineering and Road Department",
    complaintUrl: "https://www.ghmc.gov.in",
    latitude: 17.4126,
    longitude: 78.4347,
  },
  {
    state: "Tamil Nadu",
    district: "Chennai",
    city: "Chennai",
    locality: "T Nagar",
    pincode: "600017",
    localBody: "Greater Chennai Corporation",
    authority: "Chennai Corporation Roads Department",
    complaintUrl: "https://chennaicorporation.gov.in",
    latitude: 13.0418,
    longitude: 80.2341,
  },
  {
    state: "West Bengal",
    district: "Kolkata",
    city: "Kolkata",
    locality: "Salt Lake",
    pincode: "700091",
    localBody: "Bidhannagar Municipal Corporation",
    authority: "Municipal Roads Department",
    complaintUrl: "https://www.bmcwbgov.in",
    latitude: 22.5867,
    longitude: 88.4171,
  },
  {
    state: "Madhya Pradesh",
    district: "Indore",
    city: "Indore",
    locality: "Vijay Nagar",
    pincode: "452010",
    localBody: "Indore Municipal Corporation",
    authority: "IMC Road Department",
    complaintUrl: "https://imcindore.mp.gov.in",
    latitude: 22.7533,
    longitude: 75.8937,
  },
  {
    state: "Rajasthan",
    district: "Jaipur",
    city: "Jaipur",
    locality: "Malviya Nagar",
    pincode: "302017",
    localBody: "Jaipur Municipal Corporation",
    authority: "Municipal Roads Department",
    complaintUrl: "https://jaipurmc.org",
    latitude: 26.8543,
    longitude: 75.8116,
  },
  {
    state: "Uttar Pradesh",
    district: "Lucknow",
    city: "Lucknow",
    locality: "Hazratganj",
    pincode: "226001",
    localBody: "Lucknow Municipal Corporation",
    authority: "Municipal Engineering Department",
    complaintUrl: "https://lmc.up.nic.in",
    latitude: 26.8505,
    longitude: 80.9467,
  },
];

const seedLocations = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Atlas connected");

    await Location.deleteMany({});
    await Location.insertMany(locations);

    console.log(`${locations.length} locations added successfully`);
  } catch (error) {
    console.error("Unable to seed locations:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedLocations();