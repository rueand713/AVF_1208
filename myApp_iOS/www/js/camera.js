var height = window.innerHeight;

document.addEventListener("deviceready", onDeviceReady, false);
window.addEventListener("DOMContentLoaded", rooScript);

    function onDeviceReady() {
        var opts = {quality: 50,
                    destinationType: 1,
                    sourceType: 2,
                    encodingType: 0,
                    allowEdit: true,
                    targetWidth: 120,
                    targetHeight: 120
                    };
        
        navigator.camera.getPicture(success, fail, opts);
    };
    
    function success(imageURI) {
      _attribute(find("img").$tag(1), ["src", imageURI], "set");
    };
    
    function fail(err) {
            var ermsg = "Error encountered! \n";
            
            for (var n in err) {
                ermsg += n + ":" + err[n] + "\n";
            };
            
            styl("p", ermsg, "innertx");
    };
    