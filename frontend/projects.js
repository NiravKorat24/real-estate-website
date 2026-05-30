let allProjects = [];
let filteredProjects = [];

function renderProjects(list) {
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = list
    .map(project => {
      const statusText =
        project.status === "completed"
          ? "Completed"
          : project.status === "ongoing"
          ? "Under Construction"
          : project.status === "new"
          ? "Newly Launched"
          : project.status || "Available";
      const statusClass = project.status ? project.status.toLowerCase() : "available";

      return `
        <article class="project-card">
          <a href="site.html?id=${project.id}" class="project-card-img-link">
            <img src="${project.image}" alt="${project.name}">
          </a>
          <div class="project-card-body">
            <div class="project-title">
              <h3>${project.name}</h3>
              <span class="project-status ${statusClass}">${statusText}</span>
            </div>
            <div class="project-location">📍 ${project.location || "Surat, Gujarat"}</div>
            <div class="project-meta">
              <span>${project.size || ""} ${project.type || ""}</span>
              <span>${project.price ? project.price : "Price on request"}</span>
            </div>
            <div class="project-actions">
              <a class="primary" href="site.html?id=${project.id}">EXPLORE WITH US</a>
              <a href="contact.html">Enquire</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  const countEl = document.getElementById("projectCount");
  if (countEl) countEl.textContent = list.length;
}

function buildFilterOptions(container, items, name) {
  container.innerHTML = items
    .map(item => {
      const safe = item || "Other";
      return `
        <label class="filter-option">
          <input type="checkbox" name="${name}" value="${safe}">
          <span>${safe}</span>
        </label>
      `;
    })
    .join("");
}

function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(el => el.value);
}

function applyFilters() {
  const types = getCheckedValues("type");
  const status = getCheckedValues("status");
  const locations = getCheckedValues("location");

  filteredProjects = allProjects.filter(project => {
    const typeOk = types.length ? types.includes(project.type || "Other") : true;
    const statusOk = status.length ? status.includes(project.status || "Other") : true;
    const locationOk = locations.length ? locations.includes(project.location || "Other") : true;
    return typeOk && statusOk && locationOk;
  });

  renderProjects(filteredProjects);
  closeFilterPanel();
}

function clearFilters() {
  document
    .querySelectorAll(".filter-options input[type='checkbox']")
    .forEach(input => (input.checked = false));
  filteredProjects = [...allProjects];
  renderProjects(filteredProjects);
  closeFilterPanel();
}

function openFilterPanel() {
  document.getElementById("filterPanel").classList.add("active");
  document.getElementById("filterOverlay").classList.add("active");
}

function closeFilterPanel() {
  document.getElementById("filterPanel").classList.remove("active");
  document.getElementById("filterOverlay").classList.remove("active");
}

function openMenu() {
  document.getElementById("mobileMenu").classList.add("active");
  document.getElementById("menuOverlay").classList.add("active");
}

function closeMenu() {
  document.getElementById("mobileMenu").classList.remove("active");
  document.getElementById("menuOverlay").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("sites.json")
    .then(res => res.json())
    .then(data => {
      allProjects = data || [];
      filteredProjects = [...allProjects];
      renderProjects(filteredProjects);

      const typeValues = Array.from(new Set(allProjects.map(item => item.type || "Other")));
      const statusValues = Array.from(new Set(allProjects.map(item => item.status || "Other")));
      const locationValues = Array.from(new Set(allProjects.map(item => item.location || "Other")));

      buildFilterOptions(document.getElementById("filterTypes"), typeValues, "type");
      buildFilterOptions(document.getElementById("filterStatus"), statusValues, "status");
      buildFilterOptions(document.getElementById("filterLocations"), locationValues, "location");
    });

  document.getElementById("openFilters").addEventListener("click", openFilterPanel);
  document.getElementById("closeFilters").addEventListener("click", closeFilterPanel);
  document.getElementById("filterOverlay").addEventListener("click", closeFilterPanel);
  document.getElementById("applyFilters").addEventListener("click", applyFilters);
  document.getElementById("clearFilters").addEventListener("click", clearFilters);

  document.getElementById("menuToggle").addEventListener("click", openMenu);
  document.getElementById("menuClose").addEventListener("click", closeMenu);
  document.getElementById("menuOverlay").addEventListener("click", closeMenu);
});

/* =========================================
   SCROLL ANIMATIONS
========================================= */
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", initScrollObserver);
