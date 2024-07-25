import mongoose from "mongoose";
import Question from "../models/Question.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

async function createFakeQuestions() {
  const qGenerator = Array.from({ length: 10 }, (_, i) => `Question ${++i}?`);
  console.log(qGenerator);

  try {
    await Question.insertMany([
      { text: qGenerator, type: "Whitelist" },
      { text: qGenerator, type: "Staff" },
    ]);
    console.log("Sample applications created successfully.");
  } catch (error) {
    console.error("Error creating sample applications:", error);
  } finally {
    mongoose.connection.close();
  }
}

createFakeQuestions();
