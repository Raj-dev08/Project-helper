import { generateStreamToken } from "../lib/stream.js";
import { videocallQueue } from "../lib/callqueues.js";
import Projects from "../models/project.model.js";

export async function getStreamToken(req, res,next) {
  try {
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}

export const createVideoCallSchedule = async (req, res,next) => {
  try {
    const { user } = req;
    const {roomId, startTime, title } = req.body;

    if(!user) {
      return res.status(401).json({ message: "Unauthorized - no user found" });
    }

    // Validate request data
    if (!roomId || !startTime || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const project = await Projects.findById(roomId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if(project.creator.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to schedule a video call for this project" });
    }

    if(startTime<=0||startTime>1440) {
      return res.status(400).json({ message: "Start time must be between 1 and 1440 minutes (24 hours)" });
    }

    // Add the video call schedule to the queue
    await videocallQueue.add('meeting',{
        roomId,
        title,
    },{
        delay: startTime * 60 * 1000,// Delay the job until the specified start time
        attempts: 3, // Retry up to 3 times in case of failure
        backoff:{
            type: 'fixed',// Using fixed backoff strategy
            delay: 10000 // Retry after 10 seconds
        },
        removeOnComplete: true, // Remove the job from the queue after completion
    })

    res.status(201).json({ message: "Video call scheduled successfully" });
  } catch (error) {
    next(error);
  }
};
