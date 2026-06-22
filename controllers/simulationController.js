/* import Simulation from "../models/Simulation.js";

export const createSimulation = async (req, res) => {
  try {
    const { name, parameters, scenarioType } = req.body;

    // Logic to calculate results based on parameters
    const { initialAmount, monthlyContribution, annualReturnRate, durationMonths } = parameters;

    let totalInvested = initialAmount + (monthlyContribution * durationMonths);
    let finalBalance = initialAmount;
    const monthlyRate = annualReturnRate / 100 / 12;
    const yearlyBreakdown = [];

    for (let m = 1; m <= durationMonths; m++) {
      finalBalance = (finalBalance + monthlyContribution) * (1 + monthlyRate);
      if (m % 12 === 0) {
        yearlyBreakdown.push({
          year: m / 12,
          balance: Math.round(finalBalance),
          interest: Math.round(finalBalance - (initialAmount + monthlyContribution * m)),
        });
      }
    }

    const results = {
      totalInvested,
      finalBalance: Math.round(finalBalance),
      totalInterest: Math.round(finalBalance - totalInvested),
      yearlyBreakdown,
    };

    const simulation = await Simulation.create({
      user: req.user._id,
      name,
      parameters,
      results,
      scenarioType,
    });

    res.status(201).json({
      success: true,
      data: { simulation },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMySimulations = async (req, res) => {
  try {
    const simulations = await Simulation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: { simulations },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSimulation = async (req, res) => {
  try {
    const simulation = await Simulation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!simulation) {
      return res.status(404).json({ success: false, message: "Simulation introuvable" });
    }
    res.status(200).json({ success: true, message: "Simulation supprimée" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
 */

import Simulation from "../models/Simulation.js";

const SCENARIO_MULTIPLIERS = {
  prudent: 0.7,
  realistic: 1,
  optimistic: 1.3,
};

const MAX_DURATION_MONTHS = 600; // 50 ans, garde-fou raisonnable

export const createSimulation = async (req, res) => {
  try {
    const { name, parameters, scenarioType } = req.body;

    if (!parameters) {
      return res.status(400).json({ success: false, message: "Paramètres manquants" });
    }

    const { initialAmount, monthlyContribution, annualReturnRate, durationMonths } = parameters;

    // --- Validation des entrées ---
    if (
      initialAmount == null || initialAmount < 0 ||
      monthlyContribution == null || monthlyContribution < 0 ||
      annualReturnRate == null ||
      !durationMonths || durationMonths < 1 || durationMonths > MAX_DURATION_MONTHS
    ) {
      return res.status(400).json({ success: false, message: "Paramètres invalides" });
    }

    if (!["prudent", "realistic", "optimistic"].includes(scenarioType)) {
      return res.status(400).json({ success: false, message: "Scénario invalide" });
    }

    // --- Calcul ---
    const adjustedRate = annualReturnRate * SCENARIO_MULTIPLIERS[scenarioType];
    const monthlyRate = adjustedRate / 100 / 12;

    let totalInvested = initialAmount + monthlyContribution * durationMonths;
    let finalBalance = initialAmount;
    const yearlyBreakdown = [];

    for (let m = 1; m <= durationMonths; m++) {
      finalBalance = (finalBalance + monthlyContribution) * (1 + monthlyRate);

      // On ajoute un point chaque année pleine ET au dernier mois (même partiel)
      if (m % 12 === 0 || m === durationMonths) {
        yearlyBreakdown.push({
          year: Math.ceil(m / 12),
          balance: Math.round(finalBalance),
          interest: Math.round(finalBalance - (initialAmount + monthlyContribution * m)),
        });
      }
    }

    const results = {
      totalInvested: Math.round(totalInvested),
      finalBalance: Math.round(finalBalance),
      totalInterest: Math.round(finalBalance - totalInvested),
      yearlyBreakdown,
    };

    const simulation = await Simulation.create({
      user: req.user._id,
      name,
      parameters,
      results,
      scenarioType,
    });

    res.status(201).json({
      success: true,
      data: { simulation },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMySimulations = async (req, res) => {
  try {
    const simulations = await Simulation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: { simulations },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSimulation = async (req, res) => {
  try {
    const simulation = await Simulation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!simulation) {
      return res.status(404).json({ success: false, message: "Simulation introuvable" });
    }
    res.status(200).json({ success: true, message: "Simulation supprimée" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

