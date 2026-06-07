const searchInput = document.querySelector("#docSearch");
const emptyState = document.querySelector("#emptyState");
const sections = Array.from(document.querySelectorAll(".doc-section"));
const navLinks = Array.from(document.querySelectorAll(".nav-list a"));

function setupCopyButtons() {
  document.querySelectorAll("pre").forEach((block) => {
    const code = block.querySelector("code");
    if (!code) return;

    const shell = document.createElement("div");
    shell.className = "code-shell";
    block.parentNode.insertBefore(shell, block);

    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.textContent = "Copy";
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        button.textContent = "Copied";
      } catch {
        button.textContent = "Select text";
      }

      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1400);
    });

    shell.appendChild(button);
    shell.appendChild(block);
  });
}

function setupTabs() {
  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const buttons = Array.from(tabs.querySelectorAll("[data-tab]"));
    const panels = Array.from(tabs.querySelectorAll("[data-panel]"));

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.tab;

        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", String(active));
        });

        panels.forEach((panel) => {
          const active = panel.dataset.panel === target;
          panel.classList.toggle("is-active", active);
          panel.hidden = !active;
        });
      });
    });
  });
}

function setupSearch() {
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    sections.forEach((section) => {
      const haystack =
        `${section.dataset.search || ""} ${section.innerText}`.toLowerCase();
      const visible = query.length === 0 || haystack.includes(query);
      section.classList.toggle("is-hidden-by-search", !visible);
      if (visible) visibleCount += 1;
    });

    emptyState.hidden = visibleCount !== 0;
  });
}

function setupActiveNavigation() {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === `#${visible.target.id}`,
        );
      });
    },
    {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0.1, 0.2, 0.4, 0.8],
    },
  );

  sections.forEach((section) => observer.observe(section));
}

setupCopyButtons();
setupTabs();
setupSearch();
setupActiveNavigation();
