type CenteredMessageProps = {
  title: string;
  description: string;
  /** 있으면 하단에 버튼 표시 */
  onBack?: () => void;
  backLabel?: string;
};

export default function CenteredMessage({
  title,
  description,
  onBack,
  backLabel = "돌아가기",
}: CenteredMessageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>

        <p className="mt-3 text-sm leading-6 text-text-tertiary">{description}</p>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-green-800"
          >
            {backLabel}
          </button>
        )}
      </div>
    </div>
  );
}
