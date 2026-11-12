import "./style.css";

const LINKEDIN = "https://www.linkedin.com/in/umersyedahmed";

const year = document.querySelector("[data-year]");
const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");
const submitBtn = form.querySelector('button[type="submit"]');
const contact = document.querySelector("#contact");
const navLinks = [...document.querySelectorAll(".section-link")];

if (year) year.textContent = String(new Date().getFullYear());

const sections = ["intro", "about", "experience", "skills", "plans", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function setCurrent(id) {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${id}`) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -45% 0px", threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));
}

function syncTheme() {
  if (!contact) return;
  const rect = contact.getBoundingClientRect();
  const coversNav =
    rect.top < window.innerHeight * 0.62 && rect.bottom > window.innerHeight * 0.35;
  const coversTop = rect.top < 72 && rect.bottom > 0;
  document.body.classList.toggle("on-dark", coversNav || coversTop);
}

syncTheme();
window.addEventListener("scroll", syncTheme, { passive: true });
window.addEventListener("resize", syncTheme);

function setFieldError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  if (!error) return;
  if (message) {
    error.hidden = false;
    error.textContent = message;
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", error.id);
  } else {
    error.hidden = true;
    error.textContent = "";
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
  }
}

function setStatus(message, links = []) {
  status.replaceChildren();
  if (!message) return;
  status.append(document.createTextNode(message));
  if (!links.length) return;
  status.append(document.createTextNode(" "));
  links.forEach((item, index) => {
    if (index > 0) status.append(document.createTextNode(" or "));
    const anchor = document.createElement("a");
    anchor.href = item.href;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = item.label;
    status.append(anchor);
  });
  status.append(document.createTextNode("."));
}

function fieldMessage(input) {
  const value = input.value.trim();
  if (input.id === "name") {
    return value.length >= 2 ? "" : "Add your name.";
  }
  if (input.id === "email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? ""
      : "Add a valid email so a reply can reach you.";
  }
  if (input.id === "message") {
    return value.length >= 10 ? "" : "Add a short note about the project.";
  }
  return "";
}

["name", "email", "message"].forEach((id) => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") {
      setFieldError(input, fieldMessage(input));
    }
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("");

  const honeypot = document.getElementById("company");
  if (honeypot && honeypot.value.trim()) {
    setStatus("Thanks. Your note is recorded.");
    form.reset();
    return;
  }

  const fields = ["name", "email", "message"].map((id) =>
    document.getElementById(id),
  );
  let firstInvalid = null;
  fields.forEach((input) => {
    const message = fieldMessage(input);
    setFieldError(input, message);
    if (message && !firstInvalid) firstInvalid = input;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  submitBtn.disabled = true;
  form.setAttribute("aria-busy", "true");
  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    });
    if (response.ok) {
      form.reset();
      setStatus("Message sent. I’ll reply by email.");
    } else {
      setStatus("The message didn’t go through. Try again, or reach me on", [
        { href: LINKEDIN, label: "LinkedIn" },
      ]);
    }
  } catch {
    setStatus("The message didn’t go through. Try again, or reach me on", [
      { href: LINKEDIN, label: "LinkedIn" },
    ]);
  } finally {
    submitBtn.disabled = false;
    form.removeAttribute("aria-busy");
  }
});

const demoCheckout = document.querySelector("#demo-checkout");
const PLAN_COPY = {
  simpler: {
    name: "Simpler web-development plan",
    price: "$999",
    deposit: "$499.50",
  },
  advanced: {
    name: "More advanced plan",
    price: "$1,999",
    deposit: "$999.50",
  },
};
const CHECKOUT_HOSTS = [
  "buy.stripe.com",
  "checkout.stripe.com",
  "square.link",
  "checkout.square.site",
];

function allowedCheckoutUrl(value) {
  if (!value || typeof value !== "string") return "";
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return "";
    if (!CHECKOUT_HOSTS.includes(url.hostname)) return "";
    return url.toString();
  } catch {
    return "";
  }
}

const CHECKOUT_URLS = {
  simpler: allowedCheckoutUrl(import.meta.env.VITE_CHECKOUT_URL_SIMPLER_DEPOSIT),
  advanced: allowedCheckoutUrl(import.meta.env.VITE_CHECKOUT_URL_ADVANCED_DEPOSIT),
};

function resolveCheckoutMode() {
  const requested = import.meta.env.VITE_CHECKOUT_MODE;
  if (requested !== "test" && requested !== "live") return "demo";
  if (!CHECKOUT_URLS.simpler || !CHECKOUT_URLS.advanced) return "demo";
  return requested;
}

const CHECKOUT_MODE = resolveCheckoutMode();

function applyCheckoutMode() {
  if (CHECKOUT_MODE === "demo") return;
  document.querySelectorAll("[data-checkout-cta]").forEach((el) => {
    if (import.meta.env.VITE_CHECKOUT_MODE === "test") {
      el.textContent = CHECKOUT_MODE === "test" ? "Start test checkout" : "Start demo checkout";
    } else if (import.meta.env.VITE_CHECKOUT_MODE === "live") {
      el.textContent = "Start checkout";
    }
  });
  document.querySelectorAll(".demo-only").forEach((el) => {
    el.hidden = true;
  });
  if (CHECKOUT_MODE === "test") {
    document.querySelectorAll(".test-notice").forEach((el) => {
      el.hidden = false;
    });
  }
  const liveNote = document.getElementById("live-pay-note");
  if (liveNote) liveNote.hidden = CHECKOUT_MODE !== "live";
  const briefNote = document.getElementById("brief-checkout-note");
  if (briefNote) briefNote.hidden = false;
}

applyCheckoutMode();
const STEP_ORDER = ["plan", "brief", "review", "done"];
const BRIEF_FIELDS = [
  ["demo-name", "Name"],
  ["demo-email", "Email"],
  ["demo-business", "Business or project name"],
  ["demo-work", "What you do"],
  ["demo-audience", "Who the site is for"],
  ["demo-action", "Main visitor action"],
  ["demo-pages", "Pages or sections"],
  ["demo-links", "Current site or examples"],
  ["demo-brand", "Logo or brand notes"],
  ["demo-outside", "Outside the plan"],
];

let demoPlan = "simpler";
let demoStep = "plan";
let demoOpener = null;

function demoValue(id) {
  return document.getElementById(id).value.trim();
}

function checkedValue(name) {
  const selected = demoCheckout.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : "";
}

function setDemoError(input, message) {
  setFieldError(input, message);
}

function demoFieldMessage(id) {
  const value = demoValue(id);
  if (id === "demo-name") return value.length >= 2 ? "" : "Add your name.";
  if (id === "demo-email") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? ""
      : "Add a valid email. It stays on this page and is not sent.";
  }
  if (id === "demo-work") {
    return value.length >= 10 ? "" : "Add a short note about what you do.";
  }
  return "";
}

function validateBrief() {
  let firstInvalid = null;
  ["demo-name", "demo-email", "demo-work"].forEach((id) => {
    const input = document.getElementById(id);
    const message = demoFieldMessage(id);
    setDemoError(input, message);
    if (message && !firstInvalid) firstInvalid = input;
  });
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

function clearBrief() {
  demoCheckout.querySelectorAll("input, textarea").forEach((input) => {
    if (input.type === "radio") input.checked = false;
    else input.value = "";
    if (input.type !== "radio") setDemoError(input, "");
  });
  const recap = document.getElementById("demo-brief-recap");
  if (recap) recap.replaceChildren();
}

function syncPlanUI() {
  const plan = PLAN_COPY[demoPlan];
  demoCheckout.querySelectorAll('input[name="demo-plan-choice"]').forEach((radio) => {
    radio.checked = radio.value === demoPlan;
  });
  const plus = document.getElementById("demo-plus");
  if (plus) plus.hidden = demoPlan !== "advanced";
  demoCheckout.querySelectorAll("[data-inclusions]").forEach((list) => {
    list.hidden = list.getAttribute("data-inclusions") !== demoPlan;
  });
  const reviewPlan = document.getElementById("demo-review-plan");
  const reviewPrice = document.getElementById("demo-review-price");
  const reviewTotal = document.getElementById("demo-review-total");
  if (reviewPlan) reviewPlan.textContent = plan.name;
  if (reviewPrice) reviewPrice.textContent = plan.price;
  if (reviewTotal) reviewTotal.textContent = plan.price;
  const totalLabel = document.getElementById("demo-total-label");
  if (totalLabel) totalLabel.textContent = CHECKOUT_MODE === "demo" ? "Demo total" : "Total";
  const complete = document.getElementById("demo-complete");
  if (!complete) return;
  if (import.meta.env.VITE_CHECKOUT_MODE === "test") {
    complete.textContent =
      CHECKOUT_MODE === "test"
        ? `Pay ${plan.deposit} first payment (test)`
        : "Complete demo checkout";
  } else if (import.meta.env.VITE_CHECKOUT_MODE === "live") {
    complete.textContent =
      CHECKOUT_MODE === "live"
        ? `Pay ${plan.deposit} first payment`
        : "Complete demo checkout";
  } else {
    complete.textContent = "Complete demo checkout";
  }
}

function renderBriefRecap() {
  const recap = document.getElementById("demo-brief-recap");
  recap.replaceChildren();
  const rows = BRIEF_FIELDS.map(([id, label]) => [label, demoValue(id) || "Not provided"]);
  rows.push(["Domain", checkedValue("demo-domain") || "Not answered"]);
  rows.push(["Hosting", checkedValue("demo-hosting") || "Not answered"]);
  rows.forEach(([label, value]) => {
    const wrap = document.createElement("div");
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = label;
    detail.textContent = value;
    wrap.append(term, detail);
    recap.append(wrap);
  });
}

function focusDemo() {
  const heading = document.getElementById(
    demoStep === "done" ? "demo-confirm-statement" : "demo-step-heading",
  );
  if (heading) heading.focus();
}

function showDemoStep(step) {
  demoStep = step;
  demoCheckout.querySelectorAll("[data-step]").forEach((panel) => {
    panel.hidden = panel.getAttribute("data-step") !== step;
  });
  const [kicker, heading] = {
    plan: ["Step 1 of 4", "Plan summary"],
    brief: ["Step 2 of 4", "Project brief"],
    review: ["Step 3 of 4", "Order review"],
    done: ["Step 4 of 4", "Demo confirmation"],
  }[step];
  document.getElementById("demo-kicker").textContent = kicker;
  const stepHeading = document.getElementById("demo-step-heading");
  stepHeading.replaceChildren(document.createTextNode(heading));
  const note = document.createElement("span");
  note.className = "sr-only";
  if (import.meta.env.VITE_CHECKOUT_MODE === "test" && CHECKOUT_MODE === "test") {
    note.textContent = " Test checkout. No real charges.";
  } else if (import.meta.env.VITE_CHECKOUT_MODE === "live" && CHECKOUT_MODE === "live") {
    note.textContent = " Payment is handled by our payment provider.";
  } else {
    note.textContent = " This is a demo. Nothing will be charged.";
  }
  stepHeading.append(note);
  const lead = document.getElementById("demo-title-lead");
  const emphasis = document.getElementById("demo-title-em");
  if (import.meta.env.VITE_CHECKOUT_MODE === "test" && CHECKOUT_MODE === "test") {
    lead.textContent = "Test checkout";
    emphasis.textContent = "";
    document.title = "Test checkout · Umer Ahmed";
  } else if (import.meta.env.VITE_CHECKOUT_MODE === "live" && CHECKOUT_MODE === "live") {
    lead.textContent = "Checkout";
    emphasis.textContent = "";
    document.title = "Checkout · Umer Ahmed";
  } else {
    lead.textContent = "Demo";
    emphasis.textContent = step === "done" ? "confirmation" : "checkout";
    document.title = "Demo checkout · Umer Ahmed";
  }
  if (step === "review") {
    syncPlanUI();
    renderBriefRecap();
  }
  if (step === "done") {
    document.getElementById("demo-confirmed-plan").textContent =
      `${PLAN_COPY[demoPlan].name} · ${PLAN_COPY[demoPlan].price}`;
    clearBrief();
  }
  focusDemo();
}

function setInert(on) {
  document
    .querySelectorAll(".skip, .side-nav, .top-nav, .meta-rail, #main, .colophon")
    .forEach((el) => {
      if (on) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
}

function restoreBrief() {
  const raw = sessionStorage.getItem("checkout-brief");
  if (!raw) return;
  let saved;
  try {
    saved = JSON.parse(raw);
  } catch {
    return;
  }
  const fields = {
    name: "demo-name",
    email: "demo-email",
    business: "demo-business",
    work: "demo-work",
    audience: "demo-audience",
    action: "demo-action",
    pages: "demo-pages",
    links: "demo-links",
    brand: "demo-brand",
    outside: "demo-outside",
  };
  Object.entries(fields).forEach(([key, id]) => {
    const input = document.getElementById(id);
    if (input && !input.value && saved[key]) input.value = saved[key];
  });
  ["domain", "hosting"].forEach((key) => {
    if (!saved[key]) return;
    const radio = demoCheckout.querySelector(
      `input[name="demo-${key}"][value="${saved[key]}"]`,
    );
    if (radio) radio.checked = true;
  });
}

function openDemoCheckout(plan, opener) {
  demoPlan = PLAN_COPY[plan] ? plan : "simpler";
  demoOpener = opener || null;
  restoreBrief();
  syncPlanUI();
  demoCheckout.hidden = false;
  document.body.classList.add("checkout-open");
  setInert(true);
  showDemoStep("plan");
}

const pageTitle = document.title;

function closeCheckoutUi() {
  demoCheckout.hidden = true;
  document.body.classList.remove("checkout-open");
  setInert(false);
  document.title = pageTitle;
  const opener = demoOpener;
  demoOpener = null;
  if (opener) opener.focus();
}

function closeDemoCheckout() {
  clearBrief();
  sessionStorage.removeItem("checkout-brief");
  closeCheckoutUi();
  demoPlan = "simpler";
}

function demoFocusable() {
  return [...demoCheckout.querySelectorAll("button, a, input, textarea, select")].filter(
    (el) => !el.disabled && !el.closest("[hidden]") && el.getClientRects().length > 0,
  );
}

document.querySelectorAll("[data-open-plan]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openDemoCheckout(button.getAttribute("data-open-plan"), button);
  });
});

demoCheckout.querySelectorAll('input[name="demo-plan-choice"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    if (!radio.checked) return;
    demoPlan = radio.value;
    syncPlanUI();
  });
});

["demo-name", "demo-email", "demo-work"].forEach((id) => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") {
      setDemoError(input, demoFieldMessage(id));
    }
  });
});

demoCheckout.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const next = button.getAttribute("data-next");
    if (demoStep === "brief" && !validateBrief()) return;
    showDemoStep(next);
  });
});

demoCheckout.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    showDemoStep(button.getAttribute("data-back"));
  });
});

function briefPayload() {
  return {
    plan: PLAN_COPY[demoPlan].name,
    name: demoValue("demo-name"),
    email: demoValue("demo-email"),
    business: demoValue("demo-business"),
    work: demoValue("demo-work"),
    audience: demoValue("demo-audience"),
    action: demoValue("demo-action"),
    pages: demoValue("demo-pages"),
    links: demoValue("demo-links"),
    domain: checkedValue("demo-domain"),
    hosting: checkedValue("demo-hosting"),
    brand: demoValue("demo-brand"),
    outside: demoValue("demo-outside"),
  };
}

async function sendCheckoutBrief(payload) {
  const form = document.getElementById("checkout-brief");
  if (!form) return;
  const honeypot = form.elements["bot-field"];
  if (honeypot && honeypot.value.trim()) return;
  Object.entries(payload).forEach(([key, value]) => {
    if (form.elements[key]) form.elements[key].value = value;
  });
  await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(new FormData(form)).toString(),
  });
}

document.getElementById("demo-complete").addEventListener("click", async (event) => {
  event.preventDefault();
  const url = CHECKOUT_MODE === "demo" ? "" : CHECKOUT_URLS[demoPlan];
  if (!url) {
    showDemoStep("done");
    return;
  }
  const payload = briefPayload();
  sessionStorage.setItem("checkout-brief", JSON.stringify(payload));
  try {
    await sendCheckoutBrief(payload);
  } catch {
    // The brief stays in this tab. Payment still opens.
  }
  const target = new URL(url);
  if (payload.email) target.searchParams.set("prefilled_email", payload.email);
  window.location.assign(target.toString());
});

document.getElementById("demo-close").addEventListener("click", (event) => {
  event.preventDefault();
  closeDemoCheckout();
});

document.getElementById("demo-done-close").addEventListener("click", (event) => {
  event.preventDefault();
  closeDemoCheckout();
  document.getElementById("plans").scrollIntoView();
});

document.addEventListener("keydown", (event) => {
  if (demoCheckout.hidden) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeDemoCheckout();
    return;
  }
  if (event.key !== "Tab") return;
  const items = demoFocusable();
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.addEventListener("pageshow", () => {
  if (!demoCheckout.hidden) closeCheckoutUi();
});

const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.textContent = open ? "Menu" : "Close";
    document.querySelector(".top-nav").classList.toggle("is-open", !open);
  });
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
      document.querySelector(".top-nav").classList.remove("is-open");
    });
  });
}

function removeNetlifyHud() {
  document
    .querySelectorAll(
      "#netlify-drawer, [data-netlify-hud], script[src*='netlify/scripts/hud']",
    )
    .forEach((el) => el.remove());
}
removeNetlifyHud();
new MutationObserver(removeNetlifyHud).observe(document.documentElement, {
  childList: true,
  subtree: true,
});
