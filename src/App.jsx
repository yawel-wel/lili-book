import { useState } from "react";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ImageUploader from "./components/ImageUploader";
import SortableImage from "./components/SortableImage";
import CropDialog from "./components/CropDialog";
import ContrastDialog from "./components/ContrastDialog";
import EraserDialog from "./components/EraserDialog";
import { processImage } from "./utils/imageProcessing";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function App() {
  const [started, setStarted] = useState(false);
  const [images, setImages] = useState([]);
  const [cropTarget, setCropTarget] = useState(null);
  const [contrastTarget, setContrastTarget] = useState(null);
  const [eraserTarget, setEraserTarget] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleStartOver = () => {
    setImages([]);
  };

  const handleRemove = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleRotate = (id) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
      )
    );
  };

  const handleReorder = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((i) => i.id === active.id);
    const newIndex = images.findIndex((i) => i.id === over.id);

    setImages((imgs) => arrayMove(imgs, oldIndex, newIndex));
  };

  const handleImagesSelected = (newImages) => {
    const withIds = newImages.map((img) => ({
      ...img,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      rotation: 0,
      crop: null,
      contrast: 140,
      file: img.file,
      previewUrl: img.previewUrl,
    }));
    setImages((prev) => [...prev, ...withIds]);
  };

  const handleOpenCrop = (id) => {
    const img = images.find((i) => i.id === id);
    if (!img) return;
    if (!img.previewUrl && img.file instanceof File) {
      const previewUrl = URL.createObjectURL(img.file);
      setCropTarget({ ...img, previewUrl });
    } else {
      setCropTarget(img);
    }
  };

  const handleApplyCrop = async (id, crop) => {
    const imageToUpdate = images.find((img) => img.id === id);
    if (!imageToUpdate) return;

    const updatedImage = { ...imageToUpdate, crop };
    const newPreviewUrl = await processImage(updatedImage);

    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...updatedImage, previewUrl: newPreviewUrl } : img
      )
    );
    setCropTarget(null);
  };

  const handleOpenContrast = (id) => {
    const img = images.find((i) => i.id === id);
    if (img) setContrastTarget(img);
  };

  const handleApplyContrast = async (id, contrastValue) => {
    const image = images.find((i) => i.id === id);
    const newPreviewUrl = await processImage({
      ...image,
      contrast: contrastValue,
    });

    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? { ...img, contrast: contrastValue, previewUrl: newPreviewUrl }
          : img
      )
    );
    setContrastTarget(null);
  };

  const handlePreviewContrast = async (imageWithContrast) => {
    return await processImage(imageWithContrast);
  };

  const handleOpenEraser = (id) => {
    const img = images.find((i) => i.id === id);
    if (img) setEraserTarget(img);
  };

  const handleApplyErase = (id, newUrl) => {
    setImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, previewUrl: newUrl } : img))
    );
    setEraserTarget(null);
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
          <ImageUploader onImagesSelected={handleImagesSelected} />

          {images.length > 0 && (
            <>
              <DndContext
                collisionDetection={closestCenter}
                sensors={sensors}
                onDragEnd={handleReorder}
              >
                <SortableContext
                  items={images.map((img) => img.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex overflow-x-auto py-6 px-2">
                    {images.map((img, index) => (
                      <SortableImage
                        key={img.id}
                        id={img.id}
                        img={img}
                        index={index}
                        onRemove={handleRemove}
                        total={images.length}
                        rotation={img.rotation}
                        onRotate={handleRotate}
                        onCrop={handleOpenCrop}
                        onContrast={handleOpenContrast}
                        onErase={handleOpenEraser}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

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

      {cropTarget && (
        <CropDialog
          image={cropTarget}
          onCancel={() => setCropTarget(null)}
          onApply={handleApplyCrop}
        />
      )}

      {contrastTarget && (
        <ContrastDialog
          image={contrastTarget}
          onCancel={() => setContrastTarget(null)}
          onApply={handleApplyContrast}
          processPreview={handlePreviewContrast}
        />
      )}

      {eraserTarget && (
        <EraserDialog
          image={eraserTarget}
          onCancel={() => setEraserTarget(null)}
          onApply={handleApplyErase}
        />
      )}
    </div>
  );
}
