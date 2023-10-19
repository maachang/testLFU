// ログイン処理.
//
(function() {
'use strict'

// ログインマネージャ.
const passwordAuth = frequire("./lib/auth/passwordAuth.js");

// ログイン処理.
// resState レスポンスステータスを設定します.
// resHeader レスポンスヘッダを設定します.
// request リクエスト情報を設定します.
// 戻り値: レスポンスBody情報を返却します.
exports.handler = async function(
    resState, resHeader, request) {
    try {
        // postで送信されていない場合.
        if(request.method != "POST") {
            // status403.
            resState.setStatus(403);
            return;
        }
        // 時限的セッションをチェック.
        // これにより、直接アクセス・アカウントでの機械的アクセス解析を防ぐ.
        const timedSessions = request.header.get(
            "x-login-timed-session");
        // 存在しない場合.
        if(timedSessions == undefined) {
            // status403.
            resState.setStatus(403);
            return;
        }
        // 時限的セッション内容が一致しない場合.
        if(!passwordAuth.manager.isTimedSession(request, timedSessions)) {
            // 時限的セッションタイムアウト.
            // status401.
            resState.setStatus(401);
            return;
        }
        // パラメータを取得.
        const params = request.params;
        // ログイン問い合わせ.
        const ret = await passwordAuth.login(
            resHeader, request, params.userName, params.password);
        // ログイン失敗の場合.
        if(!ret) {
            // status403.
            resState.setStatus(403);
            return;
        }
        return ret;
    } catch(e) {
        console.error("error login", e);
        // status403.
        resState.setStatus(403);
    }
}

})();