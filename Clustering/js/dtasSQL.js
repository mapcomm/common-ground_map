function getData(){$.getJSON('https://carto.mapping.community:9090/user/hilld/api/v2/sql?format=GeoJSON&q=SELECT * FROM "mapcomm-admin".dtas_groups_gb_sct',     
    function(data) {
      console.log(data);
    });
}


//change the file structure 
//push to github and get Jeremy to check the work 
	//if its ok then continue
//insert all 5 data sets 
//change the methods for each of those so it has on hover etc
//insert the names on the onhover function so that you can see typeG


function getData2(){
var results = [];
   
          //open sidebar and more content when clicking button in popup
          var thisResult;
          
          /*This is the function to sort the results of the array passed below
          openSidebar(a.layer.feature.properties.name(aka ID), a.layer.feature.properties.url,a.layer.feature.properties.facebook_url,a.layer.feature.properties.twitter_url,a.layer.feature.properties.description);
          */
          function openSidebar(ID,url,facebook_url,twitter_url,description) {

            if(url == null){
              url = "No URL available";
            }
            if(facebook_url == null){
              facebook_url = "No facebook available";
            }
            if(twitter_url == null){
              twitter_url = "No twitter available";
            }
            if(description == null){
              description = "No description available";
            }

             console.log(ID);
              if ($('#sidebar-text').text().length > 0) {
                  $("#sidebar-text").removeText();
              }

              for (var i = 0, len = results.length; i < len; i++) {
                 
               
               //this loop matches the array element to the passed ID  
                  if (results[i].Link == ID) {
                      thisResult = (results[i]);            
                  }
              }
              
              //remove name from thisResult and others
              sidebar.open('home');
              var divToAddContent = document.getElementById('home');
              
              //This information is what is displayed in the pop out.
              divToAddContent.innerHTML = "DTAS</br>" + "Name:</br>" + ID + "</br>Url:</br>" + url +  "</br> Facebook: </br>" + facebook_url + "</br>Twitter: </br>" + twitter_url + "</br>Description: </br>" + description;
          }

/*
Display in infobox (omit whole field if data is null/blank)

(as above, as well as...)

● url (we should also consider integrating chortling creation for these, see: https://www.programmableweb.com/news/71-url-shortener-apis-bitly-google-url-shortener-and-tiny-url-open/2012/10/31)

● facebook_url

● twitter_url

● description

● 5 nearest neighbors (each shown as "name" which is rendered as hyperlink which on click will move focus to new item; possibly also include icon after name to represent network of each neighbor item (provided via table name)

● demographics? 
*/

 
       		const tonerUrl = "http://{S}tile.stamen.com/toner/{Z}/{X}/{Y}.png";
              
            const url = tonerUrl.replace(/({[A-Z]})/g, s => s.toLowerCase());
              

		   var basemap = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
		    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		    subdomains: 'abcd',
		    minZoom: 0,
		    maxZoom: 18,
		    ext: 'png'
		});

          var map = L.map('map', {
              center: [55.3781, -4.4360],
              zoom: 5,
              layers: [basemap]
          });


                                          

				basemap.addTo(map);
		var markers1 = new L.MarkerClusterGroup();
		var markers1List = [];

		//create second grouping
		var markers2 = new L.MarkerClusterGroup();
		var markers2List = [];

		//create comm energy grouping
		var markers3 = new L.MarkerClusterGroup();
		var markers3List = [];


  

//The implemntation of a for loop which loops over sql data
//It is then forming the pop up box with information inside

/*
DTAS - inserted
ecs_groups_gb_sct - inserted

communityenergy_groups_gb_sct
communityland_groups_gb_sct 
cityfarmsgardens_groups_gb_sct 
sccan_groups_gb_sct
permaculture_groups_gb_sct  
*/
        

		function populateComEnergy() {

   var query3 = $.getJSON('https://carto.mapping.community:9090/user/hilld/api/v2/sql?format=GeoJSON&q=SELECT * FROM "mapcomm-admin".communityenergy_groups_gb_sct',     
    function(data1) {
    

              var geojsonMarkerOptions = {
                  radius: 8,
                  fillColor: "#0000FF", //dark blue
                  color: "#000",
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8
              };

              


              L.geoJSON(data1, {
                  pointToLayer: function (feature, latlng) {
                      var marker = L.circleMarker(latlng, geojsonMarkerOptions);
                     

		//add onHover functionality
                      marker.bindPopup(feature.properties.name + "<br/>" + '<br/><button type="button" class="btn btn-primary sidebar-open-button" data = "' + feature.properties.url);
                      
                results.push(feature.properties);

              
				markers3List.push(marker);
				markers3.addLayer(marker);
                  
                      return marker;
                  }
                  })
                



  //pop ups added and these are the custom options.
//using this?????????
 
		})
			return false;
		}


		function populateDTAS() {

   var query3 = $.getJSON('https://carto.mapping.community:9090/user/hilld/api/v2/sql?format=GeoJSON&q=SELECT * FROM "mapcomm-admin".dtas_groups_gb_sct',     
    function(data1) {
    

              var geojsonMarkerOptions = {
                  radius: 8,
                  fillColor: "#FFC0CB",
                  color: "#000",
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8
              };

              


              L.geoJSON(data1, {
                  pointToLayer: function (feature, latlng) {
                      var marker = L.circleMarker(latlng, geojsonMarkerOptions);
                     

		//add onHover functionality
                      marker.bindPopup(feature.properties.name + "<br/>" + '<br/><button type="button" class="btn btn-primary sidebar-open-button" data = "' + feature.properties.url);
                      
                results.push(feature.properties);

              
				markers2List.push(marker);
				markers2.addLayer(marker);
                  
                      return marker;
                  }
                  })
  //pop ups added and these are the custom options.
//using this?????????
 
		})
			return false;
		}




function populateEco() {

   var query3 = $.getJSON('https://carto.mapping.community:9090/user/hilld/api/v2/sql?format=GeoJSON&q=SELECT * FROM "mapcomm-admin".ecs_groups_gb_sct',     
    function(data1) {
    

              var geojsonMarkerOptions = {
                  radius: 8,
                  fillColor: "#ff7800",
                  color: "#000",
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8
              };

              


              L.geoJSON(data1, {
                  pointToLayer: function (feature, latlng) {
                      var marker = L.circleMarker(latlng, geojsonMarkerOptions);
                     

		//add onHover functionality
                      marker.bindPopup(feature.properties.name + "<br/>" + '<br/><button type="button" class="btn btn-primary sidebar-open-button" data = "' + feature.properties.url);
                      
                results.push(feature.properties);

              
				markers1List.push(marker);
				markers1.addLayer(marker);
                  
                      return marker;
                  }
                  })
                



  //pop ups added and these are the custom options.
//using this?????????
 
		})
			return false;
		}



		//The cluster click which focuses in on a grouping of points 
		markers1.on('clusterclick', function (a) {
			//alert('cluster ' + a.layer.getAllChildMarkers().length);
		});
		
		    var sidebar = L.control.sidebar('sidebar', {
            position: 'right'
          });

            map.addControl(sidebar);

		        markers1.on('click', function (a) {
             
              console.log(a.layer.feature.properties.twitter_url);
              
              //pushes the features to the sideBar which are pushed to the function above and need to be printed there
              //you have to send the name as the first parameter as it is checked in the function against stored values for ID. Then you can send any other parameters after this if you specify them. 
              openSidebar(a.layer.feature.properties.name, a.layer.feature.properties.url,a.layer.feature.properties.facebook_url,a.layer.feature.properties.twitter_url,a.layer.feature.properties.description);
      /*        


● facebook_url

● twitter_url

● description

● 5 nearest neighbors (each shown as "name" which is rendered as hyperlink which on click will move focus to new item; possibly also include icon after name to represent network of each neighbor item (provided via table name)

● demographics? 
*/
              //add sidebar panel to map
          
         

		   //add sidebar panel to map
         

			
		});


        
        /*
        markers.on('mouseover', function (e) {
            this.openPopup();
            markers.bindPopup("Popup content");
            console.log(e.layer.feature.properties.name);
        });
        */

      

//Change the content of the pop up boxes here on mouse over
         markers1.on('mouseover', function(e) {
    		var popup = L.popup()

     		.setLatLng(e.latlng) 
     		.setContent( "</br>" + e.layer.feature.properties.name + "</br>" + "</br>" + "Click for more information")
     		.openOn(map);
  		});

  		markers1.on('mouseout', function (e) {
            map.closePopup();
        });
		




  		//make calls to methods to populate the space with the markers 
		populateDTAS();
		populateEco();
		populateComEnergy()

		map.addLayer(markers1);
		map.addLayer(markers2);
		//add comm energy layer
		map.addLayer(markers3);
		




      //panel implementation
//var panel = L.control.panelLayers();



/*// Set up the OSM layer
var tile = L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
    {maxZoom: 18}).addTo(map);
var osm = L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
    {maxZoom: 18}).addTo(map);
*/
var hhLayer = new L.geoJson({
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-2.464459,36.83711]
  },
  "properties": {
    "name": "My House"
  }
});
var wpLayer = new L.geoJson({
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-2.464459,36.836]
  },
  "properties": {
    "name": "Your Mom's House"
  }
});
//map.addLayer(tile);
//map.addLayer(osm);
//map.addLayer();
map.addLayer(wpLayer);
var baseLayer = { 
   //"Satellite": tile,
   //"OSM Data": osm
};
var overlay = {
    "Data1": markers1,
    "Data2": markers2,
    "Community Energy": markers3

    
    
};

var layerControl = new L.control.layers(baseLayer, overlay, {collapsed: false});
map.addControl(layerControl);

}
   



