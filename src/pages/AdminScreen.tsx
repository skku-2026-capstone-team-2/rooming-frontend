import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

import BrokerVerificationPanel from "../components/broker/BrokerVerificationPanel";
import BrokerPropertyForm from "../components/broker/BrokerPropertyForm";

import { mapPropertyDetailToView } from "../api/mappers/propertyMapper";
import {
  useBrokerProfile,
  useMyBrokerProperties,
} from "../hooks/queries/brokerQueries";
import { useProperty } from "../hooks/queries/propertyQueries";

type RightPanel = "create" | "detail";

export default function AdminScreen() {
  const navigate = useNavigate();

  const profileQuery = useBrokerProfile();
  const propertiesQuery = useMyBrokerProperties();

  const [panel, setPanel] = useState<RightPanel>("create");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const profile = profileQuery.data;
  const canRegister = profile?.isVerified ?? false;
  // 인증 정보는 제출(profileComplete)했지만 아직 관리자 승인(isVerified) 전인 상태.
  const isAwaitingApproval =
    !!profile && !profile.isVerified && profile.profileComplete;
  const properties = propertiesQuery.data ?? [];

  const handleSelect = (propertyId: number) => {
    setSelectedId(propertyId);
    setPanel("detail");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">중개사 대시보드</h1>
            <p className="mt-2 text-text-secondary">매물 등록 및 관리</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl border border-purple-300 bg-card px-5 py-3 text-base font-semibold text-secondary transition-all hover:bg-purple-100"
          >
            사용자 화면으로
          </button>
        </div>

        <div className="space-y-6">
          {/* 인증 패널 */}
          <BrokerVerificationPanel />

          {/* 매물 영역 */}
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            {/* 좌측: 내 매물 목록 */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">내 매물</h3>
                <span className="rounded-full border border-purple-200 bg-purple-100 px-3 py-1 text-xs font-semibold text-secondary">
                  {properties.length}개
                </span>
              </div>

              {canRegister && (
                <button
                  type="button"
                  onClick={() => {
                    setPanel("create");
                    setSelectedId(null);
                  }}
                  className={`mb-3 flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-md transition-all ${
                    panel === "create"
                      ? "bg-primary text-primary-foreground hover:bg-green-800"
                      : "border border-border bg-card text-text-secondary hover:bg-background"
                  }`}
                >
                  <Plus className="h-4 w-4" />새 매물 등록
                </button>
              )}

              {propertiesQuery.isPending ? (
                <p className="px-1 py-6 text-center text-sm text-text-tertiary">
                  매물을 불러오는 중이에요...
                </p>
              ) : properties.length === 0 ? (
                <p className="px-1 py-6 text-center text-sm text-text-tertiary">
                  등록된 매물이 없어요.
                </p>
              ) : (
                <div className="space-y-2">
                  {properties.map((property) => (
                    <button
                      key={property.propertyId}
                      onClick={() => handleSelect(property.propertyId)}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${
                        panel === "detail" && selectedId === property.propertyId
                          ? "border-accent bg-background shadow-md"
                          : "border-border bg-card hover:border-accent hover:bg-background"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-text-secondary">
                          {property.title}
                        </span>
                        <span className="text-xs text-text-tertiary">
                          #{property.propertyId}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 우측: 등록 폼 또는 상세 */}
            <div>
              {panel === "detail" && selectedId != null ? (
                <PropertyDetailPanel propertyId={selectedId} />
              ) : canRegister ? (
                <BrokerPropertyForm
                  onCreated={() => setPanel("create")}
                />
              ) : isAwaitingApproval ? (
                <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-8 text-center shadow-sm">
                  <h3 className="text-lg font-bold text-foreground">
                    심사 대기 중이에요
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary">
                    제출하신 인증 정보를 관리자가 검토하고 있어요. 심사가 완료되면
                    매물을 등록할 수 있어요.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                  <h3 className="text-lg font-bold text-foreground">
                    인증 완료 후 매물을 등록할 수 있어요
                  </h3>
                  <p className="mt-2 text-sm text-text-tertiary">
                    위 인증 패널에서 사업자 정보와 증빙 서류를 제출해 주세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 선택한 매물의 상세 정보(읽기 전용). 매물 수정·삭제 API가 없어 조회만 제공한다. */
function PropertyDetailPanel({ propertyId }: { propertyId: number }) {
  const detailQuery = useProperty(propertyId);

  if (detailQuery.isPending) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-text-tertiary shadow-sm">
        매물 정보를 불러오는 중이에요...
      </div>
    );
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-card p-6 text-sm text-destructive shadow-sm">
        매물 정보를 불러오지 못했어요.
      </div>
    );
  }

  const view = mapPropertyDetailToView(detailQuery.data);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">{view.title}</h3>
        <span className="text-xs text-text-tertiary">#{view.propertyId}</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <InfoRow label="가격" value={view.priceLabel} />
        <InfoRow label="구조" value={view.roomTypeLabel} />
        <InfoRow label="면적" value={view.areaLabel} />
        <InfoRow label="층수" value={view.floorLabel} />
        <InfoRow label="관리비" value={view.maintenanceFeeLabel} />
        <InfoRow label="3D" value={view.has3DModel ? "가능" : "없음"} />
        <div className="md:col-span-2">
          <InfoRow label="주소" value={view.address} />
        </div>
      </div>

      {view.description && (
        <p className="mt-4 rounded-xl bg-background px-4 py-3 text-sm leading-6 text-text-secondary">
          {view.description}
        </p>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
      <span className="text-sm font-medium text-text-tertiary">{label}</span>
      <span className="text-sm font-semibold text-text-secondary">{value}</span>
    </div>
  );
}
