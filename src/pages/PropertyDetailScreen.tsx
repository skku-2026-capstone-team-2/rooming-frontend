import { useNavigate, useParams } from "react-router";
import {
  Home,
  Target,
  Dumbbell,
  Store,
  Phone,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

import { properties } from "../data/dummyProperties";

export default function PropertyDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  const property = properties.find((item) => String(item.id) === id);

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">
            매물을 찾을 수 없어요
          </h1>

          <p className="mt-3 text-sm leading-6 text-text-tertiary">
            요청한 매물 정보가 존재하지 않거나 삭제되었을 수 있어요.
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

  const area = property.area ?? "23.1㎡";
  const distance = property.distance ?? "정문 도보 12분";
  const description = property.description ?? "생활 인프라가 가까운 추천 매물";
  const floor = "3/5층";
  const maintenanceFee = "5만원";
  const address = "종로구 성균관로";

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
              {property.image ? (
                <img
                  src={property.image}
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
                    원룸
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-primary-foreground">
                  {property.title}
                </h1>

                <p className="mt-2 text-3xl font-bold text-green-300">
                  {property.price}
                </p>

                <p className="mt-2 line-clamp-1 text-sm leading-6 text-primary-foreground/85">
                  {description}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-purple-300 bg-card p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-1.5 text-lg font-bold text-purple-800">
                <Sparkles className="h-4 w-4 shrink-0" />
                AI 추천 이유
              </h3>

              <div className="space-y-3">
                <ReasonItem
                  Icon={Target}
                  text={`${distance}, 통학 접근성이 좋아요`}
                />
                <ReasonItem
                  Icon={Dumbbell}
                  text="헬스장 등 생활 인프라 접근성이 좋아요"
                />
                <ReasonItem
                  Icon={Store}
                  text="편의점·카페 등 일상 편의시설과 BHC가 가까워요"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-accent-purple-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-accent-purple">
                주요 인프라
              </h3>

              <div className="space-y-2">
                <DistanceItem place="성균관대 정문" distance={distance} />
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
                  onClick={() => navigate(`/infra-view?propertyId=${property.id}`)}
                  className="flex-1 rounded-xl bg-secondary px-5 py-3 text-base font-semibold text-primary-foreground shadow-md transition-all hover:bg-purple-700 hover:shadow-lg"
                >
                  인프라 보기
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/3d-view?propertyId=${property.id}`)}
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
                  <InfoRow label="면적" value={area} />
                  <InfoRow label="층수" value={floor} />
                  <InfoRow label="관리비" value={maintenanceFee} />
                  <InfoRow label="주소" value={address} />
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

function ReasonItem({ Icon, text }: { Icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-purple-200 bg-purple-100 px-4 py-3">
      <Icon className="mt-0.5 h-5 w-5 text-purple-800" />
      <span className="text-sm leading-6 text-purple-800">{text}</span>
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