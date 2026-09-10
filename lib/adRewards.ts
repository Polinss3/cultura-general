// ─── Recompensas de anuncio: una vez por recibo ──────────────────────────────
//
// El servidor de anuncios firma un recibo cuando la recompensa se gana de
// verdad (duración visible mínima y, en vídeo, reproducción completa). Ese
// recibo es la única autorización válida: cerrar antes de tiempo, un error de
// red o la falta de campaña no conceden nada.
//
// El efecto vive en NUESTRO dominio —monedas en Supabase, una vida en Ascenso—
// y el visor puede reintentar la misma presentación con el mismo recibo, así
// que hace falta un libro mayor propio. Se guarda en AsyncStorage porque el
// recibo tiene que sobrevivir a que el usuario mate la app justo entre ganarlo
// y aplicarlo.
//
// Dos estados por recibo, en este orden:
//
//   'claimed' → reservado antes de tocar nada. Bloquea una segunda concesión
//               aunque el proceso muera a mitad.
//   'applied' → el efecto se aplicó. Ya no se vuelve a intentar.
//
// Un recibo en 'claimed' sí se reintenta: significa que el efecto falló (red
// caída, RPC roto) y el usuario se quedó sin lo que se había ganado. Reintentar
// es correcto porque el recibo es el mismo; lo que no puede pasar nunca es que
// un solo anuncio conceda dos veces.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ads_reward_receipts_v1';
/** Suficiente para cualquier sesión real; evita que el registro crezca sin fin. */
const MAX_RECEIPTS = 200;

type ReceiptState = 'claimed' | 'applied';
type Ledger = Record<string, ReceiptState>;

export type GrantOutcome = 'applied' | 'duplicate' | 'failed';

/** Lo mínimo que necesitamos de AsyncStorage; las pruebas pasan el suyo. */
export interface RewardLedgerStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

function isLedger(value: unknown): value is Ledger {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.values(value).every(state => state === 'claimed' || state === 'applied');
}

export function createRewardLedger(storage: RewardLedgerStorage) {
  /** Un mismo recibo no puede aplicarse dos veces en paralelo dentro del proceso. */
  const inFlight = new Set<string>();
  let cache: Ledger | null = null;

  async function read(): Promise<Ledger> {
    if (cache) return cache;
    try {
      const raw = await storage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      cache = isLedger(parsed) ? parsed : {};
    } catch {
      cache = {};
    }
    return cache;
  }

  async function write(ledger: Ledger): Promise<void> {
    // El orden de inserción de las claves es el de llegada: los recibos más
    // viejos van primero y son justo los que sobran.
    const entries = Object.entries(ledger);
    const trimmed = entries.length > MAX_RECEIPTS
      ? Object.fromEntries(entries.slice(entries.length - MAX_RECEIPTS))
      : ledger;
    cache = trimmed;
    try {
      await storage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // Sin almacenamiento la protección se queda en memoria durante esta
      // sesión. Peor que persistir, mejor que perder la recompensa ganada.
    }
  }

  return {
    /**
     * Aplica el efecto de un recibo exactamente una vez.
     *
     * `apply` debe devolver `true` solo si el efecto quedó realmente hecho. Si
     * devuelve `false` o lanza, el recibo se conserva en 'claimed' y un
     * reintento posterior con ese mismo recibo volverá a intentarlo.
     */
    async grantRewardOnce(receipt: string, apply: () => Promise<boolean>): Promise<GrantOutcome> {
      // La reserva es SÍNCRONA y va antes del primer `await`: si esperásemos a
      // leer el libro mayor, dos toques seguidos del botón pasarían los dos por
      // el hueco y el mismo anuncio pagaría dos veces.
      if (!receipt || inFlight.has(receipt)) return 'duplicate';
      inFlight.add(receipt);
      try {
        const ledger = await read();
        if (ledger[receipt] === 'applied') return 'duplicate';
        await write({ ...ledger, [receipt]: 'claimed' });
        if (!(await apply())) return 'failed';
        await write({ ...(cache ?? {}), [receipt]: 'applied' });
        return 'applied';
      } catch {
        return 'failed';
      } finally {
        inFlight.delete(receipt);
      }
    },

    /** Solo para pruebas: vacía el libro mayor en memoria y en disco. */
    async reset(): Promise<void> {
      cache = {};
      inFlight.clear();
      try {
        await storage.removeItem(STORAGE_KEY);
      } catch {
        // Nada que hacer: el libro mayor en memoria ya está vacío.
      }
    },
  };
}

const ledger = createRewardLedger(AsyncStorage);

export const grantRewardOnce = ledger.grantRewardOnce;
export const resetRewardLedger = ledger.reset;
