// ログイン用フィルター.
//
(function() {

'use strict'

// ログインマネージャ.
const loginMan = frequire("./lib/auth/manager.js");

// フィルタ対象外パス.
const NO_FILTER_PATH = {
    // ログインTOP画面.
    "/index.html": true,
    // ログイン判定用.
    "/login": true,
    // ログアウト処理用.
    "/logout": true,
};

// リダイレクト先URL.
const REDIRECT_URL = "/index.html";

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
        resState.redirect(REDIRECT_URL);
        return true;
    }
    return false;
}

})();