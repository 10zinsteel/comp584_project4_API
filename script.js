const usernameInput = document.getElementById("github-username");
const loadReposBtn = document.getElementById("load-repos-btn");
const repoList = document.getElementById("repo-list");

const demoBox = document.getElementById("demo-box");
const restartAnimationBtn = document.getElementById("restart-animation-btn");

const { tween, easing } = window.popmotion || {};

async function loadRepos(username) {
  if (!username) {
    repoList.innerHTML =
      '<li class="repo-item">Enter a GitHub username.</li>';
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
        '<li class="repo-item">No public repositories found.</li>';
      return;
    }

    repoList.innerHTML = "";

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
    repoList.innerHTML =
      '<li class="repo-item">Error loading repositories.</li>';
  }
}

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

let boxControls = null;

function startDemoAnimation() {
  if (!tween) return;

  if (boxControls && boxControls.stop) {
    boxControls.stop();
  }

  const amplitude = 18;

  boxControls = tween({
    from: 0,
    to: 360,
    duration: 3500,
    ease: easing.easeInOut,
    loop: Infinity
  }).start((angle) => {
    const radians = (angle * Math.PI) / 180;
    const bounceY = Math.sin(radians * 2) * amplitude;

    demoBox.style.transform = `translateY(${bounceY}px) rotate(${angle}deg)`;
  });
}

loadReposBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  loadRepos(username);
});

restartAnimationBtn.addEventListener("click", () => {
  startDemoAnimation();
});

document.addEventListener("DOMContentLoaded", () => {
  usernameInput.value = "10zinsteel";
  loadRepos("10zinsteel");
  startDemoAnimation();
});

