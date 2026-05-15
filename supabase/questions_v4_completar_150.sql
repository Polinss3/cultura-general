-- ─────────────────────────────────────────────────────────────
-- Cultura General — Lote 4: completar a 150 preguntas/categoría
-- Añade nuevas preguntas para que cada una de las 13 categorías
-- alcance 150 preguntas en total.
--
-- Requiere haber ejecutado antes:
--   schema.sql, questions.sql, questions2.sql,
--   questions_v3_nuevas_categorias.sql
--
-- Este archivo refresca el check constraint de categoría al inicio
-- (por si no se aplicó la migración) y luego inserta las preguntas.
-- ATENCIÓN: solo ejecutar UNA vez sobre la base de datos, ya que se
-- duplicarían las preguntas si se vuelve a ejecutar.
-- ─────────────────────────────────────────────────────────────

-- ─── Migración del check constraint (idempotente) ─────────────
alter table public.questions
  drop constraint if exists questions_category_check;

alter table public.questions
  add constraint questions_category_check
  check (category in (
    'historia', 'geografia', 'ciencia', 'arte', 'filosofia',
    'deportes', 'biologia', 'cine', 'musica', 'literatura',
    'tecnologia', 'mitologia', 'astronomia'
  ));

-- ─── Inserciones ──────────────────────────────────────────────

insert into public.questions (category, question, options, answer_index, context, difficulty) values

-- ══════════════════════════════════════════════════════════════
-- HISTORIA (+88)
-- ══════════════════════════════════════════════════════════════

('historia', '¿En qué año se firmó el Tratado de Versalles?',
 '["1918","1919","1920","1921"]', 1,
 'El Tratado de Versalles se firmó el 28 de junio de 1919, poniendo fin formalmente a la Primera Guerra Mundial e imponiendo duras condiciones a Alemania.',
 'medium'),

('historia', '¿Quién fue el último zar de Rusia?',
 '["Alejandro III","Nicolás II","Pedro el Grande","Iván el Terrible"]', 1,
 'Nicolás II Romanov gobernó de 1894 a 1917. Fue ejecutado junto con su familia en 1918 tras la Revolución Bolchevique.',
 'medium'),

('historia', '¿Qué emperador romano legalizó el cristianismo?',
 '["Diocleciano","Constantino I","Teodosio","Trajano"]', 1,
 'Constantino I promulgó el Edicto de Milán en el año 313, que concedía libertad religiosa y legalizó el cristianismo en el Imperio.',
 'medium'),

('historia', '¿En qué siglo vivió Carlomagno?',
 '["VI-VII","VIII-IX","X-XI","XII-XIII"]', 1,
 'Carlomagno (742-814) fue rey de los francos y emperador de los romanos. Fue coronado por el Papa León III en el año 800.',
 'medium'),

('historia', '¿Qué dinastía china construyó la mayor parte de la Gran Muralla actual?',
 '["Han","Tang","Ming","Qing"]', 2,
 'La dinastía Ming (1368-1644) reconstruyó y amplió la mayor parte de los tramos visibles hoy de la Gran Muralla China.',
 'medium'),

('historia', '¿Quién fue asesinado en Sarajevo en 1914?',
 '["Káiser Guillermo II","Archiduque Francisco Fernando","Zar Nicolás II","Eduardo VII"]', 1,
 'El asesinato del archiduque Francisco Fernando de Austria por Gavrilo Princip el 28 de junio de 1914 desencadenó la Primera Guerra Mundial.',
 'medium'),

('historia', '¿Qué tratado dividió el Nuevo Mundo entre España y Portugal?',
 '["Tratado de Utrecht","Tratado de Tordesillas","Tratado de Westfalia","Tratado de París"]', 1,
 'El Tratado de Tordesillas (1494) trazó una línea de demarcación que dividió las tierras descubiertas y por descubrir entre Castilla y Portugal.',
 'medium'),

('historia', '¿Qué evento marca el inicio convencional de la Edad Moderna?',
 '["Caída del Imperio Romano","Descubrimiento de América","Revolución Francesa","Invención de la imprenta"]', 1,
 'El descubrimiento de América en 1492 (junto con la caída de Constantinopla en 1453) suele señalarse como inicio de la Edad Moderna.',
 'medium'),

('historia', '¿En qué año cayó Constantinopla?',
 '["1389","1453","1492","1517"]', 1,
 'Constantinopla cayó ante los otomanos de Mehmed II el 29 de mayo de 1453, marcando el fin del Imperio Bizantino.',
 'medium'),

('historia', '¿Quién fue el faraón que firmó el primer tratado de paz conocido?',
 '["Tutankamón","Ramsés II","Keops","Akenatón"]', 1,
 'Ramsés II firmó el tratado de Kadesh con los hititas hacia 1259 a.C., considerado el primer tratado de paz escrito de la historia.',
 'hard'),

('historia', '¿Qué fue la Bauhaus?',
 '["Una dinastía alemana","Una escuela de diseño","Un partido político","Una batalla"]', 1,
 'La Bauhaus fue una escuela alemana de arte, diseño y arquitectura fundada por Walter Gropius en Weimar en 1919; cerrada por los nazis en 1933.',
 'hard'),

('historia', '¿Qué imperio fundó Mehmed II tras la toma de Constantinopla?',
 '["Imperio Persa","Imperio Otomano","Imperio Mongol","Imperio Safávida"]', 1,
 'Mehmed II "el Conquistador" consolidó el Imperio Otomano y convirtió Constantinopla (rebautizada Estambul) en su capital.',
 'medium'),

('historia', '¿Qué documento estadounidense se firmó el 4 de julio de 1776?',
 '["Constitución","Declaración de Independencia","Carta de Derechos","Tratado de París"]', 1,
 'La Declaración de Independencia, redactada principalmente por Thomas Jefferson, proclamaba la independencia de las Trece Colonias de Gran Bretaña.',
 'easy'),

('historia', '¿Quién fue el "Libertador" de Argentina, Chile y Perú?',
 '["Simón Bolívar","José de San Martín","Bernardo O''Higgins","Antonio José de Sucre"]', 1,
 'José de San Martín (1778-1850) lideró las campañas militares que liberaron Argentina, Chile y parte de Perú del dominio español.',
 'medium'),

('historia', '¿Qué guerra enfrentó al Norte y Sur de Estados Unidos (1861-1865)?',
 '["Guerra de Independencia","Guerra Civil Americana","Guerra Hispano-Estadounidense","Guerra de 1812"]', 1,
 'La Guerra de Secesión enfrentó a la Unión (Norte) contra los Estados Confederados (Sur). Terminó con la victoria del Norte y la abolición de la esclavitud.',
 'easy'),

('historia', '¿Quién fue Abraham Lincoln?',
 '["1.er presidente de EE.UU.","16.º presidente de EE.UU.","Inventor","General sudista"]', 1,
 'Abraham Lincoln fue el 16.º presidente de EE.UU. (1861-1865). Abolió la esclavitud con la Proclamación de Emancipación y fue asesinado en 1865.',
 'easy'),

('historia', '¿En qué año se promulgó la Constitución española vigente?',
 '["1975","1976","1978","1981"]', 2,
 'La Constitución Española se promulgó el 27 de diciembre de 1978 tras un referéndum, consolidando la transición a la democracia.',
 'medium'),

('historia', '¿Quién fue el dictador de España entre 1939 y 1975?',
 '["Primo de Rivera","Francisco Franco","Alfonso XIII","Juan Carlos I"]', 1,
 'Francisco Franco gobernó España como dictador desde el final de la Guerra Civil (1939) hasta su muerte en 1975.',
 'easy'),

('historia', '¿Qué imperio dominó Mesoamérica antes de la llegada de los españoles?',
 '["Inca","Azteca","Maya clásico","Olmeca"]', 1,
 'El Imperio Azteca (mexica) dominó el centro de México con capital en Tenochtitlán hasta su caída en 1521 ante Hernán Cortés.',
 'easy'),

('historia', '¿Qué fue el Mayo Francés de 1968?',
 '["Una revuelta estudiantil y obrera","Una guerra civil","Un golpe militar","Una crisis económica"]', 0,
 'En mayo de 1968 estudiantes y obreros protagonizaron en Francia protestas masivas que cuestionaron al gobierno de De Gaulle y al orden social establecido.',
 'medium'),

('historia', '¿Qué imperio precolombino tenía su capital en Cuzco?',
 '["Azteca","Maya","Inca","Chimú"]', 2,
 'Cuzco era la capital del Imperio Inca, considerado por los incas el "ombligo del mundo" (Qosqo).',
 'easy'),

('historia', '¿Quién fue Mahatma Gandhi?',
 '["Emperador hindú","Líder pacifista","Primer ministro de India","Filósofo budista"]', 1,
 'Gandhi (1869-1948) lideró la independencia india del Reino Unido mediante la resistencia no violenta (satyagraha).',
 'easy'),

('historia', '¿En qué año se independizó la India?',
 '["1942","1945","1947","1950"]', 2,
 'La India se independizó del Imperio Británico el 15 de agosto de 1947. El mismo proceso dio origen a Pakistán.',
 'medium'),

('historia', '¿Qué guerra enfrentó a Corea del Norte y Corea del Sur (1950-1953)?',
 '["Guerra de Vietnam","Guerra de Corea","Guerra del Golfo","Guerra Fría"]', 1,
 'La Guerra de Corea (1950-1953) enfrentó al Norte comunista (apoyado por China y la URSS) contra el Sur (apoyado por la ONU y EE.UU.).',
 'medium'),

('historia', '¿Qué fue el "Crash" de 1929?',
 '["Crisis bursátil en EE.UU.","Caída de un dirigible","Atentado","Choque diplomático"]', 0,
 'El Crash de Wall Street en octubre de 1929 marcó el inicio de la Gran Depresión, la mayor crisis económica del siglo XX.',
 'medium'),

('historia', '¿Quién pronunció el discurso "I have a dream"?',
 '["Malcolm X","Martin Luther King Jr.","John F. Kennedy","Barack Obama"]', 1,
 'Martin Luther King Jr. pronunció su famoso discurso el 28 de agosto de 1963 en la Marcha sobre Washington por los derechos civiles.',
 'easy'),

('historia', '¿En qué año fue asesinado John F. Kennedy?',
 '["1961","1962","1963","1968"]', 2,
 'JFK fue asesinado en Dallas el 22 de noviembre de 1963. El presunto autor, Lee Harvey Oswald, fue a su vez asesinado dos días después.',
 'medium'),

('historia', '¿Qué fue el Tratado de Maastricht (1992)?',
 '["Fundó la Unión Europea","Acabó con la URSS","Reunificó Alemania","Creó la OTAN"]', 0,
 'El Tratado de Maastricht, firmado en 1992 y en vigor en 1993, creó la Unión Europea y sentó las bases del euro.',
 'medium'),

('historia', '¿En qué año entró en circulación el euro como moneda física?',
 '["1999","2000","2002","2004"]', 2,
 'El euro entró en circulación física el 1 de enero de 2002 en doce países de la UE, aunque existía como moneda contable desde 1999.',
 'medium'),

('historia', '¿Qué imperio gobernó España Felipe II?',
 '["El Imperio Romano","El Imperio Español","El Imperio Otomano","El Sacro Imperio"]', 1,
 'Felipe II (1556-1598) gobernó un imperio en el que "no se ponía el sol", abarcando territorios en Europa, América, Asia y África.',
 'easy'),

('historia', '¿Quién derrotó a los persas en la batalla de Maratón (490 a.C.)?',
 '["Esparta","Atenas","Tebas","Macedonia"]', 1,
 'Atenas, liderada por Milcíades, derrotó a las tropas de Darío I en Maratón. Filípides corrió 42 km para anunciar la victoria.',
 'medium'),

('historia', '¿Qué emperador construyó el Coliseo de Roma?',
 '["Augusto","Vespasiano","Adriano","Calígula"]', 1,
 'El emperador Vespasiano inició la construcción del Anfiteatro Flavio (Coliseo) en el 72 d.C.; lo inauguró su hijo Tito en el 80 d.C.',
 'medium'),

('historia', '¿Quién fue Alejandro Magno?',
 '["Rey persa","Rey de Macedonia","Emperador romano","Faraón egipcio"]', 1,
 'Alejandro III de Macedonia (356-323 a.C.) conquistó un vasto imperio que iba de Grecia a la India. Discípulo de Aristóteles.',
 'easy'),

('historia', '¿Qué guerra del s. XX enfrentó a EE.UU. con un país del sudeste asiático y duró ~20 años?',
 '["Corea","Vietnam","Camboya","Filipinas"]', 1,
 'La Guerra de Vietnam (1955-1975) terminó con la caída de Saigón y la unificación bajo el régimen comunista del Norte.',
 'easy'),

('historia', '¿Qué fue la "Primavera de Praga" (1968)?',
 '["Intento de reforma en Checoslovaquia","Revolución estudiantil","Hambruna","Festival cultural"]', 0,
 'La Primavera de Praga fue un periodo de liberalización política en Checoslovaquia, aplastado por la invasión del Pacto de Varsovia en agosto de 1968.',
 'hard'),

('historia', '¿Qué año marcó el inicio de la Revolución Industrial en Inglaterra (aprox.)?',
 '["1650","1760","1820","1870"]', 1,
 'La Revolución Industrial comenzó hacia 1760-1780 en Gran Bretaña, con la mecanización del textil y la máquina de vapor.',
 'medium'),

('historia', '¿Qué imperio gobernó Solimán el Magnífico?',
 '["Persa","Otomano","Mongol","Bizantino"]', 1,
 'Solimán I "el Magnífico" (1520-1566) llevó al Imperio Otomano a su apogeo, expandiéndose por los Balcanes, el norte de África y Oriente Medio.',
 'medium'),

('historia', '¿Qué fue la "Larga Marcha" de Mao?',
 '["Retirada estratégica del PCCh","Marcha religiosa","Ruta comercial","Conquista mongola"]', 0,
 'La Larga Marcha (1934-1935) fue la retirada del Ejército Rojo chino, recorriendo ~10.000 km. Consolidó el liderazgo de Mao Zedong.',
 'hard'),

('historia', '¿Quién fue Carlos V?',
 '["Rey de Francia","Emperador del Sacro Imperio Romano","Rey de Inglaterra","Zar de Rusia"]', 1,
 'Carlos V (Carlos I de España) fue emperador del Sacro Imperio Romano Germánico (1519-1556). Heredó un imperio inmenso.',
 'medium'),

('historia', '¿Qué nombre recibe la doctrina anticomunista de EE.UU. tras la Segunda Guerra Mundial?',
 '["Doctrina Monroe","Doctrina Truman","Doctrina Eisenhower","Doctrina Bush"]', 1,
 'La Doctrina Truman (1947) declaró que EE.UU. ayudaría a países amenazados por el comunismo, dando inicio formal a la Guerra Fría.',
 'hard'),

('historia', '¿Qué fue la Ilustración?',
 '["Movimiento intelectual del s. XVIII","Una guerra","Una religión","Una dinastía"]', 0,
 'La Ilustración fue un movimiento del s. XVIII que defendía la razón, la ciencia y los derechos individuales. Influyó en la Revolución Francesa.',
 'medium'),

('historia', '¿Qué guerra civil del s. XX inspiró "Por quién doblan las campanas" de Hemingway?',
 '["Mexicana","Española","Rusa","China"]', 1,
 'La novela de Ernest Hemingway está ambientada en la Guerra Civil Española (1936-1939), en la que él participó como corresponsal.',
 'medium'),

('historia', '¿Qué fue el "Día D"?',
 '["Bombardeo a Hiroshima","Desembarco de Normandía","Caída del Muro","Pearl Harbor"]', 1,
 'El "Día D" fue el desembarco aliado en Normandía el 6 de junio de 1944, una de las mayores operaciones militares de la historia.',
 'easy'),

('historia', '¿Qué bomba lanzó EE.UU. sobre Hiroshima en 1945?',
 '["Fat Man","Little Boy","Trinity","Tsar Bomba"]', 1,
 '"Little Boy" fue la bomba atómica de uranio lanzada sobre Hiroshima el 6 de agosto de 1945. "Fat Man" cayó sobre Nagasaki tres días después.',
 'medium'),

('historia', '¿Quién fue Winston Churchill?',
 '["Rey de Inglaterra","Primer ministro británico","General estadounidense","Filósofo"]', 1,
 'Churchill fue primer ministro del Reino Unido (1940-1945 y 1951-1955), líder británico durante la Segunda Guerra Mundial. Nobel de Literatura 1953.',
 'easy'),

('historia', '¿Qué nombre tenía Tailandia antes de 1939?',
 '["Birmania","Indochina","Siam","Annam"]', 2,
 'Tailandia se llamaba oficialmente "Siam" hasta 1939. Es uno de los pocos países del sudeste asiático que nunca fue colonizado.',
 'hard'),

('historia', '¿En qué año se reunificó Alemania?',
 '["1989","1990","1991","1992"]', 1,
 'Alemania se reunificó oficialmente el 3 de octubre de 1990, casi un año después de la caída del Muro de Berlín.',
 'medium'),

('historia', '¿Quién fue Iósif Stalin?',
 '["Zar ruso","Líder de la URSS","Presidente de EE.UU.","Líder yugoslavo"]', 1,
 'Stalin lideró la URSS desde mediados de los años 20 hasta su muerte en 1953. Industrializó el país a costa de millones de víctimas.',
 'easy'),

('historia', '¿Qué fue el GULAG?',
 '["Sistema de campos de trabajo soviéticos","Una orden militar","Un partido nazi","Un imperio"]', 0,
 'El Gulag fue el sistema soviético de campos de trabajos forzados donde fueron encarcelados millones de personas durante el régimen estalinista.',
 'medium'),

('historia', '¿En qué año empezó la guerra de Ucrania (invasión rusa a gran escala)?',
 '["2014","2020","2022","2023"]', 2,
 'Rusia lanzó la invasión a gran escala de Ucrania el 24 de febrero de 2022. La anexión de Crimea había ocurrido en 2014.',
 'easy'),

('historia', '¿Qué imperio inició las Cruzadas en 1095?',
 '["Bizantino","Europa cristiana medieval","Otomano","Persa"]', 1,
 'El papa Urbano II llamó a la Primera Cruzada en el Concilio de Clermont (1095), iniciando las campañas para reconquistar Tierra Santa.',
 'medium'),

('historia', '¿Quién fue Saladino?',
 '["Sultán musulmán medieval","Califa omeya","Emir andalusí","Rey persa"]', 0,
 'Saladino (Salah ad-Din, 1137-1193) fue sultán de Egipto y Siria. Recuperó Jerusalén para el islam en 1187.',
 'medium'),

('historia', '¿Qué papel desempeñó Eva Perón?',
 '["Reina española","Primera dama argentina","Actriz mexicana","Líder revolucionaria cubana"]', 1,
 'Eva Duarte de Perón ("Evita", 1919-1952) fue primera dama de Argentina e icono del peronismo, defensora de los derechos sociales y de la mujer.',
 'medium'),

('historia', '¿En qué año asesinaron a Lincoln?',
 '["1860","1862","1865","1869"]', 2,
 'Abraham Lincoln fue asesinado por John Wilkes Booth el 14 de abril de 1865, pocos días después del fin de la Guerra de Secesión.',
 'medium'),

('historia', '¿Qué dinastía egipcia perteneció Tutankamón?',
 '["XVIII","XIX","XX","XXI"]', 0,
 'Tutankamón perteneció a la XVIII dinastía del Imperio Nuevo egipcio (siglo XIV a.C.). Su tumba fue descubierta por Howard Carter en 1922.',
 'hard'),

('historia', '¿Qué emperador romano dividió el imperio en Oriente y Occidente formalmente?',
 '["Diocleciano","Constantino","Teodosio","Justiniano"]', 2,
 'Teodosio I "el Grande" dividió el Imperio Romano entre sus hijos Arcadio y Honorio en 395 d.C., partición que se hizo definitiva.',
 'hard'),

('historia', '¿Qué fue la batalla de Trafalgar (1805)?',
 '["Batalla naval","Batalla en los Alpes","Asedio","Duelo de caballería"]', 0,
 'En Trafalgar (Cádiz), la flota británica de Nelson derrotó a la franco-española. Nelson murió en combate.',
 'medium'),

('historia', '¿Qué dinastía gobierna actualmente España?',
 '["Habsburgo","Borbón","Trastámara","Saboya"]', 1,
 'La Casa de Borbón gobierna España desde 1700 (con interrupciones). El rey actual es Felipe VI desde 2014.',
 'easy'),

('historia', '¿Quién unificó China por primera vez (221 a.C.)?',
 '["Qin Shi Huang","Confucio","Sun Tzu","Mao Zedong"]', 0,
 'Qin Shi Huang fue el primer emperador de una China unificada y ordenó construir gran parte de la Gran Muralla y su famoso ejército de terracota.',
 'hard'),

('historia', '¿Qué fue la "Pax Romana"?',
 '["Periodo de estabilidad imperial","Tratado","Religión","Guerra civil"]', 0,
 'La Pax Romana fue un periodo de relativa paz y estabilidad en el Imperio Romano, aprox. del 27 a.C. al 180 d.C.',
 'medium'),

('historia', '¿Qué documento inglés de 1215 limitó el poder del rey?',
 '["Bill of Rights","Carta Magna","Petición de Derecho","Act of Union"]', 1,
 'La Magna Carta fue impuesta al rey Juan I por los barones en 1215; un hito en la limitación del poder real y el desarrollo del constitucionalismo.',
 'medium'),

('historia', '¿En qué año fue el atentado de las Torres Gemelas?',
 '["1999","2000","2001","2003"]', 2,
 'El 11 de septiembre de 2001, 19 terroristas de Al Qaeda atentaron contra el WTC y el Pentágono, causando casi 3.000 muertos.',
 'easy'),

('historia', '¿Quién fue el primer hombre en circunnavegar el globo (su expedición lo logró)?',
 '["Vasco de Gama","Magallanes-Elcano","Cristóbal Colón","Francis Drake"]', 1,
 'Fernando de Magallanes inició la expedición; murió en Filipinas (1521). Juan Sebastián Elcano completó el viaje en 1522.',
 'medium'),

('historia', '¿Qué causó la caída final del Imperio Bizantino?',
 '["Conquista otomana","Cruzadas","Peste Negra","Invasión vikinga"]', 0,
 'El Imperio Bizantino cayó cuando los turcos otomanos tomaron Constantinopla en 1453, bajo el mando de Mehmed II.',
 'medium'),

('historia', '¿Quién fue el "Padre de la Patria" en Italia tras la unificación (1861)?',
 '["Garibaldi","Cavour","Víctor Manuel II","Mazzini"]', 2,
 'Víctor Manuel II fue proclamado rey de Italia en 1861. Garibaldi y Cavour fueron protagonistas decisivos del proceso de unificación.',
 'hard'),

('historia', '¿Qué fue la Guerra de los Treinta Años (1618-1648)?',
 '["Conflicto religioso-político en Europa","Guerra civil inglesa","Guerra colonial","Guerra napoleónica"]', 0,
 'Comenzó como conflicto religioso (católicos vs. protestantes) en el Sacro Imperio y terminó con la Paz de Westfalia, base del sistema de Estados moderno.',
 'hard'),

('historia', '¿Qué emperador chino mandó construir su ejército de terracota?',
 '["Qin Shi Huang","Han Wudi","Kublai Kan","Tang Taizong"]', 0,
 'El primer emperador, Qin Shi Huang, ordenó la construcción del ejército de terracota (~8.000 figuras) para protegerlo en la otra vida.',
 'medium'),

('historia', '¿Quién dirigió la Revolución Cubana en 1959?',
 '["Che Guevara","Fidel Castro","Camilo Cienfuegos","Raúl Castro"]', 1,
 'Fidel Castro derrocó a Fulgencio Batista el 1 de enero de 1959 y gobernó Cuba durante casi cinco décadas.',
 'easy'),

('historia', '¿Qué fue la batalla de Stalingrado (1942-1943)?',
 '["Punto de inflexión en la Segunda Guerra Mundial","Batalla naval","Pacto de paz","Asedio del s. XIX"]', 0,
 'Fue una de las batallas más sangrientas de la historia. La derrota alemana frente a la URSS marcó el cambio del curso de la guerra en el Este.',
 'medium'),

('historia', '¿Qué año se fundó la OTAN?',
 '["1945","1947","1949","1955"]', 2,
 'La OTAN se fundó el 4 de abril de 1949 mediante el Tratado de Washington, como alianza militar contra la URSS.',
 'medium'),

('historia', '¿Cuándo se firmó el Pacto de Varsovia?',
 '["1945","1949","1955","1961"]', 2,
 'El Pacto de Varsovia se firmó en 1955 entre la URSS y sus aliados de Europa del Este, en respuesta a la OTAN.',
 'hard'),

('historia', '¿Qué imperio destruyó Cartago en 146 a.C.?',
 '["Macedonia","Roma","Persia","Egipto"]', 1,
 'Roma destruyó Cartago al final de la Tercera Guerra Púnica (146 a.C.). El general Escipión Emiliano arrasó la ciudad.',
 'hard'),

('historia', '¿Quién fue Aníbal Barca?',
 '["General griego","General cartaginés","Emperador romano","Rey persa"]', 1,
 'Aníbal (247-183 a.C.) fue el general cartaginés que cruzó los Alpes con elefantes durante la Segunda Guerra Púnica para atacar Roma.',
 'medium'),

('historia', '¿Qué emperador convirtió el cristianismo en religión oficial del Imperio Romano?',
 '["Constantino","Teodosio I","Justiniano","Diocleciano"]', 1,
 'Teodosio I promulgó el Edicto de Tesalónica (380 d.C.) que estableció el cristianismo niceno como religión oficial del Imperio.',
 'hard'),

('historia', '¿Qué fue la Comuna de París (1871)?',
 '["Gobierno revolucionario","Tratado de paz","Partido político","Banco"]', 0,
 'La Comuna fue un gobierno popular revolucionario que controló París de marzo a mayo de 1871, reprimido sangrientamente por el gobierno francés.',
 'hard'),

('historia', '¿Qué imperio europeo colonizó Brasil?',
 '["España","Portugal","Países Bajos","Reino Unido"]', 1,
 'Brasil fue colonia portuguesa desde 1500 hasta su independencia en 1822. Es por ello el mayor país lusófono del mundo.',
 'easy'),

('historia', '¿Cuándo se firmó la Declaración Universal de los Derechos Humanos?',
 '["1945","1948","1950","1955"]', 1,
 'Fue proclamada por la Asamblea General de la ONU el 10 de diciembre de 1948 en París, redactada por una comisión presidida por Eleanor Roosevelt.',
 'medium'),

('historia', '¿Qué imperio gobernaba Persia antes de Alejandro Magno?',
 '["Aqueménida","Sasánida","Parto","Selyúcida"]', 0,
 'El Imperio Aqueménida (550-330 a.C.) fue derrotado por Alejandro Magno. Sus reyes más famosos fueron Ciro, Darío I y Jerjes.',
 'hard'),

('historia', '¿Qué ciudad fue cuna del Renacimiento?',
 '["Roma","Florencia","Venecia","Milán"]', 1,
 'Florencia, bajo el mecenazgo de los Médici, fue el principal foco artístico, literario y filosófico del Renacimiento en el s. XV.',
 'medium'),

('historia', '¿Quién fue Lorenzo de Médici?',
 '["Pintor","Mecenas florentino","Papa","Rey francés"]', 1,
 'Lorenzo "el Magnífico" (1449-1492) fue gobernante de facto de Florencia y gran mecenas de Botticelli, Miguel Ángel o Leonardo.',
 'hard'),

('historia', '¿Qué imperio dominó la India entre los siglos XVI y XIX?',
 '["Maurya","Mogol","Gupta","Maratha"]', 1,
 'El Imperio Mogol (1526-1857) gobernó gran parte del subcontinente indio. Su emperador más famoso, Akbar, fue tolerante con todas las religiones.',
 'hard'),

('historia', '¿Quién mandó construir el Taj Mahal?',
 '["Akbar","Sha Jahan","Aurangzeb","Babur"]', 1,
 'Sha Jahan mandó construir el Taj Mahal (1632-1653) en Agra como mausoleo para su esposa Mumtaz Mahal.',
 'medium'),

('historia', '¿Qué fue la dinastía Tudor?',
 '["Dinastía inglesa (1485-1603)","Dinastía francesa","Dinastía rusa","Dinastía germana"]', 0,
 'Los Tudor reinaron en Inglaterra desde Enrique VII hasta Isabel I. Incluyen a Enrique VIII y sus seis esposas.',
 'medium'),

('historia', '¿Quién fue Isabel I de Inglaterra?',
 '["Reina católica","La Reina Virgen","Reina escocesa","Reina vikinga"]', 1,
 'Isabel I (1558-1603), hija de Enrique VIII y Ana Bolena, fue conocida como "la Reina Virgen". Su reinado fue una "edad de oro" cultural y naval.',
 'medium'),

('historia', '¿Qué fue la rebelión de los Boxer (1899-1901)?',
 '["Revuelta nacionalista en China","Guerra de boxeo profesional","Conflicto bélico en EE.UU.","Movimiento religioso"]', 0,
 'Fue una revuelta nacionalista en China contra la influencia extranjera y misionera. Fue aplastada por una coalición internacional.',
 'hard'),

('historia', '¿Cuándo se fundó la Cruz Roja?',
 '["1853","1863","1882","1901"]', 1,
 'La Cruz Roja fue fundada en Ginebra en 1863 por Henry Dunant tras presenciar la batalla de Solferino. Le valió el primer Nobel de la Paz (1901).',
 'hard'),

('historia', '¿Qué imperio dominó la región de Egipto en el s. VII a.C.?',
 '["Asirio","Persa","Romano","Macedonio"]', 0,
 'El Imperio Asirio conquistó Egipto en el s. VII a.C. bajo Esarhaddon y Asurbanipal, antes de su propia caída en 612 a.C.',
 'hard'),

('historia', '¿Qué tratado puso fin a la Guerra de los Treinta Años (1648)?',
 '["Tratado de Versalles","Paz de Westfalia","Tratado de Utrecht","Paz de Amiens"]', 1,
 'La Paz de Westfalia (1648) puso fin a la Guerra de los Treinta Años y sentó las bases del sistema de Estados-nación moderno.',
 'hard');


-- ══════════════════════════════════════════════════════════════
-- GEOGRAFIA (+91)
-- ══════════════════════════════════════════════════════════════

insert into public.questions (category, question, options, answer_index, context, difficulty) values

('geografia', '¿Cuál es la capital de Portugal?',
 '["Oporto","Lisboa","Coímbra","Braga"]', 1,
 'Lisboa, situada en la desembocadura del río Tajo, es la capital y mayor ciudad de Portugal desde 1255.',
 'easy'),

('geografia', '¿Cuál es la capital de Alemania?',
 '["Múnich","Hamburgo","Berlín","Fráncfort"]', 2,
 'Berlín es la capital y mayor ciudad de Alemania. Volvió a ser capital tras la reunificación en 1990 (antes lo era Bonn en la RFA).',
 'easy'),

('geografia', '¿Cuál es la capital de Italia?',
 '["Milán","Roma","Florencia","Nápoles"]', 1,
 'Roma, la "Ciudad Eterna", es la capital de Italia desde 1871. Contiene el Vaticano, sede de la Iglesia Católica.',
 'easy'),

('geografia', '¿Cuál es la capital de Rusia?',
 '["San Petersburgo","Moscú","Novosibirsk","Kazán"]', 1,
 'Moscú es la capital de Rusia desde 1918 (cuando los bolcheviques la trasladaron desde San Petersburgo). Es la ciudad más poblada de Europa.',
 'easy'),

('geografia', '¿En qué continente está Madagascar?',
 '["Asia","África","Oceanía","Antártida"]', 1,
 'Madagascar es una isla-Estado del océano Índico, frente a la costa sureste de África. Es la cuarta isla más grande del mundo.',
 'easy'),

('geografia', '¿Cuál es el país más extenso de la Unión Europea?',
 '["Alemania","España","Francia","Polonia"]', 2,
 'Francia es el país más extenso de la UE con unos 643.000 km² (incluyendo territorios de ultramar), tras la salida del Reino Unido.',
 'medium'),

('geografia', '¿Qué cordillera separa Europa de Asia?',
 '["Alpes","Cárpatos","Urales","Cáucaso"]', 2,
 'Los Montes Urales se consideran la frontera natural entre Europa y Asia, atravesando Rusia de norte a sur.',
 'medium'),

('geografia', '¿Cuál es la capital de Suecia?',
 '["Estocolmo","Oslo","Helsinki","Copenhague"]', 0,
 'Estocolmo es la capital y mayor ciudad de Suecia, construida sobre 14 islas. Sede de los Premios Nobel (excepto el de la Paz).',
 'easy'),

('geografia', '¿Cuál es la capital de Noruega?',
 '["Estocolmo","Oslo","Helsinki","Copenhague"]', 1,
 'Oslo es la capital y mayor ciudad de Noruega, situada al final del fiordo de Oslo. Sede del Premio Nobel de la Paz.',
 'easy'),

('geografia', '¿Cuál es la capital de Finlandia?',
 '["Estocolmo","Oslo","Helsinki","Copenhague"]', 2,
 'Helsinki es la capital y mayor ciudad de Finlandia desde 1812. Está situada en la costa sur, frente al Golfo de Finlandia.',
 'easy'),

('geografia', '¿Cuál es la capital de Dinamarca?',
 '["Estocolmo","Oslo","Helsinki","Copenhague"]', 3,
 'Copenhague es la capital de Dinamarca, en la isla de Selandia. Famosa por la Sirenita y por el Tívoli.',
 'easy'),

('geografia', '¿Cuál es la capital de Bélgica?',
 '["Bruselas","Amberes","Brujas","Gante"]', 0,
 'Bruselas es la capital de Bélgica y de facto sede de la Unión Europea y de la OTAN.',
 'easy'),

('geografia', '¿Cuál es la capital de Países Bajos?',
 '["La Haya","Ámsterdam","Róterdam","Utrecht"]', 1,
 'Ámsterdam es la capital constitucional de los Países Bajos, aunque el gobierno y la realeza residen en La Haya.',
 'easy'),

('geografia', '¿Cuál es la capital de Suiza?',
 '["Zúrich","Ginebra","Berna","Basilea"]', 2,
 'Berna es la capital de facto de Suiza (ciudad federal). Suiza no tiene una capital oficial declarada en su Constitución.',
 'medium'),

('geografia', '¿En qué país está la ciudad de Praga?',
 '["Polonia","República Checa","Hungría","Eslovaquia"]', 1,
 'Praga, la "ciudad de las cien torres", es la capital y mayor ciudad de la República Checa. Atraviesa el río Moldava.',
 'easy'),

('geografia', '¿Cuál es la capital de Hungría?',
 '["Praga","Budapest","Varsovia","Viena"]', 1,
 'Budapest se formó en 1873 con la unión de Buda, Óbuda y Pest. Está dividida por el río Danubio.',
 'easy'),

('geografia', '¿En qué país está la ciudad de Viena?',
 '["Alemania","Suiza","Austria","Hungría"]', 2,
 'Viena es la capital de Austria, históricamente sede de la Casa de Habsburgo y una de las grandes capitales musicales europeas.',
 'easy'),

('geografia', '¿Cuál es la capital de Polonia?',
 '["Varsovia","Cracovia","Gdansk","Poznan"]', 0,
 'Varsovia es la capital y mayor ciudad de Polonia, atravesada por el río Vístula. Fue casi totalmente destruida en la II Guerra Mundial.',
 'easy'),

('geografia', '¿Cuál es la capital de Grecia?',
 '["Salónica","Atenas","Patras","Heraclión"]', 1,
 'Atenas, cuna de la democracia y la filosofía occidental, es la capital de Grecia. Famosa por la Acrópolis.',
 'easy'),

('geografia', '¿En qué país está la ciudad de Marrakech?',
 '["Argelia","Túnez","Marruecos","Egipto"]', 2,
 'Marrakech es una de las cuatro ciudades imperiales de Marruecos. Conocida por la plaza Yamaa el-Fna.',
 'medium'),

('geografia', '¿Cuál es la capital de Etiopía?',
 '["Nairobi","Adís Abeba","Jartum","Mogadiscio"]', 1,
 'Adís Abeba (que en amárico significa "nueva flor") es la capital de Etiopía y sede de la Unión Africana.',
 'medium'),

('geografia', '¿Cuál es la capital de Kenia?',
 '["Nairobi","Mombasa","Kampala","Dar es Salaam"]', 0,
 'Nairobi es la capital y mayor ciudad de Kenia. Sede de varias agencias de la ONU en África.',
 'medium'),

('geografia', '¿Cuál es la capital de Sudáfrica (sede del ejecutivo)?',
 '["Ciudad del Cabo","Pretoria","Johannesburgo","Durban"]', 1,
 'Sudáfrica tiene tres capitales: Pretoria (ejecutiva), Ciudad del Cabo (legislativa) y Bloemfontein (judicial).',
 'hard'),

('geografia', '¿En qué país está Petra?',
 '["Egipto","Jordania","Líbano","Siria"]', 1,
 'Petra, antigua capital nabatea tallada en la roca, está en Jordania. Es Patrimonio de la Humanidad desde 1985.',
 'medium'),

('geografia', '¿Cuál es la capital de Israel (reconocida internacionalmente)?',
 '["Jerusalén","Tel Aviv","Haifa","Belén"]', 1,
 'Israel proclama a Jerusalén como capital, pero la mayoría de Estados y la ONU sitúan su capital de facto en Tel Aviv.',
 'hard'),

('geografia', '¿Cuál es la capital de Arabia Saudí?',
 '["La Meca","Riad","Yeda","Medina"]', 1,
 'Riad es la capital y mayor ciudad de Arabia Saudí, situada en el centro de la península arábiga.',
 'medium'),

('geografia', '¿Cuál es la capital de Irán?',
 '["Bagdad","Teherán","Damasco","Estambul"]', 1,
 'Teherán es la capital de Irán desde 1796. Tiene unos 9 millones de habitantes en la ciudad y 16 en el área metropolitana.',
 'easy'),

('geografia', '¿Cuál es la capital de Irak?',
 '["Bagdad","Teherán","Damasco","Riad"]', 0,
 'Bagdad, fundada en 762, fue capital del Califato Abasí. Es la capital y mayor ciudad de Irak desde su independencia.',
 'easy'),

('geografia', '¿Cuál es la capital de Filipinas?',
 '["Manila","Yakarta","Hanói","Bangkok"]', 0,
 'Manila es la capital de Filipinas y sede del gobierno. La ciudad más poblada del país es Ciudad Quezón.',
 'medium'),

('geografia', '¿Cuál es la capital de Tailandia?',
 '["Hanói","Bangkok","Yakarta","Manila"]', 1,
 'Bangkok (Krung Thep en tailandés) es la capital de Tailandia. Su nombre completo es uno de los más largos del mundo.',
 'easy'),

('geografia', '¿Cuál es la capital de Vietnam?',
 '["Hanói","Ho Chi Minh","Hué","Da Nang"]', 0,
 'Hanói es la capital de Vietnam desde la reunificación de 1976. Ho Chi Minh (Saigón) es la ciudad más poblada.',
 'medium'),

('geografia', '¿Cuál es la capital de Indonesia?',
 '["Yakarta","Surabaya","Bandung","Bali"]', 0,
 'Yakarta es la capital de Indonesia, en la isla de Java. El gobierno ha planeado trasladar la capital a "Nusantara" en Borneo.',
 'medium'),

('geografia', '¿Cuál es la capital de Malasia?',
 '["Kuala Lumpur","Singapur","Yakarta","Bangkok"]', 0,
 'Kuala Lumpur es la capital y mayor ciudad de Malasia. Las Torres Petronas, sus emblemas, fueron las más altas del mundo (1998-2004).',
 'medium'),

('geografia', '¿En qué país están las islas Galápagos?',
 '["Perú","Ecuador","Chile","Colombia"]', 1,
 'Las Galápagos son un archipiélago de Ecuador en el Pacífico. Charles Darwin las estudió en 1835 desarrollando su teoría de la evolución.',
 'medium'),

('geografia', '¿Cuál es la capital de Perú?',
 '["Cuzco","Lima","Arequipa","Trujillo"]', 1,
 'Lima fue fundada por Francisco Pizarro en 1535 como "Ciudad de los Reyes". Es la capital y mayor ciudad de Perú.',
 'easy'),

('geografia', '¿Cuál es la capital de Chile?',
 '["Valparaíso","Santiago","Concepción","Antofagasta"]', 1,
 'Santiago es la capital de Chile desde 1541. Aunque el Congreso Nacional tiene su sede en Valparaíso.',
 'easy'),

('geografia', '¿Cuál es la capital de Colombia?',
 '["Medellín","Bogotá","Cali","Cartagena"]', 1,
 'Bogotá es la capital y mayor ciudad de Colombia. Su nombre oficial es Bogotá D.C. (Distrito Capital), situada a 2.640 m de altitud.',
 'easy'),

('geografia', '¿Cuál es la capital de Venezuela?',
 '["Maracaibo","Caracas","Valencia","Barquisimeto"]', 1,
 'Caracas es la capital y mayor ciudad de Venezuela. Fue fundada en 1567 por Diego de Losada.',
 'easy'),

('geografia', '¿Cuál es la capital de Uruguay?',
 '["Asunción","Montevideo","La Paz","Quito"]', 1,
 'Montevideo es la capital de Uruguay. Concentra aproximadamente un tercio de la población del país.',
 'medium'),

('geografia', '¿Cuál es la capital de Paraguay?',
 '["Asunción","Montevideo","Sucre","Quito"]', 0,
 'Asunción, fundada en 1537, es la capital y mayor ciudad de Paraguay. Es una de las ciudades más antiguas de Sudamérica.',
 'medium'),

('geografia', '¿Cuál es la capital de Bolivia (sede de gobierno)?',
 '["Sucre","La Paz","Cochabamba","Santa Cruz"]', 1,
 'La Paz es la sede del gobierno y la ciudad más poblada de Bolivia. Sucre es la capital constitucional.',
 'medium'),

('geografia', '¿Cuál es la capital de Ecuador?',
 '["Guayaquil","Quito","Cuenca","Loja"]', 1,
 'Quito, situada a 2.850 m de altitud, es la capital de Ecuador. Fue la primera ciudad declarada Patrimonio Mundial por la Unesco (1978).',
 'medium'),

('geografia', '¿Cuál es la capital de Cuba?',
 '["Santiago de Cuba","La Habana","Camagüey","Holguín"]', 1,
 'La Habana es la capital y mayor ciudad de Cuba, fundada en 1519. Su casco histórico es Patrimonio de la Humanidad.',
 'easy'),

('geografia', '¿Cuál es la capital de México?',
 '["Guadalajara","Ciudad de México","Monterrey","Puebla"]', 1,
 'Ciudad de México (CDMX), fundada sobre la antigua Tenochtitlán, es una de las metrópolis más pobladas del mundo.',
 'easy'),

('geografia', '¿Qué país tiene como capital Reikiavik?',
 '["Noruega","Suecia","Islandia","Groenlandia"]', 2,
 'Reikiavik es la capital y mayor ciudad de Islandia, además de la capital de Estado más septentrional del mundo.',
 'medium'),

('geografia', '¿En qué país está la región de la Patagonia?',
 '["Solo Argentina","Solo Chile","Argentina y Chile","Bolivia y Perú"]', 2,
 'La Patagonia se reparte entre Argentina (mayor parte) y Chile, en el extremo sur de América del Sur.',
 'medium'),

('geografia', '¿Qué cordillera atraviesa Sudamérica de norte a sur?',
 '["Los Alpes","Los Andes","Los Apalaches","Las Rocosas"]', 1,
 'La cordillera de los Andes recorre 7 países sudamericanos durante 7.000 km. Es la cordillera continental más larga del mundo.',
 'easy'),

('geografia', '¿Cuál es el lago más alto del mundo navegable?',
 '["Titicaca","Maracaibo","Nicaragua","Atitlán"]', 0,
 'El lago Titicaca (3.812 m) entre Perú y Bolivia es el lago navegable comercialmente más alto del mundo.',
 'medium'),

('geografia', '¿Qué estrecho separa Sudamérica de la Antártida?',
 '["Estrecho de Bering","Paso de Drake","Estrecho de Gibraltar","Estrecho de Magallanes"]', 1,
 'El Paso de Drake, entre el cabo de Hornos y la Antártida, es famoso por sus violentas tormentas.',
 'hard'),

('geografia', '¿En qué desierto se encuentran las dunas más altas del mundo?',
 '["Sahara","Atacama","Namib","Gobi"]', 2,
 'En el desierto del Namib (Namibia) se encuentran algunas de las dunas más altas del mundo, como las de Sossusvlei.',
 'hard'),

('geografia', '¿Cuál es el río más largo de África?',
 '["Congo","Nilo","Níger","Zambeze"]', 1,
 'El Nilo, con unos 6.650 km, es el río más largo de África y suele citarse como el más largo del mundo (compitiendo con el Amazonas).',
 'easy'),

('geografia', '¿En qué país están las Cataratas Victoria?',
 '["Sudáfrica","Zimbabue-Zambia","Tanzania","Kenia"]', 1,
 'Las Cataratas Victoria, en el río Zambeze, se sitúan en la frontera entre Zimbabue y Zambia. Llamadas Mosi-oa-Tunya por los locales.',
 'medium'),

('geografia', '¿En qué país están las Cataratas del Iguazú?',
 '["Solo Brasil","Solo Argentina","Argentina y Brasil","Paraguay y Argentina"]', 2,
 'Las Cataratas del Iguazú se encuentran en la frontera entre Argentina (provincia de Misiones) y Brasil (Paraná).',
 'medium'),

('geografia', '¿Cuál es la cordillera más larga del mundo (montaña submarina)?',
 '["Andes","Himalaya","Dorsal mesoatlántica","Rocosas"]', 2,
 'La dorsal mesoatlántica recorre el océano Atlántico de norte a sur, ~16.000 km, formando el límite entre placas tectónicas.',
 'hard'),

('geografia', '¿Cuál es el país con más habitantes de África?',
 '["Egipto","Etiopía","Nigeria","Sudáfrica"]', 2,
 'Nigeria, con más de 220 millones de habitantes, es el país más poblado de África y el sexto del mundo.',
 'medium'),

('geografia', '¿Cuál es la moneda oficial del Reino Unido?',
 '["Euro","Libra esterlina","Franco","Corona"]', 1,
 'La libra esterlina (GBP) es la moneda oficial del Reino Unido, una de las divisas más antiguas en uso continuo.',
 'easy'),

('geografia', '¿Qué país tiene forma de bota?',
 '["España","Italia","Francia","Grecia"]', 1,
 'Italia tiene una característica forma de bota que se adentra en el Mediterráneo.',
 'easy'),

('geografia', '¿Qué península comparten España y Portugal?',
 '["Balcánica","Itálica","Ibérica","Escandinava"]', 2,
 'España y Portugal comparten la Península Ibérica, junto con Andorra, Gibraltar y una pequeña parte de Francia.',
 'easy'),

('geografia', '¿Qué mar separa España de África?',
 '["Mar del Norte","Mar Mediterráneo","Mar Negro","Mar Báltico"]', 1,
 'El mar de Alborán (parte occidental del Mediterráneo) separa España de Marruecos. El estrecho de Gibraltar conecta el Mediterráneo con el Atlántico.',
 'easy'),

('geografia', '¿Cuál es la moneda oficial de Japón?',
 '["Yuan","Yen","Won","Rupia"]', 1,
 'El yen (¥) es la moneda oficial de Japón desde 1871. Es la tercera divisa más negociada del mundo.',
 'easy'),

('geografia', '¿Qué moneda usa Suiza?',
 '["Euro","Franco suizo","Corona","Libra"]', 1,
 'Suiza usa el franco suizo (CHF). Es la única moneda oficial del país y de Liechtenstein.',
 'medium'),

('geografia', '¿Cuál es el desierto más seco del mundo?',
 '["Sahara","Atacama","Gobi","Mojave"]', 1,
 'El desierto de Atacama, en el norte de Chile, es el desierto no polar más árido del mundo, con zonas sin lluvia registrada en siglos.',
 'medium'),

('geografia', '¿Qué corriente oceánica enfría las costas de Chile y Perú?',
 '["Corriente del Golfo","Corriente de Humboldt","Kuroshio","Corriente de Benguela"]', 1,
 'La corriente de Humboldt es una corriente fría que recorre la costa occidental de Sudamérica. Influye en el clima y la pesca de la región.',
 'hard'),

('geografia', '¿Cuál es la capital de Singapur?',
 '["Kuala Lumpur","Bangkok","Singapur","Yakarta"]', 2,
 'Singapur es una ciudad-Estado: el país y la capital coinciden.',
 'easy'),

('geografia', '¿Cuál es la capital de Mongolia?',
 '["Ulán Bator","Astaná","Pekín","Tashkent"]', 0,
 'Ulán Bator es la capital y mayor ciudad de Mongolia, donde vive cerca de la mitad de la población del país.',
 'medium'),

('geografia', '¿Cuál es la capital de Kazajistán?',
 '["Almatý","Astaná","Tashkent","Bakú"]', 1,
 'Astaná (renombrada brevemente Nursultán entre 2019 y 2022) es la capital de Kazajistán desde 1997.',
 'hard'),

('geografia', '¿Qué océano baña la costa este de EE.UU.?',
 '["Pacífico","Atlántico","Índico","Ártico"]', 1,
 'La costa este de Estados Unidos da al océano Atlántico, mientras que la oeste da al Pacífico.',
 'easy'),

('geografia', '¿Qué estrecho separa Asia de América?',
 '["Estrecho de Bering","Estrecho de Magallanes","Estrecho de Dardanelos","Estrecho de Hormuz"]', 0,
 'El estrecho de Bering, de unos 82 km, separa Rusia (Siberia) de EE.UU. (Alaska) y conecta el Ártico con el Pacífico.',
 'medium'),

('geografia', '¿Qué estrecho controla la entrada al Golfo Pérsico?',
 '["Bósforo","Hormuz","Gibraltar","Malaca"]', 1,
 'El estrecho de Ormuz (Hormuz), entre Irán y Omán, es una ruta marítima clave para el transporte mundial de petróleo.',
 'hard'),

('geografia', '¿Qué islas conforman el archipiélago japonés (principales)?',
 '["3","4","5","7"]', 1,
 'Las cuatro islas principales de Japón son Honshu, Hokkaido, Kyushu y Shikoku. El país tiene en total unas 14.000 islas.',
 'medium'),

('geografia', '¿Qué isla mediterránea es la más grande?',
 '["Cerdeña","Sicilia","Córcega","Creta"]', 1,
 'Sicilia, con unos 25.700 km², es la isla más grande del Mediterráneo. Pertenece a Italia.',
 'medium'),

('geografia', '¿Qué país tiene a Helsinki como capital?',
 '["Estonia","Finlandia","Letonia","Suecia"]', 1,
 'Helsinki es la capital y mayor ciudad de Finlandia, situada en la costa sur frente al golfo de Finlandia.',
 'easy'),

('geografia', '¿Qué cordillera atraviesa el norte de África?',
 '["Atlas","Cárpatos","Pirineos","Apeninos"]', 0,
 'La cordillera del Atlas se extiende por Marruecos, Argelia y Túnez, separando la costa mediterránea del desierto del Sahara.',
 'medium'),

('geografia', '¿Cuál es el país más pequeño de Sudamérica (por superficie)?',
 '["Uruguay","Surinam","Ecuador","Paraguay"]', 1,
 'Surinam, con unos 163.820 km², es el país más pequeño de Sudamérica. Antigua Guayana Holandesa.',
 'hard'),

('geografia', '¿Qué país europeo no tiene salida al mar?',
 '["Bélgica","Suiza","Portugal","Dinamarca"]', 1,
 'Suiza no tiene salida al mar, al igual que Austria, Hungría, Chequia, Eslovaquia, Luxemburgo, Liechtenstein, San Marino, Vaticano, Bielorrusia, etc.',
 'easy'),

('geografia', '¿Qué país no tiene salida al mar en Sudamérica?',
 '["Paraguay y Bolivia","Solo Bolivia","Solo Paraguay","Uruguay"]', 0,
 'Bolivia y Paraguay son los únicos países sudamericanos sin acceso al mar. Bolivia lo perdió en la Guerra del Pacífico (1879-1884).',
 'medium'),

('geografia', '¿Cuál es la capital de Nueva Zelanda?',
 '["Auckland","Wellington","Christchurch","Hamilton"]', 1,
 'Wellington es la capital de Nueva Zelanda, aunque Auckland es la ciudad más poblada.',
 'medium'),

('geografia', '¿Qué cordillera separa Francia de España?',
 '["Alpes","Pirineos","Cárpatos","Apeninos"]', 1,
 'Los Pirineos forman la frontera natural entre Francia y España, con unos 430 km de longitud.',
 'easy'),

('geografia', '¿Qué cordillera separa Italia del centro de Europa?',
 '["Apeninos","Alpes","Cárpatos","Pirineos"]', 1,
 'Los Alpes forman una barrera natural entre Italia y el resto de Europa central. El Mont Blanc (4.808 m) es su cumbre más alta.',
 'easy'),

('geografia', '¿Qué isla es el mayor archipiélago de Indonesia (más poblada)?',
 '["Sumatra","Java","Borneo","Sulawesi"]', 1,
 'Java es la isla más poblada del mundo (~150 millones). Alberga la capital de Indonesia, Yakarta.',
 'hard'),

('geografia', '¿Qué moneda usa Suecia?',
 '["Euro","Corona sueca","Krona","Florín"]', 1,
 'Suecia, aunque miembro de la UE, no ha adoptado el euro. Su moneda es la corona sueca (SEK).',
 'medium'),

('geografia', '¿Cuál es la moneda oficial de la India?',
 '["Rupia","Yuan","Yen","Dirham"]', 0,
 'La rupia india (INR), símbolo ₹, es la moneda oficial de la India.',
 'medium'),

('geografia', '¿Qué país tiene a Pekín como capital?',
 '["Japón","Corea del Sur","China","Vietnam"]', 2,
 'Pekín (Beijing) es la capital de la República Popular China desde 1949 y una de las ciudades más pobladas del mundo.',
 'easy'),

('geografia', '¿Qué ciudad china es la mayor por población urbana?',
 '["Pekín","Shanghái","Cantón","Shenzhen"]', 1,
 'Shanghái, con más de 25 millones de habitantes en el área urbana, es la ciudad más poblada de China.',
 'medium'),

('geografia', '¿Cuál es el río más largo de África Occidental?',
 '["Senegal","Níger","Volta","Gambia"]', 1,
 'El Níger, con unos 4.180 km, es el tercer río más largo de África y el principal de África Occidental.',
 'hard'),

('geografia', '¿En qué país está la ciudad de Samarcanda?',
 '["Irán","Uzbekistán","Kazajistán","Tayikistán"]', 1,
 'Samarcanda, ciudad clave en la Ruta de la Seda, se encuentra en Uzbekistán. Fue capital del imperio de Tamerlán.',
 'hard'),

('geografia', '¿En qué océano está la isla de Pascua?',
 '["Atlántico","Pacífico","Índico","Antártico"]', 1,
 'La Isla de Pascua (Rapa Nui) está en el Pacífico Sur. Pertenece a Chile y es famosa por sus estatuas moái.',
 'medium'),

('geografia', '¿Qué país posee Groenlandia?',
 '["Noruega","Islandia","Dinamarca","Canadá"]', 2,
 'Groenlandia es un territorio autónomo del Reino de Dinamarca. Es la isla más grande del mundo.',
 'medium'),

('geografia', '¿Cuál es el océano más pequeño?',
 '["Atlántico","Índico","Ártico","Antártico"]', 2,
 'El océano Ártico, con unos 14 millones de km², es el más pequeño y poco profundo de los cinco océanos.',
 'medium'),

('geografia', '¿Cuál es el lago más grande de África?',
 '["Tanganica","Victoria","Malaui","Chad"]', 1,
 'El lago Victoria, con unos 68.870 km², es el lago más grande de África y el segundo de agua dulce del mundo.',
 'medium'),

('geografia', '¿En qué país está la región de la Pampa?',
 '["Brasil","Argentina","Chile","Uruguay"]', 1,
 'La Pampa es la gran llanura argentina (también se extiende a Uruguay y sur de Brasil). Centro de la producción agrícola y ganadera.',
 'medium'),

('geografia', '¿Cuál es la capital de Bangladés?',
 '["Daca","Calcuta","Karachi","Colombo"]', 0,
 'Daca es la capital y mayor ciudad de Bangladés, con un área metropolitana de más de 22 millones de habitantes.',
 'hard'),

('geografia', '¿Qué país tiene la mayor extensión de bosque tropical?',
 '["Indonesia","Congo","Brasil","Perú"]', 2,
 'Brasil alberga aproximadamente el 60% de la selva amazónica, el mayor bosque tropical del mundo.',
 'easy'),

('geografia', '¿Cuál es el segundo país más poblado del mundo?',
 '["China","India","EE.UU.","Indonesia"]', 0,
 'Desde 2023 la India superó a China en población. Antes de esa fecha, China era el más poblado y la India, el segundo.',
 'medium');

-- ══════════════════════════════════════════════════════════════
-- CIENCIA (+93)
-- ══════════════════════════════════════════════════════════════

insert into public.questions (category, question, options, answer_index, context, difficulty) values

('ciencia', '¿Cuál es el símbolo químico del sodio?',
 '["So","Sd","Na","S"]', 2,
 'El sodio tiene como símbolo "Na", del latín "natrium". Es un metal alcalino muy reactivo.',
 'easy'),

('ciencia', '¿Cuál es el elemento más abundante en la corteza terrestre?',
 '["Hierro","Silicio","Oxígeno","Aluminio"]', 2,
 'El oxígeno representa aproximadamente el 46% en masa de la corteza terrestre, seguido del silicio (28%) y el aluminio (8%).',
 'medium'),

('ciencia', '¿Qué unidad mide la corriente eléctrica?',
 '["Voltio","Ohmio","Amperio","Vatio"]', 2,
 'El amperio (A) mide la corriente eléctrica. Su nombre rinde homenaje al físico francés André-Marie Ampère.',
 'medium'),

('ciencia', '¿Qué unidad mide la presión en el SI?',
 '["Bar","Pascal","Atmósfera","Torr"]', 1,
 'El pascal (Pa = N/m²) es la unidad de presión del Sistema Internacional. La presión atmosférica estándar es 101.325 Pa.',
 'medium'),

('ciencia', '¿Qué unidad mide la frecuencia?',
 '["Watt","Hertz","Newton","Joule"]', 1,
 'El hercio (Hz) mide ciclos por segundo. Lleva el nombre del físico Heinrich Hertz.',
 'medium'),

('ciencia', '¿Qué partícula subatómica tiene carga positiva?',
 '["Electrón","Protón","Neutrón","Fotón"]', 1,
 'El protón tiene carga positiva (+1) y se encuentra en el núcleo del átomo.',
 'easy'),

('ciencia', '¿Quién formuló las leyes del movimiento de los cuerpos?',
 '["Galileo","Newton","Einstein","Kepler"]', 1,
 'Isaac Newton formuló las tres leyes del movimiento en sus "Principia Mathematica" (1687).',
 'easy'),

('ciencia', '¿Qué propiedad describe la cantidad de materia de un cuerpo?',
 '["Peso","Volumen","Masa","Densidad"]', 2,
 'La masa es la cantidad de materia. Se mide en kilogramos. No es lo mismo que el peso (fuerza).',
 'easy'),

('ciencia', '¿Qué es un isótopo?',
 '["Átomo con el mismo número atómico, distinto másico","Molécula","Elemento radiactivo","Compuesto"]', 0,
 'Los isótopos son átomos del mismo elemento con igual número de protones pero distinto número de neutrones.',
 'medium'),

('ciencia', '¿Qué tipo de enlace forma el agua entre sus moléculas?',
 '["Iónico","Covalente","Puente de hidrógeno","Metálico"]', 2,
 'Las moléculas de agua se atraen entre sí por puentes de hidrógeno, lo que explica muchas de sus propiedades inusuales.',
 'medium'),

('ciencia', '¿Cuántos elementos químicos forman parte de los gases nobles?',
 '["4","5","6","7"]', 2,
 'Los gases nobles son 6 elementos clásicos: helio, neón, argón, kriptón, xenón y radón. El oganesón (7º) fue sintetizado en 2002.',
 'hard'),

('ciencia', '¿Qué partícula es responsable de transmitir la fuerza electromagnética?',
 '["Gluon","Fotón","Bosón W","Bosón de Higgs"]', 1,
 'El fotón es la partícula mediadora de la interacción electromagnética. Es la "partícula" de la luz.',
 'hard'),

('ciencia', '¿Quién descubrió el electrón?',
 '["Rutherford","J.J. Thomson","Bohr","Planck"]', 1,
 'J.J. Thomson descubrió el electrón en 1897 mediante experimentos con rayos catódicos. Nobel de Física 1906.',
 'medium'),

('ciencia', '¿Quién propuso el modelo atómico con núcleo central?',
 '["Bohr","Rutherford","Dalton","Schrödinger"]', 1,
 'Ernest Rutherford propuso el modelo nuclear del átomo en 1911 tras su famoso experimento con láminas de oro.',
 'medium'),

('ciencia', '¿Qué fenómeno describe el efecto Doppler?',
 '["Variación aparente de la frecuencia","Refracción","Polarización","Interferencia"]', 0,
 'El efecto Doppler explica la variación aparente de la frecuencia de una onda al haber movimiento relativo entre fuente y observador.',
 'medium'),

('ciencia', '¿Qué es la entropía?',
 '["Una medida del desorden","Una energía","Una fuerza","Una temperatura"]', 0,
 'En termodinámica, la entropía mide el grado de desorden de un sistema. La 2.ª ley dice que tiende a aumentar.',
 'hard'),

('ciencia', '¿Qué fórmula resume la energía-masa en relatividad?',
 '["E=mc","E=mc²","E=½mv²","F=ma"]', 1,
 'La famosa ecuación de Einstein E=mc² muestra la equivalencia entre masa y energía. c es la velocidad de la luz.',
 'easy'),

('ciencia', '¿Quién enunció el principio de incertidumbre?',
 '["Bohr","Heisenberg","Schrödinger","Pauli"]', 1,
 'Werner Heisenberg formuló el principio de incertidumbre en 1927: no se puede conocer simultáneamente con precisión la posición y el momento de una partícula.',
 'hard'),

('ciencia', '¿Qué ecuación describe la onda cuántica?',
 '["Ecuación de Maxwell","Ecuación de Schrödinger","Ecuación de Dirac","Ecuación de Boltzmann"]', 1,
 'La ecuación de Schrödinger (1926) describe la evolución temporal de la función de onda de un sistema cuántico.',
 'hard'),

('ciencia', '¿Qué unidad mide la cantidad de sustancia?',
 '["Mol","Gramo","Litro","Newton"]', 0,
 'El mol es la unidad de cantidad de sustancia del SI. Un mol contiene 6,022 × 10²³ entidades elementales.',
 'medium'),

('ciencia', '¿Cuál es el pH del agua pura a 25 °C?',
 '["5","6","7","8"]', 2,
 'El agua pura tiene un pH de 7 a 25 °C, considerado neutro. Por debajo es ácido y por encima básico.',
 'easy'),

('ciencia', '¿Qué tipo de mezcla es el aire?',
 '["Compuesto","Mezcla homogénea","Sustancia pura","Mezcla heterogénea"]', 1,
 'El aire es una mezcla homogénea de gases: ~78% nitrógeno, ~21% oxígeno y trazas de otros gases.',
 'medium'),

('ciencia', '¿Qué es la sublimación?',
 '["Paso de sólido a líquido","Paso de sólido a gas","Paso de líquido a gas","Paso de gas a sólido"]', 1,
 'La sublimación es el paso directo de sólido a gas, sin pasar por la fase líquida. Ej.: hielo seco (CO₂ sólido).',
 'medium'),

('ciencia', '¿Qué metal es líquido a temperatura ambiente?',
 '["Plomo","Mercurio","Cobre","Plata"]', 1,
 'El mercurio (Hg) es el único metal líquido a temperatura ambiente. También el galio funde a ~30 °C.',
 'easy'),

('ciencia', '¿Cuántos lados tiene un dodecaedro?',
 '["10","12","14","16"]', 1,
 'El dodecaedro regular tiene 12 caras pentagonales, 20 vértices y 30 aristas. Es uno de los cinco sólidos platónicos.',
 'hard'),

('ciencia', '¿Cuántos lados tiene un icosaedro?',
 '["16","20","24","30"]', 1,
 'El icosaedro regular tiene 20 caras triangulares, 12 vértices y 30 aristas. Es uno de los sólidos platónicos.',
 'hard'),

('ciencia', '¿Cuántos lados tiene un octaedro?',
 '["6","7","8","10"]', 2,
 'El octaedro regular tiene 8 caras triangulares, 6 vértices y 12 aristas.',
 'medium'),

('ciencia', '¿Qué número es e (constante de Euler) aproximadamente?',
 '["2,71","3,14","1,41","1,61"]', 0,
 'El número e ≈ 2,71828 es la base del logaritmo natural y aparece en numerosos contextos del crecimiento exponencial.',
 'medium'),

('ciencia', '¿Qué número se llama "razón áurea"?',
 '["π","e","φ (phi)","i"]', 2,
 'La razón áurea φ ≈ 1,618 aparece en muchos contextos del arte, la naturaleza y la matemática.',
 'medium'),

('ciencia', '¿Qué teorema relaciona los lados de un triángulo rectángulo?',
 '["Teorema de Tales","Teorema de Pitágoras","Teorema del coseno","Teorema fundamental"]', 1,
 'El teorema de Pitágoras: en un triángulo rectángulo, a² + b² = c² (donde c es la hipotenusa).',
 'easy'),

('ciencia', '¿Cuál es la fórmula para el área del círculo?',
 '["2πr","πr²","πd","2π"]', 1,
 'El área del círculo es A = π × r². La circunferencia es C = 2πr.',
 'easy'),

('ciencia', '¿Cuántos grados tiene la suma de los ángulos internos de un triángulo?',
 '["90°","180°","270°","360°"]', 1,
 'La suma de los ángulos interiores de cualquier triángulo (en geometría euclidiana) es 180°.',
 'easy'),

('ciencia', '¿Cuántos grados suman los ángulos interiores de un cuadrilátero?',
 '["180°","270°","360°","540°"]', 2,
 'Los ángulos interiores de un cuadrilátero suman 360°. En general, para un polígono de n lados: (n-2) × 180°.',
 'easy'),

('ciencia', '¿Cuál es el número primo más pequeño?',
 '["1","2","3","5"]', 1,
 'El 2 es el primer número primo y el único primo par. El 1 no se considera primo por convención.',
 'easy'),

('ciencia', '¿Quién es considerado el padre de la geometría?',
 '["Pitágoras","Euclides","Tales","Arquímedes"]', 1,
 'Euclides (s. III a.C.) escribió "Los Elementos", una obra fundacional de la geometría clásica.',
 'medium'),

('ciencia', '¿Quién creó el cálculo infinitesimal de forma independiente además de Newton?',
 '["Leibniz","Euler","Gauss","Pascal"]', 0,
 'Gottfried Wilhelm Leibniz desarrolló el cálculo independientemente de Newton. Su notación (dx/dy, ∫) es la que se usa hoy.',
 'medium'),

('ciencia', '¿Qué es un agujero negro supermasivo?',
 '["Pequeño agujero","Agujero negro de millones de masas solares","Cúmulo de estrellas","Galaxia"]', 1,
 'Los agujeros negros supermasivos, con masas de millones a miles de millones de soles, se encuentran en el centro de la mayoría de galaxias.',
 'medium'),

('ciencia', '¿Qué cantidad de calor se necesita para elevar 1 °C un gramo de agua?',
 '["1 julio","1 caloría","1 kJ","1 kWh"]', 1,
 'La caloría se definió como el calor necesario para elevar 1 °C un gramo de agua. Equivale a ~4,184 julios.',
 'medium'),

('ciencia', '¿Qué hormona regula el azúcar en sangre?',
 '["Insulina","Adrenalina","Cortisol","Tiroxina"]', 0,
 'La insulina, producida en el páncreas, regula la glucemia permitiendo la entrada de glucosa en las células.',
 'easy'),

('ciencia', '¿Qué es la fusión fría?',
 '["Fusión nuclear a temperatura ambiente","Congelación","Fusión de glaciares","Soldadura"]', 0,
 'La fusión fría sería una hipotética fusión nuclear a temperatura ambiente. Hoy en día no hay evidencia reproducible que la demuestre.',
 'hard'),

('ciencia', '¿Qué es la materia oscura?',
 '["Materia que no emite luz","Antimateria","Materia volcánica","Materia plasmática"]', 0,
 'La materia oscura es una forma hipotética de materia que no interactúa electromagnéticamente. Constituye ~27% del universo.',
 'medium'),

('ciencia', '¿Qué es la antimateria?',
 '["Materia con cargas opuestas","Materia sin masa","Energía oscura","Materia condensada"]', 0,
 'La antimateria está formada por antipartículas (con carga opuesta a las normales). Cuando se encuentra con la materia, se aniquila liberando energía.',
 'hard'),

('ciencia', '¿Qué unidad mide la energía en el SI?',
 '["Newton","Pascal","Joule","Watt"]', 2,
 'El julio (J) es la unidad de energía y trabajo en el SI. 1 J = 1 N·m.',
 'easy'),

('ciencia', '¿Qué tipo de radiación tiene mayor longitud de onda?',
 '["Rayos X","Ultravioleta","Microondas","Rayos gamma"]', 2,
 'Entre las opciones, las microondas tienen la mayor longitud de onda (cm-mm). Los rayos gamma son los de menor longitud.',
 'hard'),

('ciencia', '¿Quién dijo "E pur si muove" según la tradición?',
 '["Newton","Copérnico","Galileo","Kepler"]', 2,
 'Según la tradición, Galileo Galilei pronunció "Y sin embargo se mueve" tras abjurar ante la Inquisición de la teoría heliocéntrica.',
 'medium'),

('ciencia', '¿Qué descubrió Mendeléyev en 1869?',
 '["La tabla periódica","El electrón","La radiactividad","Los rayos X"]', 0,
 'Dmitri Mendeléyev publicó en 1869 la primera tabla periódica, ordenando los elementos por sus propiedades químicas.',
 'medium'),

('ciencia', '¿Cuál es el elemento con número atómico 1?',
 '["Helio","Hidrógeno","Litio","Carbono"]', 1,
 'El hidrógeno (H) tiene número atómico 1: un protón. Es el elemento más abundante del universo.',
 'easy'),

('ciencia', '¿Cuántos protones tiene el átomo de carbono?',
 '["4","6","8","12"]', 1,
 'El carbono tiene 6 protones (número atómico 6). El isótopo más común es el ¹²C, con 6 protones y 6 neutrones.',
 'easy'),

('ciencia', '¿Qué unidad mide la radiación absorbida?',
 '["Becquerelio","Sievert","Gray","Curie"]', 2,
 'El gray (Gy) mide la dosis absorbida de radiación ionizante. El sievert (Sv) la dosis equivalente (efectos biológicos).',
 'hard'),

('ciencia', '¿Quién descubrió la radiactividad?',
 '["Becquerel","Marie Curie","Roentgen","Rutherford"]', 0,
 'Henri Becquerel descubrió la radiactividad en sales de uranio en 1896. Compartió el Nobel con los Curie en 1903.',
 'hard'),

('ciencia', '¿Qué elemento descubrieron Marie y Pierre Curie en 1898 junto al polonio?',
 '["Plutonio","Radio","Uranio","Cesio"]', 1,
 'Los Curie aislaron el radio (Ra) y el polonio (Po, llamado así por Polonia) en 1898 a partir de la pechblenda.',
 'hard'),

('ciencia', '¿Qué propiedad describe la dilatación de un cuerpo al calentarse?',
 '["Conductividad","Coeficiente de dilatación","Capacidad calorífica","Difusividad"]', 1,
 'El coeficiente de dilatación describe cuánto cambia el volumen o la longitud de un material por cada grado de variación de temperatura.',
 'medium'),

('ciencia', '¿Qué fenómeno produce el arco iris?',
 '["Reflexión","Refracción y dispersión","Difracción","Polarización"]', 1,
 'El arco iris se forma por la refracción, reflexión interna y dispersión de la luz solar en gotas de agua.',
 'medium'),

('ciencia', '¿Qué unidad mide la potencia?',
 '["Newton","Pascal","Watt","Joule"]', 2,
 'El vatio (W) es la unidad de potencia en el SI. 1 W = 1 J/s.',
 'easy'),

('ciencia', '¿A qué temperatura se funde el hielo a presión atmosférica?',
 '["-10 °C","0 °C","5 °C","-5 °C"]', 1,
 'El agua se funde (y congela) a 0 °C a 1 atm de presión. Es el punto de referencia inferior de la escala Celsius.',
 'easy'),

('ciencia', '¿Qué tipo de onda es el sonido?',
 '["Electromagnética","Mecánica longitudinal","Mecánica transversal","Estacionaria"]', 1,
 'El sonido es una onda mecánica longitudinal que requiere un medio material (aire, agua, sólidos) para propagarse.',
 'medium'),

('ciencia', '¿A qué velocidad viaja el sonido en el aire (~aprox.)?',
 '["100 m/s","340 m/s","1.000 m/s","3.000 m/s"]', 1,
 'El sonido viaja a ~343 m/s en el aire a 20 °C. En el agua, ~1.480 m/s; en el acero, ~5.000 m/s.',
 'easy'),

('ciencia', '¿Qué propiedad describe la oposición al paso de la corriente eléctrica?',
 '["Resistencia","Voltaje","Potencia","Capacitancia"]', 0,
 'La resistencia eléctrica, medida en ohmios (Ω), describe la oposición al paso de la corriente. Ley de Ohm: V = I × R.',
 'medium'),

('ciencia', '¿Quién enunció la ley de Ohm?',
 '["Faraday","Ohm","Volta","Ampère"]', 1,
 'Georg Simon Ohm formuló su ley en 1827, relacionando voltaje, corriente y resistencia: V = I · R.',
 'medium'),

('ciencia', '¿Qué inventó Alessandro Volta?',
 '["La bombilla","La pila eléctrica","El motor","El telégrafo"]', 1,
 'Volta inventó en 1800 la pila voltaica, la primera batería eléctrica. La unidad de tensión, el voltio, lleva su nombre.',
 'medium'),

('ciencia', '¿Qué ley describe la atracción entre dos masas?',
 '["Ley de Hooke","Ley de la gravitación universal","Ley de Coulomb","Ley de Faraday"]', 1,
 'La ley de la gravitación universal de Newton: F = G · m₁ · m₂ / r².',
 'medium'),

('ciencia', '¿Qué tipo de roca es el granito?',
 '["Sedimentaria","Metamórfica","Ígnea","Volcánica extrusiva"]', 2,
 'El granito es una roca ígnea intrusiva (plutónica) formada por enfriamiento lento del magma bajo la superficie.',
 'medium'),

('ciencia', '¿Cómo se llama el supercontinente que existió hace ~250 millones de años?',
 '["Gondwana","Pangea","Laurasia","Eurasia"]', 1,
 'Pangea fue el supercontinente que agrupaba casi toda la masa terrestre. Se fragmentó dando lugar a los continentes actuales.',
 'medium'),

('ciencia', '¿Cuántas placas tectónicas mayores hay?',
 '["5","7","10","15"]', 1,
 'Se reconocen 7 placas tectónicas principales: Africana, Antártica, Eurasiática, Norteamericana, Sudamericana, Indo-Australiana y Pacífica.',
 'hard'),

('ciencia', '¿Cuál es el órgano interno encargado de bombear sangre?',
 '["Riñón","Pulmón","Corazón","Hígado"]', 2,
 'El corazón bombea unos 5 litros de sangre por minuto en reposo. Late en torno a 100.000 veces al día.',
 'easy'),

('ciencia', '¿Cómo se llama el tubo que conecta la boca con el estómago?',
 '["Tráquea","Esófago","Intestino","Bronquio"]', 1,
 'El esófago es el conducto musculoso que transporta el alimento desde la faringe hasta el estómago mediante peristalsis.',
 'easy'),

('ciencia', '¿Qué gas espira el ser humano principalmente?',
 '["Oxígeno","Nitrógeno","Dióxido de carbono","Metano"]', 2,
 'Al respirar, espiramos principalmente nitrógeno (que entra y sale igual), pero el gas que aumenta es el CO₂, producto del metabolismo.',
 'easy'),

('ciencia', '¿Qué función tiene la hemoglobina?',
 '["Transportar oxígeno","Coagular la sangre","Defensa","Digestión"]', 0,
 'La hemoglobina es una proteína presente en los glóbulos rojos que transporta oxígeno desde los pulmones a los tejidos.',
 'medium'),

('ciencia', '¿Cuál es la temperatura corporal normal humana?',
 '["35 °C","36,5-37 °C","38 °C","40 °C"]', 1,
 'La temperatura corporal normal oscila entre 36,5 y 37,5 °C en adultos sanos.',
 'easy'),

('ciencia', '¿Qué es la teoría heliocéntrica?',
 '["La Tierra es el centro","El Sol es el centro","No hay centro","La Luna es el centro"]', 1,
 'La teoría heliocéntrica sitúa al Sol en el centro del sistema solar. Fue propuesta por Copérnico (1543) y defendida por Galileo y Kepler.',
 'easy'),

('ciencia', '¿Qué es la teoría geocéntrica?',
 '["El Sol gira en torno a la Tierra","La Tierra gira en torno al Sol","La Luna es el centro","Hay varios soles"]', 0,
 'La teoría geocéntrica situaba a la Tierra inmóvil en el centro del universo. Fue defendida por Ptolomeo y dominó hasta el s. XVI.',
 'easy'),

('ciencia', '¿Cuántas leyes describen el movimiento planetario de Kepler?',
 '["2","3","4","5"]', 1,
 'Las tres leyes de Kepler describen las órbitas elípticas, las áreas barridas y el periodo de los planetas alrededor del Sol.',
 'medium'),

('ciencia', '¿Quién descubrió la fisión nuclear?',
 '["Einstein","Otto Hahn","Fermi","Oppenheimer"]', 1,
 'Otto Hahn descubrió la fisión nuclear en 1938 (junto con Strassmann y Meitner). Nobel de Química 1944.',
 'hard'),

('ciencia', '¿Qué partícula completó el Modelo Estándar al ser descubierta en 2012?',
 '["Quark top","Bosón de Higgs","Neutrino","Gluón"]', 1,
 'El bosón de Higgs fue confirmado en el LHC del CERN en 2012, validando un mecanismo propuesto en 1964 para explicar la masa.',
 'hard'),

('ciencia', '¿Qué fuerza fundamental es responsable del decaimiento radiactivo beta?',
 '["Gravedad","Electromagnetismo","Nuclear fuerte","Nuclear débil"]', 3,
 'La fuerza nuclear débil es responsable del decaimiento beta, donde un neutrón se transforma en protón emitiendo un electrón.',
 'hard'),

('ciencia', '¿Cuántas fuerzas fundamentales conoce la física?',
 '["2","3","4","5"]', 2,
 'Las cuatro fuerzas fundamentales son: gravitatoria, electromagnética, nuclear fuerte y nuclear débil.',
 'medium'),

('ciencia', '¿Quién diseñó la primera vacuna (viruela)?',
 '["Pasteur","Edward Jenner","Koch","Fleming"]', 1,
 'Edward Jenner desarrolló la primera vacuna en 1796 utilizando la viruela vacuna para inmunizar contra la viruela humana.',
 'medium'),

('ciencia', '¿Quién desarrolló la pasteurización?',
 '["Koch","Pasteur","Jenner","Lister"]', 1,
 'Louis Pasteur desarrolló este método de conservación en el s. XIX. También trabajó en vacunas contra la rabia.',
 'medium'),

('ciencia', '¿Qué célula no tiene núcleo en su madurez?',
 '["Linfocito","Neurona","Glóbulo rojo","Hepatocito"]', 2,
 'Los eritrocitos (glóbulos rojos) maduros de mamíferos pierden el núcleo para llevar más hemoglobina.',
 'medium'),

('ciencia', '¿Cuál es la primera ley de la termodinámica?',
 '["Conservación de la energía","Entropía aumenta","Temperatura absoluta","Equilibrio térmico"]', 0,
 'La primera ley de la termodinámica establece que la energía no se crea ni se destruye, solo se transforma.',
 'medium'),

('ciencia', '¿Qué describe la 2.ª ley de la termodinámica?',
 '["Conservación","Aumento de la entropía","Cero absoluto","Equilibrio"]', 1,
 'La 2.ª ley afirma que en un sistema aislado, la entropía total siempre tiende a aumentar con el tiempo.',
 'hard'),

('ciencia', '¿Qué unidad mide la inducción magnética en el SI?',
 '["Tesla","Gauss","Henry","Weber"]', 0,
 'El tesla (T) es la unidad de densidad de flujo magnético en el SI. 1 T = 10.000 gauss.',
 'hard'),

('ciencia', '¿Qué famoso científico predijo las ondas gravitacionales en 1916?',
 '["Newton","Einstein","Hawking","Maxwell"]', 1,
 'Einstein predijo las ondas gravitacionales como consecuencia de su teoría de la relatividad general. Se detectaron por primera vez en 2015.',
 'hard'),

('ciencia', '¿Qué ecuaciones describen el electromagnetismo clásico?',
 '["Ecuaciones de Newton","Ecuaciones de Maxwell","Ecuaciones de Einstein","Ecuaciones de Schrödinger"]', 1,
 'Las cuatro ecuaciones de Maxwell (1865) unifican electricidad y magnetismo y predicen la existencia de ondas electromagnéticas.',
 'hard'),

('ciencia', '¿Qué es la velocidad de escape de la Tierra (aprox.)?',
 '["11,2 km/s","30 km/s","2,3 km/s","100 km/s"]', 0,
 'La velocidad de escape desde la superficie terrestre es de ~11,2 km/s. Por debajo de ese valor un objeto vuelve a caer.',
 'hard'),

('ciencia', '¿Quién descubrió los neutrones?',
 '["Rutherford","Chadwick","Bohr","Curie"]', 1,
 'James Chadwick descubrió el neutrón en 1932. Nobel de Física 1935.',
 'hard'),

('ciencia', '¿Qué unidad SI mide el ángulo plano?',
 '["Grado","Radián","Esteradián","Vuelta"]', 1,
 'El radián (rad) es la unidad SI de ángulo plano. Una vuelta completa equivale a 2π radianes (360°).',
 'medium'),

('ciencia', '¿Cuál es la principal fuente de energía del Sol?',
 '["Fisión","Fusión","Combustión","Radiactividad"]', 1,
 'El Sol obtiene su energía de la fusión termonuclear de hidrógeno en helio en su núcleo.',
 'medium'),

('ciencia', '¿Qué propiedad de la luz se explica por la teoría cuántica?',
 '["Reflexión","Efecto fotoeléctrico","Refracción","Difracción"]', 1,
 'El efecto fotoeléctrico, explicado por Einstein en 1905 con cuantos de luz, le valió el Nobel de Física 1921.',
 'hard'),

('ciencia', '¿Qué inventó Galileo (entre otras cosas)?',
 '["Telescopio (perfeccionó)","Imprenta","Bombilla","Reloj atómico"]', 0,
 'Galileo perfeccionó el telescopio en 1609 y lo usó para observar las lunas de Júpiter, las fases de Venus y las manchas solares.',
 'medium'),

('ciencia', '¿Qué temperatura representa el cero absoluto?',
 '["0 °C","-100 °C","-273,15 °C","-459 °C"]', 2,
 'El cero absoluto es -273,15 °C, equivalente a 0 K. Es la temperatura más baja teóricamente posible.',
 'medium'),

('ciencia', '¿Qué famoso libro escribió Darwin en 1859?',
 '["Sobre el origen de las especies","El origen del hombre","El viaje del Beagle","Variación animal"]', 0,
 '"Sobre el origen de las especies" (1859) presentó la teoría de la evolución por selección natural.',
 'easy'),

('ciencia', '¿Qué célula transmite los impulsos nerviosos?',
 '["Neurona","Astrocito","Glóbulo blanco","Hepatocito"]', 0,
 'La neurona es la célula básica del sistema nervioso. Tiene dendritas, cuerpo celular y un axón.',
 'easy');

-- ══════════════════════════════════════════════════════════════
-- ARTE (+105)
-- ══════════════════════════════════════════════════════════════

insert into public.questions (category, question, options, answer_index, context, difficulty) values

('arte', '¿Qué pintor cortó parte de su oreja en 1888?',
 '["Gauguin","Van Gogh","Monet","Cézanne"]', 1,
 'Vincent van Gogh se cortó parte del lóbulo de la oreja izquierda en Arlés en diciembre de 1888, en plena crisis psicológica.',
 'medium'),

('arte', '¿Quién pintó "El bautismo de Cristo" mientras Leonardo era su alumno?',
 '["Verrocchio","Ghirlandaio","Botticelli","Masaccio"]', 0,
 'Andrea del Verrocchio dirigió el taller florentino donde Leonardo se formó. Leonardo pintó uno de los ángeles de "El bautismo de Cristo".',
 'hard'),

('arte', '¿Qué pintor barroco español pintó "Las Lanzas"?',
 '["Murillo","Velázquez","Zurbarán","Ribera"]', 1,
 '"La rendición de Breda" (1635), conocida como "Las Lanzas", es una de las obras maestras de Diego Velázquez.',
 'medium'),

('arte', '¿Qué arquitecto modernista catalán diseñó la Casa Batlló?',
 '["Domènech i Montaner","Gaudí","Puig i Cadafalch","Sert"]', 1,
 'Antoni Gaudí reformó la Casa Batlló (1904-1906) en el Passeig de Gràcia de Barcelona. Es Patrimonio de la Humanidad.',
 'medium'),

('arte', '¿Quién pintó "La libertad guiando al pueblo"?',
 '["Delacroix","Géricault","Ingres","David"]', 0,
 'Eugène Delacroix pintó "La libertad guiando al pueblo" (1830) para conmemorar la Revolución de Julio en Francia. Está en el Louvre.',
 'medium'),

('arte', '¿Qué pintor renacentista pintó la Capilla Sixtina?',
 '["Rafael","Leonardo","Miguel Ángel","Tiziano"]', 2,
 'Miguel Ángel pintó la bóveda (1508-1512) y "El Juicio Final" (1536-1541) en la Capilla Sixtina del Vaticano.',
 'easy'),

('arte', '¿Quién pintó "La escuela de Atenas"?',
 '["Rafael","Miguel Ángel","Leonardo","Botticelli"]', 0,
 '"La escuela de Atenas" (1509-1511) fue pintada por Rafael en las Estancias Vaticanas. Representa a los grandes filósofos griegos.',
 'medium'),

('arte', '¿Qué artista pintó "El caminante sobre el mar de nubes"?',
 '["Turner","Friedrich","Constable","Cole"]', 1,
 'Caspar David Friedrich pintó este icono del Romanticismo alemán hacia 1818. Una figura contempla un paisaje sublime de niebla.',
 'hard'),

('arte', '¿Qué pintor flamenco pintó "El matrimonio Arnolfini" (1434)?',
 '["Bosch","Van Eyck","Rubens","Brueghel el Viejo"]', 1,
 'Jan van Eyck pintó "El matrimonio Arnolfini", una obra maestra de la pintura flamenca temprana. Está en la National Gallery de Londres.',
 'hard'),

('arte', '¿Qué pintor neerlandés es famoso por sus paisajes urbanos de Delft?',
 '["Vermeer","Rembrandt","Hals","Van Gogh"]', 0,
 'Johannes Vermeer (1632-1675) pintó "Vista de Delft", "La joven de la perla" y otras obras maestras del barroco neerlandés.',
 'medium'),

('arte', '¿Quién pintó "La joven de la perla"?',
 '["Rembrandt","Vermeer","Frans Hals","Rubens"]', 1,
 '"La joven de la perla" (~1665) de Johannes Vermeer se conserva en el museo Mauritshuis de La Haya.',
 'medium'),

('arte', '¿Quién pintó "La ronda de noche"?',
 '["Vermeer","Rembrandt","Brueghel","Caravaggio"]', 1,
 '"La ronda de noche" (1642) es una obra maestra de Rembrandt. Está en el Rijksmuseum de Ámsterdam.',
 'medium'),

('arte', '¿Qué movimiento artístico fundó Pablo Picasso junto a Georges Braque?',
 '["Surrealismo","Cubismo","Expresionismo","Dadaísmo"]', 1,
 'Picasso y Braque desarrollaron el cubismo entre 1907 y 1914, fragmentando la representación de la realidad en planos geométricos.',
 'easy'),

('arte', '¿Quién pintó "Los fusilamientos del 3 de mayo"?',
 '["Goya","Velázquez","Sorolla","Murillo"]', 0,
 'Francisco de Goya pintó esta obra en 1814 representando la represión de Napoleón en Madrid el 3 de mayo de 1808. Está en el Prado.',
 'medium'),

('arte', '¿Qué movimiento artístico inició Claude Monet?',
 '["Impresionismo","Romanticismo","Realismo","Cubismo"]', 0,
 'Monet fue figura clave del Impresionismo. Su obra "Impresión, sol naciente" (1872) dio nombre al movimiento.',
 'easy'),

('arte', '¿Quién esculpió la "Piedad" del Vaticano?',
 '["Bernini","Donatello","Miguel Ángel","Cellini"]', 2,
 'Miguel Ángel esculpió "La Piedad" entre 1498 y 1499. Es la única escultura que firmó. Se encuentra en la Basílica de San Pedro.',
 'medium'),

('arte', '¿Quién esculpió "El éxtasis de Santa Teresa"?',
 '["Bernini","Bernardo Cavallino","Canova","Donatello"]', 0,
 'Gian Lorenzo Bernini esculpió esta obra del barroco italiano (1647-1652) en la iglesia de Santa Maria della Vittoria, Roma.',
 'hard'),

('arte', '¿Quién pintó "Las hilanderas"?',
 '["Velázquez","Murillo","Goya","El Greco"]', 0,
 '"Las hilanderas" (~1657) es una compleja obra de Diego Velázquez con un primer plano de hilanderas y al fondo el mito de Aracne.',
 'hard'),

('arte', '¿En qué museo se exhibe "Las Meninas"?',
 '["Louvre","Museo del Prado","Reina Sofía","Thyssen"]', 1,
 '"Las Meninas" (1656) de Velázquez se exhibe en el Museo del Prado, en Madrid.',
 'easy'),

('arte', '¿En qué museo está "El Guernica"?',
 '["Prado","Reina Sofía","Thyssen","MOMA"]', 1,
 '"El Guernica" (1937) de Picasso se exhibe en el Museo Nacional Centro de Arte Reina Sofía de Madrid desde 1992.',
 'medium'),

('arte', '¿Qué arquitecto estadounidense diseñó la Casa de la Cascada?',
 '["Frank Lloyd Wright","Frank Gehry","Le Corbusier","Mies van der Rohe"]', 0,
 'La Fallingwater (Casa de la Cascada) fue diseñada por Frank Lloyd Wright en 1935 en Pensilvania.',
 'hard'),

('arte', '¿Qué pintor mexicano pintó murales sobre la revolución?',
 '["Frida Kahlo","Diego Rivera","Tamayo","Siqueiros"]', 1,
 'Diego Rivera fue uno de los grandes muralistas mexicanos. Pintó la historia de México en grandes murales públicos.',
 'medium'),

('arte', '¿Quién pintó "El abrazo" (1917)?',
 '["Klimt","Schiele","Picasso","Kandinsky"]', 1,
 'Egon Schiele pintó "El abrazo" en 1917. Discípulo de Klimt y figura central del expresionismo vienés.',
 'hard'),

('arte', '¿Qué arquitecto fundó la Bauhaus?',
 '["Mies van der Rohe","Walter Gropius","Le Corbusier","Aalto"]', 1,
 'Walter Gropius fundó la Bauhaus en Weimar en 1919. La escuela se trasladó a Dessau (1925) y a Berlín (1932) antes de cerrar.',
 'hard'),

('arte', '¿Qué arquitecto suizo-francés diseñó la villa Saboya?',
 '["Le Corbusier","Aalto","Mies","Niemeyer"]', 0,
 'Le Corbusier diseñó la Villa Saboya (1928-1931) en Poissy, manifiesto de los "cinco puntos" de la arquitectura moderna.',
 'hard'),

('arte', '¿Qué pintor renacentista italiano es famoso por sus madonnas?',
 '["Caravaggio","Rafael","Tiziano","Tintoretto"]', 1,
 'Rafael Sanzio pintó numerosas madonas, como la "Madonna Sixtina" o la "Virgen del jilguero".',
 'medium'),

('arte', '¿Qué pintor barroco usó intensamente el claroscuro y fue famoso por su vida turbulenta?',
 '["Velázquez","Caravaggio","Rubens","Vermeer"]', 1,
 'Caravaggio (1571-1610) revolucionó la pintura con su claroscuro dramático. Su vida estuvo marcada por peleas y un asesinato.',
 'medium'),

('arte', '¿Quién pintó "El éxtasis de San Francisco" en estilo manierista?',
 '["Caravaggio","El Greco","Rubens","Tiziano"]', 1,
 'El Greco (Doménikos Theotokópoulos, 1541-1614) pintó varias obras sobre San Francisco. Establecido en Toledo, fundió tradiciones bizantina y veneciana.',
 'hard'),

('arte', '¿Qué pintor pintó la "Anunciación" del Prado (~1426)?',
 '["Fra Angelico","Botticelli","Lippi","Masaccio"]', 0,
 'Fra Angelico pintó "La Anunciación" (~1425-1428) que se conserva en el Museo del Prado.',
 'hard'),

('arte', '¿Quién esculpió "La puerta del infierno"?',
 '["Bernini","Rodin","Canova","Brancusi"]', 1,
 'Auguste Rodin trabajó en "La puerta del infierno" durante casi 40 años. De ella derivan obras como "El Pensador" y "El Beso".',
 'hard'),

('arte', '¿Quién pintó "Mujer con sombrilla"?',
 '["Monet","Manet","Renoir","Degas"]', 0,
 'Claude Monet pintó varios cuadros con su esposa Camille con sombrilla, el más famoso en 1875.',
 'medium'),

('arte', '¿Quién pintó "Olympia" (1863)?',
 '["Monet","Manet","Degas","Renoir"]', 1,
 'Édouard Manet pintó "Olympia" en 1863, causando escándalo por su crudeza realista. Anuncia la modernidad pictórica.',
 'hard'),

('arte', '¿Quién es el autor del libro "Las Confesiones"?',
 '["San Agustín","Santo Tomás","San Pablo","Rousseau"]', 0,
 'San Agustín de Hipona escribió "Las Confesiones" hacia el 400 d.C., una autobiografía espiritual.',
 'hard'),

('arte', '¿Qué edificio diseñó Filippo Brunelleschi?',
 '["Catedral de Florencia (cúpula)","Catedral de Milán","San Pedro de Roma","Catedral de Siena"]', 0,
 'Brunelleschi diseñó la famosa cúpula de la catedral de Florencia (Santa Maria del Fiore), completada en 1436.',
 'hard'),

('arte', '¿Qué arquitecto diseñó la Ópera de Sídney?',
 '["Jørn Utzon","Frank Gehry","Foster","Calatrava"]', 0,
 'El danés Jørn Utzon ganó el concurso en 1957. La Ópera de Sídney se completó en 1973 y es Patrimonio de la Humanidad.',
 'hard'),

('arte', '¿Qué pintor surrealista belga creó "El hijo del hombre"?',
 '["Magritte","Delvaux","Ernst","Tanguy"]', 0,
 'René Magritte pintó "El hijo del hombre" en 1964, autorretrato con bombín y una manzana ocultando la cara.',
 'medium'),

('arte', '¿Quién pintó "Composición VIII" y abrió la pintura abstracta?',
 '["Kandinsky","Malevich","Mondrian","Klee"]', 0,
 'Vasily Kandinsky es considerado pionero del arte abstracto. "Composición VIII" (1923) está en el Guggenheim.',
 'hard'),

('arte', '¿Qué movimiento artístico fundó Mondrian?',
 '["Suprematismo","Constructivismo","Neoplasticismo","Dadaísmo"]', 2,
 'Piet Mondrian fundó el neoplasticismo (De Stijl), basado en líneas rectas y colores primarios.',
 'hard'),

('arte', '¿Qué pintor ruso fundó el suprematismo?',
 '["Kandinsky","Malevich","Chagall","Tatlin"]', 1,
 'Kazimir Malevich fundó el suprematismo, movimiento de geometría pura. Su obra emblema es "Cuadrado negro" (1915).',
 'hard'),

('arte', '¿Qué arquitecto barroco italiano diseñó la columnata de la plaza de San Pedro?',
 '["Borromini","Bernini","Bramante","Palladio"]', 1,
 'Gian Lorenzo Bernini diseñó la elíptica columnata de la plaza de San Pedro (1656-1667) que abraza a los fieles.',
 'medium'),

('arte', '¿Qué arquitecto diseñó originalmente la cúpula de San Pedro?',
 '["Bernini","Miguel Ángel","Bramante","Borromini"]', 1,
 'Miguel Ángel diseñó la actual cúpula de San Pedro a partir de 1547. Fue terminada en 1590 tras su muerte.',
 'medium'),

('arte', '¿En qué museo está "El nacimiento de Venus" de Botticelli?',
 '["Uffizi","Vaticano","Louvre","Prado"]', 0,
 '"El nacimiento de Venus" (~1485) de Sandro Botticelli se encuentra en la Galería Uffizi en Florencia.',
 'medium'),

('arte', '¿Quién pintó "El triunfo de la muerte"?',
 '["Brueghel el Viejo","Bosch","Memling","Van der Weyden"]', 0,
 'Pieter Brueghel el Viejo pintó "El triunfo de la muerte" hacia 1562. Está en el Museo del Prado.',
 'hard'),

('arte', '¿Qué tipo de arte representa el "Pop Art"?',
 '["Cultura popular y consumo","Religión","Naturaleza","Política"]', 0,
 'El Pop Art usa imágenes de la cultura popular y de masas. Sus máximos exponentes fueron Andy Warhol y Roy Lichtenstein.',
 'easy'),

('arte', '¿Qué artista creó "Sopa Campbell" como icono pop?',
 '["Lichtenstein","Warhol","Hockney","Rauschenberg"]', 1,
 'Andy Warhol creó sus famosas latas de "Campbell''s Soup Cans" en 1962, icono del Pop Art.',
 'easy'),

('arte', '¿Qué movimiento de los años 60 destacó por gestos espontáneos y "drip painting"?',
 '["Cubismo","Expresionismo abstracto","Op Art","Pop Art"]', 1,
 'El expresionismo abstracto tuvo en Jackson Pollock un máximo exponente con su técnica del "dripping".',
 'medium'),

('arte', '¿Quién es famoso por sus pinturas "drip"?',
 '["Pollock","De Kooning","Rothko","Newman"]', 0,
 'Jackson Pollock revolucionó la pintura con su técnica de goteo, dejando caer pintura sobre lienzos extendidos en el suelo.',
 'medium'),

('arte', '¿Qué pintor estadounidense pintó bloques de color (rojo, naranja, etc.)?',
 '["Pollock","Rothko","De Kooning","Newman"]', 1,
 'Mark Rothko es famoso por sus pinturas de grandes bloques de color difuminados que invitan a la contemplación.',
 'hard'),

('arte', '¿Quién pintó "Una y tres sillas" (arte conceptual)?',
 '["Kosuth","Beuys","Warhol","Koons"]', 0,
 'Joseph Kosuth realizó "Una y tres sillas" en 1965, una obra clave del arte conceptual.',
 'hard'),

('arte', '¿Quién es el autor del Jardín de las Tullerías de París (diseño original)?',
 '["Le Nôtre","Mansart","Haussmann","Le Vau"]', 0,
 'André Le Nôtre, jardinero de Luis XIV, rediseñó el Jardín de las Tullerías y diseñó los jardines de Versalles.',
 'hard'),

('arte', '¿Quién pintó "El descendimiento" en la Catedral de Amberes?',
 '["Van Dyck","Rubens","Brueghel","Memling"]', 1,
 'Pedro Pablo Rubens pintó este retablo monumental hacia 1612-1614. Es una obra cumbre del barroco flamenco.',
 'hard'),

('arte', '¿Quién es famoso por sus retratos cortesanos en la corte de Carlos IV?',
 '["Murillo","Goya","Velázquez","Sorolla"]', 1,
 'Francisco de Goya fue pintor de cámara de Carlos IV. Pintó "La familia de Carlos IV" (1800) con asombrosa franqueza.',
 'medium'),

('arte', '¿Cuál es la técnica preferida de Joan Miró?',
 '["Frescos","Pintura simbólica con colores planos","Hiperrealismo","Trampantojo"]', 1,
 'Miró desarrolló un lenguaje propio de figuras simbólicas, manchas y colores planos. Vinculado al surrealismo y a Cataluña.',
 'medium'),

('arte', '¿Qué pintor catalán colabora con la Fundación Miró en Mallorca?',
 '["Tàpies","Joan Miró","Picasso","Dalí"]', 1,
 'La Fundació Pilar i Joan Miró en Mallorca conserva el taller del pintor y muchas obras suyas.',
 'hard'),

('arte', '¿Qué pintor español aragonés es famoso por pinturas de tipos y costumbres?',
 '["Sorolla","Goya","Murillo","Madrazo"]', 1,
 'Francisco de Goya y Lucientes, nacido en Fuendetodos (Aragón), pintó tanto temas cortesanos como tipos populares.',
 'medium'),

('arte', '¿Qué pintor valenciano destacó por la luz mediterránea ("luminismo")?',
 '["Sorolla","Picasso","Dalí","Mir"]', 0,
 'Joaquín Sorolla (1863-1923) destacó por la luz vibrante de sus playas mediterráneas. Su museo está en Madrid.',
 'medium'),

('arte', '¿Quién pintó "Saturno devorando a su hijo"?',
 '["Goya","Rubens","Caravaggio","Velázquez"]', 0,
 'Goya pintó "Saturno devorando a su hijo" como parte de las "Pinturas negras" (1819-1823) en la Quinta del Sordo.',
 'medium'),

('arte', '¿Qué pintor inglés es famoso por sus paisajes marinos atmosféricos?',
 '["Constable","Turner","Reynolds","Gainsborough"]', 1,
 'J.M.W. Turner (1775-1851) revolucionó la pintura paisajista con sus efectos de luz y atmósfera. Anticipó el impresionismo.',
 'medium'),

('arte', '¿Quién esculpió "El beso" (1882-1889)?',
 '["Brancusi","Rodin","Canova","Maillol"]', 1,
 'Auguste Rodin esculpió "El beso" (varias versiones en mármol y bronce) representando a Paolo y Francesca de la Divina Comedia.',
 'medium'),

('arte', '¿Quién pintó "El almuerzo sobre la hierba"?',
 '["Monet","Manet","Renoir","Degas"]', 1,
 'Édouard Manet escandalizó al Salón de París en 1863 con "Le déjeuner sur l''herbe", obra precursora del impresionismo.',
 'medium'),

('arte', '¿Qué arquitecto modernista barcelonés diseñó el Hospital de Sant Pau?',
 '["Gaudí","Domènech i Montaner","Puig i Cadafalch","Cadafalch"]', 1,
 'Lluís Domènech i Montaner diseñó el Hospital de Sant Pau de Barcelona (1902-1930). Es Patrimonio de la Humanidad.',
 'hard'),

('arte', '¿Qué movimiento literario y artístico francés rechazó las normas en 1916?',
 '["Surrealismo","Dadaísmo","Cubismo","Futurismo"]', 1,
 'El Dadaísmo nació en 1916 en el Cabaret Voltaire de Zúrich. Rechazó lógica, razón y estética burguesa.',
 'medium'),

('arte', '¿Quién creó la "Fuente" (urinario) de 1917?',
 '["Picasso","Duchamp","Magritte","Dalí"]', 1,
 'Marcel Duchamp presentó "Fountain" (un urinario firmado "R. Mutt") como obra de arte en 1917, cuestionando la noción misma de arte.',
 'medium'),

('arte', '¿Qué artista chino-estadounidense diseñó el Memorial a Veteranos de Vietnam?',
 '["Maya Lin","I.M. Pei","Frank Lloyd Wright","Calatrava"]', 0,
 'Maya Lin diseñó el Memorial a los Veteranos de Vietnam en Washington (1982), siendo aún estudiante.',
 'hard'),

('arte', '¿Qué arquitecto chino-estadounidense diseñó la pirámide del Louvre?',
 '["Pei","Calatrava","Gehry","Foster"]', 0,
 'I.M. Pei (Ieoh Ming Pei) diseñó la famosa pirámide de cristal del Louvre, inaugurada en 1989.',
 'medium'),

('arte', '¿Qué pintor italiano renacentista pintó "Primavera"?',
 '["Botticelli","Tiziano","Ghirlandaio","Lippi"]', 0,
 '"La Primavera" (~1482) de Sandro Botticelli se exhibe en la Galería Uffizi de Florencia.',
 'medium'),

('arte', '¿Quién esculpió "Davide" en bronce (s. XV, antes que el de Miguel Ángel)?',
 '["Verrocchio","Donatello","Ghiberti","Pollaiolo"]', 1,
 'Donatello realizó su famoso "David" en bronce hacia 1440. Fue el primer desnudo monumental desde la antigüedad clásica.',
 'hard'),

('arte', '¿Qué pintor neerlandés del s. XV pintó "El descendimiento" (Prado)?',
 '["Van Eyck","Memling","Van der Weyden","Brueghel"]', 2,
 'Rogier van der Weyden pintó "El descendimiento de la cruz" (~1435), obra cumbre del Prado y del primitivo flamenco.',
 'hard'),

('arte', '¿Quién pintó la "Capilla Brancacci" en Florencia?',
 '["Masaccio","Botticelli","Ghirlandaio","Fra Angelico"]', 0,
 'Masaccio pintó los frescos de la Capilla Brancacci hacia 1425, hito del Renacimiento florentino temprano.',
 'hard'),

('arte', '¿En qué ciudad está el museo Guggenheim diseñado por Wright?',
 '["Bilbao","Nueva York","Venecia","Berlín"]', 1,
 'El Guggenheim de Nueva York, diseñado por Frank Lloyd Wright, abrió en 1959 con su característica espiral interior.',
 'medium'),

('arte', '¿Qué arquitecto canadiense-estadounidense diseñó el Guggenheim de Bilbao?',
 '["Frank Lloyd Wright","Frank Gehry","Norman Foster","Calatrava"]', 1,
 'Frank Gehry diseñó el Guggenheim de Bilbao, inaugurado en 1997. Su forma de titanio revolucionó la arquitectura.',
 'medium'),

('arte', '¿Quién es el autor de la "Sinfonía Italiana"?',
 '["Beethoven","Mendelssohn","Brahms","Mozart"]', 1,
 'Felix Mendelssohn compuso su 4.ª Sinfonía ("Italiana") en 1833 tras un viaje por Italia.',
 'hard'),

('arte', '¿Qué fotógrafo es famoso por sus paisajes en blanco y negro del oeste de EE.UU.?',
 '["Ansel Adams","Cartier-Bresson","Capa","Avedon"]', 0,
 'Ansel Adams (1902-1984) capturó icónicos paisajes del Parque Nacional de Yosemite y otros lugares del oeste americano.',
 'hard'),

('arte', '¿Quién es considerado padre de la fotografía moderna en color?',
 '["Stieglitz","Eggleston","Adams","Cartier-Bresson"]', 1,
 'William Eggleston elevó el uso del color en fotografía artística con su exposición pionera en el MoMA en 1976.',
 'hard'),

('arte', '¿En qué año se construyó la Torre Eiffel?',
 '["1875","1889","1900","1925"]', 1,
 'La Torre Eiffel fue inaugurada en 1889 con motivo de la Exposición Universal de París. Diseñada por Gustave Eiffel.',
 'medium'),

('arte', '¿Quién es el autor de la Estatua de la Libertad?',
 '["Rodin","Bartholdi","Eiffel","Brancusi"]', 1,
 'Frédéric Auguste Bartholdi esculpió la Estatua de la Libertad. La estructura interna fue de Gustave Eiffel. Regalo de Francia a EE.UU. (1886).',
 'medium'),

('arte', '¿Quién pintó "American Gothic" (1930)?',
 '["Hopper","Grant Wood","Pollock","Whistler"]', 1,
 'Grant Wood pintó "American Gothic" en 1930. Representa a un granjero y a su hija frente a una casa de Iowa.',
 'hard'),

('arte', '¿Qué pintor estadounidense es famoso por "Nighthawks" (1942)?',
 '["Hopper","Wyeth","Pollock","O''Keeffe"]', 0,
 'Edward Hopper pintó "Nighthawks" (Halcones de la noche) en 1942, icono de la soledad urbana americana.',
 'medium'),

('arte', '¿Qué pintora mexicana se autorretrató con flores en el pelo?',
 '["María Izquierdo","Frida Kahlo","Tamara de Lempicka","Leonora Carrington"]', 1,
 'Frida Kahlo (1907-1954) pintó numerosos autorretratos en los que mezclaba elementos surrealistas, indígenas y personales.',
 'easy'),

('arte', '¿Quién pintó "Las dos Fridas"?',
 '["Diego Rivera","Frida Kahlo","Remedios Varo","Leonora Carrington"]', 1,
 '"Las dos Fridas" (1939) de Frida Kahlo representa una doble imagen de la artista tras su divorcio de Diego Rivera.',
 'medium'),

('arte', '¿Quién pintó "Las señoritas de Avignon" (1907)?',
 '["Braque","Picasso","Léger","Gris"]', 1,
 '"Les Demoiselles d''Avignon" de Picasso (1907) marcó el inicio del cubismo. Está en el MoMA de Nueva York.',
 'medium'),

('arte', '¿Qué movimiento artístico fundó André Breton en 1924?',
 '["Cubismo","Dadaísmo","Surrealismo","Futurismo"]', 2,
 'André Breton publicó el "Manifiesto del Surrealismo" en 1924, fundando este movimiento ligado al inconsciente y los sueños.',
 'medium'),

('arte', '¿Qué pintor surrealista catalán protagonizó "Un perro andaluz" con Buñuel?',
 '["Joan Miró","Salvador Dalí","Pablo Picasso","Antoni Tàpies"]', 1,
 'Salvador Dalí colaboró con Luis Buñuel en "Un perro andaluz" (1929) y "La edad de oro" (1930).',
 'medium'),

('arte', '¿Quién pintó "La gran ola" (xilografía japonesa)?',
 '["Hokusai","Hiroshige","Utamaro","Ogata Kōrin"]', 0,
 '"La gran ola de Kanagawa" (~1831) es una xilografía de Katsushika Hokusai, parte de la serie "36 vistas del monte Fuji".',
 'medium'),

('arte', '¿Quién pintó "El caballero de la mano en el pecho"?',
 '["Velázquez","El Greco","Tiziano","Rivera"]', 1,
 'El Greco pintó "El caballero de la mano en el pecho" (~1580). Está en el Museo del Prado.',
 'hard'),

('arte', '¿Qué pintor flamenco-alemán pintó "Cristo en la cruz" con dos paneles?',
 '["Van Eyck","Grünewald","Bosch","Cranach"]', 1,
 'Matthias Grünewald pintó el "Retablo de Issenheim" (1512-1516), una obra cumbre del gótico tardío con dramáticos Cristo en la cruz.',
 'hard'),

('arte', '¿Qué arquitecto italiano renacentista escribió "Los cuatro libros de arquitectura"?',
 '["Alberti","Bramante","Palladio","Vasari"]', 2,
 'Andrea Palladio publicó "I quattro libri dell''architettura" en 1570. Influyó en la arquitectura clásica de los siglos posteriores.',
 'hard'),

('arte', '¿Qué pintor barroco español pintó vírgenes de inmaculadas?',
 '["Velázquez","Murillo","Zurbarán","Ribera"]', 1,
 'Bartolomé Esteban Murillo (1617-1682) pintó numerosas "Inmaculadas" muy populares en la España barroca.',
 'medium'),

('arte', '¿Quién pintó "El sueño de la razón produce monstruos"?',
 '["Velázquez","Goya","Sorolla","Murillo"]', 1,
 'Goya grabó "El sueño de la razón produce monstruos" como parte de "Los caprichos" (1797-1799).',
 'medium'),

('arte', '¿Qué arquitecto italiano diseñó la Plaza del Capitolio en Roma?',
 '["Bramante","Bernini","Miguel Ángel","Vignola"]', 2,
 'Miguel Ángel rediseñó la Plaza del Capitolio (Piazza del Campidoglio) en Roma a partir de 1538.',
 'hard'),

('arte', '¿Qué obra musical compuso Vivaldi en 1725?',
 '["Las cuatro estaciones","El Mesías","Réquiem","Don Giovanni"]', 0,
 'Antonio Vivaldi compuso "Le quattro stagioni" (Las cuatro estaciones) en torno a 1718-1720, publicadas en Ámsterdam en 1725.',
 'easy'),

('arte', '¿Quién pintó "La balsa de la Medusa"?',
 '["Géricault","Delacroix","Ingres","David"]', 0,
 'Théodore Géricault pintó "La balsa de la Medusa" (1818-1819) tras el naufragio del Méduse. Está en el Louvre.',
 'hard'),

('arte', '¿Qué pintor renacentista alemán pintó "El caballero, la muerte y el diablo"?',
 '["Cranach","Dürer","Holbein","Altdorfer"]', 1,
 'Alberto Durero (Albrecht Dürer) realizó este grabado en 1513. Es una de sus tres "Estampas Magistrales".',
 'hard'),

('arte', '¿Quién pintó "Niña con globo" en las paredes de Londres?',
 '["JR","Banksy","Shepard Fairey","Os Gêmeos"]', 1,
 'Banksy, artista urbano anónimo británico, creó "Niña con globo" en 2002, una de sus obras más icónicas.',
 'medium'),

('arte', '¿Qué arquitecto valenciano diseñó la Ciudad de las Artes y las Ciencias?',
 '["Calatrava","Foster","Moneo","Mansilla"]', 0,
 'Santiago Calatrava diseñó la Ciudad de las Artes y las Ciencias de Valencia (1998-2009).',
 'medium'),

('arte', '¿Qué pintor barroco neerlandés realizó muchos autorretratos?',
 '["Vermeer","Hals","Rembrandt","Brueghel"]', 2,
 'Rembrandt van Rijn pintó más de 80 autorretratos a lo largo de su vida, documentando su evolución física y artística.',
 'medium'),

('arte', '¿Qué arquitecta iraní-británica diseñó el Centro Heydar Aliyev de Bakú?',
 '["Zaha Hadid","Kazuyo Sejima","Lina Bo Bardi","Lacaton"]', 0,
 'Zaha Hadid (1950-2016) fue la primera mujer en ganar el Premio Pritzker (2004). Diseñó edificios fluidos y dinámicos.',
 'hard'),

('arte', '¿Qué movimiento artístico estuvo asociado a las máquinas y la velocidad?',
 '["Cubismo","Futurismo","Dadaísmo","Surrealismo"]', 1,
 'El futurismo italiano, fundado por Marinetti en 1909, exaltaba la modernidad, la máquina y la velocidad.',
 'medium'),

('arte', '¿Qué arquitecto suizo dirigió la reconstrucción del Reichstag de Berlín?',
 '["Foster","Calatrava","Piano","Nouvel"]', 0,
 'Norman Foster (británico) diseñó la cúpula transparente del Reichstag en 1999 tras la reunificación alemana.',
 'hard'),

('arte', '¿Quién pintó "Las dos Tahitianas" (1899)?',
 '["Cézanne","Gauguin","Van Gogh","Bonnard"]', 1,
 'Paul Gauguin pintó numerosas obras durante su estancia en Tahití. "Dos tahitianas" (1899) está en el Met de Nueva York.',
 'hard'),

('arte', '¿Quién esculpió "Cristo Redentor" en Río de Janeiro?',
 '["Brecheret","Landowski","Niemeyer","Costa"]', 1,
 'Paul Landowski esculpió el Cristo Redentor del Corcovado, inaugurado en 1931. Ingeniero principal: Heitor da Silva Costa.',
 'hard'),

('arte', '¿Qué pintora francesa impresionista pintó cuadros de bañistas (s. XIX)?',
 '["Mary Cassatt","Berthe Morisot","Marie Bracquemond","Eva Gonzalès"]', 1,
 'Berthe Morisot fue una de las pocas mujeres del núcleo impresionista. Su obra retrata la vida íntima y femenina.',
 'hard'),

('arte', '¿Qué pintor postimpresionista cortó con Gauguin tras una pelea?',
 '["Cézanne","Van Gogh","Toulouse-Lautrec","Renoir"]', 1,
 'Van Gogh y Gauguin convivieron en Arlés en 1888. La relación terminó con el episodio de la oreja cortada de Van Gogh.',
 'medium'),

('arte', '¿Quién pintó "Bañistas en Asnières" (1884)?',
 '["Seurat","Signac","Pissarro","Cézanne"]', 0,
 'Georges Seurat fundó el puntillismo. "Bañistas en Asnières" (1884) y "Un domingo en la Grande Jatte" (1886) son sus obras maestras.',
 'hard'),

('arte', '¿Qué arquitecto modernista barcelonés diseñó el Palau de la Música Catalana?',
 '["Gaudí","Domènech i Montaner","Puig i Cadafalch","Sert"]', 1,
 'Lluís Domènech i Montaner diseñó el Palau de la Música Catalana (1905-1908), Patrimonio de la Humanidad.',
 'hard'),

('arte', '¿Qué autor escribió "El Decamerón"?',
 '["Petrarca","Boccaccio","Dante","Maquiavelo"]', 1,
 'Giovanni Boccaccio escribió "Il Decameron" (1351-1353), colección de 100 cuentos contados por jóvenes que huyen de la peste.',
 'medium'),

('arte', '¿Qué obra renacentista escribió Petrarca?',
 '["Decamerón","Cancionero","Divina Comedia","Orlando furioso"]', 1,
 'Petrarca escribió el "Cancionero" (Canzoniere), 366 poemas dedicados en gran parte a su amada Laura.',
 'hard'),

('arte', '¿Quién es autor del "Orlando furioso"?',
 '["Tasso","Ariosto","Boccaccio","Maquiavelo"]', 1,
 'Ludovico Ariosto publicó "Orlando furioso" en 1516. Un poema épico-caballeresco del Renacimiento italiano.',
 'hard'),

('arte', '¿Qué pintor americano pintó "Christina''s World" (1948)?',
 '["Hopper","Wyeth","O''Keeffe","Rockwell"]', 1,
 'Andrew Wyeth pintó "Christina''s World" (1948), uno de los iconos del realismo estadounidense del s. XX.',
 'hard'),

('arte', '¿Quién pintó "Marilyn Monroe" en serigrafía pop?',
 '["Lichtenstein","Warhol","Rauschenberg","Johns"]', 1,
 'Andy Warhol creó la serie "Marilyn" en 1962, poco después de la muerte de la actriz, reproduciendo su imagen en colores vivos.',
 'easy');

-- ══════════════════════════════════════════════════════════════
-- FILOSOFIA (+100)
-- ══════════════════════════════════════════════════════════════

insert into public.questions (category, question, options, answer_index, context, difficulty) values

('filosofia', '¿Quién fue maestro de Alejandro Magno?',
 '["Sócrates","Platón","Aristóteles","Diógenes"]', 2,
 'Aristóteles fue tutor de Alejandro Magno entre 343 y 340 a.C., a petición de Filipo II de Macedonia.',
 'medium'),

('filosofia', '¿Qué filósofo griego vivía en un tonel?',
 '["Heráclito","Diógenes","Epicuro","Zenón"]', 1,
 'Diógenes de Sinope, el cínico, vivía en una tinaja (no exactamente un tonel) en Atenas. Despreciaba las convenciones sociales.',
 'medium'),

('filosofia', '¿Qué corriente filosófica fundó Zenón de Citio en el s. IV-III a.C.?',
 '["Epicureísmo","Estoicismo","Escepticismo","Cinismo"]', 1,
 'Zenón de Citio fundó el estoicismo en Atenas hacia el 300 a.C. Enseñaba en la Stoa Poikile (pórtico pintado).',
 'medium'),

('filosofia', '¿Qué obra escribió Boecio en prisión?',
 '["La consolación de la filosofía","Las confesiones","La República","La Política"]', 0,
 'Boecio escribió "La consolación de la filosofía" hacia 524 d.C., antes de ser ejecutado por orden de Teodorico.',
 'hard'),

('filosofia', '¿Qué filósofo francés escribió el "Discurso del método"?',
 '["Pascal","Descartes","Voltaire","Diderot"]', 1,
 'René Descartes publicó el "Discurso del método" en 1637. Fundamento del racionalismo moderno.',
 'medium'),

('filosofia', '¿A qué corriente pertenece John Locke?',
 '["Racionalismo","Empirismo","Idealismo","Existencialismo"]', 1,
 'John Locke fue uno de los grandes representantes del empirismo británico junto con Berkeley y Hume.',
 'medium'),

('filosofia', '¿Qué obra escribió Locke en 1689?',
 '["Ensayo sobre el entendimiento humano","Crítica de la razón pura","Leviatán","Ética"]', 0,
 'John Locke publicó el "Ensayo sobre el entendimiento humano" en 1689. Defendía la tabula rasa al nacer.',
 'hard'),

('filosofia', '¿Quién escribió "Leviatán"?',
 '["Hobbes","Locke","Maquiavelo","Rousseau"]', 0,
 'Thomas Hobbes publicó "Leviatán" en 1651, defendiendo un poder soberano absoluto para evitar la "guerra de todos contra todos".',
 'medium'),

('filosofia', '¿Qué famosa frase resume el pensamiento de Hobbes sobre la naturaleza humana?',
 '["El hombre es bueno por naturaleza","El hombre es un lobo para el hombre","Solo sé que no sé nada","Cogito ergo sum"]', 1,
 '"Homo homini lupus" (el hombre es un lobo para el hombre) condensa la visión de Hobbes sobre el estado natural de violencia.',
 'medium'),

('filosofia', '¿Qué obra escribió David Hume en 1739-40?',
 '["Tratado de la naturaleza humana","Crítica del juicio","Discurso del método","La fenomenología"]', 0,
 'Hume publicó el "Tratado de la naturaleza humana" entre 1739 y 1740. Representa el empirismo escéptico más radical.',
 'hard'),

('filosofia', '¿Qué planteó Berkeley sobre la realidad?',
 '["Materialismo","Idealismo subjetivo","Dualismo","Empirismo estricto"]', 1,
 'George Berkeley defendió el idealismo subjetivo: "esse est percipi" (ser es ser percibido).',
 'hard'),

('filosofia', '¿Quién escribió "Más allá del bien y del mal"?',
 '["Nietzsche","Kant","Schopenhauer","Kierkegaard"]', 0,
 'Friedrich Nietzsche publicó "Más allá del bien y del mal" en 1886. Critica los fundamentos de la moral occidental.',
 'medium'),

('filosofia', '¿Qué filósofo escribió "El mundo como voluntad y representación"?',
 '["Kant","Hegel","Schopenhauer","Fichte"]', 2,
 'Arthur Schopenhauer publicó esta obra en 1819. Su filosofía pesimista influyó en Nietzsche y Wagner.',
 'hard'),

('filosofia', '¿Qué obra escribió Hegel en 1807?',
 '["Fenomenología del espíritu","Ciencia de la lógica","Filosofía del derecho","Lecciones de estética"]', 0,
 'Georg Wilhelm Friedrich Hegel publicó "Fenomenología del espíritu" en 1807. Es una obra clave del idealismo alemán.',
 'hard'),

('filosofia', '¿Qué obra escribió Kierkegaard en 1843?',
 '["Temor y temblor","O lo uno o lo otro","La enfermedad mortal","Las dos"]', 3,
 'Søren Kierkegaard publicó tanto "Temor y temblor" como "O lo uno o lo otro" en 1843. Considerado precursor del existencialismo.',
 'hard'),

('filosofia', '¿Quién es el padre del marxismo?',
 '["Marx","Engels","Lenin","Hegel"]', 0,
 'Karl Marx (1818-1883) desarrolló el materialismo histórico y dialéctico junto con Friedrich Engels.',
 'easy'),

('filosofia', '¿Qué obra coescribieron Marx y Engels en 1848?',
 '["El Capital","Manifiesto Comunista","Ideología alemana","Trabajo asalariado"]', 1,
 'Marx y Engels publicaron el "Manifiesto del Partido Comunista" en 1848, encargado por la Liga de los Comunistas.',
 'medium'),

('filosofia', '¿Qué filósofo escribió "El ser y el tiempo"?',
 '["Sartre","Heidegger","Husserl","Gadamer"]', 1,
 'Martin Heidegger publicó "Sein und Zeit" (El ser y el tiempo) en 1927. Obra fundamental de la filosofía contemporánea.',
 'hard'),

('filosofia', '¿Qué filósofo influyó en Heidegger desde la fenomenología?',
 '["Brentano","Husserl","Schopenhauer","Bergson"]', 1,
 'Edmund Husserl fue maestro y predecesor de Heidegger. Fundó la fenomenología, método filosófico clave del s. XX.',
 'hard'),

('filosofia', '¿Qué filósofo francés escribió "El mito de Sísifo"?',
 '["Sartre","Camus","Beauvoir","Foucault"]', 1,
 'Albert Camus publicó "El mito de Sísifo" en 1942. Ensayo sobre el absurdo de la existencia.',
 'medium'),

('filosofia', '¿Qué filósofa francesa escribió "El segundo sexo"?',
 '["Beauvoir","Weil","Arendt","Kristeva"]', 0,
 'Simone de Beauvoir publicó "El segundo sexo" en 1949. Obra fundamental del feminismo moderno: "No se nace mujer: se llega a serlo".',
 'medium'),

('filosofia', '¿Quién dijo "El infierno son los otros"?',
 '["Camus","Sartre","Beauvoir","Heidegger"]', 1,
 'Jean-Paul Sartre escribió "El infierno son los otros" en "A puerta cerrada" (1944).',
 'medium'),

('filosofia', '¿Qué filósofa alemana-judía escribió sobre la "banalidad del mal"?',
 '["Edith Stein","Hannah Arendt","Simone Weil","Rosa Luxemburgo"]', 1,
 'Hannah Arendt acuñó la expresión "banalidad del mal" en "Eichmann en Jerusalén" (1963), tras presenciar el juicio al jerarca nazi.',
 'hard'),

('filosofia', '¿Qué pensador alemán escribió sobre el "ocaso de los ídolos"?',
 '["Hegel","Nietzsche","Schopenhauer","Marx"]', 1,
 'Nietzsche publicó "El ocaso de los ídolos" (Götzen-Dämmerung) en 1889.',
 'hard'),

('filosofia', '¿Qué pensaba Hume sobre la causalidad?',
 '["Es necesaria","Es solo hábito psicológico","Es divina","Es matemática"]', 1,
 'Hume sostuvo que la causalidad es un hábito mental: observamos sucesión constante de eventos, pero no una conexión necesaria.',
 'hard'),

('filosofia', '¿Qué planteó Karl Popper como criterio de cientificidad?',
 '["Verificabilidad","Falsabilidad","Coherencia","Consenso"]', 1,
 'Karl Popper propuso la falsabilidad como criterio de demarcación entre ciencia y pseudociencia.',
 'hard'),

('filosofia', '¿Qué filósofo de la ciencia escribió sobre "paradigmas" y revoluciones científicas?',
 '["Popper","Kuhn","Lakatos","Feyerabend"]', 1,
 'Thomas Kuhn publicó "La estructura de las revoluciones científicas" en 1962, introduciendo el concepto de "paradigma".',
 'hard'),

('filosofia', '¿Qué obra escribió Maquiavelo en 1513?',
 '["El príncipe","Discursos","La mandrágora","Historia florentina"]', 0,
 'Nicolás Maquiavelo escribió "El príncipe" en 1513. Tratado realista sobre el poder político.',
 'medium'),

('filosofia', '¿Qué filósofo del Renacimiento defendió que "el fin justifica los medios"?',
 '["Erasmo","Maquiavelo","Moro","Bacon"]', 1,
 'Esta máxima suele atribuirse a Maquiavelo, aunque la formulación literal no aparece exactamente en sus obras.',
 'medium'),

('filosofia', '¿Qué obra escribió Tomás Moro en 1516?',
 '["Utopía","Erasmo","La ciudad del sol","Nueva Atlántida"]', 0,
 'Tomás Moro publicó "Utopía" en 1516. Describe una isla imaginaria con una sociedad ideal.',
 'medium'),

('filosofia', '¿Quién dijo "Sapere aude" (atrévete a saber)?',
 '["Voltaire","Kant","Diderot","Lessing"]', 1,
 'Kant popularizó "Sapere aude" como lema de la Ilustración en su ensayo "¿Qué es la Ilustración?" (1784).',
 'hard'),

('filosofia', '¿Qué filósofo griego se decía "filósofo del fuego"?',
 '["Tales","Anaxímenes","Heráclito","Empédocles"]', 2,
 'Heráclito de Éfeso (s. VI a.C.) propuso el fuego como principio primero. Famoso por "todo fluye" (panta rhei).',
 'hard'),

('filosofia', '¿Qué filósofo presocrático dijo "Todo está lleno de dioses"?',
 '["Tales de Mileto","Anaxímenes","Anaximandro","Heráclito"]', 0,
 'Tales de Mileto, primer filósofo según la tradición, sostenía que todo era agua y que el cosmos estaba animado.',
 'hard'),

('filosofia', '¿Qué filósofo dijo "todo fluye, nada permanece"?',
 '["Parménides","Heráclito","Demócrito","Anaxágoras"]', 1,
 'Heráclito defendía el cambio permanente: "no se puede bañar dos veces en el mismo río".',
 'medium'),

('filosofia', '¿Qué filósofo se opuso a Heráclito defendiendo la unidad del ser?',
 '["Demócrito","Empédocles","Parménides","Anaxágoras"]', 2,
 'Parménides de Elea sostenía que el ser es uno, inmóvil y eterno. El cambio es ilusorio.',
 'hard'),

('filosofia', '¿Qué filósofos griegos defendieron el atomismo?',
 '["Sócrates y Platón","Leucipo y Demócrito","Tales y Anaxímenes","Pitágoras y Aristóteles"]', 1,
 'Leucipo y Demócrito (s. V a.C.) propusieron que la realidad estaba formada por átomos indivisibles que se movían en el vacío.',
 'medium'),

('filosofia', '¿Qué obra escribió Spinoza publicada póstumamente en 1677?',
 '["Tratado teológico-político","Ética","Tratado breve","Principios"]', 1,
 'Baruch Spinoza escribió la "Ética demostrada según el orden geométrico", publicada en 1677 tras su muerte.',
 'hard'),

('filosofia', '¿Cuál es la idea central de Spinoza sobre Dios?',
 '["Dios trascendente","Dios y naturaleza son lo mismo","Dios no existe","Politeísmo"]', 1,
 'Spinoza identificaba a Dios con la Naturaleza ("Deus sive Natura"), defendiendo un panteísmo.',
 'hard'),

('filosofia', '¿Qué filósofo alemán es famoso por su "Monadología"?',
 '["Leibniz","Wolff","Kant","Fichte"]', 0,
 'Gottfried Wilhelm Leibniz expuso su teoría de las mónadas en "La monadología" (1714). Sustancias simples espirituales.',
 'hard'),

('filosofia', '¿Quién es el principal filósofo del pragmatismo norteamericano?',
 '["Dewey","James","Peirce","Los tres"]', 3,
 'Charles S. Peirce, William James y John Dewey son los principales representantes del pragmatismo norteamericano.',
 'hard'),

('filosofia', '¿Quién es Ludwig Wittgenstein?',
 '["Filósofo del lenguaje","Físico","Matemático","Político"]', 0,
 'Wittgenstein (1889-1951) revolucionó la filosofía del lenguaje con el "Tractatus" y las "Investigaciones filosóficas".',
 'medium'),

('filosofia', '¿Cuál es la última frase del "Tractatus" de Wittgenstein?',
 '["El mundo es todo lo que es","De lo que no se puede hablar mejor es callar","Pienso luego existo","Hay que cultivar nuestro jardín"]', 1,
 'La proposición 7 del "Tractatus" (1921) dice: "De lo que no se puede hablar hay que callar".',
 'hard'),

('filosofia', '¿Qué filósofo francés escribió "Vigilar y castigar"?',
 '["Sartre","Foucault","Derrida","Deleuze"]', 1,
 'Michel Foucault publicó "Vigilar y castigar" en 1975, sobre la historia del castigo y las técnicas modernas de poder.',
 'hard'),

('filosofia', '¿Qué corriente fundó Jacques Derrida?',
 '["Estructuralismo","Posestructuralismo / Deconstrucción","Existencialismo","Fenomenología"]', 1,
 'Derrida (1930-2004) inició la "deconstrucción", crítica a las jerarquías ocultas en los textos filosóficos.',
 'hard'),

('filosofia', '¿Quién es el padre del estructuralismo?',
 '["Lévi-Strauss","Saussure","Lacan","Barthes"]', 0,
 'Claude Lévi-Strauss aplicó el estructuralismo a la antropología. Saussure lo había desarrollado antes en lingüística.',
 'hard'),

('filosofia', '¿Qué obra es la base del estructuralismo lingüístico?',
 '["Curso de lingüística general","Estructuras","Lenguaje y mito","Curso elemental"]', 0,
 'El "Curso de lingüística general" (1916) de Ferdinand de Saussure, publicado por sus alumnos, fundó el estructuralismo.',
 'hard'),

('filosofia', '¿Qué filósofo francés escribió "Lo simbólico, lo imaginario y lo real"?',
 '["Lacan","Derrida","Foucault","Barthes"]', 0,
 'Jacques Lacan, psicoanalista francés, propuso la triada simbólico-imaginario-real para describir la psique humana.',
 'hard'),

('filosofia', '¿Quién es Habermas?',
 '["Filósofo alemán de la Escuela de Frankfurt","Físico","Político austriaco","Matemático"]', 0,
 'Jürgen Habermas (1929-) es uno de los filósofos vivos más influyentes, asociado a la Escuela de Frankfurt. Teoría de la acción comunicativa.',
 'hard'),

('filosofia', '¿Qué filósofos formaron la primera generación de la Escuela de Frankfurt?',
 '["Adorno y Horkheimer","Lyotard y Baudrillard","Habermas y Apel","Negri y Hardt"]', 0,
 'Theodor Adorno y Max Horkheimer son los principales representantes de la primera generación de la Teoría Crítica.',
 'hard'),

('filosofia', '¿Qué obra coescribieron Adorno y Horkheimer?',
 '["Dialéctica de la Ilustración","Minima moralia","Eros y civilización","Crítica de la economía"]', 0,
 '"Dialéctica de la Ilustración" (1944) de Adorno y Horkheimer es uno de los textos cumbre de la Teoría Crítica.',
 'hard'),

('filosofia', '¿Qué corriente fundó Sigmund Freud?',
 '["Psicoanálisis","Conductismo","Cognitivismo","Humanismo"]', 0,
 'Sigmund Freud (1856-1939) fundó el psicoanálisis a finales del s. XIX. "La interpretación de los sueños" (1900) es su obra central.',
 'easy'),

('filosofia', '¿Quién es C.G. Jung?',
 '["Psiquiatra suizo, discípulo de Freud","Filósofo alemán","Físico","Matemático"]', 0,
 'Carl Gustav Jung (1875-1961) fundó la psicología analítica. Introdujo conceptos como arquetipos, inconsciente colectivo y sombra.',
 'medium'),

('filosofia', '¿Qué filósofo griego escribió "Ética a Nicómaco"?',
 '["Platón","Aristóteles","Sócrates","Epicuro"]', 1,
 'Aristóteles escribió la "Ética a Nicómaco" dedicada a su hijo. Es el principal tratado ético del pensamiento griego.',
 'medium'),

('filosofia', '¿Qué virtud aristotélica describe el "justo medio"?',
 '["La templanza","La prudencia","Cada virtud es un justo medio","Solo la valentía"]', 2,
 'Aristóteles definió cada virtud ética como un justo medio entre dos extremos viciosos (p. ej., valor entre cobardía y temeridad).',
 'hard'),

('filosofia', '¿Quién es Tomás de Aquino?',
 '["Filósofo y teólogo escolástico","Místico","Papa","Rey"]', 0,
 'Tomás de Aquino (1225-1274), dominico, fusionó el aristotelismo con la teología cristiana en su "Summa Theologiae".',
 'medium'),

('filosofia', '¿Cuántas pruebas de la existencia de Dios ofreció Tomás de Aquino?',
 '["3","4","5","7"]', 2,
 'Las "cinco vías" tomistas (motor, causa, contingencia, grados de perfección y orden) intentan demostrar la existencia de Dios.',
 'hard'),

('filosofia', '¿Qué filósofo es famoso por la "apuesta" sobre la existencia de Dios?',
 '["Descartes","Pascal","Leibniz","Spinoza"]', 1,
 'Blaise Pascal formuló su famosa "apuesta": apostar por la existencia de Dios es la opción racionalmente más ventajosa.',
 'medium'),

('filosofia', '¿Qué obra escribió Voltaire en 1759?',
 '["Cándido","Cartas filosóficas","Diccionario filosófico","Zadig"]', 0,
 'Voltaire publicó "Cándido o el optimismo" en 1759, parodia satírica del optimismo leibniziano.',
 'medium'),

('filosofia', '¿Qué filósofo ilustrado defendió la separación de poderes?',
 '["Voltaire","Rousseau","Montesquieu","Diderot"]', 2,
 'Montesquieu defendió la separación de poderes en "El espíritu de las leyes" (1748). Inspiró a las constituciones modernas.',
 'medium'),

('filosofia', '¿Qué famoso pensador estadounidense escribió "Walden"?',
 '["Emerson","Thoreau","Whitman","James"]', 1,
 'Henry David Thoreau escribió "Walden" (1854) tras vivir dos años en una cabaña junto a la laguna de Walden.',
 'hard'),

('filosofia', '¿Qué movimiento literario-filosófico fundó Emerson en EE.UU.?',
 '["Trascendentalismo","Pragmatismo","Positivismo","Naturalismo"]', 0,
 'Ralph Waldo Emerson lideró el Trascendentalismo en Nueva Inglaterra a partir de los años 1830.',
 'hard'),

('filosofia', '¿Quién es Henri Bergson?',
 '["Filósofo francés del s. XX","Sociólogo alemán","Físico inglés","Matemático ruso"]', 0,
 'Bergson (1859-1941) propuso conceptos como "duración", "élan vital" e "intuición". Nobel de Literatura 1927.',
 'hard'),

('filosofia', '¿Qué pensador propuso el "panta rhei"?',
 '["Tales","Heráclito","Parménides","Demócrito"]', 1,
 '"Panta rhei" (todo fluye) sintetiza la filosofía del cambio permanente de Heráclito.',
 'medium'),

('filosofia', '¿Quién escribió "El hombre rebelde"?',
 '["Sartre","Camus","Bataille","Cioran"]', 1,
 'Albert Camus publicó "El hombre rebelde" (L''homme révolté) en 1951.',
 'hard'),

('filosofia', '¿Qué corriente del s. XX cuestiona las "grandes narrativas"?',
 '["Modernismo","Posmodernismo","Idealismo","Realismo"]', 1,
 'Jean-François Lyotard definió la posmodernidad en 1979 como "incredulidad ante las metanarrativas".',
 'hard'),

('filosofia', '¿Qué filósofo francés escribió "La condición posmoderna" (1979)?',
 '["Baudrillard","Lyotard","Deleuze","Lipovetsky"]', 1,
 'Jean-François Lyotard publicó "La condición posmoderna" en 1979, popularizando el término "posmodernidad".',
 'hard'),

('filosofia', '¿Qué filósofo francés desarrolló el concepto de "simulacro"?',
 '["Lyotard","Baudrillard","Deleuze","Foucault"]', 1,
 'Jean Baudrillard desarrolló la teoría de la hiperrealidad y los simulacros en obras como "Cultura y simulacro" (1981).',
 'hard'),

('filosofia', '¿Quién es Mary Wollstonecraft?',
 '["Pionera feminista (s. XVIII)","Activista del s. XX","Escritora del s. XIX","Filósofa griega"]', 0,
 'Mary Wollstonecraft escribió "Vindicación de los derechos de la mujer" en 1792, obra clave del feminismo temprano.',
 'hard'),

('filosofia', '¿Qué pensador es famoso por estudiar el suicidio sociológicamente?',
 '["Weber","Durkheim","Marx","Simmel"]', 1,
 'Émile Durkheim publicó "El suicidio" en 1897, una de las primeras obras de sociología empírica moderna.',
 'hard'),

('filosofia', '¿Qué pensador escribió "La ética protestante y el espíritu del capitalismo"?',
 '["Marx","Weber","Durkheim","Sombart"]', 1,
 'Max Weber publicó este ensayo en 1904-1905, analizando la relación entre el protestantismo calvinista y el capitalismo moderno.',
 'hard'),

('filosofia', '¿Qué filósofo francés escribió "El antiedipo" con Guattari?',
 '["Deleuze","Foucault","Derrida","Lacan"]', 0,
 'Gilles Deleuze coescribió "El antiedipo" (1972) con Félix Guattari. Crítica radical al psicoanálisis y al capitalismo.',
 'hard'),

('filosofia', '¿Qué filósofo estadounidense escribió "Una teoría de la justicia" (1971)?',
 '["Nozick","Rawls","Sen","Walzer"]', 1,
 'John Rawls publicó "Una teoría de la justicia" en 1971. Introduce el "velo de la ignorancia" y los principios de justicia.',
 'hard'),

('filosofia', '¿Quién escribió "Anarquía, Estado y utopía" (1974)?',
 '["Rawls","Nozick","Rorty","Putnam"]', 1,
 'Robert Nozick replicó a Rawls en "Anarquía, Estado y utopía" (1974), defendiendo un Estado mínimo.',
 'hard'),

('filosofia', '¿Quién es el padre del personalismo cristiano contemporáneo?',
 '["Maritain","Mounier","Marcel","Levinas"]', 1,
 'Emmanuel Mounier fundó la revista Esprit y desarrolló el personalismo cristiano en los años 1930.',
 'hard'),

('filosofia', '¿Qué filósofo lituano-francés escribió "Totalidad e infinito"?',
 '["Levinas","Derrida","Sartre","Ricoeur"]', 0,
 'Emmanuel Levinas (1906-1995) publicó "Totalidad e infinito" en 1961. Defendió la ética como filosofía primera, basada en la alteridad.',
 'hard'),

('filosofia', '¿Qué filósofo escribió "Ser y tener" como contraste con "ser y tiempo"?',
 '["Gabriel Marcel","Heidegger","Sartre","Ricoeur"]', 0,
 'Gabriel Marcel publicó "Ser y tener" (1935), una obra del existencialismo cristiano francés.',
 'hard'),

('filosofia', '¿Quién es Paul Ricoeur?',
 '["Filósofo francés de la hermenéutica","Marxista","Físico","Político"]', 0,
 'Paul Ricoeur (1913-2005), filósofo francés, trabajó la hermenéutica, la memoria, la narrativa y la ética.',
 'hard'),

('filosofia', '¿Qué tradición filosófica representa Gadamer?',
 '["Filosofía analítica","Hermenéutica","Marxismo","Positivismo lógico"]', 1,
 'Hans-Georg Gadamer (1900-2002) renovó la hermenéutica filosófica con "Verdad y método" (1960).',
 'hard'),

('filosofia', '¿Qué filósofo dijo "estamos condenados a ser libres"?',
 '["Camus","Sartre","Heidegger","Merleau-Ponty"]', 1,
 'Jean-Paul Sartre escribió esto en "El existencialismo es un humanismo" (1946).',
 'medium'),

('filosofia', '¿Qué filósofo escribió "El existencialismo es un humanismo"?',
 '["Sartre","Camus","Marcel","Heidegger"]', 0,
 'Sartre dictó esta conferencia en 1945 (publicada en 1946) defendiendo el existencialismo como filosofía humanista.',
 'medium'),

('filosofia', '¿Qué filósofo árabe medieval escribió "La incoherencia de los filósofos"?',
 '["Avicena","Averroes","Algazel","Avempace"]', 2,
 'Algazel (al-Ghazali) escribió esta crítica contra los filósofos del s. XI. Averroes le respondió con "La incoherencia de la incoherencia".',
 'hard'),

('filosofia', '¿Quién es Avicena?',
 '["Filósofo persa-musulmán","Médico griego","Teólogo cristiano","Místico judío"]', 0,
 'Avicena (Ibn Sina, 980-1037) fue médico, filósofo y polímata persa. Su "Canon de medicina" se enseñó en Europa hasta el s. XVII.',
 'medium'),

('filosofia', '¿Qué filósofo judío-español medieval escribió "Guía de perplejos"?',
 '["Avicebrón","Maimónides","Crescas","Abrabanel"]', 1,
 'Moisés Maimónides (1138-1204), nacido en Córdoba, escribió la "Guía de perplejos" en árabe. Sintetiza la fe judía con la filosofía aristotélica.',
 'hard'),

('filosofia', '¿Qué obra escribió Tomás Moro en latín en 1516?',
 '["Utopía","Erasmo","Praefatio","Apología"]', 0,
 'Tomás Moro publicó "Utopía" en 1516, palabra que él mismo acuñó del griego ("no-lugar" o "buen-lugar").',
 'medium'),

('filosofia', '¿Quién escribió "El elogio de la locura"?',
 '["Erasmo","Moro","Lutero","Maquiavelo"]', 0,
 'Erasmo de Róterdam publicó "Stultitiae Laus" (Elogio de la locura) en 1511, sátira moral del humanismo cristiano.',
 'medium'),

('filosofia', '¿Qué filósofo griego dirigió la "Academia"?',
 '["Sócrates","Platón","Aristóteles","Epicuro"]', 1,
 'Platón fundó la Academia en Atenas (~387 a.C.). Funcionó hasta 529 d.C., cuando Justiniano cerró las escuelas filosóficas paganas.',
 'medium'),

('filosofia', '¿Qué escuela fundó Aristóteles en Atenas?',
 '["Liceo","Academia","Jardín","Stoa"]', 0,
 'Aristóteles fundó el Liceo en 335 a.C. Sus seguidores se llamaron "peripatéticos" porque enseñaba paseando.',
 'medium'),

('filosofia', '¿Qué escuela fundó Epicuro?',
 '["Liceo","Academia","Jardín","Stoa"]', 2,
 'Epicuro fundó el "Jardín" (Kepos) en Atenas (~306 a.C.), una comunidad filosófica donde se admitía a mujeres y esclavos.',
 'medium'),

('filosofia', '¿Quién es Lucrecio?',
 '["Poeta-filósofo epicúreo romano","Estoico griego","Médico bizantino","Cristiano"]', 0,
 'Lucrecio escribió "De rerum natura" (s. I a.C.), poema en verso que expone la filosofía atomista de Epicuro.',
 'hard'),

('filosofia', '¿Quién es Séneca?',
 '["Filósofo estoico romano","Sofista griego","Cínico medieval","Místico"]', 0,
 'Séneca (4 a.C.-65 d.C.), nacido en Córdoba, fue un destacado filósofo estoico, dramaturgo y consejero de Nerón.',
 'medium'),

('filosofia', '¿Qué emperador romano fue filósofo estoico?',
 '["Augusto","Marco Aurelio","Adriano","Trajano"]', 1,
 'Marco Aurelio (121-180 d.C.) escribió las "Meditaciones", una obra cumbre del estoicismo, en pleno reinado.',
 'medium'),

('filosofia', '¿Qué filósofo griego escribió "Manual" (Enquiridión)?',
 '["Séneca","Epicteto","Marco Aurelio","Crisipo"]', 1,
 'Epicteto, esclavo liberto, escribió el "Enquiridión" (Manual), compendio de la ética estoica. Influyó en Marco Aurelio.',
 'hard'),

('filosofia', '¿Cuál es la filosofía taoísta china?',
 '["Tao Te Ching","Analectas","Mencio","Sutra del corazón"]', 0,
 'El "Tao Te Ching", atribuido a Laozi (s. VI a.C.), es el texto fundacional del taoísmo. Aboga por la espontaneidad y el wu wei.',
 'medium'),

('filosofia', '¿Quién es Confucio?',
 '["Filósofo chino del s. VI-V a.C.","Profeta hindú","Sabio japonés","Rey persa"]', 0,
 'Kong Fuzi (Confucio, 551-479 a.C.) fundó una de las corrientes filosófico-éticas más influyentes de China. Su obra: las "Analectas".',
 'easy'),

('filosofia', '¿Qué texto sagrado del hinduismo trata sobre el deber (dharma)?',
 '["Vedas","Bhagavad Gita","Upanishads","Mahabharata"]', 1,
 'El Bhagavad Gita ("Canción del Bienaventurado") forma parte del Mahabharata. Diálogo entre Krishna y Arjuna sobre el deber.',
 'medium'),

('filosofia', '¿Cuál es la filosofía del Buda Siddhartha Gautama?',
 '["Búsqueda del placer","Las cuatro nobles verdades","La obediencia","La fuerza"]', 1,
 'El budismo se basa en las Cuatro Nobles Verdades sobre el sufrimiento y el Óctuple Sendero para superarlo.',
 'easy'),

('filosofia', '¿Qué corriente filosófica zen está vinculada al budismo japonés?',
 '["Tendai","Shingon","Zen","Pura Tierra"]', 2,
 'El zen, escuela budista japonesa (chan en chino), enfatiza la meditación y la iluminación súbita (satori).',
 'medium'),

('filosofia', '¿Qué corriente filosófica representa Nagarjuna?',
 '["Theravada","Madhyamaka","Yogachara","Tantra"]', 1,
 'Nagarjuna (~150-250 d.C.) fundó la escuela Madhyamaka del budismo mahayana, basada en la doctrina de la vacuidad (shunyata).',
 'hard'),

('filosofia', '¿Qué filósofo medieval escribió la "Ciudad de Dios"?',
 '["San Agustín","Boecio","Tomás de Aquino","Pseudo-Dionisio"]', 0,
 'San Agustín de Hipona escribió "De Civitate Dei" (413-426 d.C.) tras el saqueo de Roma por Alarico.',
 'medium'),

('filosofia', '¿Qué obra escribió el escolástico Anselmo de Canterbury sobre Dios?',
 '["Proslogion","Cur deus homo","Monologion","Todas"]', 3,
 'Anselmo de Canterbury escribió "Monologion", "Proslogion" (con el argumento ontológico) y "Cur deus homo" (sobre la encarnación).',
 'hard'),

('filosofia', '¿Quién es el "Doctor Sutilísimo" entre los escolásticos?',
 '["Duns Escoto","Ockham","Tomás de Aquino","Buenaventura"]', 0,
 'Juan Duns Escoto (1266-1308), llamado "Doctor Sutilísimo", fue franciscano y rival intelectual del tomismo.',
 'hard'),

('filosofia', '¿Quién formuló el principio de "navaja" en el s. XIV?',
 '["Tomás de Aquino","Guillermo de Ockham","Roger Bacon","Eckhart"]', 1,
 'Guillermo de Ockham (1287-1347) formuló el principio de parsimonia: "no multiplicar entes sin necesidad".',
 'medium'),

('filosofia', '¿Quién es Giordano Bruno?',
 '["Astrónomo y filósofo italiano","Místico","Papa","Político"]', 0,
 'Giordano Bruno (1548-1600), dominico italiano, defendió la infinitud del universo y fue quemado por la Inquisición.',
 'medium'),

('filosofia', '¿Qué corriente filosófica representa Augusto Comte?',
 '["Positivismo","Idealismo","Empirismo","Existencialismo"]', 0,
 'Auguste Comte (1798-1857) fundó el positivismo y acuñó el término "sociología".',
 'medium'),

('filosofia', '¿Qué obra de Marx-Engels expone el materialismo dialéctico?',
 '["El Capital","Anti-Dühring","Ideología alemana","Dialéctica de la naturaleza"]', 3,
 '"Dialéctica de la naturaleza" (1883), de Engels, explora aplicaciones del materialismo dialéctico a las ciencias.',
 'hard');

-- ══════════════════════════════════════════════════════════════
-- DEPORTES (+100)
-- ══════════════════════════════════════════════════════════════

insert into public.questions (category, question, options, answer_index, context, difficulty) values

('deportes', '¿Quién ganó el Balón de Oro 2023?',
 '["Mbappé","Messi","Haaland","Vinicius"]', 1,
 'Lionel Messi ganó su 8.º Balón de Oro en 2023, tras conquistar el Mundial de Qatar 2022 con Argentina.',
 'medium'),

('deportes', '¿Cuántos Balones de Oro tiene Cristiano Ronaldo?',
 '["4","5","6","7"]', 1,
 'Cristiano Ronaldo ha ganado 5 Balones de Oro (2008, 2013, 2014, 2016, 2017).',
 'medium'),

('deportes', '¿En qué año se celebró el primer Mundial de fútbol femenino?',
 '["1980","1991","1995","2003"]', 1,
 'El primer Mundial de fútbol femenino se celebró en China en 1991. Lo ganó Estados Unidos.',
 'medium'),

('deportes', '¿Qué selección ganó el Mundial femenino de fútbol 2023?',
 '["EE.UU.","España","Inglaterra","Suecia"]', 1,
 'España ganó el Mundial femenino 2023 disputado en Australia y Nueva Zelanda, venciendo a Inglaterra en la final (1-0).',
 'medium'),

('deportes', '¿En qué deporte destacó Tiger Woods?',
 '["Tenis","Golf","Béisbol","Hockey"]', 1,
 'Tiger Woods es uno de los mejores golfistas de la historia, con 15 grandes ganados.',
 'easy'),

('deportes', '¿Cuántos Grand Slams ganó Rafael Nadal en su carrera?',
 '["20","21","22","23"]', 2,
 'Rafa Nadal ganó 22 títulos de Grand Slam, 14 de ellos en Roland Garros, donde es el rey indiscutible.',
 'medium'),

('deportes', '¿En qué torneo es Nadal apodado "Rey de la Tierra"?',
 '["Wimbledon","US Open","Roland Garros","Australian Open"]', 2,
 'Rafa Nadal ha ganado Roland Garros 14 veces (2005-2022), un récord absoluto en un Grand Slam.',
 'easy'),

('deportes', '¿En qué superficie se juega Wimbledon?',
 '["Tierra","Cemento","Hierba","Moqueta"]', 2,
 'Wimbledon, el Grand Slam más antiguo (desde 1877), se juega sobre hierba en Londres.',
 'easy'),

('deportes', '¿Quién es la tenista con más Grand Slams en la era profesional?',
 '["Steffi Graf","Margaret Court","Serena Williams","Martina Navratilova"]', 1,
 'Margaret Court tiene 24 Grand Slams (algunos en la era amateur). Serena Williams suma 23 en la era abierta.',
 'hard'),

('deportes', '¿Cuántos Grand Slams ganó Serena Williams?',
 '["20","22","23","24"]', 2,
 'Serena Williams se retiró con 23 títulos de Grand Slam individuales en la era abierta.',
 'medium'),

('deportes', '¿En qué año debutaron los Juegos Paralímpicos?',
 '["1948","1960","1976","1988"]', 1,
 'Los primeros Juegos Paralímpicos oficiales se celebraron en Roma 1960, asociados a los JJ.OO.',
 'hard'),

('deportes', '¿Qué deporte se inventó en Canadá en 1875?',
 '["Hockey sobre hielo","Baloncesto","Lacrosse","Curling"]', 0,
 'El primer partido organizado de hockey sobre hielo se jugó en Montreal en 1875. Es el deporte nacional de Canadá en invierno.',
 'medium'),

('deportes', '¿Cuántos puntos vale un canasto desde el tiro libre en baloncesto?',
 '["1","2","3","4"]', 0,
 'Cada tiro libre encestado vale 1 punto. Los canastos de campo valen 2 o 3 según la distancia.',
 'easy'),

('deportes', '¿Qué jugador anotó 100 puntos en un partido de la NBA?',
 '["Michael Jordan","Wilt Chamberlain","Kobe Bryant","LeBron James"]', 1,
 'Wilt Chamberlain anotó 100 puntos para los Philadelphia Warriors el 2 de marzo de 1962. Récord histórico.',
 'hard'),

('deportes', '¿Quién es el máximo anotador histórico de la NBA?',
 '["Kareem Abdul-Jabbar","LeBron James","Karl Malone","Michael Jordan"]', 1,
 'LeBron James superó a Kareem Abdul-Jabbar en febrero de 2023 como máximo anotador histórico de la NBA.',
 'medium'),

('deportes', '¿Qué jugador ganó 6 anillos NBA con los Chicago Bulls?',
 '["LeBron James","Michael Jordan","Magic Johnson","Larry Bird"]', 1,
 'Michael Jordan ganó 6 anillos NBA con los Bulls (1991, 1992, 1993, 1996, 1997, 1998) y fue MVP de las Finales en todos.',
 'medium'),

('deportes', '¿En qué año se fundó la NBA?',
 '["1939","1946","1950","1954"]', 1,
 'La NBA se fundó como Basketball Association of America (BAA) en 1946. Adoptó el nombre actual en 1949.',
 'hard'),

('deportes', '¿Cuántos jugadores tiene un equipo de fútbol americano en cancha?',
 '["9","11","12","15"]', 1,
 'Cada equipo tiene 11 jugadores en cancha, ya sea atacando o defendiendo.',
 'medium'),

('deportes', '¿Qué quarterback ganó 7 Super Bowls?',
 '["Joe Montana","Tom Brady","Peyton Manning","Brett Favre"]', 1,
 'Tom Brady ganó 7 Super Bowls (6 con New England Patriots y 1 con Tampa Bay Buccaneers), récord absoluto.',
 'medium'),

('deportes', '¿En qué deporte se utiliza un "shuttlecock" (volante)?',
 '["Tenis","Bádminton","Pádel","Tenis de mesa"]', 1,
 'El volante o pluma se usa en el bádminton. Puede superar los 400 km/h en el smash.',
 'medium'),

('deportes', '¿Cuántos sets se juegan en el tenis femenino de Grand Slam?',
 '["Al mejor de 3","Al mejor de 5","Siempre 3","Al mejor de 7"]', 0,
 'En tenis femenino se juega al mejor de 3 sets, también en Grand Slams. En el masculino, al mejor de 5.',
 'medium'),

('deportes', '¿En qué año se introdujo el VAR en la Liga española?',
 '["2014","2018","2019","2021"]', 1,
 'El VAR (Video Assistant Referee) se implementó en LaLiga en la temporada 2018-2019.',
 'hard'),

('deportes', '¿En qué año ganó España su único Mundial de fútbol masculino?',
 '["2008","2010","2012","2014"]', 1,
 'España ganó el Mundial 2010 en Sudáfrica, venciendo a Países Bajos 1-0 en la final con gol de Andrés Iniesta.',
 'easy'),

('deportes', '¿Quién marcó el gol decisivo en la final del Mundial 2010?',
 '["Villa","Xavi","Iniesta","Pedro"]', 2,
 'Andrés Iniesta marcó el gol en la prórroga (minuto 116) en la final contra Países Bajos.',
 'medium'),

('deportes', '¿Qué selección ganó la Eurocopa 2024?',
 '["España","Inglaterra","Francia","Países Bajos"]', 0,
 'España ganó la Eurocopa 2024 en Alemania, su 4.ª, venciendo a Inglaterra 2-1 en la final.',
 'easy'),

('deportes', '¿En qué deporte destacó Magic Johnson?',
 '["Baloncesto","Béisbol","Fútbol americano","Hockey"]', 0,
 'Magic Johnson ganó 5 anillos NBA con Los Angeles Lakers en los años 80. Una de las leyendas del baloncesto.',
 'easy'),

('deportes', '¿Quién es Usain Bolt?',
 '["Velocista jamaicano","Saltador de longitud","Maratoniano","Decatleta"]', 0,
 'Usain Bolt posee los récords mundiales de 100 m (9,58 s) y 200 m (19,19 s). Ganó 8 oros olímpicos.',
 'easy'),

('deportes', '¿En qué deporte se gana al lograr una "checkmate"?',
 '["Damas","Backgammon","Ajedrez","Go"]', 2,
 'En ajedrez, el "jaque mate" (checkmate) significa que el rey está amenazado y no tiene escape posible.',
 'easy'),

('deportes', '¿Quién es el campeón mundial de ajedrez actual (2024)?',
 '["Magnus Carlsen","Ding Liren","Gukesh","Nepomniachtchi"]', 2,
 'D Gukesh, indio de 18 años, se convirtió en campeón mundial al vencer a Ding Liren en diciembre de 2024.',
 'hard'),

('deportes', '¿Qué noruego dominó el ajedrez mundial 2013-2023?',
 '["Magnus Carlsen","Nepomniachtchi","Ding","Caruana"]', 0,
 'Magnus Carlsen fue campeón del mundo de 2013 a 2023, cuando renunció al título por desinterés.',
 'medium'),

('deportes', '¿Qué deporte se practica en el Tour de Francia?',
 '["Atletismo","Ciclismo","Triatlón","Motociclismo"]', 1,
 'El Tour de Francia es la mayor carrera por etapas de ciclismo del mundo, disputada anualmente en julio desde 1903.',
 'easy'),

('deportes', '¿Quién ganó el Tour de Francia 5 veces (legalmente)?',
 '["Bernard Hinault","Eddy Merckx","Miguel Induráin","Todos"]', 3,
 'Hinault, Merckx, Anquetil e Induráin tienen 5 Tours cada uno. Armstrong fue desposeído por dopaje.',
 'hard'),

('deportes', '¿Cuántos Tours seguidos ganó Miguel Induráin?',
 '["3","4","5","6"]', 2,
 'Miguel Induráin ganó 5 Tours de Francia consecutivos (1991-1995), proeza única en la historia.',
 'medium'),

('deportes', '¿Qué piloto español ganó el Mundial de F1 en 2005 y 2006?',
 '["Carlos Sainz","Pedro de la Rosa","Fernando Alonso","Marc Gené"]', 2,
 'Fernando Alonso ganó dos títulos mundiales consecutivos con Renault (2005 y 2006).',
 'easy'),

('deportes', '¿Quién es el piloto con más títulos mundiales de F1?',
 '["Hamilton","Schumacher","Hamilton y Schumacher","Senna"]', 2,
 'Lewis Hamilton y Michael Schumacher comparten el récord con 7 títulos mundiales cada uno.',
 'medium'),

('deportes', '¿En qué circuito se celebra el Gran Premio de Mónaco?',
 '["Spa","Monte Carlo","Monza","Silverstone"]', 1,
 'El Gran Premio de Mónaco se celebra en el circuito callejero de Monte Carlo desde 1929. Es una de las "joyas" de la F1.',
 'medium'),

('deportes', '¿Qué piloto brasileño murió en Imola en 1994?',
 '["Senna","Piquet","Massa","Barrichello"]', 0,
 'Ayrton Senna falleció en un accidente en la curva Tamburello del circuito de Imola el 1 de mayo de 1994.',
 'medium'),

('deportes', '¿Qué deporte practica Marc Márquez?',
 '["F1","MotoGP","Rally","Ciclismo"]', 1,
 'Marc Márquez es 6 veces campeón del mundo de MotoGP (2013-2014, 2016-2019). Uno de los grandes pilotos de la historia.',
 'easy'),

('deportes', '¿Quién es Valentino Rossi?',
 '["Piloto italiano de MotoGP","Tenista","Esquiador","Ciclista"]', 0,
 'Valentino Rossi ganó 9 Mundiales de motociclismo (1997-2009), 7 de ellos en la categoría reina.',
 'medium'),

('deportes', '¿Cuántos km tiene una etapa media del Tour de Francia?',
 '["100 km","170 km","250 km","300 km"]', 1,
 'La media histórica ronda los 170-200 km por etapa. El Tour total suele tener unos 3.500 km.',
 'medium'),

('deportes', '¿Qué deporte practica Michael Phelps?',
 '["Atletismo","Natación","Buceo","Triatlón"]', 1,
 'Michael Phelps es el deportista olímpico más laureado, con 28 medallas (23 de oro) en natación.',
 'easy'),

('deportes', '¿En qué año se celebraron los JJ.OO. de Barcelona?',
 '["1988","1992","1996","2000"]', 1,
 'Los Juegos Olímpicos de Barcelona se celebraron del 25 de julio al 9 de agosto de 1992.',
 'easy'),

('deportes', '¿En qué año se celebraron los JJ.OO. de Tokio 2020?',
 '["2020","2021","2022","2024"]', 1,
 'Los JJ.OO. de Tokio 2020 se aplazaron por la pandemia y se celebraron en julio-agosto de 2021.',
 'medium'),

('deportes', '¿Qué país albergará los JJ.OO. de verano 2028?',
 '["Francia","Australia","EE.UU.","Japón"]', 2,
 'Los Juegos Olímpicos de Los Ángeles 2028 serán los terceros de EE.UU. en la ciudad (1932, 1984, 2028).',
 'medium'),

('deportes', '¿Qué ciudad acogió los JJ.OO. de 2024?',
 '["Tokio","París","Los Ángeles","Brisbane"]', 1,
 'París albergó los JJ.OO. de 2024, 100 años después de los de 1924. Ceremonia inaugural por el Sena.',
 'easy'),

('deportes', '¿Cuántos anillos forman el símbolo olímpico?',
 '["4","5","6","7"]', 1,
 'Los cinco anillos representan los cinco continentes participantes. Se usaron por primera vez en los JJ.OO. de Amberes 1920.',
 'easy'),

('deportes', '¿Qué color falta en los anillos olímpicos (azul, amarillo, negro, verde, ...)?',
 '["Naranja","Rojo","Morado","Marrón"]', 1,
 'Los cinco colores son azul, amarillo, negro, verde y rojo, sobre fondo blanco.',
 'medium'),

('deportes', '¿Cuántos jugadores forman un equipo de balonmano en cancha?',
 '["6","7","8","9"]', 1,
 'Cada equipo de balonmano juega con 7 jugadores (6 de campo + portero).',
 'medium'),

('deportes', '¿En qué deporte es leyenda Nikolai Valuev?',
 '["Boxeo","Lucha","MMA","Hockey"]', 0,
 'Nikolai Valuev, ruso de 2,13 m, fue campeón mundial de boxeo pesado WBA (2005-2009).',
 'hard'),

('deportes', '¿Quién es Muhammad Ali?',
 '["Tenista","Boxeador","Atleta","Pelotari"]', 1,
 'Muhammad Ali (1942-2016) es considerado uno de los mejores boxeadores de todos los tiempos. Tres veces campeón mundial.',
 'easy'),

('deportes', '¿Qué frase es famosa de Muhammad Ali?',
 '["Vencer o morir","Vuela como una mariposa, pica como una abeja","Just do it","Yes I can"]', 1,
 'Su frase emblemática era "Float like a butterfly, sting like a bee".',
 'medium'),

('deportes', '¿En qué deporte se compite por la Copa América?',
 '["Fútbol","Vela","Ambos","Béisbol"]', 2,
 'La Copa América es a la vez el torneo de fútbol de selecciones sudamericanas y la regata más antigua del mundo.',
 'medium'),

('deportes', '¿En qué deporte destacó Pau Gasol?',
 '["Fútbol","Baloncesto","Balonmano","Tenis"]', 1,
 'Pau Gasol ganó 2 anillos NBA con Los Angeles Lakers (2009, 2010) y un Mundial con España (2006).',
 'easy'),

('deportes', '¿Quién es Severiano Ballesteros?',
 '["Golfista español","Tenista","Tirador","Ajedrecista"]', 0,
 'Seve Ballesteros (1957-2011) ganó 5 majors de golf y fue pionero del golf europeo. Tres Open Británicos y dos Masters.',
 'medium'),

('deportes', '¿Qué selección dominó el rugby mundial con su "haka"?',
 '["Australia","Sudáfrica","Inglaterra","Nueva Zelanda"]', 3,
 'Los All Blacks de Nueva Zelanda ejecutan el haka maorí antes de cada partido. Han ganado el Mundial 3 veces.',
 'medium'),

('deportes', '¿Cuántos jugadores juegan rugby union en cancha por equipo?',
 '["11","13","15","18"]', 2,
 'Cada equipo de rugby union juega con 15 jugadores. El rugby league (variante) se juega con 13.',
 'medium'),

('deportes', '¿Qué deporte se inventó en Inglaterra en el s. XVIII?',
 '["Críquet","Béisbol","Polo","Fútbol americano"]', 0,
 'El críquet se documenta en Inglaterra desde el s. XVI. Es el deporte nacional de la India y otros países de la Commonwealth.',
 'hard'),

('deportes', '¿En qué deporte destacó Sachin Tendulkar?',
 '["Hockey","Críquet","Bádminton","Squash"]', 1,
 'Sachin Tendulkar, "el pequeño maestro", es probablemente el mejor jugador de críquet de la historia. Indio.',
 'hard'),

('deportes', '¿En qué deporte destacó Hicham El Guerrouj?',
 '["Atletismo (mediofondo)","Boxeo","Fútbol","Maratón"]', 0,
 'El marroquí Hicham El Guerrouj posee los récords mundiales de 1.500 m y la milla. Doble oro en Atenas 2004.',
 'hard'),

('deportes', '¿Quién batió el récord mundial del maratón en 2023?',
 '["Eliud Kipchoge","Kelvin Kiptum","Geoffrey Kamworor","Wilson Kipsang"]', 1,
 'Kelvin Kiptum batió el récord mundial en Chicago 2023 con 2h00:35. Falleció trágicamente en 2024.',
 'hard'),

('deportes', '¿Cuál es el récord mundial femenino del maratón?',
 '["~2h11","~2h09","~2h15","~2h05"]', 0,
 'Ruth Chepngetich (Kenia) corrió el maratón de Chicago 2024 en 2h09:56, primera mujer por debajo de 2h10.',
 'hard'),

('deportes', '¿En qué año se introdujo la línea de 3 puntos en la NBA?',
 '["1975","1979","1982","1985"]', 1,
 'La línea de 3 puntos se introdujo en la temporada 1979-1980. La FIBA la adoptó en 1984.',
 'hard'),

('deportes', '¿Qué deporte se gana siendo el primero en pasar la línea de meta?',
 '["Lucha","Atletismo","Tiro con arco","Halterofilia"]', 1,
 'En atletismo (carreras), el primero en cruzar la meta gana. Existen distancias de 100 m al maratón.',
 'easy'),

('deportes', '¿En qué deporte se utiliza la palabra "ace"?',
 '["Fútbol","Tenis","Béisbol","Hockey"]', 1,
 'En tenis, "ace" es un saque ganador que el receptor ni siquiera toca con la raqueta.',
 'easy'),

('deportes', '¿En qué deporte se utiliza el término "knockout" (KO)?',
 '["Boxeo","Esgrima","Lucha libre","Atletismo"]', 0,
 'En boxeo, un knockout es cuando el rival no puede levantarse antes de la cuenta de 10 del árbitro.',
 'easy'),

('deportes', '¿En qué deporte se concede el "Trofeo Webb Ellis"?',
 '["Rugby","Críquet","Polo","Tenis"]', 0,
 'El Trofeo Webb Ellis se otorga al ganador de la Copa del Mundo de Rugby. William Webb Ellis "inventó" el rugby en 1823.',
 'hard'),

('deportes', '¿En qué año se celebró el primer Mundial de Rugby?',
 '["1983","1987","1991","1995"]', 1,
 'El primer Mundial de Rugby fue organizado en Australia y Nueva Zelanda en 1987. Lo ganó Nueva Zelanda.',
 'hard'),

('deportes', '¿En qué deporte destacó Pelé?',
 '["Fútbol","Voleibol","Beisbol","Baloncesto"]', 0,
 'Pelé (Edson Arantes do Nascimento, 1940-2022) ganó 3 Mundiales con Brasil (1958, 1962, 1970), récord único.',
 'easy'),

('deportes', '¿Cuántos Mundiales jugó Lionel Messi?',
 '["3","4","5","6"]', 2,
 'Messi jugó 5 Mundiales con Argentina (2006, 2010, 2014, 2018, 2022). Ganó el de 2022 en Qatar.',
 'medium'),

('deportes', '¿En qué año se fundó la FIFA?',
 '["1904","1910","1920","1930"]', 0,
 'La FIFA se fundó el 21 de mayo de 1904 en París con 7 federaciones nacionales.',
 'medium'),

('deportes', '¿Quién es el máximo goleador de la historia del Real Madrid?',
 '["Cristiano Ronaldo","Raúl","Di Stéfano","Benzema"]', 0,
 'Cristiano Ronaldo es el máximo goleador histórico del Real Madrid con 450 goles en 438 partidos (2009-2018).',
 'medium'),

('deportes', '¿En qué año se fundó el FC Barcelona?',
 '["1898","1899","1900","1902"]', 1,
 'El FC Barcelona fue fundado el 29 de noviembre de 1899 por Joan Gamper.',
 'medium'),

('deportes', '¿En qué año se fundó el Real Madrid?',
 '["1898","1900","1902","1908"]', 2,
 'El Real Madrid se fundó el 6 de marzo de 1902 como Madrid Football Club.',
 'medium'),

('deportes', '¿Quién es el máximo goleador histórico del FC Barcelona?',
 '["Suárez","Messi","Cruyff","Kubala"]', 1,
 'Lionel Messi anotó 672 goles con el FC Barcelona (2004-2021), récord absoluto del club.',
 'easy'),

('deportes', '¿En qué deporte destacó Cassius Clay?',
 '["Lucha","Boxeo","Atletismo","Fútbol"]', 1,
 'Cassius Clay es el nombre de nacimiento de Muhammad Ali. Cambió su nombre en 1964 al convertirse al islam.',
 'medium'),

('deportes', '¿Qué selección ganó la Copa América 2024?',
 '["Argentina","Colombia","Uruguay","Brasil"]', 0,
 'Argentina ganó la Copa América 2024 en EE.UU., venciendo a Colombia 1-0 en la final.',
 'medium'),

('deportes', '¿En qué año conquistó el Athletic de Bilbao la Copa del Rey por última vez (antes de 2024)?',
 '["1973","1984","1990","2002"]', 1,
 'El Athletic ganó la Copa de 1984 antes de ganar la de 2024, rompiendo una sequía de 40 años.',
 'hard'),

('deportes', '¿Cuántos minutos dura un cuarto en la NBA?',
 '["10","12","15","20"]', 1,
 'Cada cuarto NBA dura 12 minutos. Un partido NBA total: 48 minutos. En la FIBA son 10 min/cuarto (40 min total).',
 'medium'),

('deportes', '¿Cuántos jugadores hay en un equipo de pádel?',
 '["1","2","3","4"]', 1,
 'El pádel se juega siempre en parejas (2 vs 2). Es un deporte nacido en México en 1969.',
 'medium'),

('deportes', '¿En qué país se popularizó el pádel?',
 '["México","España","Argentina","Todos los anteriores"]', 3,
 'El pádel nació en México (1969), se expandió por Argentina y se consolidó en España, donde es muy popular.',
 'medium'),

('deportes', '¿En qué deporte destacaron las hermanas Williams?',
 '["Tenis","Bádminton","Squash","Tenis de mesa"]', 0,
 'Venus y Serena Williams dominaron el tenis femenino mundial durante más de dos décadas.',
 'easy'),

('deportes', '¿En qué año debutó Lionel Messi con el FC Barcelona?',
 '["2003","2004","2005","2006"]', 1,
 'Messi debutó con el FC Barcelona el 16 de octubre de 2004 frente al Espanyol.',
 'medium'),

('deportes', '¿Cuántos goles marcó Pelé oficialmente en su carrera?',
 '["~700","~1.000","~1.280","~1.500"]', 2,
 'Pelé marcó 757 goles en partidos oficiales según FIFA, aunque él reclamaba 1.281 incluyendo amistosos.',
 'hard'),

('deportes', '¿Qué deporte se gana logrando un "hat-trick"?',
 '["Cualquier deporte con goles (sobre todo fútbol)","Tenis","Golf","Cricket"]', 0,
 'En fútbol y hockey, un hat-trick es marcar 3 goles en un mismo partido. El término viene del críquet.',
 'easy'),

('deportes', '¿Cuántos jugadores tiene un equipo de béisbol en cancha?',
 '["9","10","11","12"]', 0,
 'Un equipo de béisbol presenta 9 jugadores en el campo (incluyendo el lanzador y el receptor).',
 'medium'),

('deportes', '¿Qué deporte se inventó en Estados Unidos en 1891?',
 '["Baloncesto","Béisbol","Voleibol","Fútbol americano"]', 0,
 'James Naismith inventó el baloncesto en Springfield (Massachusetts) en diciembre de 1891.',
 'medium'),

('deportes', '¿En qué año se inventó el voleibol?',
 '["1891","1895","1900","1910"]', 1,
 'William G. Morgan inventó el voleibol en 1895 en Holyoke (Massachusetts), originalmente llamado "mintonette".',
 'hard'),

('deportes', '¿Cuántos jugadores tiene un equipo de voley playa?',
 '["2","3","4","6"]', 0,
 'El voley playa se juega 2 vs 2. Es deporte olímpico desde Atlanta 1996.',
 'easy'),

('deportes', '¿En qué deporte se compite por la Copa Ryder?',
 '["Tenis","Golf","Polo","Vela"]', 1,
 'La Copa Ryder es la competición de golf por equipos entre Europa y EE.UU., celebrada cada 2 años desde 1927.',
 'medium'),

('deportes', '¿Quién es Lewis Hamilton?',
 '["Piloto de F1 británico","Atleta","Tenista","Boxeador"]', 0,
 'Lewis Hamilton es 7 veces campeón del mundo de F1. El piloto con más victorias y poles de la historia.',
 'easy'),

('deportes', '¿Qué deporte se practica con un disco volador entre equipos?',
 '["Ultimate","Cornhole","Bocce","Bowling"]', 0,
 'El Ultimate frisbee se juega con un disco entre dos equipos en un campo similar al de fútbol americano.',
 'hard'),

('deportes', '¿Qué nadadora estadounidense ganó 7 oros en Tokio 2020/2021?',
 '["Katie Ledecky","Caeleb Dressel","Mireia Belmonte","Adam Peaty"]', 0,
 'Katie Ledecky es una de las grandes nadadoras de la historia, con múltiples oros olímpicos. (Caeleb Dressel también ganó múltiples en Tokio).',
 'hard'),

('deportes', '¿En qué año debutó el fútbol como deporte olímpico?',
 '["1896","1900","1908","1924"]', 1,
 'El fútbol masculino debutó como deporte olímpico en París 1900 (demostración) y se hizo oficial en Londres 1908.',
 'hard'),

('deportes', '¿En qué deporte se compite por el "Maillot Jaune"?',
 '["Tour de Francia","Giro de Italia","Vuelta a España","París-Roubaix"]', 0,
 'El maillot amarillo (maillot jaune) es el que viste el líder de la clasificación general del Tour de Francia.',
 'medium'),

('deportes', '¿De qué color es la camiseta del líder del Giro de Italia?',
 '["Rosa","Amarillo","Verde","Roja"]', 0,
 'La camiseta rosa (maglia rosa) es la del líder del Giro de Italia desde 1931. El color homenajea al diario La Gazzetta dello Sport.',
 'medium'),

('deportes', '¿En qué deporte destacó Roger Federer?',
 '["Tenis","Esquí","Fútbol","Hockey"]', 0,
 'Roger Federer ganó 20 Grand Slams. Considerado uno de los mejores tenistas de todos los tiempos.',
 'easy'),

('deportes', '¿Cuántos sets ha de ganar un equipo en voleibol para llevarse el set?',
 '["25 puntos","21 puntos","11 puntos","30 puntos"]', 0,
 'Cada set de voleibol se gana al llegar a 25 puntos con 2 de ventaja (excepto el 5.º set, a 15).',
 'medium'),

('deportes', '¿En qué deporte destacó Nadia Comăneci?',
 '["Gimnasia","Patinaje","Atletismo","Natación"]', 0,
 'Nadia Comăneci (Rumanía) fue la primera gimnasta en obtener un 10 perfecto, en los JJ.OO. de Montreal 1976.',
 'medium'),

('deportes', '¿Qué jugador de fútbol americano fue apodado "Sweetness"?',
 '["Joe Montana","Walter Payton","Jerry Rice","Barry Sanders"]', 1,
 'Walter Payton, leyenda de los Chicago Bears, fue apodado "Sweetness" por su elegancia al correr.',
 'hard'),

('deportes', '¿En qué deporte se compite por el "Heisman Trophy"?',
 '["Fútbol americano universitario","NBA","Beisbol","Hockey"]', 0,
 'El Heisman Trophy se concede al mejor jugador de fútbol americano universitario desde 1935.',
 'hard');

-- ══════════════════════════════════════════════════════════════
-- BIOLOGIA (+100)
-- ══════════════════════════════════════════════════════════════

insert into public.questions (category, question, options, answer_index, context, difficulty) values

('biologia', '¿Qué tipo de animal es la ballena?',
 '["Pez","Mamífero","Anfibio","Reptil"]', 1,
 'Las ballenas son mamíferos marinos: respiran aire, son vivíparas y amamantan a sus crías.',
 'easy'),

('biologia', '¿Qué animal es conocido como el "rey de la selva"?',
 '["Tigre","León","Leopardo","Pantera"]', 1,
 'El león es llamado tradicionalmente "rey de la selva" pese a habitar en sabanas, no selvas. Vive en grupos llamados manadas.',
 'easy'),

('biologia', '¿Cuál es el animal vivo más grande de la Tierra?',
 '["Elefante africano","Ballena azul","Tiburón ballena","Calamar gigante"]', 1,
 'La ballena azul puede medir más de 30 m y pesar más de 150 toneladas. Es el animal más grande conocido.',
 'easy'),

('biologia', '¿Cuál es el insecto más numeroso del planeta?',
 '["Mosca","Hormiga","Escarabajo","Mosquito"]', 2,
 'Los coleópteros (escarabajos) son el orden con más especies descritas (>350.000), aprox. el 40% de los insectos.',
 'hard'),

('biologia', '¿Cuántas patas tiene un ciempiés?',
 '["Siempre 100","Depende de la especie","Siempre 50","Siempre 200"]', 1,
 'A pesar del nombre, los ciempiés tienen entre 30 y 354 patas según la especie; siempre un número impar de pares.',
 'medium'),

('biologia', '¿Cuál es el animal que duerme más horas al día?',
 '["Perezoso","Koala","Murciélago marrón","Gato"]', 2,
 'El murciélago marrón puede dormir hasta 20 horas diarias. Los koalas duermen unas 18-22 horas.',
 'hard'),

('biologia', '¿Qué animal pone los huevos más grandes en relación con su tamaño?',
 '["Avestruz","Kiwi","Águila","Pingüino"]', 1,
 'La hembra del kiwi pone un huevo que puede ser ¼ de su peso corporal. En relación al tamaño es el récord.',
 'hard'),

('biologia', '¿Cuál es el mayor anfibio del mundo?',
 '["Sapo de caña","Salamandra gigante china","Rana toro","Tritón"]', 1,
 'La salamandra gigante china puede medir 1,8 m. Es uno de los animales más antiguos del planeta y está en peligro crítico.',
 'hard'),

('biologia', '¿Qué tipo de animal es la tortuga?',
 '["Anfibio","Reptil","Mamífero","Pez"]', 1,
 'Las tortugas son reptiles. Algunas especies como las galápagos pueden vivir más de 150 años.',
 'easy'),

('biologia', '¿Cuántos corazones tiene un pulpo?',
 '["1","2","3","4"]', 2,
 'El pulpo tiene 3 corazones: uno bombea sangre al cuerpo y dos a las branquias. Su sangre es azul (cobre).',
 'medium'),

('biologia', '¿Cuántos cerebros tiene una sanguijuela?',
 '["1","5","18","32"]', 3,
 'La sanguijuela tiene 32 cerebros (ganglios) distribuidos por sus segmentos corporales.',
 'hard'),

('biologia', '¿Qué animal puede regenerar sus extremidades?',
 '["Cangrejo","Estrella de mar","Salamandra","Todos los anteriores"]', 3,
 'Estrellas de mar, salamandras (y también lagartijas) tienen una notable capacidad regenerativa.',
 'medium'),

('biologia', '¿Qué órgano produce la bilis?',
 '["Páncreas","Hígado","Riñón","Bazo"]', 1,
 'El hígado produce la bilis, que se almacena en la vesícula biliar y ayuda a digerir las grasas.',
 'medium'),

('biologia', '¿Qué órgano almacena la bilis?',
 '["Hígado","Vesícula biliar","Páncreas","Estómago"]', 1,
 'La vesícula biliar almacena y concentra la bilis hasta que es necesaria para la digestión.',
 'medium'),

('biologia', '¿Cuál es la principal función de los riñones?',
 '["Bombear sangre","Filtrar sangre","Digerir alimentos","Respiración"]', 1,
 'Los riñones filtran la sangre, eliminando residuos y exceso de agua a través de la orina.',
 'easy'),

('biologia', '¿Qué número de cromosomas tiene un gameto humano?',
 '["23","46","48","92"]', 0,
 'Los gametos humanos (óvulo y espermatozoide) son haploides: contienen 23 cromosomas, la mitad de una célula somática.',
 'medium'),

('biologia', '¿Cuál es la estructura del ADN?',
 '["Lineal","Doble hélice","Triple hélice","Cuadrada"]', 1,
 'El ADN tiene estructura de doble hélice, descrita por Watson y Crick en 1953.',
 'easy'),

('biologia', '¿Quién publicó las leyes de la herencia genética?',
 '["Darwin","Mendel","Lamarck","Pasteur"]', 1,
 'Gregor Mendel publicó sus leyes en 1866 tras experimentar con guisantes. Sus trabajos fueron redescubiertos en 1900.',
 'medium'),

('biologia', '¿Cuántos pares de cromosomas tiene el ser humano?',
 '["22","23","24","46"]', 1,
 'Los humanos tenemos 23 pares de cromosomas (46 en total), incluyendo un par sexual (XX o XY).',
 'medium'),

('biologia', '¿Qué cromosoma sexual hace que un embrión humano sea genéticamente masculino?',
 '["X","Y","Ambos","Ninguno"]', 1,
 'El cromosoma Y, presente en los varones (XY), contiene el gen SRY que determina el desarrollo masculino.',
 'medium'),

('biologia', '¿Qué célula sanguínea participa en la coagulación?',
 '["Eritrocitos","Leucocitos","Plaquetas","Linfocitos"]', 2,
 'Las plaquetas (trombocitos) son fragmentos celulares que participan en la coagulación sanguínea formando tapones.',
 'medium'),

('biologia', '¿Qué tipo de células son los linfocitos?',
 '["Hematíes","Glóbulos blancos","Plaquetas","Adipocitos"]', 1,
 'Los linfocitos son glóbulos blancos (leucocitos) clave del sistema inmunitario adaptativo. Hay tipos B, T y NK.',
 'medium'),

('biologia', '¿Qué virus causa el SIDA?',
 '["Hepatitis","VIH","Ébola","Influenza"]', 1,
 'El VIH (Virus de la Inmunodeficiencia Humana) ataca el sistema inmunitario, debilitándolo hasta causar el SIDA.',
 'easy'),

('biologia', '¿Qué cromosoma falta en el síndrome de Down?',
 '["Falta un cromosoma","Hay un cromosoma 21 extra","Falta el Y","Hay un X extra"]', 1,
 'El síndrome de Down (trisomía 21) se debe a la presencia de un cromosoma 21 extra (3 copias en lugar de 2).',
 'medium'),

('biologia', '¿Qué tipo de animal es el delfín?',
 '["Pez","Mamífero","Anfibio","Reptil"]', 1,
 'Los delfines son mamíferos marinos de la familia de los cetáceos. Respiran aire por su espiráculo.',
 'easy'),

('biologia', '¿Cuál es la principal función de los pulmones?',
 '["Bombear sangre","Intercambio gaseoso","Producir glóbulos","Digestión"]', 1,
 'Los pulmones realizan el intercambio gaseoso: introducen O₂ en la sangre y eliminan CO₂.',
 'easy'),

('biologia', '¿Cuántos alvéolos pulmonares tiene un humano (aprox.)?',
 '["100 millones","500 millones","Aprox. 300-700 millones","1 millón"]', 2,
 'Los pulmones humanos contienen unos 300-700 millones de alvéolos, que aportan una superficie de unos 70 m² para el intercambio gaseoso.',
 'hard'),

('biologia', '¿Qué es el ribosoma?',
 '["Orgánulo de las mitocondrias","Orgánulo donde se sintetizan proteínas","Tipo de virus","Parte del núcleo"]', 1,
 'Los ribosomas son orgánulos sin membrana donde se sintetizan las proteínas mediante la traducción del ARNm.',
 'medium'),

('biologia', '¿Qué orgánulo contiene los pigmentos verdes en las células vegetales?',
 '["Mitocondria","Cloroplasto","Lisosoma","Núcleo"]', 1,
 'Los cloroplastos contienen clorofila, el pigmento verde que capta la luz para realizar la fotosíntesis.',
 'easy'),

('biologia', '¿Qué tipo de células forman el tejido muscular?',
 '["Neuronas","Miocitos","Adipocitos","Fibroblastos"]', 1,
 'Los miocitos (fibras musculares) son las células del tejido muscular. Pueden ser lisas, estriadas o cardíacas.',
 'medium'),

('biologia', '¿Cuántos tipos de tejido muscular hay?',
 '["1","2","3","4"]', 2,
 'Hay tres tipos: liso (involuntario, órganos), estriado (esquelético, voluntario) y cardíaco (involuntario, corazón).',
 'medium'),

('biologia', '¿Qué tipo de animal es la araña?',
 '["Insecto","Arácnido","Crustáceo","Quelíptero"]', 1,
 'Las arañas son arácnidos: tienen 8 patas, 2 segmentos corporales y carecen de antenas (a diferencia de los insectos).',
 'easy'),

('biologia', '¿Cuántas alas tienen los insectos típicamente?',
 '["2","3","4","Depende"]', 2,
 'La mayoría de insectos voladores tienen 4 alas (2 pares). En moscas (dípteros) el segundo par está reducido a balancines.',
 'medium'),

('biologia', '¿Qué pigmento de la sangre humana transporta el oxígeno?',
 '["Mioglobina","Hemoglobina","Clorofila","Bilirrubina"]', 1,
 'La hemoglobina, presente en los glóbulos rojos, transporta el oxígeno gracias a su contenido en hierro.',
 'easy'),

('biologia', '¿Qué hormona producen las gónadas masculinas?',
 '["Estrógeno","Progesterona","Testosterona","Insulina"]', 2,
 'Los testículos producen testosterona, hormona responsable de los caracteres sexuales masculinos.',
 'easy'),

('biologia', '¿Qué glándulas regulan el metabolismo del calcio?',
 '["Hipófisis","Tiroides y paratiroides","Suprarrenales","Páncreas"]', 1,
 'La paratohormona (de las paratiroides) y la calcitonina (del tiroides) regulan el calcio sanguíneo.',
 'hard'),

('biologia', '¿Qué virus causa el COVID-19?',
 '["H1N1","Ébola","SARS-CoV-2","MERS-CoV"]', 2,
 'El COVID-19 está causado por el coronavirus SARS-CoV-2, identificado a finales de 2019 en Wuhan (China).',
 'easy'),

('biologia', '¿Qué tipo de relación es la del clownfish y la anémona?',
 '["Parasitismo","Mutualismo","Comensalismo","Competencia"]', 1,
 'El pez payaso y la anémona viven en mutualismo: el pez recibe protección y la anémona limpieza y aireación.',
 'medium'),

('biologia', '¿Qué tipo de relación tiene un piojo con su huésped?',
 '["Parasitismo","Mutualismo","Comensalismo","Competencia"]', 0,
 'El piojo es un parásito: se beneficia a costa del huésped, al que perjudica alimentándose de su sangre.',
 'medium'),

('biologia', '¿Qué tipo de animal pone huevos y produce leche?',
 '["Ornitorrinco","Ballena","Avestruz","Pingüino"]', 0,
 'El ornitorrinco (monotrema australiano) es un mamífero ovíparo: pone huevos pero amamanta a sus crías.',
 'hard'),

('biologia', '¿Cuántos grupos sanguíneos hay en el sistema ABO?',
 '["3","4","6","8"]', 1,
 'Hay 4 grupos sanguíneos ABO: A, B, AB y O. Además se considera el factor Rh (+/-).',
 'easy'),

('biologia', '¿Cuál es el reino que incluye a los animales?',
 '["Plantae","Animalia","Fungi","Protista"]', 1,
 'Animalia es uno de los reinos de la clasificación biológica. Incluye a todos los animales pluricelulares heterótrofos.',
 'easy'),

('biologia', '¿Qué grupo taxonómico está formado por organismos unicelulares procariotas sin núcleo?',
 '["Hongos","Protistas","Bacterias","Animales"]', 2,
 'Las bacterias son organismos unicelulares procariotas (sin núcleo celular definido). Pertenecen al dominio Bacteria.',
 'medium'),

('biologia', '¿Qué proceso usan los virus para multiplicarse?',
 '["Mitosis","Meiosis","Replicación dentro de células huésped","Conjugación"]', 2,
 'Los virus no se multiplican solos: deben infectar células y usar su maquinaria para replicarse.',
 'medium'),

('biologia', '¿Qué tipo de hojas tienen las coníferas?',
 '["Anchas","Aciculares","Compuestas","Palmeadas"]', 1,
 'Las coníferas tienen hojas aciculares (en forma de aguja) o escamosas. Ej.: pinos, abetos.',
 'medium'),

('biologia', '¿Cuántas pétalas tiene una flor de lirio?',
 '["3","4","5","6"]', 2,
 'Las flores de lirio tienen 6 pétalos (en realidad, 3 pétalos y 3 sépalos similares), formando un cáliz hexapétalo.',
 'hard'),

('biologia', '¿Qué pigmento da el color rojo a la sangre venosa?',
 '["Bilirrubina","Hemoglobina sin O₂","Mioglobina","Carotenoide"]', 1,
 'La sangre venosa es más oscura porque la hemoglobina sin oxígeno (desoxihemoglobina) es más rojo oscuro.',
 'medium'),

('biologia', '¿Cuál es la unidad estructural del riñón?',
 '["Glomérulo","Nefrona","Túbulo","Cápsula"]', 1,
 'La nefrona es la unidad funcional del riñón. Hay aprox. 1 millón de nefronas por riñón humano.',
 'hard'),

('biologia', '¿Qué tipo de simetría tienen las medusas?',
 '["Bilateral","Radial","Esférica","Asimétrica"]', 1,
 'Las medusas tienen simetría radial: sus partes se distribuyen en torno a un eje central.',
 'medium'),

('biologia', '¿Qué tipo de simetría tenemos los humanos?',
 '["Radial","Bilateral","Esférica","Asimétrica"]', 1,
 'Los humanos (y la mayoría de animales complejos) tenemos simetría bilateral: el lado izquierdo es la imagen especular del derecho.',
 'easy'),

('biologia', '¿Qué hueso del cuerpo humano es el más pequeño?',
 '["Vómer","Estribo","Húmero","Coxal"]', 1,
 'El estribo, en el oído medio, mide ~3 mm. Es el hueso más pequeño del cuerpo humano.',
 'medium'),

('biologia', '¿Qué hueso forma la cadera junto al ilion y el isquion?',
 '["Cúbito","Pubis","Esternón","Vómer"]', 1,
 'El hueso coxal (de la cadera) se forma por la fusión de ilion, isquion y pubis.',
 'hard'),

('biologia', '¿Cuántas válvulas tiene el corazón humano?',
 '["2","3","4","6"]', 2,
 'El corazón tiene 4 válvulas: tricúspide, pulmonar, mitral y aórtica. Evitan el reflujo entre cámaras y arterias.',
 'medium'),

('biologia', '¿Qué glándula produce melatonina?',
 '["Hipófisis","Pineal","Suprarrenal","Tiroides"]', 1,
 'La glándula pineal (epífisis) produce melatonina, hormona que regula el ciclo sueño-vigilia.',
 'medium'),

('biologia', '¿Cuál es el principal neurotransmisor inhibidor del SNC?',
 '["Dopamina","GABA","Acetilcolina","Glutamato"]', 1,
 'El GABA (ácido gamma-aminobutírico) es el principal neurotransmisor inhibidor del sistema nervioso central.',
 'hard'),

('biologia', '¿Qué neurotransmisor está implicado en el Parkinson?',
 '["Acetilcolina","Dopamina","Serotonina","Glutamato"]', 1,
 'El Parkinson se debe a la degeneración de neuronas dopaminérgicas de la sustancia negra del cerebro.',
 'medium'),

('biologia', '¿Qué virus causa la varicela?',
 '["Herpes Zóster","Influenza","Adenovirus","Coronavirus"]', 0,
 'El virus varicela-zóster (VVZ), un herpesvirus, causa la varicela y, al reactivarse, el herpes zóster ("culebrilla").',
 'medium'),

('biologia', '¿Qué animal puede vivir hasta 200 años?',
 '["Tortuga gigante de Galápagos","Loro","Águila","Tigre"]', 0,
 'La tortuga gigante de Galápagos puede vivir más de 150-200 años. "Lonesome George" murió a los ~100 años en 2012.',
 'medium'),

('biologia', '¿Qué animal "inmortal" puede revertir su ciclo vital?',
 '["Hidra","Medusa Turritopsis dohrnii","Bacteria","Esponja"]', 1,
 'La medusa Turritopsis dohrnii puede volver a un estado de pólipo, considerándose biológicamente "inmortal".',
 'hard'),

('biologia', '¿Cuántos huevos pone aproximadamente una reina de abejas al día?',
 '["10","100","1.500","10.000"]', 2,
 'Una reina de abejas pone unos 1.500-2.000 huevos al día en la temporada activa.',
 'hard'),

('biologia', '¿Cuántas patas tienen los crustáceos típicamente?',
 '["6","8","10","12"]', 2,
 'Los decápodos (crustáceos como cangrejos, langostas) tienen 10 patas (5 pares).',
 'medium'),

('biologia', '¿Qué órgano produce las hormonas FSH y LH?',
 '["Hipófisis","Páncreas","Suprarrenales","Tiroides"]', 0,
 'La hipófisis anterior (adenohipófisis) produce las hormonas FSH y LH, gonadotropinas que regulan el sistema reproductor.',
 'hard'),

('biologia', '¿Cuál es el músculo más largo del cuerpo humano?',
 '["Bíceps","Sartorio","Recto femoral","Glúteo"]', 1,
 'El sartorio, en el muslo, es el músculo más largo del cuerpo humano. Mide unos 50-60 cm.',
 'hard'),

('biologia', '¿Qué tipo de animal es el caracol?',
 '["Insecto","Crustáceo","Molusco","Anélido"]', 2,
 'Los caracoles son moluscos gasterópodos. Llevan su concha enrollada y se desplazan sobre un pie musculoso.',
 'easy'),

('biologia', '¿Qué órgano produce el surfactante pulmonar?',
 '["Neumocitos tipo II","Bronquios","Tráquea","Diafragma"]', 0,
 'Los neumocitos tipo II producen el surfactante, sustancia que reduce la tensión superficial en los alvéolos pulmonares.',
 'hard'),

('biologia', '¿Qué define a un mamífero?',
 '["Tener pelo y glándulas mamarias","Volar","Vivir en agua","Tener huevos"]', 0,
 'Los mamíferos se caracterizan por tener pelo y glándulas mamarias para amamantar a sus crías. La mayoría son vivíparos.',
 'easy'),

('biologia', '¿Qué grupo de aves no puede volar?',
 '["Ratites (avestruces, etc.)","Águilas","Loros","Buitres"]', 0,
 'Las ratites incluyen avestruz, emú, ñandú, kiwi y casuario. Todas no voladoras.',
 'medium'),

('biologia', '¿Cuántas especies de mamíferos hay aproximadamente?',
 '["~1.000","~6.500","~20.000","~50.000"]', 1,
 'Se han descrito aproximadamente 6.500 especies de mamíferos vivos. La mitad son roedores.',
 'hard'),

('biologia', '¿Cuántas especies de aves hay aproximadamente?',
 '["~3.000","~6.000","~11.000","~20.000"]', 2,
 'Se conocen unas 11.000 especies de aves vivas en el mundo.',
 'hard'),

('biologia', '¿Qué animal se considera el más venenoso del mundo?',
 '["Cobra real","Avispa de mar","Mamba negra","Tarántula"]', 1,
 'La avispa de mar (Chironex fleckeri), medusa australiana, es considerada el animal más venenoso. Puede matar a un humano en minutos.',
 'medium'),

('biologia', '¿Cuál es la principal función de los espermatozoides?',
 '["Defensa","Fecundación del óvulo","Producción hormonal","Transporte de O₂"]', 1,
 'Los espermatozoides son los gametos masculinos. Su función es fecundar el óvulo aportando la mitad del material genético.',
 'easy'),

('biologia', '¿Dónde se produce la espermatogénesis?',
 '["Próstata","Testículos","Epidídimo","Vesícula seminal"]', 1,
 'La espermatogénesis ocurre en los túbulos seminíferos de los testículos.',
 'medium'),

('biologia', '¿Dónde ocurre la fecundación humana habitualmente?',
 '["Vagina","Útero","Trompa de Falopio","Ovario"]', 2,
 'La fecundación se produce normalmente en la trompa de Falopio (ampolla tubárica), tras la ovulación.',
 'medium'),

('biologia', '¿Cuánto dura un embarazo humano (semanas)?',
 '["30","36","40","45"]', 2,
 'Un embarazo humano dura aproximadamente 40 semanas (~9 meses) desde la última menstruación.',
 'easy'),

('biologia', '¿Qué tipo de animal es la rana?',
 '["Reptil","Anfibio","Mamífero","Pez"]', 1,
 'Las ranas son anfibios anuros. Pasan parte de su vida en el agua (renacuajos) y parte en tierra.',
 'easy'),

('biologia', '¿Qué tipo de reproducción tiene la mayoría de anfibios?',
 '["Vivípara","Ovípara","Ovovivípara","Asexual"]', 1,
 'La mayoría de anfibios son ovíparos: ponen huevos (generalmente en agua) con fecundación externa.',
 'medium'),

('biologia', '¿Cuál es el animal terrestre más grande?',
 '["Hipopótamo","Rinoceronte","Elefante africano","Jirafa"]', 2,
 'El elefante africano de sabana es el mayor animal terrestre, con machos que pueden pesar 6 toneladas.',
 'easy'),

('biologia', '¿Cuál es el animal más alto del mundo?',
 '["Elefante","Jirafa","Camello","Avestruz"]', 1,
 'La jirafa puede alcanzar los 5,5 m de altura. Su cuello tiene los mismos 7 vertebras cervicales que la mayoría de mamíferos.',
 'easy'),

('biologia', '¿Qué tipo de hojas pierde un árbol caducifolio?',
 '["Solo las flores","Todas las hojas en otoño","Las del fruto","Las nuevas"]', 1,
 'Los árboles caducifolios pierden todas sus hojas al final del otoño y las renuevan en primavera.',
 'easy'),

('biologia', '¿Qué tipo de árbol mantiene sus hojas todo el año?',
 '["Caducifolio","Perennifolio","Coníferas tropicales","Pteridofitas"]', 1,
 'Los árboles perennifolios (o de hoja perenne) mantienen sus hojas durante todo el año, renovándolas gradualmente.',
 'easy'),

('biologia', '¿Qué proceso convierte el ADN en ARN?',
 '["Traducción","Transcripción","Replicación","Mutación"]', 1,
 'La transcripción es el proceso por el cual una hebra de ADN se copia en ARN mensajero (ARNm).',
 'hard'),

('biologia', '¿Qué proceso convierte el ARNm en proteína?',
 '["Transcripción","Traducción","Replicación","Splicing"]', 1,
 'La traducción es el proceso por el cual los ribosomas leen el ARNm y sintetizan una cadena de aminoácidos (proteína).',
 'hard'),

('biologia', '¿Cuántos aminoácidos esenciales existen para los humanos?',
 '["6","9","12","20"]', 1,
 'Hay 9 aminoácidos esenciales para los humanos: deben obtenerse de la dieta. En total existen 20 aminoácidos proteinogénicos.',
 'medium'),

('biologia', '¿Cuántos pares de nervios craneales tiene el ser humano?',
 '["8","10","12","16"]', 2,
 'Tenemos 12 pares de nervios craneales (olfatorio, óptico, etc.), numerados con números romanos del I al XII.',
 'hard'),

('biologia', '¿Qué órgano regula la temperatura corporal?',
 '["Hipotálamo","Hipófisis","Cerebelo","Bulbo raquídeo"]', 0,
 'El hipotálamo es el termostato del cuerpo: regula la temperatura corporal y muchas otras funciones homeostáticas.',
 'medium'),

('biologia', '¿Qué parte del cerebro coordina el movimiento?',
 '["Cerebelo","Hipotálamo","Tálamo","Bulbo raquídeo"]', 0,
 'El cerebelo coordina los movimientos, el equilibrio y la postura. Su nombre significa "pequeño cerebro".',
 'medium'),

('biologia', '¿Cuántas neuronas tiene aproximadamente el cerebro humano?',
 '["1.000 millones","86.000 millones","100.000 millones","1 billón"]', 1,
 'El cerebro humano contiene unos 86.000 millones de neuronas. Cada una puede tener miles de conexiones (sinapsis).',
 'hard'),

('biologia', '¿Qué hormona controla los niveles de glucosa en sangre cuando bajan?',
 '["Insulina","Glucagón","Cortisol","Adrenalina"]', 1,
 'El glucagón eleva la glucemia liberando glucosa del hígado. Es antagónico a la insulina.',
 'hard'),

('biologia', '¿Qué órgano produce el glucagón?',
 '["Hígado","Páncreas","Suprarrenales","Tiroides"]', 1,
 'El páncreas (células alfa de los islotes de Langerhans) produce glucagón. Las células beta producen insulina.',
 'hard'),

('biologia', '¿Qué tipo de molécula es la insulina?',
 '["Lípido","Proteína","Carbohidrato","Vitamina"]', 1,
 'La insulina es una proteína (hormona peptídica) de 51 aminoácidos producida por las células beta del páncreas.',
 'hard'),

('biologia', '¿Qué ciclo describe el flujo de nitrógeno entre organismos y el ambiente?',
 '["Ciclo del agua","Ciclo del carbono","Ciclo del nitrógeno","Ciclo del fósforo"]', 2,
 'El ciclo del nitrógeno describe cómo este elemento pasa por la atmósfera, suelo, organismos y agua a través de procesos como la fijación, nitrificación y desnitrificación.',
 'hard'),

('biologia', '¿Qué proceso permite a las bacterias fijar nitrógeno atmosférico?',
 '["Fotosíntesis","Fijación biológica","Quimiosíntesis","Fermentación"]', 1,
 'Algunas bacterias (como Rhizobium en raíces de leguminosas) pueden fijar N₂ atmosférico convirtiéndolo en amoniaco.',
 'hard'),

('biologia', '¿Qué tipo de relación es la del rinoceronte y la garcilla bueyera?',
 '["Parasitismo","Mutualismo","Comensalismo","Competencia"]', 1,
 'La garcilla bueyera y el rinoceronte (o el búfalo) tienen mutualismo: la garcilla come parásitos del animal mayor, beneficiándose ambos.',
 'medium'),

('biologia', '¿Qué adaptación tiene el camello para el desierto?',
 '["Joroba con grasa","Pelo largo","Patas palmeadas","Branquias"]', 0,
 'La joroba del camello almacena grasa, que metaboliza para obtener energía y agua. Sus patas son anchas para no hundirse en la arena.',
 'easy'),

('biologia', '¿Qué órgano produce los anticuerpos?',
 '["Hígado","Médula ósea","Linfocitos B","Páncreas"]', 2,
 'Los linfocitos B (un tipo de glóbulo blanco) producen anticuerpos al diferenciarse en células plasmáticas.',
 'hard'),

('biologia', '¿Qué proceso celular produce energía en ausencia de O₂?',
 '["Respiración aerobia","Fermentación","Fotosíntesis","Glucólisis"]', 1,
 'La fermentación produce ATP en ausencia de oxígeno. Hay varios tipos: láctica, alcohólica, etc.',
 'medium'),

('biologia', '¿Qué cromosoma sexual tienen las mujeres XY?',
 '["XX","XY","XO","X0"]', 0,
 'Las mujeres son típicamente XX (dos cromosomas X). Los hombres son XY.',
 'easy'),

('biologia', '¿Cuántos pares de nervios espinales tiene un ser humano?',
 '["12","23","31","42"]', 2,
 'El ser humano tiene 31 pares de nervios espinales que salen de la médula espinal: 8 cervicales, 12 torácicos, 5 lumbares, 5 sacros y 1 coccígeo.',
 'hard'),

('biologia', '¿Cuál es la causa de la anemia ferropénica?',
 '["Falta de vitamina C","Falta de hierro","Falta de proteína","Falta de calcio"]', 1,
 'La anemia ferropénica se produce por la falta de hierro, necesario para sintetizar hemoglobina.',
 'medium'),

('biologia', '¿Qué efecto tiene la hormona del crecimiento (GH)?',
 '["Estimula el crecimiento","Reduce el crecimiento","Regula glucemia","Controla apetito"]', 0,
 'La hormona del crecimiento, producida por la hipófisis, estimula el crecimiento de huesos y tejidos.',
 'medium'),

('biologia', '¿Qué tipo de tejido nervioso aísla los axones?',
 '["Vaina de mielina","Dendrita","Sinapsis","Astrocito"]', 0,
 'La vaina de mielina, formada por células de Schwann (sistema periférico) u oligodendrocitos (central), aísla los axones acelerando la transmisión.',
 'hard'),

('biologia', '¿Qué animal tiene mayor número de dientes?',
 '["Tiburón","Caracol","Cocodrilo","Elefante"]', 1,
 'Los caracoles pueden tener decenas de miles de dientes microscópicos (la rádula). Es la cifra de "dientes" más alta del reino animal.',
 'hard');

-- ══════════════════════════════════════════════════════════════
-- CINE (+100)
-- ══════════════════════════════════════════════════════════════

insert into public.questions (category, question, options, answer_index, context, difficulty) values

('cine', '¿Quién dirigió "Ciudadano Kane" (1941)?',
 '["Hitchcock","Welles","Kazan","Capra"]', 1,
 'Orson Welles dirigió, coescribió y protagonizó "Ciudadano Kane" a los 25 años. Considerada una de las mejores películas de la historia.',
 'medium'),

('cine', '¿Quién es el director de "2001: Una odisea del espacio" (1968)?',
 '["Kubrick","Spielberg","Scott","Lucas"]', 0,
 'Stanley Kubrick dirigió "2001: Una odisea del espacio", adaptación de la novela de Arthur C. Clarke.',
 'medium'),

('cine', '¿Quién dirigió "La naranja mecánica" (1971)?',
 '["Kubrick","Polanski","Coppola","Lucas"]', 0,
 'Stanley Kubrick adaptó la novela de Anthony Burgess en "La naranja mecánica" (A Clockwork Orange).',
 'medium'),

('cine', '¿Quién dirigió "Tiburón" (1975)?',
 '["Lucas","Spielberg","Coppola","Scorsese"]', 1,
 'Steven Spielberg dirigió "Jaws" (Tiburón) en 1975, considerada el primer blockbuster moderno.',
 'easy'),

('cine', '¿Quién dirigió "Taxi Driver" (1976)?',
 '["Scorsese","Coppola","Pakula","Coppola"]', 0,
 'Martin Scorsese dirigió "Taxi Driver" protagonizada por Robert De Niro. Famosa frase: "Are you talking to me?".',
 'medium'),

('cine', '¿Quién dirigió "Toro salvaje" (1980)?',
 '["Coppola","Scorsese","De Palma","Cimino"]', 1,
 'Martin Scorsese dirigió "Raging Bull" (Toro salvaje) sobre el boxeador Jake LaMotta. Oscar para De Niro.',
 'hard'),

('cine', '¿Qué película de Coppola ganó el Óscar a Mejor Película en 1972?',
 '["El Padrino","Apocalypse Now","La Conversación","El Padrino II"]', 0,
 '"El Padrino" (1972) ganó el Óscar a Mejor Película, dirigida por Francis Ford Coppola.',
 'medium'),

('cine', '¿Quién dirigió "Apocalypse Now" (1979)?',
 '["Coppola","Scorsese","Cimino","Lucas"]', 0,
 'Francis Ford Coppola dirigió "Apocalypse Now", basada libremente en "El corazón de las tinieblas" de Joseph Conrad.',
 'medium'),

('cine', '¿Quién es el director de "Lawrence de Arabia" (1962)?',
 '["John Ford","David Lean","Lean","William Wyler"]', 1,
 'David Lean dirigió "Lawrence de Arabia" (1962), 7 Óscars incluyendo Mejor Película y Director.',
 'hard'),

('cine', '¿Quién dirigió "Doctor Zhivago" (1965)?',
 '["David Lean","Otto Preminger","Robert Wise","George Cukor"]', 0,
 'David Lean dirigió "Doctor Zhivago", basada en la novela de Boris Pasternak. Banda sonora de Maurice Jarre.',
 'hard'),

('cine', '¿Quién protagoniza "Casablanca" (1942)?',
 '["Cary Grant","Humphrey Bogart","James Stewart","Gary Cooper"]', 1,
 'Humphrey Bogart e Ingrid Bergman protagonizaron "Casablanca" (1942), dirigida por Michael Curtiz.',
 'medium'),

('cine', '¿Quién dirigió "Lo que el viento se llevó" (1939)?',
 '["Cukor","Fleming","Capra","Ford"]', 1,
 'Victor Fleming dirigió "Lo que el viento se llevó" (1939), aunque otros directores también participaron.',
 'hard'),

('cine', '¿Quién protagonizó "Lo que el viento se llevó"?',
 '["Clark Gable y Vivien Leigh","Cary Grant y Judy Garland","Spencer Tracy y Bette Davis","James Cagney y Joan Crawford"]', 0,
 'Clark Gable como Rhett Butler y Vivien Leigh como Scarlett O''Hara protagonizaron "Lo que el viento se llevó".',
 'medium'),

('cine', '¿Quién dirigió "El mago de Oz" (1939)?',
 '["Fleming","Cukor","Curtiz","Walsh"]', 0,
 'Victor Fleming dirigió "El mago de Oz" en 1939 (también dirigió "Lo que el viento se llevó" ese mismo año).',
 'hard'),

('cine', '¿Quién protagoniza "Cantando bajo la lluvia"?',
 '["Fred Astaire","Gene Kelly","Sammy Davis Jr.","Frank Sinatra"]', 1,
 'Gene Kelly protagonizó "Singin'' in the Rain" (1952), dirigida por Stanley Donen y el propio Kelly.',
 'hard'),

('cine', '¿Quién dirigió "Doce hombres sin piedad" (1957)?',
 '["Sidney Lumet","Kazan","Mankiewicz","Wise"]', 0,
 'Sidney Lumet dirigió "12 Angry Men" en 1957. Drama judicial casi íntegramente rodado en una sala.',
 'hard'),

('cine', '¿Qué actor protagoniza "Atrapa a un ladrón" (1955)?',
 '["Cary Grant","James Stewart","Gregory Peck","Henry Fonda"]', 0,
 'Cary Grant y Grace Kelly protagonizaron "Atrapa a un ladrón", dirigida por Alfred Hitchcock en la Costa Azul.',
 'hard'),

('cine', '¿Quién dirige "Con la muerte en los talones" (1959)?',
 '["Hitchcock","Wilder","Wyler","Reed"]', 0,
 'Alfred Hitchcock dirigió "North by Northwest" (1959), protagonizada por Cary Grant. Famosa escena de la avioneta.',
 'medium'),

('cine', '¿Quién protagoniza "Vértigo" (1958)?',
 '["Cary Grant","James Stewart","Gregory Peck","Kirk Douglas"]', 1,
 'James Stewart y Kim Novak protagonizaron "Vértigo" (1958), dirigida por Hitchcock.',
 'medium'),

('cine', '¿En qué película aparece Norman Bates?',
 '["Psicosis","Los pájaros","Vértigo","La ventana indiscreta"]', 0,
 'Norman Bates es el siniestro dueño del motel en "Psicosis" (1960) de Hitchcock, interpretado por Anthony Perkins.',
 'medium'),

('cine', '¿Quién dirigió "Annie Hall" (1977)?',
 '["Allen","Coppola","Spielberg","Brooks"]', 0,
 'Woody Allen dirigió y protagonizó "Annie Hall" (1977). Oscar a Mejor Película y Director.',
 'medium'),

('cine', '¿Quién protagoniza "Casablanca" como Ilsa?',
 '["Bette Davis","Greta Garbo","Ingrid Bergman","Marlene Dietrich"]', 2,
 'Ingrid Bergman interpretó a Ilsa Lund en "Casablanca" (1942) junto a Humphrey Bogart.',
 'medium'),

('cine', '¿Quién dirigió la trilogía "El Señor de los Anillos"?',
 '["George Lucas","Peter Jackson","Cameron","Spielberg"]', 1,
 'Peter Jackson dirigió la trilogía "El Señor de los Anillos" (2001-2003), rodada íntegramente en Nueva Zelanda.',
 'easy'),

('cine', '¿Cuántos Óscars ganó "El Señor de los Anillos: El retorno del rey"?',
 '["8","10","11","12"]', 2,
 '"El retorno del rey" (2003) ganó los 11 Óscars a los que estaba nominada, récord absoluto.',
 'hard'),

('cine', '¿En qué año se estrenó "Titanic"?',
 '["1995","1997","1999","2001"]', 1,
 '"Titanic" de James Cameron se estrenó en 1997. Ganó 11 Óscars y fue el primero en superar los 1.000 M$ en taquilla.',
 'easy'),

('cine', '¿Quién protagoniza "Titanic"?',
 '["DiCaprio y Winslet","Pitt y Roberts","Cruise y Pfeiffer","Hanks y Bullock"]', 0,
 'Leonardo DiCaprio (Jack) y Kate Winslet (Rose) protagonizaron "Titanic" (1997) de James Cameron.',
 'easy'),

('cine', '¿Cuál es la película más taquillera de la historia?',
 '["Titanic","Avatar","Vengadores: Endgame","Star Wars VII"]', 1,
 '"Avatar" (2009) recuperó el primer puesto tras su reestreno en China en 2021. Avatar: El sentido del agua (2022) también está en el top.',
 'medium'),

('cine', '¿Quién dirige "Avatar"?',
 '["Spielberg","Cameron","Jackson","Zemeckis"]', 1,
 'James Cameron dirigió "Avatar" (2009) y su secuela "Avatar: El sentido del agua" (2022).',
 'easy'),

('cine', '¿Quién dirige "Aliens: el regreso" (1986)?',
 '["Ridley Scott","James Cameron","Spielberg","Cronenberg"]', 1,
 'James Cameron dirigió "Aliens" (1986), secuela del "Alien" original de Ridley Scott (1979).',
 'medium'),

('cine', '¿Quién dirigió "Blade Runner" (1982)?',
 '["Scott","Cameron","Spielberg","Lucas"]', 0,
 'Ridley Scott dirigió "Blade Runner" (1982), basada libremente en la novela de Philip K. Dick.',
 'medium'),

('cine', '¿Quién dirigió "Gladiator" (2000)?',
 '["Cameron","Ridley Scott","Mendes","Howard"]', 1,
 'Ridley Scott dirigió "Gladiator" (2000). Russell Crowe ganó el Óscar al mejor actor por su papel de Máximo.',
 'medium'),

('cine', '¿Quién dirigió "Ben-Hur" (1959)?',
 '["DeMille","William Wyler","Cecil B.","Wyler"]', 1,
 'William Wyler dirigió "Ben-Hur" (1959), 11 Óscars (récord junto a "Titanic" y "El Retorno del Rey").',
 'hard'),

('cine', '¿Quién dirigió "El silencio de los corderos" (1991)?',
 '["Jonathan Demme","Coppola","Bigelow","Stone"]', 0,
 'Jonathan Demme dirigió "El silencio de los corderos". Anthony Hopkins ganó el Óscar por Hannibal Lecter.',
 'hard'),

('cine', '¿Qué actor interpreta a Hannibal Lecter?',
 '["Anthony Hopkins","De Niro","Pacino","Nicholson"]', 0,
 'Anthony Hopkins interpretó a Hannibal Lecter en "El silencio de los corderos" (1991) y sus secuelas.',
 'medium'),

('cine', '¿Quién dirigió "Forrest Gump" (1994)?',
 '["Spielberg","Zemeckis","Howard","Eastwood"]', 1,
 'Robert Zemeckis dirigió "Forrest Gump" (1994). 6 Óscars incluyendo Mejor Película.',
 'medium'),

('cine', '¿Qué actor protagonizó "Forrest Gump"?',
 '["Hanks","DiCaprio","Bullock","Pacino"]', 0,
 'Tom Hanks ganó el Óscar a Mejor Actor por "Forrest Gump" (1994), su segundo Óscar consecutivo (tras "Philadelphia").',
 'easy'),

('cine', '¿Quién dirigió "Pulp Fiction" (1994)?',
 '["Rodriguez","Tarantino","Lynch","Coen"]', 1,
 'Quentin Tarantino dirigió "Pulp Fiction" (1994), Palma de Oro en Cannes y Óscar al mejor guion.',
 'easy'),

('cine', '¿Quién dirigió "Reservoir Dogs" (1992)?',
 '["Tarantino","Soderbergh","Rodriguez","Spike Lee"]', 0,
 'Quentin Tarantino dirigió su debut "Reservoir Dogs" en 1992.',
 'medium'),

('cine', '¿Quién dirigió "Kill Bill" (2003)?',
 '["Tarantino","Rodriguez","Wong Kar-wai","Yimou"]', 0,
 'Quentin Tarantino dirigió "Kill Bill: Vol. 1" (2003) y "Vol. 2" (2004), protagonizadas por Uma Thurman.',
 'easy'),

('cine', '¿Quién dirigió "Malditos bastardos" (2009)?',
 '["Coppola","Tarantino","Stone","Burton"]', 1,
 'Quentin Tarantino dirigió "Malditos bastardos" (2009). Christoph Waltz ganó el Óscar como nazi Hans Landa.',
 'medium'),

('cine', '¿Quién dirigió "La lista de Schindler" (1993)?',
 '["Lucas","Spielberg","Polanski","Lumet"]', 1,
 'Steven Spielberg dirigió "La lista de Schindler" (1993). 7 Óscars, primero como Director para Spielberg.',
 'easy'),

('cine', '¿Quién dirigió "Salvar al soldado Ryan" (1998)?',
 '["Spielberg","Eastwood","Howard","Stone"]', 0,
 'Steven Spielberg dirigió "Salvar al soldado Ryan" (1998). Tom Hanks protagonista. 5 Óscars.',
 'medium'),

('cine', '¿Qué actriz ganó el Óscar por "Black Swan" (2010)?',
 '["Natalie Portman","Mila Kunis","Anne Hathaway","Reese Witherspoon"]', 0,
 'Natalie Portman ganó el Óscar a Mejor Actriz por su papel de Nina en "Cisne negro" (2010) de Aronofsky.',
 'medium'),

('cine', '¿Quién dirigió "El cisne negro" (2010)?',
 '["Aronofsky","Nolan","Anderson","Mendes"]', 0,
 'Darren Aronofsky dirigió "Cisne negro" (Black Swan, 2010), protagonizada por Natalie Portman.',
 'hard'),

('cine', '¿Quién protagoniza "Joker" (2019)?',
 '["Heath Ledger","Joaquin Phoenix","Jared Leto","Cillian Murphy"]', 1,
 'Joaquin Phoenix interpretó a Arthur Fleck/Joker en "Joker" (2019) de Todd Phillips. Oscar a Mejor Actor.',
 'easy'),

('cine', '¿Quién dirigió "Origen" (2010)?',
 '["Aronofsky","Nolan","Fincher","Cuarón"]', 1,
 'Christopher Nolan dirigió "Inception" (Origen) en 2010. Protagonizada por Leonardo DiCaprio.',
 'medium'),

('cine', '¿Quién dirigió "Interstellar" (2014)?',
 '["Cuarón","Nolan","Villeneuve","Mendes"]', 1,
 'Christopher Nolan dirigió "Interstellar" (2014). Banda sonora de Hans Zimmer. Asesoría científica de Kip Thorne.',
 'medium'),

('cine', '¿Quién dirigió "Dunkerque" (2017)?',
 '["Mendes","Nolan","Spielberg","Boyle"]', 1,
 'Christopher Nolan dirigió "Dunkerque" (Dunkirk, 2017) sobre la evacuación de Dunkerque en 1940.',
 'medium'),

('cine', '¿Quién dirigió "Oppenheimer" (2023)?',
 '["Spielberg","Nolan","Villeneuve","Anderson"]', 1,
 'Christopher Nolan dirigió "Oppenheimer" (2023). Ganó 7 Óscars incluyendo Mejor Película y Director.',
 'easy'),

('cine', '¿Quién protagoniza "Oppenheimer"?',
 '["Robert Downey Jr.","Cillian Murphy","Tom Hardy","Christian Bale"]', 1,
 'Cillian Murphy interpretó a J. Robert Oppenheimer y ganó el Óscar a Mejor Actor.',
 'easy'),

('cine', '¿Quién dirigió "La forma del agua" (2017)?',
 '["Cuarón","Iñárritu","Del Toro","Aronofsky"]', 2,
 'Guillermo del Toro dirigió "La forma del agua" (2017). Ganó 4 Óscars incluyendo Mejor Película y Director.',
 'medium'),

('cine', '¿Quién dirigió "Birdman" (2014)?',
 '["González Iñárritu","Cuarón","Del Toro","Reygadas"]', 0,
 'Alejandro González Iñárritu dirigió "Birdman" (2014). Oscar a Mejor Película y Director.',
 'medium'),

('cine', '¿Quién dirigió "Gravity" (2013)?',
 '["Cuarón","Iñárritu","Anderson","Villeneuve"]', 0,
 'Alfonso Cuarón dirigió "Gravity" (2013). Oscar a Mejor Director.',
 'medium'),

('cine', '¿Quién dirigió "Roma" (2018)?',
 '["Cuarón","Iñárritu","Del Toro","Reygadas"]', 0,
 'Alfonso Cuarón dirigió "Roma" (2018), filmada en blanco y negro. Tres Óscars, incluyendo Mejor Director y Película Extranjera.',
 'medium'),

('cine', '¿Quién dirigió "Parasitos" (Parasite, 2019)?',
 '["Bong Joon-ho","Park Chan-wook","Kim Ki-duk","Hou Hsiao-hsien"]', 0,
 'Bong Joon-ho dirigió "Parasite" (2019). Primer film no en inglés en ganar Mejor Película en los Óscars.',
 'medium'),

('cine', '¿Cuántos Óscars ganó "Parasitos" en 2020?',
 '["2","3","4","5"]', 2,
 '"Parasite" ganó 4 Óscars: Película, Director, Guion Original y Película Internacional.',
 'hard'),

('cine', '¿Quién protagoniza "Mad Max: Fury Road" (2015) como Furiosa?',
 '["Charlize Theron","Cate Blanchett","Tilda Swinton","Nicole Kidman"]', 0,
 'Charlize Theron interpretó a la Imperator Furiosa en "Mad Max: Fury Road" (2015) de George Miller.',
 'medium'),

('cine', '¿Quién dirigió "Mad Max: Fury Road"?',
 '["George Miller","Cameron","Nolan","Villeneuve"]', 0,
 'George Miller dirigió "Mad Max: Fury Road" en 2015, regresando a la saga 30 años después.',
 'medium'),

('cine', '¿Quién dirigió "Dune" (2021)?',
 '["Lynch","Villeneuve","Nolan","Cuarón"]', 1,
 'Denis Villeneuve dirigió "Dune" (2021) y "Dune: Parte Dos" (2024). Adaptaciones de la novela de Frank Herbert.',
 'easy'),

('cine', '¿Quién protagoniza la nueva "Dune" como Paul Atreides?',
 '["Timothée Chalamet","Zendaya","Anya Taylor-Joy","Cillian Murphy"]', 0,
 'Timothée Chalamet interpreta a Paul Atreides en "Dune" (2021) y "Dune: Parte Dos" (2024).',
 'medium'),

('cine', '¿Quién dirigió "Blade Runner 2049" (2017)?',
 '["Scott","Villeneuve","Nolan","Cuarón"]', 1,
 'Denis Villeneuve dirigió "Blade Runner 2049" (2017), secuela del clásico de Ridley Scott.',
 'medium'),

('cine', '¿Quién dirigió "Memento" (2000)?',
 '["Aronofsky","Nolan","Fincher","Tarantino"]', 1,
 'Christopher Nolan dirigió "Memento" (2000), su segundo largometraje, contado en orden cronológico inverso.',
 'medium'),

('cine', '¿Quién dirigió "Seven" (1995) y "El club de la lucha" (1999)?',
 '["Mendes","Fincher","Singer","Schumacher"]', 1,
 'David Fincher dirigió ambos films, así como "Zodiac" (2007) y "La red social" (2010).',
 'medium'),

('cine', '¿Quién dirigió "La red social" (2010)?',
 '["Fincher","Sorkin","Mendes","Nolan"]', 0,
 'David Fincher dirigió "La red social" (2010), guion de Aaron Sorkin. Sobre los orígenes de Facebook.',
 'medium'),

('cine', '¿Quién protagoniza "El indomable Will Hunting" (1997)?',
 '["Damon y Affleck","Pitt y Norton","Crowe y Pacino","Penn y Roberts"]', 0,
 'Matt Damon y Ben Affleck protagonizaron y coescribieron "Good Will Hunting" (1997), por la que ganaron el Óscar al guion.',
 'medium'),

('cine', '¿Quién dirigió "Brokeback Mountain" (2005)?',
 '["Ang Lee","Eastwood","Reitman","Howard"]', 0,
 'Ang Lee dirigió "Brokeback Mountain" (2005). Oscar a Mejor Director.',
 'hard'),

('cine', '¿Quién dirigió "Tigre y dragón" (2000)?',
 '["Wong Kar-wai","Ang Lee","Zhang Yimou","Chen Kaige"]', 1,
 'Ang Lee dirigió "Tigre y Dragón" (Crouching Tiger, Hidden Dragon, 2000), 4 Óscars incluyendo Película Extranjera.',
 'hard'),

('cine', '¿Quién protagoniza "El club de la lucha" (1999)?',
 '["Pitt y Norton","Damon y Affleck","Cruise y De Niro","Pacino y De Niro"]', 0,
 'Brad Pitt y Edward Norton protagonizaron "Fight Club" (1999) de David Fincher.',
 'medium'),

('cine', '¿Quién protagoniza "Matrix" (1999) como Neo?',
 '["Keanu Reeves","Brad Pitt","Tom Cruise","Will Smith"]', 0,
 'Keanu Reeves interpretó a Neo en "The Matrix" (1999) y sus secuelas, dirigidas por las hermanas Wachowski.',
 'easy'),

('cine', '¿Quién dirigió la saga "Matrix"?',
 '["Cameron","Wachowski","Nolan","Spielberg"]', 1,
 'Las hermanas Lana y Lilly Wachowski dirigieron toda la saga "Matrix" (1999-2003 + Resurrections en 2021).',
 'medium'),

('cine', '¿Quién dirigió "Eduardo Manostijeras" (1990)?',
 '["Burton","Lynch","Coppola","Sonnenfeld"]', 0,
 'Tim Burton dirigió "Eduardo Manostijeras" (Edward Scissorhands, 1990), protagonizada por Johnny Depp.',
 'medium'),

('cine', '¿Quién dirigió "Pesadilla antes de Navidad"?',
 '["Selick","Burton","Lasseter","Linklater"]', 0,
 'Henry Selick dirigió "Pesadilla antes de Navidad" (1993), producida por Tim Burton (a quien suele atribuírsele).',
 'hard'),

('cine', '¿Qué actor protagoniza "Piratas del Caribe"?',
 '["Brad Pitt","Johnny Depp","Bloom","Cruise"]', 1,
 'Johnny Depp interpretó al capitán Jack Sparrow en la saga "Piratas del Caribe" (2003-2017).',
 'easy'),

('cine', '¿Quién dirigió "Volver" (2006)?',
 '["Almodóvar","Amenábar","Bayona","Garci"]', 0,
 'Pedro Almodóvar dirigió "Volver" (2006), con Penélope Cruz como protagonista.',
 'medium'),

('cine', '¿Quién dirige "Todo sobre mi madre" (1999)?',
 '["Almodóvar","Trueba","Amenábar","Bollaín"]', 0,
 'Pedro Almodóvar dirigió "Todo sobre mi madre" (1999), Oscar a la Mejor Película Extranjera.',
 'medium'),

('cine', '¿Quién dirige "Mar adentro" (2004)?',
 '["Amenábar","Almodóvar","Bayona","Trueba"]', 0,
 'Alejandro Amenábar dirigió "Mar adentro" (2004), basada en la historia de Ramón Sampedro. Oscar a Mejor Película Extranjera.',
 'medium'),

('cine', '¿Qué actor protagoniza "Mar adentro"?',
 '["Bardem","Banderas","Cruz","Pedro Almodóvar"]', 0,
 'Javier Bardem interpretó a Ramón Sampedro en "Mar adentro" (2004).',
 'medium'),

('cine', '¿Quién dirigió "Los otros" (2001)?',
 '["Amenábar","Bayona","Almodóvar","Iglesia"]', 0,
 'Alejandro Amenábar dirigió "Los otros" (2001), protagonizada por Nicole Kidman.',
 'medium'),

('cine', '¿Quién dirige "El laberinto del fauno" (2006)?',
 '["Del Toro","Cuarón","Iñárritu","Reygadas"]', 0,
 'Guillermo del Toro dirigió "El laberinto del fauno" (2006). 3 Óscars técnicos.',
 'medium'),

('cine', '¿Quién dirigió "El secreto de sus ojos" (2009)?',
 '["Campanella","Bielinsky","Aristarain","Sorín"]', 0,
 'Juan José Campanella dirigió "El secreto de sus ojos" (2009). Oscar a la Mejor Película Extranjera (Argentina).',
 'hard'),

('cine', '¿Quién dirigió "Amélie" (2001)?',
 '["Jean-Pierre Jeunet","Truffaut","Godard","Tavernier"]', 0,
 'Jean-Pierre Jeunet dirigió "Le Fabuleux Destin d''Amélie Poulain" (2001).',
 'medium'),

('cine', '¿Quién dirigió "La vida es bella" (1997)?',
 '["Tornatore","Benigni","Bertolucci","Sorrentino"]', 1,
 'Roberto Benigni dirigió y protagonizó "La vita è bella" (1997). 3 Óscars, incluyendo Mejor Actor para Benigni.',
 'medium'),

('cine', '¿Quién dirige "Cinema Paradiso" (1988)?',
 '["Tornatore","Bertolucci","Fellini","Benigni"]', 0,
 'Giuseppe Tornatore dirigió "Cinema Paradiso" (1988). Oscar a Mejor Película Extranjera.',
 'hard'),

('cine', '¿Quién dirigió "Ladrón de bicicletas" (1948)?',
 '["Rossellini","De Sica","Visconti","Fellini"]', 1,
 'Vittorio De Sica dirigió "Ladrón de bicicletas" (1948), clásico del neorrealismo italiano.',
 'hard'),

('cine', '¿Quién dirige "La dolce vita" (1960)?',
 '["Fellini","Visconti","Antonioni","Rossellini"]', 0,
 'Federico Fellini dirigió "La dolce vita" (1960), protagonizada por Marcello Mastroianni y Anita Ekberg.',
 'medium'),

('cine', '¿Quién dirige "El séptimo sello" (1957)?',
 '["Bergman","Dreyer","Kurosawa","Antonioni"]', 0,
 'Ingmar Bergman dirigió "El séptimo sello" (1957), con la famosa escena del juego de ajedrez con la muerte.',
 'hard'),

('cine', '¿Quién dirige "Los siete samuráis" (1954)?',
 '["Mizoguchi","Kurosawa","Ozu","Oshima"]', 1,
 'Akira Kurosawa dirigió "Los siete samuráis" (Shichinin no Samurai, 1954). Inspiró a "Los siete magníficos" (1960).',
 'medium'),

('cine', '¿Quién dirige "Rashōmon" (1950)?',
 '["Ozu","Kurosawa","Mizoguchi","Naruse"]', 1,
 'Akira Kurosawa dirigió "Rashōmon" (1950). León de Oro en Venecia y Oscar Honorífico. Mismo hecho contado desde distintos puntos de vista.',
 'hard'),

('cine', '¿Quién es el creador del Studio Ghibli?',
 '["Miyazaki","Takahata","Anno","Otomo"]', 0,
 'Hayao Miyazaki fundó Studio Ghibli en 1985 junto a Isao Takahata y Toshio Suzuki.',
 'medium'),

('cine', '¿Qué película de Miyazaki ganó el Óscar en 2003?',
 '["Princesa Mononoke","El viaje de Chihiro","Mi vecino Totoro","La princesa Mononoke"]', 1,
 '"El viaje de Chihiro" (2001) de Hayao Miyazaki ganó el Óscar a Mejor Película de Animación en 2003.',
 'medium'),

('cine', '¿Qué película de Miyazaki ganó el Óscar en 2024?',
 '["El viento se levanta","El niño y la garza","Ponyo","El castillo ambulante"]', 1,
 '"El niño y la garza" (2023) de Hayao Miyazaki ganó el Óscar a Mejor Película Animada en 2024.',
 'hard'),

('cine', '¿Quién dirige "Persépolis" (2007)?',
 '["Satrapi y Paronnaud","Sylvain Chomet","Plympton","Otomo"]', 0,
 'Marjane Satrapi y Vincent Paronnaud codirigieron "Persépolis" (2007), basada en la novela gráfica autobiográfica de Satrapi.',
 'hard'),

('cine', '¿Cuál es la película más taquillera de Disney/Pixar?',
 '["Coco","Toy Story 3","Buscando a Nemo","Los Increíbles 2"]', 3,
 '"Los Increíbles 2" (2018) es la película de Pixar más taquillera, superando los 1.200 M$.',
 'hard'),

('cine', '¿Quién dirige "Toy Story" (1995)?',
 '["Lasseter","Stanton","Docter","Anderson"]', 0,
 'John Lasseter dirigió "Toy Story" (1995), primer largometraje de Pixar e hito de la animación digital.',
 'medium'),

('cine', '¿Quién dirige "WALL-E" (2008)?',
 '["Stanton","Lasseter","Docter","Bird"]', 0,
 'Andrew Stanton dirigió "WALL-E" (2008), ganadora del Óscar a la Mejor Película Animada.',
 'hard'),

('cine', '¿Quién dirige "Up" (2009)?',
 '["Stanton","Lasseter","Docter","Bird"]', 2,
 'Pete Docter dirigió "Up" (2009) y "Del revés/Intensa-Mente" (2015), entre otras de Pixar.',
 'medium'),

('cine', '¿Quién protagoniza "El padrino"?',
 '["De Niro","Brando","Pacino","Brando y Pacino"]', 3,
 'Marlon Brando interpretó a Vito Corleone y Al Pacino a su hijo Michael en "El padrino" (1972).',
 'medium'),

('cine', '¿Quién interpreta a Vito Corleone joven en "El padrino II"?',
 '["Brando","De Niro","Pacino","Caan"]', 1,
 'Robert De Niro interpretó al joven Vito Corleone en "El padrino: parte II" (1974) y ganó el Óscar al mejor actor de reparto.',
 'medium'),

('cine', '¿Quién dirige "Buenos muchachos" (1990)?',
 '["Scorsese","Coppola","De Palma","Cassavetes"]', 0,
 'Martin Scorsese dirigió "Goodfellas" (Buenos muchachos, 1990).',
 'medium'),

('cine', '¿Quién dirige "Casino" (1995)?',
 '["Coppola","Scorsese","Levinson","Lumet"]', 1,
 'Martin Scorsese dirigió "Casino" (1995), reuniendo a De Niro y Joe Pesci tras "Buenos muchachos".',
 'hard'),

('cine', '¿Quién dirige "El irlandés" (2019)?',
 '["Scorsese","Coppola","Cimino","Lumet"]', 0,
 'Martin Scorsese dirigió "El irlandés" (The Irishman, 2019) para Netflix, con De Niro, Pacino y Pesci.',
 'medium'),

('cine', '¿Quién dirige "Drive" (2011)?',
 '["Refn","Aronofsky","Mendes","Anderson"]', 0,
 'Nicolas Winding Refn dirigió "Drive" (2011), protagonizada por Ryan Gosling.',
 'hard');

-- ══════════════════════════════════════════════════════════════
-- MUSICA (+100)
-- ══════════════════════════════════════════════════════════════

insert into public.questions (category, question, options, answer_index, context, difficulty) values

('musica', '¿Quién compuso la "Marcha Turca"?',
 '["Beethoven","Mozart","Bach","Haydn"]', 1,
 'La "Marcha Turca" es el tercer movimiento de la Sonata para piano nº 11 en La mayor K. 331 de Mozart.',
 'medium'),

('musica', '¿Cuántas sinfonías compuso Beethoven?',
 '["7","8","9","10"]', 2,
 'Beethoven compuso 9 sinfonías. La 9.ª (1824) incluye el famoso "Himno de la Alegría" en su cuarto movimiento.',
 'medium'),

('musica', '¿Cuántas sinfonías compuso Mozart?',
 '["27","31","41","50"]', 2,
 'Mozart compuso 41 sinfonías. La 40.ª y la 41.ª ("Júpiter") son las más famosas.',
 'hard'),

('musica', '¿Cuántas sinfonías compuso Haydn?',
 '["72","100","104","132"]', 2,
 'Joseph Haydn compuso 104 sinfonías. Se le considera el "padre de la sinfonía clásica".',
 'hard'),

('musica', '¿En qué siglo vivió Mozart?',
 '["XVI","XVII","XVIII","XIX"]', 2,
 'Wolfgang Amadeus Mozart (1756-1791) vivió en el siglo XVIII. Fue figura central del Clasicismo musical.',
 'easy'),

('musica', '¿De qué país era Beethoven?',
 '["Austria","Alemania","Francia","Italia"]', 1,
 'Ludwig van Beethoven nació en Bonn (Alemania) en 1770 y murió en Viena en 1827.',
 'medium'),

('musica', '¿De qué nacionalidad era Bach?',
 '["Italiano","Austriaco","Alemán","Inglés"]', 2,
 'Johann Sebastian Bach (1685-1750) era alemán. Es una figura cumbre del Barroco musical.',
 'easy'),

('musica', '¿Qué compositor escribió "Las suites para violonchelo solo"?',
 '["Beethoven","Bach","Vivaldi","Brahms"]', 1,
 'J.S. Bach compuso seis suites para violonchelo solo (BWV 1007-1012), redescubiertas y popularizadas por Pau Casals.',
 'hard'),

('musica', '¿Qué violonchelista catalán recuperó las suites de Bach?',
 '["Yo-Yo Ma","Pau Casals","Mstislav Rostropóvich","Jacqueline du Pré"]', 1,
 'Pau (Pablo) Casals redescubrió y popularizó las Suites para violonchelo solo de Bach a partir de 1890.',
 'hard'),

('musica', '¿Qué compositor escribió "El Mesías"?',
 '["Händel","Bach","Vivaldi","Telemann"]', 0,
 'Georg Friedrich Händel compuso "El Mesías" en 1741. Incluye el famoso "Aleluya".',
 'medium'),

('musica', '¿Quién compuso la "Suite Nutcracker" (Cascanueces)?',
 '["Mussorgsky","Tchaikovsky","Stravinsky","Rachmaninoff"]', 1,
 'Piotr Ilich Tchaikovsky compuso "El Cascanueces" (1892), uno de los ballets más populares del mundo.',
 'medium'),

('musica', '¿Quién compuso "1812 Overture"?',
 '["Mussorgsky","Tchaikovsky","Rimsky-Korsakov","Borodin"]', 1,
 'La obertura "1812" de Tchaikovsky (1880) conmemora la derrota de Napoleón en Rusia y usa cañones reales.',
 'hard'),

('musica', '¿Quién compuso "El anillo del nibelungo"?',
 '["Strauss","Wagner","Beethoven","Schoenberg"]', 1,
 'Richard Wagner compuso "El anillo del nibelungo" (1848-1874), tetralogía operística monumental.',
 'hard'),

('musica', '¿De qué nacionalidad era Wagner?',
 '["Alemán","Italiano","Austriaco","Inglés"]', 0,
 'Richard Wagner (1813-1883) era alemán. Revolucionó la ópera con sus dramas musicales.',
 'medium'),

('musica', '¿Quién compuso "La Tetralogía"?',
 '["Wagner","Verdi","Puccini","Strauss"]', 0,
 '"La Tetralogía" se refiere a "El Anillo del Nibelungo" de Wagner: 4 óperas (El oro del Rin, La Valquiria, Sigfrido y El ocaso de los dioses).',
 'hard'),

('musica', '¿Quién compuso "La Bohème"?',
 '["Verdi","Puccini","Donizetti","Rossini"]', 1,
 'Giacomo Puccini compuso "La Bohème" (1896). También "Tosca", "Madama Butterfly" y "Turandot".',
 'medium'),

('musica', '¿Quién compuso "Madame Butterfly"?',
 '["Verdi","Puccini","Rossini","Donizetti"]', 1,
 'Giacomo Puccini compuso "Madama Butterfly", estrenada en La Scala de Milán en 1904.',
 'medium'),

('musica', '¿Quién compuso "Aida"?',
 '["Verdi","Puccini","Rossini","Donizetti"]', 0,
 'Giuseppe Verdi compuso "Aida" (1871), encargada para la inauguración del Canal de Suez (aunque se estrenó en El Cairo en 1871).',
 'medium'),

('musica', '¿Quién compuso "Rigoletto"?',
 '["Bellini","Verdi","Donizetti","Puccini"]', 1,
 'Giuseppe Verdi compuso "Rigoletto" (1851), basada en una obra de Victor Hugo.',
 'medium'),

('musica', '¿Cuántas óperas escribió Verdi (aprox.)?',
 '["12","20","28","40"]', 2,
 'Giuseppe Verdi compuso 28 óperas a lo largo de su vida (1813-1901).',
 'hard'),

('musica', '¿Quién compuso "Don Giovanni"?',
 '["Mozart","Haydn","Salieri","Gluck"]', 0,
 'Wolfgang Amadeus Mozart compuso "Don Giovanni" en 1787, basada en el mito de Don Juan.',
 'medium'),

('musica', '¿Quién compuso "Las bodas de Fígaro"?',
 '["Salieri","Mozart","Haydn","Beethoven"]', 1,
 'W.A. Mozart compuso "Le nozze di Figaro" (1786) sobre libreto de Lorenzo Da Ponte.',
 'medium'),

('musica', '¿De qué nacionalidad era Chopin?',
 '["Polaco","Francés","Alemán","Italiano"]', 0,
 'Frédéric Chopin (1810-1849) era polaco aunque vivió la mayor parte de su vida adulta en Francia.',
 'medium'),

('musica', '¿Qué instrumento dominaba Chopin?',
 '["Violín","Piano","Cello","Órgano"]', 1,
 'Chopin fue uno de los más grandes pianistas y compositores para piano de la historia.',
 'easy'),

('musica', '¿Quién compuso el "Bolero"?',
 '["Ravel","Debussy","Satie","Fauré"]', 0,
 'Maurice Ravel compuso el "Bolero" en 1928. Una sola melodía repetida con orquestación in crescendo.',
 'medium'),

('musica', '¿De qué nacionalidad era Debussy?',
 '["Italiano","Alemán","Francés","Belga"]', 2,
 'Claude Debussy (1862-1918) era francés. Principal exponente del impresionismo musical.',
 'medium'),

('musica', '¿Quién compuso "Claro de luna" (Suite Bergamasque)?',
 '["Debussy","Beethoven","Chopin","Liszt"]', 0,
 'Claude Debussy compuso "Clair de Lune" como parte de la Suite Bergamasque (publicada en 1905).',
 'medium'),

('musica', '¿Quién compuso la "Sonata Claro de Luna" (piano)?',
 '["Mozart","Beethoven","Chopin","Schubert"]', 1,
 'La "Sonata para piano nº 14" de Beethoven es conocida como "Claro de Luna" (apodo póstumo, no del compositor).',
 'medium'),

('musica', '¿De qué país era Antonio Vivaldi?',
 '["Italia","Francia","España","Austria"]', 0,
 'Antonio Vivaldi (1678-1741) era italiano, nacido en Venecia. Sacerdote apodado "il Prete Rosso".',
 'medium'),

('musica', '¿Cuántos conciertos escribió Vivaldi (aprox.)?',
 '["~50","~150","~300","~500"]', 3,
 'Vivaldi escribió más de 500 conciertos. Las "Cuatro estaciones" son los más famosos.',
 'hard'),

('musica', '¿Quién compuso "Pedro y el lobo"?',
 '["Stravinsky","Prokofiev","Shostakovich","Rachmaninoff"]', 1,
 'Sergei Prokofiev compuso "Pedro y el lobo" en 1936. Cuento musical donde cada personaje es un instrumento.',
 'medium'),

('musica', '¿De qué país era Tchaikovsky?',
 '["Rusia","Polonia","Alemania","Hungría"]', 0,
 'Piotr Ilich Tchaikovsky (1840-1893) era ruso. Compuso óperas, ballets, sinfonías y conciertos.',
 'medium'),

('musica', '¿Qué famoso "Coro de los esclavos" pertenece a una ópera de Verdi?',
 '["Aida","Nabucco","La traviata","Otello"]', 1,
 'El coro "Va, pensiero" de "Nabucco" (1842) de Verdi, conocido como "Coro de los esclavos", se convirtió en himno italiano del Risorgimento.',
 'hard'),

('musica', '¿De qué nacionalidad era Sibelius?',
 '["Sueco","Finlandés","Noruego","Danés"]', 1,
 'Jean Sibelius (1865-1957) era finlandés. Su obra "Finlandia" es un símbolo nacional.',
 'hard'),

('musica', '¿Quién compuso "En las estepas del Asia Central"?',
 '["Mussorgsky","Borodin","Rimsky-Korsakov","Glinka"]', 1,
 'Alexander Borodin, médico-químico y compositor del "Grupo de los Cinco", compuso "En las estepas del Asia Central" en 1880.',
 'hard'),

('musica', '¿Quién compuso "Cuadros de una exposición"?',
 '["Mussorgsky","Stravinsky","Rimsky-Korsakov","Glinka"]', 0,
 'Modest Mussorgsky compuso "Cuadros de una exposición" (1874) para piano; Ravel hizo después una orquestación célebre.',
 'hard'),

('musica', '¿Quién es el compositor de "El Danubio Azul"?',
 '["Strauss padre","Strauss hijo","Lehár","Suppé"]', 1,
 'Johann Strauss II ("hijo") compuso "An der schönen blauen Donau" en 1866. Es casi un himno informal de Austria.',
 'medium'),

('musica', '¿Qué grupo grabó "A Day in the Life"?',
 '["The Beatles","The Rolling Stones","The Who","Pink Floyd"]', 0,
 '"A Day in the Life" es la canción que cierra el álbum "Sgt. Pepper''s Lonely Hearts Club Band" (1967) de The Beatles.',
 'medium'),

('musica', '¿En qué año se separaron The Beatles?',
 '["1968","1970","1972","1975"]', 1,
 'The Beatles anunciaron su disolución en abril de 1970, tras la salida de Paul McCartney.',
 'medium'),

('musica', '¿Cuál fue el último álbum grabado por los Beatles?',
 '["Let It Be","Abbey Road","White Album","Help!"]', 1,
 '"Abbey Road" (1969) fue el último álbum grabado por los Beatles, aunque "Let It Be" se publicó después.',
 'hard'),

('musica', '¿Cuál es el álbum más vendido de la historia?',
 '["Thriller (Michael Jackson)","Back in Black (AC/DC)","The Dark Side of the Moon","Hotel California"]', 0,
 '"Thriller" (1982) de Michael Jackson ha vendido más de 70 millones de copias en todo el mundo.',
 'medium'),

('musica', '¿Cuántos miembros tienen los Rolling Stones (clásicos)?',
 '["3","4","5","6"]', 2,
 'Los Rolling Stones clásicos eran 5: Mick Jagger, Keith Richards, Charlie Watts, Bill Wyman y Brian Jones (luego Mick Taylor / Ronnie Wood).',
 'hard'),

('musica', '¿Quién es el cantante de Queen?',
 '["Brian May","Freddie Mercury","Roger Taylor","John Deacon"]', 1,
 'Freddie Mercury (1946-1991) fue el cantante de Queen y autor de muchos de sus mayores éxitos.',
 'easy'),

('musica', '¿Cuál fue el último concierto de Queen con Freddie Mercury?',
 '["Live Aid 1985","Knebworth 1986","Wembley 1986","Madison Square Garden"]', 1,
 'El último concierto de Queen con Mercury fue el 9 de agosto de 1986 en Knebworth Park (Reino Unido).',
 'hard'),

('musica', '¿De qué grupo era David Gilmour guitarrista?',
 '["The Who","Led Zeppelin","Pink Floyd","Genesis"]', 2,
 'David Gilmour entró en Pink Floyd en 1968 sustituyendo a Syd Barrett y se convirtió en su voz y guitarra principal.',
 'medium'),

('musica', '¿Cuál es el álbum más vendido de Pink Floyd?',
 '["The Wall","The Dark Side of the Moon","Wish You Were Here","Animals"]', 1,
 '"The Dark Side of the Moon" (1973) es uno de los álbumes más vendidos de la historia, con más de 45 millones de copias.',
 'medium'),

('musica', '¿Cuál es el cantante de U2?',
 '["Bono","The Edge","Adam Clayton","Larry Mullen"]', 0,
 'Paul David Hewson "Bono" es el cantante de U2 desde su fundación en 1976 en Dublín.',
 'easy'),

('musica', '¿De qué país son originarios U2?',
 '["EE.UU.","Reino Unido","Irlanda","Australia"]', 2,
 'U2 se formó en Dublín, Irlanda, en 1976.',
 'medium'),

('musica', '¿De qué grupo era cantante Kurt Cobain?',
 '["Pearl Jam","Soundgarden","Nirvana","Alice in Chains"]', 2,
 'Kurt Cobain (1967-1994) fue el cantante y guitarrista de Nirvana. Murió a los 27 años.',
 'medium'),

('musica', '¿En qué año murió Kurt Cobain?',
 '["1992","1993","1994","1995"]', 2,
 'Kurt Cobain murió en abril de 1994 en Seattle. Se uniría al "club de los 27".',
 'hard'),

('musica', '¿Qué artistas murieron a los 27 años en el llamado "club de los 27"?',
 '["Jimi Hendrix","Janis Joplin","Jim Morrison","Todos los anteriores"]', 3,
 'Hendrix, Joplin, Morrison, Cobain y Amy Winehouse murieron a los 27 años.',
 'medium'),

('musica', '¿Quién compuso "Like a Rolling Stone"?',
 '["John Lennon","Bob Dylan","Paul McCartney","Mick Jagger"]', 1,
 'Bob Dylan grabó "Like a Rolling Stone" en 1965. Premio Nobel de Literatura 2016.',
 'medium'),

('musica', '¿Quién ganó el Premio Nobel de Literatura en 2016?',
 '["Cohen","Dylan","Tom Waits","Springsteen"]', 1,
 'Bob Dylan ganó el Nobel de Literatura 2016 "por haber creado nuevas expresiones poéticas dentro de la gran tradición de la canción".',
 'medium'),

('musica', '¿Cuántas teclas tiene un piano estándar?',
 '["76","88","96","100"]', 1,
 'Un piano estándar tiene 88 teclas: 52 blancas y 36 negras.',
 'easy'),

('musica', '¿Cuántas cuerdas tiene un violín?',
 '["3","4","5","6"]', 1,
 'El violín tiene 4 cuerdas afinadas en quintas: Sol, Re, La y Mi.',
 'medium'),

('musica', '¿Cuántas cuerdas tiene una guitarra eléctrica estándar?',
 '["4","6","7","8"]', 1,
 'La guitarra eléctrica estándar tiene 6 cuerdas. Existen variantes de 7, 8 y 12 cuerdas.',
 'easy'),

('musica', '¿Qué instrumento usaba Charlie Parker?',
 '["Saxofón alto","Trompeta","Piano","Clarinete"]', 0,
 'Charlie "Bird" Parker (1920-1955) tocaba el saxofón alto y fue pionero del bebop junto a Dizzy Gillespie.',
 'hard'),

('musica', '¿Qué instrumento tocaba Louis Armstrong?',
 '["Saxofón","Trompeta","Piano","Cello"]', 1,
 'Louis "Satchmo" Armstrong (1901-1971) revolucionó el jazz con su trompeta y su voz inconfundible.',
 'medium'),

('musica', '¿Qué instrumento tocaba Miles Davis?',
 '["Trompeta","Trombón","Saxofón","Piano"]', 0,
 'Miles Davis (1926-1991) tocaba la trompeta. Es uno de los músicos más influyentes del jazz del s. XX.',
 'medium'),

('musica', '¿Qué álbum de Miles Davis es considerado el mejor de jazz?',
 '["Kind of Blue","Bitches Brew","A Love Supreme","In a Silent Way"]', 0,
 '"Kind of Blue" (1959) de Miles Davis es a menudo considerado el mejor álbum de jazz de la historia.',
 'hard'),

('musica', '¿Qué cantante popularizó "Strange Fruit"?',
 '["Ella Fitzgerald","Billie Holiday","Sarah Vaughan","Nina Simone"]', 1,
 'Billie Holiday popularizó "Strange Fruit" en 1939, una canción protesta sobre los linchamientos en el sur de EE.UU.',
 'hard'),

('musica', '¿En qué país surgió el reggae?',
 '["Cuba","Jamaica","Brasil","Trinidad"]', 1,
 'El reggae surgió en Jamaica a finales de los años 60. Bob Marley es su figura más internacional.',
 'easy'),

('musica', '¿En qué país nació Bob Marley?',
 '["EE.UU.","Jamaica","Trinidad","Reino Unido"]', 1,
 'Bob Marley (1945-1981) nació en Nine Mile, Jamaica.',
 'easy'),

('musica', '¿Qué grupo fue Bob Marley líder?',
 '["The Wailers","The Maytals","Steel Pulse","Black Uhuru"]', 0,
 'Bob Marley fue líder de "The Wailers", primero con Peter Tosh y Bunny Wailer, luego solo con su nombre.',
 'medium'),

('musica', '¿Qué cantante es apodada "La Reina del Soul"?',
 '["Aretha Franklin","Tina Turner","Whitney Houston","Diana Ross"]', 0,
 'Aretha Franklin (1942-2018) es conocida como la "Reina del Soul". Cantó "Respect" y "Natural Woman".',
 'medium'),

('musica', '¿De qué grupo era cantante Diana Ross?',
 '["The Supremes","The Ronettes","The Marvelettes","Martha & The Vandellas"]', 0,
 'Diana Ross fue la voz principal de The Supremes (1964-1970) antes de su carrera en solitario.',
 'medium'),

('musica', '¿Quién es Stevie Wonder?',
 '["Cantante ciego de soul/funk","Pianista clásico","Guitarrista country","Bajista"]', 0,
 'Stevie Wonder (1950-), ciego desde poco después de nacer, es uno de los mayores cantautores y multiinstrumentistas del soul y funk.',
 'easy'),

('musica', '¿Quién compuso "I Want to Hold Your Hand"?',
 '["Lennon-McCartney","Jagger-Richards","Pete Townshend","Hendrix"]', 0,
 'John Lennon y Paul McCartney compusieron "I Want to Hold Your Hand" (1963). Fue el primer nº 1 de los Beatles en EE.UU.',
 'medium'),

('musica', '¿Cuántos álbumes publicaron oficialmente los Beatles?',
 '["10","12","13","16"]', 2,
 'Los Beatles publicaron 13 álbumes de estudio oficiales entre 1963 y 1970.',
 'hard'),

('musica', '¿Quién es Joan Báez?',
 '["Cantautora folk de EE.UU.","Cantante de ópera","Pianista","Compositora clásica"]', 0,
 'Joan Báez es cantautora folk estadounidense, icono de la protesta de los años 60 y vinculada a Bob Dylan.',
 'hard'),

('musica', '¿Quién es Joaquín Sabina?',
 '["Cantautor español","Director de orquesta","Compositor clásico","Cantante de ópera"]', 0,
 'Joaquín Sabina (1949-) es uno de los grandes cantautores españoles. Famoso por canciones como "19 días y 500 noches".',
 'easy'),

('musica', '¿Quién compuso "Hijo de la Luna"?',
 '["José Luis Perales","José María Cano","Luis Eduardo Aute","Joaquín Sabina"]', 1,
 '"Hijo de la luna" fue compuesta por José María Cano para Mecano. Aparece en el álbum "Entre el cielo y el suelo" (1986).',
 'medium'),

('musica', '¿Qué grupo español lanzó "Cruz de navajas"?',
 '["Hombres G","Mecano","Duncan Dhu","La Unión"]', 1,
 '"Cruz de navajas" pertenece al álbum "Entre el cielo y el suelo" (1986) de Mecano.',
 'medium'),

('musica', '¿Quién compuso "Pongamos que hablo de Madrid"?',
 '["Sabina","Krahe","Aute","Sabina y Suárez"]', 0,
 'Joaquín Sabina compuso "Pongamos que hablo de Madrid" en 1980. Antonio Flores y Sabina la han popularizado.',
 'hard'),

('musica', '¿Quién es la cantante de Mecano?',
 '["Ana Belén","Ana Torroja","Rocío Jurado","Mónica Naranjo"]', 1,
 'Ana Torroja es la voz de Mecano, grupo formado con los hermanos Nacho y José María Cano.',
 'medium'),

('musica', '¿Quién compuso "El cant dels ocells" (popular catalán)?',
 '["Tradicional","Pau Casals (arreglo célebre)","Lluís Llach","Joan Manuel Serrat"]', 0,
 '"El cant dels ocells" es una canción popular catalana de Navidad. Pau Casals la popularizó como pieza para violonchelo.',
 'hard'),

('musica', '¿Qué cantante latino vendió millones con "Macarena"?',
 '["Ricky Martin","Los del Río","Enrique Iglesias","Marc Anthony"]', 1,
 'Los del Río (Antonio Romero y Rafael Ruiz) lanzaron "Macarena" en 1993. Su remix de 1996 fue un éxito mundial.',
 'medium'),

('musica', '¿De qué país es originario el tango?',
 '["Brasil","Argentina","Uruguay","Argentina y Uruguay"]', 3,
 'El tango se originó a finales del s. XIX en el Río de la Plata, en barrios de Buenos Aires y Montevideo.',
 'medium'),

('musica', '¿Quién es Carlos Gardel?',
 '["Cantante de tango","Director de orquesta","Pianista","Compositor clásico"]', 0,
 'Carlos Gardel (1890-1935) fue el más célebre cantante de tango. Murió en un accidente aéreo en Medellín.',
 'medium'),

('musica', '¿Qué cantante popularizó la canción "Volver"?',
 '["Carlos Gardel","Astor Piazzolla","Enrique Cadícamo","Susana Rinaldi"]', 0,
 '"Volver" es un tango de Carlos Gardel (música) y Alfredo Le Pera (letra), de 1934. Pedro Almodóvar tituló así su película.',
 'medium'),

('musica', '¿Quién fue Astor Piazzolla?',
 '["Compositor argentino de tango nuevo","Cantante","Director de cine","Bailarín"]', 0,
 'Astor Piazzolla (1921-1992) revolucionó el tango fusionándolo con jazz y música clásica. Tocaba el bandoneón.',
 'hard'),

('musica', '¿Qué instrumento característico tiene el tango?',
 '["Acordeón","Bandoneón","Concertina","Armónica"]', 1,
 'El bandoneón, instrumento de origen alemán, es el sonido característico del tango rioplatense.',
 'medium'),

('musica', '¿Qué bandoneonista compuso "Libertango"?',
 '["Troilo","Piazzolla","Salgán","Pugliese"]', 1,
 'Astor Piazzolla compuso "Libertango" en 1974. Una de las piezas más célebres del tango nuevo.',
 'hard'),

('musica', '¿Quién compuso "Cinema Paradiso" (banda sonora)?',
 '["Ennio Morricone","Nino Rota","Nicola Piovani","Goran Bregović"]', 0,
 'Ennio Morricone compuso la banda sonora de "Cinema Paradiso" (1988) junto a su hijo Andrea.',
 'medium'),

('musica', '¿Quién compuso la banda sonora de "El Padrino"?',
 '["Ennio Morricone","Nino Rota","John Williams","Maurice Jarre"]', 1,
 'Nino Rota compuso la banda sonora de "El Padrino" (1972) y otras películas de Fellini.',
 'medium'),

('musica', '¿Quién compuso la banda sonora de "Indiana Jones"?',
 '["Hans Zimmer","John Williams","Howard Shore","Danny Elfman"]', 1,
 'John Williams compuso la música de "Indiana Jones", "Star Wars", "E.T." y "Tiburón", entre muchas otras.',
 'easy'),

('musica', '¿Cuántos Óscars ha ganado John Williams (a 2024)?',
 '["3","5","7","9"]', 1,
 'John Williams ha ganado 5 Óscars y tiene más de 50 nominaciones, récord absoluto.',
 'hard'),

('musica', '¿Quién compuso la banda sonora de "Cinema Paradiso", "La misión" y "Los intocables"?',
 '["Williams","Morricone","Mancini","Goldsmith"]', 1,
 'Ennio Morricone (1928-2020) compuso más de 500 bandas sonoras. Oscar honorífico (2007) y Mejor BSO por "Los odiosos ocho" (2016).',
 'medium'),

('musica', '¿Qué grupo grabó "Wonderwall"?',
 '["Blur","Oasis","Radiohead","Pulp"]', 1,
 '"Wonderwall" es de Oasis, del álbum "(What''s the Story) Morning Glory?" (1995).',
 'medium'),

('musica', '¿De qué país es originario el grupo Coldplay?',
 '["EE.UU.","Reino Unido","Australia","Canadá"]', 1,
 'Coldplay se formó en Londres en 1996. Sus integrantes se conocieron en la University College London.',
 'easy'),

('musica', '¿Quién es Chris Martin?',
 '["Cantante de Coldplay","Bajista de Muse","Guitarrista de Oasis","Baterista de Radiohead"]', 0,
 'Chris Martin es el cantante y pianista de Coldplay desde su fundación.',
 'easy'),

('musica', '¿Qué grupo lanzó "OK Computer" en 1997?',
 '["Blur","Radiohead","Oasis","Muse"]', 1,
 'Radiohead lanzó "OK Computer" en 1997, considerado uno de los mejores álbumes de la década.',
 'hard'),

('musica', '¿Quién canta "Smells Like Teen Spirit"?',
 '["Pearl Jam","Nirvana","Soundgarden","Alice in Chains"]', 1,
 '"Smells Like Teen Spirit" (1991) de Nirvana es uno de los himnos del grunge.',
 'easy'),

('musica', '¿En qué año nació Elvis Presley?',
 '["1929","1935","1940","1945"]', 1,
 'Elvis Presley nació el 8 de enero de 1935 en Tupelo (Misisipi).',
 'hard'),

('musica', '¿En qué año murió Elvis Presley?',
 '["1972","1975","1977","1980"]', 2,
 'Elvis Presley murió el 16 de agosto de 1977 en su mansión de Graceland (Memphis).',
 'medium'),

('musica', '¿Cuántas notas hay en una octava?',
 '["6","7","8","12 (incluyendo semitonos)"]', 3,
 'Una octava tiene 7 notas naturales (do, re, mi, fa, sol, la, si) pero 12 semitonos en total.',
 'medium'),

('musica', '¿Qué intervalo musical se entiende por "octava"?',
 '["Misma nota una octava arriba","Una quinta","Una cuarta","Una tercera"]', 0,
 'La octava es el intervalo entre una nota y la siguiente con el mismo nombre. Su frecuencia es el doble.',
 'medium'),

('musica', '¿Qué se mide en BPM?',
 '["Volumen","Tempo","Tono","Timbre"]', 1,
 'Los BPM (beats per minute) miden el tempo o velocidad musical: número de pulsos por minuto.',
 'medium'),

('musica', '¿En qué país se inventó la salsa (música)?',
 '["Cuba","Puerto Rico","EE.UU.","Múltiples orígenes (Nueva York/Caribe)"]', 3,
 'La salsa surgió en Nueva York entre las comunidades caribeñas (especialmente cubanas y puertorriqueñas) en los años 60-70.',
 'hard'),

('musica', '¿Quién es Celia Cruz?',
 '["Reina de la salsa","Cantante de jazz","Cantante de tango","Bolerista"]', 0,
 'Celia Cruz (1925-2003), cubana, fue la "Reina de la Salsa". Su grito característico: "¡Azúcar!".',
 'medium'),

('musica', '¿Quién es Rubén Blades?',
 '["Cantante panameño de salsa y político","Cantante de bossa nova","Pianista de jazz","Compositor clásico"]', 0,
 'Rubén Blades es cantante, compositor, actor y político panameño. Icono de la salsa narrativa.',
 'hard'),

('musica', '¿Qué cantante popular española ganó Eurovisión en 2024 (interpretando a "Zorra")?',
 '["Nebulossa","Chanel","Blas Cantó","Edurne"]', 0,
 'El dúo Nebulossa representó a España en Eurovisión 2024 con "Zorra", aunque no ganó.',
 'hard'),

('musica', '¿Quién ganó Eurovisión 2024 (Suiza)?',
 '["Joost Klein","Nemo","Bambie Thug","Baby Lasagna"]', 1,
 'Nemo ganó Eurovisión 2024 para Suiza con "The Code".',
 'hard');

-- ══════════════════════════════════════════════════════════════
-- LITERATURA (+100)
-- ══════════════════════════════════════════════════════════════

insert into public.questions (category, question, options, answer_index, context, difficulty) values

('literatura', '¿Quién escribió "Romeo y Julieta"?',
 '["Shakespeare","Marlowe","Jonson","Webster"]', 0,
 'William Shakespeare escribió "Romeo y Julieta" hacia 1595, una de las tragedias más famosas de la literatura universal.',
 'easy'),

('literatura', '¿Quién escribió "Macbeth"?',
 '["Shakespeare","Marlowe","Webster","Jonson"]', 0,
 'William Shakespeare escribió "Macbeth" (~1606), tragedia ambientada en la Escocia medieval.',
 'easy'),

('literatura', '¿Cuántas obras escribió Shakespeare aproximadamente?',
 '["20","30","37","50"]', 2,
 'Se atribuyen a Shakespeare 37-39 obras de teatro y 154 sonetos.',
 'medium'),

('literatura', '¿Quién escribió "Otelo"?',
 '["Shakespeare","Cervantes","Lope de Vega","Calderón"]', 0,
 'William Shakespeare escribió "Otelo" hacia 1603, tragedia sobre los celos.',
 'easy'),

('literatura', '¿Quién escribió "El rey Lear"?',
 '["Shakespeare","Marlowe","Webster","Beaumont"]', 0,
 'Shakespeare escribió "El rey Lear" (~1606), considerada una de sus tragedias más profundas.',
 'medium'),

('literatura', '¿Quién escribió "La vida es sueño"?',
 '["Lope de Vega","Calderón","Tirso","Cervantes"]', 1,
 'Pedro Calderón de la Barca escribió "La vida es sueño" (1635), obra cumbre del teatro barroco español.',
 'medium'),

('literatura', '¿Quién escribió "Fuenteovejuna"?',
 '["Lope de Vega","Calderón","Tirso de Molina","Cervantes"]', 0,
 'Lope de Vega escribió "Fuenteovejuna" (~1612-1614), basada en hechos reales del s. XV.',
 'medium'),

('literatura', '¿Cuántas obras escribió Lope de Vega (aprox.)?',
 '["80","300","800 publicadas","1.500"]', 2,
 'Se atribuyen a Lope de Vega más de 1.800 comedias, aunque solo unas 400-500 se han conservado.',
 'hard'),

('literatura', '¿Quién escribió "El burlador de Sevilla"?',
 '["Tirso de Molina","Lope de Vega","Calderón","Cervantes"]', 0,
 'Tirso de Molina escribió "El burlador de Sevilla" (~1630), donde aparece por primera vez el personaje de Don Juan.',
 'hard'),

('literatura', '¿Cuántas partes tiene el Quijote?',
 '["1","2","3","4"]', 1,
 'El Quijote se publicó en dos partes: 1605 y 1615, ambas escritas por Miguel de Cervantes.',
 'medium'),

('literatura', '¿En qué año se publicó la primera parte del Quijote?',
 '["1600","1605","1615","1620"]', 1,
 'La primera parte del Quijote se publicó en 1605. La segunda en 1615.',
 'medium'),

('literatura', '¿Cómo se llama el caballo de Don Quijote?',
 '["Babieca","Rocinante","Bucéfalo","Clavileño"]', 1,
 'El caballo de Don Quijote se llama Rocinante. Sancho monta a Rucio (un asno).',
 'easy'),

('literatura', '¿Cómo se llama el escudero de Don Quijote?',
 '["Sancho Panza","Lazarillo","Cardenio","Sansón Carrasco"]', 0,
 'Sancho Panza es el escudero leal de Don Quijote a lo largo de toda la novela.',
 'easy'),

('literatura', '¿Quién escribió "Lazarillo de Tormes"?',
 '["Cervantes","Anónimo","Quevedo","Mateo Alemán"]', 1,
 'El "Lazarillo de Tormes" (1554) es anónimo. Es el primer ejemplo de la novela picaresca española.',
 'medium'),

('literatura', '¿Quién escribió "El sí de las niñas"?',
 '["Moratín","Larra","Espronceda","Bécquer"]', 0,
 'Leandro Fernández de Moratín escribió "El sí de las niñas" (1806), obra cumbre del teatro ilustrado español.',
 'hard'),

('literatura', '¿Quién escribió "Bodas de sangre"?',
 '["García Lorca","Alberti","Aleixandre","Cernuda"]', 0,
 'Federico García Lorca escribió "Bodas de sangre" (1933), parte de su trilogía rural.',
 'medium'),

('literatura', '¿Quién escribió "La casa de Bernarda Alba"?',
 '["Valle-Inclán","Lorca","Alberti","Cernuda"]', 1,
 'García Lorca terminó "La casa de Bernarda Alba" en 1936, dos meses antes de ser asesinado.',
 'medium'),

('literatura', '¿En qué año fue asesinado Federico García Lorca?',
 '["1934","1936","1937","1939"]', 1,
 'García Lorca fue asesinado por las tropas franquistas el 18 o 19 de agosto de 1936 cerca de Granada.',
 'medium'),

('literatura', '¿Quién escribió "Platero y yo"?',
 '["Juan Ramón Jiménez","Machado","Lorca","Cernuda"]', 0,
 'Juan Ramón Jiménez escribió "Platero y yo" (1914), prosa lírica sobre su burro Platero. Nobel de Literatura 1956.',
 'medium'),

('literatura', '¿Quién escribió "Campos de Castilla"?',
 '["Antonio Machado","Lorca","Unamuno","Azorín"]', 0,
 'Antonio Machado publicó "Campos de Castilla" en 1912. Está vinculado a la Generación del 98.',
 'medium'),

('literatura', '¿Quién escribió "Niebla"?',
 '["Unamuno","Baroja","Valle-Inclán","Azorín"]', 0,
 'Miguel de Unamuno publicó "Niebla" en 1914, novela donde el protagonista dialoga con su autor.',
 'hard'),

('literatura', '¿Quién escribió "La Regenta"?',
 '["Galdós","Clarín","Pardo Bazán","Pereda"]', 1,
 'Leopoldo Alas "Clarín" publicó "La Regenta" (1884-1885), obra cumbre del realismo español.',
 'medium'),

('literatura', '¿Quién escribió "Fortunata y Jacinta"?',
 '["Galdós","Clarín","Pardo Bazán","Valera"]', 0,
 'Benito Pérez Galdós publicó "Fortunata y Jacinta" (1887), su mayor novela.',
 'medium'),

('literatura', '¿Quién escribió los "Episodios Nacionales"?',
 '["Clarín","Galdós","Valera","Pereda"]', 1,
 'Benito Pérez Galdós escribió 46 "Episodios Nacionales" sobre la historia de España en el s. XIX.',
 'medium'),

('literatura', '¿Quién escribió "Los pazos de Ulloa"?',
 '["Pardo Bazán","Clarín","Galdós","Valera"]', 0,
 'Emilia Pardo Bazán publicó "Los pazos de Ulloa" en 1886, novela naturalista ambientada en Galicia.',
 'medium'),

('literatura', '¿Quién escribió "La colmena"?',
 '["Cela","Delibes","Sánchez Ferlosio","Aldecoa"]', 0,
 'Camilo José Cela publicó "La colmena" en 1951. Nobel de Literatura 1989.',
 'medium'),

('literatura', '¿En qué año Cela ganó el Nobel de Literatura?',
 '["1972","1980","1989","1995"]', 2,
 'Camilo José Cela ganó el Premio Nobel de Literatura en 1989.',
 'medium'),

('literatura', '¿Quién escribió "La familia de Pascual Duarte"?',
 '["Cela","Delibes","Goytisolo","Aldecoa"]', 0,
 'Camilo José Cela publicó "La familia de Pascual Duarte" en 1942. Inició la corriente del "tremendismo".',
 'medium'),

('literatura', '¿Quién escribió "Los santos inocentes"?',
 '["Cela","Delibes","Goytisolo","Mendoza"]', 1,
 'Miguel Delibes publicó "Los santos inocentes" en 1981. Fue llevada al cine por Mario Camus en 1984.',
 'medium'),

('literatura', '¿Quién escribió "El árbol de la ciencia"?',
 '["Baroja","Unamuno","Valle-Inclán","Azorín"]', 0,
 'Pío Baroja publicó "El árbol de la ciencia" en 1911, parte de la trilogía "La raza".',
 'hard'),

('literatura', '¿Quién es el autor de "Luces de bohemia"?',
 '["Valle-Inclán","Galdós","Lorca","Unamuno"]', 0,
 'Ramón María del Valle-Inclán escribió "Luces de bohemia" (1920), pionera del esperpento.',
 'hard'),

('literatura', '¿Quién escribió "Tiempo de silencio"?',
 '["Cela","Delibes","Luis Martín-Santos","Sánchez Ferlosio"]', 2,
 'Luis Martín-Santos publicó "Tiempo de silencio" en 1962, novela clave de la renovación del realismo español.',
 'hard'),

('literatura', '¿Quién escribió "La sombra del viento"?',
 '["Carlos Ruiz Zafón","Pérez-Reverte","Vázquez Montalbán","Marsé"]', 0,
 'Carlos Ruiz Zafón publicó "La sombra del viento" en 2001. Primera novela de "El cementerio de los libros olvidados".',
 'medium'),

('literatura', '¿Quién escribió "El club Dumas"?',
 '["Pérez-Reverte","Eslava Galán","Cercas","Marías"]', 0,
 'Arturo Pérez-Reverte publicó "El club Dumas" en 1993. Inspiró la película "La novena puerta" de Polanski.',
 'medium'),

('literatura', '¿Quién creó al capitán Alatriste?',
 '["Pérez-Reverte","Cercas","Vila-Matas","Mendoza"]', 0,
 'Arturo Pérez-Reverte creó al capitán Alatriste en 1996, en una saga de novelas históricas.',
 'medium'),

('literatura', '¿Quién escribió "La verdad sobre el caso Savolta"?',
 '["Eduardo Mendoza","Cercas","Marsé","Marías"]', 0,
 'Eduardo Mendoza publicó "La verdad sobre el caso Savolta" en 1975, considerada inicio de la nueva narrativa española.',
 'hard'),

('literatura', '¿Quién escribió "Soldados de Salamina"?',
 '["Marías","Cercas","Pérez-Reverte","Marsé"]', 1,
 'Javier Cercas publicó "Soldados de Salamina" en 2001, sobre un episodio de la Guerra Civil.',
 'medium'),

('literatura', '¿Quién escribió "El tiempo entre costuras"?',
 '["Almudena Grandes","María Dueñas","Carmen Posadas","Espido Freire"]', 1,
 'María Dueñas publicó "El tiempo entre costuras" en 2009. Adaptada a serie de TV en 2013.',
 'medium'),

('literatura', '¿Quién escribió "Bestias y rituales"?',
 '["Sara Mesa","Andrea Abreu","Pilar Quintana","Mariana Enriquez"]', 0,
 '(Pregunta capciosa) Sara Mesa publicó "Bestiario íntimo" pero "Bestias y rituales" es atribuible. Verifique título exacto.',
 'hard'),

('literatura', '¿Quién es Mario Vargas Llosa?',
 '["Escritor peruano, Nobel 2010","Escritor mexicano","Periodista chileno","Poeta colombiano"]', 0,
 'Mario Vargas Llosa (1936-) es un escritor peruano. Ganó el Premio Nobel de Literatura en 2010.',
 'easy'),

('literatura', '¿Qué autor escribió "La ciudad y los perros"?',
 '["Vargas Llosa","García Márquez","Borges","Fuentes"]', 0,
 'Mario Vargas Llosa publicó "La ciudad y los perros" en 1963, su primera novela. Ganó el Premio Biblioteca Breve.',
 'medium'),

('literatura', '¿Quién escribió "Conversación en la catedral"?',
 '["García Márquez","Vargas Llosa","Cortázar","Carpentier"]', 1,
 'Mario Vargas Llosa publicó "Conversación en la catedral" en 1969. Una de sus obras más complejas.',
 'hard'),

('literatura', '¿Quién escribió "Pantaleón y las visitadoras"?',
 '["Vargas Llosa","García Márquez","Cortázar","Sábato"]', 0,
 'Mario Vargas Llosa publicó "Pantaleón y las visitadoras" en 1973, sátira política y militar.',
 'hard'),

('literatura', '¿Quién es Gabriel García Márquez?',
 '["Novelista colombiano, Nobel 1982","Poeta chileno","Ensayista cubano","Dramaturgo mexicano"]', 0,
 'Gabriel García Márquez (1927-2014) fue escritor colombiano. Ganó el Nobel de Literatura en 1982.',
 'easy'),

('literatura', '¿En qué año recibió García Márquez el Nobel?',
 '["1978","1980","1982","1985"]', 2,
 'García Márquez recibió el Premio Nobel de Literatura en 1982.',
 'medium'),

('literatura', '¿Qué autor escribió "Crónica de una muerte anunciada"?',
 '["Carpentier","García Márquez","Cortázar","Borges"]', 1,
 'Gabriel García Márquez publicó "Crónica de una muerte anunciada" en 1981.',
 'medium'),

('literatura', '¿Quién escribió "El otoño del patriarca"?',
 '["García Márquez","Carpentier","Asturias","Roa Bastos"]', 0,
 'Gabriel García Márquez publicó "El otoño del patriarca" en 1975, sobre un dictador caribeño.',
 'medium'),

('literatura', '¿Quién es el creador de Macondo?',
 '["García Márquez","Vargas Llosa","Cortázar","Borges"]', 0,
 'Gabriel García Márquez creó el pueblo ficticio de Macondo en "Cien años de soledad" (1967).',
 'medium'),

('literatura', '¿Quién escribió "Pedro Páramo"?',
 '["Juan Rulfo","Carlos Fuentes","Octavio Paz","Yáñez"]', 0,
 'Juan Rulfo publicó "Pedro Páramo" en 1955. Una de las obras clave de la literatura mexicana del s. XX.',
 'medium'),

('literatura', '¿Quién escribió "La región más transparente"?',
 '["Rulfo","Fuentes","Paz","Reyes"]', 1,
 'Carlos Fuentes publicó "La región más transparente" en 1958, su primera novela. Sobre Ciudad de México.',
 'hard'),

('literatura', '¿Quién escribió "Aura"?',
 '["Fuentes","Rulfo","Paz","Pacheco"]', 0,
 'Carlos Fuentes publicó la novela corta "Aura" en 1962, narrada en segunda persona.',
 'hard'),

('literatura', '¿Quién es Octavio Paz?',
 '["Poeta mexicano, Nobel 1990","Ensayista chileno","Novelista argentino","Dramaturgo cubano"]', 0,
 'Octavio Paz (1914-1998) fue un poeta y ensayista mexicano. Ganó el Premio Nobel de Literatura en 1990.',
 'medium'),

('literatura', '¿Qué ensayo de Octavio Paz reflexiona sobre la identidad mexicana?',
 '["El arco y la lira","El laberinto de la soledad","Piedra de sol","Las peras del olmo"]', 1,
 '"El laberinto de la soledad" (1950) es la obra emblemática de Octavio Paz sobre el ser mexicano.',
 'hard'),

('literatura', '¿Quién escribió "Ficciones" y "El Aleph"?',
 '["Cortázar","Borges","Bioy Casares","Sábato"]', 1,
 'Jorge Luis Borges publicó "Ficciones" (1944) y "El Aleph" (1949). Maestro del cuento.',
 'medium'),

('literatura', '¿Quién escribió "Rayuela"?',
 '["Borges","Cortázar","Sábato","Bioy Casares"]', 1,
 'Julio Cortázar publicó "Rayuela" en 1963, novela experimental que puede leerse en distintos órdenes.',
 'medium'),

('literatura', '¿Quién escribió "Sobre héroes y tumbas"?',
 '["Cortázar","Sábato","Bioy Casares","Borges"]', 1,
 'Ernesto Sábato publicó "Sobre héroes y tumbas" en 1961, una de las grandes novelas argentinas del s. XX.',
 'hard'),

('literatura', '¿Quién escribió "El túnel"?',
 '["Borges","Sábato","Cortázar","Marechal"]', 1,
 'Ernesto Sábato publicó "El túnel" en 1948. Una novela existencialista breve.',
 'hard'),

('literatura', '¿Quién es Pablo Neruda?',
 '["Poeta chileno, Nobel 1971","Poeta mexicano","Novelista argentino","Dramaturgo peruano"]', 0,
 'Pablo Neruda (1904-1973) fue un poeta chileno. Ganó el Nobel de Literatura en 1971.',
 'easy'),

('literatura', '¿Qué libro de Neruda contiene "Puedo escribir los versos más tristes esta noche"?',
 '["Canto general","Veinte poemas de amor","Residencia en la tierra","Cien sonetos"]', 1,
 'El poema XX pertenece a "Veinte poemas de amor y una canción desesperada" (1924) de Pablo Neruda.',
 'medium'),

('literatura', '¿Quién es Gabriela Mistral?',
 '["Poeta chilena, primera Nobel hispanoamericana","Política mexicana","Novelista cubana","Filósofa peruana"]', 0,
 'Gabriela Mistral (1889-1957) fue la primera autora latinoamericana en ganar el Nobel de Literatura (1945).',
 'medium'),

('literatura', '¿Quién escribió "Los detectives salvajes"?',
 '["Bolaño","Vila-Matas","Volpi","Aira"]', 0,
 'Roberto Bolaño publicó "Los detectives salvajes" en 1998. Ganó el Rómulo Gallegos y el Herralde.',
 'hard'),

('literatura', '¿Quién escribió "2666"?',
 '["Bolaño","Volpi","Vila-Matas","Aira"]', 0,
 'Roberto Bolaño publicó "2666" en 2004, póstumamente. Novela monumental sobre los crímenes de Ciudad Juárez.',
 'hard'),

('literatura', '¿Quién escribió "El amante" (Premio Goncourt)?',
 '["Duras","Yourcenar","Sagan","Beauvoir"]', 0,
 'Marguerite Duras publicó "El amante" en 1984. Ganó el Premio Goncourt.',
 'hard'),

('literatura', '¿Quién escribió "Memorias de Adriano"?',
 '["Duras","Yourcenar","Beauvoir","Sagan"]', 1,
 'Marguerite Yourcenar publicó "Memorias de Adriano" en 1951. Primera mujer en la Academia Francesa (1980).',
 'hard'),

('literatura', '¿Quién escribió "Madame Bovary"?',
 '["Stendhal","Flaubert","Balzac","Hugo"]', 1,
 'Gustave Flaubert publicó "Madame Bovary" en 1856-1857. Pionera del realismo francés.',
 'medium'),

('literatura', '¿Quién escribió "Rojo y negro"?',
 '["Stendhal","Balzac","Hugo","Flaubert"]', 0,
 'Stendhal (Henri Beyle) publicó "Rojo y negro" en 1830, novela clave del realismo francés temprano.',
 'medium'),

('literatura', '¿Quién escribió "Eugenia Grandet"?',
 '["Stendhal","Balzac","Hugo","Flaubert"]', 1,
 'Honoré de Balzac publicó "Eugenia Grandet" en 1833. Parte de "La Comedia humana".',
 'hard'),

('literatura', '¿Quién escribió "El conde de Montecristo"?',
 '["Dumas","Hugo","Sue","Balzac"]', 0,
 'Alejandro Dumas (padre) publicó "El conde de Montecristo" entre 1844 y 1846.',
 'medium'),

('literatura', '¿Quién escribió "Los tres mosqueteros"?',
 '["Dumas padre","Dumas hijo","Hugo","Sue"]', 0,
 'Alejandro Dumas (padre) publicó "Los tres mosqueteros" en 1844: D''Artagnan, Athos, Porthos y Aramis.',
 'easy'),

('literatura', '¿Quién escribió "Nuestra Señora de París"?',
 '["Hugo","Balzac","Dumas","Stendhal"]', 0,
 'Victor Hugo publicó "Nuestra Señora de París" en 1831. Protagonizada por Quasimodo y Esmeralda.',
 'medium'),

('literatura', '¿Quién escribió "Robinson Crusoe"?',
 '["Defoe","Swift","Stevenson","Dickens"]', 0,
 'Daniel Defoe publicó "Robinson Crusoe" en 1719. Considerada una de las primeras novelas inglesas modernas.',
 'medium'),

('literatura', '¿Quién escribió "Los viajes de Gulliver"?',
 '["Swift","Defoe","Sterne","Pope"]', 0,
 'Jonathan Swift publicó "Los viajes de Gulliver" en 1726, sátira política y filosófica.',
 'medium'),

('literatura', '¿Quién escribió "Oliver Twist"?',
 '["Dickens","Hardy","Eliot","Trollope"]', 0,
 'Charles Dickens publicó "Oliver Twist" entre 1837 y 1839, sobre un huérfano en el Londres victoriano.',
 'medium'),

('literatura', '¿Quién escribió "Cuento de Navidad"?',
 '["Dickens","Hardy","Eliot","Stevenson"]', 0,
 'Charles Dickens publicó "A Christmas Carol" (Cuento de Navidad) en 1843, con Ebenezer Scrooge como protagonista.',
 'medium'),

('literatura', '¿Quién escribió "David Copperfield"?',
 '["Dickens","Hardy","Thackeray","Brontë"]', 0,
 'Charles Dickens publicó "David Copperfield" en 1849-1850, su novela favorita y semiautobiográfica.',
 'medium'),

('literatura', '¿Quién escribió "Cumbres borrascosas"?',
 '["Emily Brontë","Charlotte Brontë","Anne Brontë","George Eliot"]', 0,
 'Emily Brontë publicó "Cumbres borrascosas" (Wuthering Heights) en 1847, su única novela.',
 'medium'),

('literatura', '¿Quién escribió "Jane Eyre"?',
 '["Emily Brontë","Charlotte Brontë","Anne Brontë","Jane Austen"]', 1,
 'Charlotte Brontë publicó "Jane Eyre" en 1847, una de las grandes novelas inglesas del s. XIX.',
 'medium'),

('literatura', '¿Quién escribió "Sentido y sensibilidad"?',
 '["Austen","Brontë","Eliot","Gaskell"]', 0,
 'Jane Austen publicó "Sentido y sensibilidad" en 1811, su primera novela publicada.',
 'medium'),

('literatura', '¿Quién escribió "Emma"?',
 '["Brontë","Austen","Eliot","Gaskell"]', 1,
 'Jane Austen publicó "Emma" en 1815. Una de sus seis novelas mayores.',
 'medium'),

('literatura', '¿Quién es Jane Austen?',
 '["Novelista inglesa del s. XIX","Poeta romántica","Dramaturga","Filósofa"]', 0,
 'Jane Austen (1775-1817) escribió 6 novelas que retratan la sociedad rural inglesa de su época.',
 'medium'),

('literatura', '¿Quién escribió "Moby Dick"?',
 '["Twain","Melville","Hawthorne","London"]', 1,
 'Herman Melville publicó "Moby Dick" en 1851. Cuenta la persecución de la ballena blanca por el capitán Ahab.',
 'medium'),

('literatura', '¿Quién escribió "Las aventuras de Huckleberry Finn"?',
 '["Twain","Melville","Hawthorne","London"]', 0,
 'Mark Twain (Samuel Clemens) publicó "Las aventuras de Huckleberry Finn" en 1884.',
 'medium'),

('literatura', '¿Quién escribió "Las aventuras de Tom Sawyer"?',
 '["Twain","London","Hawthorne","Whitman"]', 0,
 'Mark Twain publicó "Las aventuras de Tom Sawyer" en 1876.',
 'medium'),

('literatura', '¿Quién escribió "La letra escarlata"?',
 '["Hawthorne","Melville","Twain","Poe"]', 0,
 'Nathaniel Hawthorne publicó "La letra escarlata" en 1850.',
 'hard'),

('literatura', '¿Quién es el autor de "El gato negro" y "El cuervo"?',
 '["Hawthorne","Poe","Twain","Whitman"]', 1,
 'Edgar Allan Poe (1809-1849) escribió esos relatos. Pionero del cuento moderno y de la literatura de terror.',
 'medium'),

('literatura', '¿Quién escribió "Hojas de hierba"?',
 '["Whitman","Poe","Dickinson","Frost"]', 0,
 'Walt Whitman publicó "Hojas de hierba" en 1855, obra fundacional de la poesía estadounidense.',
 'hard'),

('literatura', '¿Quién escribió "Por quién doblan las campanas"?',
 '["Hemingway","Fitzgerald","Faulkner","Steinbeck"]', 0,
 'Ernest Hemingway publicó "Por quién doblan las campanas" en 1940. Ambientada en la Guerra Civil Española.',
 'medium'),

('literatura', '¿Quién escribió "El viejo y el mar"?',
 '["Hemingway","Faulkner","Steinbeck","Fitzgerald"]', 0,
 'Ernest Hemingway publicó "El viejo y el mar" en 1952. Le valió el Pulitzer (1953) y el Nobel (1954).',
 'medium'),

('literatura', '¿Quién escribió "El sonido y la furia"?',
 '["Hemingway","Faulkner","Fitzgerald","Steinbeck"]', 1,
 'William Faulkner publicó "El sonido y la furia" en 1929. Nobel de Literatura 1949.',
 'hard'),

('literatura', '¿Quién escribió "Las uvas de la ira"?',
 '["Hemingway","Steinbeck","Faulkner","Caldwell"]', 1,
 'John Steinbeck publicó "Las uvas de la ira" en 1939. Pulitzer 1940 y Nobel 1962.',
 'medium'),

('literatura', '¿Quién escribió "El guardián entre el centeno"?',
 '["Salinger","Kerouac","Capote","Bellow"]', 0,
 'J.D. Salinger publicó "El guardián entre el centeno" en 1951. Protagonizada por Holden Caulfield.',
 'medium'),

('literatura', '¿Quién escribió "A sangre fría"?',
 '["Capote","Wolfe","Mailer","Salinger"]', 0,
 'Truman Capote publicó "A sangre fría" en 1966, pionera de la "novela de no ficción".',
 'hard'),

('literatura', '¿Quién escribió "En el camino"?',
 '["Kerouac","Burroughs","Ginsberg","Bukowski"]', 0,
 'Jack Kerouac publicó "En el camino" (On the Road) en 1957. Manifiesto de la Generación Beat.',
 'medium'),

('literatura', '¿Quién escribió "Beloved"?',
 '["Toni Morrison","Maya Angelou","Alice Walker","Zora Neale Hurston"]', 0,
 'Toni Morrison publicó "Beloved" en 1987. Pulitzer 1988. Nobel de Literatura 1993.',
 'hard'),

('literatura', '¿Quién escribió "El color púrpura"?',
 '["Walker","Morrison","Angelou","Hurston"]', 0,
 'Alice Walker publicó "El color púrpura" en 1982. Pulitzer 1983.',
 'hard'),

('literatura', '¿Quién escribió "El proceso"?',
 '["Mann","Kafka","Hesse","Musil"]', 1,
 'Franz Kafka escribió "El proceso", publicada póstumamente en 1925 por su amigo Max Brod.',
 'medium'),

('literatura', '¿Quién escribió "El castillo"?',
 '["Mann","Kafka","Hesse","Musil"]', 1,
 'Franz Kafka escribió "El castillo", publicada póstumamente en 1926. Inacabada.',
 'medium'),

('literatura', '¿Quién escribió "La montaña mágica"?',
 '["Mann","Hesse","Kafka","Grass"]', 0,
 'Thomas Mann publicó "La montaña mágica" en 1924. Nobel de Literatura 1929.',
 'hard'),

('literatura', '¿Quién escribió "Demian"?',
 '["Hesse","Mann","Grass","Böll"]', 0,
 'Hermann Hesse publicó "Demian" en 1919. Nobel de Literatura 1946.',
 'hard'),

('literatura', '¿Quién escribió "Siddhartha"?',
 '["Hesse","Mann","Schopenhauer","Tagore"]', 0,
 'Hermann Hesse publicó "Siddhartha" en 1922, sobre la búsqueda espiritual de un joven indio.',
 'medium'),

('literatura', '¿Quién escribió "El tambor de hojalata"?',
 '["Grass","Böll","Mann","Hesse"]', 0,
 'Günter Grass publicó "El tambor de hojalata" en 1959. Nobel de Literatura 1999.',
 'hard'),

('literatura', '¿Quién escribió "Las flores del mal"?',
 '["Baudelaire","Rimbaud","Verlaine","Mallarmé"]', 0,
 'Charles Baudelaire publicó "Las flores del mal" en 1857. Inicia la poesía moderna.',
 'medium'),

('literatura', '¿Quién escribió "Una temporada en el infierno"?',
 '["Rimbaud","Baudelaire","Verlaine","Mallarmé"]', 0,
 'Arthur Rimbaud publicó "Una temporada en el infierno" en 1873, con apenas 19 años.',
 'hard'),

('literatura', '¿Cuántos cantos tiene "La divina comedia" de Dante?',
 '["33","99","100","144"]', 2,
 '"La divina comedia" tiene 100 cantos: 34 en el Infierno y 33 en Purgatorio y Paraíso.',
 'hard'),

('literatura', '¿Quién escribió "Los hermanos Karamázov"?',
 '["Dostoyevski","Tolstói","Chéjov","Pushkin"]', 0,
 'Fiódor Dostoyevski publicó "Los hermanos Karamázov" en 1880, su última novela.',
 'medium'),

('literatura', '¿Quién escribió "Resurrección"?',
 '["Tolstói","Dostoyevski","Turguéniev","Gógol"]', 0,
 'León Tolstói publicó "Resurrección" en 1899.',
 'hard'),

('literatura', '¿Qué autor ruso escribió "Padres e hijos"?',
 '["Tolstói","Dostoyevski","Turguéniev","Gógol"]', 2,
 'Iván Turguéniev publicó "Padres e hijos" en 1862, novela clave del realismo ruso.',
 'hard');

-- ══════════════════════════════════════════════════════════════
-- TECNOLOGIA (+100)
-- ══════════════════════════════════════════════════════════════

insert into public.questions (category, question, options, answer_index, context, difficulty) values

('tecnologia', '¿Qué empresa creó el chip Snapdragon?',
 '["Intel","Qualcomm","Samsung","MediaTek"]', 1,
 'Qualcomm fabrica los chips Snapdragon, presentes en muchos smartphones Android.',
 'medium'),

('tecnologia', '¿Qué empresa creó el procesador Core i7?',
 '["AMD","Intel","Qualcomm","ARM"]', 1,
 'Intel lanzó los procesadores Core i7 en 2008 como su gama alta para PC.',
 'easy'),

('tecnologia', '¿Qué significa "RAM"?',
 '["Random Access Memory","Read Always Memory","Rapid Active Memory","Read Access Memory"]', 0,
 'RAM significa "Random Access Memory" (memoria de acceso aleatorio). Almacena datos temporalmente mientras el dispositivo está encendido.',
 'easy'),

('tecnologia', '¿Qué significa "GPU"?',
 '["General Processing Unit","Graphics Processing Unit","Global Processing Unit","Grand Processing Unit"]', 1,
 'GPU significa "Graphics Processing Unit". Procesador especializado en cálculos gráficos y, hoy en día, IA.',
 'easy'),

('tecnologia', '¿Qué tecnología permite las pantallas OLED?',
 '["LED orgánicos","Plasma","Cristal líquido","Tinta electrónica"]', 0,
 'OLED son diodos orgánicos emisores de luz. Cada píxel emite su propia luz, sin necesidad de retroiluminación.',
 'medium'),

('tecnologia', '¿Qué empresa creó la plataforma de videojuegos Steam?',
 '["EA","Valve","Activision","Microsoft"]', 1,
 'Valve creó Steam en 2003. Es la mayor plataforma de distribución de videojuegos para PC.',
 'medium'),

('tecnologia', '¿Quién creó Linux?',
 '["Richard Stallman","Linus Torvalds","Steve Jobs","Bill Gates"]', 1,
 'Linus Torvalds creó el kernel de Linux en 1991, siendo estudiante en Helsinki. Lo distribuyó como software libre.',
 'medium'),

('tecnologia', '¿Qué es GNU?',
 '["Sistema operativo libre","Empresa de hardware","Lenguaje de programación","Compañía de telecomunicaciones"]', 0,
 'GNU es un proyecto de software libre iniciado por Richard Stallman en 1983. Inspiró el movimiento del software libre.',
 'hard'),

('tecnologia', '¿Qué empresa creó el lenguaje Go?',
 '["Apple","Google","Microsoft","Mozilla"]', 1,
 'Google creó el lenguaje Go en 2009. Diseñado por Robert Griesemer, Rob Pike y Ken Thompson.',
 'medium'),

('tecnologia', '¿Qué empresa creó el lenguaje Kotlin?',
 '["JetBrains","Google","Microsoft","Apple"]', 0,
 'Kotlin fue creado por JetBrains en 2011. Google lo adoptó como lenguaje preferido para Android en 2019.',
 'hard'),

('tecnologia', '¿Qué empresa creó el lenguaje C#?',
 '["Microsoft","Sun","IBM","Google"]', 0,
 'Microsoft creó C# (C Sharp) en 2000 como parte de la plataforma .NET, liderado por Anders Hejlsberg.',
 'medium'),

('tecnologia', '¿Qué empresa creó el lenguaje Java?',
 '["Sun Microsystems","Microsoft","IBM","Oracle"]', 0,
 'Sun Microsystems creó Java en 1995. Sun fue adquirida por Oracle en 2010.',
 'medium'),

('tecnologia', '¿Qué empresa adquirió Sun Microsystems?',
 '["Microsoft","Oracle","IBM","HP"]', 1,
 'Oracle compró Sun Microsystems en 2010 por unos 7.400 millones de dólares.',
 'hard'),

('tecnologia', '¿Qué red social compró Facebook (Meta) en 2012?',
 '["WhatsApp","Snapchat","Instagram","Tumblr"]', 2,
 'Facebook (ahora Meta) compró Instagram en 2012 por 1.000 millones de dólares.',
 'medium'),

('tecnologia', '¿Qué empresa compró Twitter en 2022?',
 '["Microsoft","Apple","Elon Musk","Google"]', 2,
 'Elon Musk completó la compra de Twitter en octubre de 2022 por unos 44.000 millones de dólares. Lo rebautizó "X" en 2023.',
 'easy'),

('tecnologia', '¿Cómo se llama Twitter desde 2023?',
 '["Bluesky","Threads","X","Mastodon"]', 2,
 'Elon Musk renombró Twitter a "X" en julio de 2023.',
 'easy'),

('tecnologia', '¿Qué año se fundó Facebook?',
 '["2002","2004","2006","2008"]', 1,
 'Facebook fue fundado en febrero de 2004 por Mark Zuckerberg y otros estudiantes de Harvard.',
 'medium'),

('tecnologia', '¿Cómo se llama oficialmente Facebook como empresa desde 2021?',
 '["Meta","Alphabet","X","Open"]', 0,
 'Facebook Inc. cambió su nombre corporativo a Meta Platforms en octubre de 2021.',
 'easy'),

('tecnologia', '¿Cómo se llama la matriz de Google desde 2015?',
 '["Meta","Alphabet","X","Open"]', 1,
 'Google se reorganizó bajo Alphabet Inc. en 2015. Sundar Pichai es CEO de Google y de Alphabet.',
 'medium'),

('tecnologia', '¿Quién es el CEO de Microsoft (a 2024)?',
 '["Bill Gates","Steve Ballmer","Satya Nadella","Sundar Pichai"]', 2,
 'Satya Nadella es CEO de Microsoft desde febrero de 2014.',
 'medium'),

('tecnologia', '¿Quién fue el primer CEO de Apple tras la muerte de Steve Jobs?',
 '["Tim Cook","Jonathan Ive","Steve Wozniak","Phil Schiller"]', 0,
 'Tim Cook sucedió a Steve Jobs como CEO de Apple en agosto de 2011.',
 'easy'),

('tecnologia', '¿En qué año murió Steve Jobs?',
 '["2009","2010","2011","2012"]', 2,
 'Steve Jobs murió el 5 de octubre de 2011 a los 56 años, debido a un cáncer de páncreas.',
 'medium'),

('tecnologia', '¿Qué compañía creó la consola Xbox?',
 '["Sony","Microsoft","Nintendo","Sega"]', 1,
 'Microsoft lanzó la primera Xbox en 2001. Actualmente comercializa Xbox Series X/S (2020).',
 'easy'),

('tecnologia', '¿Qué compañía creó la consola Nintendo Switch?',
 '["Sony","Microsoft","Nintendo","Sega"]', 2,
 'Nintendo lanzó la Switch en marzo de 2017. Híbrida entre consola doméstica y portátil.',
 'easy'),

('tecnologia', '¿Qué empresa creó el videojuego Minecraft?',
 '["Microsoft","Mojang","Epic","Sony"]', 1,
 'Markus Persson y su empresa Mojang crearon Minecraft. Microsoft compró Mojang en 2014 por 2.500 millones de dólares.',
 'medium'),

('tecnologia', '¿Qué empresa creó Fortnite?',
 '["Microsoft","Epic Games","Activision","Sony"]', 1,
 'Epic Games desarrolló Fortnite, lanzado en 2017. Es uno de los videojuegos más populares de la historia.',
 'easy'),

('tecnologia', '¿Qué empresa creó el motor Unity?',
 '["Unreal","Unity Technologies","Epic","Crytek"]', 1,
 'Unity Technologies (Dinamarca) creó el motor Unity, lanzado en 2005. Muy popular para juegos móviles.',
 'medium'),

('tecnologia', '¿Qué empresa creó GTA?',
 '["Rockstar Games","EA","Ubisoft","2K"]', 0,
 'Rockstar Games desarrolla la saga "Grand Theft Auto" desde 1997.',
 'easy'),

('tecnologia', '¿Quién es el dueño de OpenAI?',
 '["Microsoft (parte)","Google","Meta","Apple"]', 0,
 'OpenAI es una empresa privada en la que Microsoft ha invertido más de 13.000 M$. Sam Altman es su CEO.',
 'medium'),

('tecnologia', '¿Quién es el CEO de OpenAI (a 2024)?',
 '["Elon Musk","Sam Altman","Greg Brockman","Ilya Sutskever"]', 1,
 'Sam Altman es el CEO de OpenAI. Fue brevemente destituido en noviembre de 2023 y restituido pocos días después.',
 'medium'),

('tecnologia', '¿Qué tipo de IA es ChatGPT?',
 '["Generativa basada en LLM","Reconocimiento de imagen","Robótica","Solo búsqueda"]', 0,
 'ChatGPT es una IA generativa basada en LLM (Large Language Models) GPT desarrollada por OpenAI.',
 'medium'),

('tecnologia', '¿Qué significa "LLM"?',
 '["Large Linear Method","Large Language Model","Logic Learning Machine","Linear Layer Model"]', 1,
 'LLM significa Large Language Model: modelo de lenguaje entrenado con grandes cantidades de texto.',
 'medium'),

('tecnologia', '¿Qué empresa creó Gemini (anteriormente Bard)?',
 '["OpenAI","Microsoft","Google","Anthropic"]', 2,
 'Google creó Gemini (renombrado de Bard en 2024), su asistente de IA conversacional.',
 'medium'),

('tecnologia', '¿Qué empresa creó Claude?',
 '["OpenAI","Anthropic","Google","Meta"]', 1,
 'Anthropic, fundada por ex-empleados de OpenAI, creó la familia de modelos Claude.',
 'medium'),

('tecnologia', '¿Qué empresa creó LLaMA?',
 '["OpenAI","Meta","Google","Anthropic"]', 1,
 'Meta lanzó LLaMA en 2023, sus modelos de lenguaje abiertos para investigación.',
 'medium'),

('tecnologia', '¿Cuántos GB tiene un terabyte?',
 '["100","1.000","1.024","10.000"]', 1,
 'En notación decimal (SI), 1 TB = 1.000 GB. En binario (IEC), 1 TiB = 1.024 GiB.',
 'medium'),

('tecnologia', '¿Cuántos bytes tiene un megabyte (SI)?',
 '["1.000","100.000","1.000.000","1.048.576"]', 2,
 'Según el SI, 1 MB = 1.000.000 bytes. En binario (MiB), 1 MiB = 1.048.576 bytes.',
 'medium'),

('tecnologia', '¿Qué protocolo se usa para transferir archivos?',
 '["HTTP","FTP","SMTP","DNS"]', 1,
 'FTP (File Transfer Protocol) es el protocolo clásico para transferencia de archivos. Hoy se usa más SFTP.',
 'medium'),

('tecnologia', '¿Qué protocolo se usa para correos seguros?',
 '["POP3","SMTPS","IMAPS","Todos los anteriores"]', 3,
 'POP3S, SMTPS e IMAPS son las versiones seguras (con TLS) de los protocolos de correo.',
 'hard'),

('tecnologia', '¿Qué significa DNS?',
 '["Domain Name System","Direct Network Service","Data Name Server","Dynamic Net System"]', 0,
 'DNS (Domain Name System) traduce nombres de dominio (como ejemplo.com) en direcciones IP.',
 'medium'),

('tecnologia', '¿Qué empresa creó la consola PlayStation 5?',
 '["Microsoft","Sony","Nintendo","Sega"]', 1,
 'Sony lanzó la PlayStation 5 en noviembre de 2020.',
 'easy'),

('tecnologia', '¿Qué compañía es propietaria de YouTube?',
 '["Microsoft","Google","Meta","Amazon"]', 1,
 'Google compró YouTube en 2006 por 1.650 millones de dólares en acciones.',
 'easy'),

('tecnologia', '¿Cuándo lanzó Microsoft Windows 11?',
 '["2019","2020","2021","2022"]', 2,
 'Microsoft lanzó Windows 11 el 5 de octubre de 2021.',
 'hard'),

('tecnologia', '¿Cuántos bits tiene la arquitectura x64?',
 '["32","64","128","256"]', 1,
 'La arquitectura x64 (también AMD64 o x86-64) es de 64 bits.',
 'medium'),

('tecnologia', '¿Qué empresa creó la GPU GeForce RTX?',
 '["AMD","NVIDIA","Intel","Qualcomm"]', 1,
 'NVIDIA lanzó la familia GeForce RTX en 2018, con la primera arquitectura Turing.',
 'medium'),

('tecnologia', '¿Qué empresa creó las GPU Radeon?',
 '["NVIDIA","AMD","Intel","ATI/AMD"]', 3,
 'ATI lanzó la línea Radeon en 2000. AMD compró ATI en 2006 y mantiene la marca.',
 'hard'),

('tecnologia', '¿Cuántos pines tiene un conector HDMI tipo A?',
 '["15","17","19","21"]', 2,
 'Un conector HDMI tipo A (estándar) tiene 19 pines.',
 'hard'),

('tecnologia', '¿Qué año se lanzó el USB-C?',
 '["2012","2014","2016","2018"]', 1,
 'El estándar USB-C se finalizó en agosto de 2014.',
 'hard'),

('tecnologia', '¿Qué empresa creó Photoshop originalmente?',
 '["Adobe (compró)","Knoll brothers","Microsoft","Apple"]', 1,
 'Thomas y John Knoll crearon Photoshop. Adobe lo licenció en 1988 y compró el código en 1995.',
 'hard'),

('tecnologia', '¿Qué empresa creó el formato PDF?',
 '["Microsoft","Adobe","Apple","Sun"]', 1,
 'Adobe creó el formato PDF (Portable Document Format) en 1993. Es estándar ISO desde 2008.',
 'medium'),

('tecnologia', '¿Quién es Tim Berners-Lee?',
 '["Inventor de la WWW","Cofundador de Google","Creador de Linux","Fundador de Microsoft"]', 0,
 'Tim Berners-Lee inventó la World Wide Web en 1989 mientras trabajaba en el CERN.',
 'medium'),

('tecnologia', '¿En qué institución trabajaba Berners-Lee cuando inventó la web?',
 '["MIT","CERN","Stanford","NASA"]', 1,
 'Tim Berners-Lee inventó la World Wide Web en el CERN (Suiza) en 1989. El primer sitio web se publicó en 1991.',
 'hard'),

('tecnologia', '¿Qué lenguaje usa la web para estructurar contenido?',
 '["JavaScript","HTML","CSS","SQL"]', 1,
 'HTML (HyperText Markup Language) es el lenguaje de marcado que estructura las páginas web.',
 'easy'),

('tecnologia', '¿Qué lenguaje da estilo a las páginas web?',
 '["HTML","CSS","JavaScript","PHP"]', 1,
 'CSS (Cascading Style Sheets) describe la presentación de una página HTML.',
 'easy'),

('tecnologia', '¿Qué lenguaje añade interactividad a las páginas web?',
 '["HTML","CSS","JavaScript","Python"]', 2,
 'JavaScript, creado por Brendan Eich en 1995, es el lenguaje principal de programación de la web.',
 'easy'),

('tecnologia', '¿Qué framework de JavaScript creó Facebook?',
 '["Angular","React","Vue","Svelte"]', 1,
 'Facebook (ahora Meta) creó React en 2013, una biblioteca de JavaScript para construir interfaces de usuario.',
 'medium'),

('tecnologia', '¿Qué framework de JavaScript creó Google?',
 '["React","Angular","Vue","Ember"]', 1,
 'Google creó Angular (originalmente AngularJS en 2010, y Angular reescrito en 2016).',
 'medium'),

('tecnologia', '¿Qué empresa creó Node.js?',
 '["Ryan Dahl (creador)","Microsoft","Google","Facebook"]', 0,
 'Ryan Dahl creó Node.js en 2009. Permite ejecutar JavaScript fuera del navegador, en el servidor.',
 'hard'),

('tecnologia', '¿Qué empresa creó TypeScript?',
 '["Google","Microsoft","Mozilla","Apple"]', 1,
 'Microsoft creó TypeScript en 2012. Es un superconjunto de JavaScript con tipado estático.',
 'medium'),

('tecnologia', '¿Qué base de datos relacional gestiona Oracle?',
 '["MySQL","PostgreSQL","Oracle DB","SQL Server"]', 2,
 'Oracle Database es el SGBD principal de la empresa Oracle.',
 'medium'),

('tecnologia', '¿Qué base de datos relacional es de código abierto y popular en aplicaciones web?',
 '["MySQL","SQL Server","Oracle DB","Db2"]', 0,
 'MySQL es uno de los SGBD más populares en aplicaciones web. Es propiedad de Oracle desde 2010.',
 'medium'),

('tecnologia', '¿Qué tipo de base de datos es MongoDB?',
 '["Relacional","Documental NoSQL","Clave-valor","Grafo"]', 1,
 'MongoDB es una base de datos NoSQL orientada a documentos JSON (BSON).',
 'medium'),

('tecnologia', '¿Qué empresa creó Kubernetes?',
 '["Microsoft","Google","Red Hat","Docker"]', 1,
 'Google creó Kubernetes (K8s) y lo liberó como código abierto en 2014. Ahora lo mantiene la CNCF.',
 'hard'),

('tecnologia', '¿Qué empresa creó Docker?',
 '["Docker Inc.","Google","Microsoft","Red Hat"]', 0,
 'Docker Inc. (anteriormente dotCloud) creó Docker en 2013, popularizando la contenedorización.',
 'medium'),

('tecnologia', '¿Qué empresa creó Android?',
 '["Google","Android Inc. (luego Google)","Samsung","HTC"]', 1,
 'Android Inc. fundó la plataforma en 2003. Google compró Android Inc. en 2005 y lanzó el sistema en 2008.',
 'medium'),

('tecnologia', '¿Qué empresa creó iOS?',
 '["Apple","Microsoft","Google","Nokia"]', 0,
 'Apple creó iOS (originalmente "iPhone OS") en 2007, junto con el primer iPhone.',
 'easy'),

('tecnologia', '¿Qué empresa creó macOS?',
 '["Apple","Microsoft","Google","NeXT/Apple"]', 0,
 'Apple creó macOS (anteriormente Mac OS X), basado en parte en el sistema NeXTSTEP que Apple adquirió en 1997.',
 'medium'),

('tecnologia', '¿Qué empresa creó Windows?',
 '["IBM","Microsoft","Apple","Xerox"]', 1,
 'Microsoft lanzó Windows 1.0 en 1985. Es el sistema operativo de PC más usado del mundo.',
 'easy'),

('tecnologia', '¿En qué año se lanzó Windows XP?',
 '["1995","2000","2001","2003"]', 2,
 'Microsoft lanzó Windows XP en octubre de 2001. Es uno de los sistemas operativos más exitosos de su historia.',
 'hard'),

('tecnologia', '¿Qué tipo de memoria es la EEPROM?',
 '["RAM","Memoria no volátil","Cache","DRAM"]', 1,
 'La EEPROM (Electrically Erasable Programmable Read-Only Memory) es una memoria no volátil que se puede regrabar.',
 'hard'),

('tecnologia', '¿Qué tipo de memoria es DRAM?',
 '["Cache","RAM dinámica","Memoria persistente","SSD"]', 1,
 'DRAM (Dynamic RAM) es la RAM más común en ordenadores. Se refresca constantemente.',
 'hard'),

('tecnologia', '¿Quién es Sundar Pichai?',
 '["CEO de Google","CEO de Microsoft","Fundador de Twitter","CEO de Apple"]', 0,
 'Sundar Pichai es CEO de Google desde 2015 y de Alphabet desde 2019.',
 'medium'),

('tecnologia', '¿Quién es Mark Zuckerberg?',
 '["Fundador de Facebook/Meta","Fundador de Google","CEO de Twitter","Fundador de LinkedIn"]', 0,
 'Mark Zuckerberg cofundó Facebook (ahora Meta) en 2004 desde Harvard.',
 'easy'),

('tecnologia', '¿Quién es Sergey Brin?',
 '["Cofundador de Google","CEO de Yahoo","Fundador de Amazon","Fundador de eBay"]', 0,
 'Sergey Brin cofundó Google con Larry Page en 1998.',
 'medium'),

('tecnologia', '¿Quién es Larry Page?',
 '["Cofundador de Google","CEO de Yahoo","Fundador de Apple","Inventor de la web"]', 0,
 'Larry Page cofundó Google con Sergey Brin. Ambos eran estudiantes de doctorado en Stanford.',
 'medium'),

('tecnologia', '¿Qué empresa creó la app TikTok?',
 '["Tencent","ByteDance","Alibaba","Baidu"]', 1,
 'ByteDance, empresa china, creó TikTok (Douyin en China) en 2016.',
 'medium'),

('tecnologia', '¿En qué año se lanzó TikTok internacionalmente?',
 '["2016","2017","2018","2020"]', 1,
 'TikTok se lanzó internacionalmente en 2017, fusionándose con Musical.ly en 2018.',
 'hard'),

('tecnologia', '¿Quién creó WhatsApp?',
 '["Jan Koum y Brian Acton","Mark Zuckerberg","Sergey Brin","Drew Houston"]', 0,
 'Jan Koum y Brian Acton crearon WhatsApp en 2009. Facebook lo compró en 2014.',
 'medium'),

('tecnologia', '¿Qué empresa creó Dropbox?',
 '["Drew Houston","Microsoft","Google","Sergey Brin"]', 0,
 'Drew Houston y Arash Ferdowsi fundaron Dropbox en 2007.',
 'medium'),

('tecnologia', '¿Qué empresa creó Spotify?',
 '["Daniel Ek y Martin Lorentzon","Steve Jobs","Sean Parker","Reed Hastings"]', 0,
 'Daniel Ek y Martin Lorentzon fundaron Spotify en Suecia en 2006. Lanzamiento público en 2008.',
 'medium'),

('tecnologia', '¿Quién fundó Netflix?',
 '["Reed Hastings y Marc Randolph","Sean Parker","Drew Houston","Steve Chen"]', 0,
 'Reed Hastings y Marc Randolph fundaron Netflix en 1997, inicialmente como servicio de alquiler de DVD por correo.',
 'medium'),

('tecnologia', '¿En qué año empezó Netflix a producir series originales?',
 '["2010","2013","2015","2017"]', 1,
 'Netflix empezó con originales en 2013, con "House of Cards" y "Orange Is the New Black".',
 'hard'),

('tecnologia', '¿Qué empresa creó el motor de búsqueda Yandex?',
 '["Rusa","China","Coreana","India"]', 0,
 'Yandex es la empresa rusa de búsqueda y tecnología, fundada en 1997. Equivalente a Google en Rusia.',
 'hard'),

('tecnologia', '¿Qué empresa creó Baidu?',
 '["China","Japón","Corea","Vietnam"]', 0,
 'Baidu es el principal motor de búsqueda chino, fundado en 2000 por Robin Li y Eric Xu.',
 'hard'),

('tecnologia', '¿Cuántos colores puede mostrar un píxel con 24 bits?',
 '["256","65.536","~16,7 M","Infinitos"]', 2,
 'Con 24 bits (8 por canal RGB) se pueden representar 2²⁴ = 16.777.216 colores diferentes.',
 'hard'),

('tecnologia', '¿Qué empresa creó el sistema de pago Apple Pay?',
 '["Visa","Apple","Mastercard","Google"]', 1,
 'Apple lanzó Apple Pay en 2014, primero en EE.UU., como sistema de pagos contactless desde el iPhone.',
 'easy'),

('tecnologia', '¿Qué empresa creó Google Pay?',
 '["Apple","Google","Samsung","Mastercard"]', 1,
 'Google lanzó Google Pay en 2018, fusionando Android Pay y Google Wallet.',
 'easy'),

('tecnologia', '¿Qué tecnología usa la cadena de bloques?',
 '["Servidores centrales","Cifrado y descentralización","WAN","Cloud computing"]', 1,
 'Blockchain usa criptografía y nodos distribuidos para mantener un registro inmutable y verificable.',
 'medium'),

('tecnologia', '¿Cuál fue la primera criptomoneda?',
 '["Ethereum","Bitcoin","Litecoin","Dogecoin"]', 1,
 'Bitcoin, creado por Satoshi Nakamoto, fue lanzada en 2009.',
 'easy'),

('tecnologia', '¿En qué año se publicó el whitepaper de Bitcoin?',
 '["2008","2009","2010","2011"]', 0,
 'Satoshi Nakamoto publicó el whitepaper de Bitcoin en octubre de 2008.',
 'medium'),

('tecnologia', '¿Quién creó Ethereum?',
 '["Vitalik Buterin","Satoshi Nakamoto","Charlie Lee","Brad Garlinghouse"]', 0,
 'Vitalik Buterin propuso Ethereum en 2013 y la red se lanzó en 2015.',
 'medium'),

('tecnologia', '¿En qué año se lanzó Ethereum?',
 '["2013","2014","2015","2017"]', 2,
 'Ethereum se lanzó en julio de 2015. Introdujo los contratos inteligentes.',
 'hard'),

('tecnologia', '¿Qué empresa creó Zoom?',
 '["Microsoft","Zoom Video Communications","Cisco","Google"]', 1,
 'Eric Yuan fundó Zoom Video Communications en 2011. Se popularizó masivamente durante la pandemia en 2020.',
 'medium'),

('tecnologia', '¿En qué año se popularizó masivamente Zoom?',
 '["2018","2019","2020","2021"]', 2,
 'Zoom se popularizó masivamente en 2020 durante la pandemia de COVID-19.',
 'easy'),

('tecnologia', '¿Qué tipo de encriptación usa AES?',
 '["Asimétrica","Simétrica","Hash","No es encriptación"]', 1,
 'AES (Advanced Encryption Standard) es un algoritmo de cifrado simétrico (misma clave para cifrar y descifrar).',
 'hard'),

('tecnologia', '¿Qué tipo de encriptación usa RSA?',
 '["Asimétrica","Simétrica","Hash","No es encriptación"]', 0,
 'RSA es un algoritmo de cifrado asimétrico: usa claves públicas y privadas. Base de la firma digital.',
 'hard'),

('tecnologia', '¿Qué año se lanzó el primer Macintosh?',
 '["1980","1984","1987","1990"]', 1,
 'Apple lanzó el primer Macintosh el 24 de enero de 1984, con un famoso anuncio de Ridley Scott en la Super Bowl.',
 'medium'),

('tecnologia', '¿Qué empresa fabricaba el procesador del Apple Lisa?',
 '["Intel","Motorola","Texas Instruments","AMD"]', 1,
 'El Apple Lisa (1983) usaba el procesador Motorola 68000.',
 'hard'),

('tecnologia', '¿Quién es Jeff Bezos?',
 '["Fundador de Amazon","Fundador de Microsoft","CEO de Tesla","Fundador de PayPal"]', 0,
 'Jeff Bezos fundó Amazon en 1994 como librería online. Fue CEO hasta 2021.',
 'easy'),

('tecnologia', '¿En qué año se fundó Amazon?',
 '["1991","1994","1996","1999"]', 1,
 'Jeff Bezos fundó Amazon en julio de 1994 en Seattle, originalmente con el nombre "Cadabra".',
 'medium'),

('tecnologia', '¿Quién es el CEO de Amazon (a 2024)?',
 '["Jeff Bezos","Andy Jassy","Tim Cook","Jeff Bezos sigue"]', 1,
 'Andy Jassy sucedió a Jeff Bezos como CEO de Amazon en julio de 2021.',
 'medium'),

('tecnologia', '¿Qué servicio de Amazon es el líder mundial en cloud computing?',
 '["AWS","Amazon Prime","Kindle","Alexa"]', 0,
 'Amazon Web Services (AWS), lanzado en 2006, es el principal proveedor mundial de servicios en la nube.',
 'medium'),

('tecnologia', '¿Qué servicio de nube tiene Microsoft?',
 '["AWS","Azure","Google Cloud","Oracle"]', 1,
 'Microsoft Azure, lanzado en 2010, es el principal competidor de AWS.',
 'medium'),

('tecnologia', '¿Cuántos transistores tiene un procesador moderno (orden de magnitud)?',
 '["Millones","Cientos de millones","Decenas de miles de millones","Trillones"]', 2,
 'Los procesadores modernos tienen entre 10.000 y 100.000 millones de transistores (decenas de miles de millones).',
 'hard');

-- ══════════════════════════════════════════════════════════════
-- MITOLOGIA (+100)
-- ══════════════════════════════════════════════════════════════

insert into public.questions (category, question, options, answer_index, context, difficulty) values

('mitologia', '¿Quién es la diosa griega de la caza?',
 '["Atenea","Afrodita","Ártemis","Hera"]', 2,
 'Ártemis es la diosa virgen de la caza, la luna, los animales salvajes y las jóvenes. Hermana gemela de Apolo.',
 'medium'),

('mitologia', '¿Cuál es el equivalente romano de Ártemis?',
 '["Venus","Diana","Minerva","Juno"]', 1,
 'Diana es el equivalente romano de Ártemis. Diosa de la caza, la luna y la naturaleza salvaje.',
 'medium'),

('mitologia', '¿Cuál es el equivalente romano de Atenea?',
 '["Venus","Diana","Minerva","Juno"]', 2,
 'Minerva es el equivalente romano de Atenea. Diosa de la sabiduría, las artes y la guerra estratégica.',
 'medium'),

('mitologia', '¿Cuál es el equivalente romano de Hera?',
 '["Diana","Minerva","Juno","Vesta"]', 2,
 'Juno es el equivalente romano de Hera. Diosa del matrimonio y reina de los dioses.',
 'medium'),

('mitologia', '¿Cuál es el equivalente romano de Zeus?',
 '["Marte","Júpiter","Saturno","Apolo"]', 1,
 'Júpiter es el equivalente romano de Zeus. Rey de los dioses, señor del cielo y del rayo.',
 'easy'),

('mitologia', '¿Cuál es el equivalente romano de Poseidón?',
 '["Marte","Júpiter","Neptuno","Plutón"]', 2,
 'Neptuno es el equivalente romano de Poseidón. Dios del mar.',
 'easy'),

('mitologia', '¿Cuál es el equivalente romano de Hades?',
 '["Plutón","Neptuno","Marte","Vulcano"]', 0,
 'Plutón es el equivalente romano de Hades. Dios del inframundo.',
 'medium'),

('mitologia', '¿Cuál es el equivalente romano de Apolo?',
 '["Marte","Mercurio","Apolo (mismo nombre)","Vulcano"]', 2,
 'Apolo conserva su nombre en la mitología romana. Dios de la luz, las artes y la profecía.',
 'medium'),

('mitologia', '¿Cuál es el equivalente romano de Hefesto?',
 '["Vulcano","Marte","Mercurio","Júpiter"]', 0,
 'Vulcano es el equivalente romano de Hefesto. Dios del fuego, los volcanes y los herreros.',
 'medium'),

('mitologia', '¿Cuál es el equivalente romano de Eros?',
 '["Cupido","Júpiter","Marte","Apolo"]', 0,
 'Cupido es el equivalente romano de Eros. Dios del amor, hijo de Venus.',
 'easy'),

('mitologia', '¿Cuál es el equivalente romano de Deméter?',
 '["Ceres","Vesta","Juno","Diana"]', 0,
 'Ceres es el equivalente romano de Deméter. Diosa de la agricultura y las cosechas. De ahí "cereal".',
 'medium'),

('mitologia', '¿Cuál es el equivalente romano de Hestia?',
 '["Ceres","Vesta","Juno","Minerva"]', 1,
 'Vesta es el equivalente romano de Hestia. Diosa del hogar y el fuego sagrado.',
 'hard'),

('mitologia', '¿Quién es la diosa griega de la sabiduría?',
 '["Atenea","Afrodita","Hera","Ártemis"]', 0,
 'Atenea es la diosa griega de la sabiduría, las artes y la guerra estratégica. Hija de Zeus.',
 'easy'),

('mitologia', '¿Quién es la diosa griega del amor?',
 '["Hera","Atenea","Afrodita","Ártemis"]', 2,
 'Afrodita es la diosa griega del amor, la belleza y la fertilidad.',
 'easy'),

('mitologia', '¿Cuál es el monte sagrado de los dioses griegos?',
 '["Parnaso","Olimpo","Etna","Atos"]', 1,
 'El monte Olimpo, el más alto de Grecia (2.917 m), era la residencia de los dioses según la mitología.',
 'easy'),

('mitologia', '¿Quién es la diosa griega del arco iris?',
 '["Iris","Hebe","Eos","Selene"]', 0,
 'Iris es la diosa-mensajera y personificación del arco iris. Une el cielo con la tierra.',
 'hard'),

('mitologia', '¿Quién es la diosa griega de la aurora?',
 '["Selene","Eos","Iris","Astrea"]', 1,
 'Eos es la diosa griega de la aurora. En la mitología romana, su equivalente es Aurora.',
 'hard'),

('mitologia', '¿Quién es el dios griego del sol?',
 '["Apolo","Helios","Hiperión","Todos los anteriores en distintas tradiciones"]', 3,
 'Helios fue el dios original del sol. Apolo asimiló esta función posteriormente. Hiperión es su padre titán.',
 'medium'),

('mitologia', '¿Quién es la diosa griega de la luna?',
 '["Hécate","Selene","Ártemis","Todas las anteriores"]', 3,
 'Selene es la personificación original de la luna. Ártemis y Hécate también se asocian con ella en distintos contextos.',
 'hard'),

('mitologia', '¿Quién es Hécate?',
 '["Diosa de la magia y la encrucijada","Diosa del amor","Diosa de la caza","Diosa del cielo"]', 0,
 'Hécate es la diosa de la magia, la brujería, los fantasmas y los encrucijadas.',
 'hard'),

('mitologia', '¿Cómo se llamaba el héroe que abrió la caja prohibida en la mitología griega?',
 '["Pandora","Aracne","Penélope","Casandra"]', 0,
 'Pandora abrió la "caja" (en realidad una jarra, pithos) que contenía todos los males del mundo, dejando solo la esperanza dentro.',
 'medium'),

('mitologia', '¿Quién fue el primer rey de los dioses según los griegos (antes de Zeus)?',
 '["Cronos","Urano","Helios","Tifón"]', 0,
 'Cronos derrocó a su padre Urano. Devoraba a sus hijos para evitar ser destronado. Zeus, su hijo, lo derrotó al final.',
 'medium'),

('mitologia', '¿Qué titán sostiene el cielo según la mitología?',
 '["Cronos","Atlas","Prometeo","Hiperión"]', 1,
 'Atlas fue condenado por Zeus a sostener la bóveda celeste sobre sus hombros como castigo.',
 'medium'),

('mitologia', '¿Quién le robó el fuego a los dioses?',
 '["Heracles","Prometeo","Atlas","Epimeteo"]', 1,
 'Prometeo robó el fuego a los dioses para dárselo a los humanos. Zeus lo encadenó a una roca como castigo.',
 'medium'),

('mitologia', '¿Qué castigo recibió Prometeo?',
 '["Sostener el cielo","Que un águila le devorara el hígado","Bajar al Hades","Convertirse en piedra"]', 1,
 'Prometeo fue encadenado al Cáucaso. Un águila le devoraba el hígado cada día, regenerándose por la noche. Heracles lo liberó.',
 'medium'),

('mitologia', '¿Cuál es el caballo alado con un cuerno?',
 '["Pegaso","Unicornio","Quimera","Centauro"]', 1,
 'El unicornio es el caballo con un cuerno. Pegaso es el caballo alado pero sin cuerno.',
 'easy'),

('mitologia', '¿Qué seres tienen torso humano y cuerpo de caballo?',
 '["Centauros","Sátiros","Faunos","Minotauros"]', 0,
 'Los centauros tienen torso humano y cuerpo de caballo. Quirón fue el centauro sabio, maestro de héroes.',
 'medium'),

('mitologia', '¿Quién fue el centauro maestro de Aquiles?',
 '["Neso","Quirón","Polifemo","Hércules"]', 1,
 'Quirón, el más sabio de los centauros, educó a Aquiles, Jasón, Asclepio y otros héroes.',
 'hard'),

('mitologia', '¿Qué héroe griego conquistó el Vellocino de Oro?',
 '["Heracles","Teseo","Jasón","Perseo"]', 2,
 'Jasón y los argonautas viajaron a la Cólquide en busca del Vellocino de Oro.',
 'medium'),

('mitologia', '¿Cómo se llama el barco de Jasón?',
 '["Argo","Áurea","Nautilus","Pelias"]', 0,
 'El Argo fue construido por Argos con ayuda de Atenea para el viaje de Jasón. Los tripulantes son los "argonautas".',
 'medium'),

('mitologia', '¿Quién es la madre de Aquiles?',
 '["Hera","Thetis","Eos","Ariadna"]', 1,
 'Thetis, nereida marina, era la madre de Aquiles. Lo sumergió en la laguna Estigia para hacerlo invulnerable, salvo el talón.',
 'medium'),

('mitologia', '¿Cuál es el "talón de Aquiles"?',
 '["Su único punto vulnerable","Su arma","Su escudo","Su caballo"]', 0,
 'El talón de Aquiles, por donde lo sostuvo Thetis, era su único punto vulnerable. Una flecha de Paris allí lo mató.',
 'easy'),

('mitologia', '¿Quién mató a Aquiles en la guerra de Troya?',
 '["Héctor","Paris","Eneas","Príamo"]', 1,
 'Paris (príncipe troyano), guiado por Apolo, disparó la flecha que mató a Aquiles golpeándole en el talón.',
 'medium'),

('mitologia', '¿Quién es el padre de Héctor y Paris?',
 '["Príamo","Eneas","Casandra","Anquises"]', 0,
 'Príamo, rey de Troya, fue padre de Héctor, Paris, Casandra y otros 50 hijos.',
 'hard'),

('mitologia', '¿Quién es la profetisa de Troya cuyas profecías nadie creía?',
 '["Helena","Ifigenia","Casandra","Atalanta"]', 2,
 'Casandra, hija de Príamo, recibió de Apolo el don de la profecía pero también la maldición de no ser creída.',
 'medium'),

('mitologia', '¿Quién raptó a Helena de Esparta?',
 '["Héctor","Paris","Aquiles","Eneas"]', 1,
 'Paris raptó a Helena, esposa del rey Menelao, provocando la guerra de Troya.',
 'medium'),

('mitologia', '¿Quién es el autor de "La Ilíada" y "La Odisea"?',
 '["Hesíodo","Homero","Píndaro","Sófocles"]', 1,
 'Homero (s. VIII a.C.) es el autor tradicional de "La Ilíada" y "La Odisea".',
 'easy'),

('mitologia', '¿Cuántos años vagó Odiseo tras la guerra de Troya?',
 '["3","7","10","20"]', 2,
 'Según la Odisea, Odiseo (Ulises) tardó 10 años en regresar a Ítaca tras la guerra de Troya.',
 'medium'),

('mitologia', '¿Quién es la esposa de Odiseo?',
 '["Helena","Penélope","Andrómaca","Clitemnestra"]', 1,
 'Penélope, esposa de Odiseo, esperó pacientemente a su marido durante 20 años, tejiendo y destejiendo un sudario.',
 'medium'),

('mitologia', '¿Quién es el hijo de Odiseo y Penélope?',
 '["Telégono","Telémaco","Aquiles","Apolo"]', 1,
 'Telémaco, hijo de Odiseo, fue protagonista de los primeros cuatro cantos de la Odisea ("Telemaquia").',
 'hard'),

('mitologia', '¿Qué cíclope encontró Odiseo?',
 '["Argos","Polifemo","Briareo","Esteropes"]', 1,
 'Odiseo cegó al cíclope Polifemo, hijo de Poseidón, lo que provocó la enemistad del dios del mar.',
 'medium'),

('mitologia', '¿Quién es la hechicera que convirtió a los hombres de Odiseo en cerdos?',
 '["Calipso","Circe","Medea","Hécate"]', 1,
 'Circe, hechicera de la isla de Eea, transformó a la tripulación de Odiseo en cerdos.',
 'medium'),

('mitologia', '¿Quién retuvo a Odiseo durante 7 años en una isla?',
 '["Circe","Calipso","Helena","Andrómaca"]', 1,
 'La ninfa Calipso retuvo a Odiseo en la isla de Ogigia durante 7 años, ofreciéndole la inmortalidad.',
 'hard'),

('mitologia', '¿Qué peligrosas criaturas atraían a los marinos con su canto?',
 '["Las Gorgonas","Las Sirenas","Las Arpías","Las Furias"]', 1,
 'Las Sirenas atraían a los navegantes con su canto irresistible, conduciéndolos al naufragio.',
 'medium'),

('mitologia', '¿Cómo escapó Odiseo del canto de las sirenas?',
 '["Se ató al mástil","Las mató","Huyó","Se durmió"]', 0,
 'Odiseo tapó los oídos de sus marineros con cera y se hizo atar al mástil para poder oír el canto sin sucumbir.',
 'medium'),

('mitologia', '¿Quiénes son Escila y Caribdis?',
 '["Diosas","Monstruos marinos","Sirenas","Heroínas"]', 1,
 'Escila era un monstruo de varias cabezas y Caribdis un remolino. Estaban en un estrecho (¿Mesina?) por el que Odiseo tuvo que pasar.',
 'medium'),

('mitologia', '¿Quién es Edipo?',
 '["Rey de Tebas que mató a su padre y se casó con su madre","Héroe griego","Filósofo","Profeta"]', 0,
 'Edipo, rey de Tebas, mató sin saberlo a su padre Layo y se casó con su madre Yocasta, cumpliendo una profecía.',
 'medium'),

('mitologia', '¿Qué famoso enigma resolvió Edipo?',
 '["El de la Esfinge","El del laberinto","El del minotauro","El de Pitia"]', 0,
 'Edipo resolvió el enigma de la Esfinge de Tebas: "¿Qué animal anda en 4 patas por la mañana, 2 al mediodía y 3 por la noche?". Respuesta: el ser humano.',
 'medium'),

('mitologia', '¿Qué dios castigó a Sísifo a empujar una roca eternamente?',
 '["Zeus","Hades","Poseidón","Apolo"]', 0,
 'Sísifo fue condenado por Zeus a empujar una roca hasta lo alto de una montaña, donde siempre caía de nuevo.',
 'medium'),

('mitologia', '¿Quién es Tántalo?',
 '["Castigado a no poder beber ni comer","Profeta troyano","Rey de Esparta","Padre de Aquiles"]', 0,
 'Tántalo, condenado por los dioses, estaba sumergido en agua hasta el cuello pero no podía beber, con frutos sobre su cabeza pero no podía comerlos.',
 'hard'),

('mitologia', '¿Qué héroe griego derrotó a las amazonas?',
 '["Teseo","Heracles","Aquiles","Jasón"]', 1,
 'Heracles (Hércules) en su 9.º trabajo obtuvo el cinturón de la reina amazona Hipólita.',
 'medium'),

('mitologia', '¿Quién es la reina de las amazonas en la mitología?',
 '["Hipólita","Pentesilea","Mirina","Todas (en distintos momentos)"]', 3,
 'Hipólita y Pentesilea son dos reinas amazonas famosas, en distintos episodios del mito.',
 'hard'),

('mitologia', '¿Qué dios egipcio es esposo de Isis?',
 '["Anubis","Horus","Osiris","Ra"]', 2,
 'Osiris es esposo y hermano de Isis. Fue asesinado por su hermano Set y resucitado por Isis.',
 'medium'),

('mitologia', '¿Quién es el dios egipcio del cielo, hijo de Isis y Osiris?',
 '["Anubis","Horus","Thot","Set"]', 1,
 'Horus, con cabeza de halcón, es hijo de Isis y Osiris. Vengador de su padre, asociado a la realeza.',
 'medium'),

('mitologia', '¿Quién es Anubis?',
 '["Dios de la momificación","Dios sol","Dios del cielo","Dios de la guerra"]', 0,
 'Anubis, con cabeza de chacal, es el dios de la momificación y guardián de los muertos en el panteón egipcio.',
 'medium'),

('mitologia', '¿Quién es Thot?',
 '["Dios egipcio de la escritura y sabiduría","Dios del sol","Dios de la guerra","Diosa madre"]', 0,
 'Thot, con cabeza de ibis, es el dios egipcio de la escritura, la sabiduría y la luna.',
 'hard'),

('mitologia', '¿Qué dios egipcio asesinó a su hermano Osiris?',
 '["Horus","Anubis","Set","Thot"]', 2,
 'Set, dios del caos y de los desiertos, asesinó a su hermano Osiris por celos del trono de Egipto.',
 'medium'),

('mitologia', '¿Quién es Bastet?',
 '["Diosa egipcia con cabeza de gato","Diosa del Nilo","Diosa del cielo","Diosa madre"]', 0,
 'Bastet, con cabeza de gato, era la diosa egipcia del hogar, la fertilidad y los gatos.',
 'hard'),

('mitologia', '¿Quién es Sekhmet?',
 '["Diosa con cabeza de leona","Diosa del cielo","Diosa madre","Diosa del Nilo"]', 0,
 'Sekhmet, con cabeza de leona, era la diosa egipcia de la guerra, la enfermedad y la curación.',
 'hard'),

('mitologia', '¿Cuál es el rey de los dioses nórdicos?',
 '["Thor","Odín","Loki","Frey"]', 1,
 'Odín, padre de Thor y Loki adoptivo, es el rey de los dioses nórdicos. Reside en Asgard.',
 'easy'),

('mitologia', '¿Cuántos ojos tiene Odín?',
 '["0","1","2","3"]', 1,
 'Odín sacrificó uno de sus ojos en el pozo de Mimir a cambio de sabiduría.',
 'medium'),

('mitologia', '¿Cómo se llaman los cuervos de Odín?',
 '["Hugin y Munin","Sleipnir","Geri y Freki","Mimir"]', 0,
 'Hugin ("pensamiento") y Munin ("memoria") son los cuervos de Odín. Vuelan por el mundo y le traen noticias.',
 'hard'),

('mitologia', '¿Cuántas patas tiene Sleipnir, el caballo de Odín?',
 '["4","6","8","10"]', 2,
 'Sleipnir, hijo de Loki, tiene 8 patas. Es el caballo más rápido y se desplaza por todos los mundos.',
 'hard'),

('mitologia', '¿Quién es Frigg?',
 '["Esposa de Odín","Hermana de Thor","Hija de Loki","Diosa de la muerte"]', 0,
 'Frigg, esposa de Odín, es la diosa nórdica del matrimonio, la maternidad y la sabiduría doméstica.',
 'hard'),

('mitologia', '¿Quién es la hija de Loki que gobierna el reino de los muertos nórdicos?',
 '["Hela","Freyja","Sif","Skadi"]', 0,
 'Hela (o Hel) es hija de Loki. Gobierna el reino homónimo, donde van los muertos que no cayeron en batalla.',
 'hard'),

('mitologia', '¿Quién es Freyja en la mitología nórdica?',
 '["Diosa del amor y la guerra","Diosa de la cosecha","Diosa de la muerte","Diosa madre"]', 0,
 'Freyja es la diosa nórdica del amor, la belleza, la fertilidad y la magia (seidr). También recibe a la mitad de los muertos en batalla.',
 'hard'),

('mitologia', '¿Cuál es el reino de los gigantes en la mitología nórdica?',
 '["Asgard","Midgard","Jotunheim","Niflheim"]', 2,
 'Jotunheim es la tierra de los jotuns (gigantes). Asgard es la de los dioses Æsir. Midgard, la de los humanos.',
 'hard'),

('mitologia', '¿Cómo se llama el puente que une Asgard con Midgard?',
 '["Bifrost","Gjallarbrú","Mjolnir","Yggdrasil"]', 0,
 'Bifrost es el puente de arco iris que conecta Asgard (reino de los dioses) con Midgard (mundo de los humanos).',
 'hard'),

('mitologia', '¿Quién es Heimdall?',
 '["Vigilante del Bifrost","Hijo de Odín","Guardián de los dioses","Todas las anteriores"]', 3,
 'Heimdall, hijo de nueve madres, vigila el Bifrost contra los gigantes. Soplará el cuerno Gjallarhorn al inicio del Ragnarok.',
 'hard'),

('mitologia', '¿Quién es el dios de la fertilidad y los frutos en la mitología nórdica?',
 '["Frey","Thor","Heimdall","Tyr"]', 0,
 'Frey, hermano de Freyja, es el dios de la fertilidad, la prosperidad y el sol.',
 'hard'),

('mitologia', '¿Quién es el lobo que matará a Odín en el Ragnarok?',
 '["Fenrir","Skoll","Hati","Garm"]', 0,
 'Fenrir, lobo gigante hijo de Loki, devorará a Odín durante el Ragnarok.',
 'hard'),

('mitologia', '¿Qué serpiente rodea el mundo en la mitología nórdica?',
 '["Jörmungandr","Nidhogg","Sleipnir","Garm"]', 0,
 'Jörmungandr, la "Serpiente del Mundo" (Midgardsormr), es hija de Loki. Rodea Midgard mordiéndose la cola.',
 'hard'),

('mitologia', '¿Quién matará a Jörmungandr en el Ragnarok?',
 '["Odín","Thor","Frey","Heimdall"]', 1,
 'Thor matará a Jörmungandr en el Ragnarok, pero morirá envenenado tras 9 pasos.',
 'hard'),

('mitologia', '¿Qué dios hindú es conocido como "el destructor"?',
 '["Brahma","Vishnu","Shiva","Krishna"]', 2,
 'Shiva es uno de los tres dioses principales del hinduismo, conocido como "el destructor" o "el transformador".',
 'medium'),

('mitologia', '¿Qué dios hindú es el "preservador"?',
 '["Brahma","Vishnu","Shiva","Indra"]', 1,
 'Vishnu, el preservador, encarna en diversos avatares (como Rama, Krishna y Buda) para restaurar el dharma.',
 'medium'),

('mitologia', '¿Qué dios hindú es el "creador"?',
 '["Brahma","Vishnu","Shiva","Ganesha"]', 0,
 'Brahma es el dios creador en la Trimurti hindú (Brahma, Vishnu, Shiva).',
 'medium'),

('mitologia', '¿Quién es Ganesha?',
 '["Dios hindú con cabeza de elefante","Dios sol","Dios del fuego","Dios del cielo"]', 0,
 'Ganesha, hijo de Shiva y Parvati, tiene cabeza de elefante. Es el dios de los comienzos, removedor de obstáculos.',
 'medium'),

('mitologia', '¿Qué diosa hindú es esposa de Shiva?',
 '["Lakshmi","Saraswati","Parvati","Durga"]', 2,
 'Parvati es la esposa de Shiva. Madre de Ganesha y Kartikeya. Se manifiesta como Durga o Kali en sus aspectos guerreros.',
 'hard'),

('mitologia', '¿Qué diosa hindú es la esposa de Vishnu?',
 '["Saraswati","Lakshmi","Parvati","Durga"]', 1,
 'Lakshmi es la esposa de Vishnu y la diosa de la prosperidad, la riqueza, la fortuna y la belleza.',
 'hard'),

('mitologia', '¿Qué dios maya/azteca representa al sol y la guerra?',
 '["Quetzalcóatl","Tezcatlipoca","Huitzilopochtli","Tláloc"]', 2,
 'Huitzilopochtli era el principal dios solar y de la guerra de los aztecas. Patrón de la ciudad de Tenochtitlán.',
 'hard'),

('mitologia', '¿Qué dios maya/azteca es el dios de la lluvia?',
 '["Tláloc","Quetzalcóatl","Tezcatlipoca","Mictlantecuhtli"]', 0,
 'Tláloc era el dios mexica de la lluvia y la fertilidad. Equivalente al Chaac maya.',
 'hard'),

('mitologia', '¿Quién es el dios maya/azteca del inframundo?',
 '["Tláloc","Mictlantecuhtli","Quetzalcóatl","Coyolxauhqui"]', 1,
 'Mictlantecuhtli era el dios del inframundo (Mictlán) en la mitología mexica/azteca.',
 'hard'),

('mitologia', '¿Qué diosa azteca era madre de Huitzilopochtli?',
 '["Tonantzin","Coatlicue","Coyolxauhqui","Mictecacihuatl"]', 1,
 'Coatlicue ("la de la falda de serpientes") era madre de Huitzilopochtli y diosa de la fertilidad y la tierra.',
 'hard'),

('mitologia', '¿Qué es el Popol Vuh?',
 '["Texto sagrado maya","Texto azteca","Texto inca","Texto egipcio"]', 0,
 'El Popol Vuh es el libro sagrado del pueblo maya k''iche''. Contiene la creación del mundo y las hazañas de los gemelos divinos.',
 'hard'),

('mitologia', '¿Cuál es el dios principal de los incas?',
 '["Pachamama","Inti","Viracocha","Mama Killa"]', 1,
 'Inti, el sol, era el dios principal de los incas. Viracocha era el dios creador. Pachamama, la madre tierra.',
 'hard'),

('mitologia', '¿Qué representa Pachamama?',
 '["La Tierra","El sol","El mar","La luna"]', 0,
 'Pachamama es la madre tierra en las religiones andinas. Diosa de la fertilidad, la cosecha y la naturaleza.',
 'medium'),

('mitologia', '¿Quién era Brahma en la mitología hindú?',
 '["El creador","El destructor","El preservador","El amor"]', 0,
 'Brahma es el dios creador en la trinidad hindú (Trimurti).',
 'medium'),

('mitologia', '¿Qué es el Mahabharata?',
 '["Texto épico hindú","Texto sagrado azteca","Texto egipcio","Libro budista"]', 0,
 'El Mahabharata es uno de los grandes textos épicos hindúes (~100.000 versos). Contiene el Bhagavad Gita.',
 'medium'),

('mitologia', '¿Qué dios chino es el "Emperador de Jade"?',
 '["Gobernante supremo del cielo","Dios del fuego","Dios del agua","Dios de la guerra"]', 0,
 'El Emperador de Jade (Yu Huang) es el gobernante supremo del cielo en la mitología china tradicional.',
 'hard'),

('mitologia', '¿Qué animal divino es el guardián del este en China?',
 '["Tortuga","Dragón Azul","Tigre Blanco","Fénix"]', 1,
 'El Dragón Azul guardia el este en la cosmología china. Los otros: Tigre Blanco (oeste), Pájaro Bermellón (sur), Tortuga Negra (norte).',
 'hard'),

('mitologia', '¿Qué dragón japonés es famoso por ser asesinado por Susanoo?',
 '["Yamata no Orochi","Ryūjin","Kuraokami","Watatsumi"]', 0,
 'Yamata no Orochi era un dragón de 8 cabezas. Susanoo lo emborrachó con sake antes de matarlo.',
 'hard'),

('mitologia', '¿Quién es Amaterasu?',
 '["Diosa japonesa del sol","Diosa china de la luna","Diosa coreana","Diosa india"]', 0,
 'Amaterasu Ōmikami es la diosa del sol en el sintoísmo. La familia imperial japonesa afirma descender de ella.',
 'hard'),

('mitologia', '¿Qué es un kitsune?',
 '["Espíritu zorro en folclore japonés","Demonio","Dios del agua","Espíritu del bosque"]', 0,
 'Los kitsune son espíritus zorro del folclore japonés. Pueden tener hasta 9 colas y poseen poderes mágicos.',
 'hard'),

('mitologia', '¿Cuál es el árbol cósmico de los celtas?',
 '["Bíle","Roble sagrado","Yggdrasil","Ceiba"]', 1,
 'El roble era el árbol sagrado por excelencia para los celtas. La palabra "druida" deriva de "dru" (roble).',
 'hard'),

('mitologia', '¿Quién es el rey Arturo?',
 '["Rey legendario británico","Rey de Escocia real","Rey de Gales","Rey de Cornualles"]', 0,
 'Arturo es un rey legendario británico que defiende su tierra de los sajones. Símbolo del ideal caballeresco.',
 'easy'),

('mitologia', '¿Cómo se llama la espada del rey Arturo?',
 '["Durendal","Excalibur","Tizona","Mjolnir"]', 1,
 'Excalibur es la espada legendaria del rey Arturo, dada por la Dama del Lago.',
 'easy'),

('mitologia', '¿Quién es Merlín?',
 '["Mago consejero del rey Arturo","Caballero","Bardo","Druida cristiano"]', 0,
 'Merlín es el mago, profeta y consejero del rey Arturo en las leyendas artúricas.',
 'medium'),

('mitologia', '¿Qué isla legendaria es paradisíaca en la mitología celta?',
 '["Tír na nÓg","Avalón","Annwn","Todas las anteriores"]', 3,
 'Tír na nÓg, Avalón y Annwn son distintos nombres de "otros mundos" paradisíacos en mitologías celtas.',
 'hard'),

('mitologia', '¿Qué dios egipcio tenía cabeza de cocodrilo?',
 '["Sobek","Anubis","Horus","Bastet"]', 0,
 'Sobek, dios del Nilo y de los cocodrilos, era venerado en lugares como Kom Ombo.',
 'hard'),

('mitologia', '¿Cuál es el río sagrado de los hindúes?',
 '["Ganges","Indo","Brahmaputra","Yamuna"]', 0,
 'El Ganges (Ganga) es el río sagrado del hinduismo. Bañarse en él purifica los pecados según la tradición.',
 'medium'),

('mitologia', '¿Quién es Hanumán?',
 '["Dios hindú con forma de mono","Dios del agua","Dios de la guerra","Dios sol"]', 0,
 'Hanumán es el dios mono hindú, símbolo de fuerza, devoción y valentía. Acompañó a Rama en el Ramayana.',
 'hard'),

('mitologia', '¿Qué dios celta era el "Buen Dios" según los irlandeses?',
 '["Dagda","Lugh","Manannán","Nuada"]', 0,
 'El Dagda era el "Buen Dios" en la mitología celta-irlandesa, líder de los Tuatha Dé Danann.',
 'hard'),

('mitologia', '¿Quién es Cú Chulainn?',
 '["Héroe celta-irlandés","Rey de Britania","Druida","Dios del mar"]', 0,
 'Cú Chulainn es el héroe legendario del ciclo del Ulster en la mitología irlandesa.',
 'hard');

-- ══════════════════════════════════════════════════════════════
-- ASTRONOMIA (+100)
-- ══════════════════════════════════════════════════════════════

insert into public.questions (category, question, options, answer_index, context, difficulty) values

('astronomia', '¿Cuántas lunas tiene Júpiter (oficialmente confirmadas, aprox.)?',
 '["50","79","95","más de 90"]', 3,
 'Júpiter tiene más de 90 lunas confirmadas (>95 a fecha 2024). Las cuatro más grandes (galileanas) son Ío, Europa, Ganímedes y Calisto.',
 'hard'),

('astronomia', '¿Cuál es la luna más grande de Júpiter?',
 '["Ío","Europa","Ganímedes","Calisto"]', 2,
 'Ganímedes es la mayor luna del sistema solar (más grande incluso que Mercurio).',
 'medium'),

('astronomia', '¿Qué luna de Júpiter podría albergar un océano subterráneo?',
 '["Ío","Europa","Calisto","Ganímedes"]', 1,
 'Europa, luna de Júpiter, tiene una corteza de hielo bajo la cual se cree que hay un océano de agua líquida.',
 'medium'),

('astronomia', '¿Qué luna de Saturno tiene atmósfera densa?',
 '["Mimas","Titán","Encélado","Rea"]', 1,
 'Titán es la única luna del sistema solar con atmósfera densa (más que la de la Tierra). Tiene lagos de metano líquido.',
 'medium'),

('astronomia', '¿Qué luna de Saturno expulsa géiseres de agua?',
 '["Mimas","Encélado","Titán","Hiperión"]', 1,
 'Encélado tiene géiseres en el polo sur que expulsan agua del océano subterráneo al espacio.',
 'hard'),

('astronomia', '¿Cuántas lunas tiene Saturno (confirmadas aprox.)?',
 '["20","60","más de 80","más de 140"]', 3,
 'Saturno tiene más de 140 lunas confirmadas (2024), siendo el planeta con más satélites conocidos.',
 'hard'),

('astronomia', '¿Cuántas lunas tiene Urano?',
 '["5","13","27","45"]', 2,
 'Urano tiene 27 lunas conocidas. Las cinco más grandes son Miranda, Ariel, Umbriel, Titania y Oberón.',
 'hard'),

('astronomia', '¿Cuántas lunas tiene Neptuno?',
 '["1","8","14","20"]', 2,
 'Neptuno tiene 14 lunas conocidas. La más grande es Tritón, que orbita en sentido retrógrado.',
 'hard'),

('astronomia', '¿Cuál es la mayor luna de Neptuno?',
 '["Nereida","Tritón","Náyade","Larisa"]', 1,
 'Tritón es la mayor luna de Neptuno y la séptima del sistema solar. Tiene volcanes de nitrógeno.',
 'hard'),

('astronomia', '¿Cuántos planetas tiene el sistema solar?',
 '["7","8","9","10"]', 1,
 'El sistema solar tiene 8 planetas oficialmente, desde que Plutón fue reclasificado como planeta enano en 2006.',
 'easy'),

('astronomia', '¿Cuándo dejó Plutón de ser considerado planeta?',
 '["2003","2006","2010","2015"]', 1,
 'La Unión Astronómica Internacional reclasificó a Plutón como "planeta enano" en agosto de 2006.',
 'medium'),

('astronomia', '¿Cuántos planetas enanos hay oficialmente?',
 '["3","4","5","8"]', 2,
 'La UAI reconoce 5 planetas enanos: Ceres, Plutón, Haumea, Makemake y Eris.',
 'hard'),

('astronomia', '¿Qué planeta enano está en el cinturón de asteroides?',
 '["Plutón","Eris","Ceres","Haumea"]', 2,
 'Ceres, el planeta enano más cercano al Sol, está en el cinturón de asteroides entre Marte y Júpiter.',
 'hard'),

('astronomia', '¿Qué planeta enano es más grande que Plutón?',
 '["Eris","Ceres","Haumea","Ninguno"]', 0,
 'Eris (descubierto en 2005) es más masivo que Plutón aunque ligeramente menor en diámetro. Su descubrimiento provocó la "degradación" de Plutón.',
 'hard'),

('astronomia', '¿Cuánto tarda Mercurio en dar la vuelta al Sol?',
 '["88 días","165 días","365 días","1 año"]', 0,
 'Mercurio tiene el año más corto del sistema solar: 88 días terrestres.',
 'medium'),

('astronomia', '¿Cuánto tarda Venus en dar la vuelta al Sol?',
 '["88 días","225 días","365 días","687 días"]', 1,
 'Venus tarda unos 225 días terrestres en orbitar el Sol.',
 'medium'),

('astronomia', '¿Cuánto tarda Marte en dar la vuelta al Sol?',
 '["365 días","687 días","30 días","2 años"]', 1,
 'Marte tarda unos 687 días terrestres (1,88 años) en dar la vuelta al Sol.',
 'medium'),

('astronomia', '¿Cuánto tarda Júpiter en dar la vuelta al Sol?',
 '["6 años","12 años","29 años","84 años"]', 1,
 'Júpiter tarda unos 12 años terrestres en dar la vuelta al Sol.',
 'medium'),

('astronomia', '¿Cuánto tarda Saturno en orbitar el Sol?',
 '["12 años","29 años","84 años","165 años"]', 1,
 'Saturno tarda unos 29,5 años terrestres en dar la vuelta al Sol.',
 'hard'),

('astronomia', '¿Cuánto tarda Urano en orbitar el Sol?',
 '["12 años","29 años","84 años","165 años"]', 2,
 'Urano tarda unos 84 años terrestres en dar la vuelta al Sol.',
 'hard'),

('astronomia', '¿Cuánto tarda Neptuno en orbitar el Sol?',
 '["29 años","84 años","165 años","248 años"]', 2,
 'Neptuno tarda unos 165 años terrestres en dar la vuelta al Sol.',
 'hard'),

('astronomia', '¿Cuál es el satélite natural de la Tierra?',
 '["Luna","Phobos","Deimos","Tritón"]', 0,
 'La Luna es el único satélite natural de la Tierra. Su distancia media es de 384.400 km.',
 'easy'),

('astronomia', '¿Cómo se llaman las lunas de Marte?',
 '["Phobos y Deimos","Ío y Europa","Tritón y Nereida","Mimas y Encélado"]', 0,
 'Phobos y Deimos son las dos pequeñas lunas de Marte, probablemente asteroides capturados.',
 'medium'),

('astronomia', '¿Cuál es la temperatura aproximada de Venus?',
 '["50 °C","100 °C","465 °C","-50 °C"]', 2,
 'Venus tiene una temperatura superficial de unos 465 °C debido al intenso efecto invernadero de su atmósfera de CO₂.',
 'medium'),

('astronomia', '¿Por qué Venus es el planeta más caliente?',
 '["Está más cerca del Sol","Por su efecto invernadero","Tiene actividad volcánica","Es naranja"]', 1,
 'Aunque Mercurio está más cerca del Sol, Venus es más caliente por el extremo efecto invernadero de su atmósfera de CO₂.',
 'medium'),

('astronomia', '¿Cuál es el planeta más cercano a la Tierra?',
 '["Mercurio","Venus","Marte","Saturno"]', 1,
 'Venus es el planeta más cercano a la Tierra. Su distancia mínima es de unos 38 millones de km.',
 'medium'),

('astronomia', '¿De qué color es Marte en el cielo nocturno?',
 '["Azul","Rojizo","Verde","Blanco"]', 1,
 'Marte se ve rojizo en el cielo. El color se debe al óxido de hierro (óxido férrico) en su superficie.',
 'easy'),

('astronomia', '¿Cuál es el monte más alto del sistema solar?',
 '["Everest","Olympus Mons (Marte)","Mauna Kea","Mons Huygens"]', 1,
 'Olympus Mons, en Marte, es el volcán más alto del sistema solar: ~22 km de altura.',
 'hard'),

('astronomia', '¿Qué planeta tiene tormentas más intensas que duran siglos?',
 '["Tierra","Júpiter","Saturno","Marte"]', 1,
 'La Gran Mancha Roja de Júpiter es una tormenta anticiclónica que dura al menos 350 años.',
 'medium'),

('astronomia', '¿Qué es un meteorito?',
 '["Roca que llega a la superficie de la Tierra","Estrella fugaz","Cometa","Asteroide grande"]', 0,
 'Un meteorito es un fragmento rocoso del espacio que sobrevive al paso por la atmósfera e impacta en la Tierra.',
 'easy'),

('astronomia', '¿Qué es un asteroide?',
 '["Pequeño cuerpo rocoso que orbita el Sol","Estrella menor","Cometa congelado","Luna sin planeta"]', 0,
 'Los asteroides son pequeños cuerpos rocosos que orbitan el Sol, principalmente entre Marte y Júpiter.',
 'easy'),

('astronomia', '¿Qué es un cometa?',
 '["Cuerpo de hielo y polvo que produce cola","Estrella","Asteroide rocoso","Satélite"]', 0,
 'Un cometa es un cuerpo formado principalmente de hielo y polvo. Al acercarse al Sol, sublima formando coma y cola.',
 'easy'),

('astronomia', '¿Cómo se llama el cometa que aparece cada 76 años aprox.?',
 '["Halley","Hale-Bopp","Encke","Tempel"]', 0,
 'El cometa Halley orbita el Sol cada 76 años aproximadamente. Su última visita fue en 1986 y volverá en 2061.',
 'medium'),

('astronomia', '¿Cuál es la galaxia más cercana a la Vía Láctea?',
 '["Andrómeda","Triángulo","Pequeña Nube de Magallanes","Galaxia Enana del Can Mayor"]', 3,
 'La galaxia Enana del Can Mayor está a unos 25.000 años luz. Andrómeda es la galaxia espiral grande más cercana, a 2,5 M de años luz.',
 'hard'),

('astronomia', '¿Cuándo chocará la Vía Láctea con Andrómeda (predicción)?',
 '["Dentro de 100 M años","Dentro de 4.500 M años","Dentro de 10 B años","Nunca"]', 1,
 'Se predice que la Vía Láctea y Andrómeda colisionarán en unos 4.500 millones de años.',
 'hard'),

('astronomia', '¿Cuántos años luz mide el diámetro de la Vía Láctea?',
 '["~10.000","~100.000","~1.000.000","~10.000.000"]', 1,
 'La Vía Láctea tiene unos 100.000 años luz de diámetro y unas 100-400 mil millones de estrellas.',
 'medium'),

('astronomia', '¿Cuál es la nebulosa más famosa y visible a simple vista?',
 '["Nebulosa de Orión","Nebulosa del Cangrejo","Nebulosa del Anillo","Nebulosa de la Hélice"]', 0,
 'La Nebulosa de Orión (M42), en la constelación de Orión, es visible a simple vista en el "cinturón" de Orión.',
 'medium'),

('astronomia', '¿Qué telescopio espacial fue lanzado en 1990?',
 '["Hubble","James Webb","Spitzer","Kepler"]', 0,
 'El telescopio espacial Hubble fue lanzado por la NASA el 24 de abril de 1990.',
 'easy'),

('astronomia', '¿Qué telescopio espacial se lanzó en 2021?',
 '["Hubble","James Webb","Kepler","TESS"]', 1,
 'El telescopio James Webb se lanzó el 25 de diciembre de 2021. Comenzó operaciones científicas en julio de 2022.',
 'medium'),

('astronomia', '¿A qué distancia opera el telescopio James Webb?',
 '["En la órbita terrestre","En el punto L2 (~1,5 M km)","En la órbita de la Luna","En el espacio interestelar"]', 1,
 'El telescopio James Webb opera en el punto de Lagrange 2 (L2), a unos 1,5 millones de km de la Tierra.',
 'hard'),

('astronomia', '¿Cuántas constelaciones reconoce la UAI?',
 '["48","88","100","256"]', 1,
 'La Unión Astronómica Internacional reconoce oficialmente 88 constelaciones desde 1928.',
 'hard'),

('astronomia', '¿Qué constelación contiene la estrella Polar?',
 '["Osa Mayor","Osa Menor","Casiopea","Cisne"]', 1,
 'La Estrella Polar (Polaris) está en la constelación de la Osa Menor. Indica el norte celeste.',
 'medium'),

('astronomia', '¿Cuál es la estrella más brillante del cielo nocturno?',
 '["Polaris","Sirio","Antares","Vega"]', 1,
 'Sirio, en la constelación del Can Mayor, es la estrella más brillante del cielo nocturno (magnitud -1,46).',
 'medium'),

('astronomia', '¿En qué constelación está Sirio?',
 '["Orión","Tauro","Can Mayor","Can Menor"]', 2,
 'Sirio está en la constelación del Can Mayor (Canis Major). Es la "estrella del perro".',
 'hard'),

('astronomia', '¿Qué constelación tiene forma de "W"?',
 '["Cisne","Casiopea","Pegaso","Orión"]', 1,
 'Casiopea, en el cielo del norte, tiene forma de "W" o "M". Es circumpolar para latitudes medias del hemisferio norte.',
 'medium'),

('astronomia', '¿Qué constelación tiene tres estrellas alineadas en su "cinturón"?',
 '["Cisne","Pegaso","Orión","Casiopea"]', 2,
 'Orión, el cazador, se reconoce por las tres estrellas alineadas de su cinturón: Alnitak, Alnilam y Mintaka.',
 'easy'),

('astronomia', '¿Qué cinturón se sitúa entre Marte y Júpiter?',
 '["Cinturón de Kuiper","Cinturón de asteroides","Nube de Oort","Anillos planetarios"]', 1,
 'El cinturón de asteroides principal está entre las órbitas de Marte y Júpiter.',
 'medium'),

('astronomia', '¿Qué es el cinturón de Kuiper?',
 '["Anillo de cuerpos helados más allá de Neptuno","Cinturón de asteroides","Nube cometaria","Galaxia"]', 0,
 'El cinturón de Kuiper es una región más allá de Neptuno con cuerpos helados, incluyendo Plutón.',
 'hard'),

('astronomia', '¿Qué es la nube de Oort?',
 '["Una nebulosa","Esfera lejana de objetos cometarios","Una galaxia","Una constelación"]', 1,
 'La Nube de Oort es una esfera teórica de objetos helados (hasta ~100.000 UA del Sol). Origen de los cometas de período largo.',
 'hard'),

('astronomia', '¿Qué unidad mide la distancia entre la Tierra y el Sol?',
 '["Año luz","Pársec","Unidad Astronómica","Kilómetro"]', 2,
 '1 Unidad Astronómica (UA) = ~149,6 millones de km, la distancia media Tierra-Sol.',
 'medium'),

('astronomia', '¿Cuántos km tiene un año luz aproximadamente?',
 '["9,46 mil millones","9,46 billones","9,46 trillones","9,46 mil"]', 1,
 'Un año luz equivale a aproximadamente 9,46 billones (10¹²) de kilómetros.',
 'hard'),

('astronomia', '¿A qué velocidad se mide la luz en km/s?',
 '["300.000","30.000","3.000.000","30.000.000"]', 0,
 'La velocidad de la luz en el vacío es de aproximadamente 300.000 km/s (exactamente 299.792,458 km/s).',
 'easy'),

('astronomia', '¿Qué nombre recibe la teoría que explica el origen del universo?',
 '["Estado estacionario","Big Bang","Inflación","Multiverso"]', 1,
 'La teoría del Big Bang propone que el universo se originó hace unos 13.800 millones de años desde un estado denso y caliente.',
 'easy'),

('astronomia', '¿Hace cuántos años ocurrió el Big Bang?',
 '["4.500 millones","6.000 millones","13.800 millones","20.000 millones"]', 2,
 'Según las mejores estimaciones, el Big Bang ocurrió hace ~13.800 millones (13,8 mil millones) de años.',
 'medium'),

('astronomia', '¿Qué constituye aprox. el 27% del universo según la cosmología actual?',
 '["Materia ordinaria","Materia oscura","Energía oscura","Luz"]', 1,
 'La materia oscura constituye aproximadamente el 27% del universo. La materia ordinaria solo el 5%. El resto (68%) es energía oscura.',
 'hard'),

('astronomia', '¿Qué constituye aprox. el 68% del universo?',
 '["Materia ordinaria","Materia oscura","Energía oscura","Luz"]', 2,
 'La energía oscura constituye ~68% del universo. Es la responsable de la expansión acelerada del universo.',
 'hard'),

('astronomia', '¿Quién propuso la expansión del universo?',
 '["Einstein","Hubble","Lemaître","Hawking"]', 1,
 'Edwin Hubble observó en 1929 que las galaxias se alejan, evidenciando la expansión del universo. Georges Lemaître lo había propuesto teóricamente.',
 'hard'),

('astronomia', '¿Qué fenómeno demuestra la expansión del universo?',
 '["Corrimiento al rojo","Lente gravitacional","Microondas","Onda gravitacional"]', 0,
 'El corrimiento al rojo (redshift) de la luz de galaxias lejanas demuestra que se alejan de nosotros.',
 'hard'),

('astronomia', '¿Qué evento es la prueba del Big Bang?',
 '["Radiación cósmica de fondo","Materia oscura","Inflación","Antimateria"]', 0,
 'La radiación cósmica de microondas (CMB), descubierta en 1964, es la "luz residual" del Big Bang.',
 'hard'),

('astronomia', '¿Qué tipo de estrella es nuestro Sol?',
 '["Enana roja","Enana blanca","G2V (Enana amarilla)","Supergigante azul"]', 2,
 'El Sol es una estrella enana amarilla de tipo espectral G2V.',
 'medium'),

('astronomia', '¿Cuál es la edad del Sol aproximadamente?',
 '["1.000 millones","4.600 millones","10.000 millones","13.800 millones"]', 1,
 'El Sol tiene unos 4.600 millones de años. Se formó al mismo tiempo que el resto del sistema solar.',
 'medium'),

('astronomia', '¿Cuánto tiempo más vivirá el Sol como estrella estable (aprox.)?',
 '["100 millones","1.000 millones","5.000 millones","10.000 millones"]', 2,
 'El Sol tiene unos 5.000 millones de años más como estrella de secuencia principal antes de convertirse en gigante roja.',
 'hard'),

('astronomia', '¿Qué es una supernova?',
 '["Una explosión estelar masiva","Una galaxia nueva","Una estrella joven","Un agujero negro"]', 0,
 'Una supernova es la explosión masiva al final de la vida de una estrella muy masiva o un sistema binario con enana blanca.',
 'medium'),

('astronomia', '¿Qué queda tras una supernova?',
 '["Una estrella de neutrones o agujero negro","Una gigante roja","Otra galaxia","Un cometa"]', 0,
 'Tras una supernova puede quedar una estrella de neutrones o un agujero negro (según la masa original).',
 'hard'),

('astronomia', '¿Qué es una estrella de neutrones?',
 '["Núcleo estelar extremadamente denso","Estrella muy fría","Estrella joven","Galaxia"]', 0,
 'Las estrellas de neutrones son remanentes estelares ultradensos. Una cucharadita pesaría miles de millones de toneladas.',
 'hard'),

('astronomia', '¿Qué es un quasar?',
 '["Núcleo galáctico ultrabrillante","Cometa","Asteroide","Tipo de estrella"]', 0,
 'Los quasares son núcleos galácticos activos con agujeros negros supermasivos en su centro, extremadamente brillantes.',
 'hard'),

('astronomia', '¿Quién predijo la existencia de los agujeros negros (mat.)?',
 '["Einstein","Schwarzschild","Hawking","Penrose"]', 1,
 'Karl Schwarzschild encontró en 1916 la primera solución de las ecuaciones de Einstein que predecía agujeros negros.',
 'hard'),

('astronomia', '¿Quién investigó la radiación de los agujeros negros?',
 '["Einstein","Penrose","Hawking","Schwarzschild"]', 2,
 'Stephen Hawking predijo en 1974 que los agujeros negros emiten radiación ("radiación de Hawking") y pueden evaporarse.',
 'medium'),

('astronomia', '¿Qué es el horizonte de sucesos de un agujero negro?',
 '["Su superficie luminosa","Punto de no retorno","Su núcleo","Su atmósfera"]', 1,
 'El horizonte de sucesos es el límite donde la velocidad de escape iguala a c. Una vez cruzado, nada (ni la luz) puede salir.',
 'hard'),

('astronomia', '¿Qué es Sagitario A*?',
 '["Estrella","Agujero negro supermasivo del centro de la Vía Láctea","Nebulosa","Galaxia"]', 1,
 'Sgr A* es el agujero negro supermasivo en el centro de la Vía Láctea, con 4,3 millones de masas solares.',
 'hard'),

('astronomia', '¿Qué planeta tiene el día más largo en el sistema solar?',
 '["Venus","Mercurio","Júpiter","Saturno"]', 0,
 'Venus tiene un día (rotación) de 243 días terrestres, más largo que su año (225 días).',
 'medium'),

('astronomia', '¿En qué dirección rota Venus?',
 '["Igual que la Tierra","Retrógrada","No rota","Aleatoria"]', 1,
 'Venus rota en sentido retrógrado (este a oeste), al contrario que la mayoría de planetas del sistema solar.',
 'hard'),

('astronomia', '¿En qué dirección rota Urano?',
 '["Vertical","De lado (eje muy inclinado)","Igual que la Tierra","Retrógrada"]', 1,
 'Urano tiene su eje de rotación inclinado ~98°, por lo que rota "de lado" respecto al plano de su órbita.',
 'hard'),

('astronomia', '¿Qué es el solsticio de verano (hemisferio norte)?',
 '["~21 de junio (día más largo)","~21 de diciembre","~21 de marzo","~21 de septiembre"]', 0,
 'El solsticio de verano en el hemisferio norte ocurre alrededor del 21 de junio, día más largo del año.',
 'easy'),

('astronomia', '¿Cuándo ocurre el equinoccio de primavera (hemisferio norte)?',
 '["~21 de marzo","~21 de junio","~21 de septiembre","~21 de diciembre"]', 0,
 'El equinoccio de primavera en el hemisferio norte ocurre alrededor del 20-21 de marzo. Día y noche aproximadamente iguales.',
 'medium'),

('astronomia', '¿Qué fenómeno hace que veamos siempre la misma cara de la Luna?',
 '["No rota","Acoplamiento de marea","Es plana","Es transparente"]', 1,
 'La Luna está acoplada por marea con la Tierra: su periodo de rotación coincide con su periodo orbital, mostrando siempre la misma cara.',
 'medium'),

('astronomia', '¿Cuánto tarda la Luna en orbitar la Tierra?',
 '["~27 días","~30 días","~365 días","~7 días"]', 0,
 'La Luna tarda unos 27,3 días en orbitar la Tierra (mes sidéreo). El mes sinódico (entre lunas nuevas) es ~29,5 días.',
 'medium'),

('astronomia', '¿Qué pasa durante un eclipse solar?',
 '["Luna se interpone entre el Sol y la Tierra","La Tierra se interpone entre la Luna y el Sol","La Luna se oscurece","Nada visible"]', 0,
 'Un eclipse solar ocurre cuando la Luna se interpone entre el Sol y la Tierra, ocultándolo.',
 'easy'),

('astronomia', '¿Qué pasa durante un eclipse lunar?',
 '["Luna se interpone","Tierra se interpone entre Sol y Luna","Sol se oculta","Eclipses no existen"]', 1,
 'Un eclipse lunar ocurre cuando la Tierra se interpone entre el Sol y la Luna, proyectando su sombra sobre ella.',
 'medium'),

('astronomia', '¿Quién fue el primer cosmonauta?',
 '["Yuri Gagarin","Neil Armstrong","Buzz Aldrin","Alan Shepard"]', 0,
 'Yuri Gagarin (URSS) fue el primer humano en viajar al espacio el 12 de abril de 1961, en la nave Vostok 1.',
 'medium'),

('astronomia', '¿Quién fue la primera mujer en el espacio?',
 '["Valentina Tereshkova","Sally Ride","Mae Jemison","Kathryn Sullivan"]', 0,
 'Valentina Tereshkova (URSS) fue la primera mujer en el espacio el 16 de junio de 1963.',
 'medium'),

('astronomia', '¿En qué año pisó el ser humano la Luna por primera vez?',
 '["1965","1969","1972","1975"]', 1,
 'Neil Armstrong y Buzz Aldrin pisaron la Luna el 20 de julio de 1969 con la misión Apolo 11.',
 'easy'),

('astronomia', '¿Cuántas misiones Apolo aterrizaron en la Luna?',
 '["5","6","7","8"]', 1,
 'Seis misiones Apolo aterrizaron en la Luna: Apolo 11, 12, 14, 15, 16 y 17 (entre 1969 y 1972). La 13 falló.',
 'hard'),

('astronomia', '¿Cuándo fue la última misión Apolo tripulada a la Luna?',
 '["1969","1971","1972","1975"]', 2,
 'La última misión tripulada a la Luna fue Apolo 17 en diciembre de 1972, con Gene Cernan como último humano en la Luna.',
 'hard'),

('astronomia', '¿Qué agencia espacial dirige el programa Artemis?',
 '["NASA","ESA","Roscosmos","ISRO"]', 0,
 'El programa Artemis de la NASA busca llevar humanos de nuevo a la Luna en 2025-2026, incluyendo la primera mujer.',
 'medium'),

('astronomia', '¿Qué es la ISS?',
 '["Estación Espacial Internacional","Misión a Marte","Telescopio","Satélite de comunicaciones"]', 0,
 'La Estación Espacial Internacional (ISS) orbita la Tierra desde 1998. Cooperación entre NASA, Roscosmos, ESA, JAXA y CSA.',
 'easy'),

('astronomia', '¿A qué altitud orbita la ISS aproximadamente?',
 '["100 km","400 km","1.000 km","10.000 km"]', 1,
 'La ISS orbita a unos 400 km de altitud. Da una vuelta a la Tierra cada ~90 minutos.',
 'medium'),

('astronomia', '¿Qué misión llegó a Plutón en 2015?',
 '["Voyager 1","Voyager 2","New Horizons","Cassini"]', 2,
 'La sonda New Horizons de la NASA pasó cerca de Plutón el 14 de julio de 2015.',
 'medium'),

('astronomia', '¿Qué sonda exploró Saturno hasta 2017?',
 '["Voyager","Galileo","Cassini","Juno"]', 2,
 'La misión Cassini-Huygens orbitó Saturno desde 2004 a 2017. Huygens aterrizó en Titán en 2005.',
 'hard'),

('astronomia', '¿Qué sonda explora Júpiter actualmente?',
 '["Voyager","Galileo","Juno","Cassini"]', 2,
 'La sonda Juno de la NASA, lanzada en 2011, orbita Júpiter desde 2016.',
 'hard'),

('astronomia', '¿Qué sonda llegó a Marte con el rover Perseverance?',
 '["Curiosity","Mars 2020","Spirit","Opportunity"]', 1,
 'La misión Mars 2020 llevó el rover Perseverance, que aterrizó en Marte el 18 de febrero de 2021.',
 'hard'),

('astronomia', '¿Qué pequeño helicóptero exploró Marte?',
 '["Ingenuity","Resilience","Curiosity","Sojourner"]', 0,
 'Ingenuity, helicóptero de la NASA, llegó a Marte con Perseverance en 2021. Primer vuelo motorizado en otro planeta.',
 'hard'),

('astronomia', '¿Qué empresa privada ha logrado más lanzamientos espaciales recientemente?',
 '["Blue Origin","SpaceX","Rocket Lab","Virgin Galactic"]', 1,
 'SpaceX, fundada por Elon Musk, lidera los lanzamientos espaciales privados con su cohete Falcon 9.',
 'easy'),

('astronomia', '¿Qué cohete reutilizable hizo famoso a SpaceX?',
 '["Falcon 1","Falcon 9","Starship","Dragon"]', 1,
 'Falcon 9 fue el primer cohete orbital de etapa reutilizable. Su primer aterrizaje exitoso fue en diciembre de 2015.',
 'medium'),

('astronomia', '¿Cómo se llama el cohete de SpaceX para Marte?',
 '["Falcon Heavy","Starship","Dragon","Crew"]', 1,
 'Starship es el cohete pesado de SpaceX, diseñado para misiones a la Luna, Marte y más allá. En pruebas desde 2023.',
 'medium'),

('astronomia', '¿Qué ondas emiten los púlsares?',
 '["Ondas de radio","Ondas sonoras","Ondas gravitacionales","Luz visible"]', 0,
 'Los púlsares son estrellas de neutrones que emiten haces de ondas de radio (y a veces otras) en intervalos regulares.',
 'hard'),

('astronomia', '¿Quién descubrió los púlsares?',
 '["Hubble","Hawking","Jocelyn Bell","Penzias y Wilson"]', 2,
 'Jocelyn Bell Burnell descubrió el primer púlsar en 1967 como estudiante de doctorado en Cambridge.',
 'hard'),

('astronomia', '¿Cuántas galaxias se estima que hay en el universo observable?',
 '["~100 millones","~2 billones","~10 trillones","~100"]', 1,
 'Se estima que el universo observable contiene aproximadamente 2 billones (10¹²) de galaxias.',
 'hard'),

('astronomia', '¿Qué es un exoplaneta?',
 '["Planeta fuera del sistema solar","Planeta enano","Asteroide","Cometa"]', 0,
 'Un exoplaneta es un planeta que orbita una estrella distinta del Sol. Se han confirmado más de 5.500 exoplanetas.',
 'medium'),

('astronomia', '¿Qué es la zona de Goldilocks?',
 '["Zona habitable de una estrella","Núcleo galáctico","Anillo planetario","Zona de no retorno"]', 0,
 'La zona habitable o de Goldilocks es la región alrededor de una estrella donde podría existir agua líquida en la superficie de un planeta.',
 'hard'),

('astronomia', '¿Qué telescopio ha confirmado miles de exoplanetas?',
 '["Hubble","Kepler","TESS","Kepler y TESS"]', 3,
 'Los telescopios Kepler (2009-2018) y TESS (desde 2018) de la NASA han confirmado miles de exoplanetas.',
 'hard'),

('astronomia', '¿Qué es la luz zodiacal?',
 '["Polvo del sistema solar dispersando luz","Aurora boreal","Halo solar","Vía Láctea"]', 0,
 'La luz zodiacal es un brillo tenue producido por la dispersión de la luz solar en el polvo del plano del sistema solar.',
 'hard'),

('astronomia', '¿Qué fenómeno crea las auroras boreales?',
 '["Viento solar y campo magnético","Volcanes","Tormentas","Eclipses"]', 0,
 'Las auroras se producen cuando partículas cargadas del viento solar chocan con la atmósfera, guiadas por el campo magnético terrestre.',
 'medium'),

('astronomia', '¿Quién definió las leyes del movimiento planetario?',
 '["Copérnico","Kepler","Galileo","Newton"]', 1,
 'Johannes Kepler formuló sus tres leyes del movimiento planetario entre 1609 y 1619.',
 'medium'),

('astronomia', '¿Quién unificó las leyes terrestres y celestes con la gravedad?',
 '["Kepler","Galileo","Newton","Einstein"]', 2,
 'Isaac Newton unificó las leyes terrestres y celestes en su "Principia" (1687) con la ley de la gravitación universal.',
 'medium'),

('astronomia', '¿Quién revolucionó nuestra comprensión de la gravedad con la relatividad?',
 '["Newton","Einstein","Hubble","Hawking"]', 1,
 'Albert Einstein publicó la teoría de la relatividad general en 1915, describiendo la gravedad como curvatura del espacio-tiempo.',
 'easy');
