// map.js - Map functionality using Leaflet

let map;
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
  initMap();
});

function initMap() {
  map = L.map('mapContainer').setView([49.8, 15.5], 7); // Center on Czech Republic

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
}

function updateMap(listings) {
  // Clear existing markers
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  // Add new markers
  listings.forEach(listing => {
    let popupContent = `<b>${listing.title}</b><br>${listing.rent} Kč/měsíc`;
    
    if (listing.photos && listing.photos.length > 0) {
      popupContent += '<br><div class="photo-gallery">';
      listing.photos.forEach(photo => {
        popupContent += `<img src="${photo}" alt="Interior" style="width: 100px; height: 75px; margin: 5px;">`;
      });
      popupContent += '</div>';
    }
    
    if (listing.infoPhoto) {
      popupContent += `<br><img src="${listing.infoPhoto}" alt="Info" style="width: 150px; height: 100px;">`;
    }
    
    const marker = L.marker([listing.latitude, listing.longitude])
      .addTo(map)
      .bindPopup(popupContent);
    markers.push(marker);
  });

  // Fit map to markers if there are any
  if (markers.length > 0) {
    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
}