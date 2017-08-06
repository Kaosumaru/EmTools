#pragma once
#include <functional>
#include <string>
#include <memory>

namespace MX
{
namespace Drive
{
	enum class NetworkResponse {
		OK,
		TemporaryError,
		FatalError
	};

	using UploadCallback = std::function<void (NetworkResponse success)>;
	void UploadFile(const std::string& name, void* body, unsigned int size, const UploadCallback& callback);

	using DownloadCallback = std::function<void (NetworkResponse success, std::unique_ptr<char[]>&& data, unsigned int size)>;
	void DownloadFile(const std::string& name, const DownloadCallback& callback);
}
}
