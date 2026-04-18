# comparatuenvio 💚

> Compare remittance rates to Latin America in real time. Free, bilingual, mobile-first.

---

## 🚀 Deploy in 5 Steps

### Step 1 — Add your API key
Open `index.html` in Notepad, VS Code, or Cursor.
Find this line:
```
const EXCHANGE_RATE_API_KEY = 'YOUR_API_KEY_HERE';
```
Replace `YOUR_API_KEY_HERE` with your key from [exchangerate-api.com](https://exchangerate-api.com).

---

### Step 2 — Create a GitHub repo
1. Go to [github.com](https://github.com) and sign in
2. Click **New repository**
(https://github.com/merchanttrue/comparatuenvio.git)
3. Name it `comparatuenvio` (or anything you like)
4. Set it to **Public**
5. Click **Create repository**

Quick setup
https://github.com/yovannyhub/comparatuenvio.git

or create a new repository on the command line
echo "# comparatuenvio" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/yovannyhub/comparatuenvio.git
git push -u origin main

or push an existing repository from the command line
git remote add origin https://github.com/yovannyhub/comparatuenvio.git
git branch -M main
git push -u origin main


---

### Step 3 — Upload your file
On the repo page, click **Add file → Upload files**
Drag your `index.html` into the upload area and click **Commit changes**

---

### Step 4 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **Add New → Project**
3. Select your `enviamejor` repo
4. Click **Deploy** (no settings to change)
5. Your site is live in ~30 seconds ✅

---

### Step 5 — Connect your domain
1. Buy a domain (e.g. `enviamejor.com`) from Namecheap or Google Domains
2. In Vercel, go to your project → **Settings → Domains**
3. Add your domain and follow the DNS instructions

---

## 💰 Monetization

### Google AdSense
1. Apply at [adsense.google.com](https://adsense.google.com)
2. Once approved, replace the ad placeholder in `index.html` with your `<ins>` tag

### Affiliate Links
Replace the provider URLs in the `PROVIDERS` array with your affiliate links:
- **Remitly**: remitly.com/affiliate
- **Wise**: wise.com/partners
- **Xoom**: xoom.com/affiliate
- **WorldRemit**: worldremit.com/affiliates
- **Western Union**: westernunion.com/affiliates

Each referral earns $10–$25 per new customer.

---

## ✅ Features
- Live exchange rates via ExchangeRate-API (1,500 free calls/month)
- Auto-fallback to Frankfurter API if primary fails
- Bilingual — Spanish & English toggle
- 10 countries: Mexico, Guatemala, El Salvador, Colombia, Dominican Republic, Honduras, Nicaragua, Peru, Ecuador, Venezuela
- Mobile-first responsive design
- Amount slider + quick-pick buttons
- Filter by fastest or cheapest provider
- Savings calculator (yearly estimate)
- WhatsApp share button
- SEO meta tags + Open Graph
- Google AdSense placeholder ready

---

## 🛠 Updating Rates / Providers
All editable data is in the `PROVIDERS` and `COUNTRIES` arrays near the top of the `<script>` section in `index.html`.

---

Built with Claude · Deployed on Vercel · Powered by ExchangeRate-API
