const COUNTER_API = "https://portfoliopdb-counter.pablo-dominguezb.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initExperienceAccordion();
  initFadeIn();
  loadCounters();
  bindArticleClicks();
  bindSiteClicks();
});

// =====================
// Theme toggle
// =====================
function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  document.body.classList.remove("dark");

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

// =====================
// Experience accordion
// =====================
function initExperienceAccordion() {
  const roles = document.querySelectorAll(".experience-role");
  if (!roles.length) return;

  roles.forEach((role) => {
    const btn = role.querySelector(".role-toggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isActive = role.classList.contains("active");

      roles.forEach((item) => item.classList.remove("active"));

      if (!isActive) {
        role.classList.add("active");
      }
    });
  });
  if (roles.length > 0) {
    roles[0].classList.add("active");
  }
}

// =====================
// Fade-in on scroll
// =====================
function initFadeIn() {
  const items = document.querySelectorAll(".fade-in");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  items.forEach((item) => observer.observe(item));
}

// =====================
// Counters
// =====================
async function loadCounters() {
  const articleEls = document.querySelectorAll("[data-article]");
  const slugs = Array.from(articleEls).map((el) => el.dataset.article);

  if (!slugs.length) return;

  const url = `${COUNTER_API}/stats?articles=${slugs.join(",")}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return;

    const data = await res.json();

    console.log("📊 Counter stats received:", data);

    const siteEl = document.getElementById("siteCounter");
    if (siteEl && data.site) {
      siteEl.textContent = data.site;
    }

    articleEls.forEach((el) => {
      const slug = el.dataset.article;
      const countEl = el.querySelector("[data-article-count]");

      if (countEl && data.articles && data.articles[slug]) {
        countEl.textContent = data.articles[slug];
      }
    });
  } catch (err) {
    if (location.hostname === "localhost") {
      console.warn("Counter API not available", err);
    }
  }
}

function bindArticleClicks() {
  document.querySelectorAll("[data-article-link]").forEach((link) => {
    link.addEventListener("click", () => {
      if (!articleEl || !articleEl.dataset.article) return;
      if (!articleEl) return;

      const slug = articleEl.dataset.article;
      sendHit({ type: "article", slug });
    });
  });
}

function bindSiteClicks() {
  document.querySelectorAll("[data-site-hit]").forEach((link) => {
    link.addEventListener("click", () => {
      sendHit({ type: "site" });
    });
  });
}

function sendHit(payload) {
  try {
    fetch(`${COUNTER_API}/hit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (_) {
    // silencioso a propósito
  }
}
