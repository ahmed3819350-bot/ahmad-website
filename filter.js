const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');
const dividers = document.querySelectorAll('.project-divider');

const FILTER_DURATION = 220;

// NOTE: only ever set transitionProperty/Duration/TimingFunction here (never the
// `transition` shorthand) — scroll-animations.js sets an inline transitionDelay
// on these same cards for the scroll-in stagger, and the shorthand would reset it.
function setCardVisibility(card, visible) {
  clearTimeout(card._filterTimeout);

  if (visible) {
    if (!card.classList.contains('hidden') && !card.classList.contains('filtering-out')) return;
    card.classList.remove('hidden');
    void card.offsetWidth; // force reflow so the fade-in transition actually plays
    card.classList.remove('filtering-out');
    card.style.transitionProperty = '';
    card.style.transitionDuration = '';
    card.style.transitionTimingFunction = '';
    card.style.opacity = '';
    card.style.transform = '';
  } else {
    if (card.classList.contains('hidden')) return;
    card.classList.add('filtering-out');
    card.style.transitionProperty = 'opacity, transform';
    card.style.transitionDuration = `${FILTER_DURATION}ms`;
    card.style.transitionTimingFunction = 'ease-out';
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    card._filterTimeout = setTimeout(() => {
      card.classList.add('hidden');
    }, FILTER_DURATION);
  }
}

function reorderZigzag(matchSet) {
  let visibleIndex = 0;
  cards.forEach(card => {
    if (!matchSet.has(card)) {
      card.classList.remove('is-even');
    } else {
      card.classList.toggle('is-even', visibleIndex % 2 === 1);
      visibleIndex++;
    }
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');

    const filter = btn.dataset.filter;
    const matchSet = new Set();

    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) matchSet.add(card);
      setCardVisibility(card, match);
    });

    dividers.forEach(div => div.classList.remove('hidden'));
    dividers.forEach(div => {
      const prev = div.previousElementSibling;
      const next = div.nextElementSibling;
      if (!prev || !matchSet.has(prev) || !next || !matchSet.has(next)) {
        div.classList.add('hidden');
      }
    });

    reorderZigzag(matchSet);
  });
});

// Set initial zigzag on page load
reorderZigzag(new Set(cards));
