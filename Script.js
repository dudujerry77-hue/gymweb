

/* ---- NAVBAR ---- */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('btt').classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* Active nav link */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { threshold: 0.4 }).observe && sections.forEach(s =>
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.35 }).observe(s)
);

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' }); }
  });
});

/* ---- BACK TO TOP ---- */
document.getElementById('btt').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- SCROLL REVEAL ---- */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => ro.observe(el));

/* ---- ANIMATED COUNTERS ---- */
function runCounter(el) {
  const target = +el.dataset.count;
  const dur = 2000;
  const step = target / (dur / 16);
  let cur = 0;
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    const disp = target >= 1000 ? Math.round(cur / 100) * 100 : Math.floor(cur);
    el.textContent = disp.toLocaleString() + '+';
    if (cur >= target) { el.textContent = target.toLocaleString() + '+'; clearInterval(t); }
  }, 16);
}
let countersRan = false;
const counters = document.querySelectorAll('.stat-number[data-count]');
new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersRan) {
    countersRan = true;
    counters.forEach(runCounter);
  }
}, { threshold: 0.5 }).observe(document.querySelector('.hero-stats'));

/* ---- TESTIMONIALS SLIDER ---- */
const tTrack = document.getElementById('tTrack');
const tCards = tTrack.querySelectorAll('.t-card');
const sDots = document.getElementById('sDots');
let tCur = 0;
let tVis = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
let vis = tVis();
let total = Math.ceil(tCards.length / vis);

function buildDots() {
  vis = tVis(); total = Math.ceil(tCards.length / vis);
  sDots.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const d = document.createElement('button');
    d.className = 's-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Slide ${i + 1}`);
    d.addEventListener('click', () => goto(i));
    sDots.appendChild(d);
  }
}

function goto(i) {
  tCur = Math.max(0, Math.min(i, total - 1));
  const w = tCards[0].getBoundingClientRect().width + 22;
  tTrack.style.transform = `translateX(-${tCur * vis * w}px)`;
  document.querySelectorAll('.s-dot').forEach((d, j) => d.classList.toggle('active', j === tCur));
}

document.getElementById('prevS').addEventListener('click', () => goto(tCur - 1));
document.getElementById('nextS').addEventListener('click', () => goto(tCur < total - 1 ? tCur + 1 : 0));
buildDots();

let auto = setInterval(() => goto(tCur < total - 1 ? tCur + 1 : 0), 5000);
tTrack.addEventListener('mouseenter', () => clearInterval(auto));
tTrack.addEventListener('mouseleave', () => { auto = setInterval(() => goto(tCur < total - 1 ? tCur + 1 : 0), 5000); });
window.addEventListener('resize', () => { buildDots(); goto(0); });

/* ---- FAQ ---- */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ---- BMI CALCULATOR ---- */
let bUnit = 'metric';
document.querySelectorAll('.unit-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    bUnit = btn.dataset.unit;
    document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('wLabel').textContent = bUnit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)';
    document.getElementById('hLabel').textContent = bUnit === 'metric' ? 'Height (cm)' : 'Height (inches)';
    document.getElementById('bW').placeholder = bUnit === 'metric' ? 'e.g. 75' : 'e.g. 165';
    document.getElementById('bH').placeholder = bUnit === 'metric' ? 'e.g. 175' : 'e.g. 69';
    document.getElementById('bmiResult').classList.remove('show');
  });
});

document.getElementById('calcBMI').addEventListener('click', () => {
  const w = parseFloat(document.getElementById('bW').value);
  const h = parseFloat(document.getElementById('bH').value);
  if (!w || !h) { alert('Please enter both weight and height.'); return; }
  let bmi = bUnit === 'metric' ? w / ((h / 100) ** 2) : (703 * w) / (h ** 2);
  bmi = Math.round(bmi * 10) / 10;
  let cat, col, desc, ptr;
  if (bmi < 18.5)      { cat='Underweight';   col='#3b82f6'; ptr=6;  desc="Below the healthy range. Consider a nutrition plan and resistance training to build lean mass safely."; }
  else if (bmi < 25)   { cat='Normal Weight'; col='#22c55e'; ptr=35; desc="You're in the healthy BMI range. Maintain this through consistent training and balanced nutrition."; }
  else if (bmi < 30)   { cat='Overweight';    col='#f59e0b'; ptr=65; desc="A combination of strength training and a moderate caloric deficit can help bring your BMI into the healthy range."; }
  else                  { cat='Obese';         col='#ef4444'; ptr=88; desc="We recommend speaking with a doctor and one of our certified trainers to build a safe, effective plan."; }
  document.getElementById('bmiVal').textContent = bmi;
  document.getElementById('bmiVal').style.color = col;
  document.getElementById('bmiCat').textContent = cat;
  document.getElementById('bmiCat').style.color = col;
  document.getElementById('bmiDescTxt').textContent = desc;
  document.getElementById('bmiPtr').style.left = ptr + '%';
  const r = document.getElementById('bmiResult');
  r.classList.remove('show'); void r.offsetWidth; r.classList.add('show');
});

/* ---- CONTACT FORM ---- */
document.getElementById('submitForm').addEventListener('click', () => {
  const name = document.getElementById('fName').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const interest = document.getElementById('fInterest').value;
  if (!name)                    { alert('Please enter your first name.'); return; }
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
  if (!interest)                { alert('Please select what you\'re interested in.'); return; }
  const btn = document.getElementById('submitForm');
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    btn.disabled = false;
    ['fName','lName','fEmail','fPhone','fInterest','fMessage'].forEach(id => document.getElementById(id).value = '');
    const s = document.getElementById('fSuccess');
    s.classList.add('show');
    setTimeout(() => s.classList.remove('show'), 5000);
  }, 1600);
});

/* ---- PARALLAX ORBS ---- */
document.addEventListener('mousemove', e => {
  const x = (e.clientX / innerWidth - .5) * 18;
  const y = (e.clientY / innerHeight - .5) * 18;
  document.querySelectorAll('.orb').forEach((o, i) => {
    o.style.transform = `translate(${x * (i + 1) * .5}px,${y * (i + 1) * .5}px)`;
  });
});