/* =========================================================
   ZeroBook Infinity — main.js
   Navbar, mobile menu, scroll reveal, active links,
   display-mode tabs, counters, lightbox, pre-order form.
   ========================================================= */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Footer year
  $("#year").textContent = new Date().getFullYear();

  // ---------- Navbar background + back-to-top ----------
  const nav = $("#nav");
  const toTop = $("#toTop");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
    toTop.classList.toggle("show", window.scrollY > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ---------- Mobile menu ----------
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
  });
  $$("a", links).forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  // ---------- Reveal on scroll ----------
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    revealObs.observe(el);
  });

  // ---------- Active nav link while scrolling ----------
  const navMap = new Map($$("a", links).map(a => [a.getAttribute("href").slice(1), a]));
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && navMap.has(e.target.id)) {
        navMap.forEach(a => a.classList.remove("active"));
        navMap.get(e.target.id).classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach(s => sectionObs.observe(s));

  // ---------- Display mode tabs (auto-rotate until clicked) ----------
  const tabs = $$(".modes__tabs button");
  const modes = $$(".mode");
  let current = 0, timer;
  const show = (i) => {
    current = i;
    tabs.forEach((t, n) => { t.classList.toggle("active", n === i); t.setAttribute("aria-selected", n === i); });
    modes.forEach((m, n) => m.classList.toggle("active", n === i));
  };
  tabs.forEach((t, i) => t.addEventListener("click", () => { clearInterval(timer); show(i); }));
  timer = setInterval(() => show((current + 1) % modes.length), 4500);

  // ---------- Counters ----------
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count;
      let n = 0;
      const step = () => { n++; el.textContent = n; if (n < end) setTimeout(step, 120); };
      step();
      countObs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach(el => countObs.observe(el));

  // ---------- Lightbox ----------
  const lb = $("#lightbox");
  const lbImg = $("img", lb);
  const lbCap = $(".lightbox__cap", lb);
  $$("[data-lightbox]").forEach(fig => fig.addEventListener("click", () => {
    const img = $("img", fig);
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = $("figcaption", fig)?.textContent || img.alt;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
  }));
  const closeLb = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
  lb.addEventListener("click", e => { if (e.target !== lbImg) closeLb(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });

  // ---------- Pre-order form (static site: no backend) ----------
  const form = $("#preorderForm");
  const msg = $("#formMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      msg.textContent = "Please enter a valid email address.";
      msg.className = "form-msg err";
      return;
    }
    msg.textContent = "You're on the list! We'll email you when pre-orders open. ∞";
    msg.className = "form-msg ok";
    form.reset();
  });
})();
