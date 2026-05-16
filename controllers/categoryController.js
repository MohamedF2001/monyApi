import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({
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
    const { name, icon, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Le nom de la catégorie est obligatoire.",
      });
    }

    const existing = await Category.findOne({
      name: name.trim(),
      user: req.user._id,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Vous avez déjà une catégorie avec ce nom.",
      });
    }

    const category = await Category.create({
      name,
      icon: icon || "📁",
      color: color || "#6366f1",
      user: req.user._id,
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
    const { name, icon, color } = req.body;

    const category = await Category.findOne({
      _id: id,
      user: req.user._id,
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
        user: req.user._id,
        _id: { $ne: id },
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
    if (icon) updates.icon = icon;
    if (color) updates.color = color;

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
      user: req.user._id,
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
