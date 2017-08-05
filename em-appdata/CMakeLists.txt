cmake_minimum_required (VERSION 3.1)

list(APPEND EM_JSENTRY "${CMAKE_CURRENT_LIST_DIR}/drive_appdata.js")
list(APPEND EM_CPP_SRC "${CMAKE_CURRENT_LIST_DIR}/DriveAppData.cpp")
list(APPEND EM_CPP_HEADER "${CMAKE_CURRENT_LIST_DIR}/DriveAppData.h")
