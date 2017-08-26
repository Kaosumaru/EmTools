#pragma once
#include <functional>
#include <string>
#include <memory>

namespace MX
{
namespace IDB
{
	using OnLoadFunction = std::function<void( void* data, int size )>;
	using CallbackFunction = std::function<void( bool success )>;

	void Load(const char* db_name, const char* file_id, const OnLoadFunction& onLoad);
	void Store(const char* db_name, const char* file_id, void* data, int size, const CallbackFunction& onStore);
	void Delete(const char* db_name, const char* file_id, const CallbackFunction& onDelete);
	void Exists(const char* db_name, const char* file_id, const CallbackFunction& callback);
}
}
