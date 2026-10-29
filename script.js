(() => {
  const intro = document.getElementById('intro');
  const site = document.getElementById('site');
  document.body.classList.add('locked');

  // Abertura
  document.getElementById('open').addEventListener('click', (e) => {
    burst(e.clientX || innerWidth / 2, e.clientY || innerHeight / 2, 24);
    intro.classList.add('gone');
    site.classList.add('show');
    site.removeAttribute('aria-hidden');
    document.body.classList.remove('locked');
    setTimeout(startTyping, 900);
  });

  // Frases digitando
  const lines = [
    'Você é o meu lugar favorito.',
    'Meu pensamento mais bonito do dia.',
    'A resposta pra todas as minhas preces.',
    'Meu amor, hoje e sempre.'
  ];
  const typed = document.getElementById('typed');
  function startTyping() {
    let li = 0, ci = 0, deleting = false;
    (function tick() {
      const line = lines[li];
      typed.textContent = line.slice(0, ci);
      if (!deleting && ci < line.length) { ci++; setTimeout(tick, 70); }
      else if (!deleting) { deleting = true; setTimeout(tick, 2200); }
      else if (ci > 0) { ci--; setTimeout(tick, 30); }
      else { deleting = false; li = (li + 1) % lines.length; setTimeout(tick, 400); }
    })();
  }

  // Aparecer ao rolar
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (el.closest('.cards') ? (i % 2) * 120 : 0) + 'ms';
    io.observe(el);
  });

  // Cartões
  document.querySelectorAll('.card').forEach((c) => {
    c.addEventListener('click', () => c.classList.toggle('flip'));
  });

  // Explosão de corações
  function burst(x, y, n = 30) {
    const glyphs = ['♥', '❤', '💕', '♥'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'pop';
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.fontSize = 16 + Math.random() * 22 + 'px';
      document.body.appendChild(s);
      const a = Math.random() * Math.PI * 2, d = 80 + Math.random() * 180;
      s.animate([
        { transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d - 60}px)) scale(1) rotate(${Math.random() * 60 - 30}deg)`, opacity: 0 }
      ], { duration: 1200 + Math.random() * 800, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => s.remove();
    }
  }
  document.getElementById('burst').addEventListener('click', (e) => {
    burst(e.clientX, e.clientY, 40);
    if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
  });

  // Corações flutuando ao fundo
  const cv = document.getElementById('hearts');
  const ctx = cv.getContext('2d');
  let W, H, dpr;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * dpr; H = cv.height = innerHeight * dpr;
  }
  size(); addEventListener('resize', size);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const parts = Array.from({ length: reduce ? 0 : 26 }, () => spawn(true));
  function spawn(anywhere) {
    return {
      x: Math.random() * W, y: anywhere ? Math.random() * H : H + 20 * dpr,
      s: (8 + Math.random() * 14) * dpr, v: (.25 + Math.random() * .6) * dpr,
      w: Math.random() * Math.PI * 2, o: .15 + Math.random() * .35
    };
  }
  function heart(x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * .3);
    ctx.bezierCurveTo(x, y, x - s * .5, y, x - s * .5, y + s * .3);
    ctx.bezierCurveTo(x - s * .5, y + s * .6, x, y + s * .8, x, y + s);
    ctx.bezierCurveTo(x, y + s * .8, x + s * .5, y + s * .6, x + s * .5, y + s * .3);
    ctx.bezierCurveTo(x + s * .5, y, x, y, x, y + s * .3);
    ctx.fill();
  }
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    parts.forEach((p, i) => {
      p.y -= p.v; p.w += .015;
      ctx.fillStyle = `rgba(244,167,185,${p.o})`;
      heart(p.x + Math.sin(p.w) * 18 * dpr, p.y, p.s);
      if (p.y < -40 * dpr) parts[i] = spawn(false);
    });
    requestAnimationFrame(loop);
  })();
})();
