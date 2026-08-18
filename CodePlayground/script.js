(() => {
  // ── Particle System ──
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6
        ? `rgba(212, 168, 75, ${this.opacity})`
        : `rgba(240, 236, 228, ${this.opacity * 0.3})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x -= (dx / dist) * force * 0.5;
          this.y -= (dy / dist) * force * 0.5;
        }
      }

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212, 168, 75, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ── Navbar Scroll ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  });

  // ── Scroll Reveal ──
  const revealElements = document.querySelectorAll(
    '.myth-card, .section-title, .section-subtitle, .timeline-item, .gallery-item, .trial-layout, .verdict, .cta-content'
  );
  revealElements.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ── Quote Carousel ──
  const quotes = document.querySelectorAll('.quote');
  const dotsContainer = document.getElementById('quoteDots');
  let currentQuote = 0;
  let autoPlayInterval;

  quotes.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('quote-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToQuote(i));
    dotsContainer.appendChild(dot);
  });

  function goToQuote(index) {
    quotes[currentQuote].classList.remove('active');
    dotsContainer.children[currentQuote].classList.remove('active');
    currentQuote = index;
    quotes[currentQuote].classList.add('active');
    dotsContainer.children[currentQuote].classList.add('active');
  }

  document.getElementById('prevBtn').addEventListener('click', () => {
    goToQuote((currentQuote - 1 + quotes.length) % quotes.length);
    resetAutoPlay();
  });

  document.getElementById('nextBtn').addEventListener('click', () => {
    goToQuote((currentQuote + 1) % quotes.length);
    resetAutoPlay();
  });

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      goToQuote((currentQuote + 1) % quotes.length);
    }, 7000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }
  startAutoPlay();

  // ── Gallery Card Flip ──
  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      item.classList.toggle('flipped');
    });
  });

  // ── Smooth Anchor Scroll ──
  document.querySelectorAll('.nav-links a, .cta-btn').forEach((link) => {
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
})();
