(function() {
  'use strict';

  // Configuration
  const WHEEL_URL = (function() {
    const scripts = document.getElementsByTagName('script');
    const thisScript = scripts[scripts.length - 1];
    const scriptSrc = thisScript.src;
    const url = new URL(scriptSrc);
    return url.origin + '/wheel';
  })();

  // Find target container
  const container = document.getElementById('tss-wheel');

  if (!container) {
    console.error('TSS Wheel: Container element with id "tss-wheel" not found');
    return;
  }

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = WHEEL_URL;
  iframe.style.width = '100%';
  iframe.style.height = '600px';
  iframe.style.border = 'none';
  iframe.style.display = 'block';
  iframe.setAttribute('title', 'TSS Services Wheel');
  iframe.setAttribute('loading', 'lazy');

  // Responsive height adjustment
  const adjustHeight = function() {
    const width = container.offsetWidth;
    // Maintain aspect ratio approximately
    iframe.style.height = Math.max(400, Math.min(width, 800)) + 'px';
  };

  // Initial adjustment
  adjustHeight();

  // Adjust on resize
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustHeight, 150);
  });

  // Insert iframe
  container.appendChild(iframe);

  // Optional: Listen for messages from iframe (for future enhancements)
  window.addEventListener('message', function(event) {
    if (event.origin !== new URL(WHEEL_URL).origin) return;

    // Handle messages from wheel iframe if needed
    if (event.data && event.data.type === 'tss-wheel-resize') {
      iframe.style.height = event.data.height + 'px';
    }
  });
})();
