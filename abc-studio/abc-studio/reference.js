// === ABC Notation Reference (categorized) ===
// Each item has a name, short desc, and snippet that can be inserted.
window.ABC_REFERENCE = [
  {
    id: "start",
    title: "Start Here",
    items: [
      { name: "Reference number (X:)", desc: "Every tune begins with X:1. Required.", snip: "X:1" },
      { name: "Title (T:)", desc: "Display title of the tune.", snip: "T:Untitled Standard" },
      { name: "Composer (C:)", desc: "Composer credit.", snip: "C:Trad. / arr. Me" },
      { name: "Meter (M:)", desc: "Time signature. Use C for 4/4, C| for cut time.", snip: "M:4/4" },
      { name: "Default note length (L:)", desc: "Sets the implied note length. 1/8 is typical for jazz.", snip: "L:1/8" },
      { name: "Tempo (Q:)", desc: "BPM with reference note.", snip: "Q:1/4=140" },
      { name: "Key (K:)", desc: "Last header before notes. Sets the staff.", snip: "K:Bb" },
      { name: "Minimal valid tune", desc: "A complete, valid starter file.", snip: "X:1\nT:Starter\nM:4/4\nL:1/8\nQ:1/4=120\nK:C\n|: CDEF GABc | cBAG FEDC :|" }
    ]
  },
  {
    id: "pitch",
    title: "Pitch",
    items: [
      { name: "Note letters", desc: "Uppercase = lower octave, lowercase = upper octave.", snip: "CDEFGABc d e f g a b" },
      { name: "Octave up (\u2019)", desc: "Each apostrophe raises by one octave.", snip: "c' c'' c'''" },
      { name: "Octave down (,)", desc: "Each comma lowers by one octave.", snip: "C, C,, C,,," },
      { name: "Sharp (^)", desc: "^ before the note. Double sharp = ^^.", snip: "^F ^^C" },
      { name: "Flat (_)", desc: "_ before the note. Double flat = __.", snip: "_B __E" },
      { name: "Natural (=)", desc: "Cancels an earlier accidental in the bar.", snip: "=B" },
      { name: "Rest (z)", desc: "z is a rest; Z is a whole-measure rest.", snip: "z2 z4 | Z |" },
      { name: "Invisible rest (x)", desc: "Takes space but is not drawn.", snip: "x2" },
      { name: "Chord (square brackets)", desc: "Stack notes into a chord.", snip: "[CEG] [DFA] [Bdf]" }
    ]
  },
  {
    id: "rhythm",
    title: "Rhythm",
    items: [
      { name: "Duration multipliers", desc: "Numbers multiply the default note length.", snip: "C2 C4 C8" },
      { name: "Fractions", desc: "/ halves, // quarters, /3 thirds, etc.", snip: "C/ C// C/3" },
      { name: "Dotted rhythms (>, <)", desc: "> makes left longer; < makes right longer.", snip: "C>D  C<D" },
      { name: "Tie (-)", desc: "Connects two notes of the same pitch.", snip: "C2-C2" },
      { name: "Slur ( )", desc: "Parentheses around notes group a slur.", snip: "(CDEF)" },
      { name: "Triplet (3", desc: "(3 before three notes = triplet.", snip: "(3CDE (3FGA" },
      { name: "Tuplets (n", desc: "(5 quintuplet, (7 septuplet, etc.", snip: "(5CDEFG" },
      { name: "Pickup measure", desc: "Place pickup notes before the first bar line.", snip: "|: z2 G2 | c4 z2 G2 | :|" },
      { name: "Swing 8ths (jazz feel)", desc: "Notational hint via tempo text.", snip: "Q:\"Medium swing\" 1/4=140" }
    ]
  },
  {
    id: "measures",
    title: "Measures",
    items: [
      { name: "Bar line (|)", desc: "Standard bar.", snip: "| C D E F |" },
      { name: "Double bar (||)", desc: "Section divider.", snip: "|| C D E F ||" },
      { name: "Final bar (|])", desc: "End of piece.", snip: "C D E F |]" },
      { name: "Repeat start / end", desc: "|: opens a repeat; :| closes it.", snip: "|: C D E F :|" },
      { name: "Double repeat (::)", desc: "Close + open repeat together.", snip: "|: A B :: C D :|" },
      { name: "First & second endings", desc: "[1 ... :| [2 ... |]", snip: "|: CDEF |[1 GABc :|[2 cBAG |]" },
      { name: "Section labels (P:)", desc: "Mark formal sections A, B, C…", snip: "P:A" },
      { name: "Line break (line)", desc: "A new ABC source line breaks the staff.", snip: "| ABCD |\\\n| EFGA |" }
    ]
  },
  {
    id: "harmony",
    title: "Harmony",
    items: [
      { name: "Chord symbol", desc: "\"Cmaj7\" before a note prints the symbol above it.", snip: "\"Cmaj7\"C2 \"Am7\"A2" },
      { name: "Slash chord", desc: "Use /Bass after the chord.", snip: "\"D7/F#\"A2" },
      { name: "Rhythm slashes", desc: "Use style=rhythm in K: for slash notation.", snip: "K:C style=rhythm\n\"C\"B \"F\"B \"G7\"B \"C\"B |" },
      { name: "No chord / break", desc: "Skip a chord with one of these.", snip: "\"^N.C.\"" },
      { name: "ii–V–I (major)", desc: "Classic resolution.", snip: "\"Dm7\"D2 \"G7\"G2 | \"Cmaj7\"C4 |" },
      { name: "ii–V–i (minor)", desc: "Minor cadence.", snip: "\"Dm7b5\"D2 \"G7b9\"G2 | \"Cm6\"C4 |" },
      { name: "Tritone sub", desc: "Substitute V7 with bII7.", snip: "\"Dm7\"D2 \"Db7\"D2 | \"Cmaj7\"C4 |" },
      { name: "Jazz chord formatting", desc: "Pass {jazzchords:true} to renderAbc for fakebook look.", snip: "% engine option, not in ABC source" }
    ]
  },
  {
    id: "form",
    title: "Form",
    items: [
      { name: "AABA (32-bar)", desc: "Standard popular form. Use P: section markers.", snip: "P:A\n|: \"Cmaj7\"C4 \"Am7\"A4 | \"Dm7\"D4 \"G7\"G4 :|\nP:B (bridge)\n| \"Em7\"E4 \"A7\"A4 | \"Dm7\"D4 \"G7\"G4 |\nP:A" },
      { name: "12-bar blues", desc: "I7 – IV7 – I7 – V7 – IV7 – I7.", snip: "\"F7\"F4 | \"Bb7\"B4 | \"F7\"F4 | \"F7\"F4 |\n\"Bb7\"B4 | \"Bb7\"B4 | \"F7\"F4 | \"D7\"D4 |\n\"Gm7\"G4 | \"C7\"C4 | \"F7\"F4 | \"C7\"C4 |" },
      { name: "Rhythm changes (A)", desc: "I – vi – ii – V over A section.", snip: "\"Bb\"B2 \"G7\"G2 | \"Cm7\"C2 \"F7\"F2 |\n\"Bb\"B2 \"G7\"G2 | \"Cm7\"C2 \"F7\"F2 |" },
      { name: "Rhythm changes (B / bridge)", desc: "III7 – VI7 – II7 – V7.", snip: "\"D7\"D4 | \"D7\"D4 | \"G7\"G4 | \"G7\"G4 |\n\"C7\"C4 | \"C7\"C4 | \"F7\"F4 | \"F7\"F4 |" },
      { name: "Turnaround", desc: "I – VI7 – ii – V back to the top.", snip: "\"Cmaj7\"C2 \"A7\"A2 | \"Dm7\"D2 \"G7\"G2 |" },
      { name: "Coda / D.C.", desc: "Use !coda! and !D.C.! as decorations.", snip: "!coda! C4 | !D.C.! z4 |" }
    ]
  },
  {
    id: "text",
    title: "Text",
    items: [
      { name: "Lyrics (w:)", desc: "Place a w: line under the music. Hyphens split syllables.", snip: "CDEF GABc |\nw: Fly me to the moon and let me" },
      { name: "Annotation (^above)", desc: "^ places text above, _ below, < left, > right, @ free.", snip: "\"^Solo break\"C2 D2 E2 F2 |" },
      { name: "Rehearsal mark", desc: "Use a parts header P: or a boxed annotation.", snip: "P:A\n%%setbarnb 1" },
      { name: "Tempo text", desc: "Add a label to your tempo.", snip: "Q:\"Bossa\" 1/4=132" },
      { name: "Free text block", desc: "%%text places a line of prose.", snip: "%%text Performance note: lay back behind the beat." },
      { name: "Annotation under staff", desc: "Underscore prefix.", snip: "\"_pizz.\"C4 \"_arco\"E4" }
    ]
  },
  {
    id: "playback",
    title: "Playback / Export",
    items: [
      { name: "Set playback tempo", desc: "Q: header controls audio speed.", snip: "Q:1/4=160" },
      { name: "MIDI program", desc: "Choose an instrument for melody and chords.", snip: "%%MIDI program 56\n%%MIDI chordprog 4" },
      { name: "Drum track", desc: "Built-in swing comp.", snip: "%%MIDI drum dddd 36 38 38 38 100 64 80 80\n%%MIDI drumon" },
      { name: "Click \u25b6 Play", desc: "The Play button in the Score panel plays your tune.", snip: "" },
      { name: "Export PDF", desc: "Right rail \u2192 PDF. Uses the browser print pipeline at letter size.", snip: "" },
      { name: "Export PNG", desc: "Right rail \u2192 PNG. 2\u00d7 scale raster image.", snip: "" },
      { name: "Export SVG", desc: "Right rail \u2192 SVG. Pure vector score.", snip: "" },
      { name: "Copy .abc source", desc: "Right rail \u2192 .ABC. Saves the textarea contents.", snip: "" }
    ]
  },
  {
    id: "trouble",
    title: "Troubleshooting",
    items: [
      { name: "Why did my preview disappear?", desc: "You probably removed or mistyped a required header. Every tune needs X:, K:, and a body. Make sure K: is the LAST header line before the music.", snip: "" },
      { name: "Why is this bar too long?", desc: "Total durations exceeded the meter. With M:4/4 and L:1/8, eight 1/8 notes (or equivalents) fit per bar. Check ties across bar lines and tuplet groupings.", snip: "" },
      { name: "Why did my chord not show?", desc: "Chord symbols must be in straight quotes \"...\" right before a note, not 'curly' quotes. Place them outside any bar line and before the note they apply to.", snip: "" },
      { name: "Why are my accidentals wrong?", desc: "Accidentals carry through a measure for the same pitch. Use = to cancel a previous sharp or flat within the same bar.", snip: "^F2 =F2" },
      { name: "Why are notes the wrong octave?", desc: "Uppercase letters are middle C to B; lowercase letters are an octave higher. Use commas and apostrophes to shift further.", snip: "C c c' C," },
      { name: "Why does my repeat look weird?", desc: "Use |: at the start and :| at the end. For first/second endings, use |[1 and |[2 immediately after the bar line.", snip: "|: A B C D |[1 E F :|[2 G A |]" },
      { name: "Why is audio silent?", desc: "Browsers block autoplay. Click Play once after the page loads to unlock the synth.", snip: "" }
    ]
  }
];
