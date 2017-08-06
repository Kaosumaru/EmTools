#include <iostream>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>
#include "em-appdata/DriveAppData.h"

using namespace emscripten;

void testFunction() {
	//TODO differentiate between network errors & 'fatal' errors
	char body[]={5,6,7};
	int size = 3;
	MX::Drive::UploadFile("test/binary2.bin", body, size, [](MX::Drive::NetworkResponse result){
		std::cout << "UploadFile " << (int)result << std::endl;

		MX::Drive::DownloadFile("test/binary2.bin", [](MX::Drive::NetworkResponse result, std::unique_ptr<char[]>&& data, unsigned int size){
			std::cout << "DownloadFile " << (int)result << " " << size << std::endl;
			for(int i = 0; i < size; i++)
				std::cout << (int)data[i];
			std::cout << std::endl;
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
	std::cout << "Hello World!" << std::endl;

#ifdef __EMSCRIPTEN__
	emscripten_set_main_loop(emscriptenLoop, 0, 1);
#endif
	return 0;
}
