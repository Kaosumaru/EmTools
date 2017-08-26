#include "Idb.h"
#include <cinttypes>
#include <iostream>
#include <tuple>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>


namespace MX {
namespace IDB {
	namespace
	{
		void onOKFunction(void* arg)
		{
			if (!arg) return;
			std::unique_ptr<CallbackFunction> cb{ (CallbackFunction*)arg };
			(*cb)(true);
		}

		void onErrorFunction(void* arg)
		{
			if (!arg) return;
			std::unique_ptr<CallbackFunction> cb{ (CallbackFunction*)arg };
			(*cb)(false);
		}
	}


	void Load(const char* db_name, const char* file_id, const OnLoadFunction& onLoad)
	{
		auto cb = onLoad ? new OnLoadFunction{onLoad} : nullptr;
		em_async_wget_onload_func onLoadFunction = [](void* arg, void* buffer, int size)
        {
			if (!arg) return;
            std::unique_ptr<OnLoadFunction> cb{ ( OnLoadFunction* )arg };
            (*cb)(buffer, size);
        };

        em_arg_callback_func onErrorFunction = []( void* arg )
        {
			if (!arg) return;
			std::unique_ptr<OnLoadFunction> cb{ ( OnLoadFunction* )arg };
            (*cb)(nullptr, 0);
        };
		emscripten_idb_async_load(db_name, file_id, cb, onLoadFunction, onErrorFunction);
	}

	void Store(const char* db_name, const char* file_id, void* data, int size, const CallbackFunction& onStore)
	{
		auto cb = onStore ? new CallbackFunction{onStore} : nullptr;
		emscripten_idb_async_store(db_name, file_id, data, size, cb, onOKFunction, onErrorFunction);
	}

	void Delete(const char* db_name, const char* file_id, const CallbackFunction& onDelete)
	{
		auto cb = onDelete ? new CallbackFunction{onDelete} : nullptr;
		emscripten_idb_async_delete(db_name, file_id, cb, onOKFunction, onErrorFunction);
	}

	void Exists(const char* db_name, const char* file_id, const CallbackFunction& callback)
	{
		auto cb = callback ? new CallbackFunction{callback} : nullptr;
		em_idb_exists_func onExists = [](void* arg, int exists)
        {
			if (!arg) return;
			std::unique_ptr<CallbackFunction> cb{ (CallbackFunction*)arg };
			(*cb)(exists != 0);
        };
		emscripten_idb_async_exists(db_name, file_id, cb, onExists, onErrorFunction);
	}
}
}
#endif
