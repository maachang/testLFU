(function() {
'use strict'

const httpsClient = frequire("httpsClient");

exports.handler = function(resStatus, resHeader, request) {
    console.log("## require: " + httpsClient);
    console.log("## vm: " + frequire("vm"));
    return {hello: "world"};
}

})();