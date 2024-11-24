// const socket = io();

// if (navigator.geolocation) {
//   navigator.geolocation.watchPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       socket.emit("send-location", { latitude, longitude });
//     },
//     (error) => {
//       console.error(error);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0,
//     }
//   );
// }

// const map = L.map("map").setView([0,0], 16);
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
//     attribution:"Kuldeep Sahoo"
// }).addTo(map)

// const markers = {}

// socket.on("receive-location", (data) => {
//     const { id, latitude, longitude } = data
//     map.setView([latitude, longitude])
//     if (markers[id]) {
//         markers[id].setLatLng([latitude, longitude])
//         markers[id].bindPopup(`User ID: ${id}`).openPopup();

//     } else {
//         markers[id] = L.marker([latitude, longitude])
//           .addTo(map)
//           .bindPopup(`User ID: ${id}`) // Add popup to new marker
//           .openPopup();
//     }
// })

// socket.on("user-disconnected", (id) => {
//     if (markers[id]) {
//         map.removeLayer(markers[id])
//         delete markers[id]
//     } else {
//         markers[id]=L.marker([latitude,longitude]).addTo(map)
//     }
// })

const socket = io();

// Prompt the user for their name when the page loads
const userName = prompt("Please enter your name:");

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Emit the user's location along with their name
      socket.emit("send-location", { userName, latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

// Initialize the map and set its view
const map = L.map("map").setView([0, 0], 16);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Kuldeep Sahoo",
}).addTo(map);

// Store markers for each user
const markers = {};

// Receive location updates
socket.on("receive-location", (data) => {
  const { userName, latitude, longitude } = data;

  // Center map on received location (optional)
  // map.setView([latitude, longitude]);

  if (markers[userName]) {
    // Update the existing marker's position and popup
    markers[userName].setLatLng([latitude, longitude]);
    markers[userName].bindPopup(`User: ${userName}`).openPopup();
  } else {
    // Create a new marker with a popup showing the name
    markers[userName] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`User: ${userName}`)
      .openPopup();
  }
});

// Handle user disconnection
socket.on("user-disconnected", (userName) => {
  if (markers[userName]) {
    // Remove the marker from the map and delete it from the markers object
    map.removeLayer(markers[userName]);
    delete markers[userName];
  }
});


