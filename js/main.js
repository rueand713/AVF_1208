window.addEventListener("DOMContentLoaded", function(){
    
    
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
});