window.addEventListener("DOMContentLoaded", function(){
    
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
    function failAcc() {
        alert("An error occurred!");
    };
    
    
    var height = window.innerHeight;
    
    // set height based on visible browser screen size
    styl("article", String(height * 0.90) + "px", "resize-y");
    
    // set the accelerometer watch pos
    navigator.accelerometer.getCurrentAcceleration(succAcc, failAcc, {frequency: 1000});
});