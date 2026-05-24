import FinancialQuestion from "../models/FinancialQuestion.js";
import FinancialProfile from "../models/FinancialProfile.js";
import User from "../models/User.js";
import {
  calculateTraitScores,
  determineProfileType,
  calculateConfidenceScore,
} from "../services/financialProfileService.js";

const allowedProfileTypes = [
  "impulsiveSpender",
  "balancedAware",
  "strategicSaver",
  "overController",
  "financiallyDisorganized",
  "cautiousOptimizer",
];

const saveProfileForUser = async (userId, profileData) => {
  const profile = await FinancialProfile.findOneAndUpdate(
    { user: userId },
    { ...profileData, user: userId },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  // Mettre à jour l'utilisateur avec la référence au profil financier
  await User.findByIdAndUpdate(
    userId,
    { financialProfile: profile._id },
    { new: true }
  );

  return profile;
};

export const getQuestions = async (req, res) => {
  try {
    const questions = await FinancialQuestion.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: { questions } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const calculateAndSaveProfile = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: "Réponses manquantes" });
    }

    const questions = await FinancialQuestion.find();
    const traitScores = calculateTraitScores(answers, questions);
    const profileType = determineProfileType(traitScores);
    const confidenceScore = calculateConfidenceScore(answers, traitScores);

    const profileData = {
      user: req.user._id,
      type: profileType,
      traitScores,
      confidenceScore,
      answers,
    };

    const profile = await saveProfileForUser(req.user._id, profileData);

    res.status(200).json({
      success: true,
      message: "Profil financier enregistré avec succès.",
      data: { profile },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const saveMyProfile = async (req, res) => {
  try {
    const { type, traitScores, confidenceScore, aiFeedback, answers } = req.body;

    if (!type || !allowedProfileTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type de profil financier invalide.",
      });
    }

    if (!traitScores || typeof traitScores !== "object") {
      return res.status(400).json({
        success: false,
        message: "Les scores du profil financier sont obligatoires.",
      });
    }

    const profile = await saveProfileForUser(req.user._id, {
      type,
      traitScores,
      confidenceScore,
      aiFeedback,
      answers: Array.isArray(answers) ? answers : [],
    });

    res.status(200).json({
      success: true,
      message: "Profil financier enregistré avec succès.",
      data: { profile },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    // Récupérer le profil avec les données complètes
    const profile = await FinancialProfile.findOne({ user: req.user._id })
      .populate("user", "firstName lastName email avatar")
      .populate("answers.questionId");

    // Récupérer aussi l'utilisateur avec la référence au profil
    const user = await User.findById(req.user._id)
      .select("firstName lastName email avatar financialProfile")
      .populate("financialProfile");

    res.status(200).json({
      success: true,
      data: { 
        profile: profile || null,
        user
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfileWithDetails = async (req, res) => {
  try {
    // Récupérer le profil financier complet avec toutes les réponses et questions
    const profile = await FinancialProfile.findOne({ user: req.user._id })
      .populate("user", "firstName lastName email avatar")
      .populate({
        path: "answers.questionId",
        model: "FinancialQuestion",
      });

    if (!profile) {
      return res.status(200).json({
        success: true,
        message: "Aucun profil financier trouvé.",
        data: { profile: null }
      });
    }

    // Récupérer l'utilisateur
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: { 
        profile,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          financialProfile: user.financialProfile
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
