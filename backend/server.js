const express = require("express");
const multer = require("multer");
const Jimp = require("jimp");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());

// Store uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;

    const image = await Jimp.read(imageBuffer);
    image.greyscale(); // convert to black and white

    const processedBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    res.set("Content-Type", "image/jpeg");
    res.send(processedBuffer);
  } catch (error) {
    console.error("Image processing error:", error);
    res.status(500).send("Failed to process image");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
