(function () {
  var items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    answer.style.maxHeight = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'max-height 0.32s ease, opacity 0.2s ease';
    answer.style.opacity = '0';

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      items.forEach(function (other) {
        var ob = other.querySelector('.faq-question');
        var oa = other.querySelector('.faq-answer');
        ob.setAttribute('aria-expanded', 'false');
        other.classList.remove('faq-item--open');
        oa.style.maxHeight = '0';
        oa.style.opacity = '0';
      });

      // Open this one if it was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        item.classList.add('faq-item--open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.style.opacity = '1';
      }
    });
  });
}());
