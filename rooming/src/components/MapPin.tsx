type MapPinProps = {
  className: string;
  label: string;
};

export default function MapPin({ className, label }: MapPinProps) {
  return (
    <div
      className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-bold shadow ${className}`}
    >
      {label}
    </div>
  );
}