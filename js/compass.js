var watchID,
    height = window.innerHeight;

document.addEventListener("deviceready", onDeviceReady, false);
window.addEventListener("DOMContentLoaded", rooScript);


    function onDeviceReady(){
        var opts = {frequency: 2000};
        alert("Heading being watched!");
        watchID = navigator.compass.watchHeading(compSucc, compFail, opts);
    };
    
    function compSucc(heading){
        var phead = "",
            deg = heading.magneticHeading,
            comImg = find("compass-img").$id();
            
        // determine image to use based on the degree deg variable
            if (deg >= 11 && deg < 81) {
                // NE 10 - 80
                _attribute(comImg, "style=background-position: 180px 0px", "set");
            } 
            
            else if (deg >= 81 && deg < 101) {
                // E 81 - 100
                _attribute(comImg, "style=background-position: 365px 0px", "set");
            }
            
            else if (deg >= 101 && deg < 171) {
                // SE 101 - 170
                _attribute(comImg, "style=background-position: 550px 0px", "set");
            }
            
            else if (deg >= 171 && deg < 191) {
                // S 171 - 190
                _attribute(comImg, "style=background-position: 735px 0px", "set");
            }
            
            else if (deg >= 191 && deg < 261) {
                // SW 191 - 260
                _attribute(comImg, "style=background-position: 920px 0px", "set");
            }
            
            else if (deg >= 261 && deg < 281) {
                // W 261 - 280
                _attribute(comImg, "style=background-position: 1105px 0px", "set");
            }
            
            else if (deg >= 281 && deg < 350) {
                // NW 281 - 349
                _attribute(comImg, "style=background-position: 1290px 0px", "set");
            }
            
            else {
                // N 350 - 10
                _attribute(comImg, "style=background-position: 0px 0px", "set");
            };

        
        // create a dynamic string of location stats
        for (var n in heading) {
            phead += String(n + ":" + heading[n] + "\n");
        };
        
        // fill the paragraph with the compass stats
        styl("p", ("Current heading is " + phead), "innertx");
        
        
    };
    
    function compFail(err){
        var errmsg = "Error! \n";
        
        for (var n in err) {
                errmsg += n + ": " + err[n] + "\n";
        };
        
        navigator.compass.clearWatch(watchID);
        styl("p", errmsg, "innertx");
    };