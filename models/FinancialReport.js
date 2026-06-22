import mongoose from "mongoose";

const financialReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    period: {
      type: String,
      enum: ["weekly", "monthly"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    content: {
      type: String, // The AI generated text
      required: true,
    },
    summary: {
      totalIncome: Number,
      totalExpense: Number,
      savingsRate: Number,
      topCategories: [
        {
          name: String,
          amount: Number,
        },
      ],
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    aiAlerts: [
      {
        type: String,
        message: String,
        severity: { type: String, enum: ["low", "medium", "high"] },
      },
    ],
  },
  { timestamps: true }
);

const FinancialReport = mongoose.model("FinancialReport", financialReportSchema);
export default FinancialReport;
