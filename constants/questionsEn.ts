import { Category, Question } from '@/types';

// Banco offline en inglés (espejo de QUESTIONS en questions.ts).
// Mismo orden y mismos índices `ans`; solo se traduce el texto.
export const QUESTIONS_EN: Record<Category, Question[]> = {
  historia: [
    {
      q: 'In what year did World War I end?',
      opts: ['1916', '1917', '1918', '1919'],
      ans: 2,
      ctx: 'World War I ended on 11 November 1918, when the Armistice of Compiègne was signed. The conflict had lasted four devastating years, causing more than 20 million deaths.',
    },
    {
      q: 'Who was the first emperor of Rome?',
      opts: ['Julius Caesar', 'Augustus', 'Nero', 'Tiberius'],
      ans: 1,
      ctx: "Augustus (Octavian) was the first Roman emperor, ruling from 27 BC to AD 14. Although Julius Caesar wielded great power, he was never officially 'emperor', a title that went to his great-nephew.",
    },
    {
      q: 'In what year did the Berlin Wall fall?',
      opts: ['1987', '1988', '1989', '1991'],
      ans: 2,
      ctx: 'The Berlin Wall fell on 9 November 1989, after 28 years dividing the city. It was one of the most symbolic moments of the end of the Cold War and German reunification.',
    },
    {
      q: 'Which civilization built Machu Picchu?',
      opts: ['Aztec', 'Maya', 'Inca', 'Olmec'],
      ans: 2,
      ctx: 'Machu Picchu was built by the Inca Empire around the 15th century, probably as a royal residence for emperor Pachacútec. It sits in the Peruvian Andes at 2,430 metres of altitude.',
    },
    {
      q: 'In what year did Christopher Columbus reach America?',
      opts: ['1490', '1492', '1498', '1502'],
      ans: 1,
      ctx: 'On 12 October 1492, Christopher Columbus reached the island of Guanahaní (Bahamas), believing he had reached Asia. This voyage sponsored by the Catholic Monarchs marked the start of the colonial era.',
    },
  ],
  geografia: [
    {
      q: 'What is the longest river in the world?',
      opts: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'],
      ans: 1,
      ctx: 'The Nile, roughly 6,650 km long, is considered the longest river in the world, although there is scientific debate with the Amazon. It crosses 11 African countries before flowing into the Mediterranean.',
    },
    {
      q: 'In which country is the Eiffel Tower?',
      opts: ['Belgium', 'Switzerland', 'France', 'Italy'],
      ans: 2,
      ctx: "The Eiffel Tower is in Paris, France. It was built by Gustave Eiffel for the 1889 World's Fair and stands 330 metres tall. Initially criticized, today it is the most visited monument in the world.",
    },
    {
      q: 'What is the largest country in the world by area?',
      opts: ['China', 'Canada', 'United States', 'Russia'],
      ans: 3,
      ctx: "Russia is the largest country in the world, at 17.1 million km². It spans 11 time zones, from eastern Europe to the Pacific, and represents 11% of the world's total land area.",
    },
    {
      q: 'Where is the Great Wall of China located?',
      opts: ['Only in Beijing', 'Northern China', "China's east coast", 'All over the country'],
      ans: 1,
      ctx: 'The Great Wall of China runs across the north of the country for more than 21,000 km, although the total length varies by measurement. It was built to protect the Chinese Empire from invasions from the north.',
    },
    {
      q: 'What is the capital of Australia?',
      opts: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      ans: 2,
      ctx: 'Canberra has been the capital of Australia since 1913. It was specially designed to be the capital, as a compromise between rivals Sydney and Melbourne. Sydney is the largest city, but not the capital.',
    },
  ],
  ciencia: [
    {
      q: 'How many elements does the periodic table currently have?',
      opts: ['108', '112', '118', '124'],
      ans: 2,
      ctx: 'The current periodic table has 118 confirmed elements, the last being Oganesson (Og), added in 2016. The final group of four elements (113-116-117-118) was confirmed by IUPAC that year.',
    },
    {
      q: 'How fast does light travel in a vacuum?',
      opts: ['200,000 km/s', '300,000 km/s', '400,000 km/s', '150,000 km/s'],
      ans: 1,
      ctx: "Light travels at 299,792,458 m/s (≈300,000 km/s) in a vacuum. This constant, called 'c', is fundamental in physics and is the speed limit of the universe according to Einstein's theory of relativity.",
    },
    {
      q: 'Who proposed the theory of evolution by natural selection?',
      opts: ['Gregor Mendel', 'Charles Darwin', 'Louis Pasteur', 'Alfred Wallace'],
      ans: 1,
      ctx: "Charles Darwin published 'On the Origin of Species' in 1859, proposing evolution by natural selection. Curiously, Alfred Wallace developed similar ideas in parallel, which sped up Darwin's publication.",
    },
    {
      q: 'What is a diamond made of?',
      opts: ['Silicon', 'Carbon', 'Quartz', 'Rock crystal'],
      ans: 1,
      ctx: 'A diamond is made of pure carbon crystallized in a cubic structure at high pressure and temperature. It is the hardest known natural material (10 on the Mohs scale) and is the same element as graphite.',
    },
    {
      q: 'How many bones does the adult human body have?',
      opts: ['186', '206', '226', '246'],
      ans: 1,
      ctx: 'The adult human body has 206 bones. At birth we have around 270-300 bones, which fuse during growth. The smallest is the stapes (in the ear) and the largest is the femur.',
    },
  ],
  arte: [
    {
      q: 'Who painted the Mona Lisa (La Gioconda)?',
      opts: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Botticelli'],
      ans: 2,
      ctx: 'Leonardo da Vinci painted the Mona Lisa between 1503 and 1519. It is the most famous artwork in the world, kept at the Louvre in Paris. The identity of the model is still debated, though it is believed to be Lisa Gherardini.',
    },
    {
      q: "Which artistic movement does Van Gogh's 'The Starry Night' belong to?",
      opts: ['Impressionism', 'Expressionism', 'Surrealism', 'Post-Impressionism'],
      ans: 3,
      ctx: "Van Gogh belongs to Post-Impressionism, a movement that grew out of Impressionism but sought greater expressiveness. 'The Starry Night' (1889) was painted while he was committed at the Saint-Paul-de-Mausole asylum.",
    },
    {
      q: "Who sculpted 'David'?",
      opts: ['Leonardo da Vinci', 'Donatello', 'Michelangelo', 'Raphael'],
      ans: 2,
      ctx: 'Michelangelo sculpted David between 1501 and 1504, aged just 26. Carved from a single block of Carrara marble, it stands 5.17 metres tall. It depicts the biblical David before facing Goliath.',
    },
    {
      q: "Which country's architecture is the Taj Mahal from?",
      opts: ['Pakistan', 'India', 'Turkey', 'Persia'],
      ans: 1,
      ctx: 'The Taj Mahal is in Agra, India. It was built by Mughal emperor Shah Jahan between 1632 and 1653 in memory of his wife Mumtaz Mahal. It is considered the masterpiece of Mughal architecture.',
    },
    {
      q: 'In which city is the Prado Museum?',
      opts: ['Barcelona', 'Seville', 'Valencia', 'Madrid'],
      ans: 3,
      ctx: 'The Prado Museum is in Madrid and is one of the most important art museums in the world. It houses works by Velázquez, Goya, El Greco and Rubens, among others. It opened in 1819.',
    },
  ],
  filosofia: [
    {
      q: "Who said 'I only know that I know nothing'?",
      opts: ['Plato', 'Aristotle', 'Socrates', 'Epicurus'],
      ans: 2,
      ctx: 'Socrates (469-399 BC) is famous for this statement of intellectual humility. Paradoxically, we know his thought through the writings of his disciple Plato, since Socrates left no text of his own.',
    },
    {
      q: "Which philosopher wrote 'The World as Will and Representation'?",
      opts: ['Kant', 'Hegel', 'Schopenhauer', 'Nietzsche'],
      ans: 2,
      ctx: "Arthur Schopenhauer published this work in 1818. In it he argues that the 'will' is the blind force driving all existence, and that suffering is inherent to life. He deeply influenced Nietzsche and Wagner.",
    },
    {
      q: "Which philosophical school proposed 'the greatest good for the greatest number'?",
      opts: ['Kantianism', 'Utilitarianism', 'Stoicism', 'Existentialism'],
      ans: 1,
      ctx: 'Utilitarianism, founded by Jeremy Bentham and developed by John Stuart Mill, holds that the right action is the one that maximizes total happiness. It is one of the most influential ethical theories in politics and economics.',
    },
    {
      q: "Who wrote 'Thus Spoke Zarathustra'?",
      opts: ['Schopenhauer', 'Marx', 'Heidegger', 'Nietzsche'],
      ans: 3,
      ctx: "Friedrich Nietzsche published 'Thus Spoke Zarathustra' between 1883 and 1885. In it he introduces concepts such as the 'superman' (Übermensch) and the 'will to power'. Nietzsche considered it his most important work.",
    },
    {
      q: "Which philosopher wrote 'The Republic'?",
      opts: ['Aristotle', 'Plato', 'Socrates', 'Epicurus'],
      ans: 1,
      ctx: "Plato wrote 'The Republic' around 380 BC. In it he sets out his theory of the ideal state governed by philosopher-kings and his famous allegory of the cave, which illustrates the difference between appearance and reality.",
    },
  ],
  deportes: [
    {
      q: 'How often are the Summer Olympic Games held?',
      opts: ['Every 2 years', 'Every 3 years', 'Every 4 years', 'Every 5 years'],
      ans: 2,
      ctx: 'The Summer Olympic Games have been held every 4 years since 1896, except for cancellations due to world wars. The Winter Games are also every 4 years, alternating every 2 with the Summer Games.',
    },
    {
      q: "Which country has won the most men's football World Cups?",
      opts: ['Germany', 'Italy', 'Argentina', 'Brazil'],
      ans: 3,
      ctx: 'Brazil has won 5 World Cups (1958, 1962, 1970, 1994 and 2002). It is the only country to have played in every edition of the World Cup.',
    },
    {
      q: 'How many players does a basketball team have on the court?',
      opts: ['4', '5', '6', '7'],
      ans: 1,
      ctx: 'Each team has 5 players on the court: point guard, shooting guard, small forward, power forward and center. Basketball was invented by James Naismith in 1891.',
    },
  ],
  biologia: [
    {
      q: 'What is the largest organ in the human body?',
      opts: ['Liver', 'Lung', 'Skin', 'Intestine'],
      ans: 2,
      ctx: 'The skin is the largest organ in the body, with a surface area of about 2 m² and a weight of up to 5 kg in adults. It is the first line of defence against the outside.',
    },
    {
      q: 'Who proposed cell theory together with Theodor Schwann?',
      opts: ['Robert Hooke', 'Matthias Schleiden', 'Louis Pasteur', 'Gregor Mendel'],
      ans: 1,
      ctx: 'Matthias Schleiden (a botanist) and Theodor Schwann (a zoologist) formulated cell theory around 1839: all living things are composed of cells.',
    },
    {
      q: 'How many chromosomes does a normal human cell have?',
      opts: ['23', '44', '46', '48'],
      ans: 2,
      ctx: 'Human somatic cells have 46 chromosomes (23 pairs). Gametes (eggs and sperm) have 23 unpaired chromosomes.',
    },
  ],
  cine: [
    {
      q: "Who directed 'The Godfather' (1972)?",
      opts: ['Martin Scorsese', 'Francis Ford Coppola', 'Stanley Kubrick', 'Steven Spielberg'],
      ans: 1,
      ctx: "Francis Ford Coppola directed 'The Godfather' (1972), based on Mario Puzo's novel. It won the Oscar for Best Picture and is considered one of the greatest films in history.",
    },
    {
      q: 'Which film won the first Oscar for Best Picture?',
      opts: ['Wings', "Singin' in the Rain", 'Ben-Hur', 'Gone with the Wind'],
      ans: 0,
      ctx: "'Wings' (1927), by William A. Wellman, won the first Oscar for Best Picture in 1929. It is the only silent film to win this award.",
    },
    {
      q: "Who starred in 'Forrest Gump'?",
      opts: ['Tom Hanks', 'Tom Cruise', 'Brad Pitt', 'Kevin Costner'],
      ans: 0,
      ctx: "Tom Hanks starred in 'Forrest Gump' (1994), directed by Robert Zemeckis. It won 6 Oscars, including Best Actor for Hanks (his second consecutive Oscar).",
    },
  ],
  musica: [
    {
      q: 'How many strings does a standard classical guitar have?',
      opts: ['4', '5', '6', '7'],
      ans: 2,
      ctx: 'The Spanish classical guitar has 6 strings tuned E-A-D-G-B-E. Other variants include 7- or 12-string guitars.',
    },
    {
      q: "Who composed the Ninth Symphony with the 'Ode to Joy'?",
      opts: ['Mozart', 'Bach', 'Beethoven', 'Schubert'],
      ans: 2,
      ctx: "Ludwig van Beethoven composed his Ninth Symphony (1824), whose final movement includes the 'Ode to Joy' set to Schiller's poem. He composed it when already completely deaf.",
    },
    {
      q: 'Which country are The Beatles from?',
      opts: ['United States', 'United Kingdom', 'Ireland', 'Australia'],
      ans: 1,
      ctx: 'The Beatles formed in Liverpool (England) in 1960. Its members were John Lennon, Paul McCartney, George Harrison and Ringo Starr.',
    },
  ],
  literatura: [
    {
      q: "Who wrote 'Don Quixote'?",
      opts: ['Lope de Vega', 'Miguel de Cervantes', 'Francisco de Quevedo', 'Calderón de la Barca'],
      ans: 1,
      ctx: "Miguel de Cervantes published the first part of 'Don Quixote' in 1605 and the second in 1615. It is considered the first modern novel and the greatest work of Spanish-language literature.",
    },
    {
      q: 'In which century did William Shakespeare live?',
      opts: ['15th-16th', '16th-17th', '17th-18th', '18th-19th'],
      ans: 1,
      ctx: "Shakespeare lived between 1564 and 1616 (16th-17th centuries). He wrote 39 plays and 154 sonnets, including 'Hamlet', 'Macbeth' and 'Romeo and Juliet'.",
    },
    {
      q: "Who wrote 'One Hundred Years of Solitude'?",
      opts: ['Mario Vargas Llosa', 'Jorge Luis Borges', 'Gabriel García Márquez', 'Julio Cortázar'],
      ans: 2,
      ctx: "Gabriel García Márquez published 'One Hundred Years of Solitude' in 1967. It is the emblematic work of magical realism. He received the Nobel Prize in Literature in 1982.",
    },
  ],
  tecnologia: [
    {
      q: 'Who founded Microsoft together with Paul Allen?',
      opts: ['Steve Jobs', 'Bill Gates', 'Larry Page', 'Mark Zuckerberg'],
      ans: 1,
      ctx: 'Bill Gates and Paul Allen founded Microsoft in 1975 in Albuquerque, New Mexico. The company moved to Redmond, Washington, in 1979.',
    },
    {
      q: "What does 'HTTP' stand for?",
      opts: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'HyperText Transport Process', 'Home Tool Transfer Protocol'],
      ans: 0,
       ctx: 'HTTP (HyperText Transfer Protocol) is the protocol of the web, created by Tim Berners-Lee in 1989. HTTPS adds TLS encryption on top of HTTP.',
    },
    {
      q: 'In what year was the first iPhone released?',
      opts: ['2005', '2007', '2009', '2010'],
      ans: 1,
      ctx: 'The first iPhone was unveiled by Steve Jobs on 9 January 2007 and released on 29 June that year. It revolutionized the smartphone market.',
    },
  ],
  mitologia: [
    {
      q: 'Who is the king of the gods in Greek mythology?',
      opts: ['Apollo', 'Poseidon', 'Zeus', 'Hades'],
      ans: 2,
      ctx: 'Zeus is the king of Olympus, god of the sky and thunder. His Roman equivalent is Jupiter. His brothers Poseidon and Hades rule the sea and the underworld respectively.',
    },
    {
      q: 'What is the Roman equivalent of the Greek goddess Aphrodite?',
      opts: ['Diana', 'Venus', 'Juno', 'Minerva'],
      ans: 1,
      ctx: 'Venus is the Roman goddess of love and beauty, equivalent to Aphrodite in Greek mythology. The planet Venus is named after her.',
    },
    {
      q: 'Who is the god of thunder in Norse mythology?',
      opts: ['Odin', 'Thor', 'Loki', 'Freyr'],
      ans: 1,
      ctx: 'Thor is the god of thunder, son of Odin. His hammer, Mjölnir, is one of the most recognizable symbols of Norse mythology.',
    },
  ],
  astronomia: [
    {
      q: 'What is the largest planet in the solar system?',
      opts: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
      ans: 1,
      ctx: 'Jupiter is the largest planet in the solar system, with a mass 318 times that of Earth. It has at least 95 known moons, Ganymede being the largest in the solar system.',
    },
    {
      q: 'Which galaxy contains our solar system?',
      opts: ['Andromeda', 'Milky Way', 'Triangulum', 'Sombrero'],
      ans: 1,
      ctx: 'The Milky Way is a barred spiral galaxy about 100,000 light-years in diameter. It contains between 100 and 400 billion stars.',
    },
    {
      q: 'Who was the first human to set foot on the Moon?',
      opts: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'Michael Collins'],
      ans: 1,
      ctx: "Neil Armstrong stepped onto the Moon on 20 July 1969 during the Apollo 11 mission, uttering the phrase 'That's one small step for man, one giant leap for mankind.'",
    },
  ],
};

export const DAILY_QUESTION_EN: Question = {
  q: 'How many countries make up the European Union in 2024?',
  opts: ['25', '27', '30', '33'],
  ans: 1,
  ctx: 'The European Union has had 27 member countries since 2020, when the United Kingdom left after Brexit. The EU was founded by 6 countries in 1957 with the Treaty of Rome and has expanded progressively.',
};
