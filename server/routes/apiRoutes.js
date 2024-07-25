import express from "express";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
import apiController from "../controllers/apiController.js";

// logout route that clears the session
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error logging out");
    } else {
      res.status(200).send("Logged out successfully");
    }
  });
});

// gets the admin info from the session
router.get("/admininfo", (req, res) => {
  if (req.user) {
    apiController.getAccessList(req, res);
  } else {
    res.status(404).send("User info not found in session");
  }
});

export default router;
