cmake_minimum_required (VERSION 3.1)
project (EmTools)

#set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${PROJECT_BINARY_DIR}/bin)

#if (MSVC)
#add_definitions( "/DMX_PLATFORM_MSVC  /DUNICODE /D_UNICODE" )
#add_definitions( "/W3 /D_CRT_SECURE_NO_WARNINGS /wd4005 /wd4996 /wd4250 /wd4244 /nologo /Zm180" )
#endif(MSVC)

#if (EMSCRIPTEN)
#  set(CMAKE_EXECUTABLE_SUFFIX ".html")
#  add_definitions("-std=c++14")
#  set(MX_LINK_FLAGS "--bind -s TOTAL_MEMORY=67108864" )
#endif(EMSCRIPTEN)

#include_directories(${PROJECT_SOURCE_DIR} PUBLIC)
set(EM_BINARY_NAME "${EM_BINARY_NAME}")
set(EM_HTML_PATH "${EM_HTML_PATH}")
if(NOT EM_HTML_PATH)
		set(EM_HTML_PATH ${CMAKE_CURRENT_LIST_DIR}/html/index.html)
endif()

include("em-utils/CMakeLists.txt")
include("em-appdata/CMakeLists.txt")
include("em-drive/CMakeLists.txt")
include("em-main/CMakeLists.txt")

#add_executable(EmTools test/main.cpp ${EM_CPP_SRC})
#set_target_properties(EmTools PROPERTIES LINK_FLAGS "${MX_LINK_FLAGS}")
#add_dependencies(EmTools EM_MAIN_JS)

add_library(EmTools ${EM_CPP_SRC})
add_dependencies(EmTools EM_MAIN_JS)
target_include_directories(EmTools PUBLIC ${PROJECT_SOURCE_DIR})
