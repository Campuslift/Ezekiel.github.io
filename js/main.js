"use strict";

// If a photo is missing, show its drawing instead
var photos = document.querySelectorAll("img[data-fallback]");
for (var i = 0; i < photos.length; i++) {
  useDrawingIfMissing(photos[i]);
}

function useDrawingIfMissing(img) {
  function swap() {
    img.src = img.getAttribute("data-fallback");
    img.removeAttribute("data-fallback");
  }
  img.addEventListener("error", swap);
  // the error may have already happened before this script ran
  if (img.complete && img.naturalWidth === 0) {
    swap();
  }
}

// Fare calculator (these numbers are just for the demo)
var BASE_FARE = 5;
var RATE_PER_KM = 2.5;

var fareForm = document.getElementById("fareForm");
var kmInput = document.getElementById("km");

function showFare() {
  var km = parseFloat(kmInput.value);
  var passengers = parseInt(document.getElementById("pax").value, 10);
  var output = document.getElementById("fareOut");

  if (!(km > 0) || !(passengers >= 1)) {
    output.textContent = "Enter a distance above 0 km and 1 or more passengers.";
    return;
  }

  var total = BASE_FARE + km * RATE_PER_KM;
  var each = total / passengers;
  output.innerHTML =
    "Total TT$" +
    total.toFixed(2) +
    ' &middot; <span class="fare">TT$' +
    each.toFixed(2) +
    "</span> each";
}

if (fareForm) {
  fareForm.addEventListener("submit", function (event) {
    event.preventDefault();
    showFare();
  });
}

// Contact form checks
var contactForm = document.getElementById("contactForm");

var rules = {
  name: /^[A-Za-z][A-Za-z '.-]{1,49}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  address: /^.{8,120}$/,
  tel: /^\+?[0-9\s()-]{7,16}$/,
  message: /^[\s\S]{10,1000}$/,
};

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var allGood = true;

    for (var field in rules) {
      var input = contactForm.elements[field];
      var good = rules[field].test(input.value.trim());
      input.classList.toggle("is-invalid", !good);
      input.classList.toggle("is-valid", good);
      if (!good) {
        allGood = false;
      }
    }

    if (!allGood) {
      return;
    }

    var sendBtn = document.getElementById("sendBtn");
    var sent = document.getElementById("sent");
    var sendError = document.getElementById("sendError");
    sent.classList.add("d-none");
    sendError.classList.add("d-none");
    sendBtn.disabled = true;

    // Send the checked form to Formspree
    fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Send failed");
        }
        sent.classList.remove("d-none");
        contactForm.reset();
        var ticks = contactForm.querySelectorAll(".is-valid");
        for (var j = 0; j < ticks.length; j++) {
          ticks[j].classList.remove("is-valid");
        }
      })
      .catch(function () {
        sendError.classList.remove("d-none");
      })
      .then(function () {
        sendBtn.disabled = false;
      });
  });
}

// Fill in the boxes if they came from the home page card
var params = new URLSearchParams(window.location.search);
var fromBox = document.getElementById("from");
var toBox = document.getElementById("to");

if (fromBox && params.get("from")) {
  fromBox.value = params.get("from");
}
if (toBox && params.get("to")) {
  toBox.value = params.get("to");
}
