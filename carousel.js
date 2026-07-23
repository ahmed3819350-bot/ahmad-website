document.querySelectorAll('.project-media').forEach(media => {
  const carousel = document.createElement('div');
  carousel.className = 'project-carousel';
  media.classList.forEach(cls => { if (cls !== 'project-media') carousel.classList.add(cls); });

  const trackWrapper = document.createElement('div');
  trackWrapper.className = 'carousel-track-wrapper';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  // If explicit .carousel-slide children exist, use them; otherwise wrap all content in one slide
  const explicitSlides = media.querySelectorAll(':scope > .carousel-slide');
  if (explicitSlides.length > 0) {
    explicitSlides.forEach(s => track.appendChild(s));
  } else {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    media.classList.forEach(cls => { if (cls !== 'project-media') slide.classList.add(cls); });
    while (media.firstChild) slide.appendChild(media.firstChild);
    track.appendChild(slide);
  }

  trackWrapper.appendChild(track);
  carousel.appendChild(trackWrapper);

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn carousel-btn--prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '<svg width="9" height="15" viewBox="0 0 9 15" fill="none"><path d="M8 1L1.5 7.5L8 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn carousel-btn--next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '<svg width="9" height="15" viewBox="0 0 9 15" fill="none"><path d="M1 1L7.5 7.5L1 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';

  carousel.appendChild(prevBtn);
  carousel.appendChild(nextBtn);
  carousel.appendChild(dotsContainer);

  media.parentNode.replaceChild(carousel, media);

  const slides = track.querySelectorAll('.carousel-slide');
  let current = 0;

  if (slides.length <= 1) {
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    dotsContainer.hidden = true;
    return;
  }

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' carousel-dot--active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = Math.max(0, Math.min(index, slides.length - 1));
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('carousel-dot--active', i === current);
    });
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  }

  let autoTimer;

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      goTo(current < slides.length - 1 ? current + 1 : 0);
    }, 4000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  let isHovered = false;

  carousel.addEventListener('mouseenter', () => { isHovered = true;  stopAuto(); });
  carousel.addEventListener('mouseleave', () => { isHovered = false; if (isVisible) startAuto(); });

  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) goTo(current + (dx > 0 ? 1 : -1));
    if (!isHovered && isVisible) startAuto();
  });

  let isVisible = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !isHovered) {
        startAuto();
      } else {
        stopAuto();
      }
    });
  }, { threshold: 0.25 });

  goTo(0);
  observer.observe(carousel);
});
