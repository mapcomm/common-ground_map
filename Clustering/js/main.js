$(document).ready(function(){

        
              var map = L.map('map').setView([55.3781, -4.4360], 6);
              
              var tonerUrl = "http://{S}tile.stamen.com/terrain/{Z}/{X}/{Y}.png";
              
              var url = tonerUrl.toLowerCase();
              
              var basemap = L.tileLayer(url, {
                                          subdomains: ['', 'a.', 'b.', 'c.', 'd.'],
                                          minZoom: 0,
                                          maxZoom: 20,
                                          type: 'png',
                                          attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
                                          });
                                          
                                          basemap.addTo(map);

                                          //changing the icon on the data 
  var orangeIcon = L.icon({
      iconUrl: 'tree.png',
      shadowUrl: 'leaf-shadow.png',

      iconSize:     [25, 15], // size of the icon
      shadowSize:   [5, 6], // size of the shadow
      iconAnchor:   [2, 9], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  //single example
   //L.marker([51.5, -0.09], {icon: orangeIcon}).addTo(map);



  //fourth query and add with custom icons
  var query4 = "SELECT * FROM community_land";
   var community_land = L.geoJson(null).addTo(map);
      var sql4 = new cartodb.SQL({ user: 'kidwellj' });

      sql4.execute(query4, null, { format: 'geojson' })
      .done(function(data1) {


  //pop ups added and these are the custom options.

  var customOptions =
      {
      'maxWidth': '1600',
      'width': '900',
      'className' : 'popupCustom'
      }

//for loop which loops over sql data
//this then forms the pop up box with information inside
        for (var i=0; i<data1.features.length; i++){


          var name = data1.features[i].properties.name;
          var url = data1.features[i].properties.url;
          console.log(data1);


          var customPopup = name + "<br/>" + 
         
         "<a href=\"http://" + url  + "\" >Click here for website</a>" +

         "<br/>" + "<p>Find out more information on this group</p>" 

        


         ;

//finds the x and y co-ordinates from the sql statement              
              var y = data1.features[i].geometry.coordinates[0];
              var x = data1.features[i].geometry.coordinates[1];

               //adds the markers
               var markerLocation = new L.LatLng(x, y);
               var marker = new L.Marker(markerLocation, {icon: orangeIcon});
               map.addLayer(marker);
               var popupText = name;
           
              

                   marker.bindPopup(customPopup,customOptions);
        marker.on('mouseover', function (e) {
            this.openPopup();
        });
        marker.on('mouseout', function (e) {
            this.closePopup();
        });

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


marker.on('click', function() {
    modal.style.display = "block";
})





// When the user clicks the button, open the modal 
marker.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



              
        }
  //       //on click function
  //       $( marker ).click(function() {
  //   alert( "Handler for .click() called." );
  // });



   });


// The clustering is started here 
var markers = L.markerClusterGroup();
markers.addLayer(L.marker(getRandomLatLng(map)));

map.addLayer(markers);











});