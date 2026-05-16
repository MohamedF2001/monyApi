import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import { seedDefaultCategories } from "../services/defaultCategoryService.js";

const run = async () => {
  await connectDB();

  const result = await seedDefaultCategories();

  console.log(
    `Seed termine: ${result.created} categories creees, ${result.existing} deja presentes.`
  );
};

run()
  .catch((error) => {
    console.error(`Erreur seed categories: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
