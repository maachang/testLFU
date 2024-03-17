// ログアウト処理.
//
(function() {
'use strict'

// ログイン認証.
const authLogin = frequire("./lib/auth/authLogin.js");

// ログアウト処理.
// resState レスポンスステータスを設定します.
// resHeader レスポンスヘッダを設定します.
// request リクエスト情報を設定します.
// 戻り値: レスポンスBody情報を返却します.
exports.handler = async function(
    resState, resHeader, request) {
    try {
        // ログアウト処理.
        await authLogin.logout(resHeader, request);
    } catch(e) {
        // 例外出力.
        console.error("error logout", e);
        // status500.
        resState.setStatus(500);
    }
}

})();