import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Accès refusé. Token manquant.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable. Token invalide.",
      });
    }

    if (
      user.isPremium &&
      user.premiumUntil &&
      user.premiumUntil <= new Date()
    ) {
      user.isPremium = false;
      user.subscriptionType = "none";
      user.premiumUntil = null;
      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expiré. Veuillez vous reconnecter.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Token invalide.",
    });
  }
};

export default verifyToken;
