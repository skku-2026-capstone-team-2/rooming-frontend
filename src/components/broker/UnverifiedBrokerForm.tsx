import { useRef, useState } from "react";
import { CheckCircle2, FileText, ShieldAlert, Upload } from "lucide-react";

import {
  useBrokerOffices,
  useUpdateBrokerAdditionalInfo,
  useUploadBrokerVerificationDocument,
} from "../../hooks/queries/brokerQueries";
import BrokerVerificationFields from "./BrokerVerificationFields";

/**
 * 미인증 중개사 안내 + 정보 제출 폼.
 *
 * 인증되지 않은 중개사는 `GET /api/v1/user/broker/me` 가 실패해 프로필을 받을 수
 * 없으므로, 이 컴포넌트는 서버 프로필 없이도 동작한다. 사업자 정보·증빙 서류를
 * 입력받아 실제 인증 API에 제출한다.
 *
 * - 추가 정보 저장: `PUT /api/v1/user/broker/me/additional-info`
 * - 증빙 서류 업로드: `PUT /api/v1/user/broker/me/verification-document`
 * - 사무소 선택/신규 등록: `GET/POST /api/v1/broker-offices`
 *
 * 제출이 성공하면 프로필 쿼리가 무효화되어, 프로필이 조회되면 상위
 * `BrokerVerificationPanel`이 자동으로 정식 패널로 전환된다.
 */
export default function UnverifiedBrokerForm() {
  const officesQuery = useBrokerOffices();
  const updateInfoMutation = useUpdateBrokerAdditionalInfo();
  const uploadDocMutation = useUploadBrokerVerificationDocument();

  const [registrationNo, setRegistrationNo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [officeId, setOfficeId] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const offices = officesQuery.data ?? [];
  const selectedOfficeName =
    officeId === ""
      ? ""
      : offices.find((office) => office.officeId === officeId)?.officeName ?? "";
  const isSubmitting =
    updateInfoMutation.isPending || uploadDocMutation.isPending;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    if (selected) setError(null);
    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!registrationNo.trim() || !phoneNumber.trim()) {
      setError("사업자 등록번호와 연락처를 입력해 주세요.");
      return;
    }
    if (!file) {
      setError("자격 증빙 서류를 업로드해 주세요.");
      return;
    }

    setError(null);

    try {
      await updateInfoMutation.mutateAsync({
        registrationNo: registrationNo.trim(),
        phoneNumber: phoneNumber.trim(),
        officeId: officeId === "" ? null : officeId,
      });
      await uploadDocMutation.mutateAsync(file);
      setSubmitted(true);
    } catch {
      setError("인증 정보 제출에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
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
            {selectedOfficeName && (
              <SummaryRow label="소속 중개사무소" value={selectedOfficeName} />
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
        <BrokerVerificationFields
          registrationNo={registrationNo}
          onRegistrationNoChange={setRegistrationNo}
          phoneNumber={phoneNumber}
          onPhoneNumberChange={setPhoneNumber}
          officeId={officeId}
          onOfficeIdChange={setOfficeId}
        />

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
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-green-800 disabled:opacity-60"
        >
          {isSubmitting ? "제출 중..." : "인증 정보 제출"}
        </button>
      </div>
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
