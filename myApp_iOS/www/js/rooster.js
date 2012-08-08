/*
    Author: Rueben Anderson
    Date: 03/12/2012
    Title: Rooster.js
        Rooster is a library to simplify manipulation of data and various dom elements and thus
        simplify development and shorten design time. v.1.4.0
    
    Revised: 06/13/2012
*/


// System global variables
    var roo, sel, dat$, dom$, timr, evt, styl,
	ctaMemory = [undefined],
	ctaTimer;
	
    /*
	Public function declarations
    */
    
     // reference accessor method
     function find(x) {
	
	// returns reference to dom object by id "x"
       function _id(z) {
	    if (!z) {
		z = document.getElementById(x);
	    }
	    else {
		var idTags = [];
		var tags = document.getElementsByTagName("*");
		for (var i = 0; i < tags.length; i++) {
		    var id = _attribute(tags[i], "id", "get");
		    if (x == id) {
			idTags.push(tags[i]);
		    };
		};
		
		if (typeof(z) == "number") {
		    z = idTags[z-1];
		}
		else {
		  z = idTags;  
		};
	    };
	    
	   return z;    
       };
       
       // returns reference to dom object by tag "x"
       function _tag(z) {
	    if (z && typeof(z) == "number") {
		z = document.getElementsByTagName(x)[z-1]; 
	    }
	    else {
		z = document.getElementsByTagName(x);
	    };
	   
	   return z;  
       };
       
       function _node(z) {
	    var returnVal;
		
	    if (z && typeof(z) == "number") {
		var nodeText;
		    
		switch(x.substring(0,1)) {
		    case "#":
			x = x.substring(1, x.length);
		//	nodeText = find(x).$id(z).childNodes[0].nodeValue;
		//	break;
		    
		    default:
			nodeText = find(x).$tag(z).childNodes[0].nodeValue;
			returnVal = nodeText;
			break;
		};
	    }	else if (!z) {
		var nodeArr = [],
		    node = [];
		
		switch (x.substring(0, 1)) {
		  case "#":
		    x = x.substring(1, x.length);
		  
		  default:
		    nodeArr = find(x).$tag();
		    for (var i=0; i<nodeArr.length; i++) {
		      node.push(nodeArr[i].parentNode);
		    };
		    returnVal = node;
		    break;
		};
	    };
	    return node;
       };
       
       return {
	$id: _id,
	$tag: _tag,
	$node: _node
       };
     };
     
     // mode determines the manner by which the random number will be generated (rounded or not).
     // x is the base value of which the random number is generated. n is a base number offset for creating
     // specified ranged randomized numbers. the random number is equal to: n to x + n - 1
     function _random(mode, x, n) {
	var value;
	
	// if n is not defined set it to 0
	if (!n) {
	    n = 0;
	};
	
	// 'ceil' always rounds the value up, 'floor' always rounds the value down.
	// 'round' rounds up or down: < 5 hundredths goes down, while >= 5 hundredths goes up.
	// if no match is found a random non rounded value is generated.
	switch(mode) {
	  case "ceil":
	    value = Math.ceil((Math.random() * x) + n);
	    break;
	
	  case "floor":
	    value = Math.floor((Math.random() * x) + n);
	    break;
	
	  case "round":
	    value = Math.round((Math.random() * x) + n);
	    break;
	  
	  default:
	    value = (Math.random() * x) + n;
	    break;
	};
	
	return value;
     };
    
    // target is a reference to a dom element, option is a dom id to check when getting,
    // or option is an array object with the dom id in index 0 and the value to give in index 1
    // mode determines the action to be taken either "get" or "set"
    function _attribute(target, option, mode) {
        var attr = 1;
        
        switch(mode) {
          case "get":
            if (target) {
		attr = target.getAttribute(option);
	    };
            break;
        
	  case "set":
	    if (typeof(option) != "object") {
		option = option.split("=");
	    };
	    
	    if (target && option != null) {
		target.setAttribute(option[0], option[1]);
	    };
	    break;
        
          default:
            break;
        };
        
        return attr;
    };
    
    // target is a reference to a dom element, element is either a dom element to be created when mode is "make"
    // or it is either a dom reference by id (# prefixed) or tag name (no prefix). mode is "make" or "delete". option is an array of
    // dual index array of strings. Index 0 is the attribute to set and index 1 is the value. option may be empty string when mode is delete.
    function _element(target, element, option, mode) {
	switch(mode) {
	    case "make":
		element = document.createElement(element);
		for (var n = 0; n < option.length; n++) {
		    _attribute(element, option, "set");
		};
		
		if (target) { 
		    target.appendChild(element);
		};
		break;
	    
	    case "remove":
		if (element.substring(0, 1) == "#") {
		    element = element.substring(1, element.length);
		    if (target && find(element).$id()) {
			target.removeChild(find(element).$id());
		    };
		}
		else {
		    element = find(element).$tag();
		    for (var n = 0; n < element.length; n++) {
			if (target && element) {
			    target.removeChild(element[n]);
			};
		    };
		};
		break;
	    
	    default:
		break;
	};
    };
    
    // target is a reference to a dom element, option is the data to be set,
    // mode determines the action to be taken by passing in what the target is manipulating.
    function _style(target, option, mode) {
          switch (mode) {
            case "bg-color":
	    case "bgcolor":
	    case "background-color":
	    case "backgroundcolor":
                target.style.backgroundColor = option;
                break;
            
            case "bg-image":
	    case "bgimage":
	    case "background-image":
	    case "backgroundimage":
                target.style.backgroundImage = option;
                break;
            
            case "full-background":
	    case "full-bg":
	    case "fullbg":
	    case "fullbackground":
                target.style.background = option;
                break;
            
            case "full-border":
	    case "fullborder":
	    case "full-bd":
	    case "fullbd":
                target.style.border = option;
                break;
            
            case "bd-style":
	    case "bdstyle":
	    case "border-style":
	    case "borderstyle":
                switch(option.substring(0,1)) {
                    case "@":
                        option = option.substring(1, option.length);
                        option = option.split(" ");
                        
                        switch(option[0]) {
                          case "right":
                            target.style.borderRight = option[1];
                            break;
                          
                          case "left":
                            target.style.borderLeft = option[1];
                            break;
                        
                          case "top":
                            target.style.borderTop = option[1];
                            break;
                        
                          case "bottom":
                            target.style.borderBottom = option[1];
                            break;
                        
                          default:
                            break;
                        };
                        break;
                    
                    default:
                        target.style.borderStyle = option;
                        break;
                    
                };
                break;
            
	    case "bd-width":
	    case "bdwidth":
	    case "border-width":
            case "borderwidth":
                target.style.borderWidth = option;
                break;
            
	    case "bd-color":
	    case "bdcolor":
	    case "border-color":
            case "bordercolor":
                target.style.borderColor = option;
                break;
            
	    case "bd-radius":
	    case "bdradius":
	    case "border-radius":
            case "borderradius":
                target.style.borderRadius = option;
                break;
            
	    case "full-family":
	    case "fullfamily":
	    case "full-fam":
            case "fullfam":
                target.style.font = option;
                break;
            
	    case "ft-color":
	    case "ftcolor":
	    case "font-color":
            case "fontcolor":
                target.style.color = option;
                break;
            
	    case "ft-size":
	    case "ftsize":
	    case "font-size":
            case "fontsize":
                target.style.fontSize = option;
                break;
            
	    case "ft-family":
	    case "ftfamily":
	    case "font-family":
            case "fontfamily":
                target.style.fontFamily = option;
                break;
            
	    case "ft-style":
	    case "ftstyle":
	    case "font-style":
            case "fontstyle":
                target.style.fontStyle = option;
                break;
            
            case "display":
	    case "show":
                target.style.display = option;
                break;
            
            case "visibility":
	    case "hide":
                target.style.visibility = option;
                break;
            
	    case "full-resize":
	    case "fullresize":
	    case "resize-xy":
            case "resizexy":
                option = option.split(" ");
                target.style.width = option[0];
                target.style.height = option[1];
                break;
            
	    case "resize-x":
            case "resizex":
                target.style.width = option;
                break;
            
            case "resize-y":
	    case "resizey":
                target.style.height = option;
                break;
            
	    case "line/letter/word":
	    case "lineletterword":
            case "line-letter-word":
                option = option.split(" ");
                target.style.lineHeight = option[0];
                target.style.letterSpacing = option[1];
                target.style.wordSpacing = option[2];
                break;
            
	    case "liney":
            case "line-y":
                target.style.lineHeight = option;
                break;
            
	    case "letter-x":
            case "letterx":
                target.style.letterSpacing = option;
                break;
            
            case "word-x":
	    case "wordx":
                target.style.wordSpacing = option;
                break;
            
            case "padding":
                switch(option.substring(0,1)) {
                    case "@":
                        option = option.substring(1, option.length);
                        option = option.split(" ");
                        
                        switch(option[0]) {
                            case "top":
                                target.style.paddingTop = option[1];
                                break;
                            
                            case "bottom":
                                target.style.paddingBottom = option[1];
                                break;
                            
                            case "left":
                                target.style.paddingLeft = option[1];
                                break;
                            
                            case "right":
                                target.style.paddingRight = option[1];
                                break;
                            
                            default:
                                break;
                        };
                        break;
                    
                    default:
                        target.style.padding = option;
                        break;
                };
                break;
            
            case "margin":
                switch(option.substring(0,1)) {
                    case "@":
                        option = option.substring(1, option.length);
                        option = option.split(" ");
                        
                        switch(option[0]) {
                            case "top":
                                target.style.marginTop = option[1];
                                break;
                            
                            case "bottom":
                                target.style.marginBottom = option[1];
                                break;
                            
                            case "left":
                                target.style.marginLeft = option[1];
                                break;
                            
                            case "right":
                                target.style.marginRight = option[1];
                                break;
                            
                            default:
                                break;
                        };
                        break;
                    
                    default:
                        target.style.margin = option;
                        break;
                };
                break;
            
	    case "full-text":
	    case "fulltext":
	    case "full-tx":
            case "fulltx":
                option = option.split(",");
                target.style.textDecoration = option[0];
                target.style.textAlign = option[1];
                target.style.textShadow = option[2];
                target.style.textTransform = option[3];
                break;
            
	    case "tx-decoration":
	    case "textdecoration":
	    case "text-decoration":
            case "txdecoration":
                target.style.textDecoration = option;
                break;
            
	    case "tx-align":
            case "txalign":
	    case "text-align":
	    case "textalign":
                target.style.textAlign = option;
                break;
            
	    case "tx-shadow":
	    case "txshadow":
	    case "text-shadow":
            case "textshadow":
                target.style.textShadow = option;
                break;
            
	    case "tx-transform":
	    case "txtransform":
	    case "text-transform":
            case "texttransform":
                target.style.textTransform = option;
                break;
	    
	    case "tx-inner":
	    case "txinner":
	    case "innertx":
	    case "inner-tx":
		target.innerHTML = option;
		break;
        
            default:
		_attribute(target, option, "set");
                break;
          };
    };

window.addEventListener("DOMContentLoaded", function(){
    
    
    // library constructor
    function $$(){
        
        
	/*
	    Private function declarations
	*/
	function createXHR() {    
	    var xhr = false;
	    
	    // Check if the current browser is IE and sets the xhr to use one of the
	    // two ActiveXObject variants available to that browser.
	    try {
	      xhr = new ActiveXObject("Msxml2.XMLHTTP");
	    }
	    catch (e) {
	      try {
		 xhr = newActiveXObject("Microsoft.XMLHTTP");
	      }
	      catch (e2) {
		 xhr = false;
	      };
	    };
	      
	      // Checks if the xhr failed to initialize as an ActiveXObject. If it did
	      // the browser is none microsoft and the xhr is set using XMLHttpRequest() 
	      if (!xhr && typeof(XMLHttpRequest) != "undefined") {
		    xhr = new XMLHttpRequest();
	      };
	      
	      return xhr;
	 };
	 
	 
	 function sendRequest(dataSet, scriptFile) {
      
	    var newRequest = roo.data.makexhr(),
		dateX = new Date().getTime(),
		returnData = "";
      
	    newRequest.open("Post", (scriptFile + "?timeStamp=" + dateX), false);
	    newRequest.send(JSON.stringify(dataSet));
      
	
	       if (newRequest.readyState == 4 && newRequest.status == 200) {
		  console.log("Request Sent Successfully, No errors reported!");
		  returnData = newRequest.responseText;
	       }
	       else {
		   console.log("Not sent successfully");
		   console.log(" Ready State: " + newRequest.readyState);
		   console.log(newRequest.responseText);
		   returnData = false;
	       };
      
	      return returnData;
	   };

	   
        // Accepts 3 arguments that determine the type of stylizing to apply
        // to a specific or group of targetted elements. x is a string with an element id or
        // an array with an element tag and id in index 0 and 1 respectively. mode holds the instructions of
        // the type of stylizing to apply to x. option is the actual styles to apply.
        function getStyleArgs(x, option, mode){
	      var selectors = roo.data.sel(x);
	      for (var i=0; i<selectors.length; i++){
		    _style(selectors[i], option, mode);
		  }
	  };
	
	
	// Takes a string argument passed in with delimiters to create an array of
	// html tag elements that fit the extracted criteria of the "x" argument.
	// The criteria is based on html tags, tags with ids, tags with classes, tags
	// with pseudo-classes or all of them. When a parent child condition is present
	// only those elements that are immediate descendents are "selected"
	function selecter(x) {
	    x = roo.dom.extract(x);
	    var $p = x[3],
	        tarTag,
		exTags = find(x[4]).$tag(),
		selectors = [];
	    
	    if (x[4]) {
	       tarTag = find(x[4]).$node();
	    };
	    
	    // filters the passed in tag based on the passed in arguments
	    // to determine the type of pseudo-class conditional. filters by "first-child",
	    // "last-child", or a numeric value representing the node to return
	    function checkPseudo(tags, _att1, _att2) {
		var pseudotags = [];
		for (var n = 0; n < tags.length; n++) {
		    if (_att1 != undefined && _att2 != undefined) {
			var tar1 = _attribute(tags[n], _att1, "get"),
			    tar2 = _attribute(tags[n], _att2, "get");
			if (tar2 == x[1] && tar1 == x[2]) {
			    pseudotags.push(tags[n]);
			};
		    }
		    else if (_att1 != undefined && _att2 == undefined) {
			var tar = _attribute(tags[n], _att1, "get");
			if (tar == x) {
			    pseudotags.push(tags[n]);
			};
		    }
		    else {
			    pseudotags.push(tags[n]);
		    };
		};
		switch($p) {
		    case "first-child":
			tags = [pseudotags[0]];
			break;
		    
		    case "middle-child":
			tags = [pseudotags[Math.round((pseudotags.length-1) / 2)]];
			break;
		    
		    case "last-child":
			tags = [pseudotags[pseudotags.length-1]];
			break;
		    
		    default:
			tags = [pseudotags[roo.data.realnumber($p)-1]];
			break;
		};
		
		return tags;
	    };
	    
	    
	      // targets all of the dom elements of the specified tag
	      if (x[1] == undefined && x[2] == undefined) {
		  if (x[0] == undefined || x[0] == "") {
		      x[0] = "*";
		  };
		  x = find(x[0]).$tag();
		  
		  if ($p != undefined) {
		      x = checkPseudo(x);
		  };
	      
		  // if there is a parent child condition
		  if (tarTag) {
		    for (var i=0; i<tarTag.length; i++) {
		      for (var n = 0; n < x.length; n++) {
			  if (tarTag[i] == x[n]) {
			    selectors.push(exTags[i]);
			  };
		      };
		    };
		  } else {
		    // if there is no parent child condtion
		    for (var n = 0; n < x.length; n++) {
		      selectors.push(x[n]);
		    };
		  }
		  
	      }	// targets all of the dom elements of the specified tag that have a matching id value
	      else if (x[1] != undefined && x[2] == undefined) {
		  if (x[0] == undefined) {
		      x[0] = "*";
		  };
		  var elements = find(x[0]).$tag();
		      x = x[1];
		      
		      if ($p != undefined) {
			  elements = checkPseudo(elements, "id");
		      };
		      
		      // if there is a parent child condtion
		      if (tarTag) {
			for (var i=0; i<tarTag.length; i++) {
			  for (var n = 0; n < elements.length; n++) {
			    var target = _attribute(elements[n], "id", "get");
			    if (target == x && tarTag[i] == elements[n]) {
				selectors.push(exTags[i]);
			    };
			  };
			};
		      } else {
			// if there is not a parent child condition
			for (var n = 0; n < elements.length; n++) {
			    var target = _attribute(elements[n], "id", "get");
			    if (target == x) {
				selectors.push(elements[n]);
			    };
			};
		      };
		      
	      }	// targets all of the dom elements of the specified tag that have a matching class value
	      else if (x[1] == undefined && x[2] != undefined) {
		  if (x[0] == undefined) {
		      x[0] = "*";
		  };
		  var elements = find(x[0]).$tag();
		      x = x[2];
		      
		      if ($p != undefined) {
			  elements = checkPseudo(elements, "class");
		      };
		      
		      // if there is a parent child condition
		      if (tarTag) {
			for (var i=0; i<tarTag.length; i++) {
			  for (var n = 0; n < elements.length; n++) {
			    var target = _attribute(elements[n], "class", "get");
			    if (target == x && tarTag[i] == elements[n]) {
				selectors.push(exTags[i]);
			    };
			  };
			};
		      } else {
			// if there is no parent child condtion
			for (var n = 0; n < elements.length; n++) {
			    var target = _attribute(elements[n], "class", "get");
			    if (target == x) {
				selectors.push(elements[n]);
			    };
			};
		      };
	      }	// targets all of the dom elements of a specified id that have a matching class value
	      else if (x[1] != undefined && x[2] != undefined) {
		  if (x[0] == undefined) {
		      x[0] = "*";
		  };
		  var elements = find(x[0]).$tag();
		      
		      if ($p != undefined) {
			  elements = checkPseudo(elements, "class", "id");
		      };
		      
		      // if there is a parent child condition
		      if (tarTag) {
			for (var i=0; i<tarTag.length; i++) {
			  for (var n = 0; n < elements.length; n++) {
			      var target = _attribute(elements[n], "class", "get"),
				  target2 = _attribute(elements[n], "id", "get");
			      if (tarTag[i] == elements[n]) {
				if (target2 == x[1] && target == x[2]) {
				    selectors.push(exTags[i]);
				};
			      };
			  };
			};
		      } else {
			// if there is no parent child condition
			for (var n = 0; n < elements.length; n++) {
			    var target = _attribute(elements[n], "class", "get"),
				target2 = _attribute(elements[n], "id", "get");
			    if (target2 == x[1] && target == x[2]) {
				selectors.push(elements[n]);
			    };
			};
		      };
		  };
		  
		  return selectors;
        };
        
        
	// target is the dom element id to target. imgLinks is an array of strings of the image paths to use.
	// x and y are strings corresponding to the image width and height sizes to use.
	// freq is the frequency in ms of the image loop. A value of 1000 is 1 second.
	// creates a call-to-action image loop in the targetted element.
	function addCTA(target, imgLinks, x, y, freq) {
	    
	    if (typeof(imgLinks) != "object") {
		imgLinks = imgLinks.split(",");
	    };
	    
	    target = target.substring(1, target.length);
	    
	    // Checks if this is the first run. If so set the var its defaults
	    // if this is not the first run, update the cta index by one check
	    // or if the cta index is out of range revert it to zero
	    if (ctaMemory[0] == undefined) {
		ctaMemory = [0, (imgLinks.length - 1), false];
	    }
	    else {
		ctaMemory[0] += 1;  
	    };
		
	    if (ctaMemory[0] > ctaMemory[1]) {
		    ctaMemory[0] = 0;
	    };
	    
	    // Clears out any data from the cta element tag
	    // Appends a new img element to that cta element tag with the updated href
	    find(target).$id().innerHTML = "";
	    var newImg = document.createElement("img");
	    _attribute(newImg, "src=" + imgLinks[ctaMemory[0]], "set");
	    _attribute(newImg, "width=" + x, "set");
	    _attribute(newImg, "height=" + y, "set");
	    find(target).$id().appendChild(newImg);
	    
	    if (ctaMemory[2] === false) {
		ctaMemory[2] = true;
		ctaTimer = setInterval(function() {
		roo.dom.cta(String("#" + target), imgLinks, x, y)}, freq);
	    };
		
	};
	
	
	// Takes an argument of type string.
	function doUrlCheck(url) {
	    var validOrNot = false,
		re = /^http:\/\/w{3}\.[0-9]*[^_.-?!@#$%&*+,\/\=~`)(><'";:|]+[-.]{0,1}[A-Za-z0-9]*[^_.-?!@#$%&*+,\/\=~`)(><'";:|]+\.[A-Za-z]{2,3}\b|https:\/\/w{3}\.[0-9]*[^_.-?!@#$%&*+,\/\=~`)(><'";:|]+[.-]{0,1}[A-Za-z0-9][^_.-?!@#$%&*+,\/\=~`)(><'";:|]+\.[A-Za-z]{2,3}\b/gi;
	    
	   if (re.test(url)) {
		validOrNot = true;
	    };
	    
	    return validOrNot;
	};
	
	
	// Takes a string as an argument and returns the numbers as number types
	function getRealNumber(str) {
	    var numberLocker = [];
	    
	    // Removes any commas from the string to identify larger numbers.
	    if (str.search(/[,]/) != -1) {
		str = str.replace(",", "", "gi");
	    };
	    
	    // Sets the string match into an array. Matches on common real and non real number formats.
	    // Does not match ratio or fractions.
	    var realNumbers = str.match(/[0-9]*[.][0-9]*|[0-9]*[0-9]/gi);
	    
	    // Iterates through the array and changes the numbers from string to numeric form.
	    // Ignoring lone decimals that seep in.
	    for (var i = 0; i < realNumbers.length; i++) {
		if (realNumbers[i] != ".") {
		    numberLocker.push(realNumbers[i] * 1);
		};
	    };
	    
	    return numberLocker;
	};
	
	
	// Takes 5 string arguments. Whatever arguments are left out will be given present value.
	// Returns an object with the amount of time passed for each category.
	function getElapsedTime(fMonth, fDay, fYear, fHour, fMinutes) {
	    
	    // Set default values for the arguments that failed to have value.
	    if (fMonth == undefined) {
		fMonth = "";
	    };
	    
	    if (fDay == undefined) {
		fDay = "";
	    };
	    
	    if (fYear == undefined) {
		fYear = "";
	    };
	    
	    if (fHour == undefined) {
		fHour = "";
	    };
	    
	    if (fMinutes == undefined) {
		fMinutes = "";
	    };
	    
	    // Set the time variables
	    var futureDate = new Date(),
		currentDate =  new Date(),
		elapsedTime = {
		    days: 0,
		    hours: 0,
		    years: 0
		},
		msInDay = 86400000,		/* Milliseconds in one day */
		msInHour = msInDay / 24,	/* Milliseconds in one hour */
		rE = /\W/;
						    
		if (rE.test(fYear) === false && rE.test(fMonth) === false && rE.test(fDay) === false ) {
		
		// If any information is left out, date information from the current date will be substituted.
		// If the value has been supplied then the futuredate will be updated to reflect that value.
		if (fMonth.length > 0 && fMonth.length <= 2) {
		    futureDate.setMonth(fMonth);
		};
		
		if (fDay.length > 0 && fDay.length <= 2) {
		    futureDate.setDate(fDay);
		};
		
		if (fYear.length == 4) {
		    futureDate.setFullYear(fYear);
		};
		
		if (fHour.length > 0 && fHour.length <= 2) {
		    futureDate.setHours(fHour);
		};
		
		if (fMinutes.length > 0 && fMinutes.length <= 2) {
		    futureDate.setMinutes(fMinutes);
		};
		
		futureDate = Date.parse(futureDate);
		currentDate = Date.parse(currentDate);
		
		/* This function calculates and stores the amount of years, days and hours between 
		now and a future date. The information is stored in properties within an object. */
		
		elapsedTime.days = Math.floor((futureDate - currentDate) / msInDay),
		elapsedTime.hours = Math.floor( ((futureDate - currentDate) - (elapsedTime.days * msInDay)) / msInHour);
	
		if (elapsedTime.days >= 365) {
		    elapsedTime.years = Math.floor(elapsedTime.days / 365)
		    elapsedTime.days -= (365 * elapsedTime.years);
		
		};
		} 
		else {
		    alert("Improper date formats. Syntax: MM, DD, YYYY");
		};
					
		return elapsedTime;
	};
	
	// Takes a string argument representing a date using common format of dd/mm/yyy
	function parseDate(date) {
	    var dateMOD = new Date();
	    
	    // takes the passed in date string and extracts the day, month, and year
	    date = date.split("/");
	    
	    // sets the day, month, and year to the previously constructed date object
	    dateMOD.setDate(date[0]);
	    dateMOD.setMonth(date[1]);
	    dateMOD.setFullYear(date[2]);
	    
	    // date is parsed into MS form
	    date = Date.parse(dateMOD);
	    
	    return date;   
	};
	
	// Takes a string argument and returns a boolean of true or false.
	function doEmailCheck(email) {
	    var validOrNot = false,
		re = /^\w+\.{0,1}\w+[^_.-?!@#$%&*+,\/\=~`)(><'";:|]+@[A-Za-z]+[A-Za-z0-9]*[-.]{0,1}[A-Za-z]+\w+[^_.-?!@#$%&*+,\/\=~`)(><'";:|]+\.[A-Za-z]{2,3}\b/gi,
		re2 = /[^A-Za-z0-9]|[0-9_]/gi;
	    
	    // Tests if the email is in proper format
	    if (re.test(email)) {
		
		// Tests if the first character is a number or special character. 
		if (!(re2.test(email.substring(0,1)))) {
		    
		    // All tests passed, email is valid format.
		    validOrNot = true;
		};
	    };
	
	    return validOrNot;
	};
	
	
	// Takes a string argument and returns a boolean of true or false.
	function doPhoneCheck(pNum) {
	    var validOrNot = false,
		re = /^\d{3}-\d{3}-\d{4}|^\d{1,2}-\d{3}-\d{3}-\d{4}\b/gi;
	    
	    if (re.test(pNum)) {
		validOrNot = true;
	    };
	    
	    return validOrNot;
	};
	
	
	// Takes an array or a number as an argument. Returns a string with all of the values of type number in it.
	function getObjectNumbers(num) {
	    var allNums = [];
	    
	    switch (typeof(num)) {
		
	    case "object":
		// Iterates through the object and captures all of its numeric values as a string.
		for (var i = 0; i < num.length; i++) {
		    
		    switch (typeof(num[i])) {
			
			// if the passed in value is an object calls the function again to obtain
			// the values at its indexes.
			case "object":
			    var moreNums = roo.data.objnumbers(num[i]);
			    allNums.push(moreNums)
			    break;
			
			// capture the numeric value followed by a symbol for split usage.
			case "number":
			    allNums.push(num[i])
			    break;
			
			default:
			    allNums.push(NaN);
			    break;
		    };
		};
		    break;
		
	    case "number":
		// capture the numeric value followed by a symbol for split usage.
		allNums.push(num)
		    break;
	    
	    default:
		allNums.push(NaN);
		break;
	    };
	    
	    // returns a compressed string to be seperated with "|" in the split function.
	    return allNums.join("|");
	};
	
       
       // SortThis is an array of objects; mod is a string with the value of "least" or "greatest".
       // target is a string of the object key name to be targeted for sorting. kind is the type of sort "date", "number", or "string".
       // dates are in mm/dd/yyyy format. string sorting is for alphabetical sorts and number for numeric.
       // Returns an new array with the objects sorted by target.
       function objectSorter(sortThis, mod, target, kind) {
	    var sortKey = [],
		sortKeyDub = [],
		sortThisDub = [],
		sortedValues = [],
		sortLength = sortThis.length;
       
	    // Changes the object name to the function target name
	    var jsond = JSON.stringify(sortThis);
	    
	    for (var z = 0; z < sortLength; z++) {
		jsond = jsond.replace(target, "dtarx");
	    };
	    
	    // SortThis with the target name values changed to dtarx
	    sortThis = JSON.parse(jsond);
	    
	    switch (kind) {
		case "number":
		    for (var i = 0; i < sortThis.length; i++) {
			var numberExtractor = sortThis[i].dtarx;
			
			sortKey.push([numberExtractor, String(i)]);
			sortKeyDub.push([numberExtractor, String(i)]);
		    };
		    break;
		
		case "date":
		    for (var i = 0; i < sortThis.length; i++) {
			// Extracts the individual items of the date and creates a date variable
			var dateExtractor = sortThis[i].dtarx.split("/");
			var newDate = new Date();
			
			// Set the newDate to reflect the passed in month/day/year
			newDate.setFullYear(dateExtractor[2]);
			newDate.setMonth(dateExtractor[0]);
			newDate.setDate(dateExtractor[1]);
			
			// Parses the newly defined date variable to numeric (ms) form.
			// Stores the parsed date in an array and a copy in another.
			newDate = Date.parse(newDate);
			sortKey.push([newDate, String(i)]);
			sortKeyDub.push([newDate, String(i)]);
		    };
		    break;
		
		case "string":
		    var alphaKey = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h",
				    "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
		    
		    // Extracts the string from the array to be compared with the alpha key
		    for (var i = 0; i < sortThis.length; i++) {
			var stringExtractor = sortThis[i].dtarx.toLowerCase();
			var stringValue = "";
			
			// Iterates through the extracted string assigning a numeric value for each character
			// If a special character is found a universal number is assigned to assure it the smallest value
			for (var j = 0; j < stringExtractor.length; j++) {
			    for (var k = 0; k < alphaKey.length; k++) {
				if (stringExtractor.charAt(j) == alphaKey[k]) {
				    stringValue += String(k + 11);
				}
				else if (stringExtractor.charAt(j).search(/[^A-Za-z0-9]/) != -1) {
				    stringValue += "10";
				};
			    };
			};
			
			// captures the difference of the string length and the maximum characters allowed
			var equalizer = 128 - stringValue.length;
			
			// Adds a zero to the end of the string value to ensure each string is the same length
			// The loop repeat varies according to the number of places the string is missing out of 128
			for (var n = 0; n < equalizer; n++) {
			    stringValue += "0";
			};
			
			// Stores the new string value and the index it corresponds to in an array.
			sortKey.push([(stringValue * 1), String(i)]);
			sortKeyDub.push([(stringValue * 1), String(i)]);
		    };
		    break;
		
		default:
		    break;
	    };
	    
	    for (var k = 0; k < sortKey.length; k++) {
    
		switch (mod) {
			
		    // Retrieves the nearest date (greatest value) of the object
		    case "greatest":
			var lastSort = (roo.data.compare(sortKey, roo.data.compare(sortKey, 0, "min"), "max"));
			break;
		    
		    // Retrieves the furthest date (least value) of the object
		    case "least":
			var lastSort = (roo.data.compare(sortKey, roo.data.compare(sortKey, 0, "max"), "min"));
			break;
		    
		    default:
			var lastSort = 0;
			break;
		};
		
		// The date determined is stored for date removal
		sortedValues.push(lastSort);
		
		// Checks for matches in the sortkey array.
		// When a date matches then the date is voided and the loop will break
		// to prevent voiding multiple of the same dates.
		for (var j = 0; j < sortKey.length; j++) {
		       if (sortKey[j][0] == lastSort) {
			   sortKey[j][0] = "void";
			   break;
		       };
		};
	    };
	    
	    // Iterates through the sorted values for comparison to the original pushed values.
	    // If the values match assign that original index to the sortThisDub array in the n-th place.
	    // Then the value of null is given to prevent duplicate matches.
	    for (var n = 0; n < sortedValues.length; n++) {
		for (var x = 0; x < sortKeyDub.length; x++) {
		    if (sortedValues[n] == sortKeyDub[x][0]) {
			sortThisDub[n] = sortThis[(sortKeyDub[x][1]) * 1];
			sortedValues[n] = "null";
		    };
		};
	    };
    
	    // Reverts object naming changes to original values
	    jsond = JSON.stringify(sortThisDub);
	    
	    for (var v = 0; v < sortLength; v++) {
		jsond = jsond.replace("dtarx", target);
	    };
	    
	    sortThisDub = JSON.parse(jsond);
	    
	    return sortThisDub;
       };
    
	
	// Takes an array as an argument and returns the sum of all numbers even those nested.
	function sumObject(arr) {
	    var sumOfArray = 0,
		newArray = [];
	    
	    // Iterate through the passed in array summing up all numeric values.
	    // The function will ignore strings, functions, undefined and null values.
	    // If the current index is an object then the function will iterate through that object
	    // and sum up all the numeric values present in there also.
	    for (var i = 0; i < arr.length; i++) {
		
		// Assigns the type of the current index to the indexType variable.
		var indexType = typeof(arr[i]);
		
		// Checks the type assigned
		switch (indexType) {
		    
		    // Ignores these types
		    case "string":
		    case "function":
		    case "undefined":
		    case "null":
			break;
		    
		    // Sums any numeric value present
		    case "number":
			sumOfArray += arr[i];
			break;
		    
		    // Iterates through objects and sums numeric values.
		    case "object":
			    newArray = arr[i];
			var newArrSum = roo.data.objsum(newArray);
			    sumOfArray += newArrSum;
			break;
		    
		    default:
			break;   
		};
	    };
	    
	    return sumOfArray;
	};
    
	
	// Takes a number or array as arguments x and y; mod is a string type with the value of "max" or "min". Returns a number
	function compareValues(x, y, mod) {
	     var returnValue = 0,
		 invalid = false,
		 xType = typeof(x),
		 yType = typeof(y),
		 xStore = [],
		 xComp = 0,
		 yStore = [],
		 yComp = 0;
	     
	     // Assumes the types passed in are objects and checks both the x and y arguments.
	     // If the type assumption is true then the object is iterated through capturing all numeric values.
	     
	     // x variable
	     switch (xType) {
		 
		 case "string":
		 case "function":
		 case "undefined":
		 case "null":
		     x = "void";
			 break;
		 
		 // number type nothing is needed just break;
		 case "number":
			 break;
		 
		 // type is an object and must be iterated through to capture the values
		 case "object":
		     xStore = (roo.data.objnumbers(x)).split("|");
		    // console.log(xStore);
		     // Removes empty string returned from the split
		     for (var n = 0, tempArr = []; n < xStore.length; n++) {
			 if (xStore[n] != "" && isNaN(xStore[n]) === false) {
			     tempArr.push((xStore[n] * 1));
			 };
		     };
     
		     // Updates the yStore to the new NaN free array
		     if (tempArr.length > 0) {
			 xStore = tempArr;
		     };
		     
		     // sets the x value to the value of the first index of the new array.
		     x = xStore[0];
		     
		     // iterates through the newly created x array comparing in accord to the passed in modifier.
		     for (var k = 0; k < xStore.length; k++) {
			 if (mod == "max") {
			     x = Math.max(x, xStore[k]);
			 }
			 else if (mod == "min") {
			     x = Math.min(x, xStore[k]);  
			 };
		     };
			 break;
		     
		 default:
		     break;
	     };
	     
	     switch (yType) {
		 
		 case "string":
		 case "function":
		 case "undefined":
		 case "null":
		     y = "void";
			 break;
		 
		 // number type. nothing is needed so just break;
		 case "number":
			 break;
     
		 
		 // type is an object and must be iterated through to capture the values
		 case "object":
		     yStore = (roo.data.objnumbers(y)).split("|");
		     //console.log(yStore);
		     // Removes empty string returned from the split
		     for (var n = 0, tempArr = []; n < yStore.length; n++) {
			 if (yStore[n] != "" && isNaN(yStore[n]) === false) {
			     tempArr.push((yStore[n] * 1));
			 };
		     };
     
		     // Updates the yStore to the new NaN free array
		     if (tempArr.length > 0) {
			 yStore = tempArr;
		     };
		     
		     // sets the y value to the value of the first index of the new array.
		     y = yStore[0];
		     
		     // iterates through the newly created y array comparing in accord to the passed in modifier.
		     for (var l = 0; l < yStore.length; l++) {
			 if (mod == "max") {
			     y = Math.max(y, yStore[l]);
			 }
			 else if (mod == "min") {
			     y = Math.min(y, yStore[l]);
			 };
		     };
			 break;
		     
		 default:
		     break;
	     };
	     
	     if (x != "void" && y != "void") {
		 // Compares the values of x and y in accord with the passed in modifier (mod)    
		 switch (mod) {
		   
		     case "max":
			 returnValue = Math.max(x, y);
			 break;
		     
		     case "min":
			 returnValue = Math.min(x, y);
			 break;
		   
		     default:
			 break;
		 };
	     }
	     else if (x != "void" && y == "void") {
		 returnValue = x;
	     }
	     else if (x == "void" && y != "void") {
		 returnValue = y;
	     }
	     else {
		 returnValue = 0;
	     };
	     
	     return returnValue;
	 };
	
	
	// key is a unique signifier of type string
	function storage(key) {
	    
	    // item is the data to be saved usually within an array or object for JSON.
	    // item is saved to local storage using the passed in key.
	    function saveData(item) {
		localStorage.setItem(key, JSON.stringify(item));
	    };
	    
	    // loads all of the local storage data for the passed in key and returns the data.
	    function loadData() {
	       if (localStorage.length > 0) {
		    var jsonLoadItem = JSON.parse(localStorage.getItem(key));
		}
		else {
		    var jsonLoadItem = [];
		};
		    
		    return jsonLoadItem; 
	    };
	    
	    // item is the data to be removed from local storage using the passed in key.
	    function deleteData(item) {
		localStorage.removeItem(key);
	    };
	    
	    return {
		save: saveData,
		load: loadData,
		remove: deleteData
	    };
	};
	
	
	// mode determines the action to be taken, either 'make' or 'remove'. target is the dom
	// element id to append the error box to. option is the id to be given to the error box element.
	// msgs is an array of strings, a string for each error generated.
	function addErrMsg(mode, target, option, msgs) {
	    
	    switch (mode) {
		case "make":
		    var list = [],
			x = find(target.substring(1, target.length)).$id();
		    
		    while (x.firstChild) {
			list.push(x.firstChild);
			x.removeChild(x.firstChild);
		    };
	     
		    _element(x,"ul",["id", option], "make");
		    roo.dom.stylize(String("#" + option), "#FF0000", "ft-color");
		    
		    for (var n = 0; n < msgs.length; n++) {
			_element(find(option).$id(), "li", ["id", String("err" + n)], "make");
			roo.dom.stylize(String("#err" + n), msgs[n], "tx-inner");
		    };
		    
		    for (var i = 0; i < list.length; i++) {
			x.appendChild(list[i]);
		    };
		    break;
		
		case "remove":
		    _element(find(target.substring(1, target.length)).$id(), String("#" + option), null, "remove");
		    break;
		
		default:
		    break;
	    };
	};
	
	
	// target is a dom selector string in format: tag#id.class:pseudo-class; all selectors may be present
	// a single selector or a combination of two selectors. selectors must keep the accepted form.
	// if a tag is present it must be first followed by either an id or class selector or both at which
	// the id selector would precede the class selector.
	function extractor(target) {
	    var getTag,
		getId,
		getClass,
		getPseudo,
		getNestTag;
	    
	    // checks for presence of a parent child condition
	    // accepts a spaced comparison or non-spaced
	    if (target.indexOf(" > ") != -1) {
	      target = target.split(" > ");
	      getNestTag = target[1];
	      target = target[0];
	    } else if (target.indexOf(">") != -1) {
	      target = target.split(">");
	      getNestTag = target[1];
	      target = target[0];
	    };
	    
	    // checks for a pseudo class conditional
	    if (target.indexOf(":") != -1) {
		getPseudo = target.substring(target.indexOf(":")+1, target.length);
		target = target.substring(0, target.indexOf(":"));
	    };
	    
	    // determines what kind of elements to look for based on the presence of a
	    // html element, element id, and element class.
	    switch(target.substring(0, 1)) {
		case "#":
		    if (target.indexOf(".") != -1) {
			getClass = target.substring(target.indexOf(".")+1, target.length),
			getId = target.substring(1, target.indexOf("."));
		    }
		    else {
			getId = target.substring(1, target.length);
		    };
		    break;
		
		case ".":
			getClass = target.substring(1, target.length);
		    break;
		
		default:
		    if (target.indexOf("#") != -1 && target.indexOf(".") != -1) {
			getClass = target.substring(target.indexOf(".")+1, target.length),
			getId = target.substring(target.indexOf("#")+1, target.indexOf(".")),
			getTag = target.substring(0, target.indexOf("#"));
		    }
		    else if (target.indexOf("#") != -1 && target.indexOf(".") == -1) {
			getId = target.substring(target.indexOf("#")+1, target.length),
			getTag = target.substring(0, target.indexOf("#"));
		    }
		    else if (target.indexOf("#") == -1 && target.indexOf(".") != -1) {
			getClass = target.substring(target.indexOf(".")+1, target.length),
			getTag = target.substring(0, target.indexOf("."));
		    }
		    else {
			getTag = target.substring(0, target.length);
		    };
		    break;
		
	    };
	    return [getTag, getId, getClass, getPseudo, getNestTag];
	};
	
	// creates a timeout if repeat is false or a sets an interval if true
	// len is the time in seconds to wait before invoking the timer
	// func is the option function to pass in for the timer to call when invoked.
	function makeTimer(len, repeat, func) {
	  
	    if (len) {
	      if (!repeat || repeat != true) {
		  window.setTimeout(func, len);
	      } else {
		  window.setInterval(func, len);
	      };
	    };
	};
	
	// sets up an event listener of type event on the target variable
	// invokes the func function when it fires. target should be a DOM element reference
	function setEvent(target, event, func) {
	      
	      function makeEvent() {
		if (target) {
		      target.addEventListener(event, function(){
			  if (func && typeof(func) == "function") {
			    func();
			  };
			});
		};
	      };
	      
	      function cancelEvent() {
		if (target) {
		      target.removeEventListener(event, function(){
			  if (func && typeof(func) == "function") {
			    func();
			  };
			});
		};
	      };
	      
	      return {
		make: makeEvent,
		cancel: cancelEvent
	      };
	};
	
	    return {
		    data: {
			isphone: 	doPhoneCheck,		// 1 string argument
			isurl: 	 	doUrlCheck,		// -
			isemail:	doEmailCheck,		// -
			elapsedtime: 	getElapsedTime,		// 5 string arguments
			parsedate:	parseDate,		// 1 string argument
			realnumber:	getRealNumber,		// 1 string argument
			objnumbers:	getObjectNumbers,	// 1 array of strings argument
			sortobj:	objectSorter,		// 1 array of objects argument
			objsum:		sumObject,		// 1 array of numbers argument
			compare:	compareValues,		// 2 array of numbers or number arguments, 1 string argument
			makexhr:	createXHR,		// 1 string argument
			sendxhr:	sendRequest,		// -
			storage:	storage,		// 1 string argument (load/remove data), 1 array or object argument (save data)
			timer:		makeTimer,		// 1 number argument, 1 boolean argument, 1 function argument
			sel:		selecter		// 1 string argument
		    },
		    dom: {
			stylize: getStyleArgs,			// 3 string arguments
			cta:	 addCTA,			// 4 string arguments, (image links may be passed in as array of strings instead) 1 number argument
			errbox:	 addErrMsg,			// 3 string arguments, 1 array of strings argument
			extract: extractor,			// 1 string argument
			event:	 setEvent			// 2 string arguments, 1 function argument 
		    }
	    };
    };
    
    // accessor methods
    roo = $$();
    dat$ = roo.data;
    dom$ = roo.dom;
    // shortcut for capturing selectors
    sel = roo.data.sel;
    // shortcut for manipulating dom styling
    styl = roo.dom.stylize;
    // shortcut for creating timers
    timr = roo.data.timer;
    // shortcut for creating an event handler
    evt = roo.dom.event; 
});