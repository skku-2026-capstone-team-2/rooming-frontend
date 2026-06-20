import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Plus, X } from "lucide-react";

import { useCreateBrokerProperty } from "../../hooks/queries/brokerQueries";
import { useUploadPropertyImages } from "../../hooks/queries/propertyQueries";
import type { BrokerPropertyCreateRequest, TradeType } from "../../types";

type BrokerPropertyFormProps = {
  /** 등록 완료 후(목록 갱신 등) 부모에 알린다. */
  onCreated?: (propertyId: number) => void;
};

/**
 * 중개사 매물 등록 폼.
 *
 * 한 화면에서 매물 정보 + 사진을 모두 입력하고 "매물 등록" 한 번으로
 * `POST /api/v1/user/broker/me/properties`(생성) → `POST /api/v1/properties/{id}/images`
 * (사진 업로드)를 순차 처리한다.
 *
 * OpenAPI의 BrokerPropertyCreateRequest 필수 필드(title, tradeType, depositAmount,
 * areaM2, roadAddress, location)를 모두 입력받는다. 매물 상태(공개/대기 등)나 수정·삭제는
 * 현재 API에 없으므로 다루지 않는다.
 */
export default function BrokerPropertyForm({ onCreated }: BrokerPropertyFormProps) {
  const createMutation = useCreateBrokerProperty();
  const uploadImagesMutation = useUploadPropertyImages();

  const [title, setTitle] = useState("");
  const [tradeType, setTradeType] = useState<TradeType>("MONTHLY_RENT");
  const [depositAmount, setDepositAmount] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [maintenanceFee, setMaintenanceFee] = useState("");
  const [areaM2, setAreaM2] = useState("");
  const [floorInfo, setFloorInfo] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [roadAddress, setRoadAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [splineUrl, setSplineUrl] = useState("");
  const [tags, setTags] = useState("");

  // 폼 안에서 미리 고른 사진들. 등록 시 한 번에 업로드한다.
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 직전 등록 성공 안내(같은 화면 상단 배너).
  const [doneId, setDoneId] = useState<number | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const isMonthly = tradeType === "MONTHLY_RENT";
  const isSubmitting = createMutation.isPending || uploadImagesMutation.isPending;

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  // 미리보기 object URL 누수 방지.
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const canSubmit =
    title.trim() !== "" &&
    depositAmount !== "" &&
    areaM2 !== "" &&
    roadAddress.trim() !== "" &&
    latitude !== "" &&
    longitude !== "" &&
    (!isMonthly || monthlyRent !== "");

  const resetForm = () => {
    setTitle("");
    setTradeType("MONTHLY_RENT");
    setDepositAmount("");
    setMonthlyRent("");
    setMaintenanceFee("");
    setAreaM2("");
    setFloorInfo("");
    setPropertyType("");
    setRoadAddress("");
    setLatitude("");
    setLongitude("");
    setDescription("");
    setSplineUrl("");
    setTags("");
    setFiles([]);
  };

  const handleAddFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    if (picked.length > 0) setFiles((prev) => [...prev, ...picked]);
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    if (!canSubmit) {
      setValidationMessage("필수 항목을 모두 입력해 주세요.");
      return;
    }
    setDoneId(null);
    setValidationMessage(null);

    const body: BrokerPropertyCreateRequest = {
      title: title.trim(),
      tradeType,
      depositAmount: Number(depositAmount),
      monthlyRent: isMonthly ? Number(monthlyRent) : 0,
      areaM2: Number(areaM2),
      roadAddress: roadAddress.trim(),
      location: { latitude: Number(latitude), longitude: Number(longitude) },
      propertyType: propertyType.trim() || null,
      maintenanceFee: maintenanceFee === "" ? null : Number(maintenanceFee),
      floorInfo: floorInfo.trim() || null,
      description: description.trim() || null,
      splineUrl: splineUrl.trim() || null,
      tags: tags.trim()
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : null,
    };

    createMutation.mutate(body, {
      onSuccess: (created) => {
        const finish = () => {
          onCreated?.(created.propertyId);
          resetForm();
          setDoneId(created.propertyId);
        };

        // 사진이 있으면 같은 흐름에서 이어 업로드하고, 끝나면 폼을 비운다.
        if (files.length > 0) {
          uploadImagesMutation.mutate(
            { propertyId: created.propertyId, files },
            { onSuccess: finish }
          );
        } else {
          finish();
        }
      },
    });
  };

  const submitLabel = createMutation.isPending
    ? "매물 등록 중..."
    : uploadImagesMutation.isPending
      ? "사진 업로드 중..."
      : "매물 등록";

  return (
    <div className="space-y-6">
      {doneId != null && (
        <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 text-sm font-semibold text-primary">
          <CheckCircle2 className="h-4 w-4" />
          매물이 등록되었어요 (#{doneId}). 좌측 목록에서 확인할 수 있어요.
        </div>
      )}

      {/* 기본 정보 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-foreground">기본 정보</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="매물명 *">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="성대 정문 도보권 원룸"
                className={inputTan}
              />
            </Field>
          </div>

          <Field label="거래 유형 *">
            <select
              value={tradeType}
              onChange={(e) => setTradeType(e.target.value as TradeType)}
              className={inputTan}
            >
              <option value="MONTHLY_RENT">월세</option>
              <option value="DEPOSIT_BASIS">전세</option>
            </select>
          </Field>
          <Field label="구조 (예: one_room)">
            <input
              type="text"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              placeholder="one_room"
              className={inputTan}
            />
          </Field>

          <Field label="보증금 (만원) *">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className={inputTan}
            />
          </Field>
          <Field label={`월세 (만원)${isMonthly ? " *" : ""}`}>
            <input
              type="number"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              disabled={!isMonthly}
              placeholder={isMonthly ? "" : "전세는 입력 불필요"}
              className={inputTan}
            />
          </Field>

          <Field label="관리비 (만원)">
            <input
              type="number"
              value={maintenanceFee}
              onChange={(e) => setMaintenanceFee(e.target.value)}
              className={inputTan}
            />
          </Field>
          <Field label="면적 (㎡) *">
            <input
              type="number"
              value={areaM2}
              onChange={(e) => setAreaM2(e.target.value)}
              className={inputTan}
            />
          </Field>

          <Field label="층 정보 (예: 3층)">
            <input
              type="text"
              value={floorInfo}
              onChange={(e) => setFloorInfo(e.target.value)}
              className={inputTan}
            />
          </Field>
          <Field label="태그 (쉼표로 구분)">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="편의점, 역세권"
              className={inputTan}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="설명">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`${inputTan} resize-none`}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* 위치 정보 */}
      <div className="rounded-2xl border border-purple-300 bg-card p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-purple-800">위치 정보</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="도로명 주소 *">
              <input
                type="text"
                value={roadAddress}
                onChange={(e) => setRoadAddress(e.target.value)}
                placeholder="서울 종로구 성균관로 25-2"
                className={inputLavender}
              />
            </Field>
          </div>

          <Field label="위도 *">
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="37.5894"
              className={inputLavender}
            />
          </Field>
          <Field label="경도 *">
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="126.9978"
              className={inputLavender}
            />
          </Field>
        </div>
      </div>

      {/* 이미지 / 3D 자산 */}
      <div className="rounded-2xl border border-accent-purple-border bg-card p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-bold text-accent-purple">
          이미지 / 3D 자산
        </h3>

        <div className="space-y-5">
          {/* 매물 사진 (등록과 함께 업로드) */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-accent-purple-light">
              매물 사진 (선택)
            </label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {previews.map((url, index) => (
                <div
                  key={url}
                  className="relative h-24 overflow-hidden rounded-xl border border-accent-purple-border"
                >
                  <img
                    src={url}
                    alt={`매물 사진 ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute right-1 top-1 rounded-lg bg-foreground/60 p-1 text-primary-foreground transition hover:bg-foreground/80"
                    aria-label="사진 삭제"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-accent-purple-border bg-accent-purple-bg text-xs font-semibold text-accent-purple-light transition hover:border-accent-purple-light hover:bg-accent-purple-pale"
              >
                <Plus className="h-4 w-4" />
                사진 추가
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleAddFiles}
              className="hidden"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-accent-purple-light">
              3D 모델 URL (Spline)
            </label>
            <input
              type="text"
              value={splineUrl}
              onChange={(e) => setSplineUrl(e.target.value)}
              placeholder="https://prod.spline.design/.../scene.splinecode"
              className={inputPurple}
            />
          </div>
        </div>
      </div>

      {/* 등록 */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        {(createMutation.isError || uploadImagesMutation.isError) && (
          <p className="mb-4 text-sm text-destructive">
            {createMutation.isError
              ? "매물 등록에 실패했어요. 입력값을 확인하고 다시 시도해 주세요."
              : "매물은 등록됐지만 사진 업로드에 실패했어요. 잠시 후 다시 시도해 주세요."}
          </p>
        )}
        {validationMessage && (
          <p className="mb-4 text-sm font-medium text-text-tertiary">
            {validationMessage}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border px-4 py-3 text-sm text-text-secondary placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all";
const inputTan = `${inputBase} bg-card border-border focus:border-accent focus:ring-ring/10`;
const inputLavender = `${inputBase} bg-card border-purple-300 focus:border-secondary focus:ring-secondary/10`;
const inputPurple = `${inputBase} bg-card border-accent-purple-border focus:border-accent-purple-light focus:ring-accent-purple-light/10`;

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
