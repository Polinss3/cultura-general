# CG · Campañas V3 · 20 de septiembre de 2026

Seis anuncios cortos y un recorrido completo, creados con grabaciones nuevas de CG 2.2.0 en el simulador local iPhone 17 Pro. Tipografía Nunito, fondos oscuros, colores de los modos, preguntas reales, gestos y respuestas grabados, música original y cierre de descarga.

| Archivo | Duración | Enfoque |
|---|---:|---|
| 01_te_la_sabes.mp4 | 20 s | Pregunta participativa, aprendizaje y Contrarreloj |
| 02_una_pregunta_un_viaje.mp4 | 19 s | Aventura, niveles, estrellas y Ascenso |
| 03_banderas_y_fechas.mp4 | 18 s | 196 banderas y 98 hechos históricos |
| 04_el_pique_del_grupo.mp4 | 19 s | Cinco modos locales, buzzer de Duelo y respuesta |
| 05_que_tu_pausa_cuente.mp4 | 20 s | Pregunta diaria, racha, ruta, misiones, ligas y tienda |
| 06_aprende_de_tus_fallos.mp4 | 20 s | Repaso, Examen, estadísticas y beneficios PRO |
| 07_descubre_cg_completo.mp4 | 55 s | Recorrido de los modos, progresión, PRO, idiomas y temas |

## Archivos de entrega

- `social/`: siete másteres MP4 verticales, 1080×1920, 30 fps, H.264 y audio AAC estéreo. Listos para subir a TikTok, Reels o Shorts. El recorrido completo dura 55 segundos.
- `inhouse/`: seis versiones comprimidas para entrega publicitaria, con los mismos mensajes y montaje. Duración inferior al máximo de 30 segundos de la plataforma.
- `posters/`: siete portadas JPEG de 1080×1920.
- `TEXTOS_PARA_REDES.md`: siete textos y etiquetas listos para adaptar al publicar.
- `published-drafts.json`: identificadores y estado real de las campañas creadas en In-House Ads; se genera después de cargarlas y leerlas de nuevo.
- `qa/verification.json`: dimensiones, códecs, duración, tamaño, SHA256 y comprobación de decodificación de cada exportación.
- `qa/*_contact.jpg`: revisión visual de cada escena, incluidas apertura y cierre.

## In-House Ads

Se crean seis campañas nuevas `CG V3 — … — captación ES`, cada una con una creatividad intersticial y otra recompensada, vídeo y portada validados. Se conserva el inventario previo.

Estado de entrega: **seis campañas activas y habilitadas**, publicadas por autorización del usuario. Receptores: 101 Juegos Offline y Miko, iOS/es. Cultura General está excluida de los receptores y mediante promotedAppId. Verificado: las seis campañas disponibles en los siete espacios receptores y ninguna en los ocho espacios de Cultura General. Informe: `activation-report.json`.

Destino: https://apps.apple.com/app/id6766927114. Idioma español y plataforma iOS. Receptores actualmente habilitados: **101 Juegos Offline y Miko**. Todas las creatividades incluyen la aplicación promocionada CG para impedir que se anuncie dentro de sí misma.

## Criterio editorial

Cada anuncio se centra en un motivo para descargar; el vídeo de 55 segundos reúne la experiencia. Los textos no necesitan sonido para entenderse. Los elementos principales se colocan lejos de los bordes superior, derecho e inferior; comprueba la previsualización de cada red si añades descripciones o stickers propios.

Las pantallas pertenecen a una cuenta con PRO. El catálogo ampliado, los 400 niveles y las funciones exclusivas se identifican como PRO. Se indican 40 niveles iniciales gratis para nuevas instalaciones. El cierre dice «Descarga gratuita · Compras dentro de la app». No se prometen resultados cognitivos ni cifras de descargas.

El vídeo muestra progreso real de la cuenta del simulador, no resultados garantizados para quien lo descargue. Los modos de amigos son locales, en un mismo dispositivo.

## Música

Banda instrumental generada para estas piezas: percusión, bajo y arpegios sintetizados en Python, sin muestras ni canciones de terceros. Objetivo de sonoridad de −16 LUFS y pico real de −1,5 dBTP. No hay locución ni dependencia de un audio de tendencia.

## Reconstrucción

Requiere Python con Pillow y numpy, FFmpeg/ffprobe y las fuentes Nunito instaladas en las dependencias del proyecto.

```sh
python3 marketing/videos/promocionales/v3/build.py
python3 marketing/videos/promocionales/v3/verify.py
```

También se puede reconstruir una pieza pasando su nombre sin extensión a `build.py`. `plans.json` contiene los textos, fuentes y cortes. `raw/` conserva las grabaciones originales. El render normaliza las grabaciones de frecuencia variable y mantiene el último fotograma de las pantallas quietas, sin acortar el tiempo de lectura.

`capture.py` y `simulator-gesture.swift` documentan la captura local. Para repetirla hay que abrir CG en el simulador y verificar el estado de las pantallas y la geometría de la ventana; no deben ejecutarse a ciegas sobre otra app. Las preferencias de idioma y apariencia del simulador se han restaurado tras grabar.

`provision_inhouse.py` se ejecuta en bellum. Utiliza la API administrativa y las credenciales que ya existen exclusivamente en el servidor; no incluye secretos en los archivos de entrega. Comprueba los SHA256 antes de subir medios, reutiliza por nombre al repetir la carga y verifica que las nuevas campañas siguen como borradores deshabilitados.

## Evaluación posterior

No hay datos de rendimiento todavía. Compara finalización de vídeo, clics y CTR por creatividad cuando decidas publicarlas. Para valorar descargas utiliza App Store Connect: un clic de In-House Ads no equivale a una instalación. No se puede afirmar una mejora de conversión sin medirla.

## Comprobación del acceso público

Los seis vídeos y seis portadas se verificaron con HTTP 200 en el servidor. Durante la activación, el dominio público HTTPS también respondió HTTP 200. La API de entrega confirmó las seis campañas disponibles en Miko y 101 Juegos Offline y ninguna en Cultura General. `published-drafts.json` y `uploaded-media-verification.json` conservan el registro histórico previo a la activación; el estado actual está en `activation-report.json`.
