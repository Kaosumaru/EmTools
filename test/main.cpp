#include <iostream>
#include "src/DriveAppData.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>

using namespace emscripten;

void testFunction() {
	EM_ASM({
		console.log("aaa");
	});
}

EMSCRIPTEN_BINDINGS(test_module) {
	function("testFunction", &testFunction);
}

#endif


int main()
{
	MX::Drive::InitializeDrive();
	std::cout << "Hello World!" << std::endl;
	return 0;
}
