// --- Config ---
const OWNER = "DefinitelyNotSimon13";
const REPO = "webeng2";
const BRANCH = "gh-pages"; // tree "sha" can be the branch name
const API_TREE = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}`;
const API_BRANCHES = `https://api.github.com/repos/${OWNER}/${REPO}/branches?per_page=100`;
const PAGES_BASE = `https://${OWNER.toLowerCase()}.github.io/${REPO}/`;

// --- DOM refs ---
const versionsEl = document.getElementById("versions");
const filterEl = document.getElementById("filter");
const statusEl = document.getElementById("status");
const errorEl = document.getElementById("error");
const reloadBtn = document.getElementById("reload");
const openLink = document.getElementById("openLink");
const copyBtn = document.getElementById("copyLink");
const detailsEl = document.getElementById("details");
const branchLinkEl = document.getElementById("branchLink");
const commitWhenEl = document.getElementById("commitWhen");
const authorLinkEl = document.getElementById("authorLink");
const authorAvatarEl = document.getElementById("authorAvatar");
const authorNameEl = document.getElementById("authorName");

// --- State ---
let allDeployments = [];
let branches = [];
let metaByDeployment = new Map(); // name -> { branchName, branchHtml, commitISO, commitRel, authorName, authorHtml, avatarUrl }

// --- Helpers ---
function setStatus(text, loading = false) {
    statusEl.innerHTML = "";
    if (text) {
        if (loading) {
            const sp = document.createElement("div");
            sp.className = "spinner";
            sp.setAttribute("aria-hidden", "true");
            statusEl.appendChild(sp);
        }
        const span = document.createElement("span");
        span.textContent = text;
        statusEl.appendChild(span);
    }
}

function showError(msg) {
    errorEl.hidden = false;
    errorEl.textContent = msg;
}
function clearError() {
    errorEl.hidden = true;
    errorEl.textContent = "";
}

function lastSegment(name) {
    // "feature/2-setup-pipeline" -> "2-setup-pipeline"
    const parts = name.split("/");
    return parts[parts.length - 1];
}

function relTime(iso) {
    try {
        const d = new Date(iso);
        const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
        const sec = Math.round((d - new Date()) / 1000);
        const abs = Math.abs(sec);
        const map = [
            ["year", 60 * 60 * 24 * 365],
            ["month", 60 * 60 * 24 * 30],
            ["week", 60 * 60 * 24 * 7],
            ["day", 60 * 60 * 24],
            ["hour", 60 * 60],
            ["minute", 60],
            ["second", 1],
        ];
        for (const [unit, unitSec] of map) {
            if (abs >= unitSec || unit === "second") {
                return rtf.format(Math.round(sec / unitSec), unit);
            }
        }
    } catch { }
    return "unknown";
}

function renderOptions() {
    versionsEl.innerHTML = "";
    if (!allDeployments.length) {
        const opt = document.createElement("option");
        opt.disabled = true;
        opt.textContent = "No deployments found";
        versionsEl.appendChild(opt);
        openLink.setAttribute("aria-disabled", "true");
        detailsEl.hidden = true;
        return;
    }
    for (const dep of allDeployments) {
        const meta = metaByDeployment.get(dep.name);
        const opt = document.createElement("option");
        const name = document.createElement("p");
        const right = document.createElement("div");
        right.classList.add("option-right");
        const av = document.createElement("img");
        av.classList.add("avatar");
        const lastCommit = document.createElement("p");

        name.textContent = dep.name;
        if (meta && meta.branchName) {
            lastCommit.textContent = `${meta.commitRel} ·`
            setAvatar(av, meta);
        } else {
            lastCommit.textContent = "";
        }

        opt.value = dep.name;
        // opt.textContent = dep.name + suffix;
        opt.classList.add("deployment-option")

        right.appendChild(lastCommit)
        if (meta && meta.branchName) {
            right.appendChild(av)
        }

        opt.appendChild(name)
        opt.appendChild(right)
        versionsEl.appendChild(opt);
    }
}

function setAvatar(el, meta) {
    if (meta && meta.avatarUrl && meta.authorName) {
        el.src = meta.avatarUrl;
        el.alt = `${meta.authorName}'s avatar`;
        el.style.display = "inline-block";
    } else {
        el.removeAttribute("src");
        el.style.display = "none";
    }
}

function updateButtonsAndDetails() {
    const sel = versionsEl.value;
    const href = PAGES_BASE + (sel ? `${sel}/` : "");
    openLink.href = href;
    openLink.setAttribute("aria-disabled", sel ? "false" : "true");

    const meta = metaByDeployment.get(sel);
    if (meta && meta.branchName) {
        detailsEl.hidden = false;
        branchLinkEl.textContent = meta.branchName;
        branchLinkEl.href = meta.branchHtml;
        commitWhenEl.textContent = meta.commitRel || "—";

        // Author UI
        if (meta.authorHtml || meta.avatarUrl || meta.authorName) {
            authorLinkEl.href = meta.authorHtml || "#";
            authorLinkEl.style.pointerEvents = meta.authorHtml ? "auto" : "none";
            authorAvatarEl.src = meta.avatarUrl || "";
            authorAvatarEl.alt = meta.authorName ? `${meta.authorName}'s avatar` : "";
            authorAvatarEl.style.display = meta.avatarUrl ? "inline-block" : "none";
            authorNameEl.textContent = meta.authorName || "Unknown";
        } else {
            // Clear if missing
            authorLinkEl.removeAttribute("href");
            authorAvatarEl.removeAttribute("src");
            authorAvatarEl.style.display = "none";
            authorNameEl.textContent = "Unknown";
        }
    } else {
        detailsEl.hidden = true;
    }
}

function filterAndRender() {
    const q = filterEl.value.trim().toLowerCase();
    let list = allDeployments;
    if (q) list = list.filter((d) => d.name.toLowerCase().includes(q));
    // Keep state list but rebuild options from filtered view
    versionsEl.innerHTML = "";
    for (const dep of list) {
        const meta = metaByDeployment.get(dep.name);
        const suffix =
            meta && meta.branchName
                ? ` — branch: ${meta.branchName}${meta.commitRel ? ` • updated ${meta.commitRel}` : ""}`
                : "";
        const opt = document.createElement("option");
        opt.value = dep.name;
        opt.textContent = dep.name + suffix;
        versionsEl.appendChild(opt);
    }
    // Select previous or first
    const last = localStorage.getItem("last-version");
    const qs = new URLSearchParams(location.search).get("version");
    const initial = qs || last || (list[0] && list[0].name);
    const idx = Array.from(versionsEl.options).findIndex((o) => o.value === initial);
    versionsEl.selectedIndex = idx >= 0 ? idx : 0;
    updateButtonsAndDetails();
}

// --- API calls ---
async function fetchDeployments() {
    const res = await fetch(API_TREE, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`Tree fetch failed: ${res.status}`);
    const data = await res.json();
    const dirs = (data.tree || []).filter((i) => i.type === "tree");
    const exclude = new Set(["assets", ".git", ".github"]);
    const deployments = dirs
        .map((d) => d.path)
        .filter((name) => !exclude.has(name))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((name) => ({ name, url: PAGES_BASE + name + "/" }));
    return deployments;
}

async function fetchBranches() {
    const res = await fetch(API_BRANCHES, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`Branches fetch failed: ${res.status}`);
    return res.json();
}

async function fetchCommitMeta(commitApiUrl) {
    const res = await fetch(commitApiUrl, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) return {};
    const data = await res.json();

    // Prefer the associated GitHub user (outer `author` or `committer`)
    // Fallback to the inner names in `data.commit.author/committer`
    const ghUser = data.author || data.committer || null;
    const avatarUrl = ghUser?.avatar_url || null;
    const authorHtml = ghUser?.html_url || null;

    const inner = data.commit || {};
    const displayName =
        inner.author?.name ||
        inner.committer?.name ||
        ghUser?.login ||
        "Unknown";

    const iso = inner.committer?.date || inner.author?.date || null;

    return {
        displayName,
        avatarUrl,
        authorHtml,
        iso,
    };
}

async function enrichWithBranchMeta() {
    const bySuffix = new Map();
    for (const b of branches) {
        const suffix = lastSegment(b.name);
        if (!bySuffix.has(suffix)) bySuffix.set(suffix, b);
        if (!bySuffix.has(b.name)) bySuffix.set(b.name, b);
    }

    const tasks = [];
    for (const dep of allDeployments) {
        const match = bySuffix.get(dep.name);
        if (!match) {
            metaByDeployment.set(dep.name, {});
            continue;
        }

        const branchHtml = `https://github.com/${OWNER}/${REPO}/tree/${encodeURIComponent(match.name)}`;

        const t = (async () => {
            const meta = await fetchCommitMeta(match.commit.url);
            metaByDeployment.set(dep.name, {
                branchName: match.name,
                branchHtml,
                commitISO: meta.iso,
                commitRel: meta.iso ? relTime(meta.iso) : undefined,
                authorName: meta.displayName || undefined,
                avatarUrl: meta.avatarUrl || undefined,
                authorHtml: meta.authorHtml || undefined,
            });
        })();
        tasks.push(t);
    }
    await Promise.allSettled(tasks);
}

async function loadAll() {
    clearError();
    setStatus("Loading deployments…", true);
    try {
        [allDeployments, branches] = await Promise.all([fetchDeployments(), fetchBranches()]);
        await enrichWithBranchMeta();
        setStatus(`Found ${allDeployments.length} deployment${allDeployments.length === 1 ? "" : "s"}.`);
        renderOptions();

        const qs = new URLSearchParams(location.search).get("version");
        const last = localStorage.getItem("last-version");
        const initial = qs || last || (allDeployments[0] && allDeployments[0].name);
        const idx = Array.from(versionsEl.options).findIndex((o) => o.value === initial);
        versionsEl.selectedIndex = idx >= 0 ? idx : 0;
        updateButtonsAndDetails();
    } catch (e) {
        console.error(e);
        showError("Failed to load data from GitHub. Please try Reload. (See console for details.)");
        setStatus("");
    }
}

filterEl.addEventListener("input", filterAndRender);
versionsEl.addEventListener("change", () => {
    updateButtonsAndDetails();
    const val = versionsEl.value;
    if (val) localStorage.setItem("last-version", val);
});
versionsEl.addEventListener("dblclick", () => openLink.click());
versionsEl.addEventListener("keydown", (e) => { if (e.key === "Enter") openLink.click(); });
reloadBtn.addEventListener("click", () => loadAll());
copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(openLink.href); setStatus("Link copied to clipboard."); }
    catch { setStatus("Could not copy link."); }
});

// Init
loadAll();
