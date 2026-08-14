/* ==========================================================================
   Netflix Clone — Browse Page Behavior
   ========================================================================== */
(function () {
  "use strict";

  const MYLIST_KEY = "nf_my_list_v1";

  /* ---------------- Loader ---------------- */
  window.addEventListener("load", () => {
    setTimeout(() => document.getElementById("loader").classList.add("hide"), 500);
  });

  /* ---------------- My List storage ---------------- */
  function getMyList() {
    try { return JSON.parse(localStorage.getItem(MYLIST_KEY)) || []; }
    catch { return []; }
  }
  function saveMyList(list) {
    localStorage.setItem(MYLIST_KEY, JSON.stringify(list));
  }
  function isInMyList(id) {
    return getMyList().includes(id);
  }
  function toggleMyList(id, title) {
    let list = getMyList();
    if (list.includes(id)) {
      list = list.filter((x) => x !== id);
      showToast(`Removed "${title}" from My List`);
    } else {
      list.push(id);
      showToast(`Added "${title}" to My List`);
    }
    saveMyList(list);
    return list.includes(id);
  }

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /* ---------------- Nav scroll ---------------- */
  const topNav = document.getElementById("topNav");
  window.addEventListener("scroll", () => {
    topNav.classList.toggle("scrolled", window.scrollY > 10);
  });

  /* ---------------- Mobile nav ---------------- */
  const mobileToggle = document.getElementById("mobileNavToggle");
  const navLinks = document.getElementById("navLinks");
  mobileToggle.addEventListener("click", () => navLinks.classList.toggle("mobile-open"));

  /* ---------------- Search ---------------- */
  const searchWrap = document.getElementById("searchWrap");
  const searchToggle = document.getElementById("searchToggle");
  const searchInput = document.getElementById("searchInput");
  searchToggle.addEventListener("click", () => {
    searchWrap.classList.toggle("open");
    if (searchWrap.classList.contains("open")) searchInput.focus();
    else { searchInput.value = ""; applySearch(""); }
  });
  searchInput.addEventListener("input", (e) => applySearch(e.target.value.trim().toLowerCase()));

  function applySearch(query) {
    const cards = document.querySelectorAll(".card");
    const rows = document.querySelectorAll(".row-block");
    if (!query) {
      cards.forEach((c) => (c.style.display = ""));
      rows.forEach((r) => (r.style.display = ""));
      return;
    }
    rows.forEach((row) => {
      let anyVisible = false;
      row.querySelectorAll(".card").forEach((card) => {
        const match = card.dataset.title.toLowerCase().includes(query);
        card.style.display = match ? "" : "none";
        if (match) anyVisible = true;
      });
      row.style.display = anyVisible ? "" : "none";
    });
  }

  /* ---------------- Profile dropdown ---------------- */
  const profileMenu = document.getElementById("profileMenu");
  document.getElementById("profileTrigger").addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (!profileMenu.contains(e.target)) profileMenu.classList.remove("open");
  });
  document.getElementById("signOutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("nf_email");
    window.location.href = "index.html";
  });

  /* ---------------- Hero ---------------- */
  function renderHero() {
    document.getElementById("browseHero").style.backgroundImage = `url('${HERO_FEATURE.backdrop}')`;
    document.getElementById("heroTagline").textContent = HERO_FEATURE.tagline;
    document.getElementById("heroTitle").textContent = HERO_FEATURE.title;
    document.getElementById("heroMatch").textContent = `${HERO_FEATURE.match}% Match`;
    document.getElementById("heroYear").textContent = HERO_FEATURE.year;
    document.getElementById("heroRated").textContent = HERO_FEATURE.rating;
    document.getElementById("heroDuration").textContent = HERO_FEATURE.duration;
    document.getElementById("heroDesc").textContent = HERO_FEATURE.desc;
  }
  document.getElementById("heroInfoBtn").addEventListener("click", () => openModal({
    ...HERO_FEATURE, id: "hero-feature", genres: ["Thriller", "Drama", "Crime"], img: HERO_FEATURE.backdrop,
  }));
  document.getElementById("heroPlayBtn").addEventListener("click", () => showToast("Playback isn't wired up in this demo clone \u2014 enjoy the UI! \uD83C\uDFAC"));

  /* ---------------- Icon helpers ---------------- */
  const ICONS = {
    play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>`,
    like: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 22V11m0 11H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h3m3 0V4.5a2.5 2.5 0 0 1 5 0V9h5.24a2 2 0 0 1 1.98 2.29l-1.14 8A2 2 0 0 1 18.1 21H10a3 3 0 0 1-3-3"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>`,
    left: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m15 18-6-6 6-6"/></svg>`,
    right: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m9 18 6-6-6-6"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>`,
  };

  /* ---------------- Card builder ---------------- */
  function buildCard(item, rowMeta) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.title = item.title;

    const inMyList = isInMyList(item.id);

    card.innerHTML = `
      <div class="card-inner">
        <img class="poster" src="${item.img}" alt="${item.title}" loading="lazy">
        ${rowMeta.ranked ? `<span class="rank-num">${item.rank}</span>` : ""}
        ${rowMeta.progress ? `<div class="progress-bar"><span style="width:${20 + (item.match % 60)}%;"></span></div>` : ""}
      </div>
      <div class="card-hover">
        <img src="${item.backdrop}" alt="">
        <div class="ch-body">
          <div class="ch-actions">
            <button class="circle-btn play-fill" title="Play" data-action="play">${ICONS.play}</button>
            <button class="circle-btn ${inMyList ? "active" : ""}" title="Add to My List" data-action="list">${inMyList ? ICONS.check : ICONS.plus}</button>
            <button class="circle-btn" title="Like" data-action="like">${ICONS.like}</button>
            <button class="circle-btn spacer" title="More info" data-action="info">${ICONS.chevron}</button>
          </div>
          <div class="ch-meta"><span class="match">${item.match}% Match</span><span class="rated">${item.rating}</span><span>${item.duration}</span></div>
          <div class="ch-genres">${item.genres.map((g) => `<span>${g}</span>`).join("")}</div>
        </div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      const actionBtn = e.target.closest("[data-action]");
      if (!actionBtn) { openModal(item); return; }
      const action = actionBtn.dataset.action;
      if (action === "play") showToast(`Playing "${item.title}" (demo)`);
      if (action === "info") openModal(item);
      if (action === "like") actionBtn.classList.toggle("active");
      if (action === "list") {
        const active = toggleMyList(item.id, item.title);
        actionBtn.classList.toggle("active", active);
        actionBtn.innerHTML = active ? ICONS.check : ICONS.plus;
        actionBtn.title = active ? "Remove from My List" : "Add to My List";
      }
    });

    return card;
  }

  /* ---------------- Row builder ---------------- */
  function buildRow(rowData) {
    const block = document.createElement("section");
    block.className = "row-block";
    if (rowData.tall) block.classList.add("tall");
    if (rowData.ranked) block.classList.add("ranked");

    block.innerHTML = `
      <h2 class="row-title">${rowData.title}</h2>
      <div class="row-viewport">
        <button class="row-arrow left" aria-label="Scroll left">${ICONS.left}</button>
        <div class="row-track"></div>
        <button class="row-arrow right" aria-label="Scroll right">${ICONS.right}</button>
      </div>
    `;

    const track = block.querySelector(".row-track");
    rowData.items.forEach((item) => track.appendChild(buildCard(item, rowData)));

    block.querySelector(".row-arrow.left").addEventListener("click", () => {
      track.scrollBy({ left: -track.clientWidth * 0.9, behavior: "smooth" });
    });
    block.querySelector(".row-arrow.right").addEventListener("click", () => {
      track.scrollBy({ left: track.clientWidth * 0.9, behavior: "smooth" });
    });

    return block;
  }

  function renderRows(rowsData) {
    const wrap = document.getElementById("rowsWrap");
    wrap.innerHTML = "";
    rowsData.forEach((r) => wrap.appendChild(buildRow(r)));
  }

  /* ---------------- Modal ---------------- */
  const modalOverlay = document.getElementById("modalOverlay");
  const modalBox = document.getElementById("modalBox");

  function openModal(item) {
    const inMyList = isInMyList(item.id);
    modalBox.innerHTML = `
      <div class="modal-media">
        <img src="${item.backdrop || item.img}" alt="">
        <button class="modal-close" id="modalCloseBtn">${ICONS.close}</button>
        <div class="modal-media-title">
          <h2>${item.title}</h2>
          <div class="modal-buttons">
            <button class="btn-hero play" id="modalPlayBtn">${ICONS.play} Play</button>
            <button class="circle-btn ${inMyList ? "active" : ""}" id="modalListBtn" title="Add to My List">${inMyList ? ICONS.check : ICONS.plus}</button>
            <button class="circle-btn" id="modalLikeBtn" title="Like">${ICONS.like}</button>
          </div>
        </div>
      </div>
      <div class="modal-body">
        <div class="modal-left">
          <div class="modal-info-row">
            <span class="match">${item.match}% Match</span>
            <span>${item.year || ""}</span>
            <span class="rated">${item.rating}</span>
            <span>${item.duration}</span>
          </div>
          <p class="desc">${item.desc}</p>
        </div>
        <div class="modal-right">
          <p><span class="label">Cast:</span> Jordan Vale, Mira Solano, Theo Okafor</p>
          <p><span class="label">Genres:</span> ${item.genres ? item.genres.join(", ") : "Drama"}</p>
          <p><span class="label">This show is:</span> Gritty, Suspenseful, Cinematic</p>
        </div>
      </div>
    `;
    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";

    modalBox.querySelector("#modalCloseBtn").addEventListener("click", closeModal);
    modalBox.querySelector("#modalPlayBtn").addEventListener("click", () => showToast(`Playing "${item.title}" (demo)`));
    modalBox.querySelector("#modalLikeBtn").addEventListener("click", (e) => e.currentTarget.classList.toggle("active"));
    modalBox.querySelector("#modalListBtn").addEventListener("click", (e) => {
      const active = toggleMyList(item.id, item.title);
      e.currentTarget.classList.toggle("active", active);
      e.currentTarget.innerHTML = active ? ICONS.check : ICONS.plus;
      renderCurrentView();
    });
  }
  function closeModal() {
    modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ---------------- Nav filter links (Home / TV Shows / Movies / New / My List) ---------------- */
  function renderCurrentView() {
    const active = document.querySelector(".nav-links a.active");
    const filter = active ? active.dataset.filter : "all";
    const emptyState = document.getElementById("emptyState");
    const hero = document.getElementById("browseHero");
    const rowsWrap = document.getElementById("rowsWrap");

    if (filter === "mylist") {
      const ids = new Set(getMyList());
      const myItems = ROWS.flatMap((r) => r.items).filter((it) => ids.has(it.id));
      hero.style.display = "none";
      if (!myItems.length) {
        rowsWrap.innerHTML = "";
        emptyState.style.display = "flex";
      } else {
        emptyState.style.display = "none";
        renderRows([{ title: "My List", items: myItems }]);
      }
      return;
    }

    emptyState.style.display = "none";
    hero.style.display = "";

    let dataset = ROWS;
    if (filter === "series") dataset = ROWS.slice(1, 6);
    if (filter === "movies") dataset = ROWS.filter((r) => !r.title.includes("Originals")).slice(0, 7);
    if (filter === "new") dataset = [...ROWS].slice().reverse().slice(0, 6);

    renderRows(dataset);
  }

  document.querySelectorAll(".nav-links a[data-filter]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".nav-links a").forEach((a) => a.classList.remove("active"));
      link.classList.add("active");
      navLinks.classList.remove("mobile-open");
      window.scrollTo({ top: 0, behavior: "smooth" });
      renderCurrentView();
    });
  });

  /* ---------------- Init ---------------- */
  renderHero();
  renderCurrentView();
})();
