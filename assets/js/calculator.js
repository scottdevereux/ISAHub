(function () {
  "use strict";

  var ACCOUNTS = {
    "easy-access": { label: "Easy Access ISA", rate: 4.10 },
    "fixed-1": { label: "1 Year Fixed Rate ISA", rate: 4.35 },
    "fixed-2": { label: "2 Year Fixed Rate ISA", rate: 4.20 },
    "fixed-3": { label: "3 Year Fixed Rate ISA", rate: 4.05 },
    "junior": { label: "Junior Cash ISA", rate: 4.50 }
  };

  var accountEl = document.getElementById("calc-account");
  var depositEl = document.getElementById("calc-deposit");
  var monthlyEl = document.getElementById("calc-monthly");
  var rateEl = document.getElementById("calc-rate");
  var yearsEl = document.getElementById("calc-years");
  var yearsOutEl = document.getElementById("calc-years-out");
  var form = document.getElementById("calculator-form");

  var balanceOut = document.getElementById("result-balance");
  var contributionsOut = document.getElementById("result-contributions");
  var interestOut = document.getElementById("result-interest");
  var taxSavedOut = document.getElementById("result-tax-saved");

  if (!form) return;

  function currency(value) {
    return "£" + value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function clampNumber(value, min, max) {
    if (isNaN(value)) return min;
    return Math.min(Math.max(value, min), max);
  }

  function onAccountChange() {
    var chosen = ACCOUNTS[accountEl.value];
    if (chosen) {
      rateEl.value = chosen.rate.toFixed(2);
    }
    var isFixed = accountEl.value.indexOf("fixed") === 0;
    monthlyEl.disabled = isFixed;
    if (isFixed) monthlyEl.value = 0;
    calculate();
  }

  function calculate() {
    var deposit = clampNumber(parseFloat(depositEl.value), 0, 1000000);
    var monthly = clampNumber(parseFloat(monthlyEl.value), 0, 20000);
    var ratePct = clampNumber(parseFloat(rateEl.value), 0, 15);
    var years = clampNumber(parseInt(yearsEl.value, 10), 1, 10);

    yearsOutEl.textContent = years + (years === 1 ? " year" : " years");

    var monthlyRate = ratePct / 100 / 12;
    var months = years * 12;
    var balance = deposit;
    var totalContributions = deposit;

    for (var m = 0; m < months; m++) {
      balance += monthly;
      totalContributions += monthly;
      balance *= (1 + monthlyRate);
    }

    var interestEarned = balance - totalContributions;
    var illustrativeTaxSaved = interestEarned * 0.20;

    balanceOut.textContent = currency(balance);
    contributionsOut.textContent = currency(totalContributions);
    interestOut.textContent = currency(interestEarned);
    taxSavedOut.textContent = currency(illustrativeTaxSaved);
  }

  accountEl.addEventListener("change", onAccountChange);
  [depositEl, monthlyEl, rateEl, yearsEl].forEach(function (el) {
    el.addEventListener("input", calculate);
  });
  form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });

  onAccountChange();
})();
