import mongoose from "mongoose";
import User from "../models/User.js";
import FinancialProfile from "../models/FinancialProfile.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Script de migration : Lier les profils financiers existants aux utilisateurs
 * À exécuter une seule fois après le déploiement
 */

async function migrateFinancialProfiles() {
  try {
    console.log("🚀 Démarrage de la migration des profils financiers...");

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connexion MongoDB établie");

    // Trouver tous les profils financiers
    const profiles = await FinancialProfile.find();
    console.log(`📊 ${profiles.length} profils financiers trouvés`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const profile of profiles) {
      try {
        // Mettre à jour l'utilisateur avec la référence au profil
        const user = await User.findByIdAndUpdate(
          profile.user,
          { financialProfile: profile._id },
          { new: true }
        );

        if (user) {
          updated++;
          console.log(`✅ Utilisateur ${user.email} mis à jour`);
        } else {
          skipped++;
          console.log(`⚠️  Utilisateur non trouvé pour profil ${profile._id}`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Erreur pour profil ${profile._id}: ${error.message}`);
      }
    }

    console.log("\n📈 Résumé de la migration:");
    console.log(`✅ Utilisateurs mis à jour: ${updated}`);
    console.log(`⚠️  Utilisateurs ignorés: ${skipped}`);
    console.log(`❌ Erreurs: ${errors}`);

    // Vérifier les utilisateurs sans profil
    const usersWithoutProfile = await User.countDocuments({
      financialProfile: null,
    });
    console.log(
      `\n📋 Utilisateurs sans profil financier: ${usersWithoutProfile}`
    );

    // Vérifier les utilisateurs avec profil
    const usersWithProfile = await User.countDocuments({
      financialProfile: { $ne: null },
    });
    console.log(`📋 Utilisateurs avec profil financier: ${usersWithProfile}`);

    await mongoose.connection.close();
    console.log("\n✅ Migration terminée avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error.message);
    process.exit(1);
  }
}

migrateFinancialProfiles();
