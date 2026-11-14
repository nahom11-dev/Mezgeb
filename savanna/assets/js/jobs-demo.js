function matchesAllNeeds(job, selectedNeeds) {
  if (!selectedNeeds.length) return true;
  const offered = new Set((job.accommodations ?? []).map(String));
  return selectedNeeds.every((need) => offered.has(need));
}

const SUPPORT_LABELS = {
  screen_reader: "Screen reader friendly",
  extra_time: "Extra time on tasks",
  step_free: "Step-free access",
  sign_language: "Sign language",
  large_print: "Large print materials",
  quiet_room: "Quiet break space",
  flexible_hours: "Flexible hours",
  remote_option: "Remote option",
  "interpreter:am": "Amharic interpreter",
  "interpreter:en": "English interpreter",
};

const LOCAL_KEY = "mezgeb:support:local";
const DEMO_JOBS_KEY = "mezgeb-demo:jobs";

async function loadJobs() {
  const base = [...(await (await fetch("../data/jobs.json")).json()).jobs];
  try {
    const extra = JSON.parse(localStorage.getItem(DEMO_JOBS_KEY) || "[]");
    if (Array.isArray(extra)) base.push(...extra);
  } catch {
    /* ignore */
  }
  return base;
}

function loadSavedNeeds() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.needs) ? parsed.needs.map(String) : [];
  } catch {
    return [];
  }
}

function injectJsonLd(jobs) {
  document
    .querySelectorAll('script[data-mezgeb-job-jsonld="1"]')
    .forEach((node) => node.remove());
  for (const job of jobs) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.mezgebJobJsonld = "1";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.title,
      description: job.description,
      datePosted: job.datePosted,
      validThrough: job.validThrough,
      hiringOrganization: { "@type": "Organization", name: job.employer },
      jobLocation: { "@type": "Place", name: job.location },
      jobBenefits: job.accommodations,
    });
    document.head.appendChild(script);
  }
}

function renderFilters(container, selected, onChange) {
  container.replaceChildren();
  for (const [value, label] of Object.entries(SUPPORT_LABELS)) {
    const id = `need-${value.replace(/[^a-z0-9]+/gi, "-")}`;
    const wrap = document.createElement("div");
    wrap.className = "col-md-6";
    wrap.innerHTML = `<div class="form-check">
      <input class="form-check-input" type="checkbox" id="${id}" value="${value}" />
      <label class="form-check-label" for="${id}">${label}</label>
    </div>`;
    const input = wrap.querySelector("input");
    input.checked = selected.includes(value);
    input.addEventListener("change", () => onChange(readSelected(container)));
    container.appendChild(wrap);
  }
}

function readSelected(container) {
  return [...container.querySelectorAll("input:checked")].map((el) => el.value);
}

function renderJobs(listEl, jobs, selected) {
  listEl.replaceChildren();
  let visible = 0;
  for (const job of jobs) {
    const match = matchesAllNeeds(job, selected);
    const card = document.createElement("article");
    card.className = "job-card";
    card.hidden = !match;
    if (match) visible += 1;
    card.innerHTML = `<h2 class="h5">${job.title}</h2>
      <p class="mb-1"><strong>${job.employer}</strong> · ${job.location}</p>
      <p class="small text-muted">${job.description}</p>
      <button type="button" class="btn btn-primary" data-apply="${job.id}">Apply</button>`;
    listEl.appendChild(card);
  }
  const status = document.getElementById("filter-status");
  status.textContent =
    selected.length === 0
      ? `${jobs.length} sample jobs shown`
      : `${visible} of ${jobs.length} jobs match your selected support`;
}

function openApply(job) {
  const dialog = document.getElementById("apply-dialog");
  document.getElementById("apply-context").textContent = `Applying for: ${job.title}`;
  const host = document.getElementById("embed-host");
  host.replaceChildren();
  if (!customElements.get("mezgeb-register")) {
    const s = document.createElement("script");
    s.type = "module";
    s.src = "/v1/mezgeb.js";
    document.head.appendChild(s);
  }
  const el = document.createElement("mezgeb-register");
  el.setAttribute("site-key", "pk_sample_savanna");
  el.setAttribute("template", "job-application");
  el.setAttribute("lang", "am");
  el.setAttribute("platform-name", "Savanna Jobs");
  el.setAttribute("job-id", job.id);
  el.setAttribute("job-title", job.title);
  host.appendChild(el);
  dialog.showModal();
}

async function main() {
  const jobs = await loadJobs();
  injectJsonLd(jobs);
  const listEl = document.getElementById("job-list");
  const filterEl = document.getElementById("filter-options");
  const saved = loadSavedNeeds();
  const initial = saved.length ? saved : [];

  const applyFilters = (selected) => {
    renderJobs(listEl, jobs, selected);
  };

  renderFilters(filterEl, initial, applyFilters);
  applyFilters(initial);

  listEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-apply]");
    if (!btn) return;
    const job = jobs.find((j) => j.id === btn.getAttribute("data-apply"));
    if (job) openApply(job);
  });

  document.getElementById("forget-support")?.addEventListener("click", () => {
    localStorage.removeItem(LOCAL_KEY);
    filterEl.querySelectorAll("input").forEach((i) => (i.checked = false));
    applyFilters([]);
  });

  document.getElementById("close-apply")?.addEventListener("click", () => {
    document.getElementById("apply-dialog").close();
  });

  document.addEventListener("mezgeb:complete", () => {
    document.getElementById("apply-dialog")?.close();
  });
}

main();