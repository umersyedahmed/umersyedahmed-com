import "./style.css";

const LINKEDIN = "https://www.linkedin.com/in/umersyedahmed";

const year = document.querySelector("[data-year]");
const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");
const submitBtn = form.querySelector('button[type="submit"]');
const contact = document.querySelector("#contact");
const navLinks = [...document.querySelectorAll(".section-link")];

if (year) year.textContent = String(new Date().getFullYear());

const sections = ["intro", "about", "experience", "skills", "contact"]
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
