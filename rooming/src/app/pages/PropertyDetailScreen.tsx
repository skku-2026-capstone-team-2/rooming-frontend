import { useNavigate, useParams } from "react-router";
import { Home, Target, Dumbbell, Store, Phone } from "lucide-react";

export default function PropertyDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/results")}
            className="rounded-xl border border-[#E8E6DD] bg-white px-5 py-3 text-base font-semibold text-[#6B6847] hover:bg-[#FDFCF8] transition-all"
          >
            ← 결과로 돌아가기
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/infra-view")}
              className="rounded-xl border border-[#D8D7F5] bg-white px-5 py-3 text-base font-semibold text-[#8B89DD] hover:bg-[#F8F8FF] transition-all"
            >
              주변 인프라 보기
            </button>
            <button
              onClick={() => navigate("/3d-view")}
              className="rounded-xl bg-[#4A4530] px-5 py-3 text-base font-semibold text-white hover:bg-[#3A3520] transition-all shadow-md hover:shadow-lg"
            >
              3D로 보기
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* 좌측 메인 영역 */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-[#4A4530]">성대 정문 도보권 원룸</h1>
              <div className="mt-4 text-3xl font-bold text-[#BDB96A]">500 / 55</div>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-[#F8F8FF] px-3 py-1 text-xs font-medium text-[#5A58AA] border border-[#E8E7FF]">
                  AI 추천
                </span>
                <span className="rounded-full bg-[#FDFCF8] px-3 py-1 text-xs font-medium text-[#8B8850] border border-[#F0EFE8]">
                  원룸
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm h-96 flex items-center justify-center bg-gradient-to-br from-[#E8E6DD]/30 to-[#D8D7F5]/30">
              <div className="text-center">
                <Home className="mx-auto mb-3 h-20 w-20 text-[#6B6847]" />
                <div className="text-base text-[#6B6847]">매물 사진 영역</div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#D8D7F5] bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#5A58AA]">추천 이유</h3>
              <div className="space-y-3">
                <ReasonItem Icon={Target} text="정문까지 도보 12분, 통학 최적화" />
                <ReasonItem Icon={Dumbbell} text="헬스장 도보 3분, 피트니스 생활권" />
                <ReasonItem Icon={Store} text="편의점·카페 2분 거리, 생활 편의성 우수" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8DBFF] bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#8E3BA8]">주요 거리</h3>
              <div className="space-y-2">
                <DistanceItem place="성균관대 정문" distance="도보 12분" />
                <DistanceItem place="헬스장" distance="도보 3분" />
                <DistanceItem place="편의점" distance="도보 2분" />
                <DistanceItem place="카페" distance="도보 5분" />
              </div>
            </div>
          </div>

          {/* 우측 상세 정보 */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#4A4530]">기본 정보</h3>
              <div className="space-y-3">
                <InfoRow label="면적" value="23.1㎡" />
                <InfoRow label="층수" value="3/5층" />
                <InfoRow label="관리비" value="5만원" />
                <InfoRow label="주소" value="종로구 성균관로" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8E6DD] bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-[#4A4530]">문의하기</h3>
              <button className="w-full rounded-xl bg-[#4A4530] px-4 py-3 text-base font-semibold text-white hover:bg-[#3A3520] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                부동산 연결하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReasonItem({ Icon, text }: { Icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-[#F8F8FF] px-4 py-3 border border-[#E8E7FF]">
      <Icon className="h-5 w-5 text-[#5A58AA] mt-0.5" />
      <span className="text-sm leading-6 text-[#5A58AA]">{text}</span>
    </div>
  );
}

function DistanceItem({ place, distance }: { place: string; distance: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#FFF8FF] px-4 py-3 border border-[#F0E5FF]">
      <span className="text-sm text-[#6B6847]">{place}</span>
      <span className="text-sm font-semibold text-[#8E3BA8]">{distance}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#FDFBD4] px-4 py-3 border border-[#EEECCA]">
      <span className="text-sm font-medium text-[#BDB96A]">{label}</span>
      <span className="text-base font-semibold text-[#6B6847]">{value}</span>
    </div>
  );
}