
// pull data
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Earthquakes Layer
// ...extract geoJSON data

d3.json(queryURL, function(data) {
  //console.log(data)
  //parse through geoJSON data with create features function
  createFeatures(data.features);
});


// creating function to add feature item and and pop up with location info
function createFeatures(earthquakeData) {

  function getRadius(d) {
    return d*4
  };

  function getColor(d) {
    return  d > 8.0  ? '#800026' :
            d > 7.9  ? '#BD0026' :
            d > 6.9  ? '#E31A1C' :
            d > 6.0  ? '#FC4E2A' :
            d > 5.4  ? '#FD8D3C' :
            d > 2.5  ? '#FEB24C' :
            d > 1.0  ? '#FED976' :
                       '#FFEDA0';
  };

  // set an empty dictionary to hold markers to call the leaflet circles
  var markOptions = {};

  // create the circle layer
  var eqCircles = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, markOptions).bindPopup("<h3> Location: " + feature.properties.place +
        "<h4><hr><p> Date:" + new Date(feature.properties.time) + " Magnitude: " + feature.properties.mag + "</p>")
    },
    // add style options that call the radius and color from the earthquake magnitude
    style: function (feature){
      return {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        color: "black",
        weight: 0.5,
        opacity: 0.6,
        fillOpacity: 0.5
      }
    }
  });

  createMap(eqCircles);
};

// here's the function to create the leaflet map
function createMap(eqCircles) {

  // map-tile options
  var pencilmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.pencil",
    accessToken: mapkey
  });

  var terrain = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
    maxZoom: 13
  });

  // var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  //   maxZoom: 18,
  //   id: "mapbox.streets",
  //   accessToken: mapkey
  // });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: mapkey
  });

  // baseMaps object to hold base layers
  var baseMaps = {
    "Drawn": pencilmap,
    "Terrain": terrain,
    "Dark": darkmap
  };


  // overlay map object to hold data layer/s **********************
  var overlayMaps = {
    "Today's Earthquakes": eqCircles,
    //"Tectonic Plates": plate
  };

  // here's creating the actual map and with the designed layers
  var myMap = L.map("map", {
    center: [39.82, -98.57],
    zoom: 5,
    layers: [pencilmap, eqCircles]
  });

  var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
  // Plates Layer
  // ...extract geoJSON data

  d3.json(platesURL, function(data){
    //console.log(data)
    //parse through geoJSON data with createplates function
    createPlates(data.features)
  });

  function createPlates(platesData) {

    var linesStyle = {
      "color": "red",
      "weight": 2,
      "opacity": 0.4
    };
    
    var plateLayer = L.geoJSON(platesData, {
      style: linesStyle
    }).addTo(myMap);  
  };


  // here's a control options panel for calling different basemaps and overlays
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}



