import assert from 'node:assert/strict';
import test from 'node:test';
import { createRewardLedger, type RewardLedgerStorage } from '@/lib/adRewards';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  const storage: RewardLedgerStorage & { data: Map<string, string> } = {
    data,
    async getItem(key) { return data.get(key) ?? null; },
    async setItem(key, value) { data.set(key, value); },
    async removeItem(key) { data.delete(key); },
  };
  return storage;
}

test('un recibo concede la recompensa una sola vez', async () => {
  const ledger = createRewardLedger(memoryStorage());
  let applied = 0;
  const apply = async () => { applied += 1; return true; };

  assert.equal(await ledger.grantRewardOnce('r1', apply), 'applied');
  assert.equal(await ledger.grantRewardOnce('r1', apply), 'duplicate');
  assert.equal(await ledger.grantRewardOnce('r1', apply), 'duplicate');
  assert.equal(applied, 1);
});

test('recibos distintos son recompensas distintas', async () => {
  const ledger = createRewardLedger(memoryStorage());
  let applied = 0;
  const apply = async () => { applied += 1; return true; };

  assert.equal(await ledger.grantRewardOnce('r1', apply), 'applied');
  assert.equal(await ledger.grantRewardOnce('r2', apply), 'applied');
  assert.equal(applied, 2);
});

test('dos llamadas simultáneas con el mismo recibo solo aplican una', async () => {
  const ledger = createRewardLedger(memoryStorage());
  let applied = 0;
  let release = () => {};
  const gate = new Promise<void>(resolve => { release = resolve; });
  const apply = async () => { await gate; applied += 1; return true; };

  const first = ledger.grantRewardOnce('r1', apply);
  const second = ledger.grantRewardOnce('r1', apply);
  release();

  assert.deepEqual(await Promise.all([first, second]), ['applied', 'duplicate']);
  assert.equal(applied, 1);
});

test('un efecto que falla se puede reintentar con el mismo recibo', async () => {
  const ledger = createRewardLedger(memoryStorage());
  let attempts = 0;
  const flaky = async () => { attempts += 1; return attempts > 1; };

  assert.equal(await ledger.grantRewardOnce('r1', flaky), 'failed');
  assert.equal(await ledger.grantRewardOnce('r1', flaky), 'applied');
  // Y una vez aplicado, ya no se vuelve a intentar nunca.
  assert.equal(await ledger.grantRewardOnce('r1', flaky), 'duplicate');
  assert.equal(attempts, 2);
});

test('un efecto que lanza no marca el recibo como aplicado', async () => {
  const ledger = createRewardLedger(memoryStorage());
  const boom = async (): Promise<boolean> => { throw new Error('RPC caído'); };

  assert.equal(await ledger.grantRewardOnce('r1', boom), 'failed');
  assert.equal(await ledger.grantRewardOnce('r1', async () => true), 'applied');
});

test('el recibo sobrevive a un reinicio del proceso', async () => {
  const storage = memoryStorage();
  let applied = 0;
  const apply = async () => { applied += 1; return true; };

  assert.equal(await createRewardLedger(storage).grantRewardOnce('r1', apply), 'applied');
  // Un libro mayor nuevo sobre el mismo almacenamiento: la app se reabrió.
  assert.equal(await createRewardLedger(storage).grantRewardOnce('r1', apply), 'duplicate');
  assert.equal(applied, 1);
});

test('un recibo vacío nunca concede nada', async () => {
  const ledger = createRewardLedger(memoryStorage());
  let applied = 0;
  assert.equal(await ledger.grantRewardOnce('', async () => { applied += 1; return true; }), 'duplicate');
  assert.equal(applied, 0);
});

test('un almacenamiento corrupto no bloquea la recompensa', async () => {
  const ledger = createRewardLedger(memoryStorage({ ads_reward_receipts_v1: 'no soy JSON' }));
  assert.equal(await ledger.grantRewardOnce('r1', async () => true), 'applied');
});

test('un almacenamiento que falla al escribir sigue protegiendo en memoria', async () => {
  const storage = memoryStorage();
  storage.setItem = async () => { throw new Error('disco lleno'); };
  const ledger = createRewardLedger(storage);
  let applied = 0;
  const apply = async () => { applied += 1; return true; };

  assert.equal(await ledger.grantRewardOnce('r1', apply), 'applied');
  assert.equal(await ledger.grantRewardOnce('r1', apply), 'duplicate');
  assert.equal(applied, 1);
});
