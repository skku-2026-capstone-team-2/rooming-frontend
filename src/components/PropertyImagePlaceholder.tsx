import { Home } from "lucide-react";

const SIZE_CLASSES = {
  sm: "h-10 w-10 mb-2",
  md: "h-14 w-14 mb-2",
  lg: "h-20 w-20 mb-3",
  xl: "h-24 w-24 mb-2",
} as const;

const TEXT_CLASSES = {
  sm: "text-xs",
  md: "text-xs",
  lg: "text-base",
  xl: "text-sm",
} as const;

type PlaceholderSize = keyof typeof SIZE_CLASSES;

type PropertyImagePlaceholderProps = {
  size?: PlaceholderSize;
};

export default function PropertyImagePlaceholder({
  size = "md",
}: PropertyImagePlaceholderProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <Home className={`mx-auto text-text-secondary ${SIZE_CLASSES[size]}`} />
        <p className={`font-medium text-text-secondary ${TEXT_CLASSES[size]}`}>
          매물 사진 영역
        </p>
      </div>
    </div>
  );
}
