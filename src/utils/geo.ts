import { GeoPoint } from '../types';

// Deterministic baseline in South Bengaluru (HSR Layout / Sarjapur Corridor matching sample data)
const BASE_LAT = 12.928;
const BASE_LNG = 77.635;
const SPAN_LAT = 0.055;
const SPAN_LNG = 0.065;

export const toLatLng = (point: GeoPoint | { x: number; y: number; lat?: number; lng?: number }): [number, number] => {
  if (typeof point.lat === 'number' && typeof point.lng === 'number' && !isNaN(point.lat) && !isNaN(point.lng)) {
    return [point.lat, point.lng];
  }
  const lat = BASE_LAT - (point.y / 100) * SPAN_LAT;
  const lng = BASE_LNG + (point.x / 100) * SPAN_LNG;
  return [Number(lat.toFixed(6)), Number(lng.toFixed(6))];
};

export const fromLatLng = (lat: number, lng: number): GeoPoint => {
  const y = Math.max(0, Math.min(100, Math.round(((BASE_LAT - lat) / SPAN_LAT) * 100)));
  const x = Math.max(0, Math.min(100, Math.round(((lng - BASE_LNG) / SPAN_LNG) * 100)));
  return {
    x,
    y,
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
  };
};
