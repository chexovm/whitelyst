import dotenv from "dotenv";
dotenv.config();
import Application from "../models/Application.js";

const handleDiscordCallback = async (req, res) => {
  try {
    if (!req.user.isMember) {
      res.redirect(`${process.env.FRONTEND_URL}/not-in-discord`);
      return;
    }

    if (req.session.passport.user.appType === "adminpanel") {
      // Handle admin panel authentication
      const requiredRoles = [
        process.env.DISCORD_SUPPORTSTAFF_ROLE_ID,
        process.env.DISCORD_STAFF_ROLE_ID,
        process.env.DISCORD_MANAGEMENT_ROLE_ID,
      ];
      const isAdmin = !!req.user.guildRoles?.some((role) =>
        requiredRoles.includes(role)
      );

      if (!isAdmin) {
        res.redirect(`${process.env.FRONTEND_URL}/error?message=Unauthorized`);
        return;
      } else {
        // Redirect the user to the admin panel
        res.redirect(`${process.env.FRONTEND_URL}/adminpanel`);
        return;
      }
    } else {
      // redirect to /thank-you if the user is already whitelisted or has applied for the same type of application
      const applications = await Application.find({
        discordId: req.user.discordId,
        type: req.session.passport.user.appType,
        status: "Pending",
      });

      // check if the user has already applied for the same type of application
      const isActiveApplication = !!applications.some(
        (app) =>
          app.type.toLowerCase() ===
          req.session.passport.user.appType.toLowerCase()
      );

      if (isActiveApplication) {
        res.redirect(`${process.env.FRONTEND_URL}/thank-you`);
        return;
      }

      // dynamic process.env.DISCORD_ROLENAME_ID variable (SUPPORTSTAFF,STAFF,WHITELIST), breaks here if no appType is set

      const roleName = req.session.passport.user.appType.toUpperCase();
      if (!roleName) {
        res.redirect(
          `${process.env.FRONTEND_URL}/error?message=InvalidAppType`
        );
        return;
      }
      const roleNameId = process.env[`DISCORD_${roleName}_ROLE_ID`];

      //check if the user already has the role they are applying for
      if (req.user.guildRoles.includes(roleNameId)) {
        res.redirect(`${process.env.FRONTEND_URL}/thank-you`);
        return;
      }

      // redirect to the application form
      res.redirect(`${process.env.FRONTEND_URL}/application`);
    }
  } catch (error) {
    console.error("Error in discordOAuthController callback:", error);
    res.redirect("/error");
  }
};

export default handleDiscordCallback;
