import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical } from "lucide-react";

export default function SortableImage({ img, id, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const isEven = index % 2 === 0;
  const rotation = isEven ? "-25deg" : "25deg";
  const origin = isEven ? "left" : "right";
  const baseTransform = `perspective(800px) rotateY(${rotation})`;
  const dndTransform = CSS.Transform.toString(transform);
  const combinedTransform = dndTransform
    ? `${dndTransform} ${baseTransform}`
    : baseTransform;

  const style = {
    transform: combinedTransform,
    transformOrigin: `center ${origin}`,
    marginLeft: isEven ? "-12px" : "0",
    marginRight: isEven ? "0" : "-12px",
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex-shrink-0 w-[160px] sm:w-[200px] aspect-square shadow-md rounded-md"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 z-10 cursor-move bg-white/90 p-1 rounded-full"
        title="Drag to reorder"
      >
        <GripVertical size={16} className="text-gray-500" />
      </div>

      {/* Trash icon */}
      <button
        onClick={() => onRemove(id)}
        className="absolute top-1 right-1 z-10 bg-white/90 rounded-full p-1 hover:bg-red-100"
        title="Remove"
      >
        <Trash2 size={16} className="text-red-500" />
      </button>

      {/* Image */}
      <div className="w-full h-full bg-white overflow-hidden rounded-md">
        <img
          src={img.previewUrl}
          alt={`Page ${index + 1}`}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
