-- ─────────────────────────────────────────────────────────────
-- Fix EN: 12 preguntas activas que no casaron con los seeds
-- (variantes en BD con distinto orden/distractores o no presentes en seeds).
-- Keyed por id (a prueba de comillas y orden). Traducción en el MISMO orden
-- de opciones que la fila → answer_index intacto, respuesta correcta preservada.
-- Ejecutar DESPUÉS de i18n_en.sql y questions_en.sql.
-- ─────────────────────────────────────────────────────────────

begin;

-- arte · «La noche estrellada» / movimiento · a=3 (Posimpresionismo)
update public.questions set
  question_en = $t$Which movement does Van Gogh's 'The Starry Night' belong to?$t$,
  options_en  = $t$["Impressionism","Expressionism","Surrealism","Post-Impressionism"]$t$::jsonb,
  context_en  = $t$Van Gogh belongs to Post-Impressionism. 'The Starry Night' (1889) was painted while he was in the Saint-Paul-de-Mausole asylum.$t$
where id = '4c06d8e5-7db6-476b-94b8-8f12bf26cb5a';

-- arte · Taj Mahal · a=1 (India)
update public.questions set
  question_en = $t$In which country is the Taj Mahal?$t$,
  options_en  = $t$["Pakistan","India","Turkey","Persia"]$t$::jsonb,
  context_en  = $t$The Taj Mahal is in Agra, India. It was built by the Mughal emperor Shah Jahan (1632-1653) in memory of his wife Mumtaz Mahal.$t$
where id = 'a1a169e9-a360-4b8f-95db-8493a997683f';

-- biologia · delfín · a=1 (Mamífero)
update public.questions set
  question_en = $t$What type of animal is the dolphin?$t$,
  options_en  = $t$["Fish","Mammal","Amphibian","Reptile"]$t$::jsonb,
  context_en  = $t$Dolphins are marine mammals of the cetacean family. They breathe air through their blowhole.$t$
where id = 'bdf003e1-2e49-4a3e-badf-eae178027923';

-- cine · Joker (2019) · a=1 (Joaquin Phoenix) · nombres = ES
update public.questions set
  question_en = $t$Who stars in 'Joker' (2019)?$t$,
  options_en  = $t$["Heath Ledger","Joaquin Phoenix","Jared Leto","Cillian Murphy"]$t$::jsonb,
  context_en  = $t$Joaquin Phoenix played Arthur Fleck/Joker in 'Joker' (2019) by Todd Phillips. Oscar for Best Actor.$t$
where id = '4c259b85-38fc-44d6-8238-496134f59fbb';

-- filosofia · El mundo como voluntad y representación · a=2 (Schopenhauer) · nombres = ES
update public.questions set
  question_en = $t$Which philosopher wrote 'The World as Will and Representation'?$t$,
  options_en  = $t$["Kant","Hegel","Schopenhauer","Nietzsche"]$t$::jsonb,
  context_en  = $t$Schopenhauer published this work in 1818, arguing that the blind 'will' drives all existence. It influenced Nietzsche and Wagner.$t$
where id = 'bd4d562d-5f46-47d2-9867-06426cd7d601';

-- geografia · Gran Muralla China · a=1 (Norte de China)
update public.questions set
  question_en = $t$Where is the Great Wall of China located?$t$,
  options_en  = $t$["Only in Beijing","Northern China","Eastern coast of China","Throughout the country"]$t$::jsonb,
  context_en  = $t$The Great Wall runs across northern China for more than 21,000 km. It was built to protect the Empire from invasions from the north.$t$
where id = '5180aa97-d418-4dae-9bd0-90aba2a3e2e4';

-- historia · Holocausto (v1) · a=1
update public.questions set
  question_en = $t$What was the Holocaust?$t$,
  options_en  = $t$["A WWII battle","The systematic genocide of Jews and other groups by the Nazis","An epidemic in Europe","The destruction of Dresden"]$t$::jsonb,
  context_en  = $t$The Holocaust was the systematic genocide of 6 million Jews and millions of others by the Nazi regime between 1941 and 1945.$t$
where id = '06fe5702-4950-4e94-a29b-6f614ef3a4c7';

-- historia · Holocausto (v2) · a=1
update public.questions set
  question_en = $t$What was the Holocaust?$t$,
  options_en  = $t$["The final battle of WWII","The systematic genocide of 6 million Jews and millions more by the Nazis","The destruction of Dresden","The Allied bombings of Germany"]$t$::jsonb,
  context_en  = $t$The Holocaust was the systematic extermination of Jews, Roma, homosexuals and other groups by the Nazi regime. Extermination camps such as Auschwitz are its symbol.$t$
where id = '8291e9c0-69f9-4164-92c5-2d958d938a42';

-- historia · Cleopatra (v1) · a=1
update public.questions set
  question_en = $t$Who was Cleopatra?$t$,
  options_en  = $t$["The first female pharaoh of Egypt","The last active queen of Ancient Egypt, ally of Caesar and Mark Antony","A priestess of the temple of Isis","A Macedonian princess who ruled Egypt"]$t$::jsonb,
  context_en  = $t$Cleopatra VII (69-30 BC) was the last active queen of Ancient Egypt. She spoke 9 languages and had children with Julius Caesar and Mark Antony. She took her own life after the defeat by Augustus.$t$
where id = '32f3ca6f-4718-44bf-9eaf-6469536886ad';

-- historia · Cleopatra (v2) · a=0
update public.questions set
  question_en = $t$Who was Cleopatra?$t$,
  options_en  = $t$["Queen of Egypt","Roman empress","Greek princess","Pharaoh of Nubia"]$t$::jsonb,
  context_en  = $t$Cleopatra VII was the last active queen of Ancient Egypt (69-30 BC). She had romances with Julius Caesar and Mark Antony. She spoke 9 languages.$t$
where id = '22d070a5-12e5-43a6-bf8d-90b1b2b5576e';

-- literatura · Madame Bovary · a=1 (Flaubert) · nombres = ES
update public.questions set
  question_en = $t$Who wrote 'Madame Bovary'?$t$,
  options_en  = $t$["Stendhal","Flaubert","Balzac","Hugo"]$t$::jsonb,
  context_en  = $t$Gustave Flaubert published 'Madame Bovary' in 1856-1857. A pioneer of French realism.$t$
where id = '5fe70666-f7c2-4359-9c45-2776add9c7b7';

-- musica · teclas piano · a=1 (88) · números = ES
update public.questions set
  question_en = $t$How many keys does a standard piano have?$t$,
  options_en  = $t$["76","88","96","100"]$t$::jsonb,
  context_en  = $t$A standard piano has 88 keys: 52 white and 36 black.$t$
where id = 'e112a5c8-6c26-4375-97d0-09a5204d3b47';

commit;

-- Cobertura tras aplicar: debe dar 0
select count(*) as missing_en from public.questions
  where active and (question_en is null or options_en is null);
