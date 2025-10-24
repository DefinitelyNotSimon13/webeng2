// ----------------------
// Config
// ----------------------
const OWNER = "DefinitelyNotSimon13";
const REPO = "webeng2";
const BRANCH = "gh-pages";

const API_TREE = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}`;
const API_BRANCHES = `https://api.github.com/repos/${OWNER}/${REPO}/branches?per_page=100`;
const API_TAGS = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=100`;
const PAGES_BASE = `https://${OWNER.toLowerCase()}.github.io/${REPO}/`;

// ----------------------
// DOM refs
// ----------------------
const $select = document.getElementById("deployment-select");
const $picker = document.getElementById("deployment-picker");
const $status = document.getElementById("picker-status");
const $details = document.getElementById("details");

// ----------------------
// State
// ----------------------
let deployments = [];
let branches = [];
let tags = [];
const metaByName = new Map();

// ----------------------
// Utilities
// ----------------------
const qsParam = (k) => new URLSearchParams(location.search).get(k);

const ensureSpinKeyframes = () => {
    if (document.getElementById("spin-anim-style")) return;
    const st = document.createElement("style");
    st.id = "spin-anim-style";
    st.textContent = "@keyframes spin{to{transform: rotate(360deg)}}";
    document.head.appendChild(st);
};

const lastSegment = (name) => {
    const parts = String(name || "").split("/");
    return parts[parts.length - 1];
};

const commitHtmlUrl = (sha) =>
    sha ? `https://github.com/${OWNER}/${REPO}/commit/${sha}` : null;

const relTime = (iso) => {
    try {
        const d = new Date(iso);
        const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
        const sec = Math.round((d - new Date()) / 1000);
        const abs = Math.abs(sec);
        const steps = [
            ["year", 60 * 60 * 24 * 365],
            ["month", 60 * 60 * 24 * 30],
            ["week", 60 * 60 * 24 * 7],
            ["day", 60 * 60 * 24],
            ["hour", 60 * 60],
            ["minute", 60],
            ["second", 1],
        ];
        for (const [unit, s] of steps) {
            if (abs >= s || unit === "second") return rtf.format(Math.round(sec / s), unit);
        }
    } catch { }
    return "unknown";
};

// ----------------------
// Status helper
// ----------------------
function setStatus(text, loading = false) {
    $status.textContent = "";
    if (!text && !loading) return;

    const frag = document.createDocumentFragment();

    if (loading) {
        ensureSpinKeyframes();
        const spin = document.createElement("span");
        spin.className = "spinner";
        spin.setAttribute("aria-hidden", "true");
        Object.assign(spin.style, {
            display: "inline-block",
            width: "1em",
            height: "1em",
            border: "2px solid var(--border)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            marginRight: "8px",
            animation: "spin .8s linear infinite",
        });
        frag.appendChild(spin);
    }
    if (text) frag.appendChild(document.createTextNode(text));
    $status.appendChild(frag);
}

// ----------------------
// API
// ----------------------
async function fetchJSON(url) {
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`${url} -> ${res.status}`);
    return res.json();
}

const fetchDeployments = async () => {
    const data = await fetchJSON(API_TREE);
    const dirs = (data.tree || []).filter((i) => i.type === "tree");
    const exclude = new Set(["assets", ".git", ".github"]);
    return dirs
        .map((d) => d.path)
        .filter((name) => !exclude.has(name))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((name) => ({ name, url: `${PAGES_BASE}${name}/` }));
};

const fetchBranches = () => fetchJSON(API_BRANCHES);
const fetchTags = () => fetchJSON(API_TAGS);

async function fetchCommitMeta(apiUrl) {
    try {
        const data = await fetchJSON(apiUrl);
        const ghUser = data.author || data.committer || null;
        const inner = data.commit || {};
        const displayName = inner.author?.name || inner.committer?.name || ghUser?.login || "Unknown";
        const iso = inner.committer?.date || inner.author?.date || null;
        const sha = data.sha || null;
        const short = sha ? sha.slice(0, 7) : null;
        return {
            displayName,
            avatarUrl: ghUser?.avatar_url || null,
            authorHtml: ghUser?.html_url || null,
            iso,
            sha,
            short,
        };
    } catch {
        return {};
    }
}

// ----------------------
// Meta enrichment (branches + tags)
// ----------------------
async function enrichMeta() {
    const branchMap = new Map();
    for (const b of branches) {
        branchMap.set(b.name, b);
        branchMap.set(lastSegment(b.name), b);
    }
    const tagMap = new Map(tags.map((t) => [t.name, t]));

    const jobs = deployments.map(async (dep) => {
        const b = branchMap.get(dep.name);
        const t = tagMap.get(dep.name);

        if (!b && !t) {
            metaByName.set(dep.name, {});
            return;
        }

        if (b) {
            const refHtml = `https://github.com/${OWNER}/${REPO}/tree/${encodeURIComponent(b.name)}`;
            const meta = await fetchCommitMeta(b.commit.url);
            metaByName.set(dep.name, {
                kind: "branch",
                refName: b.name,
                refHtml,
                commitISO: meta.iso || undefined,
                commitRel: meta.iso ? relTime(meta.iso) : undefined,
                authorName: meta.displayName || undefined,
                avatarUrl: meta.avatarUrl || undefined,
                authorHtml: meta.authorHtml || undefined,
                commitSha: meta.sha || undefined,
                commitShort: meta.short || undefined,
            });
            return;
        }

        const refHtml = `https://github.com/${OWNER}/${REPO}/tree/${encodeURIComponent(t.name)}`;
        const meta = await fetchCommitMeta(t.commit.url);
        metaByName.set(dep.name, {
            kind: "tag",
            refName: t.name,
            refHtml,
            commitISO: meta.iso || undefined,
            commitRel: meta.iso ? relTime(meta.iso) : undefined,
            authorName: meta.displayName || undefined,
            avatarUrl: meta.avatarUrl || undefined,
            authorHtml: meta.authorHtml || undefined,
            commitSha: meta.sha || undefined,
            commitShort: meta.short || undefined,
        });
    });

    await Promise.allSettled(jobs);
}

// ----------------------
// Rendering
// ----------------------
function renderHiddenSelect() {
    $select.innerHTML = "";
    if (!deployments.length) {
        const opt = document.createElement("option");
        opt.disabled = true;
        opt.textContent = "No deployments found";
        $select.appendChild(opt);
        return;
    }
    for (const d of deployments) {
        const opt = document.createElement("option");
        opt.value = d.name;
        opt.textContent = d.name;
        opt.classList.add("deployment-option");
        $select.appendChild(opt);
    }
}

function renderPicker() {
    $picker.innerHTML = "";
    $picker.setAttribute("role", "radiogroup");
    $picker.setAttribute("aria-label", "Deployments");

    const selected = $select.value;

    for (const opt of $select.querySelectorAll("option")) {
        const name = opt.value;
        const meta = metaByName.get(name);

        const item = document.createElement("div");
        item.className = "radio-item";
        item.setAttribute("role", "radio");
        item.dataset.value = name;

        const checked = name === selected;
        item.setAttribute("aria-checked", String(checked));
        item.dataset.checked = String(checked);
        item.setAttribute("tabindex", checked ? "0" : "-1");

        const dot = document.createElement("span");
        dot.className = "dot";

        const middle = document.createElement("div");
        middle.className = "meta";

        const title = document.createElement("div");
        title.className = "title";
        const badge =
            meta?.kind === "tag"
                ? ` <span class="badge info inline">tag</span>`
                : meta?.kind === "branch"
                    ? ` <span class="badge success inline">branch</span>`
                    : "";
        title.innerHTML = `${name}${badge}`;

        const sub = document.createElement("div");
        sub.className = "sub";
        if (meta && (meta.commitRel || meta.commitShort)) {
            const parts = [
                meta.kind || "",
                meta.commitShort ? meta.commitShort : "",
                meta.commitRel ? meta.commitRel : "",
            ].filter(Boolean);
            sub.textContent = parts.join(" • ");
        } else {
            sub.textContent = meta?.kind || "";
        }

        middle.appendChild(title);
        middle.appendChild(sub);

        const right = document.createElement("div");
        right.className = "right";
        if (meta?.avatarUrl) {
            const av = document.createElement("img");
            av.className = "avatar";
            av.src = meta.avatarUrl;
            av.alt = meta.authorName ? `${meta.authorName}'s avatar` : "Author avatar";
            right.appendChild(av);
        }

        item.appendChild(dot);
        item.appendChild(middle);
        item.appendChild(right);

        item.addEventListener("click", () => setSelection(name));
        item.addEventListener("keydown", (e) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setSelection(name);
            }
        });

        $picker.appendChild(item);
    }
}

// ----------------------
// Selection + details
// ----------------------
function setSelection(name) {
    if (!name) return;

    const idx = Array.from($select.options).findIndex((o) => o.value === name);
    if (idx < 0) return;
    $select.selectedIndex = idx;
    localStorage.setItem("last-version", name);

    for (const node of $picker.querySelectorAll(".radio-item")) {
        const isSel = node.dataset.value === name;
        node.setAttribute("aria-checked", String(isSel));
        node.dataset.checked = String(isSel);
        node.setAttribute("tabindex", isSel ? "0" : "-1");
    }

    // details
    $details.innerHTML = buildDetailsHTML(name);
}

function buildDetailsHTML(name) {
    const meta = metaByName.get(name) || {};
    const hrefRelative = name ? `./${name}/` : "./";
    const hrefAbsolute = `${PAGES_BASE}${name ? `${name}/` : ""}`;

    const label = meta.kind === "tag" ? "Tag" : "Branch";
    const linkHTML = meta.refName
        ? `<a href="${meta.refHtml}" target="_blank" rel="noopener noreferrer">${meta.refName}</a>`
        : "—";

    const when = meta.commitRel || "—";
    const commitURL = commitHtmlUrl(meta.commitSha);
    const commitHTML = meta.commitShort
        ? (commitURL
            ? `<a href="${commitURL}" target="_blank" rel="noopener noreferrer">${meta.commitShort}</a>`
            : `<span>${meta.commitShort}</span>`)
        : "—";

    const authorHTML =
        meta.authorName || meta.avatarUrl
            ? `
        <div class="person">
          ${meta.avatarUrl ? `<img class="avatar" src="${meta.avatarUrl}" alt="${meta.authorName ? meta.authorName + `'s avatar` : "Author avatar"}" />` : ""}
          ${meta.authorHtml
                ? `<a href="${meta.authorHtml}" target="_blank" rel="noopener noreferrer">${meta.authorName || "Unknown"}</a>`
                : `<span>${meta.authorName || "Unknown"}</span>`}
        </div>
      `
            : `<span class="muted">Unknown</span>`;

    const releasesRow =
        meta.kind === "tag"
            ? `
        <div class="label">Releases</div>
        <div class="value">
          <a href="https://github.com/${OWNER}/${REPO}/releases/tag/${encodeURIComponent(meta.refName)}"
             target="_blank" rel="noopener noreferrer">View release page for ${meta.refName}</a>
        </div>
      `
            : "";

    return `
    <div class="details-body">
      <div class="details-grid">
        <div class="label">Type</div>
        <div class="value"><span class="badge ${meta.kind === "tag" ? "info" : "success"}">${label}</span></div>

        <div class="label">${label}</div>
        <div class="value">${linkHTML}</div>

        <div class="label">Commit</div>
        <div class="value">${commitHTML}</div>

        <div class="label">Last update</div>
        <div class="value">${when}</div>

        <div class="label">Author</div>
        <div class="value">${authorHTML}</div>

        ${releasesRow}
      </div>

      <div class="details-actions">
        <a class="btn btn-primary" href="${hrefRelative}" target="_blank" rel="noopener noreferrer">Open</a>
        <button id="copy-link-btn" class="btn btn-secondary" type="button" title="${hrefAbsolute}">Copy link</button>
      </div>
    </div>
  `;
}

// ----------------------
// Keyboard nav
// ----------------------
function initKeyboardNav() {
    $picker.addEventListener("keydown", (e) => {
        const items = Array.from($picker.querySelectorAll(".radio-item"));
        if (!items.length) return;

        const current = document.activeElement?.classList.contains("radio-item")
            ? document.activeElement
            : $picker.querySelector('[tabindex="0"]') || items[0];

        const move = (to) => {
            items.forEach((n) => n.setAttribute("tabindex", "-1"));
            const target = items[to];
            if (target) {
                target.setAttribute("tabindex", "0");
                target.focus();
            }
        };

        const idx = Math.max(0, items.indexOf(current));
        switch (e.key) {
            case "ArrowDown":
            case "ArrowRight":
                e.preventDefault();
                move(Math.min(items.length - 1, idx + 1));
                break;
            case "ArrowUp":
            case "ArrowLeft":
                e.preventDefault();
                move(Math.max(0, idx - 1));
                break;
            case "Home":
                e.preventDefault();
                move(0);
                break;
            case "End":
                e.preventDefault();
                move(items.length - 1);
                break;
            case " ":
            case "Enter":
                e.preventDefault();
                if (document.activeElement?.classList.contains("radio-item")) {
                    setSelection(document.activeElement.dataset.value);
                }
                break;
        }
    });

    $picker.setAttribute("tabindex", "0");
    $picker.addEventListener("focus", () => {
        const sel = $picker.querySelector('[aria-checked="true"]') || $picker.querySelector(".radio-item");
        if (sel) {
            sel.setAttribute("tabindex", "0");
            sel.focus();
        }
        $picker.setAttribute("tabindex", "-1");
    }, { once: true });
}

// ----------------------
// Copy link
// ----------------------
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        setStatus("Link copied to clipboard.");
    } catch {
        setStatus("Could not copy link.");
    }
}

$details.addEventListener("click", (e) => {
    const el = e.target;
    if (el && el.id === "copy-link-btn") {
        const absolute = el.getAttribute("title");
        if (absolute) copyToClipboard(absolute);
    }
});

$select.addEventListener("change", () => {
    const val = $select.value;
    if (val) {
        localStorage.setItem("last-version", val);
        setSelection(val);
    }
});

// ----------------------
// Footer text
// ----------------------
function updateFooter() {
    const $footer = document.getElementById("footer-content");
    if (!$footer) return;
    const branchLink = `https://github.com/${OWNER}/${REPO}/tree/${encodeURIComponent(BRANCH)}`;
    const repoLink = `https://github.com/${OWNER}/${REPO}`;
    $footer.innerHTML = `
    <span>Data from <a href="${branchLink}" target="_blank" rel="noopener noreferrer">${BRANCH}</a></span>
    &nbsp;•&nbsp;
    <a href="${repoLink}" target="_blank" rel="noopener noreferrer">${OWNER}/${REPO}</a>
  `;
}

async function main() {
    setStatus("Loading deployments…", true);

    try {
        [deployments, branches, tags] = await Promise.all([
            fetchDeployments(),
            fetchBranches(),
            fetchTags(),
        ]);

        await enrichMeta();

        setStatus(`Found ${deployments.length} deployment${deployments.length === 1 ? "" : "s"}.`);

        renderHiddenSelect();

        const initial = qsParam("version") || localStorage.getItem("last-version") || (deployments[0]?.name || "");
        const opts = Array.from($select.options);
        const idx = opts.findIndex((o) => o.value === initial);
        $select.selectedIndex = idx >= 0 ? idx : (opts.length ? 0 : -1);

        renderPicker();
        if ($select.value) setSelection($select.value);
        else $details.innerHTML = `<p class="muted">Pick a deployment to see details.</p>`;

        initKeyboardNav();
    } catch (err) {
        console.error(err);
        setStatus("Failed to load data from GitHub. See console for details.");
        $details.innerHTML = `<p class="muted">Could not load deployments.</p>`;
    }
}

// Init
updateFooter();
main();
