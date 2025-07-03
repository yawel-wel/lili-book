export async function processImage({ file, rotation, crop, contrast }) {
  const formData = new FormData();
  formData.append("image", file);

  if (rotation) formData.append("rotation", rotation);
  if (contrast) formData.append("contrast", contrast);
  if (crop) {
    formData.append("cropX", crop.x);
    formData.append("cropY", crop.y);
    formData.append("cropWidth", crop.width);
    formData.append("cropHeight", crop.height);
  }

  const res = await fetch("http://localhost:4000/process", {
    method: "POST",
    body: formData,
  });

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
