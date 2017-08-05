#include "DriveAppData.h"
#include <cinttypes>
#include <iostream>

using namespace MX;
using namespace MX::Drive;

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>

namespace
{
	using UploadFileRawCallback = void(*)(std::intptr_t arg, int success);
	void UploadFileRaw(const std::string& name, void* body, unsigned int size, std::intptr_t arg, UploadFileRawCallback callback)
	{
		EM_ASM_ARGS({
			var name = Pointer_stringify($0);
			var array = HEAPU8.subarray($1, $1 + $2);
			var size = $2;
			var arg = $3;
			var callback = $4;

			var file = {};

			file["name"] = name;
			file["mimeType"] = "application/octet-stream";
			file["body"] = array;
			file["parentId"] = "appDataFolder";


			MXGDrive.createFile(file, function(success, resp){
				Runtime.dynCall('vii', callback, [arg, success ? 1 : 0]);
			});
		}, name.c_str(), body, size, arg, callback);
	}

	using DownloadFileRawCallback = void(*)(std::intptr_t arg, int success, void* data, unsigned int size);
	void DownloadFileRaw(const std::string& name, std::intptr_t arg, DownloadFileRawCallback callback)
	{
		EM_ASM_ARGS({
			var name = Pointer_stringify($0);
			var arg = $1;
			var callback = $2;

			MXGDrive.downloadFilename(name, "appDataFolder", function(success, data){
				if (!success) {
					Runtime.dynCall('viiii', callback, [arg, 0, 0, 0]);
					return;
				}
				var buffer = _malloc(data.length);
				HEAPU8.set(data, buffer);
				Runtime.dynCall('viiii', callback, [arg, 1, buffer, data.length]);
			});
		}, name.c_str(), arg, callback);
		//writeArrayToMemory(array, buffer)
	}
#if 0
	void UploadFileRaw(const std::string& name, void* body, unsigned int size, std::intptr_t arg, UploadFileRawCallback callback)
	{


if (freeAfterUse) {
		_free(buffer);
}
	}
#endif


}
#endif


namespace MX {
namespace Drive {

	void UploadFile(const std::string& name, void* body, unsigned int size, const UploadCallback& callback)
	{
#ifdef __EMSCRIPTEN__
		auto cb = new UploadCallback{callback};
		UploadFileRaw(name, body, size, (std::intptr_t)cb, [](std::intptr_t arg, int success)
		{
			std::unique_ptr<UploadCallback> callback{(UploadCallback*)arg};
			(*callback)(success);
		});
#endif
	}

	void DownloadFile(const std::string& name, const DownloadCallback& callback)
	{
#ifdef __EMSCRIPTEN__
		auto cb = new DownloadCallback{callback};
		DownloadFileRaw(name, (std::intptr_t)cb, [](std::intptr_t arg, int success, void* data, unsigned int size)
		{
			std::unique_ptr<DownloadCallback> callback{(DownloadCallback*)arg};
			(*callback)(success, std::unique_ptr<char[]>{(char*)data}, size);
		});
#endif
	}
}
}
