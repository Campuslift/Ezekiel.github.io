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

    if (allGood) {
      document.getElementById("sent").classList.remove("d-none");
      contactForm.reset();
      var ticks = contactForm.querySelectorAll(".is-valid");
      for (var j = 0; j < ticks.length; j++) {
        ticks[j].classList.remove("is-valid");
      }
    }
  });
}

// Map on the Find a ride page
window.addEventListener("load", function () {
  var mapBox = document.getElementById("map");
  if (!mapBox || !window.L) {
    return;
  }

  // Some places with rough coordinates [latitude, longitude]
  var places = {
    "uwi st. augustine": [10.6425, -61.4],
    "utt valsayn": [10.6385, -61.4095],
    "usc maracas": [10.6845, -61.439],
    "port of spain": [10.6549, -61.5019],
    chaguanas: [10.5167, -61.4117],
    "san fernando": [10.2796, -61.4683],
    arima: [10.6372, -61.2825],
    "piarco airport": [10.5954, -61.3372],
  };

  var fromInput = document.getElementById("from");
  var toInput = document.getElementById("to");
  var pickupPin = null;
  var destinationPin = null;

  // Map tiles from CARTO (the OpenStreetMap ones were blocking the site)
  var map = L.map("map").setView([10.55, -61.35], 10);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    subdomains: "abcd",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }).addTo(map);

  // Straight line distance in km between two points
  function distanceKm(a, b) {
    return a.distanceTo(b) / 1000;
  }

  // Work out the distance and update the fare
  function updateDistance() {
    if (!pickupPin || !destinationPin) {
      return;
    }

    var a = pickupPin.getLatLng();
    var b = destinationPin.getLatLng();

    // roads are longer than a straight line, so add 30%
    var km = distanceKm(a, b) * 1.3;
    setDistance(km);

    // try to get the real road distance
    var url =
      "https://router.project-osrm.org/route/v1/driving/" +
      a.lng +
      "," +
      a.lat +
      ";" +
      b.lng +
      "," +
      b.lat +
      "?overview=false";

    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.routes && data.routes[0]) {
          setDistance(data.routes[0].distance / 1000);
        }
      })
      .catch(function () {
        // if it fails we keep the estimate
      });
  }

  function setDistance(km) {
    if (km < 1) {
      km = 1;
    }
    kmInput.value = km.toFixed(1);
    showFare();
  }

  function setPickup(latlng, label) {
    if (pickupPin) {
      pickupPin.setLatLng(latlng);
    } else {
      pickupPin = L.marker(latlng).addTo(map);
    }
    pickupPin.bindTooltip("Pickup").openTooltip();
    if (label) {
      fromInput.value = label;
    }
    map.panTo(latlng);
    updateDistance();
  }

  function setDestination(latlng, label) {
    if (destinationPin) {
      destinationPin.setLatLng(latlng);
    } else {
      destinationPin = L.marker(latlng, { draggable: true }).addTo(map);
      destinationPin.on("dragend", function () {
        toInput.value = showCoords(destinationPin.getLatLng());
        updateDistance();
      });
    }
    destinationPin.bindTooltip("Destination (drag me)").openTooltip();
    toInput.value = label || showCoords(latlng);
    updateDistance();
  }

  function showCoords(latlng) {
    return latlng.lat.toFixed(4) + ", " + latlng.lng.toFixed(4);
  }

  // If the typed name is one of our places, put a pin there
  function usePlaceName(name, setPin) {
    var spot = places[name.trim().toLowerCase()];
    if (spot) {
      setPin(L.latLng(spot[0], spot[1]), name.trim());
    }
  }

  // clicking the map sets the destination
  map.on("click", function (event) {
    setDestination(event.latlng);
  });

  fromInput.addEventListener("change", function () {
    usePlaceName(fromInput.value, setPickup);
  });

  toInput.addEventListener("change", function () {
    usePlaceName(toInput.value, setDestination);
  });

  // "Use my location" button
  document.getElementById("locate").addEventListener("click", function () {
    if (!navigator.geolocation) {
      fromInput.value = "Location not supported";
      return;
    }

    fromInput.value = "Finding you...";
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var here = L.latLng(position.coords.latitude, position.coords.longitude);
        setPickup(here, "My location");
      },
      function () {
        fromInput.value = "";
        fromInput.placeholder = "Location blocked, type a place instead";
      },
      { timeout: 8000 },
    );
  });

  // fill in the boxes if they came from the home page card
  var params = new URLSearchParams(window.location.search);
  var fromValue = params.get("from");
  var toValue = params.get("to");

  if (fromValue) {
    fromInput.value = fromValue;
    usePlaceName(fromValue, setPickup);
  }
  if (toValue) {
    toInput.value = toValue;
    usePlaceName(toValue, setDestination);
  }
});
