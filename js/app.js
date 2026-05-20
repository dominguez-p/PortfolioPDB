let DATA = window.SAMPLE_DATA;

const view = document.querySelector("#view");
const title = document.querySelector("#pageTitle");
const subtitle = document.querySelector("#pageSubtitle");
const crumb = document.querySelector("#breadcrumb");
const statusEl = document.querySelector("#dataStatus");

function setHead(t, s, c = "Retail Client Solutions") {
  title.textContent = t;
  subtitle.textContent = s;
  crumb.textContent = c;
}

function tpl(id) {
  return document.querySelector(id).content.cloneNode(true);
}

function pillClass(s) {
  return s.includes("Atención") ? "red" : s.includes("Piloto") ? "yellow" : "";
}

function route(r) {
  location.hash = r;
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-route]");
  if (b) route(b.dataset.route);
});

function renderLanding() {
  setHead(
    "Retail Client Solutions Control Tower",
    "Portfolio overview, demanda estratégica y evolución de arquitectura",
  );

  view.innerHTML = "";
  view.append(tpl("#landing-template"));

  document.querySelector("#portfolioKpis").innerHTML = DATA.portfolioKpis
    .map(
      (k) => `
        <article class="kpi">
          <div class="kpi-icon">${k[3] || "◎"}</div>
          <div>
            <div class="kpi-label">${k[0] || ""}</div>
            <div class="kpi-value">${k[1] || ""}</div>
            <div class="kpi-sub">${k[2] || ""}</div>
          </div>
        </article>
      `,
    )
    .join("");

  document.querySelector("#programGrid").innerHTML = DATA.programs
    .map(
      (p) => `
        <article class="program-card ${p.enabled ? "" : "disabled"}">
          <div class="program-head">
            <div class="program-icon">${p.icon || "●"}</div>
            <div>
              <h3>${p.name}</h3>
              <p>${p.description}</p>
            </div>
          </div>

          <span class="pill ${pillClass(p.status)}">${p.status}</span>

          <div class="progress-row">
            <div>
              <small>Funcional</small>
              <div class="donut" style="--p:${p.functional}" data-label="${p.functional}%"></div>
            </div>
            <div>
              <small>Sistemas</small>
              <div class="donut" style="--p:${p.systems}" data-label="${p.systems}%"></div>
            </div>
            <div>
              <small>Arquitectura</small>
              <div class="donut" style="--p:${p.architecture}" data-label="${p.architecture}%"></div>
            </div>
          </div>

          <button class="card-link" ${p.enabled ? 'data-route="program/${p.id}"' : "onclick=\"alert('Programa próximamente disponible')\""}>→ Ver programa</button>
        </article>
      `,
    )
    .join("");
}

function renderProgram(programId) {
  const p = DATA.programs.find((x) => x.id === programId);

  if (!p) {
    renderLanding();
    return;
  }

  const modules = DATA.modules.filter((m) => m.programId === programId);
  const roles = DATA.roles.filter((r) => r.programId === programId);
  const priorities = DATA.priorities.filter((x) => x.programId === programId);
}
function renderFunctional(programId) {
  const p = DATA.programs.find((x) => x.id === programId);
  const functionalItems = DATA.functional.filter(
    (item) => item.programId === programId,
  );

  setHead(
    `${p?.name || "Programa"} · Mapa funcional`,
    "Dominios, capacidades y funcionalidades",
    `Retail Client Solutions > ${p?.name || programId} > Mapa funcional`,
  );

  view.innerHTML = "";
  view.append(tpl("#functional-template"));

  document
    .querySelector('[data-route="program-aixbanker"]')
    ?.setAttribute("data-route", `program/${programId}`);

  functionalMap.innerHTML = functionalItems
    .map(
      (d) => `
        <article class="domain">
          <h3>${d.domain}</h3>
          <div class="capability">
            <strong>${d.capability}</strong>
            ${(d.features || []).map((f) => `<div class="feature">• ${f}</div>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}
function renderSystems(programId) {
  const p = DATA.programs.find((x) => x.id === programId);
  const systemItems = DATA.systems.filter(
    (item) => item.programId === programId,
  );

  setHead(
    `${p?.name || "Programa"} · Mapa de sistemas`,
    "Capas, componentes e inventario AS IS",
    `Retail Client Solutions > ${p?.name || programId} > Mapa de sistemas`,
  );

  view.innerHTML = "";
  view.append(tpl("#systems-template"));

  document
    .querySelector('[data-route="program-aixbanker"]')
    ?.setAttribute("data-route", `program/${programId}`);

  const layers = [...new Set(systemItems.map((s) => s.layer))];

  systemLayers.innerHTML = layers
    .map(
      (l) => `
        <article class="layer">
          <h3>${l}</h3>
          ${systemItems
            .filter((s) => s.layer === l)
            .map((s) => `<div class="component">${s.component}</div>`)
            .join("")}
        </article>
      `,
    )
    .join("");

  systemsTable.innerHTML =
    "<thead><tr><th>Capa</th><th>Sistema / componente</th><th>Descripción</th><th>Estado</th><th>País</th></tr></thead><tbody>" +
    systemItems
      .map(
        (s) => `
          <tr>
            <td>${s.layer}</td>
            <td>${s.component}</td>
            <td>${s.description}</td>
            <td>${s.status}</td>
            <td>${s.country}</td>
          </tr>
        `,
      )
      .join("") +
    "</tbody>";
}

function render() {
  const h = location.hash.replace("#", "") || "landing";
  const [routeName, programId] = h.split("/");

  if (routeName === "program") renderProgram(programId);
  else if (routeName === "functional") renderFunctional(programId);
  else if (routeName === "systems") renderSystems(programId);
  else renderLanding();
}

async function init() {
  try {
    if (window.APP_CONFIG.useGoogleSheets) {
      DATA = await loadGoogleSheetsData();
      statusEl.textContent = "Datos Google Sheets API v4 actualizados";
    } else {
      statusEl.textContent = "Datos demo locales";
    }
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Error Sheets API v4: usando demo local";
  }

  render();
}

window.addEventListener("hashchange", render);
init();
