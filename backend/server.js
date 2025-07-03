const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const cors = require("cors");

const app = express();
const PORT = 4000;
const initialContrast = 120;

app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.post("/process", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const { cropX, cropY, cropWidth, cropHeight, rotation, contrast } =
      req.body;

    // Step 1: Start with raw image and rotate
    let image = sharp(imageBuffer).rotate();

    // Step 2: Resize FIRST so frontend crop coordinates match
    image = image.resize(1024, 1024, { fit: "contain", background: "#ffffff" });

    // Step 3: Get resized image metadata
    const meta = await image.metadata();

    // Step 4: Apply crop based on scaled preview coordinates
    const hasCrop =
      cropX &&
      cropY &&
      cropWidth &&
      cropHeight &&
      !isNaN(cropX) &&
      !isNaN(cropY) &&
      !isNaN(cropWidth) &&
      !isNaN(cropHeight);

    if (hasCrop) {
      const x = Math.max(0, Math.floor(Number(cropX)));
      const y = Math.max(0, Math.floor(Number(cropY)));
      const width = Math.min(meta.width - x, Math.floor(Number(cropWidth)));
      const height = Math.min(meta.height - y, Math.floor(Number(cropHeight)));

      if (width > 0 && height > 0) {
        image = image.extract({ left: x, top: y, width, height });
      } else {
        console.warn("⚠️ Skipping crop due to invalid dimensions.");
      }
    }

    // Step 5: Apply optional contrast adjustment
    // if (contrast) {
    //   const c = Number(contrast);
    //   const slope = c / initialContrast;
    //   const intercept = -30 + (slope - 1) * 20;
    //   image = image.linear(slope, intercept);
    // }

    const thresholdValue = Number(contrast) || initialContrast;

    // Step 6: Final output
    const processed = await image
      .greyscale()
      .blur(0.3)
      .threshold(thresholdValue)
      .toFormat("jpeg")
      .toBuffer();

    res.set("Content-Type", "image/jpeg");
    res.send(processed);
  } catch (err) {
    console.error("❌ Image processing error:", err);
    res.status(500).send("Failed to process image.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
