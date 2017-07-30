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

function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function createTestFile2() {
	var uint8Array  = new Uint8Array([1, 2, 3]);
	var blob = new Blob(['abc123'], {type: 'text/plain'});
	var file = {
		name: 'TestFile.bin',
		mimeType: 'application/octet-stream',
		body: uint8Array,
		parentId: "" //0B2xtLf37Xl8Aay1hbU9nWWVJMFU
	};

	console.log("Test");
	MXGDrive.createFile(file, function(success, resp){
		console.log("upload="+success);

		MXGDrive.downloadFilename(file.name, file.parentId, function(result, data){
			console.log(buf2hex(data));
		});

	});


}

function testFunction() {
	createTestFile2();
	/*
	ifFileExists("TestFile.bin", function(s, s2) {
		console.log(`check=${s} ${s2.id}`);
	});*/
}
