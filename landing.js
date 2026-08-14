/* ==========================================================================
   Netflix Clone — Landing Page Behavior
   ========================================================================== */
(function () {
  "use strict";

  // Nav background on scroll
  const nav = document.getElementById("landingNav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  });

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-question");
    btn.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((el) => el.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function wireEmailForm(formId, inputId, errorId) {
    const form = document.getElementById(formId);
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!isValidEmail(input.value)) {
        if (error) error.style.display = "block";
        input.style.borderColor = "#e87c03";
        return;
      }
      if (error) error.style.display = "none";
      sessionStorage.setItem("nf_email", input.value.trim());
      window.location.href = "browse.html";
    });

    input.addEventListener("input", () => {
      if (error) error.style.display = "none";
      input.style.borderColor = "#8c8c8c";
    });
  }

  wireEmailForm("emailForm", "emailInput", "emailError");
  wireEmailForm("emailForm2", "emailInput2", null);
})();
