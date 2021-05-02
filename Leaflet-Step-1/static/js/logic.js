
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(data) {
  console.log(data)
  createFeatures(data);
});

function createFeatures(earthquakeData) {

  function onEachLayer(feature) {
    return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      radius: circleSize(feature.properties.mag),
      fillOpacity: 0.8,
      color: getColor(feature.properties.mag),
      fillColor: getColor(feature.properties.mag)
    });
  }

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + "</p>");
  }

  
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: onEachLayer
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Satellite": satellitemap,
    "Grayscale": grayscalemap,
    "Outdoor": outdoormap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      0.00, 0.00
    ],
    zoom: 2,
    layers: [satellitemap, earthquakes]
  });

  
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

  var info = L.control({
    position: "bottomright"
  });

  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend"),
      labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

    for (var i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style="background:' + getColor(i) + '"></i> ' +
              labels[i] + '<br>' ;
    }
    return div;
  };
  info.addTo(myMap);
};

function getColor(magnitude) {
    // Conditionals for magnitude
    if (magnitude >= 5) {
      return "FireBrick";
    }
    else if (magnitude >= 4) {
      return "OrangeRed";
    }
    else if (magnitude >= 3) {
     return "darkorange";
    }
    else if (magnitude >= 2) {
      return "yellow";
    }
    else if (magnitude >= 1) {
      return "yellowgreen";
    }
    else {
      return "green";
    }
};

function circleSize(magnitude) {
  return magnitude ** 2;
}