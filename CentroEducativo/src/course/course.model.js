import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

export default mongoose.model("Course", courseSchema);