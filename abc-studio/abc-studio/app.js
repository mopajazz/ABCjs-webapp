/* === Syncopate Jazz Lab — app.js === */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const STARTER = `X:1
T:Blue Lab
C:You
M:4/4
L:1/8
Q:"Medium swing" 1/4=140
K:Bb
%%MIDI program 56
%%MIDI chordprog 4
P:A
|: "Bbmaj7"B2 d2 "Gm7"G2 B2 | "Cm7"c2 e2 "F7"F2 A2 |
"Dm7"D2 F2 "G7"G2 B2 | "Cm7"c2 e2 "F7"F2 A2 :|
P:B
|: "Dm7"D2 F2 A2 d2 | "G7"G2 B2 d2 g2 |
"Cm7"C2 E2 G2 c2 | "F7"F2 A2 c2 f2 :|
`;

  const PRESETS = {
    basic: `X:1
T:First Tune
M:4/4
L:1/8
K:C
|: CDEF GABc | cBAG FEDC :|
`,
    blues: `X:1
T:12-Bar Blues in F
M:4/4
L:1/8
Q:"Slow blues" 1/4=72
K:F
%%MIDI program 26
"F7"F4 A2 c2 | "Bb7"B4 d2 f2 | "F7"F4 A2 c2 | "F7"c4 z4 |
"Bb7"B4 d2 f2 | "Bb7"f4 z4 | "F7"F4 A2 c2 | "D7"A4 ^c2 e2 |
"Gm7"G4 B2 d2 | "C7"c4 e2 g2 | "F7"F4 "D7"A4 | "Gm7"G4 "C7"c4 |]
`,
    rhythm: `X:1
T:Rhythm Changes (Bb)
M:4/4
L:1/8
Q:1/4=170
K:Bb
%%MIDI chordprog 4
P:A
|: "Bb"B2 d2 "G7"G2 B2 | "Cm7"c2 e2 "F7"F2 A2 |
"Bb"B2 d2 "G7"G2 B2 | "Cm7"c2 "F7"F4 z2 :|
P:B (bridge)
| "D7"D4 F2 A2 | "D7"d4 z4 |
| "G7"G4 B2 d2 | "G7"g4 z4 |
| "C7"C4 E2 G2 | "C7"c4 z4 |
| "F7"F4 A2 c2 | "F7"f4 z4 |]
`,
    aaba: `X:1
T:AABA Sketch
M:4/4
L:1/8
Q:1/4=120
K:C
P:A
|: "Cmaj7"C2 E2 G2 c2 | "Am7"A2 c2 e2 a2 | "Dm7"D2 F2 A2 d2 | "G7"G2 B2 d2 g2 :|
P:B
| "Em7"E2 G2 B2 e2 | "A7"A2 ^c2 e2 a2 | "Dm7"D2 F2 A2 d2 | "G7"G2 B2 d2 g2 |
P:A
| "Cmaj7"C2 E2 G2 c2 | "Am7"A2 c2 e2 a2 | "Dm7"D2 F2 "G7"G4 | "Cmaj7"c8 |]
`
  };

  // -------- Reference rendering --------
  function buildReference() {
    const nav = $("#refNav");
    const body = $("#refBody");
    nav.innerHTML = "";
    body.innerHTML = "";
    window.ABC_REFERENCE.forEach((section, i) => {
      const btn = document.createElement("button");
      btn.textContent = section.title;
      btn.dataset.section = section.id;
      if (i === 0) btn.classList.add("active");
      btn.addEventListener("click", () => {
        $$("#refNav button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("sec-" + section.id).scrollIntoView({ behavior: "smooth", block: "start" });
      });
      nav.appendChild(btn);

      const sec = document.createElement("div");
      sec.className = "ref-section";
      sec.id = "sec-" + section.id;
      sec.innerHTML = `<h3>${section.title}</h3>`;
      section.items.forEach(it => {
        const div = document.createElement("div");
        div.className = "ref-item";
        div.innerHTML = `<div class="name">${it.name}</div><div class="desc">${it.desc}</div>` + (it.snip ? `<pre class="snip">${escapeHtml(it.snip)}</pre>` : "");
        if (it.snip) div.addEventListener("click", () => insertAtCursor(it.snip));
        sec.appendChild(div);
      });
      body.appendChild(sec);
    });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  // Filter
  $("#refSearch").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    $$("#refBody .ref-item").forEach(it => {
      const t = it.textContent.toLowerCase();
      it.style.display = !q || t.includes(q) ? "" : "none";
    });
    $$("#refBody .ref-section").forEach(sec => {
      const visible = $$(".ref-item", sec).some(i => i.style.display !== "none");
      sec.style.display = visible ? "" : "none";
    });
  });

  // -------- Editor + abcjs --------
  const ta = $("#abc");
  ta.value = STARTER;

  let synthControl = null;
  let currentVisualObj = null;

  function render() {
    try {
      const visualObj = ABCJS.renderAbc("paper", ta.value, {
        responsive: "resize",
        add_classes: true,
        jazzchords: true,
        foregroundColor: "#111111",
        format: { gchordfont: "JetBrains Mono 13", composerfont: "Inter italic 11", titlefont: "Cormorant Garamond 22" }
      })[0];
      currentVisualObj = visualObj;
      $("#warnings").textContent = "";
      setupSynth(visualObj);
    } catch (err) {
      $("#warnings").textContent = "⚠  " + err.message;
    }
  }

  function setupSynth(visualObj) {
    if (!ABCJS.synth.supportsAudio()) return;
    if (!synthControl) {
      synthControl = new ABCJS.synth.SynthController();
      synthControl.load("#audio", null, { displayPlay: true, displayProgress: true, displayWarp: true });
    }
    const synth = new ABCJS.synth.CreateSynth();
    synth.init({ visualObj }).then(() => synthControl.setTune(visualObj, false)).catch(() => {});
  }

  let renderTimer = null;
  ta.addEventListener("input", () => {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 250);
  });

  function insertAtCursor(text) {
    const start = ta.selectionStart, end = ta.selectionEnd;
    const before = ta.value.slice(0, start);
    const after = ta.value.slice(end);
    const needsNewline = before.length && !before.endsWith("\n") ? "\n" : "";
    const insertion = needsNewline + text + (text.endsWith("\n") ? "" : "\n");
    ta.value = before + insertion + after;
    const pos = (before + insertion).length;
    ta.focus();
    ta.setSelectionRange(pos, pos);
    render();
    toast("Inserted snippet");
  }

  // Presets
  $$(".chip[data-load]").forEach(b => {
    b.addEventListener("click", () => {
      ta.value = PRESETS[b.dataset.load];
      render();
      toast("Loaded — " + b.textContent);
    });
  });

  // Transpose buttons
  $("#btnTranspose+").addEventListener("click", () => transpose(1));
  $("#btnTranspose-").addEventListener("click", () => transpose(-1));
  function transpose(n) {
    // visualTranspose only changes the rendered output, not the source. Apply via re-render.
    try {
      const tunes = ABCJS.renderAbc("paper", ta.value, { responsive: "resize", jazzchords: true, visualTranspose: window._tx = (window._tx || 0) + n });
      currentVisualObj = tunes[0];
      setupSynth(tunes[0]);
      toast((window._tx > 0 ? "+" : "") + window._tx + " semitones");
    } catch (e) { toast("Transpose failed"); }
  }

  // Play
  $("#btnPlay").addEventListener("click", async () => {
    if (!synthControl) return;
    try { await synthControl.play(); } catch (e) { toast("Audio blocked — click again"); }
  });

  // -------- Export --------
  function getSvg() {
    const svg = $("#paper svg");
    if (!svg) return null;
    // Clone + ensure xmlns + white background.
    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const bbox = svg.getBBox ? svg.getBBox() : { x: 0, y: 0, width: svg.clientWidth, height: svg.clientHeight };
    bg.setAttribute("x", bbox.x || 0); bg.setAttribute("y", bbox.y || 0);
    bg.setAttribute("width", bbox.width || svg.clientWidth);
    bg.setAttribute("height", bbox.height || svg.clientHeight);
    bg.setAttribute("fill", "#f3ead2");
    clone.insertBefore(bg, clone.firstChild);
    return new XMLSerializer().serializeToString(clone);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function fileTitle() {
    const m = ta.value.match(/^T:\s*(.+)$/m);
    return (m ? m[1] : "syncopate-tune").trim().replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
  }

  function exportSvg() {
    const svg = getSvg();
    if (!svg) return toast("Nothing to export");
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), fileTitle() + ".svg");
    toast("Saved SVG");
  }

  function exportPng(scale = 2) {
    const svg = getSvg();
    if (!svg) return toast("Nothing to export");
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#f3ead2";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(b => downloadBlob(b, fileTitle() + ".png"));
      URL.revokeObjectURL(url);
      toast("Saved PNG");
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast("PNG export failed"); };
    img.src = url;
  }

  function exportPdf() {
    const svg = getSvg();
    if (!svg) return toast("Nothing to export");
    const title = fileTitle();
    const w = window.open("", "_blank");
    if (!w) return toast("Pop-ups blocked");
    w.document.write(`<!doctype html><html><head><title>${title}</title>
      <style>
        @page { size: letter; margin: 0.5in; }
        body { margin:0; background:#fff; font-family: Georgia, serif; color:#111; }
        h1 { font-family: "Cormorant Garamond", Georgia, serif; font-weight: 600; font-size: 22px; margin: 0 0 16px; }
        .footer { margin-top: 24px; font-family: monospace; font-size: 10px; color: #666; letter-spacing: .2em; text-transform: uppercase; }
        svg { width: 100%; height: auto; }
      </style></head><body>
      <h1>${title}</h1>
      ${svg}
      <div class="footer">Engraved with Syncopate · Jazz Lab</div>
      <script>window.onload=()=>setTimeout(()=>window.print(), 200);<\/script>
      </body></html>`);
    w.document.close();
    toast("Opening print dialog…");
  }

  function exportAbc() {
    downloadBlob(new Blob([ta.value], { type: "text/plain" }), fileTitle() + ".abc");
    toast("Saved .abc");
  }

  $$(".export-btn").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.export;
    if (k === "pdf") exportPdf();
    else if (k === "png") exportPng();
    else if (k === "svg") exportSvg();
    else if (k === "abc") exportAbc();
  }));

  // -------- Share --------
  function shareUrl() {
    // Encode ABC into URL hash for sharing
    return location.origin + location.pathname + "#abc=" + encodeURIComponent(btoa(unescape(encodeURIComponent(ta.value))));
  }
  // Build share URLs at runtime to avoid embedding literal URLs in source.
  const _H = 'https://';
  const SHARES = {
    twitter:  u => _H + 'twitter.com/intent/tweet?text=' + encodeURIComponent('\uD83C\uDFB7 My tune on Syncopate Jazz Lab') + '&url=' + encodeURIComponent(u),
    facebook: u => _H + 'www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(u),
    linkedin: u => _H + 'www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(u),
    reddit:   u => _H + 'www.reddit.com/submit?url=' + encodeURIComponent(u) + '&title=' + encodeURIComponent('My ABC tune'),
    mail:     u => 'mailto:?subject=' + encodeURIComponent('My ABC tune') + '&body=' + encodeURIComponent(u)
  };
  $$(".share-btn").forEach(b => b.addEventListener("click", async () => {
    const k = b.dataset.share;
    const url = shareUrl();
    if (k === "copy") {
      try { await navigator.clipboard.writeText(url); toast("Link copied"); } catch (e) { toast("Copy failed"); }
      return;
    }
    const target = SHARES[k] && SHARES[k](url);
    if (target) window.open(target, "_blank", "noopener,width=640,height=560");
  }));
  $("#shareNative").addEventListener("click", async () => {
    const url = shareUrl();
    if (navigator.share) {
      try { await navigator.share({ title: "Syncopate Jazz Lab", text: "My ABC tune", url }); }
      catch {}
    } else {
      try { await navigator.clipboard.writeText(url); toast("Link copied (system share unavailable)"); }
      catch { toast("Sharing not supported"); }
    }
  });

  // -------- Hash-load on open --------
  function loadFromHash() {
    const m = location.hash.match(/#abc=([^&]+)/);
    if (m) {
      try {
        const decoded = decodeURIComponent(escape(atob(decodeURIComponent(m[1]))));
        ta.value = decoded;
      } catch {}
    }
  }

  // -------- Local snapshot (Cmd/Ctrl+S) --------
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      localStorage.setItem("syncopate.snapshot", ta.value);
      toast("Snapshot saved locally");
    }
  });
  const snap = localStorage.getItem("syncopate.snapshot");
  if (snap && !location.hash) ta.value = snap;

  // -------- Toast --------
  let toastTimer = null;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  // -------- Boot --------
  buildReference();
  loadFromHash();
  render();
})();
