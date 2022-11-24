/**
 * dialog.js
 */
(function(_g) {
"use strict";

// nowLoading-z-index.
const NOW_LOADING_ZINDEX = 500;

// nowLoadingViewId.
const NOW_LOADING_VIEW_ID = "nowLoadingView";

// nowLoadingBackRGBA.
const NOW_LOADING_RGBA = {r:32,g:32,b:32,a:0.5};

// alert-z-index.
const ALERT_ZINDEX = 1000;

// alertViewId.
const ALERT_VIEW_ID = "alertView";

// alert confirm yes button id.
const ALERT_YES_BUTTON_ID = ALERT_VIEW_ID + "_" + "yes";

// alert confirm no button id.
const ALERT_NO_BUTTON_ID = ALERT_VIEW_ID + "_" + "no";

// shadow dialog.
const BACK_DIALOG_SHADOW = "box-shadow: 10px 10px 10px rgba(0,0,0,0.75);";

// alert window id.
const ALERT_WINDOW_ID = "alertWindowId";

// 時間差コール.
const timeLagCall = function(call) {
    setTimeout(function() {
        call();
    }, 150);
}

// isNull(undefined or null).
const isNull = function(value) {
    return value == undefined || value == null; 
}

// Screen display while loading.
const nowLoading = function(rgba) {
    // get nowLoadingViewId.
    let em = document.getElementById(NOW_LOADING_VIEW_ID);
    if(isNull(em)) {
        return;
    }
    if(isNull(rgba)) {
        rgba = NOW_LOADING_RGBA;
    }
    let w = document.documentElement.scrollWidth || document.body.scrollWidth;
    let h = document.documentElement.scrollHeight || document.body.scrollHeight;
    em.innerHTML = "<div style='z-index:" + NOW_LOADING_ZINDEX +
        ";position:absolute;width:"+w+"px;height:"+h+"px;" +
        "left:0px;top:0px;background-color:rgba("
            +rgba.r+","+rgba.g+","+rgba.b+","+rgba.a+");' " +
        // Block physical access.
        "onkeydown='event.preventDefault()' " +
        "onclick='event.preventDefault()' " +
        "ontouchstart='event.preventDefault()' " +
        "ontouchend='event.preventDefault()' " +
        "ontouchmove='event.preventDefault()'" +
        ">" + "</div>";
}

// Clears the screen display while loading. 
const clearNowLoading = function() {
    // get nowLoadingViewId.
    const em = document.getElementById(NOW_LOADING_VIEW_ID);
    if(isNull(em)) {
        return;
    }
    em.innerHTML = "";
}

// Calculate the optimal size of the dialog display frame. 
const dialogPositionCalcSize = function() {
    let left, top, width, height, radius;
    const w = innerWidth;
    const h = innerHeight;
    if(w > h) {
        left = (w*0.3)|0;
        top = (h*0.2)|0;
        width = (w*0.4)|0;
        height = (h*0.6)|0;
        radius = 10;
    } else {
        left = (w*0.15)|0;
        top = (h*0.2)|0;
        width = (w*0.7)|0;
        height = (h*0.6)|0;
        radius = 10;
    }
    return {w:w,h:h,left:left,top:top,width:width,
        height:height,radius:radius};
}

// change html.
const changeHtml = (function() {
    const _chkCD = "&<>\'\" \r\n" ;
    return function( string ) {
        let len = string.length ;
        let chkCd = _chkCD ;
        let ret = "";
        let c ;
        for(let i = 0 ; i < len ; i ++) {
            switch(chkCd.indexOf(c = string.charAt( i ))) {
                case -1: ret += c; break;
                case 0 : ret += "&amp;" ; break ;
                case 1 : ret += "&lt;" ; break ;
                case 2 : ret += "&gt;" ; break ;
                case 3 : ret += "&#039;" ; break ;
                case 4 : ret += "&#034;" ; break ;
                case 5 : ret += "&nbsp;" ; break ;
                case 6 : ret += "" ; break ;
                case 7 : ret += "<br>" ; break ;
                case 8 : ret += "<" ; break ;
                case 9 : ret += ">" ; break ;
            }
        }
        return ret
    }
})();

// add js event.
const addEvent = function(node, name, func) {
    if(isNull(node)) {
        node = window;
    }
    if(node.addEventListener){
        node.addEventListener(name, func, false);
    } else if(node.attachEvent){
        node.attachEvent("on" + name, func);
    }
}

// clear alert window.
const clearAlertWindow = function(noneNowLoading) {
    // get alertViewId.
    const em = document.getElementById(ALERT_VIEW_ID);
    if(isNull(em)) {
        return;
    }
    em.innerHTML = "";
    if(noneNowLoading != true) {
        clearNowLoading();
    }
}

// create start alert html.
const createStartAlertHtml = function(message) {
    const p = dialogPositionCalcSize();
    const top = p.top + (window.scrollY|0);
    return "<div id='" + ALERT_WINDOW_ID + "' style='z-index:" + ALERT_ZINDEX + ";position:absolute;left:" +
        p.left + "px;top:" + top + "px;"+"width:" + p.width + "px;height:" + p.height + "px;border-radius:" +
        p.radius + "px;word-break:break-all;background:#ffffff;color:#000000;border: solid 2px #efefef;" +
        BACK_DIALOG_SHADOW + "overflow:auto;'" +
        ">" +
        "<div style='margin:10px;font-size:small;color:#666;'>" +
        changeHtml(message) ;
}

// create end alert html.
const createEndAlertHtml = function() {
    return "</div></div>";
}

// new window to alert.
const alertWindow = function(message, call) {
    if(isNull(message) ||
        (message = ("" + message).trim()).length == 0) {
        return;
    }
    // get alertViewId.
    const em = document.getElementById(ALERT_VIEW_ID);
    if(isNull(em)) {
        return;
    }
    nowLoading();
    em.innerHTML = createStartAlertHtml(message) + createEndAlertHtml();
    // click callback.
    timeLagCall(function() {
        const em = document.getElementById("alertWindowId");
        if(!isNull(em)) {
            // call指定されている場合.
            if(typeof(call) == "function") {
                // クリックした場合.
                addEvent(em, "click", function() {
                    // コール実行でfalse以外返却の場合.
                    if(call() != false) {
                        // alert解除.
                        clearAlertWindow()
                    }
                });
            } else {
                // クリックでalert解除.
                addEvent(em, "click", clearAlertWindow);
            }
        }
    });
}

// add button.
const addButton = function(id, view) {
    return "<a href='javascript:void(0);' id='" + id +
        "' class='base_dialog_button'>" + view + "</a>";
}

// new window to confirm.
// yes ボタン押下 => call(true)
// no ボタン押下 => call(false)
const confirmWindow = function(message, call) {
    // get alertViewId.
    let em = document.getElementById(ALERT_VIEW_ID);
    if(isNull(em)) {
        return;
    } else if(isNull(message) || (message = ("" + message).trim()).length == 0) {
        return;
    }
    // get alertViewId.
    em = document.getElementById(ALERT_VIEW_ID);
    if(isNull(em)) {
        return;
    }
    nowLoading();
    const p = dialogPositionCalcSize();
    em.innerHTML = createStartAlertHtml(message) +
        "<br><br>" +
        addButton(ALERT_YES_BUTTON_ID, "O&nbsp;&nbsp;K") +
        "&nbsp;&nbsp;" +
        addButton(ALERT_NO_BUTTON_ID, "CANCEL") +
        createEndAlertHtml();
    // yes no button click callback.
    timeLagCall(function() {
        // yesButton.
        const yesCall = function() {
            if(!call(true)) {
                clearAlertWindow()
            }
        };
        // noButton.
        const noCall = function() {
            call(false);
            clearAlertWindow()
        };
        let em = document.getElementById(ALERT_YES_BUTTON_ID);
        if(!isNull(em)) {
            addEvent(em, "click", yesCall);
            addEvent(em, "keydown", function(e) {
                e.preventDefault();
                yesCall();
            });
        }
        em = document.getElementById(ALERT_NO_BUTTON_ID);
        if(!isNull(em)) {
            addEvent(em, "click", noCall);
            addEvent(em, "keydown", function(e) {
                e.preventDefault();
            });
            // default cancel focus.
            em.focus();
        }
    });
}

/////////////////////////////////////////////////////
// 外部定義.
/////////////////////////////////////////////////////
const o = {};
_g.dialog = o;
o.nowLoading = nowLoading;
o.alertWindow = alertWindow;
o.confirmWindow = confirmWindow;
o.clearAlertWindow = clearAlertWindow;
o.clearNowLoading = clearNowLoading;

})(this);
