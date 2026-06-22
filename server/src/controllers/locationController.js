const Location = require("../models/Location");

const searchLocations = async (request, response) => {
  try {
    const query = String(request.query.q || "").trim();

    if (query.length < 2) {
      return response.status(400).json({
        success: false,
        message: "Enter at least 2 characters",
      });
    }

    const pattern = new RegExp(query, "i");

    const locations = await Location.find({
      $or: [
        { state: pattern },
        { district: pattern },
        { city: pattern },
        { locality: pattern },
        { pincode: pattern },
      ],
    }).limit(20);

    response.json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLocations = async (request, response) => {
  try {
    const locations = await Location.find().sort({
      state: 1,
      city: 1,
    });

    response.json({
      success: true,
      count: locations.length,
      locations,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createLocation = async (request, response) => {
  try {
    const location = await Location.create(request.body);

    response.status(201).json({
      success: true,
      message: "Location created",
      location,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  searchLocations,
  getLocations,
  createLocation,
};