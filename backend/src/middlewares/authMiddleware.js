import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {
    try {
     
        const token = req.headers.authorization?.split(" ")[1]; 
        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

    
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyToken) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = verifyToken;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token | [NOT AUTHENTICATED]" });
    }
};

export const authorization = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: You are not allowed to do this operation" });
        }
        next();
    };
};
