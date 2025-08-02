import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from 'compression';

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

app.use(verifyApiKey); // Use API key verification middleware
app.use(arcjetMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/groupchat", groupChatRoutes);
app.use("/api/videocall", videoRoutes);
app.use("/api/message", messageRoutes);



if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
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
