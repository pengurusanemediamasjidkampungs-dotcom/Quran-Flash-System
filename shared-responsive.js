/* ==========================================================================
   SHARED RESPONSIVE JS — Viewport fix, orientation watcher, resize handler
   ========================================================================== */

(function() {
  'use strict';

  /* ─── 1. Viewport Height Fix (iOS Safari) ─── */
  function setVh() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
  }

  /* ─── 2. Orientation Detection ─── */
  function setOrientation() {
    var isLandscape = window.innerWidth > window.innerHeight;
    document.documentElement.setAttribute('data-orientation', isLandscape ? 'landscape' : 'portrait');
  }

  /* ─── 3. Screen Size Class ─── */
  function setScreenClass() {
    var w = window.innerWidth;
    var cls = '';
    if (w <= 360) cls = 'xs';
    else if (w <= 480) cls = 'sm';
    else if (w <= 640) cls = 'md';
    else if (w <= 768) cls = 'lg';
    else if (w <= 1024) cls = 'xl';
    else cls = 'xxl';

    var html = document.documentElement;
    html.removeAttribute('data-screen');
    html.setAttribute('data-screen', cls);
  }

  /* ─── 4. Init & Listen ─── */
  function onResize() {
    setVh();
    setOrientation();
    setScreenClass();
  }

  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', function() {
    setTimeout(onResize, 150);
  });

  // Run on load
  if (document.readyState === 'complete') {
    onResize();
  } else {
    window.addEventListener('load', onResize);
  }
})();
