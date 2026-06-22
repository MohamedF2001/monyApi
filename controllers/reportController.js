import FinancialReport from "../models/FinancialReport.js";
import Transaction from "../models/Transaction.js";
import FinancialProfile from "../models/FinancialProfile.js";
import { analyzeTransactions } from "../services/geminiService.js";

export const generateMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query; // e.g., month=5, year=2024
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // 1. Get user transactions for the period
    const transactions = await Transaction.find({
      user: req.user._id,
      transactionDate: { $gte: startDate, $lte: endDate }
    }).populate('category');

    if (transactions.length === 0) {
      return res.status(400).json({ success: false, message: "Pas assez de données pour générer un bilan." });
    }

    // 2. Get user financial profile
    const profile = await FinancialProfile.findOne({ user: req.user._id });

    // 3. Prepare summary data
    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      topCategories: []
    };

    const categoryTotals = {};
    transactions.forEach(t => {
      if (t.type === 'income') summary.totalIncome += t.amount;
      else {
        summary.totalExpense += t.amount;
        const catName = t.category.name;
        categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
      }
    });

    summary.savingsRate = summary.totalIncome > 0
      ? Math.round(((summary.totalIncome - summary.totalExpense) / summary.totalIncome) * 100)
      : 0;

    summary.topCategories = Object.entries(categoryTotals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // 4. Call AI for analysis
    const aiAnalysis = await analyzeTransactions(transactions, profile);

    // 5. Create report
    const report = await FinancialReport.create({
      user: req.user._id,
      period: "monthly",
      startDate,
      endDate,
      content: aiAnalysis,
      summary,
      score: Math.max(0, Math.min(100, 50 + (summary.savingsRate / 2))) // Basic score logic
    });

    res.status(201).json({
      success: true,
      data: { report }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await FinancialReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: { reports }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
