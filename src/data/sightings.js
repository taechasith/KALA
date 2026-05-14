// Notable UAP/UFO incidents with exact dates (month/day/year)
// Sources: NICAP, MUFON, NUFORC, declassified military records

export const SIGHTINGS = [
  // January
  { date: "01-07", year: 1948, title: "Mantell Incident", location: "Fort Knox, Kentucky, USA", description: "USAF pilot Thomas Mantell died chasing a UFO in his P-51. Last radio transmission described a metallic object moving at incredible speed.", category: "MILITARY", credibility: "HIGH" },
  { date: "01-07", year: 2008, title: "Stephenville Mass Sighting", location: "Stephenville, Texas, USA", description: "Hundreds of witnesses including pilots reported a massive silent craft, 1 mile wide, flying over rural Texas. Military initially denied, then admitted jets were in area.", category: "MASS", credibility: "HIGH" },
  { date: "01-08", year: 1981, title: "Trans-en-Provence Landing", location: "Trans-en-Provence, France", description: "Farmer reported a disc landing briefly. French GEPAN investigators found physical soil trace evidence — compressed and heated soil, unexplained plant biochemical changes.", category: "LANDING", credibility: "HIGH" },
  { date: "01-20", year: 1996, title: "Varginha Incident", location: "Varginha, Minas Gerais, Brazil", description: "Multiple witnesses and military personnel reported capturing bipedal non-human entities. Brazilian army deployed in mass. Official denial followed.", category: "ENTITY", credibility: "HIGH" },

  // February
  { date: "02-24", year: 1942, title: "Battle of Los Angeles", location: "Los Angeles, California, USA", description: "US military fired 1,400 anti-aircraft shells at unidentified objects over LA. Officially attributed to 'war nerves' but photos show beams converging on solid object.", category: "MILITARY", credibility: "HIGH" },
  { date: "02-02", year: 1959, title: "Dyatlov Pass Incident", location: "Ural Mountains, Russia", description: "Nine hikers found dead in unexplained circumstances. Tent torn from inside. Bodies showed radiation, injuries inconsistent with natural causes. UAP sightings reported in area same night.", category: "UNKNOWN", credibility: "MEDIUM" },
  { date: "02-11", year: 1953, title: "Ellsworth AFB Chase", location: "Rapid City, South Dakota, USA", description: "B-36 crew and radar operators tracked unknown craft at 900 mph. F-84 jets scrambled but lost contact. Official classification: Unknown.", category: "MILITARY", credibility: "HIGH" },

  // March
  { date: "03-13", year: 1997, title: "Phoenix Lights", location: "Phoenix, Arizona, USA", description: "Thousands of witnesses observed a mile-wide silent V-shaped craft drifting slowly over Phoenix and Sonoran Desert. Governor Fife Symington initially mocked, later admitted genuine sighting.", category: "MASS", credibility: "HIGH" },
  { date: "03-20", year: 1966, title: "Swamp Gas Incident", location: "Dexter & Hillsdale, Michigan, USA", description: "107 students and dean at Hillsdale College plus Dexter police reported glowing oval craft. J. Allen Hynek famously dismissed it as 'swamp gas,' triggering congressional hearings.", category: "MASS", credibility: "HIGH" },
  { date: "03-03", year: 1968, title: "Zond IV Reentry", location: "Eastern USA", description: "Classified Soviet probe re-entry generated mass sighting wave. Witnesses reported structured craft with rows of windows. USAF used to debunk, but sighting geometry inconsistent.", category: "MASS", credibility: "MEDIUM" },
  { date: "03-30", year: 1990, title: "Belgian UFO Wave", location: "Wavre, Belgium", description: "Two F-16s locked radar on triangular craft doing 1,000 mph, then dropped to 6 mph in seconds with no sonic boom. SAC General de Brouwer confirmed genuine unknown.", category: "MILITARY", credibility: "HIGH" },

  // April
  { date: "04-06", year: 1966, title: "Westall School UFO", location: "Clayton South, Melbourne, Australia", description: "Over 200 students and teachers witnessed a metallic disc land in a field, then lift off and disappear at speed. All witnesses were reportedly pressured into silence.", category: "MASS", credibility: "HIGH" },
  { date: "04-18", year: 1961, title: "Joe Simonton Pancakes", location: "Eagle River, Wisconsin, USA", description: "Farmer reported small beings gave him pancakes from landed disc. USAF Project Blue Book investigated — officially classified as psychological delusion, but never explained.", category: "CLOSE", credibility: "MEDIUM" },
  { date: "04-24", year: 1964, title: "Socorro Landing", location: "Socorro, New Mexico, USA", description: "Police officer Lonnie Zamora witnessed egg-shaped craft land on desert floor with occupants. Physical evidence found. J. Allen Hynek called it most credible case in Blue Book files.", category: "LANDING", credibility: "HIGH" },
  { date: "04-27", year: 2020, title: "Pentagon UAP Video Release", location: "Washington D.C., USA", description: "DoD officially released three Navy UAP encounter videos: FLIR1, Gimbal, GoFast — confirming objects exhibited flight characteristics beyond known technology.", category: "GOVERNMENT", credibility: "CONFIRMED" },

  // May
  { date: "05-11", year: 1950, title: "McMinnville Photos", location: "McMinnville, Oregon, USA", description: "Evelyn Trent photographed disc-shaped craft from her farm. Analyzed by Condon Committee and later scientists — no evidence of hoax. Among most authenticated UFO photographs.", category: "PHOTO", credibility: "HIGH" },
  { date: "05-20", year: 1967, title: "Falcon Lake Incident", location: "Falcon Lake, Manitoba, Canada", description: "Stefan Michalak encountered landed craft, was burned by exhaust grid. Physical burns matched craft description exactly. RCMP and USAF investigated. Unsolved to this day.", category: "CLOSE", credibility: "HIGH" },
  { date: "05-24", year: 1949, title: "Death Valley Disc", location: "Death Valley, California, USA", description: "Two prospectors claimed alien craft landed, beings emerged. One was transported inside briefly. Physiological effects reported for weeks after contact.", category: "ENTITY", credibility: "MEDIUM" },

  // June
  { date: "06-01", year: 1947, title: "Maury Island Incident", location: "Puget Sound, Washington, USA", description: "Harold Dahl claimed six doughnut-shaped objects ejected slag that killed his dog. Followed by first-ever reported Men in Black visit. Two USAF investigators died in plane crash.", category: "UNKNOWN", credibility: "MEDIUM" },
  { date: "06-18", year: 1959, title: "Father Gill Sighting", location: "Boianai, Papua New Guinea", description: "Anglican priest and 38 mission residents watched humanoid figures wave from hovering craft over two consecutive nights. Investigator J. Allen Hynek rated it among best-documented ever.", category: "ENTITY", credibility: "HIGH" },
  { date: "06-24", year: 1947, title: "Kenneth Arnold Sighting", location: "Mount Rainier, Washington, USA", description: "Pilot Kenneth Arnold observed nine crescent-shaped objects flying in formation at 1,700 mph. His report coined the term 'flying saucer' and launched modern UFO era.", category: "PILOT", credibility: "HIGH" },
  { date: "06-25", year: 2021, title: "UAP Task Force Report", location: "Washington D.C., USA", description: "Office of Director of National Intelligence released preliminary UAP assessment. Confirmed 144 incidents, 80 involved multiple sensors, 18 showed unusual movement patterns. One confirmed UAP.", category: "GOVERNMENT", credibility: "CONFIRMED" },

  // July
  { date: "07-01", year: 1965, title: "Valensole Landing", location: "Valensole, Alpes-de-Haute-Provence, France", description: "Farmer Maurice Masse encountered landed craft and two small beings examining his lavender plants. Beings froze him with device. Physical ground trace found. French gendarmerie confirmed.", category: "LANDING", credibility: "HIGH" },
  { date: "07-02", year: 1947, title: "Roswell Crash", location: "Roswell, New Mexico, USA", description: "USAF announced recovery of 'flying disc' then retracted to 'weather balloon.' Witnesses described non-human bodies and materials with memory properties. Most famous case in UFO history.", category: "CRASH", credibility: "HIGH" },
  { date: "07-14", year: 1952, title: "Nash-Fortenberry Sighting", location: "Hampton Roads, Virginia, USA", description: "Two Pan Am pilots encountered eight disc-shaped objects in formation performing precise 150-degree turn at extreme speed. Confirmed by multiple radar installations simultaneously.", category: "PILOT", credibility: "HIGH" },
  { date: "07-17", year: 1966, title: "Minot AFB Incident", location: "Minot Air Force Base, North Dakota, USA", description: "Radar contact and visual sightings of unknown objects near nuclear missile silos. F-106 scrambled. Separate ground team reported disc hovering over missile launch facility.", category: "MILITARY", credibility: "HIGH" },
  { date: "07-19", year: 1952, title: "Washington D.C. UFO Wave", location: "Washington D.C., USA", description: "Multiple unknown targets tracked on radar at National Airport and Andrews AFB. Jets scrambled. Objects maneuvered around interceptors. Largest radar-confirmed UFO event in US history.", category: "MASS", credibility: "HIGH" },
  { date: "07-24", year: 1948, title: "Chiles-Whitted Incident", location: "Montgomery, Alabama, USA", description: "Two Eastern Airlines pilots encountered rocket-shaped craft with rows of windows, exhausting blue-white flame. Object pulled up into cloud avoiding collision. Air Force classified Unknown.", category: "PILOT", credibility: "HIGH" },

  // August
  { date: "08-06", year: 1965, title: "Great Plains Mass Sighting", location: "Wichita, Kansas, USA", description: "Hundreds of witnesses across Kansas, Oklahoma, Texas reported massive formations of lights. Police, pilots, military all filed reports. FAA confirmed unidentified radar returns.", category: "MASS", credibility: "HIGH" },
  { date: "08-13", year: 1956, title: "Bentwaters-Lakenheath", location: "Suffolk, England, UK", description: "Ground and airborne radar tracked UFO at 4,000 mph over NATO bases. RAF Meteor scrambled, pilot visually confirmed — then UFO circled behind jet and followed it. Condon Committee: genuine Unknown.", category: "MILITARY", credibility: "HIGH" },
  { date: "08-21", year: 1955, title: "Kelly-Hopkinsville Encounter", location: "Kelly, Kentucky, USA", description: "Family of 11 reported siege by small silvery beings for five hours. Called police. Multiple officers verified frightened witnesses and physical evidence at farmhouse. One of most investigated cases.", category: "ENTITY", credibility: "HIGH" },
  { date: "08-25", year: 1951, title: "Lubbock Lights", location: "Lubbock, Texas, USA", description: "Formation of 50 lights in V-formation photographed by college student Carl Hart Jr. Four Texas Tech professors observed multiple passes. Blue Book classified Unknown.", category: "MASS", credibility: "HIGH" },
  { date: "08-27", year: 1979, title: "Val Johnson Incident", location: "Marshall County, Minnesota, USA", description: "Deputy sheriff's patrol car struck by beam from unknown object. Windshield cracked, antenna bent, watch and clock lost 14 minutes. Car and body injuries consistent with intense light source.", category: "PHYSICAL", credibility: "HIGH" },

  // September
  { date: "09-03", year: 1965, title: "Exeter UFO Incident", location: "Exeter, New Hampshire, USA", description: "Teenager Norman Muscarello and two police officers observed large silent craft with red lights pulsing in sequence hovering 100 feet above ground. Blue Book: Insufficient Data.", category: "CLOSE", credibility: "HIGH" },
  { date: "09-10", year: 2019, title: "Navy UAP Program Revealed", location: "Washington D.C., USA", description: "US Navy officially confirmed UAP sighting videos are genuine and represent unknown objects. First official military confirmation of unidentified craft exhibiting beyond-known-physics behavior.", category: "GOVERNMENT", credibility: "CONFIRMED" },
  { date: "09-12", year: 1952, title: "Flatwoods Monster", location: "Flatwoods, West Virginia, USA", description: "Six locals and National Guardsman encountered 10-foot glowing entity near landed craft. Physical symptoms (nausea, vomiting) developed in witnesses. Local animals died. Unexplained.", category: "ENTITY", credibility: "MEDIUM" },
  { date: "09-16", year: 1994, title: "Ariel School UFO Landing", location: "Ruwa, Zimbabwe", description: "62 schoolchildren reported disc landing near school during recess. Children described beings examining them. Harvard psychiatrist John Mack interviewed children — found no evidence of fabrication.", category: "MASS", credibility: "HIGH" },
  { date: "09-19", year: 1961, title: "Betty and Barney Hill Abduction", location: "White Mountains, New Hampshire, USA", description: "First widely reported abduction case. Missing time, physical evidence, detailed corroborating hypnotic regression accounts. Air Force officer confirmed object on radar same night.", category: "ABDUCTION", credibility: "HIGH" },

  // October
  { date: "10-04", year: 1957, title: "Levelland Texas Wave", location: "Levelland, Texas, USA", description: "At least 15 witnesses reported egg-shaped craft causing vehicle engine failures and light-outs across 200-square-mile area over 3 hours. Multiple police officers among witnesses.", category: "PHYSICAL", credibility: "HIGH" },
  { date: "10-11", year: 1973, title: "Pascagoula Abduction", location: "Pascagoula, Mississippi, USA", description: "Charles Hickson and Calvin Parker taken aboard craft by robotic beings while fishing. Police secretly recorded them — continued story privately. Sheriff convinced. NASA took interest.", category: "ABDUCTION", credibility: "HIGH" },
  { date: "10-18", year: 1973, title: "Coyne Helicopter Incident", location: "Mansfield, Ohio, USA", description: "Four US Army Reserve crew observed cigar-shaped craft approach collision course, halt, then emit green beam that lifted their helicopter 700 feet with no power applied. AIAA investigated.", category: "MILITARY", credibility: "HIGH" },
  { date: "10-21", year: 1978, title: "Frederick Valentich Disappearance", location: "Bass Strait, Victoria, Australia", description: "Cessna pilot radioed Melbourne ATC describing metallic craft orbiting him. Four-minute radio contact cut off. Pilot and aircraft never found. Controller played recording — heard metallic scraping sound.", category: "PILOT", credibility: "HIGH" },
  { date: "10-25", year: 1981, title: "Trans-en-Provence Physical Evidence", location: "Trans-en-Provence, France", description: "GEPAN (French CNES) analyzed soil from UFO landing site. Found alfalfa biochemically altered at cellular level consistent with strong electromagnetic radiation. Remains most scientifically rigorous physical evidence case.", category: "LANDING", credibility: "HIGH" },
  { date: "10-31", year: 1938, title: "War of the Worlds Broadcast", location: "New York, USA", description: "Orson Welles radio broadcast triggered mass panic — thousands believed actual Martian invasion. Demonstrated psychological impact of UFO fear and government credibility role in public response.", category: "CULTURAL", credibility: "CONFIRMED" },

  // November
  { date: "11-02", year: 1971, title: "Delphos Ring", location: "Delphos, Kansas, USA", description: "Farmer's son watched disc hover over ring of glowing soil then shoot upward. Soil at landing site crystallized — would not absorb water for months. APRO investigators confirmed anomaly.", category: "LANDING", credibility: "HIGH" },
  { date: "11-05", year: 1975, title: "Travis Walton Abduction", location: "Apache-Sitgreaves Forest, Arizona, USA", description: "Logger struck by beam from hovering disc. Missing five days. Crew passed polygraph tests. Walton's account detailed and consistent. MUFON verified. Most documented abduction case.", category: "ABDUCTION", credibility: "HIGH" },
  { date: "11-07", year: 2006, title: "O'Hare Airport UAP", location: "O'Hare International Airport, Chicago, USA", description: "United Airlines employees and pilots saw metallic disc hovering under cloud ceiling. Shot upward leaving perfectly circular hole in cloud layer. FAA denied radar contact. Chicago Tribune broke story.", category: "MASS", credibility: "HIGH" },
  { date: "11-14", year: 2004, title: "USS Nimitz Tic-Tac", location: "Pacific Ocean off San Diego, California, USA", description: "F/A-18 pilots from USS Nimitz encountered white Tic-Tac-shaped object with no wings, exhaust, or visible propulsion. Clocked at 100 mph then instantly at 24,000 mph. Multiple sensor confirmation.", category: "MILITARY", credibility: "CONFIRMED" },

  // December
  { date: "12-09", year: 1965, title: "Kecksburg Crash", location: "Kecksburg, Pennsylvania, USA", description: "Acorn-shaped object crashed in woods. Army cordoned area and removed object. Witness reported hieroglyphic-like markings on craft. NASA FOIA investigation revealed files destroyed.", category: "CRASH", credibility: "HIGH" },
  { date: "12-17", year: 1977, title: "Colares UFO Attacks", location: "Colares Island, Para, Brazil", description: "Residents suffered burns and puncture wounds from beams emitted by craft. Brazilian Air Force Operation Saucer deployed to investigate. Classified photos and medical records locked for 20 years.", category: "PHYSICAL", credibility: "HIGH" },
  { date: "12-26", year: 1980, title: "Rendlesham Forest Incident", location: "Suffolk, England, UK", description: "USAF personnel at twin NATO bases tracked and physically approached landed craft over three nights. Deputy base commander Lt. Col. Charles Halt made official written report. Radiation levels confirmed elevated.", category: "MILITARY", credibility: "CONFIRMED" },
  { date: "12-28", year: 1980, title: "Cash-Landrum Incident", location: "Huffman, Texas, USA", description: "Three witnesses received severe radiation poisoning from diamond-shaped craft escorted by US military Chinook helicopters. Betty Cash developed radiation-induced cancer. Sued US government unsuccessfully.", category: "PHYSICAL", credibility: "HIGH" },
]

// Category metadata
export const CATEGORIES = {
  MILITARY:   { label: "Military Encounter", color: "#F4B51F", icon: "✦" },
  MASS:       { label: "Mass Sighting",       color: "#00d4ff", icon: "◎" },
  PILOT:      { label: "Pilot Report",        color: "#a78bfa", icon: "▲" },
  LANDING:    { label: "Physical Landing",    color: "#00ff88", icon: "⊕" },
  ENTITY:     { label: "Entity Encounter",    color: "#ff6b6b", icon: "⬡" },
  ABDUCTION:  { label: "Abduction Report",    color: "#ff4444", icon: "◈" },
  CRASH:      { label: "Crash Recovery",      color: "#FF1E1E", icon: "⌬" },
  PHOTO:      { label: "Photographic",        color: "#818cf8", icon: "▣" },
  PHYSICAL:   { label: "Physical Evidence",   color: "#a3e635", icon: "◆" },
  GOVERNMENT: { label: "Government/Official", color: "#F4B51F", icon: "★" },
  CULTURAL:   { label: "Cultural Impact",     color: "#4F8993", icon: "◉" },
  UNKNOWN:    { label: "Unknown",             color: "#4F8993", icon: "?" },
}

// Credibility colors
export const CREDIBILITY_COLORS = {
  CONFIRMED: "#00ff88",
  HIGH:      "#F4B51F",
  MEDIUM:    "#4F8993",
  LOW:       "#FF1E1E",
}

// Western zodiac lookup by month/day
export function getZodiac(month, day) {
  const m = parseInt(month)
  const d = parseInt(day)
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return { sign: "ARIES",       symbol: "♈", element: "FIRE",  dates: "Mar 21 – Apr 19", trait: "Pioneer. First contact seeker." }
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return { sign: "TAURUS",      symbol: "♉", element: "EARTH", dates: "Apr 20 – May 20", trait: "Ground witness. Physical evidence collector." }
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return { sign: "GEMINI",      symbol: "♊", element: "AIR",   dates: "May 21 – Jun 20", trait: "Signal decoder. Dual-frequency receiver." }
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return { sign: "CANCER",      symbol: "♋", element: "WATER", dates: "Jun 21 – Jul 22", trait: "Deep archive. Memory keeper of encounters." }
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return { sign: "LEO",         symbol: "♌", element: "FIRE",  dates: "Jul 23 – Aug 22", trait: "High-visibility witness. Mass sighting magnet." }
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return { sign: "VIRGO",       symbol: "♍", element: "EARTH", dates: "Aug 23 – Sep 22", trait: "Pattern analyst. Anomaly detector." }
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return { sign: "LIBRA",      symbol: "♎", element: "AIR",   dates: "Sep 23 – Oct 22", trait: "Diplomatic contact. Inter-species mediator." }
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return { sign: "SCORPIO",   symbol: "♏", element: "WATER", dates: "Oct 23 – Nov 21", trait: "Deep investigator. Classified file breaker." }
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return { sign: "SAGITTARIUS", symbol: "♐", element: "FIRE", dates: "Nov 22 – Dec 21", trait: "Cosmic explorer. Beyond-orbit thinker." }
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return { sign: "CAPRICORN",  symbol: "♑", element: "EARTH", dates: "Dec 22 – Jan 19", trait: "Systems architect. Reverse-engineer of craft." }
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return { sign: "AQUARIUS",   symbol: "♒", element: "AIR",   dates: "Jan 20 – Feb 18", trait: "Frequency emitter. Cosmic signal broadcaster." }
  return { sign: "PISCES", symbol: "♓", element: "WATER", dates: "Feb 19 – Mar 20", trait: "Interdimensional traveler. Liminal zone perceiver." }
}

// Get sightings matching a given month-day string "MM-DD"
export function getSightingsByDate(monthDay) {
  return SIGHTINGS.filter(s => s.date === monthDay).sort((a, b) => a.year - b.year)
}
