// ログイン済み確認用フィルター.
//
(function() {

'use strict'

// ログインマネージャ.
const loginMan = frequire("./lib/auth/manager.js");

// フィルタ対象外パス.
const NO_FILTER_PATH = {
    // root表示.
    "/": true,
    // ログインリダイレクト画面.
    "/index.html": true,
    // ログイン入力画面.
    "/login.jhtml": true,
    // ログイン判定用.
    "/login": true,
    // ログアウト処理用.
    "/logout": true,
    // requestOAuth処理用.
    "/requestOAuth": true,
    "/requestOAuth.html": true,
    // resultOAuth処理用.
    "/resultOAuth": true,
};

// リダイレクト先URL.
const REDIRECT_URL = "/index.html";

// ログアウト済みメッセージ.
const LOGOUT_MESSAGE =
    "未ログインまたはログインタイムアウトしています.\nログイン画面に遷移します.";

// リダイレクト先に対するUrlメッセージを送信.
// アラートで表示されます.
const sendUrlMessage = function(url, message) {
    if(url.indexOf("?") == -1) {
        return url + "?message=" +
            encodeURIComponent(message);     
    } else {
        return url + "&message=" +
            encodeURIComponent(message);     
    }
}

// コンテンツ実行の事前処理を行いたい場合は設定.
// たとえば、何らかのアクセス認証を行いたい場合は、filterFuncを設定して行う.
// outBody Array[0]に返却対象の処理結果のレスポンスBodyを設定します.
// resState: レスポンスステータス(httpStatus.js).
// resHeader レスポンスヘッダ(httpHeader.js).
// request Httpリクエスト情報.
// 戻り値: true / false(boolean).
//        trueの場合filter処理で処理終了となります.
exports.filter = async function(
    outBody, resState, resHeader, request) {
    const tm = Date.now()
    
    // ログインパス以外の場合は、ログイントークンチェック.
    if(await loginMan.filter(
        outBody, resState, resHeader, request, NO_FILTER_PATH)) {
        let url = REDIRECT_URL;
        // 遷移先のパスを取得.
        const path = request.path;
        // ログイン成功後にreferer先に遷移が必要な場合.
        if(path != undefined || path != "/") {
            // refererのURLを設定.
            url += "?srcURL=" + encodeURIComponent(path);
        }
        // ログイン先へリダイレクト.
        outBody[null];
        // ログアウト済みのメッセージを送信.
        resState.redirect(
            sendUrlMessage(url, LOGOUT_MESSAGE));
        return true;
    }
    return false;
}

})();