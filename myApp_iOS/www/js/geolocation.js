// globals
    var lat, lon,
	height = window.innerHeight;
	    

document.addEventListener("deviceready", onDeviceReady, false);
window.addEventListener("DOMContentLoaded", rooScript);
    
    function onDeviceReady() {
	var adrbtn = find("addr-but").$id(),
            adr = find("usr-addr").$id();
	    
	// get location
        var opts = {timeout: 5000, enableHighAccuracy: true};	
        alert("Searching for location...");
        navigator.geolocation.getCurrentPosition(success, fail, opts);
	
	// set the "map it" click function
        evt(adrbtn, "click", function(){
            var to = adr.value.replace(" ", "+", "gi");
            
            // verifies that something was input before proceeding
            if (adr.value != null && adr.value != "") {
                
                // if the latitude and longitude were never set
                if (lat != undefined && lon != undefined) {
                    var mapPos = "http://maps.googleapis.com/maps/api/staticmap?" +
                                 "size=320x240&maptype=roadmap" +
                                 "&markers=color:blue%7Clabel:A%7C"+ lat + "," + lon +
                                 "&markers=color:blue%7Clabel:B%7C" + to +
                                 "&path=color:0x0000ff|weight:5|" +
                                 lat + "," + lon + "|" + to + "&sensor=false";
                    
                    // finds the image and resets its source attribute
                    _attribute(find("img").$tag(1), ["src", mapPos], "set");
                };
            } else {
    
                // alert nothing was input
                alert("Please enter a valid address.");
            };
            
        }).make();
    };

	    
    // geo-location success callback
    function success(position){
        
        // sets the map div to show
        styl("#loc-sec", "block", "show");
        
        // sets the latitude and longitude values for global usage
            lat = position.coords.latitude;
            lon = position.coords.longitude;
        
        var target = find("geo-loc").$id(),
            mapPos = "http://maps.googleapis.com/maps/api/staticmap?center=" +
                     lat + "," + lon + "&zoom=15&size=320x240&maptype=roadmap" +
                     "&markers=color:blue%7Clabel:A%7C"+ lat + "," + lon + "&sensor=true";
                     
        // create the google map with the passed in map position values
        if (find("img").$tag().length < 1) {
            _element(target, "img", ["src", mapPos], "make");
        };
    };
    
    
    // geo-location error callback
    function fail(error) {
        var ermsg = error.message,
            ercode = error.code;
            
            // alert the error code and message
            alert("ERROR: " + ercode + " // " + ermsg);
    };
    
	
    function rooScript() {
	// set height based on visible browser screen size
	styl("article", String(height * 0.90) + "px", "resize-y");
    };