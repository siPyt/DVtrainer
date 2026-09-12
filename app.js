/* DV Trainer — app logic */
(function () {
  "use strict";

  const LEVELS = ["beginner", "intermediate", "expert"];
  const SCOPES = {
    "function-block": "Function Block",
    "implementation": "Implementation",
    "all": "All Manuals"
  };

  // Attach a stable id to each card (index-based; dataset order is stable).
  DV_CARDS.forEach((c, i) => { c.id = "c" + i; });

  const state = {
    level: null,
    scope: null,
    mode: "flashcards",
    shuffle: true,
    deck: [],
    index: 0,
    flipped: false,
    rated: {},        // id -> rating for this session
    seen: new Set()
  };

  // ---------- helpers ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function scopeOfManual(manualKey) {
    const m = DV_MANUALS[manualKey];
    return m ? m.scope : "function-block";
  }

  function cardsFor(level, scope) {
    return DV_CARDS.filter((c) => {
      if (level && c.level !== level) return false;
      if (!scope || scope === "all") return true;
      return scopeOfManual(c.manual) === scope;
    });
  }

  function countFor(level, scope) { return cardsFor(level, scope).length; }

  function shuffleArr(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- progress persistence ----------
  const STORE_KEY = "dvtrainer_progress_v1";
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
  }
  const progress = loadProgress();

  // ================= HOME =================
  function initHome() {
    // level counts (using current scope if any, else all)
    LEVELS.forEach((lv) => {
      const el = $(`[data-level-count="${lv}"]`);
      if (el) el.textContent = countFor(lv, state.scope || "all") + " cards";
    });
    Object.keys(SCOPES).forEach((sc) => {
      const el = $(`[data-scope-count="${sc}"]`);
      if (el) el.textContent = countFor(state.level, sc) + " cards";
    });
    renderManualList();
    updateSelection();
  }

  function renderManualList() {
    const ul = $("#manualList");
    ul.innerHTML = "";
    Object.keys(DV_MANUALS).forEach((key) => {
      const m = DV_MANUALS[key];
      const n = DV_CARDS.filter((c) => c.manual === key).length;
      const li = document.createElement("li");
      li.innerHTML =
        `<div><div class="m-name">${m.name}</div>` +
        `<div class="m-scope">${SCOPES[m.scope] || m.scope}</div></div>` +
        `<div class="m-count">${n} cards</div>`;
      ul.appendChild(li);
    });
  }

  function updateSelection() {
    $$("#levelGrid .option-card").forEach((b) =>
      b.classList.toggle("selected", b.dataset.level === state.level));
    $$("#scopeGrid .option-card").forEach((b) =>
      b.classList.toggle("selected", b.dataset.scope === state.scope));

    // refresh counts reactively
    LEVELS.forEach((lv) => {
      const el = $(`[data-level-count="${lv}"]`);
      if (el) el.textContent = countFor(lv, state.scope || "all") + " cards";
    });
    Object.keys(SCOPES).forEach((sc) => {
      const el = $(`[data-scope-count="${sc}"]`);
      if (el) el.textContent = countFor(state.level, sc) + " cards";
    });

    const ready = state.level && state.scope;
    const total = ready ? countFor(state.level, state.scope) : 0;
    $("#startBtn").disabled = !ready || total === 0;

    const sum = $("#selectionSummary");
    if (!state.level && !state.scope) {
      sum.textContent = "Select a level and material to begin.";
    } else if (!state.level) {
      sum.textContent = "Now pick a level.";
    } else if (!state.scope) {
      sum.textContent = "Now pick your material.";
    } else {
      const lvName = state.level[0].toUpperCase() + state.level.slice(1);
      sum.textContent = total === 0
        ? `No ${lvName} cards for ${SCOPES[state.scope]} yet.`
        : `Ready: ${total} ${lvName} card${total === 1 ? "" : "s"} from ${SCOPES[state.scope]} · ${state.mode === "quiz" ? "Self-Test" : "Flashcards"} mode.`;
    }
  }

  // level / scope selection
  $("#levelGrid").addEventListener("click", (e) => {
    const b = e.target.closest(".option-card"); if (!b) return;
    state.level = state.level === b.dataset.level ? null : b.dataset.level;
    updateSelection();
  });
  $("#scopeGrid").addEventListener("click", (e) => {
    const b = e.target.closest(".option-card"); if (!b) return;
    state.scope = state.scope === b.dataset.scope ? null : b.dataset.scope;
    updateSelection();
  });

  // mode toggle
  $("#modeToggle").addEventListener("click", (e) => {
    const b = e.target.closest(".mode-btn"); if (!b) return;
    state.mode = b.dataset.mode;
    $$("#modeToggle .mode-btn").forEach((x) => x.classList.toggle("active", x === b));
    updateSelection();
  });

  $("#shuffleChk").addEventListener("change", (e) => { state.shuffle = e.target.checked; });
  $("#startBtn").addEventListener("click", startSession);

  // ================= SESSION =================
  function buildDeck() {
    let deck = cardsFor(state.level, state.scope);
    if (state.shuffle) deck = shuffleArr(deck);
    return deck;
  }

  function startSession() {
    state.deck = buildDeck();
    state.baseDeck = state.deck.slice();
    state.index = 0;
    state.flipped = false;
    state.rated = {};
    state.seen = new Set();
    populateTopicFilter();
    $("#searchInput").value = "";
    $("#topicFilter").value = "";
    showView("study");
    renderStudyHeader();
    renderCard();
  }

  function renderStudyHeader() {
    const lvName = state.level[0].toUpperCase() + state.level.slice(1);
    $("#studyTitle").textContent = `${lvName} · ${SCOPES[state.scope]}`;
    $("#topbarMeta").textContent = `${state.mode === "quiz" ? "Self-Test" : "Flashcards"} · ${state.deck.length} cards`;
  }

  function populateTopicFilter() {
    const sel = $("#topicFilter");
    const topics = Array.from(new Set(state.baseDeck.map((c) => c.topic))).sort();
    sel.innerHTML = '<option value="">All topics</option>' +
      topics.map((t) => `<option value="${t}">${t}</option>`).join("");
  }

  function applyFilters() {
    const q = $("#searchInput").value.trim().toLowerCase();
    const topic = $("#topicFilter").value;
    let deck = state.baseDeck.filter((c) => {
      if (topic && c.topic !== topic) return false;
      if (q) {
        const hay = (c.front + " " + c.back + " " + c.topic).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (state.shuffle && !q && !topic) {
      // keep the already-shuffled base order
    }
    state.deck = deck;
    state.index = 0;
    state.flipped = false;
    renderCard();
  }

  $("#searchInput").addEventListener("input", applyFilters);
  $("#topicFilter").addEventListener("change", applyFilters);

  function currentCard() { return state.deck[state.index]; }

  function tagHTML(card) {
    const m = DV_MANUALS[card.manual];
    const lvName = card.level[0].toUpperCase() + card.level.slice(1);
    return `<span class="tag manual">${m ? m.short : card.manual}</span>` +
           `<span class="tag">${card.topic}</span>` +
           `<span class="tag level-${card.level}">${lvName}</span>`;
  }

  function renderCard() {
    const card = currentCard();
    const total = state.deck.length;
    const fc = $("#flashcard");

    if (!card) {
      $("#deckCount").textContent = "No cards match this filter.";
      $("#frontText").textContent = "No cards match your filter.";
      $("#backText").textContent = "";
      $("#frontTags").innerHTML = "";
      $("#backTags").innerHTML = "";
      $("#progressText").textContent = "0 / 0";
      $("#progressFill").style.width = "0%";
      $("#quizControls").classList.remove("show");
      return;
    }

    state.flipped = false;
    fc.classList.remove("flipped");
    $("#quizControls").classList.remove("show");

    $("#frontTags").innerHTML = tagHTML(card);
    $("#backTags").innerHTML = tagHTML(card);
    $("#frontText").textContent = card.front;
    $("#backText").textContent = card.back;

    $("#deckCount").textContent = `${total} card${total === 1 ? "" : "s"} in deck`;
    $("#progressText").textContent = `${state.index + 1} / ${total}`;
    $("#progressFill").style.width = ((state.index + 1) / total * 100) + "%";

    renderSessionStats();
  }

  function renderSessionStats() {
    const done = Object.keys(state.rated).length;
    const key = progressKey();
    const mastered = (progress[key] && progress[key].mastered) ? progress[key].mastered.length : 0;
    if (state.mode === "quiz") {
      $("#sessionStats").textContent =
        `Rated this session: ${done} · Mastered (all-time): ${mastered}`;
    } else {
      $("#sessionStats").textContent = `Viewed: ${state.seen.size} of ${state.baseDeck.length}`;
    }
  }

  function progressKey() { return `${state.level}|${state.scope}`; }

  function flip() {
    const card = currentCard(); if (!card) return;
    state.flipped = !state.flipped;
    $("#flashcard").classList.toggle("flipped", state.flipped);
    if (state.flipped) {
      state.seen.add(card.id);
      if (state.mode === "quiz") $("#quizControls").classList.add("show");
    } else {
      $("#quizControls").classList.remove("show");
    }
    renderSessionStats();
  }

  $("#flashcard").addEventListener("click", (e) => {
    if (e.target.closest(".quiz-controls")) return;
    flip();
  });
  $("#flipBtn").addEventListener("click", flip);

  function next() {
    if (state.index < state.deck.length - 1) {
      state.index++;
      renderCard();
    } else {
      finishSession();
    }
  }
  function prev() {
    if (state.index > 0) { state.index--; renderCard(); }
  }
  $("#nextBtn").addEventListener("click", next);
  $("#prevBtn").addEventListener("click", prev);

  // quiz rating
  $("#quizControls").addEventListener("click", (e) => {
    const b = e.target.closest(".rate-btn"); if (!b) return;
    const card = currentCard(); if (!card) return;
    const rating = b.dataset.rate;
    state.rated[card.id] = rating;

    const key = progressKey();
    if (!progress[key]) progress[key] = { mastered: [], reviews: 0 };
    progress[key].reviews = (progress[key].reviews || 0) + 1;
    const set = new Set(progress[key].mastered);
    if (rating === "good" || rating === "easy") set.add(card.id);
    else set.delete(card.id);
    progress[key].mastered = Array.from(set);
    saveProgress(progress);

    // "Again" re-queues the card near the end
    if (rating === "again") state.deck.push(card);

    next();
  });

  function finishSession() {
    const total = state.baseDeck.length;
    const rated = Object.keys(state.rated).length;
    const good = Object.values(state.rated).filter((r) => r === "good" || r === "easy").length;
    let msg;
    if (state.mode === "quiz") {
      const pct = rated ? Math.round(good / rated * 100) : 0;
      msg = `You rated ${rated} card${rated === 1 ? "" : "s"} and marked ${good} as known (${pct}%). ` +
            `Keep cycling the deck to move everything into mastered.`;
    } else {
      msg = `You reviewed all ${total} card${total === 1 ? "" : "s"} in this deck. Switch to Self-Test to check retention.`;
    }
    $("#doneSummary").textContent = msg;
    $("#topbarMeta").textContent = "";
    showView("done");
  }

  // ================= NAV / VIEWS =================
  function showView(name) {
    $$(".view").forEach((v) => v.classList.remove("active"));
    if (name === "home") { $("#homeView").classList.add("active"); $("#topbarMeta").textContent = ""; initHome(); }
    else if (name === "study") $("#studyView").classList.add("active");
    else if (name === "done") $("#doneView").classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $("#backBtn").addEventListener("click", () => showView("home"));
  $("#brandHome").addEventListener("click", () => showView("home"));
  $("#doneHomeBtn").addEventListener("click", () => showView("home"));
  $("#restartBtn").addEventListener("click", startSession);

  // keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (!$("#studyView").classList.contains("active")) return;
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  });

  // ================= INIT =================
  initHome();
})();
