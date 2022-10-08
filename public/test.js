(function() {
'use strict'

const httpsClient = require("httpsClient");

exports.handler = function(resStatus, resHeader, request) {
    console.log("## httpsClient: " + httpsClient);
    return {hello: "world"};
}

})();