// import mongoose from "mongoose";

// import Pdf from "../models/Pdf.js";
// import cloudinary from "../config/cloudinary.js";
// import axios from "axios";

// export const uploadPdf = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Aucun fichier PDF fourni.",
//       });
//     }

//     const { title } = req.body;

//     if (!title) {
//       return res.status(400).json({
//         success: false,
//         message: "Le titre est obligatoire.",
//       });
//     }

//     // Convertir le buffer en base64 pour l'upload
//     const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

//     // Upload vers Cloudinary
//     const result = await cloudinary.uploader.upload(fileBase64, {
//       resource_type: "raw",
//       folder: "pdfs",
//       access_mode: "public", // ← ajouter
//       public_id: `${Date.now()}-${title.replace(/\s+/g, "_")}`,
//     });

//     console.log("Résultat Cloudinary :", result);
//     console.log("Cloudinary config:", result.secure_url);
//     console.log("Cloudinary config:", result.public_id);
//     console.log("Cloudinary config:", result.access_mode);
//     console.log("Cloudinary config:", 40);

//     // Créer le PDF dans la base de données
//     const pdf = await Pdf.create({
//       title,
//       pdfUrl: result.secure_url,
//     });
//     console.log("Cloudinary config:", {
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY ? "✓" : "MANQUANT",
//       api_secret: process.env.CLOUDINARY_API_SECRET ? "✓" : "MANQUANT",
//     });

//     res.status(201).json({
//       success: true,
//       message: "PDF uploadé avec succès",
//       data: { pdf },
//     });
//   } catch (error) {
//     console.log("Cloudinary config:", {
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       api_key: process.env.CLOUDINARY_API_KEY ? "✓" : "MANQUANT",
//       api_secret: process.env.CLOUDINARY_API_SECRET ? "✓" : "MANQUANT",
//     });
//     console.error("Erreur uploadPdf :", error.message);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const createPdf = async (req, res) => {
//   try {
//     const { title, pdfUrl } = req.body;

//     if (!title || !pdfUrl) {
//       return res.status(400).json({
//         success: false,
//         message: "Le titre et l'URL du PDF sont obligatoires.",
//       });
//     }

//     const pdf = await Pdf.create({
//       title,
//       pdfUrl,
//     });

//     res.status(201).json({
//       success: true,
//       message: "PDF créé avec succès",
//       data: { pdf },
//     });
//   } catch (error) {
//     console.error("Erreur createPdf :", error.message);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getAllPdfs = async (req, res) => {
//   try {
//     const pdfs = await Pdf.find().sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: "PDF récupérés avec succès",
//       data: { pdfs },
//     });
//   } catch (error) {
//     console.error("Erreur getAllPdfs :", error.message);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getPdfById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "ID du PDF invalide.",
//       });
//     }

//     const pdf = await Pdf.findById(id);

//     if (!pdf) {
//       return res.status(404).json({
//         success: false,
//         message: "PDF introuvable.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "PDF récupéré avec succès",
//       data: { pdf },
//     });
//   } catch (error) {
//     console.error("Erreur getPdfById :", error.message);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const deletePdf = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "ID du PDF invalide.",
//       });
//     }

//     const pdf = await Pdf.findByIdAndDelete(id);

//     if (!pdf) {
//       return res.status(404).json({
//         success: false,
//         message: "PDF introuvable.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "PDF supprimé avec succès",
//       data: { pdf },
//     });
//   } catch (error) {
//     console.error("Erreur deletePdf :", error.message);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* export const downloadPdf = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "ID du PDF invalide.",
//       });
//     }

//     const pdf = await Pdf.findById(id);

//     if (!pdf) {
//       return res.status(404).json({
//         success: false,
//         message: "PDF introuvable.",
//       });
//     }

//     const response = await axios.get(pdf.pdfUrl, {
//       responseType: "arraybuffer",
//     });

//     res.set("Content-Type", "application/pdf");
//     res.set("Content-Disposition", `inline; filename="${pdf.title}.pdf"`);
//     res.send(response.data);
//   } catch (error) {
//     console.error("Erreur downloadPdf :", error.message);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }; */


// // export const downloadPdf = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({ success: false, message: "ID invalide." });
// //     }

// //     const pdf = await Pdf.findById(id);
// //     if (!pdf)
// //       return res
// //         .status(404)
// //         .json({ success: false, message: "PDF introuvable." });

// //     // Télécharger avec auth Cloudinary via Basic Auth
// //     const response = await axios.get(pdf.pdfUrl, {
// //       responseType: "arraybuffer",
// //       /* auth: {
// //         username: process.env.CLOUDINARY_API_KEY,
// //         password: process.env.CLOUDINARY_API_SECRET,
// //       }, */
// //     });

// //     res.set("Content-Type", "application/pdf");
// //     res.set("Content-Disposition", `inline; filename="${pdf.title}.pdf"`);
// //     res.send(response.data);
// //   } catch (error) {
// //     console.error(
// //       "Erreur downloadPdf :",
// //       error.message,
// //       error.response?.status,
// //     );
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };


// // export const downloadPdf = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({ success: false, message: "ID invalide." });
// //     }

// //     const pdf = await Pdf.findById(id);
// //     if (!pdf)
// //       return res
// //         .status(404)
// //         .json({ success: false, message: "PDF introuvable." });

// //     // Extraire le public_id Cloudinary depuis l'URL stockée
// //     // Exemple d'URL : https://res.cloudinary.com/<cloud>/raw/upload/v123456/pdfs/mon_fichier.pdf
// //     const urlParts = pdf.pdfUrl.split("/upload/");
// //     if (urlParts.length < 2) {
// //       return res.status(500).json({ success: false, message: "URL Cloudinary invalide." });
// //     }
// //     // Supprimer le préfixe de version (vXXXXXX/) s'il est présent, puis l'extension
// //     let publicIdWithExt = urlParts[1].replace(/^v\d+\//, ""); // retire "v1781719579/"
// //     const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");   // retire ".pdf"

// //     console.log("[downloadPdf] public_id extrait :", publicId);

// //     // Générer une URL signée temporaire (valide 1 heure) via le SDK Cloudinary
// //     const signedUrl = cloudinary.utils.private_download_url(
// //       publicId,
// //       "pdf",
// //       {
// //         resource_type: "raw",
// //         expires_at: Math.floor(Date.now() / 1000) + 3600,
// //         attachment: false, // inline, pas en téléchargement forcé
// //       }
// //     );

// //     console.log("[downloadPdf] URL signée :", signedUrl);

// //     // Télécharger le PDF via l'URL signée
// //     const response = await axios.get(signedUrl, {
// //       responseType: "arraybuffer",
// //     });

// //     res.set("Content-Type", "application/pdf");
// //     res.set("Content-Disposition", `inline; filename="${pdf.title}.pdf"`);
// //     res.send(response.data);
// //   } catch (error) {
// //     console.error(
// //       "[downloadPdf] Erreur :",
// //       error.message,
// //       error.response?.status,
// //     );
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };


// export const downloadPdf = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: "ID invalide." });
//     }

//     const pdf = await Pdf.findById(id);
//     if (!pdf)
//       return res
//         .status(404)
//         .json({ success: false, message: "PDF introuvable." });

//     // Extraire le public_id Cloudinary depuis l'URL stockée
//     // Ex: https://res.cloudinary.com/<cloud>/raw/upload/v1781719579/pdfs/eiuk4c9todp0utb3d7jr.pdf
//     const urlParts = pdf.pdfUrl.split("/upload/");
//     if (urlParts.length < 2) {
//       return res.status(500).json({ success: false, message: "URL Cloudinary invalide." });
//     }

//     // Retire le préfixe de version (vXXXXXX/) puis l'extension
//     const publicIdWithExt = urlParts[1].replace(/^v\d+\//, ""); // "pdfs/eiuk4c9todp0utb3d7jr.pdf"
//     const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");  // "pdfs/eiuk4c9todp0utb3d7jr"

//     console.log("[downloadPdf] public_id :", publicId);

//     // cloudinary.url() génère une URL de livraison signée sur res.cloudinary.com
//     // (contrairement à private_download_url qui génère une URL api.cloudinary.com → 404)
//     const signedUrl = cloudinary.url(publicId, {
//       resource_type: "raw",
//       type: "upload",
//       sign_url: true,   // ajoute la signature HMAC dans l'URL
//       secure: true,     // https
//       format: "pdf",
//     });

//     console.log("[downloadPdf] URL signée :", signedUrl);

//     // Redirection vers l'URL signée générée par Cloudinary
//     res.redirect(signedUrl);
//   } catch (error) {
//     console.error(
//       "[downloadPdf] Erreur :",
//       error.message,
//       "status:", error.response?.status,
//     );
//     res.status(500).json({ success: false, message: error.message });
//   }
// };



import mongoose from "mongoose";
import Pdf from "../models/Pdf.js";
import cloudinary from "../config/cloudinary.js";
import axios from "axios";

export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucun fichier PDF fourni.",
      });
    }

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Le titre est obligatoire.",
      });
    }

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
      resource_type: "raw",
      folder: "pdfs",
      access_mode: "public",
      // ✅ public_id sans extension → l'URL n'aura pas .pdf
      public_id: `${Date.now()}-${title.replace(/\s+/g, "_")}`,
      // ✅ on indique explicitement le format séparément
      use_filename: true,
      unique_filename: false,
    });

    const pdf = await Pdf.create({
      title,
      pdfUrl: result.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "PDF uploadé avec succès",
      data: { pdf },
    });
  } catch (error) {
    console.error("Erreur uploadPdf :", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createPdf = async (req, res) => {
  try {
    const { title, pdfUrl } = req.body;

    if (!title || !pdfUrl) {
      return res.status(400).json({
        success: false,
        message: "Le titre et l'URL du PDF sont obligatoires.",
      });
    }

    const pdf = await Pdf.create({ title, pdfUrl });

    res.status(201).json({
      success: true,
      message: "PDF créé avec succès",
      data: { pdf },
    });
  } catch (error) {
    console.error("Erreur createPdf :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "PDF récupérés avec succès",
      data: { pdfs },
    });
  } catch (error) {
    console.error("Erreur getAllPdfs :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPdfById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID du PDF invalide.",
      });
    }

    const pdf = await Pdf.findById(id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF introuvable.",
      });
    }

    res.status(200).json({
      success: true,
      message: "PDF récupéré avec succès",
      data: { pdf },
    });
  } catch (error) {
    console.error("Erreur getPdfById :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* export const deletePdf = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID du PDF invalide.",
      });
    }

    const pdf = await Pdf.findByIdAndDelete(id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF introuvable.",
      });
    }

    res.status(200).json({
      success: true,
      message: "PDF supprimé avec succès",
      data: { pdf },
    });
  } catch (error) {
    console.error("Erreur deletePdf :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}; */


export const deletePdf = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID du PDF invalide.",
      });
    }

    const pdf = await Pdf.findById(id);

    if (!pdf) {
      return res.status(404).json({
        success: false,
        message: "PDF introuvable.",
      });
    }

    // ── Extraction du public_id depuis l'URL (même logique que downloadPdf) ──
    const urlParts = pdf.pdfUrl.split("/upload/");
    if (urlParts.length < 2) {
      return res.status(500).json({
        success: false,
        message: "URL Cloudinary invalide, suppression impossible.",
      });
    }

    const withoutVersion = urlParts[1].replace(/^v\d+\//, "");
    const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

    console.log("[deletePdf] public_id à supprimer :", publicId);

    // ── Suppression sur Cloudinary ──
    const cloudinaryResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
      invalidate: true, // purge le cache CDN
    });

    console.log("[deletePdf] Résultat Cloudinary :", cloudinaryResult);

    if (cloudinaryResult.result !== "ok" && cloudinaryResult.result !== "not found") {
      // "not found" = déjà supprimé côté Cloudinary, on continue quand même
      return res.status(500).json({
        success: false,
        message: "Échec de la suppression sur Cloudinary.",
        data: { cloudinaryResult },
      });
    }

    // ── Suppression MongoDB ──
    await Pdf.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "PDF supprimé avec succès (base de données + Cloudinary).",
      data: { pdf },
    });
  } catch (error) {
    console.error("Erreur deletePdf :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const downloadPdf = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID invalide." });
    }

    const pdf = await Pdf.findById(id);
    if (!pdf) {
      return res.status(404).json({ success: false, message: "PDF introuvable." });
    }

    // Extraire le public_id depuis l'URL stockée
    // Ex URL sans ext : .../raw/upload/v1781719579/pdfs/1781461786468-mon_doc
    // Ex URL avec ext : .../raw/upload/v1781719579/pdfs/eiuk4c9todp0utb3d7jr.pdf
    const urlParts = pdf.pdfUrl.split("/upload/");
    if (urlParts.length < 2) {
      return res.status(500).json({ success: false, message: "URL Cloudinary invalide." });
    }

    // Supprimer le préfixe de version (vXXXXXX/) et l'extension éventuelle
    const withoutVersion = urlParts[1].replace(/^v\d+\//, "");
    const publicId = withoutVersion.replace(/\.[^/.]+$/, "");

    console.log("[downloadPdf] public_id :", publicId);

    // Générer l'URL signée — on force format pdf pour les deux cas (avec ou sans ext)
    const signedUrl = cloudinary.url(publicId, {
      resource_type: "raw",
      type: "upload",
      //sign_url: true,
      //secure: true,
      format: "",
    });

    console.log("[downloadPdf] URL signée :", signedUrl);

    // 👇 2. Sécurité supplémentaire : on retire manuellement ".pdf" à la fin si le SDK résiste
    const cleanUrl = signedUrl.replace(/\.pdf$/, "");

    console.log("[downloadPdf] URL finale :", cleanUrl);

    //res.status(200).json({
    //  success: true,
    //  data: { downloadUrl: cleanUrl }, // 👈 On retourne l'URL nettoyée
    //});

    // ✅ Retourner l'URL en JSON plutôt que redirect
    // → Flutter télécharge avec un Dio vierge, sans envoyer le JWT à Cloudinary
    res.status(200).json({
      success: true,
      data: { downloadUrl: cleanUrl },
    });
  } catch (error) {
    console.error("[downloadPdf] Erreur :", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

