document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady(){
        evt(find("addContact").$id(), "click", fetchData).make();
    };
    
    function fetchData() {
        var errs = [];
        // reset the err section
        styl("ul", "", "innertx");
        styl("#err-section", "none", "display");
        styl("#home", "none", "full-border");
        styl("#mobile", "none", "full-border");
        styl("#work", "none", "full-border");
        styl("#nickname", "none", "full-border");
        styl("#fname", "none", "full-border");
        styl("#dob", "none", "full-border");
        styl("#email", "none", "full-border");
        styl("#email2", "none", "full-border");
        styl("#country", "none", "full-border");
        styl("#state", "none", "full-border");
        styl("#city", "none", "full-border");
        styl("#zip", "none", "full-border");
        
        var contact = {
                displayname: find("nickname").$id().value,
                firstname: find("fname").$id().value,
                middlename: find("mname").$id().value,
                lastname: find("lname").$id().value,
                birthday: find("dob").$id().value,
                phone: {
                        home: find("home").$id().value,
                        mobile: find("mobile").$id().value,
                        work: find("work").$id().value
                    },
                address: {
                        street: find("addr").$id().value,
                        state: find("state").$id().value.toUpperCase(),
                        city: find("city").$id().value,
                        country: find("country").$id().value.toUpperCase(),
                        zip: find("zip").$id().value
                    },
                email: find("emailh").$id().value,
                email2: find("emailw").$id().value,
                notes: find("notes").$id().value
            };
            
            // verify valid data is present
            function verifyIt(dataVar) {
                switch (dataVar) {
                    case undefined:
                    case null:
                    case " ":
                    case "":
                        dataVar = false;
                        break;
                    
                    default:
                        dataVar = true;
                        break;
                };
                
                return dataVar;
            };
            
            // verify phone numbers
            function verifyNum(pnum) {
            
                pnum = dat$.isphone(pnum);
                
                return pnum;
            };
            
            
            // verify the minimum names are provided
            if (verifyIt(contact.displayname) === false && verifyIt(contact.firstname) === false) {
                errs.push("REQUIRED: First Name or Display Name");
                styl("#fname", "solid #aa0000", "full-border");
                styl("#nickname", "solid #aa0000", "full-border");
            }
            else {
              if (verifyIt(contact.displayname) === false) {
                contact.displayname = contact.firstname;
              }
              else if (verifyIt(contact.firstname) === false) {
                contact.firstname = contact.displayname;
              };
            };
            
            
            // verify the country is a min of 2 alphabet characters when present
            if (verifyIt(contact.address.country) === true) {
                if (!(/^[A-Za-z]{2,}\b/.test(contact.address.country))) {
                    errs.push("Country must be min. 2 alpha characters");
                    styl("#country", "solid #aa0000", "full-border");
                };
            };
            
            
            // verify the city is a min of 2 alphabet characters when present
            if (verifyIt(contact.address.city) === true) {
                if (!(/^[A-Za-z]{2,}\b/.test(contact.address.city))) {
                    errs.push("City must be min. 2 alpha characters");
                    styl("#city", "solid #aa0000", "full-border");
                };
            };
            
            // verify the city is a min of 2 alphabet characters when present
            if (verifyIt(contact.address.state) === true) {
                if (!(/^[A-Za-z]{2,}\b/.test(contact.address.state))) {
                    errs.push("State must be min. 2 alpha characters");
                    styl("#state", "solid #aa0000", "full-border");
                };
            };
            
            
            // verify the zip code is 5 numeric characters when supplied
            if (verifyIt(contact.address.zip) === true) {
                if (!(/^[0-9]{5}\b/.test(contact.address.zip))) {
                    errs.push("Zipcode must be 5 numeric characters");
                    styl("#zip", "solid #aa0000", "full-border");
                };
            };
            
            
            // verify the birthday format if present
            if (verifyIt(contact.birthday) === true) {
                if (!(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}\b/.test(contact.birthday))){
                    errs.push("Birthdate is in invalid format");
                    styl("#dob", "solid #aa0000", "full-border");
                } else {
                    var dob = contact.birthday.split("/"),
                        yr = new Date().getFullYear();
                    
                    if (dob[0] * 1 > 12 || dob[0] < 1) {
                        errs.push("Invalid month 1-12");
                        styl("#dob", "solid #aa0000", "full-border");
                    }
                    else if (dob[1] * 1 > 31 || dob[1] < 1) {
                        errs.push("Invalid day 1-31");
                        styl("#dob", "solid #aa0000", "full-border");
                    }
                    else if (dob[2] * 1 >= yr) {
                        errs.push("Invalid year <" + yr);
                        styl("#dob", "solid #aa0000", "full-border");
                    };
                };
            };
            
            
            // verify the numbers provided are valid format
            if (verifyIt(contact.phone.home) === true && verifyNum(contact.phone.home) === false) {
                errs.push("Home number is not a valid format");
                styl("#home", "solid #aa0000", "full-border");
            }
            else if (verifyIt(contact.phone.mobile) === true && verifyNum(contact.phone.mobile) === false) {
                errs.push("Mobile number is not a valid format");
                styl("#mobile", "solid #aa0000", "full-border");
            }
            else if (verifyIt(contact.phone.work) === true && verifyNum(contact.phone.work) === false) {
                errs.push("Work number is not a valid format");
                styl("#work", "solid #aa0000", "full-border");
            };
            
            // verify the email is valid format
            if (verifyIt(contact.email) === true && dat$.isemail(contact.email) === false) {
                errs.push("Home Email is not a valid format");
                if (contact.email.length < 4) {errs.push("Home Email must be at least 4 characters")};
                styl("#emailh", "solid #aa0000", "full-border");
            };
            
            // verify the email2 is valid format
            if (verifyIt(contact.email2) === true && dat$.isemail(contact.email2) === false) {
                errs.push("Work Email is not a valid format");
                if (contact.email2.length < 4) {errs.push("Work Email must be at least 4 characters")};
                styl("#emailw", "solid #aa0000", "full-border");
            };
            
            // check if there are errors logged and logged them if present
            if (errs.length > 0) {
                for (var i = 0; i<errs.length; i++) {
                    _element(find("ul").$tag(1), "li", ["id", "err"+i], "make");
                    styl("#err"+i, errs[i], "innertx");
                };
                
                // make the err section visible
                styl("#err-section", "block", "display");
            }
            else {
                createContact(contact);
            };
    };
    
    // create the new contact based on the passed in object
    function createContact(data) {
        
        var contact = navigator.contacts.create(),
            name = new ContactName();
        
        // saving display and nickname
        contact.displayName = data.displayname;
        contact.nickname = data.displayname;
        
        // saving the name array block
        name.familyName = data.lastname;
        name.givenName = data.firstname;
        name.middleName = data.middlename;
        
        // saving birthday and notes
        contact.birthday = data.birthday;
        contact.note = data.notes;

        var phoneNumbers = [], email = [];
            phoneNumbers[0] = new ContactField("home", data.phone.home, false);
            phoneNumbers[1] = new ContactField("mobile", data.phone.mobile, false);
            phoneNumbers[2] = new ContactField("work", data.phone.work, false);
            email[0] = new ContactField("home", data.email, false);
            email[1] = new ContactField("work", data.email2, false)
        
        var addresses = [{}];
        addresses[0].type = "home";
        addresses[0].streetAddress = data.address.street;
        addresses[0].locality = data.address.city;
        addresses[0].region = data.address.state;
        addresses[0].postalCode = data.address.zip;
        addresses[0].country = data.address.country;
        
         // set the contact data arrays
        contact.name = name;
        contact.phoneNumbers = phoneNumbers;
        contact.emails = email;
        contact.addresses = addresses;
        
        // init contact save
        contact.save(saveSucc, saveFail);
   };
   
   function saveSucc(win) {
        alert("Contact Saved!");
   };
   
   function saveFail(fail) {
        alert("Failed to save contact!");
   };