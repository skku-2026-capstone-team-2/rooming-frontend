import { Heart } from "lucide-react";

type MyFavoriteButtonProps = {
  selected: boolean;
  pending: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
};

export default function MyFavoriteButton({
  selected,
  pending,
  disabled = false,
  onClick,
  className = "",
}: MyFavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || pending}
      style={{
        borderColor: "var(--token-color-my)",
        backgroundColor: selected
          ? "var(--token-color-my)"
          : "var(--token-color-white)",
        color: selected
          ? "var(--token-color-text-white)"
          : "var(--token-color-my)",
      }}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-6 py-3 text-base font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      <Heart className={`h-5 w-5 ${selected ? "fill-current" : ""}`} />
      {pending ? "저장 중..." : selected ? "MY 선택됨" : "MY로 선택"}
    </button>
  );
}
