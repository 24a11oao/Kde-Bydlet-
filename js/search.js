// search.js - Search and filter functionality

let allListings = [];
let filteredListings = [];
let suggestions = [];
let activeSuggestion = -1;

document.addEventListener('DOMContentLoaded', async () => {
  allListings = await fetchListings();
  filteredListings = [...allListings];
  buildSuggestions();
  renderListings(filteredListings);
  updateMap(filteredListings);
});

// Keywords used to pick out the user's featured offers (e.g. "Ostravska kolej")
const featuredKeywords = ['ostrav', 'kolej', 'koleje', 'ostravska'];

function isFeatured(listing) {
  const hay = normalize((listing.title || '') + ' ' + (listing.city || ''));
  return featuredKeywords.some(k => hay.includes(k));
}

// When the nav link to #search is clicked, show featured offers and animate
document.querySelectorAll('a[href="#search"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    // allow default anchor navigation/scroll, then show featured listings and animate
    setTimeout(() => {
      filteredListings = allListings.filter(isFeatured);
      // clear the search input so user sees featured results
      if (searchInput) searchInput.value = '';
      renderListings(filteredListings);
      updateMap(filteredListings);
      animateListings();
    }, 180);
  });
});

const searchInput = document.getElementById('searchInput');
// create suggestions container
const suggestionsRoot = document.createElement('div');
suggestionsRoot.id = 'searchSuggestions';
suggestionsRoot.className = 'relative';
searchInput.parentNode.appendChild(suggestionsRoot);

searchInput.addEventListener('input', (e) => {
  const query = e.target.value;
  const nq = normalize(query);
  if (!nq) {
    filteredListings = [...allListings];
  } else {
    const tokens = nq.split(/\s+/).filter(Boolean);
    filteredListings = allListings.filter(listing => {
      const title = normalize(listing.title || '');
      const city = normalize(listing.city || '');
      const hay = (title + ' ' + city).split(/\s+/).filter(Boolean);
      return tokens.every(token => hay.some(w => w.includes(token) || token.includes(w)));
    });
  }
  renderListings(filteredListings);
  updateMap(filteredListings);
  showSuggestions(nq);
});

searchInput.addEventListener('focus', () => showSuggestions(''));
searchInput.addEventListener('blur', () => setTimeout(hideSuggestions, 180));
searchInput.addEventListener('keydown', (e) => {
  const list = document.querySelectorAll('#searchSuggestions .suggestion-item');
  if (!list.length) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault(); activeSuggestion = Math.min(activeSuggestion + 1, list.length - 1);
    updateSuggestionHighlight(list);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault(); activeSuggestion = Math.max(activeSuggestion - 1, 0);
    updateSuggestionHighlight(list);
  } else if (e.key === 'Enter') {
    if (activeSuggestion >= 0) {
      e.preventDefault(); selectSuggestion(list[activeSuggestion].dataset.value);
    }
  }
});

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s]/g, '');
}

function renderListings(listings) {
  const listingsContainer = document.getElementById('listings');
  listingsContainer.innerHTML = '';

  listings.forEach(listing => {
    const card = document.createElement('div');
    card.className = 'listing-card bg-white p-6 rounded-lg shadow-md';
    // determine thumbnail: first photo, otherwise infoPhoto
    const thumb = (listing.photos && listing.photos.length > 0) ? listing.photos[0] : (listing.infoPhoto || '');

    card.innerHTML = `
      ${thumb ? `<img src="${thumb}" alt="${listing.title}" class="w-full h-40 object-cover rounded-lg mb-4" onerror="handleImageError(this)" data-src="${thumb}"/>` : `<div class=\"w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400\">Žádný obrázek</div>`}
      <h4 class="text-xl font-semibold mb-2">${listing.title}</h4>
      <p class="text-gray-600 mb-2">${listing.city}</p>
      <p class="text-2xl font-bold text-blue-600">${listing.rent} Kč/měsíc</p>
    `;
    // add view button / gallery trigger
    const footer = document.createElement('div');
    footer.className = 'mt-4';
    const viewBtn = document.createElement('button');
    viewBtn.className = 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700';
    viewBtn.textContent = 'Zobrazit nabídku';
    viewBtn.addEventListener('click', () => showGallery(listing));
    footer.appendChild(viewBtn);
    card.appendChild(footer);
    listingsContainer.appendChild(card);
  });
}

function animateListings() {
  const listingsContainer = document.getElementById('listings');
  // ensure there are listings rendered
  if (!listingsContainer) return;
  if (listingsContainer.children.length === 0) {
    renderListings(filteredListings);
  }
  listingsContainer.classList.add('listings-animate');
  Array.from(listingsContainer.children).forEach((card, i) => {
    card.classList.remove('show');
    card.style.transitionDelay = `${i * 60}ms`;
    // force reflow then add show class to trigger transition
    void card.offsetWidth;
    card.classList.add('show');
  });
}

function buildSuggestions() {
  const set = new Set();
  allListings.forEach(l => {
    if (l.title) set.add(l.title);
    if (l.city) set.add(l.city);
  });
  // Add featured terms explicitly
  ['Ostravska kolej', 'Kolej', 'Studentské kolej'].forEach(s => set.add(s));
  suggestions = Array.from(set);
}

function showSuggestions(nq) {
  const root = document.getElementById('searchSuggestions');
  if (!root) return;
  root.innerHTML = '';
  const ul = document.createElement('div');
  ul.className = 'absolute left-0 right-0 mt-2 bg-white border rounded shadow max-h-64 overflow-auto z-50';
  const q = (nq || '').toLowerCase();
  const items = suggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 8);
  items.forEach((s, i) => {
    const item = document.createElement('div');
    item.className = 'suggestion-item px-4 py-2 hover:bg-gray-100 cursor-pointer';
    item.textContent = s;
    item.dataset.value = s;
    item.addEventListener('mousedown', (ev) => { ev.preventDefault(); selectSuggestion(s); });
    ul.appendChild(item);
  });
  if (items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'px-4 py-2 text-gray-500';
    empty.textContent = 'Žádné návrhy';
    ul.appendChild(empty);
  }
  root.appendChild(ul);
  activeSuggestion = -1;
}

function hideSuggestions() {
  const root = document.getElementById('searchSuggestions');
  if (root) root.innerHTML = '';
  activeSuggestion = -1;
}

function updateSuggestionHighlight(list) {
  list.forEach((el, idx) => el.classList.toggle('bg-blue-50', idx === activeSuggestion));
}

function selectSuggestion(value) {
  searchInput.value = value;
  hideSuggestions();
  // trigger input handler
  searchInput.dispatchEvent(new Event('input'));
}

// Image error fallback: replace missing images with an inline SVG placeholder
function handleImageError(img) {
  if (img.dataset.errorHandled) {
    img.style.display = 'none';
    return;
  }
  img.dataset.errorHandled = '1';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-family='Arial, Helvetica, sans-serif' font-size='20'>Obrázek není k dispozici</text></svg>`;
  img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  img.classList.add('object-cover');
}

// Simple gallery modal for a listing's photos
function showGallery(listing) {
  const images = [];
  if (listing.photos && listing.photos.length) images.push(...listing.photos);
  if (listing.infoPhoto) images.push(listing.infoPhoto);
  if (images.length === 0) return alert('Žádné fotky k zobrazení.');

  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50';

  const box = document.createElement('div');
  box.className = 'bg-white rounded-lg overflow-hidden max-w-3xl w-full mx-4';

  // Top navigation bar with close button
  const topNav = document.createElement('div');
  topNav.className = 'flex items-center justify-end p-3 bg-gray-50';
  const close = document.createElement('button');
  close.textContent = 'Zavřít';
  close.className = 'bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600';
  close.addEventListener('click', () => document.body.removeChild(overlay));
  topNav.appendChild(close);

  // Image container with side navigation and centered title
  const imgContainer = document.createElement('div');
  imgContainer.className = 'relative flex flex-col items-center justify-center bg-gray-100 py-8';

  let idx = 0;
  const img = document.createElement('img');
  img.src = images[idx];
  img.className = 'h-80 object-contain';
  img.onerror = function() { handleImageError(this); };

  const title = document.createElement('div');
  title.className = 'text-lg font-medium mt-4';
  title.textContent = listing.title || '';

  const prev = document.createElement('button');
  prev.textContent = '‹';
  prev.className = 'absolute left-4 text-5xl text-white bg-black bg-opacity-50 hover:bg-opacity-70 px-3 py-2 rounded';
  const next = document.createElement('button');
  next.textContent = '›';
  next.className = 'absolute right-4 text-5xl text-white bg-black bg-opacity-50 hover:bg-opacity-70 px-3 py-2 rounded';

  prev.addEventListener('click', () => { idx = (idx - 1 + images.length) % images.length; img.src = images[idx]; });
  next.addEventListener('click', () => { idx = (idx + 1) % images.length; img.src = images[idx]; });

  imgContainer.appendChild(prev);
  imgContainer.appendChild(img);
  imgContainer.appendChild(title);
  imgContainer.appendChild(next);

  box.appendChild(topNav);
  box.appendChild(imgContainer);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}