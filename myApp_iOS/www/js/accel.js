var height = window.innerHeight,
    watchID;

document.addEventListener("deviceready", onDeviceReady, false);
window.addEventListener("DOMContentLoaded", rooScript);

    function onDeviceReady(){
        alert("Position is being watched!");
        
        // set the accelerometer watch pos
        watchID = navigator.accelerometer.watchAcceleration(succAcc, failAcc, {frequency: 1000});
    };

    // accelerometer success callback
    function succAcc(accel) {
        var x = accel.x,
            y = accel.y,
            z = accel.z;
            
            styl("#x-pos", "X-Accel: " + x, "innertx");
            styl("#y-pos", "Y-Accel: " + y, "innertx");
            styl("#z-pos", "Z-Accel: " + z, "innertx");
    };
    
    
    // accelerometer fail callback
    function failAcc(err) {
        alert("An error occurred!");
        
        for (var n in err) {
            _element(find("ul").$tag(1), "li", ["id", n], "make");
            styl("#"+n, err[n], "innertx");
        };
    };