function renderSystems(programId) {
  const p = DATA.programs.find((x) => x.id === programId);

  const systemItems = DATA.systems.filter(
    (item) =>
      item.programId === programId &&
      item.country === selectedCountry &&
      item.product === selectedSystemProduct,
  );

  const architectureGapItems = (DATA.architectureFeaturesGaps || []).filter(
    (item) =>
      item.programId === programId &&
      item["RtC Anchor Country"] === selectedCountry &&
      item.product === selectedSystemProduct,
  );

  const relationshipItems = (DATA.systemRelationships || []).filter((item) => {
    const itemCountry = item.country || item["RtC Anchor Country"];

    return (
      String(item.programId || "").trim() === String(programId || "").trim() &&
      String(itemCountry || "").trim() ===
        String(selectedCountry || "").trim() &&
      String(item.product || "").trim() ===
        String(selectedSystemProduct || "").trim()
    );
  });

  const functionalItems = DATA.functional.filter(
    (item) => item.programId === programId && item.country === selectedCountry,
  );

  const affectedSystems = new Set(
    (DATA.functionalSystemLinks || [])
      .filter(
        (link) =>
          String(link.programId || "").trim() ===
            String(programId || "").trim() &&
          String(link.country || "").trim() ===
            String(selectedCountry || "").trim() &&
          String(link.product || "").trim() ===
            String(selectedSystemProduct || "").trim() &&
          String(link.functionalKey || "").trim() ===
            String(selectedCapability || "").trim(),
      )
      .map((link) => String(link.systemComponent || "").trim()),
  );

  if (selectedArchitectureGap) {
    const selectedGap = architectureGapItems.find(
      (item, index) =>
        [
          item.programId,
          item["RtC Anchor Country"],
          item["GAP Asignado"],
          item.Demanda,
          index,
        ].join("::") === selectedArchitectureGap,
    );

    String(selectedGap?.affectedSystemComponents || "")
      .split("|")
      .map((component) => component.trim())
      .filter(Boolean)
      .forEach((component) => affectedSystems.add(component));
  }

  const country = COUNTRIES.find((c) => c.id === selectedCountry);

  const groupedDomains = {};

  functionalItems.forEach((item) => {
    if (!groupedDomains[item.domain]) {
      groupedDomains[item.domain] = [];
    }

    groupedDomains[item.domain].push(item);
  });

  setHead(
    `${p?.name || "Programa"} · Mapa de sistemas`,
    `Arquitectura y capacidades · ${country?.label || selectedCountry}`,
    `Retail Client Solutions > ${
      p?.name || programId
    } > ${country?.label || selectedCountry}`,
  );

  view.innerHTML = "";

  view.append(tpl("#systems-template"));

  const systemsDashboardGrid = document.querySelector("#systemsDashboardGrid");

  const expandSystemMapBtn = document.querySelector("#expandSystemMapBtn");

  if (systemsDashboardGrid) {
    systemsDashboardGrid.classList.toggle(
      "system-map-expanded",
      isSystemMapExpanded,
    );
  }

  if (expandSystemMapBtn) {
    expandSystemMapBtn.textContent = isSystemMapExpanded
      ? "Contraer mapa"
      : "Expandir mapa";
  }

  view.insertAdjacentHTML("afterbegin", renderSystemsProductSelector());

  view.insertAdjacentHTML("afterbegin", renderCountrySelector());

  const backButton = document.querySelector(".back-to-program-btn");

  if (backButton) {
    backButton.dataset.route = `program/${programId}`;

    backButton.textContent = `← Volver a ${p?.name || "programa"}`;
  }

  const groupedSystems = {};

  systemItems.forEach((item) => {
    const layerName = item.layer || "General";

    if (!groupedSystems[layerName]) {
      groupedSystems[layerName] = {};
    }

    const groupName = item.groupName || "Sin agrupación";

    if (!groupedSystems[layerName][groupName]) {
      groupedSystems[layerName][groupName] = [];
    }

    groupedSystems[layerName][groupName].push(item);
  });

  systemLayers.innerHTML = Object.entries(groupedSystems)
    .map(
      ([layerName, groups]) => `
    <article class="layer ${
      layerName.startsWith("GenAI") ? "layer-half-width" : ""
    }">

          <h3>${layerName}</h3>

          <div class="system-groups">

            ${Object.entries(groups)
              .map(([groupName, groupItems]) => {
                const componentsByLevel = {};

                groupItems.forEach((s) => {
                  const level = s.level || "1";

                  const components = String(s.component || "")
                    .split("|")
                    .map((item) => item.trim())
                    .filter(Boolean);

                  if (!componentsByLevel[level]) {
                    componentsByLevel[level] = [];
                  }

                  componentsByLevel[level].push(...components);
                });

                return `
                  <div class="system-group-box">

                    <div class="system-group-title">
                      ${groupName}
                    </div>

                    ${Object.entries(componentsByLevel)
                      .sort(([a], [b]) => Number(a) - Number(b))
                      .map(
                        ([level, components]) => `
                          <div
                            class="system-level-row"
                            data-level="${level}"
                          >

                            ${components
                              .map((component) => {
                                const isAffected =
                                  affectedSystems.has(component);

                                const isSelected =
                                  selectedSystemComponent === component;

                                return `
                                  <button
                                    class="
                                      component
                                      system-component-card
                                      ${
                                        isAffected
                                          ? "affected-by-capability"
                                          : ""
                                      }
                                      ${
                                        isSelected
                                          ? "selected-system-component"
                                          : ""
                                      }
                                    "
                                    type="button"
                                    data-system-component="${component}"
                                    data-system-node="${component}"
                                  >
                                    ${component}
                                  </button>
                                `;
                              })
                              .join("")}

                          </div>
                        `,
                      )
                      .join("")}

                  </div>
                `;
              })
              .join("")}

          </div>

        </article>
      `,
    )
    .join("");

  requestAnimationFrame(() => {
    renderSystemRelationships(relationshipItems);
  });

  systemsTable.outerHTML = `
    <div class="architecture-gap-list">

      ${architectureGapItems
        .map((item, index) => {
          const gapKey = [
            item.programId,
            item["RtC Anchor Country"],
            item["GAP Asignado"],
            item.Demanda,
            index,
          ].join("::");

          return `
            <button
              class="
                architecture-gap-card
                ${selectedArchitectureGap === gapKey ? "selected" : ""}
              "
              type="button"
              data-architecture-gap="${gapKey}"
            >

              <div class="architecture-gap-top">

                <span class="architecture-gap-status">
                  ${item["Estatus revisión PA"] || ""}
                </span>

                <span class="architecture-gap-priority">
                  ${item.Prioridad || ""}
                </span>

              </div>

              <strong class="architecture-gap-title">
                ${item.Demanda || "Sin demanda"}
              </strong>

              <div class="architecture-gap-meta">

                <span>
                  <b>GAP:</b>
                  ${item["GAP asignado"] || "-"}
                </span>

                <span>
                  <b>País:</b>
                  ${item["RtC Anchor Country"] || "-"}
                </span>

                <span>
                  <b>Dependencias:</b>
                  ${item.Dependencias || "-"}
                </span>

              </div>

            </button>
          `;
        })
        .join("")}

    </div>
  `;

  systemsFunctionalMap.innerHTML = Object.entries(groupedDomains)
    .map(
      ([domainName, capabilities]) => `
          <article class="systems-mini-domain">

            <h4>${domainName}</h4>

            ${capabilities
              .map(
                (capability) => `
                  <div class="systems-mini-capability">

                    <strong>
                      ${capability.capability}
                    </strong>

                    <div class="feature-card-list">

                      ${(capability.features || [])
                        .map((feature) => {
                          const featureKey = `${domainName}::${capability.capability}::${feature}`;

                          return `
                            <button
                              class="
                                feature-card
                                ${
                                  selectedCapability === featureKey
                                    ? "selected"
                                    : ""
                                }
                              "
                              type="button"
                              data-feature="${featureKey}"
                            >
                              ${feature}
                            </button>
                          `;
                        })
                        .join("")}

                    </div>

                  </div>
                `,
              )
              .join("")}

          </article>
        `,
    )
    .join("");
}
