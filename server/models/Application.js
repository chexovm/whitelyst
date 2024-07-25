import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  discordId: {
    type: String,
    index: true, // Adding indexes to query them later
  },
  discordUsername: {
    type: String,
    index: true,
  },
  status: {
    type: String, // 'Pending', 'Approved', 'Denied'
    index: true,
  },
  type: String, // 'SupportStaff', 'Whitelist', etc. Can be expanded later.
  isSupporter: {
    type: Boolean, // does the user have a supporter role on Discord?
    index: true,
  },
  questionsAndAnswers: [
    {
      question: String,
      answer: String,
    },
  ],
  reviewerUsername: {
    type: String,
    default: "",
    index: true,
  },
  reviewerComment: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  // Other fields go here (if needed)
});

export default mongoose.model("Application", ApplicationSchema);
