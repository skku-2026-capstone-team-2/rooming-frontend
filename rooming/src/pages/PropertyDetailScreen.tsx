import { useNavigate } from "react-router";
import { Home, Target, Dumbbell, Store, Phone, Sparkles, ArrowLeft } from "lucide-react";
export default function PropertyDetailScreen() {
  const navigate = useNavigate();
  // const { id } = useParams();
  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* 좌측 메인 영역 */}
          <div className="space-y-6">
            {/* 돌아가기 버튼: sticky 없음 */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex w-fit items-center gap-2 rounded-xl border border-[#E8E6DD] bg-white px-5 py-3 text-base font-semibold text-[#6B6847] transition-all hover:bg-[#FDFCF8]"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              돌아가기
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
                  성대 정문 도보권 원룸
                </h1>

                <p className="mt-2 text-3xl font-bold text-[#FDFBD4]">
                  500 / 55
                </p>

                <p className="mt-2 line-clamp-1 text-sm leading-6 text-white/85">
                  정문까지 도보 12분, 헬스장·편의점 인접
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#D8D7F5] bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-1.5 text-lg font-bold text-[#5A58AA]">
                <Sparkles className="h-4 w-4 shrink-0" />
                AI 추천 이유
              </h3>

              <div className="space-y-3">
                <ReasonItem Icon={Target} text="정문까지 도보 12분, 통학 최적화" />
                <ReasonItem Icon={Dumbbell} text="헬스장 도보 3분, 피트니스 생활권" />
                <ReasonItem Icon={Store} text="편의점·카페 2분 거리, 생활 편의성 우수" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8DBFF] bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#8E3BA8]">
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
                  onClick={() => navigate("/infra-view")}
                  className="flex-1 rounded-xl border border-[#D8D7F5] bg-white px-5 py-3 text-base font-semibold text-[#8B89DD] shadow-sm transition-all hover:bg-[#F8F8FF]"
                >
                  인프라 보기
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/3d-view")}
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
                  <InfoRow label="면적" value="23.1㎡" />
                  <InfoRow label="층수" value="3/5층" />
                  <InfoRow label="관리비" value="5만원" />
                  <InfoRow label="주소" value="종로구 성균관로" />
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