const Authority = require("../models/Authority");

const buildFilters = (query) => {
  const filters = {
    isActive: true,
  };

  if (query.state) {
    filters.state = new RegExp(
      `^${query.state.trim()}$`,
      "i"
    );
  }

  if (query.district) {
    filters.district = new RegExp(
      `^${query.district.trim()}$`,
      "i"
    );
  }

  if (query.city) {
    filters.city = new RegExp(
      `^${query.city.trim()}$`,
      "i"
    );
  }

  if (query.level) {
    filters.level = query.level;
  }

  if (query.type) {
    filters.type = query.type;
  }

  if (query.verified === "true") {
    filters.verificationStatus = "Verified";
  }

  return filters;
};

const getAuthorities = async (request, response) => {
  try {
    const filters = buildFilters(request.query);
    const search = String(request.query.q || "").trim();

    if (search) {
      const pattern = new RegExp(search, "i");

      filters.$or = [
        { name: pattern },
        { shortName: pattern },
        { state: pattern },
        { district: pattern },
        { city: pattern },
        { localBody: pattern },
      ];
    }

    const authorities = await Authority.find(filters)
      .sort({
        state: 1,
        city: 1,
        name: 1,
      })
      .limit(100);

    response.status(200).json({
      success: true,
      count: authorities.length,
      authorities,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAuthorityById = async (
  request,
  response
) => {
  try {
    const authority = await Authority.findById(
      request.params.id
    );

    if (!authority) {
      return response.status(404).json({
        success: false,
        message: "Authority not found",
      });
    }

    response.status(200).json({
      success: true,
      authority,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: "Invalid authority ID",
    });
  }
};

const matchAuthority = async (
  request,
  response
) => {
  try {
    const state = String(
      request.query.state || ""
    ).trim();

    const district = String(
      request.query.district || ""
    ).trim();

    const city = String(
      request.query.city || ""
    ).trim();

    const roadType = String(
      request.query.roadType || ""
    ).trim();

    if (!state && !district && !city) {
      return response.status(400).json({
        success: false,
        message:
          "State, district or city is required",
      });
    }

    const candidates = await Authority.find({
      isActive: true,
      ...(state && {
        $or: [
          {
            state: new RegExp(
              `^${state}$`,
              "i"
            ),
          },
          {
            level: "National",
          },
        ],
      }),
    });

    const ranked = candidates
      .map((authority) => {
        let score = 0;

        if (
          city &&
          authority.city.toLowerCase() ===
            city.toLowerCase()
        ) {
          score += 50;
        }

        if (
          district &&
          authority.district.toLowerCase() ===
            district.toLowerCase()
        ) {
          score += 30;
        }

        if (
          state &&
          authority.state.toLowerCase() ===
            state.toLowerCase()
        ) {
          score += 20;
        }

        if (
          roadType &&
          authority.roadTypes.some(
            (item) =>
              item.toLowerCase() ===
              roadType.toLowerCase()
          )
        ) {
          score += 40;
        }

        if (
          authority.verificationStatus ===
          "Verified"
        ) {
          score += 10;
        }

        return {
          authority,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((first, second) => {
        return second.score - first.score;
      });

    const bestMatch = ranked[0];

    if (!bestMatch) {
      return response.status(404).json({
        success: false,
        message:
          "No matching authority was found",
        confidence: "Low",
        authority: null,
      });
    }

    const confidence =
      bestMatch.score >= 80
        ? "High"
        : bestMatch.score >= 40
          ? "Medium"
          : "Low";

    response.status(200).json({
      success: true,
      confidence,
      score: bestMatch.score,
      authority: bestMatch.authority,
      alternatives: ranked
        .slice(1, 4)
        .map((item) => item.authority),
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createAuthority = async (
  request,
  response
) => {
  try {
    const authority = await Authority.create(
      request.body
    );

    response.status(201).json({
      success: true,
      message: "Authority created",
      authority,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAuthority = async (
  request,
  response
) => {
  try {
    const authority =
      await Authority.findByIdAndUpdate(
        request.params.id,
        request.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!authority) {
      return response.status(404).json({
        success: false,
        message: "Authority not found",
      });
    }

    response.status(200).json({
      success: true,
      message: "Authority updated",
      authority,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAuthority = async (
  request,
  response
) => {
  try {
    const authority =
      await Authority.findByIdAndUpdate(
        request.params.id,
        {
          isActive: false,
        },
        {
          new: true,
        }
      );

    if (!authority) {
      return response.status(404).json({
        success: false,
        message: "Authority not found",
      });
    }

    response.status(200).json({
      success: true,
      message: "Authority disabled",
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAuthorities,
  getAuthorityById,
  matchAuthority,
  createAuthority,
  updateAuthority,
  deleteAuthority,
};