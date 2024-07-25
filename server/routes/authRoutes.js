import express from "express";
const router = express.Router();
import passport from "../config/passport.js";
import handleDiscordCallback from "../controllers/discordAuthController.js";

// Route to initiate Discord OAuth process
router.get("/discord", (req, res, next) => {
  const appType = req.session.appType ? req.session.appType : req.query.type;
  passport.authenticate("discord", { state: appType })(req, res, next);
});

// Route for OAuth callback
router.get(
  "/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/failed" }),
  handleDiscordCallback
);

// Route for OAuth failure
router.get("/failed", (req, res) => {
  res.send("Authentication Failed");
});

// Route for other errors
router.get("/error", (req, res) => {
  res.send("An error occurred");
});

export default router;
