export function isAppsFlyerConfigured(): boolean { return false; }
export async function startAppsFlyerAfterPersonalizedConsent(): Promise<boolean> { return false; }
export function stopAppsFlyerForPrivacy(): void {}
export function logAppsFlyerAdRevenue(_input: {
  revenue: number;
  networkName: string;
  adUnitId: string;
  placement?: string | null;
  adFormat: string;
}): boolean { return false; }
export async function logAppsFlyerEvent(
  _eventName: string,
  _eventValues: Record<string, string | number | boolean> = {},
): Promise<boolean> { return false; }
export function logTutorialCompletion(_skipped: boolean) { return Promise.resolve(false); }
export function logLevelAchieved(_level: number) { return Promise.resolve(false); }

