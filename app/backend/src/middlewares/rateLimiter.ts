import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5, 
  message: "Too many requests from this IP, please try again after 10 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
