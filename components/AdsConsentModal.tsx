import { Modal, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { AdsConsentDecision } from '@/stores/adsConsentStore';
import { AdsConsentForm, type AdsConsentInput } from '@/components/AdsConsentForm';
import { useTheme } from '@/constants/colors';

type Props = {
  visible: boolean;
  initialDecision: AdsConsentDecision | null;
  dismissible: boolean;
  onDismiss: () => void;
  onSave: (input: AdsConsentInput) => Promise<void>;
};

/**
 * Red de seguridad y revisión desde Ajustes. El aviso obligatorio de la
 * primera apertura vive dentro del onboarding (`app/onboarding.tsx`).
 */
export function AdsConsentModal({ visible, initialDecision, dismissible, onDismiss, onSave }: Props) {
  const { C } = useTheme();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      // Un `pageSheet` de iOS se cierra arrastrando hacia abajo y no hay prop
      // que lo impida, así que el aviso "sin salida" se saltaba con un dedo.
      // Cuando no se puede descartar va a pantalla completa; la revisión desde
      // Ajustes sí se queda en hoja, que ahí el gesto es lo natural.
      presentationStyle={dismissible ? 'pageSheet' : 'fullScreen'}
      onRequestClose={dismissible ? onDismiss : undefined}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ flex: 1 }}>
          <AdsConsentForm
            initialDecision={initialDecision}
            onSave={onSave}
            onCancel={dismissible ? onDismiss : undefined}
            resetKey={visible}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
