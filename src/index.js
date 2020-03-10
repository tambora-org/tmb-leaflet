// https://astrid-guenther.de/dies-und-das/18-das-erste-leaflet-layer-plugin-ein-tutorial-fuer-anfaenger


class TamboraMarkerLayer {
    constructor(options) {
      L.setOptions(this, options);
      //L.Layer.prototype.initialize.call(this, options);
      this.attributionUrl = "https://www.tambora.org";
      this.groupLimit = 15;
      if (Number.isInteger(options.grouping)) {
        this.groupLimit = options.grouping;
      }
      if(typeof L.markerClusterGroup !== "function") {
        this.groupLimit = 0;
      }
      this.markerLayer = new L.LayerGroup(options);
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
       this.markerLayer.addTo(this.map);     
      //L.Layer.prototype.addTo.call(this.markerLayer, map);
    }
    /*
    addLayer: function (layer) {
      L.LayerGroup.prototype.addLayer.call(this, layer);
    },
    removeLayer: function (layer) {
      L.LayerGroup.prototype.removeLayer.call(this, layer);
    },
    */
    getAttribution() {
      return "<a href='"+this.attributionUrl+"'>tambora.org</a>";
    }

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
        var data = {icon: 'circle', markerColor: 'white', iconColor: '#000000', shape: 'circle', prefix: 'icon'};
        var marker =  L.ExtraMarkers.icon(data);
        var m = L.marker( [properties.latitude, properties.longitude], {icon: marker} ); 
        this.markerLayer.addLayer( m );          
      } 
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
      axios.get(jsonUrl)
       .then(response => {
           this.addTmbMarkerToLayer(response.data.features);
       });
    }

}



