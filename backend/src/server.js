import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from 'compression';
import client from "prom-client"
import path from "path";

import { connectDB } from "./lib/db.js";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";
import { verifyApiKey } from "./middleware/verifyAPI.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./routes/project.route.js";
import friendRoutes from "./routes/friend.route.js";
import groupChatRoutes from "./routes/groupchat.route.js";
import videoRoutes from "./routes/videocall.route.js";
import messageRoutes from "./routes/message.route.js";


import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();


const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ register: client.register });

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(compression({
  filter: (req, res) => {
    const contentType = res.getHeader('Content-Type') || '';
    return /json|text|javascript|css|html/.test(contentType);
  }
}));

// app.use(verifyApiKey); // Use API key verification middleware
// app.use(arcjetMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/groupchat", groupChatRoutes);
app.use("/api/videocall", videoRoutes);
app.use("/api/message", messageRoutes);


app.get("/test", async (req, res) => {
  try {
    return res.status(200).json({ message: "API is working fine!" });
  } catch (err) {
    res.status(500).end(err);
  }
});

app.get("/metrics", async (req, res) => {
  try {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.send(metrics);
  } catch (err) {
    res.status(500).end(err);
  }
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.head("/health", (req, res) => {
  res.sendStatus(200);
});




if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  app.get(/^\/(?!health|metrics|api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.use(errorHandler);

// console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
}

export default app
