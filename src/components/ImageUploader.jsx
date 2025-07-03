import { useRef, useState } from "react";

export default function ImageUploader({ onImagesSelected }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    const previews = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
          const res = await fetch("http://localhost:4000/upload", {
            method: "POST",
            body: formData,
          });

          const blob = await res.blob();
          const previewUrl = URL.createObjectURL(blob);

          return { previewUrl, file };
        } catch (err) {
          console.error("Failed to process image", err);
          return null;
        }
      })
    );

    setUploading(false);
    onImagesSelected(previews.filter(Boolean));
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        multiple
        accept="image/png, image/jpeg"
        onChange={handleChange}
        ref={inputRef}
      />

      {uploading && (
        <p className="text-sm text-gray-500 mt-2">Processing image...</p>
      )}
    </div>
  );
}
