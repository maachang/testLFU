// ログイン用フィルター.
//
(function() {

'use strict'

// ログインマネージャ.
const loginMan = frequire("./lib/auth/manager.js");

// フィルタ対象外パス.
const NO_FILTER_PATH = {
    // ログインリダイレクト画面.
    "/index.html": true,
    // ログイン入力画面.
    "/login.jhtml": true,
    // ログイン判定用.
    "/login": true,
    // ログアウト処理用.
    "/logout": true,
};

// リダイレクト先URL.
const REDIRECT_URL = "/index.html";

// ログアウト済みメッセージ.
const LOGOUT_MESSAGE =
    "ログイン寿命/ログアウト/同一ユーザのログインで再ログインが必要です";

// リダイレクト先に対するUrlメッセージを送信.
// アラートで表示されます.
const sendUrlMessage = function(url, message) {
    return url + "?message=" +
        encodeURIComponent(message);     
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
    
    // ログインパス以外の場合は、ログイントークンチェック.
    if(await loginMan.filter(
        outBody, resState, resHeader, request, NO_FILTER_PATH)) {
        // ログイン先へリダイレクト.
        outBody[null];
        // ログアウト済みのメッセージを送信.
        resState.redirect(
            sendUrlMessage(REDIRECT_URL, LOGOUT_MESSAGE));
        return true;
    }
    return false;
}

})();