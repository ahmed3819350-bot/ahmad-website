(function () {

  // === COLLAPSIBLE TIMELINE BULLETS ===
  document.querySelectorAll('.timeline-item').forEach(function (item) {
    var bullets = item.querySelector('.timeline-bullets');
    var details = item.querySelector('.timeline-details');
    if (!bullets && !details) return;

    var expandables = [bullets, details].filter(Boolean);

    expandables.forEach(function (el) {
      el.style.maxHeight = '0';
      el.style.overflow = 'hidden';
      el.style.transition = 'max-height 0.35s ease, opacity 0.2s ease';
      el.style.opacity = '0';
    });

    var toggle = document.createElement('button');
    toggle.className = 'timeline-toggle is-collapsed';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML =
      '<svg width="12" height="8" viewBox="0 0 12 8" fill="none">' +
        '<path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>' +
      '<span>Show details</span>';

    var content = item.querySelector('.timeline-content');
    content.appendChild(toggle);

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        expandables.forEach(function (el) {
          el.style.maxHeight = '0';
          el.style.opacity = '0';
        });
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.add('is-collapsed');
        toggle.querySelector('span').textContent = 'Show details';
      } else {
        expandables.forEach(function (el) {
          el.style.maxHeight = el.scrollHeight + 'px';
          el.style.opacity = '1';
        });
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.remove('is-collapsed');
        toggle.querySelector('span').textContent = 'Hide details';
      }
    });
  });

  // === SECTION EXPAND / COLLAPSE ALL BUTTONS ===
  document.querySelectorAll('.summary-section').forEach(function (section) {
    var body = section.querySelector('.section-body');
    if (!body) return;
    var h2 = body.querySelector('h2.heading-section');
    if (!h2) return;
    var toggles = body.querySelectorAll('.timeline-toggle');
    if (!toggles.length) return;

    var row = document.createElement('div');
    row.className = 'section-heading-row';
    h2.parentNode.insertBefore(row, h2);
    row.appendChild(h2);

    var btn = document.createElement('button');
    btn.className = 'expand-collapse-btn';

    var sym = document.createElement('span');
    sym.style.color = '#4ade80';
    sym.textContent = '+';

    var lbl = document.createTextNode(' Expand All');

    btn.appendChild(sym);
    btn.appendChild(lbl);

    var allExpanded = false;

    btn.addEventListener('click', function () {
      allExpanded = !allExpanded;
      sym.style.color = allExpanded ? '#f87171' : '#4ade80';
      sym.textContent = allExpanded ? '−' : '+';
      lbl.nodeValue = allExpanded ? ' Collapse All' : ' Expand All';
      toggles.forEach(function (toggle) {
        var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        if (allExpanded && !isExpanded) toggle.click();
        if (!allExpanded && isExpanded) toggle.click();
      });
    });

    row.appendChild(btn);
  });

  // === STICKY SECTION NAV ACTIVE STATE ===
  var sections = document.querySelectorAll('.summary-section[id]');
  var navLinks = document.querySelectorAll('.summary-section-nav .ssn-item');

  if (sections.length && navLinks.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-15% 0px -75% 0px', threshold: 0 });

    sections.forEach(function (s) { sectionObserver.observe(s); });

    // Fallback: the last section can't always scroll high enough to enter
    // the observer's trigger band (no more page below it), so force-activate
    // its nav link whenever the user has scrolled to the bottom of the page.
    var lastSectionId = sections[sections.length - 1].getAttribute('id');
    function checkScrollBottom() {
      var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + lastSectionId);
        });
      }
    }
    window.addEventListener('scroll', checkScrollBottom, { passive: true });
    window.addEventListener('resize', checkScrollBottom);
    checkScrollBottom();
  }

  // === ANIMATED STAT COUNTERS ===
  var counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseFloat(el.getAttribute('data-count-to'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var duration = 1200;
      var startTime = null;

      function step(now) {
        if (!startTime) startTime = now;
        var progress = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals);
        }
      }

      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { counterObserver.observe(c); });

}());
