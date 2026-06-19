import { useRef, useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";

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
 * - `POST /api/v1/user/broker/me/properties` 로 매물을 생성하고,
 * - 생성 후 `POST /api/v1/properties/{id}/images` 로 사진을 업로드한다.
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

  const [createdId, setCreatedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMonthly = tradeType === "MONTHLY_RENT";

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
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

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
        setCreatedId(created.propertyId);
        onCreated?.(created.propertyId);
        resetForm();
      },
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0 && createdId != null) {
      uploadImagesMutation.mutate({ propertyId: createdId, files });
    }
    event.target.value = "";
  };

  // 등록 완료 화면(이미지 업로드 단계)
  if (createdId != null) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-primary">
          <CheckCircle2 className="h-5 w-5" />
          <h3 className="text-lg font-bold">매물이 등록되었어요 (#{createdId})</h3>
        </div>

        <p className="mb-4 text-sm text-text-tertiary">
          매물 사진을 업로드해 주세요. (선택)
        </p>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <Upload className="h-4 w-4 text-text-tertiary" />
          <span className="text-sm text-text-secondary">
            {uploadImagesMutation.isSuccess
              ? "사진이 업로드되었어요."
              : "이미지 파일을 선택하세요."}
          </span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadImagesMutation.isPending}
            className="ml-auto rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:bg-background disabled:opacity-60"
          >
            {uploadImagesMutation.isPending ? "업로드 중..." : "사진 업로드"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {uploadImagesMutation.isError && (
          <p className="mt-3 text-sm text-destructive">
            사진 업로드에 실패했어요. 잠시 후 다시 시도해 주세요.
          </p>
        )}

        <button
          type="button"
          onClick={() => setCreatedId(null)}
          className="mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-green-800"
        >
          새 매물 추가 등록
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-bold text-foreground">새 매물 등록</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="매물명 *">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="성대 정문 도보권 원룸"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="거래 유형 *">
          <select
            value={tradeType}
            onChange={(e) => setTradeType(e.target.value as TradeType)}
            className={inputClass}
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
            className={inputClass}
          />
        </Field>

        <Field label="보증금 (만원) *">
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={`월세 (만원)${isMonthly ? " *" : ""}`}>
          <input
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
            disabled={!isMonthly}
            placeholder={isMonthly ? "" : "전세는 입력 불필요"}
            className={inputClass}
          />
        </Field>

        <Field label="관리비 (만원)">
          <input
            type="number"
            value={maintenanceFee}
            onChange={(e) => setMaintenanceFee(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="면적 (㎡) *">
          <input
            type="number"
            value={areaM2}
            onChange={(e) => setAreaM2(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="층 정보 (예: 3층)">
          <input
            type="text"
            value={floorInfo}
            onChange={(e) => setFloorInfo(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="태그 (쉼표로 구분)">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="편의점, 역세권"
            className={inputClass}
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="도로명 주소 *">
            <input
              type="text"
              value={roadAddress}
              onChange={(e) => setRoadAddress(e.target.value)}
              placeholder="서울 종로구 성균관로 25-2"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="위도 *">
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="37.5894"
            className={inputClass}
          />
        </Field>
        <Field label="경도 *">
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="126.9978"
            className={inputClass}
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="3D 모델 URL (Spline)">
            <input
              type="text"
              value={splineUrl}
              onChange={(e) => setSplineUrl(e.target.value)}
              placeholder="https://prod.spline.design/.../scene.splinecode"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="md:col-span-2">
          <Field label="설명">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>
      </div>

      {createMutation.isError && (
        <p className="mt-4 text-sm text-destructive">
          매물 등록에 실패했어요. 입력값을 확인하고 다시 시도해 주세요.
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || createMutation.isPending}
        className="mt-5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-green-800 disabled:opacity-60"
      >
        {createMutation.isPending ? "등록 중..." : "매물 등록"}
      </button>
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
