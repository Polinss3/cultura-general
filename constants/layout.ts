// ─── Anchos para iPad ────────────────────────────────────────────────────────
// La app se diseñó a ancho de móvil. En iPad el contenido se centra en una
// columna de este ancho (root en app/_layout.tsx) en vez de estirar botones y
// tarjetas a 1.000 puntos; en horizontal la columna queda centrada con
// márgenes del color de fondo. Los `Modal` de React Native se pintan fuera de
// esa columna (a pantalla completa), así que sus contenedores aplican
// `sheetWidth` por su cuenta.
export const MAX_CONTENT_WIDTH = 760;

/** Estilo para las hojas/modales: a todo el ancho en móvil, columna en iPad. */
export const sheetWidth = {
  width: '100%' as const,
  maxWidth: MAX_CONTENT_WIDTH,
  alignSelf: 'center' as const,
};
