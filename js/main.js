const COUNTER_API = "https://portfoliopdb-counter.pablo-dominguezb.workers.dev";
const PORTFOLIO_DEBUG =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";
let latestPortfolioStats = null;

const DEFAULT_LANG = "es";
const SUPPORTED_LANGS = ["es", "en"];

const translations = {
  es: {
    articles_label: "Publicación",
    latest_articles: "Últimos artículos",
    latest_articles_intro:
      "Ideas sobre tecnología, producto, IA y liderazgo técnico.",
    view_all_articles: "Seguir leyendo →",

    hero_title: "Tech Lead & AI Product Strategist",
    hero_subtitle:
      "Arquitectura, datos e inteligencia artificial aplicada a negocio.",

    about_title: "Sobre mí",
    about_p1:
      "Lidero equipos técnicos y proyectos estratégicos donde tecnología y negocio convergen. Mi foco está en arquitectura escalable, inteligencia artificial aplicada y construcción de productos digitales con impacto medible.",
    about_p2:
      "He trabajado en entornos complejos de banca y transformación digital, combinando liderazgo técnico, visión estratégica y ejecución rigurosa.",
    about_p3:
      "Me gusta el humor, algún deporte, la filosofía, descubrir ideas y gente, la gente lista, el mundo amable, y vivir con entusiasmo.",

    experience_title: "Experiencia",
    contact_title: "Contacto",
    contact_intro:
      "Puedes conectar conmigo a través de LinkedIn o escribirme directamente.",

    publication_label: "Publicación",
    articles_page_title: "Artículos",
    articles_page_intro:
      "Ideas, aprendizajes y reflexiones sobre tecnología, producto, inteligencia artificial y liderazgo.",

    home_article_1_category: "Liderazgo técnico",
    home_article_1_title: "Cuatro años en mil palabras (puedes contarlas)",
    home_article_1_summary:
      "Una retrospectiva profesional sobre aprendizaje, cambio, tecnología y evolución dentro de BBVA.",
    home_article_2_category: "Producto & propósito",
    home_article_2_title: "Quien comparta tu “por qué”, es tuyo",
    home_article_2_summary:
      "El círculo de oro de Simon Sinek aplicado al trabajo y al liderazgo.",
    home_article_3_category: "Carrera profesional",
    home_article_3_title: "Otros cuatro años en otras mil palabras",
    home_article_3_summary:
      "Segunda retrospectiva profesional sobre evolución, contexto y aprendizaje.",

    article_retro_1_title: "Cuatro años en mil palabras (puedes contarlas)",
    article_retro_1_meta: "23 de diciembre de 2020 · 5 min lectura",
    article_retro_1_summary:
      "Primera pieza publicada directamente en la web, como base de la nueva plataforma editorial.",

    article_golden_title: "Quien comparta tu “por qué”, es tuyo.",
    article_golden_meta: "22 de diciembre de 2021 · 4 min lectura",
    article_golden_summary:
      "El círculo de oro de Simon Sinek aplicado a tu trabajo.",

    article_external_retro_2_summary:
      "Externo (LinkedIn). Retro de los segundos 4 años en BBVA",
    article_external_rosetta_summary:
      "Externo (LinkedIn). Reflexiones sobre liderazgo",

    back_home: "← Volver",
    breadcrumb_home: "Inicio",
    breadcrumb_articles: "Artículos",
    article_category_editorial: "Editorial",

    feedback_title: "¿Qué te ha parecido este artículo?",
    feedback_intro: "Tu feedback me ayuda a mejorar la línea editorial.",
    feedback_useful: "Me ha aportado valor",
    feedback_debatable: "Interesante, pero debatible",
    feedback_not_convinced: "No me convence",
    feedback_more_like_this: "Quiero más sobre este tema",
    feedback_thanks:
      "Gracias. Me ayuda mucho para seguir afinando el contenido.",
  },

  en: {
    articles_label: "Publication",
    latest_articles: "Latest articles",
    latest_articles_intro:
      "Ideas on technology, product, AI and technical leadership.",
    view_all_articles: "Keep reading →",

    hero_title: "Tech Lead & AI Product Strategist",
    hero_subtitle:
      "Architecture, data and artificial intelligence applied to business.",

    about_title: "About",
    about_p1:
      "I lead technical teams and strategic projects where technology and business converge. My focus is scalable architecture, applied artificial intelligence and building digital products with measurable impact.",
    about_p2:
      "I have worked in complex banking and digital transformation environments, combining technical leadership, strategic vision and rigorous execution.",
    about_p3:
      "I enjoy humor, some sport, philosophy, discovering ideas and people, smart people, a kinder world, and living with enthusiasm.",

    experience_title: "Experience",
    contact_title: "Contact",
    contact_intro:
      "You can connect with me through LinkedIn or contact me directly.",

    publication_label: "Publication",
    articles_page_title: "Articles",
    articles_page_intro:
      "Ideas, lessons and reflections on technology, product, artificial intelligence and leadership.",

    home_article_1_category: "Technical leadership",
    home_article_1_title: "Four years in a thousand words",
    home_article_1_summary:
      "A professional retrospective on learning, change, technology and evolution inside BBVA.",
    home_article_2_category: "Product & purpose",
    home_article_2_title: "Whoever shares your why is yours",
    home_article_2_summary:
      "Simon Sinek’s Golden Circle applied to work and leadership.",
    home_article_3_category: "Professional career",
    home_article_3_title: "Another four years in another thousand words",
    home_article_3_summary:
      "A second professional retrospective on evolution, context and learning.",

    article_retro_1_title: "Four years in a thousand words",
    article_retro_1_meta: "December 23, 2020 · 5 min read",
    article_retro_1_summary:
      "The first piece published directly on the website, as the foundation of the new editorial platform.",

    article_golden_title: "Whoever shares your why is yours",
    article_golden_meta: "December 22, 2021 · 4 min read",
    article_golden_summary: "Simon Sinek’s Golden Circle applied to your work.",

    article_external_retro_2_summary:
      "External (LinkedIn). A retrospective on the second four years at BBVA",
    article_external_rosetta_summary:
      "External (LinkedIn). Reflections on leadership",

    back_home: "← Back",
    breadcrumb_home: "Home",
    breadcrumb_articles: "Articles",
    article_category_editorial: "Editorial",

    feedback_title: "What did you think of this article?",
    feedback_intro: "Your feedback helps me improve the editorial direction.",
    feedback_useful: "It was valuable",
    feedback_debatable: "Interesting, but debatable",
    feedback_not_convinced: "I am not convinced",
    feedback_more_like_this: "I want more on this topic",
    feedback_thanks: "Thanks. This helps me keep improving the content.",
  },
};

// const translations = {
//   es: {
//     latest_articles: "Últimos artículos",
//     latest_articles_intro:
//       "Ideas sobre tecnología, producto, IA y liderazgo técnico.",
//     view_all_articles: "Ver todos los artículos →",
//     hero_title: "Tech Lead & AI Product Strategist",
//     hero_subtitle:
//       "Arquitectura, datos e inteligencia artificial aplicada a negocio.",
//     about_title: "Sobre mí",
//     experience_title: "Experiencia",
//     contact_title: "Contacto",
//     contact_intro:
//       "Puedes conectar conmigo a través de LinkedIn o escribirme directamente.",
//     publication_label: "Publicación",
//     articles_page_title: "Artículos",
//     articles_page_intro:
//       "Ideas, aprendizajes y reflexiones sobre tecnología, producto, inteligencia artificial y liderazgo.",
//     feedback_title: "¿Qué te ha parecido este artículo?",
//     feedback_intro: "Tu feedback me ayuda a mejorar la línea editorial.",
//     feedback_useful: "Me ha aportado valor",
//     feedback_debatable: "Interesante, pero debatible",
//     feedback_not_convinced: "No me convence",
//     feedback_more_like_this: "Quiero más sobre este tema",
//     feedback_thanks:
//       "Gracias. Me ayuda mucho para seguir afinando el contenido.",
//     articles_label: "Publicación",
//     latest_articles: "Últimos artículos",
//     latest_articles_intro:
//       "Ideas sobre tecnología, producto, IA y liderazgo técnico.",
//     view_all_articles: "Seguir leyendo →",
//   },
//   en: {
//     latest_articles: "Latest articles",
//     latest_articles_intro:
//       "Ideas on technology, product, AI and technical leadership.",
//     view_all_articles: "View all articles →",
//     hero_title: "Tech Lead & AI Product Strategist",
//     hero_subtitle:
//       "Architecture, data and artificial intelligence applied to business.",
//     about_title: "About",
//     experience_title: "Experience",
//     contact_title: "Contact",
//     contact_intro:
//       "You can connect with me through LinkedIn or contact me directly.",
//     publication_label: "Publication",
//     articles_page_title: "Articles",
//     articles_page_intro:
//       "Ideas, lessons and reflections on technology, product, artificial intelligence and leadership.",
//     feedback_title: "What did you think of this article?",
//     feedback_intro: "Your feedback helps me improve the editorial direction.",
//     feedback_useful: "It was valuable",
//     feedback_debatable: "Interesting, but debatable",
//     feedback_not_convinced: "I am not convinced",
//     feedback_more_like_this: "I want more on this topic",
//     feedback_thanks: "Thanks. This helps me keep improving the content.",
//     articles_label: "Publication",
//     latest_articles: "Latest articles",
//     latest_articles_intro:
//       "Ideas on technology, product, AI and technical leadership.",
//     view_all_articles: "Keep reading →",
//   },
// };
// const COUNTER_API = "https://portfoliopdb-counter.pablo-dominguezb.workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  initLanguageToggle();
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
function getSavedLanguage() {
  const saved = localStorage.getItem("portfolio-lang");
  return SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG;
}

function setLanguage(lang) {
  const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;

  localStorage.setItem("portfolio-lang", safeLang);
  document.documentElement.lang = safeLang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = translations[safeLang]?.[key];

    if (value) {
      el.textContent = value;
    }
  });

  const toggle = document.getElementById("langToggle");
  if (toggle) {
    toggle.textContent = safeLang.toUpperCase();
  }
}

function initLanguageToggle() {
  const toggle = document.getElementById("langToggle");
  const currentLang = getSavedLanguage();

  setLanguage(currentLang);

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const nextLang = getSavedLanguage() === "es" ? "en" : "es";
    setLanguage(nextLang);
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
        const lang = getSavedLanguage();
        message.textContent =
          translations[lang]?.feedback_thanks ||
          translations[DEFAULT_LANG].feedback_thanks;
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
          const lang = getSavedLanguage();
          message.textContent =
            translations[lang]?.feedback_thanks ||
            translations[DEFAULT_LANG].feedback_thanks;
          message.hidden = false;
        }
      });
    });
  });
}

function trackSiteVisit() {
  sendHit({ type: "site" });
}
