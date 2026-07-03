
// PRELOADER
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    document.body.style.overflow = '';
    initReveal();
  }, 1100);
});

// CURSOR — morphing diamond with particle trail
const dot = document.getElementById("cursor-dot");
const ring = document.getElementById("cursor-ring");
const glow = document.getElementById("cursor-glow");

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let glowX = 0, glowY = 0;

// Particle trail system
const trailCanvas = document.getElementById("cursor-trail-canvas");
let trailCtx = null;
const trailParticles = [];

if (trailCanvas) {
  trailCtx = trailCanvas.getContext("2d");
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;
  window.addEventListener("resize", () => {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  });
}

class TrailParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1.5;
    this.life = 1.0;
    this.decay = Math.random() * 0.025 + 0.015;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
    this.rotation = Math.random() * Math.PI;
    this.rotationSpeed = (Math.random() - 0.5) * 0.08;
    this.isGold = Math.random() > 0.3;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.rotation += this.rotationSpeed;
    this.size *= 0.995;
  }
  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.life * 0.5;
    
    const color = this.isGold 
      ? `rgba(201, 169, 110, ${this.life * 0.6})`
      : `rgba(78, 205, 196, ${this.life * 0.4})`;
    
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;
    
    // Diamond shape
    const s = this.size;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.6, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-s * 0.6, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
}

let lastTrailX = 0, lastTrailY = 0;
let trailThrottle = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (dot) {
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }
  
  // Spawn trail particles based on movement distance
  if (trailCtx) {
    const dx = mouseX - lastTrailX;
    const dy = mouseY - lastTrailY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    trailThrottle++;
    
    if (dist > 4 && trailThrottle % 2 === 0) {
      trailParticles.push(new TrailParticle(mouseX, mouseY));
      lastTrailX = mouseX;
      lastTrailY = mouseY;
    }
    // Keep particle count sane
    while (trailParticles.length > 60) trailParticles.shift();
  }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;

  glowX += (mouseX - glowX) * 0.07;
  glowY += (mouseY - glowY) * 0.07;

  if (ring) {
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
  }
  if (glow) {
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
  }
  
  // Render trail particles
  if (trailCtx && trailCanvas) {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    for (let i = trailParticles.length - 1; i >= 0; i--) {
      trailParticles[i].update();
      trailParticles[i].draw(trailCtx);
      if (trailParticles[i].life <= 0) {
        trailParticles.splice(i, 1);
      }
    }
  }

  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover state — use CSS class toggling for richer animation
document.querySelectorAll("a, button, .project-card, .filter-btn, .contact-pill, .skill-tags span").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    if (ring) ring.classList.add("cursor-hover");
    if (dot) dot.classList.add("cursor-hover");
  });
  el.addEventListener("mouseleave", () => {
    if (ring) ring.classList.remove("cursor-hover");
    if (dot) dot.classList.remove("cursor-hover");
  });
});


// NAV SCROLL + PROGRESS
const nav      = document.getElementById('nav');
const progress = document.getElementById('nav-progress');
const scrollEl = document.getElementById('hero-scroll');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progress.style.width = pct + '%';
  // hide scroll indicator once user starts scrolling
  if (scrollEl) scrollEl.style.opacity = window.scrollY > 80 ? '0' : '1';
});

// REVEAL ON SCROLL
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 70);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// PROJECT FILTER
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = f === 'all' || card.dataset.category === f;
      card.classList.toggle('hidden', !show);
    });
  });
});

// CARD 3D TILT
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width  - 0.5;
    const cy = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-5px) rotateX(${-cy * 7}deg) rotateY(${cx * 7}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// NEURAL ODE TRAJECTORY CANVAS
class TrajectoryParticle {
  constructor(w, h) {
    this.reset(w, h);
  }
  reset(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.history = [];
    this.speed = Math.random() * 0.6 + 0.35;
    this.life = Math.random() * 150 + 100;
    this.maxLife = this.life;
    this.color = Math.random() > 0.55 ? '201, 169, 110' : '78, 205, 196'; // Gold or Teal
  }
  update(w, h, mouseX, mouseY) {
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > 15) {
      this.history.shift();
    }

    // Mathematical flow field (Neural ODE simulation style)
    let frequency = 0.0035;
    let angle = (Math.sin(this.y * frequency) + Math.cos(this.x * frequency)) * Math.PI * 1.5;

    let vx = Math.cos(angle) * this.speed;
    let vy = Math.sin(angle) * this.speed;

    // Mouse interaction - dynamic flow bend
    if (mouseX !== undefined && mouseY !== undefined) {
      let dx = mouseX - this.x;
      let dy = mouseY - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 220) {
        let force = (220 - dist) / 220;
        // Pull particles slightly towards cursor
        vx += (dx / dist) * force * 0.5;
        vy += (dy / dist) * force * 0.5;
      }
    }

    this.x += vx;
    this.y += vy;
    this.life--;

    if (this.life <= 0 || this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
      this.reset(w, h);
    }
  }
  draw(ctx) {
    if (this.history.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 1; i < this.history.length; i++) {
      ctx.lineTo(this.history[i].x, this.history[i].y);
    }
    
    let alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.35;
    ctx.strokeStyle = `rgba(${this.color}, ${alpha})`;
    ctx.lineWidth = 0.75;
    ctx.stroke();
  }
}

const trajectoryCanvas = document.getElementById('trajectory-canvas');
if (trajectoryCanvas) {
  const ctx = trajectoryCanvas.getContext('2d');
  let w = trajectoryCanvas.offsetWidth;
  let h = trajectoryCanvas.offsetHeight;
  trajectoryCanvas.width = w;
  trajectoryCanvas.height = h;

  let particles = [];
  const particleCount = 80;

  for (let i = 0; i < particleCount; i++) {
    particles.push(new TrajectoryParticle(w, h));
  }

  window.addEventListener('resize', () => {
    w = trajectoryCanvas.offsetWidth;
    h = trajectoryCanvas.offsetHeight;
    trajectoryCanvas.width = w;
    trajectoryCanvas.height = h;
  });

  function renderTrajectories() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      // mouseX and mouseY are globally accessible from cursor script
      p.update(w, h, typeof mouseX !== 'undefined' ? mouseX : undefined, typeof mouseY !== 'undefined' ? mouseY : undefined);
      p.draw(ctx);
    });
    requestAnimationFrame(renderTrajectories);
  }
  renderTrajectories();
}

// MAGNETIC NAV LINKS
document.querySelectorAll("#nav a, #nav .nav-logo, #nav .nav-icon-link").forEach(el => {
  el.addEventListener("mousemove", e => {
    const bound = el.getBoundingClientRect();
    const x = e.clientX - bound.left - bound.width / 2;
    const y = e.clientY - bound.top - bound.height / 2;
    el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "translate(0px, 0px)";
  });
});

// TYPEWRITER HERO ROTATION
const typewriterTarget = document.getElementById("typewriter-text");
if (typewriterTarget) {
  const phrases = [
    "healthcare AI, language models, and full-stack engineering.",
    "neural governance and cryptographic provenance.",
    "neuro-AI and brain-response modelling.",
    "clinical-grade diagnostics and medical accuracy."
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typewriterTarget.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30;
    } else {
      typewriterTarget.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at end of text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before next word
    }

    setTimeout(type, typingSpeed);
  }
  
  // Start typewriter after a short delay on DOM ready
  setTimeout(type, 1200);
}

