const Authority = require(
  "../models/Authority"
);

const escapeRegex = (value) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

const resolveAuthority = async (
  request,
  response,
  next
) => {
  try {
    const authorityId = String(
      request.body.authorityId || ""
    ).trim();

    const authorityName = String(
      request.body.authority || ""
    ).trim();

    let authority = null;

    if (authorityId) {
      authority =
        await Authority.findOne({
          _id: authorityId,
          isActive: true,
        });
    }

    if (
      !authority &&
      authorityName
    ) {
      authority =
        await Authority.findOne({
          name: {
            $regex: `^${escapeRegex(
              authorityName
            )}$`,
            $options: "i",
          },
          isActive: true,
        });
    }

    if (authority) {
      request.body.authorityId =
        authority._id.toString();

      request.body.authority =
        authority.name;

      request.body
        .complaintPortalUrl =
        authority.complaintUrl ||
        authority.officialWebsite ||
        "";

      if (authority.complaintUrl) {
        request.body.channel =
          "Official online complaint portal";
      } else if (
        authority.helpline
      ) {
        request.body.channel =
          `Helpline: ${authority.helpline}`;
      } else if (
        authority.email
      ) {
        request.body.channel =
          `Email: ${authority.email}`;
      } else {
        request.body.channel =
          "Official authority website";
      }
    }

    next();
  } catch (error) {
    response.status(500).json({
      success: false,
      message:
        "Unable to match the report authority",
    });
  }
};

module.exports = resolveAuthority;