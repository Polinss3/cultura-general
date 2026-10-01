import { useCallback, useEffect, useRef } from 'react';
import { REVIEW_PROMPT_DELAY_MS } from '@/lib/appReview';

/**
 * Dispara un aviso de valoración (el trigger que devuelven los planificadores
 * de lib/appReview) con la pantalla de resultado ya quieta, y lo cancela si
 * la pantalla se desmonta antes: iOS descarta el diálogo en mitad de una
 * transición y el intento se perdería igual.
 */
export function useReviewPrompt() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (!timer.current) return;
    clearTimeout(timer.current);
    timer.current = null;
  }, []);

  useEffect(() => cancel, [cancel]);

  const schedule = useCallback((trigger: (() => Promise<void>) | null) => {
    cancel();
    if (!trigger) return;
    timer.current = setTimeout(() => {
      timer.current = null;
      void trigger();
    }, REVIEW_PROMPT_DELAY_MS);
  }, [cancel]);

  return { schedule, cancel };
}
