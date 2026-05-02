import { useNavigate } from "react-router";
import { Home, Ruler, Footprints } from "lucide-react";

type Property = {
  id: number;
  title: string;
  price: string;
  description: string;
  image: string;
  area: string;
  distance: string;
};

const properties: Property[] = [
  {
    id: 1,
    title: "성대 정문 도보권 원룸",
    price: "500 / 55",
    description: "정문까지 도보 12분, 헬스장·편의점 인접",
    image: "property1",
    area: "20m²",
    distance: "12분",
  },
  {
    id: 2,
    title: "도서관 인접 원룸",
    price: "1000 / 60",
    description: "학업 중심 생활권, 조용한 환경",
    image: "property2",
    area: "25m²",
    distance: "15분",
  },
  {
    id: 3,
    title: "헬스장 근처 투룸",
    price: "800 / 65",
    description: "생활 인프라 우수, 편의점 도보 2분",
    image: "property3",
    area: "30m²",
    distance: "5분",
  },
  {
    id: 4,
    title: "카페거리 원룸",
    price: "700 / 58",
    description: "감성적인 생활 환경, 대중교통 편리",
    image: "property4",
    area: "22m²",
    distance: "10분",
  },
];

export default function ResultScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFCF8]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#4A4530]">검색 결과</h1>
            <p className="mt-2 text-[#6B6847]">
              {properties.length}개의 추천 매물
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/map")}
            className="rounded-xl border border-[#E8E6DD] bg-white px-5 py-3 text-base font-semibold text-[#6B6847] transition-all hover:bg-[#FDFCF8]"
          >
            지도로 돌아가기
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
}

type PropertyCardProps = {
  property: Property;
};

function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/property-detail")}
      className="group rounded-2xl border border-[#E8E6DD] bg-white p-5 text-left transition-all hover:border-[#BDB96A] hover:shadow-lg"
    >
      <div className="mb-4 flex h-44 items-center justify-center rounded-xl bg-gradient-to-br from-[#E8E6DD]/40 to-[#D8D7F5]/40">
        <Home className="h-16 w-16 text-[#6B6847]" />
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#4A4530] transition-colors group-hover:text-[#BDB96A]">
          {property.title}
        </h3>

        <div className="mt-2 text-xl font-bold text-[#BDB96A]">
          {property.price}
        </div>

        <p className="mt-2 text-sm text-[#6B6847]">{property.description}</p>

        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-full border border-[#E8E7FF] bg-[#F8F8FF] px-3 py-1 text-xs font-medium text-[#5A58AA]">
            AI 추천
          </span>
          <span className="rounded-full border border-[#F0EFE8] bg-[#FDFCF8] px-3 py-1 text-xs font-medium text-[#8B8850]">
            도보 {property.distance}
          </span>
        </div>

        <div className="mt-4 space-y-1 text-sm text-[#8B8850]">
          <div className="flex items-center gap-1.5">
            <Ruler className="h-3.5 w-3.5" />
            {property.area}
          </div>

          <div className="flex items-center gap-1.5">
            <Footprints className="h-3.5 w-3.5" />
            {property.distance}
          </div>
        </div>
      </div>
    </button>
  );
}