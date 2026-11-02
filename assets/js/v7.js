/* SUN PILE FOUNDATION V7
 * Only tiny enhancements. All essential content works without JavaScript.
 * Map and email links remain accessible; no geolocation or data collection.
 */
(() => {
  'use strict';
  const copy = document.querySelector('[data-copy-address]');
  if (copy) {
    const status = document.getElementById('copy-address-status');
    copy.addEventListener('click', async () => {
      const address = copy.getAttribute('data-copy-address');
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(address);
        if (status) status.textContent = 'Address copied. Paste it into your maps or messages app.';
      } catch (err) {
        // Many preview environments require HTTPS for clipboard access.
        if (status) status.textContent = 'Select the office address above to copy it, or use OPEN GOOGLE MAPS.';
      }
    });
  }
})();
