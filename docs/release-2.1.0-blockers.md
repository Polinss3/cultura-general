# Bloqueos de lanzamiento — versión 2.1.0

La 2.1.0 no debe enviarse a producción hasta cerrar los dos bloques de este
documento. Las cifras del banco de preguntas se comprobaron contra producción
el 28 de agosto de 2026 y deben volver a calcularse al generar el manifiesto
definitivo.

## 1. Aventura sin preguntas repetidas

### Estado cerrado

- Se ha elegido el punto medio: 200 niveles de 10 preguntas.
- Producción tiene 2.000 preguntas activas, todas completas en español e inglés.
- La versión 1 del manifiesto contiene 2.000 IDs distintos: 10 por nivel, sin
  reutilizar ninguno entre los 200 niveles.
- Los niveles descargados se conservan en caché para rejugarlos sin conexión;
  no existe ya el fallback circular de 49 preguntas.

### Decisión adoptada

Elegir **una** de estas dimensiones antes de preparar la build:

| Opción | Niveles | Preguntas necesarias | Preguntas nuevas mínimas* |
| --- | ---: | ---: | ---: |
| Reducir el recorrido | 150 | 1.500 | 0 (sobran 89) |
| **Punto medio (elegida)** | **200** | **2.000** | **411, añadidas** |
| Mantener el diseño completo | 400 | 4.000 | 2.411 |

\* Suponiendo que las 1.589 preguntas activas actuales superan la revisión de
calidad y se incluyen una sola vez.

### Criterios obligatorios de cierre

- [x] Elegir y documentar una de las tres opciones.
- [x] Sustituir el fallback circular de 49 preguntas por un manifiesto
      versionado e inmutable de IDs reales.
- [x] Asignar exactamente 10 IDs distintos a cada nivel y no reutilizar ningún
      ID entre niveles. Rejugar el mismo nivel sí conserva sus mismas preguntas.
- [x] Usar los mismos IDs para español e inglés; el idioma no crea una
      asignación diferente.
- [x] Añadir un validador que falle si falta un ID, hay un ID inactivo, un nivel
      no tiene 10 preguntas o una pregunta aparece en más de un nivel.
- [x] Probar el manifiesto completo, no solo una muestra de niveles, antes de
      generar la build de producción.

Las nuevas preguntas están activas en el catálogo general, por lo que entran
automáticamente en Aprender, Contrarreloj, Ascenso, Amigos y en la selección de
Pregunta Diaria. La pestaña Retos conserva sus catálogos específicos de
banderas y años; no consume preguntas de cultura general.

## 2. Notificaciones útiles y limitadas

### Reglas aprobadas para la 2.1.0

1. **09:00 — Pregunta diaria.** Se muestra todos los días, en la hora local del
   dispositivo, si el usuario ha autorizado las notificaciones.
2. **20:00 — Recordatorio condicionado.** Solo se muestra si la pregunta diaria
   de ese día sigue sin completarse. Al completarla antes de las 20:00 se debe
   cancelar únicamente este aviso.
3. **Reactivación tras dos días sin entrar.** Se muestra una sola vez por episodio
   de inactividad. Para no sumar un tercer aviso, sustituye el texto del
   recordatorio de las 20:00 de ese día en vez de añadirse a él.

La reactivación puede elegir una variante con datos que ya conoce la app:

- con racha activa: recordar la racha;
- con progreso en Aventura: invitar a continuar desde el siguiente nivel;
- sin contexto suficiente: mensaje general de regreso.

No se añaden en esta versión avisos semanales, promociones ni cadenas de
mensajes a los 3, 5 y 7 días. Se evaluarán más adelante con métricas de apertura
y desactivación.

### Límites de frecuencia

- Máximo de 2 notificaciones de la app por día.
- La reactivación no se vuelve a enviar durante el mismo episodio de inactividad.
  Al volver a abrir la app empieza un episodio nuevo y se desplaza dos días.
- Nunca enviar el aviso de las 20:00 si la pregunta diaria figura completada.
- Desactivar notificaciones desde Perfil cancela todos los avisos gestionados
  por la app; completar la diaria solo cancela el aviso correspondiente a ese
  día.
- Invitados y usuarios con cuenta reciben las mismas reglas locales, siempre
  que hayan dado permiso.

### Implementación necesaria

El código anterior solo programaba un recordatorio diario a las 09:00 y usaba
`cancelAllScheduledNotificationsAsync`. La implementación de la 2.1.0 lo
sustituye por un plan local de 60 días que se renueva en cada apertura:

- [x] Gestionar por separado los identificadores del aviso de las 09:00, el de
      las 20:00 y el de reactivación; no usar una cancelación global para una
      acción parcial.
- [x] Confirmar la propuesta de reactivación y sus variantes.
- [x] Programar los avisos en la zona horaria local y reconstruir el calendario
      cuando cambien permisos, idioma, hora o zona horaria.
- [x] Cancelar el aviso de las 20:00 inmediatamente después de guardar con éxito
      la respuesta diaria.
- [x] Registrar la última apertura y reprogramar/cancelar la reactivación al
      entrar en la app.
- [x] Abrir directamente la Pregunta del Día al tocar los avisos de las 09:00 o
      las 20:00; el aviso de Aventura debe abrir el mapa o el nivel pendiente.
- [x] Añadir textos ES/EN para cada variante, sin incluir datos sensibles en la
      pantalla bloqueada.
- [x] Mantener un único interruptor general en Perfil en esta versión.

### Matriz mínima de QA

- [ ] Permiso aceptado, denegado y revocado desde ajustes del sistema.
- [ ] Diaria completada antes y después de las 20:00.
- [ ] App cerrada durante todo el día y durante más de dos días.
- [ ] Apertura de la app antes de que venza la reactivación.
- [ ] Cambio de español a inglés y viceversa con avisos ya programados.
- [ ] Cambio de zona horaria y cambio horario de verano/invierno.
- [ ] Usuario invitado, usuario con cuenta y dispositivo sin conexión.
- [ ] Toque en cada notificación con la app cerrada, en segundo plano y abierta.
- [x] Verificar automáticamente que nunca se programa más de un aviso vespertino
      en un mismo día; junto al recordatorio único de las 09:00, el máximo es 2.

## Cierre de versión

- [x] Bloque 1 aprobado, implementado y validado.
- [ ] Bloque 2 implementado y aprobado en dispositivo físico iOS y Android.
- [x] Repetir el recuento de preguntas activas de producción: 2.000.
- [x] Actualizar notas de revisión y ficha de tienda si cambia el número final de
      niveles de Aventura.
