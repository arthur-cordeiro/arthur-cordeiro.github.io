/* nav.js: destaca na barra de navegação a seção visível (portfólio) ou a página atual (subpáginas) */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var list = document.getElementById("navLinks");
  var ind = document.getElementById("navIndicator");
  if (!list || !ind) return;
  var links = [].slice.call(list.querySelectorAll("a"));

  function mark(link) {
    links.forEach(function (a) { a.classList.toggle("active", a === link); });
    if (!link) { ind.style.width = "0"; return; }
    ind.style.width = link.offsetWidth - 24 + "px";
    ind.style.transform = "translateX(" + (link.offsetLeft + 12) + "px)";
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2, behavior: reduce ? "auto" : "smooth" });
    }
  }

  /* Subpáginas: o link da página atual vem marcado com aria-current="page" */
  var current = list.querySelector('a[aria-current="page"]');
  var anchors = links.filter(function (a) { return a.getAttribute("href").charAt(0) === "#"; });
  if (current || !anchors.length) {
    mark(current);
    window.addEventListener("resize", function () { mark(current); });
    return;
  }

  /* Portfólio: acompanha a seção visível durante a rolagem */
  var sections = anchors.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function onScroll() {
    var y = window.scrollY + window.innerHeight * 0.35, active = null;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= y) active = anchors[i]; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) active = anchors[anchors.length - 1];
    mark(active);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
