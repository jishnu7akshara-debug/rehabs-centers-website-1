(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- mobile menu ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("mobile-menu");
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
  }
  toggle.addEventListener("click", function () { setMenu(menu.hidden); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); } });

  /* ---------- hero video: pause for reduced motion ---------- */
  var heroVideo = document.querySelector(".hero__video video");
  if (heroVideo && reduceMotion) { heroVideo.removeAttribute("autoplay"); heroVideo.pause(); }

  /* ---------- lazy second video: load and play only when on screen ---------- */
  var lazyVideos = document.querySelectorAll("video[data-lazy-video]");
  if ("IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (!v.dataset.loaded) {
            v.querySelectorAll("source[data-src]").forEach(function (s) { s.src = s.dataset.src; });
            v.load();
            v.dataset.loaded = "1";
          }
          if (!reduceMotion) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { rootMargin: "200px 0px", threshold: 0.15 });
    lazyVideos.forEach(function (v) { vio.observe(v); });
  } else {
    lazyVideos.forEach(function (v) {
      v.querySelectorAll("source[data-src]").forEach(function (s) { s.src = s.dataset.src; });
      v.load();
    });
  }

  /* ---------- conditions tabs ---------- */
  var areas = {
    knee: {
      img: "physio-knee", w: 800, h: 533,
      alt: "A physiotherapist bending a patient's knee to test its range of motion",
      name: "Knee pain and injuries",
      desc: "Ligament sprains, meniscus tears, runner's knee and arthritis. We test strength and stability first, then decide whether you need imaging at all.",
      list: "ACL tear, meniscus injury, patellofemoral pain, osteoarthritis",
      scan: "Weight-bearing X-ray or knee ultrasound",
      time: "6 to 12 sessions over 4 to 8 weeks",
      cta: "Book a knee assessment"
    },
    back: {
      img: "physio-hamstring", w: 800, h: 533,
      alt: "A physiotherapist raising a patient's straight leg to test for nerve tension in the lower back",
      name: "Lower back pain",
      desc: "Most back pain improves without an MRI. We check for nerve involvement, find which movements ease it, and build strength so it doesn't keep coming back.",
      list: "Disc bulge, sciatica, muscle strain, stiffness from desk work",
      scan: "X-ray only if red flags; nerve conduction study for leg numbness",
      time: "6 to 10 sessions over 4 to 6 weeks",
      cta: "Book a back assessment"
    },
    shoulder: {
      img: "manual-therapy-shoulder", w: 800, h: 533,
      alt: "A therapist pressing on a patient's shoulder blade during manual therapy",
      name: "Shoulder and neck pain",
      desc: "Frozen shoulder, rotator cuff problems and neck pain that spreads to the arm. Ultrasound shows tendon tears clearly, and we can do it during your visit.",
      list: "Frozen shoulder, rotator cuff tear, impingement, cervical spondylosis",
      scan: "Shoulder ultrasound; neck X-ray when needed",
      time: "8 to 16 sessions over 6 to 12 weeks",
      cta: "Book a shoulder assessment"
    },
    ankle: {
      img: "physio-ankle", w: 800, h: 1200,
      alt: "A physiotherapist holding and mobilising a patient's ankle",
      name: "Ankle and foot pain",
      desc: "Sprains that never quite healed, heel pain in the morning and Achilles problems. We work on balance and loading so the ankle trusts you again.",
      list: "Ankle sprain, plantar fasciitis, Achilles tendinopathy, flat feet",
      scan: "Ankle X-ray to rule out fracture; tendon ultrasound",
      time: "4 to 8 sessions over 3 to 6 weeks",
      cta: "Book an ankle assessment"
    },
    neuro: {
      img: "rehab-gym-seniors", w: 800, h: 533,
      alt: "An older man and woman doing a balance exercise on mats in a rehab gym",
      name: "Stroke and neurological rehab",
      desc: "Relearning to walk, balance and use the hands after a stroke, and staying mobile with Parkinson's. Families are welcome in sessions to learn the home exercises.",
      list: "Stroke, Parkinson's disease, peripheral neuropathy, balance disorders",
      scan: "Nerve conduction study; we coordinate with your neurologist for MRI",
      time: "Ongoing, reviewed every 4 weeks",
      cta: "Book a neuro rehab assessment"
    }
  };
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.conditions__tabs [role="tab"]'));
  var panel = document.getElementById("cond-panel");
  var el = {
    img: document.getElementById("cond-img"),
    name: document.getElementById("cond-name"),
    desc: document.getElementById("cond-desc"),
    list: document.getElementById("cond-list"),
    scan: document.getElementById("cond-scan"),
    time: document.getElementById("cond-time"),
    cta: document.getElementById("cond-cta")
  };
  // warm the cache so swaps are instant
  Object.keys(areas).forEach(function (k) { var i = new Image(); i.src = "assets/img/" + areas[k].img + "-800.webp"; });

  function selectTab(tab, focus) {
    var a = areas[tab.dataset.area];
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tab.id);
    if (focus) tab.focus();
    var swap = function () {
      el.img.src = "assets/img/" + a.img + "-800.webp";
      el.img.srcset = "assets/img/" + a.img + "-800.webp 800w, assets/img/" + a.img + "-1400.webp 1400w";
      el.img.width = a.w; el.img.height = a.h;
      el.img.alt = a.alt;
      el.name.textContent = a.name;
      el.desc.textContent = a.desc;
      el.list.textContent = a.list;
      el.scan.textContent = a.scan;
      el.time.textContent = a.time;
      el.cta.textContent = a.cta;
      el.img.classList.remove("is-swapping");
    };
    if (reduceMotion) { swap(); return; }
    el.img.classList.add("is-swapping");
    setTimeout(swap, 180);
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var n = null;
      if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") n = tabs[0];
      if (e.key === "End") n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  /* ---------- test filter ---------- */
  var chips = document.querySelectorAll(".diag__filter .chip");
  var tests = document.querySelectorAll(".tests li");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) { var on = c === chip; c.classList.toggle("is-on", on); c.setAttribute("aria-pressed", String(on)); });
      tests.forEach(function (t) { t.hidden = !(f === "all" || t.dataset.cat === f); });
    });
  });

  /* ---------- booking form ---------- */
  var form = document.getElementById("book-form");
  var service = document.getElementById("f-service");
  var date = document.getElementById("f-date");
  var done = document.getElementById("form-done");
  var today = new Date();
  var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  date.min = iso;

  // buttons that carry a service pre-fill the form
  document.querySelectorAll("[data-service]").forEach(function (b) {
    b.addEventListener("click", function () { service.value = b.dataset.service; clearErr(service); });
  });

  function row(input) { return input.closest(".form__row"); }
  function setErr(input) { row(input).classList.add("has-error"); input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", "e-" + input.name); }
  function clearErr(input) { row(input).classList.remove("has-error"); input.removeAttribute("aria-invalid"); }

  var checks = {
    service: function (v) { return v !== ""; },
    name: function (v) { return v.trim().length >= 2; },
    phone: function (v) { return /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)/, "")); },
    date: function (v) { return v !== "" && v >= iso; }
  };
  Object.keys(checks).forEach(function (k) {
    var input = form.elements[k];
    input.addEventListener("input", function () { if (checks[k](input.value)) clearErr(input); });
    input.addEventListener("change", function () { if (checks[k](input.value)) clearErr(input); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var first = null;
    Object.keys(checks).forEach(function (k) {
      var input = form.elements[k];
      if (!checks[k](input.value)) { setErr(input); if (!first) first = input; } else { clearErr(input); }
    });
    if (first) { first.focus(); return; }
    var d = new Date(date.value + "T00:00:00");
    var when = d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
    var time = form.elements.time.value.toLowerCase();
    done.textContent = "Request sent. We'll call " + form.elements.name.value.trim().split(" ")[0] +
      " to confirm your " + service.value.toLowerCase() + " on " + when + " (" + time + ").";
    done.hidden = false;
    form.reset();
    form.elements.time[0].checked = true;
    done.focus && done.setAttribute("tabindex", "-1");
    done.focus();
  });

  /* ---------- floating book button: only after the hero, hidden at the form ---------- */
  var fb = document.querySelector(".float-book");
  var bookSec = document.getElementById("book");
  function onScroll() {
    var y = window.scrollY, r = bookSec.getBoundingClientRect();
    var atForm = r.top < window.innerHeight && r.bottom > 0;
    fb.classList.toggle("is-shown", y > 500 && !atForm);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- footer year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
