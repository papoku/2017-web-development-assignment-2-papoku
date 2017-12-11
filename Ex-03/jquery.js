//global variables
var map;
var route_id;
var lines;
var shape;
var coord = [];
var info_window;
var gtfs;

                    
// funtion to load google map
function initMap() {
        // Create a map object and specify the DOM element for display.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 12,
        mapTypeId:'roadmap',
        });   
      }  


//Function to load all the lines into the input
$(document).ready(function(){
    
    latest_gtfs();
    
    $.getJSON("https://data.foli.fi/gtfs/v0/"+gtfs+"/routes", function(json){
            
            lines = json;
            $('#bus-line').empty();
            $('#bus-line').append($('<option>').text("Select"));
            $.each(json, function(i, obj){
                    $('#bus-line').append($('<option>').text(obj.route_long_name).attr('value', obj.route_short_name));
            });
    });
    
});


$(document).ready(function(){
    
    $("#btn_show").click(function() {
        show_buses();
    });
    
});



$(document).ready(function(){
        
                            // Refresh lines real time coordinates.
        $("#btn_refresh").click(function() {
            
            if(coord.length!=0){
                show_buses();
            }
            else
                alert("Please Click on The 'Show Buses' Button First !!" );
        });
    
});



$(document).ready(function(){
    
    $("#btn_route").click(function() {
        find_route_id();
    });
    
});


//Function to find latest GTFS
function latest_gtfs(){
$.ajax({
            async: false,
            url: "https://data.foli.fi/gtfs/",
            success: function(json) {
                
                gtfs = json.latest;       
                //console.log(gtfs);
            },
                //if query fails
            error: function(xhr, textStatus, errorThrown){
                alert('Something is wrong, Server is not responding !');
    }
        });
    
}



// Function to find route id for a line
function find_route_id(){
    
    
     $.each(lines, function(i, obj){
        
         if(document.getElementById('area').value.trim() == obj.route_short_name){
            
            route_id = obj.route_id;
             //console.log(route_id);
            }
     });
    
    
    get_shape();        // retrieve shape id for a line
    get_tripid();       // retrieve driving routes coordinates for a trip
    
}


//find shape id for a line
function get_shape(){
    
    $.ajax({
        url: "https://data.foli.fi/gtfs/v0/"+gtfs+"/trips/route/"+route_id,
        async: false,
        dataType: 'json',
        success: function(json) {
            
            shape = json[0].shape_id.trim();
           //console.log(shape);
        }
    });   
    
}

// return driving routes coordinates and mark in the map
function get_tripid(){
     
    $.getJSON("https://data.foli.fi/gtfs/v0/"+gtfs+"/shapes/"+ shape, function(json){
        
        var coordinates =[];
        
      $.each(json, function(i, obj){
            
             coordinates.push(new google.maps.LatLng(obj.lat, obj.lon));
                 
                                    }); 
        
        //console.log(coordinates.length+" cd");
        initMap();
        
    // draw polylines according to the coordinates
        var patharray = new google.maps.Polyline({
        path: coordinates,
        strokeColor: 'rgb(245, 65, 11)',
        strokeOpacity: 1.5,
        strokeWeight: 6
                                            });
    // mark start coordinates of a line
        var LatLng = new google.maps.LatLng(json[0].lat, json[0].lon);
        var marker = new google.maps.Marker({
          position: LatLng,
          map: map,
            animation: google.maps.Animation.BOUNCE,
        });
        map.panTo(LatLng);
        patharray.setMap(map);
        
        
    });
        
    
}


// Shows driving route
function show_buses(){
    
    // clean all markers and information windows if exist 
        clearmarkers(null);  
        if (info_window) { info_window.close();}
    
    // retrieve live coordinates of vehicle and show in map
        $.ajax({
            async: false,
            url: "https://data.foli.fi/siri/vm",
            success: function(json) {
                
                var status=0;
                $.each(json.result.vehicles, function(i, obj){
                    
                    if(document.getElementById('area').value.trim() == obj.publishedlinename){

                    //mark coordinates in map            
                         addMarker(new google.maps.LatLng(obj.latitude, obj.longitude), "Line <b>"+obj.publishedlinename+"</b>");
                        status =1;


                    }
                
                });        
                
                if(!status){
                    
                    alert("Sorry!! No buses anymore in this route.");
                    status =0;
                }
            },
                //if query fails
            error: function(xhr, textStatus, errorThrown){
                alert('Probably Live Monitoring Server is Not Active Yet !');
    }
        });
    
}


// Add marker into the map and push in array.
      function addMarker(location, line_name) {
        var marker = new google.maps.Marker({
          position: location,
          map: map,
            animation: google.maps.Animation.DROP,
        });
        
          coord.push(marker);
          
        //Open information about location  
           info_window = new google.maps.InfoWindow({
              content: line_name,

              });
            info_window.open(map, marker);
         
      }


// Clear lines position's marker in the route if any exist in the map
    function clearmarkers(map) {
            for (var i = 0; i < coord.length; i++) {
              coord[i].setMap(map);
            }

            coord = [];
          }

