// Fallback word list for Wordle Guesser
// This is used if the words.txt file can't be loaded
const wordsList = [
  // Add a subset of common words for fallback
  "about", "above", "abuse", "actor", "adapt", "admit", "adopt", "adult", 
  "after", "again", "agent", "agree", "ahead", "alarm", "album", "alert", 
  "alike", "alive", "allow", "alone", "along", "alter", "among", "anger", 
  "angry", "ankle", "apart", "apple", "apply", "arena", "argue", "arise", 
  "armor", "array", "arrow", "asset", "avoid", "award", "aware", "awful", 
  "bacon", "badge", "badly", "baker", "bases", "basic", "basis", "beach", 
  "beard", "beast", "begin", "being", "below", "bench", "berry", "birth", 
  "black", "blade", "blame", "blank", "blast", "blaze", "blend", "bless", 
  "blind", "block", "blood", "bloom", "blues", "bluff", "board", "boast", 
  "bonus", "boost", "booth", "born", "bound", "brace", "brain", "brand", 
  "brave", "bread", "break", "breed", "brick", "bride", "brief", "bring", 
  "broad", "brown", "brush", "build", "built", "bunch", "burst", "cabin", 
  "cable", "cakes", "calls", "camps", "canal", "candy", "canoe", "cards", 
  "cargo", "carry", "carve", "cases", "catch", "cause", "cease", "chain", 
  "chair", "chart", "chase", "cheap", "check", "cheek", "chest", "chief", 
  "child", "chill", "china", "chips", "choir", "choke", "chord", "civil", 
  "claim", "clash", "class", "clean", "clear", "clerk", "click", "cliff", 
  "climb", "clock", "close", "cloth", "cloud", "clubs", "coach", "coast", 
  "color", "comes", "comic", "cooks", "coral", "corps", "costs", "couch", 
  "cough", "could", "count", "court", "cover", "crack", "craft", "crane", 
  "crash", "crazy", "cream", "crime", "crisp", "cross", "crowd", "crown", 
  "crude", "crush", "cubic", "curry", "curve", "cycle", "daily", "dairy", 
  "dance", "dated", "dealt", "death", "debug", "debut", "decay", "decks", 
  "decor", "delay", "delta", "dense", "depth", "derby", "deter", "devil", 
  "diary", "digit", "dirty", "disco", "diver", "docks", "dodge", "doing", 
  "donor", "doors", "doubt", "dough", "draft", "drain", "drama", "drawn", 
  "dream", "dress", "dried", "drink", "drive", "drops", "drove", "drunk", 
  "ducks", "dunes", "dusty", "dutch", "dwarf", "dying", "eager", "eagle", 
  "early", "earth", "eight", "elbow", "elder", "elect", "elite", "embed", 
  "empty", "ended", "enemy", "enjoy", "enter", "entry", "equal", "equip", 
  "erase", "error", "essay", "event", "every", "exact", "exist", "extra", 
  "faces", "facts", "faded", "fails", "faith", "falls", "false", "fancy", 
  "fatal", "fault", "favor", "fears", "feast", "feels", "fence", "ferry", 
  "fever", "fewer", "fiber", "field", "fifth", "fifty", "fight", "final", 
  "first", "fixed", "flags", "flame", "flash", "fleet", "flesh", "flies", 
  "float", "flock", "flood", "floor", "flour", "fluid", "flush", "focus", 
  "folds", "fonts", "foods", "force", "forge", "forms", "forth", "forty", 
  "forum", "found", "frame", "frank", "fraud", "fresh", "front", "frost", 
  "fruit", "fully", "funds", "funny", "gains", "games", "gangs", "gates", 
  "gauge", "gears", "genes", "genre", "ghost", "giant", "gifts", "given", 
  "gland", "glass", "globe", "glory", "glove", "goals", "going", "goods", 
  "grace", "grade", "grain", "grand", "grant", "grape", "graph", "grasp", 
  "grass", "grave", "great", "greek", "green", "greet", "grief", "grill", 
  "grind", "grips", "gross", "group", "grove", "grown", "guard", "guess", 
  "guest", "guide", "guild", "guilt", "habit", "hairs", "halls", "hands", 
  "handy", "hangs", "happy", "harsh", "hated", "haven", "hawks", "heads", 
  "heard", "heart", "heavy", "hedge", "heels", "hello", "helps", "hence", 
  "herbs", "highs", "hills", "hints", "hired", "hobby", "holds", "holes", 
  "holly", "homes", "honey", "honor", "hooks", "hoped", "hopes", "horns", 
  "horse", "hosts", "hotel", "hours", "house", "hover", "human", "humor", 
  "hurry", "hurts", "icons", "ideal", "ideas", "idiot", "image", "inbox", 
  "incur", "index", "indie", "inner", "input", "irony", "issue", "items", 
  "ivory", "jeans", "jelly", "jewel", "joins", "joint", "jokes", "judge", 
  "juice", "juicy", "jumbo", "jumps", "keeps", "kicks", "kills", "kinda", 
  "kinds", "kings", "knees", "knife", "knock", "known", "knows", "label", 
  "labor", "lacks", "lakes", "lamps", "lands", "lanes", "large", "laser", 
  "later", "laugh", "layer", "leads", "leaks", "learn", "lease", "least", 
  "leave", "legal", "lemon", "level", "lever", "light", "liked", "likes", 
  "limit", "lined", "linen", "liner", "lines", "links", "lions", "lists", 
  "lived", "liver", "lives", "loads", "loans", "lobby", "local", "locks", 
  "lodge", "logic", "loose", "lords", "loses", "loved", "lover", "loves", 
  "lower", "loyal", "lucky", "lunar", "lunch", "lungs", "lying", "macro", 
  "magic", "mails", "major", "maker", "makes", "males", "manga", "manor", 
  "maple", "march", "marks", "marry", "masks", "match", "mates", "maths", 
  "mayor", "meals", "means", "meant", "meats", "medal", "media", "meets", 
  "menus", "mercy", "merge", "merit", "merry", "messy", "metal", "meter", 
  "micro", "midst", "might", "miles", "minds", "mines", "minor", "minus", 
  "mixed", "mixes", "model", "modem", "modes", "moist", "money", "month", 
  "moral", "motor", "mount", "mouse", "mouth", "moved", "moves", "movie", 
  "music", "myths", "nails", "naked", "named", "names", "nasal", "nasty", 
  "naval", "needs", "nerve", "never", "newer", "newly", "nexus", "nicer", 
  "niche", "night", "ninth", "noble", "nodes", "noise", "north", "noted", 
  "notes", "novel", "nurse", "nutty", "nylon", "oasis", "occur", "ocean", 
  "offer", "often", "older", "olive", "omega", "onion", "onset", "opens", 
  "opera", "opted", "optic", "orbit", "order", "organ", "other", "ought", 
  "ounce", "outer", "owned", "owner", "oxide", "packs", "pages", "pains", 
  "paint", "pairs", "panel", "panic", "pants", "paper", "parks", "parts", 
  "party", "pasta", "paste", "patch", "paths", "patio", "pause", "peace", 
  "peach", "peaks", "pearl", "pedal", "peers", "penny", "pepsi", "perks", 
  "perry", "ghost", "phone", "photo", "piano", "picks", "piece", "piles", 
  "pills", "pilot", "pinch", "pipes", "pitch", "pizza", "place", "plain", 
  "plane", "plans", "plate", "plays", "plaza", "plead", "plots", "plugs", 
  "poems", "point", "poker", "polar", "poles", "polls", "ponds", "pools", 
  "porch", "pores", "ports", "posed", "poses", "posts", "pound", "power", 
  "press", "price", "pride", "prime", "print", "prior", "prize", "probe", 
  "promo", "prone", "proof", "props", "proud", "prove", "proxy", "pulls", 
  "pulse", "pumps", "punch", "pupil", "puppy", "purse", "queen", "query", 
  "quest", "queue", "quick", "quiet", "quilt", "quite", "quote", "races", 
  "racks", "radar", "radio", "rails", "rainy", "raise", "rally", "ranch", 
  "range", "ranks", "rapid", "rated", "rates", "ratio", "razor", "reach", 
  "react", "reads", "ready", "realm", "rebel", "refer", "reign", "relax", 
  "relay", "renal", "renew", "reply", "reset", "resin", "retro", "rider", 
  "rides", "ridge", "rifle", "right", "rigid", "rings", "riots", "risen", 
  "risks", "risky", "rival", "river", "roads", "robin", "robot", "rocks", 
  "rocky", "rogue", "roles", "rolls", "roman", "rooms", "roots", "ropes", 
  "roses", "rough", "round", "route", "rover", "royal", "rugby", "ruled", 
  "ruler", "rules", "rural", "sadly", "safer", "sails", "saint", "salad", 
  "sales", "salon", "salsa", "salty", "salve", "sands", "sandy", "santa", 
  "satin", "sauce", "saved", "saves", "scale", "scalp", "scans", "scare", 
  "scarf", "scary", "scene", "scent", "scope", "score", "scout", "scrap", 
  "screw", "seals", "seams", "seats", "seeds", "seeks", "seems", "sells", 
  "sends", "sense", "serum", "serve", "setup", "seven", "sewer", "shade", 
  "shaft", "shake", "shall", "shame", "shape", "share", "shark", "sharp", 
  "sheep", "sheer", "sheet", "shelf", "shell", "shift", "shine", "shiny", 
  "ships", "shirt", "shock", "shoes", "shook", "shoot", "shops", "shore", 
  "short", "shots", "shown", "shows", "sides", "siege", "sight", "sigma", 
  "signs", "silly", "since", "sings", "sinks", "sized", "sizes", "skies", 
  "skill", "skins", "skirt", "skull", "slate", "sleep", "slept", "slice", 
  "slide", "slope", "slots", "small", "smart", "smell", "smile", "smoke", 
  "snake", "snaps", "sneak", "soaps", "sober", "socks", "sofas", "solar", 
  "solid", "solve", "songs", "sonic", "sorry", "sorts", "souls", "sound", 
  "south", "space", "spain", "spare", "spark", "speak", "specs", "speed", 
  "spell", "spend", "spent", "spice", "spicy", "spike", "spine", "spite", 
  "split", "spoil", "spoke", "spoon", "sport", "spots", "spray", "stack", 
  "staff", "stage", "stain", "stake", "stamp", "stand", "stark", "stars", 
  "start", "state", "stays", "steak", "steal", "steam", "steel", "steep", 
  "steer", "stems", "steps", "stern", "stick", "stiff", "still", "stock", 
  "stole", "stone", "stood", "stool", "stops", "store", "storm", "story", 
  "stove", "strap", "straw", "strip", "stuck", "study", "stuff", "style", 
  "sugar", "suite", "suits", "sunny", "super", "surge", "sushi", "sweat", 
  "sweet", "swept", "swift", "swing", "swiss", "sword", "syrup", "table", 
  "taken", "takes", "tales", "talks", "tanks", "tapes", "tasks", "taste", 
  "tasty", "taxed", "taxes", "teams", "tears", "teens", "teeth", "tells", 
  "tempo", "tends", "tenth", "tents", "terms", "tests", "texas", "texts", 
  "thank", "theft", "their", "theme", "there", "these", "thick", "thief", 
  "thigh", "thing", "think", "third", "those", "three", "throw", "thumb", 
  "tiger", "tight", "tiles", "timed", "timer", "times", "tired", "tires", 
  "title", "toast", "today", "token", "tones", "tools", "tooth", "topic", 
  "torch", "total", "touch", "tough", "tours", "towel", "tower", "towns", 
  "toxic", "trace", "track", "tract", "trade", "trail", "train", "trait", 
  "trans", "traps", "trash", "treat", "trees", "trend", "trial", "tribe", 
  "trick", "tried", "tries", "trips", "trout", "truck", "truly", "trunk", 
  "trust", "truth", "tubes", "tulip", "tumor", "tuned", "tunes", "turbo", 
  "turns", "twice", "twins", "twist", "types", "tyres", "ultra", "uncle", 
  "under", "union", "unite", "units", "unity", "until", "upper", "upset", 
  "urban", "urged", "urine", "usage", "users", "using", "usual", "vague", 
  "valid", "value", "valve", "vapor", "vault", "vegan", "veins", "vents", 
  "venue", "verse", "video", "views", "villa", "vinyl", "viral", "virus", 
  "visit", "vital", "vivid", "vocal", "vodka", "voice", "volts", "votes", 
  "voter", "vowed", "wages", "wagon", "waist", "walks", "walls", "wants", 
  "warns", "waste", "watch", "water", "watts", "waves", "wears", "weeds", 
  "weeks", "weigh", "weird", "wells", "welsh", "whale", "wheat", "wheel", 
  "where", "which", "while", "white", "whole", "whose", "wider", "widow", 
  "width", "winds", "wines", "wings", "wiped", "wired", "wires", "witch", 
  "wives", "woman", "women", "woods", "words", "works", "world", "worms", 
  "worry", "worse", "worst", "worth", "would", "wound", "wrath", "wreck", 
  "wrist", "write", "wrong", "wrote", "yacht", "yards", "years", "yeast", 
  "yield", "young", "yours", "youth", "yummy", "zones",
];

// This function attempts to read the words.txt file directly at build time
// if supported by the environment
const loadWordsFromFile = () => {
  try {
    // This is a development-only feature and may not work in all environments
    const fs = require('fs');
    const path = require('path');
    
    const wordsPath = path.resolve(__dirname, '../words.txt');
    if (fs.existsSync(wordsPath)) {
      const content = fs.readFileSync(wordsPath, 'utf8');
      const words = content.split('\n')
        .filter(word => word.trim().length === 5)
        .map(word => word.toLowerCase());
      
      if (words.length > wordsList.length) {
        console.log(`Loaded ${words.length} words from file at build time`);
        return words;
      }
    }
  } catch (e) {
    // Silently fail - we'll use the fallback list
  }
  
  return wordsList;
};

// Try to get the complete list at build time, or use the fallback
const allWords = loadWordsFromFile();

export default allWords;
