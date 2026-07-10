-- ─────────────────────────────────────────────────────────────
-- Traducciones EN de las preguntas (generado por build-questions-en-sql.mjs)
-- Requiere haber ejecutado antes supabase/i18n_en.sql (columnas *_en).
-- Pegar en el SQL editor de Supabase. Idempotente (UPDATE por texto ES exacto).
-- ─────────────────────────────────────────────────────────────

begin;

-- ── historia (11) ──
update public.questions set
  question_en = $t$In what year did World War I end?$t$,
  options_en  = $t$["1916","1917","1918","1919"]$t$::jsonb,
  context_en  = $t$World War I ended on 11 November 1918 with the signing of the Armistice of Compiègne. The conflict caused more than 20 million deaths.$t$
where category = 'historia' and question = $q$¿En qué año terminó la Primera Guerra Mundial?$q$;

update public.questions set
  question_en = $t$Who was the first emperor of Rome?$t$,
  options_en  = $t$["Julius Caesar","Augustus","Nero","Tiberius"]$t$::jsonb,
  context_en  = $t$Augustus (Octavian) was the first Roman emperor, ruling from 27 BC to AD 14. Julius Caesar was never officially 'emperor'.$t$
where category = 'historia' and question = $q$¿Quién fue el primer emperador de Roma?$q$;

update public.questions set
  question_en = $t$In what year did the Berlin Wall fall?$t$,
  options_en  = $t$["1987","1988","1989","1991"]$t$::jsonb,
  context_en  = $t$The Berlin Wall fell on 9 November 1989, a symbol of the end of the Cold War and the start of German reunification.$t$
where category = 'historia' and question = $q$¿En qué año cayó el Muro de Berlín?$q$;

update public.questions set
  question_en = $t$Which civilization built Machu Picchu?$t$,
  options_en  = $t$["Aztec","Maya","Inca","Olmec"]$t$::jsonb,
  context_en  = $t$Machu Picchu was built by the Inca Empire in the 15th century as a residence for emperor Pachacútec, at 2,430 m of altitude.$t$
where category = 'historia' and question = $q$¿Qué civilización construyó Machu Picchu?$q$;

update public.questions set
  question_en = $t$In what year did Christopher Columbus reach America?$t$,
  options_en  = $t$["1490","1492","1498","1502"]$t$::jsonb,
  context_en  = $t$On 12 October 1492, Columbus reached Guanahaní (Bahamas) believing he had reached Asia. It marked the start of the colonial era.$t$
where category = 'historia' and question = $q$¿En qué año llegó Cristóbal Colón a América?$q$;

update public.questions set
  question_en = $t$In what year did World War II end?$t$,
  options_en  = $t$["1943","1944","1945","1946"]$t$::jsonb,
  context_en  = $t$World War II ended in 1945: in Europe on 8 May (V-E Day) and in the Pacific on 2 September, after Japan's surrender.$t$
where category = 'historia' and question = $q$¿En qué año terminó la Segunda Guerra Mundial?$q$;

update public.questions set
  question_en = $t$Who was the first president of the United States?$t$,
  options_en  = $t$["John Adams","Benjamin Franklin","Thomas Jefferson","George Washington"]$t$::jsonb,
  context_en  = $t$George Washington was the first U.S. president (1789-1797). He was the military leader during the American Revolution.$t$
where category = 'historia' and question = $q$¿Quién fue el primer presidente de los Estados Unidos?$q$;

update public.questions set
  question_en = $t$In what year did the French Revolution begin?$t$,
  options_en  = $t$["1785","1787","1789","1791"]$t$::jsonb,
  context_en  = $t$The French Revolution began in 1789 with the storming of the Bastille on 14 July. It proclaimed the ideals of liberty, equality and fraternity.$t$
where category = 'historia' and question = $q$¿En qué año comenzó la Revolución Francesa?$q$;

update public.questions set
  question_en = $t$Who was Napoleon Bonaparte?$t$,
  options_en  = $t$["King of France","Emperor of France","President of France","A general with no political office"]$t$::jsonb,
  context_en  = $t$Napoleon was Emperor of the French (1804-1815). He conquered much of Europe before being defeated at Waterloo.$t$
where category = 'historia' and question = $q$¿Quién fue Napoleón Bonaparte?$q$;

update public.questions set
  question_en = $t$In which battle was Napoleon definitively defeated?$t$,
  options_en  = $t$["Leipzig","Trafalgar","Austerlitz","Waterloo"]$t$::jsonb,
  context_en  = $t$At Waterloo (1815), the allied forces of Wellington and Blücher defeated Napoleon, who was exiled to Saint Helena where he died in 1821.$t$
where category = 'historia' and question = $q$¿En qué batalla fue derrotado definitivamente Napoleón?$q$;

update public.questions set
  question_en = $t$Which empire was known as 'the empire on which the sun never sets'?$t$,
  options_en  = $t$["Roman Empire","Mongol Empire","British Empire","Spanish Empire"]$t$::jsonb,
  context_en  = $t$The British Empire at its peak (19th century) covered 24% of the Earth's land. The phrase was earlier attributed to the Spanish Empire.$t$
where category = 'historia' and question = $q$¿Qué imperio fue conocido como el «Imperio donde nunca se pone el sol»?$q$;


commit;

-- Cobertura tras aplicar:
select count(*) as missing_en from public.questions
  where active and (question_en is null or options_en is null);
