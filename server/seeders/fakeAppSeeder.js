import mongoose from "mongoose";
import Application from "../models/Application.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

function generateUsername(strLen = 5) {
let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < strLen; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// creating 10 q and 10 a
const createSampleApplications = async () => {
  const questionsAndAnswers = Array.from({ length: 10 }, (_, i) => ({
    question: `Question ${i + 1} ` + generateUsername(300) + "?",
    answer: `Answer ${i + 1} ` + generateUsername(300),
  }));

  const applicationTypes = ["Staff", "Whitelist"];
  const applicationStatus = ["Pending", "Approved", "Denied"];
  const reviewerCommentStr = [generateUsername(100), ""];

  try {
    for (let i = 0; i < 50; i++) {
      const application = new Application({
        discordId: "331862067617333248", // my Discord ID as a temp plug
        discordUsername: generateUsername(), // random username
        type: applicationTypes[i % applicationTypes.length],
        status: applicationStatus[i % applicationStatus.length],
        isSupporter: true, //switch this to whichever you want
        questionsAndAnswers,
        reviewerUsername: generateUsername(),
        reviewerComment: reviewerCommentStr[i % reviewerCommentStr.length],
        createdAt: Date.now(),
      });

      await application.save();
    }

    console.log("Sample applications created successfully.");
  } catch (error) {
    console.error("Error creating sample applications:", error);
  } finally {
    mongoose.connection.close();
  }
};

createSampleApplications();
