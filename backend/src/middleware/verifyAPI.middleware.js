import { config } from "dotenv";

config();

export const verifyApiKey = (req, res, next) => {
  if(process.env.NODE_ENV==="test"){
    return next()
  }
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ message: "Forbidden - Invalid API Key" });
  }

  next();
}