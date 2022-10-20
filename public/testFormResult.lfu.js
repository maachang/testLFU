(function() {
'use strict'

exports.handler = function(resStatus, resHeader, request) {
    ///console.log(JSON.stringify(request, null, "  "));
    return {postParams: request.params};
}

})();