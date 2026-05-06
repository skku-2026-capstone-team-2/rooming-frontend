import { Eye, EyeOff } from "lucide-react";

export type ListMode = "recommended" | "favorites";

type PropertyMarkerToggleProps = {
  enabled: boolean;
  listMode: ListMode;
  onToggle: () => void;
};

export default function PropertyMarkerToggle({
  enabled,
  listMode,
  onToggle,
}: PropertyMarkerToggleProps) {
  const targetLabel = listMode === "favorites" ? "MY 매물" : "추천 매물";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`absolute right-6 bottom-6 z-20 flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur-sm transition ${enabled
          ? "border-[#4A4530] bg-[#4A4530] text-white"
          : "border-[#E8E6DD] bg-white/95 text-[#4A4530] hover:bg-[#F8F7F1]"
        }`}
    >
      <span>{enabled ? `${targetLabel} 표시` : `${targetLabel} 숨김`}</span>
      {enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    </button>
  );
}