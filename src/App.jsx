import { useState } from "react";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import { ArrowRight, Trash2 } from "lucide-react";
import ImageUploader from "./components/ImageUploader";

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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableImage({ img, id, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="border rounded shadow overflow-hidden relative"
    >
      {/* DRAG HANDLE — only this triggers dragging */}
      <div
        {...listeners}
        className="cursor-move absolute top-1 left-1 bg-white/80 p-1 rounded-full z-10"
        title="Drag to reorder"
      >
        ☰
      </div>

      <div className="aspect-square w-full bg-white flex items-center justify-center overflow-hidden">
        <img
          src={img.previewUrl}
          alt={`Preview ${index}`}
          className="w-full h-full object-contain"
        />
      </div>

      <button
        onClick={() => {
          console.log("Clicked trash for", id);
          onRemove(id);
        }}
        className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100 z-10"
        title="Remove image"
      >
        <Trash2 size={16} className="text-red-500" />
      </button>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [images, setImages] = useState([]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleStartOver = () => {
    setImages([]);
    setStarted(false);
  };

  const handleRemove = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
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
    }));
    setImages((prev) => [...prev, ...withIds]);
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
          <ImageUploader
            currentImages={images}
            onImagesSelected={handleImagesSelected}
          />

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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <SortableImage
                        key={img.id}
                        id={img.id}
                        index={index}
                        img={img}
                        onRemove={handleRemove}
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
    </div>
  );
}
