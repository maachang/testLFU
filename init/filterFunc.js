(function() {

'use strict'

// コンテンツ実行の事前処理を行いたい場合は設定.
// たとえば、何らかのアクセス認証を行いたい場合は、filterFuncを設定して行う.
// out Array[0]に返却対象の処理結果のレスポンスBodyを設定します.
// resState: レスポンスステータス(httpStatus.js).
// resHeader レスポンスヘッダ(httpHeader.js).
// request Httpリクエスト情報.
// 戻り値: true / false(boolean).
//        trueの場合filter処理で処理終了となります.
exports["function"] = function(out, resState, resHeader, request) {
    console.log("filterFunction");
    return false;
}

})();