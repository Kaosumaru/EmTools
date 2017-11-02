
module.exports = function(){
    var wasmEnabled = EM_WASM;

    if (!wasmEnabled) {
    	(function() {
    		var memoryInitializer = EM_APPLICATION_NAME + '.html.mem';
    		if (typeof Module['locateFile'] === 'function') {
    			memoryInitializer = Module['locateFile'](memoryInitializer);
    		} else if (Module['memoryInitializerPrefixURL']) {
    			memoryInitializer = Module['memoryInitializerPrefixURL'] + memoryInitializer;
    		}
    		var xhr = Module['memoryInitializerRequest'] = new XMLHttpRequest();
    		xhr.open('GET', memoryInitializer, true);
    		xhr.responseType = 'arraybuffer';
    		xhr.send(null);
    	})();
    }

	var script = document.createElement('script');
	script.src = EM_APPLICATION_NAME + ".js";
	document.body.appendChild(script);
};
