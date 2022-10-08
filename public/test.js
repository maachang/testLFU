(function() {
'use strict'

//const httpsClient = require("httpsClient");

exports.handler = function(resStatus, resHeader, request) {
    console.log("## require: " + global.frequire);
    console.log("## vm: " + global.frequire("vm"));
    return {hello: "world"};
}

})();