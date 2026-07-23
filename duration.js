(function () {
  var MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

  function parseMonthYear(str) {
    var m = str.trim().match(/^([A-Za-z]{3})\s+(\d{4})$/);
    if (!m || !(m[1] in MONTHS)) return null;
    return new Date(parseInt(m[2], 10), MONTHS[m[1]], 1);
  }

  function computeDuration(text) {
    var parts = text.split(/\s*[–-]\s*/);
    if (parts.length !== 2) return null;
    var startStr = parts[0].trim();
    var endStr = parts[1].trim();

    if (/^\d{4}$/.test(startStr) && /^\d{4}$/.test(endStr)) {
      var years = parseInt(endStr, 10) - parseInt(startStr, 10);
      if (years <= 0) return null;
      return years === 1 ? '~1 year' : '~' + years + ' years';
    }

    var startDate = parseMonthYear(startStr);
    var endDate = /^present$/i.test(endStr) ? new Date() : parseMonthYear(endStr);
    if (!startDate || !endDate) return null;

    var totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) + 1;
    if (totalMonths < 1) totalMonths = 1;

    var yrs = Math.floor(totalMonths / 12);
    var mos = totalMonths % 12;
    var out = [];
    if (yrs > 0) out.push(yrs + (yrs === 1 ? ' yr' : ' yrs'));
    if (mos > 0) out.push(mos + (mos === 1 ? ' mo' : ' mos'));
    return out.join(' ');
  }

  document.querySelectorAll('.timeline-meta .tag').forEach(function (tagEl) {
    var duration = computeDuration(tagEl.textContent);
    if (!duration) return;
    var span = document.createElement('span');
    span.className = 'timeline-duration';
    span.textContent = duration;
    tagEl.insertAdjacentElement('afterend', span);
  });
}());
