var map;


// funtion to load google map
function initMap() {
        // Create a map object and specify the DOM element for display.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8,
        });   
      }  



// grab location information, mark into map, store in localstorage on click in search button.
$(document).ready(function(){
    
    ShowHistory(); // load previous location history
    var count = 1;
    
    $("#srch").click(function(){
        
        var country_name = document.getElementById('area').value.trim();
        
        var country = document.getElementById('area').value.trim();
        
        if (country == "Finland")
            country = "fi";
        if (country == "Sweden")
            country = "se";
        if (country == "Germany")
            country = "de";
        if (country == "France")
            country = "fr";
        
        var ZipCode = document.getElementById('zip').value.trim();
        
       
    // load location information from Zippopotam API
        $.get( "http://www.zippopotam.us/" + country + "/" + ZipCode, function(data, status){
           
            var table = document.getElementById("json-response");
            
            if(count != 1)
                {
                    while(count != 1){
                        table.deleteRow(count-1);
                    count = 1;
                        }
                }
            
            
        // once grabbed insert location info into table and show.
            var row = table.insertRow();
                row.insertCell().innerHTML = data['places'][0]['place name'];
                row.insertCell().innerHTML = data['places'][0]['longitude'];
                row.insertCell().innerHTML = data['places'][0]['latitude'];
                count++;
                
        //map in google and mark
            var LatLng = new google.maps.LatLng(data['places'][0]['latitude'], data['places'][0]['longitude']);
            
            var marker = new google.maps.Marker({
            position: LatLng,
            map: map,
            title: data['places'][0]['place name'],
            animation: google.maps.Animation.BOUNCE,
                                            });
            map.panTo(LatLng);
            
            StoreHistory(country_name, ZipCode); // store history
            ShowHistory();
            
        }).fail(function(){
            alert ("ops !! Wrong zip code or country."); });
        
    });
});


// function to load last searched country and Zip from localstorage
function StoreHistory(country, zip ){
    
    if(typeof(Storage) !== "undefined") {
        
        localStorage.setItem(country, zip);
        
    }
    else {
        alert("No storage available for this browser !!");
    }
    
}

// function to store successful location info in localstorage
function ShowHistory(){
    if(localStorage.length != 0){
        
        var history = document.getElementById("history");
        history.innerHTML = "";
        
        for (i = 0; i < 10; i++) {
            
                    if(i<localStorage.length){
                    var key = localStorage.key(i);
                    history.innerHTML += "<li>" + key +"  --  "+ localStorage.getItem(key) + "</li>";
                    
                    }
        }
        
    }
}