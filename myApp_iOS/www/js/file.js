document.addEventListener("deviceready", onDeviceReady, false);
var text = [],
    mode = "new";

    function onDeviceReady() {
        
        // load previously saved data when device is ready
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(filesystem){
                filesystem.root.getFile("notes.txt", {create: true}, function(entry){
                                entry.file(initLoader, sysFail);
                }, sysFail);        
        }, sysFail);
        
        // onclick of the save note button - save new note data
      evt(find("input").$tag(1), "click", function(){
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, sysSucc, sysFail);
      }).make();
      
      
      // onclick of the edit note button - check save mode (edit/new)
      // change button values to match mode and populate the textarea with saved data when in edit
      // or clear the textarea when in new mode
      evt(find("input").$tag(2), "click", function(){
            if (mode == "new") {
            var stringtext = text.join(" | ");
            
            find("textarea").$tag(1).value = stringtext;
            find("input").$tag(1).value = "Edit Note";
            find("input").$tag(2).value = "Cancel";
            mode = "edit";
            }
            else if (mode == "edit") {
                find("textarea").$tag(1).value = "";
                find("input").$tag(1).value = "Add Note";
                find("input").$tag(2).value = "Edit Note";
                mode = "new";
            };
            
      }).make();
    };
    
    
    // error callback for the filesystem
    function sysFail(error) {
        var tFile = "",
            z = 0;
        
        for (var n in error) {
            tFile += "n: " + error[n] + "\n";
            _element(find("fs-console").$id(), "li", ["id", z], "make");
            styl("#"+z, tFile, "innertx");
            z++
        };
        
        styl("#fs-console", tFile, "innertx");
    };
    

    // success callback for the filesystem
    function sysSucc(filesystem) {

        filesystem.root.getFile("notes.txt", {create: true}, initWriter, sysFail);
    };
    
    
    // success callback for file getting
    function initWriter(filedata){
        // init file writer object
        filedata.createWriter(writer, sysFail);
    };
    
    
    // success callback for file loading
    function initLoader(data) {
        var reader = new FileReader();
        
        reader.onloadend = function(file) {
            text = file.target.result.split(" | ");
            
            for (var i = 0; i < text.length; i++) {
                _element(find("fs-console").$id(), "li", ["id", i], "make");
                styl("#"+i, text[i], "innertx");
            };
        };
        
        reader.readAsText(data);
    };
    
    
    // Writes the data to the text file
    function writer(writeNote) {
        var note = find("textarea").$tag(1).value,
            reps = Math.ceil(note.length / 140);
        
        // if the note is longer than 140 characters automatically
        // creates multiples notes and appends them
        if (mode == "new") {
                for (var i=0; i<reps; i++) {
                        var noteClone = note.substring(140*i, note.length);
                        
                        // truncates the note value for appending
                        noteClone = noteClone.substring(0, 140);
                        // seeks to end of file
                        writeNote.seek(writeNote.length);
                        // appends the new note with a pipe separator
                        writeNote.write(" | " + noteClone);
                };
        }
        else if (mode == "edit") {
                  // seeks to start of file
                writeNote.seek(0);
                // appends the new note with a pipe separator
                writeNote.write(note);    
        };
        
        window.location.reload();
    };