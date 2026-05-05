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
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCF8] px-6">
        <div className="w-full max-w-md rounded-3xl border border-[#E8E6DD] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#4A4530]">
            매물을 찾을 수 없어요
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#8B8850]">
            요청한 매물 정보가 존재하지 않거나 삭제되었을 수 있어요.
          </p>

          <button
            type="button"
            onClick={() => navigate("/map")}
            className="mt-6 rounded-xl bg-[#4A4530] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#3A3520]"
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
    <div className="min-h-screen bg-[#FDFCF8]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* 좌측 메인 영역 */}
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex w-fit items-center gap-2 rounded-xl border border-[#E8E6DD] bg-white px-5 py-3 text-base font-semibold text-[#6B6847] transition-all hover:bg-[#FDFCF8]"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              뒤로가기
            </button>

            {/* 매물 사진 + 정보 오버레이 */}
            <div className="relative flex h-[430px] items-center justify-center overflow-hidden rounded-3xl border border-[#E8E6DD] bg-gradient-to-br from-[#E8E6DD]/30 to-[#D8D7F5]/30 shadow-sm">
              <div className="text-center">
                <Home className="mx-auto mb-3 h-20 w-20 text-[#6B6847]" />
                <div className="text-base font-medium text-[#6B6847]">
                  매물 사진 영역
                </div>
              </div>

              {/* 하단 오버레이 */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-6 pb-6 pt-24">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full border border-white/40 bg-white/90 px-3 py-1 text-xs font-semibold text-[#5A58AA]">
                    AI 추천
                  </span>
                  <span className="rounded-full border border-white/40 bg-white/90 px-3 py-1 text-xs font-semibold text-[#8B8850]">
                    원룸
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-white">
                  {property.title}
                </h1>

                <p className="mt-2 text-3xl font-bold text-[#FDFBD4]">
                  {property.price}
                </p>

                <p className="mt-2 line-clamp-1 text-sm leading-6 text-white/85">
                  {description}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#D8D7F5] bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-1.5 text-lg font-bold text-[#5A58AA]">
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

            <div className="rounded-2xl border border-[#E8DBFF] bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#8E3BA8]">
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
                  className="flex-1 rounded-xl bg-[#8B89DD] px-5 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-[#7471CC] hover:shadow-lg"
                >
                  인프라 보기
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/3d-view?propertyId=${property.id}`)}
                  className="flex-1 rounded-xl bg-[#4A4530] px-5 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-[#3A3520] hover:shadow-lg"
                >
                  3D 보기
                </button>
              </div>

              <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-[#4A4530]">
                  기본 정보
                </h3>

                <div className="space-y-3">
                  <InfoRow label="면적" value={area} />
                  <InfoRow label="층수" value={floor} />
                  <InfoRow label="관리비" value={maintenanceFee} />
                  <InfoRow label="주소" value={address} />
                </div>
              </div>

              <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-[#4A4530]">
                  문의하기
                </h3>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A4530] px-4 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-[#3A3520] hover:shadow-lg">
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
    <div className="flex items-start gap-3 rounded-xl border border-[#E8E7FF] bg-[#F8F8FF] px-4 py-3">
      <Icon className="mt-0.5 h-5 w-5 text-[#5A58AA]" />
      <span className="text-sm leading-6 text-[#5A58AA]">{text}</span>
    </div>
  );
}

function DistanceItem({ place, distance }: { place: string; distance: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#F0E5FF] bg-[#FFF8FF] px-4 py-3">
      <span className="text-sm text-[#6B6847]">{place}</span>
      <span className="text-sm font-semibold text-[#8E3BA8]">{distance}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#EEECCA] bg-[#FDFBD4] px-4 py-3">
      <span className="text-sm font-medium text-[#BDB96A]">{label}</span>
      <span className="text-base font-semibold text-[#6B6847]">{value}</span>
    </div>
  );
}