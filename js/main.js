var height = window.innerHeight,
    width = window.innerWidth,
    lat, lon, cloudData = [55, -0.15],
    cloudPause = [false, true];

window.addEventListener("DOMContentLoaded", function(){
    
    // alert function takes an array as first argument or all 4 arguments
    function notify(msg, func, title, btnval) {
        
        // if msg is an array of properties
        if (typeof(msg) == "object") {
            func = msg.callback;
            title = msg.title;
            btnval = msg.btnval;
            msg = msg.msg;
        }
        else {
            // if arguments are missing sets defaults
            if (!msg || typeof(msg) != "string") {msg = "An error occurred!"};
            if (!func || typeof(func) != "function") {func = function(){}};
            if (!title || typeof(title) != "string") {title = "Exception"};
            if (!btnval || typeof(btnval) != "string") {btnval = "Done"};
        };
        
        // sets the notification
        /*navigator.notification.*/alert(msg, func, title, btnval);
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
    
    
    // foreground setting
    function setFg() {
        
        // fetches the cloud divs
        var cDivs = sel("div#cloud-wrapper > div");
        
        // for each cloud div the loop will run and set a background image
        for (var i=0; i < cDivs.length; i++) {
            
            // fetches and sets the value of the class attribute for the current cloud div
            // splits the string at the white space and sets the second index to the clouds variable
            // x determines the cloud image to set based on the logic that the image is 120 x i pixels from
            // the start of the previous div image with 10 pixels in between
            var classAttr = _attribute(cDivs[i], "class", "get"),
                clouds = classAttr.split(" ")[1],
                x = (i * 120) + (i * 10);
                
                // verifies the element has the "cloud[i]" class
                if (clouds == ("cloud" + (i+1))) {
                    
                    // sets the "style" property for the div element
                    _attribute(cDivs[i], "style=background-position:" + x + "px 0px", "set");
                };
        };
    };
    
    
    // navigational events
    function setEvents() {
        var fitLink = "https://rueand713.cloudant.com/myfitapp/_design/fitapp/index.html",
            wk1Link = "discussion1.html",
            fitId = find("my-fitness").$id(),
            geoId = find("geoloc").$id(),
            alertId = find("alerts").$id(),
            wk1 = find("discuss-wk1").$id(),
            adrbtn = find("addr-but").$id(),
            adr = find("usr-addr").$id();
        
        // create new window when the "My Fitness" button is clicked
        evt(fitId, "click", function(){
           window.open(fitLink, "MY Fitness");
        }).make();
        
        // create a new window for the first week discussion
        evt(wk1, "click", function(){
           window.open(wk1Link, "Discussion 1");
        }).make();
        
        // set the click function for geo-location
        evt(geoId, "click", function(){
            // get location
            navigator.geolocation.getCurrentPosition(success, fail);    
        }).make();
        
        evt(alertId, "click", function(){
            notify("To test a real notification \n "+
                   "Submit a null value into the 'Map It' feature.", null, "Test Alert", "OK");    
        }).make();
        
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
                
                var err = {
                    msg: "Please enter a valid address",
                    callback: function(){},
                    title: "Oops!",
                    btnval: "Done"
                };
                
                // alert nothing was input
                notify(err);
            };
            
        }).make();
        
        
        // sets the mouseover event for the moving cloud
        evt(find("c5").$id(), "mouseover", function(){
            
            // checks if pause is set or unset
            // takes action based on that logic
            if (cloudPause[0] === false && cloudPause[1] === true) {
                // pause
                cloudPause[0] = true;
            }
            else if (cloudPause[0] === true && cloudPause[1] === true) {
                // unpause
                cloudPause[0] = false;  
            };
            
            // prevents multiple hovering events from firing by setting the pause to false
            cloudPause[1] = false;
            
            // set a callback function to allow pausing of the cloud again
            // after 1/4 of a second wait
            timr(250, false, function(){
                // sets the pause available to true
                cloudPause[1] = true;    
            });
        }).make();

    };
    
    
// Function calls
    
    // set height based on visible browser screen size
    styl("article", String(height * 0.90) + "px", "resize-y");
    
    // set FG images
    setFg();
    
    // set CRUD navigation events
    setEvents();
    
    // set the 5th cloud movement
        timr(20, true, function(){
              if (cloudPause[0] === false) {
                    var cloudMov = find("c5").$id(),
                      nWid = window.innerWidth;
                      
                 // tracks the cloud movement and direction
                 // sets the clouds left position to the value stored in the cloud data
                  cloudData[0] += cloudData[1];
                  cloudMov.style.left= String(cloudData[0] + "%");
                  
                  // if the cloud goes out of the screen reset the direction
                  if (cloudMov.offsetLeft < -50) {
                    //cloudData[0] = 0;
                    cloudData[1] = 0.15;
                  }
                  else if (cloudMov.offsetLeft >= (nWid * 0.91)) {
                    //cloudData[0] = 91;
                    cloudData[1] = -0.15;
                  };
              };
        });

});