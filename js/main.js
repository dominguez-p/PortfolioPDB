// ==============================
// Experience: collapse / expand
// ==============================
;(function setupExperienceToggles() {
  const toggles = document.querySelectorAll('[data-toggle="roles"]')

  toggles.forEach((btn) => {
    const company = btn.closest('.experience-company')
    const roles = company.querySelector('.experience-roles')

    if (!roles) return

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true'

      btn.setAttribute('aria-expanded', String(!expanded))
      roles.hidden = expanded

      btn.textContent = expanded
        ? btn.textContent.replace('Ver menos', 'Ver roles')
        : 'Ver menos'
    })
  })
})()
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

// ======================================================
// Experience accordion:
// - One company open at a time
// - One role open at a time
// - Default: current company + current role open
// - No persistence
// ======================================================
;(function setupExperienceAccordion() {
  const root = document.querySelector('.experience')
  if (!root) return

  const companies = Array.from(root.querySelectorAll('[data-company]'))

  const setCollapsibleOpen = (collapsibleEl, open) => {
    if (!collapsibleEl) return
    collapsibleEl.classList.toggle('is-open', open)
  }

  const setCompanyOpen = (companyEl, open) => {
    const btn = companyEl.querySelector('.exp-company-toggle')
    const body = companyEl.querySelector('.exp-company-body[data-collapsible]')

    if (!btn || !body) return

    btn.setAttribute('aria-expanded', String(open))
    const cta = btn.querySelector('.exp-company-cta')
    if (cta) cta.textContent = open ? 'Ocultar' : 'Ver'

    setCollapsibleOpen(body, open)

    // If closing a company, also close any open role inside
    if (!open) {
      const openRole = companyEl.querySelector(
        ".exp-role-toggle[aria-expanded='true']",
      )
      if (openRole) {
        setRoleOpen(openRole.closest('[data-role]'), false)
      }
    }
  }

  const setRoleOpen = (roleEl, open) => {
    const btn = roleEl.querySelector('.exp-role-toggle')
    const detail = roleEl.querySelector('.exp-role-detail[data-collapsible]')

    if (!btn || !detail) return

    btn.setAttribute('aria-expanded', String(open))
    const cta = btn.querySelector('.exp-role-cta')
    if (cta) cta.textContent = open ? 'Ver menos' : 'Ver más'

    setCollapsibleOpen(detail, open)
  }

  const closeAllCompaniesExcept = (keepCompany) => {
    companies.forEach((c) => {
      if (c !== keepCompany) setCompanyOpen(c, false)
    })
  }

  const closeAllRoles = () => {
    companies.forEach((company) => {
      const roles = company.querySelectorAll('[data-role]')
      roles.forEach((r) => setRoleOpen(r, false))
    })
  }

  // ---------
  // Init state
  // ---------
  // Start: close everything
  companies.forEach((c) => setCompanyOpen(c, false))
  closeAllRoles()

  // Open current company (fallback to first)
  const currentCompany =
    companies.find((c) => c.getAttribute('data-current') === 'true') ||
    companies[0]
  if (currentCompany) {
    setCompanyOpen(currentCompany, true)
    closeAllCompaniesExcept(currentCompany)

    // Open current role within current company (fallback to first role)
    const roles = Array.from(currentCompany.querySelectorAll('[data-role]'))
    const currentRole =
      roles.find((r) => r.getAttribute('data-current') === 'true') || roles[0]

    if (currentRole) {
      closeAllRoles()
      setRoleOpen(currentRole, true)
    }
  }

  // -----------------
  // Click interactions
  // -----------------
  root.addEventListener('click', (e) => {
    const companyBtn = e.target.closest('.exp-company-toggle')
    if (companyBtn) {
      const company = companyBtn.closest('[data-company]')
      const isOpen = companyBtn.getAttribute('aria-expanded') === 'true'

      if (isOpen) {
        setCompanyOpen(company, false)
      } else {
        closeAllCompaniesExcept(company)
        setCompanyOpen(company, true)
        // When opening a company, do not auto-open a role (keeps user control)
        // But if you prefer: open first role automatically, you can add it here.
      }
      return
    }

    const roleBtn = e.target.closest('.exp-role-toggle')
    if (roleBtn) {
      const role = roleBtn.closest('[data-role]')
      const isOpen = roleBtn.getAttribute('aria-expanded') === 'true'

      // Ensure the parent company is open
      const company = roleBtn.closest('[data-company]')
      if (company) {
        closeAllCompaniesExcept(company)
        setCompanyOpen(company, true)
      }

      // Accordion: only one role open at a time
      if (isOpen) {
        setRoleOpen(role, false)
      } else {
        closeAllRoles()
        setRoleOpen(role, true)
      }
    }
  })
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
