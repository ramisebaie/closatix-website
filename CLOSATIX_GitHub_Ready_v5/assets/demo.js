/* ==================================================================
   CLOSATIX — Interactive Sales Demo
   Timeline engine + stage scaling + transport controls.

   How it works
     · Each scene owns a duration. JS is only responsible for deciding
       which scene is on screen and how far through the reel we are.
     · Everything *inside* a scene is choreographed in CSS, keyed off
       the .is-active class and a --i index per element. Adding a step
       to a scene is a CSS change, not a JS one.
     · Pausing freezes the clock and the CSS animations together, so a
       paused frame is a clean still — useful when grabbing stills for
       a deck.
   ================================================================== */
(function () {
  "use strict";

  /* ---------- Reel ----------
     Durations are milliseconds of screen time per scene. Total is kept
     inside the 45–60 second window the demo is designed for. */
  var SCENES = [
    { id: "lead",    ms:  9000, label: "New lead" },
    { id: "qualify", ms: 10500, label: "Qualification" },
    { id: "crm",     ms:  9000, label: "CRM" },
    { id: "notify",  ms:  7000, label: "Notification" },
    { id: "follow",  ms:  9500, label: "Follow-up" },
    { id: "final",   ms: 10000, label: "Result" }
  ];

  var IDLE_MS = 2200;   // how long before the controls fade away while playing

  /* ---------- Elements ---------- */
  var body      = document.body;
  var stage     = document.getElementById("stage");
  var scenesEl  = document.getElementById("scenes");
  var chapters  = document.getElementById("chapters");
  var fill      = document.getElementById("progressFill");
  var timeNow   = document.getElementById("timeNow");
  var timeAll   = document.getElementById("timeAll");
  var btnPlay   = document.getElementById("btnPlay");
  var btnRestart= document.getElementById("btnRestart");
  var btnFull   = document.getElementById("btnFull");
  var viewport  = document.getElementById("viewport");

  var sceneEls = {};
  Array.prototype.forEach.call(document.querySelectorAll("[data-scene]"), function (el) {
    sceneEls[el.getAttribute("data-scene")] = el;
  });

  var TOTAL = SCENES.reduce(function (sum, s) { return sum + s.ms; }, 0);

  /* Cumulative start time of each scene, so elapsed → scene is a lookup. */
  var starts = [];
  (function () {
    var acc = 0;
    SCENES.forEach(function (s) { starts.push(acc); acc += s.ms; });
  })();

  /* ---------- State ---------- */
  var elapsed = 0;        // ms into the reel
  var playing = false;
  var lastTick = 0;
  var current = -1;
  var idleTimer = null;
  var rafId = null;

  /* ---------- Chapter markers ---------- */
  var chapterEls = SCENES.map(function (s) {
    var el = document.createElement("span");
    el.className = "chapter";
    el.title = s.label;
    chapters.appendChild(el);
    return el;
  });

  /* ---------- Stage scaling ----------
     The stage is authored at 1920x1080 and scaled as one unit, so a
     capture at 1080p matches the design exactly at any window size. */
  function fitStage() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var scale = Math.min(vw / 1920, vh / 1080);
    var offsetX = (vw - 1920 * scale) / 2;
    var offsetY = (vh - 1080 * scale) / 2;
    stage.style.transform =
      "translate(" + offsetX.toFixed(2) + "px," + offsetY.toFixed(2) + "px) scale(" + scale + ")";

    /* When the demo is embedded in a narrow column — a phone, mostly — the
       whole 1920x1080 stage is drawn very small, and type set for a full
       screen becomes unreadable. Rather than crop or break the 16:9 frame,
       the layout is told how small it is being drawn and responds by using
       more of the canvas for text. Same composition, larger inside it. */
    var density = scale < 0.34 ? "compact" : (scale < 0.62 ? "medium" : "full");
    if (document.documentElement.getAttribute("data-density") !== density) {
      document.documentElement.setAttribute("data-density", density);
    }
  }

  /* ---------- Time ---------- */
  function clock(ms) {
    var total = Math.max(0, Math.round(ms / 1000));
    var m = Math.floor(total / 60);
    var s = total % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  /* ---------- Scene switching ---------- */
  function sceneAt(ms) {
    for (var i = SCENES.length - 1; i >= 0; i--) {
      if (ms >= starts[i]) return i;
    }
    return 0;
  }

  function showScene(index) {
    if (index === current) return;
    current = index;
    SCENES.forEach(function (s, i) {
      sceneEls[s.id].classList.toggle("is-active", i === index);
    });
  }

  /* Wipes every running animation so the reel can start over cleanly.
     Removing .is-active detaches the animations; the reflow makes the
     browser commit that before we re-attach them. */
  function resetScenes() {
    SCENES.forEach(function (s) { sceneEls[s.id].classList.remove("is-active"); });
    current = -1;
    void scenesEl.offsetWidth;
  }

  /* ---------- Render ---------- */
  function render() {
    var index = sceneAt(elapsed);
    showScene(index);

    fill.style.width = (elapsed / TOTAL * 100).toFixed(3) + "%";
    timeNow.textContent = clock(elapsed);

    chapterEls.forEach(function (el, i) {
      var into = elapsed - starts[i];
      el.classList.toggle("is-done", i < index);
      el.classList.toggle("is-live", i === index);
      if (i === index) {
        el.style.setProperty("--p", Math.min(1, Math.max(0, into / SCENES[i].ms)).toFixed(3));
      } else if (i > index) {
        el.style.setProperty("--p", "0");
      }
    });
  }

  function tellParent(state) {
    if (window.parent === window) return;
    try {
      window.parent.postMessage({ channel: "closatix-demo", action: "state", state: state }, "*");
    } catch (e) {}
  }

  /* ---------- Transport ---------- */
  function tick(now) {
    if (!playing) return;
    if (!lastTick) lastTick = now;
    var delta = now - lastTick;
    lastTick = now;

    /* A long delta means the tab was backgrounded — don't skip the reel
       forward by however long the viewer was away. */
    if (delta > 250) delta = 16;

    elapsed += delta;

    if (elapsed >= TOTAL) {
      elapsed = TOTAL;
      render();
      pause();
      body.classList.remove("is-idle");
      return;
    }

    render();
    rafId = requestAnimationFrame(tick);
  }

  function play() {
    if (playing) return;
    if (elapsed >= TOTAL) { restart(); return; }
    playing = true;
    lastTick = 0;
    body.classList.add("is-playing");
    body.classList.remove("is-paused");
    btnPlay.setAttribute("aria-label", "Pause");
    tellParent("playing");
    armIdle();
    rafId = requestAnimationFrame(tick);
  }

  function pause() {
    playing = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    body.classList.remove("is-playing", "is-idle");
    body.classList.add("is-paused");
    btnPlay.setAttribute("aria-label", "Play");
    clearTimeout(idleTimer);
    tellParent("paused");
  }

  function toggle() { playing ? pause() : play(); }

  function restart() {
    pause();
    elapsed = 0;
    resetScenes();
    render();
    play();
  }

  function jump(direction) {
    var index = sceneAt(elapsed);
    var target;
    if (direction < 0) {
      /* first press rewinds to the start of the current scene */
      target = (elapsed - starts[index] > 900) ? index : Math.max(0, index - 1);
    } else {
      target = Math.min(SCENES.length - 1, index + 1);
    }
    var wasPlaying = playing;
    pause();
    resetScenes();
    elapsed = starts[target];
    render();
    if (wasPlaying) play();
  }

  /* ---------- Idle handling ---------- */
  function armIdle() {
    clearTimeout(idleTimer);
    body.classList.remove("is-idle");
    if (!playing) return;
    idleTimer = setTimeout(function () {
      if (playing) body.classList.add("is-idle");
    }, IDLE_MS);
  }

  /* ---------- Fullscreen ---------- */
  function toggleFullscreen() {
    var root = document.documentElement;
    if (!document.fullscreenElement) {
      (root.requestFullscreen || root.webkitRequestFullscreen || function () {}).call(root);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen || function () {}).call(document);
    }
  }

  /* ---------- Logo fallback ----------
     Same behaviour as the website: if the file is missing, show the
     wordmark rather than a broken image. */
  function initLogoFallback() {
    Array.prototype.forEach.call(document.querySelectorAll(".brand__logo"), function (img) {
      function fallBack() {
        if (img.hidden) return;
        img.hidden = true;
        var mark = img.parentNode.querySelector(".brand__wordmark");
        if (mark) mark.hidden = false;
      }
      img.addEventListener("error", fallBack);
      if (img.complete && img.naturalWidth === 0) fallBack();
    });
  }

  /* ---------- Wiring ---------- */
  btnPlay.addEventListener("click", toggle);
  btnRestart.addEventListener("click", restart);
  btnFull.addEventListener("click", toggleFullscreen);

  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    switch (e.key) {
      case " ": case "k": case "K": e.preventDefault(); toggle(); break;
      case "r": case "R": e.preventDefault(); restart(); break;
      case "f": case "F": e.preventDefault(); toggleFullscreen(); break;
      case "ArrowRight": e.preventDefault(); jump(1); break;
      case "ArrowLeft":  e.preventDefault(); jump(-1); break;
      default: return;
    }
    armIdle();
  });

  ["mousemove", "pointerdown", "touchstart"].forEach(function (evt) {
    window.addEventListener(evt, armIdle, { passive: true });
  });

  /* Tapping the stage itself toggles playback — convenient on a laptop
     while presenting, and harmless during a recording. */
  viewport.addEventListener("click", function (e) {
    if (e.target.closest(".controls") || e.target.closest("a")) return;
    toggle();
  });

  window.addEventListener("resize", fitStage);
  document.addEventListener("fullscreenchange", fitStage);

  /* ---------- Boot ---------- */
  fitStage();
  initLogoFallback();
  timeAll.textContent = clock(TOTAL);
  render();

  /* ---------- Embedded mode ----------
     When the demo runs inside the website it does not start itself. The page
     watches for the section scrolling into view and drives playback through
     postMessage, so the reel is not burning frames somewhere off screen. */
  var params = new URLSearchParams(window.location.search);
  var embedded = params.get("embed") === "1";

  if (embedded) {
    body.classList.add("is-embedded", "is-paused");

    window.addEventListener("message", function (event) {
      var data = event.data;
      if (!data || data.channel !== "closatix-demo") return;
      switch (data.action) {
        case "play":    play(); break;
        case "pause":   pause(); break;
        case "restart": restart(); break;
      }
    });

    /* Tell the parent we are ready to take instructions. */
    try {
      window.parent.postMessage({ channel: "closatix-demo", action: "ready" }, "*");
    } catch (e) {}

  } else if (params.get("autoplay") !== "0") {
    /* Standalone — autoplay, which is what you want when recording. */
    setTimeout(play, 600);
  } else {
    body.classList.add("is-paused");
  }
})();
