# CampusLift TT

Six-page responsive student carpool site for Trinidad and Tobago schools.
CPTR331 Web Development, Assignment 5.

- CDN version: https://darkshadow1451.github.io/Ezekiel.github.io/ (GitHub Pages, served through Fastly)
- Non-CDN version: https://campuslift.liveblog365.com/ (ProFreeHost, single origin server)
- Performance report: `performance-report.html`
- Code: this GitHub repository.

## Pages

index, find-ride, offer-ride, safety, about, contact. Every page links to every other page through the main menu. `performance-report.html` is the assignment report and is not part of the site menu.

## Folder structure

- `/css` styles
- `/js` scripts
- `/img` images (photos in `/img/photos`, test screenshots in `/img/screenshots`)
- `/media` media files (none used yet)

## CDN provider and configuration

The CDN version is hosted on **GitHub Pages**, which delivers files through a global CDN (Fastly). Bootstrap and Google Fonts also load from public CDNs (jsDelivr, Google).

The comparison version runs on **ProFreeHost**, a free shared host with a single origin server. Its HTML responses carry Cloudflare headers added by the host, but its CSS and images are served directly by `openresty` with no CDN headers, so it works as the no-CDN baseline.

Cache control:

- GitHub Pages sets its own cache headers and ignores `_headers`.
- `_headers` is included for hosts that read it (Netlify, Cloudflare Pages). It sets css, js and img to `public, max-age=31536000, immutable` and html to `public, max-age=0, must-revalidate`.
- ProFreeHost sends `max-age=2592000` (30 days) on CSS and images.
- Asset versioning: CSS and JS links end in `?v=1.6`. Change the number when a file changes so browsers fetch the new copy.

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

### Results (26 November 2026)

DebugBear Website Speed Test, US East, desktop, same settings on both sites.

| Metric                   | Without CDN (ProFreeHost) | With CDN (GitHub Pages) |
| ------------------------ | ------------------------- | ----------------------- |
| Lighthouse Performance   | 99                        | 100                     |
| Time to first byte       | 302 ms                    | 51 ms                   |
| First Contentful Paint   | 756 ms                    | 325 ms                  |
| Largest Contentful Paint | 876 ms                    | 369 ms                  |
| Speed Index              | 0.7 s                     | 0.3 s                   |
| Total Blocking Time      | 0 ms                      | 0 ms                    |
| Page weight              | 529 KB                    | 389 KB                  |

Chrome DevTools Lighthouse on the CDN version: mobile 100 / 100 / 100 / 100 (Performance, Accessibility, Best Practices, SEO); desktop 98 / 100 / 100 / 100.

The full comparison, analysis and limitations are in `performance-report.html`. Screenshots are in `/img/screenshots`.

## Accessibility and SEO

- Semantic tags: header, nav, main, section, article, footer
- Skip link, visible focus outline, ARIA labels, `aria-live` fare result, `aria-current` on the active menu link
- Alt text on every image (empty alt on decorative ones)
- Unique title, description and canonical link on each page
- JSON-LD structured data on the home page
- `robots.txt` and `sitemap.xml` listing all six pages

## Setup checklist

1. Contact form posts to Formspree (form ID mdegjldd).
2. Canonical links, `sitemap.xml`, `robots.txt` and the JSON-LD use the GitHub Pages address above.
3. Add DebugBear screenshots to `img/screenshots/` (see the report's Limitations section for items still to re-test).
