// --- Initialisation de la carte centrée sur Paris ---
var map = L.map('maMap').setView([48.8566, 2.3522], 13);

// Ajoute la couche OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// --- Données des brocantes avec catégories ---
const brocantes = [
  {
    nom: "Marché aux Puces de Saint-Ouen (Porte de Clignancourt)",
    coords: [48.9022, 2.3445],
    categorie: "Marché aux Puces"
  },
  {
    nom: "Marché aux Puces de la Porte de Vanves",
    coords: [48.8266, 2.3136],
    categorie: "Marché aux Puces"
  },
  {
    nom: "Marché aux Puces de Montreuil",
    coords: [48.8631, 2.4196],
    categorie: "Marché aux Puces"
  },
  {
    nom: "Marché d'Aligre",
    coords: [48.8492, 2.3808],
    categorie: "Marché Alimentaire"
  },
  {
    nom: "Brocante de la Place de la République",
    coords: [48.8670, 2.3630],
    categorie: "Brocante"
  }
];

// --- Affichage des marqueurs et du polygone ---
let marqueursBrocantes = [];

// Affiche les marqueurs selon la catégorie sélectionnée
function afficherMarqueurs(categorie) {
  marqueursBrocantes.forEach(m => map.removeLayer(m));
  marqueursBrocantes = [];
  const brocantesFiltrees = categorie === "toutes"
    ? brocantes
    : brocantes.filter(b => b.categorie === categorie);

  brocantesFiltrees.forEach(brocante => {
    const marker = L.marker(brocante.coords).addTo(map)
      .bindPopup(`<b>${brocante.nom}</b>`);
    marqueursBrocantes.push(marker);
  });

  // Met à jour la liste dans le panneau latéral
  const liste = document.getElementById('liste-brocantes');
  liste.innerHTML = '';
  brocantesFiltrees.forEach((b, i) => {
    const li = document.createElement('li');
    li.textContent = b.nom;
    li.onclick = () => {
      map.setView(b.coords, 15);
      marqueursBrocantes[i].openPopup();
    };
    liste.appendChild(li);
  });
}

// --- Polygone reliant les brocantes principales ---
const pointsPolygone = brocantes.map(b => b.coords);
L.polygon(pointsPolygone, {
  color: 'blue',
  fillColor: '#6366f1',
  fillOpacity: 0.08
}).addTo(map).bindPopup("Zone principale des brocantes à Paris");

// --- Filtres : gestion du menu déroulant ---
document.getElementById('filtre-categorie').onchange = function() {
  afficherMarqueurs(this.value);
};
afficherMarqueurs("toutes");

// --- Ajout d'un seul marqueur manuel (noir) ---
let ajoutMarqueurActif = false;
let nomMarqueur = "";
let marqueurManuel = null;

// Icône noire classique pour le marqueur manuel
const iconNoir = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

document.getElementById('btn-add-marker').onclick = function() {
  const nom = prompt("Entrez le nom du marqueur :");
  if (nom && nom.trim() !== "") {
    nomMarqueur = nom.trim();
    ajoutMarqueurActif = true;
    this.textContent = "Cliquez sur la carte pour placer le marqueur";
    this.disabled = true;
  } else {
    alert("Nom du marqueur obligatoire !");
  }
};

map.on('click', function(e) {
  if (ajoutMarqueurActif) {
    var lat = e.latlng.lat.toFixed(5);
    var lng = e.latlng.lng.toFixed(5);
    if (marqueurManuel) {
      map.removeLayer(marqueurManuel);
    }
    marqueurManuel = L.marker([lat, lng], { icon: iconNoir }).addTo(map)
      .bindPopup(
        `<div class="popup-marqueur">
          <div class="popup-titre">${nomMarqueur}</div>
          <div class="popup-coord">
            <span>Latitude :</span> ${lat}<br>
            <span>Longitude :</span> ${lng}
          </div>
        </div>`,
        { className: 'popup-marqueur-wrapper' }
      )
      .openPopup();
    ajoutMarqueurActif = false;
    nomMarqueur = "";
    const btn = document.getElementById('btn-add-marker');
    btn.textContent = "Ajouter un marqueur";
    btn.disabled = false;
  }
});

// --- Bouton de géolocalisation ---
document.getElementById('btn-geoloc').onclick = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      map.setView([lat, lng], 14);
      L.circle([lat, lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100
      }).addTo(map).bindPopup("Vous êtes ici !").openPopup();
    }, function() {
      alert("Impossible d'obtenir votre position.");
    });
  } else {
    alert("La géolocalisation n'est pas supportée par ce navigateur.");
  }
};

// --- Barre de navigation : effet actif ---
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = function() {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    // Ici tu pourrais afficher/masquer des sections selon le bouton si tu veux aller plus loin
  };
});