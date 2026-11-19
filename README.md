# Rehabs and Diagnostic Center Web 1

Static site for a physiotherapy, rehab and diagnostics centre ("Axis Rehab & Diagnostics", Indiranagar, Bengaluru — placeholder brand, address and phone).

## Run
Open `index.html` directly, or serve the folder:

    npx serve .        (or)        python -m http.server 8080

## Structure
- `index.html` – single page: hero, departments, conditions selector, recovery steps, tests & prices, first visit, programs, referrals, booking form, visit us
- `css/styles.css` – all styles (palette, type scale and radii as CSS variables at the top)
- `css/fonts.css` + `assets/fonts/` – self-hosted Familjen Grotesk and Figtree
- `js/main.js` – mobile menu, conditions tabs, test filter, lazy second video, form validation
- `assets/img/` – 12 photos, each as 800w and 1400w WebP, plus 2 video posters
- `assets/video/` – 2 clips (hero autoplay, second loads only when scrolled into view), muted, H.264, ~0.7 MB total

## Media credits (free for commercial use)
- Photos: Pexels (Funkcinės terapijos centras, Ryutaro Tsukata, Anna Shvets, MART PRODUCTION, Tima Miroshnichenko, Kampus Production, and others)
- Videos: Mixkit (#13039 shoulder physiotherapy, #13040 doctor explaining with spine model)

## Before going live
- Replace the brand name, address, phone/WhatsApp numbers, prices and hours with the client's real details
- The booking form validates and shows a confirmation but does not send anywhere yet — wire it to an API, Formspree, or a WhatsApp redirect
