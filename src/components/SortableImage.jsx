import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical, RotateCcw } from "lucide-react";

export default function SortableImage({
  img,
  id,
  index,
  onRemove,
  total,
  rotation,
  onRotate,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const isEven = index % 2 === 0;
  const foldAngle = isEven ? "-25deg" : "25deg";
  const origin = isEven ? "left" : "right";

  const baseTransform = `perspective(800px) rotateY(${foldAngle})`;

  const dndTransform = CSS.Transform.toString(transform);
  const combinedTransform = dndTransform
    ? `${dndTransform} ${baseTransform}`
    : baseTransform;

  const style = {
    transform: combinedTransform,
    transformOrigin: `center ${origin}`,
    marginLeft: isEven ? "-12px" : "0",
    marginRight: isEven ? "0" : "-12px",
    zIndex: total - index, // <-- ensures later pages appear "on top"
    transition,
  };

  const borderClasses = ["border-t", "border-b", "border-gray-300"]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex-shrink-0 w-[160px] sm:w-[200px] aspect-square shadow-md rounded-md"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 z-10 cursor-move bg-white/90 p-1 rounded-full"
        title="Drag to reorder"
      >
        <GripVertical size={16} className="text-gray-500" />
      </div>

      <button
        onClick={() => onRotate(id)}
        className="absolute top-1 left-10 z-10 bg-white/90 rounded-full p-1 hover:bg-gray-200"
        title="Rotate image"
      >
        <RotateCcw size={16} className="text-gray-600" />
      </button>

      <button
        onClick={() => onRemove(id)}
        className="absolute top-1 right-1 z-10 bg-white/90 rounded-full p-1 hover:bg-red-100"
        title="Remove"
      >
        <Trash2 size={16} className="text-red-500" />
      </button>

      <div
        className={`w-full h-full bg-white overflow-hidden rounded-md ${borderClasses}`}
      >
        <img
          src={img.previewUrl}
          alt={`Page ${index + 1}`}
          className="w-full h-full object-contain"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: "transform 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
