export interface AsyncGateResult<T> {
  started: boolean;
  value?: T;
}

/**
 * Exclusión mutua mínima para acciones de interfaz asíncronas. A diferencia de
 * un estado de React, el bloqueo se activa en el mismo tick en el que se pulsa
 * y siempre se libera aunque la operación falle.
 */
export function createAsyncGate() {
  let locked = false;

  return {
    isLocked: () => locked,
    async run<T>(task: () => Promise<T>): Promise<AsyncGateResult<T>> {
      if (locked) return { started: false };
      locked = true;
      try {
        return { started: true, value: await task() };
      } finally {
        locked = false;
      }
    },
  };
}
