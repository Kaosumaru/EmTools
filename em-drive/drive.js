window.EmDrive = window.EmDrive || {}

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

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

function emscriptenCallback(name, value) {
	if (!window.Module[name]) {
		window.Module.postRun.push(function(){ emscriptenCallback(name, value); });
		return;
	}

	if (value) Module[name](value); else Module[name]();
}

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

		emscriptenCallback("DriveInitializeCallbackJS");

		gapi.auth2.getAuthInstance().isSignedIn.listen(function(signedIn){
			emscriptenCallback("SignedInCallbackJS", signedIn);
		});
		emscriptenCallback("SignedInCallbackJS", gapi.auth2.getAuthInstance().isSignedIn.get());

	});
}
