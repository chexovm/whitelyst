import express from "express";
const router = express.Router();
import {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";
import checkPermissions from "../middlewares/checkPermissions.js";

// Create a new application
router.post("/", createApplication, () => {
  console.log("created app");
});

// Get all applications of a specific type with a specific status
router.get("/:status/:type", checkPermissions, getApplications);

// Update a specific application by ID (reviewing admins only)
router.put("/update/:id", checkPermissions, updateApplication);

// Delete a specific application by ID
router.delete("/:id", checkPermissions, deleteApplication);

export default router;
