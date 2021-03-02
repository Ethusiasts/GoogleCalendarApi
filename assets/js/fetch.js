// defining the variable
let eventIdStore = new Array();
const summery = document.querySelector("#summery")
const calendarHomePage = document.querySelector(".home-calendar-page")
const loc = document.querySelector("#location")
const startDate = document.querySelector("#startDate")
const startTime = document.querySelector("#startTime")
const endDate = document.querySelector("#endDate")
const endTime = document.querySelector("#endTime")
const attendees = document.querySelector("#attendees")
const message = document.querySelector("#message")

const add =document.querySelector("#add");
const update_eve = document.querySelector("#update-event");
const insert = document.querySelector("#insert")
const ins = document.querySelector(".ins")
const display = document.querySelector('#display')
const fetchCard = document.querySelector('.fetchCard');
// Client ID and API key from the Developer Console
var CLIENT_ID = '269517427467-vnendark26qhr9dpqrkl7mg6nf0106k1.apps.googleusercontent.com';
var API_KEY = 'AIzaSyA3Xj5L-GtumYAPwsdEA8uscqpi4Gvh_Qw';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
// var inser = document.getElementById('insert');
// var del = document.getElementById('delete');
// var update = document.getElementById('update');




// Action Litner for Update
update_eve.addEventListener('click',updateEvent);







/**
 *  On load, called to load the auth2 library and API client library.
 */

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
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

        // listUpcomingEvents();
    }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
    
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        
        console.log("Sign-In Successfull")
        // getIt();
        // listUpcomingEvents();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';

        console.log("Sign-Out Successfull")
        
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}
/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 */
function appendPre(messsage,...rest) {
    fetchCard.innerHTML += `
    <article class="card">
          <header class="card-header">
            <h2>${messsage}</h2>
          </header>
         
        <div class="author-name">${rest[0]}</div>
        <div class="author-name">${rest[1][0].email}</div>
        <div class="author-name">${rest[2]}</div>
        <div class="author-name">${rest[3]}</div>
        <div class="author-name to-be-deleted-id" style = "display:none">${rest[4]}</div> 
        <div class="tags">
            <a href="#" class="btn btn-primary update-event">Update</a>
            <a href="#" class="btn btn-primary delete-event">Delete</a>
        </div>
      </article>
    `;
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */

function listUpcomingEvents() {
    
    adding();
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
        // appendPre('Upcoming events:');
        console.log(events)
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
                // console.log(event.attendees);

              
                appendPre(event.summary,event.description,event.attendees, dateTime, dateTimeEnd,event.id)
            }
            
            console.log('hiiiiii')

            
           
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


function updateEvent(){
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

}