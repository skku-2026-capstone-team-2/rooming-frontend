type LatLngPoint = {
  lat: number;
  lng: number;
};

type DrawDistanceLineParams = {
  map: TmapMap;
  from: LatLngPoint;
  to: LatLngPoint;
  label?: string;
  strokeColor: string;
};

export function drawDistanceLine({
  map,
  from,
  to,
  strokeColor,
}: DrawDistanceLineParams) {
  const tmap = window.Tmapv2;
  if (!tmap) return;

  const fromPosition = new tmap.LatLng(from.lat, from.lng);
  const toPosition = new tmap.LatLng(to.lat, to.lng);

  new tmap.Polyline({
    path: [fromPosition, toPosition],
    strokeColor,
    strokeWeight: 4,
    strokeOpacity: 0.75,
    strokeStyle: "dash",
    map,
  });
}
