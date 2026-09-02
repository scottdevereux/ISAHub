(function () {
  "use strict";

  var form = document.getElementById("apply-form");
  if (!form) return;

  var MAX_PEOPLE = 3;

  /* ---------- Prefill account type from ?account= ---------- */
  var accountSelect = document.getElementById("account_type");
  var params = new URLSearchParams(window.location.search);
  var prefillAccount = params.get("account");
  if (prefillAccount && accountSelect.querySelector('option[value="' + prefillAccount + '"]')) {
    accountSelect.value = prefillAccount;
  }

  /* ---------- Deposit min/max, driven by chosen account ---------- */
  var depositInput = document.getElementById("initial_deposit");
  var depositHint = document.getElementById("deposit-hint");
  var depositErrorMsg = document.getElementById("deposit-error-msg");

  function currency(n) {
    return "£" + Number(n).toLocaleString("en-GB");
  }

  function updateDepositRange() {
    var opt = accountSelect.options[accountSelect.selectedIndex];
    var min = opt ? parseFloat(opt.getAttribute("data-min")) : null;
    var max = opt ? parseFloat(opt.getAttribute("data-max")) : null;
    if (min != null && !isNaN(min)) {
      depositInput.min = min;
      depositInput.max = max;
      depositHint.textContent = "This account accepts deposits from " + currency(min) + " up to " + currency(max) + ".";
      depositErrorMsg.textContent = "Please enter an amount between " + currency(min) + " and " + currency(max) + ".";
    } else {
      depositInput.removeAttribute("min");
      depositInput.removeAttribute("max");
      depositHint.textContent = "Choose an account above to see its minimum and maximum deposit.";
    }
  }
  accountSelect.addEventListener("change", updateDepositRange);
  updateDepositRange();

  /* ---------- Correspondence address toggle ---------- */
  // Hidden conditional fields are disabled, not just visually hidden — a
  // disabled control is excluded from FormData, so stale answers from a
  // path the applicant backed out of (e.g. switched business type after
  // partly filling Section A) never get submitted alongside their real
  // answers.
  function setContainerDisabled(container, disabled) {
    container.querySelectorAll("input, select, textarea").forEach(function (el) {
      el.disabled = disabled;
    });
  }

  var correspondenceSame = document.getElementById("correspondence_same");
  var correspondenceFields = document.getElementById("correspondence-fields");
  var correspondenceInput = document.getElementById("org_correspondence_address");
  function updateCorrespondence() {
    var same = correspondenceSame.checked;
    correspondenceFields.classList.toggle("hidden-section", same);
    setContainerDisabled(correspondenceFields, same);
    if (same) {
      correspondenceInput.removeAttribute("required");
    } else {
      correspondenceInput.setAttribute("required", "required");
    }
  }
  correspondenceSame.addEventListener("change", updateCorrespondence);
  updateCorrespondence();

  /* ---------- Tax residency "No" notes ---------- */
  function wireTaxNote(radioName, noteId) {
    var note = document.getElementById(noteId);
    document.querySelectorAll('input[name="' + radioName + '"]').forEach(function (r) {
      r.addEventListener("change", function () {
        note.classList.toggle("hidden-section", r.value !== "no" || !r.checked);
      });
    });
  }
  wireTaxNote("applicant_uk_tax_resident", "applicant-tax-note");
  wireTaxNote("org_uk_tax_resident", "org-tax-note");

  /* ---------- Client money conditional fields ---------- */
  var clientMoneyNote = document.getElementById("client-money-note");
  document.querySelectorAll('input[name="holds_client_money"]').forEach(function (r) {
    r.addEventListener("change", function () {
      var isYes = document.querySelector('input[name="holds_client_money"]:checked').value === "yes";
      clientMoneyNote.classList.toggle("hidden-section", !isYes);
      setContainerDisabled(clientMoneyNote, !isYes);
    });
  });

  /* ---------- Exclusion warning ---------- */
  var exclusionWarning = document.getElementById("exclusion-warning");
  document.querySelectorAll('input[name="exclusion"]').forEach(function (cb) {
    cb.addEventListener("change", function () {
      var anyChecked = Array.prototype.some.call(document.querySelectorAll('input[name="exclusion"]'), function (c) { return c.checked; });
      exclusionWarning.classList.toggle("hidden-section", !anyChecked);
    });
  });

  /* ---------- Org structure "Other" text field ---------- */
  var orgStructureOtherInput = document.getElementById("org_structure_a_other");
  function syncOrgStructureOther() {
    var checked = document.querySelector('input[name="org_structure_a"]:checked');
    var show = !!checked && checked.value === "other";
    orgStructureOtherInput.classList.toggle("hidden-section", !show);
    orgStructureOtherInput.disabled = !show;
  }
  document.querySelectorAll('input[name="org_structure_a"]').forEach(function (r) {
    r.addEventListener("change", syncOrgStructureOther);
  });

  /* ---------- Business type routing (Section A / B / C, charity, windfalls, type notes) ---------- */
  var businessTypeSelect = document.getElementById("business_type");
  var charityStructureField = document.getElementById("charity-structure-field");
  var typeNote = document.getElementById("type-note");
  var typeNoteText = document.getElementById("type-note-text");
  var windfallsField = document.getElementById("windfalls-field");
  var sectionA = document.getElementById("section-a");
  var sectionB = document.getElementById("section-b");
  var sectionC = document.getElementById("section-c");

  var TYPE_NOTES = {
    "trust-pension": "Trusts and pension schemes aren't fully covered by our standard sections below — please complete the closest matching fields, and our business team will contact you about any extra documents needed, such as a trust deed or scheme rules.",
    "credit-union": "Credit unions and cooperatives aren't fully covered by our standard sections below — please complete the closest matching fields, and our business team will contact you about any extra documents needed, such as your society registration."
  };

  var SECTION_HEADINGS = {
    a: "Organisation details — Limited Company / Incorporated Charity",
    b: "Organisation details — Club, Society or Unincorporated Charity",
    c: "Organisation details — Sole Trader, Partnership or Incorporated Association"
  };

  function showSection(letter) {
    [["a", sectionA], ["b", sectionB], ["c", sectionC]].forEach(function (pair) {
      var isMatch = pair[0] === letter;
      pair[1].classList.toggle("hidden-section", !isMatch);
      setContainerDisabled(pair[1], !isMatch);
    });
    // Re-sync the nested "Other" text field's disabled state against its
    // radio group — the blanket enable above would otherwise re-enable it
    // even when "Other" isn't the currently selected structure.
    if (letter === "a") syncOrgStructureOther();
  }

  function resolveRouting() {
    var type = businessTypeSelect.value;
    var opt = businessTypeSelect.options[businessTypeSelect.selectedIndex];
    var isCharity = type === "charity";
    charityStructureField.classList.toggle("hidden-section", !isCharity);
    setContainerDisabled(charityStructureField, !isCharity);
    document.querySelectorAll('input[name="charity_structure"]').forEach(function (r) {
      if (isCharity) {
        r.setAttribute("required", "required");
      } else {
        r.removeAttribute("required");
        r.checked = false;
      }
    });

    var letter = null;
    if (isCharity) {
      var chosenStructure = document.querySelector('input[name="charity_structure"]:checked');
      if (chosenStructure) {
        letter = chosenStructure.value === "incorporated" ? "a" : "b";
      }
    } else if (opt) {
      letter = opt.getAttribute("data-section");
    }

    if (letter && SECTION_HEADINGS[letter]) {
      showSection(letter);
      var headingEl = document.getElementById("section-" + letter + "-heading");
      if (headingEl) headingEl.textContent = SECTION_HEADINGS[letter];
    } else {
      showSection(null);
    }

    if (TYPE_NOTES[type]) {
      typeNoteText.textContent = TYPE_NOTES[type];
      typeNote.classList.remove("hidden-section");
    } else {
      typeNote.classList.add("hidden-section");
    }

    var showWindfalls = type === "sole-trader" || type === "partnership";
    windfallsField.classList.toggle("hidden-section", !showWindfalls);
    var windfallsCheckbox = document.getElementById("agree_windfalls");
    if (showWindfalls) {
      windfallsCheckbox.setAttribute("required", "required");
    } else {
      windfallsCheckbox.removeAttribute("required");
      windfallsCheckbox.checked = false;
    }
  }

  businessTypeSelect.addEventListener("change", resolveRouting);
  document.querySelectorAll('input[name="charity_structure"]').forEach(function (r) {
    r.addEventListener("change", resolveRouting);
  });
  showSection(null);

  /* ---------- Repeatable controlling individuals (up to 3) ---------- */
  var peopleList = document.getElementById("people-list");
  var addPersonBtn = document.getElementById("add-person");
  var personTemplate = document.getElementById("person-template");
  var personCount = 0;

  var PERSON_LABELS = ["First controlling individual", "Second controlling individual", "Third controlling individual"];

  function addPerson() {
    if (personCount >= MAX_PEOPLE) return;
    personCount++;
    var index = personCount;
    var node = personTemplate.content.cloneNode(true);
    var card = node.querySelector(".person-card");
    card.dataset.person = index;
    card.querySelector(".person-card-head h3").textContent = PERSON_LABELS[index - 1] + (index === 1 ? " (required)" : " (optional)");
    card.querySelectorAll("[data-field]").forEach(function (el) {
      var field = el.getAttribute("data-field");
      var name = "person_" + index + "_" + field;
      el.setAttribute("name", name);
      el.id = name;
      if (index === 1 && (field === "full_name")) {
        el.setAttribute("required", "required");
      }
    });
    card.querySelectorAll("label").forEach(function (label) {
      var input = label.querySelector("[data-field]");
      if (input && !label.classList.contains("radio-option")) {
        label.setAttribute("for", input.id);
      }
    });
    var removeBtn = card.querySelector(".btn-remove-person");
    if (index === 1) {
      removeBtn.style.display = "none";
    } else {
      removeBtn.addEventListener("click", function () {
        card.remove();
        personCount--;
        renumberPeople();
        addPersonBtn.classList.remove("hidden-section");
      });
    }
    peopleList.appendChild(card);
    if (personCount >= MAX_PEOPLE) {
      addPersonBtn.classList.add("hidden-section");
    }
  }

  function renumberPeople() {
    var cards = peopleList.querySelectorAll(".person-card");
    personCount = cards.length;
    cards.forEach(function (card, i) {
      var index = i + 1;
      card.dataset.person = index;
      card.querySelector(".person-card-head h3").textContent = PERSON_LABELS[index - 1] + (index === 1 ? " (required)" : " (optional)");
      card.querySelectorAll("[data-field]").forEach(function (el) {
        var field = el.getAttribute("data-field");
        var name = "person_" + index + "_" + field;
        el.setAttribute("name", name);
        el.id = name;
      });
    });
  }

  addPersonBtn.addEventListener("click", addPerson);
  addPerson(); // first controlling individual is always present

  /* ---------- Radio / checkbox "is-checked" visual state ---------- */
  document.addEventListener("change", function (e) {
    var target = e.target;
    if (target.matches('.radio-option input, .checkbox-option input')) {
      var wrapper = target.closest(".option-grid") || target.closest(".form-grid") || document;
      if (target.type === "radio") {
        wrapper.querySelectorAll('input[name="' + target.name + '"]').forEach(function (r) {
          r.closest(".radio-option").classList.toggle("is-checked", r.checked);
        });
      } else {
        target.closest(".checkbox-option").classList.toggle("is-checked", target.checked);
      }
    }
  });

  /* ---------- Sort code auto-format ---------- */
  var sortCodeInput = document.getElementById("bank_sort_code");
  sortCodeInput.addEventListener("input", function () {
    var digits = sortCodeInput.value.replace(/\D/g, "").slice(0, 6);
    var formatted = digits.replace(/(\d{2})(?=\d)/g, "$1-");
    sortCodeInput.value = formatted;
  });

  /* ---------- reCAPTCHA gating ---------- */
  var submitBtn = document.getElementById("submit-btn");
  var recaptchaVerified = false;
  var recaptchaErrorMsg = document.getElementById("recaptcha-error-msg");

  window.onRecaptchaVerified = function () {
    recaptchaVerified = true;
    recaptchaErrorMsg.parentElement.classList.remove("has-error");
  };
  window.onRecaptchaExpired = function () {
    recaptchaVerified = false;
  };

  /* ---------- Validation ---------- */
  function fieldWrapper(el) {
    return el.closest(".field") || el.closest(".person-card") || el.parentElement;
  }

  function markInvalid(el, invalid) {
    var wrapper = fieldWrapper(el);
    if (wrapper) wrapper.classList.toggle("has-error", invalid);
  }

  function validateForm() {
    var firstInvalid = null;
    var valid = true;

    // Standard required fields (visible, not inside a hidden-section ancestor)
    form.querySelectorAll("[required]").forEach(function (el) {
      if (el.closest(".hidden-section")) return;
      var wrapper = fieldWrapper(el);
      var ok = true;

      if (el.type === "radio") {
        var name = el.name;
        if (form.querySelectorAll('input[name="' + name + '"]:checked').length === 0) ok = false;
      } else if (el.type === "checkbox") {
        ok = el.checked;
      } else {
        ok = el.value.trim() !== "";
      }

      if (el.name === "bank_sort_code" && ok) {
        ok = /^\d{2}-\d{2}-\d{2}$/.test(el.value.trim());
      }
      if (el.name === "bank_account_number" && ok) {
        ok = /^\d{6,8}$/.test(el.value.trim());
      }
      if (el.id === "initial_deposit" && ok) {
        var v = parseFloat(el.value);
        var min = parseFloat(el.min);
        var max = parseFloat(el.max);
        if (!isNaN(min) && (v < min || (!isNaN(max) && v > max))) ok = false;
      }

      markInvalid(el, !ok);
      if (!ok) {
        valid = false;
        if (!firstInvalid) firstInvalid = wrapper;
      }
    });

    if (!recaptchaVerified) {
      valid = false;
      var recaptchaField = recaptchaErrorMsg.parentElement;
      recaptchaField.classList.add("has-error");
      if (!firstInvalid) firstInvalid = recaptchaField;
    }

    return { valid: valid, firstInvalid: firstInvalid };
  }

  /* ---------- Progress sidebar ---------- */
  var progressItems = document.querySelectorAll("#progress-list li");
  var sectionEls = Array.prototype.map.call(progressItems, function (li) {
    return document.getElementById(li.getAttribute("data-target"));
  });

  function updateProgressActive() {
    var scrollPos = window.scrollY + 140;
    var activeIndex = 0;
    sectionEls.forEach(function (el, i) {
      if (el && el.offsetTop <= scrollPos) activeIndex = i;
    });
    progressItems.forEach(function (li, i) {
      li.classList.toggle("is-active", i === activeIndex);
    });
  }
  window.addEventListener("scroll", updateProgressActive, { passive: true });
  updateProgressActive();

  /* ---------- Submit ---------- */
  var successBanner = document.getElementById("form-success");
  var errorBanner = document.getElementById("form-error");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorBanner.classList.add("hidden-section");

    var result = validateForm();
    if (!result.valid) {
      if (result.firstInvalid) {
        result.firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    var formData = new FormData(form);

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          form.classList.add("hidden-section");
          successBanner.classList.remove("hidden-section");
          successBanner.focus();
          successBanner.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          throw new Error(data.message || "Submission failed");
        }
      })
      .catch(function () {
        errorBanner.classList.remove("hidden-section");
        errorBanner.scrollIntoView({ behavior: "smooth", block: "center" });
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit application";
      });
  });
})();
