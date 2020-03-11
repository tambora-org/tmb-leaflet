// https://astrid-guenther.de/dies-und-das/18-das-erste-leaflet-layer-plugin-ein-tutorial-fuer-anfaenger


L.TamboraMarkerLayer = L.LayerGroup.extend({
    initialize: function(options) {
      L.setOptions(this, options);
      L.LayerGroup.prototype.initialize.call(this, options);
      this.attributionUrl = "https://www.tambora.org";
      //this.loadGeoJsonTambora();
    },
    addTo: function(map) {
       this.loadGeoJsonTambora();
       var data = {icon: 'circle', markerColor: 'white', iconColor: '#000000', shape: 'circle', prefix: 'icon'};
       var marker =  L.ExtraMarkers.icon(data);
       var m = L.marker( [48, 8], {icon: marker} ); 
       this.addLayer( m );        
      L.LayerGroup.prototype.addTo.call(this, map);
    },
    /*
    addLayer: function (layer) {
      L.LayerGroup.prototype.addLayer.call(this, layer);
    },
    removeLayer: function (layer) {
      L.LayerGroup.prototype.removeLayer.call(this, layer);
    },
    */
    getAttribution: function() {
      return "<a href='"+this.attributionUrl+"'>tambora.org</a>";
    },
    addTmbMarkerToLayer(features) {  
      this.clearLayers();
      for(var i=0;i<features.length;i++) {
        var properties = features[i].properties;
        var data = {icon: 'circle', markerColor: 'white', iconColor: '#000000', shape: 'circle', prefix: 'icon'};
        var marker =  L.ExtraMarkers.icon(data);
        var m = L.marker( [properties.latitude, properties.longitude], {icon: marker} ); 
        this.addLayer( m );          
      } 
    }, 
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
    },

})



