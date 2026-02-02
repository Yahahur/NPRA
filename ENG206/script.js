document.addEventListener("DOMContentLoaded", () => {
  const addRowBtn = document.getElementById("addRowBtn");
  const mainTableBody = document.querySelector("#mainTable tbody");

  let itemCounter = 1; // auto-number ITEM No.

  addRowBtn.addEventListener("click", () => {
    // 🔹 PROMPTS FOR MAIN TEXT
    const lineEvent = prompt("Enter Line / Event:");
    const process = prompt("Enter Process:");
    const product = prompt("Enter Product:");
    const failure = prompt("Enter Potential Failure:");
    const cause = prompt("Enter Potential Cause:");

    if (!lineEvent || !process || !product) return;

    const rows = [];

    const statusOptions = `
      <select class="status-select">
        <option value="Open">Open</option>
        <option value="Close">Close</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Rejected">Rejected</option>
        <option value="—">—</option>
      </select>
    `;

    for (let i = 0; i < 4; i++) {
      const tr = document.createElement("tr");

      if (i === 0) {
        tr.innerHTML = `
          <td rowspan="4">${itemCounter}</td>
          <td rowspan="4" class="date-cell" data-raw=""><input type="date" class="editable-date"></td>

          <td rowspan="4">${lineEvent}</td>
          <td rowspan="4">${process}</td>
          <td rowspan="4">${product}</td>
          <td rowspan="4">${failure || ""}</td>
          <td rowspan="4">${cause || ""}</td>

          <td rowspan="2" class="vertical-text">OCCURRENCE</td>
          <td>—</td>
          <td>—</td>
          <td class="date-cell" data-raw=""><input type="date" class="editable-date"></td>

          <td>${statusOptions}</td>
          <td class="date-cell" data-raw=""><input type="date" class="editable-date"></td>

        `;
      }

      else if (i === 1) {
        tr.innerHTML = `
          <td>—</td>
          <td>—</td>
          <td class="date-cell" data-raw=""><input type="date" class="editable-date"></td>

          <td>${statusOptions}</td>
          <td class="date-cell" data-raw=""><input type="date" class="editable-date"></td>

        `;
      }

      else if (i === 2) {
        tr.innerHTML = `
          <td rowspan="2" class="vertical-text">OUTFLOW</td>
          <td>—</td>
          <td>—</td>
          <td class="date-cell" data-raw=""><input type="date" class="editable-date"></td>

          <td>${statusOptions}</td>
          <td class="date-cell" data-raw=""><input type="date" class="editable-date"></td>

        `;
      }

      else {
        tr.innerHTML = `
          <td>—</td>
          <td>—</td>
          <td class="date-cell" data-raw=""><input type="date" class="editable-date"></td>

          <td>${statusOptions}</td>
          <td class="date-cell" data-raw=""><input type="date" class="editable-date"></td>

        `;
      }

      rows.push(tr);
    }

    // Append rows
    rows.forEach(r => mainTableBody.appendChild(r));
    itemCounter++;

    mainTableBody.querySelectorAll(".date-cell").forEach(td => {
  const input = td.querySelector("input");
  if (input && input.value) {
    td.dataset.raw = input.value;
    td.textContent = formatDate(input.value);
  } else {
    td.textContent = "—";
  }
});

    // 🔹 STATUS COLOR CODING
   // Apply color coding for STATUS dropdowns
mainTableBody.querySelectorAll(".status-select").forEach(select => {
  const td = select.closest("td"); // get the parent td

  const applyColor = () => {
    const value = select.value;

    td.style.backgroundColor =
      value === "Open" ? "#f8d7da" :
      value === "Close" ? "#d4edda" :
      value === "Cancelled" ? "#fff3cd" :
      value === "Rejected" ? "#f5c6cb" :
      value === "—" ? "#ffffff" : "#fff"; // default white
  };

  select.addEventListener("change", applyColor);

  // Trigger initial color
  applyColor();
});

  });
});

// ---------------- INLINE CELL EDITING ----------------
document.addEventListener("dblclick", (e) => {
  const td = e.target.closest("td");

  if (!td) return;

  // ❌ Prevent editing special cells
  if (
    td.classList.contains("vertical-text") ||
    td.querySelector("select") ||
    td.querySelector("input")
  ) return;

  // Prevent re-edit
  if (td.querySelector("textarea")) return;

  const oldText = td.textContent.trim();

  // Create textarea
  const textarea = document.createElement("textarea");
  textarea.value = oldText;
  textarea.className = "editable-text";
  textarea.style.width = "100%";
  textarea.style.height = "100%";

  td.textContent = "";
  td.appendChild(textarea);
  textarea.focus();

  // Auto resize
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";

  // Save function
  const save = () => {
    td.textContent = textarea.value.trim() || "—";
  };

  // Save on blur
  textarea.addEventListener("blur", save);

  // Save on Enter (without new line)
  textarea.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      textarea.blur();
    }
  });
});

function formatDate(value) {
  if (!value) return "—";

  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const d = new Date(value);
  if (isNaN(d)) return value;

  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${month}-${day}-${year}`;
}


// ---------------- CLEAN INLINE DATE EDITING ----------------
document.addEventListener("dblclick", (e) => {
  const td = e.target.closest("td");

  if (!td || !td.classList.contains("date-cell")) return;
  if (td.querySelector("input")) return;

  const rawValue = td.dataset.raw || "";

  const input = document.createElement("input");
  input.type = "date";
  input.className = "editable-date";
  input.value = rawValue;

  Object.assign(input.style, {
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    textAlign: "center",
    font: "inherit",
    cursor: "pointer"
  });

  td.textContent = "";
  td.appendChild(input);
  input.focus();
  input.showPicker?.();

  const save = () => {
    td.dataset.raw = input.value;
    td.textContent = formatDate(input.value);
  };

  input.addEventListener("change", save);
  input.addEventListener("blur", save);
});
