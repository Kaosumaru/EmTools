cmake_minimum_required (VERSION 3.1)
project (EmToolsTest)
include_directories(${PROJECT_SOURCE_DIR})
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR}/bin)

if (MSVC)
add_definitions( "/DMX_PLATFORM_MSVC  /DUNICODE /D_UNICODE" )
add_definitions( "/W3 /D_CRT_SECURE_NO_WARNINGS /wd4005 /wd4996 /wd4250 /wd4244 /nologo /Zm180" )
endif(MSVC)

if (EMSCRIPTEN)
  set(CMAKE_EXECUTABLE_SUFFIX ".html")
  add_definitions("-std=c++14")
  set(MX_LINK_FLAGS "--bind -s TOTAL_MEMORY=67108864" )
endif(EMSCRIPTEN)

set(EM_BINARY_NAME "EmToolsTest")
add_subdirectory (.. EmTools)

add_executable(EmToolsTest main.cpp )
target_link_libraries(EmToolsTest LINK_PUBLIC EmTools)
set_target_properties(EmToolsTest PROPERTIES LINK_FLAGS "${MX_LINK_FLAGS}")
