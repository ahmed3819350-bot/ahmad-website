(function () {
  // Matches: £1,500 | 18% | 200+ | 4× | 2×3×2 | 10⁹ | 1st | 2nd | 890 N | 80 kg | 0.8 km | 2100 Nm | 2200 RPM
  // Excludes: numbers preceded by / (e.g. S/4 HANA) or followed by D (e.g. 3D)
  var RE = /£[\d,]+(?:\.\d+)?[km]?|(?<![\\/])(?<!NEMA-)\d[\d,]*(?:\.\d+)?(?:[×]\d+)*(?:[⁰¹²³⁴⁵⁶⁷⁸⁹]+)?(?:[+%×]|st\b|nd\b|rd\b|th\b)?(?!D\b)(?!-DOF\b)(?:\s*(?:Nm\b|N\b|RPM\b|kg\b|km\b|mm\b|cm\b|kW\b|MPa\b|kN\b|°C\b|tonnes?\b|miles?\b|years?\b))?/g;

  function wrapTextNode(textNode) {
    var text = textNode.nodeValue;
    RE.lastIndex = 0;
    if (!RE.test(text)) return;
    RE.lastIndex = 0;

    var frag = document.createDocumentFragment();
    var lastIndex = 0;
    var match;
    while ((match = RE.exec(text)) !== null) {
      if (match[0].length === 0) { RE.lastIndex++; continue; }
      if (match.index > lastIndex) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      var strong = document.createElement('strong');
      strong.textContent = match[0];
      frag.appendChild(strong);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
    textNode.parentNode.replaceChild(frag, textNode);
  }

  document.querySelectorAll('.project-bullets li, .timeline-bullets li').forEach(function (li) {
    if (li.style.background) return; // skip dummy/placeholder bullets
    // Walk only text nodes to avoid touching HTML attributes
    var walker = document.createTreeWalker(li, NodeFilter.SHOW_TEXT, null, false);
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(wrapTextNode);
  });
}());
