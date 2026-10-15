const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");
function updateCounts() {
  const text = noteText.value;
  const length = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  charCount.textContent = `${length} / 200 characters`;
  wordCount.textContent = `${words} words`;
  charCount.classList.remove("warning", "over");
  noteText.classList.remove("warning", "over");
  if (length > 200) {
    charCount.classList.add("over");
    noteText.classList.add("over");
  } else if (length > 180) {
    charCount.classList.add("warning");
    noteText.classList.add("warning");
  }
  localStorage.setItem("draft", text);
}
function clearAll() {
  noteText.value = "";
  localStorage.removeItem("draft");
  updateCounts();
}
noteText.addEventListener("input", updateCounts);
clearBtn.addEventListener("click", clearAll);
noteText.addEventListener("keydown", (e) => { if (e.key === "Escape") clearAll(); });
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
window.addEventListener("DOMContentLoaded", () => {
  const savedDraft = localStorage.getItem("draft");
  if (savedDraft) noteText.value = savedDraft;
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "Light mode";
  } else {
    themeToggle.textContent = "Dark mode";
  }
  updateCounts();
});
