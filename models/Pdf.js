import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Le titre est obligatoire."],
    trim: true,
  },
  pdfUrl: {
    type: String,
    required: [true, "L'URL du PDF est obligatoire."],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Pdf = mongoose.model("Pdf", pdfSchema);
export default Pdf;
