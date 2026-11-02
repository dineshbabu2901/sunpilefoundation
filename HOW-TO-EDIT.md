# Sun Pile Foundation · Editing V7

## Quick start

- `index.html`: home text, service cards, carousel and bottom project-photo CTA.
- `contact/index.html`: phone, address, email form and embedded map.
- `assets/css/theme.css`: primary orange/navy theme variables.
- `assets/css/v7.css`: new contact, map and floating-email styles.
- `assets/css/premium.css`: animated hero, tag carousel and scroll effects.
- `assets/js/site-settings.js`: WhatsApp number, email for generated messages and official social profile links. The visible HTML address and phone links must also be changed if the business details change.
- `assets/js/premium.js`: carousel timing and behaviour.
- `assets/js/v7.js`: copy-address control. No libraries.

## Change map to a verified location

Find `id="office-map"` in `contact/index.html`. The `iframe src=` searches for the provided office address. If you get a verified office map link or official Google Maps embed code, replace **only** the `iframe src` value and update the directions link. Verify the pin first. Keep the `title`, `loading="lazy"` and fallback external map links.

## Add future domain

Your desired future domain is `sunpilefoundation.com`, but this source code cannot purchase or activate it. The package is set to use that **future production domain in SEO URLs**. While publishing the test website on GitHub Pages under `dineshbabu2901.github.io/sunfile/`, run `python tools/use-domain.py github` first if you want your staging URLs to be the canonical. Later, **after** the custom domain works, run `python tools/use-domain.py production`.

## Remove animation

Open `assets/css/premium.css` and `assets/css/v7.css`; the movement rules live under the sections marked for animation. `prefers-reduced-motion` is already respected. The map, photo cards and enquiry form do not require animation.

## Service pages

The only advertised services are: Rotary Cast-in-Situ Piles, Bored DMC Piles, Under-Reamed Piles and Pile Load Testing. Don't add unsupported services or engineering guarantees without confirmation.

## Deploy

Back up the existing site. Copy all the new files to your hosting site's public root (the folder that contains `index.html`). Do not delete a hosting-managed `.git` or `CNAME`. If you're using GitHub Pages with a purchased custom domain, first follow **GitHub Pages → Custom domain** instructions.


## V8 animation and assistant edits

- **Make photos brighter or softer:** In `assets/css/v8.css`, edit `.hero-media:after` and `.hero-slide img`.
- **Animate the blue panel:** `.v8-hero-blueprint`, `.v8-orbit`, and `.v8-scan` in `assets/css/v8.css`.
- **Change carousel photos:** `index.html`, search for `data-hero-carousel`.
- **Change homepage video previews:** `index.html`, search for `v8-video-feature`.
- **Change assistant questions and answers:** `assets/js/v8.js`, edit `const replies`. This is a website FAQ assistant, *not* a cloud AI chatbot.
- **Hide assistant entirely:** remove the `assets/js/v8.js` script tag on the relevant pages, or remove its creation code; removing CSS alone does not disable functionality.
- **Control all motion:** visitors with reduced-motion enabled see a still version automatically.
