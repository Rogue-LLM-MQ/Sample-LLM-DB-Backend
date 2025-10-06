const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SECRET = process.env.JWT_SECRET;

module.exports.login = async (req, res, db) => {
  try {
    const { username, password } = req.body;

    const admin = await db.collection("admins").findOne({ username });
    if (!admin)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, SECRET, { expiresIn: "1h" });

    // Set JWT in HttpOnly cookie
    res.cookie("LLMAuth", token, {
      httpOnly: true,      // prevents JS access
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "strict",   // CSRF protection
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ message: "Logged in successfully" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
