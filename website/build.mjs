import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(root);
const dist = join(root, "dist");
const origin = "https://cg-trivia.pablobrasero.com";
const email = "pablobrasero@gmail.com";
const updatedEs = "12 de septiembre de 2026";
const updatedEn = "September 12, 2026";
// Fecha de la última edición del sitio, para el sitemap. Es distinta de
// `updatedEs`/`updatedEn`, que datan los textos legales: retocar la portada no
// cambia la política de privacidad.
const sitemapUpdated = "2026-08-03";

const locales = {
  es: {
    code: "es", lang: "es", prefix: "", locale: "es_ES", other: "English", otherCode: "EN",
    skip: "Saltar al contenido", navGame: "Cómo se juega", navFeatures: "Lo que encontrarás", navSupport: "Soporte", navPrivacy: "Privacidad",
    home: "Inicio", product: "Producto", help: "Ayuda", legal: "Legal", accessibility: "Accesibilidad",
    privacy: "Privacidad", terms: "Términos de uso", notice: "Aviso legal", cookies: "Cookies", choices: "Opciones de privacidad", deletion: "Eliminar tus datos",
    back: "Volver al inicio", updated: `Última actualización: ${updatedEs}`,
    footer: "Una pregunta cada día y muchas formas de seguir aprendiendo.", effective: `Información vigente desde el ${updatedEs}.`,
    appearance: "Apariencia", themeSystem: "Sistema", themeLight: "Claro", themeDark: "Oscuro",
  },
  en: {
    code: "en", lang: "en", prefix: "/en", locale: "en_US", other: "Español", otherCode: "ES",
    skip: "Skip to content", navGame: "How it works", navFeatures: "What you'll find", navSupport: "Support", navPrivacy: "Privacy",
    home: "Home", product: "Product", help: "Help", legal: "Legal", accessibility: "Accessibility",
    privacy: "Privacy", terms: "Terms of use", notice: "Legal notice", cookies: "Cookies", choices: "Privacy choices", deletion: "Delete your data",
    back: "Back to home", updated: `Last updated: ${updatedEn}`,
    footer: "One question every day and many ways to keep learning.", effective: `Information effective as of ${updatedEn}.`,
    appearance: "Appearance", themeSystem: "System", themeLight: "Light", themeDark: "Dark",
  },
};

const pages = {
  es: {
    privacy: {
      eyebrow: "PRIVACIDAD CLARA", title: "Política de privacidad",
      intro: "Aquí explicamos qué información trata CG Trivia, para qué se utiliza y cómo puedes ejercer tus derechos.",
      sections: [
        ["1. Responsable y ámbito", [`El responsable de CG Trivia —también presentada como Cultura General— y de esta web es Pablo Brasero, desarrollador independiente establecido en España. Puedes escribir a ${email} para cualquier cuestión de privacidad.`, "Esta política se aplica a la app para iOS y Android y a su web oficial."], []],
        ["2. Información que tratamos", ["Para crear una cuenta tratamos tu correo electrónico, el nombre de usuario que eliges y un identificador interno. Si accedes con Apple o Google, el proveedor de identidad facilita los datos necesarios para autenticarte según los permisos que aceptes.", "También guardamos respuestas, progreso, rachas, puntuaciones, récords, nivel, logros, monedas, artículos de la tienda, relaciones de amistad y reportes necesarios para prestar las funciones del juego."], ["Datos técnicos de la app y del dispositivo, como versión, sistema operativo, idioma y registros de errores.", "El estado de tu suscripción CG PRO —plan contratado y fecha de renovación—, que recibimos de RevenueCat para activar tus ventajas.", "El tramo de edad que indicas para la publicidad se guarda únicamente en tu dispositivo.", "No solicitamos geolocalización precisa, contactos, fotos, cámara, micrófono ni calendario."]],
        ["3. Para qué usamos los datos", [], ["Crear, autenticar, proteger y recuperar tu cuenta.", "Mostrar tu perfil, progreso, estadísticas, logros y contenido desbloqueado.", "Calcular rankings, rachas y resultados, y habilitar amistades y funciones sociales.", "Prevenir abuso, investigar reportes y mantener el servicio seguro.", "Diagnosticar fallos y mejorar el funcionamiento de la app.", "Mostrar publicidad propia en pausas del juego, según el tramo de edad que indiques y nunca con CG PRO."]],
        ["4. Datos visibles para otros jugadores", ["Tu nombre de usuario, avatar o personalización pública, nivel, racha y determinadas estadísticas o posiciones de ranking pueden ser visibles para otros usuarios autenticados. Tu correo, credenciales y respuestas individuales no se muestran públicamente."], []],
        ["5. Base jurídica", ["Tratamos los datos necesarios para prestarte el servicio y ejecutar las condiciones de uso; para cumplir obligaciones legales; y, cuando procede, por interés legítimo en proteger y mejorar la app. La publicidad que ves dentro de la app es propia y no trata datos personales, así que no requiere tu consentimiento: solo te pedimos el tramo de edad, que no sale de tu dispositivo. No hacemos seguimiento entre apps ni medición de campañas."], []],
        ["6. Proveedores", ["Usamos Supabase para autenticación, base de datos y funciones de servidor; Sentry para diagnosticar errores; y RevenueCat para gestionar la suscripción CG PRO. No usamos SDKs de atribución ni de medición de campañas. La publicidad que se muestra dentro de la app es propia: la sirve In-House Ads, un servicio del mismo responsable, que no usa identificadores publicitarios ni redes de terceros. Apple y Google también pueden tratar información al distribuir la app o autenticarte."], [], [
          ["Privacidad de Supabase", "https://supabase.com/privacy"], ["Privacidad de Sentry", "https://sentry.io/privacy/"], ["Privacidad de RevenueCat", "https://www.revenuecat.com/privacy"]
        ]],
        ["7. Compras y suscripciones", ["CG PRO es una compra opcional gestionada por la tienda de tu dispositivo. RevenueCat recibe los identificadores de compra y el estado de la suscripción necesarios para validar y restaurar el acceso, pero ni la app ni RevenueCat reciben los datos completos de tu tarjeta.", "Las suscripciones se renuevan y se cancelan desde tu cuenta de Apple o Google. El precio, la duración, cualquier prueba gratuita y la fecha de renovación se muestran en la hoja de compra oficial antes de confirmar. Las solicitudes de reembolso se tramitan con la tienda correspondiente.", "Para aplicar tus ventajas, nuestro servidor conserva el plan contratado y su fecha de renovación. Otros jugadores solo pueden ver la insignia PRO junto a tu nombre, nunca tus datos de compra."], []],
        ["8. Publicidad y edad", ["La publicidad de CG Trivia es propia: solo promociona aplicaciones y webs del mismo responsable, no usa identificadores publicitarios, perfiles ni redes de terceros, y no escribe cookies ni almacenamiento persistente en el dispositivo. Los anuncios salen en pausas naturales del juego —el resultado de la pregunta diaria o el final de una partida de contrarreloj, de una escalada, de una ronda de Mundo o de Años— o cuando eliges voluntariamente ver uno a cambio de una recompensa. Con la suscripción CG PRO no se solicita ni se muestra ningún anuncio.", "Antes de mostrar el primero preguntamos tu tramo de edad. Es lo único que se pregunta: los anuncios no tratan datos personales, así que no hay consentimiento que pedir. La app no usa SDKs de atribución ni de medición de campañas y no solicita el permiso App Tracking Transparency de iOS."], ["Menores de 16 años: no se muestran anuncios. La app completa sigue disponible.", "16 años o más: se muestran anuncios propios en pausas naturales del juego. Con CG PRO, ninguno."], [["Opciones de privacidad", "/privacy-choices"]]],
        ["9. Notificaciones", ["Si las activas, la app envía como máximo dos avisos al día: un recordatorio de la pregunta diaria a las 9:00 y, solo si a las 20:00 todavía no la has respondido, un segundo aviso. Tras dos días sin entrar, ese aviso de la tarde se sustituye por un mensaje de regreso que usa datos que ya están en tu dispositivo, como tu racha o tu siguiente nivel de Aventura. Son notificaciones locales: las programa el propio dispositivo y su contenido no pasa por ningún servidor. Se desactivan desde Perfil > Ajustes o desde los ajustes del sistema."], []],
        ["10. Diagnóstico y seguridad", ["Sentry puede recibir la pila técnica del error, versiones de la app y del sistema y un identificador interno para agrupar incidencias. Configuramos el servicio para reducir datos personales y no enviar deliberadamente tu correo, nombre de usuario o contenido de preguntas.", "Las comunicaciones usan HTTPS/TLS, las contraseñas nunca se almacenan en texto plano y aplicamos controles de acceso en la base de datos. Ningún sistema es infalible, pero mantenemos medidas proporcionadas al riesgo."], []],
        ["11. Conservación y transferencias", ["Conservamos la cuenta y el progreso mientras esté activa o hasta que solicites su eliminación. Ciertos registros técnicos, copias de seguridad o datos necesarios para prevenir fraude y cumplir obligaciones pueden permanecer durante plazos limitados. Algunos proveedores pueden tratar información fuera del Espacio Económico Europeo con sus garantías contractuales y legales aplicables."], []],
        ["12. Tus derechos", ["Según tu lugar de residencia puedes solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad, así como retirar el consentimiento."], ["Puedes eliminar tu cuenta desde Perfil > Zona peligrosa, sin salir de la app.", "Puedes cambiar tu tramo de edad en Perfil > Ajustes > Privacidad y anuncios.", `Para cualquier otra solicitud, escríbenos a ${email}.`], [["Cómo eliminar tu cuenta", "/data-deletion"], ["Opciones de privacidad", "/privacy-choices"], ["Agencia Española de Protección de Datos", "https://www.aepd.es/"]]],
        ["13. Menores", ["CG Trivia es una app de público general y no está dirigida exclusivamente a menores. La edad a partir de la cual alguien puede consentir por sí mismo varía por país: aplicamos un corte único de 16 años, el más alto que exigen los estados del Espacio Económico Europeo.", "No mostramos publicidad a quien indique ser menor de 16 años. Si crees que un menor nos ha facilitado información sin autorización, contáctanos para revisarla y eliminarla cuando proceda."], []],
        ["14. Cambios en esta política", ["La web no crea cuentas, no usa analítica ni instala cookies publicitarias. El alojamiento puede generar registros técnicos básicos para servir y proteger el sitio.", "Actualizaremos esta política si cambian las funciones, los proveedores o los requisitos legales. Publicaremos aquí la nueva versión con su fecha de vigencia."], []],
      ],
    },
    terms: {
      eyebrow: "CONDICIONES", title: "Términos de uso",
      intro: "Estas condiciones regulan el uso de CG Trivia. Al crear una cuenta o utilizar la app aceptas estas reglas.",
      sections: [
        ["1. Titular y servicio", [`CG Trivia es un servicio de Pablo Brasero, desarrollador independiente en España. Contacto: ${email}. La app ofrece preguntas de cultura general, modos de juego, una campaña de Aventura, progreso, rankings, funciones sociales y una suscripción opcional llamada CG PRO.`], []],
        ["2. Cuenta", ["Debes proporcionar información veraz, proteger tus credenciales y mantener un único uso legítimo de la cuenta. Eres responsable de la actividad realizada desde ella. Si detectas acceso no autorizado, avísanos cuanto antes."], []],
        ["3. Edad", ["Debes tener capacidad legal para aceptar estas condiciones o contar con autorización de tu madre, padre o tutor. Las opciones de edad y privacidad publicitaria deben responderse de forma veraz."], []],
        ["4. Uso permitido", [], ["No manipular rankings, recompensas, monedas, respuestas o resultados.", "No automatizar consultas, extraer masivamente preguntas ni intentar acceder a cuentas o sistemas ajenos.", "No acosar, suplantar, publicar nombres ofensivos ni abusar de reportes o funciones sociales.", "No copiar, redistribuir o explotar comercialmente el contenido de la app sin autorización.", "No interferir con anuncios, seguridad, disponibilidad o funcionamiento del servicio."]],
        ["5. Preguntas y contenido", ["Nos esforzamos por ofrecer preguntas correctas y explicaciones útiles, pero pueden existir errores, matices o información que quede desactualizada. El contenido es educativo y recreativo; no sustituye asesoramiento profesional."], []],
        ["6. Publicidad y economía virtual", ["La app puede mostrar anuncios propios en pausas naturales del juego según el tramo de edad que indiques; con CG PRO no se muestra ninguno. Las monedas, recompensas, objetos y progreso son elementos virtuales del juego, no dinero, no tienen valor fuera de CG Trivia y no pueden venderse ni transferirse salvo que la app lo permita expresamente."], []],
        ["7. CG PRO: suscripción y compras", ["CG PRO es una compra opcional que amplía el contenido y las funciones de la app: la Aventura completa, un catálogo adicional de preguntas en Aprender, los modos Repaso inteligente y Examen, estadísticas avanzadas, una insignia junto a tu nombre, monedas mensuales, protección automática de la racha, cosméticos exclusivos y ausencia de anuncios. Ninguna ventaja de CG PRO altera los puntos, las ligas ni las clasificaciones que comparten todos los jugadores.", "Se ofrece como suscripción mensual, suscripción anual o pago único de por vida. El precio en tu moneda, la duración, cualquier prueba gratuita y la fecha de renovación se muestran en la app y en la hoja de compra de Apple o Google antes de confirmar."], ["Las suscripciones se renuevan automáticamente por el mismo periodo y precio salvo que las canceles al menos 24 horas antes de que termine el periodo en curso. El cobro lo realiza tu cuenta de Apple o Google.", "Si un plan incluye una prueba gratuita, al terminar se convierte automáticamente en suscripción de pago salvo que la canceles antes. La prueba solo puede disfrutarse una vez por cuenta de la tienda.", "El plan de por vida es un pago único: no se renueva y da acceso a CG PRO mientras el servicio exista.", "Puedes gestionar o cancelar la suscripción desde los ajustes de suscripciones de tu cuenta de Apple o Google. La cancelación surte efecto al final del periodo ya pagado; no se devuelven periodos parciales.", "La compra queda vinculada a tu cuenta de la tienda. Para comprar es necesario tener una cuenta en CG Trivia, y con «Restaurar compras» recuperas el acceso en un dispositivo nuevo o tras reinstalar.", "Los reembolsos los gestiona Apple o Google según sus propias condiciones, incluido el derecho de desistimiento aplicable en la Unión Europea.", "Podemos cambiar los precios o las ventajas de CG PRO. Un cambio de precio en una suscripción activa se avisa con antelación conforme a las reglas de la tienda y podrás cancelar antes de que se aplique.", "Las monedas mensuales y los cosméticos de CG PRO son elementos virtuales sujetos al apartado anterior."], [["Gestionar suscripciones en Apple", "https://support.apple.com/HT202039"], ["Gestionar suscripciones en Google Play", "https://support.google.com/googleplay/answer/7018481"]]],
        ["8. Propiedad intelectual", ["La app, diseño, software, marca, preguntas, explicaciones y demás contenidos pertenecen a Pablo Brasero o se usan con licencia. Se te concede una licencia personal, limitada, revocable, no exclusiva y no transferible para usar la app."], []],
        ["9. Disponibilidad y cambios", ["Podemos corregir, actualizar, añadir o retirar funciones y realizar mantenimiento. No garantizamos disponibilidad ininterrumpida ni que una función concreta permanezca para siempre. Procuraremos evitar pérdidas injustificadas de progreso."], []],
        ["10. Suspensión y cierre", ["Podemos limitar o suspender cuentas que incumplan estas condiciones, comprometan la seguridad o perjudiquen a otros usuarios. Puedes dejar de usar la app y eliminar tu cuenta en cualquier momento."], []],
        ["11. Responsabilidad", ["En la medida permitida por la ley, el servicio se ofrece tal cual. No excluimos responsabilidades que legalmente no puedan excluirse. Nuestra responsabilidad no se extiende a daños causados por un uso contrario a estas condiciones, por servicios de terceros o por circunstancias fuera de nuestro control razonable."], []],
        ["12. Ley aplicable y cambios", ["Estas condiciones se rigen por la legislación española, sin perjuicio de las normas imperativas de protección al consumidor de tu país. Los conflictos se someterán a los tribunales que correspondan legalmente. Publicaremos cualquier cambio material con su fecha de entrada en vigor."], []],
      ],
    },
    support: {
      eyebrow: "TE AYUDAMOS", title: "Soporte",
      intro: "Cuéntanos qué ha ocurrido e intentaremos ayudarte. Estas respuestas resuelven las dudas más habituales.",
      sections: [
        ["Contacto", [`Escríbenos a ${email}. Incluye el modelo del dispositivo, versión de iOS o Android, versión de CG Trivia y los pasos previos al problema. No envíes contraseñas ni códigos de acceso.`], []],
        ["No puedo entrar", ["Comprueba la conexión, revisa que el correo no tenga espacios y solicita un nuevo enlace o restablecimiento de contraseña. Si usaste Apple o Google, entra con el mismo proveedor."], []],
        ["Mi progreso no aparece", ["Confirma que has iniciado sesión con la misma cuenta. Cierra y abre la app con conexión estable. Si persiste, escribe indicando tu nombre de usuario; nunca necesitamos tu contraseña."], []],
        ["Una pregunta parece incorrecta", ["Envíanos la categoría, el texto aproximado de la pregunta, la respuesta que aparece como correcta y, si puedes, una fuente fiable. Revisamos las correcciones antes de publicarlas."], []],
        ["Publicidad y privacidad", ["Puedes revisar o cambiar tu elección desde Perfil > Ajustes > Privacidad y anuncios. Si indicas que eres menor de 16 años, la app no inicializa los sistemas publicitarios."], [], [["Ver opciones de privacidad", "/privacy-choices"]]],
        ["Eliminar la cuenta", ["La eliminación está disponible dentro de la app en Perfil > Zona peligrosa. También puedes escribirnos desde el correo asociado."], [], [["Guía de eliminación", "/data-deletion"]]],
      ],
    },
    "privacy-choices": {
      eyebrow: "TÚ DECIDES", title: "Opciones de privacidad",
      intro: "CG Trivia te permite controlar la publicidad desde la propia app. No hay seguimiento que desactivar.",
      sections: [
        ["En la app", ["Abre Perfil > Ajustes > Privacidad y anuncios para revisar o cambiar tu tramo de edad, que determina si se muestran anuncios. Los anuncios son propios y no usan identificadores, así que no hay ninguna otra elección que hacer.", "Con la suscripción CG PRO no se solicita ni se muestra ningún anuncio."], []],
        ["Si eres menor de 16 años", ["Selecciona el tramo de edad correcto. No se muestra publicidad y puedes seguir usando todas las funciones del juego."], []],
        ["Solicitudes legales", [`Para ejercer derechos de privacidad o plantear una duda, escribe a ${email}. Indica el país y el correo asociado a tu cuenta; no incluyas contraseñas.`], []],
      ],
    },
    "data-deletion": {
      eyebrow: "CONTROL DE CUENTA", title: "Eliminar tu cuenta y tus datos",
      intro: "Puedes solicitar una eliminación permanente desde la app, sin necesidad de visitar esta web.",
      sections: [
        ["Desde CG Trivia", [], ["Abre la pestaña Perfil.", "Entra en Zona peligrosa.", "Pulsa Eliminar cuenta.", "Lee las consecuencias y confirma dos veces la eliminación."]],
        ["Qué se elimina", ["Se elimina la cuenta de autenticación y la información asociada que controlamos: perfil, respuestas, progreso, estadísticas, rankings, amistades, inventario y personalización. La operación no se puede deshacer."], []],
        ["Si no puedes abrir la app", [`Escribe desde el correo asociado a ${email} con el asunto “Eliminar cuenta CG Trivia”. Verificaremos la titularidad y atenderemos la solicitud normalmente en menos de 7 días.`], []],
        ["Retención limitada", ["Copias de seguridad, registros de seguridad o datos exigidos por ley pueden conservarse de forma limitada hasta su rotación o vencimiento. Los proveedores independientes gestionan sus propios plazos conforme a sus políticas."], []],
      ],
    },
    "legal-notice": {
      eyebrow: "INFORMACIÓN LEGAL", title: "Aviso legal",
      intro: "Información sobre el responsable y las condiciones generales de esta web.",
      sections: [
        ["Titular", [`Titular: Pablo Brasero. Actividad: desarrollo y publicación independiente de software. País de establecimiento: España. Contacto: ${email}. Dominio: cg-trivia.pablobrasero.com.`], []],
        ["Finalidad", ["Esta web presenta CG Trivia y facilita información de soporte, privacidad, condiciones y cumplimiento para usuarios y plataformas de distribución."], []],
        ["Propiedad intelectual", ["El diseño, textos, marca, imágenes y software están protegidos por la normativa aplicable. No se autoriza su explotación, copia sistemática o redistribución salvo permiso previo o los límites legales."], []],
        ["Enlaces externos", ["Los enlaces a servicios de terceros se facilitan para información. No controlamos sus contenidos, disponibilidad ni prácticas; al visitarlos se aplican sus propias condiciones."], []],
        ["Responsabilidad y ley", ["Procuramos mantener información correcta y el sitio disponible, pero pueden existir errores o interrupciones. Este aviso se rige por la legislación española y por las normas imperativas que resulten aplicables."], []],
      ],
    },
    cookies: {
      eyebrow: "WEB SIN RASTREO", title: "Política de cookies",
      intro: "Esta web oficial está diseñada para informar sin seguir tu actividad.",
      sections: [
        ["Sin cookies analíticas ni publicitarias", ["No usamos Google Analytics, píxeles publicitarios, perfiles de navegación ni cookies propias de analítica o marketing. Por eso no mostramos un banner de consentimiento en la web.", "La preferencia de apariencia —sistema, claro u oscuro— se guarda únicamente en el almacenamiento local del navegador para recordarla en tu dispositivo. No se envía al servidor ni se usa para identificarte."], []],
        ["Datos técnicos del alojamiento", ["El servidor y la red de entrega pueden tratar temporalmente dirección IP, fecha, URL solicitada, agente de usuario y datos de seguridad para entregar el sitio, evitar abuso y diagnosticar fallos. Estos registros no se usan para crear perfiles publicitarios."], []],
        ["Enlaces externos", ["Al seguir un enlace a App Store, Google Play o un proveedor, ese tercero puede utilizar sus propias tecnologías. Consulta su política antes de continuar."], []],
        ["Cambios", ["Si incorporamos una tecnología que requiera consentimiento, actualizaremos esta página y mostraremos el mecanismo correspondiente antes de activarla."], []],
      ],
    },
    accessibility: {
      eyebrow: "PARA TODAS LAS PERSONAS", title: "Accesibilidad",
      intro: "Queremos que la web oficial y CG Trivia sean cómodas de usar con distintas capacidades y dispositivos.",
      sections: [
        ["Esta web", ["La navegación funciona con teclado, usa estructura semántica, mantiene contraste alto, respeta la preferencia de movimiento reducido y se adapta a ampliación de texto y pantallas pequeñas."], []],
        ["La app", ["Trabajamos para mantener etiquetas comprensibles, objetivos táctiles amplios, colores con contraste y textos disponibles en español e inglés. Algunas áreas pueden seguir necesitando mejoras."], []],
        ["Cuéntanos una barrera", [`Si algo te impide jugar o consultar información, escribe a ${email} indicando dispositivo, sistema, tecnología de apoyo y pantalla afectada. Priorizaremos una solución razonable.`], []],
      ],
    },
  },
};

pages.en = {
  privacy: { eyebrow: "CLEAR PRIVACY", title: "Privacy policy", intro: "This policy explains what information CG Trivia processes, why it is used, and how you can exercise your rights.", sections: [
    ["1. Controller and scope", [`CG Trivia —also presented as Cultura General— and this website are operated by Pablo Brasero, an independent developer established in Spain. Contact: ${email}.`, "This policy applies to the iOS and Android app and its official website."], []],
    ["2. Information we process", ["To create an account we process your email address, chosen username and an internal identifier. If you sign in with Apple or Google, the identity provider shares the data needed to authenticate you under the permissions you accept.", "We also store answers, progress, streaks, scores, records, level, achievements, coins, shop items, friendships and reports needed to provide the game."], ["Technical app and device data such as version, operating system, language and error logs.", "The status of your CG PRO subscription —plan and renewal date— which we receive from RevenueCat to enable your benefits.", "The age bracket you indicate for advertising is stored only on your device.", "We do not request precise location, contacts, photos, camera, microphone or calendar."]],
    ["3. How we use data", [], ["Create, authenticate, secure and recover your account.", "Show your profile, progress, statistics, achievements and unlocked content.", "Calculate rankings, streaks and results, and enable friends and social features.", "Prevent abuse, investigate reports and keep the service secure.", "Diagnose errors and improve the app.", "Show first-party ads at breaks in play, according to the age bracket you indicate and never with CG PRO."]],
    ["4. Data visible to other players", ["Your username, public avatar or customization, level, streak and some statistics or ranking positions may be visible to other authenticated users. Your email, credentials and individual answers are not shown publicly."], []],
    ["5. Legal grounds", ["We process data required to provide the service and perform these terms, comply with legal duties, and pursue legitimate interests in protecting and improving the app. The ads shown inside the app are first-party and process no personal data, so they require no consent: we only ask for your age bracket, which never leaves your device. We do no cross-app tracking and no campaign measurement."], []],
    ["6. Providers", ["We use Supabase for authentication, database and server functions; Sentry for error diagnostics; and RevenueCat to manage the CG PRO subscription. We use no attribution or campaign-measurement SDKs. Advertising shown inside the app is first-party: it is served by In-House Ads, a service run by the same controller, which uses no advertising identifiers and no third-party networks. Apple and Google may process data when distributing the app or authenticating you."], [], [["Supabase privacy", "https://supabase.com/privacy"], ["Sentry privacy", "https://sentry.io/privacy/"], ["RevenueCat privacy", "https://www.revenuecat.com/privacy"]]],
    ["7. Purchases and subscriptions", ["CG PRO is an optional purchase handled by your device's store. RevenueCat receives the purchase identifiers and subscription status needed to validate and restore access, but neither the app nor RevenueCat receives your full card details.", "Subscriptions renew and are cancelled from your Apple or Google account. Price, duration, any free trial and the renewal date are shown on the official purchase sheet before you confirm. Refund requests are handled by the corresponding store.", "To apply your benefits, our server keeps the plan you purchased and its renewal date. Other players can only see the PRO badge next to your name, never your purchase details."], []],
    ["8. Advertising and age", ["CG Trivia's advertising is first-party: it only promotes apps and sites run by the same controller, it uses no advertising identifiers, profiles or third-party networks, and it writes no cookies or persistent storage on the device. Ads appear at natural breaks in play — the result of the daily question, or the end of a Time Attack run, a Climb Mode run, a World round or a Years round — or when you voluntarily choose to watch one in exchange for a reward. With the CG PRO subscription no ad is ever requested or shown.", "Before showing the first one we ask for your age bracket. That is the only question: the ads process no personal data, so there is no consent to request. The app uses no attribution or campaign-measurement SDKs and never requests iOS App Tracking Transparency permission."], ["Under 16: no ads are shown. The whole app remains available.", "16 or older: first-party ads appear at natural breaks in play. With CG PRO, none at all."], [["Privacy choices", "/en/privacy-choices"]]],
    ["9. Notifications", ["If you turn them on, the app sends at most two notices a day: a reminder of the daily question at 9:00 and, only if you still have not answered it by 20:00, a second notice. After two days without opening the app, that evening notice is replaced by a welcome-back message built from data already on your device, such as your streak or your next Adventure level. They are local notifications: your own device schedules them and their content never travels through a server. Turn them off under Profile > Settings or in your system settings."], []],
    ["10. Diagnostics and security", ["Sentry may receive technical stack traces, app and OS versions and an internal identifier to group incidents. We configure it to reduce personal data and do not deliberately send your email, username or question content.", "Communications use HTTPS/TLS, passwords are never stored in plain text and we apply database access controls. No system is infallible, but we maintain safeguards proportionate to risk."], []],
    ["11. Retention and transfers", ["We retain the account and progress while active or until deletion. Technical logs, backups or information needed to prevent fraud and meet legal duties may remain for limited periods. Providers may process data outside the EEA under applicable safeguards."], []],
    ["12. Your rights", ["Depending on where you live, you may request access, correction, deletion, objection, restriction and portability, and withdraw consent."], ["You can delete your account under Profile > Danger zone, without leaving the app.", "You can change your age bracket under Profile > Settings > Privacy and ads.", `For any other request, write to us at ${email}.`], [["How to delete your account", "/en/data-deletion"], ["Privacy choices", "/en/privacy-choices"], ["Spanish Data Protection Agency", "https://www.aepd.es/"]]],
    ["13. Children", ["CG Trivia is a general-audience app and is not directed exclusively at children. The age at which someone can consent on their own varies by country: we apply a single cut-off of 16, the highest required across the European Economic Area.", "We show no advertising to anyone who indicates they are under 16. Contact us if you believe a child supplied information without authorization."], []],
    ["14. Changes to this policy", ["The website does not create accounts, use analytics or set advertising cookies. Hosting may generate basic technical logs to serve and protect it.", "We will update this policy when features, providers or legal requirements change, publishing the new version and its effective date here."], []],
  ]},
  terms: { eyebrow: "TERMS", title: "Terms of use", intro: "These terms govern your use of CG Trivia. By creating an account or using the app, you agree to these rules.", sections: [
    ["1. Operator and service", [`CG Trivia is provided by Pablo Brasero, an independent developer in Spain. Contact: ${email}. The app provides general-knowledge questions, game modes, an Adventure campaign, progress, rankings, social features and an optional subscription called CG PRO.`], []],
    ["2. Account", ["Provide accurate information, protect your credentials and use your account legitimately. You are responsible for its activity. Tell us promptly if you detect unauthorized access."], []],
    ["3. Age", ["You must have legal capacity to accept these terms or permission from a parent or guardian. Answer advertising age and privacy choices truthfully."], []],
    ["4. Acceptable use", [], ["Do not manipulate rankings, rewards, coins, answers or results.", "Do not automate requests, mass-extract questions or access other accounts or systems.", "Do not harass, impersonate, use offensive names or abuse social and reporting features.", "Do not copy, redistribute or commercially exploit app content without permission.", "Do not interfere with ads, security, availability or operation."]],
    ["5. Questions and content", ["We aim for accurate questions and useful explanations, but errors, nuance or outdated information may exist. Content is educational and recreational and is not professional advice."], []],
    ["6. Advertising and virtual items", ["The app may display first-party ads at natural breaks in play according to the age bracket you indicate; with CG PRO none are shown. Coins, rewards, items and progress are virtual game elements, not money, have no value outside CG Trivia and may not be sold or transferred unless expressly allowed."], []],
    ["7. CG PRO: subscription and purchases", ["CG PRO is an optional purchase that expands the app's content and features: the full Adventure, an additional question catalogue in Learn, the Smart Review and Exam modes, advanced statistics, a badge next to your name, monthly coins, automatic streak protection, exclusive cosmetics and no ads. No CG PRO benefit alters the points, leagues or rankings shared by all players.", "It is offered as a monthly subscription, an annual subscription or a one-time lifetime purchase. The price in your currency, the duration, any free trial and the renewal date are shown in the app and on the Apple or Google purchase sheet before you confirm."], ["Subscriptions renew automatically for the same period and price unless you cancel at least 24 hours before the current period ends. Your Apple or Google account is charged.", "If a plan includes a free trial, it converts automatically into a paid subscription when the trial ends unless you cancel first. The trial can only be used once per store account.", "The lifetime plan is a one-time payment: it does not renew and grants CG PRO for as long as the service exists.", "You can manage or cancel the subscription from the subscription settings of your Apple or Google account. Cancellation takes effect at the end of the paid period; partial periods are not refunded.", "The purchase is tied to your store account. A CG Trivia account is required to buy, and “Restore purchases” recovers access on a new device or after reinstalling.", "Refunds are handled by Apple or Google under their own terms, including the right of withdrawal applicable in the European Union.", "We may change CG PRO prices or benefits. A price change on an active subscription is announced in advance under the store's rules and you may cancel before it applies.", "CG PRO monthly coins and cosmetics are virtual items subject to the previous section."], [["Manage subscriptions on Apple", "https://support.apple.com/HT202039"], ["Manage subscriptions on Google Play", "https://support.google.com/googleplay/answer/7018481"]]],
    ["8. Intellectual property", ["The app, design, software, brand, questions, explanations and other content belong to Pablo Brasero or are licensed. You receive a personal, limited, revocable, non-exclusive and non-transferable license to use the app."], []],
    ["9. Availability and changes", ["We may fix, update, add or remove features and perform maintenance. We do not guarantee uninterrupted availability or permanent retention of any particular feature, but aim to avoid unjustified loss of progress."], []],
    ["10. Suspension and closure", ["We may limit or suspend accounts that breach these terms, threaten security or harm others. You may stop using the app and delete your account at any time."], []],
    ["11. Liability", ["To the extent permitted by law, the service is provided as is. We do not exclude liabilities that cannot legally be excluded. We are not responsible for harm caused by use contrary to these terms, third-party services or circumstances beyond reasonable control."], []],
    ["12. Governing law and changes", ["Spanish law applies, without limiting mandatory consumer protections in your country. Disputes go to the courts determined by law. Material changes will be published with their effective date."], []],
  ]},
  support: { eyebrow: "WE CAN HELP", title: "Support", intro: "Tell us what happened and we will try to help. These answers cover common questions.", sections: [
    ["Contact", [`Email ${email}. Include device model, iOS or Android version, CG Trivia version and steps before the issue. Never send passwords or access codes.`], []],
    ["I cannot sign in", ["Check your connection and email spelling, then request a new link or password reset. If you used Apple or Google, use the same provider."], []],
    ["My progress is missing", ["Confirm you signed in to the same account. Restart the app with a stable connection. If it continues, send your username; we never need your password."], []],
    ["A question seems wrong", ["Send the category, approximate question, answer marked correct and a reliable source if possible. We review corrections before publishing them."], []],
    ["Ads and privacy", ["Review or change your choice under Profile > Settings > Privacy and ads. If you indicate that you are under 16, the app does not initialize advertising systems."], [], [["View privacy choices", "/en/privacy-choices"]]],
    ["Delete the account", ["Deletion is available in the app under Profile > Danger zone. You can also email us from the associated address."], [], [["Deletion guide", "/en/data-deletion"]]],
  ]},
  "privacy-choices": { eyebrow: "YOUR CHOICE", title: "Privacy choices", intro: "CG Trivia lets you control advertising from inside the app. There is no tracking to turn off.", sections: [
    ["In the app", ["Open Profile > Settings > Privacy and ads to review or change your age bracket, which decides whether ads are shown. The ads are first-party and use no identifiers, so there is no other choice to make.", "With the CG PRO subscription no ad is ever requested or shown."], []],
    ["If you are under 16", ["Select the correct age bracket. No advertising is shown and you can use every game feature."], []],
    ["Legal requests", [`To exercise privacy rights, email ${email}. Include your country and account email; never include passwords.`], []],
  ]},
  "data-deletion": { eyebrow: "ACCOUNT CONTROL", title: "Delete your account and data", intro: "You can request permanent deletion in the app without visiting this website.", sections: [
    ["From CG Trivia", [], ["Open the Profile tab.", "Go to Danger zone.", "Tap Delete account.", "Read the consequences and confirm deletion twice."]],
    ["What is deleted", ["We delete the authentication account and associated data we control: profile, answers, progress, statistics, rankings, friendships, inventory and customization. This cannot be undone."], []],
    ["If you cannot open the app", [`Email ${email} from the associated address with subject “Delete CG Trivia account”. We will verify ownership and normally complete the request within 7 days.`], []],
    ["Limited retention", ["Backups, security logs or legally required data may remain for a limited time until rotation or expiry. Independent providers apply their own retention periods."], []],
  ]},
  "legal-notice": { eyebrow: "LEGAL INFORMATION", title: "Legal notice", intro: "Information about the operator and general conditions for this website.", sections: [
    ["Operator", [`Operator: Pablo Brasero. Activity: independent software development and publishing. Established in Spain. Contact: ${email}. Domain: cg-trivia.pablobrasero.com.`], []],
    ["Purpose", ["This site presents CG Trivia and provides support, privacy, terms and compliance information for users and distribution platforms."], []],
    ["Intellectual property", ["The design, copy, brand, images and software are protected. Commercial exploitation, systematic copying or redistribution is not permitted without authorization or a legal exception."], []],
    ["External links", ["Third-party links are informational. We do not control their content, availability or practices; their own terms apply."], []],
    ["Liability and law", ["We aim to keep information accurate and the site available, but errors or interruptions may occur. Spanish law and applicable mandatory rules govern this notice."], []],
  ]},
  cookies: { eyebrow: "NO WEB TRACKING", title: "Cookie policy", intro: "This official website is designed to inform without tracking your activity.", sections: [
    ["No analytics or advertising cookies", ["We do not use Google Analytics, advertising pixels, browsing profiles or first-party analytics or marketing cookies. Therefore the website does not display a consent banner.", "Your appearance preference —system, light or dark— is stored only in the browser's local storage so this device remembers it. It is not sent to the server or used to identify you."], []],
    ["Technical hosting data", ["The server and delivery network may temporarily process IP address, date, requested URL, user agent and security data to deliver the site, prevent abuse and diagnose faults. Logs are not used for advertising profiles."], []],
    ["External links", ["App Store, Google Play and provider links may use their own technologies. Review their policy before continuing."], []],
    ["Changes", ["If we add technology requiring consent, this page and the necessary choice mechanism will be updated before activation."], []],
  ]},
  accessibility: { eyebrow: "FOR EVERYONE", title: "Accessibility", intro: "We want the official website and CG Trivia to be comfortable across abilities and devices.", sections: [
    ["This website", ["Navigation works with a keyboard, uses semantic structure, maintains high contrast, respects reduced-motion preferences and adapts to text zoom and small screens."], []],
    ["The app", ["We work to maintain understandable labels, generous touch targets, contrasting colors and Spanish and English text. Some areas may still need improvement."], []],
    ["Report a barrier", [`Email ${email} with the device, system, assistive technology and affected screen. We will prioritize a reasonable fix.`], []],
  ]},
};

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function pathFor(locale, slug = "") {
  const p = locales[locale].prefix;
  return slug ? `${p}/${slug}` : p || "/";
}

function shell(locale, { title, description, path = "", content, pageClass = "" }) {
  const t = locales[locale];
  const canonical = `${origin}${pathFor(locale, path)}`;
  const alternateLocale = locale === "es" ? "en" : "es";
  const alternate = `${origin}${pathFor(alternateLocale, path)}`;
  const langLink = pathFor(alternateLocale, path);
  const home = pathFor(locale);
  const year = new Date().getUTCFullYear();
  return `<!doctype html>
<html lang="${t.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#F7F2EA" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#191512" media="(prefers-color-scheme: dark)">
<link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="${locale}" href="${canonical}"><link rel="alternate" hreflang="${alternateLocale}" href="${alternate}"><link rel="alternate" hreflang="x-default" href="${origin}${pathFor("es", path)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="CG Trivia"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:locale" content="${t.locale}"><meta property="og:image" content="${origin}/og-warm.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="CG Trivia — Pon a prueba todo lo que sabes">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${origin}/og-warm.png">
<link rel="icon" href="/favicon.png"><link rel="apple-touch-icon" href="/app-icon.png"><script src="/assets/theme.js?v=warm-paper-1"></script><link rel="stylesheet" href="/assets/style.css?v=warm-paper-1"></head>
<body class="${pageClass}"><a class="skip" href="#main">${t.skip}</a>
<header class="header"><div class="wrap header-inner"><a class="brand" href="${home}" aria-label="${t.home}"><img src="/app-icon.png" width="44" height="44" alt=""><span><b>CG</b> Trivia</span></a>
<nav aria-label="Primary"><a href="${home}#juega">${t.navGame}</a><a href="${home}#descubre">${t.navFeatures}</a><a href="${pathFor(locale, "support")}">${t.navSupport}</a><a href="${pathFor(locale, "privacy")}">${t.navPrivacy}</a></nav>
<div class="header-actions"><div class="theme-picker" role="group" aria-label="${t.appearance}"><button type="button" data-theme-value="system" aria-label="${t.themeSystem}" title="${t.themeSystem}"><span aria-hidden="true">◐</span><em>${t.themeSystem}</em></button><button type="button" data-theme-value="light" aria-label="${t.themeLight}" title="${t.themeLight}"><span aria-hidden="true">☀</span><em>${t.themeLight}</em></button><button type="button" data-theme-value="dark" aria-label="${t.themeDark}" title="${t.themeDark}"><span aria-hidden="true">☾</span><em>${t.themeDark}</em></button></div><a class="lang" href="${langLink}" hreflang="${alternateLocale}" aria-label="${t.other}"><span>${t.otherCode}</span><em>${t.other}</em></a></div></div></header>
<main id="main">${content}</main>
<footer><div class="wrap footer-grid"><div class="footer-brand"><a class="brand inverse" href="${home}"><img src="/app-icon.png" width="46" height="46" alt=""><span><b>CG</b> Trivia</span></a><p>${t.footer}</p></div>
<div><h2>${t.product}</h2><a href="${home}">${t.home}</a><a href="${home}#juega">${t.navGame}</a><a href="${pathFor(locale, "accessibility")}">${t.accessibility}</a></div>
<div><h2>${t.help}</h2><a href="${pathFor(locale, "support")}">${t.navSupport}</a><a href="${pathFor(locale, "privacy-choices")}">${t.choices}</a><a href="${pathFor(locale, "data-deletion")}">${t.deletion}</a></div>
<div><h2>${t.legal}</h2><a href="${pathFor(locale, "privacy")}">${t.privacy}</a><a href="${pathFor(locale, "terms")}">${t.terms}</a><a href="${pathFor(locale, "legal-notice")}">${t.notice}</a><a href="${pathFor(locale, "cookies")}">${t.cookies}</a></div></div>
<div class="wrap footnote"><p>© ${year} Pablo Brasero.</p><p>${t.effective}</p></div></footer></body></html>`;
}

const landingCopy = {
  es: {
    title: "CG Trivia — cultura general para jugar, aprender y competir",
    description: "Una pregunta nueva cada día, contrarreloj, Modo Ascenso, aprendizaje y partidas con amigos. Trivia en español e inglés.",
    eyebrow: "TU RETO DIARIO DE CULTURA GENERAL", h1a: "Pon a prueba", h1b: "todo lo que sabes.",
    lead: "Una pregunta nueva cada día y seis formas de jugar. Aprende con cada respuesta, mantén tu racha y compite con amigos.", cta: "Descubrir los modos", store: "Disponible en App Store",
    chips: ["Español e inglés", "13 categorías", "Partidas de 2 minutos"],
    qLabel: "PREGUNTA DEL DÍA", q: "¿Qué civilización construyó Machu Picchu?", answers: ["Maya", "Inca", "Azteca", "Olmeca"], correct: "Inca",
    modesEyebrow: "JUEGA A TU MANERA", modesTitle: "Un modo para cada momento", modesLead: "Una pausa rápida, una sesión para aprender o una noche con amigos.",
    modes: [["01", "Pregunta del día", "La misma pregunta para todos. Responde, comparte y conserva tu racha.", "amber"], ["02", "Contrarreloj", "Treinta segundos. Tantas respuestas como puedas. Supera tu récord.", "violet"], ["03", "Modo Ascenso", "Sube de dificultad, protege tus vidas y decide cuándo asegurar el bote.", "coral"], ["04", "Mundo", "Banderas de 196 países, por continente o del mundo entero.", "teal"], ["05", "Aprender", "Elige un tema y descubre el contexto cuando una respuesta se te resista.", "green"], ["06", "Con amigos", "Duelos, equipos, superviviente y partidas pasando el móvil.", "blue"]],
    topicsEyebrow: "13 CATEGORÍAS", topicsTitle: "Siempre hay algo nuevo que descubrir", topics: ["Historia", "Ciencia", "Arte", "Geografía", "Filosofía", "Deportes", "Biología", "Cine", "Música", "Literatura", "Tecnología", "Mitología", "Astronomía"],
    features: [["Una pregunta para todos", "Compara tu respuesta diaria con la comunidad y tus amigos."], ["Aprende al fallar", "Cada explicación convierte una duda en algo que recordarás."], ["Claro, oscuro o sistema", "La nueva estética de papel cálido se adapta a ti y a la luz de cada momento."], ["Juntos en una pantalla", "De 2 a 8 jugadores en modos locales rápidos y fáciles de empezar."]],
    previewLabel: "Así se siente la nueva versión", previewTitle: "Más cálida, clara y fácil de leer", previewText: "Tarjetas limpias, tinta de alto contraste y acentos con significado. La misma experiencia en modo claro y oscuro, siguiendo el sistema si lo prefieres.", previewDaily: "Pregunta del día", previewPlay: "Jugar ahora", previewModes: [["Contrarreloj", "30 s"], ["Modo Ascenso", "5 ❤️"], ["Mundo", "196 banderas"], ["Aprender", "13 temas"], ["Amigos", "2–8"]],
    privacyEyebrow: "PRIVACIDAD SIN LETRA PEQUEÑA", privacyTitle: "Tus decisiones, antes que la publicidad.", privacyText: "Los anuncios son propios, sin identificadores ni seguimiento. Los menores de 16 años juegan sin anuncios y puedes cambiar tu decisión desde Ajustes.", privacyCta: "Leer la política de privacidad",
    finalTitle: "¿Cuánto sabes hoy?", finalText: "Descarga CG Trivia y convierte dos minutos al día en una racha de descubrimientos.", finalCta: "Ver en App Store",
  },
  en: {
    title: "CG Trivia — general knowledge to play, learn and compete",
    description: "A fresh question every day, Time Attack, Climb Mode, learning and games with friends. Trivia in English and Spanish.",
    eyebrow: "YOUR DAILY GENERAL-KNOWLEDGE CHALLENGE", h1a: "Put everything", h1b: "you know to the test.",
    lead: "A fresh question every day and six ways to play. Learn from every answer, keep your streak and compete with friends.", cta: "Explore game modes", store: "Available on the App Store",
    chips: ["English and Spanish", "13 categories", "Two-minute rounds"],
    qLabel: "QUESTION OF THE DAY", q: "Which civilization built Machu Picchu?", answers: ["Maya", "Inca", "Aztec", "Olmec"], correct: "Inca",
    modesEyebrow: "PLAY YOUR WAY", modesTitle: "A mode for every moment", modesLead: "A quick break, a learning session or game night with friends.",
    modes: [["01", "Daily question", "The same question for everyone. Answer, share and keep your streak.", "amber"], ["02", "Time Attack", "Thirty seconds. As many answers as you can. Beat your record.", "violet"], ["03", "Climb Mode", "Rise in difficulty, protect your lives and decide when to bank the pot.", "coral"], ["04", "World", "Flags from 196 countries, by continent or across the whole world.", "teal"], ["05", "Learn", "Pick a topic and discover the context when an answer challenges you.", "green"], ["06", "With friends", "Duels, teams, survivor and pass-the-phone games.", "blue"]],
    topicsEyebrow: "13 CATEGORIES", topicsTitle: "There is always something new to discover", topics: ["History", "Science", "Art", "Geography", "Philosophy", "Sports", "Biology", "Film", "Music", "Literature", "Technology", "Mythology", "Astronomy"],
    features: [["One question for everyone", "Compare your daily answer with the community and friends."], ["Learn from mistakes", "Every explanation turns uncertainty into something memorable."], ["Light, dark or system", "The new warm-paper design adapts to you and the light around you."], ["Together on one screen", "Two to eight players in fast local modes that are easy to start."]],
    previewLabel: "A feel for the new version", previewTitle: "Warmer, clearer and easier to read", previewText: "Clean cards, high-contrast ink and meaningful accents. The same experience in light and dark mode, following your system when you prefer.", previewDaily: "Daily question", previewPlay: "Play now", previewModes: [["Time Attack", "30 s"], ["Climb Mode", "5 ❤️"], ["World", "196 flags"], ["Learn", "13 topics"], ["Friends", "2–8"]],
    privacyEyebrow: "PRIVACY WITHOUT FINE PRINT", privacyTitle: "Your choices come before advertising.", privacyText: "Ads are first-party, with no identifiers and no tracking. Under-16s play without ads, and you can change your choice in Settings.", privacyCta: "Read the privacy policy",
    finalTitle: "How much do you know today?", finalText: "Download CG Trivia and turn two minutes a day into a streak of discoveries.", finalCta: "View on the App Store",
  },
};

function landing(locale) {
  const t = landingCopy[locale];
  const homePrefix = locales[locale].prefix;
  const appStore = "https://apps.apple.com/app/id6766927114";
  const content = `<section class="hero"><div class="hero-glow g1"></div><div class="hero-glow g2"></div><div class="wrap hero-grid"><div class="hero-copy"><p class="eyebrow">${t.eyebrow}</p><h1>${t.h1a}<span>${t.h1b}</span></h1><p class="lead">${t.lead}</p><div class="hero-actions"><a class="button primary" href="#juega">${t.cta}<span>↓</span></a><a class="store-link" href="${appStore}" target="_blank" rel="noreferrer"><i></i>${t.store}</a></div><ul class="chips">${t.chips.map((x) => `<li><span>✓</span>${x}</li>`).join("")}</ul></div>
  <div class="quiz-stage" aria-label="${esc(t.qLabel)}"><div class="orbit orbit-a">?</div><div class="orbit orbit-b">★</div><div class="quiz-card"><div class="quiz-top"><img src="/app-icon.png" alt="" width="58" height="58"><div><b>CG Trivia</b><span>${t.qLabel}</span></div><em>🔥 12</em></div><div class="progress"><i></i></div><p class="question">${t.q}</p><div class="answers">${t.answers.map((a) => `<span class="${a === t.correct ? "selected" : ""}">${a}${a === t.correct ? "<b>✓</b>" : ""}</span>`).join("")}</div><div class="explain"><b>💡 ${locale === "es" ? "La respuesta es Inca" : "The answer is Inca"}</b><small>${locale === "es" ? "Fue construida en el siglo XV en los Andes peruanos." : "It was built in the 15th century in the Peruvian Andes."}</small></div></div></div></div></section>
<section class="section modes" id="juega"><div class="wrap"><div class="section-head"><p class="eyebrow">${t.modesEyebrow}</p><h2>${t.modesTitle}</h2><p>${t.modesLead}</p></div><div class="mode-grid">${t.modes.map(([n, name, desc, tone]) => `<article class="mode ${tone}"><span>${n}</span><h3>${name}</h3><p>${desc}</p><i>→</i></article>`).join("")}</div></div></section>
<section class="section showcase" id="descubre"><div class="wrap showcase-grid"><div class="app-preview"><div class="app-preview-top"><div><small>${locale === "es" ? "Lunes, 3 de agosto" : "Monday, August 3"}</small><strong>${locale === "es" ? "Hola, ¿jugamos?" : "Hello, ready to play?"}</strong></div><span>PB</span></div><div class="streak-row"><span>🔥</span><div><b>12 ${locale === "es" ? "días seguidos" : "day streak"}</b><small>${locale === "es" ? "Tu mejor racha está en marcha" : "Your best streak is growing"}</small></div><em>12</em></div><div class="daily-preview"><div class="preview-icon">🏆</div><div><small>${t.qLabel}</small><h3>${t.previewDaily}</h3><p>${locale === "es" ? "La misma pregunta para todos. Compara tu resultado con tus amigos." : "The same question for everyone. Compare your result with friends."}</p><button tabindex="-1">${t.previewPlay} →</button></div></div><p class="preview-section-label">${locale === "es" ? "MODOS DE JUEGO" : "GAME MODES"}</p><div class="preview-mode-grid">${t.previewModes.map(([name, sub], i) => `<div><span>${["⚡","↗","◍","▤","♟"][i]}</span><b>${name}</b><small>${sub}</small></div>`).join("")}</div></div><div class="topics"><p class="eyebrow">${t.previewLabel}</p><h2>${t.previewTitle}</h2><p class="topics-lead">${t.previewText}</p><div class="topic-list">${t.topics.map((x, i) => `<span><i>${["⌛","⚗","✦","⌖","∞","◉","❁","▶","♫","Aa","⌁","⚡","☾"][i]}</i>${x}</span>`).join("")}</div></div></div></section>
<section class="section benefits"><div class="wrap benefit-grid">${t.features.map(([a, b], i) => `<article><span>0${i + 1}</span><h3>${a}</h3><p>${b}</p></article>`).join("")}</div></section>
<section class="section privacy-band"><div class="wrap privacy-card"><div class="shield">✓</div><div><p class="eyebrow">${t.privacyEyebrow}</p><h2>${t.privacyTitle}</h2><p>${t.privacyText}</p><a href="${homePrefix}/privacy">${t.privacyCta}<span>→</span></a></div></div></section>
<section class="section final"><div class="wrap final-card"><img src="/app-icon.png" width="88" height="88" alt=""><div><h2>${t.finalTitle}</h2><p>${t.finalText}</p></div><a class="button light" href="${appStore}" target="_blank" rel="noreferrer">${t.finalCta}<span>↗</span></a></div></section>`;
  return shell(locale, { title: t.title, description: t.description, content });
}

function legal(locale, slug) {
  const t = locales[locale];
  const page = pages[locale][slug];
  const content = `<article class="legal-page"><header class="legal-hero"><div class="wrap"><a class="back" href="${pathFor(locale)}">← ${t.back}</a><p class="eyebrow">${page.eyebrow}</p><h1>${page.title}</h1><p>${page.intro}</p><small>${t.updated}</small></div></header><div class="wrap legal-grid"><aside><div><img src="/app-icon.png" width="62" height="62" alt=""><b>CG Trivia</b><p>${t.effective}</p><a href="mailto:${email}">${email}</a></div></aside><div class="legal-copy">${page.sections.map(([heading, paragraphs = [], bullets = [], links = []]) => `<section><h2>${heading}</h2>${paragraphs.map((p) => `<p>${p.replaceAll(email, `<a href="mailto:${email}">${email}</a>`)}</p>`).join("")}${bullets.length ? `<ul>${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>` : ""}${links.length ? `<div class="legal-links">${links.map(([label, href]) => `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${label}<span>${href.startsWith("http") ? "↗" : "→"}</span></a>`).join("")}</div>` : ""}</section>`).join("")}</div></div></article>`;
  return shell(locale, { title: `${page.title} · CG Trivia`, description: page.intro, path: slug, content, pageClass: "legal-body" });
}

async function put(path, contents) {
  const target = join(dist, path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents);
}

/**
 * Contenido de /app-ads.txt.
 *
 * Desde la 2.2.0 la publicidad de la app es propia y no se vende inventario a
 * ninguna red programática, así que no hay ningún vendedor que autorizar: se
 * publica un fichero solo con comentarios, que es válido y equivale a "no hay
 * vendedores autorizados" — bastante mejor que un 404, que algunos
 * verificadores interpretan como sitio mal configurado.
 *
 * Si algún día vuelve a haber una red externa, pega su bloque literal en
 * `website/src/app-ads.txt`, ejecuta `npm run build` y despliega. No se
 * inventan seller IDs ni DIRECT/RESELLER, y no hace falta tocar este fichero.
 */
async function appAdsTxt() {
  const placeholder = [
    "# CG Trivia / Cultura General",
    "# No authorized advertising-system entries: ads are first-party only.",
    "# To authorize a seller, paste its literal block into website/src/app-ads.txt.",
    "",
  ].join("\n");

  let raw;
  try {
    raw = await readFile(join(root, "src/app-ads.txt"), "utf8");
  } catch {
    return placeholder;
  }

  // Un fichero que solo tenga comentarios o espacios cuenta como vacío.
  const hasEntries = raw
    .split("\n")
    .some((line) => line.trim() !== "" && !line.trim().startsWith("#"));

  return hasEntries ? (raw.endsWith("\n") ? raw : `${raw}\n`) : placeholder;
}

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "assets"), { recursive: true });
await put("index.html", landing("es"));
await put("en/index.html", landing("en"));

for (const locale of ["es", "en"]) {
  for (const slug of Object.keys(pages[locale])) {
    const base = locale === "es" ? "" : "en/";
    await put(`${base}${slug}/index.html`, legal(locale, slug));
  }
}

await put("privacy.html", legal("es", "privacy"));
await put("privacy-en.html", legal("en", "privacy"));
await put("terms.html", legal("es", "terms"));
await put("terms-en.html", legal("en", "terms"));
await put("app-ads.txt", await appAdsTxt());
await put("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
const sitePaths = ["", "privacy", "terms", "support", "privacy-choices", "data-deletion", "legal-notice", "cookies", "accessibility"];
await put("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["es", "en"].flatMap((l) => sitePaths.map((p) => `<url><loc>${origin}${pathFor(l, p)}</loc><lastmod>${sitemapUpdated}</lastmod></url>`)).join("")}</urlset>\n`);
await put(".well-known/security.txt", `Contact: mailto:${email}\nExpires: 2027-08-02T00:00:00.000Z\nPreferred-Languages: es, en\nCanonical: ${origin}/.well-known/security.txt\n`);
await put("404.html", shell("es", { title: "Página no encontrada · CG Trivia", description: "La página solicitada no existe.", content: `<section class="not-found"><div class="wrap"><span>404</span><h1>Esta pregunta no estaba en el mazo.</h1><p>Vuelve al inicio para seguir jugando.</p><a class="button primary" href="/">Volver al inicio</a></div></section>` }));

await cp(join(root, "src/style.css"), join(dist, "assets/style.css"));
await cp(join(root, "src/theme.js"), join(dist, "assets/theme.js"));
await cp(join(projectRoot, "assets/icon.png"), join(dist, "app-icon.png"));
await cp(join(projectRoot, "assets/favicon.png"), join(dist, "favicon.png"));
await cp(join(root, "src/og-warm.png"), join(dist, "og.png"));
await cp(join(root, "src/og-warm.png"), join(dist, "og-warm.png"));
console.log(`Built CG Trivia website in ${dist}`);
