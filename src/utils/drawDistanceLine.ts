type LatLngPoint = {
  lat: number;
  lng: number;
};

type DrawDistanceLineParams = {
  map: any;
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
  if (!window.Tmapv2) return;

  const fromPosition = new window.Tmapv2.LatLng(from.lat, from.lng);
  const toPosition = new window.Tmapv2.LatLng(to.lat, to.lng);

  new window.Tmapv2.Polyline({
    path: [fromPosition, toPosition],
    strokeColor,
    strokeWeight: 4,
    strokeOpacity: 0.75,
    strokeStyle: "dash",
    map,
  });
}