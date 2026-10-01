import "./style.css";

const LINKEDIN = "https://www.linkedin.com/in/umer-ahmed-9516611b7/";
const GITHUB = "https://github.com/umersyedahmed";

document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const navLinks = [...navMenu.querySelectorAll('a[href^="#"]')];
const year = document.querySelector("[data-year]");
const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");
const modeNote = document.querySelector("#contact-mode");
const submitBtn = form.querySelector('button[type="submit"]');

const emailTo = (import.meta.env.VITE_CONTACT_EMAIL || "").trim();
const formspreeId = (import.meta.env.VITE_FORMSPREE_FORM_ID || "").trim();
const emailReady = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTo);
const formspreeReady = /^[a-zA-Z0-9]+$/.test(formspreeId);

const contactMode = formspreeReady
  ? "formspree"
  : emailReady
    ? "mailto"
    : "unconfigured";

if (year) year.textContent = String(new Date().getFullYear());

function setNavOpen(open) {
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navMenu.classList.toggle("is-open", open);
  document.body.classList.toggle("nav-open", open);
}

navToggle.addEventListener("click", () => {
  setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setNavOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavOpen(false);
});

const desktopNav = window.matchMedia("(min-width: 800px)");
desktopNav.addEventListener("change", (event) => {
  if (event.matches) setNavOpen(false);
});

function onScroll() {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.removeAttribute("aria-current"));
        const current = navMenu.querySelector(`a[href="#${entry.target.id}"]`);
        if (current) current.setAttribute("aria-current", "true");
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));
}

if (contactMode === "formspree") {
  modeNote.textContent =
    "Send a note here and it comes straight to me. A few lines about the project is plenty.";
  submitBtn.textContent = "Send message";
} else if (contactMode === "mailto") {
  modeNote.textContent =
    "Sending opens your email app with this note filled in, ready for you to send.";
  submitBtn.textContent = "Open email draft";
}

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

  const name = fields[0].value.trim();
  const email = fields[1].value.trim();
  const message = fields[2].value.trim();

  if (contactMode === "unconfigured") {
    setStatus(
      "This demo doesn’t deliver email yet. Reach Umer on",
      [
        { href: LINKEDIN, label: "LinkedIn" },
        { href: GITHUB, label: "GitHub" },
      ],
    );
    return;
  }

  if (contactMode === "mailto") {
    const subject = `Project note from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus(
      "Your email app should open with this note. If it doesn’t, send the same details on",
      [{ href: LINKEDIN, label: "LinkedIn" }],
    );
    return;
  }

  submitBtn.disabled = true;
  form.setAttribute("aria-busy", "true");
  try {
    const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _replyto: email,
        _subject: `Portfolio note from ${name}`,
      }),
    });
    if (!response.ok) {
      throw new Error("Formspree rejected the message");
    }
    form.reset();
    setStatus("Message sent. I’ll reply by email.");
  } catch {
    setStatus(
      "The message didn’t go through. Try again, or reach me on",
      [{ href: LINKEDIN, label: "LinkedIn" }],
    );
  } finally {
    submitBtn.disabled = false;
    form.removeAttribute("aria-busy");
  }
});
