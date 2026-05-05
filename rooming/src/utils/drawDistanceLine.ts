import { createDistanceLabelHTML } from "./createDistanceLabelHTML";

type LatLngPoint = {
  lat: number;
  lng: number;
};

type DrawDistanceLineParams = {
  map: any;
  from: LatLngPoint;
  to: LatLngPoint;
  label: string;
  strokeColor: string;
};

export function drawDistanceLine({
  map,
  from,
  to,
  label,
  strokeColor,
}: DrawDistanceLineParams) {
  if (!window.Tmapv2) return;

  const fromPosition = new window.Tmapv2.LatLng(from.lat, from.lng);
  const toPosition = new window.Tmapv2.LatLng(to.lat, to.lng);

  const distanceLine = new window.Tmapv2.Polyline({
    path: [fromPosition, toPosition],
    strokeColor,
    strokeWeight: 4,
    strokeOpacity: 0.75,
    strokeStyle: "dash",
    map,
  });

  const middleLat = (from.lat + to.lat) / 2;
  const middleLng = (from.lng + to.lng) / 2;

  let labelMarker: any = null;

  const showLabel = () => {
    if (labelMarker) return;

    labelMarker = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(middleLat, middleLng),
      map,
      iconHTML: createDistanceLabelHTML(label),
      iconSize: new window.Tmapv2.Size(72, 28),
      iconAnchor: new window.Tmapv2.Point(36, 14),
    });
  };

  const hideLabel = () => {
    if (!labelMarker) return;

    labelMarker.setMap(null);
    labelMarker = null;
  };

  distanceLine.addListener("mouseenter", showLabel);
  distanceLine.addListener("mouseleave", hideLabel);
}