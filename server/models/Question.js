import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  text: [String],
  type: { type: String, unique: true },
});

export default mongoose.model("Question", QuestionSchema);
