import express from "express";
const router = express.Router();
import Question from "../models/Question.js";
import logRequest from "../middlewares/logRequests.js";
import checkAuth from "../middlewares/checkAuth.js";

// get questions based on appType stored in the user session (for application form). if appType is "adminpanel", respond with "adminpanel" text
router.get("/", logRequest, checkAuth, async (req, res) => {
  const appType = req.session.passport.user.appType || "Whitelist";
  if (appType === "adminpanel") {
    res.send("adminpanel");
  } else if (appType === false) {
    console.error("appType is false");
  } else {
    try {
      const questions = await Question.findOne({ type: appType });
      res.json(questions.text);
    } catch (err) {
      console.error("GET Questions Error:", err);
    }
  }
});

// SUGGESTION: Add question management as features on client request
// get all questions of any type for admin panel
router.get("/all", async (req, res) => {
  try {
    const questions = await Question.find({});
    res.json(questions);
  } catch (err) {
    console.error(err);
  }
});

// create a new question
router.post("/add", async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.json(question);
  } catch (err) {
    console.error(err);
  }
});

// update a specific question
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
    }); // 'new: true' returns the updated document
    res.json(question);
  } catch (err) {
    console.error(err);
  }
});

// delete questions by their id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);
    res.json(question);
  } catch (err) {
    console.error(err);
  }
});

export default router;
