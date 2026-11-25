/* ALFA Build 21 clickable mock — client-only, fictional data */
(function () {
  const screens = {
    confirm: document.getElementById("screen-confirm"),
    share: document.getElementById("screen-share"),
    morning: document.getElementById("screen-morning"),
  };
  const tabs = document.querySelectorAll(".tab");
  const card = document.getElementById("confirm-card");
  const emailPreview = document.getElementById("email-preview");
  const bookingPreview = document.getElementById("booking-preview");
  const reviewFine = document.getElementById("review-fine");
  const editEmail = document.getElementById("edit-email");
  const editBooking = document.getElementById("edit-booking");

  const copy = {
    email: {
      fine: "ALFA will send this email to Mara. You can edit it first, or cancel.",
      doneTitle: "Sent.",
      doneCopy: "Mara will receive this now. ALFA will let you know if she replies.",
      cancelTitle: "Nothing was sent.",
      cancelCopy: "The draft is still here if you want to look again. Mara has not been contacted.",
    },
    booking: {
      fine: "ALFA will request this table at Harbour & Pine. Nothing is reserved until you confirm.",
      doneTitle: "The request is in.",
      doneCopy: "Harbour & Pine has the request for Friday evening, under Elena Voss. They will confirm the table.",
      cancelTitle: "Nothing was reserved.",
      cancelCopy: "The request was not sent. The table has not been held.",
    },
  };

  const shareQuestions = {
    safari: "What should I know before I request a Friday table from this page?",
    photos: "Can you read this screenshot and tell me if Friday at 7 still works?",
  };
  const shareAnswers = {
    safari: {
      chipTitle: "Shared from Safari",
      chipBody: "harbourandpine.example — A quieter Friday in the garden room",
      thinking: "Reading the page…",
      html: "<p>The garden room is the quieter room, held for parties of six after 6:30 in the evening. A Friday table through early December is possible, but it is a request, not a hold, until the restaurant confirms.</p><p>If anyone at the table would like the quieter tasting menu, the kitchen asks for a little notice. I can draft a reservation request when you are ready — I will not send it until you confirm.</p>",
    },
    photos: {
      chipTitle: "Shared from Photos",
      chipBody: "Screenshot of Friday, December 4 — workshop follow-up and dinner",
      thinking: "Reading the screenshot…",
      html: "<p>Friday still works at 7, with a little care. The workshop follow-up with Mara ends at 5:30, which leaves a comfortable gap before dinner. If that session runs long, Maya’s note already offers 7:30, and that still sits well.</p><p>I would keep 7 as the plan, and treat 7:30 as the kind fallback. I can update the reservation request if you want it changed — I will not send anything until you confirm.</p>",
    },
  };

  function kind() {
    return card.dataset.kind === "booking" ? "booking" : "email";
  }

  function showState(name) {
    card.dataset.state = name;
    card.querySelectorAll(".state").forEach((el) => {
      el.hidden = !el.classList.contains("state-" + name);
    });
    if (name === "done") {
      document.getElementById("done-title").textContent = copy[kind()].doneTitle;
      document.getElementById("done-copy").textContent = copy[kind()].doneCopy;
    }
    if (name === "cancelled") {
      document.getElementById("cancel-title").textContent = copy[kind()].cancelTitle;
      document.getElementById("cancel-copy").textContent = copy[kind()].cancelCopy;
    }
  }

  function renderKind() {
    const booking = kind() === "booking";
    emailPreview.hidden = booking;
    bookingPreview.hidden = !booking;
    reviewFine.textContent = copy[kind()].fine;
    document.querySelectorAll("#screen-confirm .seg").forEach((btn) => {
      const on = btn.dataset.action === kind();
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function applyEmailEdits() {
    const fd = new FormData(editEmail);
    emailPreview.querySelector(".mail-row strong").textContent = fd.get("to");
    emailPreview.querySelector(".mail-row.mute em").textContent = fd.get("address");
    document.getElementById("email-subject-view").textContent = fd.get("subject");
    const body = String(fd.get("body") || "").trim().replace(/\n/g, "<br />");
    document.getElementById("email-body-view").innerHTML = body;
  }

  function applyBookingEdits() {
    const fd = new FormData(editBooking);
    const place = fd.get("place");
    const when = String(fd.get("when") || "");
    const party = fd.get("party");
    const note = fd.get("note");
    bookingPreview.querySelector("h2").textContent = place;
    const lines = bookingPreview.querySelectorAll(".booking-copy p");
    lines[0].textContent = party;
    lines[1].textContent = when;
    lines[2].textContent = note;
  }

  document.querySelectorAll("#screen-confirm .seg").forEach((btn) => {
    btn.addEventListener("click", () => {
      card.dataset.kind = btn.dataset.action;
      showState("review");
      renderKind();
    });
  });

  card.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-confirm]");
    if (!btn) return;
    const act = btn.dataset.confirm;
    if (act === "edit") {
      editEmail.hidden = kind() !== "email";
      editBooking.hidden = kind() !== "booking";
      showState("edit");
    } else if (act === "cancel-edit") {
      showState("review");
    } else if (act === "save-edit") {
      if (kind() === "email") applyEmailEdits();
      else applyBookingEdits();
      showState("review");
    } else if (act === "send") {
      showState("done");
    } else if (act === "cancel") {
      showState("cancelled");
    } else if (act === "reset") {
      showState("review");
    }
  });

  function closeSheet() {
    document.getElementById("share-sheet").hidden = true;
    document.getElementById("sheet-backdrop").hidden = true;
  }

  function openSheet() {
    document.getElementById("share-sheet").hidden = false;
    document.getElementById("sheet-backdrop").hidden = false;
  }

  function setShareSource(source) {
    const host = document.getElementById("share-host");
    host.dataset.source = source;
    document.getElementById("safari-article").hidden = source !== "safari";
    document.getElementById("photos-ui").hidden = source !== "photos";
    document.querySelector(".safari-chrome .url-pill").parentElement.style.display =
      source === "safari" ? "flex" : "none";
    document.querySelectorAll(".source-switch .seg").forEach((btn) => {
      const on = btn.dataset.source === source;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    closeSheet();
  }

  function showSharePhase(phase) {
    const host = document.getElementById("share-host");
    const compose = document.getElementById("alfa-from-share");
    host.hidden = phase !== "source";
    compose.hidden = phase !== "compose";
    if (phase === "source") {
      closeSheet();
      document.getElementById("thinking").hidden = true;
      document.getElementById("share-answer").hidden = true;
      document.getElementById("ask-btn").hidden = false;
    }
  }

  function openAlfaFromShare() {
    const source = document.getElementById("share-host").dataset.source || "safari";
    const meta = shareAnswers[source];
    closeSheet();
    showSharePhase("compose");
    document.getElementById("shared-chip").innerHTML =
      "<strong>" + meta.chipTitle + "</strong>" + meta.chipBody;
    document.getElementById("ask-input").value = shareQuestions[source];
    document.getElementById("thinking").hidden = true;
    document.getElementById("share-answer").hidden = true;
    document.getElementById("ask-btn").hidden = false;
    document.getElementById("ask-btn").disabled = false;
  }

  document.querySelectorAll("[data-source]").forEach((btn) => {
    if (!btn.closest(".source-switch")) return;
    btn.addEventListener("click", () => {
      showSharePhase("source");
      setShareSource(btn.dataset.source);
    });
  });

  document.querySelectorAll("[data-share-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showSharePhase("source");
      setShareSource(btn.dataset.shareOpen);
      openSheet();
    });
  });

  document.querySelectorAll("[data-share-to-alfa]").forEach((btn) => {
    btn.addEventListener("click", openAlfaFromShare);
  });
  document.querySelector("[data-sheet-close]").addEventListener("click", closeSheet);
  document.getElementById("sheet-backdrop").addEventListener("click", closeSheet);
  document.querySelector("[data-share-back]").addEventListener("click", () => {
    showSharePhase("source");
  });

  document.getElementById("ask-btn").addEventListener("click", () => {
    const source = document.getElementById("share-host").dataset.source || "safari";
    const meta = shareAnswers[source];
    const thinking = document.getElementById("thinking");
    const answer = document.getElementById("share-answer");
    thinking.hidden = false;
    document.getElementById("thinking-copy").textContent = meta.thinking;
    answer.hidden = true;
    document.getElementById("ask-btn").disabled = true;
    window.setTimeout(() => {
      thinking.hidden = true;
      answer.hidden = false;
      document.getElementById("share-answer-body").innerHTML = meta.html;
      document.getElementById("ask-btn").hidden = true;
    }, 1600);
  });

  const checkToggle = document.getElementById("check-toggle");
  const checks = document.getElementById("checks");
  function setChecks(open) {
    checks.hidden = !open;
    checkToggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  checkToggle.addEventListener("click", () => {
    setChecks(checks.hidden);
  });

  function go(name, opts) {
    opts = opts || {};
    Object.entries(screens).forEach(([key, el]) => {
      el.hidden = key !== name;
    });
    tabs.forEach((tab) => {
      tab.classList.toggle("is-on", tab.dataset.nav === name);
    });
    if (name === "confirm") {
      if (opts.kind) card.dataset.kind = opts.kind;
      renderKind();
      showState(opts.state || "review");
    }
    if (name === "share") {
      const source = opts.source || "safari";
      setShareSource(source);
      if (opts.phase === "sheet") {
        showSharePhase("source");
        openSheet();
      } else if (opts.phase === "compose" || opts.phase === "thinking" || opts.phase === "answer") {
        openAlfaFromShare();
        if (opts.phase === "thinking" || opts.phase === "answer") {
          const meta = shareAnswers[source];
          document.getElementById("thinking").hidden = opts.phase !== "thinking";
          document.getElementById("thinking-copy").textContent = meta.thinking;
          document.getElementById("ask-btn").disabled = true;
          if (opts.phase === "answer") {
            document.getElementById("thinking").hidden = true;
            document.getElementById("share-answer").hidden = false;
            document.getElementById("share-answer-body").innerHTML = meta.html;
            document.getElementById("ask-btn").hidden = true;
          }
        }
      } else {
        showSharePhase("source");
        closeSheet();
      }
    }
    if (name === "morning") {
      setChecks(!!opts.checked);
    }
    if (!opts.silentHash) {
      const params = new URLSearchParams();
      if (name !== "confirm") params.set("s", name);
      if (name === "confirm" && opts.state && opts.state !== "review") params.set("state", opts.state);
      if (name === "confirm" && opts.kind && opts.kind !== "email") params.set("kind", opts.kind);
      if (name === "share" && opts.source && opts.source !== "safari") params.set("source", opts.source);
      if (name === "share" && opts.phase && opts.phase !== "source") params.set("phase", opts.phase);
      if (name === "morning" && opts.checked) params.set("checked", "1");
      const qs = params.toString();
      history.replaceState(null, "", qs ? "?" + qs : location.pathname);
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => go(tab.dataset.nav));
  });

  function fromQuery() {
    const q = new URLSearchParams(location.search);
    const name = q.get("s") || "confirm";
    go(name, {
      silentHash: true,
      state: q.get("state") || "review",
      kind: q.get("kind") || "email",
      source: q.get("source") || "safari",
      phase: q.get("phase") || "source",
      checked: q.get("checked") === "1",
    });
  }

  fromQuery();
  window.__alfaMock = { go };
})();
