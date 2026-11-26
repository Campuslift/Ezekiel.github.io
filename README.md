# CampusLift TT

Six-page responsive student carpool site for Trinidad and Tobago schools.
CPTR331 Web Development, Assignment 5.

Live site: https://darkshadow1451.github.io/Ezekiel.github.io/
Code: this GitHub repository.

## Pages

index, find-ride, offer-ride, safety, about, contact. Every page links to every other page through the main menu.

## Folder structure

- `/css` styles
- `/js` scripts
- `/img` images (photos are in `/img/photos`, screenshots in `/img/screenshots`)
- `/media` media files (none used yet)

## CDN provider and configuration

The site is hosted on **GitHub Pages**, which serves files through a global CDN (Fastly).
Bootstrap and Google Fonts also come from public CDNs (jsDelivr, Google).

Cache control:

- GitHub Pages sets its own cache headers and does not let me change them.
- `_headers` is included for hosts that read it (Netlify, Cloudflare Pages). It sets css, js and img to `public, max-age=31536000, immutable` and html to `public, max-age=0, must-revalidate`. GitHub Pages ignores this file.
- Asset versioning: CSS and JS links end in `?v=1.5`. Change the number when a file changes so browsers fetch the new copy.

## Frameworks and libraries

- Bootstrap 5.3.3 (layout, navbar, forms, utilities)
- Google Fonts: Bricolage Grotesque and Atkinson Hyperlegible
- Plain JavaScript (no build step)

## Interactive features (JavaScript)

- Fare calculator: base fee + rate per km, split between passengers
- Contact form validation for name, email, address and phone
- Photos fall back to drawings if an image file is missing

## Performance

- Lazy loading on images below the first screen (`loading="lazy"`)
- `defer` on all scripts so they do not block the page
- Width and height set on images to avoid layout jumps
- Versioned css and js links for cache busting

Results (fill in after testing):

| Test                     | Without CDN | With CDN (GitHub Pages) |
| ------------------------ | ----------- | ----------------------- |
| Lighthouse Performance   |             |                         |
| Lighthouse Accessibility |             |                         |
| Lighthouse SEO           |             |                         |
| Load time (WebPageTest)  |             |                         |

Screenshots of the tests are in `/img/screenshots`.

## Accessibility and SEO

- Semantic tags: header, nav, main, section, article, footer
- Skip link, visible focus outline, ARIA labels, `aria-live` fare result, `aria-current` on the active menu link
- Alt text on every image (empty alt on decorative ones)
- Unique title, description and canonical link on each page
- JSON-LD structured data on the home page
- `robots.txt` and `sitemap.xml` listing all six pages

## Setup checklist

1. Replace `YOUR_ID` in `contact.html` with a Formspree form ID.
2. Done: the canonical links, `sitemap.xml`, `robots.txt` and the JSON-LD in `index.html` use the live address above.
3. Add the test results and screenshots.
