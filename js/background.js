/* background.js: curvas animadas no fundo e mira com coordenadas do plano */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  (function () {
    var c = document.getElementById("field"), ctx = c.getContext("2d");
    var coord = document.getElementById("coord");
    var w, h, dpr, mouse = null, t0 = performance.now();
    var css = getComputedStyle(document.documentElement);
    function rgb(name) { return css.getPropertyValue(name).trim(); }
    var A = rgb("--curve-a"), B = rgb("--curve-b");
    var finePointer = window.matchMedia("(pointer: fine)").matches;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    }

    function wave(tt, y0, amp, freq, speed, color, alpha, width) {
      ctx.beginPath();
      for (var x = -10; x <= w + 10; x += 6) {
        var y = y0 + amp * Math.sin(x * freq + tt * speed) + amp * 0.35 * Math.sin(x * freq * 2.3 - tt * speed * 0.7);
        x === -10 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(" + color + "," + alpha + ")";
      ctx.lineWidth = width; ctx.stroke();
    }

    function lissajous(tt, cx, cy, ax, ay, a, b, color, alpha) {
      ctx.beginPath();
      for (var i = 0; i <= 400; i++) {
        var s = (i / 400) * 2 * Math.PI;
        var x = cx + ax * Math.sin(a * s + tt * 0.15), y = cy + ay * Math.sin(b * s);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = "rgba(" + color + "," + alpha + ")";
      ctx.lineWidth = 1; ctx.stroke();
    }

    function draw(now) {
      var tt = reduce ? 0 : (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      wave(tt, h * 0.22, 26, 0.006, 0.35, A, 0.16, 1.2);
      wave(tt, h * 0.58, 38, 0.004, -0.25, B, 0.12, 1.2);
      wave(tt, h * 0.86, 20, 0.009, 0.45, A, 0.1, 1);
      lissajous(tt, w * 0.88, h * 0.18, 70, 54, 3, 2, B, 0.14);
      lissajous(tt, w * 0.08, h * 0.72, 56, 56, 5, 4, A, 0.11);

      if (mouse) {
        var g = 24;
        var sx = Math.round(mouse.x / g) * g, sy = Math.round(mouse.y / g) * g;
        ctx.strokeStyle = "rgba(" + A + ",0.22)"; ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath(); ctx.moveTo(sx + 0.5, 0); ctx.lineTo(sx + 0.5, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, sy + 0.5); ctx.lineTo(w, sy + 0.5); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(" + A + ",0.75)";
        ctx.beginPath(); ctx.arc(sx + 0.5, sy + 0.5, 3, 0, Math.PI * 2); ctx.fill();
        var X = ((sx - w / 2) / 120).toFixed(1).replace(".", ","), Y = ((h / 2 - sy) / 120).toFixed(1).replace(".", ",");
        coord.textContent = "(" + X + "; " + Y + ")";
        coord.style.transform = "translate(" + (sx + 10) + "px," + (sy - 30) + "px)";
      }
    }

    var running = true;
    function loop(now) { if (!running) return; draw(now); requestAnimationFrame(loop); }
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden && !reduce;
      if (running) requestAnimationFrame(loop);
    });

    if (finePointer) {
      window.addEventListener("mousemove", function (e) {
        mouse = { x: e.clientX, y: e.clientY }; coord.classList.add("on");
        if (reduce) draw(performance.now());
      });
      document.addEventListener("mouseleave", function () { mouse = null; coord.classList.remove("on"); draw(performance.now()); });
    }
    window.addEventListener("resize", resize);
    resize();
    if (!reduce) requestAnimationFrame(loop); else running = false;
  })();
})();
