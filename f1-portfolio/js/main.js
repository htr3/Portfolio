(function () {
  "use strict";

  // Sticky header shadow on scroll
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu toggle
  const toggle = document.querySelector(".menu-toggle");
  const mobile = document.getElementById("nav-mobile");
  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const open = mobile.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    mobile.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobile.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Scroll-reveal
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => obs.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Active nav link based on section in view
  const navLinks = Array.from(document.querySelectorAll(".nav-desktop a"));
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = "#" + e.target.id;
            navLinks.forEach((l) =>
              l.classList.toggle("is-active", l.getAttribute("href") === id)
            );
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
