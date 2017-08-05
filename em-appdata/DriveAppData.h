#pragma once
#include <functional>
#include <string>
#include <memory>

namespace MX
{
namespace Drive
{
	using UploadCallback = std::function<void (bool success)>;
	void UploadFile(const std::string& name, void* body, unsigned int size, const UploadCallback& callback);

	using DownloadCallback = std::function<void (bool success, std::unique_ptr<char[]>&& data, unsigned int size)>;
	void DownloadFile(const std::string& name, const DownloadCallback& callback);
}
}
