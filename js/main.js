var height = window.innerHeight,
    width = window.innerWidth,
    cloudData = [55, -0.15],
    cloudPause = [false, true];

window.addEventListener("DOMContentLoaded", function(){
    
    // foreground setting
    function setFg() {
        
        /*// show the foreground section
    	styl("#foreground", "block", "show");
    	
    	for (var i=0; i<5; i++) {
    	styl("#c"+(i+1), "inline", "show");
    	};*/
        
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
            wk2Link = "discussion2.html",
            alertLink = "notifications.html",
            geoLink = "geolocation.html",
            accLink = "accelerometer.html",
            fitId = find("my-fitness").$id(),
            geoId = find("geoloc").$id(),
            alertId = find("alerts").$id(),
            accId = find("accelero").$id(),
            wk1 = find("discuss-wk1").$id(),
            wk2 = find("discuss-wk2").$id();
        
        // create new window when the "My Fitness" button is clicked
        evt(fitId, "click", function(){
           window.open(fitLink, "MY Fitness");
        }).make();
        
        // create a new window for the first week discussion
        evt(wk1, "click", function(){
           window.open(wk1Link, "Discussion 1");
        }).make();
        
        // create a new window for the first week discussion
        evt(wk2, "click", function(){
           window.open(wk2Link, "Discussion 2");
        }).make();
        
        evt(alertId, "click", function(){
            window.open(alertLink, "Notification Feature");
        }).make();
        
        evt(accId, "click", function(){
            window.open(accLink, "Accelerometer Feature");
        }).make();
        
        evt(geoId, "click", function(){
            window.open(geoLink, "Geolocation Feature");
        }).make();
        
        
        // checks the screensize can support the cloud graphics
        if ((width * 1) > 540) {
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
            
        };

    };
    
    
// Function calls
    
    // set height based on visible browser screen size
    styl("article", String(height * 0.90) + "px", "resize-y");
    
    // set FG images
    if ((width * 1) > 540) {setFg()};
    
    // set CRUD navigation events
    setEvents();

});