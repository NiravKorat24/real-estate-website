let currentIndex = 0;
let autoSlideInterval;
let touchStartX = 0;
let allProperties = [];
let filteredProperties = [];
const PROPERTY_ENQUIRY_WHATSAPP = "9090129012";

function formatArea(site) {
  if (site.areaSqFt && site.areaSqM) {
    return `${site.areaSqFt} sq. ft | ${site.areaSqM} sq. m`;
  }
  if (site.areaSqFt) {
    const sqm = (Number(site.areaSqFt) * 0.092903).toFixed(2);
    return `${site.areaSqFt} sq. ft | ${sqm} sq. m`;
  }
  if (site.areaSqM) {
    const sqft = (Number(site.areaSqM) * 10.7639).toFixed(2);
    return `${sqft} sq. ft | ${site.areaSqM} sq. m`;
  }
  if (site.area) return site.area;
  return "";
}

function renderCards(list) {
  const track = document.getElementById("propertyTrack");
  if (!track) return;

  track.innerHTML = list.map(site => {
    const statusText = site.status === "ongoing" ? "Under Construction" : "Ready to Move";

    return `
      <div class="property-card">
        <a href="site.html?id=${site.id}" class="property-card-inner property-card-link" aria-label="Open ${site.name}">
          <div class="card-media" style="--card-image: url('${site.image}')">
            <span class="card-badge ${site.status ? site.status.toLowerCase() : 'available'}">${statusText}</span>
            <img src="${site.image}" alt="${site.name}" loading="lazy" decoding="async">
            <div class="card-overlay">
            <h3>${site.name}</h3>
            <p class="card-location">📍 ${site.location || "Surat, Gujarat"}</p>
            <p class="card-specs">${site.size || ""} ${site.type || ""}</p>
            
            <div class="card-actions">
              <span class="action-tag">Buy</span>
              <span class="action-tag">Invest</span>
              <span class="action-tag">Lease</span>
            </div>

            <span class="card-cta">EXPLORE WITH US</span>
            </div>
          </div>
        </a>
      </div>
    `;
  }).join("");

  currentIndex = 0;
  updateSlider();
  createDots(list.length);
  startAutoSlide();

  const countEl = document.getElementById("projectCount");
  if (countEl) countEl.textContent = list.length;
}

function updateSlider() {
  const track = document.getElementById("propertyTrack");
  if (!track) return;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  updateDots();
}

function slidePrev() {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
}

function slideNext() {
  const track = document.getElementById("propertyTrack");
  if (!track) return;
  const total = track.children.length;
  if (currentIndex < total - 1) {
    currentIndex++;
    updateSlider();
  }
}

function startAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    const track = document.getElementById("propertyTrack");
    if (!track) return;
    const total = track.children.length;
    if (total === 0) return;
    currentIndex = (currentIndex + 1) % total;
    updateSlider();
  }, 4000);
}

function createDots(count) {
  const dots = document.getElementById("sliderDots");
  dots.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    if (i === 0) span.classList.add("active");
    dots.appendChild(span);
  }
}

function updateDots() {
  const dots = document.querySelectorAll("#sliderDots span");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

function buildFilterOptions(container, items, name) {
  if (!container) return;
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

  filteredProperties = allProperties.filter(site => {
    const typeOk = types.length ? types.includes(site.type || "Other") : true;
    const statusOk = status.length ? status.includes(site.status || "Other") : true;
    const locationOk = locations.length
      ? locations.includes(site.location || "Other")
      : true;
    return typeOk && statusOk && locationOk;
  });

  renderCards(filteredProperties);
  closeFilterPanel();
}

function clearFilters() {
  document
    .querySelectorAll(".filter-options input[type='checkbox']")
    .forEach(input => (input.checked = false));
  filteredProperties = [...allProperties];
  renderCards(filteredProperties);
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
  const track = document.getElementById("propertyTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!track) return;

  fetch("sites.json")
    .then(res => res.json())
    .then(data => {
      allProperties = data || [];
      filteredProperties = [...allProperties];
      renderCards(filteredProperties);

      const typeValues = Array.from(new Set(allProperties.map(item => item.type || "Other")));
      const statusValues = Array.from(new Set(allProperties.map(item => item.status || "Other")));
      const locationValues = Array.from(
        new Set(allProperties.map(item => item.location || "Other"))
      );

      buildFilterOptions(document.getElementById("filterTypes"), typeValues, "type");
      buildFilterOptions(document.getElementById("filterStatus"), statusValues, "status");
      buildFilterOptions(document.getElementById("filterLocations"), locationValues, "location");
    });

  prevBtn.addEventListener("click", slidePrev);
  nextBtn.addEventListener("click", slideNext);

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
   TOUCH / SWIPE (MOBILE)
========================================= */
document.addEventListener("touchstart", e => {
  const slider = e.target.closest(".slider");
  if (!slider) return;
  touchStartX = e.touches[0].clientX;
  clearInterval(autoSlideInterval);
}, { passive: true });

document.addEventListener("touchend", e => {
  const slider = e.target.closest(".slider");
  if (!slider) return;

  const diff = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(diff) > 50) diff < 0 ? slideNext() : slidePrev();
  startAutoSlide();
}, { passive: true });

/* =========================================
   VALUATION MODAL
========================================= */
function openValuationModal() {
  document.getElementById("valuationModal").style.display = "flex";
}

function closeValuationModal() {
  document.getElementById("valuationModal").style.display = "none";
}

function submitValuation() {
  const lines = [
    "Hello Silvassa Group,",
    "",
    "New Property Valuation Request",
    "",
    "Customer Details:",
    `Name: ${valName.value || "-"}`,
    `Phone: ${valPhone.value || "-"}`,
    `Location: ${valLocation.value || "-"}`,
    `Property Details: ${valDetails.value || "-"}`,
    "",
    "Please contact me for the next steps.",
    "Thank you."
  ];
  const msg = encodeURIComponent(lines.join("\n"));

  window.open(`https://wa.me/919090129012?text=${msg}`, "_blank");
  closeValuationModal();
}

function openStickyEnquiry() {
  const lines = [
    "Hello Silvassa Group,",
    "",
    "I am looking for property options.",
    "Please share available projects and current offers.",
    "",
    "Thank you."
  ];
  const msg = encodeURIComponent(lines.join("\n"));
  window.open(`https://wa.me/${PROPERTY_ENQUIRY_WHATSAPP}?text=${msg}`, "_blank");
}

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
