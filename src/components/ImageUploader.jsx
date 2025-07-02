import { useRef } from "react";

export default function ImageUploader({
  currentImages = [],
  onImagesSelected,
}) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);

    const newPreviews = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    // Merge with existing images
    onImagesSelected([...currentImages, ...newPreviews]);
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        ref={inputRef}
      />
    </div>
  );
}
