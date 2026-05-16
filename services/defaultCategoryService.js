import Category from "../models/Category.js";

export const defaultCategories = [
  {
    defaultId: "cat_income_salary",
    name: "Salaire",
    type: "income",
    iconCodePoint: 0xe227,
    colorValue: 0xff10b981,
    color: "#10b981",
  },
  {
    defaultId: "cat_income_investment",
    name: "Investissement",
    type: "income",
    iconCodePoint: 0xe8e5,
    colorValue: 0xff3b82f6,
    color: "#3b82f6",
  },
  {
    defaultId: "cat_income_freelance",
    name: "Freelance",
    type: "income",
    iconCodePoint: 0xe8f9,
    colorValue: 0xff8b5cf6,
    color: "#8b5cf6",
  },
  {
    defaultId: "cat_expense_food",
    name: "Alimentation",
    type: "expense",
    iconCodePoint: 0xe56c,
    colorValue: 0xfff97316,
    color: "#f97316",
  },
  {
    defaultId: "cat_expense_transport",
    name: "Transport",
    type: "expense",
    iconCodePoint: 0xe531,
    colorValue: 0xff06b6d4,
    color: "#06b6d4",
  },
  {
    defaultId: "cat_expense_shopping",
    name: "Shopping",
    type: "expense",
    iconCodePoint: 0xf1cc,
    colorValue: 0xffec4899,
    color: "#ec4899",
  },
  {
    defaultId: "cat_expense_bills",
    name: "Factures",
    type: "expense",
    iconCodePoint: 0xef6e,
    colorValue: 0xffeab308,
    color: "#eab308",
  },
  {
    defaultId: "cat_expense_entertainment",
    name: "Divertissement",
    type: "expense",
    iconCodePoint: 0xe02c,
    colorValue: 0xff6366f1,
    color: "#6366f1",
  },
  {
    defaultId: "cat_expense_health",
    name: "Santé",
    type: "expense",
    iconCodePoint: 0xf109,
    colorValue: 0xffef4444,
    color: "#ef4444",
  },
  {
    defaultId: "cat_expense_education",
    name: "Éducation",
    type: "expense",
    iconCodePoint: 0xe80c,
    colorValue: 0xff14b8a6,
    color: "#14b8a6",
  },
];

export const seedDefaultCategories = async () => {
  const operations = defaultCategories.map((category) => ({
    updateOne: {
      filter: {
        name: category.name,
      },
      update: {
        $set: {
          defaultId: category.defaultId,
          iconCodePoint: category.iconCodePoint,
          colorValue: category.colorValue,
          color: category.color,
          isDefault: true,
        },
        $setOnInsert: {
          name: category.name,
          type: category.type,
        },
        $unset: {
          user: "",
        },
      },
      upsert: true,
    },
  }));

  const result = await Category.bulkWrite(operations, { ordered: false });
  const categories = await Category.find({
    defaultId: { $in: defaultCategories.map((category) => category.defaultId) },
  }).sort({ type: 1, createdAt: 1 });

  return {
    created: result.upsertedCount || 0,
    existing: defaultCategories.length - (result.upsertedCount || 0),
    categories,
  };
};

export const findCategoryById = (categoryId) => {
  return Category.findById(categoryId);
};
