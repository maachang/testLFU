(function() {
'use strict'

//const httpsClient = require("httpsClient");

exports.handler = function(resStatus, resHeader, request) {
    console.log("## require: " + global.require);
//    console.log("## httpsClient: " + httpsClient);
    return {hello: "world"};
}

})();