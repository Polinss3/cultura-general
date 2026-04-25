import { ScrollView, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const SECTIONS = [
  {
    title: '1. Información que recopilamos',
    body: `Recopilamos la siguiente información cuando usas Cultura General:

• Dirección de correo electrónico (para crear tu cuenta)
• Nombre de usuario que eliges
• Respuestas a preguntas (para calcular tus estadísticas)
• Racha de días, puntuaciones y récords personales

No recopilamos información de geolocalización, contactos ni otros datos sensibles.`,
  },
  {
    title: '2. Cómo usamos tu información',
    body: `Usamos tus datos únicamente para:

• Mostrar tu perfil y estadísticas dentro de la app
• Calcular rankings diarios, semanales y globales
• Mantener tu racha de respuestas consecutivas
• Enviarte notificaciones locales si las activas (solo en tu dispositivo)

No vendemos ni compartimos tus datos con terceros con fines comerciales.`,
  },
  {
    title: '3. Almacenamiento de datos',
    body: `Tus datos se almacenan de forma segura en Supabase (PostgreSQL), con cifrado en tránsito (HTTPS/TLS). Las contraseñas nunca se almacenan en texto plano.

Las preguntas y respuestas se pueden cachear localmente en tu dispositivo para permitir el uso sin conexión.`,
  },
  {
    title: '4. Notificaciones push',
    body: `Si activas las notificaciones, Cultura General enviará un recordatorio diario a las 9:00 para que no pierdas tu racha. Las notificaciones son completamente locales y puedes desactivarlas en cualquier momento desde el perfil o los ajustes de tu sistema.`,
  },
  {
    title: '5. Tus derechos',
    body: `Tienes derecho a:

• Acceder a tus datos en cualquier momento (desde la pantalla de perfil)
• Modificar tu nombre de usuario
• Eliminar tu cuenta (contáctanos en el correo indicado)
• Exportar tus datos bajo petición`,
  },
  {
    title: '6. Menores de edad',
    body: `Cultura General está dirigido a mayores de 13 años. No recopilamos conscientemente datos de menores de 13 años. Si crees que tu hijo ha creado una cuenta, contáctanos para eliminarla.`,
  },
  {
    title: '7. Contacto',
    body: `Para cualquier pregunta sobre esta política de privacidad o para solicitar la eliminación de tus datos, contacta con nosotros en:

pablobrasero@gmail.com`,
  },
  {
    title: '8. Cambios en esta política',
    body: `Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos a través de la app. El uso continuado de la app implica la aceptación de la política actualizada.`,
  },
];

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, marginBottom: 8 }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 22 }}>←</Text>
        </Pressable>
        <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'Outfit_700Bold' }}>Política de privacidad</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: 'Outfit_400Regular', marginBottom: 28 }}>
          Última actualización: abril 2026
        </Text>

        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Outfit_400Regular', lineHeight: 22, marginBottom: 32 }}>
          En Cultura General nos tomamos tu privacidad en serio. Esta política explica qué datos recopilamos, cómo los usamos y cómo los protegemos.
        </Text>

        {SECTIONS.map((s, i) => (
          <View key={i} style={{ marginBottom: 28 }}>
            <Text style={{ color: '#e8a030', fontSize: 15, fontFamily: 'Outfit_700Bold', marginBottom: 10 }}>
              {s.title}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, fontFamily: 'Outfit_400Regular', lineHeight: 22 }}>
              {s.body}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
