window.onload = function () {
  const textarea = document.getElementById("planInput");
  const savedPlan = localStorage.getItem("tomorrowPlan");
  if (savedPlan) {
    textarea.value = savedPlan;
  }
};

function savePlan() {
  const plan = document.getElementById("planInput").value;
  localStorage.setItem("tomorrowPlan", plan);
  alert("Plan saved!");
}

function clearPlan() {
  const confirmClear = confirm("Are you sure you want to clear tomorrow's plan?");
  if (confirmClear) {
    localStorage.removeItem("tomorrowPlan");
    document.getElementById("planInput").value = "";
    alert("Plan cleared!");
  }
}
