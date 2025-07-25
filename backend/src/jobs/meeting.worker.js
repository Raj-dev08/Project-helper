import { Worker } from "bullmq";
import { redis } from "../lib/redis.js";


const meetingWorker = new Worker("videocall", async (job) => {
    const { roomId, title } = job.data;

    // await redis.publish(
    //     "videoCallChannel",
    //     JSON.stringify({roomId,title})
    // )

    //wont work cuz same redis

    console.log(`published notification for ${title}`)
}, {
    connection: redis
});

meetingWorker.on("completed", (job) => {
    console.log(`Job ${job.data.title} completed successfully`);
});

meetingWorker.on("failed", (job, err) => {
    console.error(`Job ${job.data.title} failed with error: ${err.message}`);
});