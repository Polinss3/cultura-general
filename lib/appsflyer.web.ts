export function isAppsFlyerConfigured(): boolean { return false; }
export async function startAppsFlyerAfterMeasurementConsent(): Promise<boolean> { return false; }
export function stopAppsFlyerForPrivacy(): void {}
export async function logAppsFlyerEvent(
  _eventName: string,
  _eventValues: Record<string, string | number | boolean> = {},
): Promise<boolean> { return false; }
export function logTutorialCompletion(_skipped: boolean) { return Promise.resolve(false); }
export function logLevelAchieved(_level: number) { return Promise.resolve(false); }
