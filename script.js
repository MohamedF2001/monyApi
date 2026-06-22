// script.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'duvpojcuk',
  api_key: '668829291317138',
  api_secret: 'cnN07XPpBL1_PvCy3cf7EcOPBlc',
});

async function makePublic() {
  const { resources } = await cloudinary.search
    .expression('folder:pdfs AND resource_type:raw')
    .max_results(100)
    .execute();

  for (const file of resources) {
    await cloudinary.api.update(file.public_id, {
      resource_type: 'raw',
      access_mode: 'public',
    });
    console.log(`✅ ${file.public_id} → public`);
  }
}

makePublic();