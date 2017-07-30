//@STARTFILE@

(function( MXGDrive, undefined ) {

var fileSpaces = "appDataFolder";

function ifFileExists(name, parentID, cb) {
	//q
	//pageToken
	//spaces - appDataFolder
	var q = "name='" + name +"'";
	if (parentID) q += " and '" + parentID +"' in parents ";

	gapi.client.drive.files.list({
		'q': q,
		'pageSize': 10,
		'spaces': fileSpaces,
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

function uploadFileBody(fileId, mimeType, body, cb) {
	var oReq = new XMLHttpRequest();
	var resp = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse();
	var url = "https://www.googleapis.com/upload/drive/v3/files/" + fileId +"?uploadType=media";
	var access_token = resp.access_token;
	oReq.open("PATCH", url, true);
	oReq.setRequestHeader("Content-Type", mimeType);
	oReq.setRequestHeader("Authorization", "Bearer " + access_token);
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

	ifFileExists(file.name, file.parentId, function(s, data) {
		if (!s) { if(cb) cb(false, data); return; }
		var id = data.id;
		if (id) {
			uploadFileBody(id, file.mimeType, file.body, cb);
			return;
		}

		createEmptyFile(file.name, file.mimeType, file.parentId, function(resp){
			if (resp.code && resp.code != 200) { if(cb) cb(false, resp); return; }
			if (!file.body) { if(cb) cb(true, resp); return; }

			//uploadFileContent(resp.id, file.mimeType, file.body, cb);
			uploadFileBody(resp.id, file.mimeType, file.body, cb);
		});

	});
}

function downloadBinaryFile(fileId, cb) {
	var url = "https://www.googleapis.com/drive/v3/files/" + fileId +"?alt=media";
	var resp = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse();
	var access_token = resp.access_token;

	var oReq = new XMLHttpRequest();
	oReq.open("GET", url, true);
	oReq.responseType = "arraybuffer";
	oReq.setRequestHeader("Authorization","Bearer " + access_token);

	oReq.onload = function (oEvent) {
		if (cb) cb(true, oReq.response);
	};

	oReq.onerror = function (oEvent) {
		if (cb) cb(false, oReq.response);
	};

	oReq.send(null);
}

function downloadFilename(fileName, parentID, cb) {
	ifFileExists(fileName, parentID, function(s, data) {
		if (!s) { if(cb) cb(false, data); return; }

		downloadBinaryFile(data.id, cb);
	});

}

	MXGDrive.ifFileExists = ifFileExists;
	MXGDrive.createEmptyFile = createEmptyFile;
	MXGDrive.createFolder = createFolder;
	MXGDrive.uploadFileBody = uploadFileBody;
	MXGDrive.createFile = createFile;
	MXGDrive.downloadFilename = downloadFilename;

}( window.MXGDrive = window.MXGDrive || {} ));
//@ENDFILE@
