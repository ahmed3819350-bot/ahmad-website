(function () {
  var wrapper = document.querySelector('.page-wrapper');
  if (!wrapper) return;

  var EXIT_DURATION = 130;

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      wrapper.classList.add('page-loaded');
    });
  });

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      wrapper.classList.remove('page-exiting');
      wrapper.classList.add('page-loaded');
    }
  });

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest('a');
    if (!link) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;

    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    if (href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
    if (link.origin !== window.location.origin) return;
    if (link.pathname === window.location.pathname) return;

    e.preventDefault();
    wrapper.classList.remove('page-loaded');
    wrapper.classList.add('page-exiting');

    setTimeout(function () {
      window.location.href = href;
    }, EXIT_DURATION);
  });
}());
