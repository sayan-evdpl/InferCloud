import { ApiError } from "../utils/ApiError.js";

const ipRequests = new Map();

// Simple in-memory rate limiter middleware (e.g., max 100 requests per minute per IP)
export const rateLimiter = (limit = 100, windowMs = 60000) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipRequests.has(ip)) {
      ipRequests.set(ip, []);
    }

    const timestamps = ipRequests.get(ip);
    
    // Filter out timestamps older than the window
    const activeTimestamps = timestamps.filter((timestamp) => now - timestamp < windowMs);
    
    if (activeTimestamps.length >= limit) {
      return next(new ApiError(429, "Too many requests. Please slow down."));
    }

    activeTimestamps.push(now);
    ipRequests.set(ip, activeTimestamps);
    
    next();
  };
};
