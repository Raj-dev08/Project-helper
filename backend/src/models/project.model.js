import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    usedLanguages:{
        type:String,
        required:true
    },
    githubLink:{
        type:String,
        default:""
    },
    image:{
        type:String,
        default:""
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    contributors: [
        {
            contributor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            contributionNumber: {
                type: Number,
                default: 0,
            },
        }
    ],

    issues: [
      {
        raisedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        issueName:{
            type: String,
            required: true
        },
        issueDescription: {
            type: String,
            required: true
        },
        isFixed: {
            type: Boolean,
            default: false
        },
        createdAt:{
            type:Date,
            default:Date.now()
        }
      }
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

projectSchema.index({createdAt:-1});

projectSchema.index({ name: "text", description: "text", usedLanguages: "text", githubLink: "text" });


const Projects = mongoose.model("Projects", projectSchema);



export default Projects;