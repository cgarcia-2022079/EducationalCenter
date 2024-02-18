import mongoose from 'mongoose'

const teacherSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "TEACHER_ROLE" },
    assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
})

export default mongoose.model('Teacher', teacherSchema)