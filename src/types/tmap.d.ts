export {};

declare global {
  type TmapLatLng = {
    lat?: number | (() => number);
    lng?: number | (() => number);
    getLat?: () => number;
    getLng?: () => number;
    _lat?: number;
    _lng?: number;
  };

  type TmapMap = {
    getCenter?: () => TmapLatLng;
  };

  type TmapMarker = {
    setMap: (map: TmapMap | null) => void;
    addListener?: (eventName: string, handler: () => void) => void;
  };

  type TmapPolyline = {
    addListener: (eventName: string, handler: () => void) => void;
  };

  type TmapSize = object;
  type TmapPoint = object;

  type TmapMarkerOptions = {
    position: TmapLatLng;
    map: TmapMap;
    title?: string | null;
    iconHTML?: string;
    iconSize?: TmapSize;
    iconAnchor?: TmapPoint;
    zIndex?: number;
  };

  type TmapPolylineOptions = {
    path: TmapLatLng[];
    strokeColor: string;
    strokeWeight: number;
    strokeOpacity: number;
    strokeStyle?: "dash" | "solid";
    map: TmapMap;
  };

  type TmapNamespace = {
    Map: new (
      elementId: string,
      options: {
        center: TmapLatLng;
        width: string;
        height: string;
        zoom: number;
      }
    ) => TmapMap;
    LatLng: new (lat: number, lng: number) => TmapLatLng;
    Marker: new (options: TmapMarkerOptions) => TmapMarker;
    Polyline: new (options: TmapPolylineOptions) => TmapPolyline;
    Size: new (width: number, height: number) => TmapSize;
    Point: new (x: number, y: number) => TmapPoint;
  };

  interface Window {
    Tmapv2?: TmapNamespace;
  }
}
