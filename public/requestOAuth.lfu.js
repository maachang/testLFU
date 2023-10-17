// oAuthRequest処理.
//
(function() {
'use strict'

// oAuth.
const gasAuth = frequire("./lib/auth/gasAuth.js");

// oAuthのリクエスト処理を実施.
// resState レスポンスステータスを設定します.
// resHeader レスポンスヘッダを設定します.
// request リクエスト情報を設定します.
// 戻り値: レスポンスBody情報を返却します.
exports.handler = async function(resState, resHeader, request) {
    // gasAuthURLを取得.
    const oauthUrl = gasAuth.executeOAuthURL(request);
    // allowAccessDataURLを取得.
    const allowAccessDataURL = gasAuth.allowAccountDataURL();
    // リダイレクト.
    resState.redirect(
        "/requestOAuth.html?oauthUrl=" + encodeURIComponent(oauthUrl) +
        "&allowAd=" + encodeURIComponent(allowAccessDataURL));
}

})();