import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de la categorie est obligatoire"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Le type de categorie est obligatoire"],
    },
    defaultId: {
      type: String,
      trim: true,
    },
    iconCodePoint: {
      type: Number,
    },
    colorValue: {
      type: Number,
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1, user: 1 }, { unique: true });
categorySchema.index({ defaultId: 1, user: 1 }, { unique: true, sparse: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
