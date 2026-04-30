/* =========================================
   CYBER//PORTFOLIO — script.js
   ========================================= */

// ---- CUSTOM CURSOR ----
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

// Smooth trail
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Cursor effects on interactive elements
document.querySelectorAll('a, button, .skill-card, .project-card, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    cursor.style.background = 'var(--magenta)';
    cursorTrail.style.borderColor = 'rgba(255,0,204,0.5)';
    cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.background = 'var(--cyan)';
    cursorTrail.style.borderColor = 'rgba(0,245,255,0.5)';
    cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// ---- MATRIX CANVAS ----
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF@#$%&<>';
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(2, 8, 16, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontSize + 'px Share Tech Mono';

  for (let i = 0; i < drops.length; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];

    // Gradient coloring
    const y = drops[i] * fontSize;
    if (drops[i] * fontSize < canvas.height * 0.3) {
      ctx.fillStyle = '#00f5ff';
    } else if (drops[i] * fontSize < canvas.height * 0.7) {
      ctx.fillStyle = 'rgba(0, 245, 255, 0.5)';
    } else {
      ctx.fillStyle = 'rgba(0, 245, 255, 0.2)';
    }

    ctx.fillText(char, i * fontSize, y);

    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 55);

// ---- TYPING EFFECT ----
const phrases = [
  'Développeur Full-Stack',
  'Designer UI/UX',
  'Architecte Web',
  'Passionné d\'IA',
  'Créateur Numérique'
];

let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typingEl = document.getElementById('typingText');

function type() {
  const current = phrases[phraseIdx];

  if (!isDeleting) {
    typingEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      setTimeout(() => { isDeleting = true; }, 2200);
      setTimeout(type, 2300);
      return;
    }
  } else {
    typingEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }

  const speed = isDeleting ? 45 : 95;
  setTimeout(type, speed);
}

setTimeout(type, 1800);

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + (el.dataset.target === '99' ? '+' : '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 25);
}

// ---- INTERSECTION OBSERVER ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;

      // Counter
      if (el.classList.contains('stat-num')) {
        animateCounter(el);
        observer.unobserve(el);
      }

      // Skill bars
      if (el.classList.contains('skill-card')) {
        el.classList.add('visible');
        const bar = el.querySelector('.skill-fill');
        const width = el.querySelector('.skill-bar').dataset.width;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => {
          bar.style.width = width + '%';
        }, delay + 200);
      }

      // General reveal
      if (el.classList.contains('reveal')) {
        el.classList.add('visible');
      }
    }
  });
}, { threshold: 0.2 });

// Observe stat numbers
document.querySelectorAll('.stat-num').forEach(el => observer.observe(el));

// Observe skill cards
document.querySelectorAll('.skill-card').forEach(el => observer.observe(el));

// ---- SMOOTH SCROLLING NAV ----
document.querySelectorAll('.nav-link, .hero-buttons a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ---- NAV ACTIVE STATE ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        link.style.textShadow = '';
      });
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.style.color = 'var(--cyan)';
        activeLink.style.textShadow = 'var(--glow-cyan)';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ---- CONTACT FORM ----
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button');
  const originalText = btn.querySelector('span').textContent;

  btn.querySelector('span').textContent = 'ENVOI_EN_COURS...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Simulate sending
  setTimeout(() => {
    btn.querySelector('span').textContent = '✓ MESSAGE_ENVOYÉ';
    btn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
    setTimeout(() => {
      btn.querySelector('span').textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      btn.style.opacity = '1';
      form.reset();
    }, 3000);
  }, 1800);
});

// ---- GLITCH RANDOM TRIGGER ----
function randomGlitch() {
  const glitchEls = document.querySelectorAll('.glitch');
  const random = glitchEls[Math.floor(Math.random() * glitchEls.length)];
  if (random) {
    random.style.animation = 'none';
    setTimeout(() => {
      random.style.animation = '';
    }, 50);
  }
  setTimeout(randomGlitch, Math.random() * 4000 + 2000);
}
randomGlitch();

// ---- PARALLAX HERO GRID ----
document.addEventListener('mousemove', (e) => {
  const grid = document.querySelector('.hero-grid');
  if (!grid) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  grid.style.transform = `translate(${x}px, ${y}px)`;
});

// ---- PROJECT CARDS TILT ----
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
  });
});

// ---- CYBER BOOT SEQUENCE ----
(function bootSequence() {
  const tag = document.querySelector('.hero-tag');
  if (!tag) return;

  const messages = [
    '> INITIALISATION DU SYSTÈME...',
    '> CHARGEMENT DES MODULES...',
    '> CONNEXION AU RÉSEAU...',
    '> BIENVENUE DANS LE CYBERESPACE'
  ];

  let i = 0;
  function nextMsg() {
    if (i < messages.length) {
      tag.textContent = messages[i];
      i++;
      setTimeout(nextMsg, 600);
    }
  }
  setTimeout(nextMsg, 400);
})();

// ---- NEON FLICKER ON HOVER ----
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    let flickerCount = 0;
    const flicker = setInterval(() => {
      btn.style.opacity = Math.random() > 0.3 ? '1' : '0.7';
      flickerCount++;
      if (flickerCount > 8) {
        clearInterval(flicker);
        btn.style.opacity = '1';
      }
    }, 50);
  });
});

// ---- SCROLL PROGRESS LINE (NAV) ----
const progressLine = document.createElement('div');
progressLine.style.cssText = `
  position: fixed; top: 0; left: 0; height: 2px; width: 0%;
  background: linear-gradient(90deg, var(--cyan), var(--magenta));
  z-index: 10001; transition: width 0.1s linear;
  box-shadow: 0 0 8px rgba(0,245,255,0.8);
`;
document.body.appendChild(progressLine);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressLine.style.width = progress + '%';
});

// ---- CONSOLE EASTER EGG ----
console.log('%c CYBER//PORTFOLIO ', 'background: #00f5ff; color: #020810; font-size: 20px; font-weight: bold; padding: 10px 20px; font-family: monospace;');
console.log('%c > Bienvenue dans le cyberespace, hacker. ', 'color: #ff00cc; font-family: monospace; font-size: 12px;');
console.log('%c > Code is art. Art is code. ', 'color: #00f5ff; font-family: monospace; font-size: 12px;');