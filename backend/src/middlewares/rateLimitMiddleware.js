import rateLimit from 'express-rate-limit';

const RateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 10, 
    message: { error: "Too many requests. Please try again later." },
    headers: true, 
});


export default RateLimiter;
