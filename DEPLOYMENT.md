# Deployment Guide — Durrani Group of Companies Website

Website: static HTML/CSS/JS site (no build step needed).
Domain: durranigroup.com (recommended)

---

## Option A: Netlify (Recommended — Free)

### 1. Deploy the website
1. Go to https://app.netlify.com and sign up (free) — GitHub/Google login works.
2. Click **Add new site → Deploy manually**.
3. Drag-and-drop the `Durrani Group Of Compaines` folder (the one containing `index.html`) onto the page.
4. Netlify uploads it and gives you a live URL like `https://random-name.netlify.app`.
5. Open that URL to test — everything (images, PDFs, videos, forms) works immediately.

### 2. Connect your domain
1. Buy the domain first (see Section 4).
2. In Netlify: **Domain settings → Add a domain → durranigroup.com**.
3. Follow the prompts; Netlify shows you DNS records to add at your registrar.
4. Add the records, wait 5–30 minutes, and your site is live at https://durranigroup.com with a free SSL certificate (auto-enabled).

### 3. Deploy updates later
Any time you change files, just re-drag the folder (Deploy manually) or use Git-based deploys for automatic updates.

---

## Option B: Vercel (Alternative — Free)

1. Go to https://vercel.com → sign up.
2. Click **New Project → Deploy without Git → upload the folder**.
3. Framework preset: **Other** (no build command needed).
4. Add your domain in **Project Settings → Domains**.
5. Free SSL included.

---

## Option C: Traditional Hosting (if you also need company email)

Use Hostinger / Namecheap / GoDaddy shared hosting:
1. Buy a hosting plan (~$2–4/month).
2. Open cPanel → **File Manager → public_html**.
3. Upload all files and folders (`css`, `js`, `pages`, `images`, `assets`, `index.html`, etc.).
4. Domain auto-connects; enable free SSL (Let's Encrypt) in cPanel.
5. Company email (info@durranigroup.com) is included with most plans.

---

## 4. Buying the domain

| Registrar | Price (approx/yr) | Notes |
|-----------|-------------------|-------|
| Cloudflare Registrar | ~$10 | Cheapest, wholesale price, DNS included |
| Namecheap | ~$10–13 | Easy, well-known |
| GoDaddy | ~$15+ | Easy but pricier renewals |

Search for **durranigroup.com** and buy it. If taken, alternatives: `durranigroup.pk`, `durranigroup.com.pk`, `thedurranigroup.com`.

---

## 5. SEO / Google Setup (after launch)

1. Go to https://search.google.com/search-console → add property → `https://durranigroup.com/`.
2. Verify ownership (Netlify: DNS TXT record or HTML tag — easiest is the recommended DNS record).
3. Submit sitemap: enter `sitemap.xml` in the Sitemaps section.
4. Submit `robots.txt` check (already included in the site).

---

## 6. Pre-launch checklist

- [ ] Review Pashto/Urdu translations with a native speaker (edit `js/i18n.js`)
- [ ] Replace placeholder photos (Chairman, Durrani Residency/Kalam) with real project photos
- [ ] Replace sample testimonial names with real client reviews
- [ ] Confirm WhatsApp numbers and Facebook page link are correct (check `js/layout.js`)
- [ ] Test on phone + desktop: navigation, language switcher, forms, video playback
- [ ] Test that contact forms open WhatsApp with pre-filled message

---

## 7. Troubleshooting

| Problem | Fix |
|---------|-----|
| Images/PDFs not loading | Re-upload the full folder (keep folder structure — don't flatten) |
| Videos too slow | They're served as-is; consider compressing the .mp4 files before upload |
| Language not switching | Clear browser cache; `i18n.js` must be next to `layout.js` in the `js/` folder |
| Forms don't open WhatsApp | Check the `wa.me/923288999919` links — number must include country code without `+` |
