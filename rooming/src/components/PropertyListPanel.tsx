import { useNavigate } from "react-router";
import { properties, type Property } from "../data/dummyProperties";

export default function PropertyListPanel() {
  const navigate = useNavigate();

  const recommendedProperties = properties.slice(0, 3);

  return (
    <div className="absolute bottom-5 left-5 z-10 w-[260px] rounded-2xl border border-[#E8E6DD] bg-white/95 p-4 shadow-md backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-[#4A4530]">매물 목록</h3>
        <button
          type="button"
          onClick={() => navigate("/results")}
          className="text-xs font-medium text-[#8B89DD] hover:text-[#6B67BB]"
        >
          전체보기
        </button>
      </div>

      <div className="space-y-2.5">
        {recommendedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
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
      onClick={() => navigate(`/property/${property.id}`)}
      className="w-full rounded-xl border border-[#EEECCA] bg-white p-3 text-left shadow-sm transition hover:border-[#C1BFFF] hover:bg-[#F5F5FF]"
    >
      <div className="text-sm font-semibold text-[#6B6847]">
        {property.title}
      </div>

      <div className="mt-0.5 text-xs font-medium text-[#BDB96A]">
        {property.price}
      </div>

      <div className="mt-0.5 text-[11px] text-[#8B8850]">
        {property.distance}
      </div>
    </button>
  );
}