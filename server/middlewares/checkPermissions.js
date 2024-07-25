import dotenv from "dotenv";
dotenv.config();

const checkPermissions = (req, res, next) => {
  const userRoles = req.session.passport.user.guildRoles;
  const allowedRoles = [
    process.env.DISCORD_SUPPORTSTAFF_ROLE_ID,
    process.env.DISCORD_STAFF_ROLE_ID,
    process.env.DISCORD_MANAGEMENT_ROLE_ID,
  ];

  if (userRoles.some((role) => allowedRoles.includes(role))) {
    next(); // user has the necessary permissions, so proceed to the controller 
  } else {
    res.status(403).json({
      message: "Forbidden: You do not have the necessary permissions.",
    });
  }
};

export default checkPermissions;
