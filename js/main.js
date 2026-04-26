const COUNTER_API = "https://portfoliopdb-counter.pablo-dominguezb.workers.dev";
const PORTFOLIO_DEBUG =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";
let latestPortfolioStats = null;
// const COUNTER_API = "https://portfoliopdb-counter.pablo-dominguezb.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initExperienceAccordion();
  initFadeIn();
  loadCounters();
  trackSiteVisit();
  bindArticleClicks();
  bindSiteClicks();
  initArticleFeedback();
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
  const slugs = Array.from(articleEls)
    .map((el) => el.dataset.article)
    .filter(Boolean);

  if (!slugs.length) return;

  const url = `${COUNTER_API}/stats?articles=${slugs.join(",")}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return;

    const data = await res.json();
    latestPortfolioStats = data;

    if (PORTFOLIO_DEBUG) {
      // console.log("📊 Portfolio stats:", data);
    }
  } catch (err) {
    if (PORTFOLIO_DEBUG) {
      console.warn("Counter API not available", err);
    }
  }
}

function bindArticleClicks() {
  document.querySelectorAll("[data-article-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const articleEl = link.closest("[data-article]");

      if (!articleEl || !articleEl.dataset.article) return;

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
function portfolioStats() {
  if (!latestPortfolioStats) {
    console.log("No hay estadísticas cargadas todavía.");
    console.log(
      "Prueba a recargar la página y volver a ejecutar portfolioStats().",
    );
    return;
  }

  const siteVisits = latestPortfolioStats.site ?? "Sin datos";
  const articles = latestPortfolioStats.articles ?? {};

  console.group("📊 Estadísticas del portfolio");

  console.group("🌍 Visitas del sitio");
  console.log("Total:", siteVisits);
  console.groupEnd();

  console.group("📝 Estadísticas por artículo");

  if (!Object.keys(articles).length) {
    console.log("No hay estadísticas de artículos disponibles.");
  } else {
    Object.entries(articles).forEach(([slug, visits]) => {
      console.group(slug);
      console.log("Visitas / clics:", visits);
      console.groupEnd();
    });
  }

  console.groupEnd();

  console.group("🧪 Datos brutos");
  console.log(latestPortfolioStats);
  console.groupEnd();

  console.groupEnd();
}

window.portfolioStats = portfolioStats;

function initArticleFeedback() {
  const feedbackBlocks = document.querySelectorAll("[data-feedback-slug]");
  if (!feedbackBlocks.length) return;

  feedbackBlocks.forEach((block) => {
    const slug = block.dataset.feedbackSlug;
    const buttons = block.querySelectorAll("[data-feedback-value]");
    const message = block.querySelector(".feedback-message");

    if (!slug || !buttons.length) return;

    const storageKey = `portfolio-feedback:${slug}`;
    const previousVote = localStorage.getItem(storageKey);

    if (previousVote) {
      buttons.forEach((button) => {
        if (button.dataset.feedbackValue === previousVote) {
          button.classList.add("is-selected");
        }
        button.disabled = true;
      });

      if (message) {
        message.hidden = false;
      }

      return;
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.feedbackValue;
        if (!value) return;

        localStorage.setItem(storageKey, value);

        sendHit({
          type: "feedback",
          slug,
          value,
        });

        buttons.forEach((btn) => {
          if (btn === button) {
            btn.classList.add("is-selected");
          }
          btn.disabled = true;
        });

        if (message) {
          message.hidden = false;
        }
      });
    });
  });
}

function trackSiteVisit() {
  sendHit({ type: "site" });
}
