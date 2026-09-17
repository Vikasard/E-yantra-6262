const projects = document.querySelectorAll(".task-status");

projects.forEach((project) => {
  const projectName = project.dataset.project;

  project.querySelectorAll(".task-btn").forEach((button) => {
    const taskName = button.dataset.task;
    const storageKey = `eyrc-${projectName}-${taskName}`;

    if (localStorage.getItem(storageKey) === "completed") {
      updateButton(button, true);
    }

    button.addEventListener("click", () => {
      const completed = !button.classList.contains("completed");
      updateButton(button, completed);
      localStorage.setItem(storageKey, completed ? "completed" : "pending");
      updateProgress();
    });
  });
});

function updateButton(button, completed) {
  const state = button.querySelector(".task-state");
  button.classList.toggle("completed", completed);
  state.textContent = completed ? "Completed ✓" : "Pending";
  button.setAttribute("aria-label", `${button.dataset.task} ${completed ? "completed" : "pending"}`);
  button.setAttribute("aria-pressed", String(completed));
}

function updateProgress() {
  const projectData = [
    { name: "kojo-drone", short: "kojo" },
    { name: "niti-vahan", short: "niti" }
  ];

  let totalCompleted = 0;

  projectData.forEach(({ name, short }) => {
    const project = document.querySelector(`[data-project="${name}"]`);
    if (!project) return;

    const completed = project.querySelectorAll(".task-btn.completed").length;
    totalCompleted += completed;

    const text = document.getElementById(`${short}-progress-text`);
    const fill = document.getElementById(`${short}-progress-fill`);

    if (text) text.textContent = `${completed} / 3`;
    if (fill) fill.style.width = `${(completed / 3) * 100}%`;
  });

  const percentage = Math.round((totalCompleted / 6) * 100);
  const overallText = document.getElementById("overall-progress");
  const overallFill = document.getElementById("overall-progress-fill");

  if (overallText) overallText.textContent = `${percentage}%`;
  if (overallFill) overallFill.style.width = `${percentage}%`;
}

const resetButton = document.getElementById("reset-progress");

if (resetButton) {
  resetButton.addEventListener("click", () => {
    if (!confirm("Reset all task progress in this browser?")) return;

    document.querySelectorAll(".task-btn").forEach((button) => {
      const project = button.closest(".task-status");
      const storageKey = `eyrc-${project.dataset.project}-${button.dataset.task}`;
      localStorage.removeItem(storageKey);
      updateButton(button, false);
    });

    updateProgress();
  });
}

updateProgress();
