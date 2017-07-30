cmake_minimum_required (VERSION 2.8)
project (DriveApp)

set(APPLICATION_MAJOR_VERSION 0)
set(APPLICATION_MINOR_VERSION 0)
set(APPLICATION_PATCH_VERSION 1)

set(APPLICATION_NAME "DriveApp")

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR}/bin)

add_definitions(-DMX_APPLICATION_NAME="${APPLICATION_NAME}")

set(STARTFILE "\n#ifdef __EMSCRIPTEN__\n#include \"emscripten.h\"\nnamespace MX{ namespace Drive{\nvoid InitializeDrive(){\nEM_ASM({")
set(ENDFILE "\n});\n}\n}}\n#endif")
configure_file( js/drive_appdata.js src/drive_appdata.cpp @ONLY )
configure_file( html/test_index.html ${PROJECT_BINARY_DIR}/bin/index.html @ONLY )

if (MSVC)
#configure_msvc_runtime()
add_definitions( "/DMX_PLATFORM_MSVC  /DUNICODE /D_UNICODE" )
add_definitions( "/W3 /D_CRT_SECURE_NO_WARNINGS /wd4005 /wd4996 /wd4250 /wd4244 /nologo /Zm180" )
endif(MSVC)

if (EMSCRIPTEN)
  set(CMAKE_EXECUTABLE_SUFFIX ".html")
  add_definitions("-std=c++14")
  set(MX_LINK_FLAGS "--bind -s TOTAL_MEMORY=67108864" )
endif(EMSCRIPTEN)

include_directories(${PROJECT_SOURCE_DIR})

add_executable(DriveApp test/main.cpp src/DriveAppData.cpp ${CMAKE_CURRENT_BINARY_DIR}/src/drive_appdata.cpp)
set_target_properties(DriveApp PROPERTIES LINK_FLAGS "${MX_LINK_FLAGS}")
