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
   CONTACT FORM (client-side, no backend)
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('contact-submit');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (submitBtn.classList.contains('sent')) return;

    submitBtn.classList.add('sent');
    submitBtn.disabled = true;
    if (status) status.textContent = 'Message received — I\'ll get back to you soon.';
    form.reset();
    setTimeout(() => {
      submitBtn.classList.remove('sent');
      submitBtn.disabled = false;
      if (status) status.textContent = '';
    }, 4000);
  });
})();

/* ============================================================
   THREE.JS PARTICLE FIELD (hero)
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

  // --- Particle system ---
  const particleCount = isMobile ? 80 : 250;
  const positions = new Float32Array(particleCount * 3);

  // Sphere distribution with slight bias toward center
  for (let i = 0; i < particleCount; i++) {
    const r = 8 + Math.random() * 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Two materials for dual-color effect
  const tealMat = new THREE.PointsMaterial({
    color: 0x4ecdc4,
    size: 0.22,
    transparent: true,
    opacity: 0.65,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, tealMat);
  scene.add(points);

  // Sparse gold accent particles
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
  scene.add(goldPoints);

  // --- Rotation group for subtle motion ---
  const group = new THREE.Group();
  group.add(points);
  group.add(goldPoints);
  scene.add(group);

  // --- Mouse interaction ---
  const mouse = { x: 0, y: 0 };
  let targetRotX = 0, targetRotY = 0, rotX = 0, rotY = 0;

  if (!isMobile && !prefersReducedMotion) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = 0; mouse.y = 0; });
  }

  let animId = null;

  function animate() {
    if (prefersReducedMotion) return;

    // Smooth rotation toward mouse target
    targetRotY = mouse.x * 0.35;
    targetRotX = -mouse.y * 0.25;
    rotX += (targetRotX - rotX) * 0.04;
    rotY += (targetRotY - rotY) * 0.04;

    group.rotation.x = rotX;
    group.rotation.y = rotY;

    // Continuous slow rotation
    group.rotation.z += 0.0015;

    renderer.render(scene, camera);
    animId = requestAnimationFrame(animate);
  }

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

  // Static render for reduced motion
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