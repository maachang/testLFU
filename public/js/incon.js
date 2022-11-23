// inputコントローラー.
// inputタグ内のvalidateなど、コントロールします.
//
// この処理は結構単純な画面、たとえば全体が入力対象の
// 情報の場合に利用する事が適当です.
// 逆に言えば、１つの画面で入力区分が複数ある場合や
// ボタンアクションで項目が増減する場合のような構成の
// 場合は、このinputコントローラの利用は難しいです.
//
(function(_g) {
"use strict";

// 対象要素がundefinedかnullかチェック.
const isNull = function(v) {
   return v == undefined || v == null;
}

// 文字が存在するかチェック.
// n 対象の文字列を設定します.
// 戻り値: trueの場合文字が存在します.
const useString = function(n) {
   if(isNull(n)) {
      return false;
   }
   n = ("" + n).trim();
   return n != "";
}

// 時間差実行.
// call 実行functionを設定します.
// time 実行差の時間(ミリ秒)を設定します.
var loadDelay = function(call, time) {
   // 遅延実行開始時間(ミリ秒)が指定されてない場合.
   time = time|0;
   if(time <= 0) {
      // js読み込み・実行から100ミリ秒後に実行.
      time = 100;
   }
   // 遅延実行.
   setTimeout(function() {
       call();
   }, time);
}

// 対象イベントのキャンセル.
const cancelEvent = function(event) {
   if(!isNull(event)) {
      event.stopPropagation();
      event.preventDefault();
   }
}

// ajaxHeadを整理.
const _ajax_head = function(m, ax, h){
   if(m == 'JSON') {
       ax.setRequestHeader('Content-Type',
           'application/json');
   } else if(m == 'POST') {
       ax.setRequestHeader('Content-Type',
           'application/x-www-form-urlencoded');
   }
   if(!isNull(h)) {
       for(var k in h) {
           ax.setRequestHeader(k, h[k]);
       }
   }
}

// ajaxMethodを整理.
const _ajax_method = function(m) {
   return m == 'JSON' ? 'POST' : m;
}

// httpClient実行.
// url 対象のURLを設定します.
// optins {method: string, header: object, params: object}
//        method HTTPメソッドを設定します.
//        params パラメータを設定します.
//        header 設定したいHTTPリクエストヘッダを設定します.
// 戻り値 promiseオブジェクトが返却されます(async).
//       then({status: number, header: object, body: string}):
//          status: HTTPレスポンスステータスが返却されます.
//          header: HTTPレスポンスヘッダが返却されます.
//          body: HTTPレスポンスBodyが返却されます.
//       catch(e): e: エラー内容が返却されます.
const httpClient = /* async */ function(url, options) {
   if(options == undefined || options == null) {
      options = {};
   }
   // execute ajax(promise=> async).
   return new Promise((resolve, reject) => {
      if(!useString(url)) {
         reject(new Error("No target URL is specified."));
      }
      try {
         let method = !useString(options.method) ?
            "GET" : options.method;
         let params = options.params;
         let header = options.header;
         method = (method+"").toUpperCase();
         var pms = "" ;
         if(!isNull(params)) {
            if(typeof(params) == "string") {
               pms = params ;
            } else if(method == "JSON") {
               pms = JSON.stringify(params);
            } else {
               for( var k in params ) {
                  pms += "&" + k + "=" +
                     encodeURIComponent(params[k]) ;
               }
            }
         }
         params = null;
         if(method == "GET" && pms.length > 0) {
            url = url + "?" + pms;
            pms = null;
         }
         // async.
         let x = new XMLHttpRequest();
         x.open(_ajax_method(method), url, true);
         x.onreadystatechange = function() {
            if(x.readyState == 4) {
               try {
                  let status = x.status|0;
                  status == 0 ? 500 : status;
                  // response headers.
                  let headers = x.getAllResponseHeaders();
                  let arr = headers.trim().split(/[\r\n]+/);
                  let headerMap = {};
                  arr.forEach(function (line) {
                     const parts = line.split(': ');
                     const header = parts.shift();
                     const value = parts.join(': ');
                     headerMap[header.toLowerCase()] = value;
                  });
                  // 正常終了.
                  resolve({
                     status: status,
                     header: headerMap,
                     body: x.responseText
                  });
               } catch(e) {
                  // 例外.
                  reject(new Error(
                     "An error occurred during ajax processing. (url: " +
                        url + ", options: " + JSON.stringify(options, null, "  ") +
                        ")")
                  );
               } finally {
                  x.abort();
                  x = null;
               }
            }
         };
         _ajax_head(method, x, header);
         x.send(pms);
      } catch(e) {
         // 例外.
         reject(new Error(
            "Error in ajax call(url: " +
               url + ", options: " + JSON.stringify(options, null, "  ") +
               ")")
         );
      }
   });
};

// ページ遷移.
// method=GETでページ遷移します.
// url 対象のURLを設定します.
// params 対象のパラメータ(string or object)を設定します.
const movePage = function(url, params) {
   if(params != undefined && params != null) {
      if(typeof(params) != "string") {
         let pms = "";
         for(let k in params) {
            if(pms.length != 0) {
               pms += "&";
            }
            pms += encodeURIComponent(k) + "=" +
               encodeURIComponent(params[k]);
         }
         params = pms;
      } else {
         params = "" + params;
      }
      if(url.indexOf("?") != -1) {
         url += "&" + params;
      } else {
         url += "?" + params;
      }
   }
   location.href = url;
}

// 対象オブジェクトがDomオブジェクトかチェック.
// obj 対象のオブジェクトを設定します.
// 戻り値: trueの場合Dom要素です.
const isDomElement = function(obj) {
   try {
      return obj instanceof HTMLElement;
   } catch(e) {
      return (typeof obj==="object") &&
         (obj.nodeType===1) && (typeof obj.style === "object") &&
         (typeof obj.ownerDocument ==="object");
   }
}

// 対象Elementのタグ名が一致するかチェック.
// elemet 対象のDom要素を設定します.
// name 一致するタグ名のチェックを行います.
// 戻り値: trueの場合一致します.
const isTagName = function(element, name) {
   if(isNull(element) || isNull(element.tagName) ||
      isNull(name)) {
      return false;
   }
   return element.tagName.toLowerCase() == name.toLowerCase();
}

// validate条件をクリア.
// e 対象のDom要素を設定します.
const clearValidate = function(e) {
   // costomValidityをクリア.
   try {
      e.setCustomValidity("");
   } catch(e) {
      console.error("[error] clearValidate", e);
   }
}

// validate対象の処理.
// e 対象のDom要素を設定します.
const targetValidate = function(e) {
   try {
      // validateメッセージが存在する場合.
      if(useString(e.getAttribute("v-msg"))) {
         e.setCustomValidity("　" + e.getAttribute("v-msg"));
      }
      // 検出したValidate位置に移動.
      e.reportValidity();
      // スクロールを少し上に移動.
      // これで少しは見やすくなる。
      scrollBy(0, -150);
   } catch(e) {
      console.error("[error] targetValidate", e);
   }
}

// inputタグに min, max が設定されている場合は
// 長さを図る.
// input.type = number の場合は、中の数字のmin, maxを
// チェックします.
// それ以外は、文字の長さをチェックします.
// e 対象のInputDom要素を設定します.
// 戻り値: trueの場合validate対象.
const checkMinMax = function(e) {
   if(!isTagName(e, "input")) {
      return false;
   }
   // valueを取得.
   let value = e.value;
   if(!useString(value)) {
      // 空の場合は処理しない.
      return false;
   }
   // minを取得.
   let min = useString(e.getAttribute("v-min")) ?
      parseInt(e.getAttribute("v-min")) : null;
   min = (min == null || isNaN(min)) ?
      null : min;
   // maxを取得.
   let max = useString(e.getAttribute("v-max")) ?
      parseInt(e.getAttribute("v-max")) : null;
   max = (max == null || isNaN(max)) ?
      null : max;
   // 正しく設定されていない場合.
   if(min == null && max == null) {
      // 処理しない.
      return false;
   }
   value = value.trim();
   const type = e.type.toLowerCase();
   let vlen = value.length;
   // input type = numberの場合.
   if(type == "number") {
      // valueを数字変換.
      vlen = parseInt(value);
      // 内容が数字でない場合はvalidate.
      if(isNaN(vlen)) {
         return true;
      }
   }
   // input min が設定されている場合.
   if(min != null && min > vlen) {
      return true;
   }
   // input max が設定されている場合.
   else if(max != null && max < vlen) {
      return true;
   }
   return false;
}

// 対象Dom要素をvalidate.
// e 対象のDom要素を設定します.
// 戻り値: trueの場合、validateを検出しました.
const isValudateToDom = function(e) {
   if(!isDomElement(e)) {
      throw new Error(
         "The specified object is not a Dom element.");
   }
   // validateをクリア.
   clearValidate(e);
   // validate対象の場合.
   if(
      // 入力必須のvalidateの場合.
      (e.required && !e.checkValidity()) ||
      // 最小・最大設定があった場合のvalidateの場合.
      checkMinMax(e)) {
      
      // 検出したValidate処理.
      targetValidate(e);
      return true;
   }
   return false;
}

// form内の要素をvalidate.
// form 対象のFormDom要素を設定します.
// 戻り値: trueの場合、validateを検出しました.
const isValidateToForm = function(form) {
   const list = form.elements;
   const len = list.length;
   // validateをクリア.
   for(let i = 0; i < len; i ++) {
      clearValidate(list[i]);
   }
   // validate処理を実行.
   for(let i = 0; i < len; i ++) {
      // validateチェック.
      if(isValudateToDom(list[i])) {
         return true;
      }
   }
   return false;
}

// 入力タグ名群.
const INPUT_DOM_TAGS = [
   "input", "select", "textarea"
]

// dom.nameに一致するDom一覧を取得.
// arguments dom.name, dom.name, .... と設定します.
// dom.name は <input name>のようなものを指します.
// 戻り値: 指定名に一致したDom群(Array)が返却されます
const getDomNameArrayToDom = function() {
   // 指定名のMapを作成します.
   const nameMap = {};
   let len = arguments.length;
   for(let i = 0; i < len; i ++) {
      nameMap[arguments[i]] = true;
   }
   let tag, list, lenJ, e;
   const ret = [];
   // 入力タグ群でDomのnameを検索.
   len = INPUT_DOM_TAGS.length;
   for(let i = 0; i < len; i ++) {
      tag = INPUT_DOM_TAGS[i];
      // 当該対象の入力Dom群を取得.
      list = document.getElementsByTagName(tag);
      lenJ = list.length;
      for(let j = 0; j < lenJ; j ++) {
         e = list[j];
         if(!isTagName(e, tag)) {
            continue;
         }
         // 指定名と一致するDomの場合.
         if(nameMap[e.name]) {
            // Dom追加.
            ret[ret.length] = e;
         }
      }
   }
   return ret;
}

// dom.name名群を指定してValidate処理.
// arguments dom.name, dom.name, .... と設定します.
// dom.name は <input name>のようなものを指します.
// 戻り値: trueの場合、validateを検出しました.
const isValidateToDomNameAray = function() {
   const list = getDomNameArrayToDom.apply(
      null, arguments);
   const len = list.length;
   // validateをクリア.
   for(let i = 0; i < len; i ++) {
      clearValidate(list[i]);
   }
   // validate処理を実行.
   for(let i = 0; i < len; i ++) {
      // validateチェック.
      if(isValudateToDom(list[i])) {
         return true;
      }
   }
   return false;
}

// dom.name名群を指定してパラメータ取得.
// arguments dom.name, dom.name, .... と設定します.
// dom.name は <input name>のようなものを指します.
// 戻り値: dom内容が返却されます.
const getDomNameArrayToParams = function() {
   const list = getDomNameArrayToDom.apply(
      null, arguments);
   const len = list.length;
   let e, type, key, val, o;
   const ret = {};
   for(let i = 0; i < len; i ++) {
      e = list[i];
      // dom.name を取得.
      if(useString(e.name)) {
         // nameで取得.
         key = e.name;
      } else {
         // 存在しない場合は対象としない.
         continue;
      }
      // typeを取得.
      type = e.type.toLowerCase();
      // テキストエリア.
      if(isTagName(e, "textarea")) {
         // 改行コード[￥r￥n]を[￥n]に置き換える.
         val = e.value;
         let bef = val;
         // 効率悪いけどこれで変換.
         while(true) {
            val = val.replace("\r\n", "\n");
            if(bef == val) {
               // 変換終了.
               break;
            }
            bef = val;
         }
      // ラジオボタン.
      } else if(type == "radio") {
         // checkedがONのvalueを取得.
         if(e.checked) {
            val = e.value;
         } else {
            // 存在しない場合は対象としない.
            continue;
         }
      // チェックボックス.
      } else if(type == "checkbox") {
         // checkedがONのvalueを取得.
         if(e.checked) {
            val = e.value;
         } else {
            // 存在しない場合は対象としない.
            continue;
         }
      // それ以外(他input or select).
      } else {
         val = e.value;
      }
      // 複数存在する可能性の場合.
      // input type=radio.
      // のみを対象とする.
      // ※selectの複数対応は除外.
      if(type == "radio") {
         // key条件が存在しない場合.
         if(ret[key] == undefined) {
            // 配列でセット.
            ret[key] = [val];
         // key条件が存在する場合.
         } else {
            // 配列に追加.
            o = ret[key];
            o[o.length] = val;
         }
      } else {
         // 単体でセット.
         ret[key] = val;
      }
   }
   return ret;
}

// ※この処理はbody読み込み後に実行する必要があります.
// 全テキストエリアにautoHeightByTextAreaを適用する.
// これを設定する事で、入力枠に対して一定以上の改行が入ると
// 自動的に増減するように対応できる.
var autoHeightToTextArea = function() {
   // 実行後100ミリ秒(デフォルト値)で反映させる.
   loadDelay(function() {
      let textarea, clientHeight;
      const list = document.getElementsByTagName("textarea");
      const len = list.length;
      for(var i = 0; i < len; i ++) {
         textarea = list[i];
         if(!isTagName(textarea, "textarea")) {
            continue;
         }
         // 現状の大きさを取得.
         clientHeight = textarea.clientHeight;
         // 現状の大きさとスクロールサイズでリサイズ.
         textarea.style.height = clientHeight + 'px';
         textarea.style.height = textarea.scrollHeight + 'px';
         // 入力毎に現状の大きさとスクロールサイズでリサイズ.
         textarea.addEventListener('input', function(event) {
            var target = event.target;
            // 現状の大きさとスクロールサイズでリサイズ.
            target.style.height = clientHeight + 'px';
            target.style.height = target.scrollHeight + 'px';
         });
      }
   });
}

// エラーメッセージを表示.
// message 対象のメッセージを設定します.
// 戻り値: trueの場合、正しく処理されました.
const errorMessage = function(message) {
   const e = document.getElementById("errorMessage");
   if(e != undefined) {
      e.innerHTML = message;
      return true;
   }
   return false;
}

// エラーメッセージをクリア.
// 戻り値: trueの場合、正しく処理されました.
const clearErrorMessage = function() {
   return errorMessage("");
}

/////////////////////////////////////////////////////
// 外部定義.
/////////////////////////////////////////////////////
const o = {};
_g.incon = o;
o.httpClient = httpClient;
o.movePage = movePage;
o.cancelEvent = cancelEvent;
o.isValudateToDom = isValudateToDom;
o.isValidateToForm = isValidateToForm;
o.isValidateToDomNameAray = isValidateToDomNameAray;
o.getDomNameArrayToParams = getDomNameArrayToParams;
o.autoHeightToTextArea = autoHeightToTextArea;
o.errorMessage = errorMessage;
o.clearErrorMessage = clearErrorMessage;

})(this);