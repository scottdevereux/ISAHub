(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  var dropdown = document.querySelector(".nav-item-dropdown");
  var dropdownTrigger = dropdown ? dropdown.querySelector(":scope > a") : null;

  function closeMobileNav() {
    if (navLinks) navLinks.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (dropdown) dropdown.classList.remove("is-open");
    if (dropdownTrigger) dropdownTrigger.setAttribute("aria-expanded", "false");
  }

  // Mobile nav toggle
  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (!isOpen) {
        if (dropdown) dropdown.classList.remove("is-open");
        if (dropdownTrigger) dropdownTrigger.setAttribute("aria-expanded", "false");
      }
    });

    // Any real navigation link closes the mobile menu — but not the dropdown
    // trigger itself, which only expands/collapses its submenu (handled below).
    navLinks.querySelectorAll("a").forEach(function (link) {
      if (link === dropdownTrigger) return;
      link.addEventListener("click", function () {
        closeMobileNav();
      });
    });
  }

  // Dropdown nav item — tap to expand on mobile/touch
  if (dropdown && dropdownTrigger) {
    dropdownTrigger.setAttribute("aria-expanded", "false");
    dropdownTrigger.addEventListener("click", function (e) {
      if (window.matchMedia("(max-width: 1180px)").matches) {
        e.preventDefault();
        var isOpen = dropdown.classList.toggle("is-open");
        dropdownTrigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }
    });
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
