import { useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Line } from "react-konva";
import useImage from "use-image";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

export default function EraserDialog({ image, onCancel, onApply }) {
  const [konvaImg] = useImage(image.previewUrl);
  const [lines, setLines] = useState([]);
  const [brushSize, setBrushSize] = useState(20);
  const isDrawing = useRef(false);
  const stageRef = useRef();

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines((prev) => [...prev, { tool: "eraser", points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setLines((prev) => {
      const lastLine = prev[prev.length - 1];
      const updatedLine = {
        ...lastLine,
        points: [...lastLine.points, point.x, point.y],
      };
      return [...prev.slice(0, -1), updatedLine];
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleUndo = () => {
    setLines((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    setLines([]);
  };

  const handleApply = async () => {
    const uri = stageRef.current.toDataURL({ mimeType: "image/png" });
    const blob = await (await fetch(uri)).blob();
    const newUrl = URL.createObjectURL(blob);
    onApply(image.id, newUrl);
  };

  return (
    <Dialog open fullWidth maxWidth="md">
      <DialogTitle>Erase Background</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-4 items-center">
          <Stage
            width={400}
            height={400}
            ref={stageRef}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
          >
            <Layer>
              {konvaImg && (
                <KonvaImage image={konvaImg} width={400} height={400} />
              )}
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="#000"
                  strokeWidth={brushSize}
                  tension={0.5}
                  globalCompositeOperation="destination-out"
                  lineCap="round"
                  lineJoin="round"
                />
              ))}
            </Layer>
          </Stage>

          <div className="w-full px-4">
            <label className="text-sm font-medium text-gray-700">
              Brush size
            </label>
            <Slider
              value={brushSize}
              onChange={(e, newVal) => setBrushSize(newVal)}
              min={5}
              max={50}
              step={1}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outlined" onClick={handleUndo}>
              Undo
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
