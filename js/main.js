// PortfolioPDB - public JS (simple y mantenible)

// 1) "Ver más / ver menos" (Acerca de)
;(function setupClamps() {
  const clampEl = document.querySelector('[data-clamp="about"]')
  const btn = document.querySelector('[data-toggle="about"]')

  if (!clampEl || !btn) return

  // Empieza clamped
  clampEl.classList.add('is-clamped')

  btn.addEventListener('click', () => {
    const isClamped = clampEl.classList.toggle('is-clamped')
    btn.textContent = isClamped ? 'Ver más' : 'Ver menos'
    btn.setAttribute('aria-expanded', String(!isClamped))
  })
})()

// 2) Scroll suave y compensación por topbar (evita que el título quede tapado)
;(function setupAnchorScroll() {
  const topbar = document.querySelector('.topbar')
  const offset = topbar ? topbar.offsetHeight + 10 : 66

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]')
    if (!a) return

    const id = a.getAttribute('href')
    if (!id || id === '#') return

    const target = document.querySelector(id)
    if (!target) return

    e.preventDefault()
    const y = target.getBoundingClientRect().top + window.scrollY - offset

    window.scrollTo({ top: y, behavior: 'smooth' })
    history.replaceState(null, '', id)
  })
})()

// 3) Resaltar sección activa en el menú superior (estilo LinkedIn-lite)
;(function setupActiveNav() {
  const links = Array.from(document.querySelectorAll('.topnav-link'))
  if (!links.length) return

  const sections = links
    .map((l) => document.querySelector(l.getAttribute('href')))
    .filter(Boolean)

  const setActive = (id) => {
    links.forEach((l) =>
      l.classList.toggle('is-active', l.getAttribute('href') === id),
    )
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

      if (visible?.target?.id) setActive('#' + visible.target.id)
    },
    { root: null, threshold: [0.2, 0.35, 0.5, 0.65] },
  )

  sections.forEach((s) => observer.observe(s))

  // Clase CSS para el activo (inyectada simple)
  const style = document.createElement('style')
  style.textContent = `
    .topnav-link.is-active {
      background: rgba(255,255,255,0.14);
      text-decoration: none;
    }
  `
  document.head.appendChild(style)
})()

/* // JS mínimo por ahora
console.log('PortfolioPDB cargado correctamente')

document.addEventListener('DOMContentLoaded', () => {
  GridStack.init({
    cellHeight: 80,
    margin: 5,
  })
})
 */
