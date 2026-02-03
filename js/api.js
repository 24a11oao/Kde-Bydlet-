// api.js - Functions for API communication

async function fetchListings() {
  try {
    // Try same-origin API first (for hosted deployments). If not available,
    // fall back to a built-in static dataset so the frontend works standalone.
    const response = await fetch('/api/listings');
    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    // Fallback dataset (mirrors backend/data/listings.json) so frontend works without a backend.
    return [
      {
        "id": 1,
        "title": "Studentské koleje v Praze",
        "city": "Praha",
        "rent": 6000,
        "latitude": 50.0755,
        "longitude": 14.4378,
        "photos": ["assets/images/praha1.jpg", "assets/images/praha2.jpg", "assets/images/praha3.jpg"],
        "infoPhoto": "assets/images/praha1.jpg"
      },
      {
        "id": 2,
        "title": "Sdílený pokoj v Brně",
        "city": "Brno",
        "rent": 7000,
        "latitude": 49.1951,
        "longitude": 16.6084,
        "photos": ["assets/images/jednabrno.jpeg", "assets/images/brno2.jpg", "assets/images/brno3.jpg"],
        "infoPhoto": "assets/images/jednabrno.jpeg"
      },
      {
        "id": 3,
        "title": "Byt v Ostravě",
        "city": "Ostrava",
        "rent": 8000,
        "latitude": 49.8209,
        "longitude": 18.2625,
        "photos": ["assets/images/interior1.JPG", "assets/images/interior2.JPG"],
        "infoPhoto": "assets/images/info.JPG"
      },
      {
        "id": 4,
        "title": "Studentský pokoj v Plzni",
        "city": "Plzeň",
        "rent": 6500,
        "latitude": 49.7384,
        "longitude": 13.3736,
        "photos": ["assets/images/plzen1.jfif", "assets/images/plzen2.jpg", "assets/images/plzen3.jfif"],
        "infoPhoto": "assets/images/plzen1.jfif"
      }
    ];
  }
}