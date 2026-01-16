// engine.js — browser-only deterministic evaluator + feedback hooks
// Reads rules.json, evaluates in order, renders outputs. No predictions/probabilities.

const CONFIG = {
  RULES_PATH: "./rules.json",
  // Feedback endpoint options (choose ONE later):
  // 1) Google Apps Script Web App URL (recommended): set FEEDBACK_ENDPOINT to that URL and method POST.
  // 2) Google Form POST endpoint (more brittle).
  // For now: leave null to do "mailto" fallback.
  FEEDBACK_ENDPOINT: null, // e.g. "https://script.google.com/macros/s/XXXX/exec"
  FEEDBACK_MAILTO: null    // e.g. "mailto:you@example.com"
};

let RULESET = null;

function $(id) { return document.getElementById(id); }

function getMultiSelectValues(sel) {
  if (!sel) return [];
  return Array.from(sel.selectedOptions).map(o => o.value);
}

function toBool(v) {
  if (typeof v === "boolean") return v;
  return String(v).toLowerCase() === "true";
}

function clamp(n, min, max) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

// Derived fields (aligns with your schema)
function computeGpaBand(gpa) {
  if (gpa >= 3.80) return "A";
  if (gpa >= 3.50) return "B";
  if (gpa >= 3.20) return "C";
  if (gpa >= 2.80) return "D";
  return "E";
}

function computeTimeWindow(gradeLevel, monthBucket) {
  if (gradeLevel === 9 || gradeLevel === 10) return "early";
  if (gradeLevel === 11) return "late";
  if (gradeLevel === 12) {
    if (monthBucket === "october_or_later") return "closed";
    return "final";
  }
  return "early";
}

function uniqPush(arr, items) {
  for (const it of items || []) {
    if (!arr.includes(it)) arr.push(it);
  }
}

// Monotonic suppression: once true, it stays true
function applySuppress(state, suppressPatch) {
  if (!suppressPatch) return;
  for (const [k, v] of Object.entries(suppressPatch)) {
    if (v === true) state.suppress[k] = true;
  }
}

function getField(ctx, path) {
  // path examples: input.major_bucket, derived.gpa_band, state.suppress.cc
  const parts = String(path).split(".");
  let cur = ctx;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function evalCond(ctx, cond) {
  // cond forms:
  // {field, eq|in|gte|contains|exists}
  // {all:[cond...]}, {any:[cond...]}
  if (cond == null) return true;

  if (cond.all) return cond.all.every(c => evalCond(ctx, c));
  if (cond.any) return cond.any.some(c => evalCond(ctx, c));

  const val = getField(ctx, cond.field);

  if ("exists" in cond) {
    const exists = val !== undefined && val !== null && !(Array.isArray(val) && val.length === 0);
    return cond.exists ? exists : !exists;
  }
  if ("eq" in cond) return val === cond.eq;
  if ("in" in cond) return Array.isArray(cond.in) ? cond.in.includes(val) : false;
  if ("gte" in cond) return (typeof val === "number") && val >= cond.gte;

  if ("contains" in cond) {
    // set/array contains a specific element
    if (!Array.isArray(val)) return false;
    return val.includes(cond.contains);
  }
  return false;
}

function applyThen(ctx, rule) {
  const t = rule.then || {};
  uniqPush(ctx.state.outputs.locked, t.add_locked);
  uniqPush(ctx.state.outputs.viable, t.add_viable);
  uniqPush(ctx.state.outputs.actions, t.add_actions);
  uniqPush(ctx.state.outputs.stop, t.add_stop);
  uniqPush(ctx.state.outputs.notes, t.add_notes);
  applySuppress(ctx.state, t.set_suppress);
}

function chooseSuccessTemplate(ctx) {
  if (ctx?.derived?.time_window === "closed") return "closed_window";

  const band = ctx?.derived?.gpa_band;
  const systems = ctx?.input?.systems_considered || [];
  const campuses = ctx?.input?.campus_targets_uc || [];

  const ccStructurallyPrimary = (band === "C" || band === "D" || band === "E");
  const ccConsidered = systems.includes("cc_transfer");

  // Transfer logic stays unchanged
  if (ccStructurallyPrimary) {
    return ccConsidered ? "cc_to_uc" : "cc_transfer_refused";
  }

  // UC-specific success framing
  if (systems.includes("uc")) {
    if (campuses.includes("UCM")) return "access_uc";
    if (["UCR", "UCSC", "UCSD", "UCLA"].some(c => campuses.includes(c))) {
      return "floor_guarded_uc";
    }

    if (ctx?.derived?.time_window === "early") return "mid_uc_early";
    return "mid_uc_late";
  }

  return "csu";
}

function enforceConstraints(arr, maxN) {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, maxN);
}

function renderList(el, items, emptyText) {
  el.innerHTML = "";
  if (!items || items.length === 0) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = emptyText || "No items.";
    el.appendChild(li);
    return;
  }
  for (const it of items) {
    const li = document.createElement("li");
    li.textContent = it;
    el.appendChild(li);
  }
}

function renderOutput(ctx) {
  const { outputs } = ctx.state;
  const c = RULESET.output_constraints;

  // Apply constraints
  const locked = enforceConstraints(outputs.locked, c.max_locked || 7);
  const viable = enforceConstraints(outputs.viable, c.max_viable || 6);

  // Apply suppression to actions/notes display (simple version)
  let actions = outputs.actions.slice();
  const stop = outputs.stop.slice();

  // If a modifier is suppressed, remove action lines that mention it (coarse but safe for v1)
  const suppressedKeys = Object.entries(ctx.state.suppress)
    .filter(([, v]) => v === true)
    .map(([k]) => k);

  const filterSuppressed = (line) => {
    const s = line.toLowerCase();
    if (suppressedKeys.includes("testing") && s.includes("test")) return false;
    if (suppressedKeys.includes("cc") && s.includes("cc")) return false;
    if (suppressedKeys.includes("ap") && (s.includes("ap") || s.includes("honors"))) return false;
    if (suppressedKeys.includes("internships") && s.includes("intern")) return false;
    if (suppressedKeys.includes("extracurriculars") && (s.includes("ec") || s.includes("club"))) return false;
    if (suppressedKeys.includes("middle_college") && s.includes("middle college")) return false;
    return true;
  };

  actions = actions.filter(filterSuppressed);

  actions = enforceConstraints(actions, c.max_actions || 5);
  const stopC = enforceConstraints(stop, c.max_stop || 5);

  // Success definition
  const templateKey = chooseSuccessTemplate(ctx);
  const successText =
    RULESET.success_templates?.[templateKey] ||
    "Define success based on the primary viable pathway.";

  // Render pills
  $("pill_gpa_band").textContent = `GPA band: ${ctx.derived.gpa_band}`;
  $("pill_time_window").textContent = `Time window: ${ctx.derived.time_window}`;

  renderList(
    $("locked_list"),
    locked,
    "No new pathways are closing at this point. What’s listed elsewhere reflects the current planning reality."
  );

  renderList(
    $("viable_list"),
    viable,
    "No new pathways emerged beyond what is already expected. This confirms your current understanding."
  );

  renderList(
    $("actions_list"),
    actions,
    "No additional high-impact actions surfaced beyond standard application execution."
  );

  renderList(
    $("stop_list"),
    stop,
    "No common time-sinks stand out here. Focus on clean execution of the viable plan."
  );

  $("success_box").textContent = successText;

  // Notes (dedupe + keep short)
  const notes = enforceConstraints(Array.from(new Set(outputs.notes)), 8);
  renderList($("notes_list"), notes, "No additional context is required for this scenario.");
}

function readInputs() {
  const grade_level = parseInt($("grade_level").value, 10);
  const grade_month_bucket = $("grade_month_bucket").value;

  const gpa_unweighted = clamp(parseFloat($("gpa_unweighted").value), 2.0, 4.0);

  const input = {
    grade_level,
    grade_month_bucket: grade_level === 12 ? grade_month_bucket : null,

    gpa_unweighted,
    gpa_trend: $("gpa_trend").value,
    grade_concentration: $("grade_concentration").value,
    major_bucket: $("major_bucket").value,
    systems_considered: getMultiSelectValues($("systems_considered")),

    willing_prioritize_gpa_over_rigor: toBool($("willing_prioritize_gpa_over_rigor").value),
    willing_summer_academics: toBool($("willing_summer_academics").value),
    willing_reduce_ecs: toBool($("willing_reduce_ecs").value),
    open_to_cc_pathways: toBool($("open_to_cc_pathways").value),

    summer_travel_weeks: $("summer_travel_weeks").value === "" ? null : parseInt($("summer_travel_weeks").value, 10),

    // Optional routing
    campus_targets_uc: getMultiSelectValues($("campus_targets_uc")),
    academic_anomaly_timing: $("academic_anomaly_timing").value || null,
    ec_leadership_recognition: $("ec_leadership_recognition").value || null,
    senior_course_signals: getMultiSelectValues($("senior_course_signals"))
  };

  return input;
}

function initState() {
  return {
    outputs: { locked: [], viable: [], actions: [], stop: [], success_definition: {}, notes: [] },
    suppress: { cc: false, ap: false, middle_college: false, testing: false, internships: false, extracurriculars: false, essays: false }
  };
}

function runEngine(input) {
  const derived = {
    gpa_band: computeGpaBand(input.gpa_unweighted),
    time_window: computeTimeWindow(input.grade_level, input.grade_month_bucket)
  };

  const ctx = {
    input,
    derived,
    state: initState()
  };

  // Evaluate rules in declared stage order
  const stages = RULESET.execution_order || [];
  for (const stage of stages) {
    const stageRules = RULESET.rules.filter(r => r.stage === stage);
    for (const rule of stageRules) {
      if (evalCond({ input, derived, state: ctx.state }, rule.when)) {
        applyThen({ input, derived, state: ctx.state }, rule);
      }
    }
  }

  return ctx;
}

// -------------------- Feedback hooks --------------------

let FEEDBACK_RATING = null;

function showFeedbackBox(rating) {
  FEEDBACK_RATING = rating;
  $("fb_detail").classList.remove("hidden");
  $("fb_status").textContent = "";
  $("fb_text").value = "";
  $("fb_text").focus();
}

function hideFeedbackBox() {
  FEEDBACK_RATING = null;
  $("fb_detail").classList.add("hidden");
  $("fb_status").textContent = "";
  $("fb_text").value = "";
}

async function submitFeedback(payload) {
  // Payload is intentionally minimal: rating + optional comment + engine_version + timestamp
  // No student inputs are sent by default.
  if (CONFIG.FEEDBACK_ENDPOINT) {
    // POST JSON to your endpoint (Apps Script web app recommended)
    const res = await fetch(CONFIG.FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return { ok: res.ok };
  }

  if (CONFIG.FEEDBACK_MAILTO) {
    const subject = encodeURIComponent(`Decision Engine Feedback (${payload.rating})`);
    const body = encodeURIComponent(
      `Engine: ${payload.engine_version}\nTime: ${payload.timestamp}\nRating: ${payload.rating}\n\nComment:\n${payload.comment || ""}\n`
    );
    window.location.href = `${CONFIG.FEEDBACK_MAILTO}?subject=${subject}&body=${body}`;
    return { ok: true };
  }

  // Fallback: store locally and show confirmation
  const key = "engine_feedback_queue";
  const cur = JSON.parse(localStorage.getItem(key) || "[]");
  cur.push(payload);
  localStorage.setItem(key, JSON.stringify(cur));
  return { ok: true, queued: true };
}

// -------------------- Tooltip close behavior --------------------
// Closes any open :focus-within tooltip when tapping outside it (mobile-friendly)
// and supports Escape-to-close for keyboard users.
function setupTooltipCloseHandlers() {
  const TIPWRAP_SEL = ".tipwrap";

  function closestTipwrap(node) {
    if (!node || !(node instanceof Element)) return null;
    return node.closest(TIPWRAP_SEL);
  }

  function closeIfTooltipOpen() {
    const active = document.activeElement;
    const openWrap = closestTipwrap(active);
    if (openWrap && active && typeof active.blur === "function") {
      active.blur(); // collapses :focus-within
      return true;
    }
    return false;
  }

  // pointerdown fires reliably on touch + mouse, before click delays
  document.addEventListener(
    "pointerdown",
    (e) => {
      const active = document.activeElement;
      const openWrap = closestTipwrap(active);
      if (!openWrap) return; // nothing open
      if (openWrap.contains(e.target)) return; // tapped inside -> don't close
      closeIfTooltipOpen();
    },
    { passive: true }
  );

  // Keyboard support: Escape closes an open tooltip
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const didClose = closeIfTooltipOpen();
    if (didClose) e.preventDefault();
  });
}

// -------------------- UI wiring --------------------

function toggleUcExplainer(ctx) {
  const show =
    (ctx?.input?.systems_considered || []).includes("uc") ||
    ((ctx?.input?.campus_targets_uc || []).length > 0);

  const wrap = $("uc_explainer_wrap");
  if (!wrap) return;
  wrap.style.display = show ? "block" : "none";
}

function updateMonthBucketVisibility() {
  const grade = parseInt($("grade_level").value, 10);
  const wrap = $("month_bucket_wrap");
  wrap.classList.toggle("hidden", grade !== 12);
}

async function loadRules() {
  const res = await fetch(CONFIG.RULES_PATH);
  RULESET = await res.json();
  $("version_line").textContent = `Engine version: ${RULESET.engine_version || "unknown"} (browser-only prototype)`;
}

function resetUI() {
  $("locked_list").innerHTML = "";
  $("viable_list").innerHTML = "";
  $("actions_list").innerHTML = "";
  $("stop_list").innerHTML = "";
  $("notes_list").innerHTML = "";
  $("success_box").textContent = "";
  $("pill_gpa_band").textContent = "GPA band: —";
  $("pill_time_window").textContent = "Time window: —";
  const wrap = $("uc_explainer_wrap");
  if (wrap) wrap.style.display = "none";
  hideFeedbackBox();
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadRules();
  updateMonthBucketVisibility();
  setupTooltipCloseHandlers();

  $("grade_level").addEventListener("change", updateMonthBucketVisibility);

  $("run_btn").addEventListener("click", () => {
    const input = readInputs();
    const ctx = runEngine(input);
    renderOutput(ctx);
    toggleUcExplainer(ctx);
    hideFeedbackBox();
  });

  $("reset_btn").addEventListener("click", resetUI);

  $("fb_yes").addEventListener("click", () => showFeedbackBox("matched"));
  $("fb_partial").addEventListener("click", () => showFeedbackBox("partial"));
  $("fb_no").addEventListener("click", () => showFeedbackBox("not_accurate"));

  $("fb_cancel").addEventListener("click", hideFeedbackBox);

  $("fb_submit").addEventListener("click", async () => {
    $("fb_submit").disabled = true;
    $("fb_status").textContent = "Sending…";

    const payload = {
      engine_version: RULESET.engine_version || "unknown",
      timestamp: new Date().toISOString(),
      rating: FEEDBACK_RATING,
      comment: ($("fb_text").value || "").trim().slice(0, 1200)
    };

    try {
      const result = await submitFeedback(payload);
      if (result.queued) {
        $("fb_status").textContent = "Saved locally (no endpoint configured yet).";
      } else {
        $("fb_status").textContent = "Sent. Thank you.";
      }
    } catch (e) {
      console.error(e);
      $("fb_status").textContent = "Failed to send. (Endpoint not configured?)";
    } finally {
      $("fb_submit").disabled = false;
    }
  });
});



