import rateLimit from 'express-rate-limit';

// Define the rate limit settings
const raffRateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 5, 
    message: { error: "Too many requests. Please try again later." },
    headers: true, 
});


export default raffRateLimiter;
