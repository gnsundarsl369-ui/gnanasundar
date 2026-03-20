const http = require("http");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Gnanasundar — Entrepreneur & Builder</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --ink:     #0a0a0a;
      --paper:   #f5f0e8;
      --gold:    #c9a84c;
      --dim:     #6b6560;
      --line:    rgba(10,10,10,0.12);
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Mono', monospace;
      background: var(--paper);
      color: var(--ink);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* ── grain overlay ── */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 999;
      opacity: .6;
    }

    /* ── nav ── */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.6rem 4rem;
      border-bottom: 1px solid var(--line);
      background: rgba(245,240,232,0.88);
      backdrop-filter: blur(12px);
    }
    .nav-logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem; font-weight: 300; letter-spacing: .25em;
      text-transform: uppercase;
    }
    .nav-links { display: flex; gap: 2.5rem; list-style: none; }
    .nav-links a {
      font-size: .65rem; letter-spacing: .18em; text-transform: uppercase;
      text-decoration: none; color: var(--dim);
      transition: color .25s;
    }
    .nav-links a:hover { color: var(--ink); }

    /* ── hero ── */
    .hero {
      min-height: 100vh;
      display: grid; grid-template-columns: 1fr 1fr;
      padding-top: 5rem;
    }
    .hero-left {
      padding: 7rem 4rem 4rem;
      display: flex; flex-direction: column; justify-content: center;
      border-right: 1px solid var(--line);
    }
    .hero-eyebrow {
      font-size: .6rem; letter-spacing: .3em; text-transform: uppercase;
      color: var(--gold); margin-bottom: 2rem;
      opacity: 0; animation: fadeUp .8s .3s forwards;
    }
    .hero-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(3.5rem, 7vw, 6rem);
      font-weight: 300; line-height: 1.05;
      letter-spacing: -.01em;
      opacity: 0; animation: fadeUp .9s .5s forwards;
    }
    .hero-name em { font-style: italic; color: var(--gold); }
    .hero-tagline {
      margin-top: 2rem;
      font-size: .72rem; letter-spacing: .12em; line-height: 2;
      color: var(--dim); max-width: 38ch;
      opacity: 0; animation: fadeUp .9s .7s forwards;
    }
    .hero-cta {
      margin-top: 3.5rem; display: flex; gap: 1.2rem;
      opacity: 0; animation: fadeUp .9s .9s forwards;
    }
    .btn {
      display: inline-flex; align-items: center; gap: .6rem;
      padding: .85rem 2rem;
      font-family: 'DM Mono', monospace;
      font-size: .62rem; letter-spacing: .2em; text-transform: uppercase;
      text-decoration: none; cursor: pointer; border: none;
      transition: all .3s;
    }
    .btn-primary {
      background: var(--ink); color: var(--paper);
    }
    .btn-primary:hover { background: var(--gold); color: var(--ink); }
    .btn-ghost {
      background: transparent; color: var(--ink);
      border: 1px solid var(--line);
    }
    .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }

    .hero-right {
      display: flex; align-items: center; justify-content: center;
      padding: 7rem 4rem 4rem;
      position: relative; overflow: hidden;
    }
    .hero-art {
      position: relative; width: 320px; height: 420px;
    }
    .art-ring {
      position: absolute;
      border: 1px solid var(--gold);
      border-radius: 50%;
      animation: spin linear infinite;
    }
    .art-ring:nth-child(1) { width: 280px; height: 280px; top: 70px; left: 20px; opacity: .4; animation-duration: 22s; }
    .art-ring:nth-child(2) { width: 200px; height: 200px; top: 110px; left: 60px; opacity: .25; animation-duration: 14s; animation-direction: reverse; }
    .art-card {
      position: absolute; inset: 0;
      background: var(--ink);
      margin: 40px 30px;
      display: flex; flex-direction: column;
      justify-content: flex-end; padding: 2.5rem;
      opacity: 0; animation: fadeUp 1s 1.1s forwards;
    }
    .art-card-tag {
      font-size: .55rem; letter-spacing: .25em; text-transform: uppercase;
      color: var(--gold); margin-bottom: 1rem;
    }
    .art-card-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2rem; font-weight: 300; color: var(--paper);
      line-height: 1.2;
    }
    .art-card-line {
      width: 40px; height: 1px; background: var(--gold);
      margin: 1.5rem 0;
    }
    .art-card-sub {
      font-size: .6rem; letter-spacing: .15em; color: rgba(245,240,232,.45);
    }

    /* ── sections shared ── */
    section { padding: 7rem 4rem; border-top: 1px solid var(--line); }

    .section-label {
      font-size: .58rem; letter-spacing: .3em; text-transform: uppercase;
      color: var(--gold); margin-bottom: 1.2rem;
    }
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 4vw, 3.2rem);
      font-weight: 300; line-height: 1.15;
    }

    /* ── about ── */
    .about-grid {
      display: grid; grid-template-columns: 1fr 1.4fr; gap: 6rem;
      margin-top: 4rem; align-items: start;
    }
    .about-stats { display: flex; flex-direction: column; gap: 2rem; }
    .stat-item { border-left: 2px solid var(--gold); padding-left: 1.5rem; }
    .stat-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.8rem; font-weight: 300; line-height: 1;
    }
    .stat-label {
      font-size: .6rem; letter-spacing: .18em; text-transform: uppercase;
      color: var(--dim); margin-top: .4rem;
    }
    .about-text p {
      font-size: .8rem; line-height: 2.1; color: var(--dim);
      margin-bottom: 1.5rem;
    }

    /* ── ventures ── */
    .ventures { background: var(--ink); color: var(--paper); }
    .ventures .section-title { color: var(--paper); }
    .ventures-grid {
      display: grid; grid-template-columns: repeat(3,1fr);
      gap: 1px; margin-top: 4rem;
      border: 1px solid rgba(255,255,255,.08);
    }
    .venture-card {
      padding: 3rem 2.5rem;
      border-right: 1px solid rgba(255,255,255,.08);
      transition: background .3s;
      cursor: default;
    }
    .venture-card:last-child { border-right: none; }
    .venture-card:hover { background: rgba(201,168,76,.06); }
    .venture-num {
      font-size: .58rem; letter-spacing: .22em; color: var(--gold);
      margin-bottom: 2rem;
    }
    .venture-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.6rem; font-weight: 300; margin-bottom: 1rem;
      color: var(--paper);
    }
    .venture-desc {
      font-size: .68rem; line-height: 1.9; color: rgba(245,240,232,.45);
    }
    .venture-tags {
      display: flex; flex-wrap: wrap; gap: .5rem;
      margin-top: 2rem;
    }
    .tag {
      font-size: .55rem; letter-spacing: .15em; text-transform: uppercase;
      border: 1px solid rgba(201,168,76,.3); color: var(--gold);
      padding: .3rem .8rem;
    }

    /* ── skills ── */
    .skills-grid {
      display: grid; grid-template-columns: repeat(4,1fr);
      gap: 2rem; margin-top: 4rem;
    }
    .skill-block { padding: 2rem 0; border-top: 1px solid var(--line); }
    .skill-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.2rem; margin-bottom: 1rem;
    }
    .skill-list {
      list-style: none; display: flex; flex-direction: column; gap: .6rem;
    }
    .skill-list li {
      font-size: .64rem; letter-spacing: .1em; color: var(--dim);
      display: flex; align-items: center; gap: .6rem;
    }
    .skill-list li::before {
      content: '—'; color: var(--gold);
    }

    /* ── contact ── */
    .contact-inner {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 6rem; margin-top: 4rem; align-items: start;
    }
    .contact-intro { font-size: .78rem; line-height: 2; color: var(--dim); }
    .contact-links { display: flex; flex-direction: column; gap: 1.5rem; }
    .contact-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.5rem 0; border-bottom: 1px solid var(--line);
      text-decoration: none; color: var(--ink);
      transition: color .25s;
    }
    .contact-item:hover { color: var(--gold); }
    .contact-item-label {
      font-size: .58rem; letter-spacing: .22em; text-transform: uppercase;
    }
    .contact-item-arrow { font-size: 1rem; transition: transform .25s; }
    .contact-item:hover .contact-item-arrow { transform: translate(4px,-4px); }

    /* ── footer ── */
    footer {
      padding: 2rem 4rem;
      border-top: 1px solid var(--line);
      display: flex; justify-content: space-between; align-items: center;
    }
    footer p { font-size: .58rem; letter-spacing: .15em; color: var(--dim); }

    /* ── animations ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    /* ── scroll reveal ── */
    .reveal { opacity: 0; transform: translateY(24px); transition: opacity .8s, transform .8s; }
    .reveal.visible { opacity: 1; transform: none; }

    /* ── responsive ── */
    @media (max-width: 900px) {
      nav { padding: 1.2rem 2rem; }
      .nav-links { display: none; }
      .hero { grid-template-columns: 1fr; }
      .hero-right { display: none; }
      .hero-left { padding: 7rem 2rem 4rem; }
      section { padding: 5rem 2rem; }
      .about-grid, .contact-inner { grid-template-columns: 1fr; gap: 3rem; }
      .ventures-grid, .skills-grid { grid-template-columns: 1fr; }
      footer { flex-direction: column; gap: 1rem; text-align: center; }
    }
  </style>
</head>
<body>

<!-- NAV -->
<nav>
  <div class="nav-logo">Gnanasundar</div>
  <ul class="nav-links">
    <li><a href="#about">About</a></li>
    <li><a href="#ventures">Ventures</a></li>
    <li><a href="#skills">Skills</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
</nav>

<!-- HERO -->
<section class="hero" id="home">
  <div class="hero-left">
    <p class="hero-eyebrow">Entrepreneur · Builder · Visionary</p>
    <h1 class="hero-name">Gnana<em>sundar</em></h1>
    <p class="hero-tagline">
      Building ventures at the intersection of technology and human ambition.
      Turning bold ideas into businesses that last.
    </p>
    <div class="hero-cta">
      <a href="#ventures" class="btn btn-primary">View Ventures ↗</a>
      <a href="#contact" class="btn btn-ghost">Get in Touch</a>
    </div>
  </div>
  <div class="hero-right">
    <div class="hero-art">
      <div class="art-ring"></div>
      <div class="art-ring"></div>
      <div class="art-card">
        <span class="art-card-tag">Currently Building</span>
        <h3 class="art-card-title">Next-Gen<br>Ventures</h3>
        <div class="art-card-line"></div>
        <span class="art-card-sub">Chennai, India · Est. 2024</span>
      </div>
    </div>
  </div>
</section>

<!-- ABOUT -->
<section id="about">
  <p class="section-label reveal">Who I Am</p>
  <h2 class="section-title reveal">Turning vision<br>into reality</h2>
  <div class="about-grid">
    <div class="about-stats reveal">
      <div class="stat-item">
        <div class="stat-num">5+</div>
        <div class="stat-label">Years Entrepreneurship</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">3</div>
        <div class="stat-label">Ventures Built</div>
      </div>
      <div class="stat-item">
        <div class="stat-num">∞</div>
        <div class="stat-label">Problems to Solve</div>
      </div>
    </div>
    <div class="about-text reveal">
      <p>
        I'm Gnanasundar — an entrepreneur, product thinker, and builder based in Chennai.
        I thrive at the earliest stages of a company: the whiteboard phase where ideas
        are raw and possibilities are endless.
      </p>
      <p>
        My approach combines sharp business instincts with deep technical understanding.
        I believe great companies are built on genuine insight into human needs, disciplined
        execution, and the courage to stay the course.
      </p>
      <p>
        Whether it's zero-to-one product development, team building, or go-to-market
        strategy — I bring both the strategic lens and the hands-on drive to make things happen.
      </p>
    </div>
  </div>
</section>

<!-- VENTURES -->
<section id="ventures" class="ventures">
  <p class="section-label reveal">Portfolio</p>
  <h2 class="section-title reveal">Ventures &amp;<br>Initiatives</h2>
  <div class="ventures-grid">
    <div class="venture-card reveal">
      <div class="venture-num">01</div>
      <h3 class="venture-name">Akash Matrimony</h3>
      <p class="venture-desc">
        A modern matchmaking platform designed for Tamil communities — blending tradition
        with technology to create meaningful, lasting connections.
      </p>
      <div class="venture-tags">
        <span class="tag">SaaS</span>
        <span class="tag">Community</span>
        <span class="tag">Node.js</span>
      </div>
    </div>
    <div class="venture-card reveal">
      <div class="venture-num">02</div>
      <h3 class="venture-name">Tech Solutions</h3>
      <p class="venture-desc">
        End-to-end software development and consulting — helping startups and SMEs
        build scalable products with lean teams and sharp execution.
      </p>
      <div class="venture-tags">
        <span class="tag">Consulting</span>
        <span class="tag">Dev</span>
        <span class="tag">Scaling</span>
      </div>
    </div>
    <div class="venture-card reveal">
      <div class="venture-num">03</div>
      <h3 class="venture-name">Next Venture</h3>
      <p class="venture-desc">
        Something new is always brewing. The next idea is already taking shape —
        built on the lessons of everything that came before.
      </p>
      <div class="venture-tags">
        <span class="tag">Stealth</span>
        <span class="tag">2025</span>
      </div>
    </div>
  </div>
</section>

<!-- SKILLS -->
<section id="skills">
  <p class="section-label reveal">Capabilities</p>
  <h2 class="section-title reveal">What I bring<br>to the table</h2>
  <div class="skills-grid">
    <div class="skill-block reveal">
      <h4 class="skill-title">Business</h4>
      <ul class="skill-list">
        <li>Venture Strategy</li>
        <li>Go-to-Market</li>
        <li>Fundraising</li>
        <li>P&amp;L Management</li>
      </ul>
    </div>
    <div class="skill-block reveal">
      <h4 class="skill-title">Product</h4>
      <ul class="skill-list">
        <li>Zero-to-One</li>
        <li>User Research</li>
        <li>Roadmapping</li>
        <li>Rapid Prototyping</li>
      </ul>
    </div>
    <div class="skill-block reveal">
      <h4 class="skill-title">Technology</h4>
      <ul class="skill-list">
        <li>Node.js / TypeScript</li>
        <li>System Architecture</li>
        <li>API Design</li>
        <li>Cloud Infra</li>
      </ul>
    </div>
    <div class="skill-block reveal">
      <h4 class="skill-title">Leadership</h4>
      <ul class="skill-list">
        <li>Team Building</li>
        <li>Hiring &amp; Culture</li>
        <li>Mentorship</li>
        <li>Decision Making</li>
      </ul>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section id="contact">
  <p class="section-label reveal">Let's Connect</p>
  <h2 class="section-title reveal">Have an idea?<br>Let's talk.</h2>
  <div class="contact-inner">
    <p class="contact-intro reveal">
      I'm always open to conversations about new ventures, collaborations,
      investments, or just a good idea over coffee. Reach out through any channel below.
    </p>
    <div class="contact-links reveal">
      <a href="mailto:gnanasundar@example.com" class="contact-item">
        <span class="contact-item-label">Email</span>
        <span class="contact-item-arrow">↗</span>
      </a>
      <a href="https://linkedin.com/in/gnanasundar" target="_blank" class="contact-item">
        <span class="contact-item-label">LinkedIn</span>
        <span class="contact-item-arrow">↗</span>
      </a>
      <a href="https://twitter.com/gnanasundar" target="_blank" class="contact-item">
        <span class="contact-item-label">Twitter / X</span>
        <span class="contact-item-arrow">↗</span>
      </a>
      <a href="#" class="contact-item">
        <span class="contact-item-label">Schedule a Call</span>
        <span class="contact-item-arrow">↗</span>
      </a>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <p>© 2026 Gnanasundar. All rights reserved.</p>
  <p>Chennai, Tamil Nadu, India</p>
</footer>

<script>
  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
</script>
</body>
</html>`;

const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(\`🚀 Gnanasundar portfolio running at http://localhost:\${PORT}\`);
});
