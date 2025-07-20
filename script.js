// Main Load Handler: Runs when page loads
window.onload = function () {
  // Load checklist from localStorage
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => createTaskElement(task.text, task.checked));

  // Load tomorrow's plan teaser
  const plan = localStorage.getItem("tomorrowPlan") || "";
  const preview = plan.trim().length > 0
    ? "✨ View your plan for tomorrow"
    : "No plan written yet.";
  const planPreview = document.getElementById("planPreview");
  if (planPreview) planPreview.textContent = preview;

  // Load timetable
  loadTimetable();

  // Load resources
  renderResources();

  // Load daily tracker
  loadTracker();
};

// Checklist
function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (taskText === "") return;

  createTaskElement(taskText, false);
  saveTasksToLocalStorage();
  input.value = ""; // clear input
}

function createTaskElement(text, checked) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = text;
  if (checked) span.classList.add("checked");

  span.onclick = () => {
    span.classList.toggle("checked");
    saveTasksToLocalStorage();
  };

  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️";
  delBtn.className = "delete-btn";
  delBtn.onclick = () => {
    li.remove();
    saveTasksToLocalStorage();
  };

  li.appendChild(span);
  li.appendChild(delBtn);
  document.getElementById("taskList").appendChild(li);
}

function saveTasksToLocalStorage() {
  const listItems = document.querySelectorAll("#taskList li");
  const tasks = [];

  listItems.forEach(li => {
    const span = li.querySelector("span");
    tasks.push({
      text: span.textContent,
      checked: span.classList.contains("checked")
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearAllTasks() {
  if (confirm("Clear all checklist tasks?")) {
    localStorage.removeItem("tasks");
    document.getElementById("taskList").innerHTML = "";
  }
}

// Timetable
function addRow(data = ["", "", "", "", "", "", ""]) {
  const tbody = document.getElementById("timetable-body");
  const row = document.createElement("tr");

  for (let i = 0; i < 7; i++) {
    const td = document.createElement("td");
    const input = document.createElement("input");
    input.type = "text";
    input.value = data[i];
    td.appendChild(input);
    row.appendChild(td);
  }

  const deleteTd = document.createElement("td");
  const delBtn = document.createElement("button");
  delBtn.textContent = "X";
  delBtn.className = "delete-btn";
  delBtn.onclick = () => row.remove();
  deleteTd.appendChild(delBtn);
  row.appendChild(deleteTd);

  tbody.appendChild(row);
}

function saveTimetable() {
  const rows = document.querySelectorAll("#timetable-body tr");
  const data = [];

  rows.forEach(row => {
    const inputs = row.querySelectorAll("input");
    const rowData = [];
    inputs.forEach(input => rowData.push(input.value));
    data.push(rowData);
  });

  localStorage.setItem("timetableData", JSON.stringify(data));
  alert("Timetable saved!");
}

function loadTimetable() {
  const data = JSON.parse(localStorage.getItem("timetableData")) || [];
  data.forEach(row => addRow(row));
}

function clearTimetable() {
  if (confirm("Clear all timetable data?")) {
    localStorage.removeItem("timetableData");
    document.getElementById("timetable-body").innerHTML = "";
  }
}

// Resources
function addResource() {
  const name = document.getElementById("resourceName").value.trim();
  const link = document.getElementById("resourceLink").value.trim();
  const note = document.getElementById("resourceNote").value.trim();

  if (!name || !link) return alert("Please fill both name and link!");

  const resources = JSON.parse(localStorage.getItem("resources")) || [];
  resources.push({ name, link, note });
  localStorage.setItem("resources", JSON.stringify(resources));

  document.getElementById("resourceName").value = "";
  document.getElementById("resourceLink").value = "";
  document.getElementById("resourceNote").value = "";

  renderResources();
}

function renderResources() {
  const resourceList = document.getElementById("resourceList");
  resourceList.innerHTML = "";

  const resources = JSON.parse(localStorage.getItem("resources")) || [];

  resources.forEach((res, index) => {
    const li = document.createElement("li");

    const contentDiv = document.createElement("div");
    contentDiv.className = "resource-content";
    contentDiv.innerHTML = `
      <strong>${res.name}</strong><br>
      <a href="${res.link}" target="_blank">${res.link}</a><br>
      <em>${res.note}</em>
    `;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "resource-actions";
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.onclick = () => {
      resources.splice(index, 1);
      localStorage.setItem("resources", JSON.stringify(resources));
      renderResources();
    };

    actionsDiv.appendChild(deleteBtn);
    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);
    resourceList.appendChild(li);
  });
}

// Daily Tracker
function loadTracker() {
  const today = new Date().toDateString();
  const savedTracker = JSON.parse(localStorage.getItem("dailyTracker")) || {};

  const habitChecks = document.querySelectorAll(".habit-check");
  habitChecks.forEach(input => {
    const habitKey = input.getAttribute("data-habit");
    input.checked = savedTracker[today]?.[habitKey] || false;

    input.addEventListener("change", () => {
      if (!savedTracker[today]) savedTracker[today] = {};
      savedTracker[today][habitKey] = input.checked;
      localStorage.setItem("dailyTracker", JSON.stringify(savedTracker));
    });
  });
}

// Scroll to section
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// THEME TOGGLE
const themeToggle = document.getElementById("themeToggle");

// Load saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    themeToggle.textContent = "🌙";
  }
});

// Toggle and save theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");

  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});



