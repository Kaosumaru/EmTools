cmake_minimum_required (VERSION 3.1)

MESSAGE( STATUS "EM-MAIN added:    " ${CMAKE_BINARY_DIR} )
MESSAGE( STATUS "EMMAIN_JS_LIST:    " ${EM_JSLIST} )

configure_file( ${CMAKE_CURRENT_LIST_DIR}/html/test_index.html ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/index.html @ONLY )
configure_file( ${CMAKE_CURRENT_LIST_DIR}/html/js/drive.js ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/js/drive.js @ONLY )
configure_file( ${CMAKE_CURRENT_LIST_DIR}/package.json ${CMAKE_BINARY_DIR}/node/package.json @ONLY )
configure_file( ${CMAKE_CURRENT_LIST_DIR}/index.js ${CMAKE_BINARY_DIR}/node/index.js @ONLY )
configure_file( ${CMAKE_CURRENT_LIST_DIR}/webpack.config.js ${CMAKE_BINARY_DIR}/node/webpack.config.js @ONLY )


find_program(NPM "npm")
if(NOT NPM)
    message(FATAL_ERROR "NPM not found!")
endif()

if(1)
execute_process(COMMAND ${NPM} "install" WORKING_DIRECTORY "${CMAKE_BINARY_DIR}/node/" RESULT_VARIABLE NPM_RES)

if(NPM_RES)
    execute_process(COMMAND ${NPM}.cmd "install" WORKING_DIRECTORY "${CMAKE_BINARY_DIR}/node/" RESULT_VARIABLE NPM_RES)
    if(NPM_RES)
      message(FATAL_ERROR "NPM error!")
    endif()
endif()
endif()

add_custom_command(
  OUTPUT "${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/js/dist.js"
  COMMAND "node_modules\\.bin\\webpack.cmd"
#  DEPENDS ${EM_JSLIST}
  WORKING_DIRECTORY "${CMAKE_BINARY_DIR}/node/"
)
add_custom_target(EM_MAIN_JS DEPENDS ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/js/dist.js)

#add_custom_target(EM_MAIN COMMAND echo EmMain)
