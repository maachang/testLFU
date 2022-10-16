(function() {
'use strict'

const httpsClient = frequire("./lib/httpsClient.js");

exports.handler = function(resStatus, resHeader, request) {
    console.log("## require: " + httpsClient);
    console.log("## vm: " + frequire("vm"));
    return {hello: "world"};
}

})();