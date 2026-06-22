import mongoose from "mongoose";

const simulationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    parameters: {
      initialAmount: { type: Number, default: 0 },
      monthlyContribution: { type: Number, default: 0 },
      annualReturnRate: { type: Number, default: 0 },
      durationMonths: { type: Number, default: 12 },
      inflationRate: { type: Number, default: 0 },
    },
    results: {
      totalInvested: Number,
      finalBalance: Number,
      totalInterest: Number,
      yearlyBreakdown: [
        {
          year: Number,
          balance: Number,
          interest: Number,
        },
      ],
    },
    scenarioType: {
      type: String,
      enum: ["optimistic", "realistic", "prudent"],
      default: "realistic",
    },
  },
  { timestamps: true }
);

const Simulation = mongoose.model("Simulation", simulationSchema);
export default Simulation;
