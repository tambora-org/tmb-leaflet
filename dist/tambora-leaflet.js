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
        var feature = features[i];
        var properties = feature.properties;
        //var data = {icon: 'fa-coffee', markerColor: 'white', iconColor: '#000000', shape: 'circle', prefix: 'icon'};
        //var marker =  L.ExtraMarkers.icon(data);
        var marker = getMarker(feature);
        var popup = getPopup(feature);
        if(marker) {
          var m = L.marker( [properties.latitude, properties.longitude], {icon: marker} ); 
          m.bindPopup(popup);
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

"flood intensity:flood above average": {icon: 'ship', markerColor: 'blue', iconColor: '#FFFFFF', shape: 'circle', prefix: 'icon'},
"flood extent:regional": {icon: 'ship', markerColor: 'blue', iconColor: '#FFFFFF', shape: 'penta', prefix: 'icon'},
"freezing temperatures:null": {icon: 'fa-linux', markerColor: 'white', iconColor: '#0000FF', shape: 'circle', prefix: 'fa'},
"shortterm precipitation:very much precipitation": {icon: 'tint', markerColor: 'blue', iconColor: '#FFFFFF', shape: 'circle', prefix: 'icon'},
"shortterm precipitation:much precipitation": {icon: 'tint', markerColor: 'blue', iconColor: '#AAAAAA', shape: 'circle', prefix: 'icon'},
"rain:null": {icon: 'tint', markerColor: 'cyan', iconColor: '#0000AA', shape: 'penta', prefix: 'icon'},
"temperature level:cold": {icon: 'sun', markerColor: 'cyan', iconColor: '#0000CC', shape: 'circle', prefix: 'icon'},
"temperature level:cool": {icon: 'sun', markerColor: 'cyan', iconColor: '#0000AA', shape: 'circle', prefix: 'icon'},
"temperature level:warm": {icon: 'sun', markerColor: 'yellow', iconColor: '#880000', shape: 'circle', prefix: 'icon'},
"temperature level:hot": {icon: 'sun', markerColor: 'yellow', iconColor: '#990000', shape: 'circle', prefix: 'icon'},
"price:null": {icon: 'euro sign', markerColor: 'violet', iconColor: '#000000', shape: 'penta', prefix: 'icon'}, //x
"begin:null": {icon: 'fa-arrow-circle-o-left', markerColor: 'white', iconColor: '#00AA00', shape: 'square', prefix: 'fa'}, //x
"end:null": {icon: 'fa-arrow-circle-o-right', markerColor: 'white', iconColor: '#00AA00', shape: 'square', prefix: 'icon'}, //x
"wind force:10 bft: storm": {icon: 'fa-skyatlas', markerColor: 'pink', iconColor: '#000000', shape: 'star', prefix: 'fa'}, //x
"wind force:9 bft: strong gale": {icon: 'fa-skyatlas', markerColor: 'pink', iconColor: '#111111', shape: 'star', prefix: 'fa'}, //x
"wind force:7 bft: high wind": {icon: 'fa-skyatlas', markerColor: 'pink', iconColor: '#333333', shape: 'star', prefix: 'fa'}, //x
"longterm precipitation:very wet": {icon: 'tint', markerColor: 'cyan', iconColor: '#FFFFFF', shape: 'circle', prefix: 'icon'},	
"kind of goods:null": {icon: 'fa-shopping-cart', markerColor: 'violet', iconColor: '#000000', shape: 'penta', prefix: 'icon'}, //x
"harvest quality:poor crop quality": {icon: 'leaf', markerColor: 'green-light', iconColor: '#DDAAAA', shape: 'penta', prefix: 'icon'},
"harvest quality:good crop quality": {icon: 'leaf', markerColor: 'green-light', iconColor: '#AADDAA', shape: 'penta', prefix: 'icon'},
"harvest quantity:high harvest volume": {icon: 'leaf', markerColor: 'green-light', iconColor: '#669966', shape: 'penta', prefix: 'icon'},
"harvest quantity:low harvest volume": {icon: 'leaf', markerColor: 'green-light', iconColor: '#AADDAA', shape: 'penta', prefix: 'icon'},
"oat:null": {icon: 'fa-pagelines', markerColor: 'violet', iconColor: '#000000', shape: 'penta', prefix: 'fa'}, 
"rye:null": {icon: 'fa-pagelines', markerColor: 'violet', iconColor: '#000000', shape: 'penta', prefix: 'fa'}, 
"grain:null": {icon: 'fa-pagelines', markerColor: 'violet', iconColor: '#000000', shape: 'penta', prefix: 'fa'}, 
"fruits:null": {icon: 'fa-lemon-o', markerColor: 'violet', iconColor: '#000000', shape: 'penta', prefix: 'icon'}, 
"plants:null": {icon: 'leaf', markerColor: 'violet', iconColor: '#000000', shape: 'penta', prefix: 'icon'}, 
"snow:null": {icon: 'fa-empire', markerColor: 'white', iconColor: '#0000AA', shape: 'penta', prefix: 'fa'},
"wine:null": {icon: 'fa-glass', markerColor: 'violet', iconColor: '#220000', shape: 'penta', prefix: 'fa'}, 
"thunderstorm:null": {icon: 'fa-flash', markerColor: 'cyan', iconColor: '#0000AA', shape: 'penta', prefix: 'fa'},
"general plant development:null": {icon: 'leaf', markerColor: 'violet', iconColor: '#000000', shape: 'penta', prefix: 'icon'},
"harvest:null": {icon: 'leaf', markerColor: 'green-light', iconColor: '#000000', shape: 'penta', prefix: 'icon'},
"solar eclipse:null": {icon: 'fa-sun-o', markerColor: 'white', iconColor: '#AA3300', shape: 'circle', prefix: 'fa'},

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

function getMarker(feature) {
  var property = feature.properties;
  var key = property.node_label + ':' + property.value_label;
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

function getPopup(feature) {
  var property = feature.properties;

  var quote = property.quote_text;
  if(quote.length > 512) {
     quote = quote.substr(0,500) + '   [ ... '+(quote.length-500).toString()+' more characters]';
  }	  
  var popup = '<img src="https://www.tambora.org/images/logos/tambora-logo-red.png" alt="tambora.org" align="right" />'  
              + '<b>Node:</b> ' + property.node_label  
              + '<br/><b>Value:</b> ' + property.value_label 
              + '<hr style="margin:1px;"/><b>Quote:</b> ' + quote;
  if(property.public) {			  
    popup += '<hr style="margin:1px;"/><b>Source:</b> ' 
            + property.source_author /* + '('+'yyyy'+'): ' */		  
		  	    + ': ' + property.source_title
				    + '<hr style="margin:1px;"/>'
	}
	
	if(property.doi) {
      popup += '<b>DOI:</b> <a target="_blank" href="https://dx.doi.org/' + property.doi + '">'
			+ property.doi + '</a><br/>';
	}
	if(property.public) {
	  popup += '<b>More details on:</b> <a target="_blank" href="https://www.tambora.org/index.php/grouping/event/list?g[qid]=' 
			    + property.quote_id.toString() + '" >tambora.org</a>';
  }
  return popup;	
}

