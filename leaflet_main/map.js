
import * as countriesFunctions from './countries.js';
import * as citiesFunctions from './cities.js';

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

var default_map_url = "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";


const input = document.getElementById('input');
const search_button = document.getElementById('search_button');

// Initialisiere die Leaflet-Karte
var map = L.map('map', {
    center: [51.1657, 10.4515], // Zentriere die Karte auf Deutschland
    zoom: 6, // Passe den initialen Zoom-Level bei Bedarf an
    maxBounds: [ // Definiere den maximalen Bereich der Karte
        [90, -220], // Oben links: Nordpol, Westliche Hemisphäre
        [-90, 220]  // Unten rechts: Südpol, Östliche Hemisphäre
    ],
    zoomControl: false,
    layers: [
        L.tileLayer(default_map_url, { // Verwende die bereitgestellte ArcGIS Online-Karte
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        })
    ]
});



// Retrieve the selected option value from sessionStorage
var selectedOption = sessionStorage.getItem('selectedOption');

// Use the selectedOption value to determine the context and perform necessary actions
if (selectedOption === 'city') {
    console.log("city");
    
} else if (selectedOption === 'country') {
    console.log("country");
    countriesFunctions.loadCountries(map);
}





function addCustomZoomControl(map) {
    // Erstelle eine neue Instanz der Zoom-Steuerung mit Optionen
    var zoomControl = L.control.zoom({
        position: 'bottomright' // Positioniere die Zoom-Steuerung unten rechts
    });

    // Füge die angepasste Zoom-Steuerung zur Karte hinzu
    zoomControl.addTo(map);
}


addCustomZoomControl(map);


function eventlisteners() {
    // Attach an event listener to the input element for keypress event
    input.addEventListener('keypress', function(event) {
        // Check if the pressed key is the Enter key (key code 13)
        if (event.keyCode === 13) {
            // Call the searchCity function when Enter key is pressed
            searchCity();
        }
    });

    // Attach an event listener to the search button for click event
    search_button.addEventListener('click', function() {
        // Call the searchCity function when the search button is clicked
        searchCity();
    });

    // Attach an event listener to the input element
    input.addEventListener('input', function() {
        // Call your function here
        handleInputChange();
    });

    // Add event listener to both radio buttons
    document.querySelectorAll('input[name="mapOption1"], input[name="mapOption2"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            console.log('Radio button changed:', this.value);
            if (this.checked) {
                if (this.value === 'NoMap') {
                    console.log('Selected: No Map');
                    setTileLayer(null); // Remove the basemap layer
                    // Uncheck the other radio button if it's checked
                    document.querySelector('input[name="mapOption2"][value="SatelliteMap"]').checked = false;
                } else if (this.value === 'SatelliteMap') {
                    console.log('Selected: Satellite Map');
                    setTileLayer(Esri_WorldImagery); // Set the satellite map layer
                    // Uncheck the other radio button if it's checked
                    document.querySelector('input[name="mapOption1"][value="NoMap"]').checked = false;
                }
            }
        });
    });

    function searchCity() {
        // Get the value from the input field
        const cityName = input.value;
        console.log(cityName);
        citiesFunctions.loadCities(map, cityName, function(success) {
            if (success) {
                input.value = "";
            }
        });
    }
    
    // Define the function to be called when the input changes
    function handleInputChange() {
        console.log('Input value changed');
    }
    
    // Function to set the tile layer
    function setTileLayer(layer) {
        
        console.log('Setting tile layer:', layer);
        map.eachLayer(function (currentLayer) {
            if (currentLayer instanceof L.TileLayer) {
                console.log('Removing layer:', currentLayer);
                map.removeLayer(currentLayer); // Remove basemap layers
            }
        });
        if (layer) {
            console.log('Adding new layer:', layer);
            layer.addTo(map); // Add new layer if provided
            layer.bringToBack();
        }
    }
    

}

eventlisteners();








const slider = document.getElementById("scaling-slider");
const currentValue = document.getElementById("current-value");
console.log(slider.value);

slider.addEventListener("input", function() {
    currentValue.textContent = `Current Scaling Factor: ${slider.value}`;
    // Update the circle radius based on the new scaling factor
    updateCircleRadius(parseFloat(slider.value)); // Convert slider value to a float
});

// Function to update the circle radius based on the scaling factor
function updateCircleRadius(scalingFactor) {
    // Loop through each circle marker and update its radius
    map.eachLayer(function(layer) {
        if (layer instanceof L.Circle) {
            layer.setRadius(citiesFunctions.getRadiusFromPopulation(layer.options.population, scalingFactor));
        }
    });
}


