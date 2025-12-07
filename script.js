// ===============================
// GitHub API + Popmotion Script
// ===============================

// ---------- GitHub API ELEMENTS ----------
const usernameInput = document.getElementById("github-username");
const loadReposBtn = document.getElementById("load-repos-btn");
const repoList = document.getElementById("repo-list");

// ---------- POPMOTION ELEMENTS ----------
const demoBox = document.getElementById("demo-box");
const restartAnimationBtn = document.getElementById("restart-animation-btn");

// Popmotion global object from CDN
const { tween, easing } = window.popmotion || {};


// ===============================
// GITHUB API LOGIC
// ===============================
// Example endpoint:
// https://api.github.com/users/octocat/repos?sort=updated&per_page=5

async function loadRepos(username) {
  if (!username) {
    repoList.innerHTML =
      '<li class="repo-item">Please enter a GitHub username.</li>';
    return;
  }

  repoList.innerHTML =
    '<li class="repo-item">Loading repositories...</li>';

  try {
    const url = `https://api.github.com/users/${encodeURIComponent(
      username
    )}/repos?sort=updated&per_page=5`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("GitHub API error: " + response.status);
    }

    const repos = await response.json();

    if (!Array.isArray(repos) || repos.length === 0) {
      repoList.innerHTML =
        '<li class="repo-item">No public repositories found for this user.</li>';
      return;
    }

    // Clear current list
    repoList.innerHTML = "";

    // Render each repo
    repos.forEach((repo) => {
      const li = document.createElement("li");
      li.className = "repo-item";

      const repoLink = document.createElement("a");
      repoLink.href = repo.html_url;
      repoLink.target = "_blank";
      repoLink.rel = "noopener noreferrer";
      repoLink.textContent = repo.name;

      const meta = document.createElement("div");
      meta.className = "repo-meta";
      meta.textContent =
        (repo.description || "No description provided.") +
        ` • ⭐ ${repo.stargazers_count}`;

      li.appendChild(repoLink);
      li.appendChild(meta);
      repoList.appendChild(li);
    });

    animateGithubCard();
  } catch (error) {
    console.error(error);
    repoList.innerHTML =
      '<li class="repo-item">Error loading repos. Please try again later.</li>';
  }
}

// Small "pop" animation on the GitHub card when new data loads
function animateGithubCard() {
  if (!tween) return;

  const card = document.querySelector(".github-card");
  const initialTransform = card.style.transform || "scale(1)";

  tween({
    from: 1,
    to: 1.05,
    duration: 220,
    yoyo: 1
  }).start((scale) => {
    card.style.transform = `scale(${scale})`;
  });

  setTimeout(() => {
    card.style.transform = initialTransform;
  }, 260);
}


// ===============================
// POPMOTION ANIMATION DEMO
// ===============================

let boxControls = null;

// Simple tween: angle goes 0 → 360, loops forever.
// We use Math.sin(angle) to create a vertical bounce.
function startDemoAnimation() {
  if (!tween) return;

  // Stop any existing animation
  if (boxControls && boxControls.stop) {
    boxControls.stop();
  }

  const amplitude = 18; // how high it bounces in px

  boxControls = tween({
    from: 0,
    to: 360,
    duration: 3500,
    ease: easing.easeInOut,
    loop: Infinity // repeat forever
  }).start((angle) => {
    const radians = (angle * Math.PI) / 180;
    const bounceY = Math.sin(radians * 2) * amplitude;

    demoBox.style.transform = `translateY(${bounceY}px) rotate(${angle}deg)`;
  });
}


// ===============================
// EVENT LISTENERS
// ===============================

// Button to load repos for typed username
loadReposBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  loadRepos(username);
});

// Restart animation button
restartAnimationBtn.addEventListener("click", () => {
  startDemoAnimation();
});

// On first load: set default username and start animation
document.addEventListener("DOMContentLoaded", () => {
  // You can change this to your own GitHub username if you want
  usernameInput.value = "octocat";
  loadRepos(usernameInput.value.trim());
  startDemoAnimation();
});
