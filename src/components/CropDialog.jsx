import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";

export default function CropDialog({ image, onCancel, onApply }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleApply = () => {
    onApply(image.id, croppedAreaPixels);
  };
  console.log("** image.previewUrl **", image.previewUrl);
  return (
    <Dialog open fullWidth maxWidth="sm" onClose={onCancel}>
      <DialogContent
        sx={{ position: "relative", height: 400, backgroundColor: "#000" }}
      >
        {!image?.previewUrl && (
          <p className="text-white text-sm absolute top-2 left-2">
            No previewUrl available
          </p>
        )}
        <Cropper
          image={image.previewUrl}
          crop={crop}
          zoom={zoom}
          aspect={1} // square crop
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, newZoom) => setZoom(newZoom)}
          sx={{ width: 150 }}
        />
        <div>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={handleApply} variant="contained" sx={{ ml: 1 }}>
            Apply Crop
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
