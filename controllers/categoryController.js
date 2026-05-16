import Category from "../models/Category.js";

const normalizeCategoryType = (type) => {
  if (type === 0 || type === "0" || type === "income") return "income";
  if (type === 1 || type === "1" || type === "expense") return "expense";
  return type;
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [{ user: { $exists: false } }, { user: null }],
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: { categories },
    });
  } catch (error) {
    console.error("❌ Erreur getCategories :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, color, colorValue, iconCodePoint } = req.body;
    const type = normalizeCategoryType(req.body.type);

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: "Le nom et le type de la catégorie sont obligatoires.",
      });
    }

    const existing = await Category.findOne({
      name: name.trim(),
      $or: [{ user: { $exists: false } }, { user: null }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Vous avez déjà une catégorie avec ce nom.",
      });
    }

    const category = await Category.create({
      name,
      type,
      color: color || "#6366f1",
      colorValue,
      iconCodePoint,
    });

    console.log(`📂 Catégorie créée : ${category.name}`);

    res.status(201).json({
      success: true,
      message: "Catégorie créée avec succès.",
      data: { category },
    });
  } catch (error) {
    console.error("❌ Erreur createCategory :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, colorValue, iconCodePoint } = req.body;
    const type = normalizeCategoryType(req.body.type);

    const category = await Category.findOne({
      _id: id,
      $or: [{ user: { $exists: false } }, { user: null }],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie introuvable.",
      });
    }

    if (name && name !== category.name) {
      const existing = await Category.findOne({
        name: name.trim(),
        _id: { $ne: id },
        $or: [{ user: { $exists: false } }, { user: null }],
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Vous avez déjà une catégorie avec ce nom.",
        });
      }
    }

    const updates = {};
    if (name) updates.name = name;
    if (type) updates.type = type;
    if (color) updates.color = color;
    if (colorValue !== undefined) updates.colorValue = colorValue;
    if (iconCodePoint !== undefined) updates.iconCodePoint = iconCodePoint;

    const updated = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    console.log(`✏️ Catégorie mise à jour : ${updated.name}`);

    res.status(200).json({
      success: true,
      message: "Catégorie mise à jour avec succès.",
      data: { category: updated },
    });
  } catch (error) {
    console.error("❌ Erreur updateCategory :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      _id: id,
      $or: [{ user: { $exists: false } }, { user: null }],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Catégorie introuvable.",
      });
    }

    await Category.findByIdAndDelete(id);

    console.log(`🗑️ Catégorie supprimée : ${category.name}`);

    res.status(200).json({
      success: true,
      message: "Catégorie supprimée avec succès.",
    });
  } catch (error) {
    console.error("❌ Erreur deleteCategory :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
