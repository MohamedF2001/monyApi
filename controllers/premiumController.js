import User from "../models/User.js";
import PremiumContent from "../models/PremiumContent.js";

export const activatePremium = async (req, res) => {
  try {
    const { type } = req.body; // monthly, yearly, lifetime

    if (!["monthly", "yearly", "lifetime"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type d'abonnement invalide.",
      });
    }

    let durationInDays = 0;
    if (type === "monthly") durationInDays = 30;
    else if (type === "yearly") durationInDays = 365;
    else if (type === "lifetime") durationInDays = 36500; // ~100 years

    const premiumUntil = new Date();
    premiumUntil.setDate(premiumUntil.getDate() + durationInDays);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        isPremium: true,
        subscriptionType: type,
        premiumUntil: type === "lifetime" ? null : premiumUntil,
      },
      { new: true },
    ).populate("financialProfile");

    res.status(200).json({
      success: true,
      message: "Premium activé avec succès !",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPremiumContents = async (req, res) => {
  try {
    const { type, category } = req.query;
    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;

    const contents = await PremiumContent.find(query);
    res.status(200).json({
      success: true,
      data: { contents },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContentById = async (req, res) => {
  try {
    const content = await PremiumContent.findById(req.params.id);
    if (!content) {
      return res
        .status(404)
        .json({ success: false, message: "Contenu introuvable" });
    }

    // Check if user is premium if content is premium
    if (content.isPremium && !req.user.isPremium) {
      return res.status(403).json({
        success: false,
        message: "Ce contenu est réservé aux membres Premium.",
      });
    }

    res.status(200).json({
      success: true,
      data: { content },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
