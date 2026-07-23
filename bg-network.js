(function () {
  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;';
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var PARTICLE_COUNT = 380;
  var raf;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.32;
    this.vy = (Math.random() - 0.5) * 0.32;
    this.r = Math.random() * 1.7 + 0.6;
    this.alpha = Math.random() * 0.5 + 0.4;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -5) this.x = canvas.width + 5;
    if (this.x > canvas.width + 5) this.x = -5;
    if (this.y < -5) this.y = canvas.height + 5;
    if (this.y > canvas.height + 5) this.y = -5;
  };

  function init() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.update();
      ctx.fillStyle = 'rgba(255,255,255,' + p.alpha + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();

  window.addEventListener('resize', function () {
    cancelAnimationFrame(raf);
    resize();
    init();
    draw();
  });
}());
