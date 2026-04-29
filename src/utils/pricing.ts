/**
 * Pickup-request pricing for tricycle e-hailing in Naga City.
 * Single source of truth so any future server-side validation matches the UI.
 *
 *   fare = baseFare + (distanceKm × ratePerKm)
 */
export const PICKUP_BASE_FARE = 30;
export const PICKUP_RATE_PER_KM = 12;

export type FareBreakdown = {
  baseFare: number;
  ratePerKm: number;
  distanceKm: number;
  distanceCost: number;
  total: number;
};

export function calculateFare(distanceKm: number): FareBreakdown {
  const safeDistance = Number.isFinite(distanceKm) && distanceKm > 0 ? distanceKm : 0;
  const distanceCost = Math.round(safeDistance * PICKUP_RATE_PER_KM * 100) / 100;
  const total = Math.round((PICKUP_BASE_FARE + distanceCost) * 100) / 100;
  return {
    baseFare: PICKUP_BASE_FARE,
    ratePerKm: PICKUP_RATE_PER_KM,
    distanceKm: safeDistance,
    distanceCost,
    total,
  };
}

export function formatPHP(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
