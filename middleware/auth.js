const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const token = req.cookies?.LLMAuth; // read from cookie
  if (!token)
    return res.status(401).json({ message: "Missing or invalid token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};
