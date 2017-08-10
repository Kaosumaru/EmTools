#include "Drive.h"
#include <cinttypes>
#include <iostream>

using namespace MX;
using namespace MX::Drive;

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#include <emscripten/bind.h>

namespace MX {
namespace Drive {

namespace
{
	bool initialized = false;
	bool signedIn = false;
	std::function<void(bool)> InitializeCallback;
	std::function<void(bool)> SignedInCallback;

	void InitializeCallbackJS()
	{
		initialized = true;
		InitializeCallback(initialized);
	}

	void SignedInCallbackJS(bool _signedIn)
	{
		signedIn = _signedIn;
		SignedInCallback(signedIn);
	}

	EMSCRIPTEN_BINDINGS(Drive) {
			emscripten::function("DriveInitializeCallbackJS", &InitializeCallbackJS);
			emscripten::function("SignedInCallbackJS", &SignedInCallbackJS);
	}
}


bool IsInitialized()
{
	return initialized;
}

bool IsSignedIn()
{
	return signedIn;
}

bool CanUse()
{
	return IsInitialized() && IsSignedIn();
}

void SignIn()
{
	EM_ASM({ gapi.auth2.getAuthInstance().signIn(); });
}

void SignOut()
{
	EM_ASM({ gapi.auth2.getAuthInstance().signOut(); });
}

void SetInitializeCallback(const std::function<void(bool)>& callback)
{
	InitializeCallback = callback;
}

void SetSignedInCallback(const std::function<void(bool)>& callback)
{
	SignedInCallback = callback;
}


}
}

#endif
