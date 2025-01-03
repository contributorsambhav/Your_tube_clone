import cloudinary from "../Helper/cloudinary.js";
import fs from "fs"; 
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __rootname = path.dirname(__dirname);
const uploadToCloudinary = (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }



  cloudinary.v2.uploader
    .upload(
      file.path,
      {
        resource_type: "video",
        public_id:
          new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname,
        eager: [
          { width: 1920, height: 1080, crop: "scale" },
          { width: 1280, height: 720, crop: "scale" },
          { width: 854, height: 480, crop: "scale" },
          { width: 640, height: 360, crop: "scale" },
        ],
      },
      (error, result) => {
        if (error) {
          console.log(error);
        }

        const transformedUrls = result.eager.map((t) => t.secure_url); 
        console.log("Transformed URLs:", transformedUrls);
      }
    )
    .then((result) => {
      const transformedUrls = result.eager.map((t) => t.secure_url); 
      console.log("Transformed URLs:", transformedUrls);
      console.log("To be updated in database" + transformedUrls);

      req.transformedURLs = transformedUrls;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Error uploading to Cloudinary" });
    });


};



export default uploadToCloudinary;
