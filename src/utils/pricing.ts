/**
 * Pickup-request pricing for tricycle e-hailing in Naga City.
 * Single source of truth so any future server-side validation matches the UI.
 *
 *   fare = baseFare + (distanceKm × ratePerKm)
 */
export const PICKUP_BASE_FARE = 15;
export const PICKUP_RATE_PER_KM = 5;

export type FareBreakdown = {
  baseFare: number;
  ratePerKm: number;
  distanceKm: number;
  distanceCost: number;
  offerAmount: number;
  total: number;
};

export function calculateFare(
  distanceKm: number,
  offerAmount: number = 0,
  passengerCount: number = 1
): FareBreakdown {
  const safeDistance = Number.isFinite(distanceKm) && distanceKm > 0 ? distanceKm : 0;
  // The first 3km are covered by the base fare
  const billableDistance = Math.max(0, safeDistance - 3);
  const distanceCost = Math.ceil(billableDistance * PICKUP_RATE_PER_KM);
  const totalBaseFare = PICKUP_BASE_FARE * passengerCount;
  const total = Math.ceil(totalBaseFare + distanceCost + offerAmount);
  return {
    baseFare: PICKUP_BASE_FARE,
    ratePerKm: PICKUP_RATE_PER_KM,
    distanceKm: safeDistance,
    distanceCost,
    offerAmount,
    total,
  };
}

export function formatPHP(amount: number): string {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
