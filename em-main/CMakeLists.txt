cmake_minimum_required (VERSION 3.1)


list(APPEND EM_JSENTRY "${CMAKE_CURRENT_LIST_DIR}/emscripten.js") #entrypoint
list(APPEND EM_JSLIST  "${CMAKE_CURRENT_LIST_DIR}/loader.js")

#-----------
#Build entry list
SET(ENTRY_LIST_WEBPACK "")
FOREACH(f ${EM_JSENTRY})
  LIST(APPEND ENTRY_LIST_WEBPACK "require('${f}');\n")
ENDFOREACH(f)

#Build client entry list
FOREACH(f ${EM_CLIENT_JS_FILES})
  LIST(APPEND ENTRY_LIST_WEBPACK "require('${f}');\n")
ENDFOREACH(f)

#-----------

if(NOT CMAKE_RUNTIME_OUTPUT_DIRECTORY)
  set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR}/bin)
endif()

configure_file( ${EM_HTML_PATH} ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/index.html @ONLY )
configure_file( ${CMAKE_CURRENT_LIST_DIR}/package.json ${CMAKE_BINARY_DIR}/node/package.json @ONLY )
configure_file( ${CMAKE_CURRENT_LIST_DIR}/index.js ${CMAKE_BINARY_DIR}/node/index.js @ONLY )
configure_file( ${CMAKE_CURRENT_LIST_DIR}/webpack.config.js ${CMAKE_BINARY_DIR}/node/webpack.config.js @ONLY )


#----------
#Update NPM
find_program(NPM "npm")
if(NOT NPM)
    message(FATAL_ERROR "NPM not found!")
endif()

if(1)
execute_process(COMMAND ${NPM} "install" WORKING_DIRECTORY "${CMAKE_BINARY_DIR}/node/" RESULT_VARIABLE NPM_RES)

if(NPM_RES)
	SET(IS_WINDOWS true)
    execute_process(COMMAND "${NPM}.cmd" "install" WORKING_DIRECTORY "${CMAKE_BINARY_DIR}/node/" RESULT_VARIABLE NPM_RES)
    if(NPM_RES)
      message(FATAL_ERROR "NPM error!")
    endif()
endif()
endif()
#-----------

if(IS_WINDOWS)
	SET(WEBPACK_PATH "node_modules\\.bin\\webpack.cmd")
else()
	SET(WEBPACK_PATH "./node_modules/.bin/webpack")
endif()


add_custom_command(
  OUTPUT "${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/js/dist.js"
  COMMAND "${WEBPACK_PATH}"
  DEPENDS ${CMAKE_CURRENT_LIST_DIR}/index.js ${EM_JSLIST} ${EM_JSENTRY} ${EM_CLIENT_JS_FILES}
  WORKING_DIRECTORY "${CMAKE_BINARY_DIR}/node/"
)
add_custom_target(EM_MAIN_JS DEPENDS ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/js/dist.js)

#add_custom_target(EM_MAIN COMMAND echo EmMain)
