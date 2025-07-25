import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    taskDescription: {
      type: String,
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    status: {
      type: String,
      enum: ["done","pending"],
      default: "pending",
    },
    solvedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    submittedBy:[
      {
        submittedById:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text:{
          type:String,
          default:"",
        },
        image:{
          type:String,
          default:"",
        },
      },
    ]
  },
  { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);
export default Task;