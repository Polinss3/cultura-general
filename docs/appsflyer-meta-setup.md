# AppsFlyer + Meta Ads

La integración nativa está preparada para iOS y Android. El SDK arranca de forma
manual después del consentimiento, usa las señales IAB TCF del CMP de Google y
respeta la decisión de ATT en iOS.

## Identificadores de la aplicación

- iOS bundle ID: `com.polinss3.culturalgeneral`
- Apple App ID: `6766927114`
- Android package: `com.polinss3.culturalgeneral`
- Meta App ID: `996686176323860`

## Credencial en EAS

La variable `EXPO_PUBLIC_APPSFLYER_DEV_KEY` está configurada como `SENSITIVE`
en los entornos `production`, `preview` y `development`. La clave se incorpora
al binario móvil, pero se mantiene fuera del repositorio.

```sh
npx eas-cli@latest env:create \
  --name EXPO_PUBLIC_APPSFLYER_DEV_KEY \
  --value '<APPSFLYER_DEV_KEY>' \
  --visibility sensitive \
  --environment production \
  --environment preview \
  --environment development
```

## Activación en AppsFlyer

1. Añadir la app iOS usando el Apple App ID indicado arriba.
2. Abrir **Collaborate > Partner Marketplace > Meta ads**.
3. Activar **Activate partner** y mantenerlo activo durante las campañas.
4. Introducir el Meta App ID `996686176323860`.
5. Activar **Advanced data sharing** si la base legal y el consentimiento lo permiten.
6. Configurar click-through en 7 días y view-through en 1 día.
7. Mapear los eventos enviados por la app:

   - `af_tutorial_completion` -> tutorial completado
   - `af_level_achieved` -> nivel alcanzado
   - `cg_daily_quiz_completed` -> pregunta diaria completada
   - `cg_speed_quiz_completed` -> contrarreloj completado
   - `cg_ladder_run_completed` -> Modo Ascenso completado

## Activación en Meta

1. Comprobar que la app de Meta está en modo **Live**.
2. Verificar que la plataforma iOS usa `com.polinss3.culturalgeneral` y la ficha
   `https://apps.apple.com/app/id6766927114`.
3. Aceptar las condiciones de **Advanced Mobile Measurement (AMM)** como admin.
4. En Events Manager, confirmar que llegan activaciones y eventos desde una
   build de producción o development build; Expo Go no contiene estos SDK nativos.
5. Crear la campaña seleccionando la app registrada en Meta, no pegando solamente
   la URL de App Store, para conservar la atribución de AppsFlyer.

Android debe publicarse o estar disponible en Google Play antes de crear campañas
de instalación públicas para esa plataforma. Cuando se active Android, añadir
también en AppsFlyer la Install Referrer decryption key proporcionada por Meta.
