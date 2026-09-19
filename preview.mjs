/* ==========================================================================
   Local preview server — run both versions of the site side by side.

       node preview.mjs            then open http://localhost:5173

   Routes
       /            a chooser page
       /compare     two versions side by side, switchable, at a width you can drag
       /v1/         version 1  (public/)
       /^/(v1|v2|v3|v4|v5)(/         version 2  (version-2/public/)|v2|v3|v4|v5)/         version 2  (version-2/public/)
       /v3/         version 3  (version-3/public/)
       /v4/         version 4  (version-4/public/)
       /v5/         version 5  (version-5/public/)

   Uses only Node's own modules — nothing to install, and it never touches the
   network. This is a preview tool for the desktop; it is not what gets
   deployed, and it does not need to be.
   ========================================================================== */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5173;

const ROOTS = {
  v1: path.join(ROOT, 'public'),
  v2: path.join(ROOT, 'version-2', 'public'),
  v3: path.join(ROOT, 'version-3', 'public'),
  v4: path.join(ROOT, 'version-4', 'public'),
  v5: path.join(ROOT, 'version-5', 'public'),
};

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const send = (res, code, type, body) => {
  res.writeHead(code, {
    'Content-Type': type,
    'Cache-Control': 'no-store', // always serve the file as it is on disk
  });
  res.end(body);
};

/* ----------------------------------------------------------------- pages */
const shell = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh;
    font: 15px/1.6 'Segoe UI', system-ui, sans-serif;
    background: #0e0e11; color: #eee;
  }
  .wrap { max-width: 900px; margin: 0 auto; padding: 4rem 1.5rem; }
  h1 { font-size: 2rem; letter-spacing: -.02em; margin: 0 0 .4rem; }
  .sub { color: #9a9aa4; margin: 0 0 2.5rem; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
  .card {
    display: block; padding: 1.5rem; border-radius: 14px;
    background: #17171c; border: 1px solid #2a2a33; color: inherit;
    text-decoration: none; transition: border-color .2s, transform .2s;
  }
  .card:hover { border-color: #dd312d; transform: translateY(-3px); }
  .card h2 { margin: 0 0 .3rem; font-size: 1.1rem; }
  .card p { margin: 0; color: #9a9aa4; font-size: .89rem; }
  .tag {
    display: inline-block; margin-bottom: .8rem; padding: .2rem .6rem;
    border-radius: 99px; font-size: .7rem; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
  }
  .t1 { background: rgba(221,49,45,.15); color: #ff6b63; }
  .t2 { background: rgba(80,140,255,.15); color: #7aa7ff; }
  .t3 { background: rgba(255,255,255,.08); color: #bbb; }
  .t4 { background: rgba(52,199,123,.16); color: #5fd79b; }
  .t5 { background: rgba(224,71,61,.18); color: #ff8079; }
  footer { margin-top: 3rem; color: #6d6d78; font-size: .84rem; }
  code { background: #17171c; padding: .15rem .4rem; border-radius: 5px; color: #d0d0d8; }
</style></head><body>${body}</body></html>`;

const indexPage = () => shell('Mobile World Hawera — preview', `
<div class="wrap">
  <h1>Mobile World Hawera</h1>
  <p class="sub">Two versions of the same site, served from this machine. Same content,
     same photographs, same logo — different design.</p>
  <div class="cards">
    <a class="card" href="/v1/">
      <span class="tag t1">Version 1</span>
      <h2>Light &amp; clean</h2>
      <p>White ground throughout, photo card grids, centred sections. The version
         already on GitHub Pages.</p>
    </a>
    <a class="card" href="/v2/">
      <span class="tag t2">Version 2</span>
      <h2>Workshop</h2>
      <p>Dark top half, light bottom half. Services as one interactive list with a
         sticky image stage; accessories on a scrolling rail.</p>
    </a>
    <a class="card" href="/v3/">
      <span class="tag t4">Version 3</span>
      <h2>The fresh one</h2>
      <p>Built mobile-first from scratch after both earlier designs were rejected.
         Start here.</p>
    </a>
    <a class="card" href="/v4/">
      <span class="tag t5">Version 4</span>
      <h2>The irepair look</h2>
      <p>Built to the UI of irepair.co.nz, which you picked, carrying your own
         Alexandra content. Start here.</p>
    </a>
    <a class="card" href="/compare">
      <span class="tag t3">Compare</span>
      <h2>Side by side</h2>
      <p>Any two versions in two frames, switchable, scroll each independently,
         drag the divider.</p>
    </a>
  </div>
  <footer>Stop the server with <code>Ctrl + C</code> in the terminal.</footer>
</div>`);

const comparePage = () => shell('Side by side', `
<style>
  body { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
  .bar {
    display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;
    padding: .6rem 1rem; background: #17171c; border-bottom: 1px solid #2a2a33;
    font-size: .85rem;
  }
  .bar a { color: #9a9aa4; text-decoration: none; }
  .bar a:hover { color: #fff; }
  .bar strong { font-weight: 600; }
  .bar .spacer { margin-left: auto; }
  .bar button {
    font: inherit; padding: .3rem .7rem; border-radius: 7px; cursor: pointer;
    background: #22222a; color: #ddd; border: 1px solid #33333d;
  }
  .bar button:hover { border-color: #dd312d; }
  .panes { display: flex; flex: 1; min-height: 0; }
  .pane { display: flex; flex-direction: column; min-width: 0; flex: 1; }
  .pane h2 {
    margin: 0; padding: .3rem .6rem; background: #131318;
    border-bottom: 1px solid #2a2a33;
  }
  .pane h2 select {
    font: inherit; font-size: .8rem; color: #ddd; background: #1d1d24;
    border: 1px solid #33333d; border-radius: 6px; padding: .25rem .4rem;
    max-width: 100%;
  }
  .pane iframe { flex: 1; width: 100%; border: 0; background: #fff; }
  .split { width: 6px; cursor: col-resize; background: #2a2a33; flex: none; }
  .split:hover { background: #dd312d; }
</style>
<div class="bar">
  <a href="/">&larr; Back</a>
  <strong>Side by side</strong>
  <span class="spacer"></span>
  <button type="button" data-w="390">Phone 390</button>
  <button type="button" data-w="768">Tablet 768</button>
  <button type="button" data-w="0">Fill</button>
</div>
<div class="panes">
  <div class="pane" id="p1">
    <h2><select data-pane="p1">
      <option value="/v1/">Version 1 — light &amp; clean</option>
      <option value="/v2/">Version 2 — workshop</option>
      <option value="/v3/">Version 3 — the fresh one</option>
      <option value="/v4/" selected>Version 4 — the irepair look</option>
    </select></h2>
    <iframe src="/v4/" title="Left pane"></iframe>
  </div>
  <div class="split" id="split"></div>
  <div class="pane" id="p2">
    <h2><select data-pane="p2">
      <option value="/v1/">Version 1 — light &amp; clean</option>
      <option value="/v2/" selected>Version 2 — workshop</option>
      <option value="/v3/" selected>Version 3 — the fresh one</option>
      <option value="/v4/">Version 4 — the irepair look</option>
    </select></h2>
    <iframe src="/v3/" title="Right pane"></iframe>
  </div>
</div>
<script>
  var p1 = document.getElementById('p1');
  var p2 = document.getElementById('p2');
  var split = document.getElementById('split');
  var dragging = false;

  // each pane picks which version it shows
  Array.prototype.forEach.call(document.querySelectorAll('select[data-pane]'), function (sel) {
    sel.addEventListener('change', function () {
      document.getElementById(sel.getAttribute('data-pane'))
        .querySelector('iframe').src = sel.value;
    });
  });

  split.addEventListener('mousedown', function () { dragging = true; document.body.style.userSelect = 'none'; });
  window.addEventListener('mouseup', function () { dragging = false; document.body.style.userSelect = ''; });
  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    var pct = Math.min(85, Math.max(15, (e.clientX / window.innerWidth) * 100));
    p1.style.flex = '0 0 ' + pct + '%';
    p2.style.flex = '1';
  });

  // width presets, so the same breakpoint can be checked in both at once
  Array.prototype.forEach.call(document.querySelectorAll('[data-w]'), function (b) {
    b.addEventListener('click', function () {
      var w = Number(b.getAttribute('data-w'));
      [p1, p2].forEach(function (p) {
        p.querySelector('iframe').style.width = w ? w + 'px' : '100%';
        p.style.alignItems = w ? 'center' : 'stretch';
      });
    });
  });
</script>`);

/* ---------------------------------------------------------------- server */
const server = http.createServer(async (req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return send(res, 400, 'text/plain', 'Bad request');
  }

  if (pathname === '/') return send(res, 200, TYPES['.html'], indexPage());
  if (pathname === '/compare') return send(res, 200, TYPES['.html'], comparePage());

  const m = pathname.match(/^\/(v1|v2|v3|v4|v5)(\/.*)?$/);
  if (!m) return send(res, 404, 'text/plain', 'Not found. Try / or /compare');

  const base = ROOTS[m[1]];
  let rel = m[2] || '/';
  if (rel.endsWith('/')) rel += 'index.html';

  // Resolve, then confirm the result is still inside the version's folder —
  // without this, a path like /v1/../../secret would escape it.
  const file = path.resolve(base, '.' + rel);
  if (file !== base && !file.startsWith(base + path.sep)) {
    return send(res, 403, 'text/plain', 'Forbidden');
  }

  try {
    const body = await fs.readFile(file);
    send(res, 200, TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', body);
  } catch {
    try {
      send(res, 404, TYPES['.html'], await fs.readFile(path.join(base, '404.html')));
    } catch {
      send(res, 404, 'text/plain', 'Not found');
    }
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('  Mobile World Hawera — local preview');
  console.log('  ───────────────────────────────────');
  console.log('  chooser      http://localhost:' + PORT + '/');
  console.log('  version 1    http://localhost:' + PORT + '/v1/');
  console.log('  version 2    http://localhost:' + PORT + '/v2/');
  console.log('  side by side http://localhost:' + PORT + '/compare');
  console.log('');
  console.log('  Ctrl + C to stop.');
  console.log('');
});
