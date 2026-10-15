/** Bounded decoded-image cache; independent of React and native modules. */
export function createCityImageQueue<T>(load: (url: string) => Promise<T>, capacity = 8, concurrency = 3, timeoutMs = 15000) {
  const ready = new Map<string, T>();
  const pending = new Map<string, Promise<T>>();
  const jobs: Array<() => void> = [];
  let running = 0;
  const pump = () => { while (running < concurrency && jobs.length) jobs.shift()!(); };
  const get = (url: string): T | undefined => {
    const value = ready.get(url);
    if (value !== undefined) { ready.delete(url); ready.set(url, value); }
    return value;
  };
  const ensure = (url: string, priority = false): Promise<T> => {
    const cached = get(url);
    if (cached !== undefined) return Promise.resolve(cached);
    const existing = pending.get(url);
    if (existing) return existing;
    let resolve!: (value: T) => void, reject!: (error: unknown) => void;
    const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
    pending.set(url, promise);
    const job = () => {
      running++;
      let timer: ReturnType<typeof setTimeout>;
      const deadline = new Promise<T>((_, no) => { timer = setTimeout(() => no(new Error('Image load timed out')), timeoutMs); });
      Promise.race([Promise.resolve().then(() => load(url)), deadline]).then(value => {
        ready.set(url, value);
        while (ready.size > capacity) ready.delete(ready.keys().next().value!);
        resolve(value);
      }, reject).finally(() => {
        clearTimeout(timer!); pending.delete(url); running--; pump();
      });
    };
    if (priority) jobs.unshift(job); else jobs.push(job);
    pump();
    return promise;
  };
  return { get, ensure };
}
