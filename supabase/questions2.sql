-- ─────────────────────────────────────────────────────────────
-- Cultura General — Banco de preguntas Vol. 2 (~350 preguntas)
-- Ejecutar DESPUÉS de schema.sql (y opcionalmente questions.sql)
-- ─────────────────────────────────────────────────────────────

insert into public.questions (category, question, options, answer_index, context, difficulty) values

-- ══════════════════════════════════════════════════════════════
-- HISTORIA Vol. 2
-- ══════════════════════════════════════════════════════════════

('historia', '¿Qué imperio fue el más grande de la historia?',
 '["Imperio Romano","Imperio Mongol","Imperio Británico","Imperio Español"]', 1,
 'El Imperio Mongol (s. XIII) alcanzó 24 millones de km², el mayor contiguo de la historia. El Imperio Británico fue el mayor en extensión total, con 35,5 millones de km².',
 'medium'),

('historia', '¿Quién fue Julio César?',
 '["El primer emperador romano","Un general y dictador romano asesinado en el Senado","El fundador de Roma","Un filósofo romano"]', 1,
 'Julio César fue dictador romano asesinado el 15 de marzo del 44 a.C. («los idus de marzo»). Su sobrino nieto Augusto se convirtió en el primer emperador.',
 'easy'),

('historia', '¿Qué fue la Peste Negra?',
 '["Una guerra medieval","Una epidemia de peste bubónica que mató a un tercio de Europa","Una erupción volcánica","Una hambruna generalizada"]', 1,
 'La Peste Negra (1347-1353) mató entre 30 y 60% de la población europea, unos 25 millones de personas. Fue causada por la bacteria Yersinia pestis.',
 'easy'),

('historia', '¿Qué fue la Guerra de los Cien Años?',
 '["Una guerra entre Roma y Cartago","Un conflicto entre Inglaterra y Francia (1337-1453)","La guerra de los Treinta Años","Una cruzada"]', 1,
 'La Guerra de los Cien Años (1337-1453) enfrentó a Inglaterra y Francia por el trono francés. Juana de Arco fue la heroína francesa que cambió el curso de la guerra.',
 'medium'),

('historia', '¿Quién fue Juana de Arco?',
 '["Una reina de Francia","Una campesina francesa que lideró ejércitos y fue quemada por hereje","Una espia inglesa","Una santa canonizada en vida"]', 1,
 'Juana de Arco (1412-1431) lideró el ejército francés guiada por visiones religiosas. Fue capturada, juzgada por herejía y quemada viva. Canonizada en 1920.',
 'easy'),

('historia', '¿Qué fue el Renacimiento?',
 '["Una revolución política","Un movimiento cultural y artístico que recuperó la cultura clásica grecolatina","Una reforma religiosa","Una revolución industrial"]', 1,
 'El Renacimiento (s. XIV-XVII) comenzó en Italia y se extendió por Europa. Revalorizó el humanismo, el arte y la ciencia. Leonardo, Miguel Ángel y Erasmo son sus figuras.',
 'easy'),

('historia', '¿Qué fue la Reforma Protestante?',
 '["Una reforma constitucional en Europa","El movimiento religioso iniciado por Lutero que dividió el cristianismo","La reforma de la Iglesia Católica en el Concilio de Trento","Una revuelta campesina"]', 1,
 'Martín Lutero inició la Reforma en 1517 al publicar sus 95 tesis. Creó el protestantismo, dividiendo el cristianismo europeo en católicos y protestantes.',
 'medium'),

('historia', '¿Quién fue Martín Lutero?',
 '["Un rey alemán","Un monje y teólogo que inició la Reforma Protestante","Un papa reformista","Un filósofo humanista"]', 1,
 'Martín Lutero (1483-1546) fue un monje agustino que en 1517 publicó sus 95 tesis contra las indulgencias. Fue excomulgado pero protegido por príncipes alemanes.',
 'medium'),

('historia', '¿Qué fue la Armada Invencible?',
 '["La flota inglesa que venció a España","La flota española enviada a invadir Inglaterra en 1588, que fue derrotada","Un ejército romano","La flota portuguesa de exploración"]', 1,
 'Felipe II envió la Armada Invencible en 1588 para invadir Inglaterra. Fue derrotada por la flota inglesa de Drake y por las tormentas. Marcó el declive español.',
 'medium'),

('historia', '¿Quién fue Galileo Galilei?',
 '["Un filósofo italiano del Renacimiento","Un astrónomo y físico que defendió el heliocentrismo","Un explorador del Renacimiento","Un médico que descubrió la circulación sanguínea"]', 1,
 'Galileo (1564-1642) mejoró el telescopio, observó los satélites de Júpiter y apoyó el heliocentrismo de Copérnico. Fue condenado por la Inquisición.',
 'medium'),

('historia', '¿Qué fue la Revolución Industrial?',
 '["Una revolución política en Gran Bretaña","El proceso de mecanización de la producción iniciado en Gran Bretaña en el s. XVIII","Una revolución agraria en Francia","Una revolución tecnológica en EE.UU."]', 1,
 'La Revolución Industrial comenzó en Gran Bretaña hacia 1760 con la máquina de vapor de Watt. Transformó la economía mundial de agrícola a industrial.',
 'easy'),

('historia', '¿Quién inventó la imprenta de tipos móviles en Europa?',
 '["Leonardo da Vinci","Johannes Gutenberg","Roger Bacon","William Caxton"]', 1,
 'Gutenberg inventó la imprenta de tipos móviles en Europa hacia 1450, imprimiendo la Biblia de Gutenberg. Revolucionó la difusión del conocimiento.',
 'medium'),

('historia', '¿Qué fue la Inquisición?',
 '["Una institución educativa medieval","Un tribunal eclesiástico para perseguir la herejía","Un impuesto medieval","Un concilio eclesiástico"]', 1,
 'La Inquisición fue un tribunal eclesiástico que persiguió la herejía en Europa desde el siglo XII. La española (1478-1834) fue especialmente rigurosa.',
 'medium'),

('historia', '¿Cuándo se independizó Estados Unidos?',
 '["1775","1776","1783","1789"]', 1,
 'La Declaración de Independencia fue el 4 de julio de 1776. La guerra terminó en 1783 con el Tratado de París. La Constitución entró en vigor en 1789.',
 'easy'),

('historia', '¿Quién fue Simón Bolívar?',
 '["El libertador de Argentina","El héroe de la independencia latinoamericana que liberó Venezuela, Colombia, Ecuador, Perú y Bolivia","El primer presidente de México","Un general napoleónico"]', 1,
 'Simón Bolívar (1783-1830) lideró la independencia de Venezuela, Colombia, Ecuador, Perú y Bolivia, que lleva su nombre. Se le conoce como «El Libertador».',
 'medium'),

('historia', '¿Qué fue la Guerra de Crimea?',
 '["Una guerra entre Rusia y Turquía en el s. XIX","Una guerra de la Primera Guerra Mundial","Una guerra medieval entre mongoles y rusos","Una guerra colonial"]', 0,
 'La Guerra de Crimea (1853-1856) enfrentó a Rusia contra el Imperio Otomano, Francia, Reino Unido y Cerdeña. Florence Nightingale modernizó la enfermería durante este conflicto.',
 'hard'),

('historia', '¿Quién fue Nelson Mandela?',
 '["Primer presidente de Nigeria","Activista y primer presidente negro de Sudáfrica","Líder del movimiento por los derechos civiles en EE.UU.","Primer ministro de Zimbabue"]', 1,
 'Nelson Mandela (1918-2013) luchó contra el Apartheid, fue encarcelado 27 años y se convirtió en el primer presidente elegido democráticamente en Sudáfrica (1994).',
 'easy'),

('historia', '¿Qué fue la Guerra Fría?',
 '["Una guerra entre el Ártico y la Antártida","La tensión política y militar entre EE.UU. y la URSS (1947-1991)","Una guerra entre países escandinavos","Una guerra no declarada entre Europa y Rusia"]', 1,
 'La Guerra Fría (1947-1991) fue la rivalidad entre EE.UU. y la URSS sin conflicto directo. Incluyó la carrera armamentística, espacial y conflictos indirectos.',
 'easy'),

('historia', '¿En qué año se disolvió la Unión Soviética?',
 '["1989","1990","1991","1992"]', 2,
 'La URSS se disolvió oficialmente el 25 de diciembre de 1991, cuando Gorbachov renunció. Dió lugar a 15 repúblicas independientes, con Rusia como principal sucesora.',
 'medium'),

('historia', '¿Quién fue Mao Tse-Tung?',
 '["El primer presidente de la República China","El fundador de la República Popular China y líder del Partido Comunista Chino","Un general de la Segunda Guerra Mundial","El último emperador chino"]', 1,
 'Mao Tse-Tung (1893-1976) fundó la República Popular China en 1949. Su «Gran Salto Adelante» y la Revolución Cultural causaron decenas de millones de muertos.',
 'medium'),

('historia', '¿Qué fue Pearl Harbor?',
 '["Una base naval británica","El ataque japonés a la base naval estadounidense en Hawái en 1941","Una batalla naval en el Pacífico","Un puerto de abastecimiento aliado"]', 1,
 'El 7 de diciembre de 1941, Japón atacó la base de Pearl Harbor. Causó la entrada de EE.UU. en la Segunda Guerra Mundial. Roosevelt lo llamó «día de la infamia».',
 'easy'),

('historia', '¿Quién fue Hernán Cortés?',
 '["El conquistador del Imperio Inca","El conquistador del Imperio Azteca","El descubridor de Florida","El primer gobernador de Cuba"]', 1,
 'Hernán Cortés (1485-1547) conquistó el Imperio Azteca entre 1519-1521 con 600 hombres, apoyándose en alianzas con pueblos enemigos de los aztecas.',
 'medium'),

('historia', '¿Qué fue la batalla de Lepanto (1571)?',
 '["Una batalla entre España y Portugal","La victoria de la Liga Santa sobre los turcos otomanos en el Mediterráneo","Una batalla de la Reconquista","Un combate naval entre piratas"]', 1,
 'En Lepanto (1571) la Liga Santa (España, Venecia, Papa) derrotó a la flota otomana. Miguel de Cervantes participó y perdió la movilidad de su mano izquierda.',
 'hard'),

('historia', '¿Qué fue el Plan Marshall?',
 '["Un plan militar de la OTAN","El programa de ayuda económica de EE.UU. para reconstruir Europa tras la IIGM","Un tratado de paz entre Alemania y los aliados","Una estrategia militar para contener a la URSS"]', 1,
 'El Plan Marshall (1948-1952) fue el programa de ayuda económica de EE.UU. que proporcionó 12.000 millones de dólares para reconstruir Europa occidental.',
 'medium'),

('historia', '¿Cuándo fue la Revolución Cubana?',
 '["1953","1956","1959","1962"]', 2,
 'La Revolución Cubana triunfó el 1 de enero de 1959, cuando Fidel Castro derrocó al dictador Batista. Fidel gobernó Cuba hasta 2008, cuando cedió el poder a su hermano Raúl.',
 'medium'),

('historia', '¿Qué fue la crisis de los misiles de Cuba (1962)?',
 '["Una invasión de EE.UU. a Cuba","La confrontación nuclear entre EE.UU. y la URSS por misiles soviéticos en Cuba","Una guerra entre Cuba y EE.UU.","Un bloqueo económico a Cuba"]', 1,
 'En 1962, EE.UU. descubrió misiles soviéticos en Cuba. Los 13 días de tensión entre Kennedy y Jruschov fueron el momento más cercano a una guerra nuclear.',
 'medium'),

('historia', '¿Quién fue Cleopatra?',
 '["La primera faraona de Egipto","La última reina activa del Antiguo Egipto, aliada de César y Marco Antonio","Una sacerdotisa del templo de Isis","Una princesa macedonia que gobernó Egipto"]', 1,
 'Cleopatra VII (69-30 a.C.) fue la última reina activa del Antiguo Egipto. Hablaba 9 idiomas, tuvo hijos con Julio César y Marco Antonio. Se suicidó tras la derrota ante Augusto.',
 'easy'),

('historia', '¿Qué fue la Batalla de Waterloo?',
 '["La derrota de Wellington ante Napoleón","La derrota definitiva de Napoleón ante Wellington y Blücher en 1815","La victoria francesa en la campaña de Rusia","Una batalla de la Primera Guerra Mundial"]', 1,
 'En Waterloo (18 junio 1815), Napoleón fue derrotado por la coalición de Wellington (Reino Unido) y Blücher (Prusia). Fue exiliado a Santa Elena.',
 'medium'),

('historia', '¿Qué fue el Holocausto?',
 '["La batalla final de la IIGM","El genocidio sistemático de 6 millones de judíos y millones más por los nazis","La destrucción de Dresde","Los bombardeos aliados sobre Alemania"]', 1,
 'El Holocausto fue el exterminio sistemático de judíos, gitanos, homosexuales y otros grupos por el régimen nazi. Los campos de exterminio como Auschwitz son su símbolo.',
 'easy'),

('historia', '¿En qué año se fundó la ONU?',
 '["1943","1945","1947","1950"]', 1,
 'La ONU fue fundada el 24 de octubre de 1945, con 51 países fundadores, para mantener la paz tras la Segunda Guerra Mundial. Hoy tiene 193 estados miembros.',
 'medium'),

('historia', '¿Quién fue Leonardo da Vinci?',
 '["Solo un pintor renacentista","Un genio renacentista: pintor, escultor, arquitecto, científico e inventor","Un matemático y físico italiano","Un filósofo humanista"]', 1,
 'Leonardo da Vinci (1452-1519) fue el arquetipo del «hombre del Renacimiento». Pintó la Mona Lisa y La Última Cena, diseñó máquinas voladoras y estudió anatomía.',
 'easy'),

('historia', '¿Qué fue la Guerra de Vietnam?',
 '["Una guerra entre Vietnam del Norte y del Sur, con intervención de EE.UU.","Una guerra colonial francesa","Una invasión china a Vietnam","Una guerra de independencia contra Japón"]', 0,
 'La Guerra de Vietnam (1955-1975) enfrentó al Vietnam comunista del Norte (con apoyo soviético y chino) contra el Sur (con apoyo de EE.UU.). Terminó con la unificación comunista.',
 'medium'),

-- ══════════════════════════════════════════════════════════════
-- GEOGRAFÍA Vol. 2
-- ══════════════════════════════════════════════════════════════

('geografia', '¿Cuál es la capital de Argentina?',
 '["Córdoba","Rosario","Mendoza","Buenos Aires"]', 3,
 'Buenos Aires es la capital de Argentina y la ciudad más grande del país, con unos 15 millones de habitantes en su área metropolitana.',
 'easy'),

('geografia', '¿Qué país tiene la mayor biodiversidad del mundo?',
 '["Australia","Indonesia","Brasil","Colombia"]', 2,
 'Brasil alberga el 20% de las especies del planeta. La Amazonia es el ecosistema más biodiverso del mundo. Colombia es el segundo país más biodiverso.',
 'medium'),

('geografia', '¿Cuál es el río más largo de Asia?',
 '["Ganges","Yangtsé","Indo","Mekong"]', 1,
 'El Yangtsé (6.300 km) es el río más largo de Asia y el tercero del mundo. La presa de las Tres Gargantas, la mayor del mundo, está en este río.',
 'medium'),

('geografia', '¿Cuántos países hay en África?',
 '["44","50","54","60"]', 2,
 'África tiene 54 países reconocidos, siendo el continente con más países del mundo. Nigeria es el más poblado y Argelia el más extenso.',
 'medium'),

('geografia', '¿Cuál es el estrecho que separa Europa de África?',
 '["Estrecho de Bering","Estrecho de Magallanes","Estrecho de Gibraltar","Canal de la Mancha"]', 2,
 'El Estrecho de Gibraltar separa España de Marruecos con apenas 14 km en su punto más estrecho. Conecta el Atlántico con el Mediterráneo.',
 'easy'),

('geografia', '¿Cuál es el país con más lenguas oficiales?',
 '["India","Suiza","Bolivia","Sudáfrica"]', 3,
 'Sudáfrica tiene 11 lenguas oficiales: zulú, xhosa, afrikáans, inglés, sotho, tswana, sotho del sur, tsonga, suazi, venda y ndebele.',
 'hard'),

('geografia', '¿Dónde está el desierto de Atacama?',
 '["Argentina","Bolivia","Chile","Perú"]', 2,
 'El desierto de Atacama está en Chile, en la costa del Pacífico. Es el desierto no polar más árido del mundo: algunas zonas no han registrado lluvia en siglos.',
 'medium'),

('geografia', '¿Cuál es la cascada más alta del mundo?',
 '["Cataratas del Iguazú","Cataratas Victoria","Cataratas del Niágara","Salto Ángel"]', 3,
 'El Salto Ángel (Venezuela) es la cascada más alta del mundo, con 979 m de caída libre. Fue descubierta por el aviador James Angel en 1933.',
 'medium'),

('geografia', '¿Cuál es el país más desarrollado del mundo según IDH?',
 '["Noruega","Suiza","Dinamarca","Países Bajos"]', 0,
 'Noruega lidera habitualmente el Índice de Desarrollo Humano (IDH). Tiene los mejores indicadores de salud, educación y nivel de vida del mundo.',
 'hard'),

('geografia', '¿Qué océano baña las costas de España?',
 '["Solo el Mediterráneo","Solo el Atlántico","El Atlántico y el Mediterráneo","El Atlántico, el Mediterráneo y el Cantábrico"]', 2,
 'España tiene costas en el Atlántico (oeste y noroeste), el mar Cantábrico (norte) y el Mediterráneo (este y sur). El Cantábrico es técnicamente parte del Atlántico.',
 'easy'),

('geografia', '¿Cuál es la ciudad más alta del mundo?',
 '["Lhasa","Quito","La Paz","Potosí"]', 2,
 'La Paz (Bolivia) a 3.640 m es la capital de facto más alta. La ciudad boliviana de El Alto, a 4.150 m, es la ciudad grande más alta. La Paz es la sede del gobierno.',
 'hard'),

('geografia', '¿Qué país tiene más territorio en el Ártico?',
 '["Canadá","Estados Unidos","Noruega","Rusia"]', 3,
 'Rusia tiene la mayor presencia en el Ártico, con casi la mitad de su costa en el océano Ártico. Posee la flota de rompehielos más grande del mundo.',
 'medium'),

('geografia', '¿Cuál es la capital de Marruecos?',
 '["Casablanca","Marrakech","Fez","Rabat"]', 3,
 'Rabat es la capital de Marruecos desde 1912, durante el protectorado francés. Casablanca es la ciudad más grande y el centro económico.',
 'medium'),

('geografia', '¿Qué continente no tiene países?',
 '["El Ártico","La Antártida","La Amazonia","El Sahara"]', 1,
 'La Antártida no tiene países ni población permanente. Está regulada por el Tratado Antártico (1959) que la reserva para la paz y la ciencia.',
 'easy'),

('geografia', '¿Cuál es la capital de Turquía?',
 '["Estambul","Esmirna","Bursa","Ankara"]', 3,
 'Ankara es la capital de Turquía desde 1923, cuando Atatürk la eligió por su posición central en Anatolia. Estambul es la ciudad más grande.',
 'medium'),

('geografia', '¿Qué país tiene la costa más larga del mundo?',
 '["Rusia","Australia","Noruega","Canadá"]', 3,
 'Canadá tiene la costa más larga del mundo (202.080 km), gracias a sus miles de islas e indentaciones. Rusia es la segunda.',
 'hard'),

('geografia', '¿Cuál es el mar más pequeño del mundo?',
 '["Mar Báltico","Mar de Mármara","Mar de Azov","Mar Muerto"]', 2,
 'El Mar de Azov (39.000 km²) es el mar más pequeño del mundo. Está en el sureste de Ucrania y el suroeste de Rusia, conectado al Mar Negro.',
 'hard'),

('geografia', '¿Cuál es la capital de Egipto?',
 '["Alejandría","Giza","Luxor","El Cairo"]', 3,
 'El Cairo es la capital de Egipto y la ciudad más grande de África y del mundo árabe, con unos 20 millones de habitantes.',
 'easy'),

('geografia', '¿Qué país tiene más de la mitad de su territorio bajo el nivel del mar?',
 '["Bélgica","Dinamarca","Países Bajos","Alemania"]', 2,
 'Los Países Bajos tienen el 26% de su territorio bajo el nivel del mar. Han construido un avanzado sistema de diques y polders para ganar tierra al mar.',
 'medium'),

('geografia', '¿Cuál es el lago más profundo del mundo?',
 '["Lago Tanganica","Lago Superior","Lago Titicaca","Lago Baikal"]', 3,
 'El Lago Baikal (Rusia) tiene 1.642 m de profundidad, el más profundo del mundo. Contiene el 20% del agua dulce líquida de la superficie terrestre.',
 'medium'),

('geografia', '¿Qué ciudad es la más poblada de Europa?',
 '["Londres","París","Berlín","Moscú"]', 3,
 'Moscú es la ciudad más poblada de Europa, con más de 12 millones de habitantes en la ciudad (20 millones en área metropolitana). Es la capital de Rusia.',
 'medium'),

('geografia', '¿Cuál es la isla más grande del mundo?',
 '["Madagascar","Borneo","Groenlandia","Nueva Guinea"]', 2,
 'Groenlandia (2,16 millones de km²) es la isla más grande del mundo. Pertenece a Dinamarca pero tiene amplia autonomía. El 80% está cubierta de hielo.',
 'easy'),

('geografia', '¿Cuál es el país más rico del mundo por PIB per cápita?',
 '["Suiza","Noruega","Singapur","Luxemburgo"]', 3,
 'Luxemburgo lidera habitualmente el PIB per cápita mundial, con más de 120.000 dólares. Su riqueza se basa en servicios financieros y acero.',
 'hard'),

('geografia', '¿Cuál es el monte más alto de África?',
 '["Monte Kenia","Ruwenzori","Kilimanjaro","Ras Dashen"]', 2,
 'El Kilimanjaro (5.895 m) en Tanzania es el monte más alto de África. Es un volcán inactivo con tres conos: Kibo, Mawenzi y Shira.',
 'medium'),

('geografia', '¿Qué mar separa Europa del norte de África?',
 '["Mar Rojo","Mar Negro","Mar Mediterráneo","Mar Caspio"]', 2,
 'El Mar Mediterráneo separa Europa del norte de África. Tiene 2,5 millones de km² y es casi un mar interior, con poca conexión con los océanos.',
 'easy'),

('geografia', '¿Cuál es la capital de Corea del Sur?',
 '["Busan","Incheon","Daegu","Seúl"]', 3,
 'Seúl es la capital de Corea del Sur, con más de 10 millones de habitantes. Es una de las ciudades más avanzadas tecnológicamente del mundo.',
 'easy'),

('geografia', '¿En qué país está el río Ganges?',
 '["Pakistán","Bangladesh","India","Nepal"]', 2,
 'El Ganges nace en el Himalaya y fluye principalmente por India antes de desembocar en el Golfo de Bengala. Es el río sagrado del hinduismo.',
 'easy'),

('geografia', '¿Cuál es el punto más bajo de la Tierra (en tierra)?',
 '["Valle de la Muerte","Mar Muerto","Lago Asal","Depresión de Qattara"]', 1,
 'El Mar Muerto (Israel/Jordania/Palestina) está a 430 m bajo el nivel del mar, el punto más bajo en tierra firme. Su alta salinidad impide hundirse.',
 'medium'),

('geografia', '¿Cuál es la capital de Nigeria?',
 '["Lagos","Kano","Ibadan","Abuja"]', 3,
 'Abuja es la capital de Nigeria desde 1991, construida desde cero para reemplazar Lagos como capital. Lagos sigue siendo la ciudad más grande y económica.',
 'hard'),

('geografia', '¿Qué país tiene la mayor reserva de petróleo del mundo?',
 '["Arabia Saudí","Rusia","Canadá","Venezuela"]', 3,
 'Venezuela tiene las mayores reservas probadas de petróleo (303.000 millones de barriles), seguida de Arabia Saudí. Sin embargo, es difícil de extraer.',
 'hard'),

-- ══════════════════════════════════════════════════════════════
-- CIENCIA Vol. 2
-- ══════════════════════════════════════════════════════════════

('ciencia', '¿Qué es el efecto invernadero?',
 '["La refrigeración de la atmósfera","El calentamiento de la Tierra por gases que retienen el calor solar","La capa de ozono","Los rayos cósmicos"]', 1,
 'El efecto invernadero es el calentamiento de la Tierra porque gases como el CO₂ y el vapor de agua atrapan el calor solar. Sin él natural, la Tierra sería inhabitable.',
 'easy'),

('ciencia', '¿Qué es el Big Bang?',
 '["La explosión de una supernova","La teoría sobre el origen del universo hace ~13.800 millones de años","Una colisión entre galaxias","La expansión del universo en el futuro"]', 1,
 'El Big Bang fue el evento inicial del universo hace ~13.800 millones de años. El universo comenzó en un estado de densidad y temperatura infinitas y se ha expandido desde entonces.',
 'easy'),

('ciencia', '¿Qué es la mecánica cuántica?',
 '["La física de los movimientos de los planetas","La física que describe el comportamiento de partículas subatómicas","La mecánica de los fluidos","La teoría de la relatividad ampliada"]', 1,
 'La mecánica cuántica describe el comportamiento de partículas subatómicas como electrones y fotones. Incluye conceptos como la dualidad onda-partícula y el principio de incertidumbre.',
 'medium'),

('ciencia', '¿Cuál es el símbolo del hierro en la tabla periódica?',
 '["Hr","He","Fe","Ir"]', 2,
 'El hierro se representa como Fe, del latín «ferrum». Tiene número atómico 26 y es el metal más abundante en la Tierra.',
 'medium'),

('ciencia', '¿Qué es la teoría de la relatividad especial de Einstein?',
 '["La gravedad depende de la masa","La velocidad de la luz es constante y el tiempo es relativo","Todo movimiento es relativo al observador","La energía y la masa son equivalentes"]', 3,
 'La relatividad especial (1905) establece que la velocidad de la luz es constante y que E=mc². El tiempo y el espacio son relativos al observador. No hay espacio ni tiempo absolutos.',
 'hard'),

('ciencia', '¿Qué es la mitosis?',
 '["La reproducción sexual","La división celular que produce dos células idénticas","La fusión de dos células","La muerte celular programada"]', 1,
 'La mitosis es el proceso de división celular que produce dos células hijas con el mismo número de cromosomas que la célula madre. Es la base del crecimiento y la reparación.',
 'medium'),

('ciencia', '¿Qué es el ADN mitocondrial?',
 '["El ADN del núcleo celular","El ADN de la mitocondria, heredado solo por vía materna","El ARN mensajero","El ADN de los ribosomas"]', 1,
 'El ADN mitocondrial se hereda exclusivamente por vía materna. Se usa en genética poblacional para trazar ancestros. «Eva mitocondrial» es la ancestral materna común.',
 'hard'),

('ciencia', '¿Qué planeta tiene los anillos más visibles?',
 '["Urano","Júpiter","Neptuno","Saturno"]', 3,
 'Los anillos de Saturno son los más visibles, compuestos principalmente de hielo y roca. Fueron descubiertos por Galileo en 1610 (aunque no supo identificarlos).',
 'easy'),

('ciencia', '¿Qué es la capa de ozono?',
 '["Una capa de CO₂ en la estratosfera","Una capa de gas ozono en la estratosfera que filtra los rayos UV","La capa más externa de la atmósfera","Una capa de partículas en la troposfera"]', 1,
 'La capa de ozono está en la estratosfera (15-35 km). Absorbe el 97-99% de la radiación ultravioleta del Sol. Los CFC la dañaron, pero se está recuperando desde el Protocolo de Montreal.',
 'medium'),

('ciencia', '¿Qué es la selección natural?',
 '["El proceso por el que los seres vivos eligen pareja","El mecanismo evolutivo por el que sobreviven y se reproducen los mejor adaptados","La variación aleatoria de genes","La extinción de especies"]', 1,
 'La selección natural de Darwin explica cómo los organismos mejor adaptados sobreviven y transmiten sus rasgos. Es el mecanismo principal de la evolución.',
 'easy'),

('ciencia', '¿Cuál es el elemento más pesado de la tabla periódica?',
 '["Plutonio","Uranio","Oganesón","Fermio"]', 2,
 'El Oganesón (Og, elemento 118) es el más pesado de los elementos confirmados. Es sintético, radiactivo y fue sintetizado por primera vez en 2002.',
 'hard'),

('ciencia', '¿Qué es la presión atmosférica?',
 '["La temperatura del aire","El peso de la columna de aire que actúa sobre una superficie","La humedad del aire","La velocidad del viento"]', 1,
 'La presión atmosférica es el peso del aire sobre una superficie. A nivel del mar es ~101.325 Pa (1 atm). Disminuye con la altitud, por eso el agua hierve antes en las montañas.',
 'medium'),

('ciencia', '¿Qué inventó Alexander Graham Bell?',
 '["La bombilla","El teléfono","El fonógrafo","La radio"]', 1,
 'Alexander Graham Bell patentó el teléfono en 1876. Sin embargo, Elisha Gray presentó un diseño similar el mismo día. La paternidad del invento fue disputada.',
 'easy'),

('ciencia', '¿Qué es la termodinámica?',
 '["El estudio del calor y su transformación en otras formas de energía","La mecánica de los fluidos","El estudio de la electricidad","La física de los materiales"]', 0,
 'La termodinámica estudia las relaciones entre calor, trabajo y energía. Sus cuatro leyes describen cómo se comporta la energía en los sistemas físicos.',
 'medium'),

('ciencia', '¿Qué es el teorema de Pitágoras?',
 '["La suma de ángulos de un triángulo es 180°","En un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos","La razón de la circunferencia al diámetro","El volumen de una esfera"]', 1,
 'El teorema de Pitágoras (a²+b²=c²) describe la relación entre los lados de un triángulo rectángulo. Fue conocido en Babilonia y la India antes que en Grecia.',
 'easy'),

('ciencia', '¿Qué es un átomo?',
 '["La partícula subatómica más pequeña","La unidad básica de la materia, formada por núcleo y electrones","Una molécula simple","Un tipo de energía"]', 1,
 'El átomo es la unidad básica de la materia. Tiene un núcleo (protones y neutrones) rodeado de electrones. Fue propuesto por Dalton en 1803; su estructura fue descrita por Rutherford en 1911.',
 'easy'),

('ciencia', '¿Qué descubrió Isaac Newton bajo un manzano (según la leyenda)?',
 '["La electricidad","La ley de la gravedad","El espectro de luz","Las leyes del movimiento"]', 1,
 'La historia del manzano (posiblemente real) llevó a Newton a formular la ley de la gravitación universal (1687). Según Voltaire, la contó la sobrina de Newton.',
 'easy'),

('ciencia', '¿Qué es la fotovoltaica?',
 '["La producción de calor mediante la luz","La conversión de luz solar en electricidad","La fotografía con luz ultravioleta","La comunicación con señales de luz"]', 1,
 'La energía fotovoltaica convierte la luz solar en electricidad mediante células solares de silicio. El efecto fotoeléctrico fue explicado por Einstein (Nobel 1921).',
 'medium'),

('ciencia', '¿Cuál es el animal más rápido del mundo?',
 '["Guepardo","Halcón peregrino","Aguja negra","Marlin azul"]', 1,
 'El halcón peregrino (Falco peregrinus) alcanza ~389 km/h en picado. El guepardo es el más rápido en tierra (110 km/h) y el marlin azul en el mar.',
 'medium'),

('ciencia', '¿Cuánto tarda la Tierra en dar la vuelta al Sol?',
 '["364 días","365 días y 6 horas","365 días exactos","366 días"]', 1,
 'La Tierra tarda 365,25 días en orbitar el Sol. Por eso cada 4 años hay un año bisiesto (366 días). El año exacto es 365 días, 5 horas, 48 minutos y 46 segundos.',
 'easy'),

('ciencia', '¿Qué es la nanotecnología?',
 '["La tecnología de los robots","La tecnología que trabaja a escala nanométrica (millonésimas de mm)","La tecnología de los materiales","La biotecnología aplicada a la nano"]', 1,
 'La nanotecnología trabaja a escala de 1-100 nanómetros (millonésimas de milímetro). Tiene aplicaciones en medicina, electrónica y materiales avanzados.',
 'medium'),

('ciencia', '¿Qué es la inteligencia artificial?',
 '["Robots con aspecto humano","La capacidad de las máquinas para realizar tareas que requieren inteligencia humana","Software de reconocimiento facial","La simulación del cerebro humano"]', 1,
 'La IA es la simulación de procesos de inteligencia humana por máquinas, especialmente sistemas informáticos. Incluye aprendizaje automático, redes neuronales y procesamiento del lenguaje.',
 'easy'),

('ciencia', '¿Cuál es la partícula subatómica con carga negativa?',
 '["Protón","Neutrón","Electrón","Positrón"]', 2,
 'El electrón tiene carga negativa y órbita el núcleo atómico. El protón tiene carga positiva y el neutrón es neutro. El positrón es la antimateria del electrón.',
 'easy'),

('ciencia', '¿Qué es la CRISPR?',
 '["Un superordenador","Una técnica de edición genética de precisión","Un tipo de virus","Un antibiótico de nueva generación"]', 1,
 'CRISPR-Cas9 es una herramienta de edición genética que actúa como «tijeras moleculares». Permite modificar el ADN con gran precisión. Premio Nobel de Química en 2020.',
 'hard'),

('ciencia', '¿Cuántas galaxias se estima que hay en el universo observable?',
 '["Unos mil millones","Unos 200.000 millones","Unos 2 billones","Unos 100 millones"]', 2,
 'Se estima que hay ~2 billones (2×10¹²) de galaxias en el universo observable. La Vía Láctea contiene entre 200.000 y 400.000 millones de estrellas.',
 'hard'),

('ciencia', '¿Qué es la energía nuclear de fisión?',
 '["La unión de núcleos atómicos ligeros","La división de núcleos pesados que libera energía","La reacción química del uranio","La energía del movimiento nuclear"]', 1,
 'La fisión nuclear divide núcleos pesados (uranio, plutonio) liberando gran energía. Es la base de los reactores nucleares y la bomba atómica.',
 'medium'),

('ciencia', '¿Cuánto tarda la luz del Sol en llegar a la Tierra?',
 '["Instantáneamente","Unos 8 minutos","Una hora","30 minutos"]', 1,
 'La luz tarda ~8 minutos y 20 segundos en recorrer los 150 millones de km hasta la Tierra. Esto significa que vemos el Sol como era hace 8 minutos.',
 'medium'),

('ciencia', '¿Qué es el número π (pi)?',
 '["La raíz cuadrada de 2","La razón entre la circunferencia y el diámetro de un círculo","El número de Euler","La constante gravitacional"]', 1,
 'Pi (π ≈ 3,14159...) es la razón entre la circunferencia y el diámetro de cualquier círculo. Es un número irracional y trascendente, con infinitos decimales sin patrón.',
 'easy'),

-- ══════════════════════════════════════════════════════════════
-- ARTE Vol. 2
-- ══════════════════════════════════════════════════════════════

('arte', '¿Quién pintó «El grito»?',
 '["Gustav Klimt","Egon Schiele","Edvard Munch","Ernst Ludwig Kirchner"]', 2,
 'Edvard Munch pintó «El grito» en 1893. El noruego dijo que la inspiración llegó al ver el cielo de color rojo sangre mientras paseaba. Es un ícono del expresionismo.',
 'easy'),

('arte', '¿Quién compuso la Novena Sinfonía siendo sordo?',
 '["Schubert","Brahms","Beethoven","Mahler"]', 2,
 'Beethoven compuso la Novena Sinfonía (1824) completamente sordo. El himno «Oda a la alegría» del cuarto movimiento es el himno de la Unión Europea.',
 'easy'),

('arte', '¿Quién escribió «Crimen y castigo»?',
 '["León Tolstói","Iván Turguénev","Antón Chéjov","Fiódor Dostoyevski"]', 3,
 'Dostoyevski publicó «Crimen y castigo» en 1866. Narra el asesinato cometido por Raskólnikov y su posterior tormento psicológico. Es una obra cumbre de la literatura rusa.',
 'medium'),

('arte', '¿Quién pintó «El beso» (1907-1908)?',
 '["Egon Schiele","Gustav Klimt","Oskar Kokoschka","Ferdinand Hodler"]', 1,
 'Gustav Klimt pintó «El beso» entre 1907-1908, en la fase dorada de su obra. Es el cuadro más famoso del Secesionismo vienés. Está en el Belvedere de Viena.',
 'medium'),

('arte', '¿Quién escribió «En busca del tiempo perdido»?',
 '["Gustave Flaubert","Émile Zola","Marcel Proust","Guy de Maupassant"]', 2,
 'Marcel Proust publicó «En busca del tiempo perdido» en 7 volúmenes (1913-1927). Es la novela más larga de la literatura, con ~1,5 millones de palabras.',
 'hard'),

('arte', '¿Qué es el impresionismo?',
 '["Un movimiento que retrata la realidad exactamente","Un movimiento pictórico que capta la impresión visual de un momento con pinceladas sueltas","Un estilo que deforma la realidad","Un movimiento abstracto del s. XX"]', 1,
 'El impresionismo (1860-1880) buscaba capturar la luz y el momento con pinceladas sueltas y colores vivos. Monet, Renoir y Degas son sus máximos representantes.',
 'medium'),

('arte', '¿Quién pintó «Los girasoles»?',
 '["Paul Gauguin","Paul Cézanne","Vincent van Gogh","Henri Toulouse-Lautrec"]', 2,
 'Van Gogh pintó varias versiones de «Los girasoles» en 1888-1889 en Arlés. Una de ellas se vendió en 1987 por 39,9 millones de dólares.',
 'easy'),

('arte', '¿Quién escribió «La metamorfosis»?',
 '["Hermann Hesse","Thomas Mann","Franz Kafka","Stefan Zweig"]', 2,
 'Franz Kafka publicó «La metamorfosis» en 1915. Narra cómo Gregor Samsa se despierta convertido en un insecto. Es una obra esencial del absurdo y el existencialismo.',
 'medium'),

('arte', '¿Quién compuso el «Réquiem»?',
 '["Haydn","Mozart","Schubert","Brahms"]', 1,
 'Mozart compuso el Réquiem en 1791, el año de su muerte, dejándolo inacabado. Fue completado por su discípulo Franz Xaver Süssmayr. Es una de las obras más misteriosas de la música.',
 'medium'),

('arte', '¿Quién fue el primer director en ganar el Oscar cinco veces?',
 '["Billy Wilder","Frank Capra","John Ford","William Wyler"]', 2,
 'John Ford ganó 4 Oscars a mejor director (récord). William Wyler ganó 3. El máximo ganador de Oscar en general es Walt Disney con 22 estatuillas.',
 'hard'),

('arte', '¿Quién pintó «Las señoritas de Avignon»?',
 '["Georges Braque","Juan Gris","Pablo Picasso","Fernand Léger"]', 2,
 'Picasso pintó «Las señoritas de Avignon» en 1907, considerada el origen del cubismo. Representa a cinco prostitutas en un burdel de Barcelona.',
 'hard'),

('arte', '¿Quién escribió «El Quijote»?',
 '["Lope de Vega","Francisco de Quevedo","Miguel de Cervantes","Tirso de Molina"]', 2,
 'Cervantes publicó la primera parte del Quijote en 1605 y la segunda en 1615. Es la novela más vendida de la historia después de la Biblia, con más de 500 millones de copias.',
 'easy'),

('arte', '¿Qué arquitecto construyó el Partenón?',
 '["Fidias","Ictino y Calícrates","Praxíteles","Policleto"]', 1,
 'El Partenón fue diseñado por los arquitectos Ictino y Calícrates y decorado por el escultor Fidias. Fue construido entre 447-438 a.C. en la Acrópolis de Atenas.',
 'hard'),

('arte', '¿Quién compuso «La consagración de la primavera»?',
 '["Claude Debussy","Maurice Ravel","Igor Stravinski","Béla Bartók"]', 2,
 'Stravinski compuso «La consagración de la primavera» en 1913. Su estreno en París causó un escándalo: el público abucheó y se peleó en el teatro por su radical modernismo.',
 'hard'),

('arte', '¿Quién escribió «Anna Karenina»?',
 '["Fiódor Dostoyevski","Iván Turguénev","Antón Chéjov","León Tolstói"]', 3,
 'León Tolstói publicó «Anna Karenina» entre 1875-1877. Junto con «Guerra y paz», es considerada una de las mejores novelas jamás escritas.',
 'medium'),

('arte', '¿Quién pintó «La persistencia de la memoria»?',
 '["René Magritte","Joan Miró","Max Ernst","Salvador Dalí"]', 3,
 'Dalí pintó «La persistencia de la memoria» en 1931. Los relojes blandos representan la relatividad del tiempo. Mide solo 24×33 cm y está en el MoMA de Nueva York.',
 'easy'),

('arte', '¿Quién diseñó el Coliseo de Roma?',
 '["Julio César","Los emperadores Vespasiano y Tito","Augusto","Adriano"]', 1,
 'El Coliseo fue construido por orden del emperador Vespasiano (~72 d.C.) y completado por su hijo Tito en el 80 d.C. Podía albergar entre 50.000 y 80.000 espectadores.',
 'medium'),

('arte', '¿Quién escribió «Los miserables»?',
 '["Émile Zola","Honoré de Balzac","Victor Hugo","Alexandre Dumas"]', 2,
 'Victor Hugo publicó «Los miserables» en 1862. Narra la historia de Jean Valjean y es una de las novelas más adaptadas al cine y el teatro musical.',
 'easy'),

('arte', '¿Qué movimiento artístico representó Frida Kahlo?',
 '["Impresionismo","Cubismo","Surrealismo","Expresionismo"]', 2,
 'Frida Kahlo fue asociada al Surrealismo, aunque ella se distanció del movimiento. Sus autorretratos exploran el dolor físico, la identidad y la cultura mexicana.',
 'medium'),

('arte', '¿Quién compuso la ópera «Carmen»?',
 '["Verdi","Puccini","Bizet","Donizetti"]', 2,
 'Georges Bizet compuso «Carmen» en 1875. Basada en la novela de Mérimée, fue un fracaso en su estreno pero hoy es la ópera más representada del mundo.',
 'medium'),

('arte', '¿Quién escribió «El señor de los anillos»?',
 '["C.S. Lewis","George R.R. Martin","J.R.R. Tolkien","Terry Pratchett"]', 2,
 'J.R.R. Tolkien publicó «El señor de los anillos» en tres volúmenes entre 1954-1955. También creó el mundo de la Tierra Media con «El Hobbit» (1937).',
 'easy'),

-- ══════════════════════════════════════════════════════════════
-- FILOSOFÍA Vol. 2
-- ══════════════════════════════════════════════════════════════

('filosofia', '¿Qué filósofo escribió «Meditaciones metafísicas»?',
 '["Spinoza","Leibniz","Descartes","Hume"]', 2,
 'Descartes publicó «Meditaciones metafísicas» en 1641. Introduce el método de la duda cartesiana para encontrar verdades indudables, llegando al «cogito ergo sum».',
 'medium'),

('filosofia', '¿Qué sostenía el filósofo Heráclito?',
 '["Que todo es inmutable","Que el fuego es el origen de todo y todo está en constante cambio","Que el agua es el principio de todo","Que los átomos forman toda la realidad"]', 1,
 'Heráclito de Éfeso (~500 a.C.) sostuvo que «todo fluye» (panta rhei) y que el fuego es el principio del universo. Su famosa frase: «No puedes bañarte dos veces en el mismo río».',
 'medium'),

('filosofia', '¿Qué es el racionalismo?',
 '["La filosofía basada en la experiencia sensorial","La corriente que sostiene que la razón es la fuente principal del conocimiento","El estudio de la lógica formal","La filosofía del sentido común"]', 1,
 'El racionalismo (Descartes, Spinoza, Leibniz) sostiene que la razón, no los sentidos, es la fuente del conocimiento verdadero. Se opone al empirismo de Locke y Hume.',
 'medium'),

('filosofia', '¿Quién fue Baruch Spinoza?',
 '["Un filósofo racionalista holandés que identificó a Dios con la naturaleza","Un empirista inglés","Un escolástico medieval","Un filósofo de la Ilustración francesa"]', 0,
 'Spinoza (1632-1677) fue un filósofo racionalista que identificó a Dios con la Naturaleza (panteísmo). Fue excomulgado de la comunidad judía de Ámsterdam.',
 'hard'),

('filosofia', '¿Qué es el utilitarismo de Mill?',
 '["La búsqueda del placer individual","Maximizar la felicidad total considerando calidad, no solo cantidad, de placer","El cumplimiento del deber moral","La virtud como fin en sí mismo"]', 1,
 'J.S. Mill refinó el utilitarismo de Bentham distinguiendo placeres superiores (intelectuales) de inferiores. Defendió también la libertad individual en «Sobre la libertad» (1859).',
 'hard'),

('filosofia', '¿Qué es la filosofía analítica?',
 '["La filosofía continental europea","La corriente filosófica centrada en el análisis lógico del lenguaje","El estudio de la conciencia","La fenomenología anglosajona"]', 1,
 'La filosofía analítica (Russell, Wittgenstein, Frege) se centra en el análisis lógico del lenguaje y los argumentos. Domina en el mundo anglosajón.',
 'hard'),

('filosofia', '¿Quién escribió «La crítica de la razón pura»?',
 '["Hegel","Fichte","Kant","Schopenhauer"]', 2,
 'Kant publicó «La crítica de la razón pura» en 1781. Propone que el conocimiento surge de la combinación de experiencia sensorial y categorías a priori del entendimiento.',
 'hard'),

('filosofia', '¿Qué es el determinismo?',
 '["La creencia en el libre albedrío","La doctrina que sostiene que todo evento está causado por eventos anteriores","La filosofía del azar","El fatalismo religioso"]', 1,
 'El determinismo sostiene que todo evento, incluidas las acciones humanas, está causado por eventos previos. Se opone al libre albedrío. Laplace imaginó un «demonio» que conocería el futuro.',
 'medium'),

('filosofia', '¿Qué filósofo desarrolló el concepto del «superhombre»?',
 '["Schopenhauer","Marx","Heidegger","Nietzsche"]', 3,
 'Nietzsche desarrolló el concepto del «Übermensch» (superhombre) en «Así habló Zaratustra» (1883). El superhombre crea sus propios valores más allá del bien y el mal.',
 'medium'),

('filosofia', '¿Qué es la ética de la virtud?',
 '["La ética basada en el cumplimiento de normas","La ética centrada en el carácter y las virtudes del agente, no en las acciones","La ética consecuencialista","La ética del deber"]', 1,
 'La ética de la virtud (Aristóteles, MacIntyre) se centra en cultivar virtudes como la prudencia, el valor y la justicia para alcanzar la eudaimonia (florecimiento humano).',
 'medium'),

('filosofia', '¿Quién fue Simone de Beauvoir?',
 '["Una novelista francesa sin relación con la filosofía","Una filósofa existencialista y pionera del feminismo moderno","Una discípula de Husserl","Una filósofa analítica"]', 1,
 'De Beauvoir (1908-1986) fue filósofa existencialista, escritora y feminista. «El segundo sexo» (1949) es un texto fundacional del feminismo: «No se nace mujer, se llega a serlo».',
 'medium'),

('filosofia', '¿Qué es la dialéctica socrática?',
 '["Un método retórico para convencer","El método de preguntas y respuestas (mayéutica) para descubrir la verdad","Una forma de debate parlamentario","Un método matemático"]', 1,
 'La mayéutica socrática consiste en hacer preguntas para que el interlocutor descubra por sí mismo la verdad. Sócrates comparaba el método con la labor de su madre, comadrona.',
 'medium'),

('filosofia', '¿Qué es el relativismo moral?',
 '["La creencia en valores morales universales","La doctrina de que los valores morales varían según la cultura o individuo","La ética del deber","El escepticismo sobre la realidad"]', 1,
 'El relativismo moral sostiene que no hay verdades éticas universales: lo correcto depende del contexto cultural o individual. Se opone al universalismo moral de Kant.',
 'medium'),

('filosofia', '¿Quién fue Michel Foucault?',
 '["Un filósofo positivista francés","Un filósofo postestructuralista que estudió las relaciones entre poder y saber","Un existencialista contemporáneo de Sartre","Un neomarxista"]', 1,
 'Foucault (1926-1984) analizó cómo el poder opera a través del conocimiento, las instituciones y las prácticas sociales. Sus obras sobre prisiones, locura y sexualidad son esenciales.',
 'hard'),

('filosofia', '¿Qué es la filosofía estoica respecto a las emociones?',
 '["Que las emociones son guías útiles","Que las emociones negativas surgen de juicios falsos y pueden controlarse con la razón","Que debemos suprimir todas las emociones","Que las emociones son la base de la moral"]', 1,
 'Los estoicos creían que las «pasiones» (miedo, deseo, tristeza) surgen de juicios equivocados. La razón puede corregir estos juicios y alcanzar la ataraxia (tranquilidad).',
 'medium'),

('filosofia', '¿Quién escribió «La fenomenología del espíritu»?',
 '["Kant","Schopenhauer","Hegel","Fichte"]', 2,
 'Hegel publicó «La fenomenología del espíritu» en 1807, describiendo el camino de la conciencia desde la certeza sensible hasta el Saber Absoluto. Es una de las obras más difíciles de la filosofía.',
 'hard'),

('filosofia', '¿Qué es el escepticismo filosófico?',
 '["La negación de toda realidad","La postura que cuestiona la posibilidad del conocimiento cierto","La doctrina del relativismo moral","El rechazo de la metafísica"]', 1,
 'El escepticismo (Pirrón, Hume) duda de la posibilidad de conocer la verdad con certeza. Descartes usó la duda metódica para superarlo y llegar al cogito.',
 'medium'),

('filosofia', '¿Qué sostenía Rousseau sobre el ser humano?',
 '["Que el hombre es malo por naturaleza","Que el hombre es naturalmente bueno pero la sociedad lo corrompe","Que el hombre es un lobo para el hombre","Que la naturaleza humana es neutra"]', 1,
 'Rousseau sostuvo que el ser humano es bueno en estado natural pero la sociedad lo corrompe. Su «buen salvaje» contrasta con Hobbes, para quien sin Estado la vida sería «brutal y corta».',
 'medium'),

('filosofia', '¿Qué es el positivismo de Comte?',
 '["La filosofía del optimismo moral","La corriente que sostiene que solo el conocimiento científico verificable es válido","La defensa del progreso tecnológico","La ética utilitarista"]', 1,
 'Auguste Comte fundó el positivismo (s. XIX), que defiende que el único conocimiento válido es el científico y verificable. Inventó también el término «sociología».',
 'medium'),

('filosofia', '¿Quién fue Confucio?',
 '["Un filósofo y gobernante chino","Un filósofo y maestro chino que enseñó ética, familia y gobierno","Un dios del panteón chino","Un general chino de la Antigüedad"]', 1,
 'Confucio (551-479 a.C.) fue el filósofo más influyente de China. Sus enseñanzas sobre ética, familia y gobierno están recogidas en las «Analectas». El confucianismo moldeó Asia oriental.',
 'medium'),

('filosofia', '¿Qué es el taoísmo?',
 '["Una religión politeísta china","Una filosofía china que busca vivir en armonía con el Tao (el camino natural)","Una secta del budismo","Una filosofía del gobierno chino"]', 1,
 'El taoísmo (Laozi, s. VI a.C.) propone vivir en armonía con el Tao, el principio natural que rige el universo. La no-acción (wu wei) es su principio clave.',
 'medium'),

('filosofia', '¿Qué es la ética deontológica?',
 '["La ética basada en las consecuencias de los actos","La ética basada en el cumplimiento del deber, independientemente de las consecuencias","La ética de las virtudes","La ética utilitarista"]', 1,
 'La ética deontológica (Kant) juzga los actos por su conformidad con el deber moral, no por sus consecuencias. Un acto bueno es el que se realiza por deber, no por inclinación.',
 'medium'),

('filosofia', '¿Quién fue Averroes?',
 '["Un matemático árabe medieval","Un filósofo árabe medieval que tradujo y comentó a Aristóteles","Un astrónomo persa","Un médico árabe del siglo X"]', 1,
 'Averroes (Ibn Rushd, 1126-1198) fue el gran comentarista de Aristóteles en el mundo islámico. Sus obras influyeron enormemente en la escolástica cristiana medieval.',
 'hard'),

('filosofia', '¿Qué es el budismo?',
 '["Una religión monoteísta","Una filosofía y religión basada en las enseñanzas de Buda que busca el cese del sufrimiento","Una secta del hinduismo","Una filosofía atea"]', 1,
 'El budismo fue fundado por Siddhartha Gautama (Buda, ~500 a.C.). Las Cuatro Nobles Verdades y el Óctuple Sendero guían hacia el nirvana, la liberación del sufrimiento.',
 'easy');

-- ─── Actualizar pregunta del día si no existe ─────────────────
insert into public.daily_questions (question_id, date)
select id, current_date
from public.questions
where active = true
order by random()
limit 1
on conflict (date) do nothing;
