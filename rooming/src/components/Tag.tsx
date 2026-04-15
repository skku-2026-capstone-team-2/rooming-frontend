type TagProps = {
  text: string;
};

export default function Tag({ text }: TagProps) {
  return (
    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
      {text}
    </span>
  );
}