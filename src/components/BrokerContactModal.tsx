import { Phone, X } from "lucide-react";

import type { BrokerContact } from "../types";

type BrokerContactModalProps = {
  isOpen: boolean;
  contact: BrokerContact | null;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
};

export default function BrokerContactModal({
  isOpen,
  contact,
  isLoading,
  isError,
  onClose,
}: BrokerContactModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-2 text-text-tertiary transition hover:bg-background hover:text-foreground"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-lg font-bold text-foreground">부동산 연결하기</h2>

        {isLoading && (
          <p className="mt-6 text-sm text-text-tertiary">
            담당 중개사 정보를 불러오는 중이에요...
          </p>
        )}

        {!isLoading && (isError || !contact) && (
          <p className="mt-6 text-sm text-destructive">
            중개사 연락처를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
          </p>
        )}

        {!isLoading && !isError && contact && (
          <>
            <div className="mt-5 space-y-3 rounded-2xl border border-border bg-background px-4 py-4">
              <ContactRow label="담당자" value={contact.name} />
              {contact.officeName && (
                <ContactRow label="중개사무소" value={contact.officeName} />
              )}
              <ContactRow label="전화번호" value={contact.phoneNumber} />
            </div>

            <a
              href={`tel:${contact.phoneNumber}`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-md transition-all hover:bg-green-800 hover:shadow-lg"
            >
              <Phone className="h-4 w-4" />
              전화 걸기
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-text-tertiary">{label}</span>
      <span className="text-sm font-semibold text-text-secondary">{value}</span>
    </div>
  );
}
