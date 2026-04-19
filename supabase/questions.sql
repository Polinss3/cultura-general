-- ─────────────────────────────────────────────────────────────
-- Cultura General — Banco de preguntas completo (~220 preguntas)
-- Ejecutar DESPUÉS de schema.sql
-- Si ya tienes preguntas del seed.sql anterior, puedes ejecutar
-- este fichero directamente: no borra las existentes.
-- ─────────────────────────────────────────────────────────────

insert into public.questions (category, question, options, answer_index, context, difficulty) values

-- ══════════════════════════════════════════════════════════════
-- HISTORIA
-- ══════════════════════════════════════════════════════════════

('historia', '¿En qué año terminó la Primera Guerra Mundial?',
 '["1916","1917","1918","1919"]', 2,
 'La Primera Guerra Mundial terminó el 11 de noviembre de 1918 con la firma del Armisticio de Compiègne. El conflicto causó más de 20 millones de muertos.',
 'easy'),

('historia', '¿Quién fue el primer emperador de Roma?',
 '["Julio César","Augusto","Nerón","Tiberio"]', 1,
 'Augusto (Octavio) fue el primer emperador romano, gobernando del 27 a.C. al 14 d.C. Julio César nunca fue oficialmente «emperador».',
 'medium'),

('historia', '¿En qué año cayó el Muro de Berlín?',
 '["1987","1988","1989","1991"]', 2,
 'El Muro de Berlín cayó el 9 de noviembre de 1989, símbolo del fin de la Guerra Fría y el inicio de la reunificación alemana.',
 'easy'),

('historia', '¿Qué civilización construyó Machu Picchu?',
 '["Azteca","Maya","Inca","Olmeca"]', 2,
 'Machu Picchu fue construida por el Imperio Inca en el siglo XV como residencia del emperador Pachacútec, a 2.430 m de altitud.',
 'easy'),

('historia', '¿En qué año llegó Cristóbal Colón a América?',
 '["1490","1492","1498","1502"]', 1,
 'El 12 de octubre de 1492, Colón llegó a Guanahaní (Bahamas) creyendo haber llegado a Asia. Marcó el inicio de la era colonial.',
 'easy'),

('historia', '¿En qué año terminó la Segunda Guerra Mundial?',
 '["1943","1944","1945","1946"]', 2,
 'La Segunda Guerra Mundial terminó en 1945: en Europa el 8 de mayo (V-E Day) y en el Pacífico el 2 de septiembre, tras la rendición de Japón.',
 'easy'),

('historia', '¿Quién fue el primer presidente de los Estados Unidos?',
 '["John Adams","Benjamin Franklin","Thomas Jefferson","George Washington"]', 3,
 'George Washington fue el primer presidente de EE.UU. (1789-1797). Fue líder militar durante la Revolución Americana.',
 'easy'),

('historia', '¿En qué año comenzó la Revolución Francesa?',
 '["1785","1787","1789","1791"]', 2,
 'La Revolución Francesa comenzó en 1789 con la toma de la Bastilla el 14 de julio. Proclamó los ideales de libertad, igualdad y fraternidad.',
 'easy'),

('historia', '¿Quién fue Napoleón Bonaparte?',
 '["Rey de Francia","Emperador de Francia","Presidente de Francia","General sin cargo político"]', 1,
 'Napoleón fue Emperador de los Franceses (1804-1815). Conquistó gran parte de Europa antes de ser derrotado en Waterloo.',
 'easy'),

('historia', '¿En qué batalla fue derrotado definitivamente Napoleón?',
 '["Leipzig","Trafalgar","Austerlitz","Waterloo"]', 3,
 'En Waterloo (1815), las fuerzas aliadas de Wellington y Blücher derrotaron a Napoleón, quien fue exiliado a Santa Elena donde murió en 1821.',
 'medium'),

('historia', '¿Qué imperio fue conocido como el «Imperio donde nunca se pone el sol»?',
 '["Imperio Romano","Imperio Mongol","Imperio Británico","Imperio Español"]', 2,
 'El Imperio Británico en su apogeo (siglo XIX) abarcó el 24% de la superficie terrestre. La frase también se atribuye antes al Imperio Español.',
 'medium'),

('historia', '¿Quién fue Cleopatra?',
 '["Reina de Egipto","Emperatriz romana","Princesa griega","Faraona de Nubia"]', 0,
 'Cleopatra VII fue la última reina activa del Antiguo Egipto (69-30 a.C.). Tuvo romances con Julio César y Marco Antonio. Hablaba 9 idiomas.',
 'easy'),

('historia', '¿En qué año se firmó la Carta Magna en Inglaterra?',
 '["1150","1215","1265","1320"]', 1,
 'La Carta Magna fue firmada en 1215 por el rey Juan I de Inglaterra, limitando el poder real y sentando bases del constitucionalismo moderno.',
 'hard'),

('historia', '¿Qué civilización construyó las pirámides de Guiza?',
 '["Sumeria","Fenicia","Antiguo Egipto","Nubia"]', 2,
 'Las pirámides de Guiza fueron construidas por el Antiguo Egipto, aproximadamente entre 2560 y 2490 a.C. La Gran Pirámide es la de Keops.',
 'easy'),

('historia', '¿Cuál fue la primera ciudad de la historia?',
 '["Babilonia","Uruk","Menfis","Jericó"]', 1,
 'Uruk (actual Irak) es considerada la primera ciudad de la historia, con ~50.000 habitantes hacia 3200 a.C. Origen de la escritura cuneiforme.',
 'hard'),

('historia', '¿Qué guerra enfrentó a Atenas y Esparta?',
 '["Guerra del Peloponeso","Guerras Médicas","Guerra de Troya","Guerra de Corinto"]', 0,
 'La Guerra del Peloponeso (431-404 a.C.) enfrentó a la Liga de Delos (Atenas) con la Liga del Peloponeso (Esparta). Ganó Esparta.',
 'medium'),

('historia', '¿En qué año cayó el Imperio Romano de Occidente?',
 '["376","410","455","476"]', 3,
 'El Imperio Romano de Occidente cayó en 476 d.C. cuando Odoacro depuso al último emperador, Rómulo Augústulo.',
 'hard'),

('historia', '¿Quién fue el conquistador del Imperio Azteca?',
 '["Francisco Pizarro","Hernán Cortés","Vasco de Gama","Amerigo Vespucci"]', 1,
 'Hernán Cortés conquistó el Imperio Azteca entre 1519-1521, apoyado por alianzas con pueblos rivales y la viruela que diezmó la población.',
 'medium'),

('historia', '¿Qué acontecimiento desencadenó la Primera Guerra Mundial?',
 '["Invasión de Polonia","Asesinato del archiduque Francisco Fernando","Huelga general europea","Hundimiento del Lusitania"]', 1,
 'El asesinato del archiduque austro-húngaro Francisco Fernando en Sarajevo (28 junio 1914) desencadenó la cadena de alianzas que llevó a la guerra.',
 'medium'),

('historia', '¿Qué fue la Inquisición española?',
 '["Una guerra religiosa","Un tribunal eclesiástico","Un partido político","Un movimiento artístico"]', 1,
 'La Inquisición española (1478-1834) fue un tribunal eclesiástico creado por los Reyes Católicos para mantener la ortodoxia católica.',
 'medium'),

('historia', '¿En qué año se produjo la Revolución Rusa?',
 '["1905","1914","1917","1921"]', 2,
 'La Revolución Rusa de 1917 tuvo dos fases: la revolución de febrero (caída del zar) y la de octubre (toma del poder por los bolcheviques).',
 'medium'),

('historia', '¿Quién fue Adolf Hitler?',
 '["Presidente de Alemania","Canciller y Führer de Alemania","General del ejército alemán","Rey de Prusia"]', 1,
 'Hitler fue canciller desde 1933 y se autoproclamó Führer en 1934. Lideró el nazismo, causando el Holocausto y la Segunda Guerra Mundial.',
 'easy'),

('historia', '¿Qué fue el Apartheid?',
 '["Una revolución en Sudáfrica","Un sistema de segregación racial en Sudáfrica","Una guerra civil en Angola","Un partido político africano"]', 1,
 'El Apartheid fue un régimen de segregación racial en Sudáfrica (1948-1991). Nelson Mandela luchó contra él y fue encarcelado 27 años.',
 'medium'),

('historia', '¿En qué año llegó el hombre a la Luna?',
 '["1965","1967","1969","1971"]', 2,
 'El 20 de julio de 1969, Neil Armstrong y Buzz Aldrin (Apolo 11) pisaron la Luna. Armstrong fue el primero en decir «un pequeño paso para el hombre».',
 'easy'),

('historia', '¿Qué guerra civil tuvo lugar en España entre 1936 y 1939?',
 '["La guerra de Cuba","La guerra de Marruecos","La guerra civil española","La guerra de Sucesión"]', 2,
 'La guerra civil española (1936-1939) enfrentó al bando republicano con el bando nacional (Franco). Terminó con la dictadura franquista que duró hasta 1975.',
 'easy'),

('historia', '¿Quién fue Marco Polo?',
 '["Un navegante portugués","Un explorador italiano que viajó a China","Un conquistador español","Un cartógrafo holandés"]', 1,
 'Marco Polo (1254-1324) fue un mercader y explorador veneciano que viajó a la corte del Gran Khan en China y describió sus viajes en «El libro de las maravillas».',
 'medium'),

('historia', '¿Qué fue la Reconquista española?',
 '["La conquista de América","La recuperación de territorios peninsulares ocupados por musulmanes","La guerra contra Portugal","La unificación de Castilla y Aragón"]', 1,
 'La Reconquista (711-1492) fue el proceso por el que los reinos cristianos recuperaron la Península Ibérica de los musulmanes. Terminó con la toma de Granada.',
 'medium'),

('historia', '¿Cuál fue el primer país en conceder el voto a la mujer?',
 '["Reino Unido","Estados Unidos","Nueva Zelanda","Francia"]', 2,
 'Nueva Zelanda fue el primer país del mundo en conceder el sufragio femenino en 1893. Las mujeres británicas lo obtuvieron en 1918 y las francesas en 1944.',
 'hard'),

('historia', '¿Qué fue el Holocausto?',
 '["Una batalla de la IIGM","El genocidio sistemático de judíos y otros grupos por los nazis","Una epidemia en Europa","La destrucción de Dresde"]', 1,
 'El Holocausto fue el genocidio sistemático de 6 millones de judíos y millones de otras personas por el régimen nazi entre 1941 y 1945.',
 'easy'),

('historia', '¿Quién fue Gengis Kan?',
 '["Un rey chino","El fundador del Imperio Mongol","Un sultán persa","Un caudillo vikingo"]', 1,
 'Gengis Kan (1162-1227) fundó el Imperio Mongol, el mayor contiguo de la historia. Conquistó desde China hasta Europa del Este.',
 'medium'),

-- ══════════════════════════════════════════════════════════════
-- GEOGRAFÍA
-- ══════════════════════════════════════════════════════════════

('geografia', '¿Cuál es el río más largo del mundo?',
 '["Amazonas","Nilo","Yangtsé","Misisipi"]', 1,
 'El Nilo, con ~6.650 km, es considerado el río más largo. Atraviesa 11 países africanos hasta desembocar en el Mediterráneo.',
 'easy'),

('geografia', '¿En qué país se encuentra la Torre Eiffel?',
 '["Bélgica","Suiza","Francia","Italia"]', 2,
 'La Torre Eiffel está en París, Francia. Fue construida por Gustave Eiffel para la Exposición Universal de 1889 y mide 330 m.',
 'easy'),

('geografia', '¿Cuál es el país más grande del mundo por superficie?',
 '["China","Canadá","Estados Unidos","Rusia"]', 3,
 'Rusia es el país más grande, con 17,1 millones de km². Abarca 11 husos horarios y representa el 11% de la superficie terrestre.',
 'easy'),

('geografia', '¿Cuál es la capital de Australia?',
 '["Sídney","Melbourne","Canberra","Brisbane"]', 2,
 'Canberra es la capital de Australia desde 1913, diseñada expresamente para resolver la rivalidad entre Sídney y Melbourne.',
 'medium'),

('geografia', '¿Qué océano es el más grande del mundo?',
 '["Atlántico","Índico","Ártico","Pacífico"]', 3,
 'El Océano Pacífico es el más grande y profundo, cubriendo más del 30% de la superficie terrestre. Su punto más profundo es la Fosa de las Marianas.',
 'easy'),

('geografia', '¿Cuál es la montaña más alta del mundo?',
 '["K2","Monte Everest","Kangchenjunga","Lhotse"]', 1,
 'El Monte Everest (8.849 m) es la montaña más alta del mundo, en el Himalaya, en la frontera entre Nepal y China.',
 'easy'),

('geografia', '¿Cuál es el desierto más grande del mundo?',
 '["Sahara","Gobi","Kalahari","Ártico"]', 3,
 'El desierto más grande es el Ártico (13,9 millones de km²). El Sahara es el desierto caliente más grande del mundo con 9,2 millones de km².',
 'hard'),

('geografia', '¿Cuántos continentes hay en el mundo?',
 '["5","6","7","8"]', 2,
 'Según el modelo más extendido, hay 7 continentes: África, América, Antártida, Asia, Europa, Oceanía y América del Norte/Sur (o unificada).',
 'easy'),

('geografia', '¿Cuál es el lago más grande del mundo?',
 '["Mar Caspio","Lago Superior","Lago Victoria","Lago Baikal"]', 0,
 'El Mar Caspio (371.000 km²) es técnicamente el lago más grande. El Lago Superior es el mayor de agua dulce. El Baikal es el más profundo.',
 'medium'),

('geografia', '¿Cuál es el país más pequeño del mundo?',
 '["Mónaco","San Marino","Liechtenstein","Ciudad del Vaticano"]', 3,
 'Ciudad del Vaticano (0,44 km²) es el país más pequeño del mundo, enclavado en Roma. Es la sede de la Iglesia Católica.',
 'easy'),

('geografia', '¿Cuál es la capital de Japón?',
 '["Osaka","Kioto","Tokio","Hiroshima"]', 2,
 'Tokio es la capital de Japón y la ciudad más poblada del mundo, con más de 37 millones de personas en su área metropolitana.',
 'easy'),

('geografia', '¿Cuál es el río más largo de Europa?',
 '["Rin","Danubio","Volga","Támesis"]', 2,
 'El Volga (3.531 km) es el río más largo de Europa, nace en los montes Valdái y desemboca en el mar Caspio. Es símbolo de Rusia.',
 'medium'),

('geografia', '¿En qué país está el Amazonas?',
 '["Colombia","Perú","Venezuela","Brasil"]', 3,
 'La mayor parte del Amazonas (60%) está en Brasil. Tiene la mayor cuenca hidrográfica del mundo y alberga el 10% de las especies del planeta.',
 'easy'),

('geografia', '¿Cuál es el país más poblado del mundo?',
 '["China","India","Estados Unidos","Indonesia"]', 1,
 'India superó a China como el país más poblado en 2023, con más de 1.400 millones de habitantes.',
 'medium'),

('geografia', '¿Qué país tiene más fronteras terrestres?',
 '["Rusia","China","Brasil","Alemania"]', 1,
 'China comparte fronteras con 14 países, junto con Rusia (también 14). China tiene la frontera más larga del mundo.',
 'hard'),

('geografia', '¿Cuál es el pico más alto de América?',
 '["Mont Blanc","Monte McKinley","Aconcagua","Chimborazo"]', 2,
 'El Aconcagua (6.960 m) en Argentina es el pico más alto de América y del hemisferio occidental.',
 'medium'),

('geografia', '¿Cuál es la capital de Canadá?',
 '["Toronto","Vancouver","Montreal","Ottawa"]', 3,
 'Ottawa es la capital de Canadá desde 1857. Aunque Toronto y Montreal son más grandes, Ottawa fue elegida por su posición entre anglófonos y francófonos.',
 'medium'),

('geografia', '¿Cuál es el país más largo del mundo de norte a sur?',
 '["Brasil","Rusia","Chile","Argentina"]', 2,
 'Chile tiene ~4.300 km de norte a sur pero apenas 177 km de ancho. Abarca desde el desierto de Atacama hasta la Patagonia.',
 'medium'),

('geografia', '¿Dónde está el punto más profundo de los océanos?',
 '["Fosa de Puerto Rico","Fosa de las Marianas","Fosa de Tonga","Fosa de Java"]', 1,
 'La Fosa de las Marianas (Pacífico) es el punto más profundo, con 11.034 m en el «Abismo Challenger». Fue explorada por primera vez en 1960.',
 'medium'),

('geografia', '¿Cuál es el continente más pequeño?',
 '["Europa","Antártida","Australia/Oceanía","América del Sur"]', 2,
 'Australia es el continente más pequeño (7,7 millones de km²). Si se considera Oceanía como continente, incluye miles de islas del Pacífico.',
 'easy'),

('geografia', '¿Qué país tiene más islas del mundo?',
 '["Indonesia","Filipinas","Grecia","Suecia"]', 3,
 'Suecia tiene más de 220.000 islas. Indonesia tiene las islas más extensas y pobladas (17.000 islas), con 6.000 habitadas.',
 'hard'),

('geografia', '¿Cuál es el río más largo de América del Sur?',
 '["Orinoco","Paraná","Río de la Plata","Amazonas"]', 3,
 'El Amazonas (6.400 km) es el río más largo de América y el de mayor caudal del mundo, representando el 20% del agua dulce que llega a los océanos.',
 'easy'),

('geografia', '¿En qué país está la ciudad de Dubái?',
 '["Qatar","Arabia Saudí","Emiratos Árabes Unidos","Baréin"]', 2,
 'Dubái está en los Emiratos Árabes Unidos. Es la ciudad más poblada del país y alberga el edificio más alto del mundo: el Burj Khalifa (828 m).',
 'easy'),

('geografia', '¿Cuál es la capital de Brasil?',
 '["Río de Janeiro","São Paulo","Brasilia","Salvador"]', 2,
 'Brasilia es la capital de Brasil desde 1960, construida desde cero para descentralizar el país. Río de Janeiro fue capital hasta 1960.',
 'medium'),

('geografia', '¿Cuál es el volcán más alto del mundo?',
 '["Monte Etna","Monte Fuji","Ojos del Salado","Mauna Loa"]', 2,
 'El Ojos del Salado (6.893 m), en la frontera entre Chile y Argentina, es el volcán más alto del mundo.',
 'hard'),

('geografia', '¿En qué país está la ciudad de Estambul?',
 '["Grecia","Bulgaria","Turquía","Armenia"]', 2,
 'Estambul está en Turquía, a caballo entre Europa y Asia. Fue capital del Imperio Otomano (Constantinopla) y antes del Bizantino.',
 'easy'),

('geografia', '¿Cuál es el país más grande de África?',
 '["Nigeria","Sudán","República Democrática del Congo","Argelia"]', 3,
 'Argelia es el país más grande de África (2,38 millones de km²), tras la división de Sudán en 2011. Su capital es Argel.',
 'medium'),

('geografia', '¿Cuántos países tiene América del Sur?',
 '["10","12","14","16"]', 1,
 'América del Sur tiene 12 países: Argentina, Bolivia, Brasil, Chile, Colombia, Ecuador, Guyana, Paraguay, Perú, Surinam, Uruguay y Venezuela.',
 'medium'),

('geografia', '¿Cuál es el punto más alto de Europa?',
 '["Mont Blanc","Monte Rosa","Elbrus","Matterhorn"]', 2,
 'El Elbrus (5.642 m) en el Cáucaso ruso es el punto más alto de Europa según muchos geógrafos. El Mont Blanc (4.808 m) es el más alto de los Alpes.',
 'hard'),

-- ══════════════════════════════════════════════════════════════
-- CIENCIA
-- ══════════════════════════════════════════════════════════════

('ciencia', '¿Cuántos elementos tiene la tabla periódica actualmente?',
 '["108","112","118","124"]', 2,
 'La tabla periódica tiene 118 elementos confirmados. El último en añadirse fue el Oganesón (Og, nº 118), en 2016.',
 'medium'),

('ciencia', '¿A qué velocidad viaja la luz en el vacío?',
 '["200.000 km/s","300.000 km/s","400.000 km/s","150.000 km/s"]', 1,
 'La luz viaja a 299.792.458 m/s (~300.000 km/s). Esta constante «c» es el límite de velocidad del universo según la relatividad de Einstein.',
 'medium'),

('ciencia', '¿Quién propuso la evolución por selección natural?',
 '["Gregor Mendel","Charles Darwin","Louis Pasteur","Alfred Wallace"]', 1,
 'Darwin publicó «El origen de las especies» en 1859. Alfred Wallace llegó a conclusiones similares en paralelo.',
 'easy'),

('ciencia', '¿De qué está hecho el diamante?',
 '["Silicio","Carbono","Cuarzo","Cristal de roca"]', 1,
 'El diamante es carbono puro en estructura cúbica formada a alta presión. Es el material natural más duro (10 en la escala de Mohs).',
 'medium'),

('ciencia', '¿Cuántos huesos tiene el cuerpo humano adulto?',
 '["186","206","226","246"]', 1,
 'El adulto tiene 206 huesos. Al nacer tenemos ~300, que se fusionan al crecer. El más pequeño es el estribo y el más largo el fémur.',
 'medium'),

('ciencia', '¿Cuál es el planeta más grande del sistema solar?',
 '["Saturno","Urano","Júpiter","Neptuno"]', 2,
 'Júpiter es el planeta más grande: su masa es 2,5 veces la suma de todos los demás planetas. Tiene al menos 95 lunas conocidas.',
 'easy'),

('ciencia', '¿Qué científico formuló la teoría de la relatividad?',
 '["Isaac Newton","Nikola Tesla","Albert Einstein","Max Planck"]', 2,
 'Einstein formuló la relatividad especial en 1905 y la general en 1915. E=mc² es la ecuación más famosa de la física.',
 'easy'),

('ciencia', '¿Cuál es el símbolo químico del oro?',
 '["Go","Ag","Au","Or"]', 2,
 'El oro se representa como Au, del latín «aurum». Es un metal precioso con número atómico 79, muy usado en joyería y electrónica.',
 'medium'),

('ciencia', '¿Qué planeta es conocido como el «planeta rojo»?',
 '["Venus","Marte","Saturno","Plutón"]', 1,
 'Marte es el planeta rojo por su superficie rica en óxido de hierro. Tiene los volcanes más grandes del sistema solar (Olympus Mons).',
 'easy'),

('ciencia', '¿Cuántas cromosomas tiene una célula humana normal?',
 '["23","44","46","48"]', 2,
 'Las células humanas tienen 46 cromosomas (23 pares). Los gametos (espermatozoides y óvulos) tienen 23. El síndrome de Down implica 47.',
 'medium'),

('ciencia', '¿Quién descubrió la penicilina?',
 '["Marie Curie","Alexander Fleming","Louis Pasteur","Joseph Lister"]', 1,
 'Alexander Fleming descubrió la penicilina en 1928 al observar que un hongo (Penicillium) mataba bacterias en su placa de Petri.',
 'easy'),

('ciencia', '¿Cuál es la fórmula química del agua?',
 '["HO","H2O2","H2O","OH2"]', 2,
 'El agua es H₂O: dos átomos de hidrógeno y uno de oxígeno. Es el único compuesto que existe naturalmente en los tres estados de la materia.',
 'easy'),

('ciencia', '¿Qué es la fotosíntesis?',
 '["La respiración de los animales","El proceso por el que las plantas producen oxígeno y glucosa","La reproducción de las plantas","La digestión de los insectos"]', 1,
 'La fotosíntesis convierte CO₂ y agua en glucosa y oxígeno usando la luz solar. Ocurre en los cloroplastos gracias a la clorofila.',
 'easy'),

('ciencia', '¿Cuántos planetas hay en el sistema solar?',
 '["7","8","9","10"]', 1,
 'Desde 2006, el sistema solar tiene 8 planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Plutón fue reclasificado como planeta enano.',
 'easy'),

('ciencia', '¿Qué es el ADN?',
 '["Una proteína del sistema inmune","La molécula que contiene la información genética","Un tipo de grasa celular","Un virus"]', 1,
 'El ADN (ácido desoxirribonucleico) contiene las instrucciones genéticas de todos los seres vivos. Su estructura de doble hélice fue descubierta en 1953.',
 'easy'),

('ciencia', '¿Cuál es el elemento más abundante en el universo?',
 '["Oxígeno","Carbono","Helio","Hidrógeno"]', 3,
 'El hidrógeno representa el 75% de la materia normal del universo. El helio es el segundo. Ambos se formaron en el Big Bang.',
 'medium'),

('ciencia', '¿A qué temperatura hierve el agua a nivel del mar?',
 '["90°C","95°C","100°C","105°C"]', 2,
 'El agua hierve a 100°C a presión atmosférica estándar (1 atm). A mayor altitud, la presión es menor y hierve a temperatura más baja.',
 'easy'),

('ciencia', '¿Quién fue Marie Curie?',
 '["La primera mujer astronauta","La primera persona en ganar dos premios Nobel","La descubridora del ADN","La inventora del telescopio"]', 1,
 'Marie Curie ganó el Nobel de Física (1903) y Química (1911). Descubrió el polonio y el radio. Fue la primera mujer en ganar el Nobel.',
 'easy'),

('ciencia', '¿Qué estudia la geología?',
 '["Los astros","La Tierra y sus rocas","Los seres vivos","El clima"]', 1,
 'La geología estudia la composición, estructura e historia de la Tierra. Incluye la tectónica de placas, los minerales y los fósiles.',
 'easy'),

('ciencia', '¿Qué es un agujero negro?',
 '["Un planeta muy oscuro","Una estrella fría","Una región del espacio con gravedad tan intensa que nada puede escapar","Un cometa de gran tamaño"]', 2,
 'Un agujero negro es una región donde la gravedad es tan intensa que ni la luz puede escapar. Se forman cuando estrellas masivas colapsan.',
 'medium'),

('ciencia', '¿Cuál es el gas más abundante en la atmósfera terrestre?',
 '["Oxígeno","Dióxido de carbono","Nitrógeno","Argón"]', 2,
 'El nitrógeno (N₂) representa el 78% de la atmósfera. El oxígeno representa el 21%. El resto son gases nobles y CO₂.',
 'medium'),

('ciencia', '¿Cuántos segundos tiene un año?',
 '["~15 millones","~31 millones","~52 millones","~100 millones"]', 1,
 'Un año tiene 365,25 días × 24 h × 3600 s ≈ 31,5 millones de segundos. Por eso cada 4 años hay un año bisiesto.',
 'hard'),

('ciencia', '¿Qué es la gravedad según Newton?',
 '["Una fuerza de repulsión entre masas","Una fuerza de atracción entre masas","Una propiedad de los líquidos","La presión del aire"]', 1,
 'Newton formuló en 1687 que la gravedad es una fuerza de atracción entre masas, proporcional a ellas e inversamente proporcional al cuadrado de la distancia.',
 'medium'),

('ciencia', '¿Qué es la célula madre?',
 '["La neurona más importante","Una célula que puede diferenciarse en distintos tipos celulares","La primera célula que se forma en un embrión","Un tipo de glóbulo rojo"]', 1,
 'Las células madre son células indiferenciadas capaces de renovarse y diferenciarse en células especializadas. Son clave en medicina regenerativa.',
 'medium'),

('ciencia', '¿Qué ley dice «a cada acción corresponde una reacción igual y opuesta»?',
 '["Primera ley de Newton","Segunda ley de Newton","Tercera ley de Newton","Ley de la gravedad"]', 2,
 'La tercera ley de Newton (principio de acción-reacción) explica por qué los cohetes funcionan: empujan gases hacia atrás y avanzan.',
 'medium'),

('ciencia', '¿Cuál es el número de Avogadro aproximado?',
 '["6,02 × 10²³","6,02 × 10¹⁶","3,14 × 10²³","9,81 × 10²³"]', 0,
 'El número de Avogadro (6,022 × 10²³) es la cantidad de átomos, moléculas o partículas en un mol de cualquier sustancia.',
 'hard'),

('ciencia', '¿Qué es la fusión nuclear?',
 '["La división de un núcleo atómico","La unión de dos núcleos para liberar energía","La reacción química del hidrógeno","El proceso de fisión en centrales nucleares"]', 1,
 'La fusión nuclear une núcleos ligeros (hidrógeno) para formar más pesados (helio), liberando enorme energía. Es la fuente de energía del Sol.',
 'hard'),

('ciencia', '¿Qué vitamina produce el cuerpo con la luz solar?',
 '["Vitamina A","Vitamina B12","Vitamina C","Vitamina D"]', 3,
 'La piel sintetiza vitamina D al exponerse a los rayos UVB del sol. Es esencial para absorber calcio y mantener los huesos sanos.',
 'medium'),

('ciencia', '¿Qué es un tsunami?',
 '["Una tormenta tropical","Una ola gigante causada por terremotos submarinos","Un tipo de tornado marino","Una corriente oceánica"]', 1,
 'Un tsunami es una serie de olas oceánicas causadas por terremotos, erupciones volcánicas o deslizamientos submarinos. Pueden viajar a 800 km/h.',
 'easy'),

-- ══════════════════════════════════════════════════════════════
-- ARTE
-- ══════════════════════════════════════════════════════════════

('arte', '¿Quién pintó La Gioconda (Mona Lisa)?',
 '["Miguel Ángel","Rafael","Leonardo da Vinci","Botticelli"]', 2,
 'Leonardo da Vinci pintó La Gioconda entre 1503 y 1519. Es la obra más famosa del mundo, conservada en el Louvre de París.',
 'easy'),

('arte', '¿Quién esculpió «El David»?',
 '["Leonardo da Vinci","Donatello","Miguel Ángel","Rafael"]', 2,
 'Miguel Ángel esculpió El David entre 1501 y 1504. Mide 5,17 m y está tallada en un único bloque de mármol de Carrara.',
 'easy'),

('arte', '¿En qué ciudad está el Museo del Prado?',
 '["Barcelona","Sevilla","Valencia","Madrid"]', 3,
 'El Prado está en Madrid y es uno de los museos más importantes del mundo, con obras de Velázquez, Goya, El Greco y Rubens.',
 'easy'),

('arte', '¿Quién compuso la Quinta Sinfonía?',
 '["Mozart","Bach","Beethoven","Haydn"]', 2,
 'Ludwig van Beethoven compuso su Quinta Sinfonía en Do menor (1808). El famoso motivo inicial (ta-ta-ta-TÁ) es uno de los más reconocibles de la música clásica.',
 'easy'),

('arte', '¿Quién escribió «Don Quijote de la Mancha»?',
 '["Francisco de Quevedo","Lope de Vega","Miguel de Cervantes","Calderón de la Barca"]', 2,
 'Cervantes publicó la primera parte del Quijote en 1605 y la segunda en 1615. Es considerada la primera novela moderna y la más influyente de la literatura española.',
 'easy'),

('arte', '¿Quién pintó «El Guernica»?',
 '["Salvador Dalí","Joan Miró","Pablo Picasso","Francisco Goya"]', 2,
 'Picasso pintó el Guernica en 1937 como protesta por el bombardeo de la ciudad vasca durante la guerra civil española. Está en el Museo Reina Sofía, Madrid.',
 'medium'),

('arte', '¿Qué arquitecto diseñó la Sagrada Familia de Barcelona?',
 '["Le Corbusier","Mies van der Rohe","Antoni Gaudí","Santiago Calatrava"]', 2,
 'Antoni Gaudí diseñó la Sagrada Familia en 1883, un proyecto que aún no está terminado. Es el símbolo arquitectónico más reconocible de Barcelona.',
 'easy'),

('arte', '¿Quién escribió «Hamlet»?',
 '["Charles Dickens","William Shakespeare","John Milton","Geoffrey Chaucer"]', 1,
 'Shakespeare escribió Hamlet hacia 1600-1601. «Ser o no ser» es el monólogo más famoso de la literatura universal.',
 'easy'),

('arte', '¿Quién pintó «Las Meninas»?',
 '["El Greco","Francisco de Goya","Diego Velázquez","Bartolomé Murillo"]', 2,
 'Diego Velázquez pintó Las Meninas en 1656. Representa a la infanta Margarita rodeada de sus damas en el Alcázar de Madrid. Está en el Prado.',
 'medium'),

('arte', '¿Quién compuso «La flauta mágica»?',
 '["Haydn","Mozart","Schubert","Handel"]', 1,
 'Wolfgang Amadeus Mozart compuso La flauta mágica en 1791, el mismo año de su muerte. Es una de las óperas más representadas del mundo.',
 'medium'),

('arte', '¿Qué movimiento artístico lideró Salvador Dalí?',
 '["Cubismo","Impresionismo","Surrealismo","Dadaísmo"]', 2,
 'Dalí fue el máximo representante del Surrealismo. «La persistencia de la memoria» (1931), con sus relojes blandos, es su obra más icónica.',
 'medium'),

('arte', '¿Quién escribió «Cien años de soledad»?',
 '["Pablo Neruda","Mario Vargas Llosa","Gabriel García Márquez","Jorge Luis Borges"]', 2,
 'García Márquez publicó «Cien años de soledad» en 1967. Es la obra cumbre del realismo mágico y le valió el Premio Nobel de Literatura en 1982.',
 'medium'),

('arte', '¿Qué arquitecto diseñó el Guggenheim de Bilbao?',
 '["Zaha Hadid","Norman Foster","Frank Gehry","Renzo Piano"]', 2,
 'Frank Gehry diseñó el Museo Guggenheim de Bilbao (1997), considerado el edificio más importante del siglo XX. Su titanio refleja la luz de forma cambiante.',
 'medium'),

('arte', '¿Quién pintó «La noche estrellada»?',
 '["Paul Gauguin","Claude Monet","Vincent van Gogh","Edvard Munch"]', 2,
 'Van Gogh pintó «La noche estrellada» en 1889 desde el manicomio de Saint-Rémy. Es una de las pinturas más reconocidas del mundo.',
 'easy'),

('arte', '¿Quién esculpió «El Pensador»?',
 '["Constantin Brâncuși","Auguste Rodin","Henry Moore","Alberto Giacometti"]', 1,
 'Auguste Rodin creó «El Pensador» en 1880, originalmente como parte de «Las Puertas del Infierno». Existen múltiples copias en todo el mundo.',
 'medium'),

('arte', '¿Quién compuso las «Cuatro Estaciones»?',
 '["Bach","Handel","Vivaldi","Telemann"]', 2,
 'Antonio Vivaldi compuso «Las Cuatro Estaciones» hacia 1718-1720. Son cuatro conciertos para violín que representan las estaciones del año.',
 'medium'),

('arte', '¿Qué escritor creó el personaje de Sherlock Holmes?',
 '["Agatha Christie","Edgar Allan Poe","Arthur Conan Doyle","G.K. Chesterton"]', 2,
 'Arthur Conan Doyle creó Sherlock Holmes en 1887. El detective vive en el 221B de Baker Street, Londres, con su amigo el Dr. Watson.',
 'easy'),

('arte', '¿Quién pintó «El jardín de las delicias»?',
 '["Jan van Eyck","El Bosco","Pieter Bruegel","Hans Holbein"]', 1,
 'El Bosco pintó este tríptico a finales del siglo XV, representando el Paraíso, el pecado carnal y el Infierno. Está en el Museo del Prado.',
 'hard'),

('arte', '¿Quién escribió «1984»?',
 '["Aldous Huxley","Ray Bradbury","George Orwell","H.G. Wells"]', 2,
 'George Orwell publicó «1984» en 1949. Es una distopía sobre un Estado totalitario con el Gran Hermano que vigila todo. Acuñó términos como «doublethink».',
 'medium'),

('arte', '¿En qué museo está la Venus de Milo?',
 '["British Museum","Uffizi","Museo del Prado","Museo del Louvre"]', 3,
 'La Venus de Milo es una escultura griega del siglo II a.C., encontrada en 1820. Está en el Louvre de París. Su autora es desconocida.',
 'medium'),

('arte', '¿Quién compuso «La Traviata»?',
 '["Rossini","Donizetti","Puccini","Verdi"]', 3,
 'Giuseppe Verdi compuso «La Traviata» en 1853, basada en «La dama de las camelias» de Dumas. Es una de las óperas más representadas del mundo.',
 'medium'),

('arte', '¿Qué escritor creó a Alicia en el País de las Maravillas?',
 '["H.G. Wells","Lewis Carroll","Jules Verne","J.M. Barrie"]', 1,
 'Lewis Carroll (Charles Dodgson) publicó «Alicia en el País de las Maravillas» en 1865. Es uno de los libros más traducidos de la historia.',
 'easy'),

('arte', '¿Quién dirigió «El padrino»?',
 '["Martin Scorsese","Steven Spielberg","Francis Ford Coppola","Stanley Kubrick"]', 2,
 'Francis Ford Coppola dirigió «El padrino» en 1972, con Marlon Brando y Al Pacino. Ganó el Oscar a mejor película y es considerada una de las mejores de la historia.',
 'medium'),

('arte', '¿Quién pintó «El nacimiento de Venus»?',
 '["Leonardo da Vinci","Miguel Ángel","Sandro Botticelli","Rafael"]', 2,
 'Botticelli pintó «El nacimiento de Venus» hacia 1485. Está en la Galería Uffizi de Florencia. Representa a la diosa Venus emergiendo del mar.',
 'medium'),

-- ══════════════════════════════════════════════════════════════
-- FILOSOFÍA
-- ══════════════════════════════════════════════════════════════

('filosofia', '¿Quién dijo «Solo sé que no sé nada»?',
 '["Platón","Aristóteles","Sócrates","Epicuro"]', 2,
 'Sócrates (469-399 a.C.) es famoso por esta afirmación de humildad intelectual. Lo conocemos a través de los escritos de su discípulo Platón.',
 'easy'),

('filosofia', '¿Qué corriente propuso «el mayor bien para el mayor número»?',
 '["Kantianismo","Utilitarismo","Estoicismo","Existencialismo"]', 1,
 'El Utilitarismo, fundado por Jeremy Bentham y desarrollado por J.S. Mill, maximiza la felicidad total. Es muy influyente en política y economía.',
 'medium'),

('filosofia', '¿Quién escribió «Así habló Zaratustra»?',
 '["Schopenhauer","Marx","Heidegger","Nietzsche"]', 3,
 'Nietzsche publicó «Así habló Zaratustra» (1883-1885), donde introduce el «superhombre» (Übermensch) y la «voluntad de poder».',
 'medium'),

('filosofia', '¿Qué filósofo escribió «La República»?',
 '["Aristóteles","Platón","Sócrates","Epicuro"]', 1,
 'Platón escribió «La República» (~380 a.C.), donde expone su teoría del Estado ideal y la famosa alegoría de la caverna.',
 'medium'),

('filosofia', '¿Quién escribió «El Capital»?',
 '["Friedrich Engels","Vladimir Lenin","Karl Marx","Mao Tse-Tung"]', 2,
 'Karl Marx publicó el primer volumen de «El Capital» en 1867. Junto con «El Manifiesto Comunista» (1848), fundó el marxismo.',
 'medium'),

('filosofia', '¿Qué significa «cogito ergo sum»?',
 '["Vivo luego existo","Pienso luego existo","Siento luego existo","Dudo luego pienso"]', 1,
 '«Pienso, luego existo» es la frase de Descartes (1637). Al dudar de todo, lo único indudable es que hay un «yo» que piensa y duda.',
 'medium'),

('filosofia', '¿Quién fue Aristóteles?',
 '["Discípulo de Platón y maestro de Alejandro Magno","Maestro de Sócrates","Un filósofo romano","Un sofista ateniense"]', 0,
 'Aristóteles (384-322 a.C.) fue discípulo de Platón y tutor de Alejandro Magno. Fundó el Liceo y sentó bases de la lógica, biología y ética.',
 'medium'),

('filosofia', '¿Qué es la «navaja de Occam»?',
 '["Un argumento para la existencia de Dios","El principio de parsimonia: la explicación más simple suele ser la correcta","Una crítica al escepticismo","Un método de meditación budista"]', 1,
 'La navaja de Occam (William de Ockham, s. XIV) dice que no se deben multiplicar entidades sin necesidad. En ciencia: la hipótesis más simple es preferible.',
 'hard'),

('filosofia', '¿Quién formuló el «imperativo categórico»?',
 '["Hegel","Kant","Fichte","Schelling"]', 1,
 'Immanuel Kant formuló el imperativo categórico: «Actúa solo según la máxima que puedas querer que sea ley universal». Es la base de su ética deontológica.',
 'hard'),

('filosofia', '¿Qué es el existencialismo?',
 '["La creencia en la predeterminación","La corriente que pone la existencia individual antes que la esencia","La filosofía del lenguaje","El estudio del ser en abstracto"]', 1,
 'El existencialismo (Sartre, Camus, Kierkegaard) sostiene que «la existencia precede a la esencia»: somos lo que decidimos ser, con libertad y responsabilidad totales.',
 'medium'),

('filosofia', '¿Quién escribió «El ser y la nada»?',
 '["Albert Camus","Simone de Beauvoir","Jean-Paul Sartre","Maurice Merleau-Ponty"]', 2,
 'Jean-Paul Sartre publicó «El ser y la nada» en 1943, obra fundacional del existencialismo ateo. «El infierno son los otros» es otra de sus frases célebres.',
 'hard'),

('filosofia', '¿Qué filósofo dijo «Dios ha muerto»?',
 '["Schopenhauer","Feuerbach","Marx","Nietzsche"]', 3,
 'Nietzsche proclamó «Dios ha muerto» en «La gaya ciencia» (1882) para señalar que los valores tradicionales ya no tienen fundamento en la cultura moderna.',
 'medium'),

('filosofia', '¿Qué es el estoicismo?',
 '["La búsqueda del placer como bien supremo","La filosofía que busca la virtud y la indiferencia ante el sufrimiento","El relativismo moral","La negación de la realidad"]', 1,
 'El estoicismo (Zenón de Citio, Epicteto, Marco Aurelio) busca la virtud y la tranquilidad aceptando lo que no controlamos y controlando nuestras reacciones.',
 'medium'),

('filosofia', '¿Qué es el empirismo?',
 '["La filosofía basada en la razón pura","La corriente que sostiene que el conocimiento viene de la experiencia sensorial","El estudio de los valores morales","La lógica formal"]', 1,
 'El empirismo (Locke, Hume, Berkeley) sostiene que todo conocimiento proviene de la experiencia. Se opone al racionalismo de Descartes y Leibniz.',
 'medium'),

('filosofia', '¿Quién escribió «Meditaciones» (el libro estoico)?',
 '["Epicteto","Séneca","Marco Aurelio","Cicerón"]', 2,
 'Marco Aurelio, emperador romano (161-180 d.C.), escribió sus «Meditaciones» como diario personal de reflexiones estoicas. Nunca fue escrito para publicarse.',
 'medium'),

('filosofia', '¿Qué es el nihilismo?',
 '["La creencia en el libre albedrío","La negación de todo significado, valor o verdad objetiva","El optimismo filosófico","La búsqueda de la felicidad"]', 1,
 'El nihilismo sostiene que la vida carece de sentido o valores objetivos. Nietzsche lo describió como consecuencia de la «muerte de Dios».',
 'hard'),

('filosofia', '¿Quién escribió «El contrato social»?',
 '["Montesquieu","Voltaire","Locke","Rousseau"]', 3,
 'Jean-Jacques Rousseau publicó «El contrato social» en 1762. Influyó en la Revolución Francesa con ideas sobre soberanía popular y voluntad general.',
 'medium'),

('filosofia', '¿Qué sostenía Platón sobre la realidad?',
 '["Que solo existe lo material","Que existen Ideas perfectas de las que el mundo es una copia imperfecta","Que la realidad es ilusoria","Que solo existe lo que podemos tocar"]', 1,
 'La teoría de las Ideas (o Formas) de Platón sostiene que el mundo sensible es una sombra imperfecta de un mundo superior de Ideas eternas y perfectas.',
 'medium'),

('filosofia', '¿Quién fue Epicuro?',
 '["Un filósofo estoico romano","Un filósofo griego que buscaba la felicidad en el placer moderado","Un sofista ateniense","Un discípulo de Sócrates"]', 1,
 'Epicuro (341-270 a.C.) fundó el epicureísmo: la búsqueda del placer (hedoné) entendido como ausencia de dolor y perturbación (ataraxia), no como exceso.',
 'medium'),

('filosofia', '¿Qué es la dialéctica hegeliana?',
 '["Un método retórico griego","El proceso tesis-antítesis-síntesis por el que avanza la historia","Una forma de lógica matemática","El estudio del lenguaje"]', 1,
 'Hegel propuso que la historia avanza mediante conflictos (tesis vs. antítesis) que se resuelven en síntesis superadoras. Marx adaptó esto al materialismo histórico.',
 'hard'),

('filosofia', '¿Qué filósofo escribió el «Tractatus Logico-Philosophicus»?',
 '["Bertrand Russell","G.E. Moore","Ludwig Wittgenstein","Karl Popper"]', 2,
 'Wittgenstein publicó el Tractatus en 1921, sosteniendo que los límites del lenguaje son los límites del mundo. Luego revisó su pensamiento en las «Investigaciones filosóficas».',
 'hard'),

('filosofia', '¿Qué es la fenomenología?',
 '["El estudio de los fenómenos meteorológicos","La filosofía que estudia la experiencia consciente tal como se manifiesta","El análisis del lenguaje","Una teoría política"]', 1,
 'La fenomenología (Husserl, Heidegger, Merleau-Ponty) estudia la estructura de la experiencia consciente «tal como se nos da», sin presupuestos metafísicos.',
 'hard'),

('filosofia', '¿Quién escribió «El príncipe»?',
 '["Thomas Moro","Erasmo de Rotterdam","Nicolás Maquiavelo","Tomás de Aquino"]', 2,
 'Maquiavelo publicó «El príncipe» en 1513, obra de filosofía política donde separa la moral de la política. «El fin justifica los medios» se asocia a su pensamiento.',
 'medium'),

('filosofia', '¿Qué es el pragmatismo?',
 '["La búsqueda de la verdad absoluta","La filosofía que valora las ideas por sus consecuencias prácticas","La defensa del libre mercado","El estudio de la ética aplicada"]', 1,
 'El pragmatismo (Peirce, James, Dewey) evalúa las ideas por su utilidad y consecuencias prácticas. Surgió en EE.UU. a finales del siglo XIX.',
 'medium'),

('filosofia', '¿Qué filósofo escribió «Summa Teológica»?',
 '["San Agustín","San Anselmo","Alberto Magno","Tomás de Aquino"]', 3,
 'Tomás de Aquino (1225-1274) escribió la Summa Theológica, intentando conciliar la fe cristiana con la filosofía de Aristóteles.',
 'hard'),

('filosofia', '¿Quién dijo «El hombre es la medida de todas las cosas»?',
 '["Sócrates","Platón","Protágoras","Aristóteles"]', 2,
 'Protágoras (~490-420 a.C.), sofista griego, sostuvo este relativismo: la verdad depende del punto de vista de cada persona. Sócrates se opuso a esta idea.',
 'hard');

-- ─── Asignar pregunta del día para hoy si no existe ───────────
insert into public.daily_questions (question_id, date)
select id, current_date
from public.questions
where active = true
order by random()
limit 1
on conflict (date) do nothing;
