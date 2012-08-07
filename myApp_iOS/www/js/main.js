window.addEventListener("DOMContentLoaded", function(){
    
    function success(position){
        var target = find("geo-loc").$id(),
            lat = position.coords.latitude,
            lon = position.coords.longitude,
            mapPos = "http://maps.googleapis.com/maps/api/staticmap?center=" +
                     lat + "," + lon + "&zoom=15&size=320x240&maptype=roadmap" +
                     "&markers=color:blue%7Clabel:A%7C"+ lat + "," + lon + "&sensor=true";
                     
        // create the google map with the passed in map position values
        _element(target, "img", ["src", mapPos], "make");
    };
    
    function fail(error) {
        var ermsg = error.message,
            ercode = error.code;
            
            // alert the error code and message
            alert("ERROR: " + ercode + " // " + ermsg);
    };
    
    function setEvents() {
        var fitLink = "https://rueand713.cloudant.com/myfitapp/_design/fitapp/index.html",
            wk1Link = "discussion1.html",
            fitId = find("my-fitness").$id(),
            wk1 = find("discuss-wk1").$id();
        
        // create new window when the "My Fitness" button is clicked
        evt(fitId, "click", function(){
           window.open(fitLink, "MY Fitness");
        }).make();
        
        // create a new window for the first week discussion
        evt(wk1, "click", function(){
           window.open(wk1Link, "Discussion 1");
        }).make();
    };
    
    // set CRUD navigation events
    setEvents();
    
    // get location
    navigator.geolocation.getCurrentPosition(success, fail);
});