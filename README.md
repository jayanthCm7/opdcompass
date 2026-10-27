# 🧭 OPD Compass

**Navigate OPD Care with Confidence**

OPD Compass is a browser-based clinical reference and draft-prescription toolkit for outpatient (OPD) practice. It helps a clinician move from a presenting complaint to a probable diagnosis, investigations, treatment guidance, cautions and red-flag referral criteria, then produce a draft prescription slip.

> ⚠️ **For registered medical practitioners and medical students only.** This tool is an educational reference. It does not replace clinical judgement, local protocols or product information. Verify every diagnosis, dose and interaction before prescribing.

🔗 **Live demo:** `https://opdcompass.medtech.workers.dev/'

---

## ✨ Features

- **64 clinical cases** – 46 Medicine and 18 Obstetrics & Gynaecology, each with chief complaints, pathophysiology, investigations, treatment guidance, advice, cautions, complications, red flags and review interval.
- **Smart search** – search by symptom, keyword or local-language term (e.g. *khansi, jalan, bukhar*), with specialty filters and quick-search chips.
- **Emergency red-flag alerts** – typing a dangerous presentation (e.g. *chest pain*, *stridor*, *fetal movement*) shows an urgent-referral banner.
- **Draft prescription builder** – editable prescription slip with advice, investigations and return precautions; copy, WhatsApp share or print/PDF.
- **Letterhead** – add your name, qualification and clinic once; the custom letterhead activates only when a name is entered.
- **8 clinical tools** – BMI, paediatric paracetamol dose, creatinine clearance (Cockcroft–Gault), CURB-65, Centor/McIsaac, gestational age & EDD, BP category & MAP, ORS volume (WHO Plan B).
- **Saved cases** – bookmark frequently used cases (stored on your device).
- **Clinical images** – licensed images from Wikimedia Commons, with credit and licence shown. Sensitive images are blurred until tapped.
- **Dark mode, animations and mobile-friendly layout.**
- **Privacy-first** – no accounts, no server database, no tracking. Data stays in your browser's local storage.
---

## 🚀 Getting Started

OPD Compass is a single static file. No build step is needed.

### Run locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser (Chrome, Edge, Firefox or Safari).

```bash
git clone https://opdcompass.medtech.workers.dev/
cd opd-compass
# then open index.html in your browser
```

### Deploy with GitHub Pages
1. Go to **Settings → Pages**.
2. Under *Build and deployment*, choose **Deploy from a branch**.
3. Select `main` and `/ (root)`, then **Save**.
4. Your site will be available at `https://<your-username>.github.io/opd-compass/`.

---

## 🧱 Tech Stack

- HTML5 and vanilla JavaScript (single file, no framework)
- [Tailwind CSS](https://tailwindcss.com) via CDN
- [Wikimedia Commons API](https://commons.wikimedia.org/) for licensed images
- Browser `localStorage` for saved cases, letterhead and theme

---

## 📁 Project Structure

```text
opd-compass/
├── index.html          # Entire application (UI, data, logic, legal pages)
├── README.md           # This file
├── LICENSE             # Licence terms (see below)
└── images/
    └── jayanth-profile.jpg
```

---

## 🧪 Content Sources & Verification

Clinical content is compiled from the author's OPD Clinical Reference Notebook (Advanced Edition) and should be cross-checked against current national and institutional guidelines.

- _Add the guidelines you verified against here, e.g. ICMR, IAP, FOGSI, NCDC, NVBDCP, RGUHS protocols._
- _Last content review: `2026` – update when reviewed._

Found an error? Please open an [issue](../../issues) or email **jayanthcm.arpitha@gmail.com**.

---

## 🛣️ Roadmap

- [ ] Peer review of clinical content by a senior clinician
- [ ] Local-language search terms (Kannada, Hindi)
- [ ] Printable PDF prescription with QR code
- [ ] Offline progressive web app (PWA) support
- [ ] Self-hosted Tailwind CSS for full offline use

---

## 🤝 Contributing

Suggestions and corrections are welcome. For clinical content changes, please cite the source guideline in your pull request or issue.

1. Fork the repository.
2. Create a branch (`git checkout -b fix/content-update`).
3. Commit your change and open a pull request.

---

## 📜 Licence & Copyright

© 2026 Dr Jayanth C M. All rights reserved.

This repository is shared for personal educational use. Copying, redistribution or commercial use requires written permission from the author. See [LICENSE](LICENSE) if provided.

Third-party components remain the property of their owners:
- Tailwind CSS (open-source, MIT licence)
- Wikimedia Commons images (each image shows its own licence and creator credit in the app)
- Brand names mentioned in clinical content are trademarks of their respective owners and are referenced for educational purposes only.

---

## 👨‍⚕️ Author

**Dr Jayanth C M**
MBBS · Medical Officer · Bengaluru, Karnataka

📧 jayanthcm.arpitha@gmail.com
🔗 [LinkedIn](https://www.linkedin.com/in/jayanth-cm-a6647239b?utm_source=share_via&utm_content=profile&utm_medium=member_android) · 
[GitHub](https://github.com/jayanthCm7)

---

_Designed & built by Jayanth C M 🧡_
