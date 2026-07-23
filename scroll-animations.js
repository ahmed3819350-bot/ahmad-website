const TARGETS = [
  '.timeline-item',
  '.highlight-card',
  '.project-card',
  '.cert-item',
  '.skills-group',
  '.edu-item',
  '.about-text p',
  '.heading-section',
  '.page-header',
  '.cta-section h2',
  '.cta-row',
  '.section-label',
];

document.querySelectorAll(TARGETS.join(', ')).forEach(el => {
  el.classList.add('scroll-reveal');
});

// Stagger children within the same container
const staggerParents = [
  '.highlights-grid',
  '.timeline',
  '.cert-list',
  '.skills-grid',
  '.projects-section',
  '.edu-list',
];

staggerParents.forEach(selector => {
  document.querySelectorAll(selector).forEach(parent => {
    parent.querySelectorAll('.scroll-reveal').forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -48px 0px',
});

document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
