
// PRELOADER
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    document.body.style.overflow = '';
    initReveal();
  }, 1100);
});

// CURSOR
const dot = document.getElementById("cursor-dot");
const ring = document.getElementById("cursor-ring");
const glow = document.getElementById("cursor-glow");

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let glowX = 0, glowY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (dot) {
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;

  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;

  if (ring) {
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
  }
  if (glow) {
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
  }

  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll("a, button, .project-card").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    if (ring) {
      ring.style.width = "54px";
      ring.style.height = "54px";
      ring.style.borderColor = "rgba(201,169,110,0.7)";
    }
  });

  el.addEventListener("mouseleave", () => {
    if (ring) {
      ring.style.width = "34px";
      ring.style.height = "34px";
      ring.style.borderColor = "rgba(201,169,110,0.38)";
    }
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
