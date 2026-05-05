import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Coffee,
  Dumbbell,
  Store,
  School,
  Home,
  Bus,
} from "lucide-react";

import { properties } from "../data/dummyProperties";
import { infraPlaces } from "../data/dummyInfraPlaces";
import { createPropertyMarkerHTML } from "../utils/createPropertyMarkerHTML";
import { createInfraMarkerHTML } from "../utils/createInfraMarkerHTML";
import { createSchoolMarkerHTML } from "../utils/createSchoolMarkerHTML";
import { drawDistanceLine } from "../utils/drawDistanceLine";
import { drawPedestrianRoute } from "../utils/drawPedestrianRoute";

declare global {
  interface Window {
    Tmapv2: any;
  }
}

const SCHOOL_PLACE = {
  label: "성균관대 정문",
  lat: 37.5849,
  lng: 126.9953,
};

const infraCategoryLabel: Record<string, string> = {
  cafe: "카페",
  gym: "헬스장",
  store: "편의점",
  bus: "버스정류장",
};

const infraCategoryIcon: Record<string, React.ElementType> = {
  cafe: Coffee,
  gym: Dumbbell,
  store: Store,
  bus: Bus,
};

export default function InfraViewScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedPropertyId = searchParams.get("propertyId");

  const selectedProperty = useMemo(() => {
    return (
      properties.find((property) => String(property.id) === selectedPropertyId) ??
      properties[0]
    );
  }, [selectedPropertyId]);

  const nearbyInfraPlaces = useMemo(() => {
    return infraPlaces;
  }, []);

  useEffect(() => {
    const loadTmapScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.Tmapv2?.Map) {
          resolve();
          return;
        }

        const existingScript = document.querySelector<HTMLScriptElement>(
          'script[src*="tmap/jsv2"]'
        );

        if (existingScript) {
          existingScript.onload = () => resolve();
          existingScript.onerror = () => reject();
          return;
        }

        const appKey = import.meta.env.VITE_TMAP_APP_KEY;

        if (!appKey) {
          reject(new Error("VITE_TMAP_APP_KEY가 .env에 설정되어 있지 않습니다."));
          return;
        }

        const script = document.createElement("script");
        script.src = `https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=${appKey}`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();

        document.head.appendChild(script);
      });
    };

    const initMap = async () => {
      try {
        await loadTmapScript();

        const mapContainer = document.getElementById("infra_map_div");
        if (!mapContainer || !window.Tmapv2) return;

        mapContainer.innerHTML = "";

        const map = new window.Tmapv2.Map("infra_map_div", {
          center: new window.Tmapv2.LatLng(
            selectedProperty.lat,
            selectedProperty.lng
          ),
          width: "100%",
          height: "100%",
          zoom: 17,
        });

        // 학교 마커
        new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(SCHOOL_PLACE.lat, SCHOOL_PLACE.lng),
          map,
          iconHTML: createSchoolMarkerHTML(SCHOOL_PLACE.label),
        });

        // 선택 매물 마커
        new window.Tmapv2.Marker({
          position: new window.Tmapv2.LatLng(
            selectedProperty.lat,
            selectedProperty.lng
          ),
          map,
          title: selectedProperty.title,
          iconHTML: createPropertyMarkerHTML(selectedProperty.price),
        });

        // 매물 ↔ 학교 도보 경로
        drawPedestrianRoute({
          map,
          from: {
            lat: selectedProperty.lat,
            lng: selectedProperty.lng,
            name: selectedProperty.title,
          },
          to: {
            lat: SCHOOL_PLACE.lat,
            lng: SCHOOL_PLACE.lng,
            name: SCHOOL_PLACE.label,
          },
          strokeColor: "#6B67BB",
        });

        // 인프라 마커 + 매물과의 점선
        nearbyInfraPlaces.forEach((place) => {
          new window.Tmapv2.Marker({
            position: new window.Tmapv2.LatLng(place.lat, place.lng),
            map,
            iconHTML: createInfraMarkerHTML({
              label: place.label,
              type: place.type,
            }),
          });

          drawDistanceLine({
            map,
            from: {
              lat: selectedProperty.lat,
              lng: selectedProperty.lng,
            },
            to: {
              lat: place.lat,
              lng: place.lng,
            },
            strokeColor: "#BDB96A",
          });
        });
      } catch (error) {
        console.error("Tmap 지도 생성 실패:", error);
      }
    };

    initMap();
  }, [selectedProperty, nearbyInfraPlaces]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#FDFCF8]">
      <div id="infra_map_div" className="h-full w-full" />

      {/* 좌측 상단 뒤로가기 */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-2xl border border-[#3A3830] bg-[#2A2820] px-5 py-3 text-sm font-semibold text-[#FDFCF8] shadow-lg transition hover:bg-[#3A3830]"
      >
        <ArrowLeft className="h-4 w-4" />
        돌아가기
      </button>

      {/* 좌측 하단 인프라 리스트 */}
      <section className="absolute bottom-6 left-6 z-20 w-[390px] rounded-3xl border border-[#E8E6DD] bg-white/95 p-5 shadow-xl backdrop-blur-sm">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#4A4530]">
              주변 생활 인프라
            </h3>
            <p className="mt-1 text-xs text-[#8B8850]">
              선택한 매물 기준으로 가까운 시설을 지도에 표시합니다.
            </p>
          </div>
        </div>

        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {nearbyInfraPlaces.map((place) => {
            const Icon = infraCategoryIcon[place.type] ?? Store;

            return (
              <div
                key={place.id}
                className="flex items-center justify-between rounded-2xl border border-[#EEECCA] bg-[#FDFBD4] p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6B6847] shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-[#4A4530]">
                      {place.label}
                    </div>
                    <div className="text-xs text-[#8B8850]">
                      {infraCategoryLabel[place.type] ?? place.type}
                    </div>
                  </div>
                </div>

                <span className="rounded-full border border-[#E8E7FF] bg-[#F8F8FF] px-3 py-1 text-xs font-semibold text-[#5A58AA]">
                  {place.distance}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 우측 하단 선택 매물 카드 */}
      <section className="absolute bottom-6 right-6 z-20 w-[360px] rounded-3xl border border-[#E8E6DD] bg-white/95 p-4 shadow-xl backdrop-blur-sm">
        {/* 매물 사진 영역 */}
        <div className="relative mb-4 flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-[#E8E6DD] bg-gradient-to-br from-[#E8E6DD]/30 to-[#D8D7F5]/30">
          <div className="text-center">
            <Home className="mx-auto mb-2 h-12 w-12 text-[#6B6847]" />
            <p className="text-xs font-medium text-[#6B6847]">
              매물 사진 영역
            </p>
          </div>

          {/* 하단 오버레이 */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/35 to-transparent px-4 pb-3 pt-12">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#5A58AA]">
                AI 추천
              </span>
              <span className="rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#8B8850]">
                원룸
              </span>
            </div>

            <h2 className="line-clamp-1 text-base font-bold text-white">
              {selectedProperty.title}
            </h2>

            {selectedProperty.description && (
              <p className="mt-0.5 line-clamp-1 text-xs leading-5 text-white/85">
                {selectedProperty.description}
              </p>
            )}
          </div>
        </div>

        {/* 가격 */}
        <div className="flex items-center justify-between rounded-2xl border border-[#EEECCA] bg-[#FDFBD4] px-4 py-3">
          <span className="text-sm font-medium text-[#8B8850]">
            보증금 / 월세
          </span>
          <span className="text-base font-bold text-[#6B6847]">
            {selectedProperty.price}
          </span>
        </div>

        {/* 학교까지 거리 */}
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-[#E8E7FF] bg-[#F8F8FF] px-4 py-3 text-sm text-[#5A58AA]">
          <School className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">
            {SCHOOL_PLACE.label}까지 {selectedProperty.distance ?? "도보 12분"}
          </span>
        </div>
      </section>
    </div>
  );
}