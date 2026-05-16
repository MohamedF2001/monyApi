import Budget from "../models/Budget.js";
import { findCategoryById } from "../services/defaultCategoryService.js";

const categoryFields = "name type color colorValue iconCodePoint isDefault defaultId";

export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id })
      .populate("category", categoryFields)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: budgets.length,
      data: { budgets },
    });
  } catch (error) {
    console.error("Erreur getBudgets :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBudget = async (req, res) => {
  try {
    const { category, amount, period, startDate, endDate } = req.body;

    if (!category || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "La categorie et le montant sont obligatoires.",
      });
    }

    const categoryExists = await findCategoryById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Categorie introuvable ou non autorisee.",
      });
    }

    const budget = await Budget.create({
      category,
      amount,
      period: period || "monthly",
      startDate: startDate || Date.now(),
      endDate,
      user: req.user._id,
    });
    const populated = await budget.populate("category", categoryFields);

    res.status(201).json({
      success: true,
      message: "Budget cree avec succes.",
      data: { budget: populated },
    });
  } catch (error) {
    console.error("Erreur createBudget :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, period, startDate, endDate, isActive } = req.body;

    if (category) {
      const categoryExists = await findCategoryById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Categorie introuvable ou non autorisee.",
        });
      }
    }

    const updates = {};
    if (category) updates.category = category;
    if (amount !== undefined) updates.amount = amount;
    if (period) updates.period = period;
    if (startDate) updates.startDate = startDate;
    if (endDate !== undefined) updates.endDate = endDate;
    if (isActive !== undefined) updates.isActive = isActive;

    const budget = await Budget.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    ).populate("category", categoryFields);

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget introuvable.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget mis a jour avec succes.",
      data: { budget },
    });
  } catch (error) {
    console.error("Erreur updateBudget :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({ _id: id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget introuvable.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget supprime avec succes.",
    });
  } catch (error) {
    console.error("Erreur deleteBudget :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
