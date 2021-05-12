/* 
	Very Simple Images Block with easy ON-OFF button 
	================================================
	FreeAngel
    my youtube channel : http://www.youtube.com/channel/UC15iFd0nlfG_tEBrt6Qz1NQ
*/

var requestsMade = {};
var blockThese = [];
var requestsBlocked = {};
var allowedTabs = [];

function FindTab(id){

		for(var i=0; i<allowedTabs.length; i++){
			if(allowedTabs[i].id == id) {
				return i;
			}
		}
		
		return -1;
}

function RemoveTab(id){
		
		var i = FindTab(id);
		if(i != -1) { 
			allowedTabs[i].id = -1; 
		}
}

function IsAllowImages(tabId){

	var i = FindTab(tabId);
	if(i == -1) { return false; }
	return allowedTabs[i].enable == true;
}

function SetAllowedTab(tabID,enable){

	var i = FindTab(tabID);
	if(i == -1){
		
		i = FindTab(-1);
		if(i != -1){
			allowedTabs[i].id = tabID;
			allowedTabs[i].enable = enable;
			return;
		}
		
		var t = {};
		t.id = tabID;
		t.enable = enable;
		allowedTabs.push(t);
		return;
	}
	
	allowedTabs[i].enable = enable;
}

chrome.tabs.onCreated.addListener(function (details) {
	SetAllowedTab(details.id, false);
});

chrome.tabs.onRemoved.addListener(function (tabid, removed) {
	console.log("try to remove id : "+tabid);
	RemoveTab(tabid);
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	  
	  if(!IsAllowImages(details.tabId)){
        return {redirectUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="};
    }
}, {urls: ["http://*/*", "https://*/*"], types: ["image", "object"]}, ["blocking"]);


chrome.tabs.onUpdated.addListener(function(tabId) {
	
    if (!IsAllowImages(tabId)) {
        chrome.tabs.insertCSS(null, {code: "img{visibility: hidden;}", runAt: "document_start"});       
    }
});


function GetRequests(tabId) {
  return { "made": requestsMade[tabId.toString()], "blocked": requestsBlocked[tabId.toString()] };
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
/*    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension"); */
				
    if (request.action == "get"){
		var b = IsAllowImages(sender.tab.id);
		var message = {status: b};
		sendResponse(message);
		return;
	}
	
	if(request.action == "set"){
	
		SetAllowedTab(sender.tab.id, request.status);
		
		return;
	}
	
 });