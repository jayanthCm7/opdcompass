/* Author-written legal copy, rendered as trusted static HTML. */
const H = (t: string) => `<h4 class="pt-3 text-sm font-black text-foreground">${t}</h4>`;
const P = (t: string) => `<p>${t}</p>`;
const UL = (a: string[]) => `<ul class="list-disc space-y-1.5 pl-5">${a.map((x) => `<li>${x}</li>`).join("")}</ul>`;
export const CONTACT_EMAIL = "jayanthcm.arpitha@gmail.com";

export const LEGAL: Record<string, { title: string; html: string }> = {
  privacy: {
    title: "Privacy Policy",
    html: [
      P("OPD Compass is a browser-based clinical reference and drafting toolkit. It has no user accounts and does not collect, store, or sell personal or health information on any server operated by the author."),
      H("1. Information stored on your device"),
      UL([
        "Saved (starred) cases",
        "Letterhead details you choose to save (name, qualification, clinic)",
        "Dark-mode preference",
        "Cached image search queries"
      ]),
      P("This information stays strictly inside your browser's local storage. You can remove it at any time through the Clear option in the Letterhead dialog or by clearing site data in your browser settings."),
      H("2. Information that leaves your device"),
      UL([
        "Image search queries are sent to the public Wikimedia Commons API over HTTPS to fetch licensed images.",
        "The Tailwind CSS stylesheet is loaded from its public content delivery network.",
        "Prescription text leaves your device only when you deliberately choose Copy, WhatsApp, or Print.",
        "When you tap an icon in the Get In Touch section, your local email, WhatsApp, or phone dialer opens with contact details."
      ]),
      H("3. Patient information"),
      P("OPD Compass is not an electronic health record system. Please do not store identifiable patient information. Prescription slips are compiled locally on your device and are never transmitted to any central database."),
      H("4. No analytics, tracking, or advertising"),
      P("The application contains zero telemetry trackers, third-party advertising pixels, or invasive session recorders."),
      H("5. Your rights"),
      P("Because your data remains on your device, you have direct control. Under India's Digital Personal Data Protection Act, 2023 (DPDP Act), for any questions regarding your data rights, write to <a class='font-semibold text-primary underline' href='mailto:" + CONTACT_EMAIL + "'>" + CONTACT_EMAIL + "</a>."),
      H("6. Updates"),
      P("This policy is current as of 2026.")
    ].join("")
  },
  terms: {
    title: "Terms of Use",
    html: [
      H("1. Acceptance"),
      P("By using OPD Compass, you agree to these terms. If you do not agree, please discontinue using the application."),
      H("2. Intended audience"),
      P("This platform is intended for registered medical practitioners, medical students, and healthcare educators. It serves as an educational reference and drafting aid. It does not establish a doctor–patient relationship with any user or viewer."),
      H("3. Clinical responsibility"),
      P("Any diagnosis, investigation, prescription, or clinical decision is the sole responsibility of the treating clinician. Draft prescriptions must be reviewed, adapted, and signed by a qualified medical practitioner."),
      H("4. No warranty"),
      P("The application and its calculators are provided 'as is' without warranty of any kind. While based on standard clinical texts, medical guidelines evolve and errors or omissions may occur."),
      H("5. Limitation of liability"),
      P("To the fullest extent permitted by law, the author is not liable for any clinical decisions, injuries, or damages arising from reliance on this educational tool."),
      H("6. Governing law"),
      P("These terms are governed by the laws of India. Courts in Bengaluru, Karnataka, have exclusive jurisdiction."),
      H("7. Inquiries"),
      P("Contact: <a class='font-semibold text-primary underline' href='mailto:" + CONTACT_EMAIL + "'>" + CONTACT_EMAIL + "</a>.")
    ].join("")
  },
  disclaimer: {
    title: "Medical Disclaimer",
    html: [
      P("<b class='text-foreground'>OPD Compass is for educational reference and prescription drafting only.</b> It does not constitute formal medical advice and must never replace qualified clinical judgement."),
      H("Before you prescribe"),
      UL([
        "Confirm diagnosis through history, physical examination, and appropriate investigations.",
        "Check manufacturer product literature and latest local/institutional guidelines.",
        "Verify doses for body weight, pregnancy, lactation, renal clearance, and hepatic status.",
        "Screen for drug allergies, contraindications, and potential interactions."
      ]),
      H("Calculators"),
      P("Clinical calculators provide estimation support only. Outputs depend entirely on the accuracy of the parameters entered."),
      H("Emergencies"),
      P("Patients exhibiting red flag symptoms require immediate resuscitation, stabilization, and tertiary referral. In India, the national emergency response number is <b class='text-foreground'>112</b>.")
    ].join("")
  },
  cookies: {
    title: "Cookies & Storage",
    html: [
      P("OPD Compass does not use tracking cookies."),
      H("Local storage keys used"),
      UL([
        "<code class='rounded bg-slate-100 px-1'>opd_fav</code> — your bookmarked clinical cases",
        "<code class='rounded bg-slate-100 px-1'>opd_doc</code> — custom doctor letterhead details",
        "<code class='rounded bg-slate-100 px-1'>opd_dark</code> — light/dark theme preference",
        "<code class='rounded bg-slate-100 px-1'>opd_img_*</code> — cached image query responses"
      ]),
      H("Clearing storage"),
      P("You can reset your data anytime via the Letterhead dialog or by clearing local site storage in your browser.")
    ].join("")
  },
  copyright: {
    title: "Copyright & Credits",
    html: [
      P("<b class='text-foreground'>© 2026 Dr Jayanth C M. All rights reserved.</b>"),
      H("Original work"),
      P("The OPD Compass name, UI design, source architecture, and clinical compilation are the intellectual work of Dr Jayanth C M."),
      H("Third-party assets"),
      UL([
        "Tailwind CSS — used under open-source MIT license.",
        "Wikimedia Commons — clinical images retrieved dynamically under respective Creative Commons licenses with attribution links.",
        "Brand names referenced (e.g. Augmentin, Pan-40, Corex-DX) are trademarks of their respective pharmaceutical manufacturers and are cited for educational reference only."
      ]),
      H("Inquiries & permissions"),
      P("Write to <a class='font-semibold text-primary underline' href='mailto:" + CONTACT_EMAIL + "'>" + CONTACT_EMAIL + "</a>.")
    ].join("")
  }
};

