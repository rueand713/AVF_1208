window.addEventListener("DOMContentLoaded", function(){
    
    var height = window.innerHeight;
    
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
        navigator.notification.alert(msg, func, title, btnval);
    };    
    
    
    // set height based on visible browser screen size
    styl("article", String(height * 0.90) + "px", "resize-y");
    
    // sets the event to send a custom notification
    evt(find("clickMe").$id(), "click", function(){
            var msg = find("alert-msg").$id().value.split("/");
            notify(msg[0], null, msg[1], msg[2]);
        }).make();
});