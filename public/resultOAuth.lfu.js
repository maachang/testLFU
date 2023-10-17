// oAuthResult処理.
//
(function() {
'use strict'

// oAuth.
const gasAuth = frequire("./lib/auth/gasAuth.js");

// oAuthのResult処理を実施.
// resState レスポンスステータスを設定します.
// resHeader レスポンスヘッダを設定します.
// request リクエスト情報を設定します.
// 戻り値: レスポンスBody情報を返却します.
exports.handler = async function(resState, resHeader, request) {
    // redirectAuthを実行.
    if(!await gasAuth.redirectOAuth(resState, resHeader, request)) {
        // srcURLが存在しない場合は、自分でリダイレクト.
        resState.setStatus(301);
        resHeader.put("location", "/menu.jhtml");
     }
}

})();