-- ─────────────────────────────────────────────────────────────
-- Traducciones EN de las preguntas (generado por build-questions-en-sql.mjs)
-- Requiere haber ejecutado antes supabase/i18n_en.sql (columnas *_en).
-- Pegar en el SQL editor de Supabase. Idempotente (UPDATE por texto ES exacto).
-- ─────────────────────────────────────────────────────────────

begin;

-- ── historia (146) ──
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

update public.questions set
  question_en = $t$In what year was the Magna Carta signed in England?$t$,
  options_en  = $t$["1150","1215","1265","1320"]$t$::jsonb,
  context_en  = $t$The Magna Carta was signed in 1215 by King John of England, limiting royal power and laying the foundations of modern constitutionalism.$t$
where category = 'historia' and question = $q$¿En qué año se firmó la Carta Magna en Inglaterra?$q$;

update public.questions set
  question_en = $t$Which civilization built the Pyramids of Giza?$t$,
  options_en  = $t$["Sumer","Phoenicia","Ancient Egypt","Nubia"]$t$::jsonb,
  context_en  = $t$The Pyramids of Giza were built by Ancient Egypt, roughly between 2560 and 2490 BC. The Great Pyramid is that of Khufu.$t$
where category = 'historia' and question = $q$¿Qué civilización construyó las pirámides de Guiza?$q$;

update public.questions set
  question_en = $t$Which was the first city in history?$t$,
  options_en  = $t$["Babylon","Uruk","Memphis","Jericho"]$t$::jsonb,
  context_en  = $t$Uruk (in present-day Iraq) is considered the first city in history, with ~50,000 inhabitants around 3200 BC. Birthplace of cuneiform writing.$t$
where category = 'historia' and question = $q$¿Cuál fue la primera ciudad de la historia?$q$;

update public.questions set
  question_en = $t$Which war pitted Athens against Sparta?$t$,
  options_en  = $t$["The Peloponnesian War","The Greco-Persian Wars","The Trojan War","The Corinthian War"]$t$::jsonb,
  context_en  = $t$The Peloponnesian War (431-404 BC) pitted the Delian League (Athens) against the Peloponnesian League (Sparta). Sparta won.$t$
where category = 'historia' and question = $q$¿Qué guerra enfrentó a Atenas y Esparta?$q$;

update public.questions set
  question_en = $t$In what year did the Western Roman Empire fall?$t$,
  options_en  = $t$["376","410","455","476"]$t$::jsonb,
  context_en  = $t$The Western Roman Empire fell in AD 476 when Odoacer deposed the last emperor, Romulus Augustulus.$t$
where category = 'historia' and question = $q$¿En qué año cayó el Imperio Romano de Occidente?$q$;

update public.questions set
  question_en = $t$Who was the conqueror of the Aztec Empire?$t$,
  options_en  = $t$["Francisco Pizarro","Hernán Cortés","Vasco da Gama","Amerigo Vespucci"]$t$::jsonb,
  context_en  = $t$Hernán Cortés conquered the Aztec Empire between 1519-1521, aided by alliances with rival peoples and the smallpox that decimated the population.$t$
where category = 'historia' and question = $q$¿Quién fue el conquistador del Imperio Azteca?$q$;

update public.questions set
  question_en = $t$Which event triggered World War I?$t$,
  options_en  = $t$["The invasion of Poland","The assassination of Archduke Franz Ferdinand","A European general strike","The sinking of the Lusitania"]$t$::jsonb,
  context_en  = $t$The assassination of Austro-Hungarian archduke Franz Ferdinand in Sarajevo (28 June 1914) triggered the chain of alliances that led to war.$t$
where category = 'historia' and question = $q$¿Qué acontecimiento desencadenó la Primera Guerra Mundial?$q$;

update public.questions set
  question_en = $t$What was the Spanish Inquisition?$t$,
  options_en  = $t$["A religious war","An ecclesiastical tribunal","A political party","An artistic movement"]$t$::jsonb,
  context_en  = $t$The Spanish Inquisition (1478-1834) was an ecclesiastical tribunal created by the Catholic Monarchs to maintain Catholic orthodoxy.$t$
where category = 'historia' and question = $q$¿Qué fue la Inquisición española?$q$;

update public.questions set
  question_en = $t$In what year did the Russian Revolution take place?$t$,
  options_en  = $t$["1905","1914","1917","1921"]$t$::jsonb,
  context_en  = $t$The 1917 Russian Revolution had two phases: the February Revolution (fall of the tsar) and October (the Bolshevik seizure of power).$t$
where category = 'historia' and question = $q$¿En qué año se produjo la Revolución Rusa?$q$;

update public.questions set
  question_en = $t$Who was Adolf Hitler?$t$,
  options_en  = $t$["President of Germany","Chancellor and Führer of Germany","A German army general","King of Prussia"]$t$::jsonb,
  context_en  = $t$Hitler was chancellor from 1933 and proclaimed himself Führer in 1934. He led Nazism, causing the Holocaust and World War II.$t$
where category = 'historia' and question = $q$¿Quién fue Adolf Hitler?$q$;

update public.questions set
  question_en = $t$What was Apartheid?$t$,
  options_en  = $t$["A revolution in South Africa","A system of racial segregation in South Africa","A civil war in Angola","An African political party"]$t$::jsonb,
  context_en  = $t$Apartheid was a regime of racial segregation in South Africa (1948-1991). Nelson Mandela fought against it and was imprisoned for 27 years.$t$
where category = 'historia' and question = $q$¿Qué fue el Apartheid?$q$;

update public.questions set
  question_en = $t$In what year did man reach the Moon?$t$,
  options_en  = $t$["1965","1967","1969","1971"]$t$::jsonb,
  context_en  = $t$On 20 July 1969, Neil Armstrong and Buzz Aldrin (Apollo 11) walked on the Moon. Armstrong was the first, saying 'one small step for man'.$t$
where category = 'historia' and question = $q$¿En qué año llegó el hombre a la Luna?$q$;

update public.questions set
  question_en = $t$Which civil war took place in Spain between 1936 and 1939?$t$,
  options_en  = $t$["The Cuban War","The Morocco War","The Spanish Civil War","The War of Succession"]$t$::jsonb,
  context_en  = $t$The Spanish Civil War (1936-1939) pitted the Republican side against the Nationalist side (Franco). It ended with Franco's dictatorship, which lasted until 1975.$t$
where category = 'historia' and question = $q$¿Qué guerra civil tuvo lugar en España entre 1936 y 1939?$q$;

update public.questions set
  question_en = $t$Who was Marco Polo?$t$,
  options_en  = $t$["A Portuguese navigator","An Italian explorer who traveled to China","A Spanish conquistador","A Dutch cartographer"]$t$::jsonb,
  context_en  = $t$Marco Polo (1254-1324) was a Venetian merchant and explorer who traveled to the court of the Great Khan in China and described his journeys in 'The Travels'.$t$
where category = 'historia' and question = $q$¿Quién fue Marco Polo?$q$;

update public.questions set
  question_en = $t$What was the Spanish Reconquista?$t$,
  options_en  = $t$["The conquest of America","The recovery of Iberian territories occupied by Muslims","The war against Portugal","The union of Castile and Aragon"]$t$::jsonb,
  context_en  = $t$The Reconquista (711-1492) was the process by which the Christian kingdoms recovered the Iberian Peninsula from the Muslims. It ended with the taking of Granada.$t$
where category = 'historia' and question = $q$¿Qué fue la Reconquista española?$q$;

update public.questions set
  question_en = $t$Which was the first country to grant women the vote?$t$,
  options_en  = $t$["United Kingdom","United States","New Zealand","France"]$t$::jsonb,
  context_en  = $t$New Zealand was the first country in the world to grant women's suffrage in 1893. British women got it in 1918 and French women in 1944.$t$
where category = 'historia' and question = $q$¿Cuál fue el primer país en conceder el voto a la mujer?$q$;

update public.questions set
  question_en = $t$Who was Genghis Khan?$t$,
  options_en  = $t$["A Chinese king","The founder of the Mongol Empire","A Persian sultan","A Viking chieftain"]$t$::jsonb,
  context_en  = $t$Genghis Khan (1162-1227) founded the Mongol Empire, the largest contiguous empire in history. He conquered from China to Eastern Europe.$t$
where category = 'historia' and question = $q$¿Quién fue Gengis Kan?$q$;

update public.questions set
  question_en = $t$Which was the largest empire in history?$t$,
  options_en  = $t$["Roman Empire","Mongol Empire","British Empire","Spanish Empire"]$t$::jsonb,
  context_en  = $t$The Mongol Empire (13th century) reached 24 million km², the largest contiguous empire in history. The British Empire was the largest by total area, at 35.5 million km².$t$
where category = 'historia' and question = $q$¿Qué imperio fue el más grande de la historia?$q$;

update public.questions set
  question_en = $t$Who was Julius Caesar?$t$,
  options_en  = $t$["The first Roman emperor","A Roman general and dictator murdered in the Senate","The founder of Rome","A Roman philosopher"]$t$::jsonb,
  context_en  = $t$Julius Caesar was a Roman dictator murdered on 15 March 44 BC (the 'Ides of March'). His great-nephew Augustus became the first emperor.$t$
where category = 'historia' and question = $q$¿Quién fue Julio César?$q$;

update public.questions set
  question_en = $t$What was the Black Death?$t$,
  options_en  = $t$["A medieval war","A bubonic plague epidemic that killed a third of Europe","A volcanic eruption","A widespread famine"]$t$::jsonb,
  context_en  = $t$The Black Death (1347-1353) killed between 30 and 60% of Europe's population, some 25 million people. It was caused by the bacterium Yersinia pestis.$t$
where category = 'historia' and question = $q$¿Qué fue la Peste Negra?$q$;

update public.questions set
  question_en = $t$What was the Hundred Years' War?$t$,
  options_en  = $t$["A war between Rome and Carthage","A conflict between England and France (1337-1453)","The Thirty Years' War","A crusade"]$t$::jsonb,
  context_en  = $t$The Hundred Years' War (1337-1453) pitted England against France over the French throne. Joan of Arc was the French heroine who turned the tide of the war.$t$
where category = 'historia' and question = $q$¿Qué fue la Guerra de los Cien Años?$q$;

update public.questions set
  question_en = $t$Who was Joan of Arc?$t$,
  options_en  = $t$["A queen of France","A French peasant who led armies and was burned as a heretic","An English spy","A saint canonized while alive"]$t$::jsonb,
  context_en  = $t$Joan of Arc (1412-1431) led the French army guided by religious visions. She was captured, tried for heresy and burned alive. Canonized in 1920.$t$
where category = 'historia' and question = $q$¿Quién fue Juana de Arco?$q$;

update public.questions set
  question_en = $t$What was the Renaissance?$t$,
  options_en  = $t$["A political revolution","A cultural and artistic movement that revived classical Greco-Roman culture","A religious reform","An industrial revolution"]$t$::jsonb,
  context_en  = $t$The Renaissance (14th-17th centuries) began in Italy and spread across Europe. It revalued humanism, art and science. Leonardo, Michelangelo and Erasmus are its figures.$t$
where category = 'historia' and question = $q$¿Qué fue el Renacimiento?$q$;

update public.questions set
  question_en = $t$What was the Protestant Reformation?$t$,
  options_en  = $t$["A constitutional reform in Europe","The religious movement started by Luther that split Christianity","The reform of the Catholic Church at the Council of Trent","A peasant revolt"]$t$::jsonb,
  context_en  = $t$Martin Luther began the Reformation in 1517 by publishing his 95 theses. It created Protestantism, dividing European Christianity into Catholics and Protestants.$t$
where category = 'historia' and question = $q$¿Qué fue la Reforma Protestante?$q$;

update public.questions set
  question_en = $t$Who was Martin Luther?$t$,
  options_en  = $t$["A German king","A monk and theologian who started the Protestant Reformation","A reformist pope","A humanist philosopher"]$t$::jsonb,
  context_en  = $t$Martin Luther (1483-1546) was an Augustinian monk who in 1517 published his 95 theses against indulgences. He was excommunicated but protected by German princes.$t$
where category = 'historia' and question = $q$¿Quién fue Martín Lutero?$q$;

update public.questions set
  question_en = $t$What was the Spanish Armada?$t$,
  options_en  = $t$["The English fleet that defeated Spain","The Spanish fleet sent to invade England in 1588, which was defeated","A Roman army","The Portuguese fleet of exploration"]$t$::jsonb,
  context_en  = $t$Philip II sent the Spanish Armada in 1588 to invade England. It was defeated by Drake's English fleet and by storms. It marked Spain's decline.$t$
where category = 'historia' and question = $q$¿Qué fue la Armada Invencible?$q$;

update public.questions set
  question_en = $t$Who was Galileo Galilei?$t$,
  options_en  = $t$["An Italian Renaissance philosopher","An astronomer and physicist who defended heliocentrism","A Renaissance explorer","A doctor who discovered blood circulation"]$t$::jsonb,
  context_en  = $t$Galileo (1564-1642) improved the telescope, observed Jupiter's satellites and supported Copernicus's heliocentrism. He was condemned by the Inquisition.$t$
where category = 'historia' and question = $q$¿Quién fue Galileo Galilei?$q$;

update public.questions set
  question_en = $t$What was the Industrial Revolution?$t$,
  options_en  = $t$["A political revolution in Great Britain","The process of mechanizing production that began in Great Britain in the 18th century","An agrarian revolution in France","A technological revolution in the U.S."]$t$::jsonb,
  context_en  = $t$The Industrial Revolution began in Great Britain around 1760 with Watt's steam engine. It transformed the world economy from agricultural to industrial.$t$
where category = 'historia' and question = $q$¿Qué fue la Revolución Industrial?$q$;

update public.questions set
  question_en = $t$Who invented the movable-type printing press in Europe?$t$,
  options_en  = $t$["Leonardo da Vinci","Johannes Gutenberg","Roger Bacon","William Caxton"]$t$::jsonb,
  context_en  = $t$Gutenberg invented the movable-type printing press in Europe around 1450, printing the Gutenberg Bible. It revolutionized the spread of knowledge.$t$
where category = 'historia' and question = $q$¿Quién inventó la imprenta de tipos móviles en Europa?$q$;

update public.questions set
  question_en = $t$What was the Inquisition?$t$,
  options_en  = $t$["A medieval educational institution","An ecclesiastical tribunal to persecute heresy","A medieval tax","An ecclesiastical council"]$t$::jsonb,
  context_en  = $t$The Inquisition was an ecclesiastical tribunal that persecuted heresy in Europe from the 12th century. The Spanish one (1478-1834) was especially rigorous.$t$
where category = 'historia' and question = $q$¿Qué fue la Inquisición?$q$;

update public.questions set
  question_en = $t$When did the United States become independent?$t$,
  options_en  = $t$["1775","1776","1783","1789"]$t$::jsonb,
  context_en  = $t$The Declaration of Independence was on 4 July 1776. The war ended in 1783 with the Treaty of Paris. The Constitution came into force in 1789.$t$
where category = 'historia' and question = $q$¿Cuándo se independizó Estados Unidos?$q$;

update public.questions set
  question_en = $t$Who was Simón Bolívar?$t$,
  options_en  = $t$["The liberator of Argentina","The hero of Latin American independence who liberated Venezuela, Colombia, Ecuador, Peru and Bolivia","The first president of Mexico","A Napoleonic general"]$t$::jsonb,
  context_en  = $t$Simón Bolívar (1783-1830) led the independence of Venezuela, Colombia, Ecuador, Peru and Bolivia, which bears his name. He is known as 'The Liberator'.$t$
where category = 'historia' and question = $q$¿Quién fue Simón Bolívar?$q$;

update public.questions set
  question_en = $t$What was the Crimean War?$t$,
  options_en  = $t$["A 19th-century war between Russia and Turkey","A World War I war","A medieval war between Mongols and Russians","A colonial war"]$t$::jsonb,
  context_en  = $t$The Crimean War (1853-1856) pitted Russia against the Ottoman Empire, France, the UK and Sardinia. Florence Nightingale modernized nursing during this conflict.$t$
where category = 'historia' and question = $q$¿Qué fue la Guerra de Crimea?$q$;

update public.questions set
  question_en = $t$Who was Nelson Mandela?$t$,
  options_en  = $t$["First president of Nigeria","Activist and first black president of South Africa","Leader of the civil rights movement in the U.S.","Prime minister of Zimbabwe"]$t$::jsonb,
  context_en  = $t$Nelson Mandela (1918-2013) fought against Apartheid, was imprisoned for 27 years and became the first democratically elected president of South Africa (1994).$t$
where category = 'historia' and question = $q$¿Quién fue Nelson Mandela?$q$;

update public.questions set
  question_en = $t$What was the Cold War?$t$,
  options_en  = $t$["A war between the Arctic and Antarctica","The political and military tension between the U.S. and the USSR (1947-1991)","A war between Scandinavian countries","An undeclared war between Europe and Russia"]$t$::jsonb,
  context_en  = $t$The Cold War (1947-1991) was the rivalry between the U.S. and the USSR without direct conflict. It included the arms race, the space race and proxy conflicts.$t$
where category = 'historia' and question = $q$¿Qué fue la Guerra Fría?$q$;

update public.questions set
  question_en = $t$In what year was the Soviet Union dissolved?$t$,
  options_en  = $t$["1989","1990","1991","1992"]$t$::jsonb,
  context_en  = $t$The USSR was officially dissolved on 25 December 1991, when Gorbachev resigned. It gave rise to 15 independent republics, with Russia as the main successor.$t$
where category = 'historia' and question = $q$¿En qué año se disolvió la Unión Soviética?$q$;

update public.questions set
  question_en = $t$Who was Mao Zedong?$t$,
  options_en  = $t$["The first president of the Republic of China","The founder of the People's Republic of China and leader of the Chinese Communist Party","A World War II general","The last Chinese emperor"]$t$::jsonb,
  context_en  = $t$Mao Zedong (1893-1976) founded the People's Republic of China in 1949. His 'Great Leap Forward' and the Cultural Revolution caused tens of millions of deaths.$t$
where category = 'historia' and question = $q$¿Quién fue Mao Tse-Tung?$q$;

update public.questions set
  question_en = $t$What was Pearl Harbor?$t$,
  options_en  = $t$["A British naval base","The Japanese attack on the U.S. naval base in Hawaii in 1941","A naval battle in the Pacific","An Allied supply port"]$t$::jsonb,
  context_en  = $t$On 7 December 1941, Japan attacked the base at Pearl Harbor. It brought the U.S. into World War II. Roosevelt called it 'a date which will live in infamy'.$t$
where category = 'historia' and question = $q$¿Qué fue Pearl Harbor?$q$;

update public.questions set
  question_en = $t$Who was Hernán Cortés?$t$,
  options_en  = $t$["The conqueror of the Inca Empire","The conqueror of the Aztec Empire","The discoverer of Florida","The first governor of Cuba"]$t$::jsonb,
  context_en  = $t$Hernán Cortés (1485-1547) conquered the Aztec Empire between 1519-1521 with 600 men, relying on alliances with peoples hostile to the Aztecs.$t$
where category = 'historia' and question = $q$¿Quién fue Hernán Cortés?$q$;

update public.questions set
  question_en = $t$What was the Battle of Lepanto (1571)?$t$,
  options_en  = $t$["A battle between Spain and Portugal","The victory of the Holy League over the Ottoman Turks in the Mediterranean","A battle of the Reconquista","A naval combat between pirates"]$t$::jsonb,
  context_en  = $t$At Lepanto (1571) the Holy League (Spain, Venice, the Pope) defeated the Ottoman fleet. Miguel de Cervantes took part and lost the use of his left hand.$t$
where category = 'historia' and question = $q$¿Qué fue la batalla de Lepanto (1571)?$q$;

update public.questions set
  question_en = $t$What was the Marshall Plan?$t$,
  options_en  = $t$["A NATO military plan","The U.S. economic aid program to rebuild Europe after WWII","A peace treaty between Germany and the Allies","A military strategy to contain the USSR"]$t$::jsonb,
  context_en  = $t$The Marshall Plan (1948-1952) was the U.S. economic aid program that provided $12 billion to rebuild Western Europe.$t$
where category = 'historia' and question = $q$¿Qué fue el Plan Marshall?$q$;

update public.questions set
  question_en = $t$When was the Cuban Revolution?$t$,
  options_en  = $t$["1953","1956","1959","1962"]$t$::jsonb,
  context_en  = $t$The Cuban Revolution triumphed on 1 January 1959, when Fidel Castro overthrew dictator Batista. Fidel ruled Cuba until 2008, when he handed power to his brother Raúl.$t$
where category = 'historia' and question = $q$¿Cuándo fue la Revolución Cubana?$q$;

update public.questions set
  question_en = $t$What was the Cuban Missile Crisis (1962)?$t$,
  options_en  = $t$["A U.S. invasion of Cuba","The nuclear confrontation between the U.S. and the USSR over Soviet missiles in Cuba","A war between Cuba and the U.S.","An economic blockade of Cuba"]$t$::jsonb,
  context_en  = $t$In 1962, the U.S. discovered Soviet missiles in Cuba. The 13 days of tension between Kennedy and Khrushchev were the closest the world came to nuclear war.$t$
where category = 'historia' and question = $q$¿Qué fue la crisis de los misiles de Cuba (1962)?$q$;

update public.questions set
  question_en = $t$What was the Battle of Waterloo?$t$,
  options_en  = $t$["Wellington's defeat by Napoleon","Napoleon's final defeat by Wellington and Blücher in 1815","The French victory in the Russian campaign","A World War I battle"]$t$::jsonb,
  context_en  = $t$At Waterloo (18 June 1815), Napoleon was defeated by the coalition of Wellington (UK) and Blücher (Prussia). He was exiled to Saint Helena.$t$
where category = 'historia' and question = $q$¿Qué fue la Batalla de Waterloo?$q$;

update public.questions set
  question_en = $t$In what year was the UN founded?$t$,
  options_en  = $t$["1943","1945","1947","1950"]$t$::jsonb,
  context_en  = $t$The UN was founded on 24 October 1945, with 51 founding countries, to maintain peace after World War II. Today it has 193 member states.$t$
where category = 'historia' and question = $q$¿En qué año se fundó la ONU?$q$;

update public.questions set
  question_en = $t$Who was Leonardo da Vinci?$t$,
  options_en  = $t$["Only a Renaissance painter","A Renaissance genius: painter, sculptor, architect, scientist and inventor","An Italian mathematician and physicist","A humanist philosopher"]$t$::jsonb,
  context_en  = $t$Leonardo da Vinci (1452-1519) was the archetype of the 'Renaissance man'. He painted the Mona Lisa and The Last Supper, designed flying machines and studied anatomy.$t$
where category = 'historia' and question = $q$¿Quién fue Leonardo da Vinci?$q$;

update public.questions set
  question_en = $t$What was the Vietnam War?$t$,
  options_en  = $t$["A war between North and South Vietnam, with U.S. intervention","A French colonial war","A Chinese invasion of Vietnam","A war of independence against Japan"]$t$::jsonb,
  context_en  = $t$The Vietnam War (1955-1975) pitted communist North Vietnam (backed by the USSR and China) against the South (backed by the U.S.). It ended with communist unification.$t$
where category = 'historia' and question = $q$¿Qué fue la Guerra de Vietnam?$q$;

update public.questions set
  question_en = $t$In what year was the Treaty of Versailles signed?$t$,
  options_en  = $t$["1918","1919","1920","1921"]$t$::jsonb,
  context_en  = $t$The Treaty of Versailles was signed on 28 June 1919, formally ending World War I and imposing harsh conditions on Germany.$t$
where category = 'historia' and question = $q$¿En qué año se firmó el Tratado de Versalles?$q$;

update public.questions set
  question_en = $t$Who was the last tsar of Russia?$t$,
  options_en  = $t$["Alexander III","Nicholas II","Peter the Great","Ivan the Terrible"]$t$::jsonb,
  context_en  = $t$Nicholas II Romanov ruled from 1894 to 1917. He was executed along with his family in 1918 after the Bolshevik Revolution.$t$
where category = 'historia' and question = $q$¿Quién fue el último zar de Rusia?$q$;

update public.questions set
  question_en = $t$Which Roman emperor legalized Christianity?$t$,
  options_en  = $t$["Diocletian","Constantine I","Theodosius","Trajan"]$t$::jsonb,
  context_en  = $t$Constantine I issued the Edict of Milan in the year 313, which granted religious freedom and legalized Christianity in the Empire.$t$
where category = 'historia' and question = $q$¿Qué emperador romano legalizó el cristianismo?$q$;

update public.questions set
  question_en = $t$In which century did Charlemagne live?$t$,
  options_en  = $t$["6th-7th","8th-9th","10th-11th","12th-13th"]$t$::jsonb,
  context_en  = $t$Charlemagne (742-814) was king of the Franks and emperor of the Romans. He was crowned by Pope Leo III in the year 800.$t$
where category = 'historia' and question = $q$¿En qué siglo vivió Carlomagno?$q$;

update public.questions set
  question_en = $t$Which Chinese dynasty built most of the current Great Wall?$t$,
  options_en  = $t$["Han","Tang","Ming","Qing"]$t$::jsonb,
  context_en  = $t$The Ming dynasty (1368-1644) rebuilt and expanded most of the sections of the Great Wall of China visible today.$t$
where category = 'historia' and question = $q$¿Qué dinastía china construyó la mayor parte de la Gran Muralla actual?$q$;

update public.questions set
  question_en = $t$Who was assassinated in Sarajevo in 1914?$t$,
  options_en  = $t$["Kaiser Wilhelm II","Archduke Franz Ferdinand","Tsar Nicholas II","Edward VII"]$t$::jsonb,
  context_en  = $t$The assassination of Archduke Franz Ferdinand of Austria by Gavrilo Princip on 28 June 1914 triggered World War I.$t$
where category = 'historia' and question = $q$¿Quién fue asesinado en Sarajevo en 1914?$q$;

update public.questions set
  question_en = $t$Which treaty divided the New World between Spain and Portugal?$t$,
  options_en  = $t$["Treaty of Utrecht","Treaty of Tordesillas","Peace of Westphalia","Treaty of Paris"]$t$::jsonb,
  context_en  = $t$The Treaty of Tordesillas (1494) drew a line of demarcation dividing the discovered and yet-to-be-discovered lands between Castile and Portugal.$t$
where category = 'historia' and question = $q$¿Qué tratado dividió el Nuevo Mundo entre España y Portugal?$q$;

update public.questions set
  question_en = $t$Which event conventionally marks the start of the Modern Age?$t$,
  options_en  = $t$["Fall of the Roman Empire","Discovery of America","French Revolution","Invention of the printing press"]$t$::jsonb,
  context_en  = $t$The discovery of America in 1492 (along with the fall of Constantinople in 1453) is usually cited as the start of the Modern Age.$t$
where category = 'historia' and question = $q$¿Qué evento marca el inicio convencional de la Edad Moderna?$q$;

update public.questions set
  question_en = $t$In what year did Constantinople fall?$t$,
  options_en  = $t$["1389","1453","1492","1517"]$t$::jsonb,
  context_en  = $t$Constantinople fell to the Ottomans of Mehmed II on 29 May 1453, marking the end of the Byzantine Empire.$t$
where category = 'historia' and question = $q$¿En qué año cayó Constantinopla?$q$;

update public.questions set
  question_en = $t$Which pharaoh signed the first known peace treaty?$t$,
  options_en  = $t$["Tutankhamun","Ramesses II","Khufu","Akhenaten"]$t$::jsonb,
  context_en  = $t$Ramesses II signed the Treaty of Kadesh with the Hittites around 1259 BC, considered the first written peace treaty in history.$t$
where category = 'historia' and question = $q$¿Quién fue el faraón que firmó el primer tratado de paz conocido?$q$;

update public.questions set
  question_en = $t$What was the Bauhaus?$t$,
  options_en  = $t$["A German dynasty","A design school","A political party","A battle"]$t$::jsonb,
  context_en  = $t$The Bauhaus was a German school of art, design and architecture founded by Walter Gropius in Weimar in 1919; closed by the Nazis in 1933.$t$
where category = 'historia' and question = $q$¿Qué fue la Bauhaus?$q$;

update public.questions set
  question_en = $t$Which empire did Mehmed II establish after the capture of Constantinople?$t$,
  options_en  = $t$["Persian Empire","Ottoman Empire","Mongol Empire","Safavid Empire"]$t$::jsonb,
  context_en  = $t$Mehmed II 'the Conqueror' consolidated the Ottoman Empire and made Constantinople (renamed Istanbul) its capital.$t$
where category = 'historia' and question = $q$¿Qué imperio fundó Mehmed II tras la toma de Constantinopla?$q$;

update public.questions set
  question_en = $t$Which U.S. document was signed on 4 July 1776?$t$,
  options_en  = $t$["Constitution","Declaration of Independence","Bill of Rights","Treaty of Paris"]$t$::jsonb,
  context_en  = $t$The Declaration of Independence, drafted mainly by Thomas Jefferson, proclaimed the independence of the Thirteen Colonies from Great Britain.$t$
where category = 'historia' and question = $q$¿Qué documento estadounidense se firmó el 4 de julio de 1776?$q$;

update public.questions set
  question_en = $t$Who was the 'Liberator' of Argentina, Chile and Peru?$t$,
  options_en  = $t$["Simón Bolívar","José de San Martín","Bernardo O'Higgins","Antonio José de Sucre"]$t$::jsonb,
  context_en  = $t$José de San Martín (1778-1850) led the military campaigns that freed Argentina, Chile and part of Peru from Spanish rule.$t$
where category = 'historia' and question = $q$¿Quién fue el "Libertador" de Argentina, Chile y Perú?$q$;

update public.questions set
  question_en = $t$Which war pitted the North and South of the United States (1861-1865)?$t$,
  options_en  = $t$["War of Independence","American Civil War","Spanish-American War","War of 1812"]$t$::jsonb,
  context_en  = $t$The Civil War pitted the Union (North) against the Confederate States (South). It ended with a Northern victory and the abolition of slavery.$t$
where category = 'historia' and question = $q$¿Qué guerra enfrentó al Norte y Sur de Estados Unidos (1861-1865)?$q$;

update public.questions set
  question_en = $t$Who was Abraham Lincoln?$t$,
  options_en  = $t$["1st president of the U.S.","16th president of the U.S.","Inventor","Southern general"]$t$::jsonb,
  context_en  = $t$Abraham Lincoln was the 16th president of the U.S. (1861-1865). He abolished slavery with the Emancipation Proclamation and was assassinated in 1865.$t$
where category = 'historia' and question = $q$¿Quién fue Abraham Lincoln?$q$;

update public.questions set
  question_en = $t$In what year was the current Spanish Constitution enacted?$t$,
  options_en  = $t$["1975","1976","1978","1981"]$t$::jsonb,
  context_en  = $t$The Spanish Constitution was enacted on 27 December 1978 after a referendum, consolidating the transition to democracy.$t$
where category = 'historia' and question = $q$¿En qué año se promulgó la Constitución española vigente?$q$;

update public.questions set
  question_en = $t$Who was the dictator of Spain between 1939 and 1975?$t$,
  options_en  = $t$["Primo de Rivera","Francisco Franco","Alfonso XIII","Juan Carlos I"]$t$::jsonb,
  context_en  = $t$Francisco Franco ruled Spain as a dictator from the end of the Civil War (1939) until his death in 1975.$t$
where category = 'historia' and question = $q$¿Quién fue el dictador de España entre 1939 y 1975?$q$;

update public.questions set
  question_en = $t$Which empire dominated Mesoamerica before the arrival of the Spanish?$t$,
  options_en  = $t$["Inca","Aztec","Classic Maya","Olmec"]$t$::jsonb,
  context_en  = $t$The Aztec (Mexica) Empire dominated central Mexico with its capital at Tenochtitlan until its fall in 1521 to Hernán Cortés.$t$
where category = 'historia' and question = $q$¿Qué imperio dominó Mesoamérica antes de la llegada de los españoles?$q$;

update public.questions set
  question_en = $t$What was the French May of 1968?$t$,
  options_en  = $t$["A student and worker uprising","A civil war","A military coup","An economic crisis"]$t$::jsonb,
  context_en  = $t$In May 1968, students and workers led massive protests in France that challenged De Gaulle's government and the established social order.$t$
where category = 'historia' and question = $q$¿Qué fue el Mayo Francés de 1968?$q$;

update public.questions set
  question_en = $t$Which pre-Columbian empire had its capital at Cuzco?$t$,
  options_en  = $t$["Aztec","Maya","Inca","Chimú"]$t$::jsonb,
  context_en  = $t$Cuzco was the capital of the Inca Empire, considered by the Incas the 'navel of the world' (Qosqo).$t$
where category = 'historia' and question = $q$¿Qué imperio precolombino tenía su capital en Cuzco?$q$;

update public.questions set
  question_en = $t$Who was Mahatma Gandhi?$t$,
  options_en  = $t$["Hindu emperor","Pacifist leader","Prime minister of India","Buddhist philosopher"]$t$::jsonb,
  context_en  = $t$Gandhi (1869-1948) led India's independence from the United Kingdom through nonviolent resistance (satyagraha).$t$
where category = 'historia' and question = $q$¿Quién fue Mahatma Gandhi?$q$;

update public.questions set
  question_en = $t$In what year did India become independent?$t$,
  options_en  = $t$["1942","1945","1947","1950"]$t$::jsonb,
  context_en  = $t$India became independent from the British Empire on 15 August 1947. The same process gave rise to Pakistan.$t$
where category = 'historia' and question = $q$¿En qué año se independizó la India?$q$;

update public.questions set
  question_en = $t$Which war pitted North Korea against South Korea (1950-1953)?$t$,
  options_en  = $t$["Vietnam War","Korean War","Gulf War","Cold War"]$t$::jsonb,
  context_en  = $t$The Korean War (1950-1953) pitted the communist North (backed by China and the USSR) against the South (backed by the UN and the U.S.).$t$
where category = 'historia' and question = $q$¿Qué guerra enfrentó a Corea del Norte y Corea del Sur (1950-1953)?$q$;

update public.questions set
  question_en = $t$What was the 'Crash' of 1929?$t$,
  options_en  = $t$["A stock market crisis in the U.S.","The crash of an airship","An attack","A diplomatic clash"]$t$::jsonb,
  context_en  = $t$The Wall Street Crash of October 1929 marked the start of the Great Depression, the largest economic crisis of the 20th century.$t$
where category = 'historia' and question = $q$¿Qué fue el "Crash" de 1929?$q$;

update public.questions set
  question_en = $t$Who delivered the 'I have a dream' speech?$t$,
  options_en  = $t$["Malcolm X","Martin Luther King Jr.","John F. Kennedy","Barack Obama"]$t$::jsonb,
  context_en  = $t$Martin Luther King Jr. delivered his famous speech on 28 August 1963 during the March on Washington for civil rights.$t$
where category = 'historia' and question = $q$¿Quién pronunció el discurso "I have a dream"?$q$;

update public.questions set
  question_en = $t$In what year was John F. Kennedy assassinated?$t$,
  options_en  = $t$["1961","1962","1963","1968"]$t$::jsonb,
  context_en  = $t$JFK was assassinated in Dallas on 22 November 1963. The alleged perpetrator, Lee Harvey Oswald, was himself killed two days later.$t$
where category = 'historia' and question = $q$¿En qué año fue asesinado John F. Kennedy?$q$;

update public.questions set
  question_en = $t$What was the Maastricht Treaty (1992)?$t$,
  options_en  = $t$["It founded the European Union","It ended the USSR","It reunified Germany","It created NATO"]$t$::jsonb,
  context_en  = $t$The Maastricht Treaty, signed in 1992 and in force in 1993, created the European Union and laid the foundations for the euro.$t$
where category = 'historia' and question = $q$¿Qué fue el Tratado de Maastricht (1992)?$q$;

update public.questions set
  question_en = $t$In what year did the euro enter circulation as physical currency?$t$,
  options_en  = $t$["1999","2000","2002","2004"]$t$::jsonb,
  context_en  = $t$The euro entered physical circulation on 1 January 2002 in twelve EU countries, although it had existed as an accounting currency since 1999.$t$
where category = 'historia' and question = $q$¿En qué año entró en circulación el euro como moneda física?$q$;

update public.questions set
  question_en = $t$Which empire did Philip II of Spain rule?$t$,
  options_en  = $t$["The Roman Empire","The Spanish Empire","The Ottoman Empire","The Holy Roman Empire"]$t$::jsonb,
  context_en  = $t$Philip II (1556-1598) ruled an empire on which 'the sun never set', spanning territories in Europe, America, Asia and Africa.$t$
where category = 'historia' and question = $q$¿Qué imperio gobernó España Felipe II?$q$;

update public.questions set
  question_en = $t$Who defeated the Persians at the Battle of Marathon (490 BC)?$t$,
  options_en  = $t$["Sparta","Athens","Thebes","Macedonia"]$t$::jsonb,
  context_en  = $t$Athens, led by Miltiades, defeated the troops of Darius I at Marathon. Pheidippides ran 42 km to announce the victory.$t$
where category = 'historia' and question = $q$¿Quién derrotó a los persas en la batalla de Maratón (490 a.C.)?$q$;

update public.questions set
  question_en = $t$Which emperor built the Colosseum in Rome?$t$,
  options_en  = $t$["Augustus","Vespasian","Hadrian","Caligula"]$t$::jsonb,
  context_en  = $t$Emperor Vespasian began construction of the Flavian Amphitheatre (Colosseum) in AD 72; his son Titus inaugurated it in AD 80.$t$
where category = 'historia' and question = $q$¿Qué emperador construyó el Coliseo de Roma?$q$;

update public.questions set
  question_en = $t$Who was Alexander the Great?$t$,
  options_en  = $t$["Persian king","King of Macedonia","Roman emperor","Egyptian pharaoh"]$t$::jsonb,
  context_en  = $t$Alexander III of Macedon (356-323 BC) conquered a vast empire stretching from Greece to India. He was a pupil of Aristotle.$t$
where category = 'historia' and question = $q$¿Quién fue Alejandro Magno?$q$;

update public.questions set
  question_en = $t$Which 20th-century war pitted the U.S. against a Southeast Asian country and lasted ~20 years?$t$,
  options_en  = $t$["Korea","Vietnam","Cambodia","Philippines"]$t$::jsonb,
  context_en  = $t$The Vietnam War (1955-1975) ended with the fall of Saigon and unification under the communist regime of the North.$t$
where category = 'historia' and question = $q$¿Qué guerra del s. XX enfrentó a EE.UU. con un país del sudeste asiático y duró ~20 años?$q$;

update public.questions set
  question_en = $t$What was the 'Prague Spring' (1968)?$t$,
  options_en  = $t$["An attempt at reform in Czechoslovakia","A student revolution","A famine","A cultural festival"]$t$::jsonb,
  context_en  = $t$The Prague Spring was a period of political liberalization in Czechoslovakia, crushed by the invasion of the Warsaw Pact in August 1968.$t$
where category = 'historia' and question = $q$¿Qué fue la "Primavera de Praga" (1968)?$q$;

update public.questions set
  question_en = $t$Which year marked the start of the Industrial Revolution in England (approx.)?$t$,
  options_en  = $t$["1650","1760","1820","1870"]$t$::jsonb,
  context_en  = $t$The Industrial Revolution began around 1760-1780 in Great Britain, with the mechanization of textiles and the steam engine.$t$
where category = 'historia' and question = $q$¿Qué año marcó el inicio de la Revolución Industrial en Inglaterra (aprox.)?$q$;

update public.questions set
  question_en = $t$Which empire did Suleiman the Magnificent rule?$t$,
  options_en  = $t$["Persian","Ottoman","Mongol","Byzantine"]$t$::jsonb,
  context_en  = $t$Suleiman I 'the Magnificent' (1520-1566) brought the Ottoman Empire to its peak, expanding across the Balkans, North Africa and the Middle East.$t$
where category = 'historia' and question = $q$¿Qué imperio gobernó Solimán el Magnífico?$q$;

update public.questions set
  question_en = $t$What was Mao's 'Long March'?$t$,
  options_en  = $t$["A strategic retreat of the CCP","A religious march","A trade route","A Mongol conquest"]$t$::jsonb,
  context_en  = $t$The Long March (1934-1935) was the retreat of the Chinese Red Army, covering ~10,000 km. It consolidated Mao Zedong's leadership.$t$
where category = 'historia' and question = $q$¿Qué fue la "Larga Marcha" de Mao?$q$;

update public.questions set
  question_en = $t$Who was Charles V?$t$,
  options_en  = $t$["King of France","Holy Roman Emperor","King of England","Tsar of Russia"]$t$::jsonb,
  context_en  = $t$Charles V (Charles I of Spain) was Holy Roman Emperor (1519-1556). He inherited an immense empire.$t$
where category = 'historia' and question = $q$¿Quién fue Carlos V?$q$;

update public.questions set
  question_en = $t$What name is given to the U.S. anti-communist doctrine after World War II?$t$,
  options_en  = $t$["Monroe Doctrine","Truman Doctrine","Eisenhower Doctrine","Bush Doctrine"]$t$::jsonb,
  context_en  = $t$The Truman Doctrine (1947) declared that the U.S. would help countries threatened by communism, formally beginning the Cold War.$t$
where category = 'historia' and question = $q$¿Qué nombre recibe la doctrina anticomunista de EE.UU. tras la Segunda Guerra Mundial?$q$;

update public.questions set
  question_en = $t$What was the Enlightenment?$t$,
  options_en  = $t$["An 18th-century intellectual movement","A war","A religion","A dynasty"]$t$::jsonb,
  context_en  = $t$The Enlightenment was an 18th-century movement that championed reason, science and individual rights. It influenced the French Revolution.$t$
where category = 'historia' and question = $q$¿Qué fue la Ilustración?$q$;

update public.questions set
  question_en = $t$Which 20th-century civil war inspired Hemingway's 'For Whom the Bell Tolls'?$t$,
  options_en  = $t$["Mexican","Spanish","Russian","Chinese"]$t$::jsonb,
  context_en  = $t$Ernest Hemingway's novel is set in the Spanish Civil War (1936-1939), in which he took part as a correspondent.$t$
where category = 'historia' and question = $q$¿Qué guerra civil del s. XX inspiró "Por quién doblan las campanas" de Hemingway?$q$;

update public.questions set
  question_en = $t$What was 'D-Day'?$t$,
  options_en  = $t$["The bombing of Hiroshima","The Normandy landings","The fall of the Wall","Pearl Harbor"]$t$::jsonb,
  context_en  = $t$'D-Day' was the Allied landing in Normandy on 6 June 1944, one of the largest military operations in history.$t$
where category = 'historia' and question = $q$¿Qué fue el "Día D"?$q$;

update public.questions set
  question_en = $t$Which bomb did the U.S. drop on Hiroshima in 1945?$t$,
  options_en  = $t$["Fat Man","Little Boy","Trinity","Tsar Bomba"]$t$::jsonb,
  context_en  = $t$'Little Boy' was the uranium atomic bomb dropped on Hiroshima on 6 August 1945. 'Fat Man' fell on Nagasaki three days later.$t$
where category = 'historia' and question = $q$¿Qué bomba lanzó EE.UU. sobre Hiroshima en 1945?$q$;

update public.questions set
  question_en = $t$Who was Winston Churchill?$t$,
  options_en  = $t$["King of England","British prime minister","American general","Philosopher"]$t$::jsonb,
  context_en  = $t$Churchill was prime minister of the United Kingdom (1940-1945 and 1951-1955), the British leader during World War II. Nobel laureate in Literature 1953.$t$
where category = 'historia' and question = $q$¿Quién fue Winston Churchill?$q$;

update public.questions set
  question_en = $t$What was Thailand called before 1939?$t$,
  options_en  = $t$["Burma","Indochina","Siam","Annam"]$t$::jsonb,
  context_en  = $t$Thailand was officially called 'Siam' until 1939. It is one of the few Southeast Asian countries never to be colonized.$t$
where category = 'historia' and question = $q$¿Qué nombre tenía Tailandia antes de 1939?$q$;

update public.questions set
  question_en = $t$In what year was Germany reunified?$t$,
  options_en  = $t$["1989","1990","1991","1992"]$t$::jsonb,
  context_en  = $t$Germany was officially reunified on 3 October 1990, almost a year after the fall of the Berlin Wall.$t$
where category = 'historia' and question = $q$¿En qué año se reunificó Alemania?$q$;

update public.questions set
  question_en = $t$Who was Joseph Stalin?$t$,
  options_en  = $t$["Russian tsar","Leader of the USSR","President of the U.S.","Yugoslav leader"]$t$::jsonb,
  context_en  = $t$Stalin led the USSR from the mid-1920s until his death in 1953. He industrialized the country at the cost of millions of victims.$t$
where category = 'historia' and question = $q$¿Quién fue Iósif Stalin?$q$;

update public.questions set
  question_en = $t$What was the GULAG?$t$,
  options_en  = $t$["The Soviet forced-labor camp system","A military order","A Nazi party","An empire"]$t$::jsonb,
  context_en  = $t$The Gulag was the Soviet system of forced-labor camps where millions of people were imprisoned during the Stalinist regime.$t$
where category = 'historia' and question = $q$¿Qué fue el GULAG?$q$;

update public.questions set
  question_en = $t$In what year did the war in Ukraine begin (the full-scale Russian invasion)?$t$,
  options_en  = $t$["2014","2020","2022","2023"]$t$::jsonb,
  context_en  = $t$Russia launched the full-scale invasion of Ukraine on 24 February 2022. The annexation of Crimea had occurred in 2014.$t$
where category = 'historia' and question = $q$¿En qué año empezó la guerra de Ucrania (invasión rusa a gran escala)?$q$;

update public.questions set
  question_en = $t$Which power launched the Crusades in 1095?$t$,
  options_en  = $t$["Byzantine","Medieval Christian Europe","Ottoman","Persian"]$t$::jsonb,
  context_en  = $t$Pope Urban II called for the First Crusade at the Council of Clermont (1095), beginning the campaigns to reconquer the Holy Land.$t$
where category = 'historia' and question = $q$¿Qué imperio inició las Cruzadas en 1095?$q$;

update public.questions set
  question_en = $t$Who was Saladin?$t$,
  options_en  = $t$["A medieval Muslim sultan","An Umayyad caliph","An Andalusi emir","A Persian king"]$t$::jsonb,
  context_en  = $t$Saladin (Salah ad-Din, 1137-1193) was sultan of Egypt and Syria. He recaptured Jerusalem for Islam in 1187.$t$
where category = 'historia' and question = $q$¿Quién fue Saladino?$q$;

update public.questions set
  question_en = $t$What role did Eva Perón play?$t$,
  options_en  = $t$["Spanish queen","First Lady of Argentina","Mexican actress","Cuban revolutionary leader"]$t$::jsonb,
  context_en  = $t$Eva Duarte de Perón ('Evita', 1919-1952) was First Lady of Argentina and an icon of Peronism, a champion of social rights and women's rights.$t$
where category = 'historia' and question = $q$¿Qué papel desempeñó Eva Perón?$q$;

update public.questions set
  question_en = $t$In what year was Lincoln assassinated?$t$,
  options_en  = $t$["1860","1862","1865","1869"]$t$::jsonb,
  context_en  = $t$Abraham Lincoln was assassinated by John Wilkes Booth on 14 April 1865, a few days after the end of the Civil War.$t$
where category = 'historia' and question = $q$¿En qué año asesinaron a Lincoln?$q$;

update public.questions set
  question_en = $t$Which Egyptian dynasty did Tutankhamun belong to?$t$,
  options_en  = $t$["18th","19th","20th","21st"]$t$::jsonb,
  context_en  = $t$Tutankhamun belonged to the 18th dynasty of the Egyptian New Kingdom (14th century BC). His tomb was discovered by Howard Carter in 1922.$t$
where category = 'historia' and question = $q$¿Qué dinastía egipcia perteneció Tutankamón?$q$;

update public.questions set
  question_en = $t$Which Roman emperor formally divided the empire into East and West?$t$,
  options_en  = $t$["Diocletian","Constantine","Theodosius","Justinian"]$t$::jsonb,
  context_en  = $t$Theodosius I 'the Great' divided the Roman Empire between his sons Arcadius and Honorius in AD 395, a partition that became permanent.$t$
where category = 'historia' and question = $q$¿Qué emperador romano dividió el imperio en Oriente y Occidente formalmente?$q$;

update public.questions set
  question_en = $t$What was the Battle of Trafalgar (1805)?$t$,
  options_en  = $t$["A naval battle","A battle in the Alps","A siege","A cavalry duel"]$t$::jsonb,
  context_en  = $t$At Trafalgar (Cádiz), Nelson's British fleet defeated the Franco-Spanish fleet. Nelson died in combat.$t$
where category = 'historia' and question = $q$¿Qué fue la batalla de Trafalgar (1805)?$q$;

update public.questions set
  question_en = $t$Which dynasty currently rules Spain?$t$,
  options_en  = $t$["Habsburg","Bourbon","Trastámara","Savoy"]$t$::jsonb,
  context_en  = $t$The House of Bourbon has ruled Spain since 1700 (with interruptions). The current king is Felipe VI since 2014.$t$
where category = 'historia' and question = $q$¿Qué dinastía gobierna actualmente España?$q$;

update public.questions set
  question_en = $t$Who first unified China (221 BC)?$t$,
  options_en  = $t$["Qin Shi Huang","Confucius","Sun Tzu","Mao Zedong"]$t$::jsonb,
  context_en  = $t$Qin Shi Huang was the first emperor of a unified China and ordered the construction of much of the Great Wall and his famous terracotta army.$t$
where category = 'historia' and question = $q$¿Quién unificó China por primera vez (221 a.C.)?$q$;

update public.questions set
  question_en = $t$What was the 'Pax Romana'?$t$,
  options_en  = $t$["A period of imperial stability","A treaty","A religion","A civil war"]$t$::jsonb,
  context_en  = $t$The Pax Romana was a period of relative peace and stability in the Roman Empire, roughly from 27 BC to AD 180.$t$
where category = 'historia' and question = $q$¿Qué fue la "Pax Romana"?$q$;

update public.questions set
  question_en = $t$Which English document of 1215 limited the power of the king?$t$,
  options_en  = $t$["Bill of Rights","Magna Carta","Petition of Right","Act of Union"]$t$::jsonb,
  context_en  = $t$The Magna Carta was imposed on King John by the barons in 1215; a milestone in limiting royal power and the development of constitutionalism.$t$
where category = 'historia' and question = $q$¿Qué documento inglés de 1215 limitó el poder del rey?$q$;

update public.questions set
  question_en = $t$In what year was the attack on the Twin Towers?$t$,
  options_en  = $t$["1999","2000","2001","2003"]$t$::jsonb,
  context_en  = $t$On 11 September 2001, 19 Al-Qaeda terrorists attacked the WTC and the Pentagon, causing nearly 3,000 deaths.$t$
where category = 'historia' and question = $q$¿En qué año fue el atentado de las Torres Gemelas?$q$;

update public.questions set
  question_en = $t$Who was the first man to circumnavigate the globe (his expedition achieved it)?$t$,
  options_en  = $t$["Vasco da Gama","Magellan-Elcano","Christopher Columbus","Francis Drake"]$t$::jsonb,
  context_en  = $t$Ferdinand Magellan began the expedition; he died in the Philippines (1521). Juan Sebastián Elcano completed the voyage in 1522.$t$
where category = 'historia' and question = $q$¿Quién fue el primer hombre en circunnavegar el globo (su expedición lo logró)?$q$;

update public.questions set
  question_en = $t$What caused the final fall of the Byzantine Empire?$t$,
  options_en  = $t$["Ottoman conquest","The Crusades","The Black Death","A Viking invasion"]$t$::jsonb,
  context_en  = $t$The Byzantine Empire fell when the Ottoman Turks took Constantinople in 1453, under the command of Mehmed II.$t$
where category = 'historia' and question = $q$¿Qué causó la caída final del Imperio Bizantino?$q$;

update public.questions set
  question_en = $t$Who was the 'Father of the Nation' in Italy after unification (1861)?$t$,
  options_en  = $t$["Garibaldi","Cavour","Victor Emmanuel II","Mazzini"]$t$::jsonb,
  context_en  = $t$Victor Emmanuel II was proclaimed king of Italy in 1861. Garibaldi and Cavour were decisive figures in the unification process.$t$
where category = 'historia' and question = $q$¿Quién fue el "Padre de la Patria" en Italia tras la unificación (1861)?$q$;

update public.questions set
  question_en = $t$What was the Thirty Years' War (1618-1648)?$t$,
  options_en  = $t$["A religious-political conflict in Europe","The English Civil War","A colonial war","A Napoleonic war"]$t$::jsonb,
  context_en  = $t$It began as a religious conflict (Catholics vs. Protestants) in the Holy Roman Empire and ended with the Peace of Westphalia, the basis of the modern state system.$t$
where category = 'historia' and question = $q$¿Qué fue la Guerra de los Treinta Años (1618-1648)?$q$;

update public.questions set
  question_en = $t$Which Chinese emperor had his terracotta army built?$t$,
  options_en  = $t$["Qin Shi Huang","Han Wudi","Kublai Khan","Tang Taizong"]$t$::jsonb,
  context_en  = $t$The first emperor, Qin Shi Huang, ordered the construction of the terracotta army (~8,000 figures) to protect him in the afterlife.$t$
where category = 'historia' and question = $q$¿Qué emperador chino mandó construir su ejército de terracota?$q$;

update public.questions set
  question_en = $t$Who led the Cuban Revolution in 1959?$t$,
  options_en  = $t$["Che Guevara","Fidel Castro","Camilo Cienfuegos","Raúl Castro"]$t$::jsonb,
  context_en  = $t$Fidel Castro overthrew Fulgencio Batista on 1 January 1959 and ruled Cuba for almost five decades.$t$
where category = 'historia' and question = $q$¿Quién dirigió la Revolución Cubana en 1959?$q$;

update public.questions set
  question_en = $t$What was the Battle of Stalingrad (1942-1943)?$t$,
  options_en  = $t$["A turning point in World War II","A naval battle","A peace pact","A 19th-century siege"]$t$::jsonb,
  context_en  = $t$It was one of the bloodiest battles in history. The German defeat by the USSR marked the turning of the war on the Eastern Front.$t$
where category = 'historia' and question = $q$¿Qué fue la batalla de Stalingrado (1942-1943)?$q$;

update public.questions set
  question_en = $t$In what year was NATO founded?$t$,
  options_en  = $t$["1945","1947","1949","1955"]$t$::jsonb,
  context_en  = $t$NATO was founded on 4 April 1949 through the Treaty of Washington, as a military alliance against the USSR.$t$
where category = 'historia' and question = $q$¿Qué año se fundó la OTAN?$q$;

update public.questions set
  question_en = $t$When was the Warsaw Pact signed?$t$,
  options_en  = $t$["1945","1949","1955","1961"]$t$::jsonb,
  context_en  = $t$The Warsaw Pact was signed in 1955 between the USSR and its Eastern European allies, in response to NATO.$t$
where category = 'historia' and question = $q$¿Cuándo se firmó el Pacto de Varsovia?$q$;

update public.questions set
  question_en = $t$Which empire destroyed Carthage in 146 BC?$t$,
  options_en  = $t$["Macedonia","Rome","Persia","Egypt"]$t$::jsonb,
  context_en  = $t$Rome destroyed Carthage at the end of the Third Punic War (146 BC). General Scipio Aemilianus razed the city.$t$
where category = 'historia' and question = $q$¿Qué imperio destruyó Cartago en 146 a.C.?$q$;

update public.questions set
  question_en = $t$Who was Hannibal Barca?$t$,
  options_en  = $t$["A Greek general","A Carthaginian general","A Roman emperor","A Persian king"]$t$::jsonb,
  context_en  = $t$Hannibal (247-183 BC) was the Carthaginian general who crossed the Alps with elephants during the Second Punic War to attack Rome.$t$
where category = 'historia' and question = $q$¿Quién fue Aníbal Barca?$q$;

update public.questions set
  question_en = $t$Which emperor made Christianity the official religion of the Roman Empire?$t$,
  options_en  = $t$["Constantine","Theodosius I","Justinian","Diocletian"]$t$::jsonb,
  context_en  = $t$Theodosius I issued the Edict of Thessalonica (AD 380) which established Nicene Christianity as the official religion of the Empire.$t$
where category = 'historia' and question = $q$¿Qué emperador convirtió el cristianismo en religión oficial del Imperio Romano?$q$;

update public.questions set
  question_en = $t$What was the Paris Commune (1871)?$t$,
  options_en  = $t$["A revolutionary government","A peace treaty","A political party","A bank"]$t$::jsonb,
  context_en  = $t$The Commune was a popular revolutionary government that controlled Paris from March to May 1871, bloodily repressed by the French government.$t$
where category = 'historia' and question = $q$¿Qué fue la Comuna de París (1871)?$q$;

update public.questions set
  question_en = $t$Which European empire colonized Brazil?$t$,
  options_en  = $t$["Spain","Portugal","The Netherlands","United Kingdom"]$t$::jsonb,
  context_en  = $t$Brazil was a Portuguese colony from 1500 until its independence in 1822. That is why it is the largest Portuguese-speaking country in the world.$t$
where category = 'historia' and question = $q$¿Qué imperio europeo colonizó Brasil?$q$;

update public.questions set
  question_en = $t$When was the Universal Declaration of Human Rights signed?$t$,
  options_en  = $t$["1945","1948","1950","1955"]$t$::jsonb,
  context_en  = $t$It was proclaimed by the UN General Assembly on 10 December 1948 in Paris, drafted by a commission chaired by Eleanor Roosevelt.$t$
where category = 'historia' and question = $q$¿Cuándo se firmó la Declaración Universal de los Derechos Humanos?$q$;

update public.questions set
  question_en = $t$Which empire ruled Persia before Alexander the Great?$t$,
  options_en  = $t$["Achaemenid","Sasanian","Parthian","Seljuk"]$t$::jsonb,
  context_en  = $t$The Achaemenid Empire (550-330 BC) was defeated by Alexander the Great. Its most famous kings were Cyrus, Darius I and Xerxes.$t$
where category = 'historia' and question = $q$¿Qué imperio gobernaba Persia antes de Alejandro Magno?$q$;

update public.questions set
  question_en = $t$Which city was the cradle of the Renaissance?$t$,
  options_en  = $t$["Rome","Florence","Venice","Milan"]$t$::jsonb,
  context_en  = $t$Florence, under the patronage of the Medici, was the main artistic, literary and philosophical hub of the Renaissance in the 15th century.$t$
where category = 'historia' and question = $q$¿Qué ciudad fue cuna del Renacimiento?$q$;

update public.questions set
  question_en = $t$Who was Lorenzo de' Medici?$t$,
  options_en  = $t$["Painter","Florentine patron","Pope","French king"]$t$::jsonb,
  context_en  = $t$Lorenzo 'the Magnificent' (1449-1492) was the de facto ruler of Florence and a great patron of Botticelli, Michelangelo and Leonardo.$t$
where category = 'historia' and question = $q$¿Quién fue Lorenzo de Médici?$q$;

update public.questions set
  question_en = $t$Which empire dominated India between the 16th and 19th centuries?$t$,
  options_en  = $t$["Maurya","Mughal","Gupta","Maratha"]$t$::jsonb,
  context_en  = $t$The Mughal Empire (1526-1857) ruled much of the Indian subcontinent. Its most famous emperor, Akbar, was tolerant of all religions.$t$
where category = 'historia' and question = $q$¿Qué imperio dominó la India entre los siglos XVI y XIX?$q$;

update public.questions set
  question_en = $t$Who ordered the Taj Mahal to be built?$t$,
  options_en  = $t$["Akbar","Shah Jahan","Aurangzeb","Babur"]$t$::jsonb,
  context_en  = $t$Shah Jahan ordered the Taj Mahal to be built (1632-1653) in Agra as a mausoleum for his wife Mumtaz Mahal.$t$
where category = 'historia' and question = $q$¿Quién mandó construir el Taj Mahal?$q$;

update public.questions set
  question_en = $t$What was the Tudor dynasty?$t$,
  options_en  = $t$["An English dynasty (1485-1603)","A French dynasty","A Russian dynasty","A German dynasty"]$t$::jsonb,
  context_en  = $t$The Tudors reigned in England from Henry VII to Elizabeth I. They include Henry VIII and his six wives.$t$
where category = 'historia' and question = $q$¿Qué fue la dinastía Tudor?$q$;

update public.questions set
  question_en = $t$Who was Elizabeth I of England?$t$,
  options_en  = $t$["A Catholic queen","The Virgin Queen","A Scottish queen","A Viking queen"]$t$::jsonb,
  context_en  = $t$Elizabeth I (1558-1603), daughter of Henry VIII and Anne Boleyn, was known as 'the Virgin Queen'. Her reign was a cultural and naval 'golden age'.$t$
where category = 'historia' and question = $q$¿Quién fue Isabel I de Inglaterra?$q$;

update public.questions set
  question_en = $t$What was the Boxer Rebellion (1899-1901)?$t$,
  options_en  = $t$["A nationalist revolt in China","A professional boxing war","An armed conflict in the U.S.","A religious movement"]$t$::jsonb,
  context_en  = $t$It was a nationalist revolt in China against foreign and missionary influence. It was crushed by an international coalition.$t$
where category = 'historia' and question = $q$¿Qué fue la rebelión de los Boxer (1899-1901)?$q$;

update public.questions set
  question_en = $t$When was the Red Cross founded?$t$,
  options_en  = $t$["1853","1863","1882","1901"]$t$::jsonb,
  context_en  = $t$The Red Cross was founded in Geneva in 1863 by Henry Dunant after witnessing the Battle of Solferino. It earned him the first Nobel Peace Prize (1901).$t$
where category = 'historia' and question = $q$¿Cuándo se fundó la Cruz Roja?$q$;

update public.questions set
  question_en = $t$Which empire dominated the region of Egypt in the 7th century BC?$t$,
  options_en  = $t$["Assyrian","Persian","Roman","Macedonian"]$t$::jsonb,
  context_en  = $t$The Assyrian Empire conquered Egypt in the 7th century BC under Esarhaddon and Ashurbanipal, before its own fall in 612 BC.$t$
where category = 'historia' and question = $q$¿Qué imperio dominó la región de Egipto en el s. VII a.C.?$q$;

update public.questions set
  question_en = $t$Which treaty ended the Thirty Years' War (1648)?$t$,
  options_en  = $t$["Treaty of Versailles","Peace of Westphalia","Treaty of Utrecht","Peace of Amiens"]$t$::jsonb,
  context_en  = $t$The Peace of Westphalia (1648) ended the Thirty Years' War and laid the foundations of the modern nation-state system.$t$
where category = 'historia' and question = $q$¿Qué tratado puso fin a la Guerra de los Treinta Años (1648)?$q$;


-- ── geografia (153) ──
update public.questions set
  question_en = $t$What is the longest river in the world?$t$,
  options_en  = $t$["Amazon","Nile","Yangtze","Mississippi"]$t$::jsonb,
  context_en  = $t$The Nile, at ~6,650 km, is considered the longest river. It crosses 11 African countries before flowing into the Mediterranean.$t$
where category = 'geografia' and question = $q$¿Cuál es el río más largo del mundo?$q$;

update public.questions set
  question_en = $t$In which country is the Eiffel Tower?$t$,
  options_en  = $t$["Belgium","Switzerland","France","Italy"]$t$::jsonb,
  context_en  = $t$The Eiffel Tower is in Paris, France. It was built by Gustave Eiffel for the 1889 World's Fair and stands 330 m tall.$t$
where category = 'geografia' and question = $q$¿En qué país se encuentra la Torre Eiffel?$q$;

update public.questions set
  question_en = $t$What is the largest country in the world by area?$t$,
  options_en  = $t$["China","Canada","United States","Russia"]$t$::jsonb,
  context_en  = $t$Russia is the largest country, at 17.1 million km². It spans 11 time zones and represents 11% of the world's land area.$t$
where category = 'geografia' and question = $q$¿Cuál es el país más grande del mundo por superficie?$q$;

update public.questions set
  question_en = $t$What is the capital of Australia?$t$,
  options_en  = $t$["Sydney","Melbourne","Canberra","Brisbane"]$t$::jsonb,
  context_en  = $t$Canberra has been Australia's capital since 1913, purpose-designed to resolve the rivalry between Sydney and Melbourne.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Australia?$q$;

update public.questions set
  question_en = $t$Which is the largest ocean in the world?$t$,
  options_en  = $t$["Atlantic","Indian","Arctic","Pacific"]$t$::jsonb,
  context_en  = $t$The Pacific Ocean is the largest and deepest, covering more than 30% of the Earth's surface. Its deepest point is the Mariana Trench.$t$
where category = 'geografia' and question = $q$¿Qué océano es el más grande del mundo?$q$;

update public.questions set
  question_en = $t$What is the highest mountain in the world?$t$,
  options_en  = $t$["K2","Mount Everest","Kangchenjunga","Lhotse"]$t$::jsonb,
  context_en  = $t$Mount Everest (8,849 m) is the highest mountain in the world, in the Himalayas, on the border between Nepal and China.$t$
where category = 'geografia' and question = $q$¿Cuál es la montaña más alta del mundo?$q$;

update public.questions set
  question_en = $t$What is the largest desert in the world?$t$,
  options_en  = $t$["Sahara","Gobi","Kalahari","Arctic"]$t$::jsonb,
  context_en  = $t$The largest desert is the Arctic (13.9 million km²). The Sahara is the largest hot desert in the world at 9.2 million km².$t$
where category = 'geografia' and question = $q$¿Cuál es el desierto más grande del mundo?$q$;

update public.questions set
  question_en = $t$How many continents are there in the world?$t$,
  options_en  = $t$["5","6","7","8"]$t$::jsonb,
  context_en  = $t$According to the most widespread model, there are 7 continents: Africa, Antarctica, Asia, Europe, Oceania, North America and South America.$t$
where category = 'geografia' and question = $q$¿Cuántos continentes hay en el mundo?$q$;

update public.questions set
  question_en = $t$What is the largest lake in the world?$t$,
  options_en  = $t$["Caspian Sea","Lake Superior","Lake Victoria","Lake Baikal"]$t$::jsonb,
  context_en  = $t$The Caspian Sea (371,000 km²) is technically the largest lake. Lake Superior is the largest freshwater lake. Baikal is the deepest.$t$
where category = 'geografia' and question = $q$¿Cuál es el lago más grande del mundo?$q$;

update public.questions set
  question_en = $t$What is the smallest country in the world?$t$,
  options_en  = $t$["Monaco","San Marino","Liechtenstein","Vatican City"]$t$::jsonb,
  context_en  = $t$Vatican City (0.44 km²) is the smallest country in the world, enclosed within Rome. It is the seat of the Catholic Church.$t$
where category = 'geografia' and question = $q$¿Cuál es el país más pequeño del mundo?$q$;

update public.questions set
  question_en = $t$What is the capital of Japan?$t$,
  options_en  = $t$["Osaka","Kyoto","Tokyo","Hiroshima"]$t$::jsonb,
  context_en  = $t$Tokyo is the capital of Japan and the most populous city in the world, with more than 37 million people in its metropolitan area.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Japón?$q$;

update public.questions set
  question_en = $t$What is the longest river in Europe?$t$,
  options_en  = $t$["Rhine","Danube","Volga","Thames"]$t$::jsonb,
  context_en  = $t$The Volga (3,531 km) is the longest river in Europe, rising in the Valdai Hills and flowing into the Caspian Sea. It is a symbol of Russia.$t$
where category = 'geografia' and question = $q$¿Cuál es el río más largo de Europa?$q$;

update public.questions set
  question_en = $t$In which country is the Amazon?$t$,
  options_en  = $t$["Colombia","Peru","Venezuela","Brazil"]$t$::jsonb,
  context_en  = $t$Most of the Amazon (60%) is in Brazil. It has the largest river basin in the world and is home to 10% of the planet's species.$t$
where category = 'geografia' and question = $q$¿En qué país está el Amazonas?$q$;

update public.questions set
  question_en = $t$What is the most populous country in the world?$t$,
  options_en  = $t$["China","India","United States","Indonesia"]$t$::jsonb,
  context_en  = $t$India overtook China as the most populous country in 2023, with more than 1.4 billion inhabitants.$t$
where category = 'geografia' and question = $q$¿Cuál es el país más poblado del mundo?$q$;

update public.questions set
  question_en = $t$Which country has the most land borders?$t$,
  options_en  = $t$["Russia","China","Brazil","Germany"]$t$::jsonb,
  context_en  = $t$China shares borders with 14 countries, tied with Russia (also 14). China has the longest land border in the world.$t$
where category = 'geografia' and question = $q$¿Qué país tiene más fronteras terrestres?$q$;

update public.questions set
  question_en = $t$What is the highest peak in the Americas?$t$,
  options_en  = $t$["Mont Blanc","Mount McKinley","Aconcagua","Chimborazo"]$t$::jsonb,
  context_en  = $t$Aconcagua (6,960 m) in Argentina is the highest peak in the Americas and the Western Hemisphere.$t$
where category = 'geografia' and question = $q$¿Cuál es el pico más alto de América?$q$;

update public.questions set
  question_en = $t$What is the capital of Canada?$t$,
  options_en  = $t$["Toronto","Vancouver","Montreal","Ottawa"]$t$::jsonb,
  context_en  = $t$Ottawa has been the capital of Canada since 1857. Although Toronto and Montreal are larger, Ottawa was chosen for its position between English and French speakers.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Canadá?$q$;

update public.questions set
  question_en = $t$What is the longest country in the world from north to south?$t$,
  options_en  = $t$["Brazil","Russia","Chile","Argentina"]$t$::jsonb,
  context_en  = $t$Chile is ~4,300 km from north to south but only 177 km wide. It stretches from the Atacama Desert to Patagonia.$t$
where category = 'geografia' and question = $q$¿Cuál es el país más largo del mundo de norte a sur?$q$;

update public.questions set
  question_en = $t$Where is the deepest point in the oceans?$t$,
  options_en  = $t$["Puerto Rico Trench","Mariana Trench","Tonga Trench","Java Trench"]$t$::jsonb,
  context_en  = $t$The Mariana Trench (Pacific) is the deepest point, at 11,034 m in the 'Challenger Deep'. It was first explored in 1960.$t$
where category = 'geografia' and question = $q$¿Dónde está el punto más profundo de los océanos?$q$;

update public.questions set
  question_en = $t$What is the smallest continent?$t$,
  options_en  = $t$["Europe","Antarctica","Australia/Oceania","South America"]$t$::jsonb,
  context_en  = $t$Australia is the smallest continent (7.7 million km²). If Oceania is counted as a continent, it includes thousands of Pacific islands.$t$
where category = 'geografia' and question = $q$¿Cuál es el continente más pequeño?$q$;

update public.questions set
  question_en = $t$Which country has the most islands in the world?$t$,
  options_en  = $t$["Indonesia","Philippines","Greece","Sweden"]$t$::jsonb,
  context_en  = $t$Sweden has more than 220,000 islands. Indonesia has the most extensive and populated islands (17,000 islands), with 6,000 inhabited.$t$
where category = 'geografia' and question = $q$¿Qué país tiene más islas del mundo?$q$;

update public.questions set
  question_en = $t$What is the longest river in South America?$t$,
  options_en  = $t$["Orinoco","Paraná","Río de la Plata","Amazon"]$t$::jsonb,
  context_en  = $t$The Amazon (6,400 km) is the longest river in the Americas and the largest by discharge in the world, accounting for 20% of the fresh water reaching the oceans.$t$
where category = 'geografia' and question = $q$¿Cuál es el río más largo de América del Sur?$q$;

update public.questions set
  question_en = $t$In which country is the city of Dubai?$t$,
  options_en  = $t$["Qatar","Saudi Arabia","United Arab Emirates","Bahrain"]$t$::jsonb,
  context_en  = $t$Dubai is in the United Arab Emirates. It is the most populous city in the country and home to the tallest building in the world: the Burj Khalifa (828 m).$t$
where category = 'geografia' and question = $q$¿En qué país está la ciudad de Dubái?$q$;

update public.questions set
  question_en = $t$What is the capital of Brazil?$t$,
  options_en  = $t$["Rio de Janeiro","São Paulo","Brasília","Salvador"]$t$::jsonb,
  context_en  = $t$Brasília has been the capital of Brazil since 1960, built from scratch to decentralize the country. Rio de Janeiro was the capital until 1960.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Brasil?$q$;

update public.questions set
  question_en = $t$What is the highest volcano in the world?$t$,
  options_en  = $t$["Mount Etna","Mount Fuji","Ojos del Salado","Mauna Loa"]$t$::jsonb,
  context_en  = $t$Ojos del Salado (6,893 m), on the border between Chile and Argentina, is the highest volcano in the world.$t$
where category = 'geografia' and question = $q$¿Cuál es el volcán más alto del mundo?$q$;

update public.questions set
  question_en = $t$In which country is the city of Istanbul?$t$,
  options_en  = $t$["Greece","Bulgaria","Turkey","Armenia"]$t$::jsonb,
  context_en  = $t$Istanbul is in Turkey, straddling Europe and Asia. It was the capital of the Ottoman Empire (Constantinople) and earlier of the Byzantine Empire.$t$
where category = 'geografia' and question = $q$¿En qué país está la ciudad de Estambul?$q$;

update public.questions set
  question_en = $t$What is the largest country in Africa?$t$,
  options_en  = $t$["Nigeria","Sudan","Democratic Republic of the Congo","Algeria"]$t$::jsonb,
  context_en  = $t$Algeria is the largest country in Africa (2.38 million km²), after the division of Sudan in 2011. Its capital is Algiers.$t$
where category = 'geografia' and question = $q$¿Cuál es el país más grande de África?$q$;

update public.questions set
  question_en = $t$How many countries does South America have?$t$,
  options_en  = $t$["10","12","14","16"]$t$::jsonb,
  context_en  = $t$South America has 12 countries: Argentina, Bolivia, Brazil, Chile, Colombia, Ecuador, Guyana, Paraguay, Peru, Suriname, Uruguay and Venezuela.$t$
where category = 'geografia' and question = $q$¿Cuántos países tiene América del Sur?$q$;

update public.questions set
  question_en = $t$What is the highest point in Europe?$t$,
  options_en  = $t$["Mont Blanc","Monte Rosa","Elbrus","Matterhorn"]$t$::jsonb,
  context_en  = $t$Elbrus (5,642 m) in the Russian Caucasus is the highest point in Europe according to many geographers. Mont Blanc (4,808 m) is the highest in the Alps.$t$
where category = 'geografia' and question = $q$¿Cuál es el punto más alto de Europa?$q$;

update public.questions set
  question_en = $t$What is the capital of Argentina?$t$,
  options_en  = $t$["Córdoba","Rosario","Mendoza","Buenos Aires"]$t$::jsonb,
  context_en  = $t$Buenos Aires is the capital of Argentina and the largest city in the country, with about 15 million people in its metropolitan area.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Argentina?$q$;

update public.questions set
  question_en = $t$Which country has the greatest biodiversity in the world?$t$,
  options_en  = $t$["Australia","Indonesia","Brazil","Colombia"]$t$::jsonb,
  context_en  = $t$Brazil is home to 20% of the planet's species. The Amazon is the most biodiverse ecosystem in the world. Colombia is the second most biodiverse country.$t$
where category = 'geografia' and question = $q$¿Qué país tiene la mayor biodiversidad del mundo?$q$;

update public.questions set
  question_en = $t$What is the longest river in Asia?$t$,
  options_en  = $t$["Ganges","Yangtze","Indus","Mekong"]$t$::jsonb,
  context_en  = $t$The Yangtze (6,300 km) is the longest river in Asia and the third in the world. The Three Gorges Dam, the largest in the world, is on this river.$t$
where category = 'geografia' and question = $q$¿Cuál es el río más largo de Asia?$q$;

update public.questions set
  question_en = $t$How many countries are there in Africa?$t$,
  options_en  = $t$["44","50","54","60"]$t$::jsonb,
  context_en  = $t$Africa has 54 recognized countries, making it the continent with the most countries in the world. Nigeria is the most populous and Algeria the largest.$t$
where category = 'geografia' and question = $q$¿Cuántos países hay en África?$q$;

update public.questions set
  question_en = $t$Which strait separates Europe from Africa?$t$,
  options_en  = $t$["Bering Strait","Strait of Magellan","Strait of Gibraltar","English Channel"]$t$::jsonb,
  context_en  = $t$The Strait of Gibraltar separates Spain from Morocco with just 14 km at its narrowest point. It connects the Atlantic with the Mediterranean.$t$
where category = 'geografia' and question = $q$¿Cuál es el estrecho que separa Europa de África?$q$;

update public.questions set
  question_en = $t$Which country has the most official languages?$t$,
  options_en  = $t$["India","Switzerland","Bolivia","South Africa"]$t$::jsonb,
  context_en  = $t$South Africa has 11 official languages: Zulu, Xhosa, Afrikaans, English, Sotho, Tswana, Southern Sotho, Tsonga, Swazi, Venda and Ndebele.$t$
where category = 'geografia' and question = $q$¿Cuál es el país con más lenguas oficiales?$q$;

update public.questions set
  question_en = $t$Where is the Atacama Desert?$t$,
  options_en  = $t$["Argentina","Bolivia","Chile","Peru"]$t$::jsonb,
  context_en  = $t$The Atacama Desert is in Chile, on the Pacific coast. It is the driest non-polar desert in the world: some areas have not recorded rain in centuries.$t$
where category = 'geografia' and question = $q$¿Dónde está el desierto de Atacama?$q$;

update public.questions set
  question_en = $t$What is the highest waterfall in the world?$t$,
  options_en  = $t$["Iguazú Falls","Victoria Falls","Niagara Falls","Angel Falls"]$t$::jsonb,
  context_en  = $t$Angel Falls (Venezuela) is the highest waterfall in the world, with a free fall of 979 m. It was discovered by aviator James Angel in 1933.$t$
where category = 'geografia' and question = $q$¿Cuál es la cascada más alta del mundo?$q$;

update public.questions set
  question_en = $t$Which is the most developed country in the world by HDI?$t$,
  options_en  = $t$["Norway","Switzerland","Denmark","Netherlands"]$t$::jsonb,
  context_en  = $t$Norway usually leads the Human Development Index (HDI). It has the best indicators of health, education and living standards in the world.$t$
where category = 'geografia' and question = $q$¿Cuál es el país más desarrollado del mundo según IDH?$q$;

update public.questions set
  question_en = $t$Which ocean washes the coasts of Spain?$t$,
  options_en  = $t$["Only the Mediterranean","Only the Atlantic","The Atlantic and the Mediterranean","The Atlantic, the Mediterranean and the Cantabrian"]$t$::jsonb,
  context_en  = $t$Spain has coasts on the Atlantic (west and northwest), the Cantabrian Sea (north) and the Mediterranean (east and south). The Cantabrian is technically part of the Atlantic.$t$
where category = 'geografia' and question = $q$¿Qué océano baña las costas de España?$q$;

update public.questions set
  question_en = $t$What is the highest city in the world?$t$,
  options_en  = $t$["Lhasa","Quito","La Paz","Potosí"]$t$::jsonb,
  context_en  = $t$La Paz (Bolivia) at 3,640 m is the highest de facto capital. The Bolivian city of El Alto, at 4,150 m, is the highest large city. La Paz is the seat of government.$t$
where category = 'geografia' and question = $q$¿Cuál es la ciudad más alta del mundo?$q$;

update public.questions set
  question_en = $t$Which country has the most territory in the Arctic?$t$,
  options_en  = $t$["Canada","United States","Norway","Russia"]$t$::jsonb,
  context_en  = $t$Russia has the largest presence in the Arctic, with almost half of its coast on the Arctic Ocean. It has the largest icebreaker fleet in the world.$t$
where category = 'geografia' and question = $q$¿Qué país tiene más territorio en el Ártico?$q$;

update public.questions set
  question_en = $t$What is the capital of Morocco?$t$,
  options_en  = $t$["Casablanca","Marrakech","Fez","Rabat"]$t$::jsonb,
  context_en  = $t$Rabat has been the capital of Morocco since 1912, during the French protectorate. Casablanca is the largest city and economic center.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Marruecos?$q$;

update public.questions set
  question_en = $t$Which continent has no countries?$t$,
  options_en  = $t$["The Arctic","Antarctica","The Amazon","The Sahara"]$t$::jsonb,
  context_en  = $t$Antarctica has no countries or permanent population. It is governed by the Antarctic Treaty (1959), which reserves it for peace and science.$t$
where category = 'geografia' and question = $q$¿Qué continente no tiene países?$q$;

update public.questions set
  question_en = $t$What is the capital of Turkey?$t$,
  options_en  = $t$["Istanbul","Izmir","Bursa","Ankara"]$t$::jsonb,
  context_en  = $t$Ankara has been the capital of Turkey since 1923, when Atatürk chose it for its central position in Anatolia. Istanbul is the largest city.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Turquía?$q$;

update public.questions set
  question_en = $t$Which country has the longest coastline in the world?$t$,
  options_en  = $t$["Russia","Australia","Norway","Canada"]$t$::jsonb,
  context_en  = $t$Canada has the longest coastline in the world (202,080 km), thanks to its thousands of islands and indentations. Russia is second.$t$
where category = 'geografia' and question = $q$¿Qué país tiene la costa más larga del mundo?$q$;

update public.questions set
  question_en = $t$What is the smallest sea in the world?$t$,
  options_en  = $t$["Baltic Sea","Sea of Marmara","Sea of Azov","Dead Sea"]$t$::jsonb,
  context_en  = $t$The Sea of Azov (39,000 km²) is the smallest sea in the world. It lies in southeastern Ukraine and southwestern Russia, connected to the Black Sea.$t$
where category = 'geografia' and question = $q$¿Cuál es el mar más pequeño del mundo?$q$;

update public.questions set
  question_en = $t$What is the capital of Egypt?$t$,
  options_en  = $t$["Alexandria","Giza","Luxor","Cairo"]$t$::jsonb,
  context_en  = $t$Cairo is the capital of Egypt and the largest city in Africa and the Arab world, with about 20 million inhabitants.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Egipto?$q$;

update public.questions set
  question_en = $t$Which country has more than half of its territory below sea level?$t$,
  options_en  = $t$["Belgium","Denmark","Netherlands","Germany"]$t$::jsonb,
  context_en  = $t$The Netherlands has 26% of its territory below sea level. It has built an advanced system of dikes and polders to reclaim land from the sea.$t$
where category = 'geografia' and question = $q$¿Qué país tiene más de la mitad de su territorio bajo el nivel del mar?$q$;

update public.questions set
  question_en = $t$What is the deepest lake in the world?$t$,
  options_en  = $t$["Lake Tanganyika","Lake Superior","Lake Titicaca","Lake Baikal"]$t$::jsonb,
  context_en  = $t$Lake Baikal (Russia) is 1,642 m deep, the deepest in the world. It contains 20% of the world's unfrozen fresh surface water.$t$
where category = 'geografia' and question = $q$¿Cuál es el lago más profundo del mundo?$q$;

update public.questions set
  question_en = $t$Which is the most populous city in Europe?$t$,
  options_en  = $t$["London","Paris","Berlin","Moscow"]$t$::jsonb,
  context_en  = $t$Moscow is the most populous city in Europe, with more than 12 million inhabitants in the city (20 million in the metropolitan area). It is the capital of Russia.$t$
where category = 'geografia' and question = $q$¿Qué ciudad es la más poblada de Europa?$q$;

update public.questions set
  question_en = $t$What is the largest island in the world?$t$,
  options_en  = $t$["Madagascar","Borneo","Greenland","New Guinea"]$t$::jsonb,
  context_en  = $t$Greenland (2.16 million km²) is the largest island in the world. It belongs to Denmark but has wide autonomy. 80% is covered in ice.$t$
where category = 'geografia' and question = $q$¿Cuál es la isla más grande del mundo?$q$;

update public.questions set
  question_en = $t$Which is the richest country in the world by GDP per capita?$t$,
  options_en  = $t$["Switzerland","Norway","Singapore","Luxembourg"]$t$::jsonb,
  context_en  = $t$Luxembourg usually leads the world in GDP per capita, at more than $120,000. Its wealth is based on financial services and steel.$t$
where category = 'geografia' and question = $q$¿Cuál es el país más rico del mundo por PIB per cápita?$q$;

update public.questions set
  question_en = $t$What is the highest mountain in Africa?$t$,
  options_en  = $t$["Mount Kenya","Rwenzori","Kilimanjaro","Ras Dashen"]$t$::jsonb,
  context_en  = $t$Kilimanjaro (5,895 m) in Tanzania is the highest mountain in Africa. It is an inactive volcano with three cones: Kibo, Mawenzi and Shira.$t$
where category = 'geografia' and question = $q$¿Cuál es el monte más alto de África?$q$;

update public.questions set
  question_en = $t$Which sea separates Europe from North Africa?$t$,
  options_en  = $t$["Red Sea","Black Sea","Mediterranean Sea","Caspian Sea"]$t$::jsonb,
  context_en  = $t$The Mediterranean Sea separates Europe from North Africa. It covers 2.5 million km² and is almost an inland sea, with little connection to the oceans.$t$
where category = 'geografia' and question = $q$¿Qué mar separa Europa del norte de África?$q$;

update public.questions set
  question_en = $t$What is the capital of South Korea?$t$,
  options_en  = $t$["Busan","Incheon","Daegu","Seoul"]$t$::jsonb,
  context_en  = $t$Seoul is the capital of South Korea, with more than 10 million inhabitants. It is one of the most technologically advanced cities in the world.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Corea del Sur?$q$;

update public.questions set
  question_en = $t$In which country is the Ganges River?$t$,
  options_en  = $t$["Pakistan","Bangladesh","India","Nepal"]$t$::jsonb,
  context_en  = $t$The Ganges rises in the Himalayas and flows mainly through India before reaching the Bay of Bengal. It is the sacred river of Hinduism.$t$
where category = 'geografia' and question = $q$¿En qué país está el río Ganges?$q$;

update public.questions set
  question_en = $t$What is the lowest point on Earth (on land)?$t$,
  options_en  = $t$["Death Valley","Dead Sea","Lake Assal","Qattara Depression"]$t$::jsonb,
  context_en  = $t$The Dead Sea (Israel/Jordan/Palestine) is 430 m below sea level, the lowest point on dry land. Its high salinity prevents you from sinking.$t$
where category = 'geografia' and question = $q$¿Cuál es el punto más bajo de la Tierra (en tierra)?$q$;

update public.questions set
  question_en = $t$What is the capital of Nigeria?$t$,
  options_en  = $t$["Lagos","Kano","Ibadan","Abuja"]$t$::jsonb,
  context_en  = $t$Abuja has been the capital of Nigeria since 1991, built from scratch to replace Lagos as capital. Lagos remains the largest and most economic city.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Nigeria?$q$;

update public.questions set
  question_en = $t$Which country has the largest oil reserves in the world?$t$,
  options_en  = $t$["Saudi Arabia","Russia","Canada","Venezuela"]$t$::jsonb,
  context_en  = $t$Venezuela has the largest proven oil reserves (303 billion barrels), followed by Saudi Arabia. However, it is difficult to extract.$t$
where category = 'geografia' and question = $q$¿Qué país tiene la mayor reserva de petróleo del mundo?$q$;

update public.questions set
  question_en = $t$What is the capital of Portugal?$t$,
  options_en  = $t$["Porto","Lisbon","Coimbra","Braga"]$t$::jsonb,
  context_en  = $t$Lisbon, located at the mouth of the Tagus River, has been the capital and largest city of Portugal since 1255.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Portugal?$q$;

update public.questions set
  question_en = $t$What is the capital of Germany?$t$,
  options_en  = $t$["Munich","Hamburg","Berlin","Frankfurt"]$t$::jsonb,
  context_en  = $t$Berlin is the capital and largest city of Germany. It became the capital again after reunification in 1990 (previously it was Bonn in West Germany).$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Alemania?$q$;

update public.questions set
  question_en = $t$What is the capital of Italy?$t$,
  options_en  = $t$["Milan","Rome","Florence","Naples"]$t$::jsonb,
  context_en  = $t$Rome, the 'Eternal City', has been the capital of Italy since 1871. It contains the Vatican, seat of the Catholic Church.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Italia?$q$;

update public.questions set
  question_en = $t$What is the capital of Russia?$t$,
  options_en  = $t$["Saint Petersburg","Moscow","Novosibirsk","Kazan"]$t$::jsonb,
  context_en  = $t$Moscow has been the capital of Russia since 1918 (when the Bolsheviks moved it from Saint Petersburg). It is the most populous city in Europe.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Rusia?$q$;

update public.questions set
  question_en = $t$On which continent is Madagascar?$t$,
  options_en  = $t$["Asia","Africa","Oceania","Antarctica"]$t$::jsonb,
  context_en  = $t$Madagascar is an island nation in the Indian Ocean, off the southeast coast of Africa. It is the fourth largest island in the world.$t$
where category = 'geografia' and question = $q$¿En qué continente está Madagascar?$q$;

update public.questions set
  question_en = $t$Which is the largest country in the European Union?$t$,
  options_en  = $t$["Germany","Spain","France","Poland"]$t$::jsonb,
  context_en  = $t$France is the largest country in the EU with about 643,000 km² (including overseas territories), after the departure of the United Kingdom.$t$
where category = 'geografia' and question = $q$¿Cuál es el país más extenso de la Unión Europea?$q$;

update public.questions set
  question_en = $t$Which mountain range separates Europe from Asia?$t$,
  options_en  = $t$["Alps","Carpathians","Urals","Caucasus"]$t$::jsonb,
  context_en  = $t$The Ural Mountains are considered the natural border between Europe and Asia, crossing Russia from north to south.$t$
where category = 'geografia' and question = $q$¿Qué cordillera separa Europa de Asia?$q$;

update public.questions set
  question_en = $t$What is the capital of Sweden?$t$,
  options_en  = $t$["Stockholm","Oslo","Helsinki","Copenhagen"]$t$::jsonb,
  context_en  = $t$Stockholm is the capital and largest city of Sweden, built on 14 islands. Host of the Nobel Prizes (except the Peace Prize).$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Suecia?$q$;

update public.questions set
  question_en = $t$What is the capital of Norway?$t$,
  options_en  = $t$["Stockholm","Oslo","Helsinki","Copenhagen"]$t$::jsonb,
  context_en  = $t$Oslo is the capital and largest city of Norway, located at the end of the Oslofjord. Host of the Nobel Peace Prize.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Noruega?$q$;

update public.questions set
  question_en = $t$What is the capital of Finland?$t$,
  options_en  = $t$["Stockholm","Oslo","Helsinki","Copenhagen"]$t$::jsonb,
  context_en  = $t$Helsinki has been the capital and largest city of Finland since 1812. It is located on the south coast, facing the Gulf of Finland.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Finlandia?$q$;

update public.questions set
  question_en = $t$What is the capital of Denmark?$t$,
  options_en  = $t$["Stockholm","Oslo","Helsinki","Copenhagen"]$t$::jsonb,
  context_en  = $t$Copenhagen is the capital of Denmark, on the island of Zealand. Famous for the Little Mermaid and the Tivoli Gardens.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Dinamarca?$q$;

update public.questions set
  question_en = $t$What is the capital of Belgium?$t$,
  options_en  = $t$["Brussels","Antwerp","Bruges","Ghent"]$t$::jsonb,
  context_en  = $t$Brussels is the capital of Belgium and the de facto seat of the European Union and NATO.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Bélgica?$q$;

update public.questions set
  question_en = $t$What is the capital of the Netherlands?$t$,
  options_en  = $t$["The Hague","Amsterdam","Rotterdam","Utrecht"]$t$::jsonb,
  context_en  = $t$Amsterdam is the constitutional capital of the Netherlands, although the government and royalty reside in The Hague.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Países Bajos?$q$;

update public.questions set
  question_en = $t$What is the capital of Switzerland?$t$,
  options_en  = $t$["Zurich","Geneva","Bern","Basel"]$t$::jsonb,
  context_en  = $t$Bern is the de facto capital of Switzerland (federal city). Switzerland has no official capital declared in its Constitution.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Suiza?$q$;

update public.questions set
  question_en = $t$In which country is the city of Prague?$t$,
  options_en  = $t$["Poland","Czech Republic","Hungary","Slovakia"]$t$::jsonb,
  context_en  = $t$Prague, the 'city of a hundred spires', is the capital and largest city of the Czech Republic. The Vltava River runs through it.$t$
where category = 'geografia' and question = $q$¿En qué país está la ciudad de Praga?$q$;

update public.questions set
  question_en = $t$What is the capital of Hungary?$t$,
  options_en  = $t$["Prague","Budapest","Warsaw","Vienna"]$t$::jsonb,
  context_en  = $t$Budapest was formed in 1873 by the union of Buda, Óbuda and Pest. It is divided by the Danube River.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Hungría?$q$;

update public.questions set
  question_en = $t$In which country is the city of Vienna?$t$,
  options_en  = $t$["Germany","Switzerland","Austria","Hungary"]$t$::jsonb,
  context_en  = $t$Vienna is the capital of Austria, historically the seat of the House of Habsburg and one of the great European musical capitals.$t$
where category = 'geografia' and question = $q$¿En qué país está la ciudad de Viena?$q$;

update public.questions set
  question_en = $t$What is the capital of Poland?$t$,
  options_en  = $t$["Warsaw","Kraków","Gdańsk","Poznań"]$t$::jsonb,
  context_en  = $t$Warsaw is the capital and largest city of Poland, crossed by the Vistula River. It was almost completely destroyed in World War II.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Polonia?$q$;

update public.questions set
  question_en = $t$What is the capital of Greece?$t$,
  options_en  = $t$["Thessaloniki","Athens","Patras","Heraklion"]$t$::jsonb,
  context_en  = $t$Athens, cradle of democracy and Western philosophy, is the capital of Greece. Famous for the Acropolis.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Grecia?$q$;

update public.questions set
  question_en = $t$In which country is the city of Marrakech?$t$,
  options_en  = $t$["Algeria","Tunisia","Morocco","Egypt"]$t$::jsonb,
  context_en  = $t$Marrakech is one of the four imperial cities of Morocco. Known for the Jemaa el-Fnaa square.$t$
where category = 'geografia' and question = $q$¿En qué país está la ciudad de Marrakech?$q$;

update public.questions set
  question_en = $t$What is the capital of Ethiopia?$t$,
  options_en  = $t$["Nairobi","Addis Ababa","Khartoum","Mogadishu"]$t$::jsonb,
  context_en  = $t$Addis Ababa (which in Amharic means 'new flower') is the capital of Ethiopia and the seat of the African Union.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Etiopía?$q$;

update public.questions set
  question_en = $t$What is the capital of Kenya?$t$,
  options_en  = $t$["Nairobi","Mombasa","Kampala","Dar es Salaam"]$t$::jsonb,
  context_en  = $t$Nairobi is the capital and largest city of Kenya. It is the seat of several UN agencies in Africa.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Kenia?$q$;

update public.questions set
  question_en = $t$What is the capital of South Africa (seat of the executive)?$t$,
  options_en  = $t$["Cape Town","Pretoria","Johannesburg","Durban"]$t$::jsonb,
  context_en  = $t$South Africa has three capitals: Pretoria (executive), Cape Town (legislative) and Bloemfontein (judicial).$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Sudáfrica (sede del ejecutivo)?$q$;

update public.questions set
  question_en = $t$In which country is Petra?$t$,
  options_en  = $t$["Egypt","Jordan","Lebanon","Syria"]$t$::jsonb,
  context_en  = $t$Petra, the ancient Nabataean capital carved into the rock, is in Jordan. It has been a World Heritage Site since 1985.$t$
where category = 'geografia' and question = $q$¿En qué país está Petra?$q$;

update public.questions set
  question_en = $t$What is the capital of Israel (internationally recognized)?$t$,
  options_en  = $t$["Jerusalem","Tel Aviv","Haifa","Bethlehem"]$t$::jsonb,
  context_en  = $t$Israel proclaims Jerusalem as its capital, but most states and the UN place its de facto capital in Tel Aviv.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Israel (reconocida internacionalmente)?$q$;

update public.questions set
  question_en = $t$What is the capital of Saudi Arabia?$t$,
  options_en  = $t$["Mecca","Riyadh","Jeddah","Medina"]$t$::jsonb,
  context_en  = $t$Riyadh is the capital and largest city of Saudi Arabia, located in the center of the Arabian Peninsula.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Arabia Saudí?$q$;

update public.questions set
  question_en = $t$What is the capital of Iran?$t$,
  options_en  = $t$["Baghdad","Tehran","Damascus","Istanbul"]$t$::jsonb,
  context_en  = $t$Tehran has been the capital of Iran since 1796. It has about 9 million inhabitants in the city and 16 in the metropolitan area.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Irán?$q$;

update public.questions set
  question_en = $t$What is the capital of Iraq?$t$,
  options_en  = $t$["Baghdad","Tehran","Damascus","Riyadh"]$t$::jsonb,
  context_en  = $t$Baghdad, founded in 762, was the capital of the Abbasid Caliphate. It has been the capital and largest city of Iraq since its independence.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Irak?$q$;

update public.questions set
  question_en = $t$What is the capital of the Philippines?$t$,
  options_en  = $t$["Manila","Jakarta","Hanoi","Bangkok"]$t$::jsonb,
  context_en  = $t$Manila is the capital of the Philippines and the seat of government. The most populous city in the country is Quezon City.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Filipinas?$q$;

update public.questions set
  question_en = $t$What is the capital of Thailand?$t$,
  options_en  = $t$["Hanoi","Bangkok","Jakarta","Manila"]$t$::jsonb,
  context_en  = $t$Bangkok (Krung Thep in Thai) is the capital of Thailand. Its full name is one of the longest in the world.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Tailandia?$q$;

update public.questions set
  question_en = $t$What is the capital of Vietnam?$t$,
  options_en  = $t$["Hanoi","Ho Chi Minh City","Hue","Da Nang"]$t$::jsonb,
  context_en  = $t$Hanoi has been the capital of Vietnam since the 1976 reunification. Ho Chi Minh City (Saigon) is the most populous city.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Vietnam?$q$;

update public.questions set
  question_en = $t$What is the capital of Indonesia?$t$,
  options_en  = $t$["Jakarta","Surabaya","Bandung","Bali"]$t$::jsonb,
  context_en  = $t$Jakarta is the capital of Indonesia, on the island of Java. The government has planned to move the capital to 'Nusantara' in Borneo.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Indonesia?$q$;

update public.questions set
  question_en = $t$What is the capital of Malaysia?$t$,
  options_en  = $t$["Kuala Lumpur","Singapore","Jakarta","Bangkok"]$t$::jsonb,
  context_en  = $t$Kuala Lumpur is the capital and largest city of Malaysia. The Petronas Towers, its emblem, were the tallest in the world (1998-2004).$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Malasia?$q$;

update public.questions set
  question_en = $t$In which country are the Galápagos Islands?$t$,
  options_en  = $t$["Peru","Ecuador","Chile","Colombia"]$t$::jsonb,
  context_en  = $t$The Galápagos are an archipelago of Ecuador in the Pacific. Charles Darwin studied them in 1835, developing his theory of evolution.$t$
where category = 'geografia' and question = $q$¿En qué país están las islas Galápagos?$q$;

update public.questions set
  question_en = $t$What is the capital of Peru?$t$,
  options_en  = $t$["Cuzco","Lima","Arequipa","Trujillo"]$t$::jsonb,
  context_en  = $t$Lima was founded by Francisco Pizarro in 1535 as the 'City of Kings'. It is the capital and largest city of Peru.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Perú?$q$;

update public.questions set
  question_en = $t$What is the capital of Chile?$t$,
  options_en  = $t$["Valparaíso","Santiago","Concepción","Antofagasta"]$t$::jsonb,
  context_en  = $t$Santiago has been the capital of Chile since 1541, although the National Congress has its seat in Valparaíso.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Chile?$q$;

update public.questions set
  question_en = $t$What is the capital of Colombia?$t$,
  options_en  = $t$["Medellín","Bogotá","Cali","Cartagena"]$t$::jsonb,
  context_en  = $t$Bogotá is the capital and largest city of Colombia. Its official name is Bogotá D.C. (Capital District), located at 2,640 m of altitude.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Colombia?$q$;

update public.questions set
  question_en = $t$What is the capital of Venezuela?$t$,
  options_en  = $t$["Maracaibo","Caracas","Valencia","Barquisimeto"]$t$::jsonb,
  context_en  = $t$Caracas is the capital and largest city of Venezuela. It was founded in 1567 by Diego de Losada.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Venezuela?$q$;

update public.questions set
  question_en = $t$What is the capital of Uruguay?$t$,
  options_en  = $t$["Asunción","Montevideo","La Paz","Quito"]$t$::jsonb,
  context_en  = $t$Montevideo is the capital of Uruguay. It is home to about a third of the country's population.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Uruguay?$q$;

update public.questions set
  question_en = $t$What is the capital of Paraguay?$t$,
  options_en  = $t$["Asunción","Montevideo","Sucre","Quito"]$t$::jsonb,
  context_en  = $t$Asunción, founded in 1537, is the capital and largest city of Paraguay. It is one of the oldest cities in South America.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Paraguay?$q$;

update public.questions set
  question_en = $t$What is the capital of Bolivia (seat of government)?$t$,
  options_en  = $t$["Sucre","La Paz","Cochabamba","Santa Cruz"]$t$::jsonb,
  context_en  = $t$La Paz is the seat of government and the most populous city of Bolivia. Sucre is the constitutional capital.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Bolivia (sede de gobierno)?$q$;

update public.questions set
  question_en = $t$What is the capital of Ecuador?$t$,
  options_en  = $t$["Guayaquil","Quito","Cuenca","Loja"]$t$::jsonb,
  context_en  = $t$Quito, located at 2,850 m of altitude, is the capital of Ecuador. It was the first city declared a World Heritage Site by UNESCO (1978).$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Ecuador?$q$;

update public.questions set
  question_en = $t$What is the capital of Cuba?$t$,
  options_en  = $t$["Santiago de Cuba","Havana","Camagüey","Holguín"]$t$::jsonb,
  context_en  = $t$Havana is the capital and largest city of Cuba, founded in 1519. Its historic center is a World Heritage Site.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Cuba?$q$;

update public.questions set
  question_en = $t$What is the capital of Mexico?$t$,
  options_en  = $t$["Guadalajara","Mexico City","Monterrey","Puebla"]$t$::jsonb,
  context_en  = $t$Mexico City (CDMX), founded on the ancient Tenochtitlan, is one of the most populous metropolises in the world.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de México?$q$;

update public.questions set
  question_en = $t$Which country has Reykjavik as its capital?$t$,
  options_en  = $t$["Norway","Sweden","Iceland","Greenland"]$t$::jsonb,
  context_en  = $t$Reykjavik is the capital and largest city of Iceland, as well as the northernmost capital of a state in the world.$t$
where category = 'geografia' and question = $q$¿Qué país tiene como capital Reikiavik?$q$;

update public.questions set
  question_en = $t$In which country is the region of Patagonia?$t$,
  options_en  = $t$["Only Argentina","Only Chile","Argentina and Chile","Bolivia and Peru"]$t$::jsonb,
  context_en  = $t$Patagonia is divided between Argentina (most of it) and Chile, at the southern tip of South America.$t$
where category = 'geografia' and question = $q$¿En qué país está la región de la Patagonia?$q$;

update public.questions set
  question_en = $t$Which mountain range crosses South America from north to south?$t$,
  options_en  = $t$["The Alps","The Andes","The Appalachians","The Rockies"]$t$::jsonb,
  context_en  = $t$The Andes mountain range runs through 7 South American countries for 7,000 km. It is the longest continental mountain range in the world.$t$
where category = 'geografia' and question = $q$¿Qué cordillera atraviesa Sudamérica de norte a sur?$q$;

update public.questions set
  question_en = $t$What is the highest navigable lake in the world?$t$,
  options_en  = $t$["Titicaca","Maracaibo","Nicaragua","Atitlán"]$t$::jsonb,
  context_en  = $t$Lake Titicaca (3,812 m) between Peru and Bolivia is the highest commercially navigable lake in the world.$t$
where category = 'geografia' and question = $q$¿Cuál es el lago más alto del mundo navegable?$q$;

update public.questions set
  question_en = $t$Which strait separates South America from Antarctica?$t$,
  options_en  = $t$["Bering Strait","Drake Passage","Strait of Gibraltar","Strait of Magellan"]$t$::jsonb,
  context_en  = $t$The Drake Passage, between Cape Horn and Antarctica, is famous for its violent storms.$t$
where category = 'geografia' and question = $q$¿Qué estrecho separa Sudamérica de la Antártida?$q$;

update public.questions set
  question_en = $t$In which desert are the highest dunes in the world?$t$,
  options_en  = $t$["Sahara","Atacama","Namib","Gobi"]$t$::jsonb,
  context_en  = $t$In the Namib Desert (Namibia) are some of the highest dunes in the world, such as those of Sossusvlei.$t$
where category = 'geografia' and question = $q$¿En qué desierto se encuentran las dunas más altas del mundo?$q$;

update public.questions set
  question_en = $t$What is the longest river in Africa?$t$,
  options_en  = $t$["Congo","Nile","Niger","Zambezi"]$t$::jsonb,
  context_en  = $t$The Nile, at about 6,650 km, is the longest river in Africa and is often cited as the longest in the world (competing with the Amazon).$t$
where category = 'geografia' and question = $q$¿Cuál es el río más largo de África?$q$;

update public.questions set
  question_en = $t$In which country are Victoria Falls?$t$,
  options_en  = $t$["South Africa","Zimbabwe-Zambia","Tanzania","Kenya"]$t$::jsonb,
  context_en  = $t$Victoria Falls, on the Zambezi River, lie on the border between Zimbabwe and Zambia. Called Mosi-oa-Tunya by the locals.$t$
where category = 'geografia' and question = $q$¿En qué país están las Cataratas Victoria?$q$;

update public.questions set
  question_en = $t$In which country are the Iguazú Falls?$t$,
  options_en  = $t$["Only Brazil","Only Argentina","Argentina and Brazil","Paraguay and Argentina"]$t$::jsonb,
  context_en  = $t$The Iguazú Falls are on the border between Argentina (province of Misiones) and Brazil (Paraná).$t$
where category = 'geografia' and question = $q$¿En qué país están las Cataratas del Iguazú?$q$;

update public.questions set
  question_en = $t$What is the longest mountain range in the world (underwater)?$t$,
  options_en  = $t$["Andes","Himalayas","Mid-Atlantic Ridge","Rockies"]$t$::jsonb,
  context_en  = $t$The Mid-Atlantic Ridge runs through the Atlantic Ocean from north to south, ~16,000 km, forming the boundary between tectonic plates.$t$
where category = 'geografia' and question = $q$¿Cuál es la cordillera más larga del mundo (montaña submarina)?$q$;

update public.questions set
  question_en = $t$Which is the most populous country in Africa?$t$,
  options_en  = $t$["Egypt","Ethiopia","Nigeria","South Africa"]$t$::jsonb,
  context_en  = $t$Nigeria, with more than 220 million inhabitants, is the most populous country in Africa and the sixth in the world.$t$
where category = 'geografia' and question = $q$¿Cuál es el país con más habitantes de África?$q$;

update public.questions set
  question_en = $t$What is the official currency of the United Kingdom?$t$,
  options_en  = $t$["Euro","Pound sterling","Franc","Krone"]$t$::jsonb,
  context_en  = $t$The pound sterling (GBP) is the official currency of the United Kingdom, one of the oldest currencies in continuous use.$t$
where category = 'geografia' and question = $q$¿Cuál es la moneda oficial del Reino Unido?$q$;

update public.questions set
  question_en = $t$Which country is shaped like a boot?$t$,
  options_en  = $t$["Spain","Italy","France","Greece"]$t$::jsonb,
  context_en  = $t$Italy has a characteristic boot shape that extends into the Mediterranean.$t$
where category = 'geografia' and question = $q$¿Qué país tiene forma de bota?$q$;

update public.questions set
  question_en = $t$Which peninsula do Spain and Portugal share?$t$,
  options_en  = $t$["Balkan","Italian","Iberian","Scandinavian"]$t$::jsonb,
  context_en  = $t$Spain and Portugal share the Iberian Peninsula, along with Andorra, Gibraltar and a small part of France.$t$
where category = 'geografia' and question = $q$¿Qué península comparten España y Portugal?$q$;

update public.questions set
  question_en = $t$Which sea separates Spain from Africa?$t$,
  options_en  = $t$["North Sea","Mediterranean Sea","Black Sea","Baltic Sea"]$t$::jsonb,
  context_en  = $t$The Alboran Sea (western part of the Mediterranean) separates Spain from Morocco. The Strait of Gibraltar connects the Mediterranean with the Atlantic.$t$
where category = 'geografia' and question = $q$¿Qué mar separa España de África?$q$;

update public.questions set
  question_en = $t$What is the official currency of Japan?$t$,
  options_en  = $t$["Yuan","Yen","Won","Rupee"]$t$::jsonb,
  context_en  = $t$The yen (¥) has been the official currency of Japan since 1871. It is the third most traded currency in the world.$t$
where category = 'geografia' and question = $q$¿Cuál es la moneda oficial de Japón?$q$;

update public.questions set
  question_en = $t$Which currency does Switzerland use?$t$,
  options_en  = $t$["Euro","Swiss franc","Krone","Pound"]$t$::jsonb,
  context_en  = $t$Switzerland uses the Swiss franc (CHF). It is the only official currency of the country and of Liechtenstein.$t$
where category = 'geografia' and question = $q$¿Qué moneda usa Suiza?$q$;

update public.questions set
  question_en = $t$What is the driest desert in the world?$t$,
  options_en  = $t$["Sahara","Atacama","Gobi","Mojave"]$t$::jsonb,
  context_en  = $t$The Atacama Desert, in northern Chile, is the driest non-polar desert in the world, with areas that have recorded no rain in centuries.$t$
where category = 'geografia' and question = $q$¿Cuál es el desierto más seco del mundo?$q$;

update public.questions set
  question_en = $t$Which ocean current cools the coasts of Chile and Peru?$t$,
  options_en  = $t$["Gulf Stream","Humboldt Current","Kuroshio","Benguela Current"]$t$::jsonb,
  context_en  = $t$The Humboldt Current is a cold current that runs along the west coast of South America. It influences the region's climate and fishing.$t$
where category = 'geografia' and question = $q$¿Qué corriente oceánica enfría las costas de Chile y Perú?$q$;

update public.questions set
  question_en = $t$What is the capital of Singapore?$t$,
  options_en  = $t$["Kuala Lumpur","Bangkok","Singapore","Jakarta"]$t$::jsonb,
  context_en  = $t$Singapore is a city-state: the country and the capital coincide.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Singapur?$q$;

update public.questions set
  question_en = $t$What is the capital of Mongolia?$t$,
  options_en  = $t$["Ulaanbaatar","Astana","Beijing","Tashkent"]$t$::jsonb,
  context_en  = $t$Ulaanbaatar is the capital and largest city of Mongolia, home to nearly half the country's population.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Mongolia?$q$;

update public.questions set
  question_en = $t$What is the capital of Kazakhstan?$t$,
  options_en  = $t$["Almaty","Astana","Tashkent","Baku"]$t$::jsonb,
  context_en  = $t$Astana (briefly renamed Nur-Sultan between 2019 and 2022) has been the capital of Kazakhstan since 1997.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Kazajistán?$q$;

update public.questions set
  question_en = $t$Which ocean washes the east coast of the U.S.?$t$,
  options_en  = $t$["Pacific","Atlantic","Indian","Arctic"]$t$::jsonb,
  context_en  = $t$The east coast of the United States faces the Atlantic Ocean, while the west coast faces the Pacific.$t$
where category = 'geografia' and question = $q$¿Qué océano baña la costa este de EE.UU.?$q$;

update public.questions set
  question_en = $t$Which strait separates Asia from America?$t$,
  options_en  = $t$["Bering Strait","Strait of Magellan","Dardanelles Strait","Strait of Hormuz"]$t$::jsonb,
  context_en  = $t$The Bering Strait, about 82 km wide, separates Russia (Siberia) from the U.S. (Alaska) and connects the Arctic with the Pacific.$t$
where category = 'geografia' and question = $q$¿Qué estrecho separa Asia de América?$q$;

update public.questions set
  question_en = $t$Which strait controls the entrance to the Persian Gulf?$t$,
  options_en  = $t$["Bosphorus","Hormuz","Gibraltar","Malacca"]$t$::jsonb,
  context_en  = $t$The Strait of Hormuz, between Iran and Oman, is a key sea route for the world's oil transport.$t$
where category = 'geografia' and question = $q$¿Qué estrecho controla la entrada al Golfo Pérsico?$q$;

update public.questions set
  question_en = $t$How many islands make up the Japanese archipelago (main ones)?$t$,
  options_en  = $t$["3","4","5","7"]$t$::jsonb,
  context_en  = $t$The four main islands of Japan are Honshu, Hokkaido, Kyushu and Shikoku. The country has a total of about 14,000 islands.$t$
where category = 'geografia' and question = $q$¿Qué islas conforman el archipiélago japonés (principales)?$q$;

update public.questions set
  question_en = $t$Which is the largest Mediterranean island?$t$,
  options_en  = $t$["Sardinia","Sicily","Corsica","Crete"]$t$::jsonb,
  context_en  = $t$Sicily, at about 25,700 km², is the largest island in the Mediterranean. It belongs to Italy.$t$
where category = 'geografia' and question = $q$¿Qué isla mediterránea es la más grande?$q$;

update public.questions set
  question_en = $t$Which country has Helsinki as its capital?$t$,
  options_en  = $t$["Estonia","Finland","Latvia","Sweden"]$t$::jsonb,
  context_en  = $t$Helsinki is the capital and largest city of Finland, located on the south coast facing the Gulf of Finland.$t$
where category = 'geografia' and question = $q$¿Qué país tiene a Helsinki como capital?$q$;

update public.questions set
  question_en = $t$Which mountain range crosses North Africa?$t$,
  options_en  = $t$["Atlas","Carpathians","Pyrenees","Apennines"]$t$::jsonb,
  context_en  = $t$The Atlas Mountains stretch across Morocco, Algeria and Tunisia, separating the Mediterranean coast from the Sahara Desert.$t$
where category = 'geografia' and question = $q$¿Qué cordillera atraviesa el norte de África?$q$;

update public.questions set
  question_en = $t$Which is the smallest country in South America (by area)?$t$,
  options_en  = $t$["Uruguay","Suriname","Ecuador","Paraguay"]$t$::jsonb,
  context_en  = $t$Suriname, at about 163,820 km², is the smallest country in South America. Formerly Dutch Guiana.$t$
where category = 'geografia' and question = $q$¿Cuál es el país más pequeño de Sudamérica (por superficie)?$q$;

update public.questions set
  question_en = $t$Which European country is landlocked?$t$,
  options_en  = $t$["Belgium","Switzerland","Portugal","Denmark"]$t$::jsonb,
  context_en  = $t$Switzerland is landlocked, as are Austria, Hungary, Czechia, Slovakia, Luxembourg, Liechtenstein, San Marino, the Vatican, Belarus, etc.$t$
where category = 'geografia' and question = $q$¿Qué país europeo no tiene salida al mar?$q$;

update public.questions set
  question_en = $t$Which countries are landlocked in South America?$t$,
  options_en  = $t$["Paraguay and Bolivia","Only Bolivia","Only Paraguay","Uruguay"]$t$::jsonb,
  context_en  = $t$Bolivia and Paraguay are the only South American countries without sea access. Bolivia lost it in the War of the Pacific (1879-1884).$t$
where category = 'geografia' and question = $q$¿Qué país no tiene salida al mar en Sudamérica?$q$;

update public.questions set
  question_en = $t$What is the capital of New Zealand?$t$,
  options_en  = $t$["Auckland","Wellington","Christchurch","Hamilton"]$t$::jsonb,
  context_en  = $t$Wellington is the capital of New Zealand, although Auckland is the most populous city.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Nueva Zelanda?$q$;

update public.questions set
  question_en = $t$Which mountain range separates France from Spain?$t$,
  options_en  = $t$["Alps","Pyrenees","Carpathians","Apennines"]$t$::jsonb,
  context_en  = $t$The Pyrenees form the natural border between France and Spain, about 430 km long.$t$
where category = 'geografia' and question = $q$¿Qué cordillera separa Francia de España?$q$;

update public.questions set
  question_en = $t$Which mountain range separates Italy from central Europe?$t$,
  options_en  = $t$["Apennines","Alps","Carpathians","Pyrenees"]$t$::jsonb,
  context_en  = $t$The Alps form a natural barrier between Italy and the rest of central Europe. Mont Blanc (4,808 m) is its highest peak.$t$
where category = 'geografia' and question = $q$¿Qué cordillera separa Italia del centro de Europa?$q$;

update public.questions set
  question_en = $t$Which is the most populous island of Indonesia?$t$,
  options_en  = $t$["Sumatra","Java","Borneo","Sulawesi"]$t$::jsonb,
  context_en  = $t$Java is the most populous island in the world (~150 million). It is home to Indonesia's capital, Jakarta.$t$
where category = 'geografia' and question = $q$¿Qué isla es el mayor archipiélago de Indonesia (más poblada)?$q$;

update public.questions set
  question_en = $t$Which currency does Sweden use?$t$,
  options_en  = $t$["Euro","Swedish krona","Krona","Guilder"]$t$::jsonb,
  context_en  = $t$Sweden, although an EU member, has not adopted the euro. Its currency is the Swedish krona (SEK).$t$
where category = 'geografia' and question = $q$¿Qué moneda usa Suecia?$q$;

update public.questions set
  question_en = $t$What is the official currency of India?$t$,
  options_en  = $t$["Rupee","Yuan","Yen","Dirham"]$t$::jsonb,
  context_en  = $t$The Indian rupee (INR), symbol ₹, is the official currency of India.$t$
where category = 'geografia' and question = $q$¿Cuál es la moneda oficial de la India?$q$;

update public.questions set
  question_en = $t$Which country has Beijing as its capital?$t$,
  options_en  = $t$["Japan","South Korea","China","Vietnam"]$t$::jsonb,
  context_en  = $t$Beijing has been the capital of the People's Republic of China since 1949 and one of the most populous cities in the world.$t$
where category = 'geografia' and question = $q$¿Qué país tiene a Pekín como capital?$q$;

update public.questions set
  question_en = $t$Which Chinese city is the largest by urban population?$t$,
  options_en  = $t$["Beijing","Shanghai","Guangzhou","Shenzhen"]$t$::jsonb,
  context_en  = $t$Shanghai, with more than 25 million inhabitants in the urban area, is the most populous city in China.$t$
where category = 'geografia' and question = $q$¿Qué ciudad china es la mayor por población urbana?$q$;

update public.questions set
  question_en = $t$What is the longest river in West Africa?$t$,
  options_en  = $t$["Senegal","Niger","Volta","Gambia"]$t$::jsonb,
  context_en  = $t$The Niger, at about 4,180 km, is the third longest river in Africa and the main one in West Africa.$t$
where category = 'geografia' and question = $q$¿Cuál es el río más largo de África Occidental?$q$;

update public.questions set
  question_en = $t$In which country is the city of Samarkand?$t$,
  options_en  = $t$["Iran","Uzbekistan","Kazakhstan","Tajikistan"]$t$::jsonb,
  context_en  = $t$Samarkand, a key city on the Silk Road, is in Uzbekistan. It was the capital of Tamerlane's empire.$t$
where category = 'geografia' and question = $q$¿En qué país está la ciudad de Samarcanda?$q$;

update public.questions set
  question_en = $t$In which ocean is Easter Island?$t$,
  options_en  = $t$["Atlantic","Pacific","Indian","Antarctic"]$t$::jsonb,
  context_en  = $t$Easter Island (Rapa Nui) is in the South Pacific. It belongs to Chile and is famous for its moai statues.$t$
where category = 'geografia' and question = $q$¿En qué océano está la isla de Pascua?$q$;

update public.questions set
  question_en = $t$Which country owns Greenland?$t$,
  options_en  = $t$["Norway","Iceland","Denmark","Canada"]$t$::jsonb,
  context_en  = $t$Greenland is an autonomous territory of the Kingdom of Denmark. It is the largest island in the world.$t$
where category = 'geografia' and question = $q$¿Qué país posee Groenlandia?$q$;

update public.questions set
  question_en = $t$Which is the smallest ocean?$t$,
  options_en  = $t$["Atlantic","Indian","Arctic","Antarctic"]$t$::jsonb,
  context_en  = $t$The Arctic Ocean, at about 14 million km², is the smallest and shallowest of the five oceans.$t$
where category = 'geografia' and question = $q$¿Cuál es el océano más pequeño?$q$;

update public.questions set
  question_en = $t$What is the largest lake in Africa?$t$,
  options_en  = $t$["Tanganyika","Victoria","Malawi","Chad"]$t$::jsonb,
  context_en  = $t$Lake Victoria, at about 68,870 km², is the largest lake in Africa and the second largest freshwater lake in the world.$t$
where category = 'geografia' and question = $q$¿Cuál es el lago más grande de África?$q$;

update public.questions set
  question_en = $t$In which country is the Pampas region?$t$,
  options_en  = $t$["Brazil","Argentina","Chile","Uruguay"]$t$::jsonb,
  context_en  = $t$The Pampas is the great Argentine plain (it also extends to Uruguay and southern Brazil). Center of agricultural and livestock production.$t$
where category = 'geografia' and question = $q$¿En qué país está la región de la Pampa?$q$;

update public.questions set
  question_en = $t$What is the capital of Bangladesh?$t$,
  options_en  = $t$["Dhaka","Kolkata","Karachi","Colombo"]$t$::jsonb,
  context_en  = $t$Dhaka is the capital and largest city of Bangladesh, with a metropolitan area of more than 22 million inhabitants.$t$
where category = 'geografia' and question = $q$¿Cuál es la capital de Bangladés?$q$;

update public.questions set
  question_en = $t$Which country has the largest area of tropical forest?$t$,
  options_en  = $t$["Indonesia","Congo","Brazil","Peru"]$t$::jsonb,
  context_en  = $t$Brazil is home to approximately 60% of the Amazon rainforest, the largest tropical forest in the world.$t$
where category = 'geografia' and question = $q$¿Qué país tiene la mayor extensión de bosque tropical?$q$;

update public.questions set
  question_en = $t$Which is the second most populous country in the world?$t$,
  options_en  = $t$["China","India","U.S.","Indonesia"]$t$::jsonb,
  context_en  = $t$Since 2023, India has overtaken China in population. Before that date, China was the most populous and India the second.$t$
where category = 'geografia' and question = $q$¿Cuál es el segundo país más poblado del mundo?$q$;


-- ── ciencia (150) ──
update public.questions set
  question_en = $t$How many elements does the periodic table currently have?$t$,
  options_en  = $t$["108","112","118","124"]$t$::jsonb,
  context_en  = $t$The periodic table has 118 confirmed elements. The last to be added was Oganesson (Og, no. 118), in 2016.$t$
where category = 'ciencia' and question = $q$¿Cuántos elementos tiene la tabla periódica actualmente?$q$;

update public.questions set
  question_en = $t$How fast does light travel in a vacuum?$t$,
  options_en  = $t$["200,000 km/s","300,000 km/s","400,000 km/s","150,000 km/s"]$t$::jsonb,
  context_en  = $t$Light travels at 299,792,458 m/s (~300,000 km/s). This constant 'c' is the speed limit of the universe according to Einstein's relativity.$t$
where category = 'ciencia' and question = $q$¿A qué velocidad viaja la luz en el vacío?$q$;

update public.questions set
  question_en = $t$Who proposed evolution by natural selection?$t$,
  options_en  = $t$["Gregor Mendel","Charles Darwin","Louis Pasteur","Alfred Wallace"]$t$::jsonb,
  context_en  = $t$Darwin published 'On the Origin of Species' in 1859. Alfred Wallace reached similar conclusions in parallel.$t$
where category = 'ciencia' and question = $q$¿Quién propuso la evolución por selección natural?$q$;

update public.questions set
  question_en = $t$What is a diamond made of?$t$,
  options_en  = $t$["Silicon","Carbon","Quartz","Rock crystal"]$t$::jsonb,
  context_en  = $t$A diamond is pure carbon in a cubic structure formed under high pressure. It is the hardest natural material (10 on the Mohs scale).$t$
where category = 'ciencia' and question = $q$¿De qué está hecho el diamante?$q$;

update public.questions set
  question_en = $t$How many bones does the adult human body have?$t$,
  options_en  = $t$["186","206","226","246"]$t$::jsonb,
  context_en  = $t$The adult has 206 bones. At birth we have ~300, which fuse as we grow. The smallest is the stapes and the longest is the femur.$t$
where category = 'ciencia' and question = $q$¿Cuántos huesos tiene el cuerpo humano adulto?$q$;

update public.questions set
  question_en = $t$What is the largest planet in the solar system?$t$,
  options_en  = $t$["Saturn","Uranus","Jupiter","Neptune"]$t$::jsonb,
  context_en  = $t$Jupiter is the largest planet: its mass is 2.5 times the sum of all the other planets. It has at least 95 known moons.$t$
where category = 'ciencia' and question = $q$¿Cuál es el planeta más grande del sistema solar?$q$;

update public.questions set
  question_en = $t$Which scientist formulated the theory of relativity?$t$,
  options_en  = $t$["Isaac Newton","Nikola Tesla","Albert Einstein","Max Planck"]$t$::jsonb,
  context_en  = $t$Einstein formulated special relativity in 1905 and general relativity in 1915. E=mc² is the most famous equation in physics.$t$
where category = 'ciencia' and question = $q$¿Qué científico formuló la teoría de la relatividad?$q$;

update public.questions set
  question_en = $t$What is the chemical symbol for gold?$t$,
  options_en  = $t$["Go","Ag","Au","Or"]$t$::jsonb,
  context_en  = $t$Gold is represented as Au, from the Latin 'aurum'. It is a precious metal with atomic number 79, widely used in jewelry and electronics.$t$
where category = 'ciencia' and question = $q$¿Cuál es el símbolo químico del oro?$q$;

update public.questions set
  question_en = $t$Which planet is known as the 'red planet'?$t$,
  options_en  = $t$["Venus","Mars","Saturn","Pluto"]$t$::jsonb,
  context_en  = $t$Mars is the red planet because of its surface rich in iron oxide. It has the largest volcanoes in the solar system (Olympus Mons).$t$
where category = 'ciencia' and question = $q$¿Qué planeta es conocido como el «planeta rojo»?$q$;

update public.questions set
  question_en = $t$How many chromosomes does a normal human cell have?$t$,
  options_en  = $t$["23","44","46","48"]$t$::jsonb,
  context_en  = $t$Human cells have 46 chromosomes (23 pairs). Gametes (sperm and eggs) have 23. Down syndrome involves 47.$t$
where category = 'ciencia' and question = $q$¿Cuántas cromosomas tiene una célula humana normal?$q$;

update public.questions set
  question_en = $t$Who discovered penicillin?$t$,
  options_en  = $t$["Marie Curie","Alexander Fleming","Louis Pasteur","Joseph Lister"]$t$::jsonb,
  context_en  = $t$Alexander Fleming discovered penicillin in 1928 by noticing that a fungus (Penicillium) killed bacteria on his Petri dish.$t$
where category = 'ciencia' and question = $q$¿Quién descubrió la penicilina?$q$;

update public.questions set
  question_en = $t$What is the chemical formula for water?$t$,
  options_en  = $t$["HO","H2O2","H2O","OH2"]$t$::jsonb,
  context_en  = $t$Water is H₂O: two hydrogen atoms and one oxygen. It is the only compound that naturally exists in all three states of matter.$t$
where category = 'ciencia' and question = $q$¿Cuál es la fórmula química del agua?$q$;

update public.questions set
  question_en = $t$What is photosynthesis?$t$,
  options_en  = $t$["The respiration of animals","The process by which plants produce oxygen and glucose","The reproduction of plants","The digestion of insects"]$t$::jsonb,
  context_en  = $t$Photosynthesis converts CO₂ and water into glucose and oxygen using sunlight. It occurs in the chloroplasts thanks to chlorophyll.$t$
where category = 'ciencia' and question = $q$¿Qué es la fotosíntesis?$q$;

update public.questions set
  question_en = $t$How many planets are there in the solar system?$t$,
  options_en  = $t$["7","8","9","10"]$t$::jsonb,
  context_en  = $t$Since 2006, the solar system has 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune. Pluto was reclassified as a dwarf planet.$t$
where category = 'ciencia' and question = $q$¿Cuántos planetas hay en el sistema solar?$q$;

update public.questions set
  question_en = $t$What is DNA?$t$,
  options_en  = $t$["An immune system protein","The molecule that contains genetic information","A type of cellular fat","A virus"]$t$::jsonb,
  context_en  = $t$DNA (deoxyribonucleic acid) contains the genetic instructions of all living beings. Its double-helix structure was discovered in 1953.$t$
where category = 'ciencia' and question = $q$¿Qué es el ADN?$q$;

update public.questions set
  question_en = $t$What is the most abundant element in the universe?$t$,
  options_en  = $t$["Oxygen","Carbon","Helium","Hydrogen"]$t$::jsonb,
  context_en  = $t$Hydrogen makes up 75% of the normal matter in the universe. Helium is the second. Both formed in the Big Bang.$t$
where category = 'ciencia' and question = $q$¿Cuál es el elemento más abundante en el universo?$q$;

update public.questions set
  question_en = $t$At what temperature does water boil at sea level?$t$,
  options_en  = $t$["90°C","95°C","100°C","105°C"]$t$::jsonb,
  context_en  = $t$Water boils at 100°C at standard atmospheric pressure (1 atm). At higher altitude, pressure is lower and it boils at a lower temperature.$t$
where category = 'ciencia' and question = $q$¿A qué temperatura hierve el agua a nivel del mar?$q$;

update public.questions set
  question_en = $t$Who was Marie Curie?$t$,
  options_en  = $t$["The first female astronaut","The first person to win two Nobel Prizes","The discoverer of DNA","The inventor of the telescope"]$t$::jsonb,
  context_en  = $t$Marie Curie won the Nobel Prize in Physics (1903) and Chemistry (1911). She discovered polonium and radium. She was the first woman to win the Nobel.$t$
where category = 'ciencia' and question = $q$¿Quién fue Marie Curie?$q$;

update public.questions set
  question_en = $t$What does geology study?$t$,
  options_en  = $t$["The stars","The Earth and its rocks","Living beings","The climate"]$t$::jsonb,
  context_en  = $t$Geology studies the composition, structure and history of the Earth. It includes plate tectonics, minerals and fossils.$t$
where category = 'ciencia' and question = $q$¿Qué estudia la geología?$q$;

update public.questions set
  question_en = $t$What is a black hole?$t$,
  options_en  = $t$["A very dark planet","A cold star","A region of space with gravity so intense that nothing can escape","A large comet"]$t$::jsonb,
  context_en  = $t$A black hole is a region where gravity is so intense that not even light can escape. They form when massive stars collapse.$t$
where category = 'ciencia' and question = $q$¿Qué es un agujero negro?$q$;

update public.questions set
  question_en = $t$What is the most abundant gas in Earth's atmosphere?$t$,
  options_en  = $t$["Oxygen","Carbon dioxide","Nitrogen","Argon"]$t$::jsonb,
  context_en  = $t$Nitrogen (N₂) makes up 78% of the atmosphere. Oxygen makes up 21%. The rest are noble gases and CO₂.$t$
where category = 'ciencia' and question = $q$¿Cuál es el gas más abundante en la atmósfera terrestre?$q$;

update public.questions set
  question_en = $t$How many seconds are there in a year?$t$,
  options_en  = $t$["~15 million","~31 million","~52 million","~100 million"]$t$::jsonb,
  context_en  = $t$A year has 365.25 days × 24 h × 3600 s ≈ 31.5 million seconds. That is why every 4 years there is a leap year.$t$
where category = 'ciencia' and question = $q$¿Cuántos segundos tiene un año?$q$;

update public.questions set
  question_en = $t$What is gravity according to Newton?$t$,
  options_en  = $t$["A force of repulsion between masses","A force of attraction between masses","A property of liquids","Air pressure"]$t$::jsonb,
  context_en  = $t$Newton stated in 1687 that gravity is a force of attraction between masses, proportional to them and inversely proportional to the square of the distance.$t$
where category = 'ciencia' and question = $q$¿Qué es la gravedad según Newton?$q$;

update public.questions set
  question_en = $t$What is a stem cell?$t$,
  options_en  = $t$["The most important neuron","A cell that can differentiate into different cell types","The first cell formed in an embryo","A type of red blood cell"]$t$::jsonb,
  context_en  = $t$Stem cells are undifferentiated cells capable of renewing themselves and differentiating into specialized cells. They are key in regenerative medicine.$t$
where category = 'ciencia' and question = $q$¿Qué es la célula madre?$q$;

update public.questions set
  question_en = $t$Which law states 'for every action there is an equal and opposite reaction'?$t$,
  options_en  = $t$["Newton's first law","Newton's second law","Newton's third law","The law of gravity"]$t$::jsonb,
  context_en  = $t$Newton's third law (the action-reaction principle) explains why rockets work: they push gases backward and move forward.$t$
where category = 'ciencia' and question = $q$¿Qué ley dice «a cada acción corresponde una reacción igual y opuesta»?$q$;

update public.questions set
  question_en = $t$What is Avogadro's number approximately?$t$,
  options_en  = $t$["6.02 × 10²³","6.02 × 10¹⁶","3.14 × 10²³","9.81 × 10²³"]$t$::jsonb,
  context_en  = $t$Avogadro's number (6.022 × 10²³) is the amount of atoms, molecules or particles in one mole of any substance.$t$
where category = 'ciencia' and question = $q$¿Cuál es el número de Avogadro aproximado?$q$;

update public.questions set
  question_en = $t$What is nuclear fusion?$t$,
  options_en  = $t$["The splitting of an atomic nucleus","The joining of two nuclei to release energy","The chemical reaction of hydrogen","The fission process in nuclear power plants"]$t$::jsonb,
  context_en  = $t$Nuclear fusion joins light nuclei (hydrogen) to form heavier ones (helium), releasing enormous energy. It is the Sun's energy source.$t$
where category = 'ciencia' and question = $q$¿Qué es la fusión nuclear?$q$;

update public.questions set
  question_en = $t$Which vitamin does the body produce with sunlight?$t$,
  options_en  = $t$["Vitamin A","Vitamin B12","Vitamin C","Vitamin D"]$t$::jsonb,
  context_en  = $t$The skin synthesizes vitamin D when exposed to the sun's UVB rays. It is essential for absorbing calcium and keeping bones healthy.$t$
where category = 'ciencia' and question = $q$¿Qué vitamina produce el cuerpo con la luz solar?$q$;

update public.questions set
  question_en = $t$What is a tsunami?$t$,
  options_en  = $t$["A tropical storm","A giant wave caused by underwater earthquakes","A type of marine tornado","An ocean current"]$t$::jsonb,
  context_en  = $t$A tsunami is a series of ocean waves caused by earthquakes, volcanic eruptions or underwater landslides. They can travel at 800 km/h.$t$
where category = 'ciencia' and question = $q$¿Qué es un tsunami?$q$;

update public.questions set
  question_en = $t$What is the greenhouse effect?$t$,
  options_en  = $t$["The cooling of the atmosphere","The warming of the Earth by gases that trap solar heat","The ozone layer","Cosmic rays"]$t$::jsonb,
  context_en  = $t$The greenhouse effect is the warming of the Earth because gases like CO₂ and water vapor trap solar heat. Without the natural effect, the Earth would be uninhabitable.$t$
where category = 'ciencia' and question = $q$¿Qué es el efecto invernadero?$q$;

update public.questions set
  question_en = $t$What is the Big Bang?$t$,
  options_en  = $t$["The explosion of a supernova","The theory about the origin of the universe ~13.8 billion years ago","A collision between galaxies","The expansion of the universe in the future"]$t$::jsonb,
  context_en  = $t$The Big Bang was the initial event of the universe ~13.8 billion years ago. The universe began in a state of infinite density and temperature and has expanded since then.$t$
where category = 'ciencia' and question = $q$¿Qué es el Big Bang?$q$;

update public.questions set
  question_en = $t$What is quantum mechanics?$t$,
  options_en  = $t$["The physics of planetary motion","The physics that describes the behavior of subatomic particles","Fluid mechanics","Extended relativity theory"]$t$::jsonb,
  context_en  = $t$Quantum mechanics describes the behavior of subatomic particles like electrons and photons. It includes concepts like wave-particle duality and the uncertainty principle.$t$
where category = 'ciencia' and question = $q$¿Qué es la mecánica cuántica?$q$;

update public.questions set
  question_en = $t$What is the symbol for iron on the periodic table?$t$,
  options_en  = $t$["Hr","He","Fe","Ir"]$t$::jsonb,
  context_en  = $t$Iron is represented as Fe, from the Latin 'ferrum'. It has atomic number 26 and is the most abundant metal on Earth.$t$
where category = 'ciencia' and question = $q$¿Cuál es el símbolo del hierro en la tabla periódica?$q$;

update public.questions set
  question_en = $t$What is Einstein's special theory of relativity?$t$,
  options_en  = $t$["Gravity depends on mass","The speed of light is constant and time is relative","All motion is relative to the observer","Energy and mass are equivalent"]$t$::jsonb,
  context_en  = $t$Special relativity (1905) states that the speed of light is constant and that E=mc². Time and space are relative to the observer. There is no absolute space or time.$t$
where category = 'ciencia' and question = $q$¿Qué es la teoría de la relatividad especial de Einstein?$q$;

update public.questions set
  question_en = $t$What is mitosis?$t$,
  options_en  = $t$["Sexual reproduction","The cell division that produces two identical cells","The fusion of two cells","Programmed cell death"]$t$::jsonb,
  context_en  = $t$Mitosis is the cell division process that produces two daughter cells with the same number of chromosomes as the parent cell. It is the basis of growth and repair.$t$
where category = 'ciencia' and question = $q$¿Qué es la mitosis?$q$;

update public.questions set
  question_en = $t$What is mitochondrial DNA?$t$,
  options_en  = $t$["The DNA of the cell nucleus","The DNA of the mitochondria, inherited only through the maternal line","Messenger RNA","The DNA of ribosomes"]$t$::jsonb,
  context_en  = $t$Mitochondrial DNA is inherited exclusively through the maternal line. It is used in population genetics to trace ancestors. 'Mitochondrial Eve' is the common maternal ancestor.$t$
where category = 'ciencia' and question = $q$¿Qué es el ADN mitocondrial?$q$;

update public.questions set
  question_en = $t$Which planet has the most visible rings?$t$,
  options_en  = $t$["Uranus","Jupiter","Neptune","Saturn"]$t$::jsonb,
  context_en  = $t$Saturn's rings are the most visible, composed mainly of ice and rock. They were discovered by Galileo in 1610 (although he could not identify them).$t$
where category = 'ciencia' and question = $q$¿Qué planeta tiene los anillos más visibles?$q$;

update public.questions set
  question_en = $t$What is the ozone layer?$t$,
  options_en  = $t$["A layer of CO₂ in the stratosphere","A layer of ozone gas in the stratosphere that filters UV rays","The outermost layer of the atmosphere","A layer of particles in the troposphere"]$t$::jsonb,
  context_en  = $t$The ozone layer is in the stratosphere (15-35 km). It absorbs 97-99% of the Sun's ultraviolet radiation. CFCs damaged it, but it is recovering since the Montreal Protocol.$t$
where category = 'ciencia' and question = $q$¿Qué es la capa de ozono?$q$;

update public.questions set
  question_en = $t$What is natural selection?$t$,
  options_en  = $t$["The process by which living beings choose a mate","The evolutionary mechanism by which the best adapted survive and reproduce","The random variation of genes","The extinction of species"]$t$::jsonb,
  context_en  = $t$Darwin's natural selection explains how the best-adapted organisms survive and pass on their traits. It is the main mechanism of evolution.$t$
where category = 'ciencia' and question = $q$¿Qué es la selección natural?$q$;

update public.questions set
  question_en = $t$What is the heaviest element on the periodic table?$t$,
  options_en  = $t$["Plutonium","Uranium","Oganesson","Fermium"]$t$::jsonb,
  context_en  = $t$Oganesson (Og, element 118) is the heaviest of the confirmed elements. It is synthetic, radioactive and was first synthesized in 2002.$t$
where category = 'ciencia' and question = $q$¿Cuál es el elemento más pesado de la tabla periódica?$q$;

update public.questions set
  question_en = $t$What is atmospheric pressure?$t$,
  options_en  = $t$["The temperature of the air","The weight of the column of air acting on a surface","The humidity of the air","The speed of the wind"]$t$::jsonb,
  context_en  = $t$Atmospheric pressure is the weight of the air on a surface. At sea level it is ~101,325 Pa (1 atm). It decreases with altitude, which is why water boils sooner in the mountains.$t$
where category = 'ciencia' and question = $q$¿Qué es la presión atmosférica?$q$;

update public.questions set
  question_en = $t$What did Alexander Graham Bell invent?$t$,
  options_en  = $t$["The light bulb","The telephone","The phonograph","The radio"]$t$::jsonb,
  context_en  = $t$Alexander Graham Bell patented the telephone in 1876. However, Elisha Gray filed a similar design the same day. The invention's authorship was disputed.$t$
where category = 'ciencia' and question = $q$¿Qué inventó Alexander Graham Bell?$q$;

update public.questions set
  question_en = $t$What is thermodynamics?$t$,
  options_en  = $t$["The study of heat and its transformation into other forms of energy","Fluid mechanics","The study of electricity","The physics of materials"]$t$::jsonb,
  context_en  = $t$Thermodynamics studies the relationships between heat, work and energy. Its four laws describe how energy behaves in physical systems.$t$
where category = 'ciencia' and question = $q$¿Qué es la termodinámica?$q$;

update public.questions set
  question_en = $t$What is the Pythagorean theorem?$t$,
  options_en  = $t$["The sum of the angles of a triangle is 180°","In a right triangle, the square of the hypotenuse equals the sum of the squares of the legs","The ratio of a circle's circumference to its diameter","The volume of a sphere"]$t$::jsonb,
  context_en  = $t$The Pythagorean theorem (a²+b²=c²) describes the relationship between the sides of a right triangle. It was known in Babylon and India before Greece.$t$
where category = 'ciencia' and question = $q$¿Qué es el teorema de Pitágoras?$q$;

update public.questions set
  question_en = $t$What is an atom?$t$,
  options_en  = $t$["The smallest subatomic particle","The basic unit of matter, made up of a nucleus and electrons","A simple molecule","A type of energy"]$t$::jsonb,
  context_en  = $t$The atom is the basic unit of matter. It has a nucleus (protons and neutrons) surrounded by electrons. It was proposed by Dalton in 1803; its structure was described by Rutherford in 1911.$t$
where category = 'ciencia' and question = $q$¿Qué es un átomo?$q$;

update public.questions set
  question_en = $t$What did Isaac Newton discover under an apple tree (according to legend)?$t$,
  options_en  = $t$["Electricity","The law of gravity","The spectrum of light","The laws of motion"]$t$::jsonb,
  context_en  = $t$The apple tree story (possibly real) led Newton to formulate the law of universal gravitation (1687). According to Voltaire, Newton's niece told it.$t$
where category = 'ciencia' and question = $q$¿Qué descubrió Isaac Newton bajo un manzano (según la leyenda)?$q$;

update public.questions set
  question_en = $t$What is photovoltaics?$t$,
  options_en  = $t$["The production of heat through light","The conversion of sunlight into electricity","Photography with ultraviolet light","Communication with light signals"]$t$::jsonb,
  context_en  = $t$Photovoltaic energy converts sunlight into electricity using silicon solar cells. The photoelectric effect was explained by Einstein (Nobel 1921).$t$
where category = 'ciencia' and question = $q$¿Qué es la fotovoltaica?$q$;

update public.questions set
  question_en = $t$What is the fastest animal in the world?$t$,
  options_en  = $t$["Cheetah","Peregrine falcon","Black marlin","Blue marlin"]$t$::jsonb,
  context_en  = $t$The peregrine falcon (Falco peregrinus) reaches ~389 km/h in a dive. The cheetah is the fastest on land (110 km/h) and the blue marlin in the sea.$t$
where category = 'ciencia' and question = $q$¿Cuál es el animal más rápido del mundo?$q$;

update public.questions set
  question_en = $t$How long does the Earth take to orbit the Sun?$t$,
  options_en  = $t$["364 days","365 days and 6 hours","Exactly 365 days","366 days"]$t$::jsonb,
  context_en  = $t$The Earth takes 365.25 days to orbit the Sun. That is why every 4 years there is a leap year (366 days). The exact year is 365 days, 5 hours, 48 minutes and 46 seconds.$t$
where category = 'ciencia' and question = $q$¿Cuánto tarda la Tierra en dar la vuelta al Sol?$q$;

update public.questions set
  question_en = $t$What is nanotechnology?$t$,
  options_en  = $t$["Robot technology","The technology that works at the nanometric scale (millionths of a mm)","Materials technology","Biotechnology applied to the nano"]$t$::jsonb,
  context_en  = $t$Nanotechnology works at a scale of 1-100 nanometers (millionths of a millimeter). It has applications in medicine, electronics and advanced materials.$t$
where category = 'ciencia' and question = $q$¿Qué es la nanotecnología?$q$;

update public.questions set
  question_en = $t$What is artificial intelligence?$t$,
  options_en  = $t$["Robots with a human appearance","The ability of machines to perform tasks that require human intelligence","Facial recognition software","The simulation of the human brain"]$t$::jsonb,
  context_en  = $t$AI is the simulation of human intelligence processes by machines, especially computer systems. It includes machine learning, neural networks and language processing.$t$
where category = 'ciencia' and question = $q$¿Qué es la inteligencia artificial?$q$;

update public.questions set
  question_en = $t$Which subatomic particle has a negative charge?$t$,
  options_en  = $t$["Proton","Neutron","Electron","Positron"]$t$::jsonb,
  context_en  = $t$The electron has a negative charge and orbits the atomic nucleus. The proton has a positive charge and the neutron is neutral. The positron is the electron's antimatter.$t$
where category = 'ciencia' and question = $q$¿Cuál es la partícula subatómica con carga negativa?$q$;

update public.questions set
  question_en = $t$What is CRISPR?$t$,
  options_en  = $t$["A supercomputer","A precision gene-editing technique","A type of virus","A new-generation antibiotic"]$t$::jsonb,
  context_en  = $t$CRISPR-Cas9 is a gene-editing tool that acts like 'molecular scissors'. It allows DNA to be modified with great precision. Nobel Prize in Chemistry in 2020.$t$
where category = 'ciencia' and question = $q$¿Qué es la CRISPR?$q$;

update public.questions set
  question_en = $t$How many galaxies are estimated to be in the observable universe?$t$,
  options_en  = $t$["About a billion","About 200 billion","About 2 trillion","About 100 million"]$t$::jsonb,
  context_en  = $t$It is estimated that there are ~2 trillion (2×10¹²) galaxies in the observable universe. The Milky Way contains between 200 and 400 billion stars.$t$
where category = 'ciencia' and question = $q$¿Cuántas galaxias se estima que hay en el universo observable?$q$;

update public.questions set
  question_en = $t$What is nuclear fission energy?$t$,
  options_en  = $t$["The joining of light atomic nuclei","The splitting of heavy nuclei that releases energy","The chemical reaction of uranium","The energy of nuclear motion"]$t$::jsonb,
  context_en  = $t$Nuclear fission splits heavy nuclei (uranium, plutonium), releasing great energy. It is the basis of nuclear reactors and the atomic bomb.$t$
where category = 'ciencia' and question = $q$¿Qué es la energía nuclear de fisión?$q$;

update public.questions set
  question_en = $t$How long does sunlight take to reach the Earth?$t$,
  options_en  = $t$["Instantly","About 8 minutes","One hour","30 minutes"]$t$::jsonb,
  context_en  = $t$Light takes ~8 minutes and 20 seconds to travel the 150 million km to Earth. This means we see the Sun as it was 8 minutes ago.$t$
where category = 'ciencia' and question = $q$¿Cuánto tarda la luz del Sol en llegar a la Tierra?$q$;

update public.questions set
  question_en = $t$What is the number π (pi)?$t$,
  options_en  = $t$["The square root of 2","The ratio of a circle's circumference to its diameter","Euler's number","The gravitational constant"]$t$::jsonb,
  context_en  = $t$Pi (π ≈ 3.14159...) is the ratio of the circumference to the diameter of any circle. It is an irrational and transcendental number, with infinite decimals with no pattern.$t$
where category = 'ciencia' and question = $q$¿Qué es el número π (pi)?$q$;

update public.questions set
  question_en = $t$What is the chemical symbol for sodium?$t$,
  options_en  = $t$["So","Sd","Na","S"]$t$::jsonb,
  context_en  = $t$Sodium has the symbol 'Na', from the Latin 'natrium'. It is a very reactive alkali metal.$t$
where category = 'ciencia' and question = $q$¿Cuál es el símbolo químico del sodio?$q$;

update public.questions set
  question_en = $t$What is the most abundant element in the Earth's crust?$t$,
  options_en  = $t$["Iron","Silicon","Oxygen","Aluminum"]$t$::jsonb,
  context_en  = $t$Oxygen makes up approximately 46% by mass of the Earth's crust, followed by silicon (28%) and aluminum (8%).$t$
where category = 'ciencia' and question = $q$¿Cuál es el elemento más abundante en la corteza terrestre?$q$;

update public.questions set
  question_en = $t$Which unit measures electric current?$t$,
  options_en  = $t$["Volt","Ohm","Ampere","Watt"]$t$::jsonb,
  context_en  = $t$The ampere (A) measures electric current. Its name honors the French physicist André-Marie Ampère.$t$
where category = 'ciencia' and question = $q$¿Qué unidad mide la corriente eléctrica?$q$;

update public.questions set
  question_en = $t$Which unit measures pressure in the SI?$t$,
  options_en  = $t$["Bar","Pascal","Atmosphere","Torr"]$t$::jsonb,
  context_en  = $t$The pascal (Pa = N/m²) is the pressure unit of the International System. Standard atmospheric pressure is 101,325 Pa.$t$
where category = 'ciencia' and question = $q$¿Qué unidad mide la presión en el SI?$q$;

update public.questions set
  question_en = $t$Which unit measures frequency?$t$,
  options_en  = $t$["Watt","Hertz","Newton","Joule"]$t$::jsonb,
  context_en  = $t$The hertz (Hz) measures cycles per second. It is named after the physicist Heinrich Hertz.$t$
where category = 'ciencia' and question = $q$¿Qué unidad mide la frecuencia?$q$;

update public.questions set
  question_en = $t$Which subatomic particle has a positive charge?$t$,
  options_en  = $t$["Electron","Proton","Neutron","Photon"]$t$::jsonb,
  context_en  = $t$The proton has a positive charge (+1) and is found in the nucleus of the atom.$t$
where category = 'ciencia' and question = $q$¿Qué partícula subatómica tiene carga positiva?$q$;

update public.questions set
  question_en = $t$Who formulated the laws of motion of bodies?$t$,
  options_en  = $t$["Galileo","Newton","Einstein","Kepler"]$t$::jsonb,
  context_en  = $t$Isaac Newton formulated the three laws of motion in his 'Principia Mathematica' (1687).$t$
where category = 'ciencia' and question = $q$¿Quién formuló las leyes del movimiento de los cuerpos?$q$;

update public.questions set
  question_en = $t$Which property describes the amount of matter in a body?$t$,
  options_en  = $t$["Weight","Volume","Mass","Density"]$t$::jsonb,
  context_en  = $t$Mass is the amount of matter. It is measured in kilograms. It is not the same as weight (a force).$t$
where category = 'ciencia' and question = $q$¿Qué propiedad describe la cantidad de materia de un cuerpo?$q$;

update public.questions set
  question_en = $t$What is an isotope?$t$,
  options_en  = $t$["An atom with the same atomic number, different mass number","A molecule","A radioactive element","A compound"]$t$::jsonb,
  context_en  = $t$Isotopes are atoms of the same element with the same number of protons but a different number of neutrons.$t$
where category = 'ciencia' and question = $q$¿Qué es un isótopo?$q$;

update public.questions set
  question_en = $t$What type of bond does water form between its molecules?$t$,
  options_en  = $t$["Ionic","Covalent","Hydrogen bond","Metallic"]$t$::jsonb,
  context_en  = $t$Water molecules attract each other through hydrogen bonds, which explains many of their unusual properties.$t$
where category = 'ciencia' and question = $q$¿Qué tipo de enlace forma el agua entre sus moléculas?$q$;

update public.questions set
  question_en = $t$How many chemical elements are noble gases?$t$,
  options_en  = $t$["4","5","6","7"]$t$::jsonb,
  context_en  = $t$The noble gases are 6 classic elements: helium, neon, argon, krypton, xenon and radon. Oganesson (the 7th) was synthesized in 2002.$t$
where category = 'ciencia' and question = $q$¿Cuántos elementos químicos forman parte de los gases nobles?$q$;

update public.questions set
  question_en = $t$Which particle is responsible for transmitting the electromagnetic force?$t$,
  options_en  = $t$["Gluon","Photon","W boson","Higgs boson"]$t$::jsonb,
  context_en  = $t$The photon is the mediating particle of the electromagnetic interaction. It is the 'particle' of light.$t$
where category = 'ciencia' and question = $q$¿Qué partícula es responsable de transmitir la fuerza electromagnética?$q$;

update public.questions set
  question_en = $t$Who discovered the electron?$t$,
  options_en  = $t$["Rutherford","J.J. Thomson","Bohr","Planck"]$t$::jsonb,
  context_en  = $t$J.J. Thomson discovered the electron in 1897 through experiments with cathode rays. Nobel Prize in Physics 1906.$t$
where category = 'ciencia' and question = $q$¿Quién descubrió el electrón?$q$;

update public.questions set
  question_en = $t$Who proposed the atomic model with a central nucleus?$t$,
  options_en  = $t$["Bohr","Rutherford","Dalton","Schrödinger"]$t$::jsonb,
  context_en  = $t$Ernest Rutherford proposed the nuclear model of the atom in 1911 after his famous experiment with gold foils.$t$
where category = 'ciencia' and question = $q$¿Quién propuso el modelo atómico con núcleo central?$q$;

update public.questions set
  question_en = $t$Which phenomenon does the Doppler effect describe?$t$,
  options_en  = $t$["Apparent variation in frequency","Refraction","Polarization","Interference"]$t$::jsonb,
  context_en  = $t$The Doppler effect explains the apparent variation in the frequency of a wave when there is relative motion between source and observer.$t$
where category = 'ciencia' and question = $q$¿Qué fenómeno describe el efecto Doppler?$q$;

update public.questions set
  question_en = $t$What is entropy?$t$,
  options_en  = $t$["A measure of disorder","An energy","A force","A temperature"]$t$::jsonb,
  context_en  = $t$In thermodynamics, entropy measures the degree of disorder of a system. The 2nd law says it tends to increase.$t$
where category = 'ciencia' and question = $q$¿Qué es la entropía?$q$;

update public.questions set
  question_en = $t$Which formula sums up energy-mass in relativity?$t$,
  options_en  = $t$["E=mc","E=mc²","E=½mv²","F=ma"]$t$::jsonb,
  context_en  = $t$Einstein's famous equation E=mc² shows the equivalence between mass and energy. c is the speed of light.$t$
where category = 'ciencia' and question = $q$¿Qué fórmula resume la energía-masa en relatividad?$q$;

update public.questions set
  question_en = $t$Who stated the uncertainty principle?$t$,
  options_en  = $t$["Bohr","Heisenberg","Schrödinger","Pauli"]$t$::jsonb,
  context_en  = $t$Werner Heisenberg formulated the uncertainty principle in 1927: one cannot precisely know both the position and momentum of a particle at the same time.$t$
where category = 'ciencia' and question = $q$¿Quién enunció el principio de incertidumbre?$q$;

update public.questions set
  question_en = $t$Which equation describes the quantum wave?$t$,
  options_en  = $t$["Maxwell's equation","Schrödinger's equation","Dirac's equation","Boltzmann's equation"]$t$::jsonb,
  context_en  = $t$The Schrödinger equation (1926) describes the temporal evolution of the wave function of a quantum system.$t$
where category = 'ciencia' and question = $q$¿Qué ecuación describe la onda cuántica?$q$;

update public.questions set
  question_en = $t$Which unit measures the amount of substance?$t$,
  options_en  = $t$["Mole","Gram","Liter","Newton"]$t$::jsonb,
  context_en  = $t$The mole is the SI unit of amount of substance. One mole contains 6.022 × 10²³ elementary entities.$t$
where category = 'ciencia' and question = $q$¿Qué unidad mide la cantidad de sustancia?$q$;

update public.questions set
  question_en = $t$What is the pH of pure water at 25 °C?$t$,
  options_en  = $t$["5","6","7","8"]$t$::jsonb,
  context_en  = $t$Pure water has a pH of 7 at 25 °C, considered neutral. Below that it is acidic and above it is basic.$t$
where category = 'ciencia' and question = $q$¿Cuál es el pH del agua pura a 25 °C?$q$;

update public.questions set
  question_en = $t$What type of mixture is air?$t$,
  options_en  = $t$["A compound","A homogeneous mixture","A pure substance","A heterogeneous mixture"]$t$::jsonb,
  context_en  = $t$Air is a homogeneous mixture of gases: ~78% nitrogen, ~21% oxygen and traces of other gases.$t$
where category = 'ciencia' and question = $q$¿Qué tipo de mezcla es el aire?$q$;

update public.questions set
  question_en = $t$What is sublimation?$t$,
  options_en  = $t$["The change from solid to liquid","The change from solid to gas","The change from liquid to gas","The change from gas to solid"]$t$::jsonb,
  context_en  = $t$Sublimation is the direct change from solid to gas, without passing through the liquid phase. E.g.: dry ice (solid CO₂).$t$
where category = 'ciencia' and question = $q$¿Qué es la sublimación?$q$;

update public.questions set
  question_en = $t$Which metal is liquid at room temperature?$t$,
  options_en  = $t$["Lead","Mercury","Copper","Silver"]$t$::jsonb,
  context_en  = $t$Mercury (Hg) is the only metal that is liquid at room temperature. Gallium also melts at ~30 °C.$t$
where category = 'ciencia' and question = $q$¿Qué metal es líquido a temperatura ambiente?$q$;

update public.questions set
  question_en = $t$How many faces does a dodecahedron have?$t$,
  options_en  = $t$["10","12","14","16"]$t$::jsonb,
  context_en  = $t$The regular dodecahedron has 12 pentagonal faces, 20 vertices and 30 edges. It is one of the five Platonic solids.$t$
where category = 'ciencia' and question = $q$¿Cuántos lados tiene un dodecaedro?$q$;

update public.questions set
  question_en = $t$How many faces does an icosahedron have?$t$,
  options_en  = $t$["16","20","24","30"]$t$::jsonb,
  context_en  = $t$The regular icosahedron has 20 triangular faces, 12 vertices and 30 edges. It is one of the Platonic solids.$t$
where category = 'ciencia' and question = $q$¿Cuántos lados tiene un icosaedro?$q$;

update public.questions set
  question_en = $t$How many faces does an octahedron have?$t$,
  options_en  = $t$["6","7","8","10"]$t$::jsonb,
  context_en  = $t$The regular octahedron has 8 triangular faces, 6 vertices and 12 edges.$t$
where category = 'ciencia' and question = $q$¿Cuántos lados tiene un octaedro?$q$;

update public.questions set
  question_en = $t$What is the number e (Euler's constant) approximately?$t$,
  options_en  = $t$["2.71","3.14","1.41","1.61"]$t$::jsonb,
  context_en  = $t$The number e ≈ 2.71828 is the base of the natural logarithm and appears in many contexts of exponential growth.$t$
where category = 'ciencia' and question = $q$¿Qué número es e (constante de Euler) aproximadamente?$q$;

update public.questions set
  question_en = $t$Which number is called the 'golden ratio'?$t$,
  options_en  = $t$["π","e","φ (phi)","i"]$t$::jsonb,
  context_en  = $t$The golden ratio φ ≈ 1.618 appears in many contexts of art, nature and mathematics.$t$
where category = 'ciencia' and question = $q$¿Qué número se llama "razón áurea"?$q$;

update public.questions set
  question_en = $t$Which theorem relates the sides of a right triangle?$t$,
  options_en  = $t$["Thales's theorem","Pythagorean theorem","Law of cosines","Fundamental theorem"]$t$::jsonb,
  context_en  = $t$The Pythagorean theorem: in a right triangle, a² + b² = c² (where c is the hypotenuse).$t$
where category = 'ciencia' and question = $q$¿Qué teorema relaciona los lados de un triángulo rectángulo?$q$;

update public.questions set
  question_en = $t$What is the formula for the area of a circle?$t$,
  options_en  = $t$["2πr","πr²","πd","2π"]$t$::jsonb,
  context_en  = $t$The area of a circle is A = π × r². The circumference is C = 2πr.$t$
where category = 'ciencia' and question = $q$¿Cuál es la fórmula para el área del círculo?$q$;

update public.questions set
  question_en = $t$How many degrees do the interior angles of a triangle add up to?$t$,
  options_en  = $t$["90°","180°","270°","360°"]$t$::jsonb,
  context_en  = $t$The sum of the interior angles of any triangle (in Euclidean geometry) is 180°.$t$
where category = 'ciencia' and question = $q$¿Cuántos grados tiene la suma de los ángulos internos de un triángulo?$q$;

update public.questions set
  question_en = $t$How many degrees do the interior angles of a quadrilateral add up to?$t$,
  options_en  = $t$["180°","270°","360°","540°"]$t$::jsonb,
  context_en  = $t$The interior angles of a quadrilateral add up to 360°. In general, for an n-sided polygon: (n-2) × 180°.$t$
where category = 'ciencia' and question = $q$¿Cuántos grados suman los ángulos interiores de un cuadrilátero?$q$;

update public.questions set
  question_en = $t$What is the smallest prime number?$t$,
  options_en  = $t$["1","2","3","5"]$t$::jsonb,
  context_en  = $t$2 is the first prime number and the only even prime. 1 is not considered prime by convention.$t$
where category = 'ciencia' and question = $q$¿Cuál es el número primo más pequeño?$q$;

update public.questions set
  question_en = $t$Who is considered the father of geometry?$t$,
  options_en  = $t$["Pythagoras","Euclid","Thales","Archimedes"]$t$::jsonb,
  context_en  = $t$Euclid (3rd century BC) wrote 'The Elements', a foundational work of classical geometry.$t$
where category = 'ciencia' and question = $q$¿Quién es considerado el padre de la geometría?$q$;

update public.questions set
  question_en = $t$Who created infinitesimal calculus independently besides Newton?$t$,
  options_en  = $t$["Leibniz","Euler","Gauss","Pascal"]$t$::jsonb,
  context_en  = $t$Gottfried Wilhelm Leibniz developed calculus independently of Newton. His notation (dx/dy, ∫) is the one used today.$t$
where category = 'ciencia' and question = $q$¿Quién creó el cálculo infinitesimal de forma independiente además de Newton?$q$;

update public.questions set
  question_en = $t$What is a supermassive black hole?$t$,
  options_en  = $t$["A small hole","A black hole of millions of solar masses","A cluster of stars","A galaxy"]$t$::jsonb,
  context_en  = $t$Supermassive black holes, with masses of millions to billions of suns, are found at the center of most galaxies.$t$
where category = 'ciencia' and question = $q$¿Qué es un agujero negro supermasivo?$q$;

update public.questions set
  question_en = $t$How much heat is needed to raise one gram of water by 1 °C?$t$,
  options_en  = $t$["1 joule","1 calorie","1 kJ","1 kWh"]$t$::jsonb,
  context_en  = $t$The calorie was defined as the heat needed to raise one gram of water by 1 °C. It is equivalent to ~4.184 joules.$t$
where category = 'ciencia' and question = $q$¿Qué cantidad de calor se necesita para elevar 1 °C un gramo de agua?$q$;

update public.questions set
  question_en = $t$Which hormone regulates blood sugar?$t$,
  options_en  = $t$["Insulin","Adrenaline","Cortisol","Thyroxine"]$t$::jsonb,
  context_en  = $t$Insulin, produced in the pancreas, regulates blood glucose by allowing glucose to enter cells.$t$
where category = 'ciencia' and question = $q$¿Qué hormona regula el azúcar en sangre?$q$;

update public.questions set
  question_en = $t$What is cold fusion?$t$,
  options_en  = $t$["Nuclear fusion at room temperature","Freezing","The melting of glaciers","Welding"]$t$::jsonb,
  context_en  = $t$Cold fusion would be a hypothetical nuclear fusion at room temperature. Today there is no reproducible evidence to demonstrate it.$t$
where category = 'ciencia' and question = $q$¿Qué es la fusión fría?$q$;

update public.questions set
  question_en = $t$What is dark matter?$t$,
  options_en  = $t$["Matter that does not emit light","Antimatter","Volcanic matter","Plasma matter"]$t$::jsonb,
  context_en  = $t$Dark matter is a hypothetical form of matter that does not interact electromagnetically. It makes up ~27% of the universe.$t$
where category = 'ciencia' and question = $q$¿Qué es la materia oscura?$q$;

update public.questions set
  question_en = $t$What is antimatter?$t$,
  options_en  = $t$["Matter with opposite charges","Matter without mass","Dark energy","Condensed matter"]$t$::jsonb,
  context_en  = $t$Antimatter is made up of antiparticles (with opposite charge to normal ones). When it meets matter, it annihilates, releasing energy.$t$
where category = 'ciencia' and question = $q$¿Qué es la antimateria?$q$;

update public.questions set
  question_en = $t$Which unit measures energy in the SI?$t$,
  options_en  = $t$["Newton","Pascal","Joule","Watt"]$t$::jsonb,
  context_en  = $t$The joule (J) is the unit of energy and work in the SI. 1 J = 1 N·m.$t$
where category = 'ciencia' and question = $q$¿Qué unidad mide la energía en el SI?$q$;

update public.questions set
  question_en = $t$Which type of radiation has the longest wavelength?$t$,
  options_en  = $t$["X-rays","Ultraviolet","Microwaves","Gamma rays"]$t$::jsonb,
  context_en  = $t$Among the options, microwaves have the longest wavelength (cm-mm). Gamma rays have the shortest.$t$
where category = 'ciencia' and question = $q$¿Qué tipo de radiación tiene mayor longitud de onda?$q$;

update public.questions set
  question_en = $t$Who said 'E pur si muove' according to tradition?$t$,
  options_en  = $t$["Newton","Copernicus","Galileo","Kepler"]$t$::jsonb,
  context_en  = $t$According to tradition, Galileo Galilei said 'And yet it moves' after recanting the heliocentric theory before the Inquisition.$t$
where category = 'ciencia' and question = $q$¿Quién dijo "E pur si muove" según la tradición?$q$;

update public.questions set
  question_en = $t$What did Mendeleev discover in 1869?$t$,
  options_en  = $t$["The periodic table","The electron","Radioactivity","X-rays"]$t$::jsonb,
  context_en  = $t$Dmitri Mendeleev published the first periodic table in 1869, ordering the elements by their chemical properties.$t$
where category = 'ciencia' and question = $q$¿Qué descubrió Mendeléyev en 1869?$q$;

update public.questions set
  question_en = $t$Which is the element with atomic number 1?$t$,
  options_en  = $t$["Helium","Hydrogen","Lithium","Carbon"]$t$::jsonb,
  context_en  = $t$Hydrogen (H) has atomic number 1: one proton. It is the most abundant element in the universe.$t$
where category = 'ciencia' and question = $q$¿Cuál es el elemento con número atómico 1?$q$;

update public.questions set
  question_en = $t$How many protons does a carbon atom have?$t$,
  options_en  = $t$["4","6","8","12"]$t$::jsonb,
  context_en  = $t$Carbon has 6 protons (atomic number 6). The most common isotope is ¹²C, with 6 protons and 6 neutrons.$t$
where category = 'ciencia' and question = $q$¿Cuántos protones tiene el átomo de carbono?$q$;

update public.questions set
  question_en = $t$Which unit measures absorbed radiation?$t$,
  options_en  = $t$["Becquerel","Sievert","Gray","Curie"]$t$::jsonb,
  context_en  = $t$The gray (Gy) measures the absorbed dose of ionizing radiation. The sievert (Sv) measures the equivalent dose (biological effects).$t$
where category = 'ciencia' and question = $q$¿Qué unidad mide la radiación absorbida?$q$;

update public.questions set
  question_en = $t$Who discovered radioactivity?$t$,
  options_en  = $t$["Becquerel","Marie Curie","Roentgen","Rutherford"]$t$::jsonb,
  context_en  = $t$Henri Becquerel discovered radioactivity in uranium salts in 1896. He shared the Nobel with the Curies in 1903.$t$
where category = 'ciencia' and question = $q$¿Quién descubrió la radiactividad?$q$;

update public.questions set
  question_en = $t$Which element did Marie and Pierre Curie discover in 1898 along with polonium?$t$,
  options_en  = $t$["Plutonium","Radium","Uranium","Cesium"]$t$::jsonb,
  context_en  = $t$The Curies isolated radium (Ra) and polonium (Po, named after Poland) in 1898 from pitchblende.$t$
where category = 'ciencia' and question = $q$¿Qué elemento descubrieron Marie y Pierre Curie en 1898 junto al polonio?$q$;

update public.questions set
  question_en = $t$Which property describes the expansion of a body when heated?$t$,
  options_en  = $t$["Conductivity","Coefficient of expansion","Heat capacity","Diffusivity"]$t$::jsonb,
  context_en  = $t$The coefficient of expansion describes how much the volume or length of a material changes for each degree of temperature variation.$t$
where category = 'ciencia' and question = $q$¿Qué propiedad describe la dilatación de un cuerpo al calentarse?$q$;

update public.questions set
  question_en = $t$Which phenomenon produces the rainbow?$t$,
  options_en  = $t$["Reflection","Refraction and dispersion","Diffraction","Polarization"]$t$::jsonb,
  context_en  = $t$The rainbow forms through the refraction, internal reflection and dispersion of sunlight in water drops.$t$
where category = 'ciencia' and question = $q$¿Qué fenómeno produce el arco iris?$q$;

update public.questions set
  question_en = $t$Which unit measures power?$t$,
  options_en  = $t$["Newton","Pascal","Watt","Joule"]$t$::jsonb,
  context_en  = $t$The watt (W) is the unit of power in the SI. 1 W = 1 J/s.$t$
where category = 'ciencia' and question = $q$¿Qué unidad mide la potencia?$q$;

update public.questions set
  question_en = $t$At what temperature does ice melt at atmospheric pressure?$t$,
  options_en  = $t$["-10 °C","0 °C","5 °C","-5 °C"]$t$::jsonb,
  context_en  = $t$Water melts (and freezes) at 0 °C at 1 atm of pressure. It is the lower reference point of the Celsius scale.$t$
where category = 'ciencia' and question = $q$¿A qué temperatura se funde el hielo a presión atmosférica?$q$;

update public.questions set
  question_en = $t$What type of wave is sound?$t$,
  options_en  = $t$["Electromagnetic","Mechanical longitudinal","Mechanical transverse","Standing"]$t$::jsonb,
  context_en  = $t$Sound is a longitudinal mechanical wave that requires a material medium (air, water, solids) to propagate.$t$
where category = 'ciencia' and question = $q$¿Qué tipo de onda es el sonido?$q$;

update public.questions set
  question_en = $t$How fast does sound travel in air (approx.)?$t$,
  options_en  = $t$["100 m/s","340 m/s","1,000 m/s","3,000 m/s"]$t$::jsonb,
  context_en  = $t$Sound travels at ~343 m/s in air at 20 °C. In water, ~1,480 m/s; in steel, ~5,000 m/s.$t$
where category = 'ciencia' and question = $q$¿A qué velocidad viaja el sonido en el aire (~aprox.)?$q$;

update public.questions set
  question_en = $t$Which property describes the opposition to the flow of electric current?$t$,
  options_en  = $t$["Resistance","Voltage","Power","Capacitance"]$t$::jsonb,
  context_en  = $t$Electrical resistance, measured in ohms (Ω), describes the opposition to the flow of current. Ohm's law: V = I × R.$t$
where category = 'ciencia' and question = $q$¿Qué propiedad describe la oposición al paso de la corriente eléctrica?$q$;

update public.questions set
  question_en = $t$Who stated Ohm's law?$t$,
  options_en  = $t$["Faraday","Ohm","Volta","Ampère"]$t$::jsonb,
  context_en  = $t$Georg Simon Ohm formulated his law in 1827, relating voltage, current and resistance: V = I · R.$t$
where category = 'ciencia' and question = $q$¿Quién enunció la ley de Ohm?$q$;

update public.questions set
  question_en = $t$What did Alessandro Volta invent?$t$,
  options_en  = $t$["The light bulb","The electric battery","The engine","The telegraph"]$t$::jsonb,
  context_en  = $t$Volta invented the voltaic pile in 1800, the first electric battery. The unit of voltage, the volt, is named after him.$t$
where category = 'ciencia' and question = $q$¿Qué inventó Alessandro Volta?$q$;

update public.questions set
  question_en = $t$Which law describes the attraction between two masses?$t$,
  options_en  = $t$["Hooke's law","Law of universal gravitation","Coulomb's law","Faraday's law"]$t$::jsonb,
  context_en  = $t$Newton's law of universal gravitation: F = G · m₁ · m₂ / r².$t$
where category = 'ciencia' and question = $q$¿Qué ley describe la atracción entre dos masas?$q$;

update public.questions set
  question_en = $t$What type of rock is granite?$t$,
  options_en  = $t$["Sedimentary","Metamorphic","Igneous","Extrusive volcanic"]$t$::jsonb,
  context_en  = $t$Granite is an intrusive (plutonic) igneous rock formed by the slow cooling of magma beneath the surface.$t$
where category = 'ciencia' and question = $q$¿Qué tipo de roca es el granito?$q$;

update public.questions set
  question_en = $t$What is the name of the supercontinent that existed ~250 million years ago?$t$,
  options_en  = $t$["Gondwana","Pangaea","Laurasia","Eurasia"]$t$::jsonb,
  context_en  = $t$Pangaea was the supercontinent that grouped almost all the land mass. It fragmented into the present-day continents.$t$
where category = 'ciencia' and question = $q$¿Cómo se llama el supercontinente que existió hace ~250 millones de años?$q$;

update public.questions set
  question_en = $t$How many major tectonic plates are there?$t$,
  options_en  = $t$["5","7","10","15"]$t$::jsonb,
  context_en  = $t$Seven major tectonic plates are recognized: African, Antarctic, Eurasian, North American, South American, Indo-Australian and Pacific.$t$
where category = 'ciencia' and question = $q$¿Cuántas placas tectónicas mayores hay?$q$;

update public.questions set
  question_en = $t$Which internal organ is in charge of pumping blood?$t$,
  options_en  = $t$["Kidney","Lung","Heart","Liver"]$t$::jsonb,
  context_en  = $t$The heart pumps about 5 liters of blood per minute at rest. It beats around 100,000 times a day.$t$
where category = 'ciencia' and question = $q$¿Cuál es el órgano interno encargado de bombear sangre?$q$;

update public.questions set
  question_en = $t$What is the name of the tube that connects the mouth to the stomach?$t$,
  options_en  = $t$["Trachea","Esophagus","Intestine","Bronchus"]$t$::jsonb,
  context_en  = $t$The esophagus is the muscular tube that transports food from the pharynx to the stomach through peristalsis.$t$
where category = 'ciencia' and question = $q$¿Cómo se llama el tubo que conecta la boca con el estómago?$q$;

update public.questions set
  question_en = $t$Which gas does the human mainly exhale?$t$,
  options_en  = $t$["Oxygen","Nitrogen","Carbon dioxide","Methane"]$t$::jsonb,
  context_en  = $t$When we breathe, we mainly exhale nitrogen (which comes in and out equally), but the gas that increases is CO₂, a product of metabolism.$t$
where category = 'ciencia' and question = $q$¿Qué gas espira el ser humano principalmente?$q$;

update public.questions set
  question_en = $t$What function does hemoglobin have?$t$,
  options_en  = $t$["Transporting oxygen","Clotting blood","Defense","Digestion"]$t$::jsonb,
  context_en  = $t$Hemoglobin is a protein present in red blood cells that transports oxygen from the lungs to the tissues.$t$
where category = 'ciencia' and question = $q$¿Qué función tiene la hemoglobina?$q$;

update public.questions set
  question_en = $t$What is the normal human body temperature?$t$,
  options_en  = $t$["35 °C","36.5-37 °C","38 °C","40 °C"]$t$::jsonb,
  context_en  = $t$Normal body temperature ranges between 36.5 and 37.5 °C in healthy adults.$t$
where category = 'ciencia' and question = $q$¿Cuál es la temperatura corporal normal humana?$q$;

update public.questions set
  question_en = $t$What is the heliocentric theory?$t$,
  options_en  = $t$["The Earth is the center","The Sun is the center","There is no center","The Moon is the center"]$t$::jsonb,
  context_en  = $t$The heliocentric theory places the Sun at the center of the solar system. It was proposed by Copernicus (1543) and defended by Galileo and Kepler.$t$
where category = 'ciencia' and question = $q$¿Qué es la teoría heliocéntrica?$q$;

update public.questions set
  question_en = $t$What is the geocentric theory?$t$,
  options_en  = $t$["The Sun revolves around the Earth","The Earth revolves around the Sun","The Moon is the center","There are several suns"]$t$::jsonb,
  context_en  = $t$The geocentric theory placed the Earth motionless at the center of the universe. It was defended by Ptolemy and dominated until the 16th century.$t$
where category = 'ciencia' and question = $q$¿Qué es la teoría geocéntrica?$q$;

update public.questions set
  question_en = $t$How many laws describe Kepler's planetary motion?$t$,
  options_en  = $t$["2","3","4","5"]$t$::jsonb,
  context_en  = $t$Kepler's three laws describe the elliptical orbits, the swept areas and the period of the planets around the Sun.$t$
where category = 'ciencia' and question = $q$¿Cuántas leyes describen el movimiento planetario de Kepler?$q$;

update public.questions set
  question_en = $t$Who discovered nuclear fission?$t$,
  options_en  = $t$["Einstein","Otto Hahn","Fermi","Oppenheimer"]$t$::jsonb,
  context_en  = $t$Otto Hahn discovered nuclear fission in 1938 (along with Strassmann and Meitner). Nobel Prize in Chemistry 1944.$t$
where category = 'ciencia' and question = $q$¿Quién descubrió la fisión nuclear?$q$;

update public.questions set
  question_en = $t$Which particle completed the Standard Model when it was discovered in 2012?$t$,
  options_en  = $t$["Top quark","Higgs boson","Neutrino","Gluon"]$t$::jsonb,
  context_en  = $t$The Higgs boson was confirmed at CERN's LHC in 2012, validating a mechanism proposed in 1964 to explain mass.$t$
where category = 'ciencia' and question = $q$¿Qué partícula completó el Modelo Estándar al ser descubierta en 2012?$q$;

update public.questions set
  question_en = $t$Which fundamental force is responsible for beta radioactive decay?$t$,
  options_en  = $t$["Gravity","Electromagnetism","Strong nuclear","Weak nuclear"]$t$::jsonb,
  context_en  = $t$The weak nuclear force is responsible for beta decay, where a neutron transforms into a proton by emitting an electron.$t$
where category = 'ciencia' and question = $q$¿Qué fuerza fundamental es responsable del decaimiento radiactivo beta?$q$;

update public.questions set
  question_en = $t$How many fundamental forces does physics know of?$t$,
  options_en  = $t$["2","3","4","5"]$t$::jsonb,
  context_en  = $t$The four fundamental forces are: gravitational, electromagnetic, strong nuclear and weak nuclear.$t$
where category = 'ciencia' and question = $q$¿Cuántas fuerzas fundamentales conoce la física?$q$;

update public.questions set
  question_en = $t$Who designed the first vaccine (smallpox)?$t$,
  options_en  = $t$["Pasteur","Edward Jenner","Koch","Fleming"]$t$::jsonb,
  context_en  = $t$Edward Jenner developed the first vaccine in 1796 using cowpox to immunize against human smallpox.$t$
where category = 'ciencia' and question = $q$¿Quién diseñó la primera vacuna (viruela)?$q$;

update public.questions set
  question_en = $t$Who developed pasteurization?$t$,
  options_en  = $t$["Koch","Pasteur","Jenner","Lister"]$t$::jsonb,
  context_en  = $t$Louis Pasteur developed this preservation method in the 19th century. He also worked on vaccines against rabies.$t$
where category = 'ciencia' and question = $q$¿Quién desarrolló la pasteurización?$q$;

update public.questions set
  question_en = $t$Which cell has no nucleus in maturity?$t$,
  options_en  = $t$["Lymphocyte","Neuron","Red blood cell","Hepatocyte"]$t$::jsonb,
  context_en  = $t$Mature mammalian erythrocytes (red blood cells) lose their nucleus to carry more hemoglobin.$t$
where category = 'ciencia' and question = $q$¿Qué célula no tiene núcleo en su madurez?$q$;

update public.questions set
  question_en = $t$What is the first law of thermodynamics?$t$,
  options_en  = $t$["Conservation of energy","Entropy increases","Absolute temperature","Thermal equilibrium"]$t$::jsonb,
  context_en  = $t$The first law of thermodynamics states that energy is neither created nor destroyed, only transformed.$t$
where category = 'ciencia' and question = $q$¿Cuál es la primera ley de la termodinámica?$q$;

update public.questions set
  question_en = $t$What does the 2nd law of thermodynamics describe?$t$,
  options_en  = $t$["Conservation","The increase of entropy","Absolute zero","Equilibrium"]$t$::jsonb,
  context_en  = $t$The 2nd law states that in an isolated system, total entropy always tends to increase over time.$t$
where category = 'ciencia' and question = $q$¿Qué describe la 2.ª ley de la termodinámica?$q$;

update public.questions set
  question_en = $t$Which unit measures magnetic induction in the SI?$t$,
  options_en  = $t$["Tesla","Gauss","Henry","Weber"]$t$::jsonb,
  context_en  = $t$The tesla (T) is the SI unit of magnetic flux density. 1 T = 10,000 gauss.$t$
where category = 'ciencia' and question = $q$¿Qué unidad mide la inducción magnética en el SI?$q$;

update public.questions set
  question_en = $t$Which famous scientist predicted gravitational waves in 1916?$t$,
  options_en  = $t$["Newton","Einstein","Hawking","Maxwell"]$t$::jsonb,
  context_en  = $t$Einstein predicted gravitational waves as a consequence of his theory of general relativity. They were first detected in 2015.$t$
where category = 'ciencia' and question = $q$¿Qué famoso científico predijo las ondas gravitacionales en 1916?$q$;

update public.questions set
  question_en = $t$Which equations describe classical electromagnetism?$t$,
  options_en  = $t$["Newton's equations","Maxwell's equations","Einstein's equations","Schrödinger's equations"]$t$::jsonb,
  context_en  = $t$Maxwell's four equations (1865) unify electricity and magnetism and predict the existence of electromagnetic waves.$t$
where category = 'ciencia' and question = $q$¿Qué ecuaciones describen el electromagnetismo clásico?$q$;

update public.questions set
  question_en = $t$What is the escape velocity of the Earth (approx.)?$t$,
  options_en  = $t$["11.2 km/s","30 km/s","2.3 km/s","100 km/s"]$t$::jsonb,
  context_en  = $t$The escape velocity from the Earth's surface is ~11.2 km/s. Below that value an object falls back down.$t$
where category = 'ciencia' and question = $q$¿Qué es la velocidad de escape de la Tierra (aprox.)?$q$;

update public.questions set
  question_en = $t$Who discovered the neutron?$t$,
  options_en  = $t$["Rutherford","Chadwick","Bohr","Curie"]$t$::jsonb,
  context_en  = $t$James Chadwick discovered the neutron in 1932. Nobel Prize in Physics 1935.$t$
where category = 'ciencia' and question = $q$¿Quién descubrió los neutrones?$q$;

update public.questions set
  question_en = $t$Which SI unit measures the plane angle?$t$,
  options_en  = $t$["Degree","Radian","Steradian","Turn"]$t$::jsonb,
  context_en  = $t$The radian (rad) is the SI unit of plane angle. A full turn is equivalent to 2π radians (360°).$t$
where category = 'ciencia' and question = $q$¿Qué unidad SI mide el ángulo plano?$q$;

update public.questions set
  question_en = $t$What is the Sun's main energy source?$t$,
  options_en  = $t$["Fission","Fusion","Combustion","Radioactivity"]$t$::jsonb,
  context_en  = $t$The Sun gets its energy from the thermonuclear fusion of hydrogen into helium in its core.$t$
where category = 'ciencia' and question = $q$¿Cuál es la principal fuente de energía del Sol?$q$;

update public.questions set
  question_en = $t$Which property of light is explained by quantum theory?$t$,
  options_en  = $t$["Reflection","The photoelectric effect","Refraction","Diffraction"]$t$::jsonb,
  context_en  = $t$The photoelectric effect, explained by Einstein in 1905 with quanta of light, earned him the Nobel Prize in Physics 1921.$t$
where category = 'ciencia' and question = $q$¿Qué propiedad de la luz se explica por la teoría cuántica?$q$;

update public.questions set
  question_en = $t$What did Galileo invent (among other things)?$t$,
  options_en  = $t$["The telescope (he improved it)","The printing press","The light bulb","The atomic clock"]$t$::jsonb,
  context_en  = $t$Galileo improved the telescope in 1609 and used it to observe the moons of Jupiter, the phases of Venus and sunspots.$t$
where category = 'ciencia' and question = $q$¿Qué inventó Galileo (entre otras cosas)?$q$;

update public.questions set
  question_en = $t$Which temperature represents absolute zero?$t$,
  options_en  = $t$["0 °C","-100 °C","-273.15 °C","-459 °C"]$t$::jsonb,
  context_en  = $t$Absolute zero is -273.15 °C, equivalent to 0 K. It is the lowest temperature theoretically possible.$t$
where category = 'ciencia' and question = $q$¿Qué temperatura representa el cero absoluto?$q$;

update public.questions set
  question_en = $t$Which famous book did Darwin write in 1859?$t$,
  options_en  = $t$["On the Origin of Species","The Descent of Man","The Voyage of the Beagle","Animal Variation"]$t$::jsonb,
  context_en  = $t$'On the Origin of Species' (1859) presented the theory of evolution by natural selection.$t$
where category = 'ciencia' and question = $q$¿Qué famoso libro escribió Darwin en 1859?$q$;

update public.questions set
  question_en = $t$Which cell transmits nerve impulses?$t$,
  options_en  = $t$["Neuron","Astrocyte","White blood cell","Hepatocyte"]$t$::jsonb,
  context_en  = $t$The neuron is the basic cell of the nervous system. It has dendrites, a cell body and an axon.$t$
where category = 'ciencia' and question = $q$¿Qué célula transmite los impulsos nerviosos?$q$;


-- ── arte (155) ──
update public.questions set
  question_en = $t$Who painted the Mona Lisa (La Gioconda)?$t$,
  options_en  = $t$["Michelangelo","Raphael","Leonardo da Vinci","Botticelli"]$t$::jsonb,
  context_en  = $t$Leonardo da Vinci painted the Mona Lisa between 1503 and 1519. It is the most famous work in the world, kept at the Louvre in Paris.$t$
where category = 'arte' and question = $q$¿Quién pintó La Gioconda (Mona Lisa)?$q$;

update public.questions set
  question_en = $t$Who sculpted 'David'?$t$,
  options_en  = $t$["Leonardo da Vinci","Donatello","Michelangelo","Raphael"]$t$::jsonb,
  context_en  = $t$Michelangelo sculpted David between 1501 and 1504. It stands 5.17 m tall and is carved from a single block of Carrara marble.$t$
where category = 'arte' and question = $q$¿Quién esculpió «El David»?$q$;

update public.questions set
  question_en = $t$In which city is the Prado Museum?$t$,
  options_en  = $t$["Barcelona","Seville","Valencia","Madrid"]$t$::jsonb,
  context_en  = $t$The Prado is in Madrid and is one of the most important museums in the world, with works by Velázquez, Goya, El Greco and Rubens.$t$
where category = 'arte' and question = $q$¿En qué ciudad está el Museo del Prado?$q$;

update public.questions set
  question_en = $t$Who composed the Fifth Symphony?$t$,
  options_en  = $t$["Mozart","Bach","Beethoven","Haydn"]$t$::jsonb,
  context_en  = $t$Ludwig van Beethoven composed his Fifth Symphony in C minor (1808). The famous opening motif (ta-ta-ta-TA) is one of the most recognizable in classical music.$t$
where category = 'arte' and question = $q$¿Quién compuso la Quinta Sinfonía?$q$;

update public.questions set
  question_en = $t$Who wrote 'Don Quixote'?$t$,
  options_en  = $t$["Francisco de Quevedo","Lope de Vega","Miguel de Cervantes","Calderón de la Barca"]$t$::jsonb,
  context_en  = $t$Cervantes published the first part of Don Quixote in 1605 and the second in 1615. It is considered the first modern novel and the most influential in Spanish literature.$t$
where category = 'arte' and question = $q$¿Quién escribió «Don Quijote de la Mancha»?$q$;

update public.questions set
  question_en = $t$Who painted 'Guernica'?$t$,
  options_en  = $t$["Salvador Dalí","Joan Miró","Pablo Picasso","Francisco Goya"]$t$::jsonb,
  context_en  = $t$Picasso painted Guernica in 1937 as a protest against the bombing of the Basque city during the Spanish Civil War. It is in the Reina Sofía Museum, Madrid.$t$
where category = 'arte' and question = $q$¿Quién pintó «El Guernica»?$q$;

update public.questions set
  question_en = $t$Which architect designed the Sagrada Familia in Barcelona?$t$,
  options_en  = $t$["Le Corbusier","Mies van der Rohe","Antoni Gaudí","Santiago Calatrava"]$t$::jsonb,
  context_en  = $t$Antoni Gaudí designed the Sagrada Familia in 1883, a project still unfinished. It is the most recognizable architectural symbol of Barcelona.$t$
where category = 'arte' and question = $q$¿Qué arquitecto diseñó la Sagrada Familia de Barcelona?$q$;

update public.questions set
  question_en = $t$Who wrote 'Hamlet'?$t$,
  options_en  = $t$["Charles Dickens","William Shakespeare","John Milton","Geoffrey Chaucer"]$t$::jsonb,
  context_en  = $t$Shakespeare wrote Hamlet around 1600-1601. 'To be or not to be' is the most famous soliloquy in world literature.$t$
where category = 'arte' and question = $q$¿Quién escribió «Hamlet»?$q$;

update public.questions set
  question_en = $t$Who painted 'Las Meninas'?$t$,
  options_en  = $t$["El Greco","Francisco de Goya","Diego Velázquez","Bartolomé Murillo"]$t$::jsonb,
  context_en  = $t$Diego Velázquez painted Las Meninas in 1656. It depicts the Infanta Margarita surrounded by her maids in the Alcázar of Madrid. It is in the Prado.$t$
where category = 'arte' and question = $q$¿Quién pintó «Las Meninas»?$q$;

update public.questions set
  question_en = $t$Who composed 'The Magic Flute'?$t$,
  options_en  = $t$["Haydn","Mozart","Schubert","Handel"]$t$::jsonb,
  context_en  = $t$Wolfgang Amadeus Mozart composed The Magic Flute in 1791, the year of his death. It is one of the most performed operas in the world.$t$
where category = 'arte' and question = $q$¿Quién compuso «La flauta mágica»?$q$;

update public.questions set
  question_en = $t$Which artistic movement did Salvador Dalí lead?$t$,
  options_en  = $t$["Cubism","Impressionism","Surrealism","Dadaism"]$t$::jsonb,
  context_en  = $t$Dalí was the leading figure of Surrealism. 'The Persistence of Memory' (1931), with its soft clocks, is his most iconic work.$t$
where category = 'arte' and question = $q$¿Qué movimiento artístico lideró Salvador Dalí?$q$;

update public.questions set
  question_en = $t$Who wrote 'One Hundred Years of Solitude'?$t$,
  options_en  = $t$["Pablo Neruda","Mario Vargas Llosa","Gabriel García Márquez","Jorge Luis Borges"]$t$::jsonb,
  context_en  = $t$García Márquez published 'One Hundred Years of Solitude' in 1967. It is the pinnacle work of magical realism and earned him the Nobel Prize in Literature in 1982.$t$
where category = 'arte' and question = $q$¿Quién escribió «Cien años de soledad»?$q$;

update public.questions set
  question_en = $t$Which architect designed the Bilbao Guggenheim?$t$,
  options_en  = $t$["Zaha Hadid","Norman Foster","Frank Gehry","Renzo Piano"]$t$::jsonb,
  context_en  = $t$Frank Gehry designed the Guggenheim Museum Bilbao (1997), considered the most important building of the 20th century. Its titanium reflects light in changing ways.$t$
where category = 'arte' and question = $q$¿Qué arquitecto diseñó el Guggenheim de Bilbao?$q$;

update public.questions set
  question_en = $t$Who painted 'The Starry Night'?$t$,
  options_en  = $t$["Paul Gauguin","Claude Monet","Vincent van Gogh","Edvard Munch"]$t$::jsonb,
  context_en  = $t$Van Gogh painted 'The Starry Night' in 1889 from the Saint-Rémy asylum. It is one of the most recognized paintings in the world.$t$
where category = 'arte' and question = $q$¿Quién pintó «La noche estrellada»?$q$;

update public.questions set
  question_en = $t$Who sculpted 'The Thinker'?$t$,
  options_en  = $t$["Constantin Brâncuși","Auguste Rodin","Henry Moore","Alberto Giacometti"]$t$::jsonb,
  context_en  = $t$Auguste Rodin created 'The Thinker' in 1880, originally as part of 'The Gates of Hell'. There are multiple copies around the world.$t$
where category = 'arte' and question = $q$¿Quién esculpió «El Pensador»?$q$;

update public.questions set
  question_en = $t$Who composed 'The Four Seasons'?$t$,
  options_en  = $t$["Bach","Handel","Vivaldi","Telemann"]$t$::jsonb,
  context_en  = $t$Antonio Vivaldi composed 'The Four Seasons' around 1718-1720. They are four violin concertos representing the seasons of the year.$t$
where category = 'arte' and question = $q$¿Quién compuso las «Cuatro Estaciones»?$q$;

update public.questions set
  question_en = $t$Which writer created the character of Sherlock Holmes?$t$,
  options_en  = $t$["Agatha Christie","Edgar Allan Poe","Arthur Conan Doyle","G.K. Chesterton"]$t$::jsonb,
  context_en  = $t$Arthur Conan Doyle created Sherlock Holmes in 1887. The detective lives at 221B Baker Street, London, with his friend Dr. Watson.$t$
where category = 'arte' and question = $q$¿Qué escritor creó el personaje de Sherlock Holmes?$q$;

update public.questions set
  question_en = $t$Who painted 'The Garden of Earthly Delights'?$t$,
  options_en  = $t$["Jan van Eyck","Hieronymus Bosch","Pieter Bruegel","Hans Holbein"]$t$::jsonb,
  context_en  = $t$Bosch painted this triptych in the late 15th century, depicting Paradise, carnal sin and Hell. It is in the Prado Museum.$t$
where category = 'arte' and question = $q$¿Quién pintó «El jardín de las delicias»?$q$;

update public.questions set
  question_en = $t$Who wrote '1984'?$t$,
  options_en  = $t$["Aldous Huxley","Ray Bradbury","George Orwell","H.G. Wells"]$t$::jsonb,
  context_en  = $t$George Orwell published '1984' in 1949. It is a dystopia about a totalitarian state with Big Brother watching everything. He coined terms like 'doublethink'.$t$
where category = 'arte' and question = $q$¿Quién escribió «1984»?$q$;

update public.questions set
  question_en = $t$In which museum is the Venus de Milo?$t$,
  options_en  = $t$["British Museum","Uffizi","Prado Museum","Louvre Museum"]$t$::jsonb,
  context_en  = $t$The Venus de Milo is a Greek sculpture from the 2nd century BC, found in 1820. It is in the Louvre in Paris. Its author is unknown.$t$
where category = 'arte' and question = $q$¿En qué museo está la Venus de Milo?$q$;

update public.questions set
  question_en = $t$Who composed 'La Traviata'?$t$,
  options_en  = $t$["Rossini","Donizetti","Puccini","Verdi"]$t$::jsonb,
  context_en  = $t$Giuseppe Verdi composed 'La Traviata' in 1853, based on Dumas's 'The Lady of the Camellias'. It is one of the most performed operas in the world.$t$
where category = 'arte' and question = $q$¿Quién compuso «La Traviata»?$q$;

update public.questions set
  question_en = $t$Which writer created Alice in Wonderland?$t$,
  options_en  = $t$["H.G. Wells","Lewis Carroll","Jules Verne","J.M. Barrie"]$t$::jsonb,
  context_en  = $t$Lewis Carroll (Charles Dodgson) published 'Alice's Adventures in Wonderland' in 1865. It is one of the most translated books in history.$t$
where category = 'arte' and question = $q$¿Qué escritor creó a Alicia en el País de las Maravillas?$q$;

update public.questions set
  question_en = $t$Who directed 'The Godfather'?$t$,
  options_en  = $t$["Martin Scorsese","Steven Spielberg","Francis Ford Coppola","Stanley Kubrick"]$t$::jsonb,
  context_en  = $t$Francis Ford Coppola directed 'The Godfather' in 1972, with Marlon Brando and Al Pacino. It won the Oscar for Best Picture and is considered one of the best in history.$t$
where category = 'arte' and question = $q$¿Quién dirigió «El padrino»?$q$;

update public.questions set
  question_en = $t$Who painted 'The Birth of Venus'?$t$,
  options_en  = $t$["Leonardo da Vinci","Michelangelo","Sandro Botticelli","Raphael"]$t$::jsonb,
  context_en  = $t$Botticelli painted 'The Birth of Venus' around 1485. It is in the Uffizi Gallery in Florence. It depicts the goddess Venus emerging from the sea.$t$
where category = 'arte' and question = $q$¿Quién pintó «El nacimiento de Venus»?$q$;

update public.questions set
  question_en = $t$Who painted 'The Scream'?$t$,
  options_en  = $t$["Gustav Klimt","Egon Schiele","Edvard Munch","Ernst Ludwig Kirchner"]$t$::jsonb,
  context_en  = $t$Edvard Munch painted 'The Scream' in 1893. The Norwegian said the inspiration came when he saw a blood-red sky while walking. It is an icon of Expressionism.$t$
where category = 'arte' and question = $q$¿Quién pintó «El grito»?$q$;

update public.questions set
  question_en = $t$Who composed the Ninth Symphony while deaf?$t$,
  options_en  = $t$["Schubert","Brahms","Beethoven","Mahler"]$t$::jsonb,
  context_en  = $t$Beethoven composed the Ninth Symphony (1824) completely deaf. The 'Ode to Joy' anthem from the fourth movement is the anthem of the European Union.$t$
where category = 'arte' and question = $q$¿Quién compuso la Novena Sinfonía siendo sordo?$q$;

update public.questions set
  question_en = $t$Who wrote 'Crime and Punishment'?$t$,
  options_en  = $t$["Leo Tolstoy","Ivan Turgenev","Anton Chekhov","Fyodor Dostoevsky"]$t$::jsonb,
  context_en  = $t$Dostoevsky published 'Crime and Punishment' in 1866. It tells of the murder committed by Raskolnikov and his subsequent psychological torment. It is a pinnacle of Russian literature.$t$
where category = 'arte' and question = $q$¿Quién escribió «Crimen y castigo»?$q$;

update public.questions set
  question_en = $t$Who painted 'The Kiss' (1907-1908)?$t$,
  options_en  = $t$["Egon Schiele","Gustav Klimt","Oskar Kokoschka","Ferdinand Hodler"]$t$::jsonb,
  context_en  = $t$Gustav Klimt painted 'The Kiss' between 1907-1908, in his golden phase. It is the most famous painting of the Vienna Secession. It is in the Belvedere in Vienna.$t$
where category = 'arte' and question = $q$¿Quién pintó «El beso» (1907-1908)?$q$;

update public.questions set
  question_en = $t$Who wrote 'In Search of Lost Time'?$t$,
  options_en  = $t$["Gustave Flaubert","Émile Zola","Marcel Proust","Guy de Maupassant"]$t$::jsonb,
  context_en  = $t$Marcel Proust published 'In Search of Lost Time' in 7 volumes (1913-1927). It is the longest novel in literature, with ~1.5 million words.$t$
where category = 'arte' and question = $q$¿Quién escribió «En busca del tiempo perdido»?$q$;

update public.questions set
  question_en = $t$What is Impressionism?$t$,
  options_en  = $t$["A movement that depicts reality exactly","A painting movement that captures the visual impression of a moment with loose brushstrokes","A style that distorts reality","An abstract movement of the 20th century"]$t$::jsonb,
  context_en  = $t$Impressionism (1860-1880) sought to capture light and the moment with loose brushstrokes and vivid colors. Monet, Renoir and Degas are its leading figures.$t$
where category = 'arte' and question = $q$¿Qué es el impresionismo?$q$;

update public.questions set
  question_en = $t$Who painted 'Sunflowers'?$t$,
  options_en  = $t$["Paul Gauguin","Paul Cézanne","Vincent van Gogh","Henri Toulouse-Lautrec"]$t$::jsonb,
  context_en  = $t$Van Gogh painted several versions of 'Sunflowers' in 1888-1889 in Arles. One of them sold in 1987 for $39.9 million.$t$
where category = 'arte' and question = $q$¿Quién pintó «Los girasoles»?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Metamorphosis'?$t$,
  options_en  = $t$["Hermann Hesse","Thomas Mann","Franz Kafka","Stefan Zweig"]$t$::jsonb,
  context_en  = $t$Franz Kafka published 'The Metamorphosis' in 1915. It tells how Gregor Samsa wakes up turned into an insect. It is an essential work of the absurd and existentialism.$t$
where category = 'arte' and question = $q$¿Quién escribió «La metamorfosis»?$q$;

update public.questions set
  question_en = $t$Who composed the 'Requiem'?$t$,
  options_en  = $t$["Haydn","Mozart","Schubert","Brahms"]$t$::jsonb,
  context_en  = $t$Mozart composed the Requiem in 1791, the year of his death, leaving it unfinished. It was completed by his pupil Franz Xaver Süssmayr. It is one of the most mysterious works in music.$t$
where category = 'arte' and question = $q$¿Quién compuso el «Réquiem»?$q$;

update public.questions set
  question_en = $t$Who was the first director to win the Oscar five times?$t$,
  options_en  = $t$["Billy Wilder","Frank Capra","John Ford","William Wyler"]$t$::jsonb,
  context_en  = $t$John Ford won 4 Best Director Oscars (a record). William Wyler won 3. The overall biggest Oscar winner is Walt Disney with 22 statuettes.$t$
where category = 'arte' and question = $q$¿Quién fue el primer director en ganar el Oscar cinco veces?$q$;

update public.questions set
  question_en = $t$Who painted 'Les Demoiselles d'Avignon'?$t$,
  options_en  = $t$["Georges Braque","Juan Gris","Pablo Picasso","Fernand Léger"]$t$::jsonb,
  context_en  = $t$Picasso painted 'Les Demoiselles d'Avignon' in 1907, considered the origin of Cubism. It depicts five prostitutes in a brothel in Barcelona.$t$
where category = 'arte' and question = $q$¿Quién pintó «Las señoritas de Avignon»?$q$;

update public.questions set
  question_en = $t$Who wrote 'Don Quixote'?$t$,
  options_en  = $t$["Lope de Vega","Francisco de Quevedo","Miguel de Cervantes","Tirso de Molina"]$t$::jsonb,
  context_en  = $t$Cervantes published the first part of Don Quixote in 1605 and the second in 1615. It is the best-selling novel in history after the Bible, with more than 500 million copies.$t$
where category = 'arte' and question = $q$¿Quién escribió «El Quijote»?$q$;

update public.questions set
  question_en = $t$Which architects built the Parthenon?$t$,
  options_en  = $t$["Phidias","Ictinus and Callicrates","Praxiteles","Polykleitos"]$t$::jsonb,
  context_en  = $t$The Parthenon was designed by the architects Ictinus and Callicrates and decorated by the sculptor Phidias. It was built between 447-438 BC on the Acropolis of Athens.$t$
where category = 'arte' and question = $q$¿Qué arquitecto construyó el Partenón?$q$;

update public.questions set
  question_en = $t$Who composed 'The Rite of Spring'?$t$,
  options_en  = $t$["Claude Debussy","Maurice Ravel","Igor Stravinsky","Béla Bartók"]$t$::jsonb,
  context_en  = $t$Stravinsky composed 'The Rite of Spring' in 1913. Its Paris premiere caused a scandal: the audience booed and fought in the theater over its radical modernism.$t$
where category = 'arte' and question = $q$¿Quién compuso «La consagración de la primavera»?$q$;

update public.questions set
  question_en = $t$Who wrote 'Anna Karenina'?$t$,
  options_en  = $t$["Fyodor Dostoevsky","Ivan Turgenev","Anton Chekhov","Leo Tolstoy"]$t$::jsonb,
  context_en  = $t$Leo Tolstoy published 'Anna Karenina' between 1875-1877. Along with 'War and Peace', it is considered one of the greatest novels ever written.$t$
where category = 'arte' and question = $q$¿Quién escribió «Anna Karenina»?$q$;

update public.questions set
  question_en = $t$Who painted 'The Persistence of Memory'?$t$,
  options_en  = $t$["René Magritte","Joan Miró","Max Ernst","Salvador Dalí"]$t$::jsonb,
  context_en  = $t$Dalí painted 'The Persistence of Memory' in 1931. The soft clocks represent the relativity of time. It measures only 24×33 cm and is in the MoMA in New York.$t$
where category = 'arte' and question = $q$¿Quién pintó «La persistencia de la memoria»?$q$;

update public.questions set
  question_en = $t$Who designed the Colosseum in Rome?$t$,
  options_en  = $t$["Julius Caesar","The emperors Vespasian and Titus","Augustus","Hadrian"]$t$::jsonb,
  context_en  = $t$The Colosseum was built by order of Emperor Vespasian (~AD 72) and completed by his son Titus in AD 80. It could hold between 50,000 and 80,000 spectators.$t$
where category = 'arte' and question = $q$¿Quién diseñó el Coliseo de Roma?$q$;

update public.questions set
  question_en = $t$Who wrote 'Les Misérables'?$t$,
  options_en  = $t$["Émile Zola","Honoré de Balzac","Victor Hugo","Alexandre Dumas"]$t$::jsonb,
  context_en  = $t$Victor Hugo published 'Les Misérables' in 1862. It tells the story of Jean Valjean and is one of the most adapted novels for film and musical theater.$t$
where category = 'arte' and question = $q$¿Quién escribió «Los miserables»?$q$;

update public.questions set
  question_en = $t$Which artistic movement did Frida Kahlo represent?$t$,
  options_en  = $t$["Impressionism","Cubism","Surrealism","Expressionism"]$t$::jsonb,
  context_en  = $t$Frida Kahlo was associated with Surrealism, although she distanced herself from the movement. Her self-portraits explore physical pain, identity and Mexican culture.$t$
where category = 'arte' and question = $q$¿Qué movimiento artístico representó Frida Kahlo?$q$;

update public.questions set
  question_en = $t$Who composed the opera 'Carmen'?$t$,
  options_en  = $t$["Verdi","Puccini","Bizet","Donizetti"]$t$::jsonb,
  context_en  = $t$Georges Bizet composed 'Carmen' in 1875. Based on Mérimée's novel, it was a failure at its premiere but today is the most performed opera in the world.$t$
where category = 'arte' and question = $q$¿Quién compuso la ópera «Carmen»?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Lord of the Rings'?$t$,
  options_en  = $t$["C.S. Lewis","George R.R. Martin","J.R.R. Tolkien","Terry Pratchett"]$t$::jsonb,
  context_en  = $t$J.R.R. Tolkien published 'The Lord of the Rings' in three volumes between 1954-1955. He also created the world of Middle-earth with 'The Hobbit' (1937).$t$
where category = 'arte' and question = $q$¿Quién escribió «El señor de los anillos»?$q$;

update public.questions set
  question_en = $t$Which painter cut off part of his ear in 1888?$t$,
  options_en  = $t$["Gauguin","Van Gogh","Monet","Cézanne"]$t$::jsonb,
  context_en  = $t$Vincent van Gogh cut off part of his left earlobe in Arles in December 1888, during a psychological crisis.$t$
where category = 'arte' and question = $q$¿Qué pintor cortó parte de su oreja en 1888?$q$;

update public.questions set
  question_en = $t$Who painted 'The Baptism of Christ' while Leonardo was his pupil?$t$,
  options_en  = $t$["Verrocchio","Ghirlandaio","Botticelli","Masaccio"]$t$::jsonb,
  context_en  = $t$Andrea del Verrocchio ran the Florentine workshop where Leonardo trained. Leonardo painted one of the angels in 'The Baptism of Christ'.$t$
where category = 'arte' and question = $q$¿Quién pintó "El bautismo de Cristo" mientras Leonardo era su alumno?$q$;

update public.questions set
  question_en = $t$Which Spanish Baroque painter painted 'The Lances'?$t$,
  options_en  = $t$["Murillo","Velázquez","Zurbarán","Ribera"]$t$::jsonb,
  context_en  = $t$'The Surrender of Breda' (1635), known as 'The Lances', is one of the masterpieces of Diego Velázquez.$t$
where category = 'arte' and question = $q$¿Qué pintor barroco español pintó "Las Lanzas"?$q$;

update public.questions set
  question_en = $t$Which Catalan modernist architect designed Casa Batlló?$t$,
  options_en  = $t$["Domènech i Montaner","Gaudí","Puig i Cadafalch","Sert"]$t$::jsonb,
  context_en  = $t$Antoni Gaudí remodeled Casa Batlló (1904-1906) on Passeig de Gràcia in Barcelona. It is a World Heritage Site.$t$
where category = 'arte' and question = $q$¿Qué arquitecto modernista catalán diseñó la Casa Batlló?$q$;

update public.questions set
  question_en = $t$Who painted 'Liberty Leading the People'?$t$,
  options_en  = $t$["Delacroix","Géricault","Ingres","David"]$t$::jsonb,
  context_en  = $t$Eugène Delacroix painted 'Liberty Leading the People' (1830) to commemorate the July Revolution in France. It is in the Louvre.$t$
where category = 'arte' and question = $q$¿Quién pintó "La libertad guiando al pueblo"?$q$;

update public.questions set
  question_en = $t$Which Renaissance painter painted the Sistine Chapel?$t$,
  options_en  = $t$["Raphael","Leonardo","Michelangelo","Titian"]$t$::jsonb,
  context_en  = $t$Michelangelo painted the ceiling (1508-1512) and 'The Last Judgment' (1536-1541) in the Sistine Chapel of the Vatican.$t$
where category = 'arte' and question = $q$¿Qué pintor renacentista pintó la Capilla Sixtina?$q$;

update public.questions set
  question_en = $t$Who painted 'The School of Athens'?$t$,
  options_en  = $t$["Raphael","Michelangelo","Leonardo","Botticelli"]$t$::jsonb,
  context_en  = $t$'The School of Athens' (1509-1511) was painted by Raphael in the Vatican Rooms. It depicts the great Greek philosophers.$t$
where category = 'arte' and question = $q$¿Quién pintó "La escuela de Atenas"?$q$;

update public.questions set
  question_en = $t$Which artist painted 'Wanderer above the Sea of Fog'?$t$,
  options_en  = $t$["Turner","Friedrich","Constable","Cole"]$t$::jsonb,
  context_en  = $t$Caspar David Friedrich painted this icon of German Romanticism around 1818. A figure contemplates a sublime landscape of fog.$t$
where category = 'arte' and question = $q$¿Qué artista pintó "El caminante sobre el mar de nubes"?$q$;

update public.questions set
  question_en = $t$Which Flemish painter painted 'The Arnolfini Portrait' (1434)?$t$,
  options_en  = $t$["Bosch","Van Eyck","Rubens","Bruegel the Elder"]$t$::jsonb,
  context_en  = $t$Jan van Eyck painted 'The Arnolfini Portrait', a masterpiece of early Flemish painting. It is in the National Gallery in London.$t$
where category = 'arte' and question = $q$¿Qué pintor flamenco pintó "El matrimonio Arnolfini" (1434)?$q$;

update public.questions set
  question_en = $t$Which Dutch painter is famous for his urban views of Delft?$t$,
  options_en  = $t$["Vermeer","Rembrandt","Hals","Van Gogh"]$t$::jsonb,
  context_en  = $t$Johannes Vermeer (1632-1675) painted 'View of Delft', 'Girl with a Pearl Earring' and other masterpieces of the Dutch Baroque.$t$
where category = 'arte' and question = $q$¿Qué pintor neerlandés es famoso por sus paisajes urbanos de Delft?$q$;

update public.questions set
  question_en = $t$Who painted 'Girl with a Pearl Earring'?$t$,
  options_en  = $t$["Rembrandt","Vermeer","Frans Hals","Rubens"]$t$::jsonb,
  context_en  = $t$'Girl with a Pearl Earring' (~1665) by Johannes Vermeer is kept in the Mauritshuis museum in The Hague.$t$
where category = 'arte' and question = $q$¿Quién pintó "La joven de la perla"?$q$;

update public.questions set
  question_en = $t$Who painted 'The Night Watch'?$t$,
  options_en  = $t$["Vermeer","Rembrandt","Bruegel","Caravaggio"]$t$::jsonb,
  context_en  = $t$'The Night Watch' (1642) is a masterpiece by Rembrandt. It is in the Rijksmuseum in Amsterdam.$t$
where category = 'arte' and question = $q$¿Quién pintó "La ronda de noche"?$q$;

update public.questions set
  question_en = $t$Which artistic movement did Pablo Picasso found along with Georges Braque?$t$,
  options_en  = $t$["Surrealism","Cubism","Expressionism","Dadaism"]$t$::jsonb,
  context_en  = $t$Picasso and Braque developed Cubism between 1907 and 1914, fragmenting the representation of reality into geometric planes.$t$
where category = 'arte' and question = $q$¿Qué movimiento artístico fundó Pablo Picasso junto a Georges Braque?$q$;

update public.questions set
  question_en = $t$Who painted 'The Third of May 1808'?$t$,
  options_en  = $t$["Goya","Velázquez","Sorolla","Murillo"]$t$::jsonb,
  context_en  = $t$Francisco de Goya painted this work in 1814, depicting Napoleon's repression in Madrid on 3 May 1808. It is in the Prado.$t$
where category = 'arte' and question = $q$¿Quién pintó "Los fusilamientos del 3 de mayo"?$q$;

update public.questions set
  question_en = $t$Which artistic movement did Claude Monet start?$t$,
  options_en  = $t$["Impressionism","Romanticism","Realism","Cubism"]$t$::jsonb,
  context_en  = $t$Monet was a key figure of Impressionism. His work 'Impression, Sunrise' (1872) gave the movement its name.$t$
where category = 'arte' and question = $q$¿Qué movimiento artístico inició Claude Monet?$q$;

update public.questions set
  question_en = $t$Who sculpted the Vatican 'Pietà'?$t$,
  options_en  = $t$["Bernini","Donatello","Michelangelo","Cellini"]$t$::jsonb,
  context_en  = $t$Michelangelo sculpted 'The Pietà' between 1498 and 1499. It is the only sculpture he signed. It is in St. Peter's Basilica.$t$
where category = 'arte' and question = $q$¿Quién esculpió la "Piedad" del Vaticano?$q$;

update public.questions set
  question_en = $t$Who sculpted 'The Ecstasy of Saint Teresa'?$t$,
  options_en  = $t$["Bernini","Bernardo Cavallino","Canova","Donatello"]$t$::jsonb,
  context_en  = $t$Gian Lorenzo Bernini sculpted this work of the Italian Baroque (1647-1652) in the church of Santa Maria della Vittoria, Rome.$t$
where category = 'arte' and question = $q$¿Quién esculpió "El éxtasis de Santa Teresa"?$q$;

update public.questions set
  question_en = $t$Who painted 'The Spinners'?$t$,
  options_en  = $t$["Velázquez","Murillo","Goya","El Greco"]$t$::jsonb,
  context_en  = $t$'The Spinners' (~1657) is a complex work by Diego Velázquez, with spinners in the foreground and the myth of Arachne in the background.$t$
where category = 'arte' and question = $q$¿Quién pintó "Las hilanderas"?$q$;

update public.questions set
  question_en = $t$In which museum is 'Las Meninas' exhibited?$t$,
  options_en  = $t$["Louvre","Prado Museum","Reina Sofía","Thyssen"]$t$::jsonb,
  context_en  = $t$'Las Meninas' (1656) by Velázquez is exhibited in the Prado Museum, in Madrid.$t$
where category = 'arte' and question = $q$¿En qué museo se exhibe "Las Meninas"?$q$;

update public.questions set
  question_en = $t$In which museum is 'Guernica'?$t$,
  options_en  = $t$["Prado","Reina Sofía","Thyssen","MOMA"]$t$::jsonb,
  context_en  = $t$'Guernica' (1937) by Picasso has been exhibited in the Reina Sofía National Art Museum in Madrid since 1992.$t$
where category = 'arte' and question = $q$¿En qué museo está "El Guernica"?$q$;

update public.questions set
  question_en = $t$Which American architect designed Fallingwater?$t$,
  options_en  = $t$["Frank Lloyd Wright","Frank Gehry","Le Corbusier","Mies van der Rohe"]$t$::jsonb,
  context_en  = $t$Fallingwater was designed by Frank Lloyd Wright in 1935 in Pennsylvania.$t$
where category = 'arte' and question = $q$¿Qué arquitecto estadounidense diseñó la Casa de la Cascada?$q$;

update public.questions set
  question_en = $t$Which Mexican painter painted murals about the revolution?$t$,
  options_en  = $t$["Frida Kahlo","Diego Rivera","Tamayo","Siqueiros"]$t$::jsonb,
  context_en  = $t$Diego Rivera was one of the great Mexican muralists. He painted the history of Mexico in large public murals.$t$
where category = 'arte' and question = $q$¿Qué pintor mexicano pintó murales sobre la revolución?$q$;

update public.questions set
  question_en = $t$Who painted 'The Embrace' (1917)?$t$,
  options_en  = $t$["Klimt","Schiele","Picasso","Kandinsky"]$t$::jsonb,
  context_en  = $t$Egon Schiele painted 'The Embrace' in 1917. A pupil of Klimt and a central figure of Viennese Expressionism.$t$
where category = 'arte' and question = $q$¿Quién pintó "El abrazo" (1917)?$q$;

update public.questions set
  question_en = $t$Which architect founded the Bauhaus?$t$,
  options_en  = $t$["Mies van der Rohe","Walter Gropius","Le Corbusier","Aalto"]$t$::jsonb,
  context_en  = $t$Walter Gropius founded the Bauhaus in Weimar in 1919. The school moved to Dessau (1925) and to Berlin (1932) before closing.$t$
where category = 'arte' and question = $q$¿Qué arquitecto fundó la Bauhaus?$q$;

update public.questions set
  question_en = $t$Which Swiss-French architect designed Villa Savoye?$t$,
  options_en  = $t$["Le Corbusier","Aalto","Mies","Niemeyer"]$t$::jsonb,
  context_en  = $t$Le Corbusier designed Villa Savoye (1928-1931) in Poissy, a manifesto of the 'five points' of modern architecture.$t$
where category = 'arte' and question = $q$¿Qué arquitecto suizo-francés diseñó la villa Saboya?$q$;

update public.questions set
  question_en = $t$Which Italian Renaissance painter is famous for his madonnas?$t$,
  options_en  = $t$["Caravaggio","Raphael","Titian","Tintoretto"]$t$::jsonb,
  context_en  = $t$Raphael Sanzio painted numerous madonnas, such as the 'Sistine Madonna' or the 'Madonna of the Goldfinch'.$t$
where category = 'arte' and question = $q$¿Qué pintor renacentista italiano es famoso por sus madonnas?$q$;

update public.questions set
  question_en = $t$Which Baroque painter used intense chiaroscuro and was famous for his turbulent life?$t$,
  options_en  = $t$["Velázquez","Caravaggio","Rubens","Vermeer"]$t$::jsonb,
  context_en  = $t$Caravaggio (1571-1610) revolutionized painting with his dramatic chiaroscuro. His life was marked by fights and a murder.$t$
where category = 'arte' and question = $q$¿Qué pintor barroco usó intensamente el claroscuro y fue famoso por su vida turbulenta?$q$;

update public.questions set
  question_en = $t$Who painted 'The Ecstasy of Saint Francis' in Mannerist style?$t$,
  options_en  = $t$["Caravaggio","El Greco","Rubens","Titian"]$t$::jsonb,
  context_en  = $t$El Greco (Doménikos Theotokópoulos, 1541-1614) painted several works on Saint Francis. Settled in Toledo, he fused Byzantine and Venetian traditions.$t$
where category = 'arte' and question = $q$¿Quién pintó "El éxtasis de San Francisco" en estilo manierista?$q$;

update public.questions set
  question_en = $t$Which painter painted the Prado 'Annunciation' (~1426)?$t$,
  options_en  = $t$["Fra Angelico","Botticelli","Lippi","Masaccio"]$t$::jsonb,
  context_en  = $t$Fra Angelico painted 'The Annunciation' (~1425-1428), which is kept in the Prado Museum.$t$
where category = 'arte' and question = $q$¿Qué pintor pintó la "Anunciación" del Prado (~1426)?$q$;

update public.questions set
  question_en = $t$Who sculpted 'The Gates of Hell'?$t$,
  options_en  = $t$["Bernini","Rodin","Canova","Brancusi"]$t$::jsonb,
  context_en  = $t$Auguste Rodin worked on 'The Gates of Hell' for almost 40 years. Works like 'The Thinker' and 'The Kiss' derive from it.$t$
where category = 'arte' and question = $q$¿Quién esculpió "La puerta del infierno"?$q$;

update public.questions set
  question_en = $t$Who painted 'Woman with a Parasol'?$t$,
  options_en  = $t$["Monet","Manet","Renoir","Degas"]$t$::jsonb,
  context_en  = $t$Claude Monet painted several paintings of his wife Camille with a parasol, the most famous in 1875.$t$
where category = 'arte' and question = $q$¿Quién pintó "Mujer con sombrilla"?$q$;

update public.questions set
  question_en = $t$Who painted 'Olympia' (1863)?$t$,
  options_en  = $t$["Monet","Manet","Degas","Renoir"]$t$::jsonb,
  context_en  = $t$Édouard Manet painted 'Olympia' in 1863, causing a scandal due to its raw realism. It heralds pictorial modernity.$t$
where category = 'arte' and question = $q$¿Quién pintó "Olympia" (1863)?$q$;

update public.questions set
  question_en = $t$Who is the author of the book 'Confessions'?$t$,
  options_en  = $t$["Saint Augustine","Saint Thomas Aquinas","Saint Paul","Rousseau"]$t$::jsonb,
  context_en  = $t$Saint Augustine of Hippo wrote 'Confessions' around AD 400, a spiritual autobiography.$t$
where category = 'arte' and question = $q$¿Quién es el autor del libro "Las Confesiones"?$q$;

update public.questions set
  question_en = $t$Which building did Filippo Brunelleschi design?$t$,
  options_en  = $t$["Florence Cathedral (dome)","Milan Cathedral","St. Peter's in Rome","Siena Cathedral"]$t$::jsonb,
  context_en  = $t$Brunelleschi designed the famous dome of Florence Cathedral (Santa Maria del Fiore), completed in 1436.$t$
where category = 'arte' and question = $q$¿Qué edificio diseñó Filippo Brunelleschi?$q$;

update public.questions set
  question_en = $t$Which architect designed the Sydney Opera House?$t$,
  options_en  = $t$["Jørn Utzon","Frank Gehry","Foster","Calatrava"]$t$::jsonb,
  context_en  = $t$The Dane Jørn Utzon won the competition in 1957. The Sydney Opera House was completed in 1973 and is a World Heritage Site.$t$
where category = 'arte' and question = $q$¿Qué arquitecto diseñó la Ópera de Sídney?$q$;

update public.questions set
  question_en = $t$Which Belgian Surrealist painter created 'The Son of Man'?$t$,
  options_en  = $t$["Magritte","Delvaux","Ernst","Tanguy"]$t$::jsonb,
  context_en  = $t$René Magritte painted 'The Son of Man' in 1964, a self-portrait with a bowler hat and an apple hiding the face.$t$
where category = 'arte' and question = $q$¿Qué pintor surrealista belga creó "El hijo del hombre"?$q$;

update public.questions set
  question_en = $t$Who painted 'Composition VIII' and pioneered abstract painting?$t$,
  options_en  = $t$["Kandinsky","Malevich","Mondrian","Klee"]$t$::jsonb,
  context_en  = $t$Wassily Kandinsky is considered a pioneer of abstract art. 'Composition VIII' (1923) is in the Guggenheim.$t$
where category = 'arte' and question = $q$¿Quién pintó "Composición VIII" y abrió la pintura abstracta?$q$;

update public.questions set
  question_en = $t$Which artistic movement did Mondrian found?$t$,
  options_en  = $t$["Suprematism","Constructivism","Neoplasticism","Dadaism"]$t$::jsonb,
  context_en  = $t$Piet Mondrian founded Neoplasticism (De Stijl), based on straight lines and primary colors.$t$
where category = 'arte' and question = $q$¿Qué movimiento artístico fundó Mondrian?$q$;

update public.questions set
  question_en = $t$Which Russian painter founded Suprematism?$t$,
  options_en  = $t$["Kandinsky","Malevich","Chagall","Tatlin"]$t$::jsonb,
  context_en  = $t$Kazimir Malevich founded Suprematism, a movement of pure geometry. His emblematic work is 'Black Square' (1915).$t$
where category = 'arte' and question = $q$¿Qué pintor ruso fundó el suprematismo?$q$;

update public.questions set
  question_en = $t$Which Italian Baroque architect designed the colonnade of St. Peter's Square?$t$,
  options_en  = $t$["Borromini","Bernini","Bramante","Palladio"]$t$::jsonb,
  context_en  = $t$Gian Lorenzo Bernini designed the elliptical colonnade of St. Peter's Square (1656-1667) that embraces the faithful.$t$
where category = 'arte' and question = $q$¿Qué arquitecto barroco italiano diseñó la columnata de la plaza de San Pedro?$q$;

update public.questions set
  question_en = $t$Which architect originally designed the dome of St. Peter's?$t$,
  options_en  = $t$["Bernini","Michelangelo","Bramante","Borromini"]$t$::jsonb,
  context_en  = $t$Michelangelo designed the current dome of St. Peter's from 1547. It was finished in 1590 after his death.$t$
where category = 'arte' and question = $q$¿Qué arquitecto diseñó originalmente la cúpula de San Pedro?$q$;

update public.questions set
  question_en = $t$In which museum is Botticelli's 'The Birth of Venus'?$t$,
  options_en  = $t$["Uffizi","Vatican","Louvre","Prado"]$t$::jsonb,
  context_en  = $t$'The Birth of Venus' (~1485) by Sandro Botticelli is in the Uffizi Gallery in Florence.$t$
where category = 'arte' and question = $q$¿En qué museo está "El nacimiento de Venus" de Botticelli?$q$;

update public.questions set
  question_en = $t$Who painted 'The Triumph of Death'?$t$,
  options_en  = $t$["Bruegel the Elder","Bosch","Memling","Van der Weyden"]$t$::jsonb,
  context_en  = $t$Pieter Bruegel the Elder painted 'The Triumph of Death' around 1562. It is in the Prado Museum.$t$
where category = 'arte' and question = $q$¿Quién pintó "El triunfo de la muerte"?$q$;

update public.questions set
  question_en = $t$What does 'Pop Art' represent?$t$,
  options_en  = $t$["Popular culture and consumerism","Religion","Nature","Politics"]$t$::jsonb,
  context_en  = $t$Pop Art uses images from popular and mass culture. Its leading exponents were Andy Warhol and Roy Lichtenstein.$t$
where category = 'arte' and question = $q$¿Qué tipo de arte representa el "Pop Art"?$q$;

update public.questions set
  question_en = $t$Which artist created 'Campbell's Soup' as a pop icon?$t$,
  options_en  = $t$["Lichtenstein","Warhol","Hockney","Rauschenberg"]$t$::jsonb,
  context_en  = $t$Andy Warhol created his famous 'Campbell's Soup Cans' in 1962, an icon of Pop Art.$t$
where category = 'arte' and question = $q$¿Qué artista creó "Sopa Campbell" como icono pop?$q$;

update public.questions set
  question_en = $t$Which 1960s movement stood out for spontaneous gestures and 'drip painting'?$t$,
  options_en  = $t$["Cubism","Abstract Expressionism","Op Art","Pop Art"]$t$::jsonb,
  context_en  = $t$Abstract Expressionism had in Jackson Pollock a leading exponent with his 'dripping' technique.$t$
where category = 'arte' and question = $q$¿Qué movimiento de los años 60 destacó por gestos espontáneos y "drip painting"?$q$;

update public.questions set
  question_en = $t$Who is famous for his 'drip' paintings?$t$,
  options_en  = $t$["Pollock","De Kooning","Rothko","Newman"]$t$::jsonb,
  context_en  = $t$Jackson Pollock revolutionized painting with his drip technique, letting paint fall onto canvases spread on the floor.$t$
where category = 'arte' and question = $q$¿Quién es famoso por sus pinturas "drip"?$q$;

update public.questions set
  question_en = $t$Which American painter painted blocks of color (red, orange, etc.)?$t$,
  options_en  = $t$["Pollock","Rothko","De Kooning","Newman"]$t$::jsonb,
  context_en  = $t$Mark Rothko is famous for his paintings of large blurred blocks of color that invite contemplation.$t$
where category = 'arte' and question = $q$¿Qué pintor estadounidense pintó bloques de color (rojo, naranja, etc.)?$q$;

update public.questions set
  question_en = $t$Who painted 'One and Three Chairs' (conceptual art)?$t$,
  options_en  = $t$["Kosuth","Beuys","Warhol","Koons"]$t$::jsonb,
  context_en  = $t$Joseph Kosuth made 'One and Three Chairs' in 1965, a key work of conceptual art.$t$
where category = 'arte' and question = $q$¿Quién pintó "Una y tres sillas" (arte conceptual)?$q$;

update public.questions set
  question_en = $t$Who is the author of the Tuileries Garden in Paris (original design)?$t$,
  options_en  = $t$["Le Nôtre","Mansart","Haussmann","Le Vau"]$t$::jsonb,
  context_en  = $t$André Le Nôtre, Louis XIV's gardener, redesigned the Tuileries Garden and designed the gardens of Versailles.$t$
where category = 'arte' and question = $q$¿Quién es el autor del Jardín de las Tullerías de París (diseño original)?$q$;

update public.questions set
  question_en = $t$Who painted 'The Descent from the Cross' in Antwerp Cathedral?$t$,
  options_en  = $t$["Van Dyck","Rubens","Bruegel","Memling"]$t$::jsonb,
  context_en  = $t$Peter Paul Rubens painted this monumental altarpiece around 1612-1614. It is a pinnacle work of the Flemish Baroque.$t$
where category = 'arte' and question = $q$¿Quién pintó "El descendimiento" en la Catedral de Amberes?$q$;

update public.questions set
  question_en = $t$Who is famous for his court portraits in the court of Charles IV?$t$,
  options_en  = $t$["Murillo","Goya","Velázquez","Sorolla"]$t$::jsonb,
  context_en  = $t$Francisco de Goya was court painter to Charles IV. He painted 'The Family of Charles IV' (1800) with astonishing frankness.$t$
where category = 'arte' and question = $q$¿Quién es famoso por sus retratos cortesanos en la corte de Carlos IV?$q$;

update public.questions set
  question_en = $t$What is Joan Miró's preferred technique?$t$,
  options_en  = $t$["Frescoes","Symbolic painting with flat colors","Hyperrealism","Trompe-l'œil"]$t$::jsonb,
  context_en  = $t$Miró developed his own language of symbolic figures, blots and flat colors. Linked to Surrealism and Catalonia.$t$
where category = 'arte' and question = $q$¿Cuál es la técnica preferida de Joan Miró?$q$;

update public.questions set
  question_en = $t$Which Catalan painter is associated with the Miró Foundation in Mallorca?$t$,
  options_en  = $t$["Tàpies","Joan Miró","Picasso","Dalí"]$t$::jsonb,
  context_en  = $t$The Pilar and Joan Miró Foundation in Mallorca preserves the painter's studio and many of his works.$t$
where category = 'arte' and question = $q$¿Qué pintor catalán colabora con la Fundación Miró en Mallorca?$q$;

update public.questions set
  question_en = $t$Which Aragonese Spanish painter is famous for paintings of types and customs?$t$,
  options_en  = $t$["Sorolla","Goya","Murillo","Madrazo"]$t$::jsonb,
  context_en  = $t$Francisco de Goya y Lucientes, born in Fuendetodos (Aragon), painted both court subjects and popular types.$t$
where category = 'arte' and question = $q$¿Qué pintor español aragonés es famoso por pinturas de tipos y costumbres?$q$;

update public.questions set
  question_en = $t$Which Valencian painter stood out for the Mediterranean light ('luminism')?$t$,
  options_en  = $t$["Sorolla","Picasso","Dalí","Mir"]$t$::jsonb,
  context_en  = $t$Joaquín Sorolla (1863-1923) stood out for the vibrant light of his Mediterranean beaches. His museum is in Madrid.$t$
where category = 'arte' and question = $q$¿Qué pintor valenciano destacó por la luz mediterránea ("luminismo")?$q$;

update public.questions set
  question_en = $t$Who painted 'Saturn Devouring His Son'?$t$,
  options_en  = $t$["Goya","Rubens","Caravaggio","Velázquez"]$t$::jsonb,
  context_en  = $t$Goya painted 'Saturn Devouring His Son' as part of the 'Black Paintings' (1819-1823) in the Quinta del Sordo.$t$
where category = 'arte' and question = $q$¿Quién pintó "Saturno devorando a su hijo"?$q$;

update public.questions set
  question_en = $t$Which English painter is famous for his atmospheric seascapes?$t$,
  options_en  = $t$["Constable","Turner","Reynolds","Gainsborough"]$t$::jsonb,
  context_en  = $t$J.M.W. Turner (1775-1851) revolutionized landscape painting with his effects of light and atmosphere. He anticipated Impressionism.$t$
where category = 'arte' and question = $q$¿Qué pintor inglés es famoso por sus paisajes marinos atmosféricos?$q$;

update public.questions set
  question_en = $t$Who sculpted 'The Kiss' (1882-1889)?$t$,
  options_en  = $t$["Brancusi","Rodin","Canova","Maillol"]$t$::jsonb,
  context_en  = $t$Auguste Rodin sculpted 'The Kiss' (several versions in marble and bronze) depicting Paolo and Francesca from the Divine Comedy.$t$
where category = 'arte' and question = $q$¿Quién esculpió "El beso" (1882-1889)?$q$;

update public.questions set
  question_en = $t$Who painted 'Luncheon on the Grass'?$t$,
  options_en  = $t$["Monet","Manet","Renoir","Degas"]$t$::jsonb,
  context_en  = $t$Édouard Manet scandalized the Paris Salon in 1863 with 'Le déjeuner sur l'herbe', a work that anticipated Impressionism.$t$
where category = 'arte' and question = $q$¿Quién pintó "El almuerzo sobre la hierba"?$q$;

update public.questions set
  question_en = $t$Which Barcelona modernist architect designed the Hospital de Sant Pau?$t$,
  options_en  = $t$["Gaudí","Domènech i Montaner","Puig i Cadafalch","Cadafalch"]$t$::jsonb,
  context_en  = $t$Lluís Domènech i Montaner designed the Hospital de Sant Pau in Barcelona (1902-1930). It is a World Heritage Site.$t$
where category = 'arte' and question = $q$¿Qué arquitecto modernista barcelonés diseñó el Hospital de Sant Pau?$q$;

update public.questions set
  question_en = $t$Which French literary and artistic movement rejected the rules in 1916?$t$,
  options_en  = $t$["Surrealism","Dadaism","Cubism","Futurism"]$t$::jsonb,
  context_en  = $t$Dadaism was born in 1916 at the Cabaret Voltaire in Zurich. It rejected logic, reason and bourgeois aesthetics.$t$
where category = 'arte' and question = $q$¿Qué movimiento literario y artístico francés rechazó las normas en 1916?$q$;

update public.questions set
  question_en = $t$Who created the 'Fountain' (urinal) of 1917?$t$,
  options_en  = $t$["Picasso","Duchamp","Magritte","Dalí"]$t$::jsonb,
  context_en  = $t$Marcel Duchamp presented 'Fountain' (a urinal signed 'R. Mutt') as a work of art in 1917, questioning the very notion of art.$t$
where category = 'arte' and question = $q$¿Quién creó la "Fuente" (urinario) de 1917?$q$;

update public.questions set
  question_en = $t$Which Chinese-American artist designed the Vietnam Veterans Memorial?$t$,
  options_en  = $t$["Maya Lin","I.M. Pei","Frank Lloyd Wright","Calatrava"]$t$::jsonb,
  context_en  = $t$Maya Lin designed the Vietnam Veterans Memorial in Washington (1982) while still a student.$t$
where category = 'arte' and question = $q$¿Qué artista chino-estadounidense diseñó el Memorial a Veteranos de Vietnam?$q$;

update public.questions set
  question_en = $t$Which Chinese-American architect designed the Louvre Pyramid?$t$,
  options_en  = $t$["Pei","Calatrava","Gehry","Foster"]$t$::jsonb,
  context_en  = $t$I.M. Pei (Ieoh Ming Pei) designed the famous glass pyramid of the Louvre, inaugurated in 1989.$t$
where category = 'arte' and question = $q$¿Qué arquitecto chino-estadounidense diseñó la pirámide del Louvre?$q$;

update public.questions set
  question_en = $t$Which Italian Renaissance painter painted 'Primavera'?$t$,
  options_en  = $t$["Botticelli","Titian","Ghirlandaio","Lippi"]$t$::jsonb,
  context_en  = $t$'Primavera' (~1482) by Sandro Botticelli is exhibited in the Uffizi Gallery in Florence.$t$
where category = 'arte' and question = $q$¿Qué pintor italiano renacentista pintó "Primavera"?$q$;

update public.questions set
  question_en = $t$Who sculpted a bronze 'David' (15th century, before Michelangelo's)?$t$,
  options_en  = $t$["Verrocchio","Donatello","Ghiberti","Pollaiolo"]$t$::jsonb,
  context_en  = $t$Donatello made his famous bronze 'David' around 1440. It was the first monumental nude since classical antiquity.$t$
where category = 'arte' and question = $q$¿Quién esculpió "Davide" en bronce (s. XV, antes que el de Miguel Ángel)?$q$;

update public.questions set
  question_en = $t$Which 15th-century Dutch painter painted 'The Descent from the Cross' (Prado)?$t$,
  options_en  = $t$["Van Eyck","Memling","Van der Weyden","Bruegel"]$t$::jsonb,
  context_en  = $t$Rogier van der Weyden painted 'The Descent from the Cross' (~1435), a pinnacle work of the Prado and of early Flemish painting.$t$
where category = 'arte' and question = $q$¿Qué pintor neerlandés del s. XV pintó "El descendimiento" (Prado)?$q$;

update public.questions set
  question_en = $t$Who painted the 'Brancacci Chapel' in Florence?$t$,
  options_en  = $t$["Masaccio","Botticelli","Ghirlandaio","Fra Angelico"]$t$::jsonb,
  context_en  = $t$Masaccio painted the frescoes of the Brancacci Chapel around 1425, a milestone of the early Florentine Renaissance.$t$
where category = 'arte' and question = $q$¿Quién pintó la "Capilla Brancacci" en Florencia?$q$;

update public.questions set
  question_en = $t$In which city is the Guggenheim Museum designed by Wright?$t$,
  options_en  = $t$["Bilbao","New York","Venice","Berlin"]$t$::jsonb,
  context_en  = $t$The Guggenheim in New York, designed by Frank Lloyd Wright, opened in 1959 with its characteristic interior spiral.$t$
where category = 'arte' and question = $q$¿En qué ciudad está el museo Guggenheim diseñado por Wright?$q$;

update public.questions set
  question_en = $t$Which Canadian-American architect designed the Bilbao Guggenheim?$t$,
  options_en  = $t$["Frank Lloyd Wright","Frank Gehry","Norman Foster","Calatrava"]$t$::jsonb,
  context_en  = $t$Frank Gehry designed the Guggenheim Bilbao, inaugurated in 1997. Its titanium form revolutionized architecture.$t$
where category = 'arte' and question = $q$¿Qué arquitecto canadiense-estadounidense diseñó el Guggenheim de Bilbao?$q$;

update public.questions set
  question_en = $t$Who is the author of the 'Italian Symphony'?$t$,
  options_en  = $t$["Beethoven","Mendelssohn","Brahms","Mozart"]$t$::jsonb,
  context_en  = $t$Felix Mendelssohn composed his 4th Symphony ('Italian') in 1833 after a trip through Italy.$t$
where category = 'arte' and question = $q$¿Quién es el autor de la "Sinfonía Italiana"?$q$;

update public.questions set
  question_en = $t$Which photographer is famous for his black-and-white landscapes of the American West?$t$,
  options_en  = $t$["Ansel Adams","Cartier-Bresson","Capa","Avedon"]$t$::jsonb,
  context_en  = $t$Ansel Adams (1902-1984) captured iconic landscapes of Yosemite National Park and other places in the American West.$t$
where category = 'arte' and question = $q$¿Qué fotógrafo es famoso por sus paisajes en blanco y negro del oeste de EE.UU.?$q$;

update public.questions set
  question_en = $t$Who is considered the father of modern color photography?$t$,
  options_en  = $t$["Stieglitz","Eggleston","Adams","Cartier-Bresson"]$t$::jsonb,
  context_en  = $t$William Eggleston elevated the use of color in art photography with his pioneering exhibition at the MoMA in 1976.$t$
where category = 'arte' and question = $q$¿Quién es considerado padre de la fotografía moderna en color?$q$;

update public.questions set
  question_en = $t$In what year was the Eiffel Tower built?$t$,
  options_en  = $t$["1875","1889","1900","1925"]$t$::jsonb,
  context_en  = $t$The Eiffel Tower was inaugurated in 1889 for the Paris World's Fair. Designed by Gustave Eiffel.$t$
where category = 'arte' and question = $q$¿En qué año se construyó la Torre Eiffel?$q$;

update public.questions set
  question_en = $t$Who is the author of the Statue of Liberty?$t$,
  options_en  = $t$["Rodin","Bartholdi","Eiffel","Brancusi"]$t$::jsonb,
  context_en  = $t$Frédéric Auguste Bartholdi sculpted the Statue of Liberty. The internal structure was by Gustave Eiffel. A gift from France to the U.S. (1886).$t$
where category = 'arte' and question = $q$¿Quién es el autor de la Estatua de la Libertad?$q$;

update public.questions set
  question_en = $t$Who painted 'American Gothic' (1930)?$t$,
  options_en  = $t$["Hopper","Grant Wood","Pollock","Whistler"]$t$::jsonb,
  context_en  = $t$Grant Wood painted 'American Gothic' in 1930. It depicts a farmer and his daughter in front of a house in Iowa.$t$
where category = 'arte' and question = $q$¿Quién pintó "American Gothic" (1930)?$q$;

update public.questions set
  question_en = $t$Which American painter is famous for 'Nighthawks' (1942)?$t$,
  options_en  = $t$["Hopper","Wyeth","Pollock","O'Keeffe"]$t$::jsonb,
  context_en  = $t$Edward Hopper painted 'Nighthawks' in 1942, an icon of American urban loneliness.$t$
where category = 'arte' and question = $q$¿Qué pintor estadounidense es famoso por "Nighthawks" (1942)?$q$;

update public.questions set
  question_en = $t$Which Mexican painter self-portrayed herself with flowers in her hair?$t$,
  options_en  = $t$["María Izquierdo","Frida Kahlo","Tamara de Lempicka","Leonora Carrington"]$t$::jsonb,
  context_en  = $t$Frida Kahlo (1907-1954) painted numerous self-portraits mixing surrealist, indigenous and personal elements.$t$
where category = 'arte' and question = $q$¿Qué pintora mexicana se autorretrató con flores en el pelo?$q$;

update public.questions set
  question_en = $t$Who painted 'The Two Fridas'?$t$,
  options_en  = $t$["Diego Rivera","Frida Kahlo","Remedios Varo","Leonora Carrington"]$t$::jsonb,
  context_en  = $t$'The Two Fridas' (1939) by Frida Kahlo depicts a double image of the artist after her divorce from Diego Rivera.$t$
where category = 'arte' and question = $q$¿Quién pintó "Las dos Fridas"?$q$;

update public.questions set
  question_en = $t$Who painted 'Les Demoiselles d'Avignon' (1907)?$t$,
  options_en  = $t$["Braque","Picasso","Léger","Gris"]$t$::jsonb,
  context_en  = $t$'Les Demoiselles d'Avignon' by Picasso (1907) marked the beginning of Cubism. It is in the MoMA in New York.$t$
where category = 'arte' and question = $q$¿Quién pintó "Las señoritas de Avignon" (1907)?$q$;

update public.questions set
  question_en = $t$Which artistic movement did André Breton found in 1924?$t$,
  options_en  = $t$["Cubism","Dadaism","Surrealism","Futurism"]$t$::jsonb,
  context_en  = $t$André Breton published the 'Surrealist Manifesto' in 1924, founding this movement linked to the unconscious and dreams.$t$
where category = 'arte' and question = $q$¿Qué movimiento artístico fundó André Breton en 1924?$q$;

update public.questions set
  question_en = $t$Which Catalan Surrealist painter starred in 'Un Chien Andalou' with Buñuel?$t$,
  options_en  = $t$["Joan Miró","Salvador Dalí","Pablo Picasso","Antoni Tàpies"]$t$::jsonb,
  context_en  = $t$Salvador Dalí collaborated with Luis Buñuel on 'Un Chien Andalou' (1929) and 'L'Age d'Or' (1930).$t$
where category = 'arte' and question = $q$¿Qué pintor surrealista catalán protagonizó "Un perro andaluz" con Buñuel?$q$;

update public.questions set
  question_en = $t$Who painted 'The Great Wave' (Japanese woodblock print)?$t$,
  options_en  = $t$["Hokusai","Hiroshige","Utamaro","Ogata Kōrin"]$t$::jsonb,
  context_en  = $t$'The Great Wave off Kanagawa' (~1831) is a woodblock print by Katsushika Hokusai, part of the series '36 Views of Mount Fuji'.$t$
where category = 'arte' and question = $q$¿Quién pintó "La gran ola" (xilografía japonesa)?$q$;

update public.questions set
  question_en = $t$Who painted 'The Nobleman with his Hand on his Chest'?$t$,
  options_en  = $t$["Velázquez","El Greco","Titian","Rivera"]$t$::jsonb,
  context_en  = $t$El Greco painted 'The Nobleman with his Hand on his Chest' (~1580). It is in the Prado Museum.$t$
where category = 'arte' and question = $q$¿Quién pintó "El caballero de la mano en el pecho"?$q$;

update public.questions set
  question_en = $t$Which Flemish-German painter painted 'Christ on the Cross' with two panels?$t$,
  options_en  = $t$["Van Eyck","Grünewald","Bosch","Cranach"]$t$::jsonb,
  context_en  = $t$Matthias Grünewald painted the 'Isenheim Altarpiece' (1512-1516), a pinnacle work of the late Gothic with a dramatic Christ on the cross.$t$
where category = 'arte' and question = $q$¿Qué pintor flamenco-alemán pintó "Cristo en la cruz" con dos paneles?$q$;

update public.questions set
  question_en = $t$Which Italian Renaissance architect wrote 'The Four Books of Architecture'?$t$,
  options_en  = $t$["Alberti","Bramante","Palladio","Vasari"]$t$::jsonb,
  context_en  = $t$Andrea Palladio published 'I quattro libri dell'architettura' in 1570. It influenced classical architecture in later centuries.$t$
where category = 'arte' and question = $q$¿Qué arquitecto italiano renacentista escribió "Los cuatro libros de arquitectura"?$q$;

update public.questions set
  question_en = $t$Which Spanish Baroque painter painted immaculate virgins?$t$,
  options_en  = $t$["Velázquez","Murillo","Zurbarán","Ribera"]$t$::jsonb,
  context_en  = $t$Bartolomé Esteban Murillo (1617-1682) painted numerous 'Immaculates' very popular in Baroque Spain.$t$
where category = 'arte' and question = $q$¿Qué pintor barroco español pintó vírgenes de inmaculadas?$q$;

update public.questions set
  question_en = $t$Who painted 'The Sleep of Reason Produces Monsters'?$t$,
  options_en  = $t$["Velázquez","Goya","Sorolla","Murillo"]$t$::jsonb,
  context_en  = $t$Goya engraved 'The Sleep of Reason Produces Monsters' as part of 'Los Caprichos' (1797-1799).$t$
where category = 'arte' and question = $q$¿Quién pintó "El sueño de la razón produce monstruos"?$q$;

update public.questions set
  question_en = $t$Which Italian architect designed the Capitoline Square in Rome?$t$,
  options_en  = $t$["Bramante","Bernini","Michelangelo","Vignola"]$t$::jsonb,
  context_en  = $t$Michelangelo redesigned the Capitoline Square (Piazza del Campidoglio) in Rome from 1538.$t$
where category = 'arte' and question = $q$¿Qué arquitecto italiano diseñó la Plaza del Capitolio en Roma?$q$;

update public.questions set
  question_en = $t$Which musical work did Vivaldi compose in 1725?$t$,
  options_en  = $t$["The Four Seasons","The Messiah","Requiem","Don Giovanni"]$t$::jsonb,
  context_en  = $t$Antonio Vivaldi composed 'Le quattro stagioni' (The Four Seasons) around 1718-1720, published in Amsterdam in 1725.$t$
where category = 'arte' and question = $q$¿Qué obra musical compuso Vivaldi en 1725?$q$;

update public.questions set
  question_en = $t$Who painted 'The Raft of the Medusa'?$t$,
  options_en  = $t$["Géricault","Delacroix","Ingres","David"]$t$::jsonb,
  context_en  = $t$Théodore Géricault painted 'The Raft of the Medusa' (1818-1819) after the shipwreck of the Méduse. It is in the Louvre.$t$
where category = 'arte' and question = $q$¿Quién pintó "La balsa de la Medusa"?$q$;

update public.questions set
  question_en = $t$Which German Renaissance painter painted 'Knight, Death and the Devil'?$t$,
  options_en  = $t$["Cranach","Dürer","Holbein","Altdorfer"]$t$::jsonb,
  context_en  = $t$Albrecht Dürer made this engraving in 1513. It is one of his three 'Master Prints'.$t$
where category = 'arte' and question = $q$¿Qué pintor renacentista alemán pintó "El caballero, la muerte y el diablo"?$q$;

update public.questions set
  question_en = $t$Who painted 'Girl with Balloon' on the walls of London?$t$,
  options_en  = $t$["JR","Banksy","Shepard Fairey","Os Gêmeos"]$t$::jsonb,
  context_en  = $t$Banksy, an anonymous British street artist, created 'Girl with Balloon' in 2002, one of his most iconic works.$t$
where category = 'arte' and question = $q$¿Quién pintó "Niña con globo" en las paredes de Londres?$q$;

update public.questions set
  question_en = $t$Which Valencian architect designed the City of Arts and Sciences?$t$,
  options_en  = $t$["Calatrava","Foster","Moneo","Mansilla"]$t$::jsonb,
  context_en  = $t$Santiago Calatrava designed the City of Arts and Sciences in Valencia (1998-2009).$t$
where category = 'arte' and question = $q$¿Qué arquitecto valenciano diseñó la Ciudad de las Artes y las Ciencias?$q$;

update public.questions set
  question_en = $t$Which Dutch Baroque painter made many self-portraits?$t$,
  options_en  = $t$["Vermeer","Hals","Rembrandt","Bruegel"]$t$::jsonb,
  context_en  = $t$Rembrandt van Rijn painted more than 80 self-portraits throughout his life, documenting his physical and artistic evolution.$t$
where category = 'arte' and question = $q$¿Qué pintor barroco neerlandés realizó muchos autorretratos?$q$;

update public.questions set
  question_en = $t$Which Iranian-British architect designed the Heydar Aliyev Center in Baku?$t$,
  options_en  = $t$["Zaha Hadid","Kazuyo Sejima","Lina Bo Bardi","Lacaton"]$t$::jsonb,
  context_en  = $t$Zaha Hadid (1950-2016) was the first woman to win the Pritzker Prize (2004). She designed fluid and dynamic buildings.$t$
where category = 'arte' and question = $q$¿Qué arquitecta iraní-británica diseñó el Centro Heydar Aliyev de Bakú?$q$;

update public.questions set
  question_en = $t$Which artistic movement was associated with machines and speed?$t$,
  options_en  = $t$["Cubism","Futurism","Dadaism","Surrealism"]$t$::jsonb,
  context_en  = $t$Italian Futurism, founded by Marinetti in 1909, exalted modernity, the machine and speed.$t$
where category = 'arte' and question = $q$¿Qué movimiento artístico estuvo asociado a las máquinas y la velocidad?$q$;

update public.questions set
  question_en = $t$Which architect led the reconstruction of the Reichstag in Berlin?$t$,
  options_en  = $t$["Foster","Calatrava","Piano","Nouvel"]$t$::jsonb,
  context_en  = $t$Norman Foster (British) designed the transparent dome of the Reichstag in 1999 after German reunification.$t$
where category = 'arte' and question = $q$¿Qué arquitecto suizo dirigió la reconstrucción del Reichstag de Berlín?$q$;

update public.questions set
  question_en = $t$Who painted 'Two Tahitian Women' (1899)?$t$,
  options_en  = $t$["Cézanne","Gauguin","Van Gogh","Bonnard"]$t$::jsonb,
  context_en  = $t$Paul Gauguin painted numerous works during his stay in Tahiti. 'Two Tahitian Women' (1899) is in the Met in New York.$t$
where category = 'arte' and question = $q$¿Quién pintó "Las dos Tahitianas" (1899)?$q$;

update public.questions set
  question_en = $t$Who sculpted 'Christ the Redeemer' in Rio de Janeiro?$t$,
  options_en  = $t$["Brecheret","Landowski","Niemeyer","Costa"]$t$::jsonb,
  context_en  = $t$Paul Landowski sculpted the Christ the Redeemer of Corcovado, inaugurated in 1931. Chief engineer: Heitor da Silva Costa.$t$
where category = 'arte' and question = $q$¿Quién esculpió "Cristo Redentor" en Río de Janeiro?$q$;

update public.questions set
  question_en = $t$Which French Impressionist woman painter painted bathers (19th century)?$t$,
  options_en  = $t$["Mary Cassatt","Berthe Morisot","Marie Bracquemond","Eva Gonzalès"]$t$::jsonb,
  context_en  = $t$Berthe Morisot was one of the few women in the Impressionist core. Her work depicts intimate and feminine life.$t$
where category = 'arte' and question = $q$¿Qué pintora francesa impresionista pintó cuadros de bañistas (s. XIX)?$q$;

update public.questions set
  question_en = $t$Which Post-Impressionist painter fell out with Gauguin after a fight?$t$,
  options_en  = $t$["Cézanne","Van Gogh","Toulouse-Lautrec","Renoir"]$t$::jsonb,
  context_en  = $t$Van Gogh and Gauguin lived together in Arles in 1888. The relationship ended with Van Gogh's cut-ear episode.$t$
where category = 'arte' and question = $q$¿Qué pintor postimpresionista cortó con Gauguin tras una pelea?$q$;

update public.questions set
  question_en = $t$Who painted 'Bathers at Asnières' (1884)?$t$,
  options_en  = $t$["Seurat","Signac","Pissarro","Cézanne"]$t$::jsonb,
  context_en  = $t$Georges Seurat founded Pointillism. 'Bathers at Asnières' (1884) and 'A Sunday on La Grande Jatte' (1886) are his masterpieces.$t$
where category = 'arte' and question = $q$¿Quién pintó "Bañistas en Asnières" (1884)?$q$;

update public.questions set
  question_en = $t$Which Barcelona modernist architect designed the Palau de la Música Catalana?$t$,
  options_en  = $t$["Gaudí","Domènech i Montaner","Puig i Cadafalch","Sert"]$t$::jsonb,
  context_en  = $t$Lluís Domènech i Montaner designed the Palau de la Música Catalana (1905-1908), a World Heritage Site.$t$
where category = 'arte' and question = $q$¿Qué arquitecto modernista barcelonés diseñó el Palau de la Música Catalana?$q$;

update public.questions set
  question_en = $t$Which author wrote 'The Decameron'?$t$,
  options_en  = $t$["Petrarch","Boccaccio","Dante","Machiavelli"]$t$::jsonb,
  context_en  = $t$Giovanni Boccaccio wrote 'Il Decameron' (1351-1353), a collection of 100 tales told by young people fleeing the plague.$t$
where category = 'arte' and question = $q$¿Qué autor escribió "El Decamerón"?$q$;

update public.questions set
  question_en = $t$Which Renaissance work did Petrarch write?$t$,
  options_en  = $t$["The Decameron","Canzoniere","The Divine Comedy","Orlando Furioso"]$t$::jsonb,
  context_en  = $t$Petrarch wrote the 'Canzoniere', 366 poems largely dedicated to his beloved Laura.$t$
where category = 'arte' and question = $q$¿Qué obra renacentista escribió Petrarca?$q$;

update public.questions set
  question_en = $t$Who is the author of 'Orlando Furioso'?$t$,
  options_en  = $t$["Tasso","Ariosto","Boccaccio","Machiavelli"]$t$::jsonb,
  context_en  = $t$Ludovico Ariosto published 'Orlando Furioso' in 1516. An epic-chivalric poem of the Italian Renaissance.$t$
where category = 'arte' and question = $q$¿Quién es autor del "Orlando furioso"?$q$;

update public.questions set
  question_en = $t$Which American painter painted 'Christina's World' (1948)?$t$,
  options_en  = $t$["Hopper","Wyeth","O'Keeffe","Rockwell"]$t$::jsonb,
  context_en  = $t$Andrew Wyeth painted 'Christina's World' (1948), one of the icons of 20th-century American realism.$t$
where category = 'arte' and question = $q$¿Qué pintor americano pintó "Christina's World" (1948)?$q$;

update public.questions set
  question_en = $t$Who painted 'Marilyn Monroe' in a pop silkscreen?$t$,
  options_en  = $t$["Lichtenstein","Warhol","Rauschenberg","Johns"]$t$::jsonb,
  context_en  = $t$Andy Warhol created the 'Marilyn' series in 1962, shortly after the actress's death, reproducing her image in vivid colors.$t$
where category = 'arte' and question = $q$¿Quién pintó "Marilyn Monroe" en serigrafía pop?$q$;


-- ── filosofia (155) ──
update public.questions set
  question_en = $t$Who said 'I only know that I know nothing'?$t$,
  options_en  = $t$["Plato","Aristotle","Socrates","Epicurus"]$t$::jsonb,
  context_en  = $t$Socrates (469-399 BC) is famous for this statement of intellectual humility. We know him through the writings of his disciple Plato.$t$
where category = 'filosofia' and question = $q$¿Quién dijo «Solo sé que no sé nada»?$q$;

update public.questions set
  question_en = $t$Which school proposed 'the greatest good for the greatest number'?$t$,
  options_en  = $t$["Kantianism","Utilitarianism","Stoicism","Existentialism"]$t$::jsonb,
  context_en  = $t$Utilitarianism, founded by Jeremy Bentham and developed by J.S. Mill, maximizes total happiness. It is very influential in politics and economics.$t$
where category = 'filosofia' and question = $q$¿Qué corriente propuso «el mayor bien para el mayor número»?$q$;

update public.questions set
  question_en = $t$Who wrote 'Thus Spoke Zarathustra'?$t$,
  options_en  = $t$["Schopenhauer","Marx","Heidegger","Nietzsche"]$t$::jsonb,
  context_en  = $t$Nietzsche published 'Thus Spoke Zarathustra' (1883-1885), where he introduces the 'superman' (Übermensch) and the 'will to power'.$t$
where category = 'filosofia' and question = $q$¿Quién escribió «Así habló Zaratustra»?$q$;

update public.questions set
  question_en = $t$Which philosopher wrote 'The Republic'?$t$,
  options_en  = $t$["Aristotle","Plato","Socrates","Epicurus"]$t$::jsonb,
  context_en  = $t$Plato wrote 'The Republic' (~380 BC), where he sets out his theory of the ideal state and the famous allegory of the cave.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo escribió «La República»?$q$;

update public.questions set
  question_en = $t$Who wrote 'Das Kapital'?$t$,
  options_en  = $t$["Friedrich Engels","Vladimir Lenin","Karl Marx","Mao Zedong"]$t$::jsonb,
  context_en  = $t$Karl Marx published the first volume of 'Das Kapital' in 1867. Along with 'The Communist Manifesto' (1848), it founded Marxism.$t$
where category = 'filosofia' and question = $q$¿Quién escribió «El Capital»?$q$;

update public.questions set
  question_en = $t$What does 'cogito ergo sum' mean?$t$,
  options_en  = $t$["I live, therefore I exist","I think, therefore I exist","I feel, therefore I exist","I doubt, therefore I think"]$t$::jsonb,
  context_en  = $t$'I think, therefore I exist' is Descartes's phrase (1637). Doubting everything, the only certainty is that there is an 'I' that thinks and doubts.$t$
where category = 'filosofia' and question = $q$¿Qué significa «cogito ergo sum»?$q$;

update public.questions set
  question_en = $t$Who was Aristotle?$t$,
  options_en  = $t$["A disciple of Plato and teacher of Alexander the Great","A teacher of Socrates","A Roman philosopher","An Athenian sophist"]$t$::jsonb,
  context_en  = $t$Aristotle (384-322 BC) was a disciple of Plato and tutor of Alexander the Great. He founded the Lyceum and laid the foundations of logic, biology and ethics.$t$
where category = 'filosofia' and question = $q$¿Quién fue Aristóteles?$q$;

update public.questions set
  question_en = $t$What is 'Occam's razor'?$t$,
  options_en  = $t$["An argument for the existence of God","The principle of parsimony: the simplest explanation is usually the correct one","A critique of skepticism","A method of Buddhist meditation"]$t$::jsonb,
  context_en  = $t$Occam's razor (William of Ockham, 14th century) says entities should not be multiplied without need. In science: the simplest hypothesis is preferable.$t$
where category = 'filosofia' and question = $q$¿Qué es la «navaja de Occam»?$q$;

update public.questions set
  question_en = $t$Who formulated the 'categorical imperative'?$t$,
  options_en  = $t$["Hegel","Kant","Fichte","Schelling"]$t$::jsonb,
  context_en  = $t$Immanuel Kant formulated the categorical imperative: 'Act only according to the maxim that you can will to be a universal law'. It is the basis of his deontological ethics.$t$
where category = 'filosofia' and question = $q$¿Quién formuló el «imperativo categórico»?$q$;

update public.questions set
  question_en = $t$What is existentialism?$t$,
  options_en  = $t$["The belief in predetermination","The school that places individual existence before essence","The philosophy of language","The abstract study of being"]$t$::jsonb,
  context_en  = $t$Existentialism (Sartre, Camus, Kierkegaard) holds that 'existence precedes essence': we are what we decide to be, with total freedom and responsibility.$t$
where category = 'filosofia' and question = $q$¿Qué es el existencialismo?$q$;

update public.questions set
  question_en = $t$Who wrote 'Being and Nothingness'?$t$,
  options_en  = $t$["Albert Camus","Simone de Beauvoir","Jean-Paul Sartre","Maurice Merleau-Ponty"]$t$::jsonb,
  context_en  = $t$Jean-Paul Sartre published 'Being and Nothingness' in 1943, a founding work of atheist existentialism. 'Hell is other people' is another of his famous phrases.$t$
where category = 'filosofia' and question = $q$¿Quién escribió «El ser y la nada»?$q$;

update public.questions set
  question_en = $t$Which philosopher said 'God is dead'?$t$,
  options_en  = $t$["Schopenhauer","Feuerbach","Marx","Nietzsche"]$t$::jsonb,
  context_en  = $t$Nietzsche proclaimed 'God is dead' in 'The Gay Science' (1882) to signal that traditional values no longer have a foundation in modern culture.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo dijo «Dios ha muerto»?$q$;

update public.questions set
  question_en = $t$What is Stoicism?$t$,
  options_en  = $t$["The pursuit of pleasure as the supreme good","The philosophy that seeks virtue and indifference to suffering","Moral relativism","The denial of reality"]$t$::jsonb,
  context_en  = $t$Stoicism (Zeno of Citium, Epictetus, Marcus Aurelius) seeks virtue and tranquility by accepting what we cannot control and controlling our reactions.$t$
where category = 'filosofia' and question = $q$¿Qué es el estoicismo?$q$;

update public.questions set
  question_en = $t$What is empiricism?$t$,
  options_en  = $t$["The philosophy based on pure reason","The school that holds that knowledge comes from sensory experience","The study of moral values","Formal logic"]$t$::jsonb,
  context_en  = $t$Empiricism (Locke, Hume, Berkeley) holds that all knowledge comes from experience. It opposes the rationalism of Descartes and Leibniz.$t$
where category = 'filosofia' and question = $q$¿Qué es el empirismo?$q$;

update public.questions set
  question_en = $t$Who wrote 'Meditations' (the Stoic book)?$t$,
  options_en  = $t$["Epictetus","Seneca","Marcus Aurelius","Cicero"]$t$::jsonb,
  context_en  = $t$Marcus Aurelius, Roman emperor (AD 161-180), wrote his 'Meditations' as a personal diary of Stoic reflections. It was never written to be published.$t$
where category = 'filosofia' and question = $q$¿Quién escribió «Meditaciones» (el libro estoico)?$q$;

update public.questions set
  question_en = $t$What is nihilism?$t$,
  options_en  = $t$["The belief in free will","The denial of all meaning, value or objective truth","Philosophical optimism","The pursuit of happiness"]$t$::jsonb,
  context_en  = $t$Nihilism holds that life lacks meaning or objective values. Nietzsche described it as a consequence of the 'death of God'.$t$
where category = 'filosofia' and question = $q$¿Qué es el nihilismo?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Social Contract'?$t$,
  options_en  = $t$["Montesquieu","Voltaire","Locke","Rousseau"]$t$::jsonb,
  context_en  = $t$Jean-Jacques Rousseau published 'The Social Contract' in 1762. It influenced the French Revolution with ideas about popular sovereignty and the general will.$t$
where category = 'filosofia' and question = $q$¿Quién escribió «El contrato social»?$q$;

update public.questions set
  question_en = $t$What did Plato hold about reality?$t$,
  options_en  = $t$["That only the material exists","That there are perfect Ideas of which the world is an imperfect copy","That reality is illusory","That only what we can touch exists"]$t$::jsonb,
  context_en  = $t$Plato's theory of Ideas (or Forms) holds that the sensible world is an imperfect shadow of a higher world of eternal, perfect Ideas.$t$
where category = 'filosofia' and question = $q$¿Qué sostenía Platón sobre la realidad?$q$;

update public.questions set
  question_en = $t$Who was Epicurus?$t$,
  options_en  = $t$["A Roman Stoic philosopher","A Greek philosopher who sought happiness in moderate pleasure","An Athenian sophist","A disciple of Socrates"]$t$::jsonb,
  context_en  = $t$Epicurus (341-270 BC) founded Epicureanism: the pursuit of pleasure (hedone) understood as the absence of pain and disturbance (ataraxia), not as excess.$t$
where category = 'filosofia' and question = $q$¿Quién fue Epicuro?$q$;

update public.questions set
  question_en = $t$What is Hegelian dialectics?$t$,
  options_en  = $t$["A Greek rhetorical method","The thesis-antithesis-synthesis process by which history advances","A form of mathematical logic","The study of language"]$t$::jsonb,
  context_en  = $t$Hegel proposed that history advances through conflicts (thesis vs. antithesis) resolved in transcending syntheses. Marx adapted this to historical materialism.$t$
where category = 'filosofia' and question = $q$¿Qué es la dialéctica hegeliana?$q$;

update public.questions set
  question_en = $t$Which philosopher wrote the 'Tractatus Logico-Philosophicus'?$t$,
  options_en  = $t$["Bertrand Russell","G.E. Moore","Ludwig Wittgenstein","Karl Popper"]$t$::jsonb,
  context_en  = $t$Wittgenstein published the Tractatus in 1921, holding that the limits of language are the limits of the world. He later revised his thought in the 'Philosophical Investigations'.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo escribió el «Tractatus Logico-Philosophicus»?$q$;

update public.questions set
  question_en = $t$What is phenomenology?$t$,
  options_en  = $t$["The study of weather phenomena","The philosophy that studies conscious experience as it appears","The analysis of language","A political theory"]$t$::jsonb,
  context_en  = $t$Phenomenology (Husserl, Heidegger, Merleau-Ponty) studies the structure of conscious experience 'as it is given to us', without metaphysical presuppositions.$t$
where category = 'filosofia' and question = $q$¿Qué es la fenomenología?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Prince'?$t$,
  options_en  = $t$["Thomas More","Erasmus of Rotterdam","Niccolò Machiavelli","Thomas Aquinas"]$t$::jsonb,
  context_en  = $t$Machiavelli published 'The Prince' in 1513, a work of political philosophy that separates morality from politics. 'The end justifies the means' is associated with his thought.$t$
where category = 'filosofia' and question = $q$¿Quién escribió «El príncipe»?$q$;

update public.questions set
  question_en = $t$What is pragmatism?$t$,
  options_en  = $t$["The pursuit of absolute truth","The philosophy that values ideas by their practical consequences","The defense of the free market","The study of applied ethics"]$t$::jsonb,
  context_en  = $t$Pragmatism (Peirce, James, Dewey) evaluates ideas by their usefulness and practical consequences. It arose in the U.S. in the late 19th century.$t$
where category = 'filosofia' and question = $q$¿Qué es el pragmatismo?$q$;

update public.questions set
  question_en = $t$Which philosopher wrote 'Summa Theologica'?$t$,
  options_en  = $t$["Saint Augustine","Saint Anselm","Albertus Magnus","Thomas Aquinas"]$t$::jsonb,
  context_en  = $t$Thomas Aquinas (1225-1274) wrote the Summa Theologica, attempting to reconcile the Christian faith with the philosophy of Aristotle.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo escribió «Summa Teológica»?$q$;

update public.questions set
  question_en = $t$Who said 'Man is the measure of all things'?$t$,
  options_en  = $t$["Socrates","Plato","Protagoras","Aristotle"]$t$::jsonb,
  context_en  = $t$Protagoras (~490-420 BC), a Greek sophist, held this relativism: truth depends on each person's point of view. Socrates opposed this idea.$t$
where category = 'filosofia' and question = $q$¿Quién dijo «El hombre es la medida de todas las cosas»?$q$;

update public.questions set
  question_en = $t$Which philosopher wrote 'Metaphysical Meditations'?$t$,
  options_en  = $t$["Spinoza","Leibniz","Descartes","Hume"]$t$::jsonb,
  context_en  = $t$Descartes published 'Metaphysical Meditations' in 1641. It introduces the method of Cartesian doubt to find indubitable truths, arriving at 'cogito ergo sum'.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo escribió «Meditaciones metafísicas»?$q$;

update public.questions set
  question_en = $t$What did the philosopher Heraclitus hold?$t$,
  options_en  = $t$["That everything is immutable","That fire is the origin of everything and everything is in constant change","That water is the principle of everything","That atoms form all reality"]$t$::jsonb,
  context_en  = $t$Heraclitus of Ephesus (~500 BC) held that 'everything flows' (panta rhei) and that fire is the principle of the universe. His famous phrase: 'You cannot step twice into the same river'.$t$
where category = 'filosofia' and question = $q$¿Qué sostenía el filósofo Heráclito?$q$;

update public.questions set
  question_en = $t$What is rationalism?$t$,
  options_en  = $t$["The philosophy based on sensory experience","The school that holds that reason is the main source of knowledge","The study of formal logic","The philosophy of common sense"]$t$::jsonb,
  context_en  = $t$Rationalism (Descartes, Spinoza, Leibniz) holds that reason, not the senses, is the source of true knowledge. It opposes the empiricism of Locke and Hume.$t$
where category = 'filosofia' and question = $q$¿Qué es el racionalismo?$q$;

update public.questions set
  question_en = $t$Who was Baruch Spinoza?$t$,
  options_en  = $t$["A Dutch rationalist philosopher who identified God with nature","An English empiricist","A medieval scholastic","A philosopher of the French Enlightenment"]$t$::jsonb,
  context_en  = $t$Spinoza (1632-1677) was a rationalist philosopher who identified God with Nature (pantheism). He was excommunicated from the Jewish community of Amsterdam.$t$
where category = 'filosofia' and question = $q$¿Quién fue Baruch Spinoza?$q$;

update public.questions set
  question_en = $t$What is Mill's utilitarianism?$t$,
  options_en  = $t$["The pursuit of individual pleasure","Maximizing total happiness considering quality, not just quantity, of pleasure","The fulfillment of moral duty","Virtue as an end in itself"]$t$::jsonb,
  context_en  = $t$J.S. Mill refined Bentham's utilitarianism by distinguishing higher pleasures (intellectual) from lower ones. He also defended individual freedom in 'On Liberty' (1859).$t$
where category = 'filosofia' and question = $q$¿Qué es el utilitarismo de Mill?$q$;

update public.questions set
  question_en = $t$What is analytic philosophy?$t$,
  options_en  = $t$["Continental European philosophy","The philosophical school centered on the logical analysis of language","The study of consciousness","Anglo-Saxon phenomenology"]$t$::jsonb,
  context_en  = $t$Analytic philosophy (Russell, Wittgenstein, Frege) focuses on the logical analysis of language and arguments. It dominates in the Anglo-Saxon world.$t$
where category = 'filosofia' and question = $q$¿Qué es la filosofía analítica?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Critique of Pure Reason'?$t$,
  options_en  = $t$["Hegel","Fichte","Kant","Schopenhauer"]$t$::jsonb,
  context_en  = $t$Kant published 'The Critique of Pure Reason' in 1781. It proposes that knowledge arises from the combination of sensory experience and a priori categories of the understanding.$t$
where category = 'filosofia' and question = $q$¿Quién escribió «La crítica de la razón pura»?$q$;

update public.questions set
  question_en = $t$What is determinism?$t$,
  options_en  = $t$["The belief in free will","The doctrine that every event is caused by prior events","The philosophy of chance","Religious fatalism"]$t$::jsonb,
  context_en  = $t$Determinism holds that every event, including human actions, is caused by prior events. It opposes free will. Laplace imagined a 'demon' that would know the future.$t$
where category = 'filosofia' and question = $q$¿Qué es el determinismo?$q$;

update public.questions set
  question_en = $t$Which philosopher developed the concept of the 'superman'?$t$,
  options_en  = $t$["Schopenhauer","Marx","Heidegger","Nietzsche"]$t$::jsonb,
  context_en  = $t$Nietzsche developed the concept of the 'Übermensch' (superman) in 'Thus Spoke Zarathustra' (1883). The superman creates his own values beyond good and evil.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo desarrolló el concepto del «superhombre»?$q$;

update public.questions set
  question_en = $t$What is virtue ethics?$t$,
  options_en  = $t$["Ethics based on following rules","Ethics centered on the character and virtues of the agent, not on actions","Consequentialist ethics","The ethics of duty"]$t$::jsonb,
  context_en  = $t$Virtue ethics (Aristotle, MacIntyre) focuses on cultivating virtues like prudence, courage and justice to achieve eudaimonia (human flourishing).$t$
where category = 'filosofia' and question = $q$¿Qué es la ética de la virtud?$q$;

update public.questions set
  question_en = $t$Who was Simone de Beauvoir?$t$,
  options_en  = $t$["A French novelist unrelated to philosophy","An existentialist philosopher and pioneer of modern feminism","A disciple of Husserl","An analytic philosopher"]$t$::jsonb,
  context_en  = $t$De Beauvoir (1908-1986) was an existentialist philosopher, writer and feminist. 'The Second Sex' (1949) is a founding text of feminism: 'One is not born, but becomes, a woman'.$t$
where category = 'filosofia' and question = $q$¿Quién fue Simone de Beauvoir?$q$;

update public.questions set
  question_en = $t$What is the Socratic method?$t$,
  options_en  = $t$["A rhetorical method to convince","The method of questions and answers (maieutics) to discover the truth","A form of parliamentary debate","A mathematical method"]$t$::jsonb,
  context_en  = $t$Socratic maieutics consists of asking questions so that the interlocutor discovers the truth for themselves. Socrates compared the method to the work of his mother, a midwife.$t$
where category = 'filosofia' and question = $q$¿Qué es la dialéctica socrática?$q$;

update public.questions set
  question_en = $t$What is moral relativism?$t$,
  options_en  = $t$["The belief in universal moral values","The doctrine that moral values vary according to culture or individual","The ethics of duty","Skepticism about reality"]$t$::jsonb,
  context_en  = $t$Moral relativism holds that there are no universal ethical truths: what is right depends on cultural or individual context. It opposes Kant's moral universalism.$t$
where category = 'filosofia' and question = $q$¿Qué es el relativismo moral?$q$;

update public.questions set
  question_en = $t$Who was Michel Foucault?$t$,
  options_en  = $t$["A French positivist philosopher","A poststructuralist philosopher who studied the relationships between power and knowledge","An existentialist contemporary of Sartre","A neo-Marxist"]$t$::jsonb,
  context_en  = $t$Foucault (1926-1984) analyzed how power operates through knowledge, institutions and social practices. His works on prisons, madness and sexuality are essential.$t$
where category = 'filosofia' and question = $q$¿Quién fue Michel Foucault?$q$;

update public.questions set
  question_en = $t$What is Stoic philosophy regarding the emotions?$t$,
  options_en  = $t$["That emotions are useful guides","That negative emotions arise from false judgments and can be controlled with reason","That we must suppress all emotions","That emotions are the basis of morality"]$t$::jsonb,
  context_en  = $t$The Stoics believed that 'passions' (fear, desire, sadness) arise from mistaken judgments. Reason can correct these judgments and achieve ataraxia (tranquility).$t$
where category = 'filosofia' and question = $q$¿Qué es la filosofía estoica respecto a las emociones?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Phenomenology of Spirit'?$t$,
  options_en  = $t$["Kant","Schopenhauer","Hegel","Fichte"]$t$::jsonb,
  context_en  = $t$Hegel published 'The Phenomenology of Spirit' in 1807, describing the path of consciousness from sensory certainty to Absolute Knowledge. It is one of the most difficult works in philosophy.$t$
where category = 'filosofia' and question = $q$¿Quién escribió «La fenomenología del espíritu»?$q$;

update public.questions set
  question_en = $t$What is philosophical skepticism?$t$,
  options_en  = $t$["The denial of all reality","The stance that questions the possibility of certain knowledge","The doctrine of moral relativism","The rejection of metaphysics"]$t$::jsonb,
  context_en  = $t$Skepticism (Pyrrho, Hume) doubts the possibility of knowing the truth with certainty. Descartes used methodical doubt to overcome it and reach the cogito.$t$
where category = 'filosofia' and question = $q$¿Qué es el escepticismo filosófico?$q$;

update public.questions set
  question_en = $t$What did Rousseau hold about human beings?$t$,
  options_en  = $t$["That man is evil by nature","That man is naturally good but society corrupts him","That man is a wolf to man","That human nature is neutral"]$t$::jsonb,
  context_en  = $t$Rousseau held that human beings are good in their natural state but society corrupts them. His 'noble savage' contrasts with Hobbes, for whom life without a state would be 'nasty, brutish and short'.$t$
where category = 'filosofia' and question = $q$¿Qué sostenía Rousseau sobre el ser humano?$q$;

update public.questions set
  question_en = $t$What is Comte's positivism?$t$,
  options_en  = $t$["The philosophy of moral optimism","The school that holds that only verifiable scientific knowledge is valid","The defense of technological progress","Utilitarian ethics"]$t$::jsonb,
  context_en  = $t$Auguste Comte founded positivism (19th century), which argues that the only valid knowledge is scientific and verifiable. He also coined the term 'sociology'.$t$
where category = 'filosofia' and question = $q$¿Qué es el positivismo de Comte?$q$;

update public.questions set
  question_en = $t$Who was Confucius?$t$,
  options_en  = $t$["A Chinese philosopher and ruler","A Chinese philosopher and teacher who taught ethics, family and government","A god of the Chinese pantheon","A Chinese general of antiquity"]$t$::jsonb,
  context_en  = $t$Confucius (551-479 BC) was the most influential philosopher in China. His teachings on ethics, family and government are collected in the 'Analects'. Confucianism shaped East Asia.$t$
where category = 'filosofia' and question = $q$¿Quién fue Confucio?$q$;

update public.questions set
  question_en = $t$What is Taoism?$t$,
  options_en  = $t$["A Chinese polytheistic religion","A Chinese philosophy that seeks to live in harmony with the Tao (the natural way)","A sect of Buddhism","A philosophy of Chinese government"]$t$::jsonb,
  context_en  = $t$Taoism (Laozi, 6th century BC) proposes living in harmony with the Tao, the natural principle that governs the universe. Non-action (wu wei) is its key principle.$t$
where category = 'filosofia' and question = $q$¿Qué es el taoísmo?$q$;

update public.questions set
  question_en = $t$What is deontological ethics?$t$,
  options_en  = $t$["Ethics based on the consequences of acts","Ethics based on the fulfillment of duty, regardless of consequences","Virtue ethics","Utilitarian ethics"]$t$::jsonb,
  context_en  = $t$Deontological ethics (Kant) judges acts by their conformity with moral duty, not by their consequences. A good act is one done out of duty, not inclination.$t$
where category = 'filosofia' and question = $q$¿Qué es la ética deontológica?$q$;

update public.questions set
  question_en = $t$Who was Averroes?$t$,
  options_en  = $t$["A medieval Arab mathematician","A medieval Arab philosopher who translated and commented on Aristotle","A Persian astronomer","A 10th-century Arab physician"]$t$::jsonb,
  context_en  = $t$Averroes (Ibn Rushd, 1126-1198) was the great commentator on Aristotle in the Islamic world. His works greatly influenced medieval Christian scholasticism.$t$
where category = 'filosofia' and question = $q$¿Quién fue Averroes?$q$;

update public.questions set
  question_en = $t$What is Buddhism?$t$,
  options_en  = $t$["A monotheistic religion","A philosophy and religion based on the teachings of Buddha that seeks the cessation of suffering","A sect of Hinduism","An atheist philosophy"]$t$::jsonb,
  context_en  = $t$Buddhism was founded by Siddhartha Gautama (Buddha, ~500 BC). The Four Noble Truths and the Eightfold Path guide toward nirvana, liberation from suffering.$t$
where category = 'filosofia' and question = $q$¿Qué es el budismo?$q$;

update public.questions set
  question_en = $t$Who was Alexander the Great's teacher?$t$,
  options_en  = $t$["Socrates","Plato","Aristotle","Diogenes"]$t$::jsonb,
  context_en  = $t$Aristotle was the tutor of Alexander the Great between 343 and 340 BC, at the request of Philip II of Macedon.$t$
where category = 'filosofia' and question = $q$¿Quién fue maestro de Alejandro Magno?$q$;

update public.questions set
  question_en = $t$Which Greek philosopher lived in a barrel?$t$,
  options_en  = $t$["Heraclitus","Diogenes","Epicurus","Zeno"]$t$::jsonb,
  context_en  = $t$Diogenes of Sinope, the Cynic, lived in a large jar (not exactly a barrel) in Athens. He despised social conventions.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo griego vivía en un tonel?$q$;

update public.questions set
  question_en = $t$Which philosophical school did Zeno of Citium found in the 4th-3rd century BC?$t$,
  options_en  = $t$["Epicureanism","Stoicism","Skepticism","Cynicism"]$t$::jsonb,
  context_en  = $t$Zeno of Citium founded Stoicism in Athens around 300 BC. He taught in the Stoa Poikile (painted porch).$t$
where category = 'filosofia' and question = $q$¿Qué corriente filosófica fundó Zenón de Citio en el s. IV-III a.C.?$q$;

update public.questions set
  question_en = $t$Which work did Boethius write in prison?$t$,
  options_en  = $t$["The Consolation of Philosophy","Confessions","The Republic","Politics"]$t$::jsonb,
  context_en  = $t$Boethius wrote 'The Consolation of Philosophy' around AD 524, before being executed on the orders of Theodoric.$t$
where category = 'filosofia' and question = $q$¿Qué obra escribió Boecio en prisión?$q$;

update public.questions set
  question_en = $t$Which French philosopher wrote 'Discourse on the Method'?$t$,
  options_en  = $t$["Pascal","Descartes","Voltaire","Diderot"]$t$::jsonb,
  context_en  = $t$René Descartes published the 'Discourse on the Method' in 1637. A foundation of modern rationalism.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo francés escribió el "Discurso del método"?$q$;

update public.questions set
  question_en = $t$To which school does John Locke belong?$t$,
  options_en  = $t$["Rationalism","Empiricism","Idealism","Existentialism"]$t$::jsonb,
  context_en  = $t$John Locke was one of the great representatives of British empiricism, along with Berkeley and Hume.$t$
where category = 'filosofia' and question = $q$¿A qué corriente pertenece John Locke?$q$;

update public.questions set
  question_en = $t$Which work did Locke write in 1689?$t$,
  options_en  = $t$["An Essay Concerning Human Understanding","Critique of Pure Reason","Leviathan","Ethics"]$t$::jsonb,
  context_en  = $t$John Locke published 'An Essay Concerning Human Understanding' in 1689. He defended the tabula rasa at birth.$t$
where category = 'filosofia' and question = $q$¿Qué obra escribió Locke en 1689?$q$;

update public.questions set
  question_en = $t$Who wrote 'Leviathan'?$t$,
  options_en  = $t$["Hobbes","Locke","Machiavelli","Rousseau"]$t$::jsonb,
  context_en  = $t$Thomas Hobbes published 'Leviathan' in 1651, defending an absolute sovereign power to avoid the 'war of all against all'.$t$
where category = 'filosofia' and question = $q$¿Quién escribió "Leviatán"?$q$;

update public.questions set
  question_en = $t$Which famous phrase sums up Hobbes's thought on human nature?$t$,
  options_en  = $t$["Man is good by nature","Man is a wolf to man","I only know that I know nothing","Cogito ergo sum"]$t$::jsonb,
  context_en  = $t$'Homo homini lupus' (man is a wolf to man) condenses Hobbes's view of the natural state of violence.$t$
where category = 'filosofia' and question = $q$¿Qué famosa frase resume el pensamiento de Hobbes sobre la naturaleza humana?$q$;

update public.questions set
  question_en = $t$Which work did David Hume write in 1739-40?$t$,
  options_en  = $t$["A Treatise of Human Nature","Critique of Judgment","Discourse on the Method","Phenomenology"]$t$::jsonb,
  context_en  = $t$Hume published 'A Treatise of Human Nature' between 1739 and 1740. It represents the most radical skeptical empiricism.$t$
where category = 'filosofia' and question = $q$¿Qué obra escribió David Hume en 1739-40?$q$;

update public.questions set
  question_en = $t$What did Berkeley propose about reality?$t$,
  options_en  = $t$["Materialism","Subjective idealism","Dualism","Strict empiricism"]$t$::jsonb,
  context_en  = $t$George Berkeley defended subjective idealism: 'esse est percipi' (to be is to be perceived).$t$
where category = 'filosofia' and question = $q$¿Qué planteó Berkeley sobre la realidad?$q$;

update public.questions set
  question_en = $t$Who wrote 'Beyond Good and Evil'?$t$,
  options_en  = $t$["Nietzsche","Kant","Schopenhauer","Kierkegaard"]$t$::jsonb,
  context_en  = $t$Friedrich Nietzsche published 'Beyond Good and Evil' in 1886. It criticizes the foundations of Western morality.$t$
where category = 'filosofia' and question = $q$¿Quién escribió "Más allá del bien y del mal"?$q$;

update public.questions set
  question_en = $t$Which philosopher wrote 'The World as Will and Representation'?$t$,
  options_en  = $t$["Kant","Hegel","Schopenhauer","Fichte"]$t$::jsonb,
  context_en  = $t$Arthur Schopenhauer published this work in 1819. His pessimistic philosophy influenced Nietzsche and Wagner.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo escribió "El mundo como voluntad y representación"?$q$;

update public.questions set
  question_en = $t$Which work did Hegel write in 1807?$t$,
  options_en  = $t$["The Phenomenology of Spirit","Science of Logic","Philosophy of Right","Lectures on Aesthetics"]$t$::jsonb,
  context_en  = $t$Georg Wilhelm Friedrich Hegel published 'The Phenomenology of Spirit' in 1807. It is a key work of German idealism.$t$
where category = 'filosofia' and question = $q$¿Qué obra escribió Hegel en 1807?$q$;

update public.questions set
  question_en = $t$Which work did Kierkegaard write in 1843?$t$,
  options_en  = $t$["Fear and Trembling","Either/Or","The Sickness unto Death","Both of the above"]$t$::jsonb,
  context_en  = $t$Søren Kierkegaard published both 'Fear and Trembling' and 'Either/Or' in 1843. He is considered a precursor of existentialism.$t$
where category = 'filosofia' and question = $q$¿Qué obra escribió Kierkegaard en 1843?$q$;

update public.questions set
  question_en = $t$Who is the father of Marxism?$t$,
  options_en  = $t$["Marx","Engels","Lenin","Hegel"]$t$::jsonb,
  context_en  = $t$Karl Marx (1818-1883) developed historical and dialectical materialism along with Friedrich Engels.$t$
where category = 'filosofia' and question = $q$¿Quién es el padre del marxismo?$q$;

update public.questions set
  question_en = $t$Which work did Marx and Engels co-write in 1848?$t$,
  options_en  = $t$["Das Kapital","The Communist Manifesto","The German Ideology","Wage Labour"]$t$::jsonb,
  context_en  = $t$Marx and Engels published 'The Communist Manifesto' in 1848, commissioned by the Communist League.$t$
where category = 'filosofia' and question = $q$¿Qué obra coescribieron Marx y Engels en 1848?$q$;

update public.questions set
  question_en = $t$Which philosopher wrote 'Being and Time'?$t$,
  options_en  = $t$["Sartre","Heidegger","Husserl","Gadamer"]$t$::jsonb,
  context_en  = $t$Martin Heidegger published 'Sein und Zeit' (Being and Time) in 1927. A fundamental work of contemporary philosophy.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo escribió "El ser y el tiempo"?$q$;

update public.questions set
  question_en = $t$Which philosopher influenced Heidegger from phenomenology?$t$,
  options_en  = $t$["Brentano","Husserl","Schopenhauer","Bergson"]$t$::jsonb,
  context_en  = $t$Edmund Husserl was Heidegger's teacher and predecessor. He founded phenomenology, a key philosophical method of the 20th century.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo influyó en Heidegger desde la fenomenología?$q$;

update public.questions set
  question_en = $t$Which French philosopher wrote 'The Myth of Sisyphus'?$t$,
  options_en  = $t$["Sartre","Camus","Beauvoir","Foucault"]$t$::jsonb,
  context_en  = $t$Albert Camus published 'The Myth of Sisyphus' in 1942. An essay on the absurdity of existence.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo francés escribió "El mito de Sísifo"?$q$;

update public.questions set
  question_en = $t$Which French philosopher wrote 'The Second Sex'?$t$,
  options_en  = $t$["Beauvoir","Weil","Arendt","Kristeva"]$t$::jsonb,
  context_en  = $t$Simone de Beauvoir published 'The Second Sex' in 1949. A fundamental work of modern feminism: 'One is not born, but becomes, a woman'.$t$
where category = 'filosofia' and question = $q$¿Qué filósofa francesa escribió "El segundo sexo"?$q$;

update public.questions set
  question_en = $t$Who said 'Hell is other people'?$t$,
  options_en  = $t$["Camus","Sartre","Beauvoir","Heidegger"]$t$::jsonb,
  context_en  = $t$Jean-Paul Sartre wrote 'Hell is other people' in 'No Exit' (1944).$t$
where category = 'filosofia' and question = $q$¿Quién dijo "El infierno son los otros"?$q$;

update public.questions set
  question_en = $t$Which German-Jewish philosopher wrote about the 'banality of evil'?$t$,
  options_en  = $t$["Edith Stein","Hannah Arendt","Simone Weil","Rosa Luxemburg"]$t$::jsonb,
  context_en  = $t$Hannah Arendt coined the expression 'banality of evil' in 'Eichmann in Jerusalem' (1963), after witnessing the trial of the Nazi official.$t$
where category = 'filosofia' and question = $q$¿Qué filósofa alemana-judía escribió sobre la "banalidad del mal"?$q$;

update public.questions set
  question_en = $t$Which German thinker wrote about 'Twilight of the Idols'?$t$,
  options_en  = $t$["Hegel","Nietzsche","Schopenhauer","Marx"]$t$::jsonb,
  context_en  = $t$Nietzsche published 'Twilight of the Idols' (Götzen-Dämmerung) in 1889.$t$
where category = 'filosofia' and question = $q$¿Qué pensador alemán escribió sobre el "ocaso de los ídolos"?$q$;

update public.questions set
  question_en = $t$What did Hume think about causality?$t$,
  options_en  = $t$["It is necessary","It is only a psychological habit","It is divine","It is mathematical"]$t$::jsonb,
  context_en  = $t$Hume held that causality is a mental habit: we observe constant succession of events, but not a necessary connection.$t$
where category = 'filosofia' and question = $q$¿Qué pensaba Hume sobre la causalidad?$q$;

update public.questions set
  question_en = $t$What did Karl Popper propose as a criterion of scientific status?$t$,
  options_en  = $t$["Verifiability","Falsifiability","Coherence","Consensus"]$t$::jsonb,
  context_en  = $t$Karl Popper proposed falsifiability as a criterion of demarcation between science and pseudoscience.$t$
where category = 'filosofia' and question = $q$¿Qué planteó Karl Popper como criterio de cientificidad?$q$;

update public.questions set
  question_en = $t$Which philosopher of science wrote about 'paradigms' and scientific revolutions?$t$,
  options_en  = $t$["Popper","Kuhn","Lakatos","Feyerabend"]$t$::jsonb,
  context_en  = $t$Thomas Kuhn published 'The Structure of Scientific Revolutions' in 1962, introducing the concept of 'paradigm'.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo de la ciencia escribió sobre "paradigmas" y revoluciones científicas?$q$;

update public.questions set
  question_en = $t$Which work did Machiavelli write in 1513?$t$,
  options_en  = $t$["The Prince","Discourses","The Mandrake","Florentine Histories"]$t$::jsonb,
  context_en  = $t$Niccolò Machiavelli wrote 'The Prince' in 1513. A realistic treatise on political power.$t$
where category = 'filosofia' and question = $q$¿Qué obra escribió Maquiavelo en 1513?$q$;

update public.questions set
  question_en = $t$Which Renaissance thinker defended 'the end justifies the means'?$t$,
  options_en  = $t$["Erasmus","Machiavelli","More","Bacon"]$t$::jsonb,
  context_en  = $t$This maxim is usually attributed to Machiavelli, although the literal formulation does not appear exactly in his works.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo del Renacimiento defendió que "el fin justifica los medios"?$q$;

update public.questions set
  question_en = $t$Which work did Thomas More write in 1516?$t$,
  options_en  = $t$["Utopia","Erasmus","The City of the Sun","New Atlantis"]$t$::jsonb,
  context_en  = $t$Thomas More published 'Utopia' in 1516. It describes an imaginary island with an ideal society.$t$
where category = 'filosofia' and question = $q$¿Qué obra escribió Tomás Moro en 1516?$q$;

update public.questions set
  question_en = $t$Who said 'Sapere aude' (dare to know)?$t$,
  options_en  = $t$["Voltaire","Kant","Diderot","Lessing"]$t$::jsonb,
  context_en  = $t$Kant popularized 'Sapere aude' as the motto of the Enlightenment in his essay 'What Is Enlightenment?' (1784).$t$
where category = 'filosofia' and question = $q$¿Quién dijo "Sapere aude" (atrévete a saber)?$q$;

update public.questions set
  question_en = $t$Which Greek philosopher was called the 'philosopher of fire'?$t$,
  options_en  = $t$["Thales","Anaximenes","Heraclitus","Empedocles"]$t$::jsonb,
  context_en  = $t$Heraclitus of Ephesus (6th century BC) proposed fire as the first principle. Famous for 'everything flows' (panta rhei).$t$
where category = 'filosofia' and question = $q$¿Qué filósofo griego se decía "filósofo del fuego"?$q$;

update public.questions set
  question_en = $t$Which pre-Socratic philosopher said 'Everything is full of gods'?$t$,
  options_en  = $t$["Thales of Miletus","Anaximenes","Anaximander","Heraclitus"]$t$::jsonb,
  context_en  = $t$Thales of Miletus, the first philosopher according to tradition, held that everything was water and that the cosmos was animated.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo presocrático dijo "Todo está lleno de dioses"?$q$;

update public.questions set
  question_en = $t$Which philosopher said 'everything flows, nothing remains'?$t$,
  options_en  = $t$["Parmenides","Heraclitus","Democritus","Anaxagoras"]$t$::jsonb,
  context_en  = $t$Heraclitus defended permanent change: 'you cannot step twice into the same river'.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo dijo "todo fluye, nada permanece"?$q$;

update public.questions set
  question_en = $t$Which philosopher opposed Heraclitus by defending the unity of being?$t$,
  options_en  = $t$["Democritus","Empedocles","Parmenides","Anaxagoras"]$t$::jsonb,
  context_en  = $t$Parmenides of Elea held that being is one, immobile and eternal. Change is illusory.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo se opuso a Heráclito defendiendo la unidad del ser?$q$;

update public.questions set
  question_en = $t$Which Greek philosophers defended atomism?$t$,
  options_en  = $t$["Socrates and Plato","Leucippus and Democritus","Thales and Anaximenes","Pythagoras and Aristotle"]$t$::jsonb,
  context_en  = $t$Leucippus and Democritus (5th century BC) proposed that reality was made of indivisible atoms moving in the void.$t$
where category = 'filosofia' and question = $q$¿Qué filósofos griegos defendieron el atomismo?$q$;

update public.questions set
  question_en = $t$Which work by Spinoza was published posthumously in 1677?$t$,
  options_en  = $t$["Theological-Political Treatise","Ethics","Short Treatise","Principles"]$t$::jsonb,
  context_en  = $t$Baruch Spinoza wrote the 'Ethics Demonstrated in Geometrical Order', published in 1677 after his death.$t$
where category = 'filosofia' and question = $q$¿Qué obra escribió Spinoza publicada póstumamente en 1677?$q$;

update public.questions set
  question_en = $t$What is Spinoza's central idea about God?$t$,
  options_en  = $t$["A transcendent God","God and nature are the same","God does not exist","Polytheism"]$t$::jsonb,
  context_en  = $t$Spinoza identified God with Nature ('Deus sive Natura'), defending pantheism.$t$
where category = 'filosofia' and question = $q$¿Cuál es la idea central de Spinoza sobre Dios?$q$;

update public.questions set
  question_en = $t$Which German philosopher is famous for his 'Monadology'?$t$,
  options_en  = $t$["Leibniz","Wolff","Kant","Fichte"]$t$::jsonb,
  context_en  = $t$Gottfried Wilhelm Leibniz set out his theory of monads in 'The Monadology' (1714). Simple spiritual substances.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo alemán es famoso por su "Monadología"?$q$;

update public.questions set
  question_en = $t$Who is the main philosopher of American pragmatism?$t$,
  options_en  = $t$["Dewey","James","Peirce","All three"]$t$::jsonb,
  context_en  = $t$Charles S. Peirce, William James and John Dewey are the main representatives of American pragmatism.$t$
where category = 'filosofia' and question = $q$¿Quién es el principal filósofo del pragmatismo norteamericano?$q$;

update public.questions set
  question_en = $t$Who is Ludwig Wittgenstein?$t$,
  options_en  = $t$["A philosopher of language","A physicist","A mathematician","A politician"]$t$::jsonb,
  context_en  = $t$Wittgenstein (1889-1951) revolutionized the philosophy of language with the 'Tractatus' and the 'Philosophical Investigations'.$t$
where category = 'filosofia' and question = $q$¿Quién es Ludwig Wittgenstein?$q$;

update public.questions set
  question_en = $t$What is the last sentence of Wittgenstein's 'Tractatus'?$t$,
  options_en  = $t$["The world is all that is the case","Whereof one cannot speak, thereof one must be silent","I think, therefore I exist","We must cultivate our garden"]$t$::jsonb,
  context_en  = $t$Proposition 7 of the 'Tractatus' (1921) says: 'Whereof one cannot speak, thereof one must be silent'.$t$
where category = 'filosofia' and question = $q$¿Cuál es la última frase del "Tractatus" de Wittgenstein?$q$;

update public.questions set
  question_en = $t$Which French philosopher wrote 'Discipline and Punish'?$t$,
  options_en  = $t$["Sartre","Foucault","Derrida","Deleuze"]$t$::jsonb,
  context_en  = $t$Michel Foucault published 'Discipline and Punish' in 1975, on the history of punishment and modern techniques of power.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo francés escribió "Vigilar y castigar"?$q$;

update public.questions set
  question_en = $t$Which school did Jacques Derrida found?$t$,
  options_en  = $t$["Structuralism","Poststructuralism / Deconstruction","Existentialism","Phenomenology"]$t$::jsonb,
  context_en  = $t$Derrida (1930-2004) initiated 'deconstruction', a critique of the hidden hierarchies in philosophical texts.$t$
where category = 'filosofia' and question = $q$¿Qué corriente fundó Jacques Derrida?$q$;

update public.questions set
  question_en = $t$Who is the father of structuralism?$t$,
  options_en  = $t$["Lévi-Strauss","Saussure","Lacan","Barthes"]$t$::jsonb,
  context_en  = $t$Claude Lévi-Strauss applied structuralism to anthropology. Saussure had developed it earlier in linguistics.$t$
where category = 'filosofia' and question = $q$¿Quién es el padre del estructuralismo?$q$;

update public.questions set
  question_en = $t$Which work is the basis of linguistic structuralism?$t$,
  options_en  = $t$["Course in General Linguistics","Structures","Language and Myth","Elementary Course"]$t$::jsonb,
  context_en  = $t$The 'Course in General Linguistics' (1916) by Ferdinand de Saussure, published by his students, founded structuralism.$t$
where category = 'filosofia' and question = $q$¿Qué obra es la base del estructuralismo lingüístico?$q$;

update public.questions set
  question_en = $t$Which French philosopher wrote about 'the Symbolic, the Imaginary and the Real'?$t$,
  options_en  = $t$["Lacan","Derrida","Foucault","Barthes"]$t$::jsonb,
  context_en  = $t$Jacques Lacan, a French psychoanalyst, proposed the symbolic-imaginary-real triad to describe the human psyche.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo francés escribió "Lo simbólico, lo imaginario y lo real"?$q$;

update public.questions set
  question_en = $t$Who is Habermas?$t$,
  options_en  = $t$["A German philosopher of the Frankfurt School","A physicist","An Austrian politician","A mathematician"]$t$::jsonb,
  context_en  = $t$Jürgen Habermas (1929-) is one of the most influential living philosophers, associated with the Frankfurt School. Theory of communicative action.$t$
where category = 'filosofia' and question = $q$¿Quién es Habermas?$q$;

update public.questions set
  question_en = $t$Which philosophers formed the first generation of the Frankfurt School?$t$,
  options_en  = $t$["Adorno and Horkheimer","Lyotard and Baudrillard","Habermas and Apel","Negri and Hardt"]$t$::jsonb,
  context_en  = $t$Theodor Adorno and Max Horkheimer are the main representatives of the first generation of Critical Theory.$t$
where category = 'filosofia' and question = $q$¿Qué filósofos formaron la primera generación de la Escuela de Frankfurt?$q$;

update public.questions set
  question_en = $t$Which work did Adorno and Horkheimer co-write?$t$,
  options_en  = $t$["Dialectic of Enlightenment","Minima Moralia","Eros and Civilization","Critique of the Economy"]$t$::jsonb,
  context_en  = $t$'Dialectic of Enlightenment' (1944) by Adorno and Horkheimer is one of the pinnacle texts of Critical Theory.$t$
where category = 'filosofia' and question = $q$¿Qué obra coescribieron Adorno y Horkheimer?$q$;

update public.questions set
  question_en = $t$Which school did Sigmund Freud found?$t$,
  options_en  = $t$["Psychoanalysis","Behaviorism","Cognitivism","Humanism"]$t$::jsonb,
  context_en  = $t$Sigmund Freud (1856-1939) founded psychoanalysis in the late 19th century. 'The Interpretation of Dreams' (1900) is his central work.$t$
where category = 'filosofia' and question = $q$¿Qué corriente fundó Sigmund Freud?$q$;

update public.questions set
  question_en = $t$Who is C.G. Jung?$t$,
  options_en  = $t$["A Swiss psychiatrist, a disciple of Freud","A German philosopher","A physicist","A mathematician"]$t$::jsonb,
  context_en  = $t$Carl Gustav Jung (1875-1961) founded analytical psychology. He introduced concepts like archetypes, the collective unconscious and the shadow.$t$
where category = 'filosofia' and question = $q$¿Quién es C.G. Jung?$q$;

update public.questions set
  question_en = $t$Which Greek philosopher wrote the 'Nicomachean Ethics'?$t$,
  options_en  = $t$["Plato","Aristotle","Socrates","Epicurus"]$t$::jsonb,
  context_en  = $t$Aristotle wrote the 'Nicomachean Ethics' dedicated to his son. It is the main ethical treatise of Greek thought.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo griego escribió "Ética a Nicómaco"?$q$;

update public.questions set
  question_en = $t$Which Aristotelian virtue describes the 'golden mean'?$t$,
  options_en  = $t$["Temperance","Prudence","Every virtue is a golden mean","Only courage"]$t$::jsonb,
  context_en  = $t$Aristotle defined each ethical virtue as a golden mean between two vicious extremes (e.g., courage between cowardice and recklessness).$t$
where category = 'filosofia' and question = $q$¿Qué virtud aristotélica describe el "justo medio"?$q$;

update public.questions set
  question_en = $t$Who is Thomas Aquinas?$t$,
  options_en  = $t$["A scholastic philosopher and theologian","A mystic","A pope","A king"]$t$::jsonb,
  context_en  = $t$Thomas Aquinas (1225-1274), a Dominican, fused Aristotelianism with Christian theology in his 'Summa Theologiae'.$t$
where category = 'filosofia' and question = $q$¿Quién es Tomás de Aquino?$q$;

update public.questions set
  question_en = $t$How many proofs of the existence of God did Thomas Aquinas offer?$t$,
  options_en  = $t$["3","4","5","7"]$t$::jsonb,
  context_en  = $t$The Thomistic 'five ways' (motion, cause, contingency, degrees of perfection and order) attempt to demonstrate the existence of God.$t$
where category = 'filosofia' and question = $q$¿Cuántas pruebas de la existencia de Dios ofreció Tomás de Aquino?$q$;

update public.questions set
  question_en = $t$Which philosopher is famous for the 'wager' about the existence of God?$t$,
  options_en  = $t$["Descartes","Pascal","Leibniz","Spinoza"]$t$::jsonb,
  context_en  = $t$Blaise Pascal formulated his famous 'wager': betting on the existence of God is the rationally most advantageous option.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo es famoso por la "apuesta" sobre la existencia de Dios?$q$;

update public.questions set
  question_en = $t$Which work did Voltaire write in 1759?$t$,
  options_en  = $t$["Candide","Philosophical Letters","Philosophical Dictionary","Zadig"]$t$::jsonb,
  context_en  = $t$Voltaire published 'Candide, or Optimism' in 1759, a satirical parody of Leibnizian optimism.$t$
where category = 'filosofia' and question = $q$¿Qué obra escribió Voltaire en 1759?$q$;

update public.questions set
  question_en = $t$Which Enlightenment philosopher defended the separation of powers?$t$,
  options_en  = $t$["Voltaire","Rousseau","Montesquieu","Diderot"]$t$::jsonb,
  context_en  = $t$Montesquieu defended the separation of powers in 'The Spirit of the Laws' (1748). It inspired modern constitutions.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo ilustrado defendió la separación de poderes?$q$;

update public.questions set
  question_en = $t$Which famous American thinker wrote 'Walden'?$t$,
  options_en  = $t$["Emerson","Thoreau","Whitman","James"]$t$::jsonb,
  context_en  = $t$Henry David Thoreau wrote 'Walden' (1854) after living for two years in a cabin by Walden Pond.$t$
where category = 'filosofia' and question = $q$¿Qué famoso pensador estadounidense escribió "Walden"?$q$;

update public.questions set
  question_en = $t$Which literary-philosophical movement did Emerson found in the U.S.?$t$,
  options_en  = $t$["Transcendentalism","Pragmatism","Positivism","Naturalism"]$t$::jsonb,
  context_en  = $t$Ralph Waldo Emerson led Transcendentalism in New England starting in the 1830s.$t$
where category = 'filosofia' and question = $q$¿Qué movimiento literario-filosófico fundó Emerson en EE.UU.?$q$;

update public.questions set
  question_en = $t$Who is Henri Bergson?$t$,
  options_en  = $t$["A 20th-century French philosopher","A German sociologist","An English physicist","A Russian mathematician"]$t$::jsonb,
  context_en  = $t$Bergson (1859-1941) proposed concepts like 'duration', 'élan vital' and 'intuition'. Nobel Prize in Literature 1927.$t$
where category = 'filosofia' and question = $q$¿Quién es Henri Bergson?$q$;

update public.questions set
  question_en = $t$Which thinker proposed 'panta rhei'?$t$,
  options_en  = $t$["Thales","Heraclitus","Parmenides","Democritus"]$t$::jsonb,
  context_en  = $t$'Panta rhei' (everything flows) synthesizes Heraclitus's philosophy of permanent change.$t$
where category = 'filosofia' and question = $q$¿Qué pensador propuso el "panta rhei"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Rebel'?$t$,
  options_en  = $t$["Sartre","Camus","Bataille","Cioran"]$t$::jsonb,
  context_en  = $t$Albert Camus published 'The Rebel' (L'homme révolté) in 1951.$t$
where category = 'filosofia' and question = $q$¿Quién escribió "El hombre rebelde"?$q$;

update public.questions set
  question_en = $t$Which 20th-century movement questions the 'grand narratives'?$t$,
  options_en  = $t$["Modernism","Postmodernism","Idealism","Realism"]$t$::jsonb,
  context_en  = $t$Jean-François Lyotard defined postmodernity in 1979 as 'incredulity toward metanarratives'.$t$
where category = 'filosofia' and question = $q$¿Qué corriente del s. XX cuestiona las "grandes narrativas"?$q$;

update public.questions set
  question_en = $t$Which French philosopher wrote 'The Postmodern Condition' (1979)?$t$,
  options_en  = $t$["Baudrillard","Lyotard","Deleuze","Lipovetsky"]$t$::jsonb,
  context_en  = $t$Jean-François Lyotard published 'The Postmodern Condition' in 1979, popularizing the term 'postmodernity'.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo francés escribió "La condición posmoderna" (1979)?$q$;

update public.questions set
  question_en = $t$Which French philosopher developed the concept of 'simulacrum'?$t$,
  options_en  = $t$["Lyotard","Baudrillard","Deleuze","Foucault"]$t$::jsonb,
  context_en  = $t$Jean Baudrillard developed the theory of hyperreality and simulacra in works like 'Simulacra and Simulation' (1981).$t$
where category = 'filosofia' and question = $q$¿Qué filósofo francés desarrolló el concepto de "simulacro"?$q$;

update public.questions set
  question_en = $t$Who is Mary Wollstonecraft?$t$,
  options_en  = $t$["A feminist pioneer (18th century)","A 20th-century activist","A 19th-century writer","A Greek philosopher"]$t$::jsonb,
  context_en  = $t$Mary Wollstonecraft wrote 'A Vindication of the Rights of Woman' in 1792, a key work of early feminism.$t$
where category = 'filosofia' and question = $q$¿Quién es Mary Wollstonecraft?$q$;

update public.questions set
  question_en = $t$Which thinker is famous for studying suicide sociologically?$t$,
  options_en  = $t$["Weber","Durkheim","Marx","Simmel"]$t$::jsonb,
  context_en  = $t$Émile Durkheim published 'Suicide' in 1897, one of the first works of modern empirical sociology.$t$
where category = 'filosofia' and question = $q$¿Qué pensador es famoso por estudiar el suicidio sociológicamente?$q$;

update public.questions set
  question_en = $t$Which thinker wrote 'The Protestant Ethic and the Spirit of Capitalism'?$t$,
  options_en  = $t$["Marx","Weber","Durkheim","Sombart"]$t$::jsonb,
  context_en  = $t$Max Weber published this essay in 1904-1905, analyzing the relationship between Calvinist Protestantism and modern capitalism.$t$
where category = 'filosofia' and question = $q$¿Qué pensador escribió "La ética protestante y el espíritu del capitalismo"?$q$;

update public.questions set
  question_en = $t$Which French philosopher wrote 'Anti-Oedipus' with Guattari?$t$,
  options_en  = $t$["Deleuze","Foucault","Derrida","Lacan"]$t$::jsonb,
  context_en  = $t$Gilles Deleuze co-wrote 'Anti-Oedipus' (1972) with Félix Guattari. A radical critique of psychoanalysis and capitalism.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo francés escribió "El antiedipo" con Guattari?$q$;

update public.questions set
  question_en = $t$Which American philosopher wrote 'A Theory of Justice' (1971)?$t$,
  options_en  = $t$["Nozick","Rawls","Sen","Walzer"]$t$::jsonb,
  context_en  = $t$John Rawls published 'A Theory of Justice' in 1971. It introduces the 'veil of ignorance' and the principles of justice.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo estadounidense escribió "Una teoría de la justicia" (1971)?$q$;

update public.questions set
  question_en = $t$Who wrote 'Anarchy, State, and Utopia' (1974)?$t$,
  options_en  = $t$["Rawls","Nozick","Rorty","Putnam"]$t$::jsonb,
  context_en  = $t$Robert Nozick replied to Rawls in 'Anarchy, State, and Utopia' (1974), defending a minimal state.$t$
where category = 'filosofia' and question = $q$¿Quién escribió "Anarquía, Estado y utopía" (1974)?$q$;

update public.questions set
  question_en = $t$Who is the father of contemporary Christian personalism?$t$,
  options_en  = $t$["Maritain","Mounier","Marcel","Levinas"]$t$::jsonb,
  context_en  = $t$Emmanuel Mounier founded the journal Esprit and developed Christian personalism in the 1930s.$t$
where category = 'filosofia' and question = $q$¿Quién es el padre del personalismo cristiano contemporáneo?$q$;

update public.questions set
  question_en = $t$Which Lithuanian-French philosopher wrote 'Totality and Infinity'?$t$,
  options_en  = $t$["Levinas","Derrida","Sartre","Ricoeur"]$t$::jsonb,
  context_en  = $t$Emmanuel Levinas (1906-1995) published 'Totality and Infinity' in 1961. He defended ethics as first philosophy, based on otherness.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo lituano-francés escribió "Totalidad e infinito"?$q$;

update public.questions set
  question_en = $t$Which philosopher wrote 'Being and Having' as a contrast to 'Being and Time'?$t$,
  options_en  = $t$["Gabriel Marcel","Heidegger","Sartre","Ricoeur"]$t$::jsonb,
  context_en  = $t$Gabriel Marcel published 'Being and Having' (1935), a work of French Christian existentialism.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo escribió "Ser y tener" como contraste con "ser y tiempo"?$q$;

update public.questions set
  question_en = $t$Who is Paul Ricoeur?$t$,
  options_en  = $t$["A French philosopher of hermeneutics","A Marxist","A physicist","A politician"]$t$::jsonb,
  context_en  = $t$Paul Ricoeur (1913-2005), a French philosopher, worked on hermeneutics, memory, narrative and ethics.$t$
where category = 'filosofia' and question = $q$¿Quién es Paul Ricoeur?$q$;

update public.questions set
  question_en = $t$Which philosophical tradition does Gadamer represent?$t$,
  options_en  = $t$["Analytic philosophy","Hermeneutics","Marxism","Logical positivism"]$t$::jsonb,
  context_en  = $t$Hans-Georg Gadamer (1900-2002) renewed philosophical hermeneutics with 'Truth and Method' (1960).$t$
where category = 'filosofia' and question = $q$¿Qué tradición filosófica representa Gadamer?$q$;

update public.questions set
  question_en = $t$Which philosopher said 'we are condemned to be free'?$t$,
  options_en  = $t$["Camus","Sartre","Heidegger","Merleau-Ponty"]$t$::jsonb,
  context_en  = $t$Jean-Paul Sartre wrote this in 'Existentialism Is a Humanism' (1946).$t$
where category = 'filosofia' and question = $q$¿Qué filósofo dijo "estamos condenados a ser libres"?$q$;

update public.questions set
  question_en = $t$Which philosopher wrote 'Existentialism Is a Humanism'?$t$,
  options_en  = $t$["Sartre","Camus","Marcel","Heidegger"]$t$::jsonb,
  context_en  = $t$Sartre delivered this lecture in 1945 (published in 1946), defending existentialism as a humanist philosophy.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo escribió "El existencialismo es un humanismo"?$q$;

update public.questions set
  question_en = $t$Which medieval Arab philosopher wrote 'The Incoherence of the Philosophers'?$t$,
  options_en  = $t$["Avicenna","Averroes","Al-Ghazali","Avempace"]$t$::jsonb,
  context_en  = $t$Al-Ghazali wrote this critique against the philosophers in the 11th century. Averroes replied with 'The Incoherence of the Incoherence'.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo árabe medieval escribió "La incoherencia de los filósofos"?$q$;

update public.questions set
  question_en = $t$Who is Avicenna?$t$,
  options_en  = $t$["A Persian-Muslim philosopher","A Greek physician","A Christian theologian","A Jewish mystic"]$t$::jsonb,
  context_en  = $t$Avicenna (Ibn Sina, 980-1037) was a Persian physician, philosopher and polymath. His 'Canon of Medicine' was taught in Europe until the 17th century.$t$
where category = 'filosofia' and question = $q$¿Quién es Avicena?$q$;

update public.questions set
  question_en = $t$Which medieval Spanish-Jewish philosopher wrote 'Guide for the Perplexed'?$t$,
  options_en  = $t$["Avicebron","Maimonides","Crescas","Abrabanel"]$t$::jsonb,
  context_en  = $t$Moses Maimonides (1138-1204), born in Córdoba, wrote the 'Guide for the Perplexed' in Arabic. It synthesizes the Jewish faith with Aristotelian philosophy.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo judío-español medieval escribió "Guía de perplejos"?$q$;

update public.questions set
  question_en = $t$Which work did Thomas More write in Latin in 1516?$t$,
  options_en  = $t$["Utopia","Erasmus","Praefatio","Apology"]$t$::jsonb,
  context_en  = $t$Thomas More published 'Utopia' in 1516, a word he coined himself from Greek ('no-place' or 'good-place').$t$
where category = 'filosofia' and question = $q$¿Qué obra escribió Tomás Moro en latín en 1516?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Praise of Folly'?$t$,
  options_en  = $t$["Erasmus","More","Luther","Machiavelli"]$t$::jsonb,
  context_en  = $t$Erasmus of Rotterdam published 'Stultitiae Laus' (The Praise of Folly) in 1511, a moral satire of Christian humanism.$t$
where category = 'filosofia' and question = $q$¿Quién escribió "El elogio de la locura"?$q$;

update public.questions set
  question_en = $t$Which Greek philosopher ran the 'Academy'?$t$,
  options_en  = $t$["Socrates","Plato","Aristotle","Epicurus"]$t$::jsonb,
  context_en  = $t$Plato founded the Academy in Athens (~387 BC). It operated until AD 529, when Justinian closed the pagan philosophical schools.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo griego dirigió la "Academia"?$q$;

update public.questions set
  question_en = $t$Which school did Aristotle found in Athens?$t$,
  options_en  = $t$["Lyceum","Academy","Garden","Stoa"]$t$::jsonb,
  context_en  = $t$Aristotle founded the Lyceum in 335 BC. His followers were called 'peripatetics' because he taught while walking.$t$
where category = 'filosofia' and question = $q$¿Qué escuela fundó Aristóteles en Atenas?$q$;

update public.questions set
  question_en = $t$Which school did Epicurus found?$t$,
  options_en  = $t$["Lyceum","Academy","Garden","Stoa"]$t$::jsonb,
  context_en  = $t$Epicurus founded the 'Garden' (Kepos) in Athens (~306 BC), a philosophical community that admitted women and slaves.$t$
where category = 'filosofia' and question = $q$¿Qué escuela fundó Epicuro?$q$;

update public.questions set
  question_en = $t$Who is Lucretius?$t$,
  options_en  = $t$["A Roman Epicurean poet-philosopher","A Greek Stoic","A Byzantine physician","A Christian"]$t$::jsonb,
  context_en  = $t$Lucretius wrote 'De rerum natura' (1st century BC), a poem in verse that sets out the atomist philosophy of Epicurus.$t$
where category = 'filosofia' and question = $q$¿Quién es Lucrecio?$q$;

update public.questions set
  question_en = $t$Who is Seneca?$t$,
  options_en  = $t$["A Roman Stoic philosopher","A Greek sophist","A medieval Cynic","A mystic"]$t$::jsonb,
  context_en  = $t$Seneca (4 BC-AD 65), born in Córdoba, was a prominent Stoic philosopher, playwright and advisor to Nero.$t$
where category = 'filosofia' and question = $q$¿Quién es Séneca?$q$;

update public.questions set
  question_en = $t$Which Roman emperor was a Stoic philosopher?$t$,
  options_en  = $t$["Augustus","Marcus Aurelius","Hadrian","Trajan"]$t$::jsonb,
  context_en  = $t$Marcus Aurelius (AD 121-180) wrote the 'Meditations', a pinnacle work of Stoicism, in the midst of his reign.$t$
where category = 'filosofia' and question = $q$¿Qué emperador romano fue filósofo estoico?$q$;

update public.questions set
  question_en = $t$Which Greek philosopher wrote the 'Handbook' (Enchiridion)?$t$,
  options_en  = $t$["Seneca","Epictetus","Marcus Aurelius","Chrysippus"]$t$::jsonb,
  context_en  = $t$Epictetus, a freed slave, wrote the 'Enchiridion' (Handbook), a compendium of Stoic ethics. It influenced Marcus Aurelius.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo griego escribió "Manual" (Enquiridión)?$q$;

update public.questions set
  question_en = $t$What is the Chinese Taoist philosophy?$t$,
  options_en  = $t$["Tao Te Ching","Analects","Mencius","Heart Sutra"]$t$::jsonb,
  context_en  = $t$The 'Tao Te Ching', attributed to Laozi (6th century BC), is the founding text of Taoism. It advocates spontaneity and wu wei.$t$
where category = 'filosofia' and question = $q$¿Cuál es la filosofía taoísta china?$q$;

update public.questions set
  question_en = $t$Who is Confucius?$t$,
  options_en  = $t$["A Chinese philosopher of the 6th-5th century BC","A Hindu prophet","A Japanese sage","A Persian king"]$t$::jsonb,
  context_en  = $t$Kong Fuzi (Confucius, 551-479 BC) founded one of the most influential philosophical-ethical schools in China. His work: the 'Analects'.$t$
where category = 'filosofia' and question = $q$¿Quién es Confucio?$q$;

update public.questions set
  question_en = $t$Which sacred Hindu text deals with duty (dharma)?$t$,
  options_en  = $t$["Vedas","Bhagavad Gita","Upanishads","Mahabharata"]$t$::jsonb,
  context_en  = $t$The Bhagavad Gita ('Song of the Blessed One') is part of the Mahabharata. A dialogue between Krishna and Arjuna about duty.$t$
where category = 'filosofia' and question = $q$¿Qué texto sagrado del hinduismo trata sobre el deber (dharma)?$q$;

update public.questions set
  question_en = $t$What is the philosophy of Buddha Siddhartha Gautama?$t$,
  options_en  = $t$["The pursuit of pleasure","The Four Noble Truths","Obedience","Strength"]$t$::jsonb,
  context_en  = $t$Buddhism is based on the Four Noble Truths about suffering and the Eightfold Path to overcome it.$t$
where category = 'filosofia' and question = $q$¿Cuál es la filosofía del Buda Siddhartha Gautama?$q$;

update public.questions set
  question_en = $t$Which Zen philosophical school is linked to Japanese Buddhism?$t$,
  options_en  = $t$["Tendai","Shingon","Zen","Pure Land"]$t$::jsonb,
  context_en  = $t$Zen, a Japanese Buddhist school (chan in Chinese), emphasizes meditation and sudden enlightenment (satori).$t$
where category = 'filosofia' and question = $q$¿Qué corriente filosófica zen está vinculada al budismo japonés?$q$;

update public.questions set
  question_en = $t$Which philosophical school does Nagarjuna represent?$t$,
  options_en  = $t$["Theravada","Madhyamaka","Yogachara","Tantra"]$t$::jsonb,
  context_en  = $t$Nagarjuna (~AD 150-250) founded the Madhyamaka school of Mahayana Buddhism, based on the doctrine of emptiness (shunyata).$t$
where category = 'filosofia' and question = $q$¿Qué corriente filosófica representa Nagarjuna?$q$;

update public.questions set
  question_en = $t$Which medieval philosopher wrote 'The City of God'?$t$,
  options_en  = $t$["Saint Augustine","Boethius","Thomas Aquinas","Pseudo-Dionysius"]$t$::jsonb,
  context_en  = $t$Saint Augustine of Hippo wrote 'De Civitate Dei' (AD 413-426) after the sack of Rome by Alaric.$t$
where category = 'filosofia' and question = $q$¿Qué filósofo medieval escribió la "Ciudad de Dios"?$q$;

update public.questions set
  question_en = $t$Which work did the scholastic Anselm of Canterbury write about God?$t$,
  options_en  = $t$["Proslogion","Cur Deus Homo","Monologion","All of the above"]$t$::jsonb,
  context_en  = $t$Anselm of Canterbury wrote 'Monologion', 'Proslogion' (with the ontological argument) and 'Cur Deus Homo' (on the incarnation).$t$
where category = 'filosofia' and question = $q$¿Qué obra escribió el escolástico Anselmo de Canterbury sobre Dios?$q$;

update public.questions set
  question_en = $t$Who is the 'Subtle Doctor' among the scholastics?$t$,
  options_en  = $t$["Duns Scotus","Ockham","Thomas Aquinas","Bonaventure"]$t$::jsonb,
  context_en  = $t$John Duns Scotus (1266-1308), called the 'Subtle Doctor', was a Franciscan and an intellectual rival of Thomism.$t$
where category = 'filosofia' and question = $q$¿Quién es el "Doctor Sutilísimo" entre los escolásticos?$q$;

update public.questions set
  question_en = $t$Who formulated the 'razor' principle in the 14th century?$t$,
  options_en  = $t$["Thomas Aquinas","William of Ockham","Roger Bacon","Eckhart"]$t$::jsonb,
  context_en  = $t$William of Ockham (1287-1347) formulated the principle of parsimony: 'do not multiply entities without need'.$t$
where category = 'filosofia' and question = $q$¿Quién formuló el principio de "navaja" en el s. XIV?$q$;

update public.questions set
  question_en = $t$Who is Giordano Bruno?$t$,
  options_en  = $t$["An Italian astronomer and philosopher","A mystic","A pope","A politician"]$t$::jsonb,
  context_en  = $t$Giordano Bruno (1548-1600), an Italian Dominican, defended the infinity of the universe and was burned by the Inquisition.$t$
where category = 'filosofia' and question = $q$¿Quién es Giordano Bruno?$q$;

update public.questions set
  question_en = $t$Which philosophical school does Auguste Comte represent?$t$,
  options_en  = $t$["Positivism","Idealism","Empiricism","Existentialism"]$t$::jsonb,
  context_en  = $t$Auguste Comte (1798-1857) founded positivism and coined the term 'sociology'.$t$
where category = 'filosofia' and question = $q$¿Qué corriente filosófica representa Augusto Comte?$q$;

update public.questions set
  question_en = $t$Which Marx-Engels work sets out dialectical materialism?$t$,
  options_en  = $t$["Das Kapital","Anti-Dühring","The German Ideology","Dialectics of Nature"]$t$::jsonb,
  context_en  = $t$'Dialectics of Nature' (1883), by Engels, explores applications of dialectical materialism to the sciences.$t$
where category = 'filosofia' and question = $q$¿Qué obra de Marx-Engels expone el materialismo dialéctico?$q$;


-- ── deportes (150) ──
update public.questions set
  question_en = $t$How often are the Summer Olympic Games held?$t$,
  options_en  = $t$["Every 2","Every 3","Every 4","Every 5"]$t$::jsonb,
  context_en  = $t$The Summer Olympics have been held every 4 years since 1896. The Winter Games too, alternating every 2 years with the Summer Games since 1994.$t$
where category = 'deportes' and question = $q$¿Cada cuántos años se celebran los Juegos Olímpicos de verano?$q$;

update public.questions set
  question_en = $t$Which national team has won the most men's football World Cups?$t$,
  options_en  = $t$["Germany","Italy","Argentina","Brazil"]$t$::jsonb,
  context_en  = $t$Brazil has won 5 World Cups (1958, 1962, 1970, 1994, 2002). It is the only country to have played in every edition.$t$
where category = 'deportes' and question = $q$¿Qué selección ha ganado más Mundiales de fútbol masculino?$q$;

update public.questions set
  question_en = $t$How many players does a basketball team have on the court?$t$,
  options_en  = $t$["4","5","6","7"]$t$::jsonb,
  context_en  = $t$Each team plays with 5 players. Basketball was invented by James Naismith in 1891 in Springfield, Massachusetts.$t$
where category = 'deportes' and question = $q$¿Cuántos jugadores tiene un equipo de baloncesto en cancha?$q$;

update public.questions set
  question_en = $t$In which sport is a 'birdie' used?$t$,
  options_en  = $t$["Tennis","Badminton","Golf","Cricket"]$t$::jsonb,
  context_en  = $t$In golf, a 'birdie' means one stroke under par for the hole. A 'bogey' is one over par and an 'eagle' two under.$t$
where category = 'deportes' and question = $q$¿En qué deporte se utiliza un "birdie"?$q$;

update public.questions set
  question_en = $t$How many players make up a football team on the field?$t$,
  options_en  = $t$["10","11","12","9"]$t$::jsonb,
  context_en  = $t$Each football team has 11 players, including the goalkeeper. The modern rules were codified in England in 1863.$t$
where category = 'deportes' and question = $q$¿Cuántos jugadores forman un equipo de fútbol en cancha?$q$;

update public.questions set
  question_en = $t$In which country was modern tennis invented?$t$,
  options_en  = $t$["France","United States","United Kingdom","Australia"]$t$::jsonb,
  context_en  = $t$Modern tennis (lawn tennis) was invented by Walter Clopton Wingfield in England in 1873. Wimbledon, founded in 1877, is the oldest tournament.$t$
where category = 'deportes' and question = $q$¿En qué país se inventó el tenis moderno?$q$;

update public.questions set
  question_en = $t$What is the exact distance of a marathon?$t$,
  options_en  = $t$["40 km","42.195 km","45 km","50 km"]$t$::jsonb,
  context_en  = $t$A marathon is 42.195 km. The distance was set at the 1908 London Olympics based on the route from Windsor Castle to the stadium.$t$
where category = 'deportes' and question = $q$¿Cuál es la distancia exacta de una maratón?$q$;

update public.questions set
  question_en = $t$Who is the biggest Grand Slam winner in men's tennis?$t$,
  options_en  = $t$["Roger Federer","Rafael Nadal","Novak Djokovic","Pete Sampras"]$t$::jsonb,
  context_en  = $t$Novak Djokovic leads with 24 Grand Slams (as of 2024). Nadal has 22 and Federer 20. Sampras stayed at 14.$t$
where category = 'deportes' and question = $q$¿Quién es el máximo ganador de Grand Slams en tenis masculino?$q$;

update public.questions set
  question_en = $t$What nationality was the cyclist Eddy Merckx?$t$,
  options_en  = $t$["Dutch","Belgian","French","Italian"]$t$::jsonb,
  context_en  = $t$Eddy Merckx is Belgian, winner of 5 Tours de France, 5 Giros and 1 Vuelta. He is considered the greatest cyclist in history.$t$
where category = 'deportes' and question = $q$¿De qué nacionalidad fue el ciclista Eddy Merckx?$q$;

update public.questions set
  question_en = $t$In which sport is the Stanley Cup contested?$t$,
  options_en  = $t$["Basketball","Ice hockey","Baseball","American football"]$t$::jsonb,
  context_en  = $t$The Stanley Cup is the NHL trophy (ice hockey). It has been awarded since 1893; the Montreal Canadiens are the team with the most wins (24).$t$
where category = 'deportes' and question = $q$¿En qué deporte se disputa la Copa Stanley?$q$;

update public.questions set
  question_en = $t$How many sets must a player win to win a best-of-5-sets match?$t$,
  options_en  = $t$["2","3","4","5"]$t$::jsonb,
  context_en  = $t$Men's Grand Slams are played to the best of 5 sets: you must win 3. Women's and most tournaments are played to the best of 3.$t$
where category = 'deportes' and question = $q$¿Cuántos sets debe ganar un tenista para ganar un partido a 5 sets?$q$;

update public.questions set
  question_en = $t$In which city were the first modern Olympics held in 1896?$t$,
  options_en  = $t$["Paris","Athens","Rome","Berlin"]$t$::jsonb,
  context_en  = $t$The first modern Olympics were in Athens 1896, organized by Pierre de Coubertin. 241 athletes from 14 countries took part.$t$
where category = 'deportes' and question = $q$¿En qué ciudad se celebraron los primeros JJ.OO. modernos en 1896?$q$;

update public.questions set
  question_en = $t$How many points is a 'try' worth in rugby union?$t$,
  options_en  = $t$["3","4","5","7"]$t$::jsonb,
  context_en  = $t$A try is worth 5 points in rugby union. The subsequent conversion adds 2 more points. A drop goal or penalty is worth 3.$t$
where category = 'deportes' and question = $q$¿Cuántos puntos vale un "try" en rugby union?$q$;

update public.questions set
  question_en = $t$In what year was the first football World Cup held?$t$,
  options_en  = $t$["1928","1930","1934","1938"]$t$::jsonb,
  context_en  = $t$The first World Cup was Uruguay 1930. The host nation, Uruguay, won it, beating Argentina 4-2 in the final.$t$
where category = 'deportes' and question = $q$¿En qué año se celebró el primer Mundial de fútbol?$q$;

update public.questions set
  question_en = $t$What is the men's world record for the 100 meters?$t$,
  options_en  = $t$["9.58 s","9.69 s","9.77 s","9.85 s"]$t$::jsonb,
  context_en  = $t$Usain Bolt ran the 100 m in 9.58 s in Berlin 2009. It has been the world record ever since.$t$
where category = 'deportes' and question = $q$¿Cuál es el récord mundial masculino de los 100 metros lisos?$q$;

update public.questions set
  question_en = $t$Which sport did Michael Phelps compete in?$t$,
  options_en  = $t$["Athletics","Swimming","Cycling","Gymnastics"]$t$::jsonb,
  context_en  = $t$Michael Phelps is the most decorated Olympic athlete in history: 28 medals (23 gold) in swimming, between 2004 and 2016.$t$
where category = 'deportes' and question = $q$¿Qué deporte practicaba Michael Phelps?$q$;

update public.questions set
  question_en = $t$How many holes does a standard golf course have?$t$,
  options_en  = $t$["9","12","18","20"]$t$::jsonb,
  context_en  = $t$A standard golf course has 18 holes. There are also 9-hole courses played twice to complete a round.$t$
where category = 'deportes' and question = $q$¿Cuántos hoyos tiene un campo de golf estándar?$q$;

update public.questions set
  question_en = $t$Which football club has won the most Champions Leagues?$t$,
  options_en  = $t$["FC Barcelona","Bayern Munich","Real Madrid","Milan"]$t$::jsonb,
  context_en  = $t$Real Madrid leads with 15 Champions Leagues (as of 2024). They are followed by Milan (7) and Bayern and Liverpool (6).$t$
where category = 'deportes' and question = $q$¿Qué club de fútbol ha ganado más Champions League?$q$;

update public.questions set
  question_en = $t$In which sport did Diego Maradona excel?$t$,
  options_en  = $t$["Boxing","Football","Tennis","Basketball"]$t$::jsonb,
  context_en  = $t$Diego Armando Maradona (1960-2020) was an Argentine footballer, considered one of the best in history. World champion in 1986.$t$
where category = 'deportes' and question = $q$¿En qué deporte destacó Diego Maradona?$q$;

update public.questions set
  question_en = $t$How many members does a volleyball team have on the court?$t$,
  options_en  = $t$["5","6","7","8"]$t$::jsonb,
  context_en  = $t$In volleyball, 6 per team play on the court. The sport was invented by William G. Morgan in 1895 in Massachusetts.$t$
where category = 'deportes' and question = $q$¿Cuántos miembros tiene un equipo de voleibol en cancha?$q$;

update public.questions set
  question_en = $t$Who won the Tour de France 7 times in a row (later annulled)?$t$,
  options_en  = $t$["Miguel Indurain","Lance Armstrong","Chris Froome","Bernard Hinault"]$t$::jsonb,
  context_en  = $t$Lance Armstrong won 7 consecutive Tours (1999-2005), but they were stripped in 2012 for systematic doping with EPO.$t$
where category = 'deportes' and question = $q$¿Quién ganó el Tour de Francia 7 veces seguidas (luego anulados)?$q$;

update public.questions set
  question_en = $t$Which team won the 2022 World Cup in Qatar?$t$,
  options_en  = $t$["France","Argentina","Brazil","Croatia"]$t$::jsonb,
  context_en  = $t$Argentina won the 2022 World Cup, beating France on penalties after a 3-3 draw. It was Argentina's third world title.$t$
where category = 'deportes' and question = $q$¿Qué selección ganó el Mundial de fútbol 2022 en Qatar?$q$;

update public.questions set
  question_en = $t$What is the record for goals in a single European Championship?$t$,
  options_en  = $t$["7","9","11","14"]$t$::jsonb,
  context_en  = $t$Michel Platini (France) scored 9 goals at Euro 1984, an absolute record. Cristiano Ronaldo is the all-time top scorer with 14.$t$
where category = 'deportes' and question = $q$¿Cuál es el récord de goles en una Eurocopa?$q$;

update public.questions set
  question_en = $t$How many points is a three-pointer worth in basketball?$t$,
  options_en  = $t$["2","3","4","5"]$t$::jsonb,
  context_en  = $t$A shot from beyond the three-point line is worth 3. Inside it is worth 2 and a free throw is worth 1.$t$
where category = 'deportes' and question = $q$¿Cuántos puntos vale una canasta de tres en baloncesto?$q$;

update public.questions set
  question_en = $t$In what year did the Winter Olympics debut?$t$,
  options_en  = $t$["1908","1916","1924","1936"]$t$::jsonb,
  context_en  = $t$The first Winter Olympics were in Chamonix (France) in 1924. They were held in the same year as the Summer Games until 1992.$t$
where category = 'deportes' and question = $q$¿En qué año debutaron los JJ.OO. de Invierno?$q$;

update public.questions set
  question_en = $t$Which country invented judo?$t$,
  options_en  = $t$["China","Korea","Japan","Thailand"]$t$::jsonb,
  context_en  = $t$Judo was created by Jigoro Kano in Japan in 1882, based on traditional jiu-jitsu. It was first Olympic at Tokyo 1964.$t$
where category = 'deportes' and question = $q$¿Qué país inventó el judo?$q$;

update public.questions set
  question_en = $t$How many km do Formula 1 racers cover in a standard race?$t$,
  options_en  = $t$["200 km","305 km","450 km","500 km"]$t$::jsonb,
  context_en  = $t$An F1 race is ~305 km long (Monaco is the exception at 260). The maximum time limit is 2 hours of competition.$t$
where category = 'deportes' and question = $q$¿Cuántos km recorren los corredores de Fórmula 1 en una carrera estándar?$q$;

update public.questions set
  question_en = $t$What color is the leader's jersey in the Vuelta a España?$t$,
  options_en  = $t$["Yellow","Pink","Red","Blue"]$t$::jsonb,
  context_en  = $t$The Vuelta leader has worn the red jersey since 2010. Before it was yellow, gold or other colors. In the Tour it is yellow and in the Giro pink.$t$
where category = 'deportes' and question = $q$¿De qué color es la camiseta del líder de la Vuelta a España?$q$;

update public.questions set
  question_en = $t$In which sport is Pelé a legend?$t$,
  options_en  = $t$["Basketball","Football","Baseball","Volleyball"]$t$::jsonb,
  context_en  = $t$Edson Arantes do Nascimento 'Pelé' (1940-2022) was a Brazilian footballer, the only one to win 3 World Cups (1958, 1962, 1970).$t$
where category = 'deportes' and question = $q$¿En qué deporte es legendario Pelé?$q$;

update public.questions set
  question_en = $t$In what year did women's football debut at the Olympics?$t$,
  options_en  = $t$["1992","1996","2000","2004"]$t$::jsonb,
  context_en  = $t$Women's football debuted at Atlanta 1996, where the United States won gold. Men's football debuted at Paris 1900.$t$
where category = 'deportes' and question = $q$¿En qué año debutó el fútbol femenino en los JJ.OO.?$q$;

update public.questions set
  question_en = $t$How many minutes does a regulation football match last?$t$,
  options_en  = $t$["80","90","100","120"]$t$::jsonb,
  context_en  = $t$A match lasts 90 minutes (2 halves of 45), with a 15-minute break. The referee adds time for stoppages.$t$
where category = 'deportes' and question = $q$¿Cuántos minutos dura un partido de fútbol reglamentario?$q$;

update public.questions set
  question_en = $t$In which country was badminton invented?$t$,
  options_en  = $t$["China","India","United Kingdom","Indonesia"]$t$::jsonb,
  context_en  = $t$Modern badminton was developed at Badminton House (England) in 1873, although it derives from ancient racket games.$t$
where category = 'deportes' and question = $q$¿En qué país se inventó el bádminton?$q$;

update public.questions set
  question_en = $t$How many points does a home run add in baseball?$t$,
  options_en  = $t$["1","2","3","It depends"]$t$::jsonb,
  context_en  = $t$A home run is worth the points corresponding to the runners who reach home. With bases loaded, it is 4 points (a grand slam).$t$
where category = 'deportes' and question = $q$¿Cuántos puntos suma un home run en béisbol?$q$;

update public.questions set
  question_en = $t$Which team won Euro 2020 (held in 2021)?$t$,
  options_en  = $t$["England","Italy","France","Spain"]$t$::jsonb,
  context_en  = $t$Italy won Euro 2020, beating England on penalties at Wembley. Roberto Mancini was the manager.$t$
where category = 'deportes' and question = $q$¿Qué selección ganó la Eurocopa 2020 (celebrada en 2021)?$q$;

update public.questions set
  question_en = $t$How much does an official football weigh?$t$,
  options_en  = $t$["350-380 g","410-450 g","500-550 g","600 g"]$t$::jsonb,
  context_en  = $t$An official football weighs between 410 and 450 grams at the start of the match, according to FIFA rules.$t$
where category = 'deportes' and question = $q$¿Cuánto pesa un balón oficial de fútbol?$q$;

update public.questions set
  question_en = $t$In which game do you win by achieving 'checkmate'?$t$,
  options_en  = $t$["Checkers","Chess","Backgammon","Go"]$t$::jsonb,
  context_en  = $t$In chess you win by delivering checkmate, attacking the enemy king with no escape.$t$
where category = 'deportes' and question = $q$¿En qué deporte se gana al lograr "checkmate"?$q$;

update public.questions set
  question_en = $t$Which female swimmer has won the most Olympic medals?$t$,
  options_en  = $t$["Katie Ledecky","Jenny Thompson","Missy Franklin","Dara Torres"]$t$::jsonb,
  context_en  = $t$Jenny Thompson (USA) won 12 Olympic swimming medals between 1992 and 2004. Katie Ledecky has 10 as of 2024.$t$
where category = 'deportes' and question = $q$¿Qué nadadora ha ganado más medallas olímpicas?$q$;

update public.questions set
  question_en = $t$How many sets must a volleyball team win to take the match?$t$,
  options_en  = $t$["2","3","4","5"]$t$::jsonb,
  context_en  = $t$Volleyball is played to the best of 5 sets (to 25 points, the fifth to 15). You must win 3 sets.$t$
where category = 'deportes' and question = $q$¿Cuántos sets debe ganar un equipo de voleibol para llevarse el partido?$q$;

update public.questions set
  question_en = $t$In what year was the first Super Bowl held?$t$,
  options_en  = $t$["1960","1967","1970","1975"]$t$::jsonb,
  context_en  = $t$The first Super Bowl was in January 1967. The Green Bay Packers beat the Kansas City Chiefs 35-10.$t$
where category = 'deportes' and question = $q$¿En qué año se celebró el primer Súper Bowl?$q$;

update public.questions set
  question_en = $t$What is Canada's national sport by law?$t$,
  options_en  = $t$["Ice hockey","Lacrosse","Baseball","Curling"]$t$::jsonb,
  context_en  = $t$Canada declared by law in 1994 lacrosse as the national summer sport and ice hockey as the national winter sport.$t$
where category = 'deportes' and question = $q$¿Cuál es el deporte nacional de Canadá según ley?$q$;

update public.questions set
  question_en = $t$How long is the Olympic athletics track?$t$,
  options_en  = $t$["350 m","400 m","440 m","500 m"]$t$::jsonb,
  context_en  = $t$A standard Olympic track measures 400 m in lane 1. The outer lanes are progressively longer.$t$
where category = 'deportes' and question = $q$¿Cuántos km tiene la pista olímpica de atletismo?$q$;

update public.questions set
  question_en = $t$In what year did Roger Bannister first break 4 minutes in the mile?$t$,
  options_en  = $t$["1948","1952","1954","1960"]$t$::jsonb,
  context_en  = $t$Roger Bannister was the first to run the mile under 4 minutes (3:59.4) on 6 May 1954 in Oxford.$t$
where category = 'deportes' and question = $q$¿En qué año Roger Bannister bajó por primera vez de 4 minutos en la milla?$q$;

update public.questions set
  question_en = $t$How many gold medals did Mark Spitz win at Munich 1972?$t$,
  options_en  = $t$["5","6","7","8"]$t$::jsonb,
  context_en  = $t$Mark Spitz won 7 swimming golds at Munich 1972, a record only surpassed by Michael Phelps with 8 at Beijing 2008.$t$
where category = 'deportes' and question = $q$¿Cuántas medallas de oro ganó Mark Spitz en Múnich 1972?$q$;

update public.questions set
  question_en = $t$Which NBA player has the most rings?$t$,
  options_en  = $t$["Michael Jordan","Bill Russell","LeBron James","Kareem Abdul-Jabbar"]$t$::jsonb,
  context_en  = $t$Bill Russell won 11 rings with the Boston Celtics between 1957 and 1969. Michael Jordan won 6 with the Chicago Bulls.$t$
where category = 'deportes' and question = $q$¿Qué jugador de la NBA tiene más anillos?$q$;

update public.questions set
  question_en = $t$Which sport is played at Wimbledon?$t$,
  options_en  = $t$["Golf","Cricket","Tennis","Rugby"]$t$::jsonb,
  context_en  = $t$Wimbledon is the most prestigious tennis tournament, founded in 1877. It is played on grass and players are required to wear white.$t$
where category = 'deportes' and question = $q$¿Qué deporte se practica en Wimbledon?$q$;

update public.questions set
  question_en = $t$How many points does a touchdown add in American football?$t$,
  options_en  = $t$["3","6","7","9"]$t$::jsonb,
  context_en  = $t$A touchdown is worth 6 points. Afterward you can convert 1 extra point (a kick) or 2 (a play from the 2-yard line).$t$
where category = 'deportes' and question = $q$¿Cuántos puntos suma un touchdown en fútbol americano?$q$;

update public.questions set
  question_en = $t$Who is the all-time top scorer at the World Cup?$t$,
  options_en  = $t$["Pelé","Ronaldo","Klose","Müller"]$t$::jsonb,
  context_en  = $t$Germany's Miroslav Klose leads with 16 World Cup goals (2002-2014). Ronaldo Nazário scored 15 and Müller 14.$t$
where category = 'deportes' and question = $q$¿Quién es el máximo goleador histórico del Mundial?$q$;

update public.questions set
  question_en = $t$Which player is nicknamed 'La Pulga' (The Flea)?$t$,
  options_en  = $t$["Cristiano Ronaldo","Neymar","Lionel Messi","Mbappé"]$t$::jsonb,
  context_en  = $t$Lionel Messi gets this nickname for his short stature and agility. He has won 8 Ballon d'Or awards, an all-time record.$t$
where category = 'deportes' and question = $q$¿Qué jugador es apodado "La Pulga"?$q$;

update public.questions set
  question_en = $t$In which sport do teams compete for the Webb Ellis Trophy?$t$,
  options_en  = $t$["Cricket","Rugby union","Football","American football"]$t$::jsonb,
  context_en  = $t$The Webb Ellis Cup is the Rugby Union World Cup trophy, named after William Webb Ellis, the supposed inventor of the sport.$t$
where category = 'deportes' and question = $q$¿En qué deporte se compite por el Trofeo Webb Ellis?$q$;

update public.questions set
  question_en = $t$How many players does a water polo team have in play?$t$,
  options_en  = $t$["5","6","7","8"]$t$::jsonb,
  context_en  = $t$In water polo, 7 per team play (6 plus the goalkeeper). Matches are divided into 4 quarters of 8 minutes.$t$
where category = 'deportes' and question = $q$¿Cuántos jugadores tiene un equipo de waterpolo en cancha?$q$;

update public.questions set
  question_en = $t$Who won the 2023 Ballon d'Or?$t$,
  options_en  = $t$["Mbappé","Messi","Haaland","Vinicius"]$t$::jsonb,
  context_en  = $t$Lionel Messi won his 8th Ballon d'Or in 2023, after winning the Qatar 2022 World Cup with Argentina.$t$
where category = 'deportes' and question = $q$¿Quién ganó el Balón de Oro 2023?$q$;

update public.questions set
  question_en = $t$How many Ballon d'Or awards does Cristiano Ronaldo have?$t$,
  options_en  = $t$["4","5","6","7"]$t$::jsonb,
  context_en  = $t$Cristiano Ronaldo has won 5 Ballon d'Or awards (2008, 2013, 2014, 2016, 2017).$t$
where category = 'deportes' and question = $q$¿Cuántos Balones de Oro tiene Cristiano Ronaldo?$q$;

update public.questions set
  question_en = $t$In what year was the first Women's Football World Cup held?$t$,
  options_en  = $t$["1980","1991","1995","2003"]$t$::jsonb,
  context_en  = $t$The first Women's Football World Cup was held in China in 1991. The United States won it.$t$
where category = 'deportes' and question = $q$¿En qué año se celebró el primer Mundial de fútbol femenino?$q$;

update public.questions set
  question_en = $t$Which team won the 2023 Women's Football World Cup?$t$,
  options_en  = $t$["U.S.","Spain","England","Sweden"]$t$::jsonb,
  context_en  = $t$Spain won the 2023 Women's World Cup held in Australia and New Zealand, beating England in the final (1-0).$t$
where category = 'deportes' and question = $q$¿Qué selección ganó el Mundial femenino de fútbol 2023?$q$;

update public.questions set
  question_en = $t$In which sport did Tiger Woods excel?$t$,
  options_en  = $t$["Tennis","Golf","Baseball","Hockey"]$t$::jsonb,
  context_en  = $t$Tiger Woods is one of the greatest golfers in history, with 15 majors won.$t$
where category = 'deportes' and question = $q$¿En qué deporte destacó Tiger Woods?$q$;

update public.questions set
  question_en = $t$How many Grand Slams did Rafael Nadal win in his career?$t$,
  options_en  = $t$["20","21","22","23"]$t$::jsonb,
  context_en  = $t$Rafa Nadal won 22 Grand Slam titles, 14 of them at Roland Garros, where he is the undisputed king.$t$
where category = 'deportes' and question = $q$¿Cuántos Grand Slams ganó Rafael Nadal en su carrera?$q$;

update public.questions set
  question_en = $t$In which tournament is Nadal nicknamed the 'King of Clay'?$t$,
  options_en  = $t$["Wimbledon","US Open","Roland Garros","Australian Open"]$t$::jsonb,
  context_en  = $t$Rafa Nadal has won Roland Garros 14 times (2005-2022), an absolute record for a Grand Slam.$t$
where category = 'deportes' and question = $q$¿En qué torneo es Nadal apodado "Rey de la Tierra"?$q$;

update public.questions set
  question_en = $t$On which surface is Wimbledon played?$t$,
  options_en  = $t$["Clay","Hard court","Grass","Carpet"]$t$::jsonb,
  context_en  = $t$Wimbledon, the oldest Grand Slam (since 1877), is played on grass in London.$t$
where category = 'deportes' and question = $q$¿En qué superficie se juega Wimbledon?$q$;

update public.questions set
  question_en = $t$Who is the female tennis player with the most Grand Slams in the professional era?$t$,
  options_en  = $t$["Steffi Graf","Margaret Court","Serena Williams","Martina Navratilova"]$t$::jsonb,
  context_en  = $t$Margaret Court has 24 Grand Slams (some in the amateur era). Serena Williams has 23 in the Open Era.$t$
where category = 'deportes' and question = $q$¿Quién es la tenista con más Grand Slams en la era profesional?$q$;

update public.questions set
  question_en = $t$How many Grand Slams did Serena Williams win?$t$,
  options_en  = $t$["20","22","23","24"]$t$::jsonb,
  context_en  = $t$Serena Williams retired with 23 singles Grand Slam titles in the Open Era.$t$
where category = 'deportes' and question = $q$¿Cuántos Grand Slams ganó Serena Williams?$q$;

update public.questions set
  question_en = $t$In what year did the Paralympic Games debut?$t$,
  options_en  = $t$["1948","1960","1976","1988"]$t$::jsonb,
  context_en  = $t$The first official Paralympic Games were held in Rome 1960, associated with the Olympics.$t$
where category = 'deportes' and question = $q$¿En qué año debutaron los Juegos Paralímpicos?$q$;

update public.questions set
  question_en = $t$Which sport was invented in Canada in 1875?$t$,
  options_en  = $t$["Ice hockey","Basketball","Lacrosse","Curling"]$t$::jsonb,
  context_en  = $t$The first organized ice hockey game was played in Montreal in 1875. It is Canada's national winter sport.$t$
where category = 'deportes' and question = $q$¿Qué deporte se inventó en Canadá en 1875?$q$;

update public.questions set
  question_en = $t$How many points is a free throw worth in basketball?$t$,
  options_en  = $t$["1","2","3","4"]$t$::jsonb,
  context_en  = $t$Each free throw made is worth 1 point. Field goals are worth 2 or 3 depending on the distance.$t$
where category = 'deportes' and question = $q$¿Cuántos puntos vale un canasto desde el tiro libre en baloncesto?$q$;

update public.questions set
  question_en = $t$Which player scored 100 points in an NBA game?$t$,
  options_en  = $t$["Michael Jordan","Wilt Chamberlain","Kobe Bryant","LeBron James"]$t$::jsonb,
  context_en  = $t$Wilt Chamberlain scored 100 points for the Philadelphia Warriors on 2 March 1962. An all-time record.$t$
where category = 'deportes' and question = $q$¿Qué jugador anotó 100 puntos en un partido de la NBA?$q$;

update public.questions set
  question_en = $t$Who is the all-time leading scorer in the NBA?$t$,
  options_en  = $t$["Kareem Abdul-Jabbar","LeBron James","Karl Malone","Michael Jordan"]$t$::jsonb,
  context_en  = $t$LeBron James surpassed Kareem Abdul-Jabbar in February 2023 as the NBA's all-time leading scorer.$t$
where category = 'deportes' and question = $q$¿Quién es el máximo anotador histórico de la NBA?$q$;

update public.questions set
  question_en = $t$Which player won 6 NBA rings with the Chicago Bulls?$t$,
  options_en  = $t$["LeBron James","Michael Jordan","Magic Johnson","Larry Bird"]$t$::jsonb,
  context_en  = $t$Michael Jordan won 6 NBA rings with the Bulls (1991, 1992, 1993, 1996, 1997, 1998) and was Finals MVP in all of them.$t$
where category = 'deportes' and question = $q$¿Qué jugador ganó 6 anillos NBA con los Chicago Bulls?$q$;

update public.questions set
  question_en = $t$In what year was the NBA founded?$t$,
  options_en  = $t$["1939","1946","1950","1954"]$t$::jsonb,
  context_en  = $t$The NBA was founded as the Basketball Association of America (BAA) in 1946. It adopted its current name in 1949.$t$
where category = 'deportes' and question = $q$¿En qué año se fundó la NBA?$q$;

update public.questions set
  question_en = $t$How many players does an American football team have on the field?$t$,
  options_en  = $t$["9","11","12","15"]$t$::jsonb,
  context_en  = $t$Each team has 11 players on the field, whether attacking or defending.$t$
where category = 'deportes' and question = $q$¿Cuántos jugadores tiene un equipo de fútbol americano en cancha?$q$;

update public.questions set
  question_en = $t$Which quarterback won 7 Super Bowls?$t$,
  options_en  = $t$["Joe Montana","Tom Brady","Peyton Manning","Brett Favre"]$t$::jsonb,
  context_en  = $t$Tom Brady won 7 Super Bowls (6 with the New England Patriots and 1 with the Tampa Bay Buccaneers), an absolute record.$t$
where category = 'deportes' and question = $q$¿Qué quarterback ganó 7 Super Bowls?$q$;

update public.questions set
  question_en = $t$In which sport is a 'shuttlecock' used?$t$,
  options_en  = $t$["Tennis","Badminton","Padel","Table tennis"]$t$::jsonb,
  context_en  = $t$The shuttlecock is used in badminton. It can exceed 400 km/h in a smash.$t$
where category = 'deportes' and question = $q$¿En qué deporte se utiliza un "shuttlecock" (volante)?$q$;

update public.questions set
  question_en = $t$How many sets are played in women's Grand Slam tennis?$t$,
  options_en  = $t$["Best of 3","Best of 5","Always 3","Best of 7"]$t$::jsonb,
  context_en  = $t$Women's tennis is played to the best of 3 sets, also in Grand Slams. Men's is played to the best of 5.$t$
where category = 'deportes' and question = $q$¿Cuántos sets se juegan en el tenis femenino de Grand Slam?$q$;

update public.questions set
  question_en = $t$In what year was VAR introduced in the Spanish league?$t$,
  options_en  = $t$["2014","2018","2019","2021"]$t$::jsonb,
  context_en  = $t$VAR (Video Assistant Referee) was implemented in LaLiga in the 2018-2019 season.$t$
where category = 'deportes' and question = $q$¿En qué año se introdujo el VAR en la Liga española?$q$;

update public.questions set
  question_en = $t$In what year did Spain win its only men's football World Cup?$t$,
  options_en  = $t$["2008","2010","2012","2014"]$t$::jsonb,
  context_en  = $t$Spain won the 2010 World Cup in South Africa, beating the Netherlands 1-0 in the final with a goal from Andrés Iniesta.$t$
where category = 'deportes' and question = $q$¿En qué año ganó España su único Mundial de fútbol masculino?$q$;

update public.questions set
  question_en = $t$Who scored the decisive goal in the 2010 World Cup final?$t$,
  options_en  = $t$["Villa","Xavi","Iniesta","Pedro"]$t$::jsonb,
  context_en  = $t$Andrés Iniesta scored the goal in extra time (116th minute) in the final against the Netherlands.$t$
where category = 'deportes' and question = $q$¿Quién marcó el gol decisivo en la final del Mundial 2010?$q$;

update public.questions set
  question_en = $t$Which team won Euro 2024?$t$,
  options_en  = $t$["Spain","England","France","Netherlands"]$t$::jsonb,
  context_en  = $t$Spain won Euro 2024 in Germany, their 4th, beating England 2-1 in the final.$t$
where category = 'deportes' and question = $q$¿Qué selección ganó la Eurocopa 2024?$q$;

update public.questions set
  question_en = $t$In which sport did Magic Johnson excel?$t$,
  options_en  = $t$["Basketball","Baseball","American football","Hockey"]$t$::jsonb,
  context_en  = $t$Magic Johnson won 5 NBA rings with the Los Angeles Lakers in the 1980s. One of the legends of basketball.$t$
where category = 'deportes' and question = $q$¿En qué deporte destacó Magic Johnson?$q$;

update public.questions set
  question_en = $t$Who is Usain Bolt?$t$,
  options_en  = $t$["A Jamaican sprinter","A long jumper","A marathon runner","A decathlete"]$t$::jsonb,
  context_en  = $t$Usain Bolt holds the world records for the 100 m (9.58 s) and 200 m (19.19 s). He won 8 Olympic golds.$t$
where category = 'deportes' and question = $q$¿Quién es Usain Bolt?$q$;

update public.questions set
  question_en = $t$In which game do you win by achieving 'checkmate'?$t$,
  options_en  = $t$["Checkers","Backgammon","Chess","Go"]$t$::jsonb,
  context_en  = $t$In chess, 'checkmate' means the king is threatened and has no possible escape.$t$
where category = 'deportes' and question = $q$¿En qué deporte se gana al lograr una "checkmate"?$q$;

update public.questions set
  question_en = $t$Who is the current world chess champion (2024)?$t$,
  options_en  = $t$["Magnus Carlsen","Ding Liren","Gukesh","Nepomniachtchi"]$t$::jsonb,
  context_en  = $t$D Gukesh, an 18-year-old Indian, became world champion by beating Ding Liren in December 2024.$t$
where category = 'deportes' and question = $q$¿Quién es el campeón mundial de ajedrez actual (2024)?$q$;

update public.questions set
  question_en = $t$Which Norwegian dominated world chess 2013-2023?$t$,
  options_en  = $t$["Magnus Carlsen","Nepomniachtchi","Ding","Caruana"]$t$::jsonb,
  context_en  = $t$Magnus Carlsen was world champion from 2013 to 2023, when he gave up the title out of lack of interest.$t$
where category = 'deportes' and question = $q$¿Qué noruego dominó el ajedrez mundial 2013-2023?$q$;

update public.questions set
  question_en = $t$Which sport is practiced in the Tour de France?$t$,
  options_en  = $t$["Athletics","Cycling","Triathlon","Motorcycling"]$t$::jsonb,
  context_en  = $t$The Tour de France is the biggest stage cycling race in the world, held annually in July since 1903.$t$
where category = 'deportes' and question = $q$¿Qué deporte se practica en el Tour de Francia?$q$;

update public.questions set
  question_en = $t$Who won the Tour de France 5 times (legally)?$t$,
  options_en  = $t$["Bernard Hinault","Eddy Merckx","Miguel Indurain","All of them"]$t$::jsonb,
  context_en  = $t$Hinault, Merckx, Anquetil and Indurain each have 5 Tours. Armstrong was stripped for doping.$t$
where category = 'deportes' and question = $q$¿Quién ganó el Tour de Francia 5 veces (legalmente)?$q$;

update public.questions set
  question_en = $t$How many Tours in a row did Miguel Indurain win?$t$,
  options_en  = $t$["3","4","5","6"]$t$::jsonb,
  context_en  = $t$Miguel Indurain won 5 consecutive Tours de France (1991-1995), a unique feat in history.$t$
where category = 'deportes' and question = $q$¿Cuántos Tours seguidos ganó Miguel Induráin?$q$;

update public.questions set
  question_en = $t$Which Spanish driver won the F1 World Championship in 2005 and 2006?$t$,
  options_en  = $t$["Carlos Sainz","Pedro de la Rosa","Fernando Alonso","Marc Gené"]$t$::jsonb,
  context_en  = $t$Fernando Alonso won two consecutive world titles with Renault (2005 and 2006).$t$
where category = 'deportes' and question = $q$¿Qué piloto español ganó el Mundial de F1 en 2005 y 2006?$q$;

update public.questions set
  question_en = $t$Who is the driver with the most F1 world titles?$t$,
  options_en  = $t$["Hamilton","Schumacher","Hamilton and Schumacher","Senna"]$t$::jsonb,
  context_en  = $t$Lewis Hamilton and Michael Schumacher share the record with 7 world titles each.$t$
where category = 'deportes' and question = $q$¿Quién es el piloto con más títulos mundiales de F1?$q$;

update public.questions set
  question_en = $t$On which circuit is the Monaco Grand Prix held?$t$,
  options_en  = $t$["Spa","Monte Carlo","Monza","Silverstone"]$t$::jsonb,
  context_en  = $t$The Monaco Grand Prix is held on the Monte Carlo street circuit since 1929. It is one of the 'jewels' of F1.$t$
where category = 'deportes' and question = $q$¿En qué circuito se celebra el Gran Premio de Mónaco?$q$;

update public.questions set
  question_en = $t$Which Brazilian driver died at Imola in 1994?$t$,
  options_en  = $t$["Senna","Piquet","Massa","Barrichello"]$t$::jsonb,
  context_en  = $t$Ayrton Senna died in a crash at the Tamburello corner of the Imola circuit on 1 May 1994.$t$
where category = 'deportes' and question = $q$¿Qué piloto brasileño murió en Imola en 1994?$q$;

update public.questions set
  question_en = $t$Which sport does Marc Márquez practice?$t$,
  options_en  = $t$["F1","MotoGP","Rally","Cycling"]$t$::jsonb,
  context_en  = $t$Marc Márquez is a 6-time MotoGP world champion (2013-2014, 2016-2019). One of the great riders in history.$t$
where category = 'deportes' and question = $q$¿Qué deporte practica Marc Márquez?$q$;

update public.questions set
  question_en = $t$Who is Valentino Rossi?$t$,
  options_en  = $t$["An Italian MotoGP rider","A tennis player","A skier","A cyclist"]$t$::jsonb,
  context_en  = $t$Valentino Rossi won 9 motorcycling World Championships (1997-2009), 7 of them in the premier class.$t$
where category = 'deportes' and question = $q$¿Quién es Valentino Rossi?$q$;

update public.questions set
  question_en = $t$How many km does an average stage of the Tour de France have?$t$,
  options_en  = $t$["100 km","170 km","250 km","300 km"]$t$::jsonb,
  context_en  = $t$The historical average is around 170-200 km per stage. The total Tour is usually about 3,500 km.$t$
where category = 'deportes' and question = $q$¿Cuántos km tiene una etapa media del Tour de Francia?$q$;

update public.questions set
  question_en = $t$Which sport does Michael Phelps practice?$t$,
  options_en  = $t$["Athletics","Swimming","Diving","Triathlon"]$t$::jsonb,
  context_en  = $t$Michael Phelps is the most decorated Olympic athlete, with 28 medals (23 gold) in swimming.$t$
where category = 'deportes' and question = $q$¿Qué deporte practica Michael Phelps?$q$;

update public.questions set
  question_en = $t$In what year were the Barcelona Olympics held?$t$,
  options_en  = $t$["1988","1992","1996","2000"]$t$::jsonb,
  context_en  = $t$The Barcelona Olympic Games were held from 25 July to 9 August 1992.$t$
where category = 'deportes' and question = $q$¿En qué año se celebraron los JJ.OO. de Barcelona?$q$;

update public.questions set
  question_en = $t$In what year were the Tokyo 2020 Olympics held?$t$,
  options_en  = $t$["2020","2021","2022","2024"]$t$::jsonb,
  context_en  = $t$The Tokyo 2020 Olympics were postponed due to the pandemic and held in July-August 2021.$t$
where category = 'deportes' and question = $q$¿En qué año se celebraron los JJ.OO. de Tokio 2020?$q$;

update public.questions set
  question_en = $t$Which country will host the 2028 Summer Olympics?$t$,
  options_en  = $t$["France","Australia","U.S.","Japan"]$t$::jsonb,
  context_en  = $t$The Los Angeles 2028 Olympics will be the third in the U.S. city (1932, 1984, 2028).$t$
where category = 'deportes' and question = $q$¿Qué país albergará los JJ.OO. de verano 2028?$q$;

update public.questions set
  question_en = $t$Which city hosted the 2024 Olympics?$t$,
  options_en  = $t$["Tokyo","Paris","Los Angeles","Brisbane"]$t$::jsonb,
  context_en  = $t$Paris hosted the 2024 Olympics, 100 years after the 1924 Games. Opening ceremony along the Seine.$t$
where category = 'deportes' and question = $q$¿Qué ciudad acogió los JJ.OO. de 2024?$q$;

update public.questions set
  question_en = $t$How many rings make up the Olympic symbol?$t$,
  options_en  = $t$["4","5","6","7"]$t$::jsonb,
  context_en  = $t$The five rings represent the five participating continents. They were used for the first time at the Antwerp 1920 Olympics.$t$
where category = 'deportes' and question = $q$¿Cuántos anillos forman el símbolo olímpico?$q$;

update public.questions set
  question_en = $t$Which color is missing from the Olympic rings (blue, yellow, black, green, ...)?$t$,
  options_en  = $t$["Orange","Red","Purple","Brown"]$t$::jsonb,
  context_en  = $t$The five colors are blue, yellow, black, green and red, on a white background.$t$
where category = 'deportes' and question = $q$¿Qué color falta en los anillos olímpicos (azul, amarillo, negro, verde, ...)?$q$;

update public.questions set
  question_en = $t$How many players make up a handball team on the court?$t$,
  options_en  = $t$["6","7","8","9"]$t$::jsonb,
  context_en  = $t$Each handball team plays with 7 players (6 field players + goalkeeper).$t$
where category = 'deportes' and question = $q$¿Cuántos jugadores forman un equipo de balonmano en cancha?$q$;

update public.questions set
  question_en = $t$In which sport is Nikolai Valuev a legend?$t$,
  options_en  = $t$["Boxing","Wrestling","MMA","Hockey"]$t$::jsonb,
  context_en  = $t$Nikolai Valuev, a 2.13 m Russian, was WBA heavyweight boxing world champion (2005-2009).$t$
where category = 'deportes' and question = $q$¿En qué deporte es leyenda Nikolai Valuev?$q$;

update public.questions set
  question_en = $t$Who is Muhammad Ali?$t$,
  options_en  = $t$["A tennis player","A boxer","An athlete","A jai alai player"]$t$::jsonb,
  context_en  = $t$Muhammad Ali (1942-2016) is considered one of the greatest boxers of all time. Three-time world champion.$t$
where category = 'deportes' and question = $q$¿Quién es Muhammad Ali?$q$;

update public.questions set
  question_en = $t$Which phrase is famous from Muhammad Ali?$t$,
  options_en  = $t$["Win or die","Float like a butterfly, sting like a bee","Just do it","Yes I can"]$t$::jsonb,
  context_en  = $t$His signature phrase was 'Float like a butterfly, sting like a bee'.$t$
where category = 'deportes' and question = $q$¿Qué frase es famosa de Muhammad Ali?$q$;

update public.questions set
  question_en = $t$In which sport is the America's Cup contested?$t$,
  options_en  = $t$["Football","Sailing","Both","Baseball"]$t$::jsonb,
  context_en  = $t$The 'Copa América' is both the South American national football tournament and (America's Cup) the oldest sailing regatta in the world.$t$
where category = 'deportes' and question = $q$¿En qué deporte se compite por la Copa América?$q$;

update public.questions set
  question_en = $t$In which sport did Pau Gasol excel?$t$,
  options_en  = $t$["Football","Basketball","Handball","Tennis"]$t$::jsonb,
  context_en  = $t$Pau Gasol won 2 NBA rings with the Los Angeles Lakers (2009, 2010) and a World Cup with Spain (2006).$t$
where category = 'deportes' and question = $q$¿En qué deporte destacó Pau Gasol?$q$;

update public.questions set
  question_en = $t$Who is Severiano Ballesteros?$t$,
  options_en  = $t$["A Spanish golfer","A tennis player","A shooter","A chess player"]$t$::jsonb,
  context_en  = $t$Seve Ballesteros (1957-2011) won 5 golf majors and was a pioneer of European golf. Three British Opens and two Masters.$t$
where category = 'deportes' and question = $q$¿Quién es Severiano Ballesteros?$q$;

update public.questions set
  question_en = $t$Which national team dominated world rugby with its 'haka'?$t$,
  options_en  = $t$["Australia","South Africa","England","New Zealand"]$t$::jsonb,
  context_en  = $t$The All Blacks of New Zealand perform the Maori haka before each match. They have won the World Cup 3 times.$t$
where category = 'deportes' and question = $q$¿Qué selección dominó el rugby mundial con su "haka"?$q$;

update public.questions set
  question_en = $t$How many players play rugby union on the field per team?$t$,
  options_en  = $t$["11","13","15","18"]$t$::jsonb,
  context_en  = $t$Each rugby union team plays with 15 players. Rugby league (a variant) is played with 13.$t$
where category = 'deportes' and question = $q$¿Cuántos jugadores juegan rugby union en cancha por equipo?$q$;

update public.questions set
  question_en = $t$Which sport was invented in England in the 18th century?$t$,
  options_en  = $t$["Cricket","Baseball","Polo","American football"]$t$::jsonb,
  context_en  = $t$Cricket has been documented in England since the 16th century. It is the national sport of India and other Commonwealth countries.$t$
where category = 'deportes' and question = $q$¿Qué deporte se inventó en Inglaterra en el s. XVIII?$q$;

update public.questions set
  question_en = $t$In which sport did Sachin Tendulkar excel?$t$,
  options_en  = $t$["Hockey","Cricket","Badminton","Squash"]$t$::jsonb,
  context_en  = $t$Sachin Tendulkar, 'the little master', is probably the greatest cricket player in history. Indian.$t$
where category = 'deportes' and question = $q$¿En qué deporte destacó Sachin Tendulkar?$q$;

update public.questions set
  question_en = $t$In which sport did Hicham El Guerrouj excel?$t$,
  options_en  = $t$["Athletics (middle distance)","Boxing","Football","Marathon"]$t$::jsonb,
  context_en  = $t$The Moroccan Hicham El Guerrouj holds the world records for the 1,500 m and the mile. Double gold at Athens 2004.$t$
where category = 'deportes' and question = $q$¿En qué deporte destacó Hicham El Guerrouj?$q$;

update public.questions set
  question_en = $t$Who broke the marathon world record in 2023?$t$,
  options_en  = $t$["Eliud Kipchoge","Kelvin Kiptum","Geoffrey Kamworor","Wilson Kipsang"]$t$::jsonb,
  context_en  = $t$Kelvin Kiptum broke the world record at Chicago 2023 with 2h00:35. He died tragically in 2024.$t$
where category = 'deportes' and question = $q$¿Quién batió el récord mundial del maratón en 2023?$q$;

update public.questions set
  question_en = $t$What is the women's world record for the marathon?$t$,
  options_en  = $t$["~2h11","~2h09","~2h15","~2h05"]$t$::jsonb,
  context_en  = $t$Ruth Chepngetich (Kenya) ran the Chicago marathon 2024 in 2h09:56, the first woman under 2h10.$t$
where category = 'deportes' and question = $q$¿Cuál es el récord mundial femenino del maratón?$q$;

update public.questions set
  question_en = $t$In what year was the 3-point line introduced in the NBA?$t$,
  options_en  = $t$["1975","1979","1982","1985"]$t$::jsonb,
  context_en  = $t$The 3-point line was introduced in the 1979-1980 season. FIBA adopted it in 1984.$t$
where category = 'deportes' and question = $q$¿En qué año se introdujo la línea de 3 puntos en la NBA?$q$;

update public.questions set
  question_en = $t$In which sport do you win by being the first to cross the finish line?$t$,
  options_en  = $t$["Wrestling","Athletics","Archery","Weightlifting"]$t$::jsonb,
  context_en  = $t$In athletics (races), the first to cross the finish line wins. There are distances from 100 m to the marathon.$t$
where category = 'deportes' and question = $q$¿Qué deporte se gana siendo el primero en pasar la línea de meta?$q$;

update public.questions set
  question_en = $t$In which sport is the word 'ace' used?$t$,
  options_en  = $t$["Football","Tennis","Baseball","Hockey"]$t$::jsonb,
  context_en  = $t$In tennis, an 'ace' is a winning serve that the receiver does not even touch with the racket.$t$
where category = 'deportes' and question = $q$¿En qué deporte se utiliza la palabra "ace"?$q$;

update public.questions set
  question_en = $t$In which sport is the term 'knockout' (KO) used?$t$,
  options_en  = $t$["Boxing","Fencing","Wrestling","Athletics"]$t$::jsonb,
  context_en  = $t$In boxing, a knockout is when the opponent cannot get up before the referee's count of 10.$t$
where category = 'deportes' and question = $q$¿En qué deporte se utiliza el término "knockout" (KO)?$q$;

update public.questions set
  question_en = $t$In which sport is the 'Webb Ellis Trophy' awarded?$t$,
  options_en  = $t$["Rugby","Cricket","Polo","Tennis"]$t$::jsonb,
  context_en  = $t$The Webb Ellis Trophy is awarded to the winner of the Rugby World Cup. William Webb Ellis 'invented' rugby in 1823.$t$
where category = 'deportes' and question = $q$¿En qué deporte se concede el "Trofeo Webb Ellis"?$q$;

update public.questions set
  question_en = $t$In what year was the first Rugby World Cup held?$t$,
  options_en  = $t$["1983","1987","1991","1995"]$t$::jsonb,
  context_en  = $t$The first Rugby World Cup was organized in Australia and New Zealand in 1987. New Zealand won it.$t$
where category = 'deportes' and question = $q$¿En qué año se celebró el primer Mundial de Rugby?$q$;

update public.questions set
  question_en = $t$In which sport did Pelé excel?$t$,
  options_en  = $t$["Football","Volleyball","Baseball","Basketball"]$t$::jsonb,
  context_en  = $t$Pelé (Edson Arantes do Nascimento, 1940-2022) won 3 World Cups with Brazil (1958, 1962, 1970), a unique record.$t$
where category = 'deportes' and question = $q$¿En qué deporte destacó Pelé?$q$;

update public.questions set
  question_en = $t$How many World Cups did Lionel Messi play?$t$,
  options_en  = $t$["3","4","5","6"]$t$::jsonb,
  context_en  = $t$Messi played 5 World Cups with Argentina (2006, 2010, 2014, 2018, 2022). He won the 2022 one in Qatar.$t$
where category = 'deportes' and question = $q$¿Cuántos Mundiales jugó Lionel Messi?$q$;

update public.questions set
  question_en = $t$In what year was FIFA founded?$t$,
  options_en  = $t$["1904","1910","1920","1930"]$t$::jsonb,
  context_en  = $t$FIFA was founded on 21 May 1904 in Paris with 7 national federations.$t$
where category = 'deportes' and question = $q$¿En qué año se fundó la FIFA?$q$;

update public.questions set
  question_en = $t$Who is the all-time top scorer for Real Madrid?$t$,
  options_en  = $t$["Cristiano Ronaldo","Raúl","Di Stéfano","Benzema"]$t$::jsonb,
  context_en  = $t$Cristiano Ronaldo is Real Madrid's all-time top scorer with 450 goals in 438 matches (2009-2018).$t$
where category = 'deportes' and question = $q$¿Quién es el máximo goleador de la historia del Real Madrid?$q$;

update public.questions set
  question_en = $t$In what year was FC Barcelona founded?$t$,
  options_en  = $t$["1898","1899","1900","1902"]$t$::jsonb,
  context_en  = $t$FC Barcelona was founded on 29 November 1899 by Joan Gamper.$t$
where category = 'deportes' and question = $q$¿En qué año se fundó el FC Barcelona?$q$;

update public.questions set
  question_en = $t$In what year was Real Madrid founded?$t$,
  options_en  = $t$["1898","1900","1902","1908"]$t$::jsonb,
  context_en  = $t$Real Madrid was founded on 6 March 1902 as Madrid Football Club.$t$
where category = 'deportes' and question = $q$¿En qué año se fundó el Real Madrid?$q$;

update public.questions set
  question_en = $t$Who is the all-time top scorer for FC Barcelona?$t$,
  options_en  = $t$["Suárez","Messi","Cruyff","Kubala"]$t$::jsonb,
  context_en  = $t$Lionel Messi scored 672 goals with FC Barcelona (2004-2021), an absolute club record.$t$
where category = 'deportes' and question = $q$¿Quién es el máximo goleador histórico del FC Barcelona?$q$;

update public.questions set
  question_en = $t$In which sport did Cassius Clay excel?$t$,
  options_en  = $t$["Wrestling","Boxing","Athletics","Football"]$t$::jsonb,
  context_en  = $t$Cassius Clay is the birth name of Muhammad Ali. He changed his name in 1964 when he converted to Islam.$t$
where category = 'deportes' and question = $q$¿En qué deporte destacó Cassius Clay?$q$;

update public.questions set
  question_en = $t$Which team won the 2024 Copa América?$t$,
  options_en  = $t$["Argentina","Colombia","Uruguay","Brazil"]$t$::jsonb,
  context_en  = $t$Argentina won the 2024 Copa América in the U.S., beating Colombia 1-0 in the final.$t$
where category = 'deportes' and question = $q$¿Qué selección ganó la Copa América 2024?$q$;

update public.questions set
  question_en = $t$In what year did Athletic Bilbao win the Copa del Rey last (before 2024)?$t$,
  options_en  = $t$["1973","1984","1990","2002"]$t$::jsonb,
  context_en  = $t$Athletic won the 1984 Cup before winning the 2024 one, ending a 40-year drought.$t$
where category = 'deportes' and question = $q$¿En qué año conquistó el Athletic de Bilbao la Copa del Rey por última vez (antes de 2024)?$q$;

update public.questions set
  question_en = $t$How many minutes does an NBA quarter last?$t$,
  options_en  = $t$["10","12","15","20"]$t$::jsonb,
  context_en  = $t$Each NBA quarter lasts 12 minutes. A total NBA game: 48 minutes. In FIBA it is 10 min/quarter (40 min total).$t$
where category = 'deportes' and question = $q$¿Cuántos minutos dura un cuarto en la NBA?$q$;

update public.questions set
  question_en = $t$How many players are on a padel team?$t$,
  options_en  = $t$["1","2","3","4"]$t$::jsonb,
  context_en  = $t$Padel is always played in pairs (2 vs 2). It is a sport born in Mexico in 1969.$t$
where category = 'deportes' and question = $q$¿Cuántos jugadores hay en un equipo de pádel?$q$;

update public.questions set
  question_en = $t$In which country did padel become popular?$t$,
  options_en  = $t$["Mexico","Spain","Argentina","All of the above"]$t$::jsonb,
  context_en  = $t$Padel was born in Mexico (1969), spread through Argentina and became established in Spain, where it is very popular.$t$
where category = 'deportes' and question = $q$¿En qué país se popularizó el pádel?$q$;

update public.questions set
  question_en = $t$In which sport did the Williams sisters excel?$t$,
  options_en  = $t$["Tennis","Badminton","Squash","Table tennis"]$t$::jsonb,
  context_en  = $t$Venus and Serena Williams dominated world women's tennis for more than two decades.$t$
where category = 'deportes' and question = $q$¿En qué deporte destacaron las hermanas Williams?$q$;

update public.questions set
  question_en = $t$In what year did Lionel Messi debut with FC Barcelona?$t$,
  options_en  = $t$["2003","2004","2005","2006"]$t$::jsonb,
  context_en  = $t$Messi debuted with FC Barcelona on 16 October 2004 against Espanyol.$t$
where category = 'deportes' and question = $q$¿En qué año debutó Lionel Messi con el FC Barcelona?$q$;

update public.questions set
  question_en = $t$How many goals did Pelé officially score in his career?$t$,
  options_en  = $t$["~700","~1,000","~1,280","~1,500"]$t$::jsonb,
  context_en  = $t$Pelé scored 757 goals in official matches according to FIFA, although he claimed 1,281 including friendlies.$t$
where category = 'deportes' and question = $q$¿Cuántos goles marcó Pelé oficialmente en su carrera?$q$;

update public.questions set
  question_en = $t$In which sport do you win by achieving a 'hat-trick'?$t$,
  options_en  = $t$["Any sport with goals (especially football)","Tennis","Golf","Cricket"]$t$::jsonb,
  context_en  = $t$In football and hockey, a hat-trick is scoring 3 goals in a single match. The term comes from cricket.$t$
where category = 'deportes' and question = $q$¿Qué deporte se gana logrando un "hat-trick"?$q$;

update public.questions set
  question_en = $t$How many players does a baseball team have in play?$t$,
  options_en  = $t$["9","10","11","12"]$t$::jsonb,
  context_en  = $t$A baseball team fields 9 players (including the pitcher and the catcher).$t$
where category = 'deportes' and question = $q$¿Cuántos jugadores tiene un equipo de béisbol en cancha?$q$;

update public.questions set
  question_en = $t$Which sport was invented in the United States in 1891?$t$,
  options_en  = $t$["Basketball","Baseball","Volleyball","American football"]$t$::jsonb,
  context_en  = $t$James Naismith invented basketball in Springfield (Massachusetts) in December 1891.$t$
where category = 'deportes' and question = $q$¿Qué deporte se inventó en Estados Unidos en 1891?$q$;

update public.questions set
  question_en = $t$In what year was volleyball invented?$t$,
  options_en  = $t$["1891","1895","1900","1910"]$t$::jsonb,
  context_en  = $t$William G. Morgan invented volleyball in 1895 in Holyoke (Massachusetts), originally called 'mintonette'.$t$
where category = 'deportes' and question = $q$¿En qué año se inventó el voleibol?$q$;

update public.questions set
  question_en = $t$How many players are on a beach volleyball team?$t$,
  options_en  = $t$["2","3","4","6"]$t$::jsonb,
  context_en  = $t$Beach volleyball is played 2 vs 2. It has been an Olympic sport since Atlanta 1996.$t$
where category = 'deportes' and question = $q$¿Cuántos jugadores tiene un equipo de voley playa?$q$;

update public.questions set
  question_en = $t$In which sport is the Ryder Cup contested?$t$,
  options_en  = $t$["Tennis","Golf","Polo","Sailing"]$t$::jsonb,
  context_en  = $t$The Ryder Cup is the team golf competition between Europe and the U.S., held every 2 years since 1927.$t$
where category = 'deportes' and question = $q$¿En qué deporte se compite por la Copa Ryder?$q$;

update public.questions set
  question_en = $t$Who is Lewis Hamilton?$t$,
  options_en  = $t$["A British F1 driver","An athlete","A tennis player","A boxer"]$t$::jsonb,
  context_en  = $t$Lewis Hamilton is a 7-time F1 world champion. The driver with the most wins and poles in history.$t$
where category = 'deportes' and question = $q$¿Quién es Lewis Hamilton?$q$;

update public.questions set
  question_en = $t$Which sport is played with a flying disc between teams?$t$,
  options_en  = $t$["Ultimate","Cornhole","Bocce","Bowling"]$t$::jsonb,
  context_en  = $t$Ultimate frisbee is played with a disc between two teams on a field similar to an American football field.$t$
where category = 'deportes' and question = $q$¿Qué deporte se practica con un disco volador entre equipos?$q$;

update public.questions set
  question_en = $t$Which American swimmer won 7 golds at Tokyo 2020/2021?$t$,
  options_en  = $t$["Katie Ledecky","Caeleb Dressel","Mireia Belmonte","Adam Peaty"]$t$::jsonb,
  context_en  = $t$Katie Ledecky is one of the great swimmers in history, with multiple Olympic golds. (Caeleb Dressel also won multiple in Tokyo.)$t$
where category = 'deportes' and question = $q$¿Qué nadadora estadounidense ganó 7 oros en Tokio 2020/2021?$q$;

update public.questions set
  question_en = $t$In what year did football debut as an Olympic sport?$t$,
  options_en  = $t$["1896","1900","1908","1924"]$t$::jsonb,
  context_en  = $t$Men's football debuted as an Olympic sport at Paris 1900 (a demonstration) and became official at London 1908.$t$
where category = 'deportes' and question = $q$¿En qué año debutó el fútbol como deporte olímpico?$q$;

update public.questions set
  question_en = $t$In which sport is the 'Maillot Jaune' contested?$t$,
  options_en  = $t$["Tour de France","Giro d'Italia","Vuelta a España","Paris-Roubaix"]$t$::jsonb,
  context_en  = $t$The yellow jersey (maillot jaune) is worn by the leader of the general classification of the Tour de France.$t$
where category = 'deportes' and question = $q$¿En qué deporte se compite por el "Maillot Jaune"?$q$;

update public.questions set
  question_en = $t$What color is the leader's jersey in the Giro d'Italia?$t$,
  options_en  = $t$["Pink","Yellow","Green","Red"]$t$::jsonb,
  context_en  = $t$The pink jersey (maglia rosa) has been that of the Giro d'Italia leader since 1931. The color honors the newspaper La Gazzetta dello Sport.$t$
where category = 'deportes' and question = $q$¿De qué color es la camiseta del líder del Giro de Italia?$q$;

update public.questions set
  question_en = $t$In which sport did Roger Federer excel?$t$,
  options_en  = $t$["Tennis","Skiing","Football","Hockey"]$t$::jsonb,
  context_en  = $t$Roger Federer won 20 Grand Slams. Considered one of the greatest tennis players of all time.$t$
where category = 'deportes' and question = $q$¿En qué deporte destacó Roger Federer?$q$;

update public.questions set
  question_en = $t$How many points must a team reach to win a volleyball set?$t$,
  options_en  = $t$["25 points","21 points","11 points","30 points"]$t$::jsonb,
  context_en  = $t$Each volleyball set is won by reaching 25 points with a 2-point lead (except the 5th set, to 15).$t$
where category = 'deportes' and question = $q$¿Cuántos sets ha de ganar un equipo en voleibol para llevarse el set?$q$;

update public.questions set
  question_en = $t$In which sport did Nadia Comăneci excel?$t$,
  options_en  = $t$["Gymnastics","Skating","Athletics","Swimming"]$t$::jsonb,
  context_en  = $t$Nadia Comăneci (Romania) was the first gymnast to score a perfect 10, at the Montreal 1976 Olympics.$t$
where category = 'deportes' and question = $q$¿En qué deporte destacó Nadia Comăneci?$q$;

update public.questions set
  question_en = $t$Which American football player was nicknamed 'Sweetness'?$t$,
  options_en  = $t$["Joe Montana","Walter Payton","Jerry Rice","Barry Sanders"]$t$::jsonb,
  context_en  = $t$Walter Payton, a Chicago Bears legend, was nicknamed 'Sweetness' for his elegance when running.$t$
where category = 'deportes' and question = $q$¿Qué jugador de fútbol americano fue apodado "Sweetness"?$q$;

update public.questions set
  question_en = $t$In which sport is the 'Heisman Trophy' contested?$t$,
  options_en  = $t$["College American football","NBA","Baseball","Hockey"]$t$::jsonb,
  context_en  = $t$The Heisman Trophy has been awarded to the best college American football player since 1935.$t$
where category = 'deportes' and question = $q$¿En qué deporte se compite por el "Heisman Trophy"?$q$;


-- ── biologia (150) ──
update public.questions set
  question_en = $t$What is the largest organ in the human body?$t$,
  options_en  = $t$["Liver","Lung","Skin","Intestine"]$t$::jsonb,
  context_en  = $t$The skin is the largest organ, at about 2 m² and up to 5 kg. It is the first line of defense against the outside.$t$
where category = 'biologia' and question = $q$¿Cuál es el órgano más grande del cuerpo humano?$q$;

update public.questions set
  question_en = $t$How many chromosomes does a human somatic cell have?$t$,
  options_en  = $t$["23","44","46","48"]$t$::jsonb,
  context_en  = $t$Human somatic cells have 46 chromosomes (23 pairs). Gametes have 23 unpaired (haploid).$t$
where category = 'biologia' and question = $q$¿Cuántos cromosomas tiene una célula humana somática?$q$;

update public.questions set
  question_en = $t$Which organelle is known as the 'powerhouse' of the cell?$t$,
  options_en  = $t$["Nucleus","Mitochondrion","Ribosome","Lysosome"]$t$::jsonb,
  context_en  = $t$Mitochondria generate ATP through cellular respiration. They have their own DNA, an evolutionary legacy of a symbiotic bacterium.$t$
where category = 'biologia' and question = $q$¿Qué orgánulo se conoce como la "central energética" de la célula?$q$;

update public.questions set
  question_en = $t$Who formulated the laws of genetic inheritance?$t$,
  options_en  = $t$["Darwin","Mendel","Watson","Crick"]$t$::jsonb,
  context_en  = $t$Gregor Mendel published his laws in 1866 studying peas. His work was ignored until the early 20th century.$t$
where category = 'biologia' and question = $q$¿Quién formuló las leyes de la herencia genética?$q$;

update public.questions set
  question_en = $t$Which nitrogenous bases make up DNA?$t$,
  options_en  = $t$["A,T,C,G","A,U,C,G","A,T,C,U","A,U,T,G"]$t$::jsonb,
  context_en  = $t$DNA contains adenine (A), thymine (T), cytosine (C) and guanine (G). In RNA, thymine is replaced by uracil (U).$t$
where category = 'biologia' and question = $q$¿Qué bases nitrogenadas forman el ADN?$q$;

update public.questions set
  question_en = $t$What is the basic unit of life?$t$,
  options_en  = $t$["Atom","Molecule","Cell","Tissue"]$t$::jsonb,
  context_en  = $t$The cell is the basic structural and functional unit of living beings, formulated by cell theory in 1839.$t$
where category = 'biologia' and question = $q$¿Cuál es la unidad básica de la vida?$q$;

update public.questions set
  question_en = $t$Which type of cell has no defined nucleus?$t$,
  options_en  = $t$["Eukaryotic","Prokaryotic","Animal","Plant"]$t$::jsonb,
  context_en  = $t$Prokaryotes (bacteria and archaea) have no nucleus: their DNA floats freely in the cytoplasm. They appeared ~3,500 million years ago.$t$
where category = 'biologia' and question = $q$¿Qué tipo de células no tienen núcleo definido?$q$;

update public.questions set
  question_en = $t$How many bones does the adult human body have?$t$,
  options_en  = $t$["186","206","226","246"]$t$::jsonb,
  context_en  = $t$An adult has 206 bones. At birth there are ~270 that gradually fuse. The smallest is the stapes in the ear.$t$
where category = 'biologia' and question = $q$¿Cuántos huesos tiene el cuerpo humano adulto?$q$;

update public.questions set
  question_en = $t$Which system is responsible for defending the body from infections?$t$,
  options_en  = $t$["Endocrine","Immune","Nervous","Digestive"]$t$::jsonb,
  context_en  = $t$The immune system includes lymphocytes, antibodies and other components that identify and eliminate pathogens.$t$
where category = 'biologia' and question = $q$¿Cuál es el sistema responsable de defender al cuerpo de infecciones?$q$;

update public.questions set
  question_en = $t$Which process allows plants to convert light into energy?$t$,
  options_en  = $t$["Respiration","Photosynthesis","Fermentation","Transpiration"]$t$::jsonb,
  context_en  = $t$Photosynthesis converts CO₂ and water into glucose and O₂ using solar energy. It occurs mainly in the chloroplasts.$t$
where category = 'biologia' and question = $q$¿Qué proceso permite a las plantas convertir luz en energía?$q$;

update public.questions set
  question_en = $t$Which animal has the largest heart on the planet?$t$,
  options_en  = $t$["African elephant","Giraffe","Blue whale","Whale shark"]$t$::jsonb,
  context_en  = $t$The blue whale's heart can weigh more than 180 kg and pumps 220 liters of blood per beat. It is the largest known animal.$t$
where category = 'biologia' and question = $q$¿Qué animal tiene el corazón más grande del planeta?$q$;

update public.questions set
  question_en = $t$Who proposed the theory of evolution by natural selection?$t$,
  options_en  = $t$["Lamarck","Wallace","Darwin","Mendel"]$t$::jsonb,
  context_en  = $t$Darwin published 'On the Origin of Species' in 1859. Alfred Wallace reached similar conclusions independently.$t$
where category = 'biologia' and question = $q$¿Quién propuso la teoría de la evolución por selección natural?$q$;

update public.questions set
  question_en = $t$Which is the strongest muscle in the human body (by proportion)?$t$,
  options_en  = $t$["Biceps","Quadriceps","Masseter","Gluteus maximus"]$t$::jsonb,
  context_en  = $t$The masseter (of the jaw) exerts the greatest force in proportion to its size: ~90 kg when clenching the molars.$t$
where category = 'biologia' and question = $q$¿Cuál es el músculo más fuerte del cuerpo humano (por proporción)?$q$;

update public.questions set
  question_en = $t$Which blood type is considered the universal donor?$t$,
  options_en  = $t$["A+","O-","AB+","B+"]$t$::jsonb,
  context_en  = $t$O negative has no A, B or Rh antigens, so it can be transfused to anyone in emergencies. AB+ is the universal recipient.$t$
where category = 'biologia' and question = $q$¿Qué tipo de sangre se considera donante universal?$q$;

update public.questions set
  question_en = $t$How many chambers does the human heart have?$t$,
  options_en  = $t$["2","3","4","5"]$t$::jsonb,
  context_en  = $t$The heart has 4 chambers: 2 atria (top) and 2 ventricles (bottom). Blood flows in pulmonary and systemic circuits.$t$
where category = 'biologia' and question = $q$¿Cuántas cámaras tiene el corazón humano?$q$;

update public.questions set
  question_en = $t$In which organelle are proteins synthesized?$t$,
  options_en  = $t$["Nucleus","Mitochondrion","Ribosome","Chloroplast"]$t$::jsonb,
  context_en  = $t$Ribosomes synthesize proteins by reading messenger RNA (translation). They can be free or attached to the endoplasmic reticulum.$t$
where category = 'biologia' and question = $q$¿En qué orgánulo se sintetizan las proteínas?$q$;

update public.questions set
  question_en = $t$Which is the universal recipient blood group?$t$,
  options_en  = $t$["O-","O+","AB+","A+"]$t$::jsonb,
  context_en  = $t$AB+ can receive blood from any group, because it has A, B and Rh antigens and produces no antibodies against them.$t$
where category = 'biologia' and question = $q$¿Cuál es el grupo sanguíneo receptor universal?$q$;

update public.questions set
  question_en = $t$Which neurotransmitter is related to pleasure and reward?$t$,
  options_en  = $t$["Serotonin","Dopamine","GABA","Glutamate"]$t$::jsonb,
  context_en  = $t$Dopamine regulates motivation, reward and pleasure. Its deficit is associated with Parkinson's and its excess with schizophrenia.$t$
where category = 'biologia' and question = $q$¿Qué neurotransmisor está relacionado con el placer y la recompensa?$q$;

update public.questions set
  question_en = $t$Which is the fastest land animal?$t$,
  options_en  = $t$["Lion","Cheetah","Antelope","Horse"]$t$::jsonb,
  context_en  = $t$The cheetah reaches 110 km/h in short bursts. Its long body and semi-retractable claws are adaptations for speed.$t$
where category = 'biologia' and question = $q$¿Cuál es el animal terrestre más rápido?$q$;

update public.questions set
  question_en = $t$Which acid predominates in gastric juice?$t$,
  options_en  = $t$["Sulfuric","Hydrochloric","Nitric","Citric"]$t$::jsonb,
  context_en  = $t$Hydrochloric acid (HCl) in the stomach has a pH of 1-2 and activates pepsin to digest proteins.$t$
where category = 'biologia' and question = $q$¿Qué ácido predomina en el jugo gástrico?$q$;

update public.questions set
  question_en = $t$How many legs does an insect have?$t$,
  options_en  = $t$["4","6","8","10"]$t$::jsonb,
  context_en  = $t$Insects have 6 legs (3 pairs), divided into 3 body segments: head, thorax and abdomen. Arachnids have 8.$t$
where category = 'biologia' and question = $q$¿Cuántas patas tiene un insecto?$q$;

update public.questions set
  question_en = $t$In which part of the brain is balance controlled?$t$,
  options_en  = $t$["Cerebrum","Cerebellum","Medulla oblongata","Hypothalamus"]$t$::jsonb,
  context_en  = $t$The cerebellum coordinates movement, balance and posture. It is at the back of the brain.$t$
where category = 'biologia' and question = $q$¿En qué parte del cerebro se controla el equilibrio?$q$;

update public.questions set
  question_en = $t$Which is the longest bone in the human body?$t$,
  options_en  = $t$["Tibia","Femur","Humerus","Ulna"]$t$::jsonb,
  context_en  = $t$The femur (thigh) measures ~46 cm in an average adult. It is also the strongest bone: it supports loads of up to 1,500 kg.$t$
where category = 'biologia' and question = $q$¿Cuál es el hueso más largo del cuerpo humano?$q$;

update public.questions set
  question_en = $t$How many legs do spiders have?$t$,
  options_en  = $t$["6","8","10","12"]$t$::jsonb,
  context_en  = $t$Spiders have 8 legs, a characteristic of arachnids. Their body is divided into a cephalothorax and abdomen.$t$
where category = 'biologia' and question = $q$¿Cuántas patas tienen las arañas?$q$;

update public.questions set
  question_en = $t$Which organ filters blood and produces urine?$t$,
  options_en  = $t$["Liver","Bladder","Kidney","Pancreas"]$t$::jsonb,
  context_en  = $t$The kidneys filter ~180 liters of blood a day, eliminating waste and regulating water and electrolytes.$t$
where category = 'biologia' and question = $q$¿Qué órgano filtra la sangre y produce orina?$q$;

update public.questions set
  question_en = $t$What is the name of the cell division process that produces gametes?$t$,
  options_en  = $t$["Mitosis","Meiosis","Apoptosis","Cytokinesis"]$t$::jsonb,
  context_en  = $t$Meiosis produces 4 haploid cells from one diploid, with genetic recombination. It is the basis of sexual reproduction.$t$
where category = 'biologia' and question = $q$¿Cómo se llama el proceso de división celular que produce gametos?$q$;

update public.questions set
  question_en = $t$Which animal has the largest known genome?$t$,
  options_en  = $t$["Human","Lungfish","Salamander","Whale"]$t$::jsonb,
  context_en  = $t$Some salamanders (like Necturus) have genomes of up to 120,000 Mb, compared to the human's 3,000.$t$
where category = 'biologia' and question = $q$¿Cuál es el animal con el mayor genoma conocido?$q$;

update public.questions set
  question_en = $t$How many liters of blood does an average adult have?$t$,
  options_en  = $t$["3","5","7","10"]$t$::jsonb,
  context_en  = $t$An adult has about 5 liters of blood (7-8% of body weight). A loss of more than 20% can be fatal.$t$
where category = 'biologia' and question = $q$¿Cuántos litros de sangre tiene un adulto medio?$q$;

update public.questions set
  question_en = $t$Which pigment gives plants their green color?$t$,
  options_en  = $t$["Carotene","Chlorophyll","Anthocyanin","Melanin"]$t$::jsonb,
  context_en  = $t$Chlorophyll absorbs red and blue light and reflects green. It is essential for photosynthesis and resides in the chloroplasts.$t$
where category = 'biologia' and question = $q$¿Qué pigmento da el color verde a las plantas?$q$;

update public.questions set
  question_en = $t$Which gland regulates metabolism through thyroid hormones?$t$,
  options_en  = $t$["Pituitary","Thyroid","Adrenal","Pancreas"]$t$::jsonb,
  context_en  = $t$The thyroid secretes T3 and T4, which regulate basal metabolism. Its malfunction causes hypo- or hyperthyroidism.$t$
where category = 'biologia' and question = $q$¿Qué glándula regula el metabolismo mediante hormonas tiroideas?$q$;

update public.questions set
  question_en = $t$Who discovered the structure of DNA in 1953?$t$,
  options_en  = $t$["Mendel and Morgan","Watson and Crick","Pasteur and Koch","Darwin and Wallace"]$t$::jsonb,
  context_en  = $t$Watson and Crick proposed the double helix in 1953, based on Rosalind Franklin's diffraction data. Nobel Prize 1962.$t$
where category = 'biologia' and question = $q$¿Quiénes descubrieron la estructura del ADN en 1953?$q$;

update public.questions set
  question_en = $t$How many liters of air does a human breathe per day (average)?$t$,
  options_en  = $t$["1,000","5,000","11,000","30,000"]$t$::jsonb,
  context_en  = $t$An adult breathes ~11,000 liters of air per day (12-16 breaths per minute, 500 ml each).$t$
where category = 'biologia' and question = $q$¿Cuántos litros de aire respira un humano al día (media)?$q$;

update public.questions set
  question_en = $t$Which organ produces insulin?$t$,
  options_en  = $t$["Liver","Kidney","Pancreas","Thyroid"]$t$::jsonb,
  context_en  = $t$The pancreas, through the islets of Langerhans, produces insulin (regulates glucose) and glucagon. Its dysfunction causes diabetes.$t$
where category = 'biologia' and question = $q$¿Qué órgano produce la insulina?$q$;

update public.questions set
  question_en = $t$What is the basic unit of the nervous system?$t$,
  options_en  = $t$["Neuron","Synapse","Axon","Myelin"]$t$::jsonb,
  context_en  = $t$The neuron transmits electrical and chemical signals. The human brain has about 86 billion neurons.$t$
where category = 'biologia' and question = $q$¿Cuál es la unidad básica del sistema nervioso?$q$;

update public.questions set
  question_en = $t$Which taxonomic kingdom includes fungi?$t$,
  options_en  = $t$["Plantae","Fungi","Animalia","Protista"]$t$::jsonb,
  context_en  = $t$Fungi form their own kingdom, Fungi. They are not plants: they do not photosynthesize and their cell wall is made of chitin.$t$
where category = 'biologia' and question = $q$¿Qué reino taxonómico incluye a los hongos?$q$;

update public.questions set
  question_en = $t$How many senses does the human being traditionally have?$t$,
  options_en  = $t$["4","5","6","7"]$t$::jsonb,
  context_en  = $t$Traditionally 5 are recognized: sight, hearing, smell, taste and touch. Modern science adds balance, proprioception, etc.$t$
where category = 'biologia' and question = $q$¿Cuántos sentidos tiene tradicionalmente el ser humano?$q$;

update public.questions set
  question_en = $t$Which animal has the largest brain?$t$,
  options_en  = $t$["Human","Sperm whale","Elephant","Dolphin"]$t$::jsonb,
  context_en  = $t$The sperm whale has the heaviest brain: up to 8 kg. The human has ~1.4 kg but the highest brain/body ratio among the large ones.$t$
where category = 'biologia' and question = $q$¿Cuál es el animal con el mayor cerebro?$q$;

update public.questions set
  question_en = $t$What type of root does the carrot have?$t$,
  options_en  = $t$["Fibrous","Taproot","Adventitious","Aerial"]$t$::jsonb,
  context_en  = $t$The carrot has a taproot (axonomorphic), which grows thickened as a sugar reserve (especially carotenes).$t$
where category = 'biologia' and question = $q$¿Qué tipo de raíz tiene la zanahoria?$q$;

update public.questions set
  question_en = $t$What type of reproduction do bacteria have?$t$,
  options_en  = $t$["Sexual","Asexual","Viviparous","Oviparous"]$t$::jsonb,
  context_en  = $t$Bacteria reproduce by binary fission (asexual), duplicating their DNA and dividing into two identical daughter cells.$t$
where category = 'biologia' and question = $q$¿Qué tipo de reproducción producen las bacterias?$q$;

update public.questions set
  question_en = $t$How many vertebrae does the human spine have?$t$,
  options_en  = $t$["24","33","36","40"]$t$::jsonb,
  context_en  = $t$The spine has 33 vertebrae: 7 cervical, 12 thoracic, 5 lumbar, 5 sacral (fused) and 4 coccygeal (fused).$t$
where category = 'biologia' and question = $q$¿Cuántas vértebras tiene la columna humana?$q$;

update public.questions set
  question_en = $t$What function do red blood cells perform?$t$,
  options_en  = $t$["Defend from infections","Clot blood","Transport O₂","Produce hormones"]$t$::jsonb,
  context_en  = $t$Erythrocytes transport O₂ from the lungs to the tissues thanks to hemoglobin, which contains iron.$t$
where category = 'biologia' and question = $q$¿Qué función cumplen los glóbulos rojos?$q$;

update public.questions set
  question_en = $t$Which animal lays the largest eggs proportionally?$t$,
  options_en  = $t$["Ostrich","Kiwi","Crocodile","Turtle"]$t$::jsonb,
  context_en  = $t$The kiwi lays eggs at 20% of its body weight, the largest proportionally in the animal kingdom. The ostrich lays the largest in absolute terms.$t$
where category = 'biologia' and question = $q$¿Qué animal pone los huevos más grandes proporcionalmente?$q$;

update public.questions set
  question_en = $t$In which phase of the cell cycle is DNA replicated?$t$,
  options_en  = $t$["G1","S","G2","M"]$t$::jsonb,
  context_en  = $t$DNA replication occurs in the S (synthesis) phase, between G1 and G2 of interphase. M is the mitotic phase.$t$
where category = 'biologia' and question = $q$¿En qué fase del ciclo celular se replica el ADN?$q$;

update public.questions set
  question_en = $t$Which is the oldest living organism (in years of an individual)?$t$,
  options_en  = $t$["Giant tortoise","Sequoia","Bristlecone pine","Coral"]$t$::jsonb,
  context_en  = $t$Some bristlecone pines (Pinus longaeva) are more than 5,000 years old. The oldest documented, Methuselah, is about 4,855 years old.$t$
where category = 'biologia' and question = $q$¿Cuál es el organismo vivo más antiguo (en años de un individuo)?$q$;

update public.questions set
  question_en = $t$What type of plant is the fern?$t$,
  options_en  = $t$["Angiosperm","Gymnosperm","Pteridophyte","Bryophyte"]$t$::jsonb,
  context_en  = $t$Ferns are pteridophytes: vascular plants without seeds, which reproduce by spores. They have existed since the Devonian.$t$
where category = 'biologia' and question = $q$¿Qué tipo de planta es el helecho?$q$;

update public.questions set
  question_en = $t$Which animal is known as the 'Tasmanian devil'?$t$,
  options_en  = $t$["A rat","A marsupial","A reptile","An amphibian"]$t$::jsonb,
  context_en  = $t$The Tasmanian devil (Sarcophilus harrisii) is a carnivorous marsupial endemic to Tasmania. It is the largest marsupial predator today.$t$
where category = 'biologia' and question = $q$¿Qué animal es conocido como el "diablo de Tasmania"?$q$;

update public.questions set
  question_en = $t$How many pairs of ribs does a human have?$t$,
  options_en  = $t$["10","12","14","16"]$t$::jsonb,
  context_en  = $t$The human has 12 pairs of ribs: 7 true, 3 false and 2 floating. They add up to 24 bones in total.$t$
where category = 'biologia' and question = $q$¿Cuántos pares de costillas tiene el ser humano?$q$;

update public.questions set
  question_en = $t$Which tissue lines internal organs and forms glands?$t$,
  options_en  = $t$["Connective","Muscle","Epithelial","Nervous"]$t$::jsonb,
  context_en  = $t$Epithelial tissue covers surfaces (skin, mucous membranes) and forms exocrine and endocrine glands. There are 4 basic tissues.$t$
where category = 'biologia' and question = $q$¿Qué tejido recubre los órganos internos y forma glándulas?$q$;

update public.questions set
  question_en = $t$Which process converts glucose into energy (ATP) in the presence of O₂?$t$,
  options_en  = $t$["Glycolysis","Aerobic respiration","Fermentation","Photosynthesis"]$t$::jsonb,
  context_en  = $t$Aerobic respiration (Krebs cycle + respiratory chain) generates ~36-38 ATP molecules per glucose in the presence of oxygen.$t$
where category = 'biologia' and question = $q$¿Qué proceso convierte glucosa en energía (ATP) en presencia de O₂?$q$;

update public.questions set
  question_en = $t$What type of animal is the whale?$t$,
  options_en  = $t$["Fish","Mammal","Amphibian","Reptile"]$t$::jsonb,
  context_en  = $t$Whales are marine mammals: they breathe air, are viviparous and nurse their young.$t$
where category = 'biologia' and question = $q$¿Qué tipo de animal es la ballena?$q$;

update public.questions set
  question_en = $t$Which animal is known as the 'king of the jungle'?$t$,
  options_en  = $t$["Tiger","Lion","Leopard","Panther"]$t$::jsonb,
  context_en  = $t$The lion is traditionally called the 'king of the jungle' despite living in savannas, not jungles. It lives in groups called prides.$t$
where category = 'biologia' and question = $q$¿Qué animal es conocido como el "rey de la selva"?$q$;

update public.questions set
  question_en = $t$Which is the largest living animal on Earth?$t$,
  options_en  = $t$["African elephant","Blue whale","Whale shark","Giant squid"]$t$::jsonb,
  context_en  = $t$The blue whale can measure more than 30 m and weigh more than 150 tons. It is the largest known animal.$t$
where category = 'biologia' and question = $q$¿Cuál es el animal vivo más grande de la Tierra?$q$;

update public.questions set
  question_en = $t$Which is the most numerous insect on the planet?$t$,
  options_en  = $t$["Fly","Ant","Beetle","Mosquito"]$t$::jsonb,
  context_en  = $t$Coleoptera (beetles) are the order with the most described species (>350,000), approximately 40% of insects.$t$
where category = 'biologia' and question = $q$¿Cuál es el insecto más numeroso del planeta?$q$;

update public.questions set
  question_en = $t$How many legs does a centipede have?$t$,
  options_en  = $t$["Always 100","It depends on the species","Always 50","Always 200"]$t$::jsonb,
  context_en  = $t$Despite the name, centipedes have between 30 and 354 legs depending on the species; always an odd number of pairs.$t$
where category = 'biologia' and question = $q$¿Cuántas patas tiene un ciempiés?$q$;

update public.questions set
  question_en = $t$Which animal sleeps the most hours per day?$t$,
  options_en  = $t$["Sloth","Koala","Brown bat","Cat"]$t$::jsonb,
  context_en  = $t$The brown bat can sleep up to 20 hours a day. Koalas sleep about 18-22 hours.$t$
where category = 'biologia' and question = $q$¿Cuál es el animal que duerme más horas al día?$q$;

update public.questions set
  question_en = $t$Which animal lays the largest eggs in relation to its size?$t$,
  options_en  = $t$["Ostrich","Kiwi","Eagle","Penguin"]$t$::jsonb,
  context_en  = $t$The female kiwi lays an egg that can be ¼ of its body weight. In relation to size it is the record.$t$
where category = 'biologia' and question = $q$¿Qué animal pone los huevos más grandes en relación con su tamaño?$q$;

update public.questions set
  question_en = $t$Which is the largest amphibian in the world?$t$,
  options_en  = $t$["Cane toad","Chinese giant salamander","Bullfrog","Newt"]$t$::jsonb,
  context_en  = $t$The Chinese giant salamander can measure 1.8 m. It is one of the oldest animals on the planet and is critically endangered.$t$
where category = 'biologia' and question = $q$¿Cuál es el mayor anfibio del mundo?$q$;

update public.questions set
  question_en = $t$What type of animal is the turtle?$t$,
  options_en  = $t$["Amphibian","Reptile","Mammal","Fish"]$t$::jsonb,
  context_en  = $t$Turtles are reptiles. Some species like the Galápagos ones can live more than 150 years.$t$
where category = 'biologia' and question = $q$¿Qué tipo de animal es la tortuga?$q$;

update public.questions set
  question_en = $t$How many hearts does an octopus have?$t$,
  options_en  = $t$["1","2","3","4"]$t$::jsonb,
  context_en  = $t$The octopus has 3 hearts: one pumps blood to the body and two to the gills. Its blood is blue (copper).$t$
where category = 'biologia' and question = $q$¿Cuántos corazones tiene un pulpo?$q$;

update public.questions set
  question_en = $t$How many brains does a leech have?$t$,
  options_en  = $t$["1","5","18","32"]$t$::jsonb,
  context_en  = $t$The leech has 32 brains (ganglia) distributed across its body segments.$t$
where category = 'biologia' and question = $q$¿Cuántos cerebros tiene una sanguijuela?$q$;

update public.questions set
  question_en = $t$Which animal can regenerate its limbs?$t$,
  options_en  = $t$["Crab","Starfish","Salamander","All of the above"]$t$::jsonb,
  context_en  = $t$Starfish, salamanders (and also lizards) have a remarkable regenerative ability.$t$
where category = 'biologia' and question = $q$¿Qué animal puede regenerar sus extremidades?$q$;

update public.questions set
  question_en = $t$Which organ produces bile?$t$,
  options_en  = $t$["Pancreas","Liver","Kidney","Spleen"]$t$::jsonb,
  context_en  = $t$The liver produces bile, which is stored in the gallbladder and helps digest fats.$t$
where category = 'biologia' and question = $q$¿Qué órgano produce la bilis?$q$;

update public.questions set
  question_en = $t$Which organ stores bile?$t$,
  options_en  = $t$["Liver","Gallbladder","Pancreas","Stomach"]$t$::jsonb,
  context_en  = $t$The gallbladder stores and concentrates bile until it is needed for digestion.$t$
where category = 'biologia' and question = $q$¿Qué órgano almacena la bilis?$q$;

update public.questions set
  question_en = $t$What is the main function of the kidneys?$t$,
  options_en  = $t$["Pump blood","Filter blood","Digest food","Respiration"]$t$::jsonb,
  context_en  = $t$The kidneys filter the blood, eliminating waste and excess water through urine.$t$
where category = 'biologia' and question = $q$¿Cuál es la principal función de los riñones?$q$;

update public.questions set
  question_en = $t$How many chromosomes does a human gamete have?$t$,
  options_en  = $t$["23","46","48","92"]$t$::jsonb,
  context_en  = $t$Human gametes (egg and sperm) are haploid: they contain 23 chromosomes, half of a somatic cell.$t$
where category = 'biologia' and question = $q$¿Qué número de cromosomas tiene un gameto humano?$q$;

update public.questions set
  question_en = $t$What is the structure of DNA?$t$,
  options_en  = $t$["Linear","Double helix","Triple helix","Square"]$t$::jsonb,
  context_en  = $t$DNA has a double-helix structure, described by Watson and Crick in 1953.$t$
where category = 'biologia' and question = $q$¿Cuál es la estructura del ADN?$q$;

update public.questions set
  question_en = $t$Who published the laws of genetic inheritance?$t$,
  options_en  = $t$["Darwin","Mendel","Lamarck","Pasteur"]$t$::jsonb,
  context_en  = $t$Gregor Mendel published his laws in 1866 after experimenting with peas. His works were rediscovered in 1900.$t$
where category = 'biologia' and question = $q$¿Quién publicó las leyes de la herencia genética?$q$;

update public.questions set
  question_en = $t$How many pairs of chromosomes does a human being have?$t$,
  options_en  = $t$["22","23","24","46"]$t$::jsonb,
  context_en  = $t$Humans have 23 pairs of chromosomes (46 in total), including one sex pair (XX or XY).$t$
where category = 'biologia' and question = $q$¿Cuántos pares de cromosomas tiene el ser humano?$q$;

update public.questions set
  question_en = $t$Which sex chromosome makes a human embryo genetically male?$t$,
  options_en  = $t$["X","Y","Both","Neither"]$t$::jsonb,
  context_en  = $t$The Y chromosome, present in males (XY), contains the SRY gene that determines male development.$t$
where category = 'biologia' and question = $q$¿Qué cromosoma sexual hace que un embrión humano sea genéticamente masculino?$q$;

update public.questions set
  question_en = $t$Which blood cell participates in clotting?$t$,
  options_en  = $t$["Erythrocytes","Leukocytes","Platelets","Lymphocytes"]$t$::jsonb,
  context_en  = $t$Platelets (thrombocytes) are cell fragments that participate in blood clotting by forming plugs.$t$
where category = 'biologia' and question = $q$¿Qué célula sanguínea participa en la coagulación?$q$;

update public.questions set
  question_en = $t$What type of cells are lymphocytes?$t$,
  options_en  = $t$["Red blood cells","White blood cells","Platelets","Adipocytes"]$t$::jsonb,
  context_en  = $t$Lymphocytes are white blood cells (leukocytes) key to the adaptive immune system. There are B, T and NK types.$t$
where category = 'biologia' and question = $q$¿Qué tipo de células son los linfocitos?$q$;

update public.questions set
  question_en = $t$Which virus causes AIDS?$t$,
  options_en  = $t$["Hepatitis","HIV","Ebola","Influenza"]$t$::jsonb,
  context_en  = $t$HIV (Human Immunodeficiency Virus) attacks the immune system, weakening it until it causes AIDS.$t$
where category = 'biologia' and question = $q$¿Qué virus causa el SIDA?$q$;

update public.questions set
  question_en = $t$Which chromosome is involved in Down syndrome?$t$,
  options_en  = $t$["A chromosome is missing","There is an extra chromosome 21","The Y is missing","There is an extra X"]$t$::jsonb,
  context_en  = $t$Down syndrome (trisomy 21) is due to the presence of an extra chromosome 21 (3 copies instead of 2).$t$
where category = 'biologia' and question = $q$¿Qué cromosoma falta en el síndrome de Down?$q$;

update public.questions set
  question_en = $t$What is the main function of the lungs?$t$,
  options_en  = $t$["Pump blood","Gas exchange","Produce blood cells","Digestion"]$t$::jsonb,
  context_en  = $t$The lungs carry out gas exchange: they introduce O₂ into the blood and eliminate CO₂.$t$
where category = 'biologia' and question = $q$¿Cuál es la principal función de los pulmones?$q$;

update public.questions set
  question_en = $t$How many pulmonary alveoli does a human have (approx.)?$t$,
  options_en  = $t$["100 million","500 million","About 300-700 million","1 million"]$t$::jsonb,
  context_en  = $t$Human lungs contain about 300-700 million alveoli, which provide a surface of about 70 m² for gas exchange.$t$
where category = 'biologia' and question = $q$¿Cuántos alvéolos pulmonares tiene un humano (aprox.)?$q$;

update public.questions set
  question_en = $t$What is the ribosome?$t$,
  options_en  = $t$["An organelle of the mitochondria","The organelle where proteins are synthesized","A type of virus","Part of the nucleus"]$t$::jsonb,
  context_en  = $t$Ribosomes are membraneless organelles where proteins are synthesized by translating mRNA.$t$
where category = 'biologia' and question = $q$¿Qué es el ribosoma?$q$;

update public.questions set
  question_en = $t$Which organelle contains the green pigments in plant cells?$t$,
  options_en  = $t$["Mitochondrion","Chloroplast","Lysosome","Nucleus"]$t$::jsonb,
  context_en  = $t$Chloroplasts contain chlorophyll, the green pigment that captures light to carry out photosynthesis.$t$
where category = 'biologia' and question = $q$¿Qué orgánulo contiene los pigmentos verdes en las células vegetales?$q$;

update public.questions set
  question_en = $t$Which type of cells form muscle tissue?$t$,
  options_en  = $t$["Neurons","Myocytes","Adipocytes","Fibroblasts"]$t$::jsonb,
  context_en  = $t$Myocytes (muscle fibers) are the cells of muscle tissue. They can be smooth, striated or cardiac.$t$
where category = 'biologia' and question = $q$¿Qué tipo de células forman el tejido muscular?$q$;

update public.questions set
  question_en = $t$How many types of muscle tissue are there?$t$,
  options_en  = $t$["1","2","3","4"]$t$::jsonb,
  context_en  = $t$There are three types: smooth (involuntary, organs), striated (skeletal, voluntary) and cardiac (involuntary, heart).$t$
where category = 'biologia' and question = $q$¿Cuántos tipos de tejido muscular hay?$q$;

update public.questions set
  question_en = $t$What type of animal is the spider?$t$,
  options_en  = $t$["Insect","Arachnid","Crustacean","Chilopod"]$t$::jsonb,
  context_en  = $t$Spiders are arachnids: they have 8 legs, 2 body segments and lack antennae (unlike insects).$t$
where category = 'biologia' and question = $q$¿Qué tipo de animal es la araña?$q$;

update public.questions set
  question_en = $t$How many wings do insects typically have?$t$,
  options_en  = $t$["2","3","4","It depends"]$t$::jsonb,
  context_en  = $t$Most flying insects have 4 wings (2 pairs). In flies (Diptera) the second pair is reduced to halteres.$t$
where category = 'biologia' and question = $q$¿Cuántas alas tienen los insectos típicamente?$q$;

update public.questions set
  question_en = $t$Which pigment in human blood transports oxygen?$t$,
  options_en  = $t$["Myoglobin","Hemoglobin","Chlorophyll","Bilirubin"]$t$::jsonb,
  context_en  = $t$Hemoglobin, present in red blood cells, transports oxygen thanks to its iron content.$t$
where category = 'biologia' and question = $q$¿Qué pigmento de la sangre humana transporta el oxígeno?$q$;

update public.questions set
  question_en = $t$Which hormone do the male gonads produce?$t$,
  options_en  = $t$["Estrogen","Progesterone","Testosterone","Insulin"]$t$::jsonb,
  context_en  = $t$The testes produce testosterone, the hormone responsible for male sexual characteristics.$t$
where category = 'biologia' and question = $q$¿Qué hormona producen las gónadas masculinas?$q$;

update public.questions set
  question_en = $t$Which glands regulate calcium metabolism?$t$,
  options_en  = $t$["Pituitary","Thyroid and parathyroid","Adrenals","Pancreas"]$t$::jsonb,
  context_en  = $t$Parathyroid hormone (from the parathyroids) and calcitonin (from the thyroid) regulate blood calcium.$t$
where category = 'biologia' and question = $q$¿Qué glándulas regulan el metabolismo del calcio?$q$;

update public.questions set
  question_en = $t$Which virus causes COVID-19?$t$,
  options_en  = $t$["H1N1","Ebola","SARS-CoV-2","MERS-CoV"]$t$::jsonb,
  context_en  = $t$COVID-19 is caused by the coronavirus SARS-CoV-2, identified in late 2019 in Wuhan (China).$t$
where category = 'biologia' and question = $q$¿Qué virus causa el COVID-19?$q$;

update public.questions set
  question_en = $t$What type of relationship is that of the clownfish and the anemone?$t$,
  options_en  = $t$["Parasitism","Mutualism","Commensalism","Competition"]$t$::jsonb,
  context_en  = $t$The clownfish and the anemone live in mutualism: the fish receives protection and the anemone gets cleaning and aeration.$t$
where category = 'biologia' and question = $q$¿Qué tipo de relación es la del clownfish y la anémona?$q$;

update public.questions set
  question_en = $t$What type of relationship does a louse have with its host?$t$,
  options_en  = $t$["Parasitism","Mutualism","Commensalism","Competition"]$t$::jsonb,
  context_en  = $t$The louse is a parasite: it benefits at the expense of the host, which it harms by feeding on its blood.$t$
where category = 'biologia' and question = $q$¿Qué tipo de relación tiene un piojo con su huésped?$q$;

update public.questions set
  question_en = $t$Which animal lays eggs and produces milk?$t$,
  options_en  = $t$["Platypus","Whale","Ostrich","Penguin"]$t$::jsonb,
  context_en  = $t$The platypus (an Australian monotreme) is an egg-laying mammal: it lays eggs but nurses its young.$t$
where category = 'biologia' and question = $q$¿Qué tipo de animal pone huevos y produce leche?$q$;

update public.questions set
  question_en = $t$How many blood groups are there in the ABO system?$t$,
  options_en  = $t$["3","4","6","8"]$t$::jsonb,
  context_en  = $t$There are 4 ABO blood groups: A, B, AB and O. In addition, the Rh factor (+/-) is considered.$t$
where category = 'biologia' and question = $q$¿Cuántos grupos sanguíneos hay en el sistema ABO?$q$;

update public.questions set
  question_en = $t$Which kingdom includes animals?$t$,
  options_en  = $t$["Plantae","Animalia","Fungi","Protista"]$t$::jsonb,
  context_en  = $t$Animalia is one of the kingdoms of biological classification. It includes all multicellular heterotrophic animals.$t$
where category = 'biologia' and question = $q$¿Cuál es el reino que incluye a los animales?$q$;

update public.questions set
  question_en = $t$Which taxonomic group is made up of unicellular prokaryotic organisms without a nucleus?$t$,
  options_en  = $t$["Fungi","Protists","Bacteria","Animals"]$t$::jsonb,
  context_en  = $t$Bacteria are unicellular prokaryotic organisms (without a defined cell nucleus). They belong to the Bacteria domain.$t$
where category = 'biologia' and question = $q$¿Qué grupo taxonómico está formado por organismos unicelulares procariotas sin núcleo?$q$;

update public.questions set
  question_en = $t$What process do viruses use to multiply?$t$,
  options_en  = $t$["Mitosis","Meiosis","Replication inside host cells","Conjugation"]$t$::jsonb,
  context_en  = $t$Viruses do not multiply on their own: they must infect cells and use their machinery to replicate.$t$
where category = 'biologia' and question = $q$¿Qué proceso usan los virus para multiplicarse?$q$;

update public.questions set
  question_en = $t$What type of leaves do conifers have?$t$,
  options_en  = $t$["Broad","Needle-like","Compound","Palmate"]$t$::jsonb,
  context_en  = $t$Conifers have needle-like or scaly leaves. E.g.: pines, firs.$t$
where category = 'biologia' and question = $q$¿Qué tipo de hojas tienen las coníferas?$q$;

update public.questions set
  question_en = $t$How many petals does a lily flower have?$t$,
  options_en  = $t$["3","4","5","6"]$t$::jsonb,
  context_en  = $t$Lily flowers have 6 petals (actually, 3 petals and 3 similar sepals), forming a hexapetalous calyx.$t$
where category = 'biologia' and question = $q$¿Cuántas pétalas tiene una flor de lirio?$q$;

update public.questions set
  question_en = $t$Which pigment gives venous blood its red color?$t$,
  options_en  = $t$["Bilirubin","Hemoglobin without O₂","Myoglobin","Carotenoid"]$t$::jsonb,
  context_en  = $t$Venous blood is darker because hemoglobin without oxygen (deoxyhemoglobin) is a darker red.$t$
where category = 'biologia' and question = $q$¿Qué pigmento da el color rojo a la sangre venosa?$q$;

update public.questions set
  question_en = $t$What is the structural unit of the kidney?$t$,
  options_en  = $t$["Glomerulus","Nephron","Tubule","Capsule"]$t$::jsonb,
  context_en  = $t$The nephron is the functional unit of the kidney. There are about 1 million nephrons per human kidney.$t$
where category = 'biologia' and question = $q$¿Cuál es la unidad estructural del riñón?$q$;

update public.questions set
  question_en = $t$What type of symmetry do jellyfish have?$t$,
  options_en  = $t$["Bilateral","Radial","Spherical","Asymmetric"]$t$::jsonb,
  context_en  = $t$Jellyfish have radial symmetry: their parts are distributed around a central axis.$t$
where category = 'biologia' and question = $q$¿Qué tipo de simetría tienen las medusas?$q$;

update public.questions set
  question_en = $t$What type of symmetry do humans have?$t$,
  options_en  = $t$["Radial","Bilateral","Spherical","Asymmetric"]$t$::jsonb,
  context_en  = $t$Humans (and most complex animals) have bilateral symmetry: the left side is a mirror image of the right.$t$
where category = 'biologia' and question = $q$¿Qué tipo de simetría tenemos los humanos?$q$;

update public.questions set
  question_en = $t$Which is the smallest bone in the human body?$t$,
  options_en  = $t$["Vomer","Stapes","Humerus","Hip bone"]$t$::jsonb,
  context_en  = $t$The stapes, in the middle ear, measures ~3 mm. It is the smallest bone in the human body.$t$
where category = 'biologia' and question = $q$¿Qué hueso del cuerpo humano es el más pequeño?$q$;

update public.questions set
  question_en = $t$Which bone forms the hip along with the ilium and the ischium?$t$,
  options_en  = $t$["Ulna","Pubis","Sternum","Vomer"]$t$::jsonb,
  context_en  = $t$The hip bone (coxal bone) is formed by the fusion of the ilium, ischium and pubis.$t$
where category = 'biologia' and question = $q$¿Qué hueso forma la cadera junto al ilion y el isquion?$q$;

update public.questions set
  question_en = $t$How many valves does the human heart have?$t$,
  options_en  = $t$["2","3","4","6"]$t$::jsonb,
  context_en  = $t$The heart has 4 valves: tricuspid, pulmonary, mitral and aortic. They prevent backflow between chambers and arteries.$t$
where category = 'biologia' and question = $q$¿Cuántas válvulas tiene el corazón humano?$q$;

update public.questions set
  question_en = $t$Which gland produces melatonin?$t$,
  options_en  = $t$["Pituitary","Pineal","Adrenal","Thyroid"]$t$::jsonb,
  context_en  = $t$The pineal gland (epiphysis) produces melatonin, a hormone that regulates the sleep-wake cycle.$t$
where category = 'biologia' and question = $q$¿Qué glándula produce melatonina?$q$;

update public.questions set
  question_en = $t$Which is the main inhibitory neurotransmitter of the CNS?$t$,
  options_en  = $t$["Dopamine","GABA","Acetylcholine","Glutamate"]$t$::jsonb,
  context_en  = $t$GABA (gamma-aminobutyric acid) is the main inhibitory neurotransmitter of the central nervous system.$t$
where category = 'biologia' and question = $q$¿Cuál es el principal neurotransmisor inhibidor del SNC?$q$;

update public.questions set
  question_en = $t$Which neurotransmitter is involved in Parkinson's?$t$,
  options_en  = $t$["Acetylcholine","Dopamine","Serotonin","Glutamate"]$t$::jsonb,
  context_en  = $t$Parkinson's is due to the degeneration of dopaminergic neurons in the substantia nigra of the brain.$t$
where category = 'biologia' and question = $q$¿Qué neurotransmisor está implicado en el Parkinson?$q$;

update public.questions set
  question_en = $t$Which virus causes chickenpox?$t$,
  options_en  = $t$["Herpes Zoster","Influenza","Adenovirus","Coronavirus"]$t$::jsonb,
  context_en  = $t$The varicella-zoster virus (VZV), a herpesvirus, causes chickenpox and, upon reactivation, shingles ('herpes zoster').$t$
where category = 'biologia' and question = $q$¿Qué virus causa la varicela?$q$;

update public.questions set
  question_en = $t$Which animal can live up to 200 years?$t$,
  options_en  = $t$["Galápagos giant tortoise","Parrot","Eagle","Tiger"]$t$::jsonb,
  context_en  = $t$The Galápagos giant tortoise can live more than 150-200 years. 'Lonesome George' died at about 100 years old in 2012.$t$
where category = 'biologia' and question = $q$¿Qué animal puede vivir hasta 200 años?$q$;

update public.questions set
  question_en = $t$Which 'immortal' animal can reverse its life cycle?$t$,
  options_en  = $t$["Hydra","The jellyfish Turritopsis dohrnii","Bacteria","Sponge"]$t$::jsonb,
  context_en  = $t$The jellyfish Turritopsis dohrnii can revert to a polyp state, making it biologically 'immortal'.$t$
where category = 'biologia' and question = $q$¿Qué animal "inmortal" puede revertir su ciclo vital?$q$;

update public.questions set
  question_en = $t$How many eggs does a queen bee lay per day approximately?$t$,
  options_en  = $t$["10","100","1,500","10,000"]$t$::jsonb,
  context_en  = $t$A queen bee lays about 1,500-2,000 eggs a day during the active season.$t$
where category = 'biologia' and question = $q$¿Cuántos huevos pone aproximadamente una reina de abejas al día?$q$;

update public.questions set
  question_en = $t$How many legs do crustaceans typically have?$t$,
  options_en  = $t$["6","8","10","12"]$t$::jsonb,
  context_en  = $t$Decapods (crustaceans like crabs, lobsters) have 10 legs (5 pairs).$t$
where category = 'biologia' and question = $q$¿Cuántas patas tienen los crustáceos típicamente?$q$;

update public.questions set
  question_en = $t$Which organ produces the hormones FSH and LH?$t$,
  options_en  = $t$["Pituitary","Pancreas","Adrenals","Thyroid"]$t$::jsonb,
  context_en  = $t$The anterior pituitary (adenohypophysis) produces the hormones FSH and LH, gonadotropins that regulate the reproductive system.$t$
where category = 'biologia' and question = $q$¿Qué órgano produce las hormonas FSH y LH?$q$;

update public.questions set
  question_en = $t$Which is the longest muscle in the human body?$t$,
  options_en  = $t$["Biceps","Sartorius","Rectus femoris","Gluteus"]$t$::jsonb,
  context_en  = $t$The sartorius, in the thigh, is the longest muscle in the human body. It measures about 50-60 cm.$t$
where category = 'biologia' and question = $q$¿Cuál es el músculo más largo del cuerpo humano?$q$;

update public.questions set
  question_en = $t$What type of animal is the snail?$t$,
  options_en  = $t$["Insect","Crustacean","Mollusk","Annelid"]$t$::jsonb,
  context_en  = $t$Snails are gastropod mollusks. They carry their coiled shell and move on a muscular foot.$t$
where category = 'biologia' and question = $q$¿Qué tipo de animal es el caracol?$q$;

update public.questions set
  question_en = $t$Which organ produces pulmonary surfactant?$t$,
  options_en  = $t$["Type II pneumocytes","Bronchi","Trachea","Diaphragm"]$t$::jsonb,
  context_en  = $t$Type II pneumocytes produce surfactant, a substance that reduces surface tension in the pulmonary alveoli.$t$
where category = 'biologia' and question = $q$¿Qué órgano produce el surfactante pulmonar?$q$;

update public.questions set
  question_en = $t$What defines a mammal?$t$,
  options_en  = $t$["Having hair and mammary glands","Flying","Living in water","Having eggs"]$t$::jsonb,
  context_en  = $t$Mammals are characterized by having hair and mammary glands to nurse their young. Most are viviparous.$t$
where category = 'biologia' and question = $q$¿Qué define a un mamífero?$q$;

update public.questions set
  question_en = $t$Which group of birds cannot fly?$t$,
  options_en  = $t$["Ratites (ostriches, etc.)","Eagles","Parrots","Vultures"]$t$::jsonb,
  context_en  = $t$Ratites include the ostrich, emu, rhea, kiwi and cassowary. All flightless.$t$
where category = 'biologia' and question = $q$¿Qué grupo de aves no puede volar?$q$;

update public.questions set
  question_en = $t$How many species of mammals are there approximately?$t$,
  options_en  = $t$["~1,000","~6,500","~20,000","~50,000"]$t$::jsonb,
  context_en  = $t$Approximately 6,500 species of living mammals have been described. Half are rodents.$t$
where category = 'biologia' and question = $q$¿Cuántas especies de mamíferos hay aproximadamente?$q$;

update public.questions set
  question_en = $t$How many species of birds are there approximately?$t$,
  options_en  = $t$["~3,000","~6,000","~11,000","~20,000"]$t$::jsonb,
  context_en  = $t$About 11,000 species of living birds are known in the world.$t$
where category = 'biologia' and question = $q$¿Cuántas especies de aves hay aproximadamente?$q$;

update public.questions set
  question_en = $t$Which animal is considered the most venomous in the world?$t$,
  options_en  = $t$["King cobra","Box jellyfish","Black mamba","Tarantula"]$t$::jsonb,
  context_en  = $t$The box jellyfish (Chironex fleckeri), an Australian jellyfish, is considered the most venomous animal. It can kill a human in minutes.$t$
where category = 'biologia' and question = $q$¿Qué animal se considera el más venenoso del mundo?$q$;

update public.questions set
  question_en = $t$What is the main function of sperm?$t$,
  options_en  = $t$["Defense","Fertilization of the egg","Hormone production","O₂ transport"]$t$::jsonb,
  context_en  = $t$Sperm are the male gametes. Their function is to fertilize the egg, contributing half of the genetic material.$t$
where category = 'biologia' and question = $q$¿Cuál es la principal función de los espermatozoides?$q$;

update public.questions set
  question_en = $t$Where does spermatogenesis take place?$t$,
  options_en  = $t$["Prostate","Testes","Epididymis","Seminal vesicle"]$t$::jsonb,
  context_en  = $t$Spermatogenesis occurs in the seminiferous tubules of the testes.$t$
where category = 'biologia' and question = $q$¿Dónde se produce la espermatogénesis?$q$;

update public.questions set
  question_en = $t$Where does human fertilization usually occur?$t$,
  options_en  = $t$["Vagina","Uterus","Fallopian tube","Ovary"]$t$::jsonb,
  context_en  = $t$Fertilization normally occurs in the Fallopian tube (tubal ampulla), after ovulation.$t$
where category = 'biologia' and question = $q$¿Dónde ocurre la fecundación humana habitualmente?$q$;

update public.questions set
  question_en = $t$How long does a human pregnancy last (weeks)?$t$,
  options_en  = $t$["30","36","40","45"]$t$::jsonb,
  context_en  = $t$A human pregnancy lasts approximately 40 weeks (~9 months) from the last menstrual period.$t$
where category = 'biologia' and question = $q$¿Cuánto dura un embarazo humano (semanas)?$q$;

update public.questions set
  question_en = $t$What type of animal is the frog?$t$,
  options_en  = $t$["Reptile","Amphibian","Mammal","Fish"]$t$::jsonb,
  context_en  = $t$Frogs are anuran amphibians. They spend part of their life in water (tadpoles) and part on land.$t$
where category = 'biologia' and question = $q$¿Qué tipo de animal es la rana?$q$;

update public.questions set
  question_en = $t$What type of reproduction do most amphibians have?$t$,
  options_en  = $t$["Viviparous","Oviparous","Ovoviviparous","Asexual"]$t$::jsonb,
  context_en  = $t$Most amphibians are oviparous: they lay eggs (usually in water) with external fertilization.$t$
where category = 'biologia' and question = $q$¿Qué tipo de reproducción tiene la mayoría de anfibios?$q$;

update public.questions set
  question_en = $t$Which is the largest land animal?$t$,
  options_en  = $t$["Hippopotamus","Rhinoceros","African elephant","Giraffe"]$t$::jsonb,
  context_en  = $t$The African savanna elephant is the largest land animal, with males that can weigh 6 tons.$t$
where category = 'biologia' and question = $q$¿Cuál es el animal terrestre más grande?$q$;

update public.questions set
  question_en = $t$Which is the tallest animal in the world?$t$,
  options_en  = $t$["Elephant","Giraffe","Camel","Ostrich"]$t$::jsonb,
  context_en  = $t$The giraffe can reach 5.5 m in height. Its neck has the same 7 cervical vertebrae as most mammals.$t$
where category = 'biologia' and question = $q$¿Cuál es el animal más alto del mundo?$q$;

update public.questions set
  question_en = $t$What type of leaves does a deciduous tree lose?$t$,
  options_en  = $t$["Only the flowers","All the leaves in autumn","The ones with fruit","The new ones"]$t$::jsonb,
  context_en  = $t$Deciduous trees lose all their leaves at the end of autumn and renew them in spring.$t$
where category = 'biologia' and question = $q$¿Qué tipo de hojas pierde un árbol caducifolio?$q$;

update public.questions set
  question_en = $t$Which type of tree keeps its leaves all year round?$t$,
  options_en  = $t$["Deciduous","Evergreen","Tropical conifers","Pteridophytes"]$t$::jsonb,
  context_en  = $t$Evergreen trees keep their leaves all year round, renewing them gradually.$t$
where category = 'biologia' and question = $q$¿Qué tipo de árbol mantiene sus hojas todo el año?$q$;

update public.questions set
  question_en = $t$Which process converts DNA into RNA?$t$,
  options_en  = $t$["Translation","Transcription","Replication","Mutation"]$t$::jsonb,
  context_en  = $t$Transcription is the process by which a strand of DNA is copied into messenger RNA (mRNA).$t$
where category = 'biologia' and question = $q$¿Qué proceso convierte el ADN en ARN?$q$;

update public.questions set
  question_en = $t$Which process converts mRNA into protein?$t$,
  options_en  = $t$["Transcription","Translation","Replication","Splicing"]$t$::jsonb,
  context_en  = $t$Translation is the process by which ribosomes read the mRNA and synthesize a chain of amino acids (a protein).$t$
where category = 'biologia' and question = $q$¿Qué proceso convierte el ARNm en proteína?$q$;

update public.questions set
  question_en = $t$How many essential amino acids exist for humans?$t$,
  options_en  = $t$["6","9","12","20"]$t$::jsonb,
  context_en  = $t$There are 9 essential amino acids for humans: they must be obtained from the diet. In total there are 20 proteinogenic amino acids.$t$
where category = 'biologia' and question = $q$¿Cuántos aminoácidos esenciales existen para los humanos?$q$;

update public.questions set
  question_en = $t$How many pairs of cranial nerves does a human have?$t$,
  options_en  = $t$["8","10","12","16"]$t$::jsonb,
  context_en  = $t$We have 12 pairs of cranial nerves (olfactory, optic, etc.), numbered with Roman numerals from I to XII.$t$
where category = 'biologia' and question = $q$¿Cuántos pares de nervios craneales tiene el ser humano?$q$;

update public.questions set
  question_en = $t$Which organ regulates body temperature?$t$,
  options_en  = $t$["Hypothalamus","Pituitary","Cerebellum","Medulla oblongata"]$t$::jsonb,
  context_en  = $t$The hypothalamus is the body's thermostat: it regulates body temperature and many other homeostatic functions.$t$
where category = 'biologia' and question = $q$¿Qué órgano regula la temperatura corporal?$q$;

update public.questions set
  question_en = $t$Which part of the brain coordinates movement?$t$,
  options_en  = $t$["Cerebellum","Hypothalamus","Thalamus","Medulla oblongata"]$t$::jsonb,
  context_en  = $t$The cerebellum coordinates movement, balance and posture. Its name means 'little brain'.$t$
where category = 'biologia' and question = $q$¿Qué parte del cerebro coordina el movimiento?$q$;

update public.questions set
  question_en = $t$How many neurons does the human brain have approximately?$t$,
  options_en  = $t$["1 billion","86 billion","100 billion","1 trillion"]$t$::jsonb,
  context_en  = $t$The human brain contains about 86 billion neurons. Each one can have thousands of connections (synapses).$t$
where category = 'biologia' and question = $q$¿Cuántas neuronas tiene aproximadamente el cerebro humano?$q$;

update public.questions set
  question_en = $t$Which hormone controls blood glucose levels when they drop?$t$,
  options_en  = $t$["Insulin","Glucagon","Cortisol","Adrenaline"]$t$::jsonb,
  context_en  = $t$Glucagon raises blood glucose by releasing glucose from the liver. It is antagonistic to insulin.$t$
where category = 'biologia' and question = $q$¿Qué hormona controla los niveles de glucosa en sangre cuando bajan?$q$;

update public.questions set
  question_en = $t$Which organ produces glucagon?$t$,
  options_en  = $t$["Liver","Pancreas","Adrenals","Thyroid"]$t$::jsonb,
  context_en  = $t$The pancreas (alpha cells of the islets of Langerhans) produces glucagon. The beta cells produce insulin.$t$
where category = 'biologia' and question = $q$¿Qué órgano produce el glucagón?$q$;

update public.questions set
  question_en = $t$What type of molecule is insulin?$t$,
  options_en  = $t$["Lipid","Protein","Carbohydrate","Vitamin"]$t$::jsonb,
  context_en  = $t$Insulin is a protein (a peptide hormone) of 51 amino acids produced by the beta cells of the pancreas.$t$
where category = 'biologia' and question = $q$¿Qué tipo de molécula es la insulina?$q$;

update public.questions set
  question_en = $t$Which cycle describes the flow of nitrogen between organisms and the environment?$t$,
  options_en  = $t$["The water cycle","The carbon cycle","The nitrogen cycle","The phosphorus cycle"]$t$::jsonb,
  context_en  = $t$The nitrogen cycle describes how this element passes through the atmosphere, soil, organisms and water through processes like fixation, nitrification and denitrification.$t$
where category = 'biologia' and question = $q$¿Qué ciclo describe el flujo de nitrógeno entre organismos y el ambiente?$q$;

update public.questions set
  question_en = $t$Which process allows bacteria to fix atmospheric nitrogen?$t$,
  options_en  = $t$["Photosynthesis","Biological fixation","Chemosynthesis","Fermentation"]$t$::jsonb,
  context_en  = $t$Some bacteria (like Rhizobium in legume roots) can fix atmospheric N₂, converting it into ammonia.$t$
where category = 'biologia' and question = $q$¿Qué proceso permite a las bacterias fijar nitrógeno atmosférico?$q$;

update public.questions set
  question_en = $t$What type of relationship is that of the rhinoceros and the cattle egret?$t$,
  options_en  = $t$["Parasitism","Mutualism","Commensalism","Competition"]$t$::jsonb,
  context_en  = $t$The cattle egret and the rhinoceros (or the buffalo) have mutualism: the egret eats the larger animal's parasites, benefiting both.$t$
where category = 'biologia' and question = $q$¿Qué tipo de relación es la del rinoceronte y la garcilla bueyera?$q$;

update public.questions set
  question_en = $t$What adaptation does the camel have for the desert?$t$,
  options_en  = $t$["A hump with fat","Long hair","Webbed feet","Gills"]$t$::jsonb,
  context_en  = $t$The camel's hump stores fat, which it metabolizes to obtain energy and water. Its feet are wide so as not to sink into the sand.$t$
where category = 'biologia' and question = $q$¿Qué adaptación tiene el camello para el desierto?$q$;

update public.questions set
  question_en = $t$Which organ produces antibodies?$t$,
  options_en  = $t$["Liver","Bone marrow","B lymphocytes","Pancreas"]$t$::jsonb,
  context_en  = $t$B lymphocytes (a type of white blood cell) produce antibodies when they differentiate into plasma cells.$t$
where category = 'biologia' and question = $q$¿Qué órgano produce los anticuerpos?$q$;

update public.questions set
  question_en = $t$Which cellular process produces energy in the absence of O₂?$t$,
  options_en  = $t$["Aerobic respiration","Fermentation","Photosynthesis","Glycolysis"]$t$::jsonb,
  context_en  = $t$Fermentation produces ATP in the absence of oxygen. There are several types: lactic, alcoholic, etc.$t$
where category = 'biologia' and question = $q$¿Qué proceso celular produce energía en ausencia de O₂?$q$;

update public.questions set
  question_en = $t$Which sex chromosomes do XX women have?$t$,
  options_en  = $t$["XX","XY","XO","X0"]$t$::jsonb,
  context_en  = $t$Women are typically XX (two X chromosomes). Men are XY.$t$
where category = 'biologia' and question = $q$¿Qué cromosoma sexual tienen las mujeres XY?$q$;

update public.questions set
  question_en = $t$How many pairs of spinal nerves does a human being have?$t$,
  options_en  = $t$["12","23","31","42"]$t$::jsonb,
  context_en  = $t$The human being has 31 pairs of spinal nerves that emerge from the spinal cord: 8 cervical, 12 thoracic, 5 lumbar, 5 sacral and 1 coccygeal.$t$
where category = 'biologia' and question = $q$¿Cuántos pares de nervios espinales tiene un ser humano?$q$;

update public.questions set
  question_en = $t$What is the cause of iron-deficiency anemia?$t$,
  options_en  = $t$["Lack of vitamin C","Lack of iron","Lack of protein","Lack of calcium"]$t$::jsonb,
  context_en  = $t$Iron-deficiency anemia is caused by a lack of iron, which is needed to synthesize hemoglobin.$t$
where category = 'biologia' and question = $q$¿Cuál es la causa de la anemia ferropénica?$q$;

update public.questions set
  question_en = $t$What effect does growth hormone (GH) have?$t$,
  options_en  = $t$["It stimulates growth","It reduces growth","It regulates blood glucose","It controls appetite"]$t$::jsonb,
  context_en  = $t$Growth hormone, produced by the pituitary, stimulates the growth of bones and tissues.$t$
where category = 'biologia' and question = $q$¿Qué efecto tiene la hormona del crecimiento (GH)?$q$;

update public.questions set
  question_en = $t$Which type of nerve tissue insulates axons?$t$,
  options_en  = $t$["Myelin sheath","Dendrite","Synapse","Astrocyte"]$t$::jsonb,
  context_en  = $t$The myelin sheath, formed by Schwann cells (peripheral system) or oligodendrocytes (central), insulates axons, speeding up transmission.$t$
where category = 'biologia' and question = $q$¿Qué tipo de tejido nervioso aísla los axones?$q$;

update public.questions set
  question_en = $t$Which animal has the highest number of teeth?$t$,
  options_en  = $t$["Shark","Snail","Crocodile","Elephant"]$t$::jsonb,
  context_en  = $t$Snails can have tens of thousands of microscopic teeth (the radula). It is the highest 'teeth' count in the animal kingdom.$t$
where category = 'biologia' and question = $q$¿Qué animal tiene mayor número de dientes?$q$;


-- ── cine (150) ──
update public.questions set
  question_en = $t$Who directed 'The Godfather' (1972)?$t$,
  options_en  = $t$["Scorsese","Coppola","Kubrick","Spielberg"]$t$::jsonb,
  context_en  = $t$Francis Ford Coppola directed 'The Godfather', based on Mario Puzo's novel. It won the Oscar for Best Picture.$t$
where category = 'cine' and question = $q$¿Quién dirigió "El Padrino" (1972)?$q$;

update public.questions set
  question_en = $t$Which film won the first Oscar for Best Picture?$t$,
  options_en  = $t$["Wings","Gone with the Wind","Casablanca","Ben-Hur"]$t$::jsonb,
  context_en  = $t$'Wings' (1927), by William A. Wellman, won in 1929. It is the only silent film to win the Oscar for Best Picture.$t$
where category = 'cine' and question = $q$¿Qué película ganó el primer Óscar a Mejor Película?$q$;

update public.questions set
  question_en = $t$Who starred in 'Forrest Gump'?$t$,
  options_en  = $t$["Tom Cruise","Tom Hanks","Brad Pitt","Kevin Costner"]$t$::jsonb,
  context_en  = $t$Tom Hanks starred in 'Forrest Gump' (1994), by Robert Zemeckis. The film won 6 Oscars, including Best Actor for Hanks.$t$
where category = 'cine' and question = $q$¿Quién protagonizó "Forrest Gump"?$q$;

update public.questions set
  question_en = $t$Who directed 'Pulp Fiction'?$t$,
  options_en  = $t$["Scorsese","Tarantino","Lynch","Soderbergh"]$t$::jsonb,
  context_en  = $t$Quentin Tarantino directed 'Pulp Fiction' (1994), which won the Palme d'Or and revitalized 1990s independent cinema.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Pulp Fiction"?$q$;

update public.questions set
  question_en = $t$In what year was the first 'Star Wars' released?$t$,
  options_en  = $t$["1975","1977","1979","1980"]$t$::jsonb,
  context_en  = $t$The first 'Star Wars' (A New Hope) was released in May 1977. It was directed by George Lucas.$t$
where category = 'cine' and question = $q$¿En qué año se estrenó la primera "Star Wars"?$q$;

update public.questions set
  question_en = $t$Who is the director of 'Titanic' (1997)?$t$,
  options_en  = $t$["Spielberg","Cameron","Zemeckis","Ridley Scott"]$t$::jsonb,
  context_en  = $t$James Cameron directed 'Titanic', which won 11 Oscars (a record, tied with Ben-Hur and The Return of the King).$t$
where category = 'cine' and question = $q$¿Quién es el director de "Titanic" (1997)?$q$;

update public.questions set
  question_en = $t$Which film has the line 'Hasta la vista, baby'?$t$,
  options_en  = $t$["Predator","Terminator 2","Rambo","Mad Max"]$t$::jsonb,
  context_en  = $t$'Hasta la vista, baby' is Schwarzenegger's line in 'Terminator 2: Judgment Day' (1991).$t$
where category = 'cine' and question = $q$¿Qué película tiene la frase "Sayonara, baby"?$q$;

update public.questions set
  question_en = $t$Who stars in the original Indiana Jones trilogy?$t$,
  options_en  = $t$["Harrison Ford","Sean Connery","Mel Gibson","Tom Selleck"]$t$::jsonb,
  context_en  = $t$Harrison Ford plays the archaeologist Indiana Jones in the saga directed by Steven Spielberg since 1981.$t$
where category = 'cine' and question = $q$¿Quién protagoniza la trilogía original de Indiana Jones?$q$;

update public.questions set
  question_en = $t$Which actress played Mia Wallace in 'Pulp Fiction'?$t$,
  options_en  = $t$["Uma Thurman","Jennifer Aniston","Bridget Fonda","Cameron Diaz"]$t$::jsonb,
  context_en  = $t$Uma Thurman played Mia Wallace in 'Pulp Fiction' (1994). She received an Oscar nomination for her role.$t$
where category = 'cine' and question = $q$¿Qué actriz interpretó a Mia Wallace en "Pulp Fiction"?$q$;

update public.questions set
  question_en = $t$Which film won the Oscar for Best Picture in 2020 (filmed in Korean)?$t$,
  options_en  = $t$["Joker","Roma","Parasite","1917"]$t$::jsonb,
  context_en  = $t$'Parasite' by Bong Joon-ho was the first non-English-language film to win the Oscar for Best Picture. It won 4 Oscars in total.$t$
where category = 'cine' and question = $q$¿Qué película ganó el Óscar a Mejor Película en 2020 (rodada en coreano)?$q$;

update public.questions set
  question_en = $t$Who directed 'The Shining' (1980)?$t$,
  options_en  = $t$["Hitchcock","Kubrick","Polanski","De Palma"]$t$::jsonb,
  context_en  = $t$Stanley Kubrick directed 'The Shining', based on Stephen King's novel. Jack Nicholson stars.$t$
where category = 'cine' and question = $q$¿Quién dirigió "El Resplandor" (1980)?$q$;

update public.questions set
  question_en = $t$Which series follows a chemistry teacher who makes methamphetamine?$t$,
  options_en  = $t$["The Wire","Breaking Bad","Better Call Saul","Ozark"]$t$::jsonb,
  context_en  = $t$'Breaking Bad' (2008-2013) tells of the transformation of Walter White, a chemistry teacher, into the drug lord Heisenberg.$t$
where category = 'cine' and question = $q$¿Qué serie sigue a un profesor de química que fabrica metanfetamina?$q$;

update public.questions set
  question_en = $t$Which saga includes characters like Frodo and Gandalf?$t$,
  options_en  = $t$["Narnia","Harry Potter","The Lord of the Rings","Game of Thrones"]$t$::jsonb,
  context_en  = $t$'The Lord of the Rings' by J.R.R. Tolkien was adapted by Peter Jackson in 2001-2003. It won 17 Oscars in total.$t$
where category = 'cine' and question = $q$¿Qué saga incluye personajes como Frodo y Gandalf?$q$;

update public.questions set
  question_en = $t$Which animator founded Pixar studio?$t$,
  options_en  = $t$["Walt Disney","John Lasseter","Hayao Miyazaki","Tim Burton"]$t$::jsonb,
  context_en  = $t$John Lasseter co-led Pixar after its purchase by Steve Jobs in 1986. Its first feature, 'Toy Story' (1995), was revolutionary.$t$
where category = 'cine' and question = $q$¿Qué animador fundó el estudio Pixar?$q$;

update public.questions set
  question_en = $t$Which actor played the Joker in 'The Dark Knight' (2008)?$t$,
  options_en  = $t$["Jack Nicholson","Heath Ledger","Joaquin Phoenix","Cesar Romero"]$t$::jsonb,
  context_en  = $t$Heath Ledger played the Joker in Christopher Nolan's 'The Dark Knight'. He won a posthumous Oscar for Best Supporting Actor.$t$
where category = 'cine' and question = $q$¿Qué actor interpretó al Joker en "El Caballero Oscuro" (2008)?$q$;

update public.questions set
  question_en = $t$In which film does Tom Hanks play a castaway on an island?$t$,
  options_en  = $t$["Forrest Gump","Cast Away","The Terminal","Big"]$t$::jsonb,
  context_en  = $t$'Cast Away' (2000) directed by Robert Zemeckis. Hanks talks to a ball named Wilson.$t$
where category = 'cine' and question = $q$¿En qué película Tom Hanks interpreta a un náufrago en una isla?$q$;

update public.questions set
  question_en = $t$Who directed 'Vertigo' and 'Psycho'?$t$,
  options_en  = $t$["Hitchcock","Lang","Welles","Wilder"]$t$::jsonb,
  context_en  = $t$Alfred Hitchcock, the 'master of suspense', directed 'Vertigo' (1958) and 'Psycho' (1960), among many other classics.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Vértigo" y "Psicosis"?$q$;

update public.questions set
  question_en = $t$Which HBO series is based on George R.R. Martin's books?$t$,
  options_en  = $t$["Vikings","Game of Thrones","Rome","Westworld"]$t$::jsonb,
  context_en  = $t$'Game of Thrones' (2011-2019) adapted 'A Song of Ice and Fire'. It is one of the most-watched series in history.$t$
where category = 'cine' and question = $q$¿Qué serie de HBO se basa en los libros de George R.R. Martin?$q$;

update public.questions set
  question_en = $t$Which actor stars in the 'Mission: Impossible' saga?$t$,
  options_en  = $t$["Brad Pitt","Tom Cruise","Matt Damon","Daniel Craig"]$t$::jsonb,
  context_en  = $t$Tom Cruise has played Ethan Hunt since 1996. He is famous for doing his own action scenes.$t$
where category = 'cine' and question = $q$¿Qué actor protagoniza la saga "Misión: Imposible"?$q$;

update public.questions set
  question_en = $t$Which Disney/Pixar film is about the emotions?$t$,
  options_en  = $t$["Up","Inside Out","Coco","Soul"]$t$::jsonb,
  context_en  = $t$'Inside Out' (2015) shows the emotions (Joy, Sadness, Anger, Fear, Disgust) inside the mind of a girl.$t$
where category = 'cine' and question = $q$¿Qué película de Disney/Pixar trata sobre las emociones?$q$;

update public.questions set
  question_en = $t$In what year was 'Avatar' released?$t$,
  options_en  = $t$["2007","2009","2011","2013"]$t$::jsonb,
  context_en  = $t$James Cameron's 'Avatar' was released in December 2009. It was the highest-grossing film until it was surpassed (and it later reclaimed the record).$t$
where category = 'cine' and question = $q$¿En qué año se estrenó "Avatar"?$q$;

update public.questions set
  question_en = $t$Who is the director of 'The Dark Knight' trilogy?$t$,
  options_en  = $t$["Tim Burton","Christopher Nolan","Zack Snyder","Sam Raimi"]$t$::jsonb,
  context_en  = $t$Christopher Nolan directed 'Batman Begins' (2005), 'The Dark Knight' (2008) and 'The Dark Knight Rises' (2012).$t$
where category = 'cine' and question = $q$¿Quién es el director de la trilogía "El Caballero Oscuro"?$q$;

update public.questions set
  question_en = $t$Which actor played Forrest Gump and Woody (in 'Toy Story')?$t$,
  options_en  = $t$["Tom Hanks","Tim Allen","Robin Williams","Jim Carrey"]$t$::jsonb,
  context_en  = $t$Tom Hanks voiced Woody in 'Toy Story' and played Forrest Gump in 1994.$t$
where category = 'cine' and question = $q$¿Qué actor interpretó a Forrest Gump y Woody (en "Toy Story")?$q$;

update public.questions set
  question_en = $t$Who composed the 'Star Wars' soundtrack?$t$,
  options_en  = $t$["Hans Zimmer","John Williams","Ennio Morricone","James Horner"]$t$::jsonb,
  context_en  = $t$John Williams composed the iconic scores for 'Star Wars', 'Indiana Jones', 'Jaws' and 'E.T.' He has 54 Oscar nominations.$t$
where category = 'cine' and question = $q$¿Quién compuso la banda sonora de "Star Wars"?$q$;

update public.questions set
  question_en = $t$Which film stars Russell Crowe as a gladiator?$t$,
  options_en  = $t$["Troy","Gladiator","Braveheart","300"]$t$::jsonb,
  context_en  = $t$'Gladiator' (Ridley Scott, 2000) won 5 Oscars including Best Picture and Best Actor for Crowe as Maximus Decimus Meridius.$t$
where category = 'cine' and question = $q$¿Qué película protagoniza Russell Crowe como gladiador?$q$;

update public.questions set
  question_en = $t$Which sci-fi saga includes Neo and the Matrix?$t$,
  options_en  = $t$["The Matrix","Inception","Blade Runner","Tron"]$t$::jsonb,
  context_en  = $t$'The Matrix' (1999) by the Wachowskis. Keanu Reeves plays Neo, 'the One' chosen to free humanity from the simulation.$t$
where category = 'cine' and question = $q$¿Qué saga de ciencia ficción incluye a Neo y la Matrix?$q$;

update public.questions set
  question_en = $t$Who directed 'La La Land'?$t$,
  options_en  = $t$["Damien Chazelle","David Fincher","Wes Anderson","Greta Gerwig"]$t$::jsonb,
  context_en  = $t$Damien Chazelle directed 'La La Land' (2016), winner of 6 Oscars including Best Director (the youngest to win it: 32 years old).$t$
where category = 'cine' and question = $q$¿Quién dirigió "La La Land"?$q$;

update public.questions set
  question_en = $t$Which actor stars in 'The Wolf of Wall Street'?$t$,
  options_en  = $t$["Leonardo DiCaprio","Brad Pitt","Christian Bale","Matthew McConaughey"]$t$::jsonb,
  context_en  = $t$Leonardo DiCaprio plays Jordan Belfort in 'The Wolf of Wall Street' (2013), directed by Martin Scorsese.$t$
where category = 'cine' and question = $q$¿Qué actor protagoniza "El Lobo de Wall Street"?$q$;

update public.questions set
  question_en = $t$On which island is 'Lost' filmed?$t$,
  options_en  = $t$["Maui","Oahu","Hawaii","Kauai"]$t$::jsonb,
  context_en  = $t$'Lost' (2004-2010) was filmed mainly on Oahu (Hawaii). Although the fictional island is unlocated.$t$
where category = 'cine' and question = $q$¿En qué isla se rueda "Lost"?$q$;

update public.questions set
  question_en = $t$Which 2001 Japanese animation won the Oscar?$t$,
  options_en  = $t$["My Neighbor Totoro","Spirited Away","Princess Mononoke","Akira"]$t$::jsonb,
  context_en  = $t$'Spirited Away' (Sen to Chihiro no Kamikakushi) by Hayao Miyazaki won the Oscar for Best Animated Feature in 2003.$t$
where category = 'cine' and question = $q$¿Qué animación japonesa de 2001 ganó el Óscar?$q$;

update public.questions set
  question_en = $t$Which Marvel saga ended with 'Endgame'?$t$,
  options_en  = $t$["The Infinity Saga","The Multiverse Saga","The Asgard Saga","The X-Men Saga"]$t$::jsonb,
  context_en  = $t$'Avengers: Endgame' (2019) closed the Infinity Saga (Phases 1-3) of the MCU. It is one of the highest-grossing films in history.$t$
where category = 'cine' and question = $q$¿Qué saga de Marvel terminó con "Endgame"?$q$;

update public.questions set
  question_en = $t$In which city does 'Casablanca' take place?$t$,
  options_en  = $t$["Tangier","Casablanca","Algiers","Cairo"]$t$::jsonb,
  context_en  = $t$'Casablanca' (1942) takes place in Morocco during World War II. Bogart and Bergman star.$t$
where category = 'cine' and question = $q$¿En qué ciudad transcurre "Casablanca"?$q$;

update public.questions set
  question_en = $t$Which film popularized the phrase 'May the Force be with you'?$t$,
  options_en  = $t$["Star Trek","Star Wars","Dune","Stargate"]$t$::jsonb,
  context_en  = $t$'May the Force be with you' is the iconic phrase from 'Star Wars' since 1977. May the 4th is the official day.$t$
where category = 'cine' and question = $q$¿Qué película popularizó la frase "May the Force be with you"?$q$;

update public.questions set
  question_en = $t$Who directed 'Inception' and 'Tenet'?$t$,
  options_en  = $t$["Denis Villeneuve","Christopher Nolan","Ridley Scott","David Fincher"]$t$::jsonb,
  context_en  = $t$Christopher Nolan directed 'Inception' (2010) and 'Tenet' (2020), both with non-linear plots and complex physics concepts.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Inception" y "Tenet"?$q$;

update public.questions set
  question_en = $t$Which actress won the Oscar for 'La La Land'?$t$,
  options_en  = $t$["Emma Watson","Emma Stone","Jennifer Lawrence","Natalie Portman"]$t$::jsonb,
  context_en  = $t$Emma Stone won the Oscar for Best Actress for 'La La Land' (2016). She would win another for 'Poor Things' (2024).$t$
where category = 'cine' and question = $q$¿Qué actriz ganó el Óscar por "La La Land"?$q$;

update public.questions set
  question_en = $t$Which actor plays James Bond in 'Casino Royale' (2006)?$t$,
  options_en  = $t$["Pierce Brosnan","Daniel Craig","Sean Connery","Timothy Dalton"]$t$::jsonb,
  context_en  = $t$Daniel Craig was Bond between 2006 ('Casino Royale') and 2021 ('No Time to Die'), reinventing the character.$t$
where category = 'cine' and question = $q$¿Qué actor interpreta a James Bond en "Casino Royale" (2006)?$q$;

update public.questions set
  question_en = $t$Which film documents the rise of Facebook?$t$,
  options_en  = $t$["The Social Network","Steve Jobs","The Founder","Snowden"]$t$::jsonb,
  context_en  = $t$'The Social Network' (David Fincher, 2010) dramatizes the founding of Facebook by Mark Zuckerberg. Screenplay by Aaron Sorkin.$t$
where category = 'cine' and question = $q$¿Qué película documenta el ascenso de Facebook?$q$;

update public.questions set
  question_en = $t$Which is Pixar's highest-grossing animated film?$t$,
  options_en  = $t$["Finding Nemo","Incredibles 2","Toy Story 4","Inside Out 2"]$t$::jsonb,
  context_en  = $t$'Inside Out 2' (2024) surpassed $1.7 billion grossed globally, becoming the highest-grossing animated film in history.$t$
where category = 'cine' and question = $q$¿Cuál es la película de animación más taquillera de Pixar?$q$;

update public.questions set
  question_en = $t$Who directed 'Fight Club' (1999)?$t$,
  options_en  = $t$["David Fincher","Christopher Nolan","Darren Aronofsky","Paul Thomas Anderson"]$t$::jsonb,
  context_en  = $t$David Fincher directed 'Fight Club', starring Brad Pitt and Edward Norton, an adaptation of Chuck Palahniuk's novel.$t$
where category = 'cine' and question = $q$¿Quién dirigió "El club de la pelea" (Fight Club, 1999)?$q$;

update public.questions set
  question_en = $t$Which Spanish series follows a group of robbers wearing Dalí masks?$t$,
  options_en  = $t$["Elite","Money Heist","Locked Up","Cable Girls"]$t$::jsonb,
  context_en  = $t$'Money Heist' (2017-2021) by Álex Pina became an international phenomenon on Netflix. The Professor leads the gang.$t$
where category = 'cine' and question = $q$¿Qué serie española sigue a un grupo de atracadores con caretas de Dalí?$q$;

update public.questions set
  question_en = $t$Which Spielberg film is about a T-Rex that escapes from a park?$t$,
  options_en  = $t$["E.T.","Jurassic Park","Jaws","War of the Worlds"]$t$::jsonb,
  context_en  = $t$'Jurassic Park' (1993) revolutionized visual effects with CGI. Based on Michael Crichton's novel.$t$
where category = 'cine' and question = $q$¿Qué película de Spielberg trata sobre un T-Rex que escapa de un parque?$q$;

update public.questions set
  question_en = $t$Who stars in Almodóvar's 'Volver' (2006)?$t$,
  options_en  = $t$["Carmen Maura","Penélope Cruz","Marisa Paredes","Victoria Abril"]$t$::jsonb,
  context_en  = $t$Penélope Cruz stars in 'Volver', for which she was nominated for an Oscar (the first Spanish actress nominated for Best Actress).$t$
where category = 'cine' and question = $q$¿Quién protagoniza "Volver" (2006) de Almodóvar?$q$;

update public.questions set
  question_en = $t$Which saga includes 'The Fellowship of the Ring' and 'The Two Towers'?$t$,
  options_en  = $t$["Harry Potter","Narnia","The Lord of the Rings","Game of Thrones"]$t$::jsonb,
  context_en  = $t$'The Lord of the Rings' are Tolkien's novels adapted by Peter Jackson in 2001-2003.$t$
where category = 'cine' and question = $q$¿Qué saga incluye "La comunidad del anillo" y "Las dos torres"?$q$;

update public.questions set
  question_en = $t$Which franchise has the most films released?$t$,
  options_en  = $t$["James Bond","Star Wars","Marvel","Harry Potter"]$t$::jsonb,
  context_en  = $t$James Bond has 25 official films since 'Dr. No' (1962). 7 actors have played the spy.$t$
where category = 'cine' and question = $q$¿Cuál es la franquicia con más películas estrenadas?$q$;

update public.questions set
  question_en = $t$Which actress plays Hermione in 'Harry Potter'?$t$,
  options_en  = $t$["Emma Stone","Emma Watson","Keira Knightley","Saoirse Ronan"]$t$::jsonb,
  context_en  = $t$Emma Watson played Hermione Granger in the 8 Harry Potter films (2001-2011).$t$
where category = 'cine' and question = $q$¿Qué actriz interpreta a Hermione en "Harry Potter"?$q$;

update public.questions set
  question_en = $t$Which series follows the Roy family around a media company?$t$,
  options_en  = $t$["Billions","Succession","Industry","The Morning Show"]$t$::jsonb,
  context_en  = $t$'Succession' (HBO, 2018-2023) created by Jesse Armstrong. It won 13 Emmys in its final season.$t$
where category = 'cine' and question = $q$¿Qué serie sigue a la familia Roy en torno a una empresa de medios?$q$;

update public.questions set
  question_en = $t$Which actor starred in 'As Good as It Gets' (1997)?$t$,
  options_en  = $t$["Robert De Niro","Jack Nicholson","Al Pacino","Dustin Hoffman"]$t$::jsonb,
  context_en  = $t$Jack Nicholson won the Oscar for Best Actor for 'As Good as It Gets', by James L. Brooks.$t$
where category = 'cine' and question = $q$¿Qué actor protagonizó "Mejor... imposible" (1997)?$q$;

update public.questions set
  question_en = $t$Which film was the first to win the Oscar for Best Animated Feature?$t$,
  options_en  = $t$["Toy Story","Shrek","The Little Mermaid","The Lion King"]$t$::jsonb,
  context_en  = $t$'Shrek' (DreamWorks, 2001) won the first Oscar for Best Animated Feature, a category created in 2002.$t$
where category = 'cine' and question = $q$¿Qué película fue la primera en ganar el Óscar a Mejor Película de Animación?$q$;

update public.questions set
  question_en = $t$In which saga does the character Tony Stark / Iron Man appear?$t$,
  options_en  = $t$["DC","Marvel","Image","Dark Horse"]$t$::jsonb,
  context_en  = $t$Tony Stark / Iron Man belongs to Marvel. Robert Downey Jr. played him in the MCU from 2008 to 2019.$t$
where category = 'cine' and question = $q$¿En qué saga aparece el personaje Tony Stark / Iron Man?$q$;

update public.questions set
  question_en = $t$Who directed 'Citizen Kane' (1941)?$t$,
  options_en  = $t$["Hitchcock","Welles","Kazan","Capra"]$t$::jsonb,
  context_en  = $t$Orson Welles directed, co-wrote and starred in 'Citizen Kane' at age 25. Considered one of the best films in history.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Ciudadano Kane" (1941)?$q$;

update public.questions set
  question_en = $t$Who is the director of '2001: A Space Odyssey' (1968)?$t$,
  options_en  = $t$["Kubrick","Spielberg","Scott","Lucas"]$t$::jsonb,
  context_en  = $t$Stanley Kubrick directed '2001: A Space Odyssey', an adaptation of Arthur C. Clarke's novel.$t$
where category = 'cine' and question = $q$¿Quién es el director de "2001: Una odisea del espacio" (1968)?$q$;

update public.questions set
  question_en = $t$Who directed 'A Clockwork Orange' (1971)?$t$,
  options_en  = $t$["Kubrick","Polanski","Coppola","Lucas"]$t$::jsonb,
  context_en  = $t$Stanley Kubrick adapted Anthony Burgess's novel in 'A Clockwork Orange'.$t$
where category = 'cine' and question = $q$¿Quién dirigió "La naranja mecánica" (1971)?$q$;

update public.questions set
  question_en = $t$Who directed 'Jaws' (1975)?$t$,
  options_en  = $t$["Lucas","Spielberg","Coppola","Scorsese"]$t$::jsonb,
  context_en  = $t$Steven Spielberg directed 'Jaws' in 1975, considered the first modern blockbuster.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Tiburón" (1975)?$q$;

update public.questions set
  question_en = $t$Who directed 'Taxi Driver' (1976)?$t$,
  options_en  = $t$["Scorsese","Coppola","Pakula","Cimino"]$t$::jsonb,
  context_en  = $t$Martin Scorsese directed 'Taxi Driver', starring Robert De Niro. Famous line: 'Are you talking to me?'.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Taxi Driver" (1976)?$q$;

update public.questions set
  question_en = $t$Who directed 'Raging Bull' (1980)?$t$,
  options_en  = $t$["Coppola","Scorsese","De Palma","Cimino"]$t$::jsonb,
  context_en  = $t$Martin Scorsese directed 'Raging Bull' about the boxer Jake LaMotta. Oscar for De Niro.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Toro salvaje" (1980)?$q$;

update public.questions set
  question_en = $t$Which Coppola film won the Oscar for Best Picture in 1972?$t$,
  options_en  = $t$["The Godfather","Apocalypse Now","The Conversation","The Godfather Part II"]$t$::jsonb,
  context_en  = $t$'The Godfather' (1972) won the Oscar for Best Picture, directed by Francis Ford Coppola.$t$
where category = 'cine' and question = $q$¿Qué película de Coppola ganó el Óscar a Mejor Película en 1972?$q$;

update public.questions set
  question_en = $t$Who directed 'Apocalypse Now' (1979)?$t$,
  options_en  = $t$["Coppola","Scorsese","Cimino","Lucas"]$t$::jsonb,
  context_en  = $t$Francis Ford Coppola directed 'Apocalypse Now', loosely based on Joseph Conrad's 'Heart of Darkness'.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Apocalypse Now" (1979)?$q$;

update public.questions set
  question_en = $t$Who is the director of 'Lawrence of Arabia' (1962)?$t$,
  options_en  = $t$["John Ford","David Lean","Lean","William Wyler"]$t$::jsonb,
  context_en  = $t$David Lean directed 'Lawrence of Arabia' (1962), 7 Oscars including Best Picture and Director.$t$
where category = 'cine' and question = $q$¿Quién es el director de "Lawrence de Arabia" (1962)?$q$;

update public.questions set
  question_en = $t$Who directed 'Doctor Zhivago' (1965)?$t$,
  options_en  = $t$["David Lean","Otto Preminger","Robert Wise","George Cukor"]$t$::jsonb,
  context_en  = $t$David Lean directed 'Doctor Zhivago', based on Boris Pasternak's novel. Soundtrack by Maurice Jarre.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Doctor Zhivago" (1965)?$q$;

update public.questions set
  question_en = $t$Who stars in 'Casablanca' (1942)?$t$,
  options_en  = $t$["Cary Grant","Humphrey Bogart","James Stewart","Gary Cooper"]$t$::jsonb,
  context_en  = $t$Humphrey Bogart and Ingrid Bergman starred in 'Casablanca' (1942), directed by Michael Curtiz.$t$
where category = 'cine' and question = $q$¿Quién protagoniza "Casablanca" (1942)?$q$;

update public.questions set
  question_en = $t$Who directed 'Gone with the Wind' (1939)?$t$,
  options_en  = $t$["Cukor","Fleming","Capra","Ford"]$t$::jsonb,
  context_en  = $t$Victor Fleming directed 'Gone with the Wind' (1939), although other directors also participated.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Lo que el viento se llevó" (1939)?$q$;

update public.questions set
  question_en = $t$Who starred in 'Gone with the Wind'?$t$,
  options_en  = $t$["Clark Gable and Vivien Leigh","Cary Grant and Judy Garland","Spencer Tracy and Bette Davis","James Cagney and Joan Crawford"]$t$::jsonb,
  context_en  = $t$Clark Gable as Rhett Butler and Vivien Leigh as Scarlett O'Hara starred in 'Gone with the Wind'.$t$
where category = 'cine' and question = $q$¿Quién protagonizó "Lo que el viento se llevó"?$q$;

update public.questions set
  question_en = $t$Who directed 'The Wizard of Oz' (1939)?$t$,
  options_en  = $t$["Fleming","Cukor","Curtiz","Walsh"]$t$::jsonb,
  context_en  = $t$Victor Fleming directed 'The Wizard of Oz' in 1939 (he also directed 'Gone with the Wind' that same year).$t$
where category = 'cine' and question = $q$¿Quién dirigió "El mago de Oz" (1939)?$q$;

update public.questions set
  question_en = $t$Who stars in 'Singin' in the Rain'?$t$,
  options_en  = $t$["Fred Astaire","Gene Kelly","Sammy Davis Jr.","Frank Sinatra"]$t$::jsonb,
  context_en  = $t$Gene Kelly starred in 'Singin' in the Rain' (1952), directed by Stanley Donen and Kelly himself.$t$
where category = 'cine' and question = $q$¿Quién protagoniza "Cantando bajo la lluvia"?$q$;

update public.questions set
  question_en = $t$Who directed '12 Angry Men' (1957)?$t$,
  options_en  = $t$["Sidney Lumet","Kazan","Mankiewicz","Wise"]$t$::jsonb,
  context_en  = $t$Sidney Lumet directed '12 Angry Men' in 1957. A courtroom drama shot almost entirely in one room.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Doce hombres sin piedad" (1957)?$q$;

update public.questions set
  question_en = $t$Which actor stars in 'To Catch a Thief' (1955)?$t$,
  options_en  = $t$["Cary Grant","James Stewart","Gregory Peck","Henry Fonda"]$t$::jsonb,
  context_en  = $t$Cary Grant and Grace Kelly starred in 'To Catch a Thief', directed by Alfred Hitchcock on the French Riviera.$t$
where category = 'cine' and question = $q$¿Qué actor protagoniza "Atrapa a un ladrón" (1955)?$q$;

update public.questions set
  question_en = $t$Who directed 'North by Northwest' (1959)?$t$,
  options_en  = $t$["Hitchcock","Wilder","Wyler","Reed"]$t$::jsonb,
  context_en  = $t$Alfred Hitchcock directed 'North by Northwest' (1959), starring Cary Grant. Famous crop-duster scene.$t$
where category = 'cine' and question = $q$¿Quién dirige "Con la muerte en los talones" (1959)?$q$;

update public.questions set
  question_en = $t$Who stars in 'Vertigo' (1958)?$t$,
  options_en  = $t$["Cary Grant","James Stewart","Gregory Peck","Kirk Douglas"]$t$::jsonb,
  context_en  = $t$James Stewart and Kim Novak starred in 'Vertigo' (1958), directed by Hitchcock.$t$
where category = 'cine' and question = $q$¿Quién protagoniza "Vértigo" (1958)?$q$;

update public.questions set
  question_en = $t$In which film does Norman Bates appear?$t$,
  options_en  = $t$["Psycho","The Birds","Vertigo","Rear Window"]$t$::jsonb,
  context_en  = $t$Norman Bates is the sinister motel owner in Hitchcock's 'Psycho' (1960), played by Anthony Perkins.$t$
where category = 'cine' and question = $q$¿En qué película aparece Norman Bates?$q$;

update public.questions set
  question_en = $t$Who directed 'Annie Hall' (1977)?$t$,
  options_en  = $t$["Allen","Coppola","Spielberg","Brooks"]$t$::jsonb,
  context_en  = $t$Woody Allen directed and starred in 'Annie Hall' (1977). Oscar for Best Picture and Director.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Annie Hall" (1977)?$q$;

update public.questions set
  question_en = $t$Who plays Ilsa in 'Casablanca'?$t$,
  options_en  = $t$["Bette Davis","Greta Garbo","Ingrid Bergman","Marlene Dietrich"]$t$::jsonb,
  context_en  = $t$Ingrid Bergman played Ilsa Lund in 'Casablanca' (1942) alongside Humphrey Bogart.$t$
where category = 'cine' and question = $q$¿Quién protagoniza "Casablanca" como Ilsa?$q$;

update public.questions set
  question_en = $t$Who directed 'The Lord of the Rings' trilogy?$t$,
  options_en  = $t$["George Lucas","Peter Jackson","Cameron","Spielberg"]$t$::jsonb,
  context_en  = $t$Peter Jackson directed 'The Lord of the Rings' trilogy (2001-2003), filmed entirely in New Zealand.$t$
where category = 'cine' and question = $q$¿Quién dirigió la trilogía "El Señor de los Anillos"?$q$;

update public.questions set
  question_en = $t$How many Oscars did 'The Lord of the Rings: The Return of the King' win?$t$,
  options_en  = $t$["8","10","11","12"]$t$::jsonb,
  context_en  = $t$'The Return of the King' (2003) won all 11 Oscars it was nominated for, an absolute record.$t$
where category = 'cine' and question = $q$¿Cuántos Óscars ganó "El Señor de los Anillos: El retorno del rey"?$q$;

update public.questions set
  question_en = $t$In what year was 'Titanic' released?$t$,
  options_en  = $t$["1995","1997","1999","2001"]$t$::jsonb,
  context_en  = $t$James Cameron's 'Titanic' was released in 1997. It won 11 Oscars and was the first to surpass $1 billion at the box office.$t$
where category = 'cine' and question = $q$¿En qué año se estrenó "Titanic"?$q$;

update public.questions set
  question_en = $t$Who stars in 'Titanic'?$t$,
  options_en  = $t$["DiCaprio and Winslet","Pitt and Roberts","Cruise and Pfeiffer","Hanks and Bullock"]$t$::jsonb,
  context_en  = $t$Leonardo DiCaprio (Jack) and Kate Winslet (Rose) starred in 'Titanic' (1997) by James Cameron.$t$
where category = 'cine' and question = $q$¿Quién protagoniza "Titanic"?$q$;

update public.questions set
  question_en = $t$Which is the highest-grossing film in history?$t$,
  options_en  = $t$["Titanic","Avatar","Avengers: Endgame","Star Wars VII"]$t$::jsonb,
  context_en  = $t$'Avatar' (2009) reclaimed the top spot after its re-release in China in 2021. Avatar: The Way of Water (2022) is also in the top.$t$
where category = 'cine' and question = $q$¿Cuál es la película más taquillera de la historia?$q$;

update public.questions set
  question_en = $t$Who directs 'Avatar'?$t$,
  options_en  = $t$["Spielberg","Cameron","Jackson","Zemeckis"]$t$::jsonb,
  context_en  = $t$James Cameron directed 'Avatar' (2009) and its sequel 'Avatar: The Way of Water' (2022).$t$
where category = 'cine' and question = $q$¿Quién dirige "Avatar"?$q$;

update public.questions set
  question_en = $t$Who directs 'Aliens' (1986)?$t$,
  options_en  = $t$["Ridley Scott","James Cameron","Spielberg","Cronenberg"]$t$::jsonb,
  context_en  = $t$James Cameron directed 'Aliens' (1986), a sequel to Ridley Scott's original 'Alien' (1979).$t$
where category = 'cine' and question = $q$¿Quién dirige "Aliens: el regreso" (1986)?$q$;

update public.questions set
  question_en = $t$Who directed 'Blade Runner' (1982)?$t$,
  options_en  = $t$["Scott","Cameron","Spielberg","Lucas"]$t$::jsonb,
  context_en  = $t$Ridley Scott directed 'Blade Runner' (1982), loosely based on Philip K. Dick's novel.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Blade Runner" (1982)?$q$;

update public.questions set
  question_en = $t$Who directed 'Gladiator' (2000)?$t$,
  options_en  = $t$["Cameron","Ridley Scott","Mendes","Howard"]$t$::jsonb,
  context_en  = $t$Ridley Scott directed 'Gladiator' (2000). Russell Crowe won the Best Actor Oscar for his role as Maximus.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Gladiator" (2000)?$q$;

update public.questions set
  question_en = $t$Who directed 'Ben-Hur' (1959)?$t$,
  options_en  = $t$["DeMille","William Wyler","Cecil B.","Wyler"]$t$::jsonb,
  context_en  = $t$William Wyler directed 'Ben-Hur' (1959), 11 Oscars (a record along with 'Titanic' and 'The Return of the King').$t$
where category = 'cine' and question = $q$¿Quién dirigió "Ben-Hur" (1959)?$q$;

update public.questions set
  question_en = $t$Who directed 'The Silence of the Lambs' (1991)?$t$,
  options_en  = $t$["Jonathan Demme","Coppola","Bigelow","Stone"]$t$::jsonb,
  context_en  = $t$Jonathan Demme directed 'The Silence of the Lambs'. Anthony Hopkins won the Oscar for Hannibal Lecter.$t$
where category = 'cine' and question = $q$¿Quién dirigió "El silencio de los corderos" (1991)?$q$;

update public.questions set
  question_en = $t$Which actor plays Hannibal Lecter?$t$,
  options_en  = $t$["Anthony Hopkins","De Niro","Pacino","Nicholson"]$t$::jsonb,
  context_en  = $t$Anthony Hopkins played Hannibal Lecter in 'The Silence of the Lambs' (1991) and its sequels.$t$
where category = 'cine' and question = $q$¿Qué actor interpreta a Hannibal Lecter?$q$;

update public.questions set
  question_en = $t$Who directed 'Forrest Gump' (1994)?$t$,
  options_en  = $t$["Spielberg","Zemeckis","Howard","Eastwood"]$t$::jsonb,
  context_en  = $t$Robert Zemeckis directed 'Forrest Gump' (1994). 6 Oscars including Best Picture.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Forrest Gump" (1994)?$q$;

update public.questions set
  question_en = $t$Which actor starred in 'Forrest Gump'?$t$,
  options_en  = $t$["Hanks","DiCaprio","Bullock","Pacino"]$t$::jsonb,
  context_en  = $t$Tom Hanks won the Oscar for Best Actor for 'Forrest Gump' (1994), his second consecutive Oscar (after 'Philadelphia').$t$
where category = 'cine' and question = $q$¿Qué actor protagonizó "Forrest Gump"?$q$;

update public.questions set
  question_en = $t$Who directed 'Pulp Fiction' (1994)?$t$,
  options_en  = $t$["Rodriguez","Tarantino","Lynch","Coen"]$t$::jsonb,
  context_en  = $t$Quentin Tarantino directed 'Pulp Fiction' (1994), Palme d'Or at Cannes and Oscar for Best Screenplay.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Pulp Fiction" (1994)?$q$;

update public.questions set
  question_en = $t$Who directed 'Reservoir Dogs' (1992)?$t$,
  options_en  = $t$["Tarantino","Soderbergh","Rodriguez","Spike Lee"]$t$::jsonb,
  context_en  = $t$Quentin Tarantino directed his debut 'Reservoir Dogs' in 1992.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Reservoir Dogs" (1992)?$q$;

update public.questions set
  question_en = $t$Who directed 'Kill Bill' (2003)?$t$,
  options_en  = $t$["Tarantino","Rodriguez","Wong Kar-wai","Yimou"]$t$::jsonb,
  context_en  = $t$Quentin Tarantino directed 'Kill Bill: Vol. 1' (2003) and 'Vol. 2' (2004), starring Uma Thurman.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Kill Bill" (2003)?$q$;

update public.questions set
  question_en = $t$Who directed 'Inglourious Basterds' (2009)?$t$,
  options_en  = $t$["Coppola","Tarantino","Stone","Burton"]$t$::jsonb,
  context_en  = $t$Quentin Tarantino directed 'Inglourious Basterds' (2009). Christoph Waltz won the Oscar as the Nazi Hans Landa.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Malditos bastardos" (2009)?$q$;

update public.questions set
  question_en = $t$Who directed 'Schindler's List' (1993)?$t$,
  options_en  = $t$["Lucas","Spielberg","Polanski","Lumet"]$t$::jsonb,
  context_en  = $t$Steven Spielberg directed 'Schindler's List' (1993). 7 Oscars, Spielberg's first for Director.$t$
where category = 'cine' and question = $q$¿Quién dirigió "La lista de Schindler" (1993)?$q$;

update public.questions set
  question_en = $t$Who directed 'Saving Private Ryan' (1998)?$t$,
  options_en  = $t$["Spielberg","Eastwood","Howard","Stone"]$t$::jsonb,
  context_en  = $t$Steven Spielberg directed 'Saving Private Ryan' (1998). Tom Hanks starred. 5 Oscars.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Salvar al soldado Ryan" (1998)?$q$;

update public.questions set
  question_en = $t$Which actress won the Oscar for 'Black Swan' (2010)?$t$,
  options_en  = $t$["Natalie Portman","Mila Kunis","Anne Hathaway","Reese Witherspoon"]$t$::jsonb,
  context_en  = $t$Natalie Portman won the Oscar for Best Actress for her role as Nina in Aronofsky's 'Black Swan' (2010).$t$
where category = 'cine' and question = $q$¿Qué actriz ganó el Óscar por "Black Swan" (2010)?$q$;

update public.questions set
  question_en = $t$Who directed 'Black Swan' (2010)?$t$,
  options_en  = $t$["Aronofsky","Nolan","Anderson","Mendes"]$t$::jsonb,
  context_en  = $t$Darren Aronofsky directed 'Black Swan' (2010), starring Natalie Portman.$t$
where category = 'cine' and question = $q$¿Quién dirigió "El cisne negro" (2010)?$q$;

update public.questions set
  question_en = $t$Who directed 'Inception' (2010)?$t$,
  options_en  = $t$["Aronofsky","Nolan","Fincher","Cuarón"]$t$::jsonb,
  context_en  = $t$Christopher Nolan directed 'Inception' in 2010. Starring Leonardo DiCaprio.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Origen" (2010)?$q$;

update public.questions set
  question_en = $t$Who directed 'Interstellar' (2014)?$t$,
  options_en  = $t$["Cuarón","Nolan","Villeneuve","Mendes"]$t$::jsonb,
  context_en  = $t$Christopher Nolan directed 'Interstellar' (2014). Soundtrack by Hans Zimmer. Scientific advice by Kip Thorne.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Interstellar" (2014)?$q$;

update public.questions set
  question_en = $t$Who directed 'Dunkirk' (2017)?$t$,
  options_en  = $t$["Mendes","Nolan","Spielberg","Boyle"]$t$::jsonb,
  context_en  = $t$Christopher Nolan directed 'Dunkirk' (2017) about the evacuation of Dunkirk in 1940.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Dunkerque" (2017)?$q$;

update public.questions set
  question_en = $t$Who directed 'Oppenheimer' (2023)?$t$,
  options_en  = $t$["Spielberg","Nolan","Villeneuve","Anderson"]$t$::jsonb,
  context_en  = $t$Christopher Nolan directed 'Oppenheimer' (2023). It won 7 Oscars including Best Picture and Director.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Oppenheimer" (2023)?$q$;

update public.questions set
  question_en = $t$Who stars in 'Oppenheimer'?$t$,
  options_en  = $t$["Robert Downey Jr.","Cillian Murphy","Tom Hardy","Christian Bale"]$t$::jsonb,
  context_en  = $t$Cillian Murphy played J. Robert Oppenheimer and won the Oscar for Best Actor.$t$
where category = 'cine' and question = $q$¿Quién protagoniza "Oppenheimer"?$q$;

update public.questions set
  question_en = $t$Who directed 'The Shape of Water' (2017)?$t$,
  options_en  = $t$["Cuarón","Iñárritu","Del Toro","Aronofsky"]$t$::jsonb,
  context_en  = $t$Guillermo del Toro directed 'The Shape of Water' (2017). It won 4 Oscars including Best Picture and Director.$t$
where category = 'cine' and question = $q$¿Quién dirigió "La forma del agua" (2017)?$q$;

update public.questions set
  question_en = $t$Who directed 'Birdman' (2014)?$t$,
  options_en  = $t$["González Iñárritu","Cuarón","Del Toro","Reygadas"]$t$::jsonb,
  context_en  = $t$Alejandro González Iñárritu directed 'Birdman' (2014). Oscar for Best Picture and Director.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Birdman" (2014)?$q$;

update public.questions set
  question_en = $t$Who directed 'Gravity' (2013)?$t$,
  options_en  = $t$["Cuarón","Iñárritu","Anderson","Villeneuve"]$t$::jsonb,
  context_en  = $t$Alfonso Cuarón directed 'Gravity' (2013). Oscar for Best Director.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Gravity" (2013)?$q$;

update public.questions set
  question_en = $t$Who directed 'Roma' (2018)?$t$,
  options_en  = $t$["Cuarón","Iñárritu","Del Toro","Reygadas"]$t$::jsonb,
  context_en  = $t$Alfonso Cuarón directed 'Roma' (2018), filmed in black and white. Three Oscars, including Best Director and Foreign Language Film.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Roma" (2018)?$q$;

update public.questions set
  question_en = $t$Who directed 'Parasite' (2019)?$t$,
  options_en  = $t$["Bong Joon-ho","Park Chan-wook","Kim Ki-duk","Hou Hsiao-hsien"]$t$::jsonb,
  context_en  = $t$Bong Joon-ho directed 'Parasite' (2019). The first non-English-language film to win Best Picture at the Oscars.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Parasitos" (Parasite, 2019)?$q$;

update public.questions set
  question_en = $t$How many Oscars did 'Parasite' win in 2020?$t$,
  options_en  = $t$["2","3","4","5"]$t$::jsonb,
  context_en  = $t$'Parasite' won 4 Oscars: Picture, Director, Original Screenplay and International Feature Film.$t$
where category = 'cine' and question = $q$¿Cuántos Óscars ganó "Parasitos" en 2020?$q$;

update public.questions set
  question_en = $t$Who stars in 'Mad Max: Fury Road' (2015) as Furiosa?$t$,
  options_en  = $t$["Charlize Theron","Cate Blanchett","Tilda Swinton","Nicole Kidman"]$t$::jsonb,
  context_en  = $t$Charlize Theron played Imperator Furiosa in George Miller's 'Mad Max: Fury Road' (2015).$t$
where category = 'cine' and question = $q$¿Quién protagoniza "Mad Max: Fury Road" (2015) como Furiosa?$q$;

update public.questions set
  question_en = $t$Who directed 'Mad Max: Fury Road'?$t$,
  options_en  = $t$["George Miller","Cameron","Nolan","Villeneuve"]$t$::jsonb,
  context_en  = $t$George Miller directed 'Mad Max: Fury Road' in 2015, returning to the saga 30 years later.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Mad Max: Fury Road"?$q$;

update public.questions set
  question_en = $t$Who directed 'Dune' (2021)?$t$,
  options_en  = $t$["Lynch","Villeneuve","Nolan","Cuarón"]$t$::jsonb,
  context_en  = $t$Denis Villeneuve directed 'Dune' (2021) and 'Dune: Part Two' (2024). Adaptations of Frank Herbert's novel.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Dune" (2021)?$q$;

update public.questions set
  question_en = $t$Who stars in the new 'Dune' as Paul Atreides?$t$,
  options_en  = $t$["Timothée Chalamet","Zendaya","Anya Taylor-Joy","Cillian Murphy"]$t$::jsonb,
  context_en  = $t$Timothée Chalamet plays Paul Atreides in 'Dune' (2021) and 'Dune: Part Two' (2024).$t$
where category = 'cine' and question = $q$¿Quién protagoniza la nueva "Dune" como Paul Atreides?$q$;

update public.questions set
  question_en = $t$Who directed 'Blade Runner 2049' (2017)?$t$,
  options_en  = $t$["Scott","Villeneuve","Nolan","Cuarón"]$t$::jsonb,
  context_en  = $t$Denis Villeneuve directed 'Blade Runner 2049' (2017), a sequel to Ridley Scott's classic.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Blade Runner 2049" (2017)?$q$;

update public.questions set
  question_en = $t$Who directed 'Memento' (2000)?$t$,
  options_en  = $t$["Aronofsky","Nolan","Fincher","Tarantino"]$t$::jsonb,
  context_en  = $t$Christopher Nolan directed 'Memento' (2000), his second feature, told in reverse chronological order.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Memento" (2000)?$q$;

update public.questions set
  question_en = $t$Who directed 'Seven' (1995) and 'Fight Club' (1999)?$t$,
  options_en  = $t$["Mendes","Fincher","Singer","Schumacher"]$t$::jsonb,
  context_en  = $t$David Fincher directed both films, as well as 'Zodiac' (2007) and 'The Social Network' (2010).$t$
where category = 'cine' and question = $q$¿Quién dirigió "Seven" (1995) y "El club de la lucha" (1999)?$q$;

update public.questions set
  question_en = $t$Who directed 'The Social Network' (2010)?$t$,
  options_en  = $t$["Fincher","Sorkin","Mendes","Nolan"]$t$::jsonb,
  context_en  = $t$David Fincher directed 'The Social Network' (2010), screenplay by Aaron Sorkin. About the origins of Facebook.$t$
where category = 'cine' and question = $q$¿Quién dirigió "La red social" (2010)?$q$;

update public.questions set
  question_en = $t$Who stars in 'Good Will Hunting' (1997)?$t$,
  options_en  = $t$["Damon and Affleck","Pitt and Norton","Crowe and Pacino","Penn and Roberts"]$t$::jsonb,
  context_en  = $t$Matt Damon and Ben Affleck starred in and co-wrote 'Good Will Hunting' (1997), for which they won the Oscar for the screenplay.$t$
where category = 'cine' and question = $q$¿Quién protagoniza "El indomable Will Hunting" (1997)?$q$;

update public.questions set
  question_en = $t$Who directed 'Brokeback Mountain' (2005)?$t$,
  options_en  = $t$["Ang Lee","Eastwood","Reitman","Howard"]$t$::jsonb,
  context_en  = $t$Ang Lee directed 'Brokeback Mountain' (2005). Oscar for Best Director.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Brokeback Mountain" (2005)?$q$;

update public.questions set
  question_en = $t$Who directed 'Crouching Tiger, Hidden Dragon' (2000)?$t$,
  options_en  = $t$["Wong Kar-wai","Ang Lee","Zhang Yimou","Chen Kaige"]$t$::jsonb,
  context_en  = $t$Ang Lee directed 'Crouching Tiger, Hidden Dragon' (2000), 4 Oscars including Foreign Language Film.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Tigre y dragón" (2000)?$q$;

update public.questions set
  question_en = $t$Who stars in 'Fight Club' (1999)?$t$,
  options_en  = $t$["Pitt and Norton","Damon and Affleck","Cruise and De Niro","Pacino and De Niro"]$t$::jsonb,
  context_en  = $t$Brad Pitt and Edward Norton starred in David Fincher's 'Fight Club' (1999).$t$
where category = 'cine' and question = $q$¿Quién protagoniza "El club de la lucha" (1999)?$q$;

update public.questions set
  question_en = $t$Who stars in 'The Matrix' (1999) as Neo?$t$,
  options_en  = $t$["Keanu Reeves","Brad Pitt","Tom Cruise","Will Smith"]$t$::jsonb,
  context_en  = $t$Keanu Reeves played Neo in 'The Matrix' (1999) and its sequels, directed by the Wachowski sisters.$t$
where category = 'cine' and question = $q$¿Quién protagoniza "Matrix" (1999) como Neo?$q$;

update public.questions set
  question_en = $t$Who directed 'The Matrix' saga?$t$,
  options_en  = $t$["Cameron","Wachowski","Nolan","Spielberg"]$t$::jsonb,
  context_en  = $t$The sisters Lana and Lilly Wachowski directed the entire 'Matrix' saga (1999-2003 + Resurrections in 2021).$t$
where category = 'cine' and question = $q$¿Quién dirigió la saga "Matrix"?$q$;

update public.questions set
  question_en = $t$Who directed 'Edward Scissorhands' (1990)?$t$,
  options_en  = $t$["Burton","Lynch","Coppola","Sonnenfeld"]$t$::jsonb,
  context_en  = $t$Tim Burton directed 'Edward Scissorhands' (1990), starring Johnny Depp.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Eduardo Manostijeras" (1990)?$q$;

update public.questions set
  question_en = $t$Who directed 'The Nightmare Before Christmas'?$t$,
  options_en  = $t$["Selick","Burton","Lasseter","Linklater"]$t$::jsonb,
  context_en  = $t$Henry Selick directed 'The Nightmare Before Christmas' (1993), produced by Tim Burton (to whom it is often attributed).$t$
where category = 'cine' and question = $q$¿Quién dirigió "Pesadilla antes de Navidad"?$q$;

update public.questions set
  question_en = $t$Which actor stars in 'Pirates of the Caribbean'?$t$,
  options_en  = $t$["Brad Pitt","Johnny Depp","Bloom","Cruise"]$t$::jsonb,
  context_en  = $t$Johnny Depp played Captain Jack Sparrow in the 'Pirates of the Caribbean' saga (2003-2017).$t$
where category = 'cine' and question = $q$¿Qué actor protagoniza "Piratas del Caribe"?$q$;

update public.questions set
  question_en = $t$Who directed 'Volver' (2006)?$t$,
  options_en  = $t$["Almodóvar","Amenábar","Bayona","Garci"]$t$::jsonb,
  context_en  = $t$Pedro Almodóvar directed 'Volver' (2006), with Penélope Cruz as the lead.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Volver" (2006)?$q$;

update public.questions set
  question_en = $t$Who directs 'All About My Mother' (1999)?$t$,
  options_en  = $t$["Almodóvar","Trueba","Amenábar","Bollaín"]$t$::jsonb,
  context_en  = $t$Pedro Almodóvar directed 'All About My Mother' (1999), Oscar for Best Foreign Language Film.$t$
where category = 'cine' and question = $q$¿Quién dirige "Todo sobre mi madre" (1999)?$q$;

update public.questions set
  question_en = $t$Who directs 'The Sea Inside' (2004)?$t$,
  options_en  = $t$["Amenábar","Almodóvar","Bayona","Trueba"]$t$::jsonb,
  context_en  = $t$Alejandro Amenábar directed 'The Sea Inside' (2004), based on the story of Ramón Sampedro. Oscar for Best Foreign Language Film.$t$
where category = 'cine' and question = $q$¿Quién dirige "Mar adentro" (2004)?$q$;

update public.questions set
  question_en = $t$Which actor stars in 'The Sea Inside'?$t$,
  options_en  = $t$["Bardem","Banderas","Cruz","Pedro Almodóvar"]$t$::jsonb,
  context_en  = $t$Javier Bardem played Ramón Sampedro in 'The Sea Inside' (2004).$t$
where category = 'cine' and question = $q$¿Qué actor protagoniza "Mar adentro"?$q$;

update public.questions set
  question_en = $t$Who directed 'The Others' (2001)?$t$,
  options_en  = $t$["Amenábar","Bayona","Almodóvar","Iglesia"]$t$::jsonb,
  context_en  = $t$Alejandro Amenábar directed 'The Others' (2001), starring Nicole Kidman.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Los otros" (2001)?$q$;

update public.questions set
  question_en = $t$Who directs 'Pan's Labyrinth' (2006)?$t$,
  options_en  = $t$["Del Toro","Cuarón","Iñárritu","Reygadas"]$t$::jsonb,
  context_en  = $t$Guillermo del Toro directed 'Pan's Labyrinth' (2006). 3 technical Oscars.$t$
where category = 'cine' and question = $q$¿Quién dirige "El laberinto del fauno" (2006)?$q$;

update public.questions set
  question_en = $t$Who directed 'The Secret in Their Eyes' (2009)?$t$,
  options_en  = $t$["Campanella","Bielinsky","Aristarain","Sorín"]$t$::jsonb,
  context_en  = $t$Juan José Campanella directed 'The Secret in Their Eyes' (2009). Oscar for Best Foreign Language Film (Argentina).$t$
where category = 'cine' and question = $q$¿Quién dirigió "El secreto de sus ojos" (2009)?$q$;

update public.questions set
  question_en = $t$Who directed 'Amélie' (2001)?$t$,
  options_en  = $t$["Jean-Pierre Jeunet","Truffaut","Godard","Tavernier"]$t$::jsonb,
  context_en  = $t$Jean-Pierre Jeunet directed 'Le Fabuleux Destin d'Amélie Poulain' (2001).$t$
where category = 'cine' and question = $q$¿Quién dirigió "Amélie" (2001)?$q$;

update public.questions set
  question_en = $t$Who directed 'Life Is Beautiful' (1997)?$t$,
  options_en  = $t$["Tornatore","Benigni","Bertolucci","Sorrentino"]$t$::jsonb,
  context_en  = $t$Roberto Benigni directed and starred in 'La vita è bella' (1997). 3 Oscars, including Best Actor for Benigni.$t$
where category = 'cine' and question = $q$¿Quién dirigió "La vida es bella" (1997)?$q$;

update public.questions set
  question_en = $t$Who directs 'Cinema Paradiso' (1988)?$t$,
  options_en  = $t$["Tornatore","Bertolucci","Fellini","Benigni"]$t$::jsonb,
  context_en  = $t$Giuseppe Tornatore directed 'Cinema Paradiso' (1988). Oscar for Best Foreign Language Film.$t$
where category = 'cine' and question = $q$¿Quién dirige "Cinema Paradiso" (1988)?$q$;

update public.questions set
  question_en = $t$Who directed 'Bicycle Thieves' (1948)?$t$,
  options_en  = $t$["Rossellini","De Sica","Visconti","Fellini"]$t$::jsonb,
  context_en  = $t$Vittorio De Sica directed 'Bicycle Thieves' (1948), a classic of Italian neorealism.$t$
where category = 'cine' and question = $q$¿Quién dirigió "Ladrón de bicicletas" (1948)?$q$;

update public.questions set
  question_en = $t$Who directs 'La Dolce Vita' (1960)?$t$,
  options_en  = $t$["Fellini","Visconti","Antonioni","Rossellini"]$t$::jsonb,
  context_en  = $t$Federico Fellini directed 'La Dolce Vita' (1960), starring Marcello Mastroianni and Anita Ekberg.$t$
where category = 'cine' and question = $q$¿Quién dirige "La dolce vita" (1960)?$q$;

update public.questions set
  question_en = $t$Who directs 'The Seventh Seal' (1957)?$t$,
  options_en  = $t$["Bergman","Dreyer","Kurosawa","Antonioni"]$t$::jsonb,
  context_en  = $t$Ingmar Bergman directed 'The Seventh Seal' (1957), with the famous scene of the chess game with Death.$t$
where category = 'cine' and question = $q$¿Quién dirige "El séptimo sello" (1957)?$q$;

update public.questions set
  question_en = $t$Who directs 'Seven Samurai' (1954)?$t$,
  options_en  = $t$["Mizoguchi","Kurosawa","Ozu","Oshima"]$t$::jsonb,
  context_en  = $t$Akira Kurosawa directed 'Seven Samurai' (Shichinin no Samurai, 1954). It inspired 'The Magnificent Seven' (1960).$t$
where category = 'cine' and question = $q$¿Quién dirige "Los siete samuráis" (1954)?$q$;

update public.questions set
  question_en = $t$Who directs 'Rashomon' (1950)?$t$,
  options_en  = $t$["Ozu","Kurosawa","Mizoguchi","Naruse"]$t$::jsonb,
  context_en  = $t$Akira Kurosawa directed 'Rashomon' (1950). Golden Lion in Venice and Honorary Oscar. The same event told from different points of view.$t$
where category = 'cine' and question = $q$¿Quién dirige "Rashōmon" (1950)?$q$;

update public.questions set
  question_en = $t$Who is the creator of Studio Ghibli?$t$,
  options_en  = $t$["Miyazaki","Takahata","Anno","Otomo"]$t$::jsonb,
  context_en  = $t$Hayao Miyazaki founded Studio Ghibli in 1985 along with Isao Takahata and Toshio Suzuki.$t$
where category = 'cine' and question = $q$¿Quién es el creador del Studio Ghibli?$q$;

update public.questions set
  question_en = $t$Which Miyazaki film won the Oscar in 2003?$t$,
  options_en  = $t$["Princess Mononoke","Spirited Away","My Neighbor Totoro","Princess Mononoke"]$t$::jsonb,
  context_en  = $t$'Spirited Away' (2001) by Hayao Miyazaki won the Oscar for Best Animated Feature in 2003.$t$
where category = 'cine' and question = $q$¿Qué película de Miyazaki ganó el Óscar en 2003?$q$;

update public.questions set
  question_en = $t$Which Miyazaki film won the Oscar in 2024?$t$,
  options_en  = $t$["The Wind Rises","The Boy and the Heron","Ponyo","Howl's Moving Castle"]$t$::jsonb,
  context_en  = $t$'The Boy and the Heron' (2023) by Hayao Miyazaki won the Oscar for Best Animated Feature in 2024.$t$
where category = 'cine' and question = $q$¿Qué película de Miyazaki ganó el Óscar en 2024?$q$;

update public.questions set
  question_en = $t$Who directs 'Persepolis' (2007)?$t$,
  options_en  = $t$["Satrapi and Paronnaud","Sylvain Chomet","Plympton","Otomo"]$t$::jsonb,
  context_en  = $t$Marjane Satrapi and Vincent Paronnaud co-directed 'Persepolis' (2007), based on Satrapi's autobiographical graphic novel.$t$
where category = 'cine' and question = $q$¿Quién dirige "Persépolis" (2007)?$q$;

update public.questions set
  question_en = $t$Which is Disney/Pixar's highest-grossing film?$t$,
  options_en  = $t$["Coco","Toy Story 3","Finding Nemo","Incredibles 2"]$t$::jsonb,
  context_en  = $t$'Incredibles 2' (2018) is Pixar's highest-grossing film, surpassing $1.2 billion.$t$
where category = 'cine' and question = $q$¿Cuál es la película más taquillera de Disney/Pixar?$q$;

update public.questions set
  question_en = $t$Who directs 'Toy Story' (1995)?$t$,
  options_en  = $t$["Lasseter","Stanton","Docter","Anderson"]$t$::jsonb,
  context_en  = $t$John Lasseter directed 'Toy Story' (1995), Pixar's first feature and a milestone in digital animation.$t$
where category = 'cine' and question = $q$¿Quién dirige "Toy Story" (1995)?$q$;

update public.questions set
  question_en = $t$Who directs 'WALL-E' (2008)?$t$,
  options_en  = $t$["Stanton","Lasseter","Docter","Bird"]$t$::jsonb,
  context_en  = $t$Andrew Stanton directed 'WALL-E' (2008), winner of the Oscar for Best Animated Feature.$t$
where category = 'cine' and question = $q$¿Quién dirige "WALL-E" (2008)?$q$;

update public.questions set
  question_en = $t$Who directs 'Up' (2009)?$t$,
  options_en  = $t$["Stanton","Lasseter","Docter","Bird"]$t$::jsonb,
  context_en  = $t$Pete Docter directed 'Up' (2009) and 'Inside Out' (2015), among other Pixar films.$t$
where category = 'cine' and question = $q$¿Quién dirige "Up" (2009)?$q$;

update public.questions set
  question_en = $t$Who stars in 'The Godfather'?$t$,
  options_en  = $t$["De Niro","Brando","Pacino","Brando and Pacino"]$t$::jsonb,
  context_en  = $t$Marlon Brando played Vito Corleone and Al Pacino his son Michael in 'The Godfather' (1972).$t$
where category = 'cine' and question = $q$¿Quién protagoniza "El padrino"?$q$;

update public.questions set
  question_en = $t$Who plays a young Vito Corleone in 'The Godfather Part II'?$t$,
  options_en  = $t$["Brando","De Niro","Pacino","Caan"]$t$::jsonb,
  context_en  = $t$Robert De Niro played the young Vito Corleone in 'The Godfather Part II' (1974) and won the Oscar for Best Supporting Actor.$t$
where category = 'cine' and question = $q$¿Quién interpreta a Vito Corleone joven en "El padrino II"?$q$;

update public.questions set
  question_en = $t$Who directs 'Goodfellas' (1990)?$t$,
  options_en  = $t$["Scorsese","Coppola","De Palma","Cassavetes"]$t$::jsonb,
  context_en  = $t$Martin Scorsese directed 'Goodfellas' (1990).$t$
where category = 'cine' and question = $q$¿Quién dirige "Buenos muchachos" (1990)?$q$;

update public.questions set
  question_en = $t$Who directs 'Casino' (1995)?$t$,
  options_en  = $t$["Coppola","Scorsese","Levinson","Lumet"]$t$::jsonb,
  context_en  = $t$Martin Scorsese directed 'Casino' (1995), reuniting De Niro and Joe Pesci after 'Goodfellas'.$t$
where category = 'cine' and question = $q$¿Quién dirige "Casino" (1995)?$q$;

update public.questions set
  question_en = $t$Who directs 'The Irishman' (2019)?$t$,
  options_en  = $t$["Scorsese","Coppola","Cimino","Lumet"]$t$::jsonb,
  context_en  = $t$Martin Scorsese directed 'The Irishman' (2019) for Netflix, with De Niro, Pacino and Pesci.$t$
where category = 'cine' and question = $q$¿Quién dirige "El irlandés" (2019)?$q$;

update public.questions set
  question_en = $t$Who directs 'Drive' (2011)?$t$,
  options_en  = $t$["Refn","Aronofsky","Mendes","Anderson"]$t$::jsonb,
  context_en  = $t$Nicolas Winding Refn directed 'Drive' (2011), starring Ryan Gosling.$t$
where category = 'cine' and question = $q$¿Quién dirige "Drive" (2011)?$q$;


-- ── musica (151) ──
update public.questions set
  question_en = $t$How many strings does a standard classical guitar have?$t$,
  options_en  = $t$["4","5","6","7"]$t$::jsonb,
  context_en  = $t$The Spanish classical guitar has 6 strings tuned E-A-D-G-B-E. Variants include 7- or 12-string guitars.$t$
where category = 'musica' and question = $q$¿Cuántas cuerdas tiene una guitarra clásica estándar?$q$;

update public.questions set
  question_en = $t$Who composed the Ninth Symphony with the 'Ode to Joy'?$t$,
  options_en  = $t$["Mozart","Bach","Beethoven","Schubert"]$t$::jsonb,
  context_en  = $t$Ludwig van Beethoven composed the Ninth (1824), his last symphony. He composed it when already completely deaf.$t$
where category = 'musica' and question = $q$¿Quién compuso la Novena Sinfonía con el "Himno de la Alegría"?$q$;

update public.questions set
  question_en = $t$Which city are The Beatles from?$t$,
  options_en  = $t$["London","Manchester","Liverpool","Birmingham"]$t$::jsonb,
  context_en  = $t$The Beatles formed in Liverpool in 1960. John Lennon, Paul McCartney, George Harrison and Ringo Starr.$t$
where category = 'musica' and question = $q$¿De qué ciudad son originarios Los Beatles?$q$;

update public.questions set
  question_en = $t$Who is known as the 'King of Pop'?$t$,
  options_en  = $t$["Elvis Presley","Michael Jackson","Prince","Madonna"]$t$::jsonb,
  context_en  = $t$Michael Jackson (1958-2009) received that title. His album 'Thriller' (1982) is still the best-selling in history (~70 M).$t$
where category = 'musica' and question = $q$¿Quién es conocido como el "Rey del Pop"?$q$;

update public.questions set
  question_en = $t$What is the typical instrument of Andrés Segovia?$t$,
  options_en  = $t$["Piano","Violin","Guitar","Flute"]$t$::jsonb,
  context_en  = $t$Andrés Segovia (1893-1987) elevated the classical guitar to the status of a solo concert instrument.$t$
where category = 'musica' and question = $q$¿Cuál es el instrumento típico de Andrés Segovia?$q$;

update public.questions set
  question_en = $t$Which Puerto Rican singer popularized 'Despacito' in 2017?$t$,
  options_en  = $t$["Daddy Yankee","Luis Fonsi","Ozuna","Don Omar"]$t$::jsonb,
  context_en  = $t$Luis Fonsi released 'Despacito' (with Daddy Yankee) in 2017. Its remix with Justin Bieber broke records on YouTube.$t$
where category = 'musica' and question = $q$¿Qué cantante puertorriqueño popularizó "Despacito" en 2017?$q$;

update public.questions set
  question_en = $t$In which country was the tango invented?$t$,
  options_en  = $t$["Argentina","Spain","Brazil","Cuba"]$t$::jsonb,
  context_en  = $t$The tango was born in the Río de la Plata (Buenos Aires and Montevideo) in the late 19th century. It is UNESCO Intangible Cultural Heritage.$t$
where category = 'musica' and question = $q$¿En qué país se inventó el tango?$q$;

update public.questions set
  question_en = $t$Which famous composer was deaf at the end of his life?$t$,
  options_en  = $t$["Mozart","Bach","Beethoven","Brahms"]$t$::jsonb,
  context_en  = $t$Beethoven began to lose his hearing around age 26 and composed many of his masterpieces (including the Ninth) in total deafness.$t$
where category = 'musica' and question = $q$¿Qué famoso compositor era sordo al final de su vida?$q$;

update public.questions set
  question_en = $t$How many notes does the diatonic scale have?$t$,
  options_en  = $t$["5","7","8","12"]$t$::jsonb,
  context_en  = $t$The diatonic scale has 7 notes: do, re, mi, fa, sol, la, si. Repeating, it returns to do for the octave.$t$
where category = 'musica' and question = $q$¿Cuántas notas musicales tiene la escala diatónica?$q$;

update public.questions set
  question_en = $t$Who was known as the 'King of Rock and Roll'?$t$,
  options_en  = $t$["Chuck Berry","Elvis Presley","Little Richard","Bill Haley"]$t$::jsonb,
  context_en  = $t$Elvis Presley (1935-1977) popularized rock and roll in the 1950s. He sold more than 500 million records.$t$
where category = 'musica' and question = $q$¿Quién fue conocido como el "Rey del Rock and Roll"?$q$;

update public.questions set
  question_en = $t$Which band wrote 'Bohemian Rhapsody'?$t$,
  options_en  = $t$["Led Zeppelin","Queen","The Who","Pink Floyd"]$t$::jsonb,
  context_en  = $t$'Bohemian Rhapsody' by Queen (1975), composed by Freddie Mercury. It lasts 5:55 and mixes ballad, opera and rock.$t$
where category = 'musica' and question = $q$¿Qué banda escribió "Bohemian Rhapsody"?$q$;

update public.questions set
  question_en = $t$In which country was Plácido Domingo born?$t$,
  options_en  = $t$["Mexico","Spain","Argentina","Italy"]$t$::jsonb,
  context_en  = $t$Plácido Domingo was born in Madrid in 1941 and emigrated with his family to Mexico as a child. He is one of the Three Tenors.$t$
where category = 'musica' and question = $q$¿En qué país nació Plácido Domingo?$q$;

update public.questions set
  question_en = $t$Who composed 'The Four Seasons'?$t$,
  options_en  = $t$["Bach","Vivaldi","Handel","Telemann"]$t$::jsonb,
  context_en  = $t$Antonio Vivaldi composed 'Le quattro stagioni' around 1720. It is one of the most popular Baroque works.$t$
where category = 'musica' and question = $q$¿Quién compuso "Las cuatro estaciones"?$q$;

update public.questions set
  question_en = $t$Which British singer died in 2011 at age 27?$t$,
  options_en  = $t$["Adele","Amy Winehouse","Lana del Rey","Florence Welch"]$t$::jsonb,
  context_en  = $t$Amy Winehouse (1983-2011) died at age 27 of alcohol poisoning. Her album 'Back to Black' won 5 Grammys.$t$
where category = 'musica' and question = $q$¿Qué cantante británica murió en 2011 con 27 años?$q$;

update public.questions set
  question_en = $t$Who composed the opera 'The Barber of Seville'?$t$,
  options_en  = $t$["Mozart","Verdi","Rossini","Wagner"]$t$::jsonb,
  context_en  = $t$Gioachino Rossini premiered 'The Barber of Seville' in 1816. It is one of the most performed comic operas.$t$
where category = 'musica' and question = $q$¿Quién compuso la ópera "El barbero de Sevilla"?$q$;

update public.questions set
  question_en = $t$What was Frédéric Chopin's nationality?$t$,
  options_en  = $t$["French","Polish","Hungarian","Austrian"]$t$::jsonb,
  context_en  = $t$Chopin (1810-1849) was born in Poland and lived most of his life in France. He composed almost exclusively for piano.$t$
where category = 'musica' and question = $q$¿De qué nacionalidad era Frédéric Chopin?$q$;

update public.questions set
  question_en = $t$Which band wrote 'Stairway to Heaven'?$t$,
  options_en  = $t$["Pink Floyd","Led Zeppelin","Black Sabbath","Deep Purple"]$t$::jsonb,
  context_en  = $t$Led Zeppelin recorded 'Stairway to Heaven' on their untitled 1971 album (Led Zeppelin IV). It is one of the most iconic rock songs.$t$
where category = 'musica' and question = $q$¿Qué grupo escribió "Stairway to Heaven"?$q$;

update public.questions set
  question_en = $t$Who composed the 'Bridal Chorus' (Wedding March)?$t$,
  options_en  = $t$["Mendelssohn","Wagner","Bach","Strauss"]$t$::jsonb,
  context_en  = $t$The famous 'Bridal Chorus' ('Here Comes the Bride') is by Richard Wagner, from his opera 'Lohengrin' (1850).$t$
where category = 'musica' and question = $q$¿Quién compuso la "Marcha Nupcial" (Bridal Chorus)?$q$;

update public.questions set
  question_en = $t$Which Mexican singer popularized the song 'Cielito Lindo'?$t$,
  options_en  = $t$["Lola Beltrán","Lila Downs","Chavela Vargas","It's a folk song, no single artist"]$t$::jsonb,
  context_en  = $t$'Cielito Lindo' is a Mexican folk song from 1882, composed by Quirino Mendoza y Cortés. Countless artists have performed it.$t$
where category = 'musica' and question = $q$¿Qué cantante mexicana popularizó la canción "Cielito Lindo"?$q$;

update public.questions set
  question_en = $t$Which singer popularized 'Like a Virgin'?$t$,
  options_en  = $t$["Madonna","Cyndi Lauper","Whitney Houston","Tina Turner"]$t$::jsonb,
  context_en  = $t$Madonna released 'Like a Virgin' in 1984. The album sold more than 21 million copies and consolidated her career.$t$
where category = 'musica' and question = $q$¿Qué cantante popularizó "Like a Virgin"?$q$;

update public.questions set
  question_en = $t$In which century did Johann Sebastian Bach live?$t$,
  options_en  = $t$["16th","17th","17th-18th","18th-19th"]$t$::jsonb,
  context_en  = $t$J.S. Bach (1685-1750), of the late Baroque. His works (BWV) add up to more than 1,100 pieces.$t$
where category = 'musica' and question = $q$¿En qué siglo vivió Johann Sebastian Bach?$q$;

update public.questions set
  question_en = $t$Which instrument does Yo-Yo Ma play?$t$,
  options_en  = $t$["Violin","Viola","Cello","Double bass"]$t$::jsonb,
  context_en  = $t$Yo-Yo Ma is an American cellist of Chinese origin. He has won 19 Grammys and is one of the most influential living musicians.$t$
where category = 'musica' and question = $q$¿Qué instrumento toca Yo-Yo Ma?$q$;

update public.questions set
  question_en = $t$How many members make up Coldplay?$t$,
  options_en  = $t$["3","4","5","6"]$t$::jsonb,
  context_en  = $t$Coldplay has 4 members: Chris Martin (vocals), Jonny Buckland (guitar), Guy Berryman (bass) and Will Champion (drums).$t$
where category = 'musica' and question = $q$¿Cuántos miembros componen Coldplay?$q$;

update public.questions set
  question_en = $t$Which American singer composed 'Imagine'?$t$,
  options_en  = $t$["Bob Dylan","John Lennon","Bruce Springsteen","Paul Simon"]$t$::jsonb,
  context_en  = $t$John Lennon composed and recorded 'Imagine' in 1971, during his solo career after the Beatles.$t$
where category = 'musica' and question = $q$¿Qué cantante estadounidense compuso "Imagine"?$q$;

update public.questions set
  question_en = $t$In which country did flamenco originate?$t$,
  options_en  = $t$["Morocco","Portugal","Spain","Italy"]$t$::jsonb,
  context_en  = $t$Flamenco originated in Andalusia (Spain) in the 18th century, with Roma, Andalusian and Arab influences. It is UNESCO heritage.$t$
where category = 'musica' and question = $q$¿En qué país surgió el flamenco?$q$;

update public.questions set
  question_en = $t$Which Spanish singer won Eurovision 1968?$t$,
  options_en  = $t$["Karina","Massiel","Salomé","Mocedades"]$t$::jsonb,
  context_en  = $t$Massiel won Eurovision 1968 with 'La, la, la', after Joan Manuel Serrat refused to sing it in Spanish.$t$
where category = 'musica' and question = $q$¿Qué cantante española ganó Eurovisión 1968?$q$;

update public.questions set
  question_en = $t$Which musician is known as 'The Boss'?$t$,
  options_en  = $t$["Bob Dylan","Bruce Springsteen","Neil Young","Tom Petty"]$t$::jsonb,
  context_en  = $t$Bruce Springsteen has had the nickname 'The Boss' since the 70s. His album 'Born in the USA' (1984) sold 30 M copies.$t$
where category = 'musica' and question = $q$¿Qué músico es conocido como "The Boss"?$q$;

update public.questions set
  question_en = $t$What is measured in hertz (Hz) in music?$t$,
  options_en  = $t$["Volume","Frequency","Duration","Timbre"]$t$::jsonb,
  context_en  = $t$Frequency is measured in Hz (cycles per second). Standard A is 440 Hz. Humans hear between ~20 Hz and ~20,000 Hz.$t$
where category = 'musica' and question = $q$¿Qué se mide en hercios (Hz) en música?$q$;

update public.questions set
  question_en = $t$Which band recorded 'Dark Side of the Moon'?$t$,
  options_en  = $t$["Genesis","Pink Floyd","Rush","Yes"]$t$::jsonb,
  context_en  = $t$'The Dark Side of the Moon' by Pink Floyd (1973) spent 950 weeks on the Billboard 200 and sold ~45 M copies.$t$
where category = 'musica' and question = $q$¿Qué grupo grabó "Dark Side of the Moon"?$q$;

update public.questions set
  question_en = $t$Who composed 'Swan Lake'?$t$,
  options_en  = $t$["Stravinsky","Prokofiev","Tchaikovsky","Rachmaninoff"]$t$::jsonb,
  context_en  = $t$Pyotr Ilyich Tchaikovsky premiered 'Swan Lake' in 1877. It is one of the most performed ballets.$t$
where category = 'musica' and question = $q$¿Quién compuso "El lago de los cisnes"?$q$;

update public.questions set
  question_en = $t$How many members did the Beatles have?$t$,
  options_en  = $t$["3","4","5","6"]$t$::jsonb,
  context_en  = $t$The Beatles were 4: John Lennon, Paul McCartney, George Harrison and Ringo Starr (replacing Pete Best in 1962).$t$
where category = 'musica' and question = $q$¿Cuántos miembros tenían los Beatles?$q$;

update public.questions set
  question_en = $t$Which blues singer is nicknamed 'King of the Blues'?$t$,
  options_en  = $t$["Muddy Waters","B.B. King","John Lee Hooker","Howlin' Wolf"]$t$::jsonb,
  context_en  = $t$B.B. King (1925-2015), a blues guitarist, named his Gibson guitar 'Lucille'. He influenced generations of musicians.$t$
where category = 'musica' and question = $q$¿Qué cantante de blues es apodado "King of the Blues"?$q$;

update public.questions set
  question_en = $t$What type of instrument is the marimba?$t$,
  options_en  = $t$["String","Wind","Percussion","Electronic"]$t$::jsonb,
  context_en  = $t$The marimba is a percussion idiophone: tuned wooden bars struck with mallets. It originates in Central America/Africa.$t$
where category = 'musica' and question = $q$¿Qué tipo de instrumento es la marimba?$q$;

update public.questions set
  question_en = $t$Who composed 'La Traviata'?$t$,
  options_en  = $t$["Puccini","Verdi","Rossini","Donizetti"]$t$::jsonb,
  context_en  = $t$Giuseppe Verdi premiered 'La Traviata' in 1853, based on 'The Lady of the Camellias' by Dumas fils.$t$
where category = 'musica' and question = $q$¿Quién compuso "La Traviata"?$q$;

update public.questions set
  question_en = $t$Which Catalan singer-songwriter composed 'Mediterráneo' (1971)?$t$,
  options_en  = $t$["Lluís Llach","Joan Manuel Serrat","Raimon","Pau Casals"]$t$::jsonb,
  context_en  = $t$Joan Manuel Serrat released 'Mediterráneo' in 1971. It is considered one of the best Spanish-language songs of all time.$t$
where category = 'musica' and question = $q$¿Qué cantautor catalán compuso "Mediterráneo" (1971)?$q$;

update public.questions set
  question_en = $t$Which band released 'Hotel California' in 1976?$t$,
  options_en  = $t$["Eagles","Fleetwood Mac","Doobie Brothers","Steely Dan"]$t$::jsonb,
  context_en  = $t$'Hotel California' by the Eagles won the Grammy for Record of the Year in 1978 and is one of the anthems of classic rock.$t$
where category = 'musica' and question = $q$¿Qué grupo lanzó "Hotel California" en 1976?$q$;

update public.questions set
  question_en = $t$Which orchestra did Herbert von Karajan conduct for decades?$t$,
  options_en  = $t$["Vienna","Berlin","London","New York"]$t$::jsonb,
  context_en  = $t$Karajan conducted the Berlin Philharmonic between 1955 and 1989. He is one of the best-selling conductors in history.$t$
where category = 'musica' and question = $q$¿Qué orquesta dirigió Herbert von Karajan durante décadas?$q$;

update public.questions set
  question_en = $t$Which is the highest note on the treble-clef staff?$t$,
  options_en  = $t$["Do","Mi","La","It depends"]$t$::jsonb,
  context_en  = $t$In the treble clef, notes go up indefinitely with ledger lines above the staff. The highest note depends on the range.$t$
where category = 'musica' and question = $q$¿Cuál es la nota más aguda en el pentagrama de clave de sol?$q$;

update public.questions set
  question_en = $t$Which British singer released 'Rolling in the Deep' in 2010?$t$,
  options_en  = $t$["Adele","Amy Winehouse","Florence","Dua Lipa"]$t$::jsonb,
  context_en  = $t$Adele released 'Rolling in the Deep' in 2010, the first single from her album '21', one of the best-selling of the 21st century.$t$
where category = 'musica' and question = $q$¿Qué cantante británica lanzó "Rolling in the Deep" en 2010?$q$;

update public.questions set
  question_en = $t$Who popularized the song 'My Way'?$t$,
  options_en  = $t$["Frank Sinatra","Elvis Presley","Tony Bennett","Bing Crosby"]$t$::jsonb,
  context_en  = $t$'My Way' is associated with Frank Sinatra (1969), although the lyrics are by Paul Anka, adapted from 'Comme d'habitude' by Claude François.$t$
where category = 'musica' and question = $q$¿Quién popularizó la canción "My Way"?$q$;

update public.questions set
  question_en = $t$Which band recorded 'Smells Like Teen Spirit'?$t$,
  options_en  = $t$["Pearl Jam","Nirvana","Soundgarden","Alice in Chains"]$t$::jsonb,
  context_en  = $t$Nirvana released 'Smells Like Teen Spirit' in 1991 on their album 'Nevermind'. It defined the grunge sound of the 90s.$t$
where category = 'musica' and question = $q$¿Qué grupo grabó "Smells Like Teen Spirit"?$q$;

update public.questions set
  question_en = $t$How many lines does a staff have?$t$,
  options_en  = $t$["3","4","5","6"]$t$::jsonb,
  context_en  = $t$A staff has 5 lines and 4 spaces where the notes are placed. It is the standard Western system since the 17th century.$t$
where category = 'musica' and question = $q$¿Cuántas líneas tiene un pentagrama?$q$;

update public.questions set
  question_en = $t$Which Mexican singer popularized the song 'La Llorona'?$t$,
  options_en  = $t$["Lola Beltrán","Chavela Vargas","Lila Downs","It's a folk song"]$t$::jsonb,
  context_en  = $t$Chavela Vargas (1919-2012) popularized 'La Llorona' in its best-known version, although the song is a 19th-century Mexican folk song.$t$
where category = 'musica' and question = $q$¿Qué cantante mexicana popularizó la canción "La Llorona"?$q$;

update public.questions set
  question_en = $t$In what year did Mozart die?$t$,
  options_en  = $t$["1791","1801","1815","1827"]$t$::jsonb,
  context_en  = $t$Wolfgang Amadeus Mozart died on 5 December 1791 at age 35, without completing his Requiem.$t$
where category = 'musica' and question = $q$¿En qué año murió Mozart?$q$;

update public.questions set
  question_en = $t$Which French musician inspired musical impressionism?$t$,
  options_en  = $t$["Ravel","Debussy","Bizet","Saint-Saëns"]$t$::jsonb,
  context_en  = $t$Claude Debussy (1862-1918) is the main exponent of musical impressionism, with works like 'Clair de Lune' and 'La mer'.$t$
where category = 'musica' and question = $q$¿Qué músico francés inspiró el impresionismo musical?$q$;

update public.questions set
  question_en = $t$Which Puerto Rican singer is nicknamed 'El Conejo Malo' (The Bad Bunny)?$t$,
  options_en  = $t$["Daddy Yankee","Bad Bunny","Ozuna","Anuel AA"]$t$::jsonb,
  context_en  = $t$Bad Bunny (Benito Antonio Martínez Ocasio) is the most-streamed reggaeton/trap artist in the world on Spotify in several recent years.$t$
where category = 'musica' and question = $q$¿Qué cantante puertorriqueño es apodado "El Conejo Malo"?$q$;

update public.questions set
  question_en = $t$Who composed 'Carmen'?$t$,
  options_en  = $t$["Massenet","Bizet","Gounod","Berlioz"]$t$::jsonb,
  context_en  = $t$Georges Bizet premiered the opera 'Carmen' in 1875. It is one of the most performed operas in the repertoire.$t$
where category = 'musica' and question = $q$¿Quién compuso "Carmen"?$q$;

update public.questions set
  question_en = $t$Which band recorded 'Sweet Child O' Mine'?$t$,
  options_en  = $t$["Aerosmith","Guns N' Roses","AC/DC","Bon Jovi"]$t$::jsonb,
  context_en  = $t$'Sweet Child O' Mine' by Guns N' Roses, on their debut album 'Appetite for Destruction' (1987). Slash's riff is one of the most famous.$t$
where category = 'musica' and question = $q$¿Qué grupo grabó "Sweet Child O' Mine"?$q$;

update public.questions set
  question_en = $t$How many operas did Mozart compose (approximately)?$t$,
  options_en  = $t$["12","17","22","30"]$t$::jsonb,
  context_en  = $t$Mozart composed about 22 operas, including 'The Marriage of Figaro' (1786), 'Don Giovanni' (1787) and 'The Magic Flute' (1791).$t$
where category = 'musica' and question = $q$¿Cuántas óperas compuso Mozart (aproximadamente)?$q$;

update public.questions set
  question_en = $t$Who composed the 'Turkish March'?$t$,
  options_en  = $t$["Beethoven","Mozart","Bach","Haydn"]$t$::jsonb,
  context_en  = $t$The 'Turkish March' is the third movement of Mozart's Piano Sonata No. 11 in A major, K. 331.$t$
where category = 'musica' and question = $q$¿Quién compuso la "Marcha Turca"?$q$;

update public.questions set
  question_en = $t$How many symphonies did Beethoven compose?$t$,
  options_en  = $t$["7","8","9","10"]$t$::jsonb,
  context_en  = $t$Beethoven composed 9 symphonies. The 9th (1824) includes the famous 'Ode to Joy' in its fourth movement.$t$
where category = 'musica' and question = $q$¿Cuántas sinfonías compuso Beethoven?$q$;

update public.questions set
  question_en = $t$How many symphonies did Mozart compose?$t$,
  options_en  = $t$["27","31","41","50"]$t$::jsonb,
  context_en  = $t$Mozart composed 41 symphonies. The 40th and the 41st ('Jupiter') are the most famous.$t$
where category = 'musica' and question = $q$¿Cuántas sinfonías compuso Mozart?$q$;

update public.questions set
  question_en = $t$How many symphonies did Haydn compose?$t$,
  options_en  = $t$["72","100","104","132"]$t$::jsonb,
  context_en  = $t$Joseph Haydn composed 104 symphonies. He is considered the 'father of the classical symphony'.$t$
where category = 'musica' and question = $q$¿Cuántas sinfonías compuso Haydn?$q$;

update public.questions set
  question_en = $t$In which century did Mozart live?$t$,
  options_en  = $t$["16th","17th","18th","19th"]$t$::jsonb,
  context_en  = $t$Wolfgang Amadeus Mozart (1756-1791) lived in the 18th century. He was a central figure of musical Classicism.$t$
where category = 'musica' and question = $q$¿En qué siglo vivió Mozart?$q$;

update public.questions set
  question_en = $t$Which country was Beethoven from?$t$,
  options_en  = $t$["Austria","Germany","France","Italy"]$t$::jsonb,
  context_en  = $t$Ludwig van Beethoven was born in Bonn (Germany) in 1770 and died in Vienna in 1827.$t$
where category = 'musica' and question = $q$¿De qué país era Beethoven?$q$;

update public.questions set
  question_en = $t$What nationality was Bach?$t$,
  options_en  = $t$["Italian","Austrian","German","English"]$t$::jsonb,
  context_en  = $t$Johann Sebastian Bach (1685-1750) was German. He is a towering figure of musical Baroque.$t$
where category = 'musica' and question = $q$¿De qué nacionalidad era Bach?$q$;

update public.questions set
  question_en = $t$Which composer wrote the 'Suites for Solo Cello'?$t$,
  options_en  = $t$["Beethoven","Bach","Vivaldi","Brahms"]$t$::jsonb,
  context_en  = $t$J.S. Bach composed six suites for solo cello (BWV 1007-1012), rediscovered and popularized by Pau Casals.$t$
where category = 'musica' and question = $q$¿Qué compositor escribió "Las suites para violonchelo solo"?$q$;

update public.questions set
  question_en = $t$Which Catalan cellist revived Bach's suites?$t$,
  options_en  = $t$["Yo-Yo Ma","Pau Casals","Mstislav Rostropovich","Jacqueline du Pré"]$t$::jsonb,
  context_en  = $t$Pau (Pablo) Casals rediscovered and popularized Bach's Suites for Solo Cello starting in 1890.$t$
where category = 'musica' and question = $q$¿Qué violonchelista catalán recuperó las suites de Bach?$q$;

update public.questions set
  question_en = $t$Which composer wrote 'The Messiah'?$t$,
  options_en  = $t$["Handel","Bach","Vivaldi","Telemann"]$t$::jsonb,
  context_en  = $t$George Frideric Handel composed 'The Messiah' in 1741. It includes the famous 'Hallelujah'.$t$
where category = 'musica' and question = $q$¿Qué compositor escribió "El Mesías"?$q$;

update public.questions set
  question_en = $t$Who composed 'The Nutcracker Suite'?$t$,
  options_en  = $t$["Mussorgsky","Tchaikovsky","Stravinsky","Rachmaninoff"]$t$::jsonb,
  context_en  = $t$Pyotr Ilyich Tchaikovsky composed 'The Nutcracker' (1892), one of the most popular ballets in the world.$t$
where category = 'musica' and question = $q$¿Quién compuso la "Suite Nutcracker" (Cascanueces)?$q$;

update public.questions set
  question_en = $t$Who composed the '1812 Overture'?$t$,
  options_en  = $t$["Mussorgsky","Tchaikovsky","Rimsky-Korsakov","Borodin"]$t$::jsonb,
  context_en  = $t$Tchaikovsky's '1812 Overture' (1880) commemorates Napoleon's defeat in Russia and uses real cannons.$t$
where category = 'musica' and question = $q$¿Quién compuso "1812 Overture"?$q$;

update public.questions set
  question_en = $t$Who composed 'The Ring of the Nibelung'?$t$,
  options_en  = $t$["Strauss","Wagner","Beethoven","Schoenberg"]$t$::jsonb,
  context_en  = $t$Richard Wagner composed 'The Ring of the Nibelung' (1848-1874), a monumental operatic tetralogy.$t$
where category = 'musica' and question = $q$¿Quién compuso "El anillo del nibelungo"?$q$;

update public.questions set
  question_en = $t$What nationality was Wagner?$t$,
  options_en  = $t$["German","Italian","Austrian","English"]$t$::jsonb,
  context_en  = $t$Richard Wagner (1813-1883) was German. He revolutionized opera with his music dramas.$t$
where category = 'musica' and question = $q$¿De qué nacionalidad era Wagner?$q$;

update public.questions set
  question_en = $t$Who composed 'The Tetralogy'?$t$,
  options_en  = $t$["Wagner","Verdi","Puccini","Strauss"]$t$::jsonb,
  context_en  = $t$'The Tetralogy' refers to Wagner's 'Ring of the Nibelung': 4 operas (The Rhinegold, The Valkyrie, Siegfried and Twilight of the Gods).$t$
where category = 'musica' and question = $q$¿Quién compuso "La Tetralogía"?$q$;

update public.questions set
  question_en = $t$Who composed 'La Bohème'?$t$,
  options_en  = $t$["Verdi","Puccini","Donizetti","Rossini"]$t$::jsonb,
  context_en  = $t$Giacomo Puccini composed 'La Bohème' (1896). Also 'Tosca', 'Madama Butterfly' and 'Turandot'.$t$
where category = 'musica' and question = $q$¿Quién compuso "La Bohème"?$q$;

update public.questions set
  question_en = $t$Who composed 'Madame Butterfly'?$t$,
  options_en  = $t$["Verdi","Puccini","Rossini","Donizetti"]$t$::jsonb,
  context_en  = $t$Giacomo Puccini composed 'Madama Butterfly', premiered at La Scala in Milan in 1904.$t$
where category = 'musica' and question = $q$¿Quién compuso "Madame Butterfly"?$q$;

update public.questions set
  question_en = $t$Who composed 'Aida'?$t$,
  options_en  = $t$["Verdi","Puccini","Rossini","Donizetti"]$t$::jsonb,
  context_en  = $t$Giuseppe Verdi composed 'Aida' (1871), commissioned for the opening of the Suez Canal (although it premiered in Cairo in 1871).$t$
where category = 'musica' and question = $q$¿Quién compuso "Aida"?$q$;

update public.questions set
  question_en = $t$Who composed 'Rigoletto'?$t$,
  options_en  = $t$["Bellini","Verdi","Donizetti","Puccini"]$t$::jsonb,
  context_en  = $t$Giuseppe Verdi composed 'Rigoletto' (1851), based on a work by Victor Hugo.$t$
where category = 'musica' and question = $q$¿Quién compuso "Rigoletto"?$q$;

update public.questions set
  question_en = $t$How many operas did Verdi write (approx.)?$t$,
  options_en  = $t$["12","20","28","40"]$t$::jsonb,
  context_en  = $t$Giuseppe Verdi composed 28 operas throughout his life (1813-1901).$t$
where category = 'musica' and question = $q$¿Cuántas óperas escribió Verdi (aprox.)?$q$;

update public.questions set
  question_en = $t$Who composed 'Don Giovanni'?$t$,
  options_en  = $t$["Mozart","Haydn","Salieri","Gluck"]$t$::jsonb,
  context_en  = $t$Wolfgang Amadeus Mozart composed 'Don Giovanni' in 1787, based on the myth of Don Juan.$t$
where category = 'musica' and question = $q$¿Quién compuso "Don Giovanni"?$q$;

update public.questions set
  question_en = $t$Who composed 'The Marriage of Figaro'?$t$,
  options_en  = $t$["Salieri","Mozart","Haydn","Beethoven"]$t$::jsonb,
  context_en  = $t$W.A. Mozart composed 'Le nozze di Figaro' (1786) to a libretto by Lorenzo Da Ponte.$t$
where category = 'musica' and question = $q$¿Quién compuso "Las bodas de Fígaro"?$q$;

update public.questions set
  question_en = $t$What nationality was Chopin?$t$,
  options_en  = $t$["Polish","French","German","Italian"]$t$::jsonb,
  context_en  = $t$Frédéric Chopin (1810-1849) was Polish, although he lived most of his adult life in France.$t$
where category = 'musica' and question = $q$¿De qué nacionalidad era Chopin?$q$;

update public.questions set
  question_en = $t$Which instrument did Chopin master?$t$,
  options_en  = $t$["Violin","Piano","Cello","Organ"]$t$::jsonb,
  context_en  = $t$Chopin was one of the greatest pianists and piano composers in history.$t$
where category = 'musica' and question = $q$¿Qué instrumento dominaba Chopin?$q$;

update public.questions set
  question_en = $t$Who composed the 'Boléro'?$t$,
  options_en  = $t$["Ravel","Debussy","Satie","Fauré"]$t$::jsonb,
  context_en  = $t$Maurice Ravel composed the 'Boléro' in 1928. A single melody repeated with a crescendo orchestration.$t$
where category = 'musica' and question = $q$¿Quién compuso el "Bolero"?$q$;

update public.questions set
  question_en = $t$What nationality was Debussy?$t$,
  options_en  = $t$["Italian","German","French","Belgian"]$t$::jsonb,
  context_en  = $t$Claude Debussy (1862-1918) was French. The main exponent of musical impressionism.$t$
where category = 'musica' and question = $q$¿De qué nacionalidad era Debussy?$q$;

update public.questions set
  question_en = $t$Who composed 'Clair de Lune' (Suite Bergamasque)?$t$,
  options_en  = $t$["Debussy","Beethoven","Chopin","Liszt"]$t$::jsonb,
  context_en  = $t$Claude Debussy composed 'Clair de Lune' as part of the Suite Bergamasque (published in 1905).$t$
where category = 'musica' and question = $q$¿Quién compuso "Claro de luna" (Suite Bergamasque)?$q$;

update public.questions set
  question_en = $t$Who composed the 'Moonlight Sonata' (piano)?$t$,
  options_en  = $t$["Mozart","Beethoven","Chopin","Schubert"]$t$::jsonb,
  context_en  = $t$Beethoven's 'Piano Sonata No. 14' is known as the 'Moonlight Sonata' (a posthumous nickname, not the composer's).$t$
where category = 'musica' and question = $q$¿Quién compuso la "Sonata Claro de Luna" (piano)?$q$;

update public.questions set
  question_en = $t$Which country was Antonio Vivaldi from?$t$,
  options_en  = $t$["Italy","France","Spain","Austria"]$t$::jsonb,
  context_en  = $t$Antonio Vivaldi (1678-1741) was Italian, born in Venice. A priest nicknamed 'il Prete Rosso'.$t$
where category = 'musica' and question = $q$¿De qué país era Antonio Vivaldi?$q$;

update public.questions set
  question_en = $t$How many concertos did Vivaldi write (approx.)?$t$,
  options_en  = $t$["~50","~150","~300","~500"]$t$::jsonb,
  context_en  = $t$Vivaldi wrote more than 500 concertos. 'The Four Seasons' are the most famous.$t$
where category = 'musica' and question = $q$¿Cuántos conciertos escribió Vivaldi (aprox.)?$q$;

update public.questions set
  question_en = $t$Who composed 'Peter and the Wolf'?$t$,
  options_en  = $t$["Stravinsky","Prokofiev","Shostakovich","Rachmaninoff"]$t$::jsonb,
  context_en  = $t$Sergei Prokofiev composed 'Peter and the Wolf' in 1936. A musical tale where each character is an instrument.$t$
where category = 'musica' and question = $q$¿Quién compuso "Pedro y el lobo"?$q$;

update public.questions set
  question_en = $t$Which country was Tchaikovsky from?$t$,
  options_en  = $t$["Russia","Poland","Germany","Hungary"]$t$::jsonb,
  context_en  = $t$Pyotr Ilyich Tchaikovsky (1840-1893) was Russian. He composed operas, ballets, symphonies and concertos.$t$
where category = 'musica' and question = $q$¿De qué país era Tchaikovsky?$q$;

update public.questions set
  question_en = $t$Which famous 'Chorus of the Hebrew Slaves' belongs to an opera by Verdi?$t$,
  options_en  = $t$["Aida","Nabucco","La Traviata","Otello"]$t$::jsonb,
  context_en  = $t$The chorus 'Va, pensiero' from Verdi's 'Nabucco' (1842), known as the 'Chorus of the Hebrew Slaves', became an Italian anthem of the Risorgimento.$t$
where category = 'musica' and question = $q$¿Qué famoso "Coro de los esclavos" pertenece a una ópera de Verdi?$q$;

update public.questions set
  question_en = $t$What nationality was Sibelius?$t$,
  options_en  = $t$["Swedish","Finnish","Norwegian","Danish"]$t$::jsonb,
  context_en  = $t$Jean Sibelius (1865-1957) was Finnish. His work 'Finlandia' is a national symbol.$t$
where category = 'musica' and question = $q$¿De qué nacionalidad era Sibelius?$q$;

update public.questions set
  question_en = $t$Who composed 'In the Steppes of Central Asia'?$t$,
  options_en  = $t$["Mussorgsky","Borodin","Rimsky-Korsakov","Glinka"]$t$::jsonb,
  context_en  = $t$Alexander Borodin, a physician-chemist and composer of 'The Five', composed 'In the Steppes of Central Asia' in 1880.$t$
where category = 'musica' and question = $q$¿Quién compuso "En las estepas del Asia Central"?$q$;

update public.questions set
  question_en = $t$Who composed 'Pictures at an Exhibition'?$t$,
  options_en  = $t$["Mussorgsky","Stravinsky","Rimsky-Korsakov","Glinka"]$t$::jsonb,
  context_en  = $t$Modest Mussorgsky composed 'Pictures at an Exhibition' (1874) for piano; Ravel later made a celebrated orchestration.$t$
where category = 'musica' and question = $q$¿Quién compuso "Cuadros de una exposición"?$q$;

update public.questions set
  question_en = $t$Who is the composer of 'The Blue Danube'?$t$,
  options_en  = $t$["Strauss the Elder","Strauss the Younger","Lehár","Suppé"]$t$::jsonb,
  context_en  = $t$Johann Strauss II ('the Younger') composed 'An der schönen blauen Donau' in 1866. It is almost an informal anthem of Austria.$t$
where category = 'musica' and question = $q$¿Quién es el compositor de "El Danubio Azul"?$q$;

update public.questions set
  question_en = $t$Which band recorded 'A Day in the Life'?$t$,
  options_en  = $t$["The Beatles","The Rolling Stones","The Who","Pink Floyd"]$t$::jsonb,
  context_en  = $t$'A Day in the Life' is the song that closes the album 'Sgt. Pepper's Lonely Hearts Club Band' (1967) by The Beatles.$t$
where category = 'musica' and question = $q$¿Qué grupo grabó "A Day in the Life"?$q$;

update public.questions set
  question_en = $t$In what year did The Beatles break up?$t$,
  options_en  = $t$["1968","1970","1972","1975"]$t$::jsonb,
  context_en  = $t$The Beatles announced their breakup in April 1970, after Paul McCartney's departure.$t$
where category = 'musica' and question = $q$¿En qué año se separaron The Beatles?$q$;

update public.questions set
  question_en = $t$What was the last album recorded by the Beatles?$t$,
  options_en  = $t$["Let It Be","Abbey Road","White Album","Help!"]$t$::jsonb,
  context_en  = $t$'Abbey Road' (1969) was the last album recorded by the Beatles, although 'Let It Be' was released afterward.$t$
where category = 'musica' and question = $q$¿Cuál fue el último álbum grabado por los Beatles?$q$;

update public.questions set
  question_en = $t$Which is the best-selling album in history?$t$,
  options_en  = $t$["Thriller (Michael Jackson)","Back in Black (AC/DC)","The Dark Side of the Moon","Hotel California"]$t$::jsonb,
  context_en  = $t$'Thriller' (1982) by Michael Jackson has sold more than 70 million copies worldwide.$t$
where category = 'musica' and question = $q$¿Cuál es el álbum más vendido de la historia?$q$;

update public.questions set
  question_en = $t$How many members did the Rolling Stones have (classic lineup)?$t$,
  options_en  = $t$["3","4","5","6"]$t$::jsonb,
  context_en  = $t$The classic Rolling Stones were 5: Mick Jagger, Keith Richards, Charlie Watts, Bill Wyman and Brian Jones (later Mick Taylor / Ronnie Wood).$t$
where category = 'musica' and question = $q$¿Cuántos miembros tienen los Rolling Stones (clásicos)?$q$;

update public.questions set
  question_en = $t$Who is the singer of Queen?$t$,
  options_en  = $t$["Brian May","Freddie Mercury","Roger Taylor","John Deacon"]$t$::jsonb,
  context_en  = $t$Freddie Mercury (1946-1991) was the singer of Queen and the author of many of their biggest hits.$t$
where category = 'musica' and question = $q$¿Quién es el cantante de Queen?$q$;

update public.questions set
  question_en = $t$What was Queen's last concert with Freddie Mercury?$t$,
  options_en  = $t$["Live Aid 1985","Knebworth 1986","Wembley 1986","Madison Square Garden"]$t$::jsonb,
  context_en  = $t$Queen's last concert with Mercury was on 9 August 1986 at Knebworth Park (UK).$t$
where category = 'musica' and question = $q$¿Cuál fue el último concierto de Queen con Freddie Mercury?$q$;

update public.questions set
  question_en = $t$Which band was David Gilmour the guitarist of?$t$,
  options_en  = $t$["The Who","Led Zeppelin","Pink Floyd","Genesis"]$t$::jsonb,
  context_en  = $t$David Gilmour joined Pink Floyd in 1968 replacing Syd Barrett and became their main vocalist and guitarist.$t$
where category = 'musica' and question = $q$¿De qué grupo era David Gilmour guitarrista?$q$;

update public.questions set
  question_en = $t$Which is Pink Floyd's best-selling album?$t$,
  options_en  = $t$["The Wall","The Dark Side of the Moon","Wish You Were Here","Animals"]$t$::jsonb,
  context_en  = $t$'The Dark Side of the Moon' (1973) is one of the best-selling albums in history, with more than 45 million copies.$t$
where category = 'musica' and question = $q$¿Cuál es el álbum más vendido de Pink Floyd?$q$;

update public.questions set
  question_en = $t$Who is the singer of U2?$t$,
  options_en  = $t$["Bono","The Edge","Adam Clayton","Larry Mullen"]$t$::jsonb,
  context_en  = $t$Paul David Hewson 'Bono' has been the singer of U2 since its founding in 1976 in Dublin.$t$
where category = 'musica' and question = $q$¿Cuál es el cantante de U2?$q$;

update public.questions set
  question_en = $t$Which country is U2 from?$t$,
  options_en  = $t$["U.S.","United Kingdom","Ireland","Australia"]$t$::jsonb,
  context_en  = $t$U2 formed in Dublin, Ireland, in 1976.$t$
where category = 'musica' and question = $q$¿De qué país son originarios U2?$q$;

update public.questions set
  question_en = $t$Which band was Kurt Cobain the singer of?$t$,
  options_en  = $t$["Pearl Jam","Soundgarden","Nirvana","Alice in Chains"]$t$::jsonb,
  context_en  = $t$Kurt Cobain (1967-1994) was the singer and guitarist of Nirvana. He died at age 27.$t$
where category = 'musica' and question = $q$¿De qué grupo era cantante Kurt Cobain?$q$;

update public.questions set
  question_en = $t$In what year did Kurt Cobain die?$t$,
  options_en  = $t$["1992","1993","1994","1995"]$t$::jsonb,
  context_en  = $t$Kurt Cobain died in April 1994 in Seattle. He would join the '27 Club'.$t$
where category = 'musica' and question = $q$¿En qué año murió Kurt Cobain?$q$;

update public.questions set
  question_en = $t$Which artists died at age 27 in the so-called '27 Club'?$t$,
  options_en  = $t$["Jimi Hendrix","Janis Joplin","Jim Morrison","All of the above"]$t$::jsonb,
  context_en  = $t$Hendrix, Joplin, Morrison, Cobain and Amy Winehouse all died at age 27.$t$
where category = 'musica' and question = $q$¿Qué artistas murieron a los 27 años en el llamado "club de los 27"?$q$;

update public.questions set
  question_en = $t$Who composed 'Like a Rolling Stone'?$t$,
  options_en  = $t$["John Lennon","Bob Dylan","Paul McCartney","Mick Jagger"]$t$::jsonb,
  context_en  = $t$Bob Dylan recorded 'Like a Rolling Stone' in 1965. Nobel Prize in Literature 2016.$t$
where category = 'musica' and question = $q$¿Quién compuso "Like a Rolling Stone"?$q$;

update public.questions set
  question_en = $t$Who won the Nobel Prize in Literature in 2016?$t$,
  options_en  = $t$["Cohen","Dylan","Tom Waits","Springsteen"]$t$::jsonb,
  context_en  = $t$Bob Dylan won the Nobel Prize in Literature 2016 'for having created new poetic expressions within the great American song tradition'.$t$
where category = 'musica' and question = $q$¿Quién ganó el Premio Nobel de Literatura en 2016?$q$;

update public.questions set
  question_en = $t$How many strings does a violin have?$t$,
  options_en  = $t$["3","4","5","6"]$t$::jsonb,
  context_en  = $t$The violin has 4 strings tuned in fifths: G, D, A and E.$t$
where category = 'musica' and question = $q$¿Cuántas cuerdas tiene un violín?$q$;

update public.questions set
  question_en = $t$How many strings does a standard electric guitar have?$t$,
  options_en  = $t$["4","6","7","8"]$t$::jsonb,
  context_en  = $t$The standard electric guitar has 6 strings. There are 7-, 8- and 12-string variants.$t$
where category = 'musica' and question = $q$¿Cuántas cuerdas tiene una guitarra eléctrica estándar?$q$;

update public.questions set
  question_en = $t$Which instrument did Charlie Parker use?$t$,
  options_en  = $t$["Alto saxophone","Trumpet","Piano","Clarinet"]$t$::jsonb,
  context_en  = $t$Charlie 'Bird' Parker (1920-1955) played the alto saxophone and was a pioneer of bebop along with Dizzy Gillespie.$t$
where category = 'musica' and question = $q$¿Qué instrumento usaba Charlie Parker?$q$;

update public.questions set
  question_en = $t$Which instrument did Louis Armstrong play?$t$,
  options_en  = $t$["Saxophone","Trumpet","Piano","Cello"]$t$::jsonb,
  context_en  = $t$Louis 'Satchmo' Armstrong (1901-1971) revolutionized jazz with his trumpet and his unmistakable voice.$t$
where category = 'musica' and question = $q$¿Qué instrumento tocaba Louis Armstrong?$q$;

update public.questions set
  question_en = $t$Which instrument did Miles Davis play?$t$,
  options_en  = $t$["Trumpet","Trombone","Saxophone","Piano"]$t$::jsonb,
  context_en  = $t$Miles Davis (1926-1991) played the trumpet. He is one of the most influential musicians in 20th-century jazz.$t$
where category = 'musica' and question = $q$¿Qué instrumento tocaba Miles Davis?$q$;

update public.questions set
  question_en = $t$Which Miles Davis album is considered the best jazz album?$t$,
  options_en  = $t$["Kind of Blue","Bitches Brew","A Love Supreme","In a Silent Way"]$t$::jsonb,
  context_en  = $t$'Kind of Blue' (1959) by Miles Davis is often considered the best jazz album in history.$t$
where category = 'musica' and question = $q$¿Qué álbum de Miles Davis es considerado el mejor de jazz?$q$;

update public.questions set
  question_en = $t$Which singer popularized 'Strange Fruit'?$t$,
  options_en  = $t$["Ella Fitzgerald","Billie Holiday","Sarah Vaughan","Nina Simone"]$t$::jsonb,
  context_en  = $t$Billie Holiday popularized 'Strange Fruit' in 1939, a protest song about lynchings in the American South.$t$
where category = 'musica' and question = $q$¿Qué cantante popularizó "Strange Fruit"?$q$;

update public.questions set
  question_en = $t$In which country did reggae originate?$t$,
  options_en  = $t$["Cuba","Jamaica","Brazil","Trinidad"]$t$::jsonb,
  context_en  = $t$Reggae originated in Jamaica in the late 1960s. Bob Marley is its most international figure.$t$
where category = 'musica' and question = $q$¿En qué país surgió el reggae?$q$;

update public.questions set
  question_en = $t$In which country was Bob Marley born?$t$,
  options_en  = $t$["U.S.","Jamaica","Trinidad","United Kingdom"]$t$::jsonb,
  context_en  = $t$Bob Marley (1945-1981) was born in Nine Mile, Jamaica.$t$
where category = 'musica' and question = $q$¿En qué país nació Bob Marley?$q$;

update public.questions set
  question_en = $t$Which band was Bob Marley the leader of?$t$,
  options_en  = $t$["The Wailers","The Maytals","Steel Pulse","Black Uhuru"]$t$::jsonb,
  context_en  = $t$Bob Marley led 'The Wailers', first with Peter Tosh and Bunny Wailer, then just under his name.$t$
where category = 'musica' and question = $q$¿Qué grupo fue Bob Marley líder?$q$;

update public.questions set
  question_en = $t$Which singer is nicknamed the 'Queen of Soul'?$t$,
  options_en  = $t$["Aretha Franklin","Tina Turner","Whitney Houston","Diana Ross"]$t$::jsonb,
  context_en  = $t$Aretha Franklin (1942-2018) is known as the 'Queen of Soul'. She sang 'Respect' and 'Natural Woman'.$t$
where category = 'musica' and question = $q$¿Qué cantante es apodada "La Reina del Soul"?$q$;

update public.questions set
  question_en = $t$Which band was Diana Ross the singer of?$t$,
  options_en  = $t$["The Supremes","The Ronettes","The Marvelettes","Martha & The Vandellas"]$t$::jsonb,
  context_en  = $t$Diana Ross was the lead voice of The Supremes (1964-1970) before her solo career.$t$
where category = 'musica' and question = $q$¿De qué grupo era cantante Diana Ross?$q$;

update public.questions set
  question_en = $t$Who is Stevie Wonder?$t$,
  options_en  = $t$["A blind soul/funk singer","A classical pianist","A country guitarist","A bassist"]$t$::jsonb,
  context_en  = $t$Stevie Wonder (1950-), blind since shortly after birth, is one of the greatest singer-songwriters and multi-instrumentalists of soul and funk.$t$
where category = 'musica' and question = $q$¿Quién es Stevie Wonder?$q$;

update public.questions set
  question_en = $t$Who composed 'I Want to Hold Your Hand'?$t$,
  options_en  = $t$["Lennon-McCartney","Jagger-Richards","Pete Townshend","Hendrix"]$t$::jsonb,
  context_en  = $t$John Lennon and Paul McCartney composed 'I Want to Hold Your Hand' (1963). It was the Beatles' first No. 1 in the U.S.$t$
where category = 'musica' and question = $q$¿Quién compuso "I Want to Hold Your Hand"?$q$;

update public.questions set
  question_en = $t$How many albums did the Beatles officially release?$t$,
  options_en  = $t$["10","12","13","16"]$t$::jsonb,
  context_en  = $t$The Beatles released 13 official studio albums between 1963 and 1970.$t$
where category = 'musica' and question = $q$¿Cuántos álbumes publicaron oficialmente los Beatles?$q$;

update public.questions set
  question_en = $t$Who is Joan Baez?$t$,
  options_en  = $t$["An American folk singer-songwriter","An opera singer","A pianist","A classical composer"]$t$::jsonb,
  context_en  = $t$Joan Baez is an American folk singer-songwriter, an icon of 1960s protest and linked to Bob Dylan.$t$
where category = 'musica' and question = $q$¿Quién es Joan Báez?$q$;

update public.questions set
  question_en = $t$Who is Joaquín Sabina?$t$,
  options_en  = $t$["A Spanish singer-songwriter","An orchestra conductor","A classical composer","An opera singer"]$t$::jsonb,
  context_en  = $t$Joaquín Sabina (1949-) is one of the great Spanish singer-songwriters. Famous for songs like '19 días y 500 noches'.$t$
where category = 'musica' and question = $q$¿Quién es Joaquín Sabina?$q$;

update public.questions set
  question_en = $t$Who composed 'Hijo de la Luna'?$t$,
  options_en  = $t$["José Luis Perales","José María Cano","Luis Eduardo Aute","Joaquín Sabina"]$t$::jsonb,
  context_en  = $t$'Hijo de la luna' was composed by José María Cano for Mecano. It appears on the album 'Entre el cielo y el suelo' (1986).$t$
where category = 'musica' and question = $q$¿Quién compuso "Hijo de la Luna"?$q$;

update public.questions set
  question_en = $t$Which Spanish band released 'Cruz de navajas'?$t$,
  options_en  = $t$["Hombres G","Mecano","Duncan Dhu","La Unión"]$t$::jsonb,
  context_en  = $t$'Cruz de navajas' belongs to Mecano's album 'Entre el cielo y el suelo' (1986).$t$
where category = 'musica' and question = $q$¿Qué grupo español lanzó "Cruz de navajas"?$q$;

update public.questions set
  question_en = $t$Who composed 'Pongamos que hablo de Madrid'?$t$,
  options_en  = $t$["Sabina","Krahe","Aute","Sabina and Suárez"]$t$::jsonb,
  context_en  = $t$Joaquín Sabina composed 'Pongamos que hablo de Madrid' in 1980. Antonio Flores and Sabina have popularized it.$t$
where category = 'musica' and question = $q$¿Quién compuso "Pongamos que hablo de Madrid"?$q$;

update public.questions set
  question_en = $t$Who is the singer of Mecano?$t$,
  options_en  = $t$["Ana Belén","Ana Torroja","Rocío Jurado","Mónica Naranjo"]$t$::jsonb,
  context_en  = $t$Ana Torroja is the voice of Mecano, a band formed with the brothers Nacho and José María Cano.$t$
where category = 'musica' and question = $q$¿Quién es la cantante de Mecano?$q$;

update public.questions set
  question_en = $t$Who composed 'El cant dels ocells' (a Catalan folk song)?$t$,
  options_en  = $t$["Traditional","Pau Casals (famous arrangement)","Lluís Llach","Joan Manuel Serrat"]$t$::jsonb,
  context_en  = $t$'El cant dels ocells' is a Catalan Christmas folk song. Pau Casals popularized it as a piece for cello.$t$
where category = 'musica' and question = $q$¿Quién compuso "El cant dels ocells" (popular catalán)?$q$;

update public.questions set
  question_en = $t$Which Latin act sold millions with 'Macarena'?$t$,
  options_en  = $t$["Ricky Martin","Los del Río","Enrique Iglesias","Marc Anthony"]$t$::jsonb,
  context_en  = $t$Los del Río (Antonio Romero and Rafael Ruiz) released 'Macarena' in 1993. Its 1996 remix was a worldwide hit.$t$
where category = 'musica' and question = $q$¿Qué cantante latino vendió millones con "Macarena"?$q$;

update public.questions set
  question_en = $t$Which country is the tango from?$t$,
  options_en  = $t$["Brazil","Argentina","Uruguay","Argentina and Uruguay"]$t$::jsonb,
  context_en  = $t$The tango originated in the late 19th century in the Río de la Plata, in neighborhoods of Buenos Aires and Montevideo.$t$
where category = 'musica' and question = $q$¿De qué país es originario el tango?$q$;

update public.questions set
  question_en = $t$Who is Carlos Gardel?$t$,
  options_en  = $t$["A tango singer","An orchestra conductor","A pianist","A classical composer"]$t$::jsonb,
  context_en  = $t$Carlos Gardel (1890-1935) was the most famous tango singer. He died in a plane crash in Medellín.$t$
where category = 'musica' and question = $q$¿Quién es Carlos Gardel?$q$;

update public.questions set
  question_en = $t$Which singer popularized the song 'Volver'?$t$,
  options_en  = $t$["Carlos Gardel","Astor Piazzolla","Enrique Cadícamo","Susana Rinaldi"]$t$::jsonb,
  context_en  = $t$'Volver' is a tango by Carlos Gardel (music) and Alfredo Le Pera (lyrics), from 1934. Pedro Almodóvar titled his film after it.$t$
where category = 'musica' and question = $q$¿Qué cantante popularizó la canción "Volver"?$q$;

update public.questions set
  question_en = $t$Who was Astor Piazzolla?$t$,
  options_en  = $t$["An Argentine composer of new tango","A singer","A film director","A dancer"]$t$::jsonb,
  context_en  = $t$Astor Piazzolla (1921-1992) revolutionized tango by fusing it with jazz and classical music. He played the bandoneon.$t$
where category = 'musica' and question = $q$¿Quién fue Astor Piazzolla?$q$;

update public.questions set
  question_en = $t$Which characteristic instrument does the tango have?$t$,
  options_en  = $t$["Accordion","Bandoneon","Concertina","Harmonica"]$t$::jsonb,
  context_en  = $t$The bandoneon, an instrument of German origin, is the characteristic sound of the Río de la Plata tango.$t$
where category = 'musica' and question = $q$¿Qué instrumento característico tiene el tango?$q$;

update public.questions set
  question_en = $t$Which bandoneon player composed 'Libertango'?$t$,
  options_en  = $t$["Troilo","Piazzolla","Salgán","Pugliese"]$t$::jsonb,
  context_en  = $t$Astor Piazzolla composed 'Libertango' in 1974. One of the most celebrated pieces of new tango.$t$
where category = 'musica' and question = $q$¿Qué bandoneonista compuso "Libertango"?$q$;

update public.questions set
  question_en = $t$Who composed 'Cinema Paradiso' (soundtrack)?$t$,
  options_en  = $t$["Ennio Morricone","Nino Rota","Nicola Piovani","Goran Bregović"]$t$::jsonb,
  context_en  = $t$Ennio Morricone composed the soundtrack for 'Cinema Paradiso' (1988) along with his son Andrea.$t$
where category = 'musica' and question = $q$¿Quién compuso "Cinema Paradiso" (banda sonora)?$q$;

update public.questions set
  question_en = $t$Who composed the soundtrack for 'The Godfather'?$t$,
  options_en  = $t$["Ennio Morricone","Nino Rota","John Williams","Maurice Jarre"]$t$::jsonb,
  context_en  = $t$Nino Rota composed the soundtrack for 'The Godfather' (1972) and other Fellini films.$t$
where category = 'musica' and question = $q$¿Quién compuso la banda sonora de "El Padrino"?$q$;

update public.questions set
  question_en = $t$Who composed the soundtrack for 'Indiana Jones'?$t$,
  options_en  = $t$["Hans Zimmer","John Williams","Howard Shore","Danny Elfman"]$t$::jsonb,
  context_en  = $t$John Williams composed the music for 'Indiana Jones', 'Star Wars', 'E.T.' and 'Jaws', among many others.$t$
where category = 'musica' and question = $q$¿Quién compuso la banda sonora de "Indiana Jones"?$q$;

update public.questions set
  question_en = $t$How many Oscars has John Williams won (as of 2024)?$t$,
  options_en  = $t$["3","5","7","9"]$t$::jsonb,
  context_en  = $t$John Williams has won 5 Oscars and has more than 50 nominations, an absolute record.$t$
where category = 'musica' and question = $q$¿Cuántos Óscars ha ganado John Williams (a 2024)?$q$;

update public.questions set
  question_en = $t$Who composed the soundtracks for 'Cinema Paradiso', 'The Mission' and 'The Untouchables'?$t$,
  options_en  = $t$["Williams","Morricone","Mancini","Goldsmith"]$t$::jsonb,
  context_en  = $t$Ennio Morricone (1928-2020) composed more than 500 soundtracks. Honorary Oscar (2007) and Best Score for 'The Hateful Eight' (2016).$t$
where category = 'musica' and question = $q$¿Quién compuso la banda sonora de "Cinema Paradiso", "La misión" y "Los intocables"?$q$;

update public.questions set
  question_en = $t$Which band recorded 'Wonderwall'?$t$,
  options_en  = $t$["Blur","Oasis","Radiohead","Pulp"]$t$::jsonb,
  context_en  = $t$'Wonderwall' is by Oasis, from the album '(What's the Story) Morning Glory?' (1995).$t$
where category = 'musica' and question = $q$¿Qué grupo grabó "Wonderwall"?$q$;

update public.questions set
  question_en = $t$Which country is the band Coldplay from?$t$,
  options_en  = $t$["U.S.","United Kingdom","Australia","Canada"]$t$::jsonb,
  context_en  = $t$Coldplay formed in London in 1996. Its members met at University College London.$t$
where category = 'musica' and question = $q$¿De qué país es originario el grupo Coldplay?$q$;

update public.questions set
  question_en = $t$Who is Chris Martin?$t$,
  options_en  = $t$["The singer of Coldplay","The bassist of Muse","The guitarist of Oasis","The drummer of Radiohead"]$t$::jsonb,
  context_en  = $t$Chris Martin has been the singer and pianist of Coldplay since its founding.$t$
where category = 'musica' and question = $q$¿Quién es Chris Martin?$q$;

update public.questions set
  question_en = $t$Which band released 'OK Computer' in 1997?$t$,
  options_en  = $t$["Blur","Radiohead","Oasis","Muse"]$t$::jsonb,
  context_en  = $t$Radiohead released 'OK Computer' in 1997, considered one of the best albums of the decade.$t$
where category = 'musica' and question = $q$¿Qué grupo lanzó "OK Computer" en 1997?$q$;

update public.questions set
  question_en = $t$Who sings 'Smells Like Teen Spirit'?$t$,
  options_en  = $t$["Pearl Jam","Nirvana","Soundgarden","Alice in Chains"]$t$::jsonb,
  context_en  = $t$'Smells Like Teen Spirit' (1991) by Nirvana is one of the anthems of grunge.$t$
where category = 'musica' and question = $q$¿Quién canta "Smells Like Teen Spirit"?$q$;

update public.questions set
  question_en = $t$In what year was Elvis Presley born?$t$,
  options_en  = $t$["1929","1935","1940","1945"]$t$::jsonb,
  context_en  = $t$Elvis Presley was born on 8 January 1935 in Tupelo (Mississippi).$t$
where category = 'musica' and question = $q$¿En qué año nació Elvis Presley?$q$;

update public.questions set
  question_en = $t$In what year did Elvis Presley die?$t$,
  options_en  = $t$["1972","1975","1977","1980"]$t$::jsonb,
  context_en  = $t$Elvis Presley died on 16 August 1977 at his Graceland mansion (Memphis).$t$
where category = 'musica' and question = $q$¿En qué año murió Elvis Presley?$q$;

update public.questions set
  question_en = $t$How many notes are there in an octave?$t$,
  options_en  = $t$["6","7","8","12 (including semitones)"]$t$::jsonb,
  context_en  = $t$An octave has 7 natural notes (do, re, mi, fa, sol, la, si) but 12 semitones in total.$t$
where category = 'musica' and question = $q$¿Cuántas notas hay en una octava?$q$;

update public.questions set
  question_en = $t$What musical interval is meant by an 'octave'?$t$,
  options_en  = $t$["The same note one octave higher","A fifth","A fourth","A third"]$t$::jsonb,
  context_en  = $t$The octave is the interval between a note and the next one with the same name. Its frequency is double.$t$
where category = 'musica' and question = $q$¿Qué intervalo musical se entiende por "octava"?$q$;

update public.questions set
  question_en = $t$What is measured in BPM?$t$,
  options_en  = $t$["Volume","Tempo","Pitch","Timbre"]$t$::jsonb,
  context_en  = $t$BPM (beats per minute) measure the tempo or musical speed: the number of beats per minute.$t$
where category = 'musica' and question = $q$¿Qué se mide en BPM?$q$;

update public.questions set
  question_en = $t$In which country was salsa (music) invented?$t$,
  options_en  = $t$["Cuba","Puerto Rico","U.S.","Multiple origins (New York/Caribbean)"]$t$::jsonb,
  context_en  = $t$Salsa emerged in New York among the Caribbean communities (especially Cuban and Puerto Rican) in the 1960s-70s.$t$
where category = 'musica' and question = $q$¿En qué país se inventó la salsa (música)?$q$;

update public.questions set
  question_en = $t$Who is Celia Cruz?$t$,
  options_en  = $t$["The Queen of Salsa","A jazz singer","A tango singer","A bolero singer"]$t$::jsonb,
  context_en  = $t$Celia Cruz (1925-2003), a Cuban, was the 'Queen of Salsa'. Her signature shout: '¡Azúcar!'.$t$
where category = 'musica' and question = $q$¿Quién es Celia Cruz?$q$;

update public.questions set
  question_en = $t$Who is Rubén Blades?$t$,
  options_en  = $t$["A Panamanian salsa singer and politician","A bossa nova singer","A jazz pianist","A classical composer"]$t$::jsonb,
  context_en  = $t$Rubén Blades is a Panamanian singer, composer, actor and politician. An icon of narrative salsa.$t$
where category = 'musica' and question = $q$¿Quién es Rubén Blades?$q$;

update public.questions set
  question_en = $t$Which Spanish act performed 'Zorra' at Eurovision 2024?$t$,
  options_en  = $t$["Nebulossa","Chanel","Blas Cantó","Edurne"]$t$::jsonb,
  context_en  = $t$The duo Nebulossa represented Spain at Eurovision 2024 with 'Zorra', although they did not win.$t$
where category = 'musica' and question = $q$¿Qué cantante popular española ganó Eurovisión en 2024 (interpretando a "Zorra")?$q$;

update public.questions set
  question_en = $t$Who won Eurovision 2024 (Switzerland)?$t$,
  options_en  = $t$["Joost Klein","Nemo","Bambie Thug","Baby Lasagna"]$t$::jsonb,
  context_en  = $t$Nemo won Eurovision 2024 for Switzerland with 'The Code'.$t$
where category = 'musica' and question = $q$¿Quién ganó Eurovisión 2024 (Suiza)?$q$;


-- ── literatura (155) ──
update public.questions set
  question_en = $t$Who wrote 'Don Quixote'?$t$,
  options_en  = $t$["Lope de Vega","Cervantes","Quevedo","Calderón"]$t$::jsonb,
  context_en  = $t$Miguel de Cervantes published the 1st part in 1605 and the 2nd in 1615. Considered the first modern novel.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Don Quijote de la Mancha"?$q$;

update public.questions set
  question_en = $t$In which century did Shakespeare live?$t$,
  options_en  = $t$["15th-16th","16th-17th","17th-18th","18th-19th"]$t$::jsonb,
  context_en  = $t$William Shakespeare (1564-1616). He wrote 39 plays and 154 sonnets.$t$
where category = 'literatura' and question = $q$¿En qué siglo vivió Shakespeare?$q$;

update public.questions set
  question_en = $t$Who wrote 'One Hundred Years of Solitude'?$t$,
  options_en  = $t$["Vargas Llosa","Borges","García Márquez","Cortázar"]$t$::jsonb,
  context_en  = $t$Gabriel García Márquez published the novel in 1967. Nobel Prize in Literature in 1982. A pinnacle work of magical realism.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Cien años de soledad"?$q$;

update public.questions set
  question_en = $t$Which English author created Sherlock Holmes?$t$,
  options_en  = $t$["Dickens","Conan Doyle","Wilde","Stevenson"]$t$::jsonb,
  context_en  = $t$Arthur Conan Doyle created the detective Sherlock Holmes in 'A Study in Scarlet' (1887). He wrote 4 novels and 56 stories about him.$t$
where category = 'literatura' and question = $q$¿Qué autor inglés creó a Sherlock Holmes?$q$;

update public.questions set
  question_en = $t$Who wrote 'Pride and Prejudice'?$t$,
  options_en  = $t$["Jane Austen","Brontë","Eliot","Woolf"]$t$::jsonb,
  context_en  = $t$Jane Austen published 'Pride and Prejudice' in 1813. It is one of the most-read novels in the English language.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Orgullo y prejuicio"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Hamlet'?$t$,
  options_en  = $t$["Marlowe","Shakespeare","Ben Jonson","Donne"]$t$::jsonb,
  context_en  = $t$'Hamlet, Prince of Denmark' (1600-1601) is Shakespeare's longest tragedy. 'To be or not to be' is its most famous soliloquy.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Hamlet"?$q$;

update public.questions set
  question_en = $t$Which country was Franz Kafka from?$t$,
  options_en  = $t$["Germany","Austria","Czechoslovakia","Hungary"]$t$::jsonb,
  context_en  = $t$Kafka (1883-1924) was born in Prague, then part of the Austro-Hungarian Empire, today the Czech Republic. He wrote in German.$t$
where category = 'literatura' and question = $q$¿De qué país era Franz Kafka?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Metamorphosis'?$t$,
  options_en  = $t$["Kafka","Camus","Sartre","Borges"]$t$::jsonb,
  context_en  = $t$Franz Kafka published 'Die Verwandlung' (The Metamorphosis) in 1915. Gregor Samsa wakes up transformed into an insect.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La metamorfosis"?$q$;

update public.questions set
  question_en = $t$Which Argentine author wrote 'Ficciones'?$t$,
  options_en  = $t$["Cortázar","Borges","Bioy Casares","Sábato"]$t$::jsonb,
  context_en  = $t$Jorge Luis Borges published 'Ficciones' in 1944, one of the most influential short-story collections of the 20th century.$t$
where category = 'literatura' and question = $q$¿Qué autor argentino escribió "Ficciones"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Crime and Punishment'?$t$,
  options_en  = $t$["Tolstoy","Dostoevsky","Chekhov","Turgenev"]$t$::jsonb,
  context_en  = $t$Fyodor Dostoevsky published 'Crime and Punishment' in 1866. It follows Raskolnikov after murdering a pawnbroker.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Crimen y castigo"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Little Prince'?$t$,
  options_en  = $t$["Saint-Exupéry","Camus","Sartre","Verne"]$t$::jsonb,
  context_en  = $t$Antoine de Saint-Exupéry published 'Le Petit Prince' in 1943. It is one of the most translated books in the world (more than 300 languages).$t$
where category = 'literatura' and question = $q$¿Quién escribió "El principito"?$q$;

update public.questions set
  question_en = $t$Which author wrote '1984'?$t$,
  options_en  = $t$["Huxley","Orwell","Bradbury","Burgess"]$t$::jsonb,
  context_en  = $t$George Orwell published '1984' in 1949. A totalitarian dystopia that coined terms like 'Big Brother' and 'doublethink'.$t$
where category = 'literatura' and question = $q$¿Qué autor escribió "1984"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Brave New World'?$t$,
  options_en  = $t$["Orwell","Huxley","Bradbury","Asimov"]$t$::jsonb,
  context_en  = $t$Aldous Huxley published 'Brave New World' in 1932, a dystopia centered on control through pleasure and genetic engineering.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Un mundo feliz" (Brave New World)?$q$;

update public.questions set
  question_en = $t$Which author wrote 'Les Misérables'?$t$,
  options_en  = $t$["Hugo","Dumas","Balzac","Zola"]$t$::jsonb,
  context_en  = $t$Victor Hugo published 'Les Misérables' in 1862. It follows the redemption of Jean Valjean in post-Napoleonic France.$t$
where category = 'literatura' and question = $q$¿Qué autor escribió "Los miserables"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Name of the Rose'?$t$,
  options_en  = $t$["Calvino","Eco","Saramago","Manzoni"]$t$::jsonb,
  context_en  = $t$Umberto Eco published 'Il nome della rosa' in 1980. A medieval mystery in a Benedictine monastery.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El nombre de la rosa"?$q$;

update public.questions set
  question_en = $t$Which book begins with 'Call me Ishmael'?$t$,
  options_en  = $t$["Treasure Island","Moby Dick","Robinson Crusoe","20,000 Leagues..."]$t$::jsonb,
  context_en  = $t$'Moby Dick' by Herman Melville (1851) begins with 'Call me Ishmael', one of the most famous opening lines in literature.$t$
where category = 'literatura' and question = $q$¿Qué libro empieza con "Llamadme Ismael"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Dracula'?$t$,
  options_en  = $t$["Bram Stoker","Mary Shelley","Edgar Allan Poe","Sheridan Le Fanu"]$t$::jsonb,
  context_en  = $t$Bram Stoker published 'Dracula' in 1897, in epistolary form. It laid the foundations of the modern vampire novel.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Drácula"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Frankenstein'?$t$,
  options_en  = $t$["Bram Stoker","Mary Shelley","Edgar Allan Poe","Robert Stevenson"]$t$::jsonb,
  context_en  = $t$Mary Shelley published 'Frankenstein, or the Modern Prometheus' in 1818, at just 20 years old. Considered a precursor of science fiction.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Frankenstein"?$q$;

update public.questions set
  question_en = $t$Which author wrote 'Don Quixote' 400 years before the 4th centenary celebrated in 2005?$t$,
  options_en  = $t$["Lope de Vega","Cervantes","Calderón","Quevedo"]$t$::jsonb,
  context_en  = $t$Cervantes published the 1st part in 1605 (400 years before 2005). The 2nd came out in 1615.$t$
where category = 'literatura' and question = $q$¿Qué autor escribió "El Quijote" 400 años antes del 4.º centenario celebrado en 2005?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Great Gatsby'?$t$,
  options_en  = $t$["Hemingway","Fitzgerald","Faulkner","Steinbeck"]$t$::jsonb,
  context_en  = $t$F. Scott Fitzgerald published 'The Great Gatsby' in 1925. Considered one of the great American novels, a portrait of the Jazz Age.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El gran Gatsby"?$q$;

update public.questions set
  question_en = $t$Which prize did Hemingway and Steinbeck win?$t$,
  options_en  = $t$["Pulitzer","Nobel Prize in Literature","Booker","Cervantes"]$t$::jsonb,
  context_en  = $t$Ernest Hemingway won the Nobel Prize in Literature in 1954 and John Steinbeck in 1962.$t$
where category = 'literatura' and question = $q$¿Qué premio Nobel ganaron Hemingway y Steinbeck?$q$;

update public.questions set
  question_en = $t$Which author wrote 'The Stranger' (L'Étranger)?$t$,
  options_en  = $t$["Sartre","Camus","Gide","Malraux"]$t$::jsonb,
  context_en  = $t$Albert Camus published 'L'Étranger' in 1942, considered a key work of existentialism (although Camus preferred 'absurdism').$t$
where category = 'literatura' and question = $q$¿Qué autor escribió "El extranjero" (L'Étranger)?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Picture of Dorian Gray'?$t$,
  options_en  = $t$["Wilde","Stoker","Stevenson","Conan Doyle"]$t$::jsonb,
  context_en  = $t$Oscar Wilde published 'The Picture of Dorian Gray' in 1890. It is his only novel; the rest of his work is theater and poetry.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El retrato de Dorian Gray"?$q$;

update public.questions set
  question_en = $t$Which author created the detective Hercule Poirot?$t$,
  options_en  = $t$["Conan Doyle","Christie","Chesterton","Dashiell Hammett"]$t$::jsonb,
  context_en  = $t$Agatha Christie created Poirot in 'The Mysterious Affair at Styles' (1920). He appears in 33 novels and 50 stories. She is the best-selling fiction author.$t$
where category = 'literatura' and question = $q$¿Qué autor creó al detective Hércules Poirot?$q$;

update public.questions set
  question_en = $t$Who wrote 'Ulysses'?$t$,
  options_en  = $t$["Joyce","Beckett","Yeats","Heaney"]$t$::jsonb,
  context_en  = $t$James Joyce published 'Ulysses' in 1922. It narrates one day (16 June 1904) in Dublin. It innovated with the 'stream of consciousness'.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Ulises"?$q$;

update public.questions set
  question_en = $t$Which Brazilian author wrote 'Captains of the Sands'?$t$,
  options_en  = $t$["Jorge Amado","Machado de Assis","Clarice Lispector","Carlos Drummond"]$t$::jsonb,
  context_en  = $t$Jorge Amado published 'Capitães da Areia' in 1937. It portrays street children in Salvador de Bahia.$t$
where category = 'literatura' and question = $q$¿Qué autor brasileño escribió "Capitanes de la arena"?$q$;

update public.questions set
  question_en = $t$Who is the author of 'Hopscotch'?$t$,
  options_en  = $t$["Cortázar","Borges","Bioy Casares","Sabato"]$t$::jsonb,
  context_en  = $t$Julio Cortázar published 'Hopscotch' in 1963. An experimental novel that can be read in different orders.$t$
where category = 'literatura' and question = $q$¿Quién es el autor de "Rayuela"?$q$;

update public.questions set
  question_en = $t$Which English author wrote 'Wuthering Heights'?$t$,
  options_en  = $t$["Charlotte Brontë","Emily Brontë","Anne Brontë","Jane Austen"]$t$::jsonb,
  context_en  = $t$Emily Brontë published 'Wuthering Heights' in 1847 under a male pseudonym. It is her only novel.$t$
where category = 'literatura' and question = $q$¿Qué autor inglés escribió "Cumbres borrascosas"?$q$;

update public.questions set
  question_en = $t$Which author wrote the 'La Comédie humaine' saga?$t$,
  options_en  = $t$["Balzac","Zola","Flaubert","Hugo"]$t$::jsonb,
  context_en  = $t$Honoré de Balzac wrote 'La Comédie humaine' (1830-1850), a set of ~90 interconnected works portraying French society.$t$
where category = 'literatura' and question = $q$¿Qué autor escribió la saga de "La Comedia humana"?$q$;

update public.questions set
  question_en = $t$Which Portuguese author won the Nobel Prize in Literature in 1998?$t$,
  options_en  = $t$["Pessoa","Saramago","Lobo Antunes","Mário de Sá-Carneiro"]$t$::jsonb,
  context_en  = $t$José Saramago won the Nobel in 1998. His work includes 'Blindness' (1995) and 'The Year of the Death of Ricardo Reis'.$t$
where category = 'literatura' and question = $q$¿Qué autor portugués ganó el Nobel de Literatura en 1998?$q$;

update public.questions set
  question_en = $t$Which Russian author wrote 'Anna Karenina'?$t$,
  options_en  = $t$["Tolstoy","Dostoevsky","Chekhov","Pushkin"]$t$::jsonb,
  context_en  = $t$Leo Tolstoy published 'Anna Karenina' between 1875 and 1877.$t$
where category = 'literatura' and question = $q$¿Qué autora rusa escribió "Anna Karénina"?$q$;

update public.questions set
  question_en = $t$Which author wrote 'Robinson Crusoe'?$t$,
  options_en  = $t$["Defoe","Swift","Stevenson","Verne"]$t$::jsonb,
  context_en  = $t$Daniel Defoe published 'Robinson Crusoe' in 1719. Considered one of the first novels in English.$t$
where category = 'literatura' and question = $q$¿Qué autor escribió "Robinson Crusoe"?$q$;

update public.questions set
  question_en = $t$Who wrote the 'Harry Potter' saga?$t$,
  options_en  = $t$["J.K. Rowling","Tolkien","C.S. Lewis","Philip Pullman"]$t$::jsonb,
  context_en  = $t$J.K. Rowling published 'Harry Potter and the Philosopher's Stone' in 1997. The saga sold more than 600 million copies.$t$
where category = 'literatura' and question = $q$¿Quién escribió la saga "Harry Potter"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Lord of the Rings'?$t$,
  options_en  = $t$["Tolkien","Lewis","Rowling","Pratchett"]$t$::jsonb,
  context_en  = $t$J.R.R. Tolkien published 'The Lord of the Rings' between 1954 and 1955. It laid the foundations of modern epic fantasy.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El Señor de los Anillos"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Pillars of the Earth'?$t$,
  options_en  = $t$["Ken Follett","Dan Brown","Patrick Süskind","Umberto Eco"]$t$::jsonb,
  context_en  = $t$Ken Follett published 'The Pillars of the Earth' in 1989. A historical saga about the construction of a cathedral in medieval England.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Los pilares de la Tierra"?$q$;

update public.questions set
  question_en = $t$Which Chilean author wrote 'The House of the Spirits'?$t$,
  options_en  = $t$["Isabel Allende","Marcela Serrano","Pia Barros","Diamela Eltit"]$t$::jsonb,
  context_en  = $t$Isabel Allende published 'The House of the Spirits' in 1982. A family saga with magical realism, in an unnamed Chile.$t$
where category = 'literatura' and question = $q$¿Qué autora chilena escribió "La casa de los espíritus"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Divine Comedy'?$t$,
  options_en  = $t$["Boccaccio","Dante","Petrarch","Machiavelli"]$t$::jsonb,
  context_en  = $t$Dante Alighieri wrote 'La Divina Commedia' around 1320. A pinnacle work of medieval Italian literature.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La divina comedia"?$q$;

update public.questions set
  question_en = $t$Which Greek author wrote 'The Iliad'?$t$,
  options_en  = $t$["Sophocles","Homer","Aeschylus","Euripides"]$t$::jsonb,
  context_en  = $t$Homer (8th century BC) composed 'The Iliad' and 'The Odyssey'. His historical existence is debated (the 'Homeric question').$t$
where category = 'literatura' and question = $q$¿Qué autor griego escribió "La Ilíada"?$q$;

update public.questions set
  question_en = $t$What is the first book of the Bible?$t$,
  options_en  = $t$["Genesis","Exodus","Leviticus","Psalms"]$t$::jsonb,
  context_en  = $t$Genesis is the first book of the Old Testament. It narrates the creation of the world and the origins of humanity.$t$
where category = 'literatura' and question = $q$¿Cuál es el primer libro de la Biblia?$q$;

update public.questions set
  question_en = $t$Who wrote 'Nausea'?$t$,
  options_en  = $t$["Camus","Sartre","Gide","Beauvoir"]$t$::jsonb,
  context_en  = $t$Jean-Paul Sartre published 'La Nausée' in 1938. A founding work of French existentialism.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La náusea"?$q$;

update public.questions set
  question_en = $t$Which Russian author wrote 'War and Peace'?$t$,
  options_en  = $t$["Dostoevsky","Tolstoy","Turgenev","Pushkin"]$t$::jsonb,
  context_en  = $t$Leo Tolstoy published 'War and Peace' between 1865 and 1869. More than 1,200 pages and 580 characters during the Napoleonic Wars.$t$
where category = 'literatura' and question = $q$¿Qué autor ruso escribió "Guerra y paz"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Da Vinci Code'?$t$,
  options_en  = $t$["Ken Follett","Dan Brown","Stephen King","Umberto Eco"]$t$::jsonb,
  context_en  = $t$Dan Brown published 'The Da Vinci Code' in 2003. It sold more than 80 million copies.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El código Da Vinci"?$q$;

update public.questions set
  question_en = $t$Which Japanese author won the Nobel in 1968?$t$,
  options_en  = $t$["Mishima","Kawabata","Murakami","Oe"]$t$::jsonb,
  context_en  = $t$Yasunari Kawabata was the first Japanese author to win the Nobel Prize in Literature, in 1968. Author of 'Snow Country' and 'Thousand Cranes'.$t$
where category = 'literatura' and question = $q$¿Qué autor japonés ganó el Nobel en 1968?$q$;

update public.questions set
  question_en = $t$Who wrote 'Lolita'?$t$,
  options_en  = $t$["Bulgakov","Nabokov","Solzhenitsyn","Bukowski"]$t$::jsonb,
  context_en  = $t$Vladimir Nabokov published 'Lolita' in 1955. Controversial for its subject; acclaimed for its prose in English (his second language).$t$
where category = 'literatura' and question = $q$¿Quién escribió "Lolita"?$q$;

update public.questions set
  question_en = $t$Which author wrote 'The Alchemist'?$t$,
  options_en  = $t$["Coelho","Saramago","Allende","Borges"]$t$::jsonb,
  context_en  = $t$Paulo Coelho published 'O Alquimista' in 1988. It is the most translated Brazilian book (more than 80 languages).$t$
where category = 'literatura' and question = $q$¿Qué autor escribió "El alquimista"?$q$;

update public.questions set
  question_en = $t$Who wrote the novel 'Love in the Time of Cholera'?$t$,
  options_en  = $t$["García Márquez","Vargas Llosa","Cortázar","Carpentier"]$t$::jsonb,
  context_en  = $t$García Márquez published 'Love in the Time of Cholera' in 1985, a novel inspired by his parents' love.$t$
where category = 'literatura' and question = $q$¿Quién escribió la novela "El amor en los tiempos del cólera"?$q$;

update public.questions set
  question_en = $t$Which author published 'The Feast of the Goat'?$t$,
  options_en  = $t$["Vargas Llosa","García Márquez","Roa Bastos","Donoso"]$t$::jsonb,
  context_en  = $t$Mario Vargas Llosa published 'The Feast of the Goat' in 2000. It deals with the Trujillo dictatorship in the Dominican Republic.$t$
where category = 'literatura' and question = $q$¿Qué autor publicó "La fiesta del Chivo"?$q$;

update public.questions set
  question_en = $t$In which century was Federico García Lorca born?$t$,
  options_en  = $t$["18th","19th","19th-20th","20th"]$t$::jsonb,
  context_en  = $t$Lorca was born in 1898 (19th century) and was murdered in 1936 (20th century). A prominent member of the Generation of '27.$t$
where category = 'literatura' and question = $q$¿En qué siglo nació Federico García Lorca?$q$;

update public.questions set
  question_en = $t$Which author wrote 'Pedro Páramo'?$t$,
  options_en  = $t$["Octavio Paz","Juan Rulfo","Carlos Fuentes","José Emilio Pacheco"]$t$::jsonb,
  context_en  = $t$Juan Rulfo published 'Pedro Páramo' in 1955. A fundamental work of Latin American magical realism, a forerunner of García Márquez.$t$
where category = 'literatura' and question = $q$¿Qué autor escribió "Pedro Páramo"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Romeo and Juliet'?$t$,
  options_en  = $t$["Shakespeare","Marlowe","Jonson","Webster"]$t$::jsonb,
  context_en  = $t$William Shakespeare wrote 'Romeo and Juliet' around 1595, one of the most famous tragedies in world literature.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Romeo y Julieta"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Macbeth'?$t$,
  options_en  = $t$["Shakespeare","Marlowe","Webster","Jonson"]$t$::jsonb,
  context_en  = $t$William Shakespeare wrote 'Macbeth' (~1606), a tragedy set in medieval Scotland.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Macbeth"?$q$;

update public.questions set
  question_en = $t$How many plays did Shakespeare write approximately?$t$,
  options_en  = $t$["20","30","37","50"]$t$::jsonb,
  context_en  = $t$Shakespeare is credited with 37-39 plays and 154 sonnets.$t$
where category = 'literatura' and question = $q$¿Cuántas obras escribió Shakespeare aproximadamente?$q$;

update public.questions set
  question_en = $t$Who wrote 'Othello'?$t$,
  options_en  = $t$["Shakespeare","Cervantes","Lope de Vega","Calderón"]$t$::jsonb,
  context_en  = $t$William Shakespeare wrote 'Othello' around 1603, a tragedy about jealousy.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Otelo"?$q$;

update public.questions set
  question_en = $t$Who wrote 'King Lear'?$t$,
  options_en  = $t$["Shakespeare","Marlowe","Webster","Beaumont"]$t$::jsonb,
  context_en  = $t$Shakespeare wrote 'King Lear' (~1606), considered one of his deepest tragedies.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El rey Lear"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Life Is a Dream'?$t$,
  options_en  = $t$["Lope de Vega","Calderón","Tirso","Cervantes"]$t$::jsonb,
  context_en  = $t$Pedro Calderón de la Barca wrote 'Life Is a Dream' (1635), a pinnacle work of Spanish Baroque theater.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La vida es sueño"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Fuenteovejuna'?$t$,
  options_en  = $t$["Lope de Vega","Calderón","Tirso de Molina","Cervantes"]$t$::jsonb,
  context_en  = $t$Lope de Vega wrote 'Fuenteovejuna' (~1612-1614), based on real events from the 15th century.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Fuenteovejuna"?$q$;

update public.questions set
  question_en = $t$How many plays did Lope de Vega write (approx.)?$t$,
  options_en  = $t$["80","300","800 published","1,500"]$t$::jsonb,
  context_en  = $t$Lope de Vega is credited with more than 1,800 plays, although only about 400-500 have survived.$t$
where category = 'literatura' and question = $q$¿Cuántas obras escribió Lope de Vega (aprox.)?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Trickster of Seville'?$t$,
  options_en  = $t$["Tirso de Molina","Lope de Vega","Calderón","Cervantes"]$t$::jsonb,
  context_en  = $t$Tirso de Molina wrote 'The Trickster of Seville' (~1630), in which the character of Don Juan appears for the first time.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El burlador de Sevilla"?$q$;

update public.questions set
  question_en = $t$How many parts does Don Quixote have?$t$,
  options_en  = $t$["1","2","3","4"]$t$::jsonb,
  context_en  = $t$Don Quixote was published in two parts: 1605 and 1615, both written by Miguel de Cervantes.$t$
where category = 'literatura' and question = $q$¿Cuántas partes tiene el Quijote?$q$;

update public.questions set
  question_en = $t$In what year was the first part of Don Quixote published?$t$,
  options_en  = $t$["1600","1605","1615","1620"]$t$::jsonb,
  context_en  = $t$The first part of Don Quixote was published in 1605. The second in 1615.$t$
where category = 'literatura' and question = $q$¿En qué año se publicó la primera parte del Quijote?$q$;

update public.questions set
  question_en = $t$What is the name of Don Quixote's horse?$t$,
  options_en  = $t$["Babieca","Rocinante","Bucephalus","Clavileño"]$t$::jsonb,
  context_en  = $t$Don Quixote's horse is called Rocinante. Sancho rides Rucio (a donkey).$t$
where category = 'literatura' and question = $q$¿Cómo se llama el caballo de Don Quijote?$q$;

update public.questions set
  question_en = $t$What is the name of Don Quixote's squire?$t$,
  options_en  = $t$["Sancho Panza","Lazarillo","Cardenio","Sansón Carrasco"]$t$::jsonb,
  context_en  = $t$Sancho Panza is Don Quixote's loyal squire throughout the entire novel.$t$
where category = 'literatura' and question = $q$¿Cómo se llama el escudero de Don Quijote?$q$;

update public.questions set
  question_en = $t$Who wrote 'Lazarillo de Tormes'?$t$,
  options_en  = $t$["Cervantes","Anonymous","Quevedo","Mateo Alemán"]$t$::jsonb,
  context_en  = $t$'Lazarillo de Tormes' (1554) is anonymous. It is the first example of the Spanish picaresque novel.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Lazarillo de Tormes"?$q$;

update public.questions set
  question_en = $t$Who wrote 'El sí de las niñas'?$t$,
  options_en  = $t$["Moratín","Larra","Espronceda","Bécquer"]$t$::jsonb,
  context_en  = $t$Leandro Fernández de Moratín wrote 'El sí de las niñas' (1806), a pinnacle work of Spanish Enlightenment theater.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El sí de las niñas"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Blood Wedding'?$t$,
  options_en  = $t$["García Lorca","Alberti","Aleixandre","Cernuda"]$t$::jsonb,
  context_en  = $t$Federico García Lorca wrote 'Blood Wedding' (1933), part of his rural trilogy.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Bodas de sangre"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The House of Bernarda Alba'?$t$,
  options_en  = $t$["Valle-Inclán","Lorca","Alberti","Cernuda"]$t$::jsonb,
  context_en  = $t$García Lorca finished 'The House of Bernarda Alba' in 1936, two months before being murdered.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La casa de Bernarda Alba"?$q$;

update public.questions set
  question_en = $t$In what year was Federico García Lorca murdered?$t$,
  options_en  = $t$["1934","1936","1937","1939"]$t$::jsonb,
  context_en  = $t$García Lorca was murdered by Francoist troops on 18 or 19 August 1936 near Granada.$t$
where category = 'literatura' and question = $q$¿En qué año fue asesinado Federico García Lorca?$q$;

update public.questions set
  question_en = $t$Who wrote 'Platero and I'?$t$,
  options_en  = $t$["Juan Ramón Jiménez","Machado","Lorca","Cernuda"]$t$::jsonb,
  context_en  = $t$Juan Ramón Jiménez wrote 'Platero and I' (1914), lyrical prose about his donkey Platero. Nobel Prize in Literature 1956.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Platero y yo"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Campos de Castilla'?$t$,
  options_en  = $t$["Antonio Machado","Lorca","Unamuno","Azorín"]$t$::jsonb,
  context_en  = $t$Antonio Machado published 'Campos de Castilla' in 1912. He is linked to the Generation of '98.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Campos de Castilla"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Niebla' (Mist)?$t$,
  options_en  = $t$["Unamuno","Baroja","Valle-Inclán","Azorín"]$t$::jsonb,
  context_en  = $t$Miguel de Unamuno published 'Niebla' in 1914, a novel in which the protagonist speaks with his author.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Niebla"?$q$;

update public.questions set
  question_en = $t$Who wrote 'La Regenta'?$t$,
  options_en  = $t$["Galdós","Clarín","Pardo Bazán","Pereda"]$t$::jsonb,
  context_en  = $t$Leopoldo Alas 'Clarín' published 'La Regenta' (1884-1885), a pinnacle work of Spanish realism.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La Regenta"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Fortunata y Jacinta'?$t$,
  options_en  = $t$["Galdós","Clarín","Pardo Bazán","Valera"]$t$::jsonb,
  context_en  = $t$Benito Pérez Galdós published 'Fortunata y Jacinta' (1887), his greatest novel.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Fortunata y Jacinta"?$q$;

update public.questions set
  question_en = $t$Who wrote the 'National Episodes'?$t$,
  options_en  = $t$["Clarín","Galdós","Valera","Pereda"]$t$::jsonb,
  context_en  = $t$Benito Pérez Galdós wrote 46 'National Episodes' about the history of Spain in the 19th century.$t$
where category = 'literatura' and question = $q$¿Quién escribió los "Episodios Nacionales"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The House of Ulloa'?$t$,
  options_en  = $t$["Pardo Bazán","Clarín","Galdós","Valera"]$t$::jsonb,
  context_en  = $t$Emilia Pardo Bazán published 'The House of Ulloa' in 1886, a naturalist novel set in Galicia.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Los pazos de Ulloa"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Hive'?$t$,
  options_en  = $t$["Cela","Delibes","Sánchez Ferlosio","Aldecoa"]$t$::jsonb,
  context_en  = $t$Camilo José Cela published 'The Hive' in 1951. Nobel Prize in Literature 1989.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La colmena"?$q$;

update public.questions set
  question_en = $t$In what year did Cela win the Nobel Prize in Literature?$t$,
  options_en  = $t$["1972","1980","1989","1995"]$t$::jsonb,
  context_en  = $t$Camilo José Cela won the Nobel Prize in Literature in 1989.$t$
where category = 'literatura' and question = $q$¿En qué año Cela ganó el Nobel de Literatura?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Family of Pascual Duarte'?$t$,
  options_en  = $t$["Cela","Delibes","Goytisolo","Aldecoa"]$t$::jsonb,
  context_en  = $t$Camilo José Cela published 'The Family of Pascual Duarte' in 1942. It started the 'tremendismo' movement.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La familia de Pascual Duarte"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Holy Innocents'?$t$,
  options_en  = $t$["Cela","Delibes","Goytisolo","Mendoza"]$t$::jsonb,
  context_en  = $t$Miguel Delibes published 'The Holy Innocents' in 1981. It was adapted into a film by Mario Camus in 1984.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Los santos inocentes"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Tree of Knowledge'?$t$,
  options_en  = $t$["Baroja","Unamuno","Valle-Inclán","Azorín"]$t$::jsonb,
  context_en  = $t$Pío Baroja published 'The Tree of Knowledge' in 1911, part of the trilogy 'The Race'.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El árbol de la ciencia"?$q$;

update public.questions set
  question_en = $t$Who is the author of 'Bohemian Lights' (Luces de bohemia)?$t$,
  options_en  = $t$["Valle-Inclán","Galdós","Lorca","Unamuno"]$t$::jsonb,
  context_en  = $t$Ramón María del Valle-Inclán wrote 'Bohemian Lights' (1920), a pioneer of the 'esperpento'.$t$
where category = 'literatura' and question = $q$¿Quién es el autor de "Luces de bohemia"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Time of Silence'?$t$,
  options_en  = $t$["Cela","Delibes","Luis Martín-Santos","Sánchez Ferlosio"]$t$::jsonb,
  context_en  = $t$Luis Martín-Santos published 'Time of Silence' in 1962, a key novel in the renewal of Spanish realism.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Tiempo de silencio"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Shadow of the Wind'?$t$,
  options_en  = $t$["Carlos Ruiz Zafón","Pérez-Reverte","Vázquez Montalbán","Marsé"]$t$::jsonb,
  context_en  = $t$Carlos Ruiz Zafón published 'The Shadow of the Wind' in 2001. The first novel of 'The Cemetery of Forgotten Books'.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La sombra del viento"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Club Dumas'?$t$,
  options_en  = $t$["Pérez-Reverte","Eslava Galán","Cercas","Marías"]$t$::jsonb,
  context_en  = $t$Arturo Pérez-Reverte published 'The Club Dumas' in 1993. It inspired Polanski's film 'The Ninth Gate'.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El club Dumas"?$q$;

update public.questions set
  question_en = $t$Who created Captain Alatriste?$t$,
  options_en  = $t$["Pérez-Reverte","Cercas","Vila-Matas","Mendoza"]$t$::jsonb,
  context_en  = $t$Arturo Pérez-Reverte created Captain Alatriste in 1996, in a saga of historical novels.$t$
where category = 'literatura' and question = $q$¿Quién creó al capitán Alatriste?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Truth About the Savolta Case'?$t$,
  options_en  = $t$["Eduardo Mendoza","Cercas","Marsé","Marías"]$t$::jsonb,
  context_en  = $t$Eduardo Mendoza published 'The Truth About the Savolta Case' in 1975, considered the start of the new Spanish narrative.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La verdad sobre el caso Savolta"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Soldiers of Salamis'?$t$,
  options_en  = $t$["Marías","Cercas","Pérez-Reverte","Marsé"]$t$::jsonb,
  context_en  = $t$Javier Cercas published 'Soldiers of Salamis' in 2001, about an episode of the Civil War.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Soldados de Salamina"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Time in Between' (El tiempo entre costuras)?$t$,
  options_en  = $t$["Almudena Grandes","María Dueñas","Carmen Posadas","Espido Freire"]$t$::jsonb,
  context_en  = $t$María Dueñas published 'The Time in Between' in 2009. Adapted into a TV series in 2013.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El tiempo entre costuras"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Bestias y rituales'?$t$,
  options_en  = $t$["Sara Mesa","Andrea Abreu","Pilar Quintana","Mariana Enriquez"]$t$::jsonb,
  context_en  = $t$(A tricky question.) Sara Mesa published 'Bestiario íntimo', but 'Bestias y rituales' is attributed to her. Verify the exact title.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Bestias y rituales"?$q$;

update public.questions set
  question_en = $t$Who is Mario Vargas Llosa?$t$,
  options_en  = $t$["A Peruvian writer, Nobel 2010","A Mexican writer","A Chilean journalist","A Colombian poet"]$t$::jsonb,
  context_en  = $t$Mario Vargas Llosa (1936-) is a Peruvian writer. He won the Nobel Prize in Literature in 2010.$t$
where category = 'literatura' and question = $q$¿Quién es Mario Vargas Llosa?$q$;

update public.questions set
  question_en = $t$Which author wrote 'The Time of the Hero'?$t$,
  options_en  = $t$["Vargas Llosa","García Márquez","Borges","Fuentes"]$t$::jsonb,
  context_en  = $t$Mario Vargas Llosa published 'The Time of the Hero' in 1963, his first novel. It won the Biblioteca Breve Prize.$t$
where category = 'literatura' and question = $q$¿Qué autor escribió "La ciudad y los perros"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Conversation in the Cathedral'?$t$,
  options_en  = $t$["García Márquez","Vargas Llosa","Cortázar","Carpentier"]$t$::jsonb,
  context_en  = $t$Mario Vargas Llosa published 'Conversation in the Cathedral' in 1969. One of his most complex works.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Conversación en la catedral"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Captain Pantoja and the Special Service'?$t$,
  options_en  = $t$["Vargas Llosa","García Márquez","Cortázar","Sábato"]$t$::jsonb,
  context_en  = $t$Mario Vargas Llosa published 'Captain Pantoja and the Special Service' in 1973, a political and military satire.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Pantaleón y las visitadoras"?$q$;

update public.questions set
  question_en = $t$Who is Gabriel García Márquez?$t$,
  options_en  = $t$["A Colombian novelist, Nobel 1982","A Chilean poet","A Cuban essayist","A Mexican playwright"]$t$::jsonb,
  context_en  = $t$Gabriel García Márquez (1927-2014) was a Colombian writer. He won the Nobel Prize in Literature in 1982.$t$
where category = 'literatura' and question = $q$¿Quién es Gabriel García Márquez?$q$;

update public.questions set
  question_en = $t$In what year did García Márquez receive the Nobel?$t$,
  options_en  = $t$["1978","1980","1982","1985"]$t$::jsonb,
  context_en  = $t$García Márquez received the Nobel Prize in Literature in 1982.$t$
where category = 'literatura' and question = $q$¿En qué año recibió García Márquez el Nobel?$q$;

update public.questions set
  question_en = $t$Which author wrote 'Chronicle of a Death Foretold'?$t$,
  options_en  = $t$["Carpentier","García Márquez","Cortázar","Borges"]$t$::jsonb,
  context_en  = $t$Gabriel García Márquez published 'Chronicle of a Death Foretold' in 1981.$t$
where category = 'literatura' and question = $q$¿Qué autor escribió "Crónica de una muerte anunciada"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Autumn of the Patriarch'?$t$,
  options_en  = $t$["García Márquez","Carpentier","Asturias","Roa Bastos"]$t$::jsonb,
  context_en  = $t$Gabriel García Márquez published 'The Autumn of the Patriarch' in 1975, about a Caribbean dictator.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El otoño del patriarca"?$q$;

update public.questions set
  question_en = $t$Who is the creator of Macondo?$t$,
  options_en  = $t$["García Márquez","Vargas Llosa","Cortázar","Borges"]$t$::jsonb,
  context_en  = $t$Gabriel García Márquez created the fictional town of Macondo in 'One Hundred Years of Solitude' (1967).$t$
where category = 'literatura' and question = $q$¿Quién es el creador de Macondo?$q$;

update public.questions set
  question_en = $t$Who wrote 'Pedro Páramo'?$t$,
  options_en  = $t$["Juan Rulfo","Carlos Fuentes","Octavio Paz","Yáñez"]$t$::jsonb,
  context_en  = $t$Juan Rulfo published 'Pedro Páramo' in 1955. One of the key works of 20th-century Mexican literature.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Pedro Páramo"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Where the Air Is Clear'?$t$,
  options_en  = $t$["Rulfo","Fuentes","Paz","Reyes"]$t$::jsonb,
  context_en  = $t$Carlos Fuentes published 'Where the Air Is Clear' in 1958, his first novel. About Mexico City.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La región más transparente"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Aura'?$t$,
  options_en  = $t$["Fuentes","Rulfo","Paz","Pacheco"]$t$::jsonb,
  context_en  = $t$Carlos Fuentes published the novella 'Aura' in 1962, narrated in the second person.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Aura"?$q$;

update public.questions set
  question_en = $t$Who is Octavio Paz?$t$,
  options_en  = $t$["A Mexican poet, Nobel 1990","A Chilean essayist","An Argentine novelist","A Cuban playwright"]$t$::jsonb,
  context_en  = $t$Octavio Paz (1914-1998) was a Mexican poet and essayist. He won the Nobel Prize in Literature in 1990.$t$
where category = 'literatura' and question = $q$¿Quién es Octavio Paz?$q$;

update public.questions set
  question_en = $t$Which essay by Octavio Paz reflects on Mexican identity?$t$,
  options_en  = $t$["The Bow and the Lyre","The Labyrinth of Solitude","Sunstone","The Elm's Pears"]$t$::jsonb,
  context_en  = $t$'The Labyrinth of Solitude' (1950) is Octavio Paz's emblematic work about the Mexican being.$t$
where category = 'literatura' and question = $q$¿Qué ensayo de Octavio Paz reflexiona sobre la identidad mexicana?$q$;

update public.questions set
  question_en = $t$Who wrote 'Ficciones' and 'The Aleph'?$t$,
  options_en  = $t$["Cortázar","Borges","Bioy Casares","Sábato"]$t$::jsonb,
  context_en  = $t$Jorge Luis Borges published 'Ficciones' (1944) and 'The Aleph' (1949). A master of the short story.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Ficciones" y "El Aleph"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Hopscotch'?$t$,
  options_en  = $t$["Borges","Cortázar","Sábato","Bioy Casares"]$t$::jsonb,
  context_en  = $t$Julio Cortázar published 'Hopscotch' in 1963, an experimental novel that can be read in different orders.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Rayuela"?$q$;

update public.questions set
  question_en = $t$Who wrote 'On Heroes and Tombs'?$t$,
  options_en  = $t$["Cortázar","Sábato","Bioy Casares","Borges"]$t$::jsonb,
  context_en  = $t$Ernesto Sábato published 'On Heroes and Tombs' in 1961, one of the great Argentine novels of the 20th century.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Sobre héroes y tumbas"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Tunnel'?$t$,
  options_en  = $t$["Borges","Sábato","Cortázar","Marechal"]$t$::jsonb,
  context_en  = $t$Ernesto Sábato published 'The Tunnel' in 1948. A short existentialist novel.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El túnel"?$q$;

update public.questions set
  question_en = $t$Who is Pablo Neruda?$t$,
  options_en  = $t$["A Chilean poet, Nobel 1971","A Mexican poet","An Argentine novelist","A Peruvian playwright"]$t$::jsonb,
  context_en  = $t$Pablo Neruda (1904-1973) was a Chilean poet. He won the Nobel Prize in Literature in 1971.$t$
where category = 'literatura' and question = $q$¿Quién es Pablo Neruda?$q$;

update public.questions set
  question_en = $t$Which book by Neruda contains 'Tonight I can write the saddest lines'?$t$,
  options_en  = $t$["Canto General","Twenty Love Poems","Residence on Earth","One Hundred Love Sonnets"]$t$::jsonb,
  context_en  = $t$Poem XX belongs to 'Twenty Love Poems and a Song of Despair' (1924) by Pablo Neruda.$t$
where category = 'literatura' and question = $q$¿Qué libro de Neruda contiene "Puedo escribir los versos más tristes esta noche"?$q$;

update public.questions set
  question_en = $t$Who is Gabriela Mistral?$t$,
  options_en  = $t$["A Chilean poet, the first Latin American Nobel","A Mexican politician","A Cuban novelist","A Peruvian philosopher"]$t$::jsonb,
  context_en  = $t$Gabriela Mistral (1889-1957) was the first Latin American author to win the Nobel Prize in Literature (1945).$t$
where category = 'literatura' and question = $q$¿Quién es Gabriela Mistral?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Savage Detectives'?$t$,
  options_en  = $t$["Bolaño","Vila-Matas","Volpi","Aira"]$t$::jsonb,
  context_en  = $t$Roberto Bolaño published 'The Savage Detectives' in 1998. It won the Rómulo Gallegos and the Herralde prizes.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Los detectives salvajes"?$q$;

update public.questions set
  question_en = $t$Who wrote '2666'?$t$,
  options_en  = $t$["Bolaño","Volpi","Vila-Matas","Aira"]$t$::jsonb,
  context_en  = $t$Roberto Bolaño published '2666' in 2004, posthumously. A monumental novel about the Ciudad Juárez murders.$t$
where category = 'literatura' and question = $q$¿Quién escribió "2666"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Lover' (Prix Goncourt)?$t$,
  options_en  = $t$["Duras","Yourcenar","Sagan","Beauvoir"]$t$::jsonb,
  context_en  = $t$Marguerite Duras published 'The Lover' in 1984. It won the Prix Goncourt.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El amante" (Premio Goncourt)?$q$;

update public.questions set
  question_en = $t$Who wrote 'Memoirs of Hadrian'?$t$,
  options_en  = $t$["Duras","Yourcenar","Beauvoir","Sagan"]$t$::jsonb,
  context_en  = $t$Marguerite Yourcenar published 'Memoirs of Hadrian' in 1951. The first woman in the French Academy (1980).$t$
where category = 'literatura' and question = $q$¿Quién escribió "Memorias de Adriano"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Red and the Black'?$t$,
  options_en  = $t$["Stendhal","Balzac","Hugo","Flaubert"]$t$::jsonb,
  context_en  = $t$Stendhal (Henri Beyle) published 'The Red and the Black' in 1830, a key novel of early French realism.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Rojo y negro"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Eugénie Grandet'?$t$,
  options_en  = $t$["Stendhal","Balzac","Hugo","Flaubert"]$t$::jsonb,
  context_en  = $t$Honoré de Balzac published 'Eugénie Grandet' in 1833. Part of 'La Comédie humaine'.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Eugenia Grandet"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Count of Monte Cristo'?$t$,
  options_en  = $t$["Dumas","Hugo","Sue","Balzac"]$t$::jsonb,
  context_en  = $t$Alexandre Dumas (father) published 'The Count of Monte Cristo' between 1844 and 1846.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El conde de Montecristo"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Three Musketeers'?$t$,
  options_en  = $t$["Dumas the elder","Dumas the younger","Hugo","Sue"]$t$::jsonb,
  context_en  = $t$Alexandre Dumas (father) published 'The Three Musketeers' in 1844: D'Artagnan, Athos, Porthos and Aramis.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Los tres mosqueteros"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Hunchback of Notre-Dame'?$t$,
  options_en  = $t$["Hugo","Balzac","Dumas","Stendhal"]$t$::jsonb,
  context_en  = $t$Victor Hugo published 'The Hunchback of Notre-Dame' in 1831. It stars Quasimodo and Esmeralda.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Nuestra Señora de París"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Robinson Crusoe'?$t$,
  options_en  = $t$["Defoe","Swift","Stevenson","Dickens"]$t$::jsonb,
  context_en  = $t$Daniel Defoe published 'Robinson Crusoe' in 1719. Considered one of the first modern English novels.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Robinson Crusoe"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Gulliver's Travels'?$t$,
  options_en  = $t$["Swift","Defoe","Sterne","Pope"]$t$::jsonb,
  context_en  = $t$Jonathan Swift published 'Gulliver's Travels' in 1726, a political and philosophical satire.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Los viajes de Gulliver"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Oliver Twist'?$t$,
  options_en  = $t$["Dickens","Hardy","Eliot","Trollope"]$t$::jsonb,
  context_en  = $t$Charles Dickens published 'Oliver Twist' between 1837 and 1839, about an orphan in Victorian London.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Oliver Twist"?$q$;

update public.questions set
  question_en = $t$Who wrote 'A Christmas Carol'?$t$,
  options_en  = $t$["Dickens","Hardy","Eliot","Stevenson"]$t$::jsonb,
  context_en  = $t$Charles Dickens published 'A Christmas Carol' in 1843, with Ebenezer Scrooge as the protagonist.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Cuento de Navidad"?$q$;

update public.questions set
  question_en = $t$Who wrote 'David Copperfield'?$t$,
  options_en  = $t$["Dickens","Hardy","Thackeray","Brontë"]$t$::jsonb,
  context_en  = $t$Charles Dickens published 'David Copperfield' in 1849-1850, his favorite and semi-autobiographical novel.$t$
where category = 'literatura' and question = $q$¿Quién escribió "David Copperfield"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Wuthering Heights'?$t$,
  options_en  = $t$["Emily Brontë","Charlotte Brontë","Anne Brontë","George Eliot"]$t$::jsonb,
  context_en  = $t$Emily Brontë published 'Wuthering Heights' in 1847, her only novel.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Cumbres borrascosas"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Jane Eyre'?$t$,
  options_en  = $t$["Emily Brontë","Charlotte Brontë","Anne Brontë","Jane Austen"]$t$::jsonb,
  context_en  = $t$Charlotte Brontë published 'Jane Eyre' in 1847, one of the great English novels of the 19th century.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Jane Eyre"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Sense and Sensibility'?$t$,
  options_en  = $t$["Austen","Brontë","Eliot","Gaskell"]$t$::jsonb,
  context_en  = $t$Jane Austen published 'Sense and Sensibility' in 1811, her first published novel.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Sentido y sensibilidad"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Emma'?$t$,
  options_en  = $t$["Brontë","Austen","Eliot","Gaskell"]$t$::jsonb,
  context_en  = $t$Jane Austen published 'Emma' in 1815. One of her six major novels.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Emma"?$q$;

update public.questions set
  question_en = $t$Who is Jane Austen?$t$,
  options_en  = $t$["A 19th-century English novelist","A Romantic poet","A playwright","A philosopher"]$t$::jsonb,
  context_en  = $t$Jane Austen (1775-1817) wrote 6 novels that portray the rural English society of her time.$t$
where category = 'literatura' and question = $q$¿Quién es Jane Austen?$q$;

update public.questions set
  question_en = $t$Who wrote 'Moby Dick'?$t$,
  options_en  = $t$["Twain","Melville","Hawthorne","London"]$t$::jsonb,
  context_en  = $t$Herman Melville published 'Moby Dick' in 1851. It tells of Captain Ahab's pursuit of the white whale.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Moby Dick"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Adventures of Huckleberry Finn'?$t$,
  options_en  = $t$["Twain","Melville","Hawthorne","London"]$t$::jsonb,
  context_en  = $t$Mark Twain (Samuel Clemens) published 'The Adventures of Huckleberry Finn' in 1884.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Las aventuras de Huckleberry Finn"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Adventures of Tom Sawyer'?$t$,
  options_en  = $t$["Twain","London","Hawthorne","Whitman"]$t$::jsonb,
  context_en  = $t$Mark Twain published 'The Adventures of Tom Sawyer' in 1876.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Las aventuras de Tom Sawyer"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Scarlet Letter'?$t$,
  options_en  = $t$["Hawthorne","Melville","Twain","Poe"]$t$::jsonb,
  context_en  = $t$Nathaniel Hawthorne published 'The Scarlet Letter' in 1850.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La letra escarlata"?$q$;

update public.questions set
  question_en = $t$Who is the author of 'The Black Cat' and 'The Raven'?$t$,
  options_en  = $t$["Hawthorne","Poe","Twain","Whitman"]$t$::jsonb,
  context_en  = $t$Edgar Allan Poe (1809-1849) wrote those works. A pioneer of the modern short story and horror literature.$t$
where category = 'literatura' and question = $q$¿Quién es el autor de "El gato negro" y "El cuervo"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Leaves of Grass'?$t$,
  options_en  = $t$["Whitman","Poe","Dickinson","Frost"]$t$::jsonb,
  context_en  = $t$Walt Whitman published 'Leaves of Grass' in 1855, a founding work of American poetry.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Hojas de hierba"?$q$;

update public.questions set
  question_en = $t$Who wrote 'For Whom the Bell Tolls'?$t$,
  options_en  = $t$["Hemingway","Fitzgerald","Faulkner","Steinbeck"]$t$::jsonb,
  context_en  = $t$Ernest Hemingway published 'For Whom the Bell Tolls' in 1940. Set in the Spanish Civil War.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Por quién doblan las campanas"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Old Man and the Sea'?$t$,
  options_en  = $t$["Hemingway","Faulkner","Steinbeck","Fitzgerald"]$t$::jsonb,
  context_en  = $t$Ernest Hemingway published 'The Old Man and the Sea' in 1952. It earned him the Pulitzer (1953) and the Nobel (1954).$t$
where category = 'literatura' and question = $q$¿Quién escribió "El viejo y el mar"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Sound and the Fury'?$t$,
  options_en  = $t$["Hemingway","Faulkner","Fitzgerald","Steinbeck"]$t$::jsonb,
  context_en  = $t$William Faulkner published 'The Sound and the Fury' in 1929. Nobel Prize in Literature 1949.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El sonido y la furia"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Grapes of Wrath'?$t$,
  options_en  = $t$["Hemingway","Steinbeck","Faulkner","Caldwell"]$t$::jsonb,
  context_en  = $t$John Steinbeck published 'The Grapes of Wrath' in 1939. Pulitzer 1940 and Nobel 1962.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Las uvas de la ira"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Catcher in the Rye'?$t$,
  options_en  = $t$["Salinger","Kerouac","Capote","Bellow"]$t$::jsonb,
  context_en  = $t$J.D. Salinger published 'The Catcher in the Rye' in 1951. It stars Holden Caulfield.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El guardián entre el centeno"?$q$;

update public.questions set
  question_en = $t$Who wrote 'In Cold Blood'?$t$,
  options_en  = $t$["Capote","Wolfe","Mailer","Salinger"]$t$::jsonb,
  context_en  = $t$Truman Capote published 'In Cold Blood' in 1966, a pioneer of the 'non-fiction novel'.$t$
where category = 'literatura' and question = $q$¿Quién escribió "A sangre fría"?$q$;

update public.questions set
  question_en = $t$Who wrote 'On the Road'?$t$,
  options_en  = $t$["Kerouac","Burroughs","Ginsberg","Bukowski"]$t$::jsonb,
  context_en  = $t$Jack Kerouac published 'On the Road' in 1957. A manifesto of the Beat Generation.$t$
where category = 'literatura' and question = $q$¿Quién escribió "En el camino"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Beloved'?$t$,
  options_en  = $t$["Toni Morrison","Maya Angelou","Alice Walker","Zora Neale Hurston"]$t$::jsonb,
  context_en  = $t$Toni Morrison published 'Beloved' in 1987. Pulitzer 1988. Nobel Prize in Literature 1993.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Beloved"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Color Purple'?$t$,
  options_en  = $t$["Walker","Morrison","Angelou","Hurston"]$t$::jsonb,
  context_en  = $t$Alice Walker published 'The Color Purple' in 1982. Pulitzer 1983.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El color púrpura"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Trial'?$t$,
  options_en  = $t$["Mann","Kafka","Hesse","Musil"]$t$::jsonb,
  context_en  = $t$Franz Kafka wrote 'The Trial', published posthumously in 1925 by his friend Max Brod.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El proceso"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Castle'?$t$,
  options_en  = $t$["Mann","Kafka","Hesse","Musil"]$t$::jsonb,
  context_en  = $t$Franz Kafka wrote 'The Castle', published posthumously in 1926. Unfinished.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El castillo"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Magic Mountain'?$t$,
  options_en  = $t$["Mann","Hesse","Kafka","Grass"]$t$::jsonb,
  context_en  = $t$Thomas Mann published 'The Magic Mountain' in 1924. Nobel Prize in Literature 1929.$t$
where category = 'literatura' and question = $q$¿Quién escribió "La montaña mágica"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Demian'?$t$,
  options_en  = $t$["Hesse","Mann","Grass","Böll"]$t$::jsonb,
  context_en  = $t$Hermann Hesse published 'Demian' in 1919. Nobel Prize in Literature 1946.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Demian"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Siddhartha'?$t$,
  options_en  = $t$["Hesse","Mann","Schopenhauer","Tagore"]$t$::jsonb,
  context_en  = $t$Hermann Hesse published 'Siddhartha' in 1922, about the spiritual search of a young Indian man.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Siddhartha"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Tin Drum'?$t$,
  options_en  = $t$["Grass","Böll","Mann","Hesse"]$t$::jsonb,
  context_en  = $t$Günter Grass published 'The Tin Drum' in 1959. Nobel Prize in Literature 1999.$t$
where category = 'literatura' and question = $q$¿Quién escribió "El tambor de hojalata"?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Flowers of Evil'?$t$,
  options_en  = $t$["Baudelaire","Rimbaud","Verlaine","Mallarmé"]$t$::jsonb,
  context_en  = $t$Charles Baudelaire published 'The Flowers of Evil' in 1857. It began modern poetry.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Las flores del mal"?$q$;

update public.questions set
  question_en = $t$Who wrote 'A Season in Hell'?$t$,
  options_en  = $t$["Rimbaud","Baudelaire","Verlaine","Mallarmé"]$t$::jsonb,
  context_en  = $t$Arthur Rimbaud published 'A Season in Hell' in 1873, at just 19 years old.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Una temporada en el infierno"?$q$;

update public.questions set
  question_en = $t$How many cantos does Dante's 'Divine Comedy' have?$t$,
  options_en  = $t$["33","99","100","144"]$t$::jsonb,
  context_en  = $t$'The Divine Comedy' has 100 cantos: 34 in the Inferno and 33 each in Purgatorio and Paradiso.$t$
where category = 'literatura' and question = $q$¿Cuántos cantos tiene "La divina comedia" de Dante?$q$;

update public.questions set
  question_en = $t$Who wrote 'The Brothers Karamazov'?$t$,
  options_en  = $t$["Dostoevsky","Tolstoy","Chekhov","Pushkin"]$t$::jsonb,
  context_en  = $t$Fyodor Dostoevsky published 'The Brothers Karamazov' in 1880, his last novel.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Los hermanos Karamázov"?$q$;

update public.questions set
  question_en = $t$Who wrote 'Resurrection'?$t$,
  options_en  = $t$["Tolstoy","Dostoevsky","Turgenev","Gogol"]$t$::jsonb,
  context_en  = $t$Leo Tolstoy published 'Resurrection' in 1899.$t$
where category = 'literatura' and question = $q$¿Quién escribió "Resurrección"?$q$;

update public.questions set
  question_en = $t$Which Russian author wrote 'Fathers and Sons'?$t$,
  options_en  = $t$["Tolstoy","Dostoevsky","Turgenev","Gogol"]$t$::jsonb,
  context_en  = $t$Ivan Turgenev published 'Fathers and Sons' in 1862, a key novel of Russian realism.$t$
where category = 'literatura' and question = $q$¿Qué autor ruso escribió "Padres e hijos"?$q$;


-- ── tecnologia (154) ──
update public.questions set
  question_en = $t$Who co-founded Microsoft with Paul Allen?$t$,
  options_en  = $t$["Steve Jobs","Bill Gates","Larry Page","Mark Zuckerberg"]$t$::jsonb,
  context_en  = $t$Bill Gates and Paul Allen founded Microsoft in 1975 in Albuquerque. The company moved to Redmond, Washington, in 1979.$t$
where category = 'tecnologia' and question = $q$¿Quién cofundó Microsoft con Paul Allen?$q$;

update public.questions set
  question_en = $t$What does the acronym HTTP stand for?$t$,
  options_en  = $t$["HyperText Transfer Protocol","High Transfer Text Protocol","Home Tool Transfer Protocol","Hyperlink Text Transmit Protocol"]$t$::jsonb,
  context_en  = $t$HTTP was created by Tim Berners-Lee in 1989. HTTPS adds TLS encryption on top of HTTP.$t$
where category = 'tecnologia' and question = $q$¿Qué significan las siglas HTTP?$q$;

update public.questions set
  question_en = $t$In what year was the first iPhone released?$t$,
  options_en  = $t$["2005","2007","2009","2010"]$t$::jsonb,
  context_en  = $t$Steve Jobs unveiled the first iPhone on 9 January 2007 and it went on sale on 29 June that year.$t$
where category = 'tecnologia' and question = $q$¿En qué año se lanzó el primer iPhone?$q$;

update public.questions set
  question_en = $t$Who is considered the inventor of the World Wide Web?$t$,
  options_en  = $t$["Vint Cerf","Tim Berners-Lee","Tim Cook","Linus Torvalds"]$t$::jsonb,
  context_en  = $t$Tim Berners-Lee proposed the WWW in 1989 at CERN. The first website (info.cern.ch) is still accessible.$t$
where category = 'tecnologia' and question = $q$¿Quién es considerado el inventor de la World Wide Web?$q$;

update public.questions set
  question_en = $t$Which company created the Android operating system?$t$,
  options_en  = $t$["Apple","Google","Microsoft","Samsung"]$t$::jsonb,
  context_en  = $t$Android Inc. was founded in 2003 and bought by Google in 2005. The first public version came out in 2008.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el sistema operativo Android?$q$;

update public.questions set
  question_en = $t$Which company makes the 'Ryzen' processor?$t$,
  options_en  = $t$["Intel","AMD","NVIDIA","Qualcomm"]$t$::jsonb,
  context_en  = $t$AMD launched the Ryzen line in 2017 based on its Zen architecture. It competed head-to-head with Intel after years of the rival's dominance.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa fabrica el procesador "Ryzen"?$q$;

update public.questions set
  question_en = $t$Who founded Tesla and SpaceX?$t$,
  options_en  = $t$["Jeff Bezos","Bill Gates","Elon Musk","Larry Page"]$t$::jsonb,
  context_en  = $t$Elon Musk co-founded PayPal, SpaceX (2002) and joined as CEO of Tesla in 2008. He also founded Neuralink and The Boring Company.$t$
where category = 'tecnologia' and question = $q$¿Quién fundó Tesla y SpaceX?$q$;

update public.questions set
  question_en = $t$How many bits make up a byte?$t$,
  options_en  = $t$["4","8","16","32"]$t$::jsonb,
  context_en  = $t$A byte has 8 bits. It is the basic unit of information in computing. It allows 256 different values (2^8).$t$
where category = 'tecnologia' and question = $q$¿Cuántos bits forman un byte?$q$;

update public.questions set
  question_en = $t$Which programming language did James Gosling create?$t$,
  options_en  = $t$["C","Python","Java","Ruby"]$t$::jsonb,
  context_en  = $t$James Gosling designed Java at Sun Microsystems in 1995. Its slogan: 'Write once, run anywhere' thanks to the JVM.$t$
where category = 'tecnologia' and question = $q$¿Qué lenguaje de programación creó James Gosling?$q$;

update public.questions set
  question_en = $t$Which company created the iOS operating system?$t$,
  options_en  = $t$["Google","Microsoft","Apple","Nokia"]$t$::jsonb,
  context_en  = $t$Apple launched iOS (originally iPhone OS) with the first iPhone in 2007. It is proprietary and exclusive to Apple devices.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el sistema operativo iOS?$q$;

update public.questions set
  question_en = $t$What does CPU stand for?$t$,
  options_en  = $t$["Central Processing Unit","Computer Personal Unit","Control Process Unit","Core Power Unit"]$t$::jsonb,
  context_en  = $t$CPU = Central Processing Unit. It is the brain of the computer that executes program instructions.$t$
where category = 'tecnologia' and question = $q$¿Qué significa CPU?$q$;

update public.questions set
  question_en = $t$Who founded Facebook?$t$,
  options_en  = $t$["Sergey Brin","Mark Zuckerberg","Jack Dorsey","Reid Hoffman"]$t$::jsonb,
  context_en  = $t$Mark Zuckerberg founded Facebook in 2004 from his room at Harvard, along with Eduardo Saverin and other classmates.$t$
where category = 'tecnologia' and question = $q$¿Quién fundó Facebook?$q$;

update public.questions set
  question_en = $t$In what year was Google founded?$t$,
  options_en  = $t$["1995","1998","2000","2003"]$t$::jsonb,
  context_en  = $t$Larry Page and Sergey Brin founded Google in September 1998 in Menlo Park, California. It was initially called 'Backrub'.$t$
where category = 'tecnologia' and question = $q$¿Qué año se fundó Google?$q$;

update public.questions set
  question_en = $t$Which protocol is used to send emails?$t$,
  options_en  = $t$["FTP","SMTP","HTTP","SSH"]$t$::jsonb,
  context_en  = $t$SMTP (Simple Mail Transfer Protocol) sends emails. POP3 and IMAP retrieve them from the server.$t$
where category = 'tecnologia' and question = $q$¿Qué protocolo se usa para enviar correos electrónicos?$q$;

update public.questions set
  question_en = $t$What was the first web browser?$t$,
  options_en  = $t$["Mosaic","Netscape","WorldWideWeb","Internet Explorer"]$t$::jsonb,
  context_en  = $t$Tim Berners-Lee created 'WorldWideWeb' in 1990 (later renamed Nexus). Mosaic (1993) popularized inline images.$t$
where category = 'tecnologia' and question = $q$¿Cuál fue el primer navegador web?$q$;

update public.questions set
  question_en = $t$Which language did Guido van Rossum create?$t$,
  options_en  = $t$["Java","Python","Ruby","PHP"]$t$::jsonb,
  context_en  = $t$Guido van Rossum created Python in 1991. It is one of the most-used languages, especially in AI, data science and education.$t$
where category = 'tecnologia' and question = $q$¿Qué lenguaje crearon Guido van Rossum?$q$;

update public.questions set
  question_en = $t$Which company created the M1 chip for Mac?$t$,
  options_en  = $t$["Intel","AMD","Apple","Qualcomm"]$t$::jsonb,
  context_en  = $t$Apple launched the M1 chip in 2020, its first ARM processor for Mac, replacing Intel after 15 years of collaboration.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el chip M1 para Mac?$q$;

update public.questions set
  question_en = $t$What does USB stand for?$t$,
  options_en  = $t$["Universal Serial Bus","Unified System Bus","Ultra Speed Bus","User Standard Bus"]$t$::jsonb,
  context_en  = $t$USB was developed in 1996 by a consortium (Intel, Microsoft, IBM, etc.). USB-C (2014) is now the universal connector.$t$
where category = 'tecnologia' and question = $q$¿Qué significa USB?$q$;

update public.questions set
  question_en = $t$Which social network was founded by Jack Dorsey?$t$,
  options_en  = $t$["Facebook","Twitter","Instagram","LinkedIn"]$t$::jsonb,
  context_en  = $t$Jack Dorsey co-founded Twitter in 2006. The platform was renamed X in 2023 after Elon Musk's purchase.$t$
where category = 'tecnologia' and question = $q$¿Qué red social fue fundada por Jack Dorsey?$q$;

update public.questions set
  question_en = $t$Which generation of mobile networks became popular around 2020?$t$,
  options_en  = $t$["3G","4G","5G","6G"]$t$::jsonb,
  context_en  = $t$5G began commercial deployment in 2019 and became widespread in 2020-2022, promising more speed and lower latency.$t$
where category = 'tecnologia' and question = $q$¿Qué generación de móviles se popularizó alrededor de 2020?$q$;

update public.questions set
  question_en = $t$Who invented the practical electric light bulb?$t$,
  options_en  = $t$["Tesla","Edison","Faraday","Marconi"]$t$::jsonb,
  context_en  = $t$Thomas Edison patented the practical incandescent light bulb in 1879. He was not the first inventor, but the most commercial.$t$
where category = 'tecnologia' and question = $q$¿Quién inventó la bombilla eléctrica práctica?$q$;

update public.questions set
  question_en = $t$Which company created ChatGPT?$t$,
  options_en  = $t$["Google","OpenAI","Meta","Microsoft"]$t$::jsonb,
  context_en  = $t$OpenAI launched ChatGPT in November 2022. Microsoft is one of its main investors and partners (Azure).$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó ChatGPT?$q$;

update public.questions set
  question_en = $t$Which company makes GeForce GPUs?$t$,
  options_en  = $t$["AMD","Intel","NVIDIA","Qualcomm"]$t$::jsonb,
  context_en  = $t$NVIDIA has made the GeForce line since 1999. Its chips dominate the gaming and AI-training market (with its Tesla/H100).$t$
where category = 'tecnologia' and question = $q$¿Qué empresa fabrica las GPU GeForce?$q$;

update public.questions set
  question_en = $t$What does 'Wi-Fi' mean?$t$,
  options_en  = $t$["Wireless Fidelity","It's not an acronym (a brand)","Web Internet Fidelity","Wide Internet Frequency"]$t$::jsonb,
  context_en  = $t$Despite the myth, 'Wi-Fi' does not stand for 'Wireless Fidelity'. It was a brand name created by Interbrand in 1999.$t$
where category = 'tecnologia' and question = $q$¿Qué significa "Wi-Fi"?$q$;

update public.questions set
  question_en = $t$In what year was Apple founded?$t$,
  options_en  = $t$["1971","1976","1981","1984"]$t$::jsonb,
  context_en  = $t$Apple was founded by Steve Jobs, Steve Wozniak and Ronald Wayne on 1 April 1976 in California.$t$
where category = 'tecnologia' and question = $q$¿En qué año se fundó Apple?$q$;

update public.questions set
  question_en = $t$Which cryptocurrency did Satoshi Nakamoto create?$t$,
  options_en  = $t$["Ethereum","Bitcoin","Litecoin","Ripple"]$t$::jsonb,
  context_en  = $t$Bitcoin was created by the pseudonym Satoshi Nakamoto in 2009. The true identity remains a mystery.$t$
where category = 'tecnologia' and question = $q$¿Qué tipo de criptomoneda creó Satoshi Nakamoto?$q$;

update public.questions set
  question_en = $t$Which language did Brendan Eich create in 10 days?$t$,
  options_en  = $t$["Python","JavaScript","Ruby","Perl"]$t$::jsonb,
  context_en  = $t$Brendan Eich designed JavaScript in 10 days at Netscape, in 1995. It is the main language of the browser.$t$
where category = 'tecnologia' and question = $q$¿Qué lenguaje creó Brendan Eich en 10 días?$q$;

update public.questions set
  question_en = $t$Which company created the Bing search engine?$t$,
  options_en  = $t$["Google","Microsoft","Yahoo","Amazon"]$t$::jsonb,
  context_en  = $t$Microsoft launched Bing in 2009 as the successor to MSN Search/Live Search. It fights for a small share against Google.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el motor de búsqueda Bing?$q$;

update public.questions set
  question_en = $t$Which operating system did Linus Torvalds develop?$t$,
  options_en  = $t$["Unix","Linux","BSD","Solaris"]$t$::jsonb,
  context_en  = $t$Linus Torvalds released the first version of Linux in 1991, while studying at the University of Helsinki.$t$
where category = 'tecnologia' and question = $q$¿Qué sistema operativo desarrolló Linus Torvalds?$q$;

update public.questions set
  question_en = $t$How many bytes are in a kilobyte (KB) according to the SI?$t$,
  options_en  = $t$["1000","1024","2048","4096"]$t$::jsonb,
  context_en  = $t$According to the SI, 1 KB = 1,000 bytes. In computing, 1 KiB = 1,024 bytes is used. There is historical confusion in usage.$t$
where category = 'tecnologia' and question = $q$¿Cuántos bytes tiene un kilobyte (KB) según los SI?$q$;

update public.questions set
  question_en = $t$Which company created the iPad?$t$,
  options_en  = $t$["Microsoft","Apple","Samsung","Google"]$t$::jsonb,
  context_en  = $t$Apple launched the first iPad in April 2010. It defined the modern tablet format.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el iPad?$q$;

update public.questions set
  question_en = $t$Which platform did Microsoft buy in 2016 for $26 billion?$t$,
  options_en  = $t$["GitHub","LinkedIn","Slack","Skype"]$t$::jsonb,
  context_en  = $t$Microsoft bought LinkedIn for $26.2 billion in 2016. In 2018 it bought GitHub for $7.5 billion.$t$
where category = 'tecnologia' and question = $q$¿Qué plataforma compró Microsoft en 2016 por 26.000 M$?$q$;

update public.questions set
  question_en = $t$What type of storage are SSDs?$t$,
  options_en  = $t$["Magnetic","Optical","Flash","Holographic"]$t$::jsonb,
  context_en  = $t$SSDs (Solid State Drives) use NAND flash memory. They are much faster than HDDs (mechanical disks).$t$
where category = 'tecnologia' and question = $q$¿Qué tipo de almacenamiento son los SSD?$q$;

update public.questions set
  question_en = $t$Which company created Photoshop?$t$,
  options_en  = $t$["Microsoft","Adobe","Corel","Autodesk"]$t$::jsonb,
  context_en  = $t$Adobe launched Photoshop in 1990. It is the industry standard for raster image editing.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Photoshop?$q$;

update public.questions set
  question_en = $t$Who founded Amazon?$t$,
  options_en  = $t$["Jeff Bezos","Larry Ellison","Mark Cuban","Peter Thiel"]$t$::jsonb,
  context_en  = $t$Jeff Bezos founded Amazon in 1994 in Seattle, initially as an online bookstore. He handed the CEO role to Andy Jassy in 2021.$t$
where category = 'tecnologia' and question = $q$¿Quién fundó Amazon?$q$;

update public.questions set
  question_en = $t$What technology does blockchain use?$t$,
  options_en  = $t$["Centralization","Symmetric encryption","A distributed chain of blocks","FAT tokens"]$t$::jsonb,
  context_en  = $t$Blockchain is a distributed ledger of cryptographically linked blocks. It is the basis of Bitcoin and many cryptocurrencies.$t$
where category = 'tecnologia' and question = $q$¿Qué tecnología usa el blockchain?$q$;

update public.questions set
  question_en = $t$Which company created WhatsApp?$t$,
  options_en  = $t$["Meta (Facebook)","WhatsApp Inc.","Google","Twitter"]$t$::jsonb,
  context_en  = $t$WhatsApp Inc. was founded in 2009 by Jan Koum and Brian Acton. Facebook (now Meta) bought it in 2014 for $19 billion.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó WhatsApp?$q$;

update public.questions set
  question_en = $t$In what year was Windows 95 released?$t$,
  options_en  = $t$["1991","1993","1995","1998"]$t$::jsonb,
  context_en  = $t$Microsoft released Windows 95 on 24 August 1995. It introduced the Start menu and revolutionized the desktop.$t$
where category = 'tecnologia' and question = $q$¿Qué año se lanzó Windows 95?$q$;

update public.questions set
  question_en = $t$Which company created the DuckDuckGo search engine?$t$,
  options_en  = $t$["DuckDuckGo Inc.","Google","Microsoft","Yahoo"]$t$::jsonb,
  context_en  = $t$DuckDuckGo was founded by Gabriel Weinberg in 2008. It stands out for not tracking users' searches.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el motor de búsqueda DuckDuckGo?$q$;

update public.questions set
  question_en = $t$Which protocol does most modern websites use?$t$,
  options_en  = $t$["HTTP","HTTPS","FTP","SSH"]$t$::jsonb,
  context_en  = $t$HTTPS (HTTP over TLS) encrypts traffic. Since 2018 most websites use it; browsers warn if a site is HTTP-only.$t$
where category = 'tecnologia' and question = $q$¿Qué protocolo usa la mayoría de webs modernas?$q$;

update public.questions set
  question_en = $t$Which company created the Swift language?$t$,
  options_en  = $t$["Google","Apple","Microsoft","Oracle"]$t$::jsonb,
  context_en  = $t$Apple introduced Swift in 2014, at WWDC. It progressively replaced Objective-C in iOS/macOS development.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el lenguaje Swift?$q$;

update public.questions set
  question_en = $t$In what year was YouTube founded?$t$,
  options_en  = $t$["2003","2005","2007","2009"]$t$::jsonb,
  context_en  = $t$YouTube was founded by Chad Hurley, Steve Chen and Jawed Karim in February 2005. Google bought it in 2006 for $1.65 billion.$t$
where category = 'tecnologia' and question = $q$¿En qué año se fundó YouTube?$q$;

update public.questions set
  question_en = $t$What is measured in MHz/GHz in a processor?$t$,
  options_en  = $t$["Memory","Clock frequency","Voltage","Size"]$t$::jsonb,
  context_en  = $t$The clock frequency indicates cycles per second (1 GHz = 1 billion). Along with the IPC, it determines performance.$t$
where category = 'tecnologia' and question = $q$¿Qué se mide en MHz/GHz en un procesador?$q$;

update public.questions set
  question_en = $t$Which TCP/IP network preceded the modern Internet?$t$,
  options_en  = $t$["BBS","Usenet","ARPANET","Intranet"]$t$::jsonb,
  context_en  = $t$ARPANET was developed by DARPA (U.S.) from 1969. It connected the first universities and evolved into the Internet in the 1980s.$t$
where category = 'tecnologia' and question = $q$¿Qué red TCP/IP precedió al Internet moderno?$q$;

update public.questions set
  question_en = $t$Which company created the PlayStation console?$t$,
  options_en  = $t$["Nintendo","Sony","Microsoft","Sega"]$t$::jsonb,
  context_en  = $t$Sony launched the first PlayStation in 1994. It was originally a joint project with Nintendo that fell apart.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó la consola PlayStation?$q$;

update public.questions set
  question_en = $t$Which company tried to acquire ARM in 2020 (deal ultimately canceled)?$t$,
  options_en  = $t$["Apple","NVIDIA","Qualcomm","Samsung"]$t$::jsonb,
  context_en  = $t$NVIDIA announced in 2020 the purchase of ARM for $40 billion. The deal was canceled in 2022 over regulatory hurdles.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa adquirió ARM en 2020 (operación finalmente cancelada)?$q$;

update public.questions set
  question_en = $t$Which language did Dennis Ritchie create in the 70s?$t$,
  options_en  = $t$["B","C","Pascal","Fortran"]$t$::jsonb,
  context_en  = $t$Dennis Ritchie created C at Bell Labs in 1972. It is one of the most influential languages; the parent of C++, C#, Objective-C, etc.$t$
where category = 'tecnologia' and question = $q$¿Qué lenguaje creó Dennis Ritchie en los 70?$q$;

update public.questions set
  question_en = $t$Which company created Slack?$t$,
  options_en  = $t$["Slack Technologies","Microsoft","Atlassian","Google"]$t$::jsonb,
  context_en  = $t$Slack was founded by Stewart Butterfield in 2013. Salesforce bought it in 2021 for $27.7 billion.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Slack?$q$;

update public.questions set
  question_en = $t$Which project aimed to map all human genes?$t$,
  options_en  = $t$["The Human Genome Project","Apollo","Mars","CRISPR"]$t$::jsonb,
  context_en  = $t$The Human Genome Project (1990-2003) sequenced the ~3 billion base pairs of human DNA.$t$
where category = 'tecnologia' and question = $q$¿Qué proyecto buscaba mapear todos los genes humanos?$q$;

update public.questions set
  question_en = $t$Which company created the Unreal Engine graphics engine?$t$,
  options_en  = $t$["Unity Technologies","Epic Games","Valve","Crytek"]$t$::jsonb,
  context_en  = $t$Epic Games has developed Unreal Engine since 1998. Version 5 (2022) leads the industry in graphical realism.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el motor gráfico Unreal Engine?$q$;

update public.questions set
  question_en = $t$Which company created the Snapdragon chip?$t$,
  options_en  = $t$["Intel","Qualcomm","Samsung","MediaTek"]$t$::jsonb,
  context_en  = $t$Qualcomm makes the Snapdragon chips, present in many Android smartphones.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el chip Snapdragon?$q$;

update public.questions set
  question_en = $t$Which company created the Core i7 processor?$t$,
  options_en  = $t$["AMD","Intel","Qualcomm","ARM"]$t$::jsonb,
  context_en  = $t$Intel launched the Core i7 processors in 2008 as its high-end range for PCs.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el procesador Core i7?$q$;

update public.questions set
  question_en = $t$What does 'RAM' stand for?$t$,
  options_en  = $t$["Random Access Memory","Read Always Memory","Rapid Active Memory","Read Access Memory"]$t$::jsonb,
  context_en  = $t$RAM stands for 'Random Access Memory'. It stores data temporarily while the device is on.$t$
where category = 'tecnologia' and question = $q$¿Qué significa "RAM"?$q$;

update public.questions set
  question_en = $t$What does 'GPU' stand for?$t$,
  options_en  = $t$["General Processing Unit","Graphics Processing Unit","Global Processing Unit","Grand Processing Unit"]$t$::jsonb,
  context_en  = $t$GPU stands for 'Graphics Processing Unit'. A processor specialized in graphics calculations and, today, AI.$t$
where category = 'tecnologia' and question = $q$¿Qué significa "GPU"?$q$;

update public.questions set
  question_en = $t$Which technology enables OLED screens?$t$,
  options_en  = $t$["Organic LEDs","Plasma","Liquid crystal","Electronic ink"]$t$::jsonb,
  context_en  = $t$OLEDs are organic light-emitting diodes. Each pixel emits its own light, without needing a backlight.$t$
where category = 'tecnologia' and question = $q$¿Qué tecnología permite las pantallas OLED?$q$;

update public.questions set
  question_en = $t$Which company created the Steam video game platform?$t$,
  options_en  = $t$["EA","Valve","Activision","Microsoft"]$t$::jsonb,
  context_en  = $t$Valve created Steam in 2003. It is the largest video game distribution platform for PC.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó la plataforma de videojuegos Steam?$q$;

update public.questions set
  question_en = $t$Who created Linux?$t$,
  options_en  = $t$["Richard Stallman","Linus Torvalds","Steve Jobs","Bill Gates"]$t$::jsonb,
  context_en  = $t$Linus Torvalds created the Linux kernel in 1991, as a student in Helsinki. He distributed it as free software.$t$
where category = 'tecnologia' and question = $q$¿Quién creó Linux?$q$;

update public.questions set
  question_en = $t$What is GNU?$t$,
  options_en  = $t$["A free operating system","A hardware company","A programming language","A telecommunications company"]$t$::jsonb,
  context_en  = $t$GNU is a free-software project started by Richard Stallman in 1983. It inspired the free-software movement.$t$
where category = 'tecnologia' and question = $q$¿Qué es GNU?$q$;

update public.questions set
  question_en = $t$Which company created the Go language?$t$,
  options_en  = $t$["Apple","Google","Microsoft","Mozilla"]$t$::jsonb,
  context_en  = $t$Google created the Go language in 2009. Designed by Robert Griesemer, Rob Pike and Ken Thompson.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el lenguaje Go?$q$;

update public.questions set
  question_en = $t$Which company created the Kotlin language?$t$,
  options_en  = $t$["JetBrains","Google","Microsoft","Apple"]$t$::jsonb,
  context_en  = $t$Kotlin was created by JetBrains in 2011. Google adopted it as the preferred language for Android in 2019.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el lenguaje Kotlin?$q$;

update public.questions set
  question_en = $t$Which company created the C# language?$t$,
  options_en  = $t$["Microsoft","Sun","IBM","Google"]$t$::jsonb,
  context_en  = $t$Microsoft created C# (C Sharp) in 2000 as part of the .NET platform, led by Anders Hejlsberg.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el lenguaje C#?$q$;

update public.questions set
  question_en = $t$Which company created the Java language?$t$,
  options_en  = $t$["Sun Microsystems","Microsoft","IBM","Oracle"]$t$::jsonb,
  context_en  = $t$Sun Microsystems created Java in 1995. Sun was acquired by Oracle in 2010.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el lenguaje Java?$q$;

update public.questions set
  question_en = $t$Which company acquired Sun Microsystems?$t$,
  options_en  = $t$["Microsoft","Oracle","IBM","HP"]$t$::jsonb,
  context_en  = $t$Oracle bought Sun Microsystems in 2010 for about $7.4 billion.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa adquirió Sun Microsystems?$q$;

update public.questions set
  question_en = $t$Which social network did Facebook (Meta) buy in 2012?$t$,
  options_en  = $t$["WhatsApp","Snapchat","Instagram","Tumblr"]$t$::jsonb,
  context_en  = $t$Facebook (now Meta) bought Instagram in 2012 for $1 billion.$t$
where category = 'tecnologia' and question = $q$¿Qué red social compró Facebook (Meta) en 2012?$q$;

update public.questions set
  question_en = $t$Which company bought Twitter in 2022?$t$,
  options_en  = $t$["Microsoft","Apple","Elon Musk","Google"]$t$::jsonb,
  context_en  = $t$Elon Musk completed the purchase of Twitter in October 2022 for about $44 billion. He renamed it 'X' in 2023.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa compró Twitter en 2022?$q$;

update public.questions set
  question_en = $t$What has Twitter been called since 2023?$t$,
  options_en  = $t$["Bluesky","Threads","X","Mastodon"]$t$::jsonb,
  context_en  = $t$Elon Musk renamed Twitter to 'X' in July 2023.$t$
where category = 'tecnologia' and question = $q$¿Cómo se llama Twitter desde 2023?$q$;

update public.questions set
  question_en = $t$In what year was Facebook founded?$t$,
  options_en  = $t$["2002","2004","2006","2008"]$t$::jsonb,
  context_en  = $t$Facebook was founded in February 2004 by Mark Zuckerberg and other Harvard students.$t$
where category = 'tecnologia' and question = $q$¿Qué año se fundó Facebook?$q$;

update public.questions set
  question_en = $t$What has Facebook been officially called as a company since 2021?$t$,
  options_en  = $t$["Meta","Alphabet","X","Open"]$t$::jsonb,
  context_en  = $t$Facebook Inc. changed its corporate name to Meta Platforms in October 2021.$t$
where category = 'tecnologia' and question = $q$¿Cómo se llama oficialmente Facebook como empresa desde 2021?$q$;

update public.questions set
  question_en = $t$What has Google's parent company been called since 2015?$t$,
  options_en  = $t$["Meta","Alphabet","X","Open"]$t$::jsonb,
  context_en  = $t$Google reorganized under Alphabet Inc. in 2015. Sundar Pichai is CEO of Google and Alphabet.$t$
where category = 'tecnologia' and question = $q$¿Cómo se llama la matriz de Google desde 2015?$q$;

update public.questions set
  question_en = $t$Who is the CEO of Microsoft (as of 2024)?$t$,
  options_en  = $t$["Bill Gates","Steve Ballmer","Satya Nadella","Sundar Pichai"]$t$::jsonb,
  context_en  = $t$Satya Nadella has been CEO of Microsoft since February 2014.$t$
where category = 'tecnologia' and question = $q$¿Quién es el CEO de Microsoft (a 2024)?$q$;

update public.questions set
  question_en = $t$Who was the first CEO of Apple after Steve Jobs's death?$t$,
  options_en  = $t$["Tim Cook","Jonathan Ive","Steve Wozniak","Phil Schiller"]$t$::jsonb,
  context_en  = $t$Tim Cook succeeded Steve Jobs as CEO of Apple in August 2011.$t$
where category = 'tecnologia' and question = $q$¿Quién fue el primer CEO de Apple tras la muerte de Steve Jobs?$q$;

update public.questions set
  question_en = $t$In what year did Steve Jobs die?$t$,
  options_en  = $t$["2009","2010","2011","2012"]$t$::jsonb,
  context_en  = $t$Steve Jobs died on 5 October 2011 at age 56, due to pancreatic cancer.$t$
where category = 'tecnologia' and question = $q$¿En qué año murió Steve Jobs?$q$;

update public.questions set
  question_en = $t$Which company created the Xbox console?$t$,
  options_en  = $t$["Sony","Microsoft","Nintendo","Sega"]$t$::jsonb,
  context_en  = $t$Microsoft launched the first Xbox in 2001. It currently sells the Xbox Series X/S (2020).$t$
where category = 'tecnologia' and question = $q$¿Qué compañía creó la consola Xbox?$q$;

update public.questions set
  question_en = $t$Which company created the Nintendo Switch console?$t$,
  options_en  = $t$["Sony","Microsoft","Nintendo","Sega"]$t$::jsonb,
  context_en  = $t$Nintendo launched the Switch in March 2017. A hybrid between home console and handheld.$t$
where category = 'tecnologia' and question = $q$¿Qué compañía creó la consola Nintendo Switch?$q$;

update public.questions set
  question_en = $t$Which company created the game Minecraft?$t$,
  options_en  = $t$["Microsoft","Mojang","Epic","Sony"]$t$::jsonb,
  context_en  = $t$Markus Persson and his company Mojang created Minecraft. Microsoft bought Mojang in 2014 for $2.5 billion.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el videojuego Minecraft?$q$;

update public.questions set
  question_en = $t$Which company created Fortnite?$t$,
  options_en  = $t$["Microsoft","Epic Games","Activision","Sony"]$t$::jsonb,
  context_en  = $t$Epic Games developed Fortnite, released in 2017. It is one of the most popular video games in history.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Fortnite?$q$;

update public.questions set
  question_en = $t$Which company created the Unity engine?$t$,
  options_en  = $t$["Unreal","Unity Technologies","Epic","Crytek"]$t$::jsonb,
  context_en  = $t$Unity Technologies (Denmark) created the Unity engine, released in 2005. Very popular for mobile games.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el motor Unity?$q$;

update public.questions set
  question_en = $t$Which company created GTA?$t$,
  options_en  = $t$["Rockstar Games","EA","Ubisoft","2K"]$t$::jsonb,
  context_en  = $t$Rockstar Games has developed the 'Grand Theft Auto' saga since 1997.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó GTA?$q$;

update public.questions set
  question_en = $t$Who is the owner of OpenAI?$t$,
  options_en  = $t$["Microsoft (in part)","Google","Meta","Apple"]$t$::jsonb,
  context_en  = $t$OpenAI is a private company in which Microsoft has invested more than $13 billion. Sam Altman is its CEO.$t$
where category = 'tecnologia' and question = $q$¿Quién es el dueño de OpenAI?$q$;

update public.questions set
  question_en = $t$Who is the CEO of OpenAI (as of 2024)?$t$,
  options_en  = $t$["Elon Musk","Sam Altman","Greg Brockman","Ilya Sutskever"]$t$::jsonb,
  context_en  = $t$Sam Altman is the CEO of OpenAI. He was briefly ousted in November 2023 and reinstated a few days later.$t$
where category = 'tecnologia' and question = $q$¿Quién es el CEO de OpenAI (a 2024)?$q$;

update public.questions set
  question_en = $t$What type of AI is ChatGPT?$t$,
  options_en  = $t$["Generative, based on an LLM","Image recognition","Robotics","Search only"]$t$::jsonb,
  context_en  = $t$ChatGPT is a generative AI based on GPT LLMs (Large Language Models) developed by OpenAI.$t$
where category = 'tecnologia' and question = $q$¿Qué tipo de IA es ChatGPT?$q$;

update public.questions set
  question_en = $t$What does 'LLM' stand for?$t$,
  options_en  = $t$["Large Linear Method","Large Language Model","Logic Learning Machine","Linear Layer Model"]$t$::jsonb,
  context_en  = $t$LLM stands for Large Language Model: a language model trained on large amounts of text.$t$
where category = 'tecnologia' and question = $q$¿Qué significa "LLM"?$q$;

update public.questions set
  question_en = $t$Which company created Gemini (formerly Bard)?$t$,
  options_en  = $t$["OpenAI","Microsoft","Google","Anthropic"]$t$::jsonb,
  context_en  = $t$Google created Gemini (renamed from Bard in 2024), its conversational AI assistant.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Gemini (anteriormente Bard)?$q$;

update public.questions set
  question_en = $t$Which company created Claude?$t$,
  options_en  = $t$["OpenAI","Anthropic","Google","Meta"]$t$::jsonb,
  context_en  = $t$Anthropic, founded by former OpenAI employees, created the Claude family of models.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Claude?$q$;

update public.questions set
  question_en = $t$Which company created LLaMA?$t$,
  options_en  = $t$["OpenAI","Meta","Google","Anthropic"]$t$::jsonb,
  context_en  = $t$Meta launched LLaMA in 2023, its open language models for research.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó LLaMA?$q$;

update public.questions set
  question_en = $t$How many GB are in a terabyte?$t$,
  options_en  = $t$["100","1,000","1,024","10,000"]$t$::jsonb,
  context_en  = $t$In decimal notation (SI), 1 TB = 1,000 GB. In binary (IEC), 1 TiB = 1,024 GiB.$t$
where category = 'tecnologia' and question = $q$¿Cuántos GB tiene un terabyte?$q$;

update public.questions set
  question_en = $t$How many bytes are in a megabyte (SI)?$t$,
  options_en  = $t$["1,000","100,000","1,000,000","1,048,576"]$t$::jsonb,
  context_en  = $t$According to the SI, 1 MB = 1,000,000 bytes. In binary (MiB), 1 MiB = 1,048,576 bytes.$t$
where category = 'tecnologia' and question = $q$¿Cuántos bytes tiene un megabyte (SI)?$q$;

update public.questions set
  question_en = $t$Which protocol is used to transfer files?$t$,
  options_en  = $t$["HTTP","FTP","SMTP","DNS"]$t$::jsonb,
  context_en  = $t$FTP (File Transfer Protocol) is the classic protocol for file transfer. Today SFTP is used more.$t$
where category = 'tecnologia' and question = $q$¿Qué protocolo se usa para transferir archivos?$q$;

update public.questions set
  question_en = $t$Which protocol is used for secure email?$t$,
  options_en  = $t$["POP3","SMTPS","IMAPS","All of the above"]$t$::jsonb,
  context_en  = $t$POP3S, SMTPS and IMAPS are the secure versions (with TLS) of the mail protocols.$t$
where category = 'tecnologia' and question = $q$¿Qué protocolo se usa para correos seguros?$q$;

update public.questions set
  question_en = $t$What does DNS stand for?$t$,
  options_en  = $t$["Domain Name System","Direct Network Service","Data Name Server","Dynamic Net System"]$t$::jsonb,
  context_en  = $t$DNS (Domain Name System) translates domain names (like example.com) into IP addresses.$t$
where category = 'tecnologia' and question = $q$¿Qué significa DNS?$q$;

update public.questions set
  question_en = $t$Which company created the PlayStation 5 console?$t$,
  options_en  = $t$["Microsoft","Sony","Nintendo","Sega"]$t$::jsonb,
  context_en  = $t$Sony launched the PlayStation 5 in November 2020.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó la consola PlayStation 5?$q$;

update public.questions set
  question_en = $t$Which company owns YouTube?$t$,
  options_en  = $t$["Microsoft","Google","Meta","Amazon"]$t$::jsonb,
  context_en  = $t$Google bought YouTube in 2006 for $1.65 billion in shares.$t$
where category = 'tecnologia' and question = $q$¿Qué compañía es propietaria de YouTube?$q$;

update public.questions set
  question_en = $t$When did Microsoft release Windows 11?$t$,
  options_en  = $t$["2019","2020","2021","2022"]$t$::jsonb,
  context_en  = $t$Microsoft released Windows 11 on 5 October 2021.$t$
where category = 'tecnologia' and question = $q$¿Cuándo lanzó Microsoft Windows 11?$q$;

update public.questions set
  question_en = $t$How many bits does the x64 architecture have?$t$,
  options_en  = $t$["32","64","128","256"]$t$::jsonb,
  context_en  = $t$The x64 architecture (also AMD64 or x86-64) is 64-bit.$t$
where category = 'tecnologia' and question = $q$¿Cuántos bits tiene la arquitectura x64?$q$;

update public.questions set
  question_en = $t$Which company created the GeForce RTX GPU?$t$,
  options_en  = $t$["AMD","NVIDIA","Intel","Qualcomm"]$t$::jsonb,
  context_en  = $t$NVIDIA launched the GeForce RTX family in 2018, with the first Turing architecture.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó la GPU GeForce RTX?$q$;

update public.questions set
  question_en = $t$Which company created the Radeon GPUs?$t$,
  options_en  = $t$["NVIDIA","AMD","Intel","ATI/AMD"]$t$::jsonb,
  context_en  = $t$ATI launched the Radeon line in 2000. AMD bought ATI in 2006 and keeps the brand.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó las GPU Radeon?$q$;

update public.questions set
  question_en = $t$How many pins does a Type A HDMI connector have?$t$,
  options_en  = $t$["15","17","19","21"]$t$::jsonb,
  context_en  = $t$A Type A HDMI connector (standard) has 19 pins.$t$
where category = 'tecnologia' and question = $q$¿Cuántos pines tiene un conector HDMI tipo A?$q$;

update public.questions set
  question_en = $t$In what year was USB-C launched?$t$,
  options_en  = $t$["2012","2014","2016","2018"]$t$::jsonb,
  context_en  = $t$The USB-C standard was finalized in August 2014.$t$
where category = 'tecnologia' and question = $q$¿Qué año se lanzó el USB-C?$q$;

update public.questions set
  question_en = $t$Which company originally created Photoshop?$t$,
  options_en  = $t$["Adobe (bought it)","The Knoll brothers","Microsoft","Apple"]$t$::jsonb,
  context_en  = $t$Thomas and John Knoll created Photoshop. Adobe licensed it in 1988 and bought the code in 1995.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Photoshop originalmente?$q$;

update public.questions set
  question_en = $t$Which company created the PDF format?$t$,
  options_en  = $t$["Microsoft","Adobe","Apple","Sun"]$t$::jsonb,
  context_en  = $t$Adobe created the PDF format (Portable Document Format) in 1993. It has been an ISO standard since 2008.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el formato PDF?$q$;

update public.questions set
  question_en = $t$Who is Tim Berners-Lee?$t$,
  options_en  = $t$["The inventor of the WWW","A co-founder of Google","The creator of Linux","The founder of Microsoft"]$t$::jsonb,
  context_en  = $t$Tim Berners-Lee invented the World Wide Web in 1989 while working at CERN.$t$
where category = 'tecnologia' and question = $q$¿Quién es Tim Berners-Lee?$q$;

update public.questions set
  question_en = $t$At which institution did Berners-Lee work when he invented the web?$t$,
  options_en  = $t$["MIT","CERN","Stanford","NASA"]$t$::jsonb,
  context_en  = $t$Tim Berners-Lee invented the World Wide Web at CERN (Switzerland) in 1989. The first website was published in 1991.$t$
where category = 'tecnologia' and question = $q$¿En qué institución trabajaba Berners-Lee cuando inventó la web?$q$;

update public.questions set
  question_en = $t$Which language does the web use to structure content?$t$,
  options_en  = $t$["JavaScript","HTML","CSS","SQL"]$t$::jsonb,
  context_en  = $t$HTML (HyperText Markup Language) is the markup language that structures web pages.$t$
where category = 'tecnologia' and question = $q$¿Qué lenguaje usa la web para estructurar contenido?$q$;

update public.questions set
  question_en = $t$Which language styles web pages?$t$,
  options_en  = $t$["HTML","CSS","JavaScript","PHP"]$t$::jsonb,
  context_en  = $t$CSS (Cascading Style Sheets) describes the presentation of an HTML page.$t$
where category = 'tecnologia' and question = $q$¿Qué lenguaje da estilo a las páginas web?$q$;

update public.questions set
  question_en = $t$Which language adds interactivity to web pages?$t$,
  options_en  = $t$["HTML","CSS","JavaScript","Python"]$t$::jsonb,
  context_en  = $t$JavaScript, created by Brendan Eich in 1995, is the main programming language of the web.$t$
where category = 'tecnologia' and question = $q$¿Qué lenguaje añade interactividad a las páginas web?$q$;

update public.questions set
  question_en = $t$Which JavaScript framework did Facebook create?$t$,
  options_en  = $t$["Angular","React","Vue","Svelte"]$t$::jsonb,
  context_en  = $t$Facebook (now Meta) created React in 2013, a JavaScript library for building user interfaces.$t$
where category = 'tecnologia' and question = $q$¿Qué framework de JavaScript creó Facebook?$q$;

update public.questions set
  question_en = $t$Which JavaScript framework did Google create?$t$,
  options_en  = $t$["React","Angular","Vue","Ember"]$t$::jsonb,
  context_en  = $t$Google created Angular (originally AngularJS in 2010, and a rewritten Angular in 2016).$t$
where category = 'tecnologia' and question = $q$¿Qué framework de JavaScript creó Google?$q$;

update public.questions set
  question_en = $t$Who created Node.js?$t$,
  options_en  = $t$["Ryan Dahl (creator)","Microsoft","Google","Facebook"]$t$::jsonb,
  context_en  = $t$Ryan Dahl created Node.js in 2009. It allows running JavaScript outside the browser, on the server.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Node.js?$q$;

update public.questions set
  question_en = $t$Which company created TypeScript?$t$,
  options_en  = $t$["Google","Microsoft","Mozilla","Apple"]$t$::jsonb,
  context_en  = $t$Microsoft created TypeScript in 2012. It is a superset of JavaScript with static typing.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó TypeScript?$q$;

update public.questions set
  question_en = $t$Which relational database does Oracle manage?$t$,
  options_en  = $t$["MySQL","PostgreSQL","Oracle DB","SQL Server"]$t$::jsonb,
  context_en  = $t$Oracle Database is the main DBMS of the Oracle company.$t$
where category = 'tecnologia' and question = $q$¿Qué base de datos relacional gestiona Oracle?$q$;

update public.questions set
  question_en = $t$Which relational database is open source and popular in web applications?$t$,
  options_en  = $t$["MySQL","SQL Server","Oracle DB","Db2"]$t$::jsonb,
  context_en  = $t$MySQL is one of the most popular DBMSs in web applications. It has been owned by Oracle since 2010.$t$
where category = 'tecnologia' and question = $q$¿Qué base de datos relacional es de código abierto y popular en aplicaciones web?$q$;

update public.questions set
  question_en = $t$What type of database is MongoDB?$t$,
  options_en  = $t$["Relational","Document NoSQL","Key-value","Graph"]$t$::jsonb,
  context_en  = $t$MongoDB is a NoSQL database oriented to JSON (BSON) documents.$t$
where category = 'tecnologia' and question = $q$¿Qué tipo de base de datos es MongoDB?$q$;

update public.questions set
  question_en = $t$Which company created Kubernetes?$t$,
  options_en  = $t$["Microsoft","Google","Red Hat","Docker"]$t$::jsonb,
  context_en  = $t$Google created Kubernetes (K8s) and released it as open source in 2014. Now it is maintained by the CNCF.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Kubernetes?$q$;

update public.questions set
  question_en = $t$Which company created Docker?$t$,
  options_en  = $t$["Docker Inc.","Google","Microsoft","Red Hat"]$t$::jsonb,
  context_en  = $t$Docker Inc. (formerly dotCloud) created Docker in 2013, popularizing containerization.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Docker?$q$;

update public.questions set
  question_en = $t$Which company created Android?$t$,
  options_en  = $t$["Google","Android Inc. (then Google)","Samsung","HTC"]$t$::jsonb,
  context_en  = $t$Android Inc. founded the platform in 2003. Google bought Android Inc. in 2005 and launched the system in 2008.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Android?$q$;

update public.questions set
  question_en = $t$Which company created iOS?$t$,
  options_en  = $t$["Apple","Microsoft","Google","Nokia"]$t$::jsonb,
  context_en  = $t$Apple created iOS (originally 'iPhone OS') in 2007, along with the first iPhone.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó iOS?$q$;

update public.questions set
  question_en = $t$Which company created macOS?$t$,
  options_en  = $t$["Apple","Microsoft","Google","NeXT/Apple"]$t$::jsonb,
  context_en  = $t$Apple created macOS (formerly Mac OS X), based in part on the NeXTSTEP system that Apple acquired in 1997.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó macOS?$q$;

update public.questions set
  question_en = $t$Which company created Windows?$t$,
  options_en  = $t$["IBM","Microsoft","Apple","Xerox"]$t$::jsonb,
  context_en  = $t$Microsoft launched Windows 1.0 in 1985. It is the most-used PC operating system in the world.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Windows?$q$;

update public.questions set
  question_en = $t$In what year was Windows XP released?$t$,
  options_en  = $t$["1995","2000","2001","2003"]$t$::jsonb,
  context_en  = $t$Microsoft released Windows XP in October 2001. It is one of the most successful operating systems in its history.$t$
where category = 'tecnologia' and question = $q$¿En qué año se lanzó Windows XP?$q$;

update public.questions set
  question_en = $t$What type of memory is EEPROM?$t$,
  options_en  = $t$["RAM","Non-volatile memory","Cache","DRAM"]$t$::jsonb,
  context_en  = $t$EEPROM (Electrically Erasable Programmable Read-Only Memory) is a non-volatile memory that can be rewritten.$t$
where category = 'tecnologia' and question = $q$¿Qué tipo de memoria es la EEPROM?$q$;

update public.questions set
  question_en = $t$What type of memory is DRAM?$t$,
  options_en  = $t$["Cache","Dynamic RAM","Persistent memory","SSD"]$t$::jsonb,
  context_en  = $t$DRAM (Dynamic RAM) is the most common RAM in computers. It is constantly refreshed.$t$
where category = 'tecnologia' and question = $q$¿Qué tipo de memoria es DRAM?$q$;

update public.questions set
  question_en = $t$Who is Sundar Pichai?$t$,
  options_en  = $t$["CEO of Google","CEO of Microsoft","Founder of Twitter","CEO of Apple"]$t$::jsonb,
  context_en  = $t$Sundar Pichai has been CEO of Google since 2015 and of Alphabet since 2019.$t$
where category = 'tecnologia' and question = $q$¿Quién es Sundar Pichai?$q$;

update public.questions set
  question_en = $t$Who is Mark Zuckerberg?$t$,
  options_en  = $t$["Founder of Facebook/Meta","Founder of Google","CEO of Twitter","Founder of LinkedIn"]$t$::jsonb,
  context_en  = $t$Mark Zuckerberg co-founded Facebook (now Meta) in 2004 at Harvard.$t$
where category = 'tecnologia' and question = $q$¿Quién es Mark Zuckerberg?$q$;

update public.questions set
  question_en = $t$Who is Sergey Brin?$t$,
  options_en  = $t$["Co-founder of Google","CEO of Yahoo","Founder of Amazon","Founder of eBay"]$t$::jsonb,
  context_en  = $t$Sergey Brin co-founded Google with Larry Page in 1998.$t$
where category = 'tecnologia' and question = $q$¿Quién es Sergey Brin?$q$;

update public.questions set
  question_en = $t$Who is Larry Page?$t$,
  options_en  = $t$["Co-founder of Google","CEO of Yahoo","Founder of Apple","Inventor of the web"]$t$::jsonb,
  context_en  = $t$Larry Page co-founded Google with Sergey Brin. Both were doctoral students at Stanford.$t$
where category = 'tecnologia' and question = $q$¿Quién es Larry Page?$q$;

update public.questions set
  question_en = $t$Which company created the TikTok app?$t$,
  options_en  = $t$["Tencent","ByteDance","Alibaba","Baidu"]$t$::jsonb,
  context_en  = $t$ByteDance, a Chinese company, created TikTok (Douyin in China) in 2016.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó la app TikTok?$q$;

update public.questions set
  question_en = $t$In what year was TikTok launched internationally?$t$,
  options_en  = $t$["2016","2017","2018","2020"]$t$::jsonb,
  context_en  = $t$TikTok was launched internationally in 2017, merging with Musical.ly in 2018.$t$
where category = 'tecnologia' and question = $q$¿En qué año se lanzó TikTok internacionalmente?$q$;

update public.questions set
  question_en = $t$Who created WhatsApp?$t$,
  options_en  = $t$["Jan Koum and Brian Acton","Mark Zuckerberg","Sergey Brin","Drew Houston"]$t$::jsonb,
  context_en  = $t$Jan Koum and Brian Acton created WhatsApp in 2009. Facebook bought it in 2014.$t$
where category = 'tecnologia' and question = $q$¿Quién creó WhatsApp?$q$;

update public.questions set
  question_en = $t$Who created Dropbox?$t$,
  options_en  = $t$["Drew Houston","Microsoft","Google","Sergey Brin"]$t$::jsonb,
  context_en  = $t$Drew Houston and Arash Ferdowsi founded Dropbox in 2007.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Dropbox?$q$;

update public.questions set
  question_en = $t$Who created Spotify?$t$,
  options_en  = $t$["Daniel Ek and Martin Lorentzon","Steve Jobs","Sean Parker","Reed Hastings"]$t$::jsonb,
  context_en  = $t$Daniel Ek and Martin Lorentzon founded Spotify in Sweden in 2006. Public launch in 2008.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Spotify?$q$;

update public.questions set
  question_en = $t$Who founded Netflix?$t$,
  options_en  = $t$["Reed Hastings and Marc Randolph","Sean Parker","Drew Houston","Steve Chen"]$t$::jsonb,
  context_en  = $t$Reed Hastings and Marc Randolph founded Netflix in 1997, initially as a DVD-by-mail rental service.$t$
where category = 'tecnologia' and question = $q$¿Quién fundó Netflix?$q$;

update public.questions set
  question_en = $t$In what year did Netflix start producing original series?$t$,
  options_en  = $t$["2010","2013","2015","2017"]$t$::jsonb,
  context_en  = $t$Netflix started with originals in 2013, with 'House of Cards' and 'Orange Is the New Black'.$t$
where category = 'tecnologia' and question = $q$¿En qué año empezó Netflix a producir series originales?$q$;

update public.questions set
  question_en = $t$The search engine Yandex was created by a company from which country?$t$,
  options_en  = $t$["Russia","China","Korea","India"]$t$::jsonb,
  context_en  = $t$Yandex is the Russian search and technology company, founded in 1997. The equivalent of Google in Russia.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el motor de búsqueda Yandex?$q$;

update public.questions set
  question_en = $t$Baidu was created by a company from which country?$t$,
  options_en  = $t$["China","Japan","Korea","Vietnam"]$t$::jsonb,
  context_en  = $t$Baidu is the main Chinese search engine, founded in 2000 by Robin Li and Eric Xu.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Baidu?$q$;

update public.questions set
  question_en = $t$How many colors can a pixel display with 24 bits?$t$,
  options_en  = $t$["256","65,536","~16.7 M","Infinite"]$t$::jsonb,
  context_en  = $t$With 24 bits (8 per RGB channel), 2²⁴ = 16,777,216 different colors can be represented.$t$
where category = 'tecnologia' and question = $q$¿Cuántos colores puede mostrar un píxel con 24 bits?$q$;

update public.questions set
  question_en = $t$Which company created the Apple Pay payment system?$t$,
  options_en  = $t$["Visa","Apple","Mastercard","Google"]$t$::jsonb,
  context_en  = $t$Apple launched Apple Pay in 2014, first in the U.S., as a contactless payment system from the iPhone.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó el sistema de pago Apple Pay?$q$;

update public.questions set
  question_en = $t$Which company created Google Pay?$t$,
  options_en  = $t$["Apple","Google","Samsung","Mastercard"]$t$::jsonb,
  context_en  = $t$Google launched Google Pay in 2018, merging Android Pay and Google Wallet.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Google Pay?$q$;

update public.questions set
  question_en = $t$What technology does the blockchain use?$t$,
  options_en  = $t$["Central servers","Encryption and decentralization","WAN","Cloud computing"]$t$::jsonb,
  context_en  = $t$Blockchain uses cryptography and distributed nodes to maintain an immutable and verifiable ledger.$t$
where category = 'tecnologia' and question = $q$¿Qué tecnología usa la cadena de bloques?$q$;

update public.questions set
  question_en = $t$Which was the first cryptocurrency?$t$,
  options_en  = $t$["Ethereum","Bitcoin","Litecoin","Dogecoin"]$t$::jsonb,
  context_en  = $t$Bitcoin, created by Satoshi Nakamoto, was launched in 2009.$t$
where category = 'tecnologia' and question = $q$¿Cuál fue la primera criptomoneda?$q$;

update public.questions set
  question_en = $t$In what year was the Bitcoin whitepaper published?$t$,
  options_en  = $t$["2008","2009","2010","2011"]$t$::jsonb,
  context_en  = $t$Satoshi Nakamoto published the Bitcoin whitepaper in October 2008.$t$
where category = 'tecnologia' and question = $q$¿En qué año se publicó el whitepaper de Bitcoin?$q$;

update public.questions set
  question_en = $t$Who created Ethereum?$t$,
  options_en  = $t$["Vitalik Buterin","Satoshi Nakamoto","Charlie Lee","Brad Garlinghouse"]$t$::jsonb,
  context_en  = $t$Vitalik Buterin proposed Ethereum in 2013 and the network launched in 2015.$t$
where category = 'tecnologia' and question = $q$¿Quién creó Ethereum?$q$;

update public.questions set
  question_en = $t$In what year was Ethereum launched?$t$,
  options_en  = $t$["2013","2014","2015","2017"]$t$::jsonb,
  context_en  = $t$Ethereum was launched in July 2015. It introduced smart contracts.$t$
where category = 'tecnologia' and question = $q$¿En qué año se lanzó Ethereum?$q$;

update public.questions set
  question_en = $t$Which company created Zoom?$t$,
  options_en  = $t$["Microsoft","Zoom Video Communications","Cisco","Google"]$t$::jsonb,
  context_en  = $t$Eric Yuan founded Zoom Video Communications in 2011. It became massively popular during the pandemic in 2020.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa creó Zoom?$q$;

update public.questions set
  question_en = $t$In what year did Zoom become massively popular?$t$,
  options_en  = $t$["2018","2019","2020","2021"]$t$::jsonb,
  context_en  = $t$Zoom became massively popular in 2020 during the COVID-19 pandemic.$t$
where category = 'tecnologia' and question = $q$¿En qué año se popularizó masivamente Zoom?$q$;

update public.questions set
  question_en = $t$What type of encryption does AES use?$t$,
  options_en  = $t$["Asymmetric","Symmetric","Hash","It's not encryption"]$t$::jsonb,
  context_en  = $t$AES (Advanced Encryption Standard) is a symmetric encryption algorithm (the same key to encrypt and decrypt).$t$
where category = 'tecnologia' and question = $q$¿Qué tipo de encriptación usa AES?$q$;

update public.questions set
  question_en = $t$What type of encryption does RSA use?$t$,
  options_en  = $t$["Asymmetric","Symmetric","Hash","It's not encryption"]$t$::jsonb,
  context_en  = $t$RSA is an asymmetric encryption algorithm: it uses public and private keys. The basis of the digital signature.$t$
where category = 'tecnologia' and question = $q$¿Qué tipo de encriptación usa RSA?$q$;

update public.questions set
  question_en = $t$In what year was the first Macintosh launched?$t$,
  options_en  = $t$["1980","1984","1987","1990"]$t$::jsonb,
  context_en  = $t$Apple launched the first Macintosh on 24 January 1984, with a famous ad by Ridley Scott during the Super Bowl.$t$
where category = 'tecnologia' and question = $q$¿Qué año se lanzó el primer Macintosh?$q$;

update public.questions set
  question_en = $t$Which company made the Apple Lisa's processor?$t$,
  options_en  = $t$["Intel","Motorola","Texas Instruments","AMD"]$t$::jsonb,
  context_en  = $t$The Apple Lisa (1983) used the Motorola 68000 processor.$t$
where category = 'tecnologia' and question = $q$¿Qué empresa fabricaba el procesador del Apple Lisa?$q$;

update public.questions set
  question_en = $t$Who is Jeff Bezos?$t$,
  options_en  = $t$["Founder of Amazon","Founder of Microsoft","CEO of Tesla","Founder of PayPal"]$t$::jsonb,
  context_en  = $t$Jeff Bezos founded Amazon in 1994 as an online bookstore. He was CEO until 2021.$t$
where category = 'tecnologia' and question = $q$¿Quién es Jeff Bezos?$q$;

update public.questions set
  question_en = $t$In what year was Amazon founded?$t$,
  options_en  = $t$["1991","1994","1996","1999"]$t$::jsonb,
  context_en  = $t$Jeff Bezos founded Amazon in July 1994 in Seattle, originally under the name 'Cadabra'.$t$
where category = 'tecnologia' and question = $q$¿En qué año se fundó Amazon?$q$;

update public.questions set
  question_en = $t$Who is the CEO of Amazon (as of 2024)?$t$,
  options_en  = $t$["Jeff Bezos","Andy Jassy","Tim Cook","Jeff Bezos still"]$t$::jsonb,
  context_en  = $t$Andy Jassy succeeded Jeff Bezos as CEO of Amazon in July 2021.$t$
where category = 'tecnologia' and question = $q$¿Quién es el CEO de Amazon (a 2024)?$q$;

update public.questions set
  question_en = $t$Which Amazon service is the world leader in cloud computing?$t$,
  options_en  = $t$["AWS","Amazon Prime","Kindle","Alexa"]$t$::jsonb,
  context_en  = $t$Amazon Web Services (AWS), launched in 2006, is the world's leading provider of cloud services.$t$
where category = 'tecnologia' and question = $q$¿Qué servicio de Amazon es el líder mundial en cloud computing?$q$;

update public.questions set
  question_en = $t$Which cloud service does Microsoft have?$t$,
  options_en  = $t$["AWS","Azure","Google Cloud","Oracle"]$t$::jsonb,
  context_en  = $t$Microsoft Azure, launched in 2010, is the main competitor to AWS.$t$
where category = 'tecnologia' and question = $q$¿Qué servicio de nube tiene Microsoft?$q$;

update public.questions set
  question_en = $t$How many transistors does a modern processor have (order of magnitude)?$t$,
  options_en  = $t$["Millions","Hundreds of millions","Tens of billions","Trillions"]$t$::jsonb,
  context_en  = $t$Modern processors have between 10 and 100 billion transistors (tens of billions).$t$
where category = 'tecnologia' and question = $q$¿Cuántos transistores tiene un procesador moderno (orden de magnitud)?$q$;


-- ── mitologia (153) ──
update public.questions set
  question_en = $t$Who is the king of the gods in Greek mythology?$t$,
  options_en  = $t$["Apollo","Poseidon","Zeus","Hades"]$t$::jsonb,
  context_en  = $t$Zeus is king of Olympus, god of the sky and thunder. His Roman equivalent is Jupiter.$t$
where category = 'mitologia' and question = $q$¿Quién es el rey de los dioses en la mitología griega?$q$;

update public.questions set
  question_en = $t$What is the Roman equivalent of Aphrodite?$t$,
  options_en  = $t$["Diana","Venus","Juno","Minerva"]$t$::jsonb,
  context_en  = $t$Venus is the Roman goddess of love and beauty, equivalent to Aphrodite. The planet Venus is named after her.$t$
where category = 'mitologia' and question = $q$¿Cuál es el equivalente romano de Afrodita?$q$;

update public.questions set
  question_en = $t$Who is the god of thunder in Norse mythology?$t$,
  options_en  = $t$["Odin","Thor","Loki","Freyr"]$t$::jsonb,
  context_en  = $t$Thor, son of Odin, is the god of thunder. His hammer Mjölnir is one of the most recognizable symbols of the Norse pantheon.$t$
where category = 'mitologia' and question = $q$¿Quién es el dios del trueno en la mitología nórdica?$q$;

update public.questions set
  question_en = $t$How many Olympian gods make up the main Greek pantheon?$t$,
  options_en  = $t$["10","12","14","16"]$t$::jsonb,
  context_en  = $t$The Twelve Olympians: Zeus, Hera, Poseidon, Demeter, Athena, Apollo, Artemis, Ares, Aphrodite, Hephaestus, Hermes and Dionysus or Hestia.$t$
where category = 'mitologia' and question = $q$¿Cuántos dioses olímpicos forman el panteón principal griego?$q$;

update public.questions set
  question_en = $t$Who is the Egyptian sun god?$t$,
  options_en  = $t$["Anubis","Ra","Osiris","Horus"]$t$::jsonb,
  context_en  = $t$Ra is the sun god in ancient Egypt. He traveled the sky during the day and the underworld (Duat) at night in his barque.$t$
where category = 'mitologia' and question = $q$¿Quién es el dios egipcio del sol?$q$;

update public.questions set
  question_en = $t$Which Greek hero killed the Minotaur?$t$,
  options_en  = $t$["Hercules","Perseus","Theseus","Odysseus"]$t$::jsonb,
  context_en  = $t$Theseus entered the Labyrinth of Crete and killed the Minotaur. He escaped guided by the thread of Ariadne, daughter of King Minos.$t$
where category = 'mitologia' and question = $q$¿Qué héroe griego mató al Minotauro?$q$;

update public.questions set
  question_en = $t$How many labors did Hercules perform?$t$,
  options_en  = $t$["10","12","14","15"]$t$::jsonb,
  context_en  = $t$Hercules (Heracles) performed 12 labors imposed by Eurystheus as penance. The first was to kill the Nemean lion.$t$
where category = 'mitologia' and question = $q$¿Cuántos trabajos realizó Hércules?$q$;

update public.questions set
  question_en = $t$Who is the mother of Athena?$t$,
  options_en  = $t$["Hera","Metis","Leto","Demeter"]$t$::jsonb,
  context_en  = $t$Athena was born from Zeus's head after he devoured Metis (Wisdom), her mother, following the prophecy that she would bear powerful gods.$t$
where category = 'mitologia' and question = $q$¿Quién es la madre de Atenea?$q$;

update public.questions set
  question_en = $t$Which animal was Athena's favorite?$t$,
  options_en  = $t$["Eagle","Owl","Crow","Swan"]$t$::jsonb,
  context_en  = $t$The owl symbolized Athena, goddess of wisdom. Hence the expression 'the owl of Minerva'.$t$
where category = 'mitologia' and question = $q$¿Qué animal era el favorito de Atenea?$q$;

update public.questions set
  question_en = $t$Who is the god of the underworld in Greek mythology?$t$,
  options_en  = $t$["Zeus","Poseidon","Hades","Hermes"]$t$::jsonb,
  context_en  = $t$Hades rules the underworld. He has a three-headed dog named Cerberus that guards the entrance.$t$
where category = 'mitologia' and question = $q$¿Quién es el dios del inframundo en la mitología griega?$q$;

update public.questions set
  question_en = $t$Who is the father of Zeus in Greek mythology?$t$,
  options_en  = $t$["Uranus","Cronus","Hyperion","Oceanus"]$t$::jsonb,
  context_en  = $t$Cronus (a Titan) is the father of Zeus. Cronus devoured his children for fear of being dethroned, but Rhea hid Zeus.$t$
where category = 'mitologia' and question = $q$¿Quién es el padre de Zeus en la mitología griega?$q$;

update public.questions set
  question_en = $t$Which Egyptian god has a jackal head?$t$,
  options_en  = $t$["Horus","Anubis","Thoth","Set"]$t$::jsonb,
  context_en  = $t$Anubis, god of death and embalming, has a jackal head. He guided souls to the judgment of Osiris.$t$
where category = 'mitologia' and question = $q$¿Qué dios egipcio tiene cabeza de chacal?$q$;

update public.questions set
  question_en = $t$Who is the trickster god in Norse mythology?$t$,
  options_en  = $t$["Loki","Odin","Tyr","Heimdall"]$t$::jsonb,
  context_en  = $t$Loki is the god of deceit. Odin's adopted brother, his mischief causes Ragnarök, the end of the Norse world.$t$
where category = 'mitologia' and question = $q$¿Quién es el dios trickster en la mitología nórdica?$q$;

update public.questions set
  question_en = $t$Which Titaness is the mother of Apollo and Artemis?$t$,
  options_en  = $t$["Leto","Tethys","Rhea","Mnemosyne"]$t$::jsonb,
  context_en  = $t$Leto, daughter of the Titans Coeus and Phoebe, bore Apollo and Artemis on the island of Delos, after being pursued by Hera.$t$
where category = 'mitologia' and question = $q$¿Qué titanide es la madre de Apolo y Ártemis?$q$;

update public.questions set
  question_en = $t$Which three goddesses fought over the golden apple?$t$,
  options_en  = $t$["Hera, Athena, Aphrodite","Athena, Artemis, Aphrodite","Hera, Demeter, Hestia","Aphrodite, Artemis, Demeter"]$t$::jsonb,
  context_en  = $t$Eris threw the apple 'for the fairest'. Hera, Athena and Aphrodite fought over it, and Paris chose Aphrodite, sparking the Trojan War.$t$
where category = 'mitologia' and question = $q$¿Qué tres diosas se disputaron la manzana de oro?$q$;

update public.questions set
  question_en = $t$How many Muses are there in Greek mythology?$t$,
  options_en  = $t$["7","9","12","15"]$t$::jsonb,
  context_en  = $t$The 9 Muses are daughters of Zeus and Mnemosyne. Each protects an art: Calliope (epic), Erato (lyric), Clio (history), etc.$t$
where category = 'mitologia' and question = $q$¿Cuántas Musas hay en la mitología griega?$q$;

update public.questions set
  question_en = $t$Which characteristic weapon does Poseidon use?$t$,
  options_en  = $t$["Lightning bolt","Trident","Sword","Bow"]$t$::jsonb,
  context_en  = $t$Poseidon carries a trident with which he controls the seas and causes earthquakes. His Roman equivalent is Neptune.$t$
where category = 'mitologia' and question = $q$¿Qué arma característica usa Poseidón?$q$;

update public.questions set
  question_en = $t$Who was the messenger of the Greek gods?$t$,
  options_en  = $t$["Apollo","Hermes","Dionysus","Ares"]$t$::jsonb,
  context_en  = $t$Hermes wears wings on his feet (sandals). He is the messenger, god of travelers, merchants and thieves. His Roman equivalent is Mercury.$t$
where category = 'mitologia' and question = $q$¿Quién era el mensajero de los dioses griegos?$q$;

update public.questions set
  question_en = $t$Which Greek hero killed Medusa?$t$,
  options_en  = $t$["Heracles","Theseus","Perseus","Achilles"]$t$::jsonb,
  context_en  = $t$Perseus beheaded Medusa using a polished shield as a mirror. From her blood was born the winged horse Pegasus.$t$
where category = 'mitologia' and question = $q$¿Qué héroe griego mató a Medusa?$q$;

update public.questions set
  question_en = $t$Who is the god of wine in Greek mythology?$t$,
  options_en  = $t$["Apollo","Hermes","Dionysus","Pan"]$t$::jsonb,
  context_en  = $t$Dionysus (Bacchus in Rome) is the god of wine, festivity and ecstasy. His followers were the maenads.$t$
where category = 'mitologia' and question = $q$¿Quién es el dios del vino en la mitología griega?$q$;

update public.questions set
  question_en = $t$Which Roman god corresponds to Ares?$t$,
  options_en  = $t$["Mercury","Pluto","Mars","Vulcan"]$t$::jsonb,
  context_en  = $t$Mars is the Roman equivalent of Ares, god of war. But in Rome he had more prestige (Romulus was his son).$t$
where category = 'mitologia' and question = $q$¿Qué dios romano corresponde a Ares?$q$;

update public.questions set
  question_en = $t$Which is the river of forgetfulness in the Greek underworld?$t$,
  options_en  = $t$["Styx","Acheron","Lethe","Cocytus"]$t$::jsonb,
  context_en  = $t$The Lethe is one of the five rivers of Hades. Drinking from it causes total forgetfulness. The others: Styx, Acheron, Cocytus and Phlegethon.$t$
where category = 'mitologia' and question = $q$¿Cuál es el río del olvido en el inframundo griego?$q$;

update public.questions set
  question_en = $t$Who is the Egyptian god of the afterlife?$t$,
  options_en  = $t$["Ra","Anubis","Osiris","Horus"]$t$::jsonb,
  context_en  = $t$Osiris is lord of the afterlife. Murdered by his brother Set and resurrected by his wife Isis, he judges souls after death.$t$
where category = 'mitologia' and question = $q$¿Quién es el dios egipcio del más allá?$q$;

update public.questions set
  question_en = $t$What is the name of the winged horse in Greek mythology?$t$,
  options_en  = $t$["Centaur","Pegasus","Chiron","Bucephalus"]$t$::jsonb,
  context_en  = $t$Pegasus was born from the blood of Medusa when she was beheaded. Bellerophon used it to kill the Chimera.$t$
where category = 'mitologia' and question = $q$¿Cómo se llama el caballo alado de la mitología griega?$q$;

update public.questions set
  question_en = $t$Which Greek god is famous for his thunderbolt?$t$,
  options_en  = $t$["Apollo","Zeus","Hephaestus","Helios"]$t$::jsonb,
  context_en  = $t$Zeus's weapon is the thunderbolt, forged by the Cyclopes. It is his symbol of power over gods and mortals.$t$
where category = 'mitologia' and question = $q$¿Qué dios griego es famoso por su rayo?$q$;

update public.questions set
  question_en = $t$Which animal treacherously deceived Eve in Eden?$t$,
  options_en  = $t$["Lion","Eagle","Serpent","Fish"]$t$::jsonb,
  context_en  = $t$In Genesis, the serpent tempts Eve to eat from the Tree of Knowledge. It is interpreted as Satan in later traditions.$t$
where category = 'mitologia' and question = $q$¿Qué animal traidoramente eligió Eva en el Edén?$q$;

update public.questions set
  question_en = $t$What is the realm of the gods in Norse mythology?$t$,
  options_en  = $t$["Midgard","Asgard","Helheim","Vanaheim"]$t$::jsonb,
  context_en  = $t$Asgard is the realm of the Æsir (gods) in the Norse cosmos of the 9 worlds. It is connected to Midgard by the Bifröst bridge.$t$
where category = 'mitologia' and question = $q$¿Cuál es el reino de los dioses en la mitología nórdica?$q$;

update public.questions set
  question_en = $t$Who is the god of blacksmiths in Greek mythology?$t$,
  options_en  = $t$["Apollo","Hephaestus","Hermes","Pan"]$t$::jsonb,
  context_en  = $t$Hephaestus, god of fire and metallurgy, forges the gods' weapons. He was lame and married to Aphrodite, who cheated on him with Ares.$t$
where category = 'mitologia' and question = $q$¿Quién es el dios de las hierreras en la mitología griega?$q$;

update public.questions set
  question_en = $t$What is the name of the island where Odysseus was stranded in the Odyssey?$t$,
  options_en  = $t$["Ithaca","Ogygia","Crete","Skyros"]$t$::jsonb,
  context_en  = $t$Calypso held Odysseus on Ogygia for 7 years. After divine intervention, she let him leave for Ithaca.$t$
where category = 'mitologia' and question = $q$¿Cómo se llama la isla donde fue desterrado Odiseo en la Odisea?$q$;

update public.questions set
  question_en = $t$Who is Achilles?$t$,
  options_en  = $t$["King of Troy","A Greek hero at Troy","God of fire","Son of Zeus"]$t$::jsonb,
  context_en  = $t$Achilles, a Greek hero, a demigod (son of Thetis). His only weak point was his heel, where his mother held him when dipping him in the Styx.$t$
where category = 'mitologia' and question = $q$¿Quién es Aquiles?$q$;

update public.questions set
  question_en = $t$What kind of creature was the Chimera in Greek mythology?$t$,
  options_en  = $t$["Half human, half horse","Lion, goat and serpent","A woman with wings","A bull with a human body"]$t$::jsonb,
  context_en  = $t$The Chimera had the head of a lion, the body of a goat and the tail of a serpent. Bellerophon killed it with the help of Pegasus.$t$
where category = 'mitologia' and question = $q$¿Qué animal era la Quimera en la mitología griega?$q$;

update public.questions set
  question_en = $t$Which Egyptian god has a falcon head?$t$,
  options_en  = $t$["Anubis","Thoth","Horus","Set"]$t$::jsonb,
  context_en  = $t$Horus is the sky god with a falcon head. Son of Osiris and Isis, he avenges his father's death against Set.$t$
where category = 'mitologia' and question = $q$¿Qué dios egipcio tiene cabeza de halcón?$q$;

update public.questions set
  question_en = $t$What is Thor's hammer?$t$,
  options_en  = $t$["Gungnir","Mjölnir","Skofnung","Tyrfing"]$t$::jsonb,
  context_en  = $t$Mjölnir is Thor's hammer, forged by the dwarves Sindri and Brokkr. It always returns to his hand and can crush mountains.$t$
where category = 'mitologia' and question = $q$¿Cuál es el martillo de Thor?$q$;

update public.questions set
  question_en = $t$Which Greek demigod was the son of Zeus and Alcmene?$t$,
  options_en  = $t$["Perseus","Heracles","Bellerophon","Achilles"]$t$::jsonb,
  context_en  = $t$Heracles (Hercules in Rome) was the son of Zeus and the mortal Alcmene. Hera pursued him out of jealousy throughout his life.$t$
where category = 'mitologia' and question = $q$¿Qué semidiós griego era hijo de Zeus y Alcmena?$q$;

update public.questions set
  question_en = $t$Who created man from clay according to Greek mythology?$t$,
  options_en  = $t$["Zeus","Prometheus","Hephaestus","Apollo"]$t$::jsonb,
  context_en  = $t$Prometheus molded humans from clay and gave them fire, stealing it from the gods. Zeus punished him by chaining him to the Caucasus.$t$
where category = 'mitologia' and question = $q$¿Quién creó al hombre con barro según la mitología griega?$q$;

update public.questions set
  question_en = $t$What is the name of the ship Argo?$t$,
  options_en  = $t$["Argo","Pegasus","Sphinx","Naiad"]$t$::jsonb,
  context_en  = $t$The Argo was the ship with which Jason and the Argonauts sought the Golden Fleece. It was built by Argus.$t$
where category = 'mitologia' and question = $q$¿Cómo se llama el barco de Argo?$q$;

update public.questions set
  question_en = $t$Who was the first man in Christian mythology?$t$,
  options_en  = $t$["Adam","Cain","Noah","Abraham"]$t$::jsonb,
  context_en  = $t$According to Genesis, God created Adam from the dust of the earth. Eve was created afterward from one of his ribs.$t$
where category = 'mitologia' and question = $q$¿Quién fue el primer hombre en la mitología cristiana?$q$;

update public.questions set
  question_en = $t$Which Chinese god represents war?$t$,
  options_en  = $t$["Guan Yu","Guan Yin","Sun Wukong","Lao Tzu"]$t$::jsonb,
  context_en  = $t$Guan Yu was a historical general (Three Kingdoms) deified as the god of war and of business in Taoism.$t$
where category = 'mitologia' and question = $q$¿Qué dios chino representa la guerra?$q$;

update public.questions set
  question_en = $t$Who were the Erinyes or Furies?$t$,
  options_en  = $t$["Goddesses of fertility","Avenging goddesses","Muses","Sirens"]$t$::jsonb,
  context_en  = $t$The Erinyes (Furies in Rome) were 3 goddesses who avenged crimes, especially crimes against the family.$t$
where category = 'mitologia' and question = $q$¿Quiénes eran las Erinias o Furias?$q$;

update public.questions set
  question_en = $t$Which Maya/Aztec god is the feathered serpent?$t$,
  options_en  = $t$["Tlaloc","Quetzalcoatl","Huitzilopochtli","Tezcatlipoca"]$t$::jsonb,
  context_en  = $t$Quetzalcoatl (Aztec) or Kukulkan (Maya) is the feathered serpent, one of the most important deities of Mesoamerica.$t$
where category = 'mitologia' and question = $q$¿Qué dios maya/azteca es la serpiente emplumada?$q$;

update public.questions set
  question_en = $t$In Hindu mythology, who is the destroyer god?$t$,
  options_en  = $t$["Brahma","Vishnu","Shiva","Ganesha"]$t$::jsonb,
  context_en  = $t$Shiva forms the Trimurti with Brahma (creator) and Vishnu (preserver). He is the god of destruction/transformation.$t$
where category = 'mitologia' and question = $q$¿En la mitología hindú, quién es el dios destructor?$q$;

update public.questions set
  question_en = $t$Which famous place did King Arthur's knights seek?$t$,
  options_en  = $t$["Atlantis","The Grail","Paradise","The fountain of youth"]$t$::jsonb,
  context_en  = $t$The Holy Grail (the cup of Christ) was sought by the Knights of the Round Table. Galahad or Percival find it depending on the version.$t$
where category = 'mitologia' and question = $q$¿Qué famoso lugar buscaban los caballeros del rey Arturo?$q$;

update public.questions set
  question_en = $t$Who is the main god of the Aztecs?$t$,
  options_en  = $t$["Tezcatlipoca","Huitzilopochtli","Quetzalcoatl","Tonatiuh"]$t$::jsonb,
  context_en  = $t$Huitzilopochtli, god of war and the sun, was the patron of the Aztecs. Tenochtitlan was founded on the site he indicated.$t$
where category = 'mitologia' and question = $q$¿Quién es el dios principal de los aztecas?$q$;

update public.questions set
  question_en = $t$How many heads did the Lernaean Hydra have?$t$,
  options_en  = $t$["3","7","9","Two grew for each one cut off"]$t$::jsonb,
  context_en  = $t$The Lernaean Hydra had 9 heads, and for each one cut off, 2 grew. Heracles (with Iolaus) burned them after cutting them (2nd labor).$t$
where category = 'mitologia' and question = $q$¿Cuántas cabezas tenía la Hidra de Lerna?$q$;

update public.questions set
  question_en = $t$Which Roman god corresponds to Hermes?$t$,
  options_en  = $t$["Vulcan","Mercury","Jupiter","Neptune"]$t$::jsonb,
  context_en  = $t$Mercury is the Roman equivalent of Hermes: messenger of the gods and patron of merchants and thieves.$t$
where category = 'mitologia' and question = $q$¿Qué dios romano corresponde a Hermes?$q$;

update public.questions set
  question_en = $t$Who is Apollo?$t$,
  options_en  = $t$["God of thunder","God of the sun, music and prophecy","God of the sea","God of the underworld"]$t$::jsonb,
  context_en  = $t$Apollo is one of the twelve Olympians. God of the sun, music, poetry and oracles (especially Delphi).$t$
where category = 'mitologia' and question = $q$¿Quién es Apolo?$q$;

update public.questions set
  question_en = $t$What is Ragnarök in Norse mythology?$t$,
  options_en  = $t$["A weapon","The end of the world","A realm","A god"]$t$::jsonb,
  context_en  = $t$Ragnarök is the end of the Norse world: a battle in which most of the gods die (Odin, Thor, Loki, etc.).$t$
where category = 'mitologia' and question = $q$¿Qué es el Ragnarök en la mitología nórdica?$q$;

update public.questions set
  question_en = $t$Who was the first king of Rome according to legend?$t$,
  options_en  = $t$["Tarquin","Romulus","Numa Pompilius","Servius Tullius"]$t$::jsonb,
  context_en  = $t$Romulus, according to legend, founded Rome in 753 BC after killing his brother Remus. His parents were Mars and Rhea Silvia.$t$
where category = 'mitologia' and question = $q$¿Quién fue el primer rey de Roma según la leyenda?$q$;

update public.questions set
  question_en = $t$What did the rite of crossing the river Styx consist of?$t$,
  options_en  = $t$["Paying Charon","Drinking water","Reciting verses","Showing an object"]$t$::jsonb,
  context_en  = $t$Souls had to pay Charon, the ferryman, a coin (obol) to cross the Styx. That is why they buried the dead with coins.$t$
where category = 'mitologia' and question = $q$¿En qué consistía el rito del paso del río Estigia?$q$;

update public.questions set
  question_en = $t$What is the cosmic tree in Norse mythology?$t$,
  options_en  = $t$["Yggdrasil","Aralia","Mjölnir","Bifröst"]$t$::jsonb,
  context_en  = $t$Yggdrasil is the cosmic ash tree that connects the 9 worlds in Norse mythology.$t$
where category = 'mitologia' and question = $q$¿Cuál es el árbol cósmico en la mitología nórdica?$q$;

update public.questions set
  question_en = $t$Who is the Greek goddess of the hunt?$t$,
  options_en  = $t$["Athena","Aphrodite","Artemis","Hera"]$t$::jsonb,
  context_en  = $t$Artemis is the virgin goddess of the hunt, the moon, wild animals and young women. Twin sister of Apollo.$t$
where category = 'mitologia' and question = $q$¿Quién es la diosa griega de la caza?$q$;

update public.questions set
  question_en = $t$What is the Roman equivalent of Artemis?$t$,
  options_en  = $t$["Venus","Diana","Minerva","Juno"]$t$::jsonb,
  context_en  = $t$Diana is the Roman equivalent of Artemis. Goddess of the hunt, the moon and wild nature.$t$
where category = 'mitologia' and question = $q$¿Cuál es el equivalente romano de Ártemis?$q$;

update public.questions set
  question_en = $t$What is the Roman equivalent of Athena?$t$,
  options_en  = $t$["Venus","Diana","Minerva","Juno"]$t$::jsonb,
  context_en  = $t$Minerva is the Roman equivalent of Athena. Goddess of wisdom, the arts and strategic warfare.$t$
where category = 'mitologia' and question = $q$¿Cuál es el equivalente romano de Atenea?$q$;

update public.questions set
  question_en = $t$What is the Roman equivalent of Hera?$t$,
  options_en  = $t$["Diana","Minerva","Juno","Vesta"]$t$::jsonb,
  context_en  = $t$Juno is the Roman equivalent of Hera. Goddess of marriage and queen of the gods.$t$
where category = 'mitologia' and question = $q$¿Cuál es el equivalente romano de Hera?$q$;

update public.questions set
  question_en = $t$What is the Roman equivalent of Zeus?$t$,
  options_en  = $t$["Mars","Jupiter","Saturn","Apollo"]$t$::jsonb,
  context_en  = $t$Jupiter is the Roman equivalent of Zeus. King of the gods, lord of the sky and thunder.$t$
where category = 'mitologia' and question = $q$¿Cuál es el equivalente romano de Zeus?$q$;

update public.questions set
  question_en = $t$What is the Roman equivalent of Poseidon?$t$,
  options_en  = $t$["Mars","Jupiter","Neptune","Pluto"]$t$::jsonb,
  context_en  = $t$Neptune is the Roman equivalent of Poseidon. God of the sea.$t$
where category = 'mitologia' and question = $q$¿Cuál es el equivalente romano de Poseidón?$q$;

update public.questions set
  question_en = $t$What is the Roman equivalent of Hades?$t$,
  options_en  = $t$["Pluto","Neptune","Mars","Vulcan"]$t$::jsonb,
  context_en  = $t$Pluto is the Roman equivalent of Hades. God of the underworld.$t$
where category = 'mitologia' and question = $q$¿Cuál es el equivalente romano de Hades?$q$;

update public.questions set
  question_en = $t$What is the Roman equivalent of Apollo?$t$,
  options_en  = $t$["Mars","Mercury","Apollo (same name)","Vulcan"]$t$::jsonb,
  context_en  = $t$Apollo keeps his name in Roman mythology. God of light, the arts and prophecy.$t$
where category = 'mitologia' and question = $q$¿Cuál es el equivalente romano de Apolo?$q$;

update public.questions set
  question_en = $t$What is the Roman equivalent of Hephaestus?$t$,
  options_en  = $t$["Vulcan","Mars","Mercury","Jupiter"]$t$::jsonb,
  context_en  = $t$Vulcan is the Roman equivalent of Hephaestus. God of fire, volcanoes and blacksmiths.$t$
where category = 'mitologia' and question = $q$¿Cuál es el equivalente romano de Hefesto?$q$;

update public.questions set
  question_en = $t$What is the Roman equivalent of Eros?$t$,
  options_en  = $t$["Cupid","Jupiter","Mars","Apollo"]$t$::jsonb,
  context_en  = $t$Cupid is the Roman equivalent of Eros. God of love, son of Venus.$t$
where category = 'mitologia' and question = $q$¿Cuál es el equivalente romano de Eros?$q$;

update public.questions set
  question_en = $t$What is the Roman equivalent of Demeter?$t$,
  options_en  = $t$["Ceres","Vesta","Juno","Diana"]$t$::jsonb,
  context_en  = $t$Ceres is the Roman equivalent of Demeter. Goddess of agriculture and harvests. Hence 'cereal'.$t$
where category = 'mitologia' and question = $q$¿Cuál es el equivalente romano de Deméter?$q$;

update public.questions set
  question_en = $t$What is the Roman equivalent of Hestia?$t$,
  options_en  = $t$["Ceres","Vesta","Juno","Minerva"]$t$::jsonb,
  context_en  = $t$Vesta is the Roman equivalent of Hestia. Goddess of the hearth and the sacred fire.$t$
where category = 'mitologia' and question = $q$¿Cuál es el equivalente romano de Hestia?$q$;

update public.questions set
  question_en = $t$Who is the Greek goddess of wisdom?$t$,
  options_en  = $t$["Athena","Aphrodite","Hera","Artemis"]$t$::jsonb,
  context_en  = $t$Athena is the Greek goddess of wisdom, the arts and strategic warfare. Daughter of Zeus.$t$
where category = 'mitologia' and question = $q$¿Quién es la diosa griega de la sabiduría?$q$;

update public.questions set
  question_en = $t$Who is the Greek goddess of love?$t$,
  options_en  = $t$["Hera","Athena","Aphrodite","Artemis"]$t$::jsonb,
  context_en  = $t$Aphrodite is the Greek goddess of love, beauty and fertility.$t$
where category = 'mitologia' and question = $q$¿Quién es la diosa griega del amor?$q$;

update public.questions set
  question_en = $t$What is the sacred mountain of the Greek gods?$t$,
  options_en  = $t$["Parnassus","Olympus","Etna","Athos"]$t$::jsonb,
  context_en  = $t$Mount Olympus, the highest in Greece (2,917 m), was the residence of the gods according to mythology.$t$
where category = 'mitologia' and question = $q$¿Cuál es el monte sagrado de los dioses griegos?$q$;

update public.questions set
  question_en = $t$Who is the Greek goddess of the rainbow?$t$,
  options_en  = $t$["Iris","Hebe","Eos","Selene"]$t$::jsonb,
  context_en  = $t$Iris is the messenger goddess and personification of the rainbow. She connects the sky with the earth.$t$
where category = 'mitologia' and question = $q$¿Quién es la diosa griega del arco iris?$q$;

update public.questions set
  question_en = $t$Who is the Greek goddess of the dawn?$t$,
  options_en  = $t$["Selene","Eos","Iris","Astraea"]$t$::jsonb,
  context_en  = $t$Eos is the Greek goddess of the dawn. In Roman mythology, her equivalent is Aurora.$t$
where category = 'mitologia' and question = $q$¿Quién es la diosa griega de la aurora?$q$;

update public.questions set
  question_en = $t$Who is the Greek sun god?$t$,
  options_en  = $t$["Apollo","Helios","Hyperion","All of the above in different traditions"]$t$::jsonb,
  context_en  = $t$Helios was the original sun god. Apollo later assimilated this function. Hyperion is his Titan father.$t$
where category = 'mitologia' and question = $q$¿Quién es el dios griego del sol?$q$;

update public.questions set
  question_en = $t$Who is the Greek goddess of the moon?$t$,
  options_en  = $t$["Hecate","Selene","Artemis","All of the above"]$t$::jsonb,
  context_en  = $t$Selene is the original personification of the moon. Artemis and Hecate are also associated with it in different contexts.$t$
where category = 'mitologia' and question = $q$¿Quién es la diosa griega de la luna?$q$;

update public.questions set
  question_en = $t$Who is Hecate?$t$,
  options_en  = $t$["Goddess of magic and crossroads","Goddess of love","Goddess of the hunt","Goddess of the sky"]$t$::jsonb,
  context_en  = $t$Hecate is the goddess of magic, witchcraft, ghosts and crossroads.$t$
where category = 'mitologia' and question = $q$¿Quién es Hécate?$q$;

update public.questions set
  question_en = $t$What was the name of the figure who opened the forbidden box in Greek mythology?$t$,
  options_en  = $t$["Pandora","Arachne","Penelope","Cassandra"]$t$::jsonb,
  context_en  = $t$Pandora opened the 'box' (actually a jar, pithos) that contained all the evils of the world, leaving only hope inside.$t$
where category = 'mitologia' and question = $q$¿Cómo se llamaba el héroe que abrió la caja prohibida en la mitología griega?$q$;

update public.questions set
  question_en = $t$Who was the first king of the gods according to the Greeks (before Zeus)?$t$,
  options_en  = $t$["Cronus","Uranus","Helios","Typhon"]$t$::jsonb,
  context_en  = $t$Cronus overthrew his father Uranus. He devoured his children to avoid being dethroned. Zeus, his son, ultimately defeated him.$t$
where category = 'mitologia' and question = $q$¿Quién fue el primer rey de los dioses según los griegos (antes de Zeus)?$q$;

update public.questions set
  question_en = $t$Which Titan holds up the sky according to mythology?$t$,
  options_en  = $t$["Cronus","Atlas","Prometheus","Hyperion"]$t$::jsonb,
  context_en  = $t$Atlas was condemned by Zeus to hold the celestial vault on his shoulders as punishment.$t$
where category = 'mitologia' and question = $q$¿Qué titán sostiene el cielo según la mitología?$q$;

update public.questions set
  question_en = $t$Who stole fire from the gods?$t$,
  options_en  = $t$["Heracles","Prometheus","Atlas","Epimetheus"]$t$::jsonb,
  context_en  = $t$Prometheus stole fire from the gods to give it to humans. Zeus chained him to a rock as punishment.$t$
where category = 'mitologia' and question = $q$¿Quién le robó el fuego a los dioses?$q$;

update public.questions set
  question_en = $t$What punishment did Prometheus receive?$t$,
  options_en  = $t$["Holding up the sky","Having an eagle devour his liver","Going down to Hades","Being turned to stone"]$t$::jsonb,
  context_en  = $t$Prometheus was chained to the Caucasus. An eagle devoured his liver every day, regenerating at night. Heracles freed him.$t$
where category = 'mitologia' and question = $q$¿Qué castigo recibió Prometeo?$q$;

update public.questions set
  question_en = $t$Which is the winged horse with a horn?$t$,
  options_en  = $t$["Pegasus","Unicorn","Chimera","Centaur"]$t$::jsonb,
  context_en  = $t$The unicorn is the horse with one horn. Pegasus is the winged horse but without a horn.$t$
where category = 'mitologia' and question = $q$¿Cuál es el caballo alado con un cuerno?$q$;

update public.questions set
  question_en = $t$Which beings have a human torso and a horse's body?$t$,
  options_en  = $t$["Centaurs","Satyrs","Fauns","Minotaurs"]$t$::jsonb,
  context_en  = $t$Centaurs have a human torso and a horse's body. Chiron was the wise centaur, teacher of heroes.$t$
where category = 'mitologia' and question = $q$¿Qué seres tienen torso humano y cuerpo de caballo?$q$;

update public.questions set
  question_en = $t$Which centaur was the teacher of Achilles?$t$,
  options_en  = $t$["Nessus","Chiron","Polyphemus","Hercules"]$t$::jsonb,
  context_en  = $t$Chiron, the wisest of the centaurs, educated Achilles, Jason, Asclepius and other heroes.$t$
where category = 'mitologia' and question = $q$¿Quién fue el centauro maestro de Aquiles?$q$;

update public.questions set
  question_en = $t$Which Greek hero won the Golden Fleece?$t$,
  options_en  = $t$["Heracles","Theseus","Jason","Perseus"]$t$::jsonb,
  context_en  = $t$Jason and the Argonauts traveled to Colchis in search of the Golden Fleece.$t$
where category = 'mitologia' and question = $q$¿Qué héroe griego conquistó el Vellocino de Oro?$q$;

update public.questions set
  question_en = $t$What is the name of Jason's ship?$t$,
  options_en  = $t$["Argo","Aurea","Nautilus","Pelias"]$t$::jsonb,
  context_en  = $t$The Argo was built by Argus with the help of Athena for Jason's voyage. The crew are the 'Argonauts'.$t$
where category = 'mitologia' and question = $q$¿Cómo se llama el barco de Jasón?$q$;

update public.questions set
  question_en = $t$Who is the mother of Achilles?$t$,
  options_en  = $t$["Hera","Thetis","Eos","Ariadne"]$t$::jsonb,
  context_en  = $t$Thetis, a sea nymph, was the mother of Achilles. She dipped him in the Styx to make him invulnerable, except for the heel.$t$
where category = 'mitologia' and question = $q$¿Quién es la madre de Aquiles?$q$;

update public.questions set
  question_en = $t$What is the 'Achilles' heel'?$t$,
  options_en  = $t$["His only vulnerable point","His weapon","His shield","His horse"]$t$::jsonb,
  context_en  = $t$The Achilles heel, where Thetis held him, was his only vulnerable point. An arrow from Paris there killed him.$t$
where category = 'mitologia' and question = $q$¿Cuál es el "talón de Aquiles"?$q$;

update public.questions set
  question_en = $t$Who killed Achilles in the Trojan War?$t$,
  options_en  = $t$["Hector","Paris","Aeneas","Priam"]$t$::jsonb,
  context_en  = $t$Paris (a Trojan prince), guided by Apollo, shot the arrow that killed Achilles by striking his heel.$t$
where category = 'mitologia' and question = $q$¿Quién mató a Aquiles en la guerra de Troya?$q$;

update public.questions set
  question_en = $t$Who is the father of Hector and Paris?$t$,
  options_en  = $t$["Priam","Aeneas","Cassandra","Anchises"]$t$::jsonb,
  context_en  = $t$Priam, king of Troy, was the father of Hector, Paris, Cassandra and 50 other children.$t$
where category = 'mitologia' and question = $q$¿Quién es el padre de Héctor y Paris?$q$;

update public.questions set
  question_en = $t$Who is the prophetess of Troy whose prophecies no one believed?$t$,
  options_en  = $t$["Helen","Iphigenia","Cassandra","Atalanta"]$t$::jsonb,
  context_en  = $t$Cassandra, daughter of Priam, received from Apollo the gift of prophecy but also the curse of not being believed.$t$
where category = 'mitologia' and question = $q$¿Quién es la profetisa de Troya cuyas profecías nadie creía?$q$;

update public.questions set
  question_en = $t$Who abducted Helen from Sparta?$t$,
  options_en  = $t$["Hector","Paris","Achilles","Aeneas"]$t$::jsonb,
  context_en  = $t$Paris abducted Helen, wife of King Menelaus, provoking the Trojan War.$t$
where category = 'mitologia' and question = $q$¿Quién raptó a Helena de Esparta?$q$;

update public.questions set
  question_en = $t$Who is the author of 'The Iliad' and 'The Odyssey'?$t$,
  options_en  = $t$["Hesiod","Homer","Pindar","Sophocles"]$t$::jsonb,
  context_en  = $t$Homer (8th century BC) is the traditional author of 'The Iliad' and 'The Odyssey'.$t$
where category = 'mitologia' and question = $q$¿Quién es el autor de "La Ilíada" y "La Odisea"?$q$;

update public.questions set
  question_en = $t$How many years did Odysseus wander after the Trojan War?$t$,
  options_en  = $t$["3","7","10","20"]$t$::jsonb,
  context_en  = $t$According to the Odyssey, Odysseus (Ulysses) took 10 years to return to Ithaca after the Trojan War.$t$
where category = 'mitologia' and question = $q$¿Cuántos años vagó Odiseo tras la guerra de Troya?$q$;

update public.questions set
  question_en = $t$Who is the wife of Odysseus?$t$,
  options_en  = $t$["Helen","Penelope","Andromache","Clytemnestra"]$t$::jsonb,
  context_en  = $t$Penelope, wife of Odysseus, patiently waited for her husband for 20 years, weaving and unweaving a shroud.$t$
where category = 'mitologia' and question = $q$¿Quién es la esposa de Odiseo?$q$;

update public.questions set
  question_en = $t$Who is the son of Odysseus and Penelope?$t$,
  options_en  = $t$["Telegonus","Telemachus","Achilles","Apollo"]$t$::jsonb,
  context_en  = $t$Telemachus, son of Odysseus, was the protagonist of the first four books of the Odyssey (the 'Telemachy').$t$
where category = 'mitologia' and question = $q$¿Quién es el hijo de Odiseo y Penélope?$q$;

update public.questions set
  question_en = $t$Which Cyclops did Odysseus encounter?$t$,
  options_en  = $t$["Argus","Polyphemus","Briareus","Steropes"]$t$::jsonb,
  context_en  = $t$Odysseus blinded the Cyclops Polyphemus, son of Poseidon, which provoked the enmity of the sea god.$t$
where category = 'mitologia' and question = $q$¿Qué cíclope encontró Odiseo?$q$;

update public.questions set
  question_en = $t$Who is the sorceress who turned Odysseus's men into pigs?$t$,
  options_en  = $t$["Calypso","Circe","Medea","Hecate"]$t$::jsonb,
  context_en  = $t$Circe, a sorceress of the island of Aeaea, transformed Odysseus's crew into pigs.$t$
where category = 'mitologia' and question = $q$¿Quién es la hechicera que convirtió a los hombres de Odiseo en cerdos?$q$;

update public.questions set
  question_en = $t$Who held Odysseus for 7 years on an island?$t$,
  options_en  = $t$["Circe","Calypso","Helen","Andromache"]$t$::jsonb,
  context_en  = $t$The nymph Calypso held Odysseus on the island of Ogygia for 7 years, offering him immortality.$t$
where category = 'mitologia' and question = $q$¿Quién retuvo a Odiseo durante 7 años en una isla?$q$;

update public.questions set
  question_en = $t$Which dangerous creatures lured sailors with their song?$t$,
  options_en  = $t$["The Gorgons","The Sirens","The Harpies","The Furies"]$t$::jsonb,
  context_en  = $t$The Sirens lured sailors with their irresistible song, driving them to shipwreck.$t$
where category = 'mitologia' and question = $q$¿Qué peligrosas criaturas atraían a los marinos con su canto?$q$;

update public.questions set
  question_en = $t$How did Odysseus escape the Sirens' song?$t$,
  options_en  = $t$["He tied himself to the mast","He killed them","He fled","He fell asleep"]$t$::jsonb,
  context_en  = $t$Odysseus plugged his sailors' ears with wax and had himself tied to the mast so he could hear the song without succumbing.$t$
where category = 'mitologia' and question = $q$¿Cómo escapó Odiseo del canto de las sirenas?$q$;

update public.questions set
  question_en = $t$Who are Scylla and Charybdis?$t$,
  options_en  = $t$["Goddesses","Sea monsters","Sirens","Heroines"]$t$::jsonb,
  context_en  = $t$Scylla was a multi-headed monster and Charybdis a whirlpool. They were in a strait (Messina?) through which Odysseus had to pass.$t$
where category = 'mitologia' and question = $q$¿Quiénes son Escila y Caribdis?$q$;

update public.questions set
  question_en = $t$Who is Oedipus?$t$,
  options_en  = $t$["King of Thebes who killed his father and married his mother","A Greek hero","A philosopher","A prophet"]$t$::jsonb,
  context_en  = $t$Oedipus, king of Thebes, unknowingly killed his father Laius and married his mother Jocasta, fulfilling a prophecy.$t$
where category = 'mitologia' and question = $q$¿Quién es Edipo?$q$;

update public.questions set
  question_en = $t$Which famous riddle did Oedipus solve?$t$,
  options_en  = $t$["The Sphinx's","The labyrinth's","The Minotaur's","Pythia's"]$t$::jsonb,
  context_en  = $t$Oedipus solved the riddle of the Sphinx of Thebes: 'What animal walks on 4 legs in the morning, 2 at noon and 3 at night?'. Answer: the human being.$t$
where category = 'mitologia' and question = $q$¿Qué famoso enigma resolvió Edipo?$q$;

update public.questions set
  question_en = $t$Which god condemned Sisyphus to push a rock eternally?$t$,
  options_en  = $t$["Zeus","Hades","Poseidon","Apollo"]$t$::jsonb,
  context_en  = $t$Sisyphus was condemned by Zeus to push a rock to the top of a mountain, where it always rolled back down.$t$
where category = 'mitologia' and question = $q$¿Qué dios castigó a Sísifo a empujar una roca eternamente?$q$;

update public.questions set
  question_en = $t$Who is Tantalus?$t$,
  options_en  = $t$["Condemned to never drink or eat","A Trojan prophet","King of Sparta","Father of Achilles"]$t$::jsonb,
  context_en  = $t$Tantalus, condemned by the gods, was submerged in water up to his neck but could not drink, with fruit above his head but could not eat it.$t$
where category = 'mitologia' and question = $q$¿Quién es Tántalo?$q$;

update public.questions set
  question_en = $t$Which Greek hero defeated the Amazons?$t$,
  options_en  = $t$["Theseus","Heracles","Achilles","Jason"]$t$::jsonb,
  context_en  = $t$Heracles (Hercules), in his 9th labor, obtained the belt of the Amazon queen Hippolyta.$t$
where category = 'mitologia' and question = $q$¿Qué héroe griego derrotó a las amazonas?$q$;

update public.questions set
  question_en = $t$Who is the queen of the Amazons in mythology?$t$,
  options_en  = $t$["Hippolyta","Penthesilea","Myrina","All of them (at different times)"]$t$::jsonb,
  context_en  = $t$Hippolyta and Penthesilea are two famous Amazon queens, in different episodes of the myth.$t$
where category = 'mitologia' and question = $q$¿Quién es la reina de las amazonas en la mitología?$q$;

update public.questions set
  question_en = $t$Which Egyptian god is the husband of Isis?$t$,
  options_en  = $t$["Anubis","Horus","Osiris","Ra"]$t$::jsonb,
  context_en  = $t$Osiris is the husband and brother of Isis. He was murdered by his brother Set and resurrected by Isis.$t$
where category = 'mitologia' and question = $q$¿Qué dios egipcio es esposo de Isis?$q$;

update public.questions set
  question_en = $t$Who is the Egyptian sky god, son of Isis and Osiris?$t$,
  options_en  = $t$["Anubis","Horus","Thoth","Set"]$t$::jsonb,
  context_en  = $t$Horus, with a falcon head, is the son of Isis and Osiris. Avenger of his father, associated with royalty.$t$
where category = 'mitologia' and question = $q$¿Quién es el dios egipcio del cielo, hijo de Isis y Osiris?$q$;

update public.questions set
  question_en = $t$Who is Anubis?$t$,
  options_en  = $t$["God of mummification","Sun god","Sky god","God of war"]$t$::jsonb,
  context_en  = $t$Anubis, with a jackal head, is the god of mummification and guardian of the dead in the Egyptian pantheon.$t$
where category = 'mitologia' and question = $q$¿Quién es Anubis?$q$;

update public.questions set
  question_en = $t$Who is Thoth?$t$,
  options_en  = $t$["Egyptian god of writing and wisdom","Sun god","God of war","Mother goddess"]$t$::jsonb,
  context_en  = $t$Thoth, with an ibis head, is the Egyptian god of writing, wisdom and the moon.$t$
where category = 'mitologia' and question = $q$¿Quién es Thot?$q$;

update public.questions set
  question_en = $t$Which Egyptian god murdered his brother Osiris?$t$,
  options_en  = $t$["Horus","Anubis","Set","Thoth"]$t$::jsonb,
  context_en  = $t$Set, god of chaos and the deserts, murdered his brother Osiris out of jealousy for the throne of Egypt.$t$
where category = 'mitologia' and question = $q$¿Qué dios egipcio asesinó a su hermano Osiris?$q$;

update public.questions set
  question_en = $t$Who is Bastet?$t$,
  options_en  = $t$["Egyptian goddess with a cat's head","Goddess of the Nile","Sky goddess","Mother goddess"]$t$::jsonb,
  context_en  = $t$Bastet, with a cat's head, was the Egyptian goddess of the home, fertility and cats.$t$
where category = 'mitologia' and question = $q$¿Quién es Bastet?$q$;

update public.questions set
  question_en = $t$Who is Sekhmet?$t$,
  options_en  = $t$["Goddess with a lioness head","Sky goddess","Mother goddess","Goddess of the Nile"]$t$::jsonb,
  context_en  = $t$Sekhmet, with a lioness head, was the Egyptian goddess of war, disease and healing.$t$
where category = 'mitologia' and question = $q$¿Quién es Sekhmet?$q$;

update public.questions set
  question_en = $t$Who is the king of the Norse gods?$t$,
  options_en  = $t$["Thor","Odin","Loki","Freyr"]$t$::jsonb,
  context_en  = $t$Odin, father of Thor and Loki's adoptive brother, is the king of the Norse gods. He resides in Asgard.$t$
where category = 'mitologia' and question = $q$¿Cuál es el rey de los dioses nórdicos?$q$;

update public.questions set
  question_en = $t$How many eyes does Odin have?$t$,
  options_en  = $t$["0","1","2","3"]$t$::jsonb,
  context_en  = $t$Odin sacrificed one of his eyes at Mimir's well in exchange for wisdom.$t$
where category = 'mitologia' and question = $q$¿Cuántos ojos tiene Odín?$q$;

update public.questions set
  question_en = $t$What are the names of Odin's ravens?$t$,
  options_en  = $t$["Hugin and Munin","Sleipnir","Geri and Freki","Mimir"]$t$::jsonb,
  context_en  = $t$Hugin ('thought') and Munin ('memory') are Odin's ravens. They fly around the world and bring him news.$t$
where category = 'mitologia' and question = $q$¿Cómo se llaman los cuervos de Odín?$q$;

update public.questions set
  question_en = $t$How many legs does Sleipnir, Odin's horse, have?$t$,
  options_en  = $t$["4","6","8","10"]$t$::jsonb,
  context_en  = $t$Sleipnir, son of Loki, has 8 legs. He is the fastest horse and travels through all the worlds.$t$
where category = 'mitologia' and question = $q$¿Cuántas patas tiene Sleipnir, el caballo de Odín?$q$;

update public.questions set
  question_en = $t$Who is Frigg?$t$,
  options_en  = $t$["Wife of Odin","Sister of Thor","Daughter of Loki","Goddess of death"]$t$::jsonb,
  context_en  = $t$Frigg, wife of Odin, is the Norse goddess of marriage, motherhood and domestic wisdom.$t$
where category = 'mitologia' and question = $q$¿Quién es Frigg?$q$;

update public.questions set
  question_en = $t$Who is Loki's daughter who rules the realm of the Norse dead?$t$,
  options_en  = $t$["Hel","Freyja","Sif","Skadi"]$t$::jsonb,
  context_en  = $t$Hel is Loki's daughter. She rules the realm of the same name, where the dead who did not fall in battle go.$t$
where category = 'mitologia' and question = $q$¿Quién es la hija de Loki que gobierna el reino de los muertos nórdicos?$q$;

update public.questions set
  question_en = $t$Who is Freyja in Norse mythology?$t$,
  options_en  = $t$["Goddess of love and war","Goddess of the harvest","Goddess of death","Mother goddess"]$t$::jsonb,
  context_en  = $t$Freyja is the Norse goddess of love, beauty, fertility and magic (seidr). She also receives half of those who die in battle.$t$
where category = 'mitologia' and question = $q$¿Quién es Freyja en la mitología nórdica?$q$;

update public.questions set
  question_en = $t$What is the realm of the giants in Norse mythology?$t$,
  options_en  = $t$["Asgard","Midgard","Jotunheim","Niflheim"]$t$::jsonb,
  context_en  = $t$Jotunheim is the land of the jotuns (giants). Asgard is that of the Æsir gods. Midgard is that of humans.$t$
where category = 'mitologia' and question = $q$¿Cuál es el reino de los gigantes en la mitología nórdica?$q$;

update public.questions set
  question_en = $t$What is the name of the bridge that connects Asgard with Midgard?$t$,
  options_en  = $t$["Bifröst","Gjallarbrú","Mjölnir","Yggdrasil"]$t$::jsonb,
  context_en  = $t$Bifröst is the rainbow bridge that connects Asgard (realm of the gods) with Midgard (world of humans).$t$
where category = 'mitologia' and question = $q$¿Cómo se llama el puente que une Asgard con Midgard?$q$;

update public.questions set
  question_en = $t$Who is Heimdall?$t$,
  options_en  = $t$["Guardian of the Bifröst","Son of Odin","Guardian of the gods","All of the above"]$t$::jsonb,
  context_en  = $t$Heimdall, son of nine mothers, guards the Bifröst against the giants. He will blow the horn Gjallarhorn at the start of Ragnarök.$t$
where category = 'mitologia' and question = $q$¿Quién es Heimdall?$q$;

update public.questions set
  question_en = $t$Who is the god of fertility and crops in Norse mythology?$t$,
  options_en  = $t$["Freyr","Thor","Heimdall","Tyr"]$t$::jsonb,
  context_en  = $t$Freyr, brother of Freyja, is the god of fertility, prosperity and the sun.$t$
where category = 'mitologia' and question = $q$¿Quién es el dios de la fertilidad y los frutos en la mitología nórdica?$q$;

update public.questions set
  question_en = $t$Which wolf will kill Odin at Ragnarök?$t$,
  options_en  = $t$["Fenrir","Sköll","Hati","Garm"]$t$::jsonb,
  context_en  = $t$Fenrir, a giant wolf and son of Loki, will devour Odin during Ragnarök.$t$
where category = 'mitologia' and question = $q$¿Quién es el lobo que matará a Odín en el Ragnarok?$q$;

update public.questions set
  question_en = $t$Which serpent surrounds the world in Norse mythology?$t$,
  options_en  = $t$["Jörmungandr","Nidhogg","Sleipnir","Garm"]$t$::jsonb,
  context_en  = $t$Jörmungandr, the 'World Serpent' (Midgardsormr), is a child of Loki. It surrounds Midgard biting its own tail.$t$
where category = 'mitologia' and question = $q$¿Qué serpiente rodea el mundo en la mitología nórdica?$q$;

update public.questions set
  question_en = $t$Who will kill Jörmungandr at Ragnarök?$t$,
  options_en  = $t$["Odin","Thor","Freyr","Heimdall"]$t$::jsonb,
  context_en  = $t$Thor will kill Jörmungandr at Ragnarök, but will die poisoned after 9 steps.$t$
where category = 'mitologia' and question = $q$¿Quién matará a Jörmungandr en el Ragnarok?$q$;

update public.questions set
  question_en = $t$Which Hindu god is known as 'the destroyer'?$t$,
  options_en  = $t$["Brahma","Vishnu","Shiva","Krishna"]$t$::jsonb,
  context_en  = $t$Shiva is one of the three main gods of Hinduism, known as 'the destroyer' or 'the transformer'.$t$
where category = 'mitologia' and question = $q$¿Qué dios hindú es conocido como "el destructor"?$q$;

update public.questions set
  question_en = $t$Which Hindu god is the 'preserver'?$t$,
  options_en  = $t$["Brahma","Vishnu","Shiva","Indra"]$t$::jsonb,
  context_en  = $t$Vishnu, the preserver, incarnates in various avatars (like Rama, Krishna and Buddha) to restore dharma.$t$
where category = 'mitologia' and question = $q$¿Qué dios hindú es el "preservador"?$q$;

update public.questions set
  question_en = $t$Which Hindu god is the 'creator'?$t$,
  options_en  = $t$["Brahma","Vishnu","Shiva","Ganesha"]$t$::jsonb,
  context_en  = $t$Brahma is the creator god in the Hindu Trimurti (Brahma, Vishnu, Shiva).$t$
where category = 'mitologia' and question = $q$¿Qué dios hindú es el "creador"?$q$;

update public.questions set
  question_en = $t$Who is Ganesha?$t$,
  options_en  = $t$["Hindu god with an elephant head","Sun god","God of fire","Sky god"]$t$::jsonb,
  context_en  = $t$Ganesha, son of Shiva and Parvati, has an elephant head. He is the god of beginnings, remover of obstacles.$t$
where category = 'mitologia' and question = $q$¿Quién es Ganesha?$q$;

update public.questions set
  question_en = $t$Which Hindu goddess is the wife of Shiva?$t$,
  options_en  = $t$["Lakshmi","Saraswati","Parvati","Durga"]$t$::jsonb,
  context_en  = $t$Parvati is the wife of Shiva. Mother of Ganesha and Kartikeya. She manifests as Durga or Kali in her warrior aspects.$t$
where category = 'mitologia' and question = $q$¿Qué diosa hindú es esposa de Shiva?$q$;

update public.questions set
  question_en = $t$Which Hindu goddess is the wife of Vishnu?$t$,
  options_en  = $t$["Saraswati","Lakshmi","Parvati","Durga"]$t$::jsonb,
  context_en  = $t$Lakshmi is the wife of Vishnu and the goddess of prosperity, wealth, fortune and beauty.$t$
where category = 'mitologia' and question = $q$¿Qué diosa hindú es la esposa de Vishnu?$q$;

update public.questions set
  question_en = $t$Which Maya/Aztec god represents the sun and war?$t$,
  options_en  = $t$["Quetzalcoatl","Tezcatlipoca","Huitzilopochtli","Tlaloc"]$t$::jsonb,
  context_en  = $t$Huitzilopochtli was the main solar and war god of the Aztecs. Patron of the city of Tenochtitlan.$t$
where category = 'mitologia' and question = $q$¿Qué dios maya/azteca representa al sol y la guerra?$q$;

update public.questions set
  question_en = $t$Which Maya/Aztec god is the god of rain?$t$,
  options_en  = $t$["Tlaloc","Quetzalcoatl","Tezcatlipoca","Mictlantecuhtli"]$t$::jsonb,
  context_en  = $t$Tlaloc was the Mexica god of rain and fertility. The equivalent of the Maya Chaac.$t$
where category = 'mitologia' and question = $q$¿Qué dios maya/azteca es el dios de la lluvia?$q$;

update public.questions set
  question_en = $t$Who is the Maya/Aztec god of the underworld?$t$,
  options_en  = $t$["Tlaloc","Mictlantecuhtli","Quetzalcoatl","Coyolxauhqui"]$t$::jsonb,
  context_en  = $t$Mictlantecuhtli was the god of the underworld (Mictlan) in Mexica/Aztec mythology.$t$
where category = 'mitologia' and question = $q$¿Quién es el dios maya/azteca del inframundo?$q$;

update public.questions set
  question_en = $t$Which Aztec goddess was the mother of Huitzilopochtli?$t$,
  options_en  = $t$["Tonantzin","Coatlicue","Coyolxauhqui","Mictecacihuatl"]$t$::jsonb,
  context_en  = $t$Coatlicue ('the one with the serpent skirt') was the mother of Huitzilopochtli and goddess of fertility and the earth.$t$
where category = 'mitologia' and question = $q$¿Qué diosa azteca era madre de Huitzilopochtli?$q$;

update public.questions set
  question_en = $t$What is the Popol Vuh?$t$,
  options_en  = $t$["A sacred Maya text","An Aztec text","An Inca text","An Egyptian text"]$t$::jsonb,
  context_en  = $t$The Popol Vuh is the sacred book of the K'iche' Maya people. It contains the creation of the world and the exploits of the divine twins.$t$
where category = 'mitologia' and question = $q$¿Qué es el Popol Vuh?$q$;

update public.questions set
  question_en = $t$Which is the main god of the Incas?$t$,
  options_en  = $t$["Pachamama","Inti","Viracocha","Mama Killa"]$t$::jsonb,
  context_en  = $t$Inti, the sun, was the main god of the Incas. Viracocha was the creator god. Pachamama, the mother earth.$t$
where category = 'mitologia' and question = $q$¿Cuál es el dios principal de los incas?$q$;

update public.questions set
  question_en = $t$What does Pachamama represent?$t$,
  options_en  = $t$["The Earth","The sun","The sea","The moon"]$t$::jsonb,
  context_en  = $t$Pachamama is the mother earth in Andean religions. Goddess of fertility, the harvest and nature.$t$
where category = 'mitologia' and question = $q$¿Qué representa Pachamama?$q$;

update public.questions set
  question_en = $t$Who was Brahma in Hindu mythology?$t$,
  options_en  = $t$["The creator","The destroyer","The preserver","Love"]$t$::jsonb,
  context_en  = $t$Brahma is the creator god in the Hindu trinity (Trimurti).$t$
where category = 'mitologia' and question = $q$¿Quién era Brahma en la mitología hindú?$q$;

update public.questions set
  question_en = $t$What is the Mahabharata?$t$,
  options_en  = $t$["A Hindu epic text","A sacred Aztec text","An Egyptian text","A Buddhist book"]$t$::jsonb,
  context_en  = $t$The Mahabharata is one of the great Hindu epic texts (~100,000 verses). It contains the Bhagavad Gita.$t$
where category = 'mitologia' and question = $q$¿Qué es el Mahabharata?$q$;

update public.questions set
  question_en = $t$Which Chinese god is the 'Jade Emperor'?$t$,
  options_en  = $t$["Supreme ruler of heaven","God of fire","God of water","God of war"]$t$::jsonb,
  context_en  = $t$The Jade Emperor (Yu Huang) is the supreme ruler of heaven in traditional Chinese mythology.$t$
where category = 'mitologia' and question = $q$¿Qué dios chino es el "Emperador de Jade"?$q$;

update public.questions set
  question_en = $t$Which divine animal is the guardian of the east in China?$t$,
  options_en  = $t$["Tortoise","Azure Dragon","White Tiger","Phoenix"]$t$::jsonb,
  context_en  = $t$The Azure Dragon guards the east in Chinese cosmology. The others: White Tiger (west), Vermilion Bird (south), Black Tortoise (north).$t$
where category = 'mitologia' and question = $q$¿Qué animal divino es el guardián del este en China?$q$;

update public.questions set
  question_en = $t$Which Japanese dragon is famous for being killed by Susanoo?$t$,
  options_en  = $t$["Yamata no Orochi","Ryūjin","Kuraokami","Watatsumi"]$t$::jsonb,
  context_en  = $t$Yamata no Orochi was an 8-headed dragon. Susanoo got it drunk on sake before killing it.$t$
where category = 'mitologia' and question = $q$¿Qué dragón japonés es famoso por ser asesinado por Susanoo?$q$;

update public.questions set
  question_en = $t$Who is Amaterasu?$t$,
  options_en  = $t$["Japanese sun goddess","Chinese moon goddess","Korean goddess","Indian goddess"]$t$::jsonb,
  context_en  = $t$Amaterasu Ōmikami is the sun goddess in Shinto. The Japanese imperial family claims to descend from her.$t$
where category = 'mitologia' and question = $q$¿Quién es Amaterasu?$q$;

update public.questions set
  question_en = $t$What is a kitsune?$t$,
  options_en  = $t$["A fox spirit in Japanese folklore","A demon","A god of water","A forest spirit"]$t$::jsonb,
  context_en  = $t$Kitsune are fox spirits from Japanese folklore. They can have up to 9 tails and possess magical powers.$t$
where category = 'mitologia' and question = $q$¿Qué es un kitsune?$q$;

update public.questions set
  question_en = $t$What is the cosmic tree of the Celts?$t$,
  options_en  = $t$["Bile","The sacred oak","Yggdrasil","Ceiba"]$t$::jsonb,
  context_en  = $t$The oak was the sacred tree par excellence for the Celts. The word 'druid' derives from 'dru' (oak).$t$
where category = 'mitologia' and question = $q$¿Cuál es el árbol cósmico de los celtas?$q$;

update public.questions set
  question_en = $t$Who is King Arthur?$t$,
  options_en  = $t$["A legendary British king","A real King of Scotland","A King of Wales","A King of Cornwall"]$t$::jsonb,
  context_en  = $t$Arthur is a legendary British king who defends his land from the Saxons. A symbol of the chivalric ideal.$t$
where category = 'mitologia' and question = $q$¿Quién es el rey Arturo?$q$;

update public.questions set
  question_en = $t$What is the name of King Arthur's sword?$t$,
  options_en  = $t$["Durendal","Excalibur","Tizona","Mjölnir"]$t$::jsonb,
  context_en  = $t$Excalibur is the legendary sword of King Arthur, given by the Lady of the Lake.$t$
where category = 'mitologia' and question = $q$¿Cómo se llama la espada del rey Arturo?$q$;

update public.questions set
  question_en = $t$Who is Merlin?$t$,
  options_en  = $t$["The wizard-advisor of King Arthur","A knight","A bard","A Christian druid"]$t$::jsonb,
  context_en  = $t$Merlin is the wizard, prophet and advisor of King Arthur in the Arthurian legends.$t$
where category = 'mitologia' and question = $q$¿Quién es Merlín?$q$;

update public.questions set
  question_en = $t$Which legendary island is a paradise in Celtic mythology?$t$,
  options_en  = $t$["Tír na nÓg","Avalon","Annwn","All of the above"]$t$::jsonb,
  context_en  = $t$Tír na nÓg, Avalon and Annwn are different names for paradisiacal 'otherworlds' in Celtic mythologies.$t$
where category = 'mitologia' and question = $q$¿Qué isla legendaria es paradisíaca en la mitología celta?$q$;

update public.questions set
  question_en = $t$Which Egyptian god had a crocodile head?$t$,
  options_en  = $t$["Sobek","Anubis","Horus","Bastet"]$t$::jsonb,
  context_en  = $t$Sobek, god of the Nile and of crocodiles, was worshipped in places like Kom Ombo.$t$
where category = 'mitologia' and question = $q$¿Qué dios egipcio tenía cabeza de cocodrilo?$q$;

update public.questions set
  question_en = $t$Which is the sacred river of the Hindus?$t$,
  options_en  = $t$["Ganges","Indus","Brahmaputra","Yamuna"]$t$::jsonb,
  context_en  = $t$The Ganges (Ganga) is the sacred river of Hinduism. Bathing in it purifies sins according to tradition.$t$
where category = 'mitologia' and question = $q$¿Cuál es el río sagrado de los hindúes?$q$;

update public.questions set
  question_en = $t$Who is Hanuman?$t$,
  options_en  = $t$["A Hindu god in the shape of a monkey","God of water","God of war","Sun god"]$t$::jsonb,
  context_en  = $t$Hanuman is the Hindu monkey god, a symbol of strength, devotion and courage. He accompanied Rama in the Ramayana.$t$
where category = 'mitologia' and question = $q$¿Quién es Hanumán?$q$;

update public.questions set
  question_en = $t$Which Celtic god was the 'Good God' according to the Irish?$t$,
  options_en  = $t$["Dagda","Lugh","Manannán","Nuada"]$t$::jsonb,
  context_en  = $t$The Dagda was the 'Good God' in Celtic-Irish mythology, leader of the Tuatha Dé Danann.$t$
where category = 'mitologia' and question = $q$¿Qué dios celta era el "Buen Dios" según los irlandeses?$q$;

update public.questions set
  question_en = $t$Who is Cú Chulainn?$t$,
  options_en  = $t$["A Celtic-Irish hero","A King of Britain","A druid","A god of the sea"]$t$::jsonb,
  context_en  = $t$Cú Chulainn is the legendary hero of the Ulster Cycle in Irish mythology.$t$
where category = 'mitologia' and question = $q$¿Quién es Cú Chulainn?$q$;


-- ── astronomia (156) ──
update public.questions set
  question_en = $t$What is the largest planet in the solar system?$t$,
  options_en  = $t$["Saturn","Jupiter","Neptune","Uranus"]$t$::jsonb,
  context_en  = $t$Jupiter has a mass 318 times that of Earth. It has at least 95 known moons; Ganymede is the largest in the solar system.$t$
where category = 'astronomia' and question = $q$¿Cuál es el planeta más grande del sistema solar?$q$;

update public.questions set
  question_en = $t$Which galaxy contains our solar system?$t$,
  options_en  = $t$["Andromeda","Milky Way","Triangulum","Sombrero"]$t$::jsonb,
  context_en  = $t$The Milky Way is a barred spiral galaxy about 100,000 light-years in diameter. It contains between 100 and 400 billion stars.$t$
where category = 'astronomia' and question = $q$¿Qué galaxia contiene nuestro sistema solar?$q$;

update public.questions set
  question_en = $t$Who was the first human to walk on the Moon?$t$,
  options_en  = $t$["Buzz Aldrin","Neil Armstrong","Yuri Gagarin","Michael Collins"]$t$::jsonb,
  context_en  = $t$Neil Armstrong walked on the Moon on July 20, 1969, on the Apollo 11 mission. Along with Aldrin, he stayed ~21.5 h on the surface.$t$
where category = 'astronomia' and question = $q$¿Quién fue el primer humano en pisar la Luna?$q$;

update public.questions set
  question_en = $t$How many planets does the solar system have (officially)?$t$,
  options_en  = $t$["7","8","9","10"]$t$::jsonb,
  context_en  = $t$Since 2006, Pluto is a dwarf planet. There remain 8 official planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune.$t$
where category = 'astronomia' and question = $q$¿Cuántos planetas tiene el sistema solar (oficialmente)?$q$;

update public.questions set
  question_en = $t$Which planet is closest to the Sun?$t$,
  options_en  = $t$["Venus","Mercury","Mars","Earth"]$t$::jsonb,
  context_en  = $t$Mercury is the closest to the Sun (~58 M km). It has a year of only 88 Earth days.$t$
where category = 'astronomia' and question = $q$¿Qué planeta está más cerca del Sol?$q$;

update public.questions set
  question_en = $t$At what speed does light travel in a vacuum?$t$,
  options_en  = $t$["200,000 km/s","300,000 km/s","400,000 km/s","150,000 km/s"]$t$::jsonb,
  context_en  = $t$Light travels at 299,792,458 m/s in a vacuum. It is a fundamental constant ('c') in the theory of relativity.$t$
where category = 'astronomia' and question = $q$¿A qué velocidad viaja la luz en el vacío?$q$;

update public.questions set
  question_en = $t$Which star is the center of our solar system?$t$,
  options_en  = $t$["Alpha Centauri","The Sun","Sirius","Polaris"]$t$::jsonb,
  context_en  = $t$The Sun is a yellow dwarf star (G2V) about 4.6 billion years old. It contains 99.86% of the solar system's mass.$t$
where category = 'astronomia' and question = $q$¿Qué estrella es el centro de nuestro sistema solar?$q$;

update public.questions set
  question_en = $t$How many moons does Mars have?$t$,
  options_en  = $t$["0","1","2","4"]$t$::jsonb,
  context_en  = $t$Mars has 2 moons: Phobos and Deimos. They are small and irregular, probably captured asteroids.$t$
where category = 'astronomia' and question = $q$¿Cuántas lunas tiene Marte?$q$;

update public.questions set
  question_en = $t$Which is the closest star to the Sun?$t$,
  options_en  = $t$["Sirius","Alpha Centauri A","Proxima Centauri","Barnard's Star"]$t$::jsonb,
  context_en  = $t$Proxima Centauri (part of the Alpha Centauri system) is ~4.24 light-years away. It is a red dwarf.$t$
where category = 'astronomia' and question = $q$¿Cuál es la estrella más cercana al Sol?$q$;

update public.questions set
  question_en = $t$Which planet is known as the 'red planet'?$t$,
  options_en  = $t$["Mercury","Venus","Mars","Jupiter"]$t$::jsonb,
  context_en  = $t$Mars looks reddish because of the iron oxide on its surface. The Romans associated it with the god of war.$t$
where category = 'astronomia' and question = $q$¿Qué planeta es conocido como el "planeta rojo"?$q$;

update public.questions set
  question_en = $t$Approximately how old is the universe?$t$,
  options_en  = $t$["4.5 billion","13.8 billion","20 billion","100 billion"]$t$::jsonb,
  context_en  = $t$The universe is ~13.8 billion years old, according to measurements of the cosmic microwave background (CMB).$t$
where category = 'astronomia' and question = $q$¿Cuántos años tiene aproximadamente el universo?$q$;

update public.questions set
  question_en = $t$What kind of object is a black hole?$t$,
  options_en  = $t$["A dead star","A region with extreme gravity","A dark galaxy","Antimatter"]$t$::jsonb,
  context_en  = $t$A black hole is a region of spacetime with gravity so intense that not even light escapes. Its boundary is the event horizon.$t$
where category = 'astronomia' and question = $q$¿Qué tipo de objeto es un agujero negro?$q$;

update public.questions set
  question_en = $t$Who proposed the heliocentric model?$t$,
  options_en  = $t$["Galileo","Newton","Copernicus","Kepler"]$t$::jsonb,
  context_en  = $t$Nicolaus Copernicus published 'De revolutionibus orbium coelestium' in 1543. It places the Sun (not Earth) at the center of the system.$t$
where category = 'astronomia' and question = $q$¿Quién propuso el modelo heliocéntrico?$q$;

update public.questions set
  question_en = $t$Which planet has the most visible rings?$t$,
  options_en  = $t$["Jupiter","Saturn","Uranus","Neptune"]$t$::jsonb,
  context_en  = $t$Saturn has the most visible rings, made of billions of particles of ice and rock. All the gas giants have rings.$t$
where category = 'astronomia' and question = $q$¿Qué planeta tiene los anillos más visibles?$q$;

update public.questions set
  question_en = $t$How long does the Earth take to rotate on its axis?$t$,
  options_en  = $t$["12 h","24 h","36 h","48 h"]$t$::jsonb,
  context_en  = $t$The Earth completes one rotation in ~24 h (solar day). The sidereal day is 23 h 56 min 4 s.$t$
where category = 'astronomia' and question = $q$¿Cuánto tarda la Tierra en girar sobre sí misma?$q$;

update public.questions set
  question_en = $t$How long does sunlight take to reach the Earth?$t$,
  options_en  = $t$["8 seconds","8 minutes","1 hour","1 day"]$t$::jsonb,
  context_en  = $t$Sunlight takes ~8 minutes and 20 seconds to travel the 150 M km average between the Sun and Earth (1 AU).$t$
where category = 'astronomia' and question = $q$¿Cuánto tarda la luz del Sol en llegar a la Tierra?$q$;

update public.questions set
  question_en = $t$What is Jupiter's 'Great Red Spot'?$t$,
  options_en  = $t$["A volcano","A storm","An asteroid","A sunspot"]$t$::jsonb,
  context_en  = $t$The Great Red Spot is a giant anticyclonic storm on Jupiter, observed for at least 350 years. It is shrinking in size.$t$
where category = 'astronomia' and question = $q$¿Cuál es la "Gran Mancha Roja" de Júpiter?$q$;

update public.questions set
  question_en = $t$Which constellation contains the North Star?$t$,
  options_en  = $t$["Ursa Major","Ursa Minor","Cassiopeia","Orion"]$t$::jsonb,
  context_en  = $t$The North Star (Polaris) is in Ursa Minor. It marks approximately the north celestial pole.$t$
where category = 'astronomia' and question = $q$¿Qué constelación contiene la Estrella Polar?$q$;

update public.questions set
  question_en = $t$Which is the hottest planet in the solar system?$t$,
  options_en  = $t$["Mercury","Venus","Earth","Mars"]$t$::jsonb,
  context_en  = $t$Venus has surface temperatures of ~470 °C, hotter than Mercury. Its dense CO₂ atmosphere traps heat (extreme greenhouse effect).$t$
where category = 'astronomia' and question = $q$¿Cuál es el planeta más caliente del sistema solar?$q$;

update public.questions set
  question_en = $t$What is the closest galaxy to the Milky Way?$t$,
  options_en  = $t$["Andromeda","Triangulum","Magellanic","Sombrero"]$t$::jsonb,
  context_en  = $t$Andromeda (M31) is the closest spiral galaxy, at 2.5 million light-years. It will collide with the Milky Way in ~4.5 billion years.$t$
where category = 'astronomia' and question = $q$¿Cómo se llama la galaxia más cercana a la Vía Láctea?$q$;

update public.questions set
  question_en = $t$Which space telescope succeeded the Hubble?$t$,
  options_en  = $t$["James Webb","Spitzer","Kepler","Chandra"]$t$::jsonb,
  context_en  = $t$The James Webb Space Telescope was launched in 2021. It observes mainly in the infrared, complementing (not replacing) the Hubble.$t$
where category = 'astronomia' and question = $q$¿Qué telescopio espacial sustituyó al Hubble?$q$;

update public.questions set
  question_en = $t$What is the unit used for distances between stars?$t$,
  options_en  = $t$["Kilometer","AU","Light-year","Megameter"]$t$::jsonb,
  context_en  = $t$The light-year is the distance light travels in one year: ~9.46 trillion km. The parsec (3.26 light-years) is also used.$t$
where category = 'astronomia' and question = $q$¿Cuál es la unidad usada para distancias entre estrellas?$q$;

update public.questions set
  question_en = $t$What is the name of the theory of the origin of the universe?$t$,
  options_en  = $t$["Steady state","Big Bang","Cyclic universe","Big Bounce"]$t$::jsonb,
  context_en  = $t$The Big Bang proposes that the universe expanded from a dense, hot state ~13.8 billion years ago.$t$
where category = 'astronomia' and question = $q$¿Qué nombre recibe la teoría del origen del universo?$q$;

update public.questions set
  question_en = $t$What are shooting stars called?$t$,
  options_en  = $t$["Meteors","Comets","Asteroids","Supernovae"]$t$::jsonb,
  context_en  = $t$Meteors are luminous streaks of small bodies that burn up on entering the atmosphere. If they survive impact, they are meteorites.$t$
where category = 'astronomia' and question = $q$¿Cómo se llaman las estrellas fugaces?$q$;

update public.questions set
  question_en = $t$Which NASA spacecraft reached Pluto in 2015?$t$,
  options_en  = $t$["Voyager 1","Pioneer 10","New Horizons","Cassini"]$t$::jsonb,
  context_en  = $t$New Horizons flew by Pluto on July 14, 2015, sending the first detailed images of this icy world.$t$
where category = 'astronomia' and question = $q$¿Qué nave de la NASA llegó a Plutón en 2015?$q$;

update public.questions set
  question_en = $t$What phase is the Moon in when it cannot be seen from Earth?$t$,
  options_en  = $t$["Full","New","First quarter","Last quarter"]$t$::jsonb,
  context_en  = $t$At new moon, the illuminated side faces the Sun and we do not see the Moon's night side. This is when solar eclipses occur.$t$
where category = 'astronomia' and question = $q$¿Qué fase tiene la Luna cuando no se ve desde la Tierra?$q$;

update public.questions set
  question_en = $t$How many moons does the Earth have?$t$,
  options_en  = $t$["1","2","3","0"]$t$::jsonb,
  context_en  = $t$The Earth has a single permanent natural moon. It occasionally captures small asteroids temporarily ('minimoon').$t$
where category = 'astronomia' and question = $q$¿Cuántas lunas tiene la Tierra?$q$;

update public.questions set
  question_en = $t$Who formulated the three laws of planetary motion?$t$,
  options_en  = $t$["Copernicus","Galileo","Kepler","Newton"]$t$::jsonb,
  context_en  = $t$Johannes Kepler published his 3 laws between 1609 and 1619, based on data from Tycho Brahe. They describe elliptical orbits.$t$
where category = 'astronomia' and question = $q$¿Quién formuló las tres leyes del movimiento planetario?$q$;

update public.questions set
  question_en = $t$Which is the largest natural satellite in the solar system?$t$,
  options_en  = $t$["The Moon","Titan","Ganymede","Europa"]$t$::jsonb,
  context_en  = $t$Ganymede (a moon of Jupiter) is the largest satellite, even larger than Mercury. It is 5,268 km in diameter.$t$
where category = 'astronomia' and question = $q$¿Cuál es el satélite natural más grande del sistema solar?$q$;

update public.questions set
  question_en = $t$What type of star is the Sun?$t$,
  options_en  = $t$["Red dwarf","Yellow dwarf","Blue giant","White dwarf"]$t$::jsonb,
  context_en  = $t$The Sun is a yellow dwarf of class G2V, on the main sequence. It has about 5 billion years left before becoming a red giant.$t$
where category = 'astronomia' and question = $q$¿Qué tipo de estrella es el Sol?$q$;

update public.questions set
  question_en = $t$Which planet spins on its side?$t$,
  options_en  = $t$["Jupiter","Saturn","Uranus","Neptune"]$t$::jsonb,
  context_en  = $t$Uranus spins with its axis tilted 98°. It was possibly struck by an Earth-sized object billions of years ago.$t$
where category = 'astronomia' and question = $q$¿Qué planeta gira de lado?$q$;

update public.questions set
  question_en = $t$What is the name of the stellar atmosphere visible during an eclipse?$t$,
  options_en  = $t$["Chromosphere","Photosphere","Corona","Heliosphere"]$t$::jsonb,
  context_en  = $t$The solar corona is the Sun's outer atmosphere, visible during a total eclipse. Its temperature exceeds 1 M K.$t$
where category = 'astronomia' and question = $q$¿Qué nombre recibe la atmósfera estelar visible durante un eclipse?$q$;

update public.questions set
  question_en = $t$Who discovered the principle of universal gravitation?$t$,
  options_en  = $t$["Galileo","Newton","Einstein","Kepler"]$t$::jsonb,
  context_en  = $t$Isaac Newton published the law of universal gravitation in 'Principia' (1687). Any pair of masses attract with F=Gm₁m₂/r².$t$
where category = 'astronomia' and question = $q$¿Quién descubrió el principio de la gravitación universal?$q$;

update public.questions set
  question_en = $t$What phenomenon occurs when the Moon comes between the Sun and the Earth?$t$,
  options_en  = $t$["Lunar eclipse","Solar eclipse","Transit","Alignment"]$t$::jsonb,
  context_en  = $t$In a solar eclipse, the Moon casts a shadow on Earth. Totality is only seen from the umbra zone (a narrow band).$t$
where category = 'astronomia' and question = $q$¿Qué fenómeno ocurre cuando la Luna se interpone entre el Sol y la Tierra?$q$;

update public.questions set
  question_en = $t$In what year did Apollo 11 land on the Moon?$t$,
  options_en  = $t$["1965","1967","1969","1972"]$t$::jsonb,
  context_en  = $t$Apollo 11 landed on July 20, 1969. There were 6 successful crewed missions (Apollo 11, 12, 14, 15, 16 and 17).$t$
where category = 'astronomia' and question = $q$¿En qué año aterrizó el Apolo 11 en la Luna?$q$;

update public.questions set
  question_en = $t$Which is the farthest planet (no longer counting Pluto)?$t$,
  options_en  = $t$["Saturn","Uranus","Neptune","Pluto"]$t$::jsonb,
  context_en  = $t$Neptune is the farthest planet from the Sun (~4.5 billion km). Pluto has been a dwarf planet since 2006.$t$
where category = 'astronomia' and question = $q$¿Cuál es el planeta más lejano (ya no contando a Plutón)?$q$;

update public.questions set
  question_en = $t$What is a pulsar?$t$,
  options_en  = $t$["A variable star","A neutron star that emits pulses","A quasar","A black hole"]$t$::jsonb,
  context_en  = $t$A pulsar is a rotating neutron star that emits beams of electromagnetic radiation. Discovered by Jocelyn Bell in 1967.$t$
where category = 'astronomia' and question = $q$¿Qué es un púlsar?$q$;

update public.questions set
  question_en = $t$Which telescope discovered thousands of galaxies?$t$,
  options_en  = $t$["James Webb","Hubble","Spitzer","Kepler"]$t$::jsonb,
  context_en  = $t$The Hubble (launched in 1990) revolutionized astronomy: it measured the expansion of the universe, observed remote galaxies and refined the age of the cosmos.$t$
where category = 'astronomia' and question = $q$¿Qué telescopio descubrió Hubble miles de galaxias?$q$;

update public.questions set
  question_en = $t$What is the approximate diameter of the Sun?$t$,
  options_en  = $t$["100,000 km","700,000 km","1.4 M km","10 M km"]$t$::jsonb,
  context_en  = $t$The Sun is ~1,392,000 km in diameter, about 109 times that of Earth. It contains 99.86% of the solar system's mass.$t$
where category = 'astronomia' and question = $q$¿Cuál es el diámetro aproximado del Sol?$q$;

update public.questions set
  question_en = $t$What is a massive stellar explosion called?$t$,
  options_en  = $t$["Nova","Supernova","Quasar","Magnetar"]$t$::jsonb,
  context_en  = $t$A supernova is the explosion of a massive star at the end of its life. It shines like an entire galaxy for weeks.$t$
where category = 'astronomia' and question = $q$¿Qué nombre se da a una explosión estelar masiva?$q$;

update public.questions set
  question_en = $t$What is the mean Earth-Moon distance?$t$,
  options_en  = $t$["100,000 km","384,000 km","1 M km","10 M km"]$t$::jsonb,
  context_en  = $t$The Moon is 384,400 km away on average. The distance varies slightly due to its elliptical orbit (perigee and apogee).$t$
where category = 'astronomia' and question = $q$¿Cuál es la distancia Tierra-Luna media?$q$;

update public.questions set
  question_en = $t$Which famous comet will be seen again in 2061?$t$,
  options_en  = $t$["Hale-Bopp","Halley","NEOWISE","Encke"]$t$::jsonb,
  context_en  = $t$Halley's Comet passes near Earth every 75-76 years. Last seen in 1986, next visit in 2061.$t$
where category = 'astronomia' and question = $q$¿Qué famoso cometa volverá a verse en 2061?$q$;

update public.questions set
  question_en = $t$What is the approximate temperature of the Sun's surface?$t$,
  options_en  = $t$["1,000 °C","6,000 °C","100,000 °C","1 M °C"]$t$::jsonb,
  context_en  = $t$The Sun's photosphere is at ~5,500 °C. The corona, paradoxically, is much hotter (>1 M °C).$t$
where category = 'astronomia' and question = $q$¿Cuál es la temperatura aproximada de la superficie del Sol?$q$;

update public.questions set
  question_en = $t$What phenomenon explains why galaxies move away from each other?$t$,
  options_en  = $t$["Inertia","Expansion of the universe","Gravitational attraction","Antigravity"]$t$::jsonb,
  context_en  = $t$The expansion of the universe, discovered by Hubble in 1929. The distance between galaxies increases; it is measured by the Hubble constant.$t$
where category = 'astronomia' and question = $q$¿Qué fenómeno explica que las galaxias se alejen entre sí?$q$;

update public.questions set
  question_en = $t$What is dark energy?$t$,
  options_en  = $t$["Invisible matter","A force that accelerates the expansion","A black hole","Antimatter"]$t$::jsonb,
  context_en  = $t$Dark energy represents ~68% of the universe and is thought to cause its accelerated expansion, discovered in 1998.$t$
where category = 'astronomia' and question = $q$¿Qué es la energía oscura?$q$;

update public.questions set
  question_en = $t$In which constellation is the Orion Nebula?$t$,
  options_en  = $t$["Taurus","Orion","Cassiopeia","Cygnus"]$t$::jsonb,
  context_en  = $t$The Orion Nebula (M42) is visible to the naked eye in Orion's 'sword'. It is a star-forming region.$t$
where category = 'astronomia' and question = $q$¿En qué constelación está la nebulosa de Orión?$q$;

update public.questions set
  question_en = $t$Who discovered the four largest moons of Jupiter?$t$,
  options_en  = $t$["Newton","Galileo","Kepler","Copernicus"]$t$::jsonb,
  context_en  = $t$Galileo discovered Io, Europa, Ganymede and Callisto in 1610 with his telescope. They are called the 'Galilean moons' in his honor.$t$
where category = 'astronomia' and question = $q$¿Quién descubrió las cuatro lunas mayores de Júpiter?$q$;

update public.questions set
  question_en = $t$What color is the light of the hottest stars?$t$,
  options_en  = $t$["Red","Yellow","White","Blue"]$t$::jsonb,
  context_en  = $t$The hottest stars are blue (tens of thousands of K). The temperature order: red, orange, yellow, white and blue.$t$
where category = 'astronomia' and question = $q$¿Qué color tiene la luz de las estrellas más calientes?$q$;

update public.questions set
  question_en = $t$Which planet has a day longer than its year?$t$,
  options_en  = $t$["Mercury","Venus","Mars","Jupiter"]$t$::jsonb,
  context_en  = $t$Venus rotates very slowly: a solar day lasts 117 Earth days, while its year is 225 days. It also rotates opposite to the rest.$t$
where category = 'astronomia' and question = $q$¿Qué planeta tiene un día más largo que su año?$q$;

update public.questions set
  question_en = $t$In what year was Sputnik 1, the first artificial satellite, launched?$t$,
  options_en  = $t$["1947","1957","1961","1969"]$t$::jsonb,
  context_en  = $t$The USSR launched Sputnik 1 on October 4, 1957, inaugurating the space age and the space race with the USA.$t$
where category = 'astronomia' and question = $q$¿En qué año se lanzó el Sputnik 1, primer satélite artificial?$q$;

update public.questions set
  question_en = $t$How many moons does Jupiter have (officially confirmed, approx.)?$t$,
  options_en  = $t$["50","79","95","more than 90"]$t$::jsonb,
  context_en  = $t$Jupiter has more than 90 confirmed moons (>95 as of 2024). The four largest (Galilean) are Io, Europa, Ganymede and Callisto.$t$
where category = 'astronomia' and question = $q$¿Cuántas lunas tiene Júpiter (oficialmente confirmadas, aprox.)?$q$;

update public.questions set
  question_en = $t$Which is Jupiter's largest moon?$t$,
  options_en  = $t$["Io","Europa","Ganymede","Callisto"]$t$::jsonb,
  context_en  = $t$Ganymede is the largest moon in the solar system (even larger than Mercury).$t$
where category = 'astronomia' and question = $q$¿Cuál es la luna más grande de Júpiter?$q$;

update public.questions set
  question_en = $t$Which moon of Jupiter could harbor a subsurface ocean?$t$,
  options_en  = $t$["Io","Europa","Callisto","Ganymede"]$t$::jsonb,
  context_en  = $t$Europa, a moon of Jupiter, has an ice crust beneath which an ocean of liquid water is believed to exist.$t$
where category = 'astronomia' and question = $q$¿Qué luna de Júpiter podría albergar un océano subterráneo?$q$;

update public.questions set
  question_en = $t$Which moon of Saturn has a dense atmosphere?$t$,
  options_en  = $t$["Mimas","Titan","Enceladus","Rhea"]$t$::jsonb,
  context_en  = $t$Titan is the only moon in the solar system with a dense atmosphere (denser than Earth's). It has lakes of liquid methane.$t$
where category = 'astronomia' and question = $q$¿Qué luna de Saturno tiene atmósfera densa?$q$;

update public.questions set
  question_en = $t$Which moon of Saturn ejects geysers of water?$t$,
  options_en  = $t$["Mimas","Enceladus","Titan","Hyperion"]$t$::jsonb,
  context_en  = $t$Enceladus has geysers at the south pole that eject water from the subsurface ocean into space.$t$
where category = 'astronomia' and question = $q$¿Qué luna de Saturno expulsa géiseres de agua?$q$;

update public.questions set
  question_en = $t$How many moons does Saturn have (confirmed, approx.)?$t$,
  options_en  = $t$["20","60","more than 80","more than 140"]$t$::jsonb,
  context_en  = $t$Saturn has more than 140 confirmed moons (2024), making it the planet with the most known satellites.$t$
where category = 'astronomia' and question = $q$¿Cuántas lunas tiene Saturno (confirmadas aprox.)?$q$;

update public.questions set
  question_en = $t$How many moons does Uranus have?$t$,
  options_en  = $t$["5","13","27","45"]$t$::jsonb,
  context_en  = $t$Uranus has 27 known moons. The five largest are Miranda, Ariel, Umbriel, Titania and Oberon.$t$
where category = 'astronomia' and question = $q$¿Cuántas lunas tiene Urano?$q$;

update public.questions set
  question_en = $t$How many moons does Neptune have?$t$,
  options_en  = $t$["1","8","14","20"]$t$::jsonb,
  context_en  = $t$Neptune has 14 known moons. The largest is Triton, which orbits in a retrograde direction.$t$
where category = 'astronomia' and question = $q$¿Cuántas lunas tiene Neptuno?$q$;

update public.questions set
  question_en = $t$Which is the largest moon of Neptune?$t$,
  options_en  = $t$["Nereid","Triton","Naiad","Larissa"]$t$::jsonb,
  context_en  = $t$Triton is the largest moon of Neptune and the seventh in the solar system. It has nitrogen volcanoes.$t$
where category = 'astronomia' and question = $q$¿Cuál es la mayor luna de Neptuno?$q$;

update public.questions set
  question_en = $t$How many planets does the solar system have?$t$,
  options_en  = $t$["7","8","9","10"]$t$::jsonb,
  context_en  = $t$The solar system has 8 planets officially, since Pluto was reclassified as a dwarf planet in 2006.$t$
where category = 'astronomia' and question = $q$¿Cuántos planetas tiene el sistema solar?$q$;

update public.questions set
  question_en = $t$When did Pluto stop being considered a planet?$t$,
  options_en  = $t$["2003","2006","2010","2015"]$t$::jsonb,
  context_en  = $t$The International Astronomical Union reclassified Pluto as a 'dwarf planet' in August 2006.$t$
where category = 'astronomia' and question = $q$¿Cuándo dejó Plutón de ser considerado planeta?$q$;

update public.questions set
  question_en = $t$How many dwarf planets are there officially?$t$,
  options_en  = $t$["3","4","5","8"]$t$::jsonb,
  context_en  = $t$The IAU recognizes 5 dwarf planets: Ceres, Pluto, Haumea, Makemake and Eris.$t$
where category = 'astronomia' and question = $q$¿Cuántos planetas enanos hay oficialmente?$q$;

update public.questions set
  question_en = $t$Which dwarf planet is in the asteroid belt?$t$,
  options_en  = $t$["Pluto","Eris","Ceres","Haumea"]$t$::jsonb,
  context_en  = $t$Ceres, the dwarf planet closest to the Sun, is in the asteroid belt between Mars and Jupiter.$t$
where category = 'astronomia' and question = $q$¿Qué planeta enano está en el cinturón de asteroides?$q$;

update public.questions set
  question_en = $t$Which dwarf planet is larger than Pluto?$t$,
  options_en  = $t$["Eris","Ceres","Haumea","None"]$t$::jsonb,
  context_en  = $t$Eris (discovered in 2005) is more massive than Pluto although slightly smaller in diameter. Its discovery triggered the 'demotion' of Pluto.$t$
where category = 'astronomia' and question = $q$¿Qué planeta enano es más grande que Plutón?$q$;

update public.questions set
  question_en = $t$How long does Mercury take to orbit the Sun?$t$,
  options_en  = $t$["88 days","165 days","365 days","1 year"]$t$::jsonb,
  context_en  = $t$Mercury has the shortest year in the solar system: 88 Earth days.$t$
where category = 'astronomia' and question = $q$¿Cuánto tarda Mercurio en dar la vuelta al Sol?$q$;

update public.questions set
  question_en = $t$How long does Venus take to orbit the Sun?$t$,
  options_en  = $t$["88 days","225 days","365 days","687 days"]$t$::jsonb,
  context_en  = $t$Venus takes about 225 Earth days to orbit the Sun.$t$
where category = 'astronomia' and question = $q$¿Cuánto tarda Venus en dar la vuelta al Sol?$q$;

update public.questions set
  question_en = $t$How long does Mars take to orbit the Sun?$t$,
  options_en  = $t$["365 days","687 days","30 days","2 years"]$t$::jsonb,
  context_en  = $t$Mars takes about 687 Earth days (1.88 years) to orbit the Sun.$t$
where category = 'astronomia' and question = $q$¿Cuánto tarda Marte en dar la vuelta al Sol?$q$;

update public.questions set
  question_en = $t$How long does Jupiter take to orbit the Sun?$t$,
  options_en  = $t$["6 years","12 years","29 years","84 years"]$t$::jsonb,
  context_en  = $t$Jupiter takes about 12 Earth years to orbit the Sun.$t$
where category = 'astronomia' and question = $q$¿Cuánto tarda Júpiter en dar la vuelta al Sol?$q$;

update public.questions set
  question_en = $t$How long does Saturn take to orbit the Sun?$t$,
  options_en  = $t$["12 years","29 years","84 years","165 years"]$t$::jsonb,
  context_en  = $t$Saturn takes about 29.5 Earth years to orbit the Sun.$t$
where category = 'astronomia' and question = $q$¿Cuánto tarda Saturno en orbitar el Sol?$q$;

update public.questions set
  question_en = $t$How long does Uranus take to orbit the Sun?$t$,
  options_en  = $t$["12 years","29 years","84 years","165 years"]$t$::jsonb,
  context_en  = $t$Uranus takes about 84 Earth years to orbit the Sun.$t$
where category = 'astronomia' and question = $q$¿Cuánto tarda Urano en orbitar el Sol?$q$;

update public.questions set
  question_en = $t$How long does Neptune take to orbit the Sun?$t$,
  options_en  = $t$["29 years","84 years","165 years","248 years"]$t$::jsonb,
  context_en  = $t$Neptune takes about 165 Earth years to orbit the Sun.$t$
where category = 'astronomia' and question = $q$¿Cuánto tarda Neptuno en orbitar el Sol?$q$;

update public.questions set
  question_en = $t$Which is the natural satellite of the Earth?$t$,
  options_en  = $t$["The Moon","Phobos","Deimos","Triton"]$t$::jsonb,
  context_en  = $t$The Moon is the only natural satellite of the Earth. Its mean distance is 384,400 km.$t$
where category = 'astronomia' and question = $q$¿Cuál es el satélite natural de la Tierra?$q$;

update public.questions set
  question_en = $t$What are the moons of Mars called?$t$,
  options_en  = $t$["Phobos and Deimos","Io and Europa","Triton and Nereid","Mimas and Enceladus"]$t$::jsonb,
  context_en  = $t$Phobos and Deimos are the two small moons of Mars, probably captured asteroids.$t$
where category = 'astronomia' and question = $q$¿Cómo se llaman las lunas de Marte?$q$;

update public.questions set
  question_en = $t$What is the approximate temperature of Venus?$t$,
  options_en  = $t$["50 °C","100 °C","465 °C","-50 °C"]$t$::jsonb,
  context_en  = $t$Venus has a surface temperature of about 465 °C due to the intense greenhouse effect of its CO₂ atmosphere.$t$
where category = 'astronomia' and question = $q$¿Cuál es la temperatura aproximada de Venus?$q$;

update public.questions set
  question_en = $t$Why is Venus the hottest planet?$t$,
  options_en  = $t$["It is closer to the Sun","Because of its greenhouse effect","It has volcanic activity","It is orange"]$t$::jsonb,
  context_en  = $t$Although Mercury is closer to the Sun, Venus is hotter because of the extreme greenhouse effect of its CO₂ atmosphere.$t$
where category = 'astronomia' and question = $q$¿Por qué Venus es el planeta más caliente?$q$;

update public.questions set
  question_en = $t$Which is the closest planet to the Earth?$t$,
  options_en  = $t$["Mercury","Venus","Mars","Saturn"]$t$::jsonb,
  context_en  = $t$Venus is the closest planet to the Earth. Its minimum distance is about 38 million km.$t$
where category = 'astronomia' and question = $q$¿Cuál es el planeta más cercano a la Tierra?$q$;

update public.questions set
  question_en = $t$What color is Mars in the night sky?$t$,
  options_en  = $t$["Blue","Reddish","Green","White"]$t$::jsonb,
  context_en  = $t$Mars looks reddish in the sky. The color is due to iron oxide (ferric oxide) on its surface.$t$
where category = 'astronomia' and question = $q$¿De qué color es Marte en el cielo nocturno?$q$;

update public.questions set
  question_en = $t$Which is the tallest mountain in the solar system?$t$,
  options_en  = $t$["Everest","Olympus Mons (Mars)","Mauna Kea","Mons Huygens"]$t$::jsonb,
  context_en  = $t$Olympus Mons, on Mars, is the tallest volcano in the solar system: ~22 km high.$t$
where category = 'astronomia' and question = $q$¿Cuál es el monte más alto del sistema solar?$q$;

update public.questions set
  question_en = $t$Which planet has the most intense storms, lasting centuries?$t$,
  options_en  = $t$["Earth","Jupiter","Saturn","Mars"]$t$::jsonb,
  context_en  = $t$Jupiter's Great Red Spot is an anticyclonic storm that has lasted at least 350 years.$t$
where category = 'astronomia' and question = $q$¿Qué planeta tiene tormentas más intensas que duran siglos?$q$;

update public.questions set
  question_en = $t$What is a meteorite?$t$,
  options_en  = $t$["A rock that reaches the Earth's surface","A shooting star","A comet","A large asteroid"]$t$::jsonb,
  context_en  = $t$A meteorite is a rocky fragment from space that survives passage through the atmosphere and impacts the Earth.$t$
where category = 'astronomia' and question = $q$¿Qué es un meteorito?$q$;

update public.questions set
  question_en = $t$What is an asteroid?$t$,
  options_en  = $t$["A small rocky body that orbits the Sun","A minor star","A frozen comet","A moon without a planet"]$t$::jsonb,
  context_en  = $t$Asteroids are small rocky bodies that orbit the Sun, mainly between Mars and Jupiter.$t$
where category = 'astronomia' and question = $q$¿Qué es un asteroide?$q$;

update public.questions set
  question_en = $t$What is a comet?$t$,
  options_en  = $t$["A body of ice and dust that produces a tail","A star","A rocky asteroid","A satellite"]$t$::jsonb,
  context_en  = $t$A comet is a body made mainly of ice and dust. As it approaches the Sun, it sublimates, forming a coma and tail.$t$
where category = 'astronomia' and question = $q$¿Qué es un cometa?$q$;

update public.questions set
  question_en = $t$What is the name of the comet that appears roughly every 76 years?$t$,
  options_en  = $t$["Halley","Hale-Bopp","Encke","Tempel"]$t$::jsonb,
  context_en  = $t$Halley's Comet orbits the Sun about every 76 years. Its last visit was in 1986 and it will return in 2061.$t$
where category = 'astronomia' and question = $q$¿Cómo se llama el cometa que aparece cada 76 años aprox.?$q$;

update public.questions set
  question_en = $t$Which is the closest galaxy to the Milky Way?$t$,
  options_en  = $t$["Andromeda","Triangulum","Small Magellanic Cloud","Canis Major Dwarf Galaxy"]$t$::jsonb,
  context_en  = $t$The Canis Major Dwarf galaxy is about 25,000 light-years away. Andromeda is the nearest large spiral galaxy, at 2.5 M light-years.$t$
where category = 'astronomia' and question = $q$¿Cuál es la galaxia más cercana a la Vía Láctea?$q$;

update public.questions set
  question_en = $t$When will the Milky Way collide with Andromeda (prediction)?$t$,
  options_en  = $t$["In 100 M years","In 4.5 billion years","In 10 T years","Never"]$t$::jsonb,
  context_en  = $t$The Milky Way and Andromeda are predicted to collide in about 4.5 billion years.$t$
where category = 'astronomia' and question = $q$¿Cuándo chocará la Vía Láctea con Andrómeda (predicción)?$q$;

update public.questions set
  question_en = $t$How many light-years is the diameter of the Milky Way?$t$,
  options_en  = $t$["~10,000","~100,000","~1,000,000","~10,000,000"]$t$::jsonb,
  context_en  = $t$The Milky Way is about 100,000 light-years in diameter and has about 100-400 billion stars.$t$
where category = 'astronomia' and question = $q$¿Cuántos años luz mide el diámetro de la Vía Láctea?$q$;

update public.questions set
  question_en = $t$Which is the most famous nebula, visible to the naked eye?$t$,
  options_en  = $t$["Orion Nebula","Crab Nebula","Ring Nebula","Helix Nebula"]$t$::jsonb,
  context_en  = $t$The Orion Nebula (M42), in the constellation of Orion, is visible to the naked eye in Orion's 'belt'.$t$
where category = 'astronomia' and question = $q$¿Cuál es la nebulosa más famosa y visible a simple vista?$q$;

update public.questions set
  question_en = $t$Which space telescope was launched in 1990?$t$,
  options_en  = $t$["Hubble","James Webb","Spitzer","Kepler"]$t$::jsonb,
  context_en  = $t$The Hubble Space Telescope was launched by NASA on April 24, 1990.$t$
where category = 'astronomia' and question = $q$¿Qué telescopio espacial fue lanzado en 1990?$q$;

update public.questions set
  question_en = $t$Which space telescope was launched in 2021?$t$,
  options_en  = $t$["Hubble","James Webb","Kepler","TESS"]$t$::jsonb,
  context_en  = $t$The James Webb telescope was launched on December 25, 2021. It began scientific operations in July 2022.$t$
where category = 'astronomia' and question = $q$¿Qué telescopio espacial se lanzó en 2021?$q$;

update public.questions set
  question_en = $t$At what distance does the James Webb telescope operate?$t$,
  options_en  = $t$["In Earth orbit","At the L2 point (~1.5 M km)","In the Moon's orbit","In interstellar space"]$t$::jsonb,
  context_en  = $t$The James Webb telescope operates at the Lagrange point 2 (L2), about 1.5 million km from Earth.$t$
where category = 'astronomia' and question = $q$¿A qué distancia opera el telescopio James Webb?$q$;

update public.questions set
  question_en = $t$How many constellations does the IAU recognize?$t$,
  options_en  = $t$["48","88","100","256"]$t$::jsonb,
  context_en  = $t$The International Astronomical Union officially recognizes 88 constellations since 1928.$t$
where category = 'astronomia' and question = $q$¿Cuántas constelaciones reconoce la UAI?$q$;

update public.questions set
  question_en = $t$Which constellation contains the North Star?$t$,
  options_en  = $t$["Ursa Major","Ursa Minor","Cassiopeia","Cygnus"]$t$::jsonb,
  context_en  = $t$The North Star (Polaris) is in the constellation of Ursa Minor. It indicates celestial north.$t$
where category = 'astronomia' and question = $q$¿Qué constelación contiene la estrella Polar?$q$;

update public.questions set
  question_en = $t$Which is the brightest star in the night sky?$t$,
  options_en  = $t$["Polaris","Sirius","Antares","Vega"]$t$::jsonb,
  context_en  = $t$Sirius, in the constellation of Canis Major, is the brightest star in the night sky (magnitude -1.46).$t$
where category = 'astronomia' and question = $q$¿Cuál es la estrella más brillante del cielo nocturno?$q$;

update public.questions set
  question_en = $t$In which constellation is Sirius?$t$,
  options_en  = $t$["Orion","Taurus","Canis Major","Canis Minor"]$t$::jsonb,
  context_en  = $t$Sirius is in the constellation of Canis Major. It is the 'dog star'.$t$
where category = 'astronomia' and question = $q$¿En qué constelación está Sirio?$q$;

update public.questions set
  question_en = $t$Which constellation is shaped like a 'W'?$t$,
  options_en  = $t$["Cygnus","Cassiopeia","Pegasus","Orion"]$t$::jsonb,
  context_en  = $t$Cassiopeia, in the northern sky, is shaped like a 'W' or 'M'. It is circumpolar for mid-latitudes of the northern hemisphere.$t$
where category = 'astronomia' and question = $q$¿Qué constelación tiene forma de "W"?$q$;

update public.questions set
  question_en = $t$Which constellation has three aligned stars in its 'belt'?$t$,
  options_en  = $t$["Cygnus","Pegasus","Orion","Cassiopeia"]$t$::jsonb,
  context_en  = $t$Orion, the hunter, is recognized by the three aligned stars of his belt: Alnitak, Alnilam and Mintaka.$t$
where category = 'astronomia' and question = $q$¿Qué constelación tiene tres estrellas alineadas en su "cinturón"?$q$;

update public.questions set
  question_en = $t$Which belt is located between Mars and Jupiter?$t$,
  options_en  = $t$["Kuiper Belt","Asteroid belt","Oort cloud","Planetary rings"]$t$::jsonb,
  context_en  = $t$The main asteroid belt is between the orbits of Mars and Jupiter.$t$
where category = 'astronomia' and question = $q$¿Qué cinturón se sitúa entre Marte y Júpiter?$q$;

update public.questions set
  question_en = $t$What is the Kuiper Belt?$t$,
  options_en  = $t$["A ring of icy bodies beyond Neptune","An asteroid belt","A cometary cloud","A galaxy"]$t$::jsonb,
  context_en  = $t$The Kuiper Belt is a region beyond Neptune with icy bodies, including Pluto.$t$
where category = 'astronomia' and question = $q$¿Qué es el cinturón de Kuiper?$q$;

update public.questions set
  question_en = $t$What is the Oort cloud?$t$,
  options_en  = $t$["A nebula","A distant sphere of cometary objects","A galaxy","A constellation"]$t$::jsonb,
  context_en  = $t$The Oort Cloud is a theoretical sphere of icy objects (up to ~100,000 AU from the Sun). The source of long-period comets.$t$
where category = 'astronomia' and question = $q$¿Qué es la nube de Oort?$q$;

update public.questions set
  question_en = $t$Which unit measures the distance between the Earth and the Sun?$t$,
  options_en  = $t$["Light-year","Parsec","Astronomical Unit","Kilometer"]$t$::jsonb,
  context_en  = $t$1 Astronomical Unit (AU) = ~149.6 million km, the mean Earth-Sun distance.$t$
where category = 'astronomia' and question = $q$¿Qué unidad mide la distancia entre la Tierra y el Sol?$q$;

update public.questions set
  question_en = $t$Approximately how many km is a light-year?$t$,
  options_en  = $t$["9.46 billion","9.46 trillion","9.46 quintillion","9.46 thousand"]$t$::jsonb,
  context_en  = $t$A light-year is equivalent to approximately 9.46 trillion (10¹²) kilometers.$t$
where category = 'astronomia' and question = $q$¿Cuántos km tiene un año luz aproximadamente?$q$;

update public.questions set
  question_en = $t$At what speed is light measured in km/s?$t$,
  options_en  = $t$["300,000","30,000","3,000,000","30,000,000"]$t$::jsonb,
  context_en  = $t$The speed of light in a vacuum is approximately 300,000 km/s (exactly 299,792.458 km/s).$t$
where category = 'astronomia' and question = $q$¿A qué velocidad se mide la luz en km/s?$q$;

update public.questions set
  question_en = $t$What is the name of the theory that explains the origin of the universe?$t$,
  options_en  = $t$["Steady state","Big Bang","Inflation","Multiverse"]$t$::jsonb,
  context_en  = $t$The Big Bang theory proposes that the universe originated about 13.8 billion years ago from a dense, hot state.$t$
where category = 'astronomia' and question = $q$¿Qué nombre recibe la teoría que explica el origen del universo?$q$;

update public.questions set
  question_en = $t$How many years ago did the Big Bang occur?$t$,
  options_en  = $t$["4.5 billion","6 billion","13.8 billion","20 billion"]$t$::jsonb,
  context_en  = $t$According to the best estimates, the Big Bang occurred ~13.8 billion years ago.$t$
where category = 'astronomia' and question = $q$¿Hace cuántos años ocurrió el Big Bang?$q$;

update public.questions set
  question_en = $t$What makes up approx. 27% of the universe according to current cosmology?$t$,
  options_en  = $t$["Ordinary matter","Dark matter","Dark energy","Light"]$t$::jsonb,
  context_en  = $t$Dark matter makes up approximately 27% of the universe. Ordinary matter only 5%. The rest (68%) is dark energy.$t$
where category = 'astronomia' and question = $q$¿Qué constituye aprox. el 27% del universo según la cosmología actual?$q$;

update public.questions set
  question_en = $t$What makes up approx. 68% of the universe?$t$,
  options_en  = $t$["Ordinary matter","Dark matter","Dark energy","Light"]$t$::jsonb,
  context_en  = $t$Dark energy makes up ~68% of the universe. It is responsible for the accelerated expansion of the universe.$t$
where category = 'astronomia' and question = $q$¿Qué constituye aprox. el 68% del universo?$q$;

update public.questions set
  question_en = $t$Who proposed the expansion of the universe?$t$,
  options_en  = $t$["Einstein","Hubble","Lemaître","Hawking"]$t$::jsonb,
  context_en  = $t$Edwin Hubble observed in 1929 that galaxies are moving away, evidencing the expansion of the universe. Georges Lemaître had proposed it theoretically.$t$
where category = 'astronomia' and question = $q$¿Quién propuso la expansión del universo?$q$;

update public.questions set
  question_en = $t$Which phenomenon demonstrates the expansion of the universe?$t$,
  options_en  = $t$["Redshift","Gravitational lensing","Microwaves","Gravitational wave"]$t$::jsonb,
  context_en  = $t$The redshift of light from distant galaxies demonstrates that they are moving away from us.$t$
where category = 'astronomia' and question = $q$¿Qué fenómeno demuestra la expansión del universo?$q$;

update public.questions set
  question_en = $t$Which event is the proof of the Big Bang?$t$,
  options_en  = $t$["Cosmic background radiation","Dark matter","Inflation","Antimatter"]$t$::jsonb,
  context_en  = $t$The cosmic microwave background (CMB), discovered in 1964, is the 'residual light' of the Big Bang.$t$
where category = 'astronomia' and question = $q$¿Qué evento es la prueba del Big Bang?$q$;

update public.questions set
  question_en = $t$What type of star is our Sun?$t$,
  options_en  = $t$["Red dwarf","White dwarf","G2V (Yellow dwarf)","Blue supergiant"]$t$::jsonb,
  context_en  = $t$The Sun is a yellow dwarf star of spectral type G2V.$t$
where category = 'astronomia' and question = $q$¿Qué tipo de estrella es nuestro Sol?$q$;

update public.questions set
  question_en = $t$What is the approximate age of the Sun?$t$,
  options_en  = $t$["1 billion","4.6 billion","10 billion","13.8 billion"]$t$::jsonb,
  context_en  = $t$The Sun is about 4.6 billion years old. It formed at the same time as the rest of the solar system.$t$
where category = 'astronomia' and question = $q$¿Cuál es la edad del Sol aproximadamente?$q$;

update public.questions set
  question_en = $t$How much longer will the Sun live as a stable star (approx.)?$t$,
  options_en  = $t$["100 million","1 billion","5 billion","10 billion"]$t$::jsonb,
  context_en  = $t$The Sun has about 5 billion more years as a main-sequence star before becoming a red giant.$t$
where category = 'astronomia' and question = $q$¿Cuánto tiempo más vivirá el Sol como estrella estable (aprox.)?$q$;

update public.questions set
  question_en = $t$What is a supernova?$t$,
  options_en  = $t$["A massive stellar explosion","A new galaxy","A young star","A black hole"]$t$::jsonb,
  context_en  = $t$A supernova is the massive explosion at the end of the life of a very massive star or a binary system with a white dwarf.$t$
where category = 'astronomia' and question = $q$¿Qué es una supernova?$q$;

update public.questions set
  question_en = $t$What remains after a supernova?$t$,
  options_en  = $t$["A neutron star or black hole","A red giant","Another galaxy","A comet"]$t$::jsonb,
  context_en  = $t$After a supernova, a neutron star or a black hole may remain (depending on the original mass).$t$
where category = 'astronomia' and question = $q$¿Qué queda tras una supernova?$q$;

update public.questions set
  question_en = $t$What is a neutron star?$t$,
  options_en  = $t$["An extremely dense stellar core","A very cold star","A young star","A galaxy"]$t$::jsonb,
  context_en  = $t$Neutron stars are ultra-dense stellar remnants. A teaspoonful would weigh billions of tons.$t$
where category = 'astronomia' and question = $q$¿Qué es una estrella de neutrones?$q$;

update public.questions set
  question_en = $t$What is a quasar?$t$,
  options_en  = $t$["An ultra-bright galactic nucleus","A comet","An asteroid","A type of star"]$t$::jsonb,
  context_en  = $t$Quasars are active galactic nuclei with supermassive black holes at their center, extremely bright.$t$
where category = 'astronomia' and question = $q$¿Qué es un quasar?$q$;

update public.questions set
  question_en = $t$Who predicted the existence of black holes (mathematically)?$t$,
  options_en  = $t$["Einstein","Schwarzschild","Hawking","Penrose"]$t$::jsonb,
  context_en  = $t$Karl Schwarzschild found in 1916 the first solution of Einstein's equations that predicted black holes.$t$
where category = 'astronomia' and question = $q$¿Quién predijo la existencia de los agujeros negros (mat.)?$q$;

update public.questions set
  question_en = $t$Who researched the radiation of black holes?$t$,
  options_en  = $t$["Einstein","Penrose","Hawking","Schwarzschild"]$t$::jsonb,
  context_en  = $t$Stephen Hawking predicted in 1974 that black holes emit radiation ('Hawking radiation') and can evaporate.$t$
where category = 'astronomia' and question = $q$¿Quién investigó la radiación de los agujeros negros?$q$;

update public.questions set
  question_en = $t$What is the event horizon of a black hole?$t$,
  options_en  = $t$["Its luminous surface","The point of no return","Its core","Its atmosphere"]$t$::jsonb,
  context_en  = $t$The event horizon is the boundary where the escape velocity equals c. Once crossed, nothing (not even light) can leave.$t$
where category = 'astronomia' and question = $q$¿Qué es el horizonte de sucesos de un agujero negro?$q$;

update public.questions set
  question_en = $t$What is Sagittarius A*?$t$,
  options_en  = $t$["A star","The supermassive black hole at the center of the Milky Way","A nebula","A galaxy"]$t$::jsonb,
  context_en  = $t$Sgr A* is the supermassive black hole at the center of the Milky Way, with 4.3 million solar masses.$t$
where category = 'astronomia' and question = $q$¿Qué es Sagitario A*?$q$;

update public.questions set
  question_en = $t$Which planet has the longest day in the solar system?$t$,
  options_en  = $t$["Venus","Mercury","Jupiter","Saturn"]$t$::jsonb,
  context_en  = $t$Venus has a day (rotation) of 243 Earth days, longer than its year (225 days).$t$
where category = 'astronomia' and question = $q$¿Qué planeta tiene el día más largo en el sistema solar?$q$;

update public.questions set
  question_en = $t$In which direction does Venus rotate?$t$,
  options_en  = $t$["The same as Earth","Retrograde","It does not rotate","Random"]$t$::jsonb,
  context_en  = $t$Venus rotates in a retrograde direction (east to west), unlike most planets in the solar system.$t$
where category = 'astronomia' and question = $q$¿En qué dirección rota Venus?$q$;

update public.questions set
  question_en = $t$In which direction does Uranus rotate?$t$,
  options_en  = $t$["Vertical","On its side (highly tilted axis)","The same as Earth","Retrograde"]$t$::jsonb,
  context_en  = $t$Uranus has its rotation axis tilted ~98°, so it rotates 'on its side' relative to the plane of its orbit.$t$
where category = 'astronomia' and question = $q$¿En qué dirección rota Urano?$q$;

update public.questions set
  question_en = $t$What is the summer solstice (northern hemisphere)?$t$,
  options_en  = $t$["~June 21 (longest day)","~December 21","~March 21","~September 21"]$t$::jsonb,
  context_en  = $t$The summer solstice in the northern hemisphere occurs around June 21, the longest day of the year.$t$
where category = 'astronomia' and question = $q$¿Qué es el solsticio de verano (hemisferio norte)?$q$;

update public.questions set
  question_en = $t$When does the spring equinox occur (northern hemisphere)?$t$,
  options_en  = $t$["~March 21","~June 21","~September 21","~December 21"]$t$::jsonb,
  context_en  = $t$The spring equinox in the northern hemisphere occurs around March 20-21. Day and night are approximately equal.$t$
where category = 'astronomia' and question = $q$¿Cuándo ocurre el equinoccio de primavera (hemisferio norte)?$q$;

update public.questions set
  question_en = $t$What phenomenon makes us always see the same face of the Moon?$t$,
  options_en  = $t$["It does not rotate","Tidal locking","It is flat","It is transparent"]$t$::jsonb,
  context_en  = $t$The Moon is tidally locked with the Earth: its rotation period matches its orbital period, always showing the same face.$t$
where category = 'astronomia' and question = $q$¿Qué fenómeno hace que veamos siempre la misma cara de la Luna?$q$;

update public.questions set
  question_en = $t$How long does the Moon take to orbit the Earth?$t$,
  options_en  = $t$["~27 days","~30 days","~365 days","~7 days"]$t$::jsonb,
  context_en  = $t$The Moon takes about 27.3 days to orbit the Earth (sidereal month). The synodic month (between new moons) is ~29.5 days.$t$
where category = 'astronomia' and question = $q$¿Cuánto tarda la Luna en orbitar la Tierra?$q$;

update public.questions set
  question_en = $t$What happens during a solar eclipse?$t$,
  options_en  = $t$["The Moon comes between the Sun and the Earth","The Earth comes between the Moon and the Sun","The Moon darkens","Nothing visible"]$t$::jsonb,
  context_en  = $t$A solar eclipse occurs when the Moon comes between the Sun and the Earth, hiding it.$t$
where category = 'astronomia' and question = $q$¿Qué pasa durante un eclipse solar?$q$;

update public.questions set
  question_en = $t$What happens during a lunar eclipse?$t$,
  options_en  = $t$["The Moon comes in between","The Earth comes between the Sun and the Moon","The Sun is hidden","Eclipses do not exist"]$t$::jsonb,
  context_en  = $t$A lunar eclipse occurs when the Earth comes between the Sun and the Moon, casting its shadow over it.$t$
where category = 'astronomia' and question = $q$¿Qué pasa durante un eclipse lunar?$q$;

update public.questions set
  question_en = $t$Who was the first cosmonaut?$t$,
  options_en  = $t$["Yuri Gagarin","Neil Armstrong","Buzz Aldrin","Alan Shepard"]$t$::jsonb,
  context_en  = $t$Yuri Gagarin (USSR) was the first human to travel into space on April 12, 1961, aboard the Vostok 1 spacecraft.$t$
where category = 'astronomia' and question = $q$¿Quién fue el primer cosmonauta?$q$;

update public.questions set
  question_en = $t$Who was the first woman in space?$t$,
  options_en  = $t$["Valentina Tereshkova","Sally Ride","Mae Jemison","Kathryn Sullivan"]$t$::jsonb,
  context_en  = $t$Valentina Tereshkova (USSR) was the first woman in space on June 16, 1963.$t$
where category = 'astronomia' and question = $q$¿Quién fue la primera mujer en el espacio?$q$;

update public.questions set
  question_en = $t$In what year did humans first walk on the Moon?$t$,
  options_en  = $t$["1965","1969","1972","1975"]$t$::jsonb,
  context_en  = $t$Neil Armstrong and Buzz Aldrin walked on the Moon on July 20, 1969, on the Apollo 11 mission.$t$
where category = 'astronomia' and question = $q$¿En qué año pisó el ser humano la Luna por primera vez?$q$;

update public.questions set
  question_en = $t$How many Apollo missions landed on the Moon?$t$,
  options_en  = $t$["5","6","7","8"]$t$::jsonb,
  context_en  = $t$Six Apollo missions landed on the Moon: Apollo 11, 12, 14, 15, 16 and 17 (between 1969 and 1972). Number 13 failed.$t$
where category = 'astronomia' and question = $q$¿Cuántas misiones Apolo aterrizaron en la Luna?$q$;

update public.questions set
  question_en = $t$When was the last crewed Apollo mission to the Moon?$t$,
  options_en  = $t$["1969","1971","1972","1975"]$t$::jsonb,
  context_en  = $t$The last crewed mission to the Moon was Apollo 17 in December 1972, with Gene Cernan as the last human on the Moon.$t$
where category = 'astronomia' and question = $q$¿Cuándo fue la última misión Apolo tripulada a la Luna?$q$;

update public.questions set
  question_en = $t$Which space agency runs the Artemis program?$t$,
  options_en  = $t$["NASA","ESA","Roscosmos","ISRO"]$t$::jsonb,
  context_en  = $t$NASA's Artemis program aims to bring humans back to the Moon in 2025-2026, including the first woman.$t$
where category = 'astronomia' and question = $q$¿Qué agencia espacial dirige el programa Artemis?$q$;

update public.questions set
  question_en = $t$What is the ISS?$t$,
  options_en  = $t$["International Space Station","A mission to Mars","A telescope","A communications satellite"]$t$::jsonb,
  context_en  = $t$The International Space Station (ISS) has orbited the Earth since 1998. A cooperation between NASA, Roscosmos, ESA, JAXA and CSA.$t$
where category = 'astronomia' and question = $q$¿Qué es la ISS?$q$;

update public.questions set
  question_en = $t$At what altitude does the ISS orbit approximately?$t$,
  options_en  = $t$["100 km","400 km","1,000 km","10,000 km"]$t$::jsonb,
  context_en  = $t$The ISS orbits at about 400 km altitude. It circles the Earth every ~90 minutes.$t$
where category = 'astronomia' and question = $q$¿A qué altitud orbita la ISS aproximadamente?$q$;

update public.questions set
  question_en = $t$Which mission reached Pluto in 2015?$t$,
  options_en  = $t$["Voyager 1","Voyager 2","New Horizons","Cassini"]$t$::jsonb,
  context_en  = $t$NASA's New Horizons probe flew by Pluto on July 14, 2015.$t$
where category = 'astronomia' and question = $q$¿Qué misión llegó a Plutón en 2015?$q$;

update public.questions set
  question_en = $t$Which probe explored Saturn until 2017?$t$,
  options_en  = $t$["Voyager","Galileo","Cassini","Juno"]$t$::jsonb,
  context_en  = $t$The Cassini-Huygens mission orbited Saturn from 2004 to 2017. Huygens landed on Titan in 2005.$t$
where category = 'astronomia' and question = $q$¿Qué sonda exploró Saturno hasta 2017?$q$;

update public.questions set
  question_en = $t$Which probe currently explores Jupiter?$t$,
  options_en  = $t$["Voyager","Galileo","Juno","Cassini"]$t$::jsonb,
  context_en  = $t$NASA's Juno probe, launched in 2011, has orbited Jupiter since 2016.$t$
where category = 'astronomia' and question = $q$¿Qué sonda explora Júpiter actualmente?$q$;

update public.questions set
  question_en = $t$Which mission reached Mars with the Perseverance rover?$t$,
  options_en  = $t$["Curiosity","Mars 2020","Spirit","Opportunity"]$t$::jsonb,
  context_en  = $t$The Mars 2020 mission carried the Perseverance rover, which landed on Mars on February 18, 2021.$t$
where category = 'astronomia' and question = $q$¿Qué sonda llegó a Marte con el rover Perseverance?$q$;

update public.questions set
  question_en = $t$Which small helicopter explored Mars?$t$,
  options_en  = $t$["Ingenuity","Resilience","Curiosity","Sojourner"]$t$::jsonb,
  context_en  = $t$Ingenuity, NASA's helicopter, arrived on Mars with Perseverance in 2021. The first powered flight on another planet.$t$
where category = 'astronomia' and question = $q$¿Qué pequeño helicóptero exploró Marte?$q$;

update public.questions set
  question_en = $t$Which private company has achieved the most space launches recently?$t$,
  options_en  = $t$["Blue Origin","SpaceX","Rocket Lab","Virgin Galactic"]$t$::jsonb,
  context_en  = $t$SpaceX, founded by Elon Musk, leads private space launches with its Falcon 9 rocket.$t$
where category = 'astronomia' and question = $q$¿Qué empresa privada ha logrado más lanzamientos espaciales recientemente?$q$;

update public.questions set
  question_en = $t$Which reusable rocket made SpaceX famous?$t$,
  options_en  = $t$["Falcon 1","Falcon 9","Starship","Dragon"]$t$::jsonb,
  context_en  = $t$Falcon 9 was the first orbital rocket with a reusable stage. Its first successful landing was in December 2015.$t$
where category = 'astronomia' and question = $q$¿Qué cohete reutilizable hizo famoso a SpaceX?$q$;

update public.questions set
  question_en = $t$What is the name of SpaceX's rocket for Mars?$t$,
  options_en  = $t$["Falcon Heavy","Starship","Dragon","Crew"]$t$::jsonb,
  context_en  = $t$Starship is SpaceX's heavy rocket, designed for missions to the Moon, Mars and beyond. In testing since 2023.$t$
where category = 'astronomia' and question = $q$¿Cómo se llama el cohete de SpaceX para Marte?$q$;

update public.questions set
  question_en = $t$What waves do pulsars emit?$t$,
  options_en  = $t$["Radio waves","Sound waves","Gravitational waves","Visible light"]$t$::jsonb,
  context_en  = $t$Pulsars are neutron stars that emit beams of radio waves (and sometimes others) at regular intervals.$t$
where category = 'astronomia' and question = $q$¿Qué ondas emiten los púlsares?$q$;

update public.questions set
  question_en = $t$Who discovered pulsars?$t$,
  options_en  = $t$["Hubble","Hawking","Jocelyn Bell","Penzias and Wilson"]$t$::jsonb,
  context_en  = $t$Jocelyn Bell Burnell discovered the first pulsar in 1967 as a doctoral student at Cambridge.$t$
where category = 'astronomia' and question = $q$¿Quién descubrió los púlsares?$q$;

update public.questions set
  question_en = $t$How many galaxies are estimated to exist in the observable universe?$t$,
  options_en  = $t$["~100 million","~2 trillion","~10 quintillion","~100"]$t$::jsonb,
  context_en  = $t$The observable universe is estimated to contain approximately 2 trillion (10¹²) galaxies.$t$
where category = 'astronomia' and question = $q$¿Cuántas galaxias se estima que hay en el universo observable?$q$;

update public.questions set
  question_en = $t$What is an exoplanet?$t$,
  options_en  = $t$["A planet outside the solar system","A dwarf planet","An asteroid","A comet"]$t$::jsonb,
  context_en  = $t$An exoplanet is a planet that orbits a star other than the Sun. More than 5,500 exoplanets have been confirmed.$t$
where category = 'astronomia' and question = $q$¿Qué es un exoplaneta?$q$;

update public.questions set
  question_en = $t$What is the Goldilocks zone?$t$,
  options_en  = $t$["The habitable zone of a star","A galactic nucleus","A planetary ring","A no-return zone"]$t$::jsonb,
  context_en  = $t$The habitable or Goldilocks zone is the region around a star where liquid water could exist on the surface of a planet.$t$
where category = 'astronomia' and question = $q$¿Qué es la zona de Goldilocks?$q$;

update public.questions set
  question_en = $t$Which telescope has confirmed thousands of exoplanets?$t$,
  options_en  = $t$["Hubble","Kepler","TESS","Kepler and TESS"]$t$::jsonb,
  context_en  = $t$NASA's Kepler (2009-2018) and TESS (since 2018) telescopes have confirmed thousands of exoplanets.$t$
where category = 'astronomia' and question = $q$¿Qué telescopio ha confirmado miles de exoplanetas?$q$;

update public.questions set
  question_en = $t$What is zodiacal light?$t$,
  options_en  = $t$["Solar system dust scattering light","Aurora borealis","Solar halo","The Milky Way"]$t$::jsonb,
  context_en  = $t$Zodiacal light is a faint glow produced by the scattering of sunlight by dust in the plane of the solar system.$t$
where category = 'astronomia' and question = $q$¿Qué es la luz zodiacal?$q$;

update public.questions set
  question_en = $t$What phenomenon creates the aurora borealis?$t$,
  options_en  = $t$["Solar wind and magnetic field","Volcanoes","Storms","Eclipses"]$t$::jsonb,
  context_en  = $t$Auroras occur when charged particles from the solar wind collide with the atmosphere, guided by the Earth's magnetic field.$t$
where category = 'astronomia' and question = $q$¿Qué fenómeno crea las auroras boreales?$q$;

update public.questions set
  question_en = $t$Who defined the laws of planetary motion?$t$,
  options_en  = $t$["Copernicus","Kepler","Galileo","Newton"]$t$::jsonb,
  context_en  = $t$Johannes Kepler formulated his three laws of planetary motion between 1609 and 1619.$t$
where category = 'astronomia' and question = $q$¿Quién definió las leyes del movimiento planetario?$q$;

update public.questions set
  question_en = $t$Who unified terrestrial and celestial laws with gravity?$t$,
  options_en  = $t$["Kepler","Galileo","Newton","Einstein"]$t$::jsonb,
  context_en  = $t$Isaac Newton unified terrestrial and celestial laws in his 'Principia' (1687) with the law of universal gravitation.$t$
where category = 'astronomia' and question = $q$¿Quién unificó las leyes terrestres y celestes con la gravedad?$q$;

update public.questions set
  question_en = $t$Who revolutionized our understanding of gravity with relativity?$t$,
  options_en  = $t$["Newton","Einstein","Hubble","Hawking"]$t$::jsonb,
  context_en  = $t$Albert Einstein published the theory of general relativity in 1915, describing gravity as the curvature of spacetime.$t$
where category = 'astronomia' and question = $q$¿Quién revolucionó nuestra comprensión de la gravedad con la relatividad?$q$;


commit;

-- Cobertura tras aplicar:
select count(*) as missing_en from public.questions
  where active and (question_en is null or options_en is null);
