//alert('JS connecté !');

// Initialise la carte centrée sur des coordonnées précises
var map = L.map('map').setView([48.8566,2.3522], 13);
// Ajoute une couche de tuiles OpenStreetMap à la carte
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Ajoute un marqueur à la carte
var marker = L.marker([48.8566,2.3522]).addTo(map)
// Ajoute une popup au marqueur
marker.bindPopup("<b>Bonjour Paris!</b>").openPopup();

// Affiche un cercle sur la carte
var circle = L.circle([48.85,2.34], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

// Ajoute une polygon sur la carte
var polygon = L.polygon([
    [48.823,2.35],
    [48.85,2.38],
    [48.85,2.34]
]).addTo(map);

// Ajoute une popup au marqueur pour afficher un message lors du clic
/*function onMapCLick(event) {
    alert("Vous avez cliqué sur la carte aux coordonnées" + event.latlng);
}
map.on('click', onMapCLick);*/

// Ajoute une popup au marqueur pour afficher un message lors du clic
let popup = L.popup();
function onMapClick(event) {
    popup
        .setLatLng(event.latlng)
        .setContent("Vous avez cliqué sur la carte aux coordonnées " + event.latlng.toString())
        .openOn(map);
}
map.on('click', onMapClick);

// Personnaliser un marqueur
let customIcon = L.icon({
    iconUrl: '/images/makima.png',
    iconSize: [40, 60], // taille de l'icône
    iconAnchor: [20, 40], // point de l'icône qui correspondra à la position du marqueur
    popupAnchor: [0, -40] // point depuis lequel la popup doit s'ouvrir par rapport à l'icône
});
L.marker([48.86, 2.29], {icon: customIcon})
.addTo(map)
.bindPopup("Un marqueur personnalisé avec une image !")
.openPopup;