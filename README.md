# Portfolio

A static portfolio site (HTML, CSS, JavaScript). No build step.

## Add your content

All text lives in **`data.js`**. Open it and replace each field with the matching
section of your LinkedIn profile. The easiest way to get all the text at once:
LinkedIn → your profile → **More** → **Save to PDF**.

- Delete the contents of any optional list (`highlights`, `languages`,
  `recommendations`, `certifications`) to hide that section.
- Put a photo or résumé in `assets/` and set `photo` / `resume` to its path.
- Colours are set at the top of `style.css` (dark theme first, then light).

## Publish on GitHub Pages

1. Create a repository. Name it `<your-username>.github.io` for a site at
   `https://<your-username>.github.io`, or use any name for
   `https://<your-username>.github.io/<repo>`.
2. Upload every file in this folder to the repository root (including `.nojekyll`).
3. In the repository, open **Settings → Pages**, set **Source** to
   *Deploy from a branch*, choose `main` and `/ (root)`, then save.
4. The site is live within a minute or two at the address shown on that page.

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder
and visit `http://localhost:8000`.

## Publications and automatic updates

Google Scholar has no public API and blocks requests from other websites, so a
static site cannot read it directly. Instead the page reads your **ORCID**
record (`orcid` in `data.js`) every time it loads and adds any work it has not
seen before, marked "New via ORCID".

To make new papers appear automatically:
1. Sign in at orcid.org and open your record.
2. Under **Works → Add → Search & link**, connect **Crossref Metadata Search**
   and allow it to update your record. Papers with a DOI are then added to ORCID
   (and so to this site) without any action from you.

The list in `data.js` is the fallback and keeps full author lists, so it is still
worth adding new papers there when you have a moment.

## Files

- `index.html` – page structure
- `style.css` – design (colours, fonts, layout)
- `data.js` – all content
- `script.js` – renders the content, ORCID sync, navigation, search
- `visuals.js` – interactive DNA helix, mass spectrum, ligand and genome track

## Features

- Light and dark themes (remembers the choice)
- Command palette: press **Ctrl K** / **⌘ K** or **/** to jump to any section, role, project or skill
- Section rail with scroll tracking, reading progress bar
- Interactive 3D DNA helix in the hero and three research illustrations (drag and hover)
- Pointer-reactive name and background (turned off for reduced-motion settings and touch screens)
- Expandable projects, filterable skills, click-to-copy email
- Responsive down to small phones, keyboard accessible
