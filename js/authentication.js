// Client ID and API key from the Developer Console
var CLIENT_ID = googleCalendar.Client_Id;
var API_KEY = googleCalendar.Calendar_Id;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    console.log("client load")
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    console.log("client init")
    gapi.client.init({
        // apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        console.log("dsaf")
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
        updateSigninStatus(isSignedIn);
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;

        calendarAPI = gapi.client.calendar;
        currentDate = moment().format("YYYY-MM-DD");
        getEvents(currentDate);
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
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

function getEvents(date) {
    calendarAPI.events.list({
        'calendarId': googleCalendar.Calendar_Id,
        'timeMin': date + "T01:00:00+07:00",
        'timeMax': date + "T23:00:00+07:00",
        'singleEvents': true,
        'orderBy': 'startTime'
    }).then(function(response) {
        listOfEvents = response.result.items;
        listOfEvents = listOfEvents.map(function (event) {
            localEvent = {
                title: event.summary,
                start: event.start.dateTime,
                end: event.end.dateTime,
                creator: event.creator
            };

            return localEvent
        });
        console.log(listOfEvents)
    });
    return listOfEvents;
}