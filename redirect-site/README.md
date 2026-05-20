# shapidesign.com → alefsofit.com redirect

The main portfolio already redirects legacy hostnames in the browser when GitHub Pages serves that build on `shapidesign.com`.

For a **server-level 301** (best for SEO), use one of these:

## Option A — Domain registrar (recommended)

At your registrar for **shapidesign.com**, enable **URL forwarding / 301 redirect**:

- `shapidesign.com` → `https://www.alefsofit.com`
- `www.shapidesign.com` → `https://www.alefsofit.com`

Then remove GitHub Pages A/CNAME records for the old domain so traffic goes through the registrar redirect.

## Option B — Dedicated GitHub Pages redirect site

1. Create a new repo (e.g. `shapidesign-redirect`).
2. Copy `index.html` and `CNAME` from this folder into the repo root.
3. Enable GitHub Pages (branch `main`, root).
4. Point `www.shapidesign.com` CNAME to `YOUR_USER.github.io` (or the new repo’s Pages URL).
5. Point apex `shapidesign.com` A records to GitHub Pages **or** forward apex → www at the registrar.

## DNS check

```bash
dig www.shapidesign.com +noall +answer -t CNAME
dig shapidesign.com +noall +answer -t A
```

`www` should CNAME to your Pages host; apex should either use the same redirect repo or registrar forwarding.
