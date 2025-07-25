import { Queue } from "bullmq";
import { redis } from "./redis.js";



export const videocallQueue = new Queue("videocall", {
    connection: redis
});