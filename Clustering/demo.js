var map = L.map('map').setView([39.9897471840457, -75.13893127441406], 11)

// Add basemap
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  maxZoom: 10,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

// Add GeoJSON
$.getJSON('./crimes_by_district.geojson', function (geojson) {
  L.choropleth(geojson, {
    valueProperty: 'incidents',
    scale: ['white', 'red'],
    steps: 5,
    mode: 'q',
    style: {
      color: '#fff',
      weight: 2,
      fillOpacity: 0.8
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup('District ' + feature.properties.dist_num + '<br>' +
          feature.properties.incidents.toLocaleString() + ' incidents')
    }
  }).addTo(map)
})

  L.control.zoom({
     position:'topleft'
    }).addTo(map);

  

   
   var sidebar = L.control.sidebar('sidebar', {
    position: 'right'
});

map.addControl(sidebar);


    function openSidebar(network, ID,url,facebook_url,twitter_url,description) {
           
            //account for http
            //if url first few elements  != http then add http maybe???

            

            //parser needed to change the url formatting if incorrect in the database
            var parser = document.createElement('a');
            parser.href = url;
            parser.protocol; // => "http:"
            parser.hostname; // => "example.com"
            parser.port;     // => "3000"
            parser.pathname; // => "/pathname/"
            parser.search;   // => "?search=test"
            parser.hash;     // => "#hash"
            parser.host; // => "example.com:3000"

            //This is functionality for entries that are incorrect
            if(url != null && parser.protocol != "http://" && network == "Community Land Scotland"){
              //alert(network);
              url = "http://" + url;
              //alert(url)
            }


            //This is to format the length of the text in the sidebar
            if(url == null){
              url1 = "";
            } else if (url.length > 20){
                //parse and remove 
               
                url1 = parser.hostname;
                
            } else{
                url1 = parser.host;
            }

            //this is to drop content if it is null
            
            
           // alert(twitter_url +" "+ face + "" + url);

             if(twitter_url == undefined){
                   
                sidebar.open('home');
              var divToAddContent = document.getElementById('home');
              
              //This information is what is displayed in the pop out.
               divToAddContent.innerHTML = "<b>" + network + "</b>" + "</br></br>" + "<b>Name: </b>" + ID + "</br>" + "<b>Url: </b>" +
              '<a href="'+ url + '" target="_blank"' + '>' + url1 + '</a>' + "</br><b>Description:</b> " + description
              +"</br></br></br></br>"+ "KNN placement:";
            }
            else if(url == undefined || url == null || url == ""){



              sidebar.open('home');
              var divToAddContent = document.getElementById('home');
              
              //This information is what is displayed in the pop out.
              divToAddContent.innerHTML = "<b>" + network + "</b>" + "</br></br>" + "<b>Name: </b>" + ID +  "</br><b> Facebook: </b>" + facebook_url+ "</br><b>Description:</b> " + description
              +"</br></br></br></br>"+ "KNN placement:";

            //(twitter_url == null){
               
              
            }else if (facebook_url == undefined){

                   sidebar.open('home');
              var divToAddContent = document.getElementById('home');
              
              //This information is what is displayed in the pop out.
                divToAddContent.innerHTML = "<b>" + network + "</b>" + "</br></br>" + "<b>Name: </b>" + ID + "</br>" + "</br><b>Description:</b> " + description
              +"</br></br></br></br>"+ "KNN placement:";
            }
            /*else if(description == null){
                sidebar.open('home');
              var divToAddContent = document.getElementById('home');
              
              //This information is what is displayed in the pop out.
              divToAddContent.innerHTML = "<b>" + network + "</b>" + "</br></br>" + "<b>Name: </b>" + ID + "</br>" + "<b>Url: </b>" +
              '<a href="'+ url + '" target="_blank"' + '>' + url + '</a>' +  "</br><b> Facebook: </b>" + facebook_url + "</br><b>Twitter: </b>" + twitter_url + "</br><b>Description:</b> " + description
              +"</br></br></br></br>"+ "KNN placement:";
            } else {

                  sidebar.open('home');
              var divToAddContent = document.getElementById('home');
              
              //This information is what is displayed in the pop out.
              divToAddContent.innerHTML = "<b>" + network + "</b>" + "</br></br>" + "<b>Name: </b>" + ID + "</br>" + "<b>Url: </b>" +
              '<a href="'+ url + '" target="_blank"' + '>' + url + '</a>' +  "</br><b> Facebook: </b>" + facebook_url + "</br><b>Twitter: </b>" + twitter_url + "</br><b>Description:</b> " + description
              +"</br></br></br></br>"+ "KNN placement:";
            }
*/
             //console.log(ID);
              if ($('#sidebar-text').text().length > 0) {
                  $("#sidebar-text").removeText();
              }

              /*for (var i = 0, len = results.length; i < len; i++) {
                 
               
               //this loop matches the array element to the passed ID  
                  if (results[i].Link == ID) {
                      thisResult = (results[i]);            
                  }
              }
              */
              //remove name from thisResult and others
            
          }



    var leafletView = new PruneClusterForLeaflet();

    



    leafletView.BuildLeafletClusterIcon = function(cluster) {
        
        var e = new L.Icon.MarkerCluster();

        e.stats = cluster.stats;
        e.population = cluster.population;
        return e;
    };

    var colors = ['#ff4b00', '#bac900', '#EC1813', '#55BCBE', '#D2204C', '#FF0000', '#ada59a', '#3e647e'],
        pi2 = Math.PI * 2;

    L.Icon.MarkerCluster = L.Icon.extend({
        options: {
            iconSize: new L.Point(180, 90),
            className: 'prunecluster leaflet-markercluster-icon'
        },

        createIcon: function () {
            // based on L.Icon.Canvas from shramov/leaflet-plugins (BSD licence)
            var e = document.createElement('canvas');
            this._setIconStyles(e, 'icon');
            var s = this.options.iconSize;
            e.width = s.x;
            e.height = s.y;
            this.draw(e.getContext('2d'), s.x, s.y);
            return e;
        },

        createShadow: function () {
            return null;
        },

        draw: function(canvas, width, height) {

            var lol = 0;

            var start = 0;
            for (var i = 0, l = colors.length; i < l; ++i) {

                var size = this.stats[i] / this.population;


                if (size > 0) {
                    canvas.beginPath();
                    canvas.moveTo(22, 22);
                    canvas.fillStyle = colors[i];
                    var from = start + 0.14,
                        to = start + size * pi2;

                    if (to < from) {
                        from = start;
                    }
                    canvas.arc(22,22,22, from, to);

                    start = start + size*pi2;
                    canvas.lineTo(22,22);
                    canvas.fill();
                    canvas.closePath();
                }

            }

            canvas.beginPath();
            canvas.fillStyle = 'white';
            canvas.arc(22, 22, 18, 0, Math.PI*2);
            canvas.fill();
            canvas.closePath();

            canvas.fillStyle = '#555';
            canvas.textAlign = 'center';
            canvas.textBaseline = 'middle';
            canvas.font = 'bold 12px sans-serif';

            canvas.fillText(this.population, 22, 22, 40);
        }
    });



    var size = 10000;
    var markers = [];

/*
    var query2 = $.getJSON('https://carto.mapping.community:9090/user/hilld/api/v2/sql?format=GeoJSON&q=SELECT * FROM "mapcomm-admin".communityenergy_groups_gb_sct',     
    function(data2) {
             L.geoJSON(data2, {
                  pointToLayer: function (feature, latlng, properties) {
                    //console.log(latlng.lat, latlng.lng);
                    var marker2 = new PruneCluster.Marker(latlng.lat, latlng.lng);
                    marker2.category = 0;
                    markers.push(marker2);
                    leafletView.RegisterMarker(marker2);
                  }
            })
    });*/
/*
     var query3 = $.getJSON('https://carto.mapping.community:9090/user/hilld/api/v2/sql?format=GeoJSON&q=SELECT * FROM "mapcomm-admin".communityenergy_groups_gb_sct',     
    function(data1) {
             L.geoJSON(data1, {
                  pointToLayer: function (feature, latlng) {
                    //console.log(latlng.lat, latlng.lng);


                    var marker = new PruneCluster.Marker(latlng.lat, latlng.lng);
                   
                      
                    marker.category = 1;
                   // marker.category = Math.floor(Math.random() * colors.length);
                    markers.push(marker);
                    leafletView.RegisterMarker(marker);    
}
                  })

});

 var query4 = $.getJSON('https://carto.mapping.community:9090/user/hilld/api/v2/sql?format=GeoJSON&q=SELECT * FROM "mapcomm-admin".communityland_groups_gb_sct',     
    function(data1) {
        console.log(data1);
        L.geoJSON(data1, {
                  pointToLayer: function (feature, latlng) {
                    //console.log(latlng.lat, latlng.lng);
                    var marker3 = new PruneCluster.Marker(latlng.lat, latlng.lng, {color: '#222'});


                    marker3.category = 2;
                   // marker.category = Math.floor(Math.random() * colors.length);
                    markers.push(marker3);
                    leafletView.RegisterMarker(marker3);    
}
                  })

});   
*/

  var query3 = $.getJSON('https://carto.mapping.community:9090/user/hilld/api/v2/sql?format=GeoJSON&q=SELECT * FROM "mapcomm-admin".dtas_groups_gb_sct',     
    function(data1) {
        
        L.geoJSON(data1, {
                  pointToLayer: function (feature, latlng, properties) {


                    /*var myIcon = L.icon({
                       // iconUrl: 'pruneCluster.png',
                       iconUrl: 'leaflet.jpeg',
                        iconSize: [90, 95],
                        iconAnchor: [22, 94],
                        popupAnchor: [-3, -76],
                        //shadowUrl: 'my-icon-shadow.png',
                        shadowSize: [68, 95],
                        shadowAnchor: [22, 94]
                    });*/



                    var marker4 = new PruneCluster.Marker(latlng.lat, latlng.lng, {color: '#000', feature, 
                        'color': '#f3ff00', 'colorClass': 'yellow', 'visible':true,  icon: L.icon({
                iconUrl: 'leaflet.jpeg',
                iconSize: [48, 48]
            })

                        });

                 
                   


                    

                    marker4.category = 3;
                 //   marker.data.icon = L.icon(...); 


             /*   marker4.data.icon = L.icon({
                    options: {
                        iconUrl: 'leaflet.jpeg',
                        iconSize:     [38, 95],
                        shadowSize:   [50, 64],
                        iconAnchor:   [22, 94],
                        shadowAnchor: [4, 62],
                        popupAnchor:  [-3, -76]
                    }
                });

      
*/
                    


                    
                   // marker.category = Math.floor(Math.random() * colors.length);
                    markers.push(marker4);
                    leafletView.RegisterMarker(marker4); 

}
                  })

});   
    


    
    //need to change this to have the incoming data input into the marker from the geoJson call
    // var marker = new PruneCluster.Marker(latitude, longitude);


    /*
    for (var i = 0; i < size; ++i) {


        var marker = new PruneCluster.Marker(59.91111 + (Math.random() - 0.5) * Math.random() * 0.00001 * size, 10.752778 + (Math.random() - 0.5) * Math.random() * 0.00002 * size);

        // This can be a string, but numbers are nice too
        

        markers.push(marker);
        leafletView.RegisterMarker(marker);
    }
*/



/*
    window.setInterval(function () {
        for (i = 0; i < size / 2; ++i) {
            var coef = i < size / 8 ? 10 : 1;
            var ll = markers[i].position;
            ll.lat += (Math.random() - 0.5) * 0.00001 * coef;
            ll.lng += (Math.random() - 0.5) * 0.00002 * coef;
        }

        leafletView.ProcessView();
    }, 500);*/


  var  myIcon =           L.icon({
    iconUrl: 'leaflet.jpeg',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
   
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});

  var  myIcon2 =           L.icon({
                     iconUrl: 'leaflet.jpeg',
    iconSize: [10, 25],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
   
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
              });





leafletView.PrepareLeafletMarker = function(leafletMarker, data,properties) {
    
   // console.log(data.feature.properties.network);

    if(data.feature.properties.network == "DTAS"){
       // leafletMarker.setIcon(myIcon2);
    }

       // leafletMarker.setIcon(myIcon2);
    
        
         leafletMarker.on('mouseover', function(e) {
            var popup = L.popup()

            .setLatLng(e.latlng) 
            .setContent( "<b>" + data.feature.properties.name + "</b>" + "</br>" + "</br>"  + "<i>Click for more information<i>")
            .openOn(map);
        });
   
    leafletMarker.on('mouseout', function (e) {
            map.closePopup();
        });

    leafletMarker.on('click', function(){
        
       console.log(data.feature.properties.network)
       openSidebar(data.feature.properties.network, data.feature.properties.name, data.feature.properties.url,data.feature.properties.facebook_url,data.feature.properties.twitter_url,data.feature.properties.description);
     
    //do click event logic here
    })

   



};

    map.addLayer(leafletView);
