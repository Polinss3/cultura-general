/** UIKit may reject a request after the icon has already changed (for example,
 * when a system interaction interrupts its confirmation alert). Check the
 * actual icon before telling the user the change failed. */
export async function iconChangedDespiteError(
  expectedName: string | null,
  readName: () => string | null,
  wait: (ms: number) => Promise<void> = ms => new Promise(resolve => setTimeout(resolve, ms)),
): Promise<boolean> {
  for (const delay of [0, 150, 300, 600, 900]) {
    if (delay) await wait(delay);
    try {
      if (readName() === expectedName) return true;
    } catch {
      // The native module can also be temporarily unavailable during a UI transition.
    }
  }
  return false;
}
