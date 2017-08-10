#pragma once
#include <functional>
#include <string>
#include <memory>

namespace MX
{
namespace Drive
{
	bool IsInitialized();
	bool IsSignedIn();
	bool CanUse();

	void SignIn();
	void SignOut();

	void SetInitializeCallback(const std::function<void(bool)>& callback);
	void SetSignedInCallback(const std::function<void(bool)>& callback);
}
}
