#include <iostream>
#include "src/DriveAppData.h"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>

using namespace emscripten;

void testFunction() {
	std::cout << "testFunction!" << std::endl;
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
