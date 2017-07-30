#pragma once
#include <functional>
#include <string>

namespace MX
{
namespace Drive
{
	void InitializeDrive();

	using UploadCallback = std::function<void (bool success)>;
	void UploadFile(const std::string& name, void* body, unsigned int size, const UploadCallback& callback);

	using DownloadCallback = std::function<void (bool success, void* data, unsigned int size)>;
	void DownloadFile(const std::string& name, const DownloadCallback& callback);
}
}
