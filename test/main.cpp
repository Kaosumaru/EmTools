#include <iostream>
#include "src/DriveAppData.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>

using namespace emscripten;

void testFunction() {
	//TODO differentiate between network errors & 'fatal' errors
	char body[]={5,6,7};
	int size = 3;
	MX::Drive::UploadFile("test/binary.bin", body, size, [](bool success){
		std::cout << "UploadFile " << success << std::endl;

		MX::Drive::DownloadFile("test/binary2.bin", [](bool success, std::unique_ptr<char[]>&& data, unsigned int size){
			std::cout << "DownloadFile " << success << " " << size << std::endl;
			for(int i = 0; i < size; i++)
				std::cout << (int)data[i];
			std::cout << std::endl;
		});
	});
}

void testFunction2() {
	std::cout << "testFunction!" << std::endl;
	EM_ASM({


		var uint8Array  = new Uint8Array([1, 2, 3]);
		var blob = new Blob(['abc123'], {type: 'text/plain'});
		var file = {
			name: 'TestFile.bin',
			mimeType: 'application/octet-stream',
			body: uint8Array,
			parentId: "appDataFolder" //0B2xtLf37Xl8Aay1hbU9nWWVJMFU
		};

		console.log("Test");
		MXGDrive.createFile(file, function(success, resp){
			console.log("upload="+success);

			MXGDrive.downloadFilename(file.name, file.parentId, function(result, data){
				console.log(data);
			});

		});
	});
}

EMSCRIPTEN_BINDINGS(test_module) {
	function("testFunction", &testFunction);
}

void emscriptenLoop()
{

}

#endif


int main()
{
	MX::Drive::InitializeDrive();
	std::cout << "Hello World!" << std::endl;

#ifdef __EMSCRIPTEN__
	emscripten_set_main_loop(emscriptenLoop, 0, 1);
#endif
	return 0;
}
