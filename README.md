# ZeroBook Infinity — Product Showcase Website

A fully static, responsive showcase site for the **ZeroBook Infinity** concept laptop
(zero weight · infinite battery · no screen), deployed to **GitHub Pages with GitHub Actions**.

No frameworks, no build step — just HTML, CSS and vanilla JavaScript.

---

## 1. Project structure

```
zerobook/
├── index.html                    # The whole single-page site
├── README.md
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD: validate → package → deploy to Pages
└── assets/
    ├── css/styles.css            # Theme, layout, animations, responsive rules
    ├── js/main.js                # Navbar, menu, reveal, tabs, lightbox, form
    └── img/
        ├── favicon.svg
        ├── icons/                # 8 line icons (feather, infinity, noscreen, shield…)
        ├── hero-desk.jpg         # Hero background
        ├── hero-typing.jpg       # Intro section
        ├── device-palm.jpg       # "So Small, Yet So Powerful"
        ├── exploded-view.jpg     # "What's in the Box?"
        ├── feat-*.jpg            # No Screen / Full Keyboard
        ├── step-*.jpg            # How It Works 1-2-3
        ├── mode-*.jpg            # 4 display modes
        ├── ctrl-*.jpg            # Gesture / Voice / Wearable
        ├── where-*.jpg           # Home / Café / Airport / Meeting
        ├── use-*.jpg             # 8 "Perfect For" personas
        ├── footer-sunset.jpg     # Pre-order banner
        └── overview-1/2.png      # Original full design boards
```

## 2. Page sections

| # | Section | What it shows |
|---|---------|---------------|
| 1 | Navbar | Sticky, blurs on scroll, active link tracking, mobile hamburger |
| 2 | Hero | Title, tagline, 4 badges, CTA buttons, handwritten note, slow zoom background |
| 3 | Feature strip | Zero Weight · Infinite Battery · No Screen · Gesture & Voice · Connectivity · Secure |
| 4 | Intro | "A complete laptop in a smaller form" + checklist |
| 5 | Design | 6 × 6 × 2.5 cm dimensions + exploded "What's in the Box?" with 5 layers |
| 6 | No Screen / Keyboard | Two feature cards |
| 7 | How It Works | Open → Activate → Work |
| 8 | Display Modes | Auto-rotating tabs: Standard, Multi-Screen, Extended, Presentation |
| 9 | Control Your Way | Hand gestures, voice, optional wearable |
| 10 | Work Anywhere | Home, café, airport, meeting (click to enlarge) |
| 11 | Perfect For | 8 personas gallery (click to enlarge) |
| 12 | Specifications | Spec table + animated counters |
| 13 | Product Boards | The two original design boards in a lightbox |
| 14 | FAQ | Accordion |
| 15 | Pre-Order | Email waitlist form (client-side validation only) |

## 3. Run locally

```bash
cd zerobook
python3 -m http.server 8080
# open http://localhost:8080
```

## 4. Deploy to GitHub Pages with GitHub Actions

```bash
cd zerobook
git init
git add .
git commit -m "ZeroBook Infinity website"
git branch -M main
git remote add origin https://github.com/<your-username>/zerobook-infinity.git
git push -u origin main
```

Then, **once**, in the repository on GitHub:

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. Go to the **Actions** tab — the `Deploy ZeroBook Infinity to GitHub Pages` run starts
   automatically (or click **Run workflow**).
3. When it finishes, the URL appears on the `deploy` job, e.g.
   `https://<your-username>.github.io/zerobook-infinity/`

Every future `git push` to `main` redeploys the site automatically.

## 5. How the workflow works

| Part | Purpose |
|------|---------|
| `on: push / workflow_dispatch` | Runs on every push to `main`, or manually |
| `permissions` | `pages: write` + `id-token: write` let the job publish to Pages via OIDC |
| `concurrency: pages` | Prevents two deployments overlapping |
| **build** job | Checks out code → verifies required files → verifies **every image** referenced in `index.html` exists (fails the build if one is missing) → copies site into `_site/` with `.nojekyll` → uploads it as a Pages artifact |
| **deploy** job | `needs: build`, runs `actions/deploy-pages@v4` and prints the live URL in the `github-pages` environment |

## 6. Customising

- **Colours:** edit the CSS variables at the top of `assets/css/styles.css` (`--gold`, `--holo`, `--bg`…).
- **Text / specs:** edit `index.html` directly.
- **Real pre-order form:** replace the submit handler in `main.js` with a service such as
  Formspree, or point the `<form action="…">` at your backend.
- **Custom domain:** add a `CNAME` file containing your domain to the repo root and add
  `cp CNAME _site/` to the *Prepare publish folder* step.
