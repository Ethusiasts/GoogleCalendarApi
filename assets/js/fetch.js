// defining variables

// start


let eventIdStore = new Array();
// inputs from the user during inserting event
const summery = document.querySelector("#summery")
const loc = document.querySelector("#location")
const startDate = document.querySelector("#startDate")
const startTime = document.querySelector("#startTime")
const endDate = document.querySelector("#endDate")
const endTime = document.querySelector("#endTime")
const attendees = document.querySelector("#attendees")
const message = document.querySelector("#message")

// front page content
const calendarHomePage = document.querySelector(".home-calendar-page")
// add event button
const add =document.querySelector("#add");
// update event button
const update_eve = document.querySelector("#update-event");
// insert event button (on the navigation bar)
const insert = document.querySelector("#insert")
// container for event adding page 
const ins = document.querySelector(".ins")
// upcoming events (on the navigation bar)
const display = document.querySelector('#display')
// cards to diplay upcoming events
const fetchCard = document.querySelector('.fetchCard');

// authorization and signOut buttons
var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

// end

// event listeners

// start


// detecting which delete or update button is clicked by listening on the document
if (document.addEventListener) {
    document.addEventListener("click", handleClick, false);
}
else if (document.attachEvent) {
    document.attachEvent("onclick", handleClick);
}
// Listener for Update
update_eve.addEventListener('click',updateEvent2);
// Listener for displaying  events form
insert.addEventListener('click',displayForm);
// Listener for upcoming events
display.addEventListener('click',listUpcomingEvents);
// Listner for adding Events
add.addEventListener('click', insertEvent)
// end



// Client ID and API key from the Developer Console
// start

var CLIENT_ID = '269517427467-vnendark26qhr9dpqrkl7mg6nf0106k1.apps.googleusercontent.com';
var API_KEY = 'AIzaSyA3Xj5L-GtumYAPwsdEA8uscqpi4Gvh_Qw';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; 
var SCOPES = "https://www.googleapis.com/auth/calendar";

// end

//  On load, called to load the auth2 library and API client library.
 

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}


//    Initializes the API client library and sets up sign-in state listeners.
 
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    
    });
}


//   Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
 
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}


//  Sign in the user upon button click.

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

//  Sign out the user upon button click.

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}





function handleClick(event) {
    event = event || window.event;
    var element = event.target || event.srcElement;
    // Climb up the document tree from the target of the event
        if (element.className.match('delete-event')) {
            // The user clicked on a <button> or clicked on an element inside a <button>
            // with a class name called "delete-event"
            const deletebtn = document.querySelector('.delete-item')
            removeEvent(event)   ;
        }   
        if (element.className.match('update-event')) {
            // The user clicked on a <button> or clicked on an element inside a <button>
            // with a class name called "update-event"
            let eventId = event.target.parentElement.parentElement.children[5].textContent;
            updateEvent(eventId);
        }
}
function updateEvent(incomingEventId) {
    displayForm();
    add.style.display = "none";
    update_eve.style.display = "block";
    eventIdStore.push(incomingEventId);
}


function displayForm(){ 
   
    fetchCard.style.display = "none";
    calendarHomePage.style.display = "none";
    // fetchCard.style.display = "none";
    update_eve.style.display = "none";
    ins.style.display = "block";
    add.style.display = "block";
    
}


//home back function
function goBackToHome(){
    fetchCard.style.display="none";
    calendarHomePage.style.display="block";
    ins.style.display="none";
    
}

// appending to the cards
function appendPre(messsage,...rest) {
    fetchCard.innerHTML += `
    <article class="card">
          <header class="card-header">
            <h2>${messsage}</h2>
          </header>
         
        <div class="incoming-name">${rest[0]}</div>
        <div class="incoming-name">${rest[1][0].email}</div>
        <div class="incoming-name">${rest[2]}</div>
        <div class="incoming-name">${rest[3]}</div>
        <div class="incoming-name to-be-deleted-id" style = "display:none">${rest[4]}</div> 
        <div class="tags">
            <a href="#" class="btn btn-primary update-event">Update</a>
            <a href="#" class="btn btn-primary delete-event">Delete</a>
        </div>
      </article>
    `;
}

// fetching upcoming events
function listUpcomingEvents() {
    
    displayCards();
    fetchCard.style.display = "flex";
    ins.style.display = "none";

    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        if (events.length > 0) {
            fetchCard.innerHTML = "";
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var dateTime = event.start.dateTime
                var dateTimeEnd = event.end.dateTime
                if (!dateTime) {
                    dateTime = event.start.date;
                }
                if (!dateTimeEnd) {
                    dateTimeEnd = event.end.date;
                }
                appendPre(event.summary,event.description,event.attendees, dateTime, dateTimeEnd,event.id)
            }    
           
        } else {
            const fetchCard = document.querySelector('.fetchCard');
            fetchCard.innerHTML = `
            <div class="card-body">
            <h5 class="card-title">No upcoming events found.</h5>
            </div> 
            `
        }
    });
}

// updating event
function updateEvent2(){
	    var event = {
        'calendarId': 'primary',
        'eventId': `${eventIdStore[0]}`,
        'resource': {
            'summary': `${summery.value}`,
            'location': `${loc.value}`,
            'description': `${message.value}`,
            'start': {
                'dateTime': `${startDate.value}T${startTime.value}:00-02:00`,
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime':  `${endDate.value}T${endTime.value}:00-02:00`,
                'timeZone': 'America/Los_Angeles'
            },
            'attendees': [
                { 'email': 'se.abenezer.fekadu@gmail.com' },
                { 'email': `${attendees.value}` }
            ],
            'reminders': {
                'useDefault': false,
                'overrides': [
                    { 'method': 'email', 'minutes': 24 * 60 },
                    { 'method': 'popup', 'minutes': 10 }
                ]
            }
        }
    };

        return gapi.client.calendar.events.update(event)
                .then(function (response) {
                    // Handle the results here (response.result has the parsed body).
                    console.log("Response", response);
                },
                    function (err) { console.log("Execute error", err); });

}

// Inserting Events
function insertEvent() {
    return gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': {
            'summary': `${summery.value}`,
            'location': `${loc.value}`,
            'description': "vvbwvbwv",
            'start': {
                'dateTime': `${startDate.value}T${startTime.value}:00-02:00`,
                'timeZone': 'America/Los_Angeles'
            },
            'end': {
                'dateTime':  `${endDate.value}T${endTime.value}:00-02:00`,
                'timeZone': 'America/Los_Angeles'
            },
            'recurrence': [
                'RRULE:FREQ=DAILY;COUNT=1'
            ],
            'attendees': [
                { 'email': 'se.abenezer.fekadu@gmail.com' },
                { 'email': `${attendees.value}` }
            ],
            'reminders': {
                'useDefault': false,
                'overrides': [
                    { 'method': 'email', 'minutes': 24 * 60 },
                    { 'method': 'popup', 'minutes': 10 }
                ]
            }
        }
    })
        .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response", response);
        },
            function (err) { console.error("Execute error", err); });
}

// Delete Events
function removeEvent(e) {
	    // e.target.parentElement.remove();
        var eventId = e.target.parentElement.parentElement.children[5].textContent;
        var event = {
            calendarId: 'primary',
            eventId: eventId,
        };
        if (confirm('Are You Sure about that ?')) {
            e.target.parentElement.parentElement.remove();

        }
        // gapi.client.calendar.events.delete({ calendarId: 'primary', eventId: '7p68amsdo1ut2pl2lj7gtqks38_20210226T030000Z' })
        return gapi.client.calendar.events.delete(event)
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
            },
                function (err) { console.error("Execute error", err); });
}

//Clearing input fields 
function clearFields(){
    document.querySelector("#summery").value=""
    document.querySelector("#location").value=""
    document.querySelector("#startDate").value=""
    document.querySelector("#startTime").value=""
    document.querySelector("#endDate").value=""
    document.querySelector("#endTime").value=""
    document.querySelector("#attendees").value=""
    document.querySelector("#message").value=""

}