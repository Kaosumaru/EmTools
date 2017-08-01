cmake_minimum_required (VERSION 3.1)

MESSAGE( STATUS "EM-MAIN added:    " ${CMAKE_BINARY_DIR} )
MESSAGE( STATUS "EMMAIN_JS_LIST:    " ${CMAKE_CURRENT_LIST_DIR} )

configure_file( ${CMAKE_CURRENT_LIST_DIR}/html/test_index.html ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/index.html @ONLY )
configure_file( ${CMAKE_CURRENT_LIST_DIR}/html/js/drive.js ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/js/drive.js @ONLY )
