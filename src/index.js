// https://astrid-guenther.de/dies-und-das/18-das-erste-leaflet-layer-plugin-ein-tutorial-fuer-anfaenger


L.TamboraMarkerLayer = L.LayerGroup.extend({
    addTo: function(map) {
      var data = {icon: 'circle', markerColor: 'white', iconColor: '#000000', shape: 'circle', prefix: 'icon'};
      var marker =  L.ExtraMarkers.icon(data);
      var m = L.marker( [45, 8], {icon: marker} ); 
      this.addLayer( m );        
      L.LayerGroup.prototype.addTo.call(this, map);
    },

    addLayer: function (layer) {
      L.LayerGroup.prototype.addLayer.call(this, layer);
    },
    removeLayer: function (layer) {
      L.LayerGroup.prototype.removeLayer.call(this, layer);
    },

    getAttribution: function() {
      return "<a href='https://www.tambora.org'>tambora.org</a>";
    }
})


