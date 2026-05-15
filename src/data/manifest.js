const WAR_GOV = "https://www.war.gov/medialink/ufo/release_1/"

export function warGovThumb(filename) {
  const name = filename.toLowerCase().replace(/\s+/g, "-").replace(/\.(pdf|png|jpe?g)$/i, ".jpg")
  return WAR_GOV + "thumbnail/" + name
}

export const AGENCIES = {
  DOW:      { label: "Dept. of War",     color: "#00d4ff", bg: "rgba(0,212,255,0.12)",   icon: "⚔" },
  FBI:      { label: "FBI",              color: "#ff4444", bg: "rgba(255,68,68,0.12)",   icon: "🔍" },
  NASA:     { label: "NASA",             color: "#ffd700", bg: "rgba(255,215,0,0.12)",   icon: "🚀" },
  DOS:      { label: "Dept. of State",   color: "#00ff88", bg: "rgba(0,255,136,0.12)",   icon: "🌐" },
  USAF:     { label: "US Air Force",     color: "#818cf8", bg: "rgba(129,140,248,0.12)", icon: "✈" },
  ARMY:     { label: "US Army",          color: "#a3e635", bg: "rgba(163,230,53,0.12)",  icon: "⭐" },
  VIDEO:    { label: "DOD Video",        color: "#f97316", bg: "rgba(249,115,22,0.12)",  icon: "📹" },
  KHAOKALA: { label: "กลุ่มเขากะลา",    color: "#d4a017", bg: "rgba(212,160,23,0.12)",  icon: "⛰" },
}

export const TYPES = {
  "mission-report":     { label: "Mission Report",          color: "#00d4ff" },
  "range-fouler":       { label: "Range Fouler Debrief",    color: "#fb923c" },
  "email":              { label: "Email Correspondence",    color: "#a78bfa" },
  "photo":              { label: "Photo / Image",           color: "#f472b6" },
  "transcript":         { label: "Crew Transcript",         color: "#ffd700" },
  "cable":              { label: "Diplomatic Cable",        color: "#00ff88" },
  "intelligence":       { label: "Intelligence Record",     color: "#818cf8" },
  "incident-summary":   { label: "Incident Summary",        color: "#ec4899" },
  "press-release":      { label: "Press Release",           color: "#94a3b8" },
  "statement":          { label: "Witness Statement",       color: "#f59e0b" },
  "event-report":       { label: "Event Report",            color: "#10b981" },
  "video":              { label: "UAP Video",               color: "#f97316" },
  "composite-sketch":   { label: "Composite Sketch",        color: "#f472b6" },
  "photo-series":       { label: "Photo Series",            color: "#f472b6" },
  "launch-summary":     { label: "Launch Summary",          color: "#60a5fa" },
  "report":             { label: "Report",                  color: "#94a3b8" },
  "newspaper":          { label: "Press Clipping",          color: "#c084fc" },
  "field-record":       { label: "Field Record",            color: "#d4a017" },
}

export const ERAS = {
  "WWII":      { label: "WWII Era",       range: [1944,1945], color: "#a3e635" },
  "POSTWAR":   { label: "Post-War",       range: [1946,1960], color: "#818cf8" },
  "COLDWAR":   { label: "Cold War",       range: [1961,1979], color: "#a78bfa" },
  "MODERN1":   { label: "Modern I",       range: [1980,2010], color: "#00ff88" },
  "MODERN2":   { label: "Modern II",      range: [2011,2020], color: "#00d4ff" },
  "CURRENT":   { label: "Current",        range: [2021,2026], color: "#ff4444" },
}

export const LOCATIONS = {
  "Arabian Gulf":       { lat: 26,   lng: 52,   region: "Middle East" },
  "Persian Gulf":       { lat: 27,   lng: 51,   region: "Middle East" },
  "Strait of Hormuz":  { lat: 26.5, lng: 56.5, region: "Middle East" },
  "Arabian Sea":        { lat: 20,   lng: 65,   region: "Indian Ocean" },
  "Gulf of Aden":       { lat: 12,   lng: 45,   region: "Indian Ocean" },
  "Djibouti":           { lat: 11.5, lng: 43,   region: "East Africa" },
  "Iraq":               { lat: 33,   lng: 44,   region: "Middle East" },
  "Syria":              { lat: 35,   lng: 38,   region: "Middle East" },
  "Iran":               { lat: 32,   lng: 53,   region: "Middle East" },
  "UAE":                { lat: 24,   lng: 54,   region: "Middle East" },
  "Greece":             { lat: 39,   lng: 22,   region: "Europe" },
  "Mediterranean Sea":  { lat: 35,   lng: 18,   region: "Europe" },
  "Middle East":        { lat: 31,   lng: 46,   region: "Middle East" },
  "East China Sea":     { lat: 30,   lng: 125,  region: "Asia-Pacific" },
  "Japan":              { lat: 35,   lng: 137,  region: "Asia-Pacific" },
  "Pacific":            { lat: 20,   lng: 160,  region: "Pacific" },
  "Papua New Guinea":   { lat: -6,   lng: 147,  region: "Oceania" },
  "Kazakhstan":         { lat: 48,   lng: 68,   region: "Central Asia" },
  "Western US":         { lat: 37,   lng: -105, region: "North America" },
  "Space":              { lat: 0,    lng: 0,    region: "Orbital" },
  "Germany":                { lat: 51,   lng: 10,   region: "Europe" },
  "Unknown":                { lat: 0,    lng: 0,    region: "Unknown" },
  "Nakhon Sawan, Thailand": { lat: 15.7, lng: 100.1, region: "Southeast Asia" },
  "Bangkok, Thailand":      { lat: 13.8, lng: 100.5, region: "Southeast Asia" },
  "Phetchaburi, Thailand":  { lat: 13.1, lng: 99.9,  region: "Southeast Asia" },
  "Sing Buri, Thailand":    { lat: 14.9, lng: 100.4, region: "Southeast Asia" },
  "Thailand":               { lat: 15.0, lng: 100.5, region: "Southeast Asia" },
}

function era(year) {
  if (year <= 1945) return "WWII"
  if (year <= 1960) return "POSTWAR"
  if (year <= 1979) return "COLDWAR"
  if (year <= 2010) return "MODERN1"
  if (year <= 2020) return "MODERN2"
  return "CURRENT"
}

export const DOCUMENTS = [
  // ── DOW MISSION REPORTS ──────────────────────────────────────────────────
  { id:"DOW-D3",  agency:"DOW", type:"mission-report",   year:2020, title:"Mission Report — Arabian Gulf",              location:"Arabian Gulf",      filename:"DOW-UAP-D3-Mission-Report-Arabian-Gulf-2020.pdf",                           size:101111,   redacted:false },
  { id:"DOW-D4",  agency:"DOW", type:"mission-report",   year:2020, title:"Mission Report — Arabian Gulf II",           location:"Arabian Gulf",      filename:"DOW-UAP-D4-Mission-Report-Arabian-Gulf-2020.pdf",                           size:29121,    redacted:false },
  { id:"DOW-D5",  agency:"DOW", type:"mission-report",   year:2020, title:"Mission Report — Arabian Gulf III",          location:"Arabian Gulf",      filename:"DOW-UAP-D5-Mission-Report-Arabian-Gulf-2020.pdf",                           size:30588,    redacted:false },
  { id:"DOW-D6",  agency:"DOW", type:"mission-report",   year:2020, title:"Mission Report — Arabian Gulf IV",           location:"Arabian Gulf",      filename:"DOW-UAP-D6-Mission-Report-Arabian-Gulf-2020.pdf",                           size:26847,    redacted:false },
  { id:"DOW-D7",  agency:"DOW", type:"mission-report",   year:2020, title:"Mission Report — Arabian Gulf V",            location:"Arabian Gulf",      filename:"DOW-UAP-D7-Mission-Report-Arabian-Gulf-2020.pdf",                           size:27337,    redacted:false },
  { id:"DOW-D8",  agency:"DOW", type:"mission-report",   year:2025, title:"Mission Report — Djibouti",                  location:"Djibouti",          filename:"DOW-UAP-D8-Mission-Report-Djibouti-2025.pdf",                               size:29154,    redacted:false },
  { id:"DOW-D10", agency:"DOW", type:"mission-report",   year:2022, title:"Mission Report — Middle East",               location:"Middle East",       filename:"DOW-UAP-D10-Mission-Report-Middle-East-May-2022.pdf",                       size:663290,   redacted:false },
  { id:"DOW-D12", agency:"DOW", type:"mission-report",   year:2022, title:"Mission Report — Iraq I",                    location:"Iraq",              filename:"DOW-UAP-D12-Mission-Report-Iraq-May-2022.pdf",                              size:670302,   redacted:false },
  { id:"DOW-D14", agency:"DOW", type:"mission-report",   year:2022, title:"Mission Report — Iraq II",                   location:"Iraq",              filename:"DOW-UAP-D14-Mission-Report-Iraq-May-2022.pdf",                              size:7463660,  redacted:false },
  { id:"DOW-D16", agency:"DOW", type:"mission-report",   year:2022, title:"Mission Report — Syria I",                   location:"Syria",             filename:"DOW-UAP-D16-Mission-Report-Syria-July-2022.pdf",                            size:6999240,  redacted:false },
  { id:"DOW-D18", agency:"DOW", type:"mission-report",   year:2022, title:"Mission Report — Iraq III",                  location:"Iraq",              filename:"DOW-UAP-D18-Mission-Report-Iraq-December-2022.pdf",                         size:3673697,  redacted:false },
  { id:"DOW-D19", agency:"DOW", type:"mission-report",   year:2023, title:"Mission Report — Syria II",                  location:"Syria",             filename:"DOW-UAP-D19-Mission-Report-Syria-February-21-2023.pdf",                     size:5885305,  redacted:false },
  { id:"DOW-D20", agency:"DOW", type:"mission-report",   year:2023, title:"Mission Report — Iraq IV",                   location:"Iraq",              filename:"DOW-UAP-D20-Mission-Report-Iraq-2023.pdf",                                  size:3698245,  redacted:false },
  { id:"DOW-D23", agency:"DOW", type:"mission-report",   year:2023, title:"Mission Report — UAE I",                     location:"UAE",               filename:"DOW-UAP-D23-Mission-Report-United-Arab-Emirates-October-2023.pdf",          size:1324277,  redacted:false },
  { id:"DOW-D25", agency:"DOW", type:"mission-report",   year:2024, title:"Mission Report — Greece I",                  location:"Greece",            filename:"DOW-UAP-D25-Mission-Report-Greece-January-2024.pdf",                        size:680054,   redacted:false },
  { id:"DOW-D27", agency:"DOW", type:"mission-report",   year:2023, title:"Mission Report — UAE II",                    location:"UAE",               filename:"DOW-UAP-D27-Mission-Report-United-Arab-Emirates-October-2023.pdf",          size:689226,   redacted:false },
  { id:"DOW-D28", agency:"DOW", type:"mission-report",   year:2024, title:"Mission Report — East China Sea",            location:"East China Sea",    filename:"DOW-UAP-D28-Mission-Report-East-China-Sea-2024.pdf",                        size:633172,   redacted:false },
  { id:"DOW-D32", agency:"DOW", type:"mission-report",   year:2024, title:"Mission Report — Syria III",                 location:"Syria",             filename:"DOW-UAP-D32-Mission-Report,-Syria-October-2024.pdf",                        size:651740,   redacted:false },
  { id:"DOW-D33", agency:"DOW", type:"mission-report",   year:2023, title:"Mission Report — Greece II",                 location:"Greece",            filename:"DOW-UAP-D33-Mission-Report-Greece-October-2023.pdf",                        size:897434,   redacted:false },
  { id:"DOW-D35", agency:"DOW", type:"mission-report",   year:2023, title:"Mission Report — Greece III",                location:"Greece",            filename:"DOW-UAP-D35-Mission-Report-Greece-October-2023.pdf",                        size:1415369,  redacted:false },
  { id:"DOW-D48", agency:"DOW", type:"report",           year:1996, title:"Report — September 1996",                    location:"Unknown",           filename:"DOW-UAP-D48-Report-September-1996.pdf",                                     size:22495083, redacted:false },
  { id:"DOW-D49", agency:"DOW", type:"launch-summary",   year:2000, title:"Launch Summary — February 2000",             location:"Unknown",           filename:"DOW-UAP-D49-Launch-Summary-February-2000.pdf",                              size:9090715,  redacted:false },
  { id:"DOW-D54", agency:"DOW", type:"mission-report",   year:null, title:"Mission Report — Mediterranean Sea",         location:"Mediterranean Sea", filename:"DOW-UAP-D54-Mission-Report-Mediterranean-Sea-NA.pdf",                       size:20095,    redacted:false },
  { id:"DOW-D55", agency:"DOW", type:"mission-report",   year:2016, title:"Mission Report — Syria (2016)",              location:"Syria",             filename:"DOW-UAP-D55-Mission-Report-Syria-November-2016.pdf",                        size:207227,   redacted:false },
  { id:"DOW-D57", agency:"DOW", type:"mission-report",   year:2020, title:"Mission Report — Gulf of Aden I",            location:"Gulf of Aden",      filename:"DOW-UAP-D57-Mission-Report-Gulf-of-Aden-September-2020.pdf",               size:295447,   redacted:false },
  { id:"DOW-D60", agency:"DOW", type:"mission-report",   year:2020, title:"Mission Report — Persian Gulf I",            location:"Persian Gulf",      filename:"DOW-UAP-D60-Mission-Report-Persian-Gulf-August-2020.pdf",                   size:2412310,  redacted:false },
  { id:"DOW-D61", agency:"DOW", type:"mission-report",   year:2020, title:"Mission Report — Persian Gulf II",           location:"Persian Gulf",      filename:"DOW-UAP-D61-Mission-Report-Persian-Gulf-August-2020.pdf",                   size:877324,   redacted:false },
  { id:"DOW-D62", agency:"DOW", type:"mission-report",   year:2020, title:"Mission Report — Strait of Hormuz I",        location:"Strait of Hormuz",  filename:"DOW-UAP-D62-Mission-Report-Strait-of-Hormuz-September-2020.pdf",           size:1045437,  redacted:false },
  { id:"DOW-D63", agency:"DOW", type:"mission-report",   year:2020, title:"Mission Report — Strait of Hormuz II",       location:"Strait of Hormuz",  filename:"DOW-UAP-D63-Mission-Report-Strait-of-Hormuz-October-2020.pdf",             size:3311583,  redacted:false },
  { id:"DOW-D64", agency:"DOW", type:"mission-report",   year:2020, title:"Mission Report — Iran",                      location:"Iran",              filename:"DOW-UAP-D64-Mission-Report-Iran-November-2020.pdf",                         size:860506,   redacted:false },
  { id:"DOW-D65", agency:"DOW", type:"mission-report",   year:2020, title:"Mission Report — Persian Gulf III",          location:"Persian Gulf",      filename:"DOW-UAP-D65-Mission-Report-Persian-Gulf-July-2020.pdf",                     size:3043075,  redacted:false },
  { id:"DOW-D74", agency:"DOW", type:"mission-report",   year:2023, title:"Mission Report — Syria IV",                  location:"Syria",             filename:"DOW-UAP-D74-Mission-Report-Syria-November-2023.pdf",                        size:719044,   redacted:false },
  { id:"DOW-D75", agency:"DOW", type:"mission-report",   year:2024, title:"Mission Report — Gulf of Aden II",           location:"Gulf of Aden",      filename:"DOW-UAP-D75-Mission-Report-Gulf-of-Aden-July-2024.pdf",                     size:792150,   redacted:false },
  // DOW Range Fouler Debriefs
  { id:"DOW-D38", agency:"DOW", type:"range-fouler",     year:2020, title:"Range Fouler Debrief — Middle East",         location:"Middle East",       filename:"DOW-UAP-D38-Range-Fouler-Debrief-Middle-East-May-2020.pdf",                size:342668,   redacted:false },
  { id:"DOW-D42", agency:"DOW", type:"range-fouler",     year:2023, title:"Range Fouler Debrief — Japan",               location:"Japan",             filename:"DOW-UAP-D42-Range-Fouler-Debrief-Japan-2023.pdf",                          size:295621,   redacted:false },
  { id:"DOW-D44", agency:"DOW", type:"range-fouler",     year:2020, title:"Range Fouler Debrief — Arabian Sea I",       location:"Arabian Sea",       filename:"DOW-UAP-D44-Range-Fouler-Arabian-Sea-October-2020.pdf",                    size:297873,   redacted:false },
  { id:"DOW-D56", agency:"DOW", type:"range-fouler",     year:2020, title:"Range Fouler Debrief — Arabian Sea II",      location:"Arabian Sea",       filename:"DOW-UAP-D56-Range-Fouler-Debrief-Arabian-Sea-August-2020.pdf",             size:1849972,  redacted:false },
  { id:"DOW-D58", agency:"DOW", type:"range-fouler",     year:2020, title:"Range Fouler Debrief — NA",                  location:"Unknown",           filename:"DOW-UAP-D58-Range-Fouler-Debrief-NA-October-2020.pdf",                     size:301419,   redacted:false },
  // DOW Email Correspondence
  { id:"DOW-D50", agency:"DOW", type:"email",            year:2025, title:"Email — INDOPACOM April 2025",               location:"Pacific",           filename:"DOW-UAP-D50-Email-Correspondence-INDOPACOM-April-2025.pdf",                size:312451,   redacted:false },
  { id:"DOW-D51", agency:"DOW", type:"email",            year:2023, title:"Email — Pacific Time Zone",                  location:"Pacific",           filename:"DOW-UAP-D51-Email-Correspondence-Pacific-Time-Zone-March-2023.pdf",         size:76470,    redacted:false },
  { id:"DOW-D52", agency:"DOW", type:"email",            year:2024, title:"Email — NA August 2024",                     location:"Unknown",           filename:"DOW-UAP-D52-Email-Correspondance-NA-August-2024.pdf",                       size:66874,    redacted:false },
  // DOW Press Release
  { id:"DOW-PR20", agency:"DOW", type:"press-release",   year:null, title:"Press Release",                              location:"Unknown",           filename:"DOW-UAP-PR20.pdf",                                                          size:2297146,  redacted:false },
  // ── FBI ───────────────────────────────────────────────────────────────────
  { id:"FBI-SKETCH", agency:"FBI", type:"composite-sketch", year:2024, title:"Composite Sketch",                        location:"Unknown",           filename:"2024-04-30-Composite-Sketch.pdf",                                           size:112045,   redacted:false },
  { id:"FBI-A1",  agency:"FBI", type:"photo",            year:null, title:"Photo A-1",                                  location:"Unknown",           filename:"FBI-Photo-A1.png",                                                          size:94513,    redacted:false },
  { id:"FBI-A2",  agency:"FBI", type:"photo",            year:null, title:"Photo A-2",                                  location:"Unknown",           filename:"FBI-Photo-A2.png",                                                          size:98192,    redacted:false },
  { id:"FBI-A3",  agency:"FBI", type:"photo",            year:null, title:"Photo A-3",                                  location:"Unknown",           filename:"FBI-Photo-A3.png",                                                          size:94807,    redacted:false },
  { id:"FBI-A4",  agency:"FBI", type:"photo",            year:null, title:"Photo A-4",                                  location:"Unknown",           filename:"FBI-Photo-A4.png",                                                          size:96879,    redacted:false },
  { id:"FBI-A5",  agency:"FBI", type:"photo",            year:null, title:"Photo A-5",                                  location:"Unknown",           filename:"FBI-Photo-A5.png",                                                          size:89225,    redacted:false },
  { id:"FBI-A6",  agency:"FBI", type:"photo",            year:null, title:"Photo A-6",                                  location:"Unknown",           filename:"FBI-Photo-A6.png",                                                          size:80159,    redacted:false },
  { id:"FBI-A7",  agency:"FBI", type:"photo",            year:null, title:"Photo A-7",                                  location:"Unknown",           filename:"FBI-Photo-A7.png",                                                          size:88727,    redacted:false },
  { id:"FBI-A8",  agency:"FBI", type:"photo",            year:null, title:"Photo A-8",                                  location:"Unknown",           filename:"FBI-Photo-A8.png",                                                          size:87292,    redacted:false },
  ...Array.from({length:24}, (_,i) => ({
    id: `FBI-B${i+1}`, agency:"FBI", type:"photo-series", year:null,
    title: `Photo B-${i+1}`, location:"Unknown",
    filename: `FBI-Photo-B${i+1}.pdf`, size: 80000 + Math.floor(Math.random()*100000),
    redacted:false
  })),
  // ── NASA ──────────────────────────────────────────────────────────────────
  { id:"NASA-D1",  agency:"NASA", type:"transcript",     year:1969, title:"Apollo 12 Transcript",                       location:"Space",             filename:"NASA-UAP-D1-Apollo-12-Transcript-1969.pdf",                                 size:1052877,  redacted:false },
  { id:"NASA-D2",  agency:"NASA", type:"transcript",     year:1972, title:"Apollo 17 Transcript",                       location:"Space",             filename:"NASA-UAP-D2-Apollo-17-Transcript-1972.pdf",                                 size:643401,   redacted:false },
  { id:"NASA-D4",  agency:"NASA", type:"transcript",     year:1969, title:"Apollo 11 Technical Crew Debriefing",        location:"Space",             filename:"NASA-UAP-D4-Apollo-11-Technical-Crew-Debriefing-1969.pdf",                  size:29286242, redacted:false },
  { id:"NASA-D5",  agency:"NASA", type:"transcript",     year:1973, title:"Apollo 17 Science Crew Debriefing",          location:"Space",             filename:"NASA-UAP-D5-Apollo-17-Crew-Debriefing-for-Science-1973.pdf",               size:122499,   redacted:false },
  { id:"NASA-D6",  agency:"NASA", type:"transcript",     year:1973, title:"Apollo 17 Technical Crew Debriefing",        location:"Space",             filename:"NASA-UAP-D6-Apollo-17-Technical-Crew-Debriefing-1973.pdf",                  size:513402,   redacted:false },
  { id:"NASA-D7",  agency:"NASA", type:"transcript",     year:1973, title:"Skylab Technical Crew Debriefing",           location:"Space",             filename:"NASA-UAP-D7-Skylab-Technical-Crew-Debriefing-1973.pdf",                     size:301657,   redacted:false },
  { id:"NASA-VM1", agency:"NASA", type:"photo",          year:1969, title:"Apollo 12 Photo I",                          location:"Space",             filename:"NASA-UAP-VM1-Apollo-12-1969.jpg",                                           size:2526206,  redacted:false },
  { id:"NASA-VM2", agency:"NASA", type:"photo",          year:1969, title:"Apollo 12 Photo II",                         location:"Space",             filename:"NASA-UAP-VM2-Apollo-12-1969.jpg",                                           size:2630734,  redacted:false },
  { id:"NASA-VM3", agency:"NASA", type:"photo",          year:1969, title:"Apollo 12 Photo III",                        location:"Space",             filename:"NASA-UAP-VM3-Apollo-12-1969.jpg",                                           size:2534744,  redacted:false },
  { id:"NASA-VM4", agency:"NASA", type:"photo",          year:1969, title:"Apollo 12 Photo IV",                         location:"Space",             filename:"NASA-UAP-VM4-Apollo-12-1969.jpg",                                           size:2444608,  redacted:false },
  { id:"NASA-VM5", agency:"NASA", type:"photo",          year:1969, title:"Apollo 12 Photo V",                          location:"Space",             filename:"NASA-UAP-VM5-Apollo-12-1969.jpg",                                           size:2590279,  redacted:false },
  { id:"NASA-VM6", agency:"NASA", type:"photo",          year:1972, title:"Apollo 17 Photo",                            location:"Space",             filename:"NASA-UAP-VM6-Apollo-17-1972.jpg",                                           size:1778754,  redacted:false },
  // ── DOS ───────────────────────────────────────────────────────────────────
  { id:"DOS-D1",  agency:"DOS", type:"cable",            year:1985, title:"Diplomatic Cable — Papua New Guinea",        location:"Papua New Guinea",  filename:"DOS-UAP-D1-Cable-1-Papua-New-Guinea-January-1985.pdf",                     size:306604,   redacted:false },
  { id:"DOS-D2",  agency:"DOS", type:"cable",            year:1994, title:"Diplomatic Cable — Kazakhstan",              location:"Kazakhstan",        filename:"DOS-UAP-D2-Cable-2-Kazakhstan-January-1994.pdf",                            size:382367,   redacted:false },
  // ── USAF / PROJECT BLUE BOOK ─────────────────────────────────────────────
  { id:"059-11",  agency:"USAF", type:"intelligence",    year:null, title:"059UAP — Record 11",                         location:"Unknown",           filename:"059UAP00011.pdf",                                                           size:825714,   redacted:false },
  { id:"059-12",  agency:"USAF", type:"intelligence",    year:null, title:"059UAP — Record 12",                         location:"Unknown",           filename:"059UAP00012.pdf",                                                           size:654734,   redacted:false },
  { id:"059-13",  agency:"USAF", type:"intelligence",    year:null, title:"059UAP — Record 13",                         location:"Unknown",           filename:"059UAP00013.pdf",                                                           size:1208817,  redacted:false },
  { id:"USAF-59A", agency:"USAF", type:"intelligence",   year:1963, title:"SP-16 Report [1963]",                        location:"Unknown",           filename:"59_214434_SP_16_[7.18.1963].pdf",                                           size:1169464,  redacted:false },
  { id:"USAF-59B", agency:"USAF", type:"intelligence",   year:null, title:"711.5612 Record",                            location:"Unknown",           filename:"59_64634_711.5612[7-2852.pdf",                                              size:898369,   redacted:false },
  { id:"USAF-INC-1-100",   agency:"USAF", type:"incident-summary", year:null, title:"Incident Summaries 1–100",         location:"Unknown",           filename:"38_143685_box7_Incident_Summaries_1-100.pdf",                              size:32675506, redacted:false },
  { id:"USAF-INC-101-172", agency:"USAF", type:"incident-summary", year:null, title:"Incident Summaries 101–172",       location:"Unknown",           filename:"38_143685_box7_Incident_Summaries_101-172.pdf",                            size:28550135, redacted:false },
  { id:"USAF-INC-173-233", agency:"USAF", type:"incident-summary", year:null, title:"Incident Summaries 173–233",       location:"Unknown",           filename:"38_143685_box7_Incident_Summaries_173-233.pdf",                            size:161362330,redacted:false },
  // ── ARMY / HISTORICAL ────────────────────────────────────────────────────
  { id:"ARMY-GEN-1946", agency:"ARMY", type:"intelligence", year:1946, title:"General Records 1946–47 Vol. 2",          location:"Unknown",           filename:"18_100754_ General 1946-7_Vol_2.pdf",                                       size:4838247,  redacted:false },
  { id:"ARMY-GEN-1948", agency:"ARMY", type:"intelligence", year:1948, title:"General Records 1948 Vol. 1",             location:"Unknown",           filename:"18_6369445_General_1948_Vol_1.pdf",                                         size:4740807,  redacted:false },
  { id:"ARMY-GER-1944", agency:"ARMY", type:"intelligence", year:1944, title:"German Armament Documents 1944–45",       location:"Germany",           filename:"331_120752_Numeric_Files_1944ΓÇô1945_37153_German_Armament_Equipment_Documents.pdf", size:3232255, redacted:false },
  { id:"ARMY-INT-1948", agency:"ARMY", type:"intelligence", year:1948, title:"Intelligence Collection Records 1948–55", location:"Unknown",           filename:"341_110448_Records_Relating_to_the_Collection_and_Dissemination_of_Intelligence_1948-1955-TS_CONT_No.2_2-5300-2-5399.pdf", size:3167015, redacted:false },
  { id:"ARMY-NUM",      agency:"ARMY", type:"intelligence", year:null, title:"Numerical File 5-2500",                   location:"Unknown",           filename:"341_110677_Numerical_File_5-2500.pdf",                                      size:8092245,  redacted:false },
  { id:"ARMY-DISC-1949",agency:"ARMY", type:"intelligence", year:1949, title:"Flying Discs 1949",                       location:"Unknown",           filename:"342_HS1-416511228_box186_319.1-Flying-Discs-1949.pdf",                      size:71924623, redacted:false },
  // FBI Records 62-HQ-83894 series
  { id:"FBI-62HQ-1",  agency:"FBI", type:"intelligence",  year:null, title:"62-HQ-83894 Section 1",                    location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Section_1.pdf",                                size:30436722, redacted:false },
  { id:"FBI-62HQ-2",  agency:"FBI", type:"intelligence",  year:null, title:"62-HQ-83894 Section 2",                    location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Section_2.pdf",                                size:33449155, redacted:false },
  { id:"FBI-62HQ-3",  agency:"FBI", type:"intelligence",  year:null, title:"62-HQ-83894 Section 3",                    location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Section_3.pdf",                                size:35533010, redacted:false },
  { id:"FBI-62HQ-4",  agency:"FBI", type:"intelligence",  year:null, title:"62-HQ-83894 Section 4",                    location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Section_4.pdf",                                size:37916413, redacted:false },
  { id:"FBI-62HQ-5",  agency:"FBI", type:"intelligence",  year:null, title:"62-HQ-83894 Section 5",                    location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Section_5.pdf",                                size:36260149, redacted:false },
  { id:"FBI-62HQ-6",  agency:"FBI", type:"intelligence",  year:null, title:"62-HQ-83894 Section 6",                    location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Section_6.pdf",                                size:60929949, redacted:false },
  { id:"FBI-62HQ-7",  agency:"FBI", type:"intelligence",  year:null, title:"62-HQ-83894 Section 7",                    location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Section_7.pdf",                                size:39389073, redacted:false },
  { id:"FBI-62HQ-8",  agency:"FBI", type:"intelligence",  year:null, title:"62-HQ-83894 Section 8",                    location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Section_8.pdf",                                size:255526310,redacted:false },
  { id:"FBI-62HQ-9",  agency:"FBI", type:"intelligence",  year:null, title:"62-HQ-83894 Section 9",                    location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Section_9.pdf",                                size:52058639, redacted:false },
  { id:"FBI-62HQ-10", agency:"FBI", type:"intelligence",  year:null, title:"62-HQ-83894 Section 10",                   location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Section_10.pdf",                               size:58141207, redacted:false },
  { id:"FBI-62HQ-S130",agency:"FBI",type:"intelligence",  year:null, title:"62-HQ-83894 Serial 130",                   location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Serial_130.pdf",                               size:21525036, redacted:false },
  { id:"FBI-62HQ-S153",agency:"FBI",type:"intelligence",  year:null, title:"62-HQ-83894 Serial 153",                   location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Serial_153.pdf",                               size:1082077,  redacted:false },
  { id:"FBI-62HQ-S164",agency:"FBI",type:"intelligence",  year:null, title:"62-HQ-83894 Serial 164",                   location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Serial_164.pdf",                               size:22734336, redacted:false },
  { id:"FBI-62HQ-S220",agency:"FBI",type:"intelligence",  year:null, title:"62-HQ-83894 Serial 220",                   location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Serial_220.pdf",                               size:3208280,  redacted:false },
  { id:"FBI-62HQ-S403",agency:"FBI",type:"intelligence",  year:null, title:"62-HQ-83894 Serial 403",                   location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Serial_403.pdf",                               size:890862,   redacted:false },
  { id:"FBI-62HQ-S438",agency:"FBI",type:"intelligence",  year:null, title:"62-HQ-83894 Serial 438",                   location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Serial_438.pdf",                               size:7579278,  redacted:false },
  { id:"FBI-62HQ-S449",agency:"FBI",type:"intelligence",  year:null, title:"62-HQ-83894 Serial 449",                   location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_Serial_449.pdf",                               size:6900861,  redacted:false },
  { id:"FBI-62HQ-SA",  agency:"FBI",type:"intelligence",  year:null, title:"62-HQ-83894 Sub A",                        location:"Unknown",           filename:"65_HS1-834228961_62-HQ-83894_SUB_A.pdf",                                    size:35851631, redacted:false },
  { id:"FBI-65A",     agency:"FBI", type:"intelligence",  year:null, title:"100-DE-18221 Serial 844",                  location:"Unknown",           filename:"65_HS1-101634279_100-DE-18221_Serial_844.pdf",                              size:265783,   redacted:false },
  { id:"FBI-65B",     agency:"FBI", type:"intelligence",  year:null, title:"100-DE-26505",                             location:"Unknown",           filename:"65_HS1-101634279_100-DE-26505.pdf",                                          size:5326217,  redacted:false },
  // Redacted serials
  { id:"SERIAL-3",   agency:"USAF", type:"intelligence",  year:null, title:"Serial 3 [REDACTED]",                      location:"Unknown",           filename:"Serial-3_Redacted.pdf",                                                     size:468817,   redacted:true  },
  { id:"SERIAL-4",   agency:"USAF", type:"intelligence",  year:null, title:"Serial 4 [REDACTED]",                      location:"Unknown",           filename:"Serial-4-Redacted_Redacted.pdf",                                            size:237155,   redacted:true  },
  { id:"SERIAL-5",   agency:"USAF", type:"intelligence",  year:null, title:"Serial 5 [REDACTED]",                      location:"Unknown",           filename:"Serial 5 Redacted_Redacted.pdf",                                            size:227126,   redacted:true  },
  // USPER
  { id:"USPER-1",    agency:"DOW",  type:"statement",     year:null, title:"USPER Witness Statement [REDACTED]",        location:"Unknown",           filename:"USPER-Statement-Redacted.pdf",                                              size:786861,   redacted:true  },
  // Western US Event
  { id:"EVENT-WUS", agency:"DOW",  type:"event-report",   year:2026, title:"Western US Event — May 2026",              location:"Western US",        filename:"Western_US_Event_Slides_5.08.2026.pdf",                                     size:63768,    redacted:false },
  // 255 series
  { id:"UFO-DEFENSE", agency:"USAF", type:"intelligence",  year:null, title:"UFOs and Defense — What Should We Prepare For?", location:"Unknown",  filename:"255_413270_UFO's_and_Defense_What_Should_we_Prepare_For.pdf",               size:24581224, redacted:false },
  { id:"255-T763",    agency:"USAF", type:"transcript",    year:null, title:"T-763 R1B Transcripts",                   location:"Unknown",           filename:"255_t_763_r1b_transcripts.pdf",                                             size:277579,   redacted:false },

  // ── กลุ่มเขากะลา (KHAO KALA GROUP) — Thailand, 1997–2006 ──────────────────
  // Data source: กลุ่มเขากะลา archive
  { id:"KK-001", agency:"KHAOKALA", type:"newspaper",    year:1998, title:"Press Report — Khao Kala Extraterrestrial Research Coverage",                   location:"Thailand",               filename:"692675231_1899485290905929_8365544817885178900_n.jpg",   size:53681,  redacted:false },
  { id:"KK-002", agency:"KHAOKALA", type:"photo",        year:1999, title:"VHS Capture — Dual Luminous Orbs, Nighttime Observation",                       location:"Nakhon Sawan, Thailand", filename:"692771799_2175292566624671_444255866404391107_n.jpg",    size:75226,  redacted:false },
  { id:"KK-003", agency:"KHAOKALA", type:"newspaper",    year:1998, title:"Thai Post X-Cite — UAP Phenomena at Khao Kala Feature",                         location:"Thailand",               filename:"692934784_2019662342259366_5915090239785797656_n.jpg",   size:61199,  redacted:false },
  { id:"KK-004", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Study Session — Group Members Reviewing Research Materials",                    location:"Thailand",               filename:"693149882_3884634888508535_1349184908148412110_n.jpg",   size:25744,  redacted:false },
  { id:"KK-005", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Public Exposition — Khao Kala Exhibition Booth at Science Fair (I)",            location:"Bangkok, Thailand",      filename:"693235407_1740746450771744_8618462825823939862_n.jpg",   size:72756,  redacted:false },
  { id:"KK-006", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Public Exposition — Khao Kala Exhibition Booth at Science Fair (II)",           location:"Bangkok, Thailand",      filename:"693235407_1978659942751809_7452299578842819881_n.jpg",   size:29713,  redacted:false },
  { id:"KK-007", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Field Record — Group Members at Khao Kala Hillside Site",                       location:"Nakhon Sawan, Thailand", filename:"693312887_2084624728753883_7373379893979486381_n.jpg",   size:71301,  redacted:false },
  { id:"KK-008", agency:"KHAOKALA", type:"photo-series", year:1997, title:"Ceremony Record — Nighttime Gathering at Khao Kala, December 1997 (I)",         location:"Nakhon Sawan, Thailand", filename:"693342073_4261316784119828_6585101650033077225_n.jpg",   size:72264,  redacted:false },
  { id:"KK-009", agency:"KHAOKALA", type:"photo-series", year:1997, title:"Ceremony Record — Nighttime Gathering at Khao Kala, December 1997 (II)",        location:"Nakhon Sawan, Thailand", filename:"693342073_997871799344157_719658364275379783_n.jpg",    size:75209,  redacted:false },
  { id:"KK-010", agency:"KHAOKALA", type:"photo-series", year:1997, title:"Public Event — Group Activity at Ramkhamhaeng University Campus",               location:"Bangkok, Thailand",      filename:"693380080_1329213152732382_2245028370912988298_n.jpg",   size:63320,  redacted:false },
  { id:"KK-011", agency:"KHAOKALA", type:"newspaper",    year:1998, title:"Press Report — Aerial Sighting Events Documented by Research Group",            location:"Thailand",               filename:"694260167_1214305147296885_1256785342991736189_n.jpg",   size:68000,  redacted:false },
  { id:"KK-012", agency:"KHAOKALA", type:"photo",        year:1999, title:"VHS Capture — Luminous Spherical Object, Nighttime Sky",                        location:"Nakhon Sawan, Thailand", filename:"694271987_1332579568750735_8550931819846070819_n.jpg",   size:75157,  redacted:false },
  { id:"KK-013", agency:"KHAOKALA", type:"photo",        year:1999, title:"VHS Frame — Glowing Orb with Luminous Rings, Feb 14 1999",                      location:"Nakhon Sawan, Thailand", filename:"694272555_1354057583202284_7261769275923036782_n.jpg",   size:71794,  redacted:false },
  { id:"KK-014", agency:"KHAOKALA", type:"photo",        year:1999, title:"VHS Frame — Close Detail of Aerial Light Phenomenon, Feb 14 1999",              location:"Nakhon Sawan, Thailand", filename:"694272555_899019209810302_3940265113159046914_n.jpg",    size:19477,  redacted:false },
  { id:"KK-015", agency:"KHAOKALA", type:"photo",        year:1999, title:"VHS Frame — Glowing Spherical Object, Nighttime Capture, Feb 14 1999",         location:"Nakhon Sawan, Thailand", filename:"694272555_960998180165233_6761923607814187043_n.jpg",    size:65481,  redacted:false },
  { id:"KK-016", agency:"KHAOKALA", type:"photo-series", year:1999, title:"Field Visit — British Journalist Documents UAP Footage with Group (I)",         location:"Nakhon Sawan, Thailand", filename:"694282823_1376874530904734_9201274840378463818_n.jpg",   size:76897,  redacted:false },
  { id:"KK-017", agency:"KHAOKALA", type:"photo-series", year:1999, title:"Field Visit — British Journalist Documents UAP Footage with Group (II)",        location:"Nakhon Sawan, Thailand", filename:"694282823_824772714039586_1751734434265626633_n.jpg",    size:60009,  redacted:false },
  { id:"KK-018", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Media Coverage — Research Featured on Channel 7 Maya Com Broadcast",            location:"Thailand",               filename:"694295818_1420838850084313_7951108991630557487_n.jpg",   size:74889,  redacted:false },
  { id:"KK-019", agency:"KHAOKALA", type:"photo-series", year:1997, title:"Public Gathering — Large Crowd Event in Sing Buri Province",                    location:"Sing Buri, Thailand",    filename:"694325703_26647641728254400_5203717281171519755_n.jpg",  size:65394,  redacted:false },
  { id:"KK-020", agency:"KHAOKALA", type:"photo-series", year:1997, title:"Night Observation — Public Crowd Gathered at Khao Kala Research Site",          location:"Nakhon Sawan, Thailand", filename:"694459227_1302914848606200_6748506105795607269_n.jpg",   size:63069,  redacted:false },
  { id:"KK-021", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Exposition Booth — UAP Research Photographs and Materials on Public Display",   location:"Bangkok, Thailand",      filename:"694523388_2022182531754333_426055449217390302_n.jpg",    size:72382,  redacted:false },
  { id:"KK-022", agency:"KHAOKALA", type:"photo",        year:1998, title:"UAP Photograph No. 4 — Aerial Object with Pyramid-Cloud Formation",             location:"Nakhon Sawan, Thailand", filename:"694661855_1618364879464239_825542304520756693_n.jpg",    size:147314, redacted:false },
  { id:"KK-023", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Field Record — Group Members at Research and Observation Location",             location:"Thailand",               filename:"694703495_1523247202659760_8538381616145089395_n.jpg",   size:59301,  redacted:false },
  { id:"KK-024", agency:"KHAOKALA", type:"newspaper",    year:1998, title:"Press Report — Research Group Investigation Methods and Activities",             location:"Thailand",               filename:"694789777_27119175317720767_929946769777528004_n.jpg",   size:95432,  redacted:false },
  { id:"KK-025", agency:"KHAOKALA", type:"photo",        year:1999, title:"VHS Capture — Nighttime Aerial Phenomenon, Documentation Series",               location:"Nakhon Sawan, Thailand", filename:"695178987_2469510820180132_5207040698879383901_n.jpg",   size:47869,  redacted:false },
  { id:"KK-026", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Public Gathering — Large Crowd Assembled at Hillside Research Site",            location:"Nakhon Sawan, Thailand", filename:"695199184_1672446563895411_7912159042701023561_n.jpg",   size:60689,  redacted:false },
  { id:"KK-027", agency:"KHAOKALA", type:"newspaper",    year:1998, title:"Press Report — UAP Research Activities and Public Events Coverage",             location:"Thailand",               filename:"695349672_1961431617825028_5532835242037079568_n.jpg",   size:58122,  redacted:false },
  { id:"KK-028", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Research Meeting — Group Members Reviewing Field Documentation",                location:"Thailand",               filename:"695421168_2786978405018603_3490521724974027110_n.jpg",   size:63055,  redacted:false },
  { id:"KK-029", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Outdoor Event — Public Assembly at Open-Air Gathering Site",                    location:"Thailand",               filename:"695524811_981321324632588_6095231966340721775_n.jpg",    size:40240,  redacted:false },
  { id:"KK-030", agency:"KHAOKALA", type:"photo",        year:1999, title:"VHS Capture — Aerial Light Phenomenon, Nighttime Observation Series",           location:"Nakhon Sawan, Thailand", filename:"695572520_4297407973848085_318661372664250385_n.jpg",    size:67892,  redacted:false },
  { id:"KK-031", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Media Record — Group Research Covered by Television Broadcast",                 location:"Thailand",               filename:"695668332_1534352768315602_379272759668713100_n.jpg",    size:94130,  redacted:false },
  { id:"KK-032", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Archive Record — Documentation from Group Exhibition Activities",               location:"Thailand",               filename:"696135466_2153131712141980_5973413961412290451_n.jpg",   size:15903,  redacted:false },
  { id:"KK-033", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Field Record — Group Research and Observation Activity",                        location:"Nakhon Sawan, Thailand", filename:"696138933_1344198444426969_4518480405874935259_n.jpg",   size:64483,  redacted:false },
  { id:"KK-034", agency:"KHAOKALA", type:"newspaper",    year:1998, title:"Press Report — UAP Findings and Research Group Activities",                     location:"Thailand",               filename:"696195642_1893377797987294_9202946344411109348_n.jpg",   size:70757,  redacted:false },
  { id:"KK-035", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Exposition Display — Convention Booth with UAP Research Materials",             location:"Bangkok, Thailand",      filename:"696208502_1314648160622990_6738733750303258943_n.jpg",   size:62774,  redacted:false },
  { id:"KK-036", agency:"KHAOKALA", type:"photo",        year:1999, title:"VHS Capture — Aerial Light Object, Nighttime Documentation",                    location:"Nakhon Sawan, Thailand", filename:"696211137_1735802344250547_3179896723273339336_n.jpg",   size:68517,  redacted:false },
  { id:"KK-037", agency:"KHAOKALA", type:"photo",        year:1999, title:"VHS Frame — Luminous Aerial Object, Night Observation Session",                 location:"Nakhon Sawan, Thailand", filename:"696224492_1305058351080535_8368885262140436434_n.jpg",   size:59933,  redacted:false },
  { id:"KK-038", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Group Activity Record — Members Gathered for Meeting or Event",                 location:"Thailand",               filename:"696242954_1335213868511977_4676770394952541965_n.jpg",   size:22003,  redacted:false },
  { id:"KK-039", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Field Documentation — Group Members at Research or Observation Site",           location:"Nakhon Sawan, Thailand", filename:"696259853_1049859731057683_671525396183651104_n.jpg",   size:74639,  redacted:false },
  { id:"KK-040", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Archive Photograph — Historical Documentation of Group Activities",             location:"Thailand",               filename:"696263511_1657834115512293_5834746708010756349_n.jpg",   size:59123,  redacted:false },
  { id:"KK-041", agency:"KHAOKALA", type:"newspaper",    year:1998, title:"Headline — Khao Kala Proves Extraterrestrial Contact",                          location:"Thailand",               filename:"696326365_840416468613657_7197496760945182039_n.jpg",    size:49756,  redacted:false },
  { id:"KK-042", agency:"KHAOKALA", type:"photo-series", year:1999, title:"Field Visit — Kuan Im Bodhisattva Park, Phetchaburi, June 7 1999",              location:"Phetchaburi, Thailand",  filename:"696356292_1307252917401880_6124679922592114862_n.jpg",   size:89617,  redacted:false },
  { id:"KK-043", agency:"KHAOKALA", type:"photo-series", year:1997, title:"Convention Record — 2nd International Psychic Science Convention, Dec 1997",    location:"Bangkok, Thailand",      filename:"696456822_1991383938439522_6697451398779294239_n.jpg",   size:50412,  redacted:false },
  { id:"KK-044", agency:"KHAOKALA", type:"photo",        year:1999, title:"VHS Frame 23:10 — Large Luminous Disc with Concentric Rings, Feb 14 1999",      location:"Nakhon Sawan, Thailand", filename:"696511258_1764157658073689_2500390792683496010_n.jpg",   size:36919,  redacted:false },
  { id:"KK-045", agency:"KHAOKALA", type:"photo-series", year:1997, title:"Site Documentation — Khao Kala Mountain and Meditation Station Overview",       location:"Nakhon Sawan, Thailand", filename:"699240599_1600149551071979_3144629009180025125_n.jpg",   size:78552,  redacted:false },
  { id:"KK-046", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Anniversary Ceremony — Buddhist Ritual and First-Year Gathering at Khao Kala", location:"Nakhon Sawan, Thailand", filename:"699374338_2044404296493390_3729614853904835494_n.jpg",   size:87064,  redacted:false },
  { id:"KK-047", agency:"KHAOKALA", type:"photo",        year:1999, title:"VHS Frame 22:38 — Two Luminous Orbs Side by Side, Feb 14 1999",                 location:"Nakhon Sawan, Thailand", filename:"699478742_2794513084237688_4738425761045371067_n.jpg",   size:19003,  redacted:false },
  { id:"KK-048", agency:"KHAOKALA", type:"photo",        year:1999, title:"VHS Frame 22:38 — Single Luminous Sphere with Crowd Silhouettes, Feb 14 1999", location:"Nakhon Sawan, Thailand", filename:"699684967_2869715376698688_2240276951899400977_n.jpg",   size:29743,  redacted:false },
  { id:"KK-049", agency:"KHAOKALA", type:"photo-series", year:1997, title:"Public Event — Crowd Raises Hands Skyward to Welcome Aircraft, Dec 14 1997",   location:"Thailand",               filename:"699777772_1305396954250261_6697868997612465702_n.jpg",   size:63772,  redacted:false },
  { id:"KK-050", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Anniversary Event — Buddhist Ceremony and First Annual Gathering, May 17 1998", location:"Nakhon Sawan, Thailand", filename:"700063026_998724825992009_8441817170511408259_n.jpg",    size:84583,  redacted:false },
  { id:"KK-051", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Exposition Prep — Information Boards with Extraterrestrial Contact Materials",   location:"Thailand",               filename:"700069767_1288835200109957_1585925068932980615_n.jpg",   size:69491,  redacted:false },
  { id:"KK-052", agency:"KHAOKALA", type:"photo-series", year:2000, title:"Exhibition Record — Dr. Thepphanom Presents UAP Photographs to Visitors",       location:"Thailand",               filename:"700091550_983164401347511_186225639597542410_n.jpg",    size:78164,  redacted:false },
  { id:"KK-053", agency:"KHAOKALA", type:"photo-series", year:1997, title:"Ceremony Record — Group Meditation Gesture to Signal Extraterrestrial Contact",  location:"Nakhon Sawan, Thailand", filename:"700101822_794588563587873_2854905880637747858_n.jpg",   size:69579,  redacted:false },
  { id:"KK-054", agency:"KHAOKALA", type:"photo-series", year:2006, title:"Exposition 2006 — Visitors at Khao Kala Research Exhibition Booth",             location:"Thailand",               filename:"700154422_983166077413443_766784977924429602_n.jpg",    size:78550,  redacted:false },
  { id:"KK-055", agency:"KHAOKALA", type:"photo-series", year:1997, title:"Convention Lecture — Aura Energy Presentation, Ramkhamhaeng Univ., Dec 13 1997", location:"Bangkok, Thailand",     filename:"700266356_1130877076267495_2766172438648513023_n.jpg",  size:66431,  redacted:false },
  { id:"KK-056", agency:"KHAOKALA", type:"photo-series", year:1998, title:"Field Documentation — Practitioners Traveling to Ceremony Site in Phetchaburi",  location:"Phetchaburi, Thailand",  filename:"700471732_2765000073862757_5148354855881622894_n.jpg",   size:70158,  redacted:false },
  { id:"KK-057", agency:"KHAOKALA", type:"photo-series", year:1999, title:"UAP Model — Saucer-Shaped Craft Display at Kuan Im Park, Phetchaburi",           location:"Phetchaburi, Thailand",  filename:"700529692_1686940389051126_6394925251435708041_n.jpg",   size:102605, redacted:false },
  { id:"KK-058", agency:"KHAOKALA", type:"photo-series", year:1997, title:"Night Ceremony — Dr. Thepphanom Leads Followers to Telepathic Contact Site",     location:"Nakhon Sawan, Thailand", filename:"700678742_1284718107111570_3274811615342309566_n.jpg",   size:58655,  redacted:false },
].map(d => ({ ...d, era: era(d.year) }))

// 24 DOD Videos (DVIDS hosted)
export const VIDEOS = [
  { id:"DOD-V01", dvidshubId:"111688723", title:"UAP Encounter — Arabian Gulf",        location:"Arabian Gulf",   year:2020, agency:"VIDEO", size:6814452   },
  { id:"DOD-V02", dvidshubId:"111688762", title:"UAP Track — Persian Gulf",             location:"Persian Gulf",   year:2020, agency:"VIDEO", size:12752210  },
  { id:"DOD-V03", dvidshubId:"111688775", title:"UAP Contact — Strait of Hormuz",       location:"Strait of Hormuz",year:2020, agency:"VIDEO", size:3982264  },
  { id:"DOD-V04", dvidshubId:"111688809", title:"UAP Observation — Iran Corridor",      location:"Iran",           year:2020, agency:"VIDEO", size:5300653   },
  { id:"DOD-V05", dvidshubId:"111688816", title:"UAP Incident — Middle East",           location:"Middle East",    year:2021, agency:"VIDEO", size:27493716  },
  { id:"DOD-V06", dvidshubId:"111688825", title:"Multi-Object UAP — Iraq",              location:"Iraq",           year:2022, agency:"VIDEO", size:155885289 },
  { id:"DOD-V07", dvidshubId:"111688954", title:"UAP Track — Syria Corridor",           location:"Syria",          year:2022, agency:"VIDEO", size:15992674  },
  { id:"DOD-V08", dvidshubId:"111688964", title:"Fast Mover — Gulf of Aden",            location:"Gulf of Aden",   year:2022, agency:"VIDEO", size:15445575  },
  { id:"DOD-V09", dvidshubId:"111688970", title:"UAP Scan — Arabian Sea",               location:"Arabian Sea",    year:2022, agency:"VIDEO", size:644525    },
  { id:"DOD-V10", dvidshubId:"111688997", title:"UAP Intercept — UAE Airspace",         location:"UAE",            year:2023, agency:"VIDEO", size:1834659   },
  { id:"DOD-V11", dvidshubId:"111689005", title:"UAP Contact — Greece",                 location:"Greece",         year:2023, agency:"VIDEO", size:426911    },
  { id:"DOD-V12", dvidshubId:"111689011", title:"UAP Track — Mediterranean",            location:"Mediterranean Sea",year:2023,agency:"VIDEO", size:198248609 },
  { id:"DOD-V13", dvidshubId:"111689022", title:"UAP Observation — East China Sea",     location:"East China Sea", year:2024, agency:"VIDEO", size:2406930   },
  { id:"DOD-V14", dvidshubId:"111689030", title:"INDOPACOM UAP Intercept",              location:"Pacific",        year:2024, agency:"VIDEO", size:142686223 },
  { id:"DOD-V15", dvidshubId:"111689044", title:"UAP Radar Contact — Japan",            location:"Japan",          year:2023, agency:"VIDEO", size:8543893   },
  { id:"DOD-V16", dvidshubId:"111689051", title:"UAP Encounter — Syria October",        location:"Syria",          year:2024, agency:"VIDEO", size:30707537  },
  { id:"DOD-V17", dvidshubId:"111689057", title:"UAP Track — Djibouti Region",          location:"Djibouti",       year:2025, agency:"VIDEO", size:1708179   },
  { id:"DOD-V18", dvidshubId:"111689082", title:"UAP Multi-Sensor — Iraq",              location:"Iraq",           year:2024, agency:"VIDEO", size:29392078  },
  { id:"DOD-V19", dvidshubId:"111689083", title:"UAP Intercept — Pacific",              location:"Pacific",        year:2024, agency:"VIDEO", size:116787147 },
  { id:"DOD-V20", dvidshubId:"111689090", title:"INDOPACOM Fast Mover 2024",            location:"Pacific",        year:2024, agency:"VIDEO", size:274712045 },
  { id:"DOD-V21", dvidshubId:"111689115", title:"UAP Event — Africa Region",            location:"Djibouti",       year:2025, agency:"VIDEO", size:86775527  },
  { id:"DOD-V22", dvidshubId:"111689123", title:"UAP Encounter — Middle East 2025",     location:"Middle East",    year:2025, agency:"VIDEO", size:14908599  },
  { id:"DOD-V23", dvidshubId:"111689133", title:"UAP Contact — Western US May 2026",    location:"Western US",     year:2026, agency:"VIDEO", size:3005135   },
  { id:"DOD-V24", dvidshubId:"111689142", title:"UAP Debrief — Army 2026",              location:"Unknown",        year:2026, agency:"VIDEO", size:15963093  },
]

// GitNexus-style: compute relations between documents
export function computeRelations(docs) {
  const relations = []
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const a = docs[i], b = docs[j]
      let weight = 0, type = null
      if (a.location === b.location && a.location !== "Unknown") { weight += 3; type = "location" }
      if (a.agency === b.agency) { weight += 1; type = type || "agency" }
      if (a.era === b.era && a.era) { weight += 1; type = type || "era" }
      if (a.type === b.type) { weight += 0.5; type = type || "type" }
      if (weight >= 3) relations.push({ source: a.id, target: b.id, weight, type })
    }
  }
  return relations
}

// Community detection: group by primary dimension
export function computeCommunities(docs) {
  const byLocation = {}
  const byAgency = {}
  const byEra = {}
  docs.forEach(d => {
    if (d.location) { byLocation[d.location] = byLocation[d.location] || []; byLocation[d.location].push(d.id) }
    if (d.agency)   { byAgency[d.agency]     = byAgency[d.agency]     || []; byAgency[d.agency].push(d.id)     }
    if (d.era)      { byEra[d.era]           = byEra[d.era]           || []; byEra[d.era].push(d.id)           }
  })
  return { byLocation, byAgency, byEra }
}

export const STATS = {
  totalDocs: DOCUMENTS.length,
  totalVideos: VIDEOS.length,
  agencies: [...new Set(DOCUMENTS.map(d=>d.agency))].length,
  locations: [...new Set(DOCUMENTS.map(d=>d.location).filter(l=>l!=="Unknown" && l!=="Space"))].length,
  yearRange: [1944, 2026],
  redacted: DOCUMENTS.filter(d=>d.redacted).length,
  totalSizeGB: (DOCUMENTS.reduce((s,d)=>s+d.size,0) / 1e9).toFixed(1),
}
