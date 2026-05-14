-- ─────────────────────────────────────────────────────────────
-- Cultura General — Lote 1 de nuevas categorías (~400 preguntas)
-- Categorías nuevas: deportes, biologia, cine, musica, literatura,
--                    tecnologia, mitologia, astronomia.
-- Requiere haber ejecutado antes `migration_categories.sql`.
-- ─────────────────────────────────────────────────────────────

insert into public.questions (category, question, options, answer_index, context, difficulty) values

-- ══════════════════════════════════════════════════════════════
-- DEPORTES (50)
-- ══════════════════════════════════════════════════════════════

('deportes', '¿Cada cuántos años se celebran los Juegos Olímpicos de verano?',
 '["Cada 2","Cada 3","Cada 4","Cada 5"]', 2,
 'Los JJ.OO. de verano se celebran cada 4 años desde 1896. Los de invierno también, alternándose cada 2 años con los de verano desde 1994.',
 'easy'),

('deportes', '¿Qué selección ha ganado más Mundiales de fútbol masculino?',
 '["Alemania","Italia","Argentina","Brasil"]', 3,
 'Brasil ha ganado 5 Copas del Mundo (1958, 1962, 1970, 1994, 2002). Es el único país que ha participado en todas las ediciones.',
 'easy'),

('deportes', '¿Cuántos jugadores tiene un equipo de baloncesto en cancha?',
 '["4","5","6","7"]', 1,
 'Cada equipo juega con 5 jugadores. El baloncesto lo inventó James Naismith en 1891 en Springfield, Massachusetts.',
 'easy'),

('deportes', '¿En qué deporte se utiliza un "birdie"?',
 '["Tenis","Bádminton","Golf","Cricket"]', 2,
 'En golf, "birdie" significa un golpe bajo el par del hoyo. "Bogey" es uno por encima del par y "eagle" dos por debajo.',
 'medium'),

('deportes', '¿Cuántos jugadores forman un equipo de fútbol en cancha?',
 '["10","11","12","9"]', 1,
 'Cada equipo de fútbol tiene 11 jugadores, incluyendo al portero. Las reglas modernas se codificaron en Inglaterra en 1863.',
 'easy'),

('deportes', '¿En qué país se inventó el tenis moderno?',
 '["Francia","Estados Unidos","Reino Unido","Australia"]', 2,
 'El tenis moderno (lawn tennis) lo inventó Walter Clopton Wingfield en Inglaterra en 1873. Wimbledon, fundado en 1877, es el torneo más antiguo.',
 'medium'),

('deportes', '¿Cuál es la distancia exacta de una maratón?',
 '["40 km","42,195 km","45 km","50 km"]', 1,
 'Una maratón mide 42,195 km. La distancia se fijó en los JJ.OO. de Londres 1908 por el recorrido entre el castillo de Windsor y el estadio.',
 'medium'),

('deportes', '¿Quién es el máximo ganador de Grand Slams en tenis masculino?',
 '["Roger Federer","Rafael Nadal","Novak Djokovic","Pete Sampras"]', 2,
 'Novak Djokovic lidera con 24 Grand Slams (a 2024). Nadal tiene 22 y Federer 20. Sampras se quedó en 14.',
 'medium'),

('deportes', '¿De qué nacionalidad fue el ciclista Eddy Merckx?',
 '["Holandés","Belga","Francés","Italiano"]', 1,
 'Eddy Merckx es belga, ganador de 5 Tours de Francia, 5 Giros y 1 Vuelta. Es considerado el mejor ciclista de la historia.',
 'hard'),

('deportes', '¿En qué deporte se disputa la Copa Stanley?',
 '["Baloncesto","Hockey hielo","Béisbol","Fútbol americano"]', 1,
 'La Stanley Cup es el trofeo de la NHL (hockey sobre hielo). Se entrega desde 1893; Montreal Canadiens es el equipo con más victorias (24).',
 'medium'),

('deportes', '¿Cuántos sets debe ganar un tenista para ganar un partido a 5 sets?',
 '["2","3","4","5"]', 1,
 'En Grand Slams masculinos se juega al mejor de 5 sets: hay que ganar 3. En femenino y la mayoría de torneos se juega al mejor de 3.',
 'easy'),

('deportes', '¿En qué ciudad se celebraron los primeros JJ.OO. modernos en 1896?',
 '["París","Atenas","Roma","Berlín"]', 1,
 'Los primeros JJ.OO. modernos fueron en Atenas 1896, organizados por Pierre de Coubertin. Participaron 241 atletas de 14 países.',
 'medium'),

('deportes', '¿Cuántos puntos vale un "try" en rugby union?',
 '["3","4","5","7"]', 2,
 'Un try vale 5 puntos en rugby union. La transformación posterior añade 2 puntos más. Un drop goal o penal valen 3.',
 'hard'),

('deportes', '¿En qué año se celebró el primer Mundial de fútbol?',
 '["1928","1930","1934","1938"]', 1,
 'El primer Mundial fue Uruguay 1930. Lo ganó la selección anfitriona, Uruguay, venciendo a Argentina 4-2 en la final.',
 'medium'),

('deportes', '¿Cuál es el récord mundial masculino de los 100 metros lisos?',
 '["9,58 s","9,69 s","9,77 s","9,85 s"]', 0,
 'Usain Bolt corrió los 100 m en 9,58 s en Berlín 2009. Es el récord mundial vigente desde entonces.',
 'medium'),

('deportes', '¿Qué deporte practicaba Michael Phelps?',
 '["Atletismo","Natación","Ciclismo","Gimnasia"]', 1,
 'Michael Phelps es el atleta olímpico con más medallas de la historia: 28 (23 de oro) en natación, entre 2004 y 2016.',
 'easy'),

('deportes', '¿Cuántos hoyos tiene un campo de golf estándar?',
 '["9","12","18","20"]', 2,
 'Un campo de golf estándar tiene 18 hoyos. Hay también campos de 9 que se juegan dos veces para completar una vuelta.',
 'easy'),

('deportes', '¿Qué club de fútbol ha ganado más Champions League?',
 '["FC Barcelona","Bayern Múnich","Real Madrid","Milan"]', 2,
 'El Real Madrid lidera con 15 Champions League (a 2024). Le siguen Milan (7) y Bayern y Liverpool (6).',
 'easy'),

('deportes', '¿En qué deporte destacó Diego Maradona?',
 '["Boxeo","Fútbol","Tenis","Baloncesto"]', 1,
 'Diego Armando Maradona (1960-2020) fue un futbolista argentino, considerado uno de los mejores de la historia. Campeón del Mundo en 1986.',
 'easy'),

('deportes', '¿Cuántos miembros tiene un equipo de voleibol en cancha?',
 '["5","6","7","8"]', 1,
 'En voleibol juegan 6 por equipo en cancha. El deporte fue inventado por William G. Morgan en 1895 en Massachusetts.',
 'easy'),

('deportes', '¿Quién ganó el Tour de Francia 7 veces seguidas (luego anulados)?',
 '["Miguel Indurain","Lance Armstrong","Chris Froome","Bernard Hinault"]', 1,
 'Lance Armstrong ganó 7 Tours consecutivos (1999-2005), pero fueron desposeídos en 2012 por dopaje sistemático con EPO.',
 'medium'),

('deportes', '¿Qué selección ganó el Mundial de fútbol 2022 en Qatar?',
 '["Francia","Argentina","Brasil","Croacia"]', 1,
 'Argentina ganó el Mundial 2022 venciendo a Francia en penaltis tras un 3-3. Fue el tercer título mundial de la albiceleste.',
 'easy'),

('deportes', '¿Cuál es el récord de goles en una Eurocopa?',
 '["7","9","11","14"]', 1,
 'Michel Platini (Francia) marcó 9 goles en la Eurocopa 1984, récord absoluto. Cristiano Ronaldo es el máximo goleador histórico con 14.',
 'hard'),

('deportes', '¿Cuántos puntos vale una canasta de tres en baloncesto?',
 '["2","3","4","5"]', 1,
 'Un tiro desde más allá de la línea de tres puntos vale 3. Dentro vale 2 y un tiro libre vale 1.',
 'easy'),

('deportes', '¿En qué año debutaron los JJ.OO. de Invierno?',
 '["1908","1916","1924","1936"]', 2,
 'Los primeros JJ.OO. de Invierno fueron en Chamonix (Francia) en 1924. Se celebraban el mismo año que los de verano hasta 1992.',
 'hard'),

('deportes', '¿Qué país inventó el judo?',
 '["China","Corea","Japón","Tailandia"]', 2,
 'El judo lo creó Jigoro Kano en Japón en 1882, basándose en el jiu-jitsu tradicional. Fue olímpico por primera vez en Tokio 1964.',
 'medium'),

('deportes', '¿Cuántos km recorren los corredores de Fórmula 1 en una carrera estándar?',
 '["200 km","305 km","450 km","500 km"]', 1,
 'Una carrera de F1 dura ~305 km (Mónaco es la excepción con 260). El límite máximo son 2 horas de competición.',
 'medium'),

('deportes', '¿De qué color es la camiseta del líder de la Vuelta a España?',
 '["Amarilla","Rosa","Roja","Azul"]', 2,
 'El líder de la Vuelta lleva el maillot rojo desde 2010. Antes era amarillo, oro u otros colores. En el Tour es amarillo y en el Giro rosa.',
 'medium'),

('deportes', '¿En qué deporte es legendario Pelé?',
 '["Baloncesto","Fútbol","Béisbol","Voleibol"]', 1,
 'Edson Arantes do Nascimento "Pelé" (1940-2022) fue un futbolista brasileño, único en ganar 3 Mundiales (1958, 1962, 1970).',
 'easy'),

('deportes', '¿En qué año debutó el fútbol femenino en los JJ.OO.?',
 '["1992","1996","2000","2004"]', 1,
 'El fútbol femenino debutó en Atlanta 1996, donde Estados Unidos ganó el oro. El masculino debutó en París 1900.',
 'hard'),

('deportes', '¿Cuántos minutos dura un partido de fútbol reglamentario?',
 '["80","90","100","120"]', 1,
 'Un partido dura 90 minutos (2 tiempos de 45), con un descanso de 15 minutos. El árbitro añade tiempo por interrupciones.',
 'easy'),

('deportes', '¿En qué país se inventó el bádminton?',
 '["China","India","Reino Unido","Indonesia"]', 2,
 'El bádminton moderno se desarrolló en la finca Badminton House (Inglaterra) en 1873, aunque deriva de juegos antiguos de raqueta.',
 'hard'),

('deportes', '¿Cuántos puntos suma un home run en béisbol?',
 '["1","2","3","Depende"]', 3,
 'Un home run vale los puntos correspondientes a los corredores que lleguen al home. Con bases llenas, son 4 puntos (grand slam).',
 'medium'),

('deportes', '¿Qué selección ganó la Eurocopa 2020 (celebrada en 2021)?',
 '["Inglaterra","Italia","Francia","España"]', 1,
 'Italia ganó la Eurocopa 2020 venciendo a Inglaterra en penaltis en Wembley. Roberto Mancini fue el seleccionador.',
 'medium'),

('deportes', '¿Cuánto pesa un balón oficial de fútbol?',
 '["350-380 g","410-450 g","500-550 g","600 g"]', 1,
 'Un balón oficial pesa entre 410 y 450 gramos al inicio del partido, según las reglas de la FIFA.',
 'hard'),

('deportes', '¿En qué deporte se gana al lograr "checkmate"?',
 '["Damas","Ajedrez","Backgammon","Go"]', 1,
 'En ajedrez se gana al dar jaque mate ("checkmate"), atacando al rey enemigo sin que pueda escapar.',
 'easy'),

('deportes', '¿Qué nadadora ha ganado más medallas olímpicas?',
 '["Katie Ledecky","Jenny Thompson","Missy Franklin","Dara Torres"]', 1,
 'Jenny Thompson (USA) ganó 12 medallas olímpicas en natación entre 1992 y 2004. Katie Ledecky lleva 10 a 2024.',
 'hard'),

('deportes', '¿Cuántos sets debe ganar un equipo de voleibol para llevarse el partido?',
 '["2","3","4","5"]', 1,
 'En voleibol se juega al mejor de 5 sets (a 25 puntos, el quinto a 15). Hay que ganar 3 sets.',
 'medium'),

('deportes', '¿En qué año se celebró el primer Súper Bowl?',
 '["1960","1967","1970","1975"]', 1,
 'El primer Súper Bowl fue en enero de 1967. Los Green Bay Packers vencieron a los Kansas City Chiefs 35-10.',
 'hard'),

('deportes', '¿Cuál es el deporte nacional de Canadá según ley?',
 '["Hockey hielo","Lacrosse","Béisbol","Curling"]', 1,
 'Canadá declaró por ley en 1994 al lacrosse como deporte nacional de verano y al hockey sobre hielo como nacional de invierno.',
 'hard'),

('deportes', '¿Cuántos km tiene la pista olímpica de atletismo?',
 '["350 m","400 m","440 m","500 m"]', 1,
 'Una pista olímpica estándar mide 400 m por la calle 1. Las calles exteriores son progresivamente más largas.',
 'easy'),

('deportes', '¿En qué año Roger Bannister bajó por primera vez de 4 minutos en la milla?',
 '["1948","1952","1954","1960"]', 2,
 'Roger Bannister fue el primero en correr la milla bajo 4 minutos (3:59,4) el 6 de mayo de 1954 en Oxford.',
 'hard'),

('deportes', '¿Cuántas medallas de oro ganó Mark Spitz en Múnich 1972?',
 '["5","6","7","8"]', 2,
 'Mark Spitz ganó 7 oros en natación en Múnich 1972, récord que solo superó Michael Phelps con 8 en Pekín 2008.',
 'hard'),

('deportes', '¿Qué jugador de la NBA tiene más anillos?',
 '["Michael Jordan","Bill Russell","LeBron James","Kareem Abdul-Jabbar"]', 1,
 'Bill Russell ganó 11 anillos con los Boston Celtics entre 1957 y 1969. Michael Jordan ganó 6 con los Chicago Bulls.',
 'hard'),

('deportes', '¿Qué deporte se practica en Wimbledon?',
 '["Golf","Cricket","Tenis","Rugby"]', 2,
 'Wimbledon es el torneo de tenis más prestigioso, fundado en 1877. Se juega sobre hierba y los jugadores visten obligatoriamente de blanco.',
 'easy'),

('deportes', '¿Cuántos puntos suma un touchdown en fútbol americano?',
 '["3","6","7","9"]', 1,
 'Un touchdown vale 6 puntos. Después se puede convertir 1 punto extra (patada) o 2 (jugada desde la yarda 2).',
 'medium'),

('deportes', '¿Quién es el máximo goleador histórico del Mundial?',
 '["Pelé","Ronaldo","Klose","Müller"]', 2,
 'El alemán Miroslav Klose lidera con 16 goles en Mundiales (2002-2014). Ronaldo Nazário marcó 15 y Müller 14.',
 'hard'),

('deportes', '¿Qué jugador es apodado "La Pulga"?',
 '["Cristiano Ronaldo","Neymar","Lionel Messi","Mbappé"]', 2,
 'Lionel Messi recibe ese apodo por su baja estatura y agilidad. Ha ganado 8 Balones de Oro, récord absoluto.',
 'easy'),

('deportes', '¿En qué deporte se compite por el Trofeo Webb Ellis?',
 '["Cricket","Rugby union","Fútbol","Fútbol americano"]', 1,
 'La Copa Webb Ellis es el trofeo del Mundial de Rugby Union, llamada así por William Webb Ellis, supuesto inventor del deporte.',
 'hard'),

('deportes', '¿Cuántos jugadores tiene un equipo de waterpolo en cancha?',
 '["5","6","7","8"]', 2,
 'En waterpolo juegan 7 por equipo (6 más portero). Los partidos se dividen en 4 cuartos de 8 minutos.',
 'hard'),

-- ══════════════════════════════════════════════════════════════
-- BIOLOGÍA (50)
-- ══════════════════════════════════════════════════════════════

('biologia', '¿Cuál es el órgano más grande del cuerpo humano?',
 '["Hígado","Pulmón","Piel","Intestino"]', 2,
 'La piel es el órgano más extenso, con unos 2 m² y hasta 5 kg. Es la primera barrera de defensa frente al exterior.',
 'easy'),

('biologia', '¿Cuántos cromosomas tiene una célula humana somática?',
 '["23","44","46","48"]', 2,
 'Las células somáticas humanas tienen 46 cromosomas (23 pares). Los gametos tienen 23 sin par (haploides).',
 'medium'),

('biologia', '¿Qué orgánulo se conoce como la "central energética" de la célula?',
 '["Núcleo","Mitocondria","Ribosoma","Lisosoma"]', 1,
 'Las mitocondrias generan ATP mediante respiración celular. Tienen su propio ADN, herencia evolutiva de una bacteria simbiótica.',
 'easy'),

('biologia', '¿Quién formuló las leyes de la herencia genética?',
 '["Darwin","Mendel","Watson","Crick"]', 1,
 'Gregor Mendel publicó sus leyes en 1866 estudiando guisantes. Su trabajo fue ignorado hasta principios del siglo XX.',
 'easy'),

('biologia', '¿Qué bases nitrogenadas forman el ADN?',
 '["A,T,C,G","A,U,C,G","A,T,C,U","A,U,T,G"]', 0,
 'El ADN contiene adenina (A), timina (T), citosina (C) y guanina (G). En el ARN la timina se sustituye por uracilo (U).',
 'medium'),

('biologia', '¿Cuál es la unidad básica de la vida?',
 '["Átomo","Molécula","Célula","Tejido"]', 2,
 'La célula es la unidad estructural y funcional básica de los seres vivos, formulado por la teoría celular en 1839.',
 'easy'),

('biologia', '¿Qué tipo de células no tienen núcleo definido?',
 '["Eucariotas","Procariotas","Animales","Vegetales"]', 1,
 'Las procariotas (bacterias y arqueas) no tienen núcleo: su ADN flota libre en el citoplasma. Aparecieron hace ~3.500 M de años.',
 'medium'),

('biologia', '¿Cuántos huesos tiene el cuerpo humano adulto?',
 '["186","206","226","246"]', 1,
 'Un adulto tiene 206 huesos. Al nacer son ~270 que se van fusionando. El más pequeño es el estribo del oído.',
 'easy'),

('biologia', '¿Cuál es el sistema responsable de defender al cuerpo de infecciones?',
 '["Endocrino","Inmunitario","Nervioso","Digestivo"]', 1,
 'El sistema inmunitario incluye linfocitos, anticuerpos y otros componentes que identifican y eliminan patógenos.',
 'easy'),

('biologia', '¿Qué proceso permite a las plantas convertir luz en energía?',
 '["Respiración","Fotosíntesis","Fermentación","Transpiración"]', 1,
 'La fotosíntesis convierte CO₂ y agua en glucosa y O₂ usando la energía solar. Ocurre principalmente en los cloroplastos.',
 'easy'),

('biologia', '¿Qué animal tiene el corazón más grande del planeta?',
 '["Elefante africano","Jirafa","Ballena azul","Tiburón ballena"]', 2,
 'El corazón de la ballena azul puede pesar más de 180 kg y bombea 220 litros de sangre por latido. Es el animal más grande conocido.',
 'medium'),

('biologia', '¿Quién propuso la teoría de la evolución por selección natural?',
 '["Lamarck","Wallace","Darwin","Mendel"]', 2,
 'Darwin publicó "El origen de las especies" en 1859. Alfred Wallace llegó a conclusiones similares de forma independiente.',
 'easy'),

('biologia', '¿Cuál es el músculo más fuerte del cuerpo humano (por proporción)?',
 '["Bíceps","Cuádriceps","Masetero","Glúteo mayor"]', 2,
 'El masetero (de la mandíbula) ejerce la mayor fuerza por proporción de su tamaño: ~90 kg al cerrar los molares.',
 'hard'),

('biologia', '¿Qué tipo de sangre se considera donante universal?',
 '["A+","O-","AB+","B+"]', 1,
 'O negativo no tiene antígenos A, B ni Rh, así que puede transfundirse a cualquier persona en emergencias. AB+ es el receptor universal.',
 'medium'),

('biologia', '¿Cuántas cámaras tiene el corazón humano?',
 '["2","3","4","5"]', 2,
 'El corazón tiene 4 cámaras: 2 aurículas (arriba) y 2 ventrículos (abajo). La sangre fluye en circuitos pulmonar y sistémico.',
 'easy'),

('biologia', '¿En qué orgánulo se sintetizan las proteínas?',
 '["Núcleo","Mitocondria","Ribosoma","Cloroplasto"]', 2,
 'Los ribosomas sintetizan proteínas leyendo el ARN mensajero (traducción). Pueden estar libres o adheridos al retículo endoplasmático.',
 'medium'),

('biologia', '¿Cuál es el grupo sanguíneo receptor universal?',
 '["O-","O+","AB+","A+"]', 2,
 'AB+ puede recibir sangre de cualquier grupo, porque tiene antígenos A, B y Rh y no produce anticuerpos contra ellos.',
 'medium'),

('biologia', '¿Qué neurotransmisor está relacionado con el placer y la recompensa?',
 '["Serotonina","Dopamina","GABA","Glutamato"]', 1,
 'La dopamina regula motivación, recompensa y placer. Su déficit se asocia al Parkinson y su exceso a esquizofrenia.',
 'medium'),

('biologia', '¿Cuál es el animal terrestre más rápido?',
 '["León","Guepardo","Antílope","Caballo"]', 1,
 'El guepardo alcanza 110 km/h en aceleraciones cortas. Su largo cuerpo y garras semi-retráctiles son adaptaciones a la velocidad.',
 'easy'),

('biologia', '¿Qué ácido predomina en el jugo gástrico?',
 '["Sulfúrico","Clorhídrico","Nítrico","Cítrico"]', 1,
 'El ácido clorhídrico (HCl) en el estómago tiene pH 1-2 y activa la pepsina para digerir proteínas.',
 'medium'),

('biologia', '¿Cuántas patas tiene un insecto?',
 '["4","6","8","10"]', 1,
 'Los insectos tienen 6 patas (3 pares), divididas en 3 segmentos corporales: cabeza, tórax y abdomen. Los arácnidos tienen 8.',
 'easy'),

('biologia', '¿En qué parte del cerebro se controla el equilibrio?',
 '["Cerebro","Cerebelo","Bulbo raquídeo","Hipotálamo"]', 1,
 'El cerebelo coordina el movimiento, equilibrio y postura. Está en la parte posterior del encéfalo.',
 'medium'),

('biologia', '¿Cuál es el hueso más largo del cuerpo humano?',
 '["Tibia","Fémur","Húmero","Cúbito"]', 1,
 'El fémur (muslo) mide ~46 cm en un adulto medio. Es también el hueso más fuerte: soporta cargas de hasta 1.500 kg.',
 'easy'),

('biologia', '¿Cuántas patas tienen las arañas?',
 '["6","8","10","12"]', 1,
 'Las arañas tienen 8 patas, característica de los arácnidos. Tienen el cuerpo dividido en cefalotórax y abdomen.',
 'easy'),

('biologia', '¿Qué órgano filtra la sangre y produce orina?',
 '["Hígado","Vejiga","Riñón","Páncreas"]', 2,
 'Los riñones filtran ~180 litros de sangre al día, eliminando residuos y regulando agua y electrolitos.',
 'easy'),

('biologia', '¿Cómo se llama el proceso de división celular que produce gametos?',
 '["Mitosis","Meiosis","Apoptosis","Citocinesis"]', 1,
 'La meiosis produce 4 células haploides a partir de una diploide, con recombinación genética. Es la base de la reproducción sexual.',
 'medium'),

('biologia', '¿Cuál es el animal con el mayor genoma conocido?',
 '["Humano","Pez pulmonado","Salamandra","Ballena"]', 2,
 'Algunas salamandras (como Necturus) tienen genomas de hasta 120.000 Mb, frente a los 3.000 del humano.',
 'hard'),

('biologia', '¿Cuántos litros de sangre tiene un adulto medio?',
 '["3","5","7","10"]', 1,
 'Un adulto tiene unos 5 litros de sangre (7-8% del peso corporal). Una pérdida superior al 20% puede ser mortal.',
 'medium'),

('biologia', '¿Qué tipo de animal es el delfín?',
 '["Pez","Reptil","Mamífero","Anfibio"]', 2,
 'Los delfines son mamíferos cetáceos: respiran aire, paren crías vivas y las amamantan. Evolucionaron a partir de ancestros terrestres.',
 'easy'),

('biologia', '¿Qué pigmento da el color verde a las plantas?',
 '["Caroteno","Clorofila","Antocianina","Melanina"]', 1,
 'La clorofila absorbe luz roja y azul y refleja la verde. Es esencial para la fotosíntesis y reside en los cloroplastos.',
 'easy'),

('biologia', '¿Qué glándula regula el metabolismo mediante hormonas tiroideas?',
 '["Hipófisis","Tiroides","Suprarrenal","Páncreas"]', 1,
 'La tiroides secreta T3 y T4 que regulan el metabolismo basal. Su mal funcionamiento causa hipo- o hipertiroidismo.',
 'medium'),

('biologia', '¿Quiénes descubrieron la estructura del ADN en 1953?',
 '["Mendel y Morgan","Watson y Crick","Pasteur y Koch","Darwin y Wallace"]', 1,
 'Watson y Crick propusieron la doble hélice en 1953, basándose en los datos de difracción de Rosalind Franklin. Premio Nobel 1962.',
 'medium'),

('biologia', '¿Cuántos litros de aire respira un humano al día (media)?',
 '["1.000","5.000","11.000","30.000"]', 2,
 'Un adulto respira ~11.000 litros de aire al día (12-16 respiraciones por minuto, 500 ml cada una).',
 'hard'),

('biologia', '¿Qué órgano produce la insulina?',
 '["Hígado","Riñón","Páncreas","Tiroides"]', 2,
 'El páncreas, a través de los islotes de Langerhans, produce insulina (regula glucosa) y glucagón. Su disfunción causa diabetes.',
 'medium'),

('biologia', '¿Cuál es la unidad básica del sistema nervioso?',
 '["Neurona","Sinapsis","Axón","Mielina"]', 0,
 'La neurona transmite señales eléctricas y químicas. El cerebro humano tiene unas 86.000 millones de neuronas.',
 'easy'),

('biologia', '¿Qué reino taxonómico incluye a los hongos?',
 '["Plantae","Fungi","Animalia","Protista"]', 1,
 'Los hongos forman su propio reino, Fungi. No son plantas: no hacen fotosíntesis y su pared celular es de quitina.',
 'medium'),

('biologia', '¿Cuántos sentidos tiene tradicionalmente el ser humano?',
 '["4","5","6","7"]', 1,
 'Tradicionalmente se reconocen 5: vista, oído, olfato, gusto y tacto. La ciencia moderna añade equilibrio, propiocepción, etc.',
 'easy'),

('biologia', '¿Cuál es el animal con el mayor cerebro?',
 '["Humano","Cachalote","Elefante","Delfín"]', 1,
 'El cachalote tiene el cerebro más pesado: hasta 8 kg. El humano tiene ~1,4 kg pero la mayor relación cerebro/cuerpo entre los grandes.',
 'medium'),

('biologia', '¿Qué tipo de raíz tiene la zanahoria?',
 '["Fibrosa","Pivotante","Adventicia","Aérea"]', 1,
 'La zanahoria tiene raíz pivotante, axonomorfa, que crece engrosada como reserva de azúcares (especialmente carotenos).',
 'hard'),

('biologia', '¿Qué tipo de reproducción producen las bacterias?',
 '["Sexual","Asexual","Vivípara","Ovípara"]', 1,
 'Las bacterias se reproducen por fisión binaria (asexual), duplicando su ADN y dividiéndose en dos células hijas idénticas.',
 'medium'),

('biologia', '¿Cuántas vértebras tiene la columna humana?',
 '["24","33","36","40"]', 1,
 'La columna tiene 33 vértebras: 7 cervicales, 12 dorsales, 5 lumbares, 5 sacras (fusionadas) y 4 coccígeas (fusionadas).',
 'medium'),

('biologia', '¿Qué función cumplen los glóbulos rojos?',
 '["Defender de infecciones","Coagular sangre","Transportar O₂","Producir hormonas"]', 2,
 'Los eritrocitos transportan O₂ desde los pulmones a los tejidos gracias a la hemoglobina, que contiene hierro.',
 'easy'),

('biologia', '¿Qué animal pone los huevos más grandes proporcionalmente?',
 '["Avestruz","Kiwi","Cocodrilo","Tortuga"]', 1,
 'El kiwi pone huevos del 20% de su peso corporal, los más grandes proporcionalmente del reino animal. El avestruz pone los más grandes en absoluto.',
 'hard'),

('biologia', '¿En qué fase del ciclo celular se replica el ADN?',
 '["G1","S","G2","M"]', 1,
 'La replicación del ADN ocurre en la fase S (síntesis), entre G1 y G2 de la interfase. M es la fase mitótica.',
 'hard'),

('biologia', '¿Cuál es el organismo vivo más antiguo (en años de un individuo)?',
 '["Tortuga gigante","Secuoya","Pino bristlecone","Coral"]', 2,
 'Algunos pinos bristlecone (Pinus longaeva) tienen más de 5.000 años. El más antiguo documentado, Methuselah, tiene unos 4.855 años.',
 'hard'),

('biologia', '¿Qué tipo de planta es el helecho?',
 '["Angiosperma","Gimnosperma","Pteridofita","Briofita"]', 2,
 'Los helechos son pteridofitas: plantas vasculares sin semillas, que se reproducen por esporas. Existen desde el Devónico.',
 'hard'),

('biologia', '¿Qué animal es conocido como el "diablo de Tasmania"?',
 '["Una rata","Un marsupial","Un reptil","Un anfibio"]', 1,
 'El diablo de Tasmania (Sarcophilus harrisii) es un marsupial carnívoro endémico de Tasmania. Es el mayor depredador marsupial actual.',
 'medium'),

('biologia', '¿Cuántos pares de costillas tiene el ser humano?',
 '["10","12","14","16"]', 1,
 'El ser humano tiene 12 pares de costillas: 7 verdaderas, 3 falsas y 2 flotantes. Suman 24 huesos en total.',
 'easy'),

('biologia', '¿Qué tejido recubre los órganos internos y forma glándulas?',
 '["Conectivo","Muscular","Epitelial","Nervioso"]', 2,
 'El tejido epitelial recubre superficies (piel, mucosas) y forma glándulas exocrinas y endocrinas. Hay 4 tejidos básicos.',
 'medium'),

('biologia', '¿Qué proceso convierte glucosa en energía (ATP) en presencia de O₂?',
 '["Glucólisis","Respiración aeróbica","Fermentación","Fotosíntesis"]', 1,
 'La respiración aeróbica (ciclo de Krebs + cadena respiratoria) genera ~36-38 moléculas de ATP por glucosa en presencia de oxígeno.',
 'medium'),

-- ══════════════════════════════════════════════════════════════
-- CINE Y SERIES (50)
-- ══════════════════════════════════════════════════════════════

('cine', '¿Quién dirigió "El Padrino" (1972)?',
 '["Scorsese","Coppola","Kubrick","Spielberg"]', 1,
 'Francis Ford Coppola dirigió "El Padrino" basada en la novela de Mario Puzo. Ganó el Óscar a Mejor Película.',
 'easy'),

('cine', '¿Qué película ganó el primer Óscar a Mejor Película?',
 '["Alas","Lo que el viento se llevó","Casablanca","Ben-Hur"]', 0,
 '"Alas" (Wings, 1927), de William A. Wellman, ganó en 1929. Es la única película muda en obtener el Óscar a Mejor Película.',
 'hard'),

('cine', '¿Quién protagonizó "Forrest Gump"?',
 '["Tom Cruise","Tom Hanks","Brad Pitt","Kevin Costner"]', 1,
 'Tom Hanks protagonizó "Forrest Gump" (1994), de Robert Zemeckis. La película ganó 6 Óscars, incluyendo Mejor Actor para Hanks.',
 'easy'),

('cine', '¿Quién dirigió "Pulp Fiction"?',
 '["Scorsese","Tarantino","Lynch","Soderbergh"]', 1,
 'Quentin Tarantino dirigió "Pulp Fiction" (1994), que ganó la Palma de Oro y revitalizó el cine independiente de los 90.',
 'easy'),

('cine', '¿En qué año se estrenó la primera "Star Wars"?',
 '["1975","1977","1979","1980"]', 1,
 'La primera "Star Wars" (Una Nueva Esperanza) se estrenó en mayo de 1977. La dirigió George Lucas.',
 'medium'),

('cine', '¿Quién es el director de "Titanic" (1997)?',
 '["Spielberg","Cameron","Zemeckis","Ridley Scott"]', 1,
 'James Cameron dirigió "Titanic", que ganó 11 Óscars (récord, empatada con Ben-Hur y El Retorno del Rey).',
 'easy'),

('cine', '¿Qué película tiene la frase "Sayonara, baby"?',
 '["Predator","Terminator 2","Rambo","Mad Max"]', 1,
 '"Sayonara, baby" (en doblaje español) es la frase de Schwarzenegger en "Terminator 2: El Juicio Final" (1991). En inglés: "Hasta la vista, baby".',
 'medium'),

('cine', '¿Quién protagoniza la trilogía original de Indiana Jones?',
 '["Harrison Ford","Sean Connery","Mel Gibson","Tom Selleck"]', 0,
 'Harrison Ford interpreta al arqueólogo Indiana Jones en la saga dirigida por Steven Spielberg desde 1981.',
 'easy'),

('cine', '¿Qué actriz interpretó a Mia Wallace en "Pulp Fiction"?',
 '["Uma Thurman","Jennifer Aniston","Bridget Fonda","Cameron Diaz"]', 0,
 'Uma Thurman interpretó a Mia Wallace en "Pulp Fiction" (1994). Recibió una nominación al Óscar por su papel.',
 'medium'),

('cine', '¿Qué película ganó el Óscar a Mejor Película en 2020 (rodada en coreano)?',
 '["Joker","Roma","Parásitos","1917"]', 2,
 '"Parásitos" de Bong Joon-ho fue la primera película no en inglés en ganar el Óscar a Mejor Película. Ganó 4 Óscars en total.',
 'medium'),

('cine', '¿Quién dirigió "El Resplandor" (1980)?',
 '["Hitchcock","Kubrick","Polanski","De Palma"]', 1,
 'Stanley Kubrick dirigió "El Resplandor", basada en la novela de Stephen King. Jack Nicholson protagoniza.',
 'medium'),

('cine', '¿Qué serie sigue a un profesor de química que fabrica metanfetamina?',
 '["The Wire","Breaking Bad","Better Call Saul","Ozark"]', 1,
 '"Breaking Bad" (2008-2013) cuenta la transformación de Walter White, profesor de química, en el narco Heisenberg.',
 'easy'),

('cine', '¿Qué saga incluye personajes como Frodo y Gandalf?',
 '["Narnia","Harry Potter","El Señor de los Anillos","Juego de Tronos"]', 2,
 '"El Señor de los Anillos" de J.R.R. Tolkien fue adaptada por Peter Jackson en 2001-2003. Ganó 17 Óscars en total.',
 'easy'),

('cine', '¿Qué animador fundó el estudio Pixar?',
 '["Walt Disney","John Lasseter","Hayao Miyazaki","Tim Burton"]', 1,
 'John Lasseter codirigió Pixar tras su compra por Steve Jobs en 1986. Su primer largo, "Toy Story" (1995), fue revolucionario.',
 'medium'),

('cine', '¿Qué actor interpretó al Joker en "El Caballero Oscuro" (2008)?',
 '["Jack Nicholson","Heath Ledger","Joaquin Phoenix","Cesar Romero"]', 1,
 'Heath Ledger interpretó al Joker en "El Caballero Oscuro" de Christopher Nolan. Ganó un Óscar póstumo a Mejor Actor de Reparto.',
 'medium'),

('cine', '¿En qué película Tom Hanks interpreta a un náufrago en una isla?',
 '["Forrest Gump","Cast Away","The Terminal","Big"]', 1,
 '"Cast Away" (Náufrago, 2000) dirigida por Robert Zemeckis. Hanks habla con una pelota llamada Wilson.',
 'medium'),

('cine', '¿Quién dirigió "Vértigo" y "Psicosis"?',
 '["Hitchcock","Lang","Welles","Wilder"]', 0,
 'Alfred Hitchcock, el "maestro del suspense", dirigió "Vértigo" (1958) y "Psicosis" (1960), entre muchos otros clásicos.',
 'easy'),

('cine', '¿Qué serie de HBO se basa en los libros de George R.R. Martin?',
 '["Vikingos","Juego de Tronos","Roma","Westworld"]', 1,
 '"Juego de Tronos" (2011-2019) adaptó "Canción de Hielo y Fuego". Es una de las series más vistas de la historia.',
 'easy'),

('cine', '¿Qué actor protagoniza la saga "Misión: Imposible"?',
 '["Brad Pitt","Tom Cruise","Matt Damon","Daniel Craig"]', 1,
 'Tom Cruise interpreta a Ethan Hunt desde 1996. Es famoso por hacer sus propias escenas de acción.',
 'easy'),

('cine', '¿Qué película de Disney/Pixar trata sobre las emociones?',
 '["Up","Inside Out","Coco","Soul"]', 1,
 '"Inside Out" (Del revés, 2015) muestra las emociones (Alegría, Tristeza, Ira, Miedo, Asco) dentro de la mente de una niña.',
 'easy'),

('cine', '¿En qué año se estrenó "Avatar"?',
 '["2007","2009","2011","2013"]', 1,
 '"Avatar" de James Cameron se estrenó en diciembre de 2009. Fue la película más taquillera hasta ser superada (y recuperar el récord).',
 'medium'),

('cine', '¿Quién es el director de la trilogía "El Caballero Oscuro"?',
 '["Tim Burton","Christopher Nolan","Zack Snyder","Sam Raimi"]', 1,
 'Christopher Nolan dirigió "Batman Begins" (2005), "El Caballero Oscuro" (2008) y "El Caballero Oscuro: La Leyenda Renace" (2012).',
 'easy'),

('cine', '¿Qué actor interpretó a Forrest Gump y Woody (en "Toy Story")?',
 '["Tom Hanks","Tim Allen","Robin Williams","Jim Carrey"]', 0,
 'Tom Hanks puso voz a Woody en "Toy Story" e interpretó a Forrest Gump en 1994.',
 'easy'),

('cine', '¿Quién compuso la banda sonora de "Star Wars"?',
 '["Hans Zimmer","John Williams","Ennio Morricone","James Horner"]', 1,
 'John Williams compuso la BSO icónica de "Star Wars", "Indiana Jones", "Tiburón" y "E.T." Acumula 54 nominaciones al Óscar.',
 'medium'),

('cine', '¿Qué película protagoniza Russell Crowe como gladiador?',
 '["Troya","Gladiator","Braveheart","300"]', 1,
 '"Gladiator" (Ridley Scott, 2000) ganó 5 Óscars incluyendo Mejor Película y Mejor Actor para Crowe como Máximo Décimo Meridio.',
 'easy'),

('cine', '¿Qué saga de ciencia ficción incluye a Neo y la Matrix?',
 '["Matrix","Inception","Blade Runner","Tron"]', 0,
 '"The Matrix" (1999) de las Wachowski. Keanu Reeves interpreta a Neo, el "elegido" para liberar a la humanidad de la simulación.',
 'easy'),

('cine', '¿Quién dirigió "La La Land"?',
 '["Damien Chazelle","David Fincher","Wes Anderson","Greta Gerwig"]', 0,
 'Damien Chazelle dirigió "La La Land" (2016), ganadora de 6 Óscars incluyendo Mejor Director (el más joven en obtenerlo: 32 años).',
 'medium'),

('cine', '¿Qué actor protagoniza "El Lobo de Wall Street"?',
 '["Leonardo DiCaprio","Brad Pitt","Christian Bale","Matthew McConaughey"]', 0,
 'Leonardo DiCaprio interpreta a Jordan Belfort en "El Lobo de Wall Street" (2013), dirigida por Martin Scorsese.',
 'easy'),

('cine', '¿En qué isla se rueda "Lost"?',
 '["Maui","Oahu","Hawái","Kauai"]', 1,
 '"Lost" (2004-2010) se rodó principalmente en Oahu (Hawái). Aunque la isla de la ficción es no localizada.',
 'hard'),

('cine', '¿Qué animación japonesa de 2001 ganó el Óscar?',
 '["Mi vecino Totoro","El viaje de Chihiro","La princesa Mononoke","Akira"]', 1,
 '"El viaje de Chihiro" (Sen to Chihiro no Kamikakushi) de Hayao Miyazaki ganó el Óscar a Mejor Película de Animación en 2003.',
 'medium'),

('cine', '¿Qué saga de Marvel terminó con "Endgame"?',
 '["Saga del infinito","Saga del multiverso","Saga de Asgard","Saga de los X-Men"]', 0,
 '"Vengadores: Endgame" (2019) cerró la Saga del Infinito (Fases 1-3) del MCU. Es una de las películas más taquilleras de la historia.',
 'easy'),

('cine', '¿Quién protagoniza "Joker" (2019)?',
 '["Jared Leto","Joaquin Phoenix","Ryan Gosling","Heath Ledger"]', 1,
 'Joaquin Phoenix ganó el Óscar a Mejor Actor por "Joker" (2019), dirigida por Todd Phillips.',
 'easy'),

('cine', '¿En qué ciudad transcurre "Casablanca"?',
 '["Tánger","Casablanca","Argel","El Cairo"]', 1,
 '"Casablanca" (1942) transcurre en Marruecos durante la Segunda Guerra Mundial. Bogart y Bergman protagonizan.',
 'easy'),

('cine', '¿Qué película popularizó la frase "May the Force be with you"?',
 '["Star Trek","Star Wars","Dune","Stargate"]', 1,
 '"Que la Fuerza te acompañe" es la frase icónica de "Star Wars" desde 1977. El 4 de mayo (May the 4th) es el día oficial.',
 'easy'),

('cine', '¿Quién dirigió "Inception" y "Tenet"?',
 '["Denis Villeneuve","Christopher Nolan","Ridley Scott","David Fincher"]', 1,
 'Christopher Nolan dirigió "Inception" (2010) y "Tenet" (2020), ambas con tramas no lineales y conceptos físicos complejos.',
 'medium'),

('cine', '¿Qué actriz ganó el Óscar por "La La Land"?',
 '["Emma Watson","Emma Stone","Jennifer Lawrence","Natalie Portman"]', 1,
 'Emma Stone ganó el Óscar a Mejor Actriz por "La La Land" (2016). Ganaría otro por "Pobres criaturas" (2024).',
 'medium'),

('cine', '¿Qué actor interpreta a James Bond en "Casino Royale" (2006)?',
 '["Pierce Brosnan","Daniel Craig","Sean Connery","Timothy Dalton"]', 1,
 'Daniel Craig fue Bond entre 2006 ("Casino Royale") y 2021 ("Sin tiempo para morir"), reinventando al personaje.',
 'easy'),

('cine', '¿Qué película documenta el ascenso de Facebook?',
 '["La Red Social","Steve Jobs","The Founder","Snowden"]', 0,
 '"La Red Social" (David Fincher, 2010) dramatiza la fundación de Facebook por Mark Zuckerberg. Guion de Aaron Sorkin.',
 'medium'),

('cine', '¿Cuál es la película de animación más taquillera de Pixar?',
 '["Buscando a Nemo","Los Increíbles 2","Toy Story 4","Inside Out 2"]', 3,
 '"Inside Out 2" (2024) superó los 1.700 M$ recaudados globalmente, convirtiéndose en la película de animación más taquillera de la historia.',
 'hard'),

('cine', '¿Quién dirigió "El club de la pelea" (Fight Club, 1999)?',
 '["David Fincher","Christopher Nolan","Darren Aronofsky","Paul Thomas Anderson"]', 0,
 'David Fincher dirigió "Fight Club", protagonizada por Brad Pitt y Edward Norton, adaptación de la novela de Chuck Palahniuk.',
 'medium'),

('cine', '¿Qué serie española sigue a un grupo de atracadores con caretas de Dalí?',
 '["Élite","La Casa de Papel","Vis a Vis","Las Chicas del Cable"]', 1,
 '"La Casa de Papel" (2017-2021) de Álex Pina se convirtió en un fenómeno internacional en Netflix. El Profesor lidera la banda.',
 'easy'),

('cine', '¿Qué película de Spielberg trata sobre un T-Rex que escapa de un parque?',
 '["E.T.","Jurassic Park","Tiburón","La guerra de los mundos"]', 1,
 '"Parque Jurásico" (Jurassic Park, 1993) revolucionó los efectos visuales con CGI. Basada en la novela de Michael Crichton.',
 'easy'),

('cine', '¿Quién protagoniza "Volver" (2006) de Almodóvar?',
 '["Carmen Maura","Penélope Cruz","Marisa Paredes","Victoria Abril"]', 1,
 'Penélope Cruz protagoniza "Volver", por la que fue nominada al Óscar (primera actriz española nominada como Mejor Actriz).',
 'medium'),

('cine', '¿Qué saga incluye "La comunidad del anillo" y "Las dos torres"?',
 '["Harry Potter","Narnia","ESDLA","Juego de Tronos"]', 2,
 '"El Señor de los Anillos" (ESDLA) son novelas de Tolkien adaptadas por Peter Jackson en 2001-2003.',
 'easy'),

('cine', '¿Cuál es la franquicia con más películas estrenadas?',
 '["James Bond","Star Wars","Marvel","Harry Potter"]', 0,
 'James Bond lleva 25 películas oficiales desde "Agente 007 contra el Dr. No" (1962). 7 actores han interpretado al espía.',
 'medium'),

('cine', '¿Qué actriz interpreta a Hermione en "Harry Potter"?',
 '["Emma Stone","Emma Watson","Keira Knightley","Saoirse Ronan"]', 1,
 'Emma Watson interpretó a Hermione Granger en las 8 películas de Harry Potter (2001-2011).',
 'easy'),

('cine', '¿Qué serie sigue a la familia Roy en torno a una empresa de medios?',
 '["Billions","Succession","Industry","The Morning Show"]', 1,
 '"Succession" (HBO, 2018-2023) creada por Jesse Armstrong. Ganó 13 Emmys en su última temporada.',
 'medium'),

('cine', '¿Qué actor protagonizó "Mejor... imposible" (1997)?',
 '["Robert De Niro","Jack Nicholson","Al Pacino","Dustin Hoffman"]', 1,
 'Jack Nicholson ganó el Óscar a Mejor Actor por "Mejor... imposible" (As Good as It Gets), de James L. Brooks.',
 'hard'),

('cine', '¿Qué película fue la primera en ganar el Óscar a Mejor Película de Animación?',
 '["Toy Story","Shrek","La Sirenita","El Rey León"]', 1,
 '"Shrek" (DreamWorks, 2001) ganó el primer Óscar a Mejor Película de Animación, categoría creada en 2002.',
 'hard'),

('cine', '¿En qué saga aparece el personaje Tony Stark / Iron Man?',
 '["DC","Marvel","Image","Dark Horse"]', 1,
 'Tony Stark / Iron Man pertenece a Marvel. Robert Downey Jr. lo interpretó en el MCU desde 2008 hasta 2019.',
 'easy'),

-- ══════════════════════════════════════════════════════════════
-- MÚSICA (50)
-- ══════════════════════════════════════════════════════════════

('musica', '¿Cuántas cuerdas tiene una guitarra clásica estándar?',
 '["4","5","6","7"]', 2,
 'La guitarra clásica española tiene 6 cuerdas afinadas E-A-D-G-B-E. Variantes incluyen guitarras de 7 o 12 cuerdas.',
 'easy'),

('musica', '¿Quién compuso la Novena Sinfonía con el "Himno de la Alegría"?',
 '["Mozart","Bach","Beethoven","Schubert"]', 2,
 'Ludwig van Beethoven compuso la Novena (1824), su última sinfonía. La compuso ya completamente sordo.',
 'easy'),

('musica', '¿De qué ciudad son originarios Los Beatles?',
 '["Londres","Manchester","Liverpool","Birmingham"]', 2,
 'Los Beatles se formaron en Liverpool en 1960. John Lennon, Paul McCartney, George Harrison y Ringo Starr.',
 'easy'),

('musica', '¿Quién es conocido como el "Rey del Pop"?',
 '["Elvis Presley","Michael Jackson","Prince","Madonna"]', 1,
 'Michael Jackson (1958-2009) recibió ese título. Su álbum "Thriller" (1982) sigue siendo el más vendido de la historia (~70 M).',
 'easy'),

('musica', '¿Cuál es el instrumento típico de Andrés Segovia?',
 '["Piano","Violín","Guitarra","Flauta"]', 2,
 'Andrés Segovia (1893-1987) elevó la guitarra clásica al estatus de instrumento solista de concierto.',
 'medium'),

('musica', '¿Qué cantante puertorriqueño popularizó "Despacito" en 2017?',
 '["Daddy Yankee","Luis Fonsi","Ozuna","Don Omar"]', 1,
 'Luis Fonsi lanzó "Despacito" (con Daddy Yankee) en 2017. Su remix con Justin Bieber rompió récords en YouTube.',
 'easy'),

('musica', '¿En qué país se inventó el tango?',
 '["Argentina","España","Brasil","Cuba"]', 0,
 'El tango nació en el Río de la Plata (Buenos Aires y Montevideo) a finales del siglo XIX. Es Patrimonio Cultural Inmaterial de la UNESCO.',
 'medium'),

('musica', '¿Qué famoso compositor era sordo al final de su vida?',
 '["Mozart","Bach","Beethoven","Brahms"]', 2,
 'Beethoven empezó a perder oído hacia los 26 años y compuso muchas de sus obras maestras (incluida la Novena) en sordera total.',
 'easy'),

('musica', '¿Cuántas notas musicales tiene la escala diatónica?',
 '["5","7","8","12"]', 1,
 'La escala diatónica tiene 7 notas: do, re, mi, fa, sol, la, si. Repitiendo, se vuelve al do para la octava.',
 'easy'),

('musica', '¿Quién fue conocido como el "Rey del Rock and Roll"?',
 '["Chuck Berry","Elvis Presley","Little Richard","Bill Haley"]', 1,
 'Elvis Presley (1935-1977) popularizó el rock and roll en los años 50. Vendió más de 500 millones de discos.',
 'easy'),

('musica', '¿Qué banda escribió "Bohemian Rhapsody"?',
 '["Led Zeppelin","Queen","The Who","Pink Floyd"]', 1,
 '"Bohemian Rhapsody" de Queen (1975), compuesta por Freddie Mercury. Dura 5:55 y mezcla balada, ópera y rock.',
 'easy'),

('musica', '¿En qué país nació Plácido Domingo?',
 '["México","España","Argentina","Italia"]', 1,
 'Plácido Domingo nació en Madrid en 1941 y emigró con su familia a México de niño. Es uno de los Tres Tenores.',
 'medium'),

('musica', '¿Cuántas teclas tiene un piano estándar?',
 '["76","85","88","100"]', 2,
 'Un piano estándar tiene 88 teclas: 52 blancas y 36 negras, cubriendo 7 octavas y un poco más.',
 'medium'),

('musica', '¿Quién compuso "Las cuatro estaciones"?',
 '["Bach","Vivaldi","Handel","Telemann"]', 1,
 'Antonio Vivaldi compuso "Le quattro stagioni" hacia 1720. Es una de las obras barrocas más populares.',
 'medium'),

('musica', '¿Qué cantante británica murió en 2011 con 27 años?',
 '["Adele","Amy Winehouse","Lana del Rey","Florence Welch"]', 1,
 'Amy Winehouse (1983-2011) murió a los 27 años por intoxicación alcohólica. Su álbum "Back to Black" ganó 5 Grammys.',
 'medium'),

('musica', '¿Quién compuso la ópera "El barbero de Sevilla"?',
 '["Mozart","Verdi","Rossini","Wagner"]', 2,
 'Gioachino Rossini estrenó "El barbero de Sevilla" en 1816. Es una de las óperas cómicas más representadas.',
 'hard'),

('musica', '¿De qué nacionalidad era Frédéric Chopin?',
 '["Francés","Polaco","Húngaro","Austríaco"]', 1,
 'Chopin (1810-1849) nació en Polonia y vivió la mayor parte de su vida en Francia. Compuso casi exclusivamente para piano.',
 'medium'),

('musica', '¿Qué grupo escribió "Stairway to Heaven"?',
 '["Pink Floyd","Led Zeppelin","Black Sabbath","Deep Purple"]', 1,
 'Led Zeppelin grabó "Stairway to Heaven" en su álbum sin título de 1971 (Led Zeppelin IV). Es una de las canciones más icónicas del rock.',
 'medium'),

('musica', '¿Quién compuso la "Marcha Nupcial" (Bridal Chorus)?',
 '["Mendelssohn","Wagner","Bach","Strauss"]', 1,
 'La famosa "Marcha Nupcial" ("Here Comes the Bride") es de Richard Wagner, de su ópera "Lohengrin" (1850).',
 'hard'),

('musica', '¿Qué cantante mexicana popularizó la canción "Cielito Lindo"?',
 '["Lola Beltrán","Lila Downs","Chavela Vargas","Es popular, no de nadie"]', 3,
 '"Cielito Lindo" es una canción popular mexicana de 1882, compuesta por Quirino Mendoza y Cortés. La han interpretado innumerables artistas.',
 'hard'),

('musica', '¿Qué cantante popularizó "Like a Virgin"?',
 '["Madonna","Cyndi Lauper","Whitney Houston","Tina Turner"]', 0,
 'Madonna lanzó "Like a Virgin" en 1984. El álbum vendió más de 21 millones de copias y consolidó su carrera.',
 'easy'),

('musica', '¿En qué siglo vivió Johann Sebastian Bach?',
 '["XVI","XVII","XVII-XVIII","XVIII-XIX"]', 2,
 'J.S. Bach (1685-1750), del Barroco tardío. Sus obras (BWV) suman más de 1.100 piezas.',
 'medium'),

('musica', '¿Qué instrumento toca Yo-Yo Ma?',
 '["Violín","Viola","Violonchelo","Contrabajo"]', 2,
 'Yo-Yo Ma es un violonchelista estadounidense de origen chino. Ha ganado 19 Grammys y es uno de los músicos más influyentes vivos.',
 'medium'),

('musica', '¿Cuántos miembros componen Coldplay?',
 '["3","4","5","6"]', 1,
 'Coldplay tiene 4 miembros: Chris Martin (voz), Jonny Buckland (guitarra), Guy Berryman (bajo) y Will Champion (batería).',
 'medium'),

('musica', '¿Qué cantante estadounidense compuso "Imagine"?',
 '["Bob Dylan","John Lennon","Bruce Springsteen","Paul Simon"]', 1,
 'John Lennon compuso y grabó "Imagine" en 1971, ya en su carrera solista tras los Beatles.',
 'easy'),

('musica', '¿En qué país surgió el flamenco?',
 '["Marruecos","Portugal","España","Italia"]', 2,
 'El flamenco surgió en Andalucía (España) en el siglo XVIII, con influencias gitanas, andaluzas y árabes. Es Patrimonio de la UNESCO.',
 'easy'),

('musica', '¿Qué cantante española ganó Eurovisión 1968?',
 '["Karina","Massiel","Salomé","Mocedades"]', 1,
 'Massiel ganó Eurovisión 1968 con "La, la, la", tras la negativa de Joan Manuel Serrat a cantarla en español.',
 'hard'),

('musica', '¿Qué músico es conocido como "The Boss"?',
 '["Bob Dylan","Bruce Springsteen","Neil Young","Tom Petty"]', 1,
 'Bruce Springsteen lleva el apodo de "The Boss" desde los 70. Su álbum "Born in the USA" (1984) vendió 30 M de copias.',
 'medium'),

('musica', '¿Qué se mide en hercios (Hz) en música?',
 '["Volumen","Frecuencia","Duración","Timbre"]', 1,
 'La frecuencia se mide en Hz (ciclos por segundo). El La estándar es 440 Hz. El humano oye entre ~20 Hz y ~20.000 Hz.',
 'medium'),

('musica', '¿Qué grupo grabó "Dark Side of the Moon"?',
 '["Genesis","Pink Floyd","Rush","Yes"]', 1,
 '"The Dark Side of the Moon" de Pink Floyd (1973) estuvo 950 semanas en el Billboard 200 y vendió ~45 M de copias.',
 'medium'),

('musica', '¿Quién compuso "El lago de los cisnes"?',
 '["Stravinsky","Prokofiev","Tchaikovsky","Rachmaninoff"]', 2,
 'Piotr Ilich Tchaikovsky estrenó "El lago de los cisnes" en 1877. Es uno de los ballets más representados.',
 'medium'),

('musica', '¿Cuántos miembros tenían los Beatles?',
 '["3","4","5","6"]', 1,
 'Los Beatles fueron 4: John Lennon, Paul McCartney, George Harrison y Ringo Starr (sustituyendo a Pete Best en 1962).',
 'easy'),

('musica', '¿Qué cantante de blues es apodado "King of the Blues"?',
 '["Muddy Waters","B.B. King","John Lee Hooker","Howlin'' Wolf"]', 1,
 'B.B. King (1925-2015), guitarrista de blues, llamó "Lucille" a su guitarra Gibson. Influyó en generaciones de músicos.',
 'hard'),

('musica', '¿Qué tipo de instrumento es la marimba?',
 '["Cuerda","Viento","Percusión","Electrónico"]', 2,
 'La marimba es un idiófono de percusión: barras de madera afinadas que se golpean con baquetas. Es originaria de Centroamérica/África.',
 'medium'),

('musica', '¿Quién compuso "La Traviata"?',
 '["Puccini","Verdi","Rossini","Donizetti"]', 1,
 'Giuseppe Verdi estrenó "La Traviata" en 1853, basada en "La dama de las camelias" de Dumas hijo.',
 'medium'),

('musica', '¿Qué cantautor catalán compuso "Mediterráneo" (1971)?',
 '["Lluís Llach","Joan Manuel Serrat","Raimon","Pau Casals"]', 1,
 'Joan Manuel Serrat lanzó "Mediterráneo" en 1971. Es considerada una de las mejores canciones en español de todos los tiempos.',
 'hard'),

('musica', '¿Qué grupo lanzó "Hotel California" en 1976?',
 '["Eagles","Fleetwood Mac","Doobie Brothers","Steely Dan"]', 0,
 '"Hotel California" de los Eagles ganó el Grammy a Grabación del Año en 1978 y es uno de los himnos del rock clásico.',
 'medium'),

('musica', '¿Qué orquesta dirigió Herbert von Karajan durante décadas?',
 '["Viena","Berlín","Londres","Nueva York"]', 1,
 'Karajan dirigió la Filarmónica de Berlín entre 1955 y 1989. Es uno de los directores más vendidos de la historia.',
 'hard'),

('musica', '¿Cuál es la nota más aguda en el pentagrama de clave de sol?',
 '["Do","Mi","La","Depende"]', 3,
 'En clave de sol, las notas suben indefinidamente con líneas adicionales encima del pentagrama. La nota más aguda depende del rango.',
 'hard'),

('musica', '¿Qué cantante británica lanzó "Rolling in the Deep" en 2010?',
 '["Adele","Amy Winehouse","Florence","Dua Lipa"]', 0,
 'Adele lanzó "Rolling in the Deep" en 2010, primer single de su álbum "21", uno de los más vendidos del siglo XXI.',
 'easy'),

('musica', '¿Quién popularizó la canción "My Way"?',
 '["Frank Sinatra","Elvis Presley","Tony Bennett","Bing Crosby"]', 0,
 '"My Way" se asocia con Frank Sinatra (1969), aunque la letra es de Paul Anka, adaptada de "Comme d''habitude" de Claude François.',
 'medium'),

('musica', '¿Qué grupo grabó "Smells Like Teen Spirit"?',
 '["Pearl Jam","Nirvana","Soundgarden","Alice in Chains"]', 1,
 'Nirvana lanzó "Smells Like Teen Spirit" en 1991 en su álbum "Nevermind". Definió el sonido grunge de los 90.',
 'medium'),

('musica', '¿Cuántas líneas tiene un pentagrama?',
 '["3","4","5","6"]', 2,
 'Un pentagrama tiene 5 líneas y 4 espacios donde se colocan las notas. Es el sistema occidental estándar desde el siglo XVII.',
 'easy'),

('musica', '¿Qué cantante mexicana popularizó la canción "La Llorona"?',
 '["Lola Beltrán","Chavela Vargas","Lila Downs","Es popular"]', 1,
 'Chavela Vargas (1919-2012) popularizó "La Llorona" en su versión más conocida, aunque la canción es popular mexicana del siglo XIX.',
 'medium'),

('musica', '¿En qué año murió Mozart?',
 '["1791","1801","1815","1827"]', 0,
 'Wolfgang Amadeus Mozart murió el 5 de diciembre de 1791 a los 35 años, sin completar su Réquiem.',
 'medium'),

('musica', '¿Qué músico francés inspiró el impresionismo musical?',
 '["Ravel","Debussy","Bizet","Saint-Saëns"]', 1,
 'Claude Debussy (1862-1918) es el principal exponente del impresionismo musical, con obras como "Claro de luna" y "La mer".',
 'hard'),

('musica', '¿Qué cantante puertorriqueño es apodado "El Conejo Malo"?',
 '["Daddy Yankee","Bad Bunny","Ozuna","Anuel AA"]', 1,
 'Bad Bunny (Benito Antonio Martínez Ocasio) es el reguetonero/trapero más escuchado del mundo en Spotify en varios años recientes.',
 'easy'),

('musica', '¿Quién compuso "Carmen"?',
 '["Massenet","Bizet","Gounod","Berlioz"]', 1,
 'Georges Bizet estrenó la ópera "Carmen" en 1875. Es una de las óperas más representadas del repertorio.',
 'medium'),

('musica', '¿Qué grupo grabó "Sweet Child O'' Mine"?',
 '["Aerosmith","Guns N'' Roses","AC/DC","Bon Jovi"]', 1,
 '"Sweet Child O''Mine" de Guns N'' Roses, en su álbum debut "Appetite for Destruction" (1987). El riff de Slash es de los más famosos.',
 'medium'),

('musica', '¿Cuántas óperas compuso Mozart (aproximadamente)?',
 '["12","17","22","30"]', 2,
 'Mozart compuso unas 22 óperas, incluyendo "Las bodas de Fígaro" (1786), "Don Giovanni" (1787) y "La flauta mágica" (1791).',
 'hard'),

-- ══════════════════════════════════════════════════════════════
-- LITERATURA (50)
-- ══════════════════════════════════════════════════════════════

('literatura', '¿Quién escribió "Don Quijote de la Mancha"?',
 '["Lope de Vega","Cervantes","Quevedo","Calderón"]', 1,
 'Miguel de Cervantes publicó la 1ª parte en 1605 y la 2ª en 1615. Considerada la primera novela moderna.',
 'easy'),

('literatura', '¿En qué siglo vivió Shakespeare?',
 '["XV-XVI","XVI-XVII","XVII-XVIII","XVIII-XIX"]', 1,
 'William Shakespeare (1564-1616). Escribió 39 obras de teatro y 154 sonetos.',
 'easy'),

('literatura', '¿Quién escribió "Cien años de soledad"?',
 '["Vargas Llosa","Borges","García Márquez","Cortázar"]', 2,
 'Gabriel García Márquez publicó la novela en 1967. Premio Nobel de Literatura en 1982. Obra cumbre del realismo mágico.',
 'easy'),

('literatura', '¿Qué autor inglés creó a Sherlock Holmes?',
 '["Dickens","Conan Doyle","Wilde","Stevenson"]', 1,
 'Arthur Conan Doyle creó al detective Sherlock Holmes en "Estudio en escarlata" (1887). Escribió 4 novelas y 56 relatos sobre él.',
 'easy'),

('literatura', '¿Quién escribió "Orgullo y prejuicio"?',
 '["Jane Austen","Brontë","Eliot","Woolf"]', 0,
 'Jane Austen publicó "Orgullo y prejuicio" en 1813. Es una de las novelas más leídas en lengua inglesa.',
 'easy'),

('literatura', '¿Quién escribió "Hamlet"?',
 '["Marlowe","Shakespeare","Ben Jonson","Donne"]', 1,
 '"Hamlet, príncipe de Dinamarca" (1600-1601) es la tragedia más larga de Shakespeare. "To be or not to be" es su monólogo más célebre.',
 'easy'),

('literatura', '¿De qué país era Franz Kafka?',
 '["Alemania","Austria","Checoslovaquia","Hungría"]', 2,
 'Kafka (1883-1924) nació en Praga, entonces parte del Imperio Austrohúngaro, hoy República Checa. Escribió en alemán.',
 'medium'),

('literatura', '¿Quién escribió "La metamorfosis"?',
 '["Kafka","Camus","Sartre","Borges"]', 0,
 'Franz Kafka publicó "Die Verwandlung" (La metamorfosis) en 1915. Gregor Samsa se despierta convertido en un insecto.',
 'easy'),

('literatura', '¿Qué autor argentino escribió "Ficciones"?',
 '["Cortázar","Borges","Bioy Casares","Sábato"]', 1,
 'Jorge Luis Borges publicó "Ficciones" en 1944, una de las colecciones de cuentos más influyentes del siglo XX.',
 'medium'),

('literatura', '¿Quién escribió "Crimen y castigo"?',
 '["Tolstói","Dostoievski","Chejov","Turguénev"]', 1,
 'Fiódor Dostoievski publicó "Crimen y castigo" en 1866. Sigue a Raskólnikov tras asesinar a una usurera.',
 'medium'),

('literatura', '¿Quién escribió "Madame Bovary"?',
 '["Flaubert","Stendhal","Balzac","Zola"]', 0,
 'Gustave Flaubert publicó "Madame Bovary" en 1856. Le valió un juicio por inmoralidad, del que fue absuelto.',
 'medium'),

('literatura', '¿Quién escribió "El principito"?',
 '["Saint-Exupéry","Camus","Sartre","Verne"]', 0,
 'Antoine de Saint-Exupéry publicó "Le Petit Prince" en 1943. Es uno de los libros más traducidos del mundo (más de 300 idiomas).',
 'easy'),

('literatura', '¿Qué autor escribió "1984"?',
 '["Huxley","Orwell","Bradbury","Burgess"]', 1,
 'George Orwell publicó "1984" en 1949. Distopía totalitaria que acuñó términos como "Gran Hermano" y "doblepensar".',
 'easy'),

('literatura', '¿Quién escribió "Un mundo feliz" (Brave New World)?',
 '["Orwell","Huxley","Bradbury","Asimov"]', 1,
 'Aldous Huxley publicó "Brave New World" en 1932, distopía centrada en el control mediante el placer y la ingeniería genética.',
 'medium'),

('literatura', '¿Qué autor escribió "Los miserables"?',
 '["Hugo","Dumas","Balzac","Zola"]', 0,
 'Victor Hugo publicó "Les Misérables" en 1862. Sigue la redención de Jean Valjean en la Francia post-napoleónica.',
 'easy'),

('literatura', '¿Quién escribió "El nombre de la rosa"?',
 '["Calvino","Eco","Saramago","Manzoni"]', 1,
 'Umberto Eco publicó "Il nome della rosa" en 1980. Misterio medieval en un monasterio benedictino.',
 'medium'),

('literatura', '¿Qué libro empieza con "Llamadme Ismael"?',
 '["La isla del tesoro","Moby Dick","Robinson Crusoe","20.000 leguas..."]', 1,
 '"Moby Dick" de Herman Melville (1851) comienza con "Call me Ishmael", una de las primeras frases más famosas de la literatura.',
 'medium'),

('literatura', '¿Quién escribió "Drácula"?',
 '["Bram Stoker","Mary Shelley","Edgar Allan Poe","Sheridan Le Fanu"]', 0,
 'Bram Stoker publicó "Drácula" en 1897, en formato epistolar. Fundó las bases de la novela vampírica moderna.',
 'easy'),

('literatura', '¿Quién escribió "Frankenstein"?',
 '["Bram Stoker","Mary Shelley","Edgar Allan Poe","Robert Stevenson"]', 1,
 'Mary Shelley publicó "Frankenstein, o el moderno Prometeo" en 1818, con solo 20 años. Considerada precursora de la ciencia ficción.',
 'medium'),

('literatura', '¿Qué autor escribió "El Quijote" 400 años antes del 4.º centenario celebrado en 2005?',
 '["Lope de Vega","Cervantes","Calderón","Quevedo"]', 1,
 'Cervantes publicó la 1ª parte en 1605 (400 años antes del 2005). La 2ª salió en 1615.',
 'medium'),

('literatura', '¿Quién escribió "El gran Gatsby"?',
 '["Hemingway","Fitzgerald","Faulkner","Steinbeck"]', 1,
 'F. Scott Fitzgerald publicó "The Great Gatsby" en 1925. Considerada una de las grandes novelas estadounidenses, retrato de la era del jazz.',
 'medium'),

('literatura', '¿Qué premio Nobel ganaron Hemingway y Steinbeck?',
 '["Pulitzer","Nobel de Literatura","Booker","Cervantes"]', 1,
 'Ernest Hemingway ganó el Nobel de Literatura en 1954 y John Steinbeck en 1962.',
 'medium'),

('literatura', '¿Qué autor escribió "El extranjero" (L''Étranger)?',
 '["Sartre","Camus","Gide","Malraux"]', 1,
 'Albert Camus publicó "L''Étranger" en 1942, considerada obra clave del existencialismo (aunque Camus prefería el "absurdismo").',
 'medium'),

('literatura', '¿Quién escribió "El retrato de Dorian Gray"?',
 '["Wilde","Stoker","Stevenson","Conan Doyle"]', 0,
 'Oscar Wilde publicó "The Picture of Dorian Gray" en 1890. Es su única novela; el resto de su obra es teatro y poesía.',
 'medium'),

('literatura', '¿Qué autor creó al detective Hércules Poirot?',
 '["Conan Doyle","Christie","Chesterton","Dashiell Hammett"]', 1,
 'Agatha Christie creó a Poirot en "El misterioso caso de Styles" (1920). Aparece en 33 novelas y 50 relatos. Es la autora de ficción más vendida.',
 'medium'),

('literatura', '¿Quién escribió "Ulises"?',
 '["Joyce","Beckett","Yeats","Heaney"]', 0,
 'James Joyce publicó "Ulysses" en 1922. Narra un día (16 de junio de 1904) en Dublín. Innovó con el "monólogo interior".',
 'medium'),

('literatura', '¿Qué autor brasileño escribió "Capitanes de la arena"?',
 '["Jorge Amado","Machado de Assis","Clarice Lispector","Carlos Drummond"]', 0,
 'Jorge Amado publicó "Capitães da Areia" en 1937. Retrata a niños callejeros en Salvador de Bahía.',
 'hard'),

('literatura', '¿Quién es el autor de "Rayuela"?',
 '["Cortázar","Borges","Bioy Casares","Sabato"]', 0,
 'Julio Cortázar publicó "Rayuela" en 1963. Novela experimental que se puede leer en distintos órdenes.',
 'medium'),

('literatura', '¿Qué autor inglés escribió "Cumbres borrascosas"?',
 '["Charlotte Brontë","Emily Brontë","Anne Brontë","Jane Austen"]', 1,
 'Emily Brontë publicó "Wuthering Heights" en 1847 bajo seudónimo masculino. Es su única novela.',
 'medium'),

('literatura', '¿Qué autor escribió la saga de "La Comedia humana"?',
 '["Balzac","Zola","Flaubert","Hugo"]', 0,
 'Honoré de Balzac escribió "La Comédie humaine" (1830-1850), conjunto de ~90 obras interconectadas que retratan la sociedad francesa.',
 'hard'),

('literatura', '¿Qué autor portugués ganó el Nobel de Literatura en 1998?',
 '["Pessoa","Saramago","Lobo Antunes","Mário de Sá-Carneiro"]', 1,
 'José Saramago ganó el Nobel en 1998. Su obra incluye "Ensayo sobre la ceguera" (1995) y "El año de la muerte de Ricardo Reis".',
 'medium'),

('literatura', '¿Qué autora rusa escribió "Anna Karénina"?',
 '["Tolstói","Dostoievski","Chéjov","Pushkin"]', 0,
 'León Tolstói (NO autora, sino autor) publicó "Anna Karénina" entre 1875 y 1877. Aviso: el "auto" del enunciado es genérico.',
 'easy'),

('literatura', '¿Qué autor escribió "Robinson Crusoe"?',
 '["Defoe","Swift","Stevenson","Verne"]', 0,
 'Daniel Defoe publicó "Robinson Crusoe" en 1719. Considerada una de las primeras novelas en inglés.',
 'medium'),

('literatura', '¿Quién escribió la saga "Harry Potter"?',
 '["J.K. Rowling","Tolkien","C.S. Lewis","Philip Pullman"]', 0,
 'J.K. Rowling publicó "Harry Potter y la piedra filosofal" en 1997. La saga vendió más de 600 millones de copias.',
 'easy'),

('literatura', '¿Quién escribió "El Señor de los Anillos"?',
 '["Tolkien","Lewis","Rowling","Pratchett"]', 0,
 'J.R.R. Tolkien publicó "The Lord of the Rings" entre 1954 y 1955. Sentó las bases de la fantasía épica moderna.',
 'easy'),

('literatura', '¿Quién escribió "Los pilares de la Tierra"?',
 '["Ken Follett","Dan Brown","Patrick Süskind","Umberto Eco"]', 0,
 'Ken Follett publicó "Los pilares de la Tierra" en 1989. Saga histórica sobre la construcción de una catedral en la Inglaterra medieval.',
 'medium'),

('literatura', '¿Qué autora chilena escribió "La casa de los espíritus"?',
 '["Isabel Allende","Marcela Serrano","Pia Barros","Diamela Eltit"]', 0,
 'Isabel Allende publicó "La casa de los espíritus" en 1982. Saga familiar con realismo mágico, en una Chile no nombrado.',
 'medium'),

('literatura', '¿Quién escribió "La divina comedia"?',
 '["Boccaccio","Dante","Petrarca","Maquiavelo"]', 1,
 'Dante Alighieri escribió "La Divina Commedia" hacia 1320. Obra cumbre de la literatura italiana medieval.',
 'easy'),

('literatura', '¿Qué autor griego escribió "La Ilíada"?',
 '["Sófocles","Homero","Esquilo","Eurípides"]', 1,
 'Homero (siglo VIII a.C.) compuso "La Ilíada" y "La Odisea". Su existencia histórica es debatida ("cuestión homérica").',
 'easy'),

('literatura', '¿Cuál es el primer libro de la Biblia?',
 '["Génesis","Éxodo","Levítico","Salmos"]', 0,
 'El Génesis es el primer libro del Antiguo Testamento. Narra la creación del mundo y los orígenes de la humanidad.',
 'easy'),

('literatura', '¿Quién escribió "La náusea"?',
 '["Camus","Sartre","Gide","Beauvoir"]', 1,
 'Jean-Paul Sartre publicó "La Nausée" en 1938. Obra fundacional del existencialismo francés.',
 'hard'),

('literatura', '¿Qué autor ruso escribió "Guerra y paz"?',
 '["Dostoievski","Tolstói","Turguénev","Pushkin"]', 1,
 'León Tolstói publicó "Guerra y paz" entre 1865 y 1869. Más de 1.200 páginas y 580 personajes durante las guerras napoleónicas.',
 'medium'),

('literatura', '¿Quién escribió "El código Da Vinci"?',
 '["Ken Follett","Dan Brown","Stephen King","Umberto Eco"]', 1,
 'Dan Brown publicó "The Da Vinci Code" en 2003. Vendió más de 80 millones de copias.',
 'easy'),

('literatura', '¿Qué autor japonés ganó el Nobel en 1968?',
 '["Mishima","Kawabata","Murakami","Oe"]', 1,
 'Yasunari Kawabata fue el primer japonés en ganar el Nobel de Literatura, en 1968. Autor de "País de nieve" y "Mil grullas".',
 'hard'),

('literatura', '¿Quién escribió "Lolita"?',
 '["Bulgákov","Nabokov","Solzhenitsyn","Bukowski"]', 1,
 'Vladimir Nabokov publicó "Lolita" en 1955. Controvertida por su tema; aclamada por su prosa en inglés (su segundo idioma).',
 'medium'),

('literatura', '¿Qué autor escribió "El alquimista"?',
 '["Coelho","Saramago","Allende","Borges"]', 0,
 'Paulo Coelho publicó "O Alquimista" en 1988. Es el libro brasileño más traducido (más de 80 idiomas).',
 'medium'),

('literatura', '¿Quién escribió la novela "El amor en los tiempos del cólera"?',
 '["García Márquez","Vargas Llosa","Cortázar","Carpentier"]', 0,
 'García Márquez publicó "El amor en los tiempos del cólera" en 1985, novela inspirada en el amor de sus padres.',
 'medium'),

('literatura', '¿Qué autor publicó "La fiesta del Chivo"?',
 '["Vargas Llosa","García Márquez","Roa Bastos","Donoso"]', 0,
 'Mario Vargas Llosa publicó "La fiesta del Chivo" en 2000. Aborda la dictadura de Trujillo en la República Dominicana.',
 'hard'),

('literatura', '¿En qué siglo nació Federico García Lorca?',
 '["XVIII","XIX","XIX-XX","XX"]', 2,
 'Lorca nació en 1898 (siglo XIX) y fue asesinado en 1936 (siglo XX). Miembro destacado de la Generación del 27.',
 'medium'),

('literatura', '¿Qué autor escribió "Pedro Páramo"?',
 '["Octavio Paz","Juan Rulfo","Carlos Fuentes","José Emilio Pacheco"]', 1,
 'Juan Rulfo publicó "Pedro Páramo" en 1955. Obra fundamental del realismo mágico latinoamericano, antecedente de García Márquez.',
 'hard'),

-- ══════════════════════════════════════════════════════════════
-- TECNOLOGÍA (50)
-- ══════════════════════════════════════════════════════════════

('tecnologia', '¿Quién cofundó Microsoft con Paul Allen?',
 '["Steve Jobs","Bill Gates","Larry Page","Mark Zuckerberg"]', 1,
 'Bill Gates y Paul Allen fundaron Microsoft en 1975 en Albuquerque. La empresa se mudó a Redmond, Washington, en 1979.',
 'easy'),

('tecnologia', '¿Qué significan las siglas HTTP?',
 '["HyperText Transfer Protocol","High Transfer Text Protocol","Home Tool Transfer Protocol","Hyperlink Text Transmit Protocol"]', 0,
 'HTTP fue creado por Tim Berners-Lee en 1989. HTTPS añade cifrado TLS sobre HTTP.',
 'medium'),

('tecnologia', '¿En qué año se lanzó el primer iPhone?',
 '["2005","2007","2009","2010"]', 1,
 'Steve Jobs presentó el primer iPhone el 9 de enero de 2007 y se lanzó al mercado el 29 de junio de ese año.',
 'easy'),

('tecnologia', '¿Quién es considerado el inventor de la World Wide Web?',
 '["Vint Cerf","Tim Berners-Lee","Tim Cook","Linus Torvalds"]', 1,
 'Tim Berners-Lee propuso la WWW en 1989 en el CERN. La primera web (info.cern.ch) sigue accesible.',
 'medium'),

('tecnologia', '¿Qué empresa creó el sistema operativo Android?',
 '["Apple","Google","Microsoft","Samsung"]', 1,
 'Android Inc. fue fundada en 2003 y comprada por Google en 2005. La primera versión pública salió en 2008.',
 'easy'),

('tecnologia', '¿Qué empresa fabrica el procesador "Ryzen"?',
 '["Intel","AMD","NVIDIA","Qualcomm"]', 1,
 'AMD lanzó la línea Ryzen en 2017 basada en su arquitectura Zen. Compitió de tú a tú con Intel tras años de dominio del rival.',
 'medium'),

('tecnologia', '¿Quién fundó Tesla y SpaceX?',
 '["Jeff Bezos","Bill Gates","Elon Musk","Larry Page"]', 2,
 'Elon Musk cofundó PayPal, SpaceX (2002) y se incorporó como CEO de Tesla en 2008. También fundó Neuralink y The Boring Company.',
 'easy'),

('tecnologia', '¿Cuántos bits forman un byte?',
 '["4","8","16","32"]', 1,
 'Un byte tiene 8 bits. Es la unidad básica de información en informática. Permite 256 valores diferentes (2^8).',
 'easy'),

('tecnologia', '¿Qué lenguaje de programación creó James Gosling?',
 '["C","Python","Java","Ruby"]', 2,
 'James Gosling diseñó Java en Sun Microsystems en 1995. El eslogan: "Write once, run anywhere" gracias a la JVM.',
 'medium'),

('tecnologia', '¿Qué empresa creó el sistema operativo iOS?',
 '["Google","Microsoft","Apple","Nokia"]', 2,
 'Apple lanzó iOS (originalmente iPhone OS) con el primer iPhone en 2007. Es propietario y exclusivo de dispositivos Apple.',
 'easy'),

('tecnologia', '¿Qué significa CPU?',
 '["Central Processing Unit","Computer Personal Unit","Control Process Unit","Core Power Unit"]', 0,
 'CPU = Central Processing Unit. Es el cerebro del ordenador que ejecuta las instrucciones de los programas.',
 'easy'),

('tecnologia', '¿Quién fundó Facebook?',
 '["Sergey Brin","Mark Zuckerberg","Jack Dorsey","Reid Hoffman"]', 1,
 'Mark Zuckerberg fundó Facebook en 2004 desde su habitación en Harvard junto a Eduardo Saverin y otros compañeros.',
 'easy'),

('tecnologia', '¿Qué año se fundó Google?',
 '["1995","1998","2000","2003"]', 1,
 'Larry Page y Sergey Brin fundaron Google en septiembre de 1998 en Menlo Park, California. Inicialmente se llamaba "Backrub".',
 'medium'),

('tecnologia', '¿Qué protocolo se usa para enviar correos electrónicos?',
 '["FTP","SMTP","HTTP","SSH"]', 1,
 'SMTP (Simple Mail Transfer Protocol) envía correos. POP3 e IMAP los recogen del servidor.',
 'medium'),

('tecnologia', '¿Cuál fue el primer navegador web?',
 '["Mosaic","Netscape","WorldWideWeb","Internet Explorer"]', 2,
 'Tim Berners-Lee creó "WorldWideWeb" en 1990 (luego renombrado Nexus). Mosaic (1993) popularizó las imágenes inline.',
 'hard'),

('tecnologia', '¿Qué lenguaje crearon Guido van Rossum?',
 '["Java","Python","Ruby","PHP"]', 1,
 'Guido van Rossum creó Python en 1991. Es uno de los lenguajes más usados, especialmente en IA, ciencia de datos y educación.',
 'medium'),

('tecnologia', '¿Qué empresa creó el chip M1 para Mac?',
 '["Intel","AMD","Apple","Qualcomm"]', 2,
 'Apple lanzó el chip M1 en 2020, su primer procesador ARM para Mac, sustituyendo a Intel tras 15 años de colaboración.',
 'medium'),

('tecnologia', '¿Qué significa USB?',
 '["Universal Serial Bus","Unified System Bus","Ultra Speed Bus","User Standard Bus"]', 0,
 'USB se desarrolló en 1996 por un consorcio (Intel, Microsoft, IBM, etc.). USB-C (2014) es ahora el conector universal.',
 'medium'),

('tecnologia', '¿Qué red social fue fundada por Jack Dorsey?',
 '["Facebook","Twitter","Instagram","LinkedIn"]', 1,
 'Jack Dorsey cofundó Twitter en 2006. La plataforma pasó a llamarse X en 2023 tras la compra de Elon Musk.',
 'medium'),

('tecnologia', '¿Qué generación de móviles se popularizó alrededor de 2020?',
 '["3G","4G","5G","6G"]', 2,
 'El 5G comenzó a desplegarse comercialmente en 2019 y se masificó en 2020-2022, prometiendo más velocidad y menor latencia.',
 'easy'),

('tecnologia', '¿Quién inventó la bombilla eléctrica práctica?',
 '["Tesla","Edison","Faraday","Marconi"]', 1,
 'Thomas Edison patentó la bombilla incandescente práctica en 1879. No fue el primer inventor, pero sí el más comercial.',
 'easy'),

('tecnologia', '¿Qué empresa creó ChatGPT?',
 '["Google","OpenAI","Meta","Microsoft"]', 1,
 'OpenAI lanzó ChatGPT en noviembre de 2022. Microsoft es uno de sus principales inversores y partners (Azure).',
 'easy'),

('tecnologia', '¿Qué empresa fabrica las GPU GeForce?',
 '["AMD","Intel","NVIDIA","Qualcomm"]', 2,
 'NVIDIA fabrica la línea GeForce desde 1999. Sus chips dominan el mercado de gaming y entrenamiento de IA (con sus Tesla/H100).',
 'easy'),

('tecnologia', '¿Qué significa "Wi-Fi"?',
 '["Wireless Fidelity","No es acrónimo (marca)","Web Internet Fidelity","Wide Internet Frequency"]', 1,
 'A pesar del mito, "Wi-Fi" no significa "Wireless Fidelity". Fue un nombre comercial creado por Interbrand en 1999.',
 'hard'),

('tecnologia', '¿En qué año se fundó Apple?',
 '["1971","1976","1981","1984"]', 1,
 'Apple fue fundada por Steve Jobs, Steve Wozniak y Ronald Wayne el 1 de abril de 1976 en California.',
 'medium'),

('tecnologia', '¿Qué tipo de criptomoneda creó Satoshi Nakamoto?',
 '["Ethereum","Bitcoin","Litecoin","Ripple"]', 1,
 'Bitcoin fue creado por el seudónimo Satoshi Nakamoto en 2009. La verdadera identidad sigue siendo un misterio.',
 'easy'),

('tecnologia', '¿Qué lenguaje creó Brendan Eich en 10 días?',
 '["Python","JavaScript","Ruby","Perl"]', 1,
 'Brendan Eich diseñó JavaScript en 10 días en Netscape, en 1995. Es el lenguaje principal del navegador.',
 'medium'),

('tecnologia', '¿Qué empresa creó el motor de búsqueda Bing?',
 '["Google","Microsoft","Yahoo","Amazon"]', 1,
 'Microsoft lanzó Bing en 2009 como sucesor de MSN Search/Live Search. Pelea por una pequeña cuota frente a Google.',
 'medium'),

('tecnologia', '¿Qué sistema operativo desarrolló Linus Torvalds?',
 '["Unix","Linux","BSD","Solaris"]', 1,
 'Linus Torvalds liberó la primera versión de Linux en 1991, mientras estudiaba en la Universidad de Helsinki.',
 'easy'),

('tecnologia', '¿Cuántos bytes tiene un kilobyte (KB) según los SI?',
 '["1000","1024","2048","4096"]', 0,
 'Según el SI, 1 KB = 1.000 bytes. En informática se usa 1 KiB = 1.024 bytes. Hay confusión histórica en el uso.',
 'hard'),

('tecnologia', '¿Qué empresa creó el iPad?',
 '["Microsoft","Apple","Samsung","Google"]', 1,
 'Apple lanzó el primer iPad en abril de 2010. Definió el formato moderno de tablet.',
 'easy'),

('tecnologia', '¿Qué plataforma compró Microsoft en 2016 por 26.000 M$?',
 '["GitHub","LinkedIn","Slack","Skype"]', 1,
 'Microsoft compró LinkedIn por 26.200 M$ en 2016. En 2018 compró GitHub por 7.500 M$.',
 'medium'),

('tecnologia', '¿Qué tipo de almacenamiento son los SSD?',
 '["Magnético","Óptico","Flash","Holográfico"]', 2,
 'Los SSD (Solid State Drive) usan memoria flash NAND. Son mucho más rápidos que los HDD (discos mecánicos).',
 'medium'),

('tecnologia', '¿Qué empresa creó Photoshop?',
 '["Microsoft","Adobe","Corel","Autodesk"]', 1,
 'Adobe lanzó Photoshop en 1990. Es el estándar de la industria para edición de imágenes raster.',
 'easy'),

('tecnologia', '¿Quién fundó Amazon?',
 '["Jeff Bezos","Larry Ellison","Mark Cuban","Peter Thiel"]', 0,
 'Jeff Bezos fundó Amazon en 1994 en Seattle, inicialmente como librería online. Cedió el CEO a Andy Jassy en 2021.',
 'easy'),

('tecnologia', '¿Qué tecnología usa el blockchain?',
 '["Centralización","Cifrado simétrico","Cadena de bloques distribuida","Tokens FAT"]', 2,
 'Blockchain es un registro distribuido de bloques enlazados criptográficamente. Es la base de Bitcoin y muchas criptomonedas.',
 'medium'),

('tecnologia', '¿Qué empresa creó WhatsApp?',
 '["Meta (Facebook)","WhatsApp Inc.","Google","Twitter"]', 1,
 'WhatsApp Inc. fue fundada en 2009 por Jan Koum y Brian Acton. Facebook (ahora Meta) la compró en 2014 por 19.000 M$.',
 'medium'),

('tecnologia', '¿Qué año se lanzó Windows 95?',
 '["1991","1993","1995","1998"]', 2,
 'Microsoft lanzó Windows 95 el 24 de agosto de 1995. Introdujo el menú Inicio y revolucionó el escritorio.',
 'medium'),

('tecnologia', '¿Qué empresa creó el motor de búsqueda DuckDuckGo?',
 '["DuckDuckGo Inc.","Google","Microsoft","Yahoo"]', 0,
 'DuckDuckGo fue fundado por Gabriel Weinberg en 2008. Se diferencia por no rastrear las búsquedas de los usuarios.',
 'hard'),

('tecnologia', '¿Qué protocolo usa la mayoría de webs modernas?',
 '["HTTP","HTTPS","FTP","SSH"]', 1,
 'HTTPS (HTTP sobre TLS) cifra el tráfico. Desde 2018 la mayoría de webs lo usan; navegadores avisan si una web es solo HTTP.',
 'easy'),

('tecnologia', '¿Qué empresa creó el lenguaje Swift?',
 '["Google","Apple","Microsoft","Oracle"]', 1,
 'Apple presentó Swift en 2014, en la WWDC. Reemplazó progresivamente a Objective-C en el desarrollo iOS/macOS.',
 'medium'),

('tecnologia', '¿En qué año se fundó YouTube?',
 '["2003","2005","2007","2009"]', 1,
 'YouTube fue fundado por Chad Hurley, Steve Chen y Jawed Karim en febrero de 2005. Google lo compró en 2006 por 1.650 M$.',
 'medium'),

('tecnologia', '¿Qué se mide en MHz/GHz en un procesador?',
 '["Memoria","Frecuencia de reloj","Voltaje","Tamaño"]', 1,
 'La frecuencia de reloj indica los ciclos por segundo (1 GHz = 1.000 millones). Junto al IPC, determina el rendimiento.',
 'medium'),

('tecnologia', '¿Qué red TCP/IP precedió al Internet moderno?',
 '["BBS","Usenet","ARPANET","Intranet"]', 2,
 'ARPANET fue desarrollada por DARPA (EE.UU.) desde 1969. Conectó las primeras universidades y derivó en Internet en los 80.',
 'hard'),

('tecnologia', '¿Qué empresa creó la consola PlayStation?',
 '["Nintendo","Sony","Microsoft","Sega"]', 1,
 'Sony lanzó la primera PlayStation en 1994. Originalmente era un proyecto conjunto con Nintendo que se rompió.',
 'easy'),

('tecnologia', '¿Qué empresa adquirió ARM en 2020 (operación finalmente cancelada)?',
 '["Apple","NVIDIA","Qualcomm","Samsung"]', 1,
 'NVIDIA anunció en 2020 la compra de ARM por 40.000 M$. La operación se canceló en 2022 por trabas regulatorias.',
 'hard'),

('tecnologia', '¿Qué lenguaje creó Dennis Ritchie en los 70?',
 '["B","C","Pascal","Fortran"]', 1,
 'Dennis Ritchie creó C en Bell Labs en 1972. Es uno de los lenguajes más influyentes; padre de C++, C#, Objective-C, etc.',
 'medium'),

('tecnologia', '¿Qué empresa creó Slack?',
 '["Slack Technologies","Microsoft","Atlassian","Google"]', 0,
 'Slack fue fundada por Stewart Butterfield en 2013. Salesforce la compró en 2021 por 27.700 M$.',
 'medium'),

('tecnologia', '¿Qué proyecto buscaba mapear todos los genes humanos?',
 '["Proyecto Genoma Humano","Apollo","Mars","CRISPR"]', 0,
 'El Proyecto Genoma Humano (1990-2003) secuenció los ~3.000 millones de pares de bases del ADN humano.',
 'medium'),

('tecnologia', '¿Qué empresa creó el motor gráfico Unreal Engine?',
 '["Unity Technologies","Epic Games","Valve","Crytek"]', 1,
 'Epic Games desarrolla Unreal Engine desde 1998. La versión 5 (2022) lidera la industria en realismo gráfico.',
 'medium'),

-- ══════════════════════════════════════════════════════════════
-- MITOLOGÍA (50)
-- ══════════════════════════════════════════════════════════════

('mitologia', '¿Quién es el rey de los dioses en la mitología griega?',
 '["Apolo","Poseidón","Zeus","Hades"]', 2,
 'Zeus es rey del Olimpo, dios del cielo y el rayo. Su equivalente romano es Júpiter.',
 'easy'),

('mitologia', '¿Cuál es el equivalente romano de Afrodita?',
 '["Diana","Venus","Juno","Minerva"]', 1,
 'Venus es la diosa romana del amor y la belleza, equivalente a Afrodita. El planeta Venus toma su nombre de ella.',
 'easy'),

('mitologia', '¿Quién es el dios del trueno en la mitología nórdica?',
 '["Odín","Thor","Loki","Freyr"]', 1,
 'Thor, hijo de Odín, es el dios del trueno. Su martillo Mjölnir es uno de los símbolos más reconocibles del panteón nórdico.',
 'easy'),

('mitologia', '¿Cuántos dioses olímpicos forman el panteón principal griego?',
 '["10","12","14","16"]', 1,
 'Los Doce Olímpicos: Zeus, Hera, Poseidón, Deméter, Atenea, Apolo, Ártemis, Ares, Afrodita, Hefesto, Hermes y Dioniso o Hestia.',
 'medium'),

('mitologia', '¿Quién es el dios egipcio del sol?',
 '["Anubis","Ra","Osiris","Horus"]', 1,
 'Ra es el dios del sol en el antiguo Egipto. Recorría el cielo durante el día y el inframundo (Duat) por la noche en su barca.',
 'easy'),

('mitologia', '¿Qué héroe griego mató al Minotauro?',
 '["Hércules","Perseo","Teseo","Ulises"]', 2,
 'Teseo entró en el Laberinto de Creta y mató al Minotauro. Salió guiado por el hilo de Ariadna, hija del rey Minos.',
 'medium'),

('mitologia', '¿Cuántos trabajos realizó Hércules?',
 '["10","12","14","15"]', 1,
 'Hércules (Heracles) realizó 12 trabajos impuestos por Euristeo como penitencia. El primero fue matar al león de Nemea.',
 'easy'),

('mitologia', '¿Quién es la madre de Atenea?',
 '["Hera","Metis","Leto","Deméter"]', 1,
 'Atenea nació de la cabeza de Zeus tras devorar este a Metis (Sabiduría), su madre, según la profecía de que pariría dioses poderosos.',
 'hard'),

('mitologia', '¿Qué animal era el favorito de Atenea?',
 '["Águila","Lechuza","Cuervo","Cisne"]', 1,
 'La lechuza simbolizaba a Atenea, diosa de la sabiduría. De ahí la expresión "la lechuza de Minerva".',
 'medium'),

('mitologia', '¿Quién es el dios del inframundo en la mitología griega?',
 '["Zeus","Poseidón","Hades","Hermes"]', 2,
 'Hades gobierna el inframundo. Tiene un perro de tres cabezas llamado Cerbero que custodia la entrada.',
 'easy'),

('mitologia', '¿Quién es el padre de Zeus en la mitología griega?',
 '["Urano","Cronos","Hiperión","Ocean"]', 1,
 'Cronos (titán) es padre de Zeus. Cronos devoraba a sus hijos por temor a ser destronado, pero Rea escondió a Zeus.',
 'medium'),

('mitologia', '¿Qué dios egipcio tiene cabeza de chacal?',
 '["Horus","Anubis","Thot","Set"]', 1,
 'Anubis, dios de la muerte y embalsamamiento, tiene cabeza de chacal. Guiaba las almas al juicio de Osiris.',
 'medium'),

('mitologia', '¿Quién es el dios trickster en la mitología nórdica?',
 '["Loki","Odín","Tyr","Heimdall"]', 0,
 'Loki es el dios del engaño. Hermano adoptivo de Odín, sus travesuras causan el Ragnarök, el fin del mundo nórdico.',
 'easy'),

('mitologia', '¿Qué titanide es la madre de Apolo y Ártemis?',
 '["Leto","Tetis","Rea","Mnemósine"]', 0,
 'Leto, hija de los titanes Ceo y Febe, parió a Apolo y Ártemis en la isla de Delos, tras ser perseguida por Hera.',
 'hard'),

('mitologia', '¿Qué tres diosas se disputaron la manzana de oro?',
 '["Hera, Atenea, Afrodita","Atenea, Ártemis, Afrodita","Hera, Deméter, Hestia","Afrodita, Ártemis, Deméter"]', 0,
 'Eris lanzó la manzana "para la más bella". Hera, Atenea y Afrodita se disputaron, y Paris eligió a Afrodita, desatando la Guerra de Troya.',
 'medium'),

('mitologia', '¿Cuántas Musas hay en la mitología griega?',
 '["7","9","12","15"]', 1,
 'Las 9 Musas son hijas de Zeus y Mnemósine. Cada una protege un arte: Calíope (épica), Erato (lírica), Clío (historia), etc.',
 'medium'),

('mitologia', '¿Qué arma característica usa Poseidón?',
 '["Rayo","Tridente","Espada","Arco"]', 1,
 'Poseidón porta un tridente con el que controla los mares y provoca terremotos. Su equivalente romano es Neptuno.',
 'easy'),

('mitologia', '¿Quién era el mensajero de los dioses griegos?',
 '["Apolo","Hermes","Dioniso","Ares"]', 1,
 'Hermes lleva alas en los pies (sandalias). Es mensajero, dios de los viajeros, comerciantes y ladrones. Su equivalente romano es Mercurio.',
 'medium'),

('mitologia', '¿Qué héroe griego mató a Medusa?',
 '["Heracles","Teseo","Perseo","Aquiles"]', 2,
 'Perseo decapitó a Medusa usando un escudo pulido como espejo. Con su sangre nació el caballo alado Pegaso.',
 'medium'),

('mitologia', '¿Quién es el dios del vino en la mitología griega?',
 '["Apolo","Hermes","Dioniso","Pan"]', 2,
 'Dioniso (Baco en Roma) es el dios del vino, la fiesta y el éxtasis. Sus seguidoras eran las ménades.',
 'easy'),

('mitologia', '¿Qué dios romano corresponde a Ares?',
 '["Mercurio","Plutón","Marte","Vulcano"]', 2,
 'Marte es el equivalente romano de Ares, dios de la guerra. Pero en Roma tenía más prestigio (Romulus era hijo suyo).',
 'medium'),

('mitologia', '¿Cuál es el río del olvido en el inframundo griego?',
 '["Estigia","Aqueronte","Lete","Cocito"]', 2,
 'El Lete es uno de los cinco ríos del Hades. Beber de él causa el olvido total. Los otros: Estigia, Aqueronte, Cocito y Flegetonte.',
 'hard'),

('mitologia', '¿Quién es el dios egipcio del más allá?',
 '["Ra","Anubis","Osiris","Horus"]', 2,
 'Osiris es señor del más allá. Asesinado por su hermano Set y resucitado por su esposa Isis, juzga las almas tras la muerte.',
 'medium'),

('mitologia', '¿Cómo se llama el caballo alado de la mitología griega?',
 '["Centauro","Pegaso","Quirón","Buchéfalo"]', 1,
 'Pegaso nació de la sangre de Medusa al ser decapitada. Belerofonte lo usó para matar a la Quimera.',
 'easy'),

('mitologia', '¿Qué dios griego es famoso por su rayo?',
 '["Apolo","Zeus","Hefesto","Helios"]', 1,
 'Zeus tiene como arma el rayo, forjado por los cíclopes. Es su símbolo de poder sobre dioses y mortales.',
 'easy'),

('mitologia', '¿Qué animal traidoramente eligió Eva en el Edén?',
 '["León","Águila","Serpiente","Pez"]', 2,
 'En el Génesis, la serpiente tienta a Eva a comer del Árbol del Conocimiento. Es interpretada como Satanás en tradiciones posteriores.',
 'easy'),

('mitologia', '¿Cuál es el reino de los dioses en la mitología nórdica?',
 '["Midgard","Asgard","Helheim","Vanaheim"]', 1,
 'Asgard es el reino de los Æsir (dioses) en el cosmos nórdico de los 9 mundos. Está conectado a Midgard por el puente Bifröst.',
 'medium'),

('mitologia', '¿Quién es el dios de las hierreras en la mitología griega?',
 '["Apolo","Hefesto","Hermes","Pan"]', 1,
 'Hefesto, dios del fuego y la metalurgia, forja las armas de los dioses. Era cojo y casado con Afrodita, que lo engañaba con Ares.',
 'medium'),

('mitologia', '¿Cómo se llama la isla donde fue desterrado Odiseo en la Odisea?',
 '["Ítaca","Ogigia","Creta","Esciros"]', 1,
 'Calipso retuvo a Odiseo en Ogigia durante 7 años. Tras intervención divina, lo dejó marchar hacia Ítaca.',
 'hard'),

('mitologia', '¿Quién es Aquiles?',
 '["Rey de Troya","Héroe griego en Troya","Dios del fuego","Hijo de Zeus"]', 1,
 'Aquiles, héroe griego, semidiós (hijo de Tetis). Su único punto débil era el talón, por donde lo sostenía su madre al sumergirlo en la Estigia.',
 'easy'),

('mitologia', '¿Qué animal era la Quimera en la mitología griega?',
 '["Mitad humano, mitad caballo","León, cabra y serpiente","Mujer con alas","Toro con cuerpo humano"]', 1,
 'La Quimera tenía cabeza de león, cuerpo de cabra y cola de serpiente. Belerofonte la mató con la ayuda de Pegaso.',
 'medium'),

('mitologia', '¿Qué dios egipcio tiene cabeza de halcón?',
 '["Anubis","Thot","Horus","Set"]', 2,
 'Horus es el dios celestial con cabeza de halcón. Hijo de Osiris e Isis, venga la muerte de su padre contra Set.',
 'medium'),

('mitologia', '¿Cuál es el martillo de Thor?',
 '["Gungnir","Mjölnir","Skofnung","Tyrfing"]', 1,
 'Mjölnir es el martillo de Thor, forjado por los enanos Sindri y Brokkr. Vuelve siempre a su mano y puede aplastar montañas.',
 'easy'),

('mitologia', '¿Qué semidiós griego era hijo de Zeus y Alcmena?',
 '["Perseo","Heracles","Belerofonte","Aquiles"]', 1,
 'Heracles (Hércules en Roma) era hijo de Zeus y la mortal Alcmena. Hera lo persiguió por celos durante toda su vida.',
 'medium'),

('mitologia', '¿Quién creó al hombre con barro según la mitología griega?',
 '["Zeus","Prometeo","Hefesto","Apolo"]', 1,
 'Prometeo modeló a los humanos con barro y les dio el fuego, robándolo a los dioses. Zeus lo castigó encadenándolo al Cáucaso.',
 'medium'),

('mitologia', '¿Cómo se llama el barco de Argo?',
 '["Argo","Pegasus","Esfinge","Náyade"]', 0,
 'El Argo era el barco con el que Jasón y los Argonautas buscaron el Vellocino de Oro. Fue construido por Argos.',
 'hard'),

('mitologia', '¿Quién fue el primer hombre en la mitología cristiana?',
 '["Adán","Caín","Noé","Abraham"]', 0,
 'Según el Génesis, Dios creó a Adán del polvo de la tierra. Eva fue creada después de una costilla suya.',
 'easy'),

('mitologia', '¿Qué dios chino representa la guerra?',
 '["Guan Yu","Guan Yin","Sun Wukong","Lao Tse"]', 0,
 'Guan Yu fue un general histórico (Tres Reinos) deificado como dios de la guerra y de los negocios en el taoísmo.',
 'hard'),

('mitologia', '¿Quiénes eran las Erinias o Furias?',
 '["Diosas de la fertilidad","Diosas vengadoras","Musas","Sirenas"]', 1,
 'Las Erinias (Furias en Roma) eran 3 diosas vengadoras de los crímenes, especialmente de los crímenes contra la familia.',
 'hard'),

('mitologia', '¿Qué dios maya/azteca es la serpiente emplumada?',
 '["Tlaloc","Quetzalcóatl","Huitzilopochtli","Tezcatlipoca"]', 1,
 'Quetzalcóatl (azteca) o Kukulkán (maya) es la serpiente emplumada, una de las deidades más importantes de Mesoamérica.',
 'medium'),

('mitologia', '¿En la mitología hindú, quién es el dios destructor?',
 '["Brahma","Vishnú","Shiva","Ganesha"]', 2,
 'Shiva forma con Brahma (creador) y Vishnú (preservador) la trimurti. Es el dios de la destrucción/transformación.',
 'medium'),

('mitologia', '¿Qué famoso lugar buscaban los caballeros del rey Arturo?',
 '["La Atlántida","El Grial","El paraíso","La fuente de la juventud"]', 1,
 'El Santo Grial (la copa de Cristo) era buscado por los caballeros de la Mesa Redonda. Galahad o Perceval lo encuentran según la versión.',
 'medium'),

('mitologia', '¿Quién es el dios principal de los aztecas?',
 '["Tezcatlipoca","Huitzilopochtli","Quetzalcóatl","Tonatiuh"]', 1,
 'Huitzilopochtli, dios de la guerra y del sol, era el patrón de los aztecas. Tenochtitlán fue fundada en el sitio que él indicó.',
 'hard'),

('mitologia', '¿Cuántas cabezas tenía la Hidra de Lerna?',
 '["3","7","9","Crecían dos por cada una cortada"]', 3,
 'La Hidra de Lerna tenía 9 cabezas, y por cada cortada crecían 2. Heracles (con Yolao) las quemó tras cortarlas (2º trabajo).',
 'medium'),

('mitologia', '¿Qué dios romano corresponde a Hermes?',
 '["Vulcano","Mercurio","Júpiter","Neptuno"]', 1,
 'Mercurio es el equivalente romano de Hermes: mensajero de los dioses y patrón de comerciantes y ladrones.',
 'medium'),

('mitologia', '¿Quién es Apolo?',
 '["Dios del trueno","Dios del sol, la música y la profecía","Dios del mar","Dios del inframundo"]', 1,
 'Apolo es uno de los doce olímpicos. Dios del sol, la música, la poesía y los oráculos (especialmente Delfos).',
 'easy'),

('mitologia', '¿Qué es el Ragnarök en la mitología nórdica?',
 '["Una arma","El fin del mundo","Un reino","Un dios"]', 1,
 'El Ragnarök es el fin del mundo nórdico: una batalla en la que mueren la mayoría de los dioses (Odín, Thor, Loki, etc.).',
 'medium'),

('mitologia', '¿Quién fue el primer rey de Roma según la leyenda?',
 '["Tarquinio","Rómulo","Numa Pompilio","Servio Tulio"]', 1,
 'Rómulo, según la leyenda, fundó Roma en 753 a.C. tras matar a su hermano Remo. Sus padres eran Marte y Rea Silvia.',
 'medium'),

('mitologia', '¿En qué consistía el rito del paso del río Estigia?',
 '["Pagar a Caronte","Beber agua","Recitar versos","Mostrar un objeto"]', 0,
 'Las almas debían pagar a Caronte, el barquero, una moneda (óbolo) para cruzar la Estigia. Por eso enterraban a los muertos con monedas.',
 'hard'),

('mitologia', '¿Cuál es el árbol cósmico en la mitología nórdica?',
 '["Igdrasill","Aralia","Mjölnir","Bifröst"]', 0,
 'Yggdrasill (Igdrasill) es el fresno cósmico que conecta los 9 mundos en la mitología nórdica.',
 'hard'),

-- ══════════════════════════════════════════════════════════════
-- ASTRONOMÍA (50)
-- ══════════════════════════════════════════════════════════════

('astronomia', '¿Cuál es el planeta más grande del sistema solar?',
 '["Saturno","Júpiter","Neptuno","Urano"]', 1,
 'Júpiter tiene una masa 318 veces la de la Tierra. Tiene al menos 95 lunas conocidas; Ganímedes es la mayor del sistema solar.',
 'easy'),

('astronomia', '¿Qué galaxia contiene nuestro sistema solar?',
 '["Andrómeda","Vía Láctea","Triángulo","Sombrero"]', 1,
 'La Vía Láctea es una galaxia espiral barrada de unos 100.000 años luz de diámetro. Contiene entre 100.000 y 400.000 M de estrellas.',
 'easy'),

('astronomia', '¿Quién fue el primer humano en pisar la Luna?',
 '["Buzz Aldrin","Neil Armstrong","Yuri Gagarin","Michael Collins"]', 1,
 'Neil Armstrong pisó la Luna el 20 de julio de 1969 en la misión Apolo 11. Junto a Aldrin permaneció ~21,5 h en la superficie.',
 'easy'),

('astronomia', '¿Cuántos planetas tiene el sistema solar (oficialmente)?',
 '["7","8","9","10"]', 1,
 'Desde 2006, Plutón es planeta enano. Quedan 8 planetas oficiales: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno.',
 'easy'),

('astronomia', '¿Qué planeta está más cerca del Sol?',
 '["Venus","Mercurio","Marte","Tierra"]', 1,
 'Mercurio es el más cercano al Sol (~58 M km). Tiene un año de solo 88 días terrestres.',
 'easy'),

('astronomia', '¿A qué velocidad viaja la luz en el vacío?',
 '["200.000 km/s","300.000 km/s","400.000 km/s","150.000 km/s"]', 1,
 'La luz viaja a 299.792.458 m/s en el vacío. Es una constante fundamental ("c") en la teoría de la relatividad.',
 'easy'),

('astronomia', '¿Qué estrella es el centro de nuestro sistema solar?',
 '["Alfa Centauri","Sol","Sirio","Polar"]', 1,
 'El Sol es una estrella enana amarilla (G2V) de ~4.600 millones de años. Contiene el 99,86% de la masa del sistema solar.',
 'easy'),

('astronomia', '¿Cuántas lunas tiene Marte?',
 '["0","1","2","4"]', 2,
 'Marte tiene 2 lunas: Fobos y Deimos. Son pequeñas e irregulares, probablemente asteroides capturados.',
 'medium'),

('astronomia', '¿Cuál es la estrella más cercana al Sol?',
 '["Sirio","Alfa Centauri A","Próxima Centauri","Barnard"]', 2,
 'Próxima Centauri (parte del sistema Alfa Centauri) está a ~4,24 años luz. Es una enana roja.',
 'medium'),

('astronomia', '¿Qué planeta es conocido como el "planeta rojo"?',
 '["Mercurio","Venus","Marte","Júpiter"]', 2,
 'Marte se ve rojizo por el óxido de hierro en su superficie. Los romanos lo asociaron al dios de la guerra.',
 'easy'),

('astronomia', '¿Cuántos años tiene aproximadamente el universo?',
 '["4,5 mil M","13,8 mil M","20 mil M","100 mil M"]', 1,
 'El universo tiene ~13.800 millones de años, según mediciones del fondo cósmico de microondas (CMB).',
 'medium'),

('astronomia', '¿Qué tipo de objeto es un agujero negro?',
 '["Estrella muerta","Región con gravedad extrema","Galaxia oscura","Antimaterial"]', 1,
 'Un agujero negro es una región del espacio-tiempo con gravedad tan intensa que ni la luz escapa. Su frontera es el horizonte de sucesos.',
 'medium'),

('astronomia', '¿Quién propuso el modelo heliocéntrico?',
 '["Galileo","Newton","Copérnico","Kepler"]', 2,
 'Nicolás Copérnico publicó "De revolutionibus orbium coelestium" en 1543. Sitúa el Sol (no la Tierra) en el centro del sistema.',
 'medium'),

('astronomia', '¿Qué planeta tiene los anillos más visibles?',
 '["Júpiter","Saturno","Urano","Neptuno"]', 1,
 'Saturno tiene los anillos más visibles, formados por miles de millones de partículas de hielo y roca. Todos los gigantes gaseosos tienen anillos.',
 'easy'),

('astronomia', '¿Cuánto tarda la Tierra en girar sobre sí misma?',
 '["12 h","24 h","36 h","48 h"]', 1,
 'La Tierra completa una rotación en ~24 h (día solar). El día sidéreo es de 23 h 56 min 4 s.',
 'easy'),

('astronomia', '¿Cuánto tarda la luz del Sol en llegar a la Tierra?',
 '["8 segundos","8 minutos","1 hora","1 día"]', 1,
 'La luz solar tarda ~8 minutos y 20 segundos en recorrer los 150 M km al promedio entre Sol y Tierra (1 UA).',
 'medium'),

('astronomia', '¿Cuál es la "Gran Mancha Roja" de Júpiter?',
 '["Un volcán","Una tormenta","Un asteroide","Una mancha solar"]', 1,
 'La Gran Mancha Roja es una tormenta anticiclónica gigante en Júpiter, observada desde hace al menos 350 años. Está disminuyendo de tamaño.',
 'medium'),

('astronomia', '¿Qué constelación contiene la Estrella Polar?',
 '["Osa Mayor","Osa Menor","Casiopea","Orión"]', 1,
 'La Estrella Polar (Polaris) está en la Osa Menor. Marca aproximadamente el polo norte celeste.',
 'medium'),

('astronomia', '¿Cuál es el planeta más caliente del sistema solar?',
 '["Mercurio","Venus","Tierra","Marte"]', 1,
 'Venus tiene temperaturas superficiales de ~470 °C, más calientes que Mercurio. Su densa atmósfera de CO₂ atrapa el calor (efecto invernadero extremo).',
 'medium'),

('astronomia', '¿Cómo se llama la galaxia más cercana a la Vía Láctea?',
 '["Andrómeda","Triángulo","Magallanes","Sombrero"]', 0,
 'Andrómeda (M31) es la galaxia espiral más cercana, a 2,5 millones de años luz. Chocará con la Vía Láctea en ~4.500 M de años.',
 'medium'),

('astronomia', '¿Qué telescopio espacial sustituyó al Hubble?',
 '["James Webb","Spitzer","Kepler","Chandra"]', 0,
 'El James Webb Space Telescope se lanzó en 2021. Observa principalmente en infrarrojo, complementando (no sustituyendo) al Hubble.',
 'easy'),

('astronomia', '¿Cuál es la unidad usada para distancias entre estrellas?',
 '["Kilómetro","UA","Año luz","Megámetro"]', 2,
 'El año luz es la distancia que recorre la luz en un año: ~9,46 billones de km. También se usa el parsec (3,26 años luz).',
 'easy'),

('astronomia', '¿Qué nombre recibe la teoría del origen del universo?',
 '["Estado estacionario","Big Bang","Universo cíclico","Big Bounce"]', 1,
 'El Big Bang (gran explosión) propone que el universo se expandió desde un estado denso y caliente hace ~13.800 M de años.',
 'easy'),

('astronomia', '¿Cómo se llaman las estrellas fugaces?',
 '["Meteoros","Cometas","Asteroides","Supernovas"]', 0,
 'Los meteoros son trazos luminosos de pequeños cuerpos que se queman al entrar en la atmósfera. Si sobreviven al impacto, son meteoritos.',
 'medium'),

('astronomia', '¿Qué nave de la NASA llegó a Plutón en 2015?',
 '["Voyager 1","Pioneer 10","New Horizons","Cassini"]', 2,
 'New Horizons sobrevoló Plutón el 14 de julio de 2015, enviando las primeras imágenes detalladas de este mundo helado.',
 'hard'),

('astronomia', '¿Qué fase tiene la Luna cuando no se ve desde la Tierra?',
 '["Llena","Nueva","Cuarto creciente","Cuarto menguante"]', 1,
 'En luna nueva, el lado iluminado mira al Sol y no vemos el lado nocturno de la Luna. Es cuando ocurren eclipses solares.',
 'easy'),

('astronomia', '¿Cuántas lunas tiene la Tierra?',
 '["1","2","3","0"]', 0,
 'La Tierra tiene una sola luna natural permanente. Ocasionalmente captura asteroides pequeños temporalmente ("miniluna").',
 'easy'),

('astronomia', '¿Quién formuló las tres leyes del movimiento planetario?',
 '["Copérnico","Galileo","Kepler","Newton"]', 2,
 'Johannes Kepler publicó sus 3 leyes entre 1609 y 1619, basándose en datos de Tycho Brahe. Describen las órbitas elípticas.',
 'medium'),

('astronomia', '¿Cuál es el satélite natural más grande del sistema solar?',
 '["La Luna","Titán","Ganímedes","Europa"]', 2,
 'Ganímedes (luna de Júpiter) es el satélite más grande, más grande incluso que Mercurio. Tiene 5.268 km de diámetro.',
 'hard'),

('astronomia', '¿Qué tipo de estrella es el Sol?',
 '["Enana roja","Enana amarilla","Gigante azul","Enana blanca"]', 1,
 'El Sol es una enana amarilla de clase G2V, en la secuencia principal. Le quedan unos 5.000 millones de años antes de convertirse en gigante roja.',
 'medium'),

('astronomia', '¿Qué planeta gira de lado?',
 '["Júpiter","Saturno","Urano","Neptuno"]', 2,
 'Urano gira con su eje inclinado 98°. Posiblemente fue golpeado por un objeto del tamaño de la Tierra hace miles de M de años.',
 'medium'),

('astronomia', '¿Qué nombre recibe la atmósfera estelar visible durante un eclipse?',
 '["Cromosfera","Fotosfera","Corona","Heliosfera"]', 2,
 'La corona solar es la atmósfera externa del Sol, visible durante un eclipse total. Su temperatura supera 1 M de K.',
 'hard'),

('astronomia', '¿Quién descubrió el principio de la gravitación universal?',
 '["Galileo","Newton","Einstein","Kepler"]', 1,
 'Isaac Newton publicó la ley de gravitación universal en "Principia" (1687). Cualquier par de masas se atrae con F=Gm₁m₂/r².',
 'easy'),

('astronomia', '¿Qué fenómeno ocurre cuando la Luna se interpone entre el Sol y la Tierra?',
 '["Eclipse lunar","Eclipse solar","Tránsito","Alineación"]', 1,
 'En un eclipse solar, la Luna proyecta sombra sobre la Tierra. Solo se ve totalmente desde la zona de umbra (estrecha franja).',
 'easy'),

('astronomia', '¿En qué año aterrizó el Apolo 11 en la Luna?',
 '["1965","1967","1969","1972"]', 2,
 'Apolo 11 alunizó el 20 de julio de 1969. Hubo 6 misiones tripuladas con éxito (Apolo 11, 12, 14, 15, 16 y 17).',
 'easy'),

('astronomia', '¿Cuál es el planeta más lejano (ya no contando a Plutón)?',
 '["Saturno","Urano","Neptuno","Plutón"]', 2,
 'Neptuno es el planeta más lejano del Sol (~4.500 M km). Plutón es un planeta enano desde 2006.',
 'medium'),

('astronomia', '¿Qué es un púlsar?',
 '["Una estrella variable","Una estrella de neutrones que emite pulsos","Un quásar","Un agujero negro"]', 1,
 'Un púlsar es una estrella de neutrones rotante que emite haces de radiación electromagnética. Descubiertos por Jocelyn Bell en 1967.',
 'hard'),

('astronomia', '¿Qué telescopio descubrió Hubble miles de galaxias?',
 '["James Webb","Hubble","Spitzer","Kepler"]', 1,
 'El Hubble (lanzado en 1990) ha revolucionado la astronomía: midió la expansión del universo, observó galaxias remotas y refinó la edad del cosmos.',
 'easy'),

('astronomia', '¿Cuál es el diámetro aproximado del Sol?',
 '["100.000 km","700.000 km","1,4 M km","10 M km"]', 2,
 'El Sol tiene ~1.392.000 km de diámetro, unas 109 veces el de la Tierra. Contiene el 99,86% de la masa del sistema solar.',
 'medium'),

('astronomia', '¿Qué nombre se da a una explosión estelar masiva?',
 '["Nova","Supernova","Quásar","Magnetar"]', 1,
 'Una supernova es la explosión de una estrella masiva al final de su vida. Brilla como una galaxia entera durante semanas.',
 'medium'),

('astronomia', '¿Cuál es la distancia Tierra-Luna media?',
 '["100.000 km","384.000 km","1 M km","10 M km"]', 1,
 'La Luna está a 384.400 km de media. La distancia varía un poco por su órbita elíptica (perigeo y apogeo).',
 'medium'),

('astronomia', '¿Qué famoso cometa volverá a verse en 2061?',
 '["Hale-Bopp","Halley","NEOWISE","Encke"]', 1,
 'El cometa Halley pasa cerca de la Tierra cada 75-76 años. Última vez en 1986, próxima visita en 2061.',
 'medium'),

('astronomia', '¿Cuál es la temperatura aproximada de la superficie del Sol?',
 '["1.000 °C","6.000 °C","100.000 °C","1 M °C"]', 1,
 'La fotosfera del Sol está a ~5.500 °C. La corona, paradójicamente, es mucho más caliente (>1 M °C).',
 'medium'),

('astronomia', '¿Qué fenómeno explica que las galaxias se alejen entre sí?',
 '["Inercia","Expansión del universo","Atracción gravitacional","Antigravedad"]', 1,
 'La expansión del universo, descubierta por Hubble en 1929. La distancia entre galaxias aumenta; la mide la constante de Hubble.',
 'medium'),

('astronomia', '¿Qué es la energía oscura?',
 '["Materia invisible","Una fuerza que acelera la expansión","Un agujero negro","Antimateria"]', 1,
 'La energía oscura representa el ~68% del universo y se cree que causa su expansión acelerada, descubierta en 1998.',
 'hard'),

('astronomia', '¿En qué constelación está la nebulosa de Orión?',
 '["Toro","Orión","Casiopea","Cisne"]', 1,
 'La nebulosa de Orión (M42) está visible a simple vista en la "espada" de Orión. Es una región de formación estelar.',
 'medium'),

('astronomia', '¿Quién descubrió las cuatro lunas mayores de Júpiter?',
 '["Newton","Galileo","Kepler","Copérnico"]', 1,
 'Galileo descubrió Ío, Europa, Ganímedes y Calisto en 1610 con su telescopio. Se llaman "lunas galileanas" en su honor.',
 'medium'),

('astronomia', '¿Qué color tiene la luz de las estrellas más calientes?',
 '["Roja","Amarilla","Blanca","Azul"]', 3,
 'Las estrellas más calientes son azules (decenas de miles de K). El orden de temperatura: rojas, naranjas, amarillas, blancas y azules.',
 'medium'),

('astronomia', '¿Qué planeta tiene un día más largo que su año?',
 '["Mercurio","Venus","Marte","Júpiter"]', 1,
 'Venus rota muy lento: un día solar dura 117 días terrestres, mientras su año son 225 días. Además rota en sentido contrario al resto.',
 'hard'),

('astronomia', '¿En qué año se lanzó el Sputnik 1, primer satélite artificial?',
 '["1947","1957","1961","1969"]', 1,
 'La URSS lanzó el Sputnik 1 el 4 de octubre de 1957, inaugurando la era espacial y la carrera espacial con EE.UU.',
 'medium');
