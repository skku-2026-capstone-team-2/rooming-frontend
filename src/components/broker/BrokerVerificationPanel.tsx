import { useRef, useState } from "react";
import { CheckCircle2, ShieldAlert, Upload } from "lucide-react";

import {
  useBrokerProfile,
  useUpdateBrokerAdditionalInfo,
  useUploadBrokerVerificationDocument,
} from "../../hooks/queries/brokerQueries";
import UnverifiedBrokerForm from "./UnverifiedBrokerForm";
import BrokerVerificationFields from "./BrokerVerificationFields";

/**
 * 중개사 인증 패널.
 *
 * - `GET /api/v1/user/broker/me` 로 프로필/인증 상태를 보여주고,
 * - `PUT .../additional-info` (사업자번호·연락처·사무소) 와
 *   `PUT .../verification-document` (증빙 서류)로 수동 인증 정보를 제출한다.
 * - `GET/POST /api/v1/broker-offices` 로 사무소를 선택/추가한다.
 *
 * 매물 등록은 `profileComplete` 이후에만 의미가 있으므로 부모가 그 상태를 활용한다.
 */
export default function BrokerVerificationPanel() {
  const profileQuery = useBrokerProfile();

  const updateInfoMutation = useUpdateBrokerAdditionalInfo();
  const uploadDocMutation = useUploadBrokerVerificationDocument();

  const profile = profileQuery.data;

  const [registrationNo, setRegistrationNo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [officeId, setOfficeId] = useState<number | "">("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 프로필이 처음 로드될 때 기존 값으로 폼을 한 번 초기화한다.
  // (effect 대신 렌더 중 조정 — React 권장 "이전 렌더 정보 저장" 패턴)
  const [initializedFor, setInitializedFor] = useState<number | null>(null);
  if (profile && initializedFor !== profile.brokerId) {
    setInitializedFor(profile.brokerId);
    setRegistrationNo(profile.registrationNo ?? "");
    setPhoneNumber(profile.phoneNumber ?? "");
    setOfficeId(profile.officeId ?? "");
  }

  if (profileQuery.isPending) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-text-tertiary shadow-sm">
        중개사 정보를 불러오는 중이에요...
      </div>
    );
  }

  // 인증되지 않은 중개사는 프로필 조회가 실패하므로, 오류 대신
  // 안내 + 정보 제출 폼(로컬 전용)을 보여준다.
  if (profileQuery.isError || !profile) {
    return <UnverifiedBrokerForm />;
  }

  const handleSubmitInfo = () => {
    if (!registrationNo.trim() || !phoneNumber.trim()) return;
    updateInfoMutation.mutate({
      registrationNo: registrationNo.trim(),
      phoneNumber: phoneNumber.trim(),
      officeId: officeId === "" ? null : officeId,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) uploadDocMutation.mutate(file);
    event.target.value = "";
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* 상태 헤더 */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">중개사 인증</h3>
          <p className="mt-1 text-sm text-text-tertiary">
            {profile.name} · {profile.email}
          </p>
        </div>
        {profile.isVerified ? (
          <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
            <CheckCircle2 className="h-4 w-4" />
            인증 완료
          </span>
        ) : profile.profileComplete ? (
          <span className="flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-sm font-semibold text-secondary">
            <ShieldAlert className="h-4 w-4" />
            심사 대기 중
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-sm font-semibold text-text-tertiary">
            <ShieldAlert className="h-4 w-4" />
            인증 정보 미입력
          </span>
        )}
      </div>

      {profile.isVerified ? (
        <p className="rounded-xl bg-primary/5 px-4 py-3 text-sm text-text-secondary">
          인증이 완료되어 매물을 등록할 수 있어요.
        </p>
      ) : (
        <div className="space-y-5">
          {/* 추가 정보 입력 */}
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
            <Upload className="h-4 w-4 text-text-tertiary" />
            <span className="text-sm text-text-secondary">
              {profile.hasVerificationDocument
                ? `증빙 서류: ${profile.verificationDocumentFileName ?? "제출됨"}`
                : "자격 증빙 서류(이미지/PDF)를 업로드해 주세요."}
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadDocMutation.isPending}
              className="ml-auto rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:bg-background disabled:opacity-60"
            >
              {uploadDocMutation.isPending
                ? "업로드 중..."
                : profile.hasVerificationDocument
                  ? "다시 업로드"
                  : "서류 업로드"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {(updateInfoMutation.isError || uploadDocMutation.isError) && (
            <p className="text-sm text-destructive">
              요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmitInfo}
            disabled={
              updateInfoMutation.isPending ||
              !registrationNo.trim() ||
              !phoneNumber.trim()
            }
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-green-800 disabled:opacity-60"
          >
            {updateInfoMutation.isPending ? "저장 중..." : "인증 정보 저장"}
          </button>
        </div>
      )}
    </div>
  );
}
