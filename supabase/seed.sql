-- ─────────────────────────────────────────────────────────────
-- Seed: initial questions
-- Run AFTER schema.sql
-- ─────────────────────────────────────────────────────────────

insert into public.questions (category, question, options, answer_index, context, difficulty) values

-- HISTORIA
('historia', '¿En qué año terminó la Primera Guerra Mundial?',
 '["1916","1917","1918","1919"]', 2,
 'La Primera Guerra Mundial terminó el 11 de noviembre de 1918, cuando se firmó el Armisticio de Compiègne. El conflicto causó más de 20 millones de muertos.',
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
 'Machu Picchu fue construida por el Imperio Inca en el siglo XV como residencia del emperador Pachacútec, a 2.430 m de altitud en los Andes peruanos.',
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
 'George Washington fue el primer presidente de EE.UU. (1789-1797). Fue líder militar durante la Revolución Americana y es conocido como el «Padre de la Patria».',
 'easy'),

-- GEOGRAFÍA
('geografia', '¿Cuál es el río más largo del mundo?',
 '["Amazonas","Nilo","Yangtsé","Misisipi"]', 1,
 'El Nilo, con ~6.650 km, es considerado el río más largo, aunque hay debate con el Amazonas. Atraviesa 11 países africanos hasta desembocar en el Mediterráneo.',
 'easy'),

('geografia', '¿En qué país se encuentra la Torre Eiffel?',
 '["Bélgica","Suiza","Francia","Italia"]', 2,
 'La Torre Eiffel está en París, Francia. Fue construida por Gustave Eiffel para la Exposición Universal de 1889 y mide 330 m de altura.',
 'easy'),

('geografia', '¿Cuál es el país más grande del mundo por superficie?',
 '["China","Canadá","Estados Unidos","Rusia"]', 3,
 'Rusia es el país más grande, con 17,1 millones de km². Abarca 11 husos horarios y representa el 11% de la superficie terrestre.',
 'easy'),

('geografia', '¿Dónde se encuentra la Gran Muralla China?',
 '["Solo en Beijing","Norte de China","Costa este de China","Por todo el país"]', 1,
 'La Gran Muralla recorre el norte de China durante más de 21.000 km. Fue construida para proteger el Imperio de las invasiones del norte.',
 'medium'),

('geografia', '¿Cuál es la capital de Australia?',
 '["Sídney","Melbourne","Canberra","Brisbane"]', 2,
 'Canberra es la capital de Australia desde 1913, diseñada expresamente para resolver la rivalidad entre Sídney y Melbourne.',
 'medium'),

('geografia', '¿Qué océano es el más grande del mundo?',
 '["Atlántico","Índico","Ártico","Pacífico"]', 3,
 'El Océano Pacífico es el más grande y profundo, cubriendo más del 30% de la superficie terrestre. Su punto más profundo es la Fosa de las Marianas.',
 'easy'),

-- CIENCIA
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
 'Darwin publicó «El origen de las especies» en 1859. Alfred Wallace llegó a conclusiones similares en paralelo, lo que aceleró la publicación de Darwin.',
 'easy'),

('ciencia', '¿De qué está hecho el diamante?',
 '["Silicio","Carbono","Cuarzo","Cristal de roca"]', 1,
 'El diamante es carbono puro en estructura cúbica formada a alta presión. Es el material natural más duro (10 en la escala de Mohs).',
 'medium'),

('ciencia', '¿Cuántos huesos tiene el cuerpo humano adulto?',
 '["186","206","226","246"]', 1,
 'El adulto tiene 206 huesos. Al nacer tenemos ~300, que se fusionan al crecer. El más pequeño es el estribo (oído) y el más largo el fémur.',
 'medium'),

('ciencia', '¿Cuál es el planeta más grande del sistema solar?',
 '["Saturno","Urano","Júpiter","Neptuno"]', 2,
 'Júpiter es el planeta más grande: su masa es 2,5 veces la suma de todos los demás planetas. Tiene al menos 95 lunas conocidas.',
 'easy'),

-- ARTE
('arte', '¿Quién pintó La Gioconda (Mona Lisa)?',
 '["Miguel Ángel","Rafael","Leonardo da Vinci","Botticelli"]', 2,
 'Leonardo da Vinci pintó La Gioconda entre 1503 y 1519. Es la obra más famosa del mundo, conservada en el Louvre de París.',
 'easy'),

('arte', '¿En qué movimiento se enmarca «La noche estrellada» de Van Gogh?',
 '["Impresionismo","Expresionismo","Surrealismo","Posimpresionismo"]', 3,
 'Van Gogh pertenece al Posimpresionismo. «La noche estrellada» (1889) fue pintada mientras estaba en el manicomio de Saint-Paul-de-Mausole.',
 'medium'),

('arte', '¿Quién esculpió «El David»?',
 '["Leonardo da Vinci","Donatello","Miguel Ángel","Rafael"]', 2,
 'Miguel Ángel esculpió El David entre 1501 y 1504, con 26 años. Mide 5,17 m y está tallada en un único bloque de mármol de Carrara.',
 'easy'),

('arte', '¿En qué país está el Taj Mahal?',
 '["Pakistán","India","Turquía","Persia"]', 1,
 'El Taj Mahal está en Agra, India. Lo construyó el emperador mogol Shah Jahan (1632-1653) en memoria de su esposa Mumtaz Mahal.',
 'easy'),

('arte', '¿En qué ciudad está el Museo del Prado?',
 '["Barcelona","Sevilla","Valencia","Madrid"]', 3,
 'El Prado está en Madrid y es uno de los museos más importantes del mundo, con obras de Velázquez, Goya, El Greco y Rubens. Inaugurado en 1819.',
 'easy'),

-- FILOSOFÍA
('filosofia', '¿Quién dijo «Solo sé que no sé nada»?',
 '["Platón","Aristóteles","Sócrates","Epicuro"]', 2,
 'Sócrates (469-399 a.C.) es famoso por esta afirmación de humildad intelectual. Lo conocemos a través de los escritos de su discípulo Platón.',
 'easy'),

('filosofia', '¿Qué filósofo escribió «El mundo como voluntad y representación»?',
 '["Kant","Hegel","Schopenhauer","Nietzsche"]', 2,
 'Schopenhauer publicó esta obra en 1818, argumentando que la «voluntad» ciega impulsa toda la existencia. Influyó en Nietzsche y Wagner.',
 'hard'),

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
 'medium');

-- ─── DAILY QUESTION: today ────────────────────────────────────
-- After inserting questions, set today's daily question
-- Replace the UUID with the actual ID from the questions table
-- or use this query to set a random one:
--
-- insert into public.daily_questions (question_id, date)
-- select id, current_date from public.questions
-- where active = true order by random() limit 1
-- on conflict (date) do nothing;
