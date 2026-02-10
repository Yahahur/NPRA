document.addEventListener("DOMContentLoaded", () => {

  const makers = [
    "HONDA",
    "SUZUKI",
    "MAZDA",
    "SUBARU",
    "DAIHATSU",
    "TOYOTA",
    "NISSAN"
  ];

  const makerGrid = document.getElementById("makerGrid");

  /* ================= COUNT STATUS FROM SAVED TABLE ================= */
  function getSelectStatus(select) {
    if (select.dataset.status) return select.dataset.status;

    const selectedOption = select.querySelector("option[selected]");
    if (selectedOption) {
      return selectedOption.value || selectedOption.textContent.trim();
    }

    const selectedIndex = select.selectedIndex >= 0 ? select.selectedIndex : 0;
    const fallback = select.options[selectedIndex];
    return fallback ? (fallback.value || fallback.textContent.trim()) : "Open";
  }

  function getStatusCount(maker) {
    const key = `NPRA_MASTER_SCHEDULE_${maker}`;
    const html = localStorage.getItem(key);

    const count = {
      Open: 0,
      Close: 0,
      Cancelled: 0,
      Rejected: 0
    };

    if (!html) return count;

    const temp = document.createElement("tbody");
    temp.innerHTML = html;

    temp.querySelectorAll(".status-select").forEach(select => {
      const val = getSelectStatus(select);
      if (count.hasOwnProperty(val)) {
        count[val]++;
      }
    });

    return count;
  }

  /* ================= BUILD DASHBOARD ================= */
  function buildCard(maker) {
    const status = getStatusCount(maker);

    const card = document.createElement("div");
    card.className = "maker-card";

    card.innerHTML = `
      <div class="maker-name">${maker}</div>

      <div class="status-row open">
        <span>OPEN</span>
        <strong>${status.Open}</strong>
      </div>

      <div class="status-row close">
        <span>CLOSED</span>
        <strong>${status.Close}</strong>
      </div>

      <div class="status-row cancelled">
        <span>CANCELLED</span>
        <strong>${status.Cancelled}</strong>
      </div>

      <div class="status-row rejected">
        <span>REJECTED</span>
        <strong>${status.Rejected}</strong>
      </div>
    `;

    card.addEventListener("click", () => {
      localStorage.setItem("selectedMaker", maker);
      window.location.href = "honda.html";
    });

    return card;
  }

  function renderDashboard() {
    makerGrid.innerHTML = "";
    makers.forEach(maker => makerGrid.appendChild(buildCard(maker)));
  }

  renderDashboard();

  // Keep counts fresh if localStorage changes while dashboard tab is open.
  window.addEventListener("storage", renderDashboard);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      renderDashboard();
    }
  });

  });