// https://astrid-guenther.de/dies-und-das/18-das-erste-leaflet-layer-plugin-ein-tutorial-fuer-anfaenger


class TamboraMarkerLayer {
    constructor(options) {
      L.setOptions(this, options);
      //L.Layer.prototype.initialize.call(this, options);
      this.attributionUrl = "https://www.tambora.org";
      this.options = options;
      this.options.attribution = "<a href='"+this.attributionUrl+"'>tambora.org</a>";

      this.groupLimit = 15;
      if (Number.isInteger(options.grouping)) {
        this.groupLimit = options.grouping;
      }
      if(typeof L.markerClusterGroup !== "function") {
        this.groupLimit = 0;
      }
      this.markerLayer = new L.LayerGroup(this.options);
      //this.loadGeoJsonTambora();
      //super(options);
    }

    addTo(map) {
       this.map = map;
       this.loadGeoJsonTambora();
       var data = {icon: 'circle', markerColor: 'white', iconColor: '#000000', shape: 'circle', prefix: 'icon'};
       var marker =  L.ExtraMarkers.icon(data);
       var m = L.marker( [48, 8], {icon: marker} ); 
       this.markerLayer.addLayer( m );   
       this.markerLayer.addTo(map);     
      //L.Layer.prototype.addTo.call(this.markerLayer, map);
    }
    /*
    addLayer: function (layer) {
      L.LayerGroup.prototype.addLayer.call(this, layer);
    },
    removeLayer: function (layer) {
      L.LayerGroup.prototype.removeLayer.call(this, layer);
    },

    getAttribution() {
      return "<a href='"+this.attributionUrl+"'>tambora.org</a>";
    }
    */
    addTmbMarkerToLayer(features) {  
      this.markerLayer.clearLayers();
      this.map.removeLayer(this.markerLayer);
      if((this.groupLimit > 0) && (features.length > this.groupLimit)) {
        this.markerLayer = L.markerClusterGroup(this.options);
      } else {
        this.markerLayer = L.layerGroup(this.options);
      }
      for(var i=0;i<features.length;i++) {
        var properties = features[i].properties;
        //var data = {icon: 'fa-coffee', markerColor: 'white', iconColor: '#000000', shape: 'circle', prefix: 'icon'};
        //var marker =  L.ExtraMarkers.icon(data);
        var marker = getMarker(properties);
        if(marker) {
          var m = L.marker( [properties.latitude, properties.longitude], {icon: marker} ); 
          this.markerLayer.addLayer( m ); 
        }         
      } 
      //this.markerLayer.setAttribution("<a href='"+this.attributionUrl+"'>tambora.org</a>");
      this.markerLayer.getAttribution = function() {return this.options.attribution;};
      this.markerLayer.addTo(this.map);
    }

    loadGeoJsonTambora() {
      var jsonBaseUrl =  "https://www.tambora.org/index.php/grouping/event/geojson?"; 
      var tmbBaseUrl = "https://www.tambora.org/index.php/grouping/event/list?mode=search&";
      var jsonUrl = null; 
      var tmbUrl = "https://www.tambora.org";
      if (this.options.url) {
        jsonUrl = this.options.url;
      }  
      if (this.options.parameter) {
        jsonUrl = jsonBaseUrl + this.options.parameter;
        tmbUrl = tmbBaseUrl + this.options.parameter;
      }  
      this.attributionUrl = tmbUrl;
      this.options.attribution = "<a href='"+this.attributionUrl+"'>tambora.org</a>";
      axios.get(jsonUrl)
       .then(response => {
           this.addTmbMarkerToLayer(response.data.features);
       });
    }

}


var iconCodes = {
"longterm precipitation:extremely dry": {icon: 'tint', markerColor: 'red', iconColor: '#FFFFFF', shape: 'circle', prefix: 'icon'},
"longterm precipitation:very dry": {icon: 'tint', markerColor: 'orange', iconColor: '#FFFFFF', shape: 'circle', prefix: 'icon'},	
"wildfire:null": {icon: 'fire', markerColor: 'yellow', iconColor: '#FF0000', shape: 'circle', prefix: 'icon'},
"damaged by fire:null": {icon: 'fire', markerColor: 'yellow', iconColor: '#AA0000', shape: 'circle', prefix: 'icon'},
"temperature level:very hot": {icon: 'sun', markerColor: 'yellow', iconColor: '#AA0000', shape: 'circle', prefix: 'icon'},
"water temperature level:very hot": {icon: 'sun', markerColor: 'yellow', iconColor: '#CC0000', shape: 'circle', prefix: 'icon'},
"price trend:increasing price": {icon: 'euro sign', markerColor: 'violet', iconColor: '#000000', shape: 'penta', prefix: 'icon'},
"price level:high price": {icon: 'euro sign', markerColor: 'violet', iconColor: '#000000', shape: 'penta', prefix: 'icon'},
"water level trend:falling water level": {icon: 'ship', markerColor: 'white', iconColor: '#000000', shape: 'circle', prefix: 'icon'},
"low water level:low water level (no water)": {icon: 'ship', markerColor: 'blue', iconColor: '#000000', shape: 'circle', prefix: 'icon'},
"hunger (humans):null": {icon: 'coffee', markerColor: 'purple', iconColor: '#FFFFFF', shape: 'penta', prefix: 'icon'},
"harvest quality:very good crop quality": {icon: 'leaf', markerColor: 'green-light', iconColor: '#BBFFBB', shape: 'penta', prefix: 'icon'},
"harvest quantity:very low harvest volume": {icon: 'leaf', markerColor: 'green-light', iconColor: '#BBFFBB', shape: 'penta', prefix: 'icon'},
"shortterm precipitation:no precipitation": {icon: 'tint', markerColor: 'cyan', iconColor: '#000000', shape: 'circle', prefix: 'icon'},
"low water level:low water level (severly limited use)": {icon: 'ship', markerColor: 'blue', iconColor: '#000000', shape: 'circle', prefix: 'icon'},
"thirst (animals):null": {icon: 'beer', markerColor: 'cyan', iconColor: '#000000', shape: 'circle', prefix: 'icon'},
"hunger (animals):null": {icon: 'star', markerColor: 'purple', iconColor: '#FFFFFF', shape: 'penta', prefix: 'icon'},
"low water level:low water level (limited use)": {icon: 'ship', markerColor: 'blue', iconColor: '#000000', shape: 'circle', prefix: 'icon'},
"thirst (humans):null": {icon: 'beer', markerColor: 'cyan', iconColor: '#000000', shape: 'penta', prefix: 'icon'},
"precipitation frequency:never precipitation": {icon: 'umbrella', markerColor: 'cyan', iconColor: '#000000', shape: 'circle', prefix: 'icon'},
"other:other": {icon: 'fa-question', markerColor: 'white', iconColor: '#000000', shape: 'circle', prefix: 'icon'}
}

function getMarker(event) {
  var key = event.node_label + ':' + event.value_label;
  var data = iconCodes[key];
  if(!data) {
    data = {icon: 'fa-question', markerColor: 'white', iconColor: '#000000', shape: 'circle', prefix: 'icon'}
    key = "other:other"
    // return null; // return: prefer to not show unknown icons...
    // event may contain coding not in select... better filter...
  }
  if (!data.marker) {
    iconCodes[key].marker = L.ExtraMarkers.icon(data);
  }
  return iconCodes[key].marker;
}

