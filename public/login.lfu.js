// ログイン処理.
//

// ログインマネージャ.
const loginMan = frequire("./lib/auth/manager.js");

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
        }
        // パラメータを取得.
        const params = request.params;
        // ログイン問い合わせ.
        const ret = await loginMan.login(
            resHeader, request, params.user, params.password);
        // ログイン失敗の場合.
        if(!ret) {
            // status403.
            resState.setStatus(403);
        }
    } catch(e) {
        console.error("error login", e);
        // status403.
        resState.setStatus(403);
    }
}
