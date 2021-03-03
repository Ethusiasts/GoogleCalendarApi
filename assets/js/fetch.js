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