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
	MXGDrive.createFile(file, function(success, resp){
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
