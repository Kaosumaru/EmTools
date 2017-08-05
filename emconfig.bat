mkdir build
cd build

emcmake cmake ../test -DCMAKE_BUILD_TYPE=Release -DCMAKE_MAKE_PROGRAM=mingw32-make -G "Unix Makefiles"
