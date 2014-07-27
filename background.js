var tab;
var current;
var isRepeatMode = false;

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
      tab = sender.tab;
      if(request.from==null){
        sendResponse({});
        return;
      }
      if(request.from == "douban.fm") {
        sendResponse({"music":current});
      }
      if(request.from == "repeat"){
        isRepeatMode = !isRepeatMode;
        sendResponse({});
      }
        else
            sendResponse({});
    });


chrome.webRequest.onBeforeRequest.addListener(
    function (info) {
        if(isRepeatMode && info.url.indexOf(".mp4")!=-1){
          return {redirectUrl:current};
        }
        else if(info.url.lastIndexOf(".mp4")==info.url.length-4){
            current = info.url+"?douban=";
        }
        return {cancel:false};

    },
    {
        urls:[
            "http://*.douban.com/*",
            "http://douban.fm/*"
        ]
    },
    ["blocking"]);


var response;
chrome.webRequest.onHeadersReceived.addListener(function (details) {

    if(details.url.indexOf(".mp4?douban=")!=-1){
     response =details;// for debugging
     for (i = 0; i < details.responseHeaders.length; i++) {
        console.log(details.responseHeaders[i].name);
       if(details.responseHeaders[i].name.toLowerCase() == "content-type"){
          details.responseHeaders[i].value= "application/x-please-download-me";
        }
     }
     details.responseHeaders.push({name:"Content-disposition",value:"attachment; filename="+tab.title.substring(0, tab.title.lastIndexOf('-')-1)+ ".mp3"});
    }

    return {
        responseHeaders : details.responseHeaders
    };
    }, {
        urls : ["<all_urls>"],
        types : ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
    },
        ["blocking", "responseHeaders"]);


