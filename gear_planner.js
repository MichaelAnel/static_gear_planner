const gearSlots = [
  "Head",
  "Chest",
  "Gloves",
  "Pants",
  "Earring",
  "Necklace",
  "Bracelet",
  "Ring 1",
  "Ring 2"
];

const gridCount = 8;

function storageKey(gridIndex) {
  return `raidGearProgress_grid${gridIndex}`;
}

function loadProgress(gridIndex) {
  return JSON.parse(localStorage.getItem(storageKey(gridIndex))) || {};
}

function saveProgress(gridIndex, progress) {
  localStorage.setItem(storageKey(gridIndex), JSON.stringify(progress));
}

function updateGear(gridIndex, slot, value) {
  const progress = loadProgress(gridIndex);
  progress[slot] = value;
  saveProgress(gridIndex, progress);
}

function resetAllGear() {
  for (let i = 0; i < gridCount; i++) {
    localStorage.removeItem(storageKey(i));
  }
  render();
}

function renderGrid(container, gridIndex) {
  const progress = loadProgress(gridIndex);
  container.innerHTML = "";

  gearSlots.forEach(slot => {
    const currentValue = progress[slot] || "none";

    const label = document.createElement("div");
    label.className = "gear-slot";
    label.textContent = slot;

    const select = document.createElement("select");

    ["none", "crafted", "tome", "savage"].forEach(optionValue => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent =
        optionValue === "none"
          ? "None"
          : optionValue.charAt(0).toUpperCase() + optionValue.slice(1);
      select.appendChild(option);
    });

    select.value = currentValue;
    select.className = currentValue;

    select.onchange = () => {
      updateGear(gridIndex, slot, select.value);
      select.className = select.value;
    };

    container.appendChild(label);
    container.appendChild(select);
  });
}

function render() {
  const allGrids = document.getElementById("allGrids");
  allGrids.innerHTML = "";

  const roleNames = [
    { label: "Tank 1", color: "#29b8ff" },
    { label: "Tank 2", color: "#29b8ff" },
    { label: "Healer 1", color: "#11f559" },
    { label: "Healer 2", color: "#11f559" },
    { label: "Melee 1", color: "#e83e20" },
    { label: "Melee 2", color: "#e83e20" },
    { label: "Phys Range", color: "#e83e20" },
    { label: "Caster", color: "#e83e20" },
  ];

  for (let i = 0; i < gridCount; i++) {
    const wrapper = document.createElement("div");
    wrapper.className = "grid-wrapper";

    const gridLabel = document.createElement("div");
    gridLabel.className = "grid-label";
    gridLabel.textContent = roleNames[i].label;
    gridLabel.style.color = roleNames[i].color;

    const grid = document.createElement("div");
    grid.className = "gear-grid";
    grid.id = `gearGrid_${i}`;

    wrapper.appendChild(gridLabel);
    wrapper.appendChild(grid);
    allGrids.appendChild(wrapper);

    renderGrid(grid, i);
  }
}

render();
