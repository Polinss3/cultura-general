import { Category, CategoryMeta, Question, RankingEntry } from '@/types';
import type { AppLang } from '@/lib/i18n';
import { QUESTIONS_EN, DAILY_QUESTION_EN } from './questionsEn';

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
  deportes: [
    {
      q: '¿Cada cuántos años se celebran los Juegos Olímpicos de verano?',
      opts: ['Cada 2 años', 'Cada 3 años', 'Cada 4 años', 'Cada 5 años'],
      ans: 2,
      ctx: 'Los Juegos Olímpicos de verano se celebran cada 4 años desde 1896, salvo cancelaciones por guerras mundiales. Los de invierno también son cada 4, alternándose cada 2 con los de verano.',
    },
    {
      q: '¿Qué país ha ganado más Mundiales de fútbol masculino?',
      opts: ['Alemania', 'Italia', 'Argentina', 'Brasil'],
      ans: 3,
      ctx: 'Brasil ha ganado 5 Copas del Mundo (1958, 1962, 1970, 1994 y 2002). Es el único país que ha participado en todas las ediciones del Mundial.',
    },
    {
      q: '¿Cuántos jugadores tiene un equipo de baloncesto en la cancha?',
      opts: ['4', '5', '6', '7'],
      ans: 1,
      ctx: 'Cada equipo tiene 5 jugadores en cancha: base, escolta, alero, ala-pívot y pívot. El baloncesto fue inventado por James Naismith en 1891.',
    },
  ],
  biologia: [
    {
      q: '¿Cuál es el órgano más grande del cuerpo humano?',
      opts: ['Hígado', 'Pulmón', 'Piel', 'Intestino'],
      ans: 2,
      ctx: 'La piel es el órgano más grande del cuerpo, con una superficie de unos 2 m² y un peso de hasta 5 kg en adultos. Es la primera barrera de defensa frente al exterior.',
    },
    {
      q: '¿Quién propuso la teoría celular junto con Theodor Schwann?',
      opts: ['Robert Hooke', 'Matthias Schleiden', 'Louis Pasteur', 'Gregor Mendel'],
      ans: 1,
      ctx: 'Matthias Schleiden (botánico) y Theodor Schwann (zoólogo) formularon la teoría celular hacia 1839: todos los seres vivos están compuestos por células.',
    },
    {
      q: '¿Cuántos cromosomas tiene una célula humana normal?',
      opts: ['23', '44', '46', '48'],
      ans: 2,
      ctx: 'Las células somáticas humanas tienen 46 cromosomas (23 pares). Los gametos (óvulos y espermatozoides) tienen 23 cromosomas no apareados.',
    },
  ],
  cine: [
    {
      q: "¿Quién dirigió 'El Padrino' (1972)?",
      opts: ['Martin Scorsese', 'Francis Ford Coppola', 'Stanley Kubrick', 'Steven Spielberg'],
      ans: 1,
      ctx: "Francis Ford Coppola dirigió 'El Padrino' (1972), basada en la novela de Mario Puzo. Ganó el Óscar a mejor película y es considerada una de las mejores películas de la historia.",
    },
    {
      q: '¿Qué película ganó el primer Óscar a la Mejor Película?',
      opts: ['Alas', 'Cantando bajo la lluvia', 'Ben-Hur', 'Lo que el viento se llevó'],
      ans: 0,
      ctx: "'Alas' (1927), de William A. Wellman, ganó el primer Óscar a la Mejor Película en 1929. Es la única película muda en obtener este premio.",
    },
    {
      q: "¿Quién protagonizó 'Forrest Gump'?",
      opts: ['Tom Hanks', 'Tom Cruise', 'Brad Pitt', 'Kevin Costner'],
      ans: 0,
      ctx: "Tom Hanks protagonizó 'Forrest Gump' (1994), dirigida por Robert Zemeckis. Ganó 6 Óscars, incluyendo Mejor Actor para Hanks (su segundo Óscar consecutivo).",
    },
  ],
  musica: [
    {
      q: '¿Cuántas cuerdas tiene una guitarra clásica estándar?',
      opts: ['4', '5', '6', '7'],
      ans: 2,
      ctx: 'La guitarra clásica española tiene 6 cuerdas afinadas E-A-D-G-B-E. Otras variantes incluyen guitarras de 7 o 12 cuerdas.',
    },
    {
      q: '¿Quién compuso la Novena Sinfonía con el "Himno de la Alegría"?',
      opts: ['Mozart', 'Bach', 'Beethoven', 'Schubert'],
      ans: 2,
      ctx: 'Ludwig van Beethoven compuso su Novena Sinfonía (1824), que incluye en su último movimiento el "Himno de la Alegría" sobre el poema de Schiller. La compuso ya completamente sordo.',
    },
    {
      q: '¿De qué país son originarios Los Beatles?',
      opts: ['Estados Unidos', 'Reino Unido', 'Irlanda', 'Australia'],
      ans: 1,
      ctx: 'Los Beatles se formaron en Liverpool (Inglaterra) en 1960. Sus miembros fueron John Lennon, Paul McCartney, George Harrison y Ringo Starr.',
    },
  ],
  literatura: [
    {
      q: "¿Quién escribió 'Don Quijote de la Mancha'?",
      opts: ['Lope de Vega', 'Miguel de Cervantes', 'Francisco de Quevedo', 'Calderón de la Barca'],
      ans: 1,
      ctx: "Miguel de Cervantes publicó la primera parte de 'Don Quijote' en 1605 y la segunda en 1615. Es considerada la primera novela moderna y la obra cumbre de la literatura en español.",
    },
    {
      q: "¿En qué siglo vivió William Shakespeare?",
      opts: ['XV-XVI', 'XVI-XVII', 'XVII-XVIII', 'XVIII-XIX'],
      ans: 1,
      ctx: 'Shakespeare vivió entre 1564 y 1616 (siglos XVI-XVII). Escribió 39 obras de teatro y 154 sonetos, incluyendo "Hamlet", "Macbeth" y "Romeo y Julieta".',
    },
    {
      q: "¿Quién escribió 'Cien años de soledad'?",
      opts: ['Mario Vargas Llosa', 'Jorge Luis Borges', 'Gabriel García Márquez', 'Julio Cortázar'],
      ans: 2,
      ctx: "Gabriel García Márquez publicó 'Cien años de soledad' en 1967. Es la obra emblemática del realismo mágico. Recibió el Premio Nobel de Literatura en 1982.",
    },
  ],
  tecnologia: [
    {
      q: '¿Quién fundó Microsoft junto con Paul Allen?',
      opts: ['Steve Jobs', 'Bill Gates', 'Larry Page', 'Mark Zuckerberg'],
      ans: 1,
      ctx: 'Bill Gates y Paul Allen fundaron Microsoft en 1975 en Albuquerque, Nuevo México. La empresa se trasladó a Redmond, Washington, en 1979.',
    },
    {
      q: '¿Qué significa "HTTP"?',
      opts: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Transport Process', 'Home Tool Transfer Protocol'],
      ans: 0,
      ctx: 'HTTP (HyperText Transfer Protocol) es el protocolo de la web, creado por Tim Berners-Lee en 1989. HTTPS añade cifrado TLS sobre HTTP.',
    },
    {
      q: '¿En qué año se lanzó el primer iPhone?',
      opts: ['2005', '2007', '2009', '2010'],
      ans: 1,
      ctx: 'El primer iPhone fue presentado por Steve Jobs el 9 de enero de 2007 y se lanzó al mercado el 29 de junio de ese año. Revolucionó el mercado de los smartphones.',
    },
  ],
  mitologia: [
    {
      q: '¿Quién es el rey de los dioses en la mitología griega?',
      opts: ['Apolo', 'Poseidón', 'Zeus', 'Hades'],
      ans: 2,
      ctx: 'Zeus es el rey del Olimpo, dios del cielo y del rayo. Su equivalente romano es Júpiter. Sus hermanos Poseidón y Hades gobiernan el mar y el inframundo respectivamente.',
    },
    {
      q: '¿Cuál es el equivalente romano de la diosa griega Afrodita?',
      opts: ['Diana', 'Venus', 'Juno', 'Minerva'],
      ans: 1,
      ctx: 'Venus es la diosa romana del amor y la belleza, equivalente a Afrodita en la mitología griega. El planeta Venus toma su nombre de ella.',
    },
    {
      q: '¿Quién es el dios del trueno en la mitología nórdica?',
      opts: ['Odín', 'Thor', 'Loki', 'Freyr'],
      ans: 1,
      ctx: 'Thor es el dios del trueno, hijo de Odín. Su martillo, Mjölnir, es uno de los símbolos más reconocibles de la mitología nórdica.',
    },
  ],
  astronomia: [
    {
      q: '¿Cuál es el planeta más grande del sistema solar?',
      opts: ['Saturno', 'Júpiter', 'Neptuno', 'Urano'],
      ans: 1,
      ctx: 'Júpiter es el mayor planeta del sistema solar, con una masa 318 veces la de la Tierra. Tiene al menos 95 lunas conocidas, siendo Ganímedes la mayor del sistema solar.',
    },
    {
      q: '¿Qué galaxia contiene a nuestro sistema solar?',
      opts: ['Andrómeda', 'Vía Láctea', 'Triángulo', 'Sombrero'],
      ans: 1,
      ctx: 'La Vía Láctea es una galaxia espiral barrada con unos 100.000 años luz de diámetro. Contiene entre 100.000 y 400.000 millones de estrellas.',
    },
    {
      q: '¿Quién fue el primer ser humano en pisar la Luna?',
      opts: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'Michael Collins'],
      ans: 1,
      ctx: 'Neil Armstrong pisó la Luna el 20 de julio de 1969 durante la misión Apolo 11, pronunciando la frase «Es un pequeño paso para el hombre, un gran salto para la humanidad».',
    },
  ],
};

export const DAILY_QUESTION: Question = {
  q: '¿Cuántos países forman la Unión Europea en 2024?',
  opts: ['25', '27', '30', '33'],
  ans: 1,
  ctx: 'La Unión Europea tiene 27 países miembros desde 2020, cuando el Reino Unido salió tras el Brexit. La UE fue fundada por 6 países en 1957 con el Tratado de Roma y ha ido ampliándose progresivamente.',
};

// Banco offline según el idioma activo (ES por defecto, EN si procede).
// El nombre de categoría user-facing vive en i18n (`categories.<slug>`).
export function getLocalQuestions(lang: AppLang): Record<Category, Question[]> {
  return lang === 'en' ? QUESTIONS_EN : QUESTIONS;
}

export function getLocalDailyQuestion(lang: AppLang): Question {
  return lang === 'en' ? DAILY_QUESTION_EN : DAILY_QUESTION;
}

export const RANKING: RankingEntry[] = [
  { name: 'Ana García', score: 2840, avatar: 'AG', streak: 14 },
  { name: 'Tú', score: 2310, avatar: 'TÚ', streak: 7, isMe: true },
  { name: 'Carlos M.', score: 1990, avatar: 'CM', streak: 5 },
  { name: 'Lucía P.', score: 1750, avatar: 'LP', streak: 3 },
  { name: 'Marcos R.', score: 1200, avatar: 'MR', streak: 1 },
];

export const CAT_COLORS: Record<Category, CategoryMeta> = {
  historia:   { bg: '#2d1f0a', accent: '#e8a030', text: '#f5c060' },
  geografia:  { bg: '#0a1f2d', accent: '#30a8e8', text: '#60c5f5' },
  ciencia:    { bg: '#0d2214', accent: '#2ec87a', text: '#60e09a' },
  arte:       { bg: '#1f0a2d', accent: '#a030e8', text: '#c560f5' },
  filosofia:  { bg: '#2d0a18', accent: '#e83060', text: '#f56080' },
  deportes:   { bg: '#0a2d1a', accent: '#30e89a', text: '#60f5b5' },
  biologia:   { bg: '#1a2d0a', accent: '#5ec830', text: '#90e060' },
  cine:       { bg: '#2d2410', accent: '#e8c030', text: '#f5d860' },
  musica:     { bg: '#2d0a22', accent: '#e83098', text: '#f560b0' },
  literatura: { bg: '#2d1f10', accent: '#a87030', text: '#d8a060' },
  tecnologia: { bg: '#0a1a2d', accent: '#3098e8', text: '#60b8f5' },
  mitologia:  { bg: '#1f0a2d', accent: '#9830e8', text: '#b860f5' },
  astronomia: { bg: '#0a2530', accent: '#30c8e8', text: '#60e0f5' },
};

export const CAT_ICONS: Record<Category, string> = {
  historia:   '📜',
  geografia:  '🌍',
  ciencia:    '⚗️',
  arte:       '🎨',
  filosofia:  '🧠',
  deportes:   '⚽',
  biologia:   '🧬',
  cine:       '🎬',
  musica:     '🎵',
  literatura: '📚',
  tecnologia: '💻',
  mitologia:  '🏛️',
  astronomia: '🪐',
};

// CAT_NAMES eliminado: los nombres de categoría user-facing viven en i18n
// (`categories.<slug>`). Los consumidores usan t(`categories.${slug}`).

export const ALL_CATEGORIES = Object.keys(QUESTIONS) as Category[];
