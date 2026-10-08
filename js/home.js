/* home.js: comportamentos exclusivos do portfólio */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Curva polar do hero */
  (function () {
    var path = document.getElementById("curve"), path2 = document.getElementById("curve2");
    var dot = document.getElementById("dot"), ticks = document.getElementById("ticks");
    var cx = 160, cy = 160, R = 132;
    function pt(t, k, a, rr) { var r = rr * (1 + a * Math.sin(k * t)); return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; }
    function build(k, a, rr) {
      var d = "";
      for (var i = 0; i <= 360; i++) { var p = pt(2 * Math.PI * i / 360, k, a, rr); d += (i ? " L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }
      return d + " Z";
    }
    path.setAttribute("d", build(8, 0.09, R));
    path2.setAttribute("d", build(5, 0.06, R + 18));
    var t = "";
    for (var i = 20; i < 320; i += 20) {
      if (i === 160) continue;
      t += '<line class="tick" x1="' + i + '" y1="156" x2="' + i + '" y2="164"/><line class="tick" x1="156" y1="' + i + '" x2="164" y2="' + i + '"/>';
    }
    ticks.innerHTML = t;
    if (!reduce) {
      var len = path.getTotalLength();
      path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      path.classList.add("draw");
      var start = null;
      (function move(ts) {
        if (!start) start = ts;
        var th = ((ts - start) / 9000) * 2 * Math.PI;
        var p = pt(th, 8, 0.09, R);
        dot.setAttribute("cx", p[0].toFixed(1)); dot.setAttribute("cy", p[1].toFixed(1));
        requestAnimationFrame(move);
      })(performance.now());
    } else {
      var p = pt(-Math.PI / 4, 8, 0.09, R);
      dot.setAttribute("cx", p[0]); dot.setAttribute("cy", p[1]);
    }
  })();

  /* Texto digitado */
  (function () {
    var el = document.getElementById("typed");
    var lines = ["Programo principalmente em C++.", "Desenvolvo sites e aplicações.", "Automatizo processos em Python.", "Construo fluxos no Power Automate.", "Resolvo problemas com matemática."];
    if (reduce) return;
    var li = 0, ci = lines[0].length, deleting = true;
    function tick() {
      var full = lines[li];
      if (deleting) {
        ci--; el.textContent = full.slice(0, ci);
        if (ci <= 0) { deleting = false; li = (li + 1) % lines.length; }
        setTimeout(tick, 28);
      } else {
        full = lines[li]; ci++; el.textContent = full.slice(0, ci);
        if (ci >= full.length) { deleting = true; setTimeout(tick, 2400); } else setTimeout(tick, 55);
      }
    }
    setTimeout(tick, 2800);
  })();

  /* Aparição dos blocos e progresso da trajetória */
  (function () {
    var els = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { rootMargin: "0px 0px -12% 0px" });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add("in"); });
    }

    var tl = document.getElementById("timeline"), bar = document.getElementById("progress");
    function prog() {
      var r = tl.getBoundingClientRect(), total = r.height - 16;
      var seen = Math.min(Math.max(window.innerHeight * 0.6 - r.top, 0), total);
      bar.style.height = (reduce ? total : seen) + "px";
    }
    window.addEventListener("scroll", prog, { passive: true });
    window.addEventListener("resize", prog);
    prog();
  })();

  /* Projetos: filtros e detalhes */
  (function () {
    var cards = [].slice.call(document.querySelectorAll(".project"));
    var buttons = [].slice.call(document.querySelectorAll(".filter"));
    buttons.forEach(function (b) {
      var f = b.dataset.filter;
      var n = f === "all" ? cards.length : cards.filter(function (c) { return c.dataset.cat.split(" ").indexOf(f) > -1; }).length;
      b.querySelector(".count").textContent = n;
      b.addEventListener("click", function () {
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        cards.forEach(function (c) {
          var show = f === "all" || c.dataset.cat.split(" ").indexOf(f) > -1;
          if (show && c.classList.contains("hide")) {
            c.classList.remove("hide");
            if (!reduce) { c.classList.add("enter"); requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.remove("enter"); }); }); }
          } else if (!show) {
            c.classList.add("hide");
          }
        });
      });
    });

    cards.forEach(function (c) {
      var btn = c.querySelector(".toggle");
      function toggle() {
        var open = !c.classList.contains("open");
        c.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
      }
      btn.addEventListener("click", function (e) { e.stopPropagation(); toggle(); });
      c.addEventListener("click", function (e) {
        if (e.target.closest("a") || window.getSelection().toString()) return;
        toggle();
      });
      c.style.cursor = "pointer";
    });
  })();

  /* Copiar e-mail */
  (function () {
    var btn = document.getElementById("copyEmail"), msg = document.getElementById("copied");
    btn.addEventListener("click", function () {
      var email = "arthurcordeirofer@gmail.com";
      function ok() { msg.textContent = "E-mail copiado."; setTimeout(function () { msg.textContent = ""; }, 2500); }
      if (navigator.clipboard) navigator.clipboard.writeText(email).then(ok, function () { msg.textContent = email; });
      else msg.textContent = email;
    });
  })();
})();
