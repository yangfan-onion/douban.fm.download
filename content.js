var current = null;
var isRepeatMode= false;
$(document).ready(go);

function go() {
    addDownloadLink();
    setInterval(requireInforFromBackgroundPage, 1000)
}

function requireInforFromBackgroundPage() {
    chrome.extension.sendMessage({from:"douban.fm"}, function (response) {
      current = response.music;
    });
}


function addDownloadLink(){
    var icon_url = chrome.extension.getURL('download_30x30.png');
    var download = $("<div id='download'><img src='"+icon_url+"' alt='download' /></div>");
    $('.player-wrap').append(download);
    $("#download img").bind("click", downLoadCurrent);
}

function downLoadCurrent()
{
    var iframe;
    iframe = document.getElementById("hiddenDownloader");
    if (iframe === null)
    {
        iframe = document.createElement('iframe');
        iframe.id = "hiddenDownloader";
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);
    }
    iframe.src = current;
}



