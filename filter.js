const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');
const dividers = document.querySelectorAll('.project-divider');

function reorderZigzag() {
  let visibleIndex = 0;
  cards.forEach(card => {
    if (card.classList.contains('hidden')) {
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

    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });

    dividers.forEach(div => div.classList.remove('hidden'));
    dividers.forEach(div => {
      const prev = div.previousElementSibling;
      const next = div.nextElementSibling;
      if (!prev || prev.classList.contains('hidden') || !next || next.classList.contains('hidden')) {
        div.classList.add('hidden');
      }
    });

    reorderZigzag();
  });
});

// Set initial zigzag on page load
reorderZigzag();
