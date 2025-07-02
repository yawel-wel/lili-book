import { useState } from "react";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ImageUploader from "./components/ImageUploader";

export default function App() {
  const [started, setStarted] = useState(false);
  const [images, setImages] = useState([]);

  const handleStartOver = () => {
    setImages([]);
    setStarted(false);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {!started ? (
        <div className="flex flex-col items-center justify-center text-center px-6 py-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Create a Personalized Black & White Cloth Book for Your Newborn
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-600 max-w-xl text-lg mb-8"
          >
            Upload your favorite photos and turn them into a soft, high-contrast
            book that your baby will love to look at. Safe, sensory-friendly,
            and 100% unique.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => setStarted(true)}
              endIcon={<ArrowRight />}
            >
              Start Creating
            </Button>
          </motion.div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upload Images</h2>
          <ImageUploader currentImages={images} onImagesSelected={setImages} />

          {images.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="border rounded shadow overflow-hidden"
                  >
                    <img
                      src={img.previewUrl}
                      alt={`Preview ${index}`}
                      className="w-full object-contain"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-4">
                <Button variant="outlined" onClick={handleStartOver}>
                  Start Over
                </Button>
                <Button variant="contained" color="primary">
                  Continue to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
