#include "DriveAppData.h"
#include <iostream>

using namespace MX;
using namespace MX::Drive;

namespace MX {
namespace Drive {
#ifndef __EMSCRIPTEN__
	void InitializeDrive() { std::cout << "Must be called under emscripten!"; };
#endif

	void UploadFile(const std::string& name, void* body, unsigned int size, const UploadCallback& callback)
	{

	}

	void DownloadFile(const std::string& name, const DownloadCallback& callback)
	{

	}
}
}


