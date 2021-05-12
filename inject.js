/* 
	Very Simple Images Block with easy ON-OFF button 
	================================================
	FreeAngel
    my youtube channel : http://www.youtube.com/channel/UC15iFd0nlfG_tEBrt6Qz1NQ
*/

allow_images = false;

 function addcss(css){
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {   // IE
        s.styleSheet.cssText = css;
    } else {                // the world
        s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
 }
 
function reImage(){

	if(!allow_images) { allow_images = true; } else { allow_images = false; }
	chrome.extension.sendMessage({action:"set","status":allow_images},function(){
		window.location.reload();
	})
}	

function info(val){

	var btn = document.getElementById("mybtn");
	if(!btn) { 
	
		btn = document.createElement('a');
		btn.id = 'mybtn';
		btn.href= '#';
		document.body.appendChild(btn);
		btn.addEventListener('click', function(ev){
			reImage();
			ev.preventDefault();
		});
	}
	
	if(!val) {
		btn.style.cssText = 'margin-top:22px; display: block; z-index: 99999;position:fixed;width:30px;height:30px;bottom:40px;right:40px;background-color:#C00;color:#FFF;border-radius:50px;text-align:center;box-shadow: 3px 3px 5px #999;';
	} else {
		btn.style.cssText = 'margin-top:22px; display: block; z-index: 99999;position:fixed;width:30px;height:30px;bottom:40px;right:40px;background-color:#0A0;color:#FFF;border-radius:50px;text-align:center;box-shadow: 3px 3px 5px #999;';
	}
	
	blockAll();
}

function blockAll(){
	
		if(allow_images) { return; }
		
		var vids = document.getElementsByTagName('video');
		for(i=0; i<vids.length;i++){
			
			vids[i].removeAttribute('autoplay');
		}
		
		var imgs = document.images;
//		console.log('imgs : '+imgs.length);
		
		for(var i = 0; i<imgs.length; i++){	imgs[i].src='';	}
		
		imgs = document.querySelectorAll('[style*="background"]');
		for(var i = 0; i<imgs.length; i++){	imgs[i].style.backgroundImage = '';	}	
		
		var ads = document.querySelectorAll('[class*="ads"]');
		for(var i = 0; i<ads.length; i++){
			ads[i].parentNode.removeChild(ads[i]);
		}
}

//Images
function getBlankImg(){
	return chrome.extension.getURL("bg.png");
}

function get_domain(url){
	
	var urlParts = /^(?:\w+\:\/\/)?([^\/]+)(.*)$/.exec(url);
	var hostname = urlParts[1]; // www.example.com
	return hostname;
}

function IsThisSite(url) {
		var h = get_domain(window.location.href);
		return url.indexOf(h) !== -1;
}


function doOnLoad(event) {
		
	if (!allow_images && event.srcElement.tagName == "IFRAME"  && !IsThisSite(event.srcElement.src)) {
			event.srcElement.src = '';
			event.srcElement.style.backgroundImage = '';
			event.srcElement.style.display='none';
		} 
			
	blockAll();
}

	document.addEventListener('load', doOnLoad, true);

	first = false;

	chrome.extension.sendMessage({action:"get"}, function(response){
					
			allow_images = response.status;
			blockAll();
			first = true;
	});
    
	
	   var readyStateCheckInterval = setInterval(function() {
	       if ((document.readyState === "interactive") || (document.readyState === "complete")){

				if(first){
			   
					info(allow_images);
					first = false;
					clearInterval(readyStateCheckInterval);
				}
			}
			
			console.log("tick");
	}, 1000);
	
