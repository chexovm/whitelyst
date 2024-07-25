import Application from "../models/Application.js";
import dotenv from "dotenv";
import {
  assignRole,
  sendMessageDM,
  sendMessageToChannel,
} from "../helpers/discordHelpers.js";
dotenv.config();

// Create a new application
export const createApplication = async (req, res) => {
  try {
    const { discordId, discordUsername, isSupporter } = req.user;
    const qAndA = req.body;

    const newApp = new Application({
      discordId,
      discordUsername,
      status: "Pending",
      type: req.session.passport.user.appType,
      qAndA,
      isSupporter,
    });

    const savedApp = await newApp.save();

    // Send a DM to the user
    await sendMessageDM(
      discordId,
      `Thank you, your ${newApp.type} application has been submitted! You will be notified once it has been reviewed.`
    );

    // Get the channel ID based on the application type
    let channelId;
    if (newApp.type === "Whitelist") {
      channelId = process.env.DISCORD_WLAPP_NEW_CHANNEL_ID;
    } else if (newApp.type === "Staff") {
      channelId = process.env.DISCORD_STAFFAPP_NEW_CHANNEL_ID;
    }

    //Send a notification message to the specific logging channel
    await sendMessageToChannel(
      channelId,
      `**Username:** ${discordUsername} | **Discord ID:** ${discordId} | A new ${newApp.type} application has been submitted. **Supporter: ${newApp.isSupporter}**`
    );

    res.status(201).json(savedApp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get applications by type and status with pagination. If status is not "Pending", it means "Approved" or "Denied"
export const getApplications = async (req, res) => {
  try {
    const type = req.params.type;
    let status = req.params.status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    if (status !== "Pending") {
      status = ["Approved", "Denied"];
    }

    const searchQuery = search
      ? {
          $or: [
            { discordId: { $regex: search, $options: "i" } },
            { discordUsername: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const applications = await Application.find({
      type: type,
      status: status,
      ...searchQuery,
    })
      .sort({ isSupporter: -1 })
      .skip(skip)
      .limit(limit);

    const docsCount = await Application.find({
      type: type,
      status: status,
      ...searchQuery,
    }).countDocuments();

    const response = { applications, docsCount };
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a specific application's status by ID (reviewing admins only)
export const updateApplication = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;
  try {
    const { status, reviewerUsername, reviewerComment } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status === "Approved" || application.status === "Denied") {
      return res
        .status(400)
        .json({ message: "Application has already been reviewed" });
    }

    application.status = status ?? application.status;
    application.reviewerComment =
      reviewerComment ?? application.reviewerComment;
    application.reviewerUsername = reviewerUsername;

    await application.save();

    // Send a direct message to the user
    if (application.discordId) {
      let message = `Your ${application.type} application has been ${status}. `;
      if (status === "Approved") {
        message += "Check your roles and I hope you enjoy the server!";
      } else if (status === "Denied") {
        message += `Reason: ${reviewerComment}`;
      }
      // Send a DM to the user
      await sendMessageDM(application.discordId, message);
    }

    // Get the channel ID based on the application type
    let channelId;
    if (application.type === "Whitelist") {
      channelId = process.env.DISCORD_WLAPP_LOG_CHANNEL_ID;
    } else if (application.type === "Staff") {
      channelId = process.env.DISCORD_STAFFAPP_LOG_CHANNEL_ID;
    }
    // Send a notification message to the specific channel
    await sendMessageToChannel(
      channelId,
      `Application from ${application.discordId} (${application.discordUsername}) has been ${status} by ${reviewerUsername}. Comment: ${reviewerComment}`
    );

    // Assign a role to the user if their application is approved
    if (status === "Approved") {
      let roleId;
      if (application.type === "Whitelist") {
        roleId = process.env.DISCORD_WHITELIST_ROLE_ID;
      } else if (application.type === "Staff") {
        roleId = process.env.DISCORD_SUPPORTSTAFF_ROLE_ID;
      }
      if (roleId) {
        await assignRole(
          process.env.DISCORD_GUILD_ID,
          application.discordId,
          roleId
        );
      }
    }

    // searches the database for the same
    const updatedApplications = await Application.find({
      type: application.type,
      status: "Pending",
    })
      .sort({ isSupporter: -1 })
      .skip(skip)
      .limit(limit);

    res.json(updatedApplications);

    // return a list of 50 (maximum) "Pending" applications of the same type
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a specific application by ID
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
