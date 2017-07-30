// Client ID and API key from the Developer Console
var CLIENT_ID = '213817666972-ogjsvovt26iofsb0ie7d4pq2ofp9kt92.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
//debug test - https://www.googleapis.com/auth/drive
var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive';

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

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
		discoveryDocs: DISCOVERY_DOCS,
		clientId: CLIENT_ID,
		scope: SCOPES
	}).then(function () {
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

//should only search in appData
function ifFileExists(name, parentID, cb) {
	//q
	//pageToken
	//spaces - appDataFolder
	var q = `name='${name}' `;
	if (parentID) q += ` and '${parentID}' in parents `;

	gapi.client.drive.files.list({
		'q': q,
		'pageSize': 10,
		'fields': "nextPageToken, files(id, name)"
	}).then(function(response) {
		var files = response.result.files;
		var id = (files && files.length > 0) ? files[0].id : "";
		var count = (files && files.length) ? files.length : 0;
		if (cb) cb(true, {id:id, count:count, files:files});
	}, function(response) {
		if (cb) cb(false, {});
	});
}


//https://stackoverflow.com/questions/34905363/create-file-with-google-drive-api-v3-javascript
//https://stackoverflow.com/questions/10317638/how-do-i-add-create-insert-files-to-google-drive-through-the-api
//https://developers.google.com/drive/v3/reference/files/update



//-- this works
function createEmptyFile(file, mimeType, parentId, cb) {

	var fileMetadata = {
			'name' : file,
			'mimeType' : mimeType
	};
	var fileInfo = {
			resource: fileMetadata,
			fields: 'id'
	};

	if (parentId) fileMetadata.parents = [parentId];

	gapi.client.drive.files.create(fileInfo).execute(function(resp, raw_resp) {
			if(cb) cb(resp);
	});
}

function createFolder(file, parentId, cb) {
	createEmptyFile(file, 'application/vnd.google-apps.folder', parentId, cb);
}

/*
function uploadFileContent(fileId, mimeType, body, cb) {
	gapi.client.request({
		path: '/upload/drive/v3/files/' + fileId,
		method: 'PATCH',
		params: {
		  uploadType: 'media'
		},
		body: body
	}).then(function(success)	{
		if (cb) cb(true, cb);
	}, function(error) {
		if (cb) cb(false, cb);
	});
}
*/

function uploadFileBinary(fileId, mimeType, body, cb) {
	var oReq = new XMLHttpRequest();
	var resp = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse();
	var url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
	var access_token = resp.access_token;
	oReq.open("PATCH", url, true);
	oReq.setRequestHeader("Content-Type", mimeType);
	oReq.setRequestHeader("Authorization", `Bearer ${access_token}`);
	oReq.responseType = 'json';

	oReq.onload = function (oEvent) {
		if (cb) cb(true, oReq.response);
	};
	oReq.onerror = function (oEvent) {
		if (cb) cb(false, oReq.response);
	};

	oReq.send(body);
}

//file = { name:, mimeType:, body:, parentId:}
//cb(success, resp)
function createFile(file, cb) {

	//TODO check parent ID
	ifFileExists(file.name, file.parentId, function(s, data) {
		if (!s) { if(cb) cb(false, data); return; }
		var id = data.id;
		if (id) {
			uploadFileBinary(id, file.mimeType, file.body, cb);
			return;
		}

		createEmptyFile(file.name, file.mimeType, file.parentId, function(resp){
			if (resp.code && resp.code != 200) { if(cb) cb(false, resp); return; }
			if (!file.body) { if(cb) cb(true, resp); return; }

			//uploadFileContent(resp.id, file.mimeType, file.body, cb);
			uploadFileBinary(resp.id, file.mimeType, file.body, cb);
		});

	});


}

function createTestFile() {
	var file = {
		name: 'TestFile.doc',
		mimeType: 'application/vnd.google-apps.document',
		body: 'Test file!',
		parentId: "0B2xtLf37Xl8Aay1hbU9nWWVJMFU"
	};

	console.log("Test");
	createFile(file, function(success, resp){
		console.log("upload="+success);
	});
}


function createTestFile2() {
	//doesn't works yet
	var blob = new Blob(['abc123'], {type: 'text/plain'});
	var file = {
		name: 'TestFile.bin',
		mimeType: 'application/octet-stream',
		body: blob,
		parentId: "0B2xtLf37Xl8Aay1hbU9nWWVJMFU"
	};

	console.log("Test");
	createFile(file, function(success, resp){
		console.log("upload="+success);
	});
}

function testFunction() {
	createTestFile2();
	/*
	ifFileExists("TestFile.bin", function(s, s2) {
		console.log(`check=${s} ${s2.id}`);
	});*/
}
