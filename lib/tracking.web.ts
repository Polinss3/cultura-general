export type TrackingDecision = 'granted' | 'denied' | 'unavailable';

export async function ensureTrackingPermission(): Promise<TrackingDecision> {
  return 'unavailable';
}

