const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth < 768;

/* ============================================================
   PRELOADER
   ============================================================ */
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hidden');
    document.body.style.overflow = '';
    initGsapAnimations();
  }, prefersReducedMotion ? 0 : 1200);
});

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

if (!prefersReducedMotion && dot && ring) {
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .project-card, .filter-btn, .contact-pill, .skill-tags span').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
  });
}

/* ============================================================
   NAV SCROLL + PROGRESS
   ============================================================ */
const nav = document.getElementById('nav');
const progress = document.getElementById('nav-progress');
const scrollEl = document.getElementById('hero-scroll');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progress.style.width = pct + '%';
  if (scrollEl) scrollEl.style.opacity = window.scrollY > 80 ? '0' : '1';
});

/* ============================================================
   TYPEWRITER EFFECT
   ============================================================ */
(function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    'healthcare AI & clinical diagnostics',
    'large language models & RAG systems',
    'neural ODEs & continuous-depth models',
    'full-stack systems that ship',
    'AI governance & agent security'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];
    let speed;

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      speed = 25;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      speed = 55;
    }

    if (!isDeleting && charIdx === current.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 1400);
})();

/* ============================================================
   PROJECT FILTER
   ============================================================ */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = f === 'all' || card.dataset.category === f;
      card.classList.toggle('hidden', !show);
      // Ensure shown cards are fully visible (GSAP animation state may vary)
      if (show) {
        card.style.opacity = '1';
        card.style.transform = 'none';
      }
    });
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   GSAP SCROLL ANIMATIONS
   ============================================================ */
function initGsapAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Fallback: simple reveal so content is never hidden
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Respect reduced motion: just show everything
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  // Hero content entrance (staggered)
  const heroReveals = gsap.utils.toArray('#hero .reveal');
  gsap.fromTo(heroReveals,
    { y: 30, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay: 0.2
    }
  );

  // Section reveals — for elements outside the hero
  gsap.utils.toArray('.reveal').forEach(el => {
    if (el.closest('#hero')) return;
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      }
    );
  });

  // Project cards staggered reveal
  gsap.fromTo('.project-card',
    { y: 50, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07,
      scrollTrigger: { trigger: '#projects .projects-grid', start: 'top 85%' }
    }
  );

  // Parallax hero orbs (subtle scroll depth)
  gsap.to('.hero-orb-1', {
    yPercent: 35,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  gsap.to('.hero-orb-2', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Section labels slide in
  gsap.utils.toArray('.section-label').forEach(label => {
    gsap.fromTo(label,
      { x: -20, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: label, start: 'top 92%' }
      }
    );
  });

  // Timeline items staggered
  gsap.fromTo('.timeline-item',
    { x: -30, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: '.timeline', start: 'top 85%' }
    }
  );

  // Blog cards staggered
  gsap.fromTo('.blog-card',
    { y: 40, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: '#blog', start: 'top 85%' }
    }
  );

  // Refresh ScrollTrigger after images load
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ============================================================
   3D TILT CARDS
   ============================================================ */
(function initTiltCards() {
  if (prefersReducedMotion) return;
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 10;
      const rotateY = (x - 0.5) * 10;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty('--mouse-x', `${x * 100}%`);
      card.style.setProperty('--mouse-y', `${y * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
    });
  });
})();

/* ============================================================
   MAGNETIC BUTTONS
   ============================================================ */
(function initMagnetic() {
  if (prefersReducedMotion) return;
  const elements = document.querySelectorAll('.magnetic');
  if (!elements.length) return;

  elements.forEach(el => {
    const strength = parseFloat(el.dataset.strength) || 0.4;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      const x = relX * strength;
      const y = relY * strength;

      // Use gsap.to for smooth interpolation if available
      if (typeof gsap !== 'undefined') {
        gsap.to(el, { x, y, duration: 0.4, ease: 'power2.out' });
      } else {
        el.style.transform = `translate(${x}px, ${y}px)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      } else {
        el.style.transform = '';
      }
    });
  });
})();

/* ============================================================
   CONTACT FORM (Web3Forms — delivers messages to your inbox)
   ============================================================ */
(function initContactForm() {
  // 1) Grab a free access key at https://web3forms.com/access-keys
  // 2) Paste it below. Messages will land in that account's email.
  const WEB3FORMS_ACCESS_KEY = 'c0bc8249-769e-49ed-b6e3-c78396fc482f';

  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('contact-submit');
  const status = document.getElementById('form-status');
  const submitText = submitBtn ? submitBtn.querySelector('.btn-submit-text') : null;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.startsWith('REPLACE_')) {
      if (status) {
        status.classList.add('error');
        status.textContent = 'Form not configured yet — please email mananjpanchal11@gmail.com directly.';
      }
      return;
    }

    // Honeypot: bots that fill it are silently "accepted"
    const botcheck = form.querySelector('[name="botcheck"]');
    if (botcheck && botcheck.checked) {
      form.reset();
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: 'New message from your portfolio',
      from_name: form.elements['name'].value.trim(),
      email: form.elements['email'].value.trim(),
      message: form.elements['message'].value.trim()
    };

    submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Sending…';
    if (status) { status.textContent = ''; status.classList.remove('error'); }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        submitBtn.classList.add('sent');
        form.reset();
        if (status) status.textContent = 'Message sent — I\'ll get back to you soon.';
        setTimeout(() => {
          submitBtn.classList.remove('sent');
          if (submitText) submitText.textContent = 'Send Message';
        }, 4000);
      } else {
        throw new Error(data.message || 'There was a problem sending the message.');
      }
    } catch (err) {
      if (status) {
        status.classList.add('error');
        status.textContent = err.message + ' Please email mananjpanchal11@gmail.com instead.';
      }
    } finally {
      submitBtn.disabled = false;
      if (submitText && !submitBtn.classList.contains('sent')) {
        submitText.textContent = 'Send Message';
      }
    }
  });
})();

/* ============================================================
   THREE.JS NEURAL PARTICLE FIELD (hero)
   Neurons connect via synapses; signals fire, travel, and relay
   — the same way thoughts transfer and AI moves data.
   ============================================================ */
(function initThreeParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const hero = document.getElementById('hero');
  let width = hero ? hero.offsetWidth : window.innerWidth;
  let height = hero ? hero.offsetHeight : window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  /* ---------- TEAL NEURONS ---------- */
  const particleCount = isMobile ? 80 : 250;
  const positions = new Float32Array(particleCount * 3);
  const nodes = [];

  // Sphere distribution with slight bias toward center
  for (let i = 0; i < particleCount; i++) {
    const r = 8 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    const z = r * Math.cos(phi);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    nodes.push(new THREE.Vector3(x, y, z));
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pointsMat = new THREE.PointsMaterial({
    color: 0x4ecdc4,
    size: 0.22,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });
  const points = new THREE.Points(geometry, pointsMat);

  /* ---------- GOLD ACCENT NEURONS ---------- */
  const goldCount = Math.floor(particleCount * 0.12);
  const goldPositions = new Float32Array(goldCount * 3);
  for (let i = 0; i < goldCount; i++) {
    const r = 10 + Math.random() * 18;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    goldPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    goldPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    goldPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  const goldGeometry = new THREE.BufferGeometry();
  goldGeometry.setAttribute('position', new THREE.BufferAttribute(goldPositions, 3));
  const goldMat = new THREE.PointsMaterial({
    color: 0xc9a96e,
    size: 0.35,
    transparent: true,
    opacity: 0.5,
    depthWrite: false
  });
  const goldPoints = new THREE.Points(goldGeometry, goldMat);

  /* ---------- SYNAPTIC CONNECTIONS (nearby nodes link up) ---------- */
  const edgeDist = isMobile ? 8 : 9.5;
  const edges = [];                                     // { a, b } node indices
  const adj = Array.from({ length: particleCount }, () => []);  // { node, edge }

  for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const dz = nodes[j].z - nodes[i].z;
      if (dx * dx + dy * dy + dz * dz < edgeDist * edgeDist) {
        const idx = edges.length;
        edges.push({ a: i, b: j });
        adj[i].push({ node: j, edge: idx });
        adj[j].push({ node: i, edge: idx });
      }
    }
  }

  const linePos = new Float32Array(edges.length * 6);
  for (let k = 0; k < edges.length; k++) {
    const a = nodes[edges[k].a];
    const b = nodes[edges[k].b];
    linePos[k * 6] = a.x;
    linePos[k * 6 + 1] = a.y;
    linePos[k * 6 + 2] = a.z;
    linePos[k * 6 + 3] = b.x;
    linePos[k * 6 + 4] = b.y;
    linePos[k * 6 + 5] = b.z;
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x4ecdc4,
    transparent: true,
    opacity: 0.14,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);

  /* ---------- Everything rotates as one field ---------- */
  const group = new THREE.Group();
  group.add(points);
  group.add(goldPoints);
  group.add(lines);
  scene.add(group);

  /* ---------- Shared glow sprite texture ---------- */
  const glowTex = (function makeGlowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.12)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();

  /* ---------- NEURON "FIRING" PULSES (action potentials) ---------- */
  const MAX_PULSES = isMobile ? 8 : 20;
  const pulses = [];
  for (let i = 0; i < MAX_PULSES; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex,
      color: 0x4ecdc4,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      opacity: 0
    }));
    s.visible = false;
    group.add(s);
    pulses.push({ sprite: s, life: 0, gold: false });
  }

  function fireNode(nodeIdx, gold) {
    let p = null;
    for (let i = 0; i < pulses.length; i++) {
      if (pulses[i].life <= 0) { p = pulses[i]; break; }
    }
    if (!p) return;
    p.life = 1;
    p.gold = !!gold;
    p.sprite.position.copy(nodes[nodeIdx]);
    p.sprite.material.color.setHex(gold ? 0xc9a96e : 0x4ecdc4);
    p.sprite.visible = true;
  }

  /* ---------- DATA SPARKS (thought/data transfer along synapses) ---------- */
  const sparkCount = isMobile ? 4 : 10;
  const sparks = [];
  for (let i = 0; i < sparkCount; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex,
      color: 0x4ecdc4,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      opacity: 0.9
    }));
    s.visible = false;
    s.scale.set(1.1, 1.1, 1);
    group.add(s);
    sparks.push({ sprite: s, from: 0, to: 0, edge: -1, t: 0, speed: 0, gold: false });
  }

  function startSpark(spark, anchor, edgeIdx) {
    const e = edges[edgeIdx];
    spark.edge = edgeIdx;
    spark.from = (e.a === anchor) ? e.a : e.b;
    spark.to = (e.a === anchor) ? e.b : e.a;
    spark.t = 0;
    spark.speed = 0.35 + Math.random() * 0.35;
    spark.gold = Math.random() < 0.3;
    spark.sprite.material.color.setHex(spark.gold ? 0xc9a96e : 0x4ecdc4);
    spark.sprite.visible = true;
  }

  function initSparks() {
    for (const sp of sparks) {
      let anchor = Math.floor(Math.random() * particleCount);
      if (!adj[anchor].length) {
        if (!edges.length) { sp.sprite.visible = false; sp.edge = -1; continue; }
        anchor = edges[Math.floor(Math.random() * edges.length)].a;
      }
      if (!adj[anchor].length) { sp.edge = -1; sp.sprite.visible = false; continue; }
      const r = adj[anchor][Math.floor(Math.random() * adj[anchor].length)];
      startSpark(sp, anchor, r.edge);
      sp.t = Math.random();
    }
  }

  function updateSparks(delta, time) {
    for (const sp of sparks) {
      if (sp.edge < 0) continue;
      sp.t += sp.speed * delta;
      if (sp.t >= 1) {
        const arrived = sp.to;
        fireNode(arrived, sp.gold);               // neuron fires on arrival
        let anchor = arrived;
        if (!adj[anchor].length) {
          anchor = Math.floor(Math.random() * particleCount);
          if (!adj[anchor].length) { sp.sprite.visible = false; sp.edge = -1; continue; }
        }
        // relay the signal along a random synapse, like a thought chain
        const r = adj[anchor][Math.floor(Math.random() * adj[anchor].length)];
        startSpark(sp, anchor, r.edge);
        continue;
      }
      const a = nodes[sp.from];
      const b = nodes[sp.to];
      sp.sprite.position.set(
        a.x + (b.x - a.x) * sp.t,
        a.y + (b.y - a.y) * sp.t,
        a.z + (b.z - a.z) * sp.t
      );
      sp.sprite.material.opacity = 0.7 + 0.3 * Math.sin(time * 6 + sp.edge * 1.7);
    }
  }

  function updatePulses(delta) {
    for (const p of pulses) {
      if (p.life <= 0) continue;
      p.life -= delta * 1.4;
      if (p.life <= 0) { p.sprite.visible = false; continue; }
      const grow = 1 - p.life;
      const scl = 0.3 + grow * 2.4;
      p.sprite.scale.set(scl, scl, 1);
      p.sprite.material.opacity = p.life * 0.9;
    }
  }

  /* ---------- MOUSE "ATTENTION": data flows toward the cursor ---------- */
  const mouse = { x: 0, y: 0 };
  let cursorKnown = false;
  const USE_FAN = !isMobile && !prefersReducedMotion;

  let fanLines = null, fanGeo = null, fanPos = null, cursorGlow = null;
  const cursorLocal = new THREE.Vector3(0, 0, 0);

  if (USE_FAN) {
    fanPos = new Float32Array(24 * 6);
    fanGeo = new THREE.BufferGeometry();
    fanGeo.setAttribute('position', new THREE.BufferAttribute(fanPos, 3).setUsage(THREE.DynamicDrawUsage));
    fanLines = new THREE.LineSegments(fanGeo, new THREE.LineBasicMaterial({
      color: 0xc9a96e,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    group.add(fanLines);

    cursorGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xc9a96e,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      opacity: 0.6
    }));
    cursorGlow.visible = false;
    cursorGlow.scale.set(2, 2, 1);
    group.add(cursorGlow);

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      cursorKnown = true;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = 0; mouse.y = 0; cursorKnown = false; });
  }

  const raycaster = new THREE.Raycaster();
  const zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const cursorNDC = new THREE.Vector2();
  const hit = new THREE.Vector3();

  function updateFan(elapsed) {
    if (!fanLines) return;
    if (!cursorKnown) {
      if (cursorGlow) cursorGlow.visible = false;
      for (let m = 0; m < 24; m++) {
        const o = m * 6;
        fanPos[o] = fanPos[o + 1] = fanPos[o + 2] = 0;
        fanPos[o + 3] = fanPos[o + 4] = fanPos[o + 5] = 0;
      }
      fanGeo.attributes.position.needsUpdate = true;
      return;
    }

    // Project the cursor into the rotating field's local space
    cursorNDC.set(mouse.x, -mouse.y);
    raycaster.setFromCamera(cursorNDC, camera);
    if (!raycaster.ray.intersectPlane(zPlane, hit)) return;
    group.updateMatrixWorld();
    cursorLocal.copy(hit);
    group.worldToLocal(cursorLocal);

    // Pull the nearest neurons toward the "thought"
    const scored = [];
    for (let i = 0; i < particleCount; i++) {
      const n = nodes[i];
      const dx = n.x - cursorLocal.x;
      const dy = n.y - cursorLocal.y;
      const dz = n.z - cursorLocal.z;
      scored.push({ i, d2: dx * dx + dy * dy + dz * dz });
    }
    scored.sort((p, q) => p.d2 - q.d2);
    const k = Math.min(24, scored.length);
    for (let m = 0; m < 24; m++) {
      const o = m * 6;
      if (m < k) {
        const n = nodes[scored[m].i];
        fanPos[o] = cursorLocal.x;
        fanPos[o + 1] = cursorLocal.y;
        fanPos[o + 2] = cursorLocal.z;
        fanPos[o + 3] = n.x;
        fanPos[o + 4] = n.y;
        fanPos[o + 5] = n.z;
      } else {
        fanPos[o] = fanPos[o + 1] = fanPos[o + 2] = 0;
        fanPos[o + 3] = fanPos[o + 4] = fanPos[o + 5] = 0;
      }
    }
    fanGeo.attributes.position.needsUpdate = true;

    if (cursorGlow) {
      cursorGlow.position.copy(cursorLocal);
      cursorGlow.visible = true;
      const pulse = 0.5 + 0.25 * Math.sin(elapsed * 3);
      cursorGlow.material.opacity = pulse;
      cursorGlow.scale.set(1.6 + pulse * 1.2, 1.6 + pulse * 1.2, 1);
    }
  }

  let targetRotX = 0, targetRotY = 0, rotX = 0, rotY = 0;
  let animId = null;
  const clock = new THREE.Clock();
  let elapsed = 0;

  function animate() {
    if (prefersReducedMotion) return;

    const delta = Math.min(clock.getDelta(), 0.05);
    elapsed += delta;

    // Smooth rotation toward mouse target + idle spin
    targetRotY = mouse.x * 0.35;
    targetRotX = -mouse.y * 0.25;
    rotX += (targetRotX - rotX) * 0.04;
    rotY += (targetRotY - rotY) * 0.04;
    group.rotation.x = rotX;
    group.rotation.y = rotY;
    group.rotation.z += 0.0015;

    updateSparks(delta, elapsed);
    updatePulses(delta);
    if (USE_FAN) updateFan(elapsed);

    // Synapses gently breathe
    lineMat.opacity = 0.13 + 0.05 * Math.sin(elapsed * 0.9);

    renderer.render(scene, camera);
    animId = requestAnimationFrame(animate);
  }

  if (!prefersReducedMotion) initSparks();

  // Only animate when hero is visible
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (animId === null && !prefersReducedMotion) animate();
      } else {
        if (animId !== null) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    });
  }, { threshold: 0.1 });
  io.observe(hero);

  // Static render for reduced motion (the web is still visible)
  if (prefersReducedMotion) {
    renderer.render(scene, camera);
  } else {
    animate();
  }

  // --- Resize handling ---
  window.addEventListener('resize', () => {
    width = hero ? hero.offsetWidth : window.innerWidth;
    height = hero ? hero.offsetHeight : window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
})();