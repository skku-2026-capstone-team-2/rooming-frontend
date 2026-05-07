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
  const isFavoritesMode = listMode === "favorites";
  const targetLabel = isFavoritesMode ? "MY 매물" : "추천 매물";

  return (
    <button
      type="button"
      onClick={onToggle}
      style={
        isFavoritesMode
          ? {
              borderColor: "var(--token-color-my)",
              backgroundColor: enabled
                ? "var(--token-color-my)"
                : "color-mix(in srgb, var(--token-color-white) 95%, var(--token-color-transparent))",
              color: enabled
                ? "var(--token-color-text-white)"
                : "var(--token-color-my)",
            }
          : undefined
      }
      className={`absolute right-6 bottom-6 z-20 flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur-sm transition ${
        isFavoritesMode
          ? ""
          : enabled
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card/95 text-foreground hover:bg-muted"
      }`}
    >
      <span>{enabled ? `${targetLabel} 표시` : `${targetLabel} 숨김`}</span>
      {enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
    </button>
  );
}
