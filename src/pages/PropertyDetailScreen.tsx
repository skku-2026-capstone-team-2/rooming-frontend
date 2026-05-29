import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { Home, Phone, ArrowLeft } from "lucide-react";

import { ApiError } from "../api";
import { mapPropertyDetailToView } from "../api/mappers/propertyMapper";
import {
  useProperty,
  usePropertyImages,
} from "../hooks/queries/propertyQueries";

export default function PropertyDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  const propertyId = Number(id);
  const isValidId = !!id && !Number.isNaN(propertyId);

  // id가 유효할 때만 쿼리를 실행한다. (mock 토글·mapper는 훅 내부에서 재사용)
  const detailQuery = useProperty(propertyId, isValidId);
  const imagesQuery = usePropertyImages(propertyId, isValidId);

  const property = useMemo(
    () =>
      detailQuery.data
        ? mapPropertyDetailToView(
            detailQuery.data,
            // 이미지 조회 실패는 치명적이지 않으므로 빈 목록으로 처리한다.
            imagesQuery.data?.images ?? []
          )
        : null,
    [detailQuery.data, imagesQuery.data]
  );

  // 상태 판단은 상세(detail) 쿼리 기준. (이미지 실패는 화면 실패로 보지 않음)
  const isNotFound =
    !isValidId ||
    (detailQuery.error instanceof ApiError && detailQuery.error.status === 404);
  const isError = isValidId && !isNotFound && detailQuery.isError;
  const isLoading = isValidId && detailQuery.isPending;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <p className="text-sm font-medium text-text-tertiary">
          매물 정보를 불러오는 중이에요...
        </p>
      </div>
    );
  }

  if (isNotFound || isError || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">
            {isNotFound ? "매물을 찾을 수 없어요" : "매물 정보를 불러오지 못했어요"}
          </h1>

          <p className="mt-3 text-sm leading-6 text-text-tertiary">
            {isNotFound
              ? "요청한 매물 정보가 존재하지 않거나 삭제되었을 수 있어요."
              : "잠시 후 다시 시도해 주세요."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/map")}
            className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-green-800"
          >
            지도로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const mainImage = property.imageUrls[0] ?? null;
  const description = property.description ?? "생활 인프라가 가까운 추천 매물";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* 좌측 메인 영역 */}
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-base font-semibold text-text-secondary transition-all hover:bg-background"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              뒤로가기
            </button>

            {/* 매물 사진 + 정보 오버레이 */}
            <div className="relative h-[430px] overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-border/30 to-purple-300/30 shadow-sm">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <Home className="mx-auto mb-3 h-20 w-20 text-text-secondary" />
                    <div className="text-base font-medium text-text-secondary">
                      매물 사진 영역
                    </div>
                  </div>
                </div>
              )}

              {/* 하단 오버레이 */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 via-foreground/40 to-transparent px-6 pb-6 pt-24">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full border border-card/40 bg-card/90 px-3 py-1 text-xs font-semibold text-purple-800">
                    AI 추천
                  </span>
                  <span className="rounded-full border border-card/40 bg-card/90 px-3 py-1 text-xs font-semibold text-text-tertiary">
                    {property.roomTypeLabel}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-primary-foreground">
                  {property.title}
                </h1>

                <p className="mt-2 text-3xl font-bold text-green-300">
                  {property.priceLabel}
                </p>

                <p className="mt-2 line-clamp-1 text-sm leading-6 text-primary-foreground/85">
                  {description}
                </p>
              </div>
            </div>

            {/*
              추천 이유(AI 추천 이유)는 property가 아니라 recommendation 응답의
              explanation에서 관리하므로 property 상세 화면에서는 다루지 않는다.
              추천 컨텍스트 연동은 후속 이슈(#22 등)에서 추가한다.
            */}

            {/* TODO(#23): 주요 인프라는 실제 infra API 연동 전까지 placeholder */}
            <div className="rounded-2xl border border-accent-purple-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-accent-purple">
                주요 인프라
              </h3>

              <div className="space-y-2">
                <DistanceItem place="성균관대 정문" distance="도보 12분" />
                <DistanceItem place="헬스장" distance="도보 3분" />
                <DistanceItem place="편의점" distance="도보 2분" />
                <DistanceItem place="카페" distance="도보 5분" />
              </div>
            </div>
          </div>

          {/* 우측 영역: 버튼 + 기본 정보 + 문의하기 전체 sticky */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="space-y-6">
              {/* 인프라 보기 / 3D 보기 버튼 */}
              <div className="flex w-full gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/infra-view?propertyId=${property.propertyId}`)
                  }
                  className="flex-1 rounded-xl bg-secondary px-5 py-3 text-base font-semibold text-primary-foreground shadow-md transition-all hover:bg-purple-700 hover:shadow-lg"
                >
                  인프라 보기
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/3d-view?propertyId=${property.propertyId}`)
                  }
                  className="flex-1 rounded-xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-md transition-all hover:bg-green-800 hover:shadow-lg"
                >
                  3D 보기
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-foreground">
                  기본 정보
                </h3>

                <div className="space-y-3">
                  <InfoRow label="면적" value={property.areaLabel} />
                  <InfoRow label="층수" value={property.floorLabel} />
                  <InfoRow
                    label="관리비"
                    value={property.maintenanceFeeLabel}
                  />
                  <InfoRow label="주소" value={property.address} />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-foreground">
                  문의하기
                </h3>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-md transition-all hover:bg-green-800 hover:shadow-lg">
                  <Phone className="h-4 w-4" />
                  부동산 연결하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DistanceItem({ place, distance }: { place: string; distance: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-accent-purple-lighter bg-accent-purple-bg px-4 py-3">
      <span className="text-sm text-text-secondary">{place}</span>
      <span className="text-sm font-semibold text-accent-purple">{distance}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-beige-300 bg-green-300 px-4 py-3">
      <span className="text-sm font-medium text-accent">{label}</span>
      <span className="text-base font-semibold text-text-secondary">{value}</span>
    </div>
  );
}