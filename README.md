# CampusLift TT

Six-page responsive student carpool site for Trinidad and Tobago schools.
CPTR331 Web Development, Assignment 5.

## Pages

index, find-ride, offer-ride, safety, about, contact. Every page links to every other page through the main menu.

## Folder structure

- `/css` styles
- `/js` scripts
- `/img` images (photos are in `/img/photos`)
- `/media` media files (none used yet)

## CDN provider and configuration

Netlify (global CDN), deployed by connecting the GitHub repo.
`_headers` sets the cache rules:

- `/css/*`, `/js/*`, `/img/*`: `public, max-age=31536000, immutable` (1 year)
- `/*.html`: `public, max-age=0, must-revalidate` (always checked for updates)

Asset versioning: CSS and JS links end in `?v=1.4`. Change the number when a file changes so browsers fetch the new copy.
Bootstrap, Leaflet and Google Fonts are also loaded from public CDNs (jsDelivr, unpkg, Google).

## Frameworks and libraries

- Bootstrap 5.3.3 (layout, navbar, forms, utilities)
- Leaflet 1.9.4 with CARTO map tiles (find-ride map)
- Google Fonts: Bricolage Grotesque and Atkinson Hyperlegible
- Plain JavaScript (no build step)

## Interactive features (JavaScript)

- Fare calculator: base fee + rate per km, split between passengers
- Clickable, draggable map pin that fills in the distance (road distance from OSRM, with a straight-line estimate as backup)
- Contact form validation for name, email, address and phone
- Photos fall back to drawings if an image file is missing

## Performance

- Lazy loading on images below the first screen (`loading="lazy"`)
- `defer` on all scripts so they do not block the page
- Width and height set on images to avoid layout jumps
- Long-lived cache headers on css, js and img

Results (fill in after deploying):

| Test                    | Without CDN | With CDN |
| ----------------------- | ----------- | -------- |
| Lighthouse Perf.        |             |          |
| Lighthouse Access.      |             |          |
| Lighthouse SEO          |             |          |
| Load time (WebPageTest) |             |          |

## Accessibility and SEO

- Semantic tags: header, nav, main, section, article, footer
- Skip link, visible focus outline, ARIA labels, `aria-live` fare result, `aria-current` on the active menu link
- Alt text on every image (empty alt on decorative ones)
- Unique title, description and canonical link on each page
- JSON-LD structured data on the home page
- `robots.txt` and `sitemap.xml` listing all six pages

## Setup before deploying

1. Replace `YOUR_ID` in `contact.html` with a Formspree form ID.
2. Replace `campuslift-tt.example.com` in the canonical links, `sitemap.xml` and `robots.txt` with the real domain.
3. Add Lighthouse screenshots to the table above.
