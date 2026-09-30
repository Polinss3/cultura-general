import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePremium } from '@/hooks/usePremium';
import { getCurrentAppIcon, needsIconReset, setAppIcon } from '@/lib/appIcon';

/**
 * Devuelve el icono principal a quien tiene puesto uno PRO sin tener PRO
 * activo (caducó, lo canceló o cerró sesión).
 *
 * Solo actúa con el estado PRO ya resuelto y con RevenueCat disponible: un
 * build sin el SDK siempre diría "no PRO" y quitaría el icono sin motivo. El
 * aviso propio va antes del de iOS para que el cambio no pille por sorpresa.
 */
export function AppIconGuard() {
  const { t } = useTranslation();
  const { isPro, ready, unavailable } = usePremium();
  const prompted = useRef(false);

  useEffect(() => {
    if (!ready || unavailable || prompted.current) return;
    if (!needsIconReset(getCurrentAppIcon(), isPro)) return;
    prompted.current = true;
    Alert.alert(t('appIcon.resetTitle'), t('appIcon.resetBody'), [
      { text: t('appIcon.resetConfirm'), onPress: () => { void setAppIcon('default'); } },
    ], { cancelable: false });
  }, [isPro, ready, unavailable, t]);

  return null;
}
