window.EmDrive = window.EmDrive || {}

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

var Promise = require('promise');
var initializePromiseResolve;

var initializePromise = new Promise(function (resolve, reject) {
	initializePromiseResolve = resolve;
});
window.EmDrive.ready = initializePromise;

/**
 *  On load, called to load the auth2 library and API client library.
 */
function initialize() {
	gapi.load('client:auth2', initClient);
}
window.EmDrive.initialize = initialize;

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
	gapi.client.init({
		discoveryDocs: DISCOVERY_DOCS,
		clientId: EM_GAPI_CLIENT_ID,
		scope: EM_GAPI_SCOPES
	}).then(function () {
		initializePromiseResolve();
		// Listen for sign-in state changes.
		gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

		// Handle the initial sign-in state.
		updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		authorizeButton.onclick = handleAuthClick;
		signoutButton.onclick = handleSignoutClick;
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
		listFiles();
	} else {
		authorizeButton.style.display = 'block';
		signoutButton.style.display = 'none';
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
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
	var pre = document.getElementById('content');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
}

/**
 * Print files.
 */
function listFiles() {
	//q
	//pageToken
	//spaces - appDataFolder
	gapi.client.drive.files.list({
		'pageSize': 10,
		'fields': "nextPageToken, files(id, name)"
	}).then(function(response) {
		appendPre('Files:');
		var files = response.result.files;
		if (files && files.length > 0) {
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				appendPre(file.name + ' (' + file.id + ')');
			}
		} else {
			appendPre('No files found.');
		}
	});
}
