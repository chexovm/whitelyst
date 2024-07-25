import dotenv from "dotenv";
dotenv.config();

// Get a list of application types that the user's role can review
const getAccessList = async (req, res) => {
  try {
    const { guildRoles } = req.user;
    let accessList = { pending: [], reviewed: [] };

    if (guildRoles.includes(process.env.DISCORD_SUPPORTSTAFF_ROLE_ID)) {
      accessList.pending.push("Whitelist");
    }

    if (guildRoles.includes(process.env.DISCORD_STAFF_ROLE_ID)) {
      accessList = {
        pending: ["Whitelist", "Staff"],
        reviewed: ["Whitelist"],
      };
    }
    if (guildRoles.includes(process.env.DISCORD_MANAGEMENT_ROLE_ID)) {
      accessList = {
        pending: ["Whitelist", "Staff"],
        reviewed: ["Whitelist", "Staff"],
      };
    }

    res.json({
      accessList,
      discordUsername: req.session.passport.user.discordUsername,
      avatar: req.session.passport.user.avatarUrl,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { getAccessList };
