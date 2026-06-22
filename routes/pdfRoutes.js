/* import { Router } from "express";
import multer from "multer";
import {
  createPdf,
  deletePdf,
  getAllPdfs,
  getPdfById,
  uploadPdf,
} from "../controllers/pdfController.js";

const router = Router();

// Configuration de Multer pour le stockage temporaire
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("pdf"), uploadPdf);
router.post("/", createPdf);
router.get("/", getAllPdfs);
router.get("/:id", getPdfById);
router.delete("/:id", deletePdf);

export default router;
 */

import { Router } from "express";
import multer from "multer";
import {
  createPdf,
  deletePdf,
  getAllPdfs,
  getPdfById,
  uploadPdf,
  downloadPdf, // ← ajouter
} from "../controllers/pdfController.js";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("pdf"), uploadPdf);
router.post("/", createPdf);
router.get("/", getAllPdfs);
router.get("/:id/download", downloadPdf); // ← avant /:id pour éviter les conflits
router.get("/:id", getPdfById);
router.delete("/:id", deletePdf);

export default router;
