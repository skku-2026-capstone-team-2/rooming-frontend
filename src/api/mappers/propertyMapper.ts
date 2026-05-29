/**
 * 매물 API 응답(api.ts) → 화면 view model(view.ts) 변환 mapper.
 *
 * - 숫자/enum 형태의 API 필드를 화면이 바로 쓰는 라벨 문자열로 가공한다.
 * - mock ↔ real 전환 시에도 화면 코드는 view model만 의존하므로 영향받지 않는다.
 * - 추천 이유(explanation)·경로(routeDurationLabel)·favorite는 property가 아니라
 *   recommendation 응답에서 채워지는 값이므로 이 mapper는 다루지 않는다.
 */

import type {
  Property,
  PropertyDetail,
  PropertyImage,
  TradeType,
} from "../../types";
import type { PropertyCardView, PropertyDetailView } from "../../types";

const ROOM_TYPE_LABELS: Record<string, string> = {
  one_room: "원룸",
  two_room: "투룸",
  three_room: "쓰리룸",
  officetel: "오피스텔",
};

/** 원 단위 → "만원 단위 정수" 문자열 (예: 5_000_000 → "500"). */
function toManwon(won: number): string {
  return Math.floor(won / 10000).toLocaleString("ko-KR");
}

/** 원 단위 → 억/만 한글 라벨 (예: 100_000_000 → "1억", 150_000_000 → "1억 5,000만"). */
function toKoreanMoney(won: number): string {
  const eok = Math.floor(won / 100_000_000);
  const man = Math.floor((won % 100_000_000) / 10_000);

  if (eok > 0) {
    return man > 0 ? `${eok}억 ${man.toLocaleString("ko-KR")}만` : `${eok}억`;
  }
  return `${man.toLocaleString("ko-KR")}만`;
}

/** 거래 유형 + 보증금/월세 → 가격 라벨 (예: "500 / 55", "전세 1억"). */
export function formatPriceLabel(
  tradeType: TradeType | null,
  deposit: number | null,
  monthlyRent: number | null
): string {
  if (tradeType === "DEPOSIT_BASIS") {
    return deposit != null ? `전세 ${toKoreanMoney(deposit)}` : "가격 정보 없음";
  }
  if (tradeType === "MONTHLY_RENT") {
    if (deposit == null || monthlyRent == null) return "가격 정보 없음";
    return `${toManwon(deposit)} / ${toManwon(monthlyRent)}`;
  }
  return "가격 정보 없음";
}

/** 거래 유형 라벨 (예: "월세", "전세"). */
export function formatTradeTypeLabel(tradeType: TradeType | null): string {
  if (tradeType === "MONTHLY_RENT") return "월세";
  if (tradeType === "DEPOSIT_BASIS") return "전세";
  return "거래 유형";
}

/** 전용 면적 라벨 (예: "23.5㎡"). */
export function formatAreaLabel(areaM2: number | null): string {
  return areaM2 != null ? `${areaM2}㎡` : "면적 정보 없음";
}

/** 관리비 라벨 (예: "5만원", "없음"). */
export function formatMaintenanceFeeLabel(fee: number | null): string {
  if (fee == null) return "정보 없음";
  if (fee === 0) return "없음";
  return `${toManwon(fee)}만원`;
}

/** 층 정보 라벨 (예: "3층"). */
export function formatFloorLabel(floorInfo: string | null): string {
  return floorInfo ?? "정보 없음";
}

/** 방 구조 라벨 (예: "one_room" → "원룸"). */
export function formatRoomTypeLabel(roomType: string | null): string {
  if (!roomType) return "원룸";
  return ROOM_TYPE_LABELS[roomType] ?? roomType;
}

/** `GET /api/v1/properties` 목록 아이템 → 지도/리스트 카드 view model. */
export function mapPropertyToCardView(p: Property): PropertyCardView {
  return {
    propertyId: p.propertyId,
    title: p.title,
    address: p.address,
    tradeType: p.tradeType,
    priceLabel: formatPriceLabel(p.tradeType, p.deposit, p.monthlyRent),
    areaLabel: formatAreaLabel(p.areaM2),
    description: p.description,
    imageUrl: p.imageUrls?.[0] ?? null,
    lat: p.latitude,
    lng: p.longitude,
    tags: p.tags ?? [],
    has3DModel: p.has3DModel ?? false,
  };
}

/**
 * `GET /api/v1/properties/{id}` 상세 + `GET /api/v1/properties/{id}/images` →
 * 상세 화면 view model.
 */
export function mapPropertyDetailToView(
  detail: PropertyDetail,
  images: PropertyImage[] = []
): PropertyDetailView {
  const imageUrls = [...images]
    .sort((a, b) => a.imageOrder - b.imageOrder)
    .map((image) => image.imageUrl);

  return {
    propertyId: detail.propertyId,
    title: detail.title,
    address: detail.address,
    tradeType: detail.tradeType,
    priceLabel: formatPriceLabel(
      detail.tradeType,
      detail.deposit,
      detail.monthlyRent
    ),
    areaLabel: formatAreaLabel(detail.areaM2),
    floorLabel: formatFloorLabel(detail.floorInfo),
    maintenanceFeeLabel: formatMaintenanceFeeLabel(detail.maintenanceFee),
    roomTypeLabel: formatRoomTypeLabel(detail.roomType),
    description: detail.description,
    tags: detail.tags ?? [],
    has3DModel: detail.has3DModel ?? false,
    imageUrls,
  };
}
