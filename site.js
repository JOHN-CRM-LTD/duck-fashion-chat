"use strict";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   View router — HOME / TEST via location.hash
   ============================================================ */
const views = {
  home: $("#view-home"),
  test: $("#view-test"),
};
const titles = {
  home: "DUCK FASHION Autumn/Winter 2026",
  test: "DUCK FASHION Customer chat test",
};

function currentView() {
  const hash = location.hash.replace(/^[#/]/, "");
  return views[hash] ? hash : "home";
}

function render(view, scroll = true) {
  for (const [name, el] of Object.entries(views)) {
    const on = name === view;
    el.hidden = !on;
    el.classList.toggle("view--active", on);
  }
  $$("[data-view-link]").forEach((a) => a.classList.toggle("is-active", a.dataset.viewLink === view));
  document.title = titles[view];
  if (scroll) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

window.addEventListener("hashchange", () => render(currentView()));
render(currentView(), false);

/* Smooth in-page anchors (hero CTA → collection) */
$$("[data-scroll]").forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = $(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  });
});

/* ============================================================
   Marquee — the -50% keyframe loop is seamless only while one
   half is at least as wide as the viewport, so repeat each half
   until it covers it
   ============================================================ */
const marqueeTrack = $(".marquee-track");
if (marqueeTrack) {
  const sets = $$(".marquee-set", marqueeTrack);
  const originals = sets.map((set) => set.innerHTML);
  const fillMarquee = () => {
    const vw = document.documentElement.clientWidth;
    let filledWidth = 0;
    sets.forEach((set, i) => {
      set.innerHTML = originals[i];
      const base = set.getBoundingClientRect().width;
      if (!base) return; // marquee view hidden — retried on hashchange
      const reps = Math.ceil(vw / base);
      for (let r = 1; r < reps; r++) set.innerHTML += originals[i];
      filledWidth = base * reps;
    });
    if (filledWidth) marqueeTrack.style.animationDuration = `${Math.round(filledWidth / 42)}s`; // ≈41px/s, the original 30s pass
  };
  fillMarquee();
  if (document.fonts) document.fonts.ready.then(fillMarquee);
  window.addEventListener("hashchange", fillMarquee);
  let marqueeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(marqueeTimer);
    marqueeTimer = setTimeout(fillMarquee, 150);
  });
}

/* ============================================================
   Header — hairline after scroll, hide on scroll down
   ============================================================ */
const header = $("#siteHeader");
let lastY = window.scrollY;
window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 8);
    if (y > 240 && y > lastY + 4 && !reducedMotion) header.classList.add("hidden-up");
    else if (y < lastY - 4 || y <= 240) header.classList.remove("hidden-up");
    lastY = y;
  },
  { passive: true }
);

/* ============================================================
   Scroll reveals
   ============================================================ */
const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);

$$(".reveal, .reveal-img").forEach((el) => io.observe(el));

/* Stagger the collection grid */
$$(".collection .product").forEach((el, i) => el.style.setProperty("--d", `${(i % 2) * 120}ms`));

/* ============================================================
   Subtle parallax on editorial imagery
   ============================================================ */
const parallaxEls = $$("[data-parallax]");
if (parallaxEls.length && !reducedMotion && window.matchMedia("(min-width: 901px)").matches) {
  let ticking = false;
  const update = () => {
    for (const el of parallaxEls) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
      const centerDelta = rect.top + rect.height / 2 - window.innerHeight / 2;
      const speed = parseFloat(el.dataset.parallax);
      el.style.transform = `translate3d(0, ${(-centerDelta * speed).toFixed(1)}px, 0)`;
    }
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
}

/* ============================================================
   Toast + "Add to bag"
   ============================================================ */
const toast = $("#toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

$$("[data-add]").forEach((btn) => {
  const original = btn.textContent;
  btn.addEventListener("click", () => {
    showToast(`Added: ${btn.dataset.add}`);
    btn.textContent = "Added";
    btn.classList.add("added");
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("added");
    }, 1600);
  });
});

/* ============================================================
   Test view — copy the sample request
   ============================================================ */
const copyButton = $("#copy-request");
const copyStatus = $("#copy-status");
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("#test-request").textContent.trim());
    copyStatus.textContent = "Copied. Paste it into the chat.";
  } catch {
    copyStatus.textContent = "Select and copy the request above, then paste it into the chat.";
  }
});

/* ============================================================
   Newsletter (client-side only)
   ============================================================ */
const newsletterForm = $("#newsletter-form");
newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $("#newsletter-status").textContent = "Noted. Welcome to the flock.";
  newsletterForm.reset();
});
