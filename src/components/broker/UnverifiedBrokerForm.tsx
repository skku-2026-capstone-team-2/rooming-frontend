import { useRef, useState } from "react";
import { CheckCircle2, FileText, ShieldAlert, Upload } from "lucide-react";

/**
 * 미인증 중개사 안내 + 정보 제출 폼 (로컬 전용).
 *
 * 인증되지 않은 중개사는 `GET /api/v1/user/broker/me` 가 실패해 프로필을 받을 수
 * 없으므로, 이 컴포넌트는 서버 프로필 없이도 동작한다. 사업자 정보·증빙 서류를
 * 입력받아 "제출 완료(심사 대기)" 상태를 화면에 보여준다.
 *
 * 실제 인증 API와는 연결하지 않는다(요청에 따라 로컬 상태로만 처리).
 */
export default function UnverifiedBrokerForm() {
  const [registrationNo, setRegistrationNo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    if (selected) setError(null);
    setFile(selected);
  };

  const handleSubmit = () => {
    if (!registrationNo.trim() || !phoneNumber.trim()) {
      setError("사업자 등록번호와 연락처를 입력해 주세요.");
      return;
    }
    if (!file) {
      setError("자격 증빙 서류를 업로드해 주세요.");
      return;
    }
    setError(null);
    // 실제 API 연결 없이 제출 완료 상태로 전환한다.
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
  };

  // 제출 완료(심사 대기) 상태
  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">중개사 인증</h3>
            <p className="mt-1 text-sm text-text-tertiary">
              제출하신 정보를 검토하고 있어요.
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-sm font-semibold text-secondary">
            <ShieldAlert className="h-4 w-4" />
            심사 대기 중
          </span>
        </div>

        <div className="space-y-3 rounded-xl bg-secondary/5 px-4 py-4 text-sm text-text-secondary">
          <p className="flex items-center gap-2 font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            인증 정보가 제출되었어요.
          </p>
          <p className="leading-6">
            관리자가 사업자 정보와 증빙 서류를 검토한 뒤 인증을 완료해요. 인증이
            완료되면 매물을 등록할 수 있어요.
          </p>
          <div className="grid gap-2 pt-1">
            <SummaryRow label="사업자 등록번호" value={registrationNo} />
            <SummaryRow label="연락처" value={phoneNumber} />
            {officeName.trim() && (
              <SummaryRow label="소속 중개사무소" value={officeName} />
            )}
            <SummaryRow label="증빙 서류" value={file?.name ?? "제출됨"} />
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="mt-4 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-text-secondary transition-all hover:bg-background"
        >
          정보 수정하기
        </button>
      </div>
    );
  }

  // 미인증 안내 + 정보 제출 폼
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">중개사 인증</h3>
          <p className="mt-1 text-sm text-text-tertiary">
            매물 등록 전에 중개사 인증이 필요해요.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-sm font-semibold text-text-tertiary">
          <ShieldAlert className="h-4 w-4" />
          인증 필요
        </span>
      </div>

      {/* 안내 */}
      <div className="mb-5 rounded-xl bg-secondary/5 px-4 py-3 text-sm leading-6 text-text-secondary">
        아직 인증되지 않은 계정이에요. 아래에 사업자 정보와 자격 증빙 서류를 제출하면
        관리자 검토 후 인증이 완료돼요. 인증이 완료되면 매물을 등록할 수 있어요.
      </div>

      <div className="space-y-5">
        {/* 사업자 정보 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="사업자 등록번호">
            <input
              type="text"
              value={registrationNo}
              onChange={(e) => setRegistrationNo(e.target.value)}
              placeholder="123-45-67890"
              className={inputClass}
            />
          </Field>
          <Field label="연락처">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="010-1234-5678"
              className={inputClass}
            />
          </Field>
          <Field label="소속 중개사무소 (선택)">
            <input
              type="text"
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
              placeholder="○○ 공인중개사무소"
              className={inputClass}
            />
          </Field>
        </div>

        {/* 증빙 서류 */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
          {file ? (
            <FileText className="h-4 w-4 text-primary" />
          ) : (
            <Upload className="h-4 w-4 text-text-tertiary" />
          )}
          <span className="text-sm text-text-secondary">
            {file
              ? `증빙 서류: ${file.name}`
              : "자격 증빙 서류(이미지/PDF)를 업로드해 주세요."}
          </span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="ml-auto rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:bg-background"
          >
            {file ? "다시 업로드" : "서류 업로드"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-green-800"
        >
          인증 정보 제출
        </button>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-text-secondary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/10";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-text-secondary">
        {label}
      </label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-card px-3 py-2">
      <span className="text-xs font-medium text-text-tertiary">{label}</span>
      <span className="text-sm font-semibold text-text-secondary">{value}</span>
    </div>
  );
}
