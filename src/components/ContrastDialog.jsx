import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import CircularProgress from "@mui/material/CircularProgress";

export default function ContrastDialog({
  image,
  onCancel,
  onApply,
  processPreview,
}) {
  const [contrast, setContrast] = useState(
    image.contrast !== undefined ? image.contrast : 120
  );
  const [previewUrl, setPreviewUrl] = useState(image.previewUrl);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (!image.file) return;

    setLoading(true);

    // debounce preview processing
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(async () => {
      try {
        const newUrl = await processPreview({ ...image, contrast });
        setPreviewUrl(newUrl);
      } catch (err) {
        console.error("Failed to preview contrast", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [contrast, image]);

  const handleApply = () => {
    onApply(image.id, contrast);
  };

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={onCancel}>
      <DialogContent
        sx={{ position: "relative", height: 400, backgroundColor: "#f0f0f0" }}
      >
        {loading ? (
          <div className="flex h-full justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex h-full justify-center items-center">
            <img
              src={previewUrl}
              alt="Contrast preview"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
        <Slider
          value={contrast}
          min={60}
          max={200}
          step={1}
          onChange={(e, val) => setContrast(val)}
          sx={{ width: 180 }}
        />
        <div>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={handleApply} variant="contained" sx={{ ml: 1 }}>
            Apply Contrast
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
