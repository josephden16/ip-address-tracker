let ipAddress = "192.212.147.101";
let geoData;
const ipify = "https://api.ipify.org?format=json";
const accessToken = "pk.eyJ1IjoiY3Nqb2UiLCJhIjoiY2tmY3IycGZ0MWlkejJycXNmMGNnMW56OCJ9.STWa3EjDrqaMyrKZ48_8Cg";

const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}.\d{1,3}$/;
let submit = document.getElementById("submit");
let ip = document.getElementById("ip");
let error = document.getElementById("error");

let address = document.getElementById("ipaddress");
let loc = document.getElementById("location");
let timezone = document.getElementById("timezone");
let isp = document.getElementById("isp");

var customIcon = L.icon({
  iconUrl: './images/icon-location.svg',
  iconSize: [48, 55], // size of the icon
  shadowSize: [50, 54], // size of the shadow
  iconAnchor: [32, 164], // point of the icon which will correspond to marker's location
});

window.onload = function () {
  fetch(ipify)
    .then(res => res.json())
    .then(jsonData => {
      ipAddress = jsonData.ip;
      fetch(`https://geo.ipify.org/api/v1?apiKey=at_YrnLi3sYW05B0xX0GhEgkhjUU2FKi&ipAddress=${ipAddress}`)
        .then(res => res.json())
        .then(jsonData => {
          geoData = jsonData;
          // Initialize the map and expose binding globally
          pos = [geoData.location.lat, geoData.location.lng];
          mymap = L.map('map').setView(pos, 13);
          L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: accessToken
          }).addTo(mymap);
          marker = L.marker(pos, { icon: customIcon }).addTo(mymap);
          lc = document.getElementsByClassName('leaflet-control-zoom');
          lc[0].style.visibility = 'hidden';
          isp.textContent = geoData.isp;
          timezone.textContent = `UTC${geoData.location.timezone}`;
          address.textContent = ipAddress;
          loc.textContent = `${geoData.location.city}, ${geoData.location.region}, ${geoData.location.country}`
        })
        .catch(function () {
          error.textContent = "Failed to Fetch";
          error.style.visibility = 'visible';
        })
    })
    .catch(function () {
      error.textContent = "Failed to Fetch";
      error.style.visibility = 'visible';
    })
}

// Submit event listener
submit.addEventListener("click", function () {
  if (!ipRegex.test(ip.value)) {
    error.style.visibility = 'visible';
    error.textContent = "Enter a valid IP Address";
    return;
  } else {
    error.style.visibility = 'hidden';
    ipAddress = ip.value;
    updateMap(ipAddress);
  }
});

// function to update the map based on the ip address passed
function updateMap(ip) {
  fetch(`https://geo.ipify.org/api/v1?apiKey=at_YrnLi3sYW05B0xX0GhEgkhjUU2FKi&ipAddress=${ip}`)
    .then(res => res.json())
    .then(jsonData => {
      geoData = jsonData;
      isp.textContent = geoData.isp;
      timezone.textContent = `UTC${geoData.location.timezone}`;
      loc.textContent = `${geoData.location.city}, ${geoData.location.region}, ${geoData.location.country}`
      address.textContent = ip;
      let pos = [geoData.location.lat, geoData.location.lng];
      mymap.setView(pos, 13);
      marker = L.marker(pos, { icon: customIcon }).addTo(mymap);
    })
    .catch(function () {
      error.textContent = "Failed to Fetch";
      error.style.visibility = 'visible';
    })
}
