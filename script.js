/* ============================================================
   The Cleaning Company HTX — script.js
   Vanilla JavaScript, no dependencies, no backend, no API calls.

   This file is organized as:
     1. Configuration          (edit these to reuse this template
                                 for a different business/location)
     2. Small utilities
     3. Header / mobile menu
     4. Smooth scrolling + active nav state
     5. Google Reviews / Maps link wiring
     6. Phone link wiring
     7. FAQ accordion
     8. Quote form (validation + client-side "success" experience)
     9. Scroll-reveal animations
     10. Init
   ============================================================ */

/* ============================================================
   1. CONFIGURATION
   Change these three values to reuse this template for another
   business. Everything else in this file reads from them.
   ============================================================ */
const BUSINESS_PHONE = "+18322898920"; // E.164 format — used for tel: and sms: links
const BUSINESS_PHONE_DISPLAY = "+1 832-289-8920"; // human-readable — used for visible text

// The business's Google Maps listing (used by every "Read Google
// Reviews" button/link on the site).
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/The+Cleaning+Company+HTX+LLC/@29.788824,-95.5743849,17z/data=!4m8!3m7!1s0xad0d8482007f731d:0xc1501bef792de7f0!8m2!3d29.788824!4d-95.57181!9m1!1b1!16s%2Fg%2F11wmw1m22x?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D";

// A Google Maps *directions* link (used by "Get Directions"). Built
// from the business address using Google's documented, key-free
// Maps URL scheme: https://developers.google.com/maps/documentation/urls/get-started
// Replace with any Maps link you prefer — this constant is the only
// place it needs to change.
const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=1095+Brittmoore+Rd%2C+Houston%2C+TX+77043";

/* ============================================================
   2. SMALL UTILITIES
   ============================================================ */
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function qsa(selector, scope) {
  return Array.from((scope || document).querySelectorAll(selector));
}

const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

/* ============================================================
   3. HEADER / MOBILE MENU
   ============================================================ */
function initHeader() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("mobileMenu");

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
      menu.hidden = isOpen;
      document.body.style.overflow = isOpen ? "" : "hidden";
    });
  }

  // Close the mobile menu whenever any in-page nav link is used.
  qsa("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", () => {
      if (toggle && menu && !menu.hidden) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        menu.hidden = true;
        document.body.style.overflow = "";
      }
    });
  });
}

/* ============================================================
   4. SMOOTH SCROLLING + ACTIVE NAV STATE
   ============================================================ */
function initSmoothScroll() {
  const header = document.getElementById("siteHeader");

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href").slice(1);
    if (!targetId) return;
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    const headerHeight = header ? header.offsetHeight : 0;
    const top =
      target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;

    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    // Keep the URL shareable without re-triggering native jump scroll.
    history.pushState(null, "", `#${targetId}`);
  });
}

function initActiveNavState() {
  const navLinks = qsa('.primary-nav a[href^="#"]');
  if (!navLinks.length || !("IntersectionObserver" in window)) return;

  const sections = navLinks
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ============================================================
   5. GOOGLE REVIEWS / MAPS LINK WIRING
   Every "Read Google Reviews" / "Get Directions" element on the
   page is a real <a> tag with href="#" in the HTML; this fills in
   the real destination from the config constants above, so there
   is exactly one place to update them.
   ============================================================ */
function openGoogleReviews() {
  window.open(GOOGLE_REVIEWS_URL, "_blank", "noopener,noreferrer");
}

function openDirections() {
  window.open(GOOGLE_MAPS_URL, "_blank", "noopener,noreferrer");
}

function initGoogleLinks() {
  qsa("[data-google-reviews-link]").forEach((el) => {
    el.setAttribute("href", GOOGLE_REVIEWS_URL);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
    el.addEventListener("click", (event) => {
      // The href above already does the job; this handler calls the
      // reusable openGoogleReviews() function too, as a safety net
      // in case href is ever stripped by a future edit.
      if (!el.getAttribute("href") || el.getAttribute("href") === "#") {
        event.preventDefault();
        openGoogleReviews();
      }
    });
  });

  qsa("[data-google-maps-link]").forEach((el) => {
    el.setAttribute("href", GOOGLE_MAPS_URL);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
    el.addEventListener("click", (event) => {
      if (!el.getAttribute("href") || el.getAttribute("href") === "#") {
        event.preventDefault();
        openDirections();
      }
    });
  });
}

/* ============================================================
   6. PHONE LINK WIRING
   ============================================================ */
function initPhoneLinks() {
  qsa("[data-tel-link]").forEach((el) => {
    el.setAttribute("href", `tel:${BUSINESS_PHONE}`);
  });
  qsa("[data-phone-display]").forEach((el) => {
    el.textContent = BUSINESS_PHONE_DISPLAY;
  });
}

/* ============================================================
   7. FAQ ACCORDION
   ============================================================ */
function initAccordion() {
  qsa(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.hidden = isOpen;
    });
  });
}

/* ============================================================
   8. QUOTE FORM
   No backend, no email: this validates required fields client-side,
   then shows a success panel offering to text or call the business
   with the details already filled in. To connect a real backend
   later without running your own server, see README.md for
   zero-server options (Netlify Forms, Formspree, Getform, etc.).
   ============================================================ */
function buildRequestSummary(data) {
  const lines = [
    `New quote request from ${data.name} (${data.phone})`,
    `Property type: ${data.propertyType || "Not specified"}`,
    `Service: ${data.service}`,
    `Bedrooms: ${data.bedrooms || "—"} / Bathrooms: ${data.bathrooms || "—"}`,
    `Home size: ${data.homeSize || "Not specified"}`,
    `Preferred date: ${data.preferredDate || "Flexible"}`,
    `Preferred time: ${data.preferredTime || "Flexible"}`,
    `Frequency: ${data.frequency || "Not specified"}`,
  ];
  if (data.details) lines.push(`Details: ${data.details}`);
  return lines.join("\n");
}

function initQuoteForm() {
  const form = document.getElementById("quoteForm");
  const errorEl = document.getElementById("formError");
  const successEl = document.getElementById("quoteSuccess");
  const resetBtn = document.getElementById("quoteReset");
  const smsLink = document.getElementById("smsRequestLink");
  const successName = document.getElementById("successName");

  if (!form) return;

  // Read fields by their unique element IDs rather than
  // form.<fieldname>. Note in particular that form.name is NOT the
  // "name" input — HTMLFormElement already has its own native
  // `name` property (reflecting the <form name="..."> attribute),
  // which takes precedence over a same-named form control. Using
  // getElementById for every field sidesteps that footgun entirely.
  const fields = {
    name: document.getElementById("qName"),
    phone: document.getElementById("qPhone"),
    propertyType: document.getElementById("qPropertyType"),
    service: document.getElementById("qService"),
    bedrooms: document.getElementById("qBedrooms"),
    bathrooms: document.getElementById("qBathrooms"),
    homeSize: document.getElementById("qHomeSize"),
    preferredDate: document.getElementById("qDate"),
    preferredTime: document.getElementById("qTime"),
    frequency: document.getElementById("qFrequency"),
    details: document.getElementById("qDetails"),
  };

  // Service cards each have a "Request a Quote" link with
  // data-service="<service name>" — clicking one preselects that
  // service in the form below, in addition to scrolling there.
  qsa(".js-quote-link").forEach((link) => {
    link.addEventListener("click", () => {
      const value = link.getAttribute("data-service");
      if (value && fields.service) {
        const optionExists = Array.from(fields.service.options).some(
          (opt) => opt.value === value
        );
        if (optionExists) fields.service.value = value;
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = {
      name: fields.name.value.trim(),
      phone: fields.phone.value.trim(),
      propertyType: fields.propertyType.value,
      service: fields.service.value,
      bedrooms: fields.bedrooms.value,
      bathrooms: fields.bathrooms.value,
      homeSize: fields.homeSize.value,
      preferredDate: fields.preferredDate.value,
      preferredTime: fields.preferredTime.value,
      frequency: fields.frequency.value,
      details: fields.details.value.trim(),
    };

    const missing = [];
    if (!data.name) missing.push("Full Name");
    if (!data.phone) missing.push("Phone Number");
    if (!data.service) missing.push("Desired Cleaning Service");

    if (missing.length > 0) {
      if (errorEl) {
        errorEl.textContent = `Please fill in the required field(s): ${missing.join(", ")}.`;
        errorEl.hidden = false;
      }
      const firstInvalid =
        (!data.name && fields.name) ||
        (!data.phone && fields.phone) ||
        (!data.service && fields.service);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    if (errorEl) errorEl.hidden = true;

    const summary = buildRequestSummary(data);
    const smsSeparator = isiOS ? "&" : "?";
    if (smsLink) {
      smsLink.href = `sms:${BUSINESS_PHONE}${smsSeparator}body=${encodeURIComponent(summary)}`;
    }
    if (successName) {
      successName.textContent = data.name ? `, ${data.name}` : "";
    }

    form.hidden = true;
    if (successEl) {
      successEl.hidden = false;
      successEl.focus();
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      form.reset();
      form.hidden = false;
      if (successEl) successEl.hidden = true;
      if (errorEl) errorEl.hidden = true;
      if (fields.name) fields.name.focus();
    });
  }
}

/* ============================================================
   9. SCROLL-REVEAL ANIMATIONS
   ============================================================ */
function initScrollReveal() {
  const items = qsa(".reveal");
  if (!items.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute("data-reveal-delay");
          entry.target.style.transitionDelay = delay ? `${delay}ms` : "0ms";
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

/* ============================================================
   10. INIT
   ============================================================ */
function initFooterYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initSmoothScroll();
  initActiveNavState();
  initGoogleLinks();
  initPhoneLinks();
  initAccordion();
  initQuoteForm();
  initScrollReveal();
  initFooterYear();
});
