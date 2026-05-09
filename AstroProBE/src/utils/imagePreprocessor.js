// src/utils/imagePreprocessor.js
import sharp from "sharp";
export const preprocessPalmImage = async (buffer) => {
  return await sharp(buffer)
    .resize({ width: 1024, height: 1024, fit: "inside" }) 
    .webp({ quality: 80 }) 
    .toBuffer();
};