import { useState, type ReactNode } from "react";

import {
  useBrokerOffices,
  useCreateBrokerOffice,
} from "../../hooks/queries/brokerQueries";

/** 중개사 인증 입력 필드 공통 스타일. */
export const brokerFieldInputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-text-secondary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring/10";

/** 라벨 + 입력 래퍼. */
export function BrokerField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
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

type BrokerVerificationFieldsProps = {
  registrationNo: string;
  onRegistrationNoChange: (value: string) => void;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  officeId: number | "";
  onOfficeIdChange: (value: number | "") => void;
};

/**
 * 중개사 인증에 필요한 공통 입력 필드.
 *
 * 사업자 등록번호·연락처·소속 사무소(선택/신규 등록)를 controlled 방식으로 받는다.
 * 사무소 목록 조회(`useBrokerOffices`)와 신규 등록(`useCreateBrokerOffice`)은 내부에서
 * 처리하며, 정식 인증 패널과 미인증 폴백 폼이 동일하게 재사용한다.
 */
export default function BrokerVerificationFields({
  registrationNo,
  onRegistrationNoChange,
  phoneNumber,
  onPhoneNumberChange,
  officeId,
  onOfficeIdChange,
}: BrokerVerificationFieldsProps) {
  const officesQuery = useBrokerOffices();
  const createOfficeMutation = useCreateBrokerOffice();

  const [showOfficeForm, setShowOfficeForm] = useState(false);
  const [officeName, setOfficeName] = useState("");
  const [officePhone, setOfficePhone] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");

  const offices = officesQuery.data ?? [];

  const handleCreateOffice = () => {
    if (!officeName.trim() || !officePhone.trim() || !officeAddress.trim()) return;
    createOfficeMutation.mutate(
      {
        officeName: officeName.trim(),
        officePhone: officePhone.trim(),
        officeAddress: officeAddress.trim(),
      },
      {
        onSuccess: (office) => {
          onOfficeIdChange(office.officeId);
          setShowOfficeForm(false);
          setOfficeName("");
          setOfficePhone("");
          setOfficeAddress("");
        },
      }
    );
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <BrokerField label="사업자 등록번호">
          <input
            type="text"
            value={registrationNo}
            onChange={(e) => onRegistrationNoChange(e.target.value)}
            placeholder="123-45-67890"
            className={brokerFieldInputClass}
          />
        </BrokerField>
        <BrokerField label="연락처">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            placeholder="010-1234-5678"
            className={brokerFieldInputClass}
          />
        </BrokerField>
        <BrokerField label="소속 중개사무소 (선택)">
          <select
            value={officeId}
            onChange={(e) =>
              onOfficeIdChange(e.target.value === "" ? "" : Number(e.target.value))
            }
            className={brokerFieldInputClass}
          >
            <option value="">선택 안 함</option>
            {offices.map((office) => (
              <option key={office.officeId} value={office.officeId}>
                {office.officeName}
              </option>
            ))}
          </select>
        </BrokerField>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setShowOfficeForm((prev) => !prev)}
            className="rounded-xl border border-purple-300 bg-card px-4 py-3 text-sm font-semibold text-secondary transition-all hover:bg-purple-100"
          >
            {showOfficeForm ? "사무소 추가 취소" : "+ 새 사무소 등록"}
          </button>
        </div>
      </div>

      {showOfficeForm && (
        <div className="grid gap-4 rounded-xl border border-purple-200 bg-purple-50/40 p-4 md:grid-cols-3">
          <BrokerField label="사무소명">
            <input
              type="text"
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
              className={brokerFieldInputClass}
            />
          </BrokerField>
          <BrokerField label="사무소 전화">
            <input
              type="tel"
              value={officePhone}
              onChange={(e) => setOfficePhone(e.target.value)}
              className={brokerFieldInputClass}
            />
          </BrokerField>
          <BrokerField label="사무소 주소">
            <input
              type="text"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              className={brokerFieldInputClass}
            />
          </BrokerField>
          <div className="md:col-span-3">
            <button
              type="button"
              onClick={handleCreateOffice}
              disabled={createOfficeMutation.isPending}
              className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-md transition-all hover:bg-purple-700 disabled:opacity-60"
            >
              {createOfficeMutation.isPending ? "등록 중..." : "사무소 등록"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
