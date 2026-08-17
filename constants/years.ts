// @generado por scripts/build-years.mjs — no editar a mano.
// Para cambiar eventos, años o dificultades, edita el script y vuelve a
// ejecutarlo: node scripts/build-years.mjs

import type { Category } from '@/types';

export interface YearEvent {
  /** Estable: se usa para el historial de "ya vistas" en Aprender. */
  id: string;
  /** Negativo = a.C. */
  year: number;
  /** 1 = de sobra conocido, 2 = intermedio, 3 = para quien controla. */
  difficulty: 1 | 2 | 3;
  /** Alimenta la mezcla por temas de Aprender. */
  category: Category;
  /**
   * Sintagma nominal, no pregunta: tiene que leerse bien como enunciado
   * ("¿En qué año fue…?") y como opción de una lista ("¿Qué pasó en 1989?").
   */
  text: { es: string; en: string };
}

export const YEAR_EVENTS: YearEvent[] = [
  { id: 'cesar-asesinato',         year:   -44, difficulty: 2, category: 'historia',    text: { es: 'El asesinato de Julio César', en: 'The assassination of Julius Caesar' } },
  { id: 'vesubio-pompeya',         year:    79, difficulty: 2, category: 'historia',    text: { es: 'La erupción del Vesubio que sepultó Pompeya', en: 'The eruption of Vesuvius that buried Pompeii' } },
  { id: 'roma-caida-occidente',    year:   476, difficulty: 3, category: 'historia',    text: { es: 'La caída del Imperio Romano de Occidente', en: 'The fall of the Western Roman Empire' } },
  { id: 'hastings',                year:  1066, difficulty: 3, category: 'historia',    text: { es: 'La batalla de Hastings', en: 'The Battle of Hastings' } },
  { id: 'carta-magna',             year:  1215, difficulty: 3, category: 'historia',    text: { es: 'La firma de la Carta Magna en Inglaterra', en: 'The signing of the Magna Carta in England' } },
  { id: 'peste-negra',             year:  1348, difficulty: 3, category: 'historia',    text: { es: 'La llegada de la peste negra a Europa', en: 'The arrival of the Black Death in Europe' } },
  { id: 'constantinopla',          year:  1453, difficulty: 2, category: 'historia',    text: { es: 'La caída de Constantinopla', en: 'The fall of Constantinople' } },
  { id: 'biblia-gutenberg',        year:  1455, difficulty: 3, category: 'tecnologia',  text: { es: 'La impresión de la Biblia de Gutenberg', en: 'The printing of the Gutenberg Bible' } },
  { id: 'colon-america',           year:  1492, difficulty: 1, category: 'historia',    text: { es: 'La llegada de Cristóbal Colón a América', en: 'Christopher Columbus reaching America' } },
  { id: 'lutero-tesis',            year:  1517, difficulty: 3, category: 'historia',    text: { es: 'Las 95 tesis de Lutero', en: 'Luther\'s 95 Theses' } },
  { id: 'vuelta-al-mundo',         year:  1522, difficulty: 2, category: 'historia',    text: { es: 'La primera vuelta al mundo, completada por Elcano', en: 'The first circumnavigation of the globe, completed by Elcano' } },
  { id: 'armada-invencible',       year:  1588, difficulty: 3, category: 'historia',    text: { es: 'La derrota de la Armada Invencible', en: 'The defeat of the Spanish Armada' } },
  { id: 'quijote-primera',         year:  1605, difficulty: 2, category: 'literatura',  text: { es: 'La publicación de la primera parte del Quijote', en: 'The publication of the first part of Don Quixote' } },
  { id: 'newton-principia',        year:  1687, difficulty: 3, category: 'ciencia',     text: { es: 'La publicación de los «Principia» de Newton', en: 'The publication of Newton\'s \'Principia\'' } },
  { id: 'terremoto-lisboa',        year:  1755, difficulty: 3, category: 'historia',    text: { es: 'El terremoto de Lisboa', en: 'The Lisbon earthquake' } },
  { id: 'eeuu-independencia',      year:  1776, difficulty: 1, category: 'historia',    text: { es: 'La independencia de Estados Unidos', en: 'The independence of the United States' } },
  { id: 'revolucion-francesa',     year:  1789, difficulty: 1, category: 'historia',    text: { es: 'El comienzo de la Revolución Francesa', en: 'The start of the French Revolution' } },
  { id: 'mozart-muerte',           year:  1791, difficulty: 2, category: 'musica',      text: { es: 'La muerte de Mozart', en: 'The death of Mozart' } },
  { id: 'napoleon-coronacion',     year:  1804, difficulty: 2, category: 'historia',    text: { es: 'La coronación de Napoleón como emperador', en: 'Napoleon\'s coronation as emperor' } },
  { id: 'waterloo',                year:  1815, difficulty: 2, category: 'historia',    text: { es: 'La batalla de Waterloo', en: 'The Battle of Waterloo' } },
  { id: 'darwin-especies',         year:  1859, difficulty: 2, category: 'ciencia',     text: { es: 'La publicación de «El origen de las especies»', en: 'The publication of \'On the Origin of Species\'' } },
  { id: 'cruz-roja',               year:  1863, difficulty: 3, category: 'historia',    text: { es: 'La fundación de la Cruz Roja', en: 'The founding of the Red Cross' } },
  { id: 'lincoln-asesinato',       year:  1865, difficulty: 2, category: 'historia',    text: { es: 'El asesinato de Abraham Lincoln', en: 'The assassination of Abraham Lincoln' } },
  { id: 'canal-suez',              year:  1869, difficulty: 3, category: 'historia',    text: { es: 'La apertura del canal de Suez', en: 'The opening of the Suez Canal' } },
  { id: 'telefono-bell',           year:  1876, difficulty: 2, category: 'tecnologia',  text: { es: 'La patente del teléfono de Alexander Graham Bell', en: 'Alexander Graham Bell\'s telephone patent' } },
  { id: 'coca-cola',               year:  1886, difficulty: 3, category: 'tecnologia',  text: { es: 'La invención de la Coca-Cola', en: 'The invention of Coca-Cola' } },
  { id: 'torre-eiffel',            year:  1889, difficulty: 2, category: 'arte',        text: { es: 'La construcción de la Torre Eiffel', en: 'The building of the Eiffel Tower' } },
  { id: 'voleibol',                year:  1895, difficulty: 3, category: 'deportes',    text: { es: 'La invención del voleibol', en: 'The invention of volleyball' } },
  { id: 'jjoo-modernos',           year:  1896, difficulty: 2, category: 'deportes',    text: { es: 'Los primeros Juegos Olímpicos modernos, en Atenas', en: 'The first modern Olympic Games, in Athens' } },
  { id: 'electron',                year:  1897, difficulty: 3, category: 'ciencia',     text: { es: 'El descubrimiento del electrón', en: 'The discovery of the electron' } },
  { id: 'fc-barcelona',            year:  1899, difficulty: 2, category: 'deportes',    text: { es: 'La fundación del FC Barcelona', en: 'The founding of FC Barcelona' } },
  { id: 'futbol-olimpico',         year:  1900, difficulty: 3, category: 'deportes',    text: { es: 'El debut del fútbol como deporte olímpico', en: 'The debut of football as an Olympic sport' } },
  { id: 'real-madrid',             year:  1902, difficulty: 2, category: 'deportes',    text: { es: 'La fundación del Real Madrid', en: 'The founding of Real Madrid' } },
  { id: 'fifa',                    year:  1904, difficulty: 2, category: 'deportes',    text: { es: 'La fundación de la FIFA', en: 'The founding of FIFA' } },
  { id: 'revolucion-rusa',         year:  1917, difficulty: 2, category: 'historia',    text: { es: 'La Revolución Rusa', en: 'The Russian Revolution' } },
  { id: 'ww1-final',               year:  1918, difficulty: 1, category: 'historia',    text: { es: 'El final de la Primera Guerra Mundial', en: 'The end of World War I' } },
  { id: 'versalles',               year:  1919, difficulty: 2, category: 'historia',    text: { es: 'La firma del Tratado de Versalles', en: 'The signing of the Treaty of Versailles' } },
  { id: 'jjoo-invierno',           year:  1924, difficulty: 3, category: 'deportes',    text: { es: 'Los primeros Juegos Olímpicos de Invierno', en: 'The first Winter Olympic Games' } },
  { id: 'primer-mundial',          year:  1930, difficulty: 2, category: 'deportes',    text: { es: 'El primer Mundial de fútbol', en: 'The first football World Cup' } },
  { id: 'elvis-nacimiento',        year:  1935, difficulty: 3, category: 'musica',      text: { es: 'El nacimiento de Elvis Presley', en: 'The birth of Elvis Presley' } },
  { id: 'lorca-asesinato',         year:  1936, difficulty: 2, category: 'literatura',  text: { es: 'El asesinato de Federico García Lorca', en: 'The murder of Federico García Lorca' } },
  { id: 'onu',                     year:  1945, difficulty: 2, category: 'historia',    text: { es: 'La fundación de la ONU', en: 'The founding of the UN' } },
  { id: 'ww2-final',               year:  1945, difficulty: 1, category: 'historia',    text: { es: 'El final de la Segunda Guerra Mundial', en: 'The end of World War II' } },
  { id: 'nba',                     year:  1946, difficulty: 3, category: 'deportes',    text: { es: 'La fundación de la NBA', en: 'The founding of the NBA' } },
  { id: 'india-independencia',     year:  1947, difficulty: 2, category: 'historia',    text: { es: 'La independencia de la India', en: 'The independence of India' } },
  { id: 'ddhh',                    year:  1948, difficulty: 2, category: 'historia',    text: { es: 'La Declaración Universal de los Derechos Humanos', en: 'The Universal Declaration of Human Rights' } },
  { id: 'otan',                    year:  1949, difficulty: 2, category: 'historia',    text: { es: 'La fundación de la OTAN', en: 'The founding of NATO' } },
  { id: 'bannister-milla',         year:  1954, difficulty: 3, category: 'deportes',    text: { es: 'La primera milla por debajo de cuatro minutos', en: 'The first sub-four-minute mile' } },
  { id: 'pacto-varsovia',          year:  1955, difficulty: 3, category: 'historia',    text: { es: 'La firma del Pacto de Varsovia', en: 'The signing of the Warsaw Pact' } },
  { id: 'sputnik',                 year:  1957, difficulty: 2, category: 'astronomia',  text: { es: 'El lanzamiento del Sputnik 1, primer satélite', en: 'The launch of Sputnik 1, the first satellite' } },
  { id: 'revolucion-cubana',       year:  1959, difficulty: 2, category: 'historia',    text: { es: 'La Revolución Cubana', en: 'The Cuban Revolution' } },
  { id: 'paralimpicos',            year:  1960, difficulty: 3, category: 'deportes',    text: { es: 'Los primeros Juegos Paralímpicos', en: 'The first Paralympic Games' } },
  { id: 'kennedy-asesinato',       year:  1963, difficulty: 2, category: 'historia',    text: { es: 'El asesinato de John F. Kennedy', en: 'The assassination of John F. Kennedy' } },
  { id: 'super-bowl',              year:  1967, difficulty: 3, category: 'deportes',    text: { es: 'La primera Super Bowl', en: 'The first Super Bowl' } },
  { id: 'alunizaje',               year:  1969, difficulty: 1, category: 'astronomia',  text: { es: 'La llegada del ser humano a la Luna', en: 'Humans reaching the Moon' } },
  { id: 'beatles-separacion',      year:  1970, difficulty: 2, category: 'musica',      text: { es: 'La separación de The Beatles', en: 'The break-up of The Beatles' } },
  { id: 'apolo-ultima',            year:  1972, difficulty: 3, category: 'astronomia',  text: { es: 'La última misión Apolo tripulada a la Luna', en: 'The last crewed Apollo mission to the Moon' } },
  { id: 'apple',                   year:  1976, difficulty: 2, category: 'tecnologia',  text: { es: 'La fundación de Apple', en: 'The founding of Apple' } },
  { id: 'elvis-muerte',            year:  1977, difficulty: 2, category: 'musica',      text: { es: 'La muerte de Elvis Presley', en: 'The death of Elvis Presley' } },
  { id: 'star-wars',               year:  1977, difficulty: 2, category: 'cine',        text: { es: 'El estreno de la primera «Star Wars»', en: 'The release of the first \'Star Wars\'' } },
  { id: 'constitucion-es',         year:  1978, difficulty: 2, category: 'historia',    text: { es: 'La promulgación de la Constitución española vigente', en: 'The enactment of the current Spanish Constitution' } },
  { id: 'nba-triple',              year:  1979, difficulty: 3, category: 'deportes',    text: { es: 'La introducción de la línea de tres puntos en la NBA', en: 'The introduction of the 3-point line in the NBA' } },
  { id: 'nobel-garcia-marquez',    year:  1982, difficulty: 2, category: 'literatura',  text: { es: 'El Nobel de Literatura de García Márquez', en: 'García Márquez\'s Nobel Prize in Literature' } },
  { id: 'macintosh',               year:  1984, difficulty: 2, category: 'tecnologia',  text: { es: 'El lanzamiento del primer Macintosh', en: 'The launch of the first Macintosh' } },
  { id: 'mundial-rugby',           year:  1987, difficulty: 3, category: 'deportes',    text: { es: 'El primer Mundial de Rugby', en: 'The first Rugby World Cup' } },
  { id: 'muro-berlin',             year:  1989, difficulty: 1, category: 'historia',    text: { es: 'La caída del Muro de Berlín', en: 'The fall of the Berlin Wall' } },
  { id: 'nobel-cela',              year:  1989, difficulty: 2, category: 'literatura',  text: { es: 'El Nobel de Literatura de Camilo José Cela', en: 'Camilo José Cela\'s Nobel Prize in Literature' } },
  { id: 'alemania-reunificada',    year:  1990, difficulty: 2, category: 'historia',    text: { es: 'La reunificación de Alemania', en: 'The reunification of Germany' } },
  { id: 'mundial-femenino',        year:  1991, difficulty: 2, category: 'deportes',    text: { es: 'El primer Mundial de fútbol femenino', en: 'The first Women\'s Football World Cup' } },
  { id: 'urss-disolucion',         year:  1991, difficulty: 2, category: 'historia',    text: { es: 'La disolución de la Unión Soviética', en: 'The dissolution of the Soviet Union' } },
  { id: 'jjoo-barcelona',          year:  1992, difficulty: 1, category: 'deportes',    text: { es: 'Los Juegos Olímpicos de Barcelona', en: 'The Barcelona Olympic Games' } },
  { id: 'amazon',                  year:  1994, difficulty: 2, category: 'tecnologia',  text: { es: 'La fundación de Amazon', en: 'The founding of Amazon' } },
  { id: 'cobain-muerte',           year:  1994, difficulty: 3, category: 'musica',      text: { es: 'La muerte de Kurt Cobain', en: 'The death of Kurt Cobain' } },
  { id: 'windows-95',              year:  1995, difficulty: 2, category: 'tecnologia',  text: { es: 'El lanzamiento de Windows 95', en: 'The release of Windows 95' } },
  { id: 'futbol-fem-olimpico',     year:  1996, difficulty: 3, category: 'deportes',    text: { es: 'El debut del fútbol femenino en los Juegos Olímpicos', en: 'The debut of women\'s football at the Olympics' } },
  { id: 'titanic-pelicula',        year:  1997, difficulty: 1, category: 'cine',        text: { es: 'El estreno de «Titanic»', en: 'The release of \'Titanic\'' } },
  { id: 'google',                  year:  1998, difficulty: 2, category: 'tecnologia',  text: { es: 'La fundación de Google', en: 'The founding of Google' } },
  { id: 'torres-gemelas',          year:  2001, difficulty: 1, category: 'historia',    text: { es: 'Los atentados del 11-S contra las Torres Gemelas', en: 'The 9/11 attacks on the Twin Towers' } },
  { id: 'windows-xp',              year:  2001, difficulty: 3, category: 'tecnologia',  text: { es: 'El lanzamiento de Windows XP', en: 'The release of Windows XP' } },
  { id: 'euro-circulacion',        year:  2002, difficulty: 2, category: 'historia',    text: { es: 'La entrada en circulación del euro', en: 'The euro entering circulation' } },
  { id: 'facebook',                year:  2004, difficulty: 2, category: 'tecnologia',  text: { es: 'La fundación de Facebook', en: 'The founding of Facebook' } },
  { id: 'messi-debut',             year:  2004, difficulty: 2, category: 'deportes',    text: { es: 'El debut de Lionel Messi con el FC Barcelona', en: 'Lionel Messi\'s debut with FC Barcelona' } },
  { id: 'youtube',                 year:  2005, difficulty: 2, category: 'tecnologia',  text: { es: 'La fundación de YouTube', en: 'The founding of YouTube' } },
  { id: 'pluton-planeta',          year:  2006, difficulty: 2, category: 'astronomia',  text: { es: 'La pérdida de la condición de planeta de Plutón', en: 'Pluto\'s loss of planet status' } },
  { id: 'iphone',                  year:  2007, difficulty: 1, category: 'tecnologia',  text: { es: 'El lanzamiento del primer iPhone', en: 'The launch of the first iPhone' } },
  { id: 'bitcoin-whitepaper',      year:  2008, difficulty: 2, category: 'tecnologia',  text: { es: 'La publicación del whitepaper de Bitcoin', en: 'The publication of the Bitcoin whitepaper' } },
  { id: 'avatar-pelicula',         year:  2009, difficulty: 2, category: 'cine',        text: { es: 'El estreno de «Avatar»', en: 'The release of \'Avatar\'' } },
  { id: 'espana-mundial',          year:  2010, difficulty: 1, category: 'deportes',    text: { es: 'El único Mundial de fútbol masculino ganado por España', en: 'Spain\'s only men\'s football World Cup win' } },
  { id: 'jobs-muerte',             year:  2011, difficulty: 2, category: 'tecnologia',  text: { es: 'La muerte de Steve Jobs', en: 'The death of Steve Jobs' } },
  { id: 'netflix-originales',      year:  2013, difficulty: 3, category: 'tecnologia',  text: { es: 'Las primeras series originales de Netflix', en: 'Netflix\'s first original series' } },
  { id: 'usb-c',                   year:  2014, difficulty: 3, category: 'tecnologia',  text: { es: 'El lanzamiento del USB-C', en: 'The launch of USB-C' } },
  { id: 'ethereum',                year:  2015, difficulty: 3, category: 'tecnologia',  text: { es: 'El lanzamiento de Ethereum', en: 'The launch of Ethereum' } },
  { id: 'tiktok',                  year:  2017, difficulty: 3, category: 'tecnologia',  text: { es: 'El lanzamiento internacional de TikTok', en: 'The international launch of TikTok' } },
  { id: 'var-liga',                year:  2018, difficulty: 3, category: 'deportes',    text: { es: 'La introducción del VAR en la Liga española', en: 'The introduction of VAR in the Spanish league' } },
  { id: 'covid-pandemia',          year:  2020, difficulty: 1, category: 'historia',    text: { es: 'La declaración de pandemia de COVID-19 por la OMS', en: 'The WHO declaring COVID-19 a pandemic' } },
  { id: 'jjoo-tokio',              year:  2021, difficulty: 2, category: 'deportes',    text: { es: 'Los Juegos Olímpicos de Tokio, aplazados por la pandemia', en: 'The Tokyo Olympic Games, postponed by the pandemic' } },
  { id: 'windows-11',              year:  2021, difficulty: 3, category: 'tecnologia',  text: { es: 'El lanzamiento de Windows 11', en: 'The release of Windows 11' } },
  { id: 'ucrania-invasion',        year:  2022, difficulty: 1, category: 'historia',    text: { es: 'El comienzo de la invasión rusa de Ucrania', en: 'The start of the Russian invasion of Ukraine' } },
];
