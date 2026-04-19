import { Category, CategoryMeta, Question, RankingEntry } from '@/types';

export const QUESTIONS: Record<Category, Question[]> = {
  historia: [
    {
      q: '¿En qué año terminó la Primera Guerra Mundial?',
      opts: ['1916', '1917', '1918', '1919'],
      ans: 2,
      ctx: 'La Primera Guerra Mundial terminó el 11 de noviembre de 1918, cuando se firmó el Armisticio de Compiègne. El conflicto había durado cuatro años devastadores, causando más de 20 millones de muertos.',
    },
    {
      q: '¿Quién fue el primer emperador de Roma?',
      opts: ['Julio César', 'Augusto', 'Nerón', 'Tiberio'],
      ans: 1,
      ctx: "Augusto (Octavio) fue el primer emperador romano, gobernando del 27 a.C. al 14 d.C. Aunque Julio César ejerció gran poder, nunca fue oficialmente 'emperador', título que recayó en su sobrino-nieto.",
    },
    {
      q: '¿En qué año cayó el Muro de Berlín?',
      opts: ['1987', '1988', '1989', '1991'],
      ans: 2,
      ctx: 'El Muro de Berlín cayó el 9 de noviembre de 1989, tras 28 años separando la ciudad. Fue uno de los momentos más simbólicos del fin de la Guerra Fría y la reunificación alemana.',
    },
    {
      q: '¿Qué civilización construyó Machu Picchu?',
      opts: ['Azteca', 'Maya', 'Inca', 'Olmeca'],
      ans: 2,
      ctx: 'Machu Picchu fue construida por el Imperio Inca alrededor del siglo XV, probablemente como residencia real del emperador Pachacútec. Está ubicada en los Andes peruanos a 2.430 metros de altitud.',
    },
    {
      q: '¿En qué año llegó Cristóbal Colón a América?',
      opts: ['1490', '1492', '1498', '1502'],
      ans: 1,
      ctx: 'El 12 de octubre de 1492, Cristóbal Colón llegó a la isla de Guanahaní (Bahamas), creyendo haber llegado a Asia. Este viaje patrocinado por los Reyes Católicos marcó el inicio de la era colonial.',
    },
  ],
  geografia: [
    {
      q: '¿Cuál es el río más largo del mundo?',
      opts: ['Amazonas', 'Nilo', 'Yangtsé', 'Misisipi'],
      ans: 1,
      ctx: 'El Nilo, con aproximadamente 6.650 km de longitud, es considerado el río más largo del mundo, aunque hay debate científico con el Amazonas. Atraviesa 11 países africanos hasta desembocar en el Mediterráneo.',
    },
    {
      q: '¿En qué país se encuentra la Torre Eiffel?',
      opts: ['Bélgica', 'Suiza', 'Francia', 'Italia'],
      ans: 2,
      ctx: 'La Torre Eiffel está en París, Francia. Fue construida por Gustave Eiffel para la Exposición Universal de 1889 y mide 330 metros de altura. Inicialmente criticada, hoy es el monumento más visitado del mundo.',
    },
    {
      q: '¿Cuál es el país más grande del mundo por superficie?',
      opts: ['China', 'Canadá', 'Estados Unidos', 'Rusia'],
      ans: 3,
      ctx: 'Rusia es el país más grande del mundo, con 17,1 millones de km². Abarca 11 husos horarios, desde el este de Europa hasta el Pacífico, y representa el 11% de la superficie terrestre total.',
    },
    {
      q: '¿Dónde se encuentra la Gran Muralla China?',
      opts: ['Solo en Beijing', 'Norte de China', 'Costa este de China', 'Por todo el país'],
      ans: 1,
      ctx: 'La Gran Muralla China recorre el norte del país durante más de 21.000 km, aunque la longitud total varía según la medición. Fue construida para proteger el Imperio chino de las invasiones del norte.',
    },
    {
      q: '¿Cuál es la capital de Australia?',
      opts: ['Sídney', 'Melbourne', 'Canberra', 'Brisbane'],
      ans: 2,
      ctx: 'Canberra es la capital de Australia desde 1913. Fue diseñada especialmente para ser la capital, como solución de compromiso entre las rivales Sídney y Melbourne. Sídney es la ciudad más grande, pero no la capital.',
    },
  ],
  ciencia: [
    {
      q: '¿Cuántos elementos tiene la tabla periódica actualmente?',
      opts: ['108', '112', '118', '124'],
      ans: 2,
      ctx: 'La tabla periódica actual tiene 118 elementos confirmados, siendo el último el Oganesón (Og), añadido en 2016. El último grupo de cuatro elementos (113-116-117-118) fue confirmado por la IUPAC en ese año.',
    },
    {
      q: '¿A qué velocidad viaja la luz en el vacío?',
      opts: ['200.000 km/s', '300.000 km/s', '400.000 km/s', '150.000 km/s'],
      ans: 1,
      ctx: "La luz viaja a 299.792.458 m/s (≈300.000 km/s) en el vacío. Esta constante, llamada 'c', es fundamental en física y es el límite de velocidad del universo según la teoría de la relatividad de Einstein.",
    },
    {
      q: '¿Quién propuso la teoría de la evolución por selección natural?',
      opts: ['Gregor Mendel', 'Charles Darwin', 'Louis Pasteur', 'Alfred Wallace'],
      ans: 1,
      ctx: "Charles Darwin publicó 'El origen de las especies' en 1859, proponiendo la evolución por selección natural. Curiosamente, Alfred Wallace desarrolló ideas similares en paralelo, lo que aceleró la publicación de Darwin.",
    },
    {
      q: '¿De qué está hecho el diamante?',
      opts: ['Silicio', 'Carbono', 'Cuarzo', 'Cristal de roca'],
      ans: 1,
      ctx: 'El diamante está hecho de carbono puro cristalizado en una estructura cúbica a alta presión y temperatura. Es el material natural más duro conocido (10 en la escala de Mohs) y tiene el mismo elemento que el grafito.',
    },
    {
      q: '¿Cuántos huesos tiene el cuerpo humano adulto?',
      opts: ['186', '206', '226', '246'],
      ans: 1,
      ctx: 'El cuerpo humano adulto tiene 206 huesos. Al nacer tenemos unos 270-300 huesos, que se van fusionando durante el crecimiento. El más pequeño es el estribo (en el oído) y el más grande el fémur.',
    },
  ],
  arte: [
    {
      q: '¿Quién pintó La Gioconda (Mona Lisa)?',
      opts: ['Miguel Ángel', 'Rafael', 'Leonardo da Vinci', 'Botticelli'],
      ans: 2,
      ctx: 'Leonardo da Vinci pintó La Gioconda entre 1503 y 1519. Es la obra de arte más famosa del mundo, conservada en el Louvre de París. La identidad de la modelo sigue siendo debatida, aunque se cree que es Lisa Gherardini.',
    },
    {
      q: "¿En qué movimiento artístico se enmarca 'La noche estrellada' de Van Gogh?",
      opts: ['Impresionismo', 'Expresionismo', 'Surrealismo', 'Posimpresionismo'],
      ans: 3,
      ctx: "Van Gogh pertenece al Posimpresionismo, movimiento que partió del Impresionismo pero buscó mayor expresividad. 'La noche estrellada' (1889) fue pintada mientras estaba internado en el manicomio de Saint-Paul-de-Mausole.",
    },
    {
      q: "¿Quién esculpió 'El David'?",
      opts: ['Leonardo da Vinci', 'Donatello', 'Miguel Ángel', 'Rafael'],
      ans: 2,
      ctx: 'Miguel Ángel esculpió El David entre 1501 y 1504, con solo 26 años. Tallada en un único bloque de mármol de Carrara, mide 5,17 metros. Representa al bíblico David antes de enfrentarse a Goliat.',
    },
    {
      q: '¿De qué país es originaria la arquitectura del Taj Mahal?',
      opts: ['Pakistán', 'India', 'Turquía', 'Persia'],
      ans: 1,
      ctx: 'El Taj Mahal está en Agra, India. Fue construido por el emperador mogol Shah Jahan entre 1632 y 1653 en memoria de su esposa Mumtaz Mahal. Es considerado la obra maestra de la arquitectura mogola.',
    },
    {
      q: '¿En qué ciudad se encuentra el museo del Prado?',
      opts: ['Barcelona', 'Sevilla', 'Valencia', 'Madrid'],
      ans: 3,
      ctx: 'El Museo del Prado está en Madrid y es uno de los museos de arte más importantes del mundo. Alberga obras de Velázquez, Goya, El Greco y Rubens, entre otros. Fue inaugurado en 1819.',
    },
  ],
  filosofia: [
    {
      q: "¿Quién dijo 'Solo sé que no sé nada'?",
      opts: ['Platón', 'Aristóteles', 'Sócrates', 'Epicuro'],
      ans: 2,
      ctx: 'Sócrates (469-399 a.C.) es famoso por esta afirmación de humildad intelectual. Paradójicamente, conocemos su pensamiento a través de los escritos de su discípulo Platón, ya que Sócrates no dejó ningún texto.',
    },
    {
      q: "¿Qué filósofo escribió 'El mundo como voluntad y representación'?",
      opts: ['Kant', 'Hegel', 'Schopenhauer', 'Nietzsche'],
      ans: 2,
      ctx: "Arthur Schopenhauer publicó esta obra en 1818. En ella argumenta que la 'voluntad' es la fuerza ciega que impulsa toda la existencia, y que el sufrimiento es inherente a la vida. Influyó profundamente en Nietzsche y Wagner.",
    },
    {
      q: "¿Qué corriente filosófica propuso 'el mayor bien para el mayor número'?",
      opts: ['Kantianismo', 'Utilitarismo', 'Estoicismo', 'Existencialismo'],
      ans: 1,
      ctx: 'El Utilitarismo, fundado por Jeremy Bentham y desarrollado por John Stuart Mill, propone que la acción correcta es la que maximiza la felicidad total. Es una de las teorías éticas más influyentes en política y economía.',
    },
    {
      q: "¿Quién escribió 'Así habló Zaratustra'?",
      opts: ['Schopenhauer', 'Marx', 'Heidegger', 'Nietzsche'],
      ans: 3,
      ctx: "Friedrich Nietzsche publicó 'Así habló Zaratustra' entre 1883 y 1885. En ella introduce conceptos como el 'superhombre' (Übermensch) y la 'voluntad de poder'. Nietzsche la consideró su obra más importante.",
    },
    {
      q: "¿Qué filósofo escribió 'La República'?",
      opts: ['Aristóteles', 'Platón', 'Sócrates', 'Epicuro'],
      ans: 1,
      ctx: "Platón escribió 'La República' alrededor del 380 a.C. En ella expone su teoría del Estado ideal gobernado por filósofos-reyes y su famosa alegoría de la caverna, que ilustra la diferencia entre apariencia y realidad.",
    },
  ],
};

export const DAILY_QUESTION: Question = {
  q: '¿Cuántos países forman la Unión Europea en 2024?',
  opts: ['25', '27', '30', '33'],
  ans: 1,
  ctx: 'La Unión Europea tiene 27 países miembros desde 2020, cuando el Reino Unido salió tras el Brexit. La UE fue fundada por 6 países en 1957 con el Tratado de Roma y ha ido ampliándose progresivamente.',
};

export const RANKING: RankingEntry[] = [
  { name: 'Ana García', score: 2840, avatar: 'AG', streak: 14 },
  { name: 'Tú', score: 2310, avatar: 'TÚ', streak: 7, isMe: true },
  { name: 'Carlos M.', score: 1990, avatar: 'CM', streak: 5 },
  { name: 'Lucía P.', score: 1750, avatar: 'LP', streak: 3 },
  { name: 'Marcos R.', score: 1200, avatar: 'MR', streak: 1 },
];

export const CAT_COLORS: Record<Category, CategoryMeta> = {
  historia:  { bg: '#2d1f0a', accent: '#e8a030', text: '#f5c060' },
  geografia: { bg: '#0a1f2d', accent: '#30a8e8', text: '#60c5f5' },
  ciencia:   { bg: '#0d2214', accent: '#2ec87a', text: '#60e09a' },
  arte:      { bg: '#1f0a2d', accent: '#a030e8', text: '#c560f5' },
  filosofia: { bg: '#2d0a18', accent: '#e83060', text: '#f56080' },
};

export const CAT_ICONS: Record<Category, string> = {
  historia:  '📜',
  geografia: '🌍',
  ciencia:   '⚗️',
  arte:      '🎨',
  filosofia: '🧠',
};

export const CAT_NAMES: Record<Category, string> = {
  historia:  'Historia',
  geografia: 'Geografía',
  ciencia:   'Ciencia',
  arte:      'Arte',
  filosofia: 'Filosofía',
};

export const ALL_CATEGORIES = Object.keys(QUESTIONS) as Category[];
