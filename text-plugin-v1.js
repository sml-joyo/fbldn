function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

var name = getParameterByName('name') || '';
var urlPrefix = getParameterByName('prefix') || true;
var XJS_URL = "https://cdn2.xsplit.com/xjs/download/2.9.0/xjs.min.js?source";

const loadScript = (url, callback) => {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;    
 
    script.onreadystatechange = callback;
    script.onload = callback;
 
    head.appendChild(script);
}
 
const loadScriptCallback = () => {          
    XJS = require('xjs');
    XJS.ready().then(function() {
		if (name.length > 0) {
			setFacebookName(name);
		} else {
		   setInitialText();
		   subscribeToStreamEvents();
		}
    });    
};
 
loadScript(XJS_URL, loadScriptCallback);  
 
const setFacebookName = (name = "") => {
	let facebookText = '';
	
	if (urlPrefix) {
		facebookText += 'FB.gg/';
	}
	
	facebookText += name.replace(/ /g,'');
	SetText(facebookText);
}
 
const setInitialTextWithName = () => {
    XJS.Output.getOutputList()
    .then(outputList => {
        outputList.map(output => {
          output.getName()
          .then ((name) => {
            if(name.includes('Facebook')) {
              const cleanFacebookName = name.split('-')[1].trim();
              setFacebookName(cleanFacebookName);
            }
          });
        });
    });
}

const setInitialText = () => {
    setFacebookName();
}
 
const subscribeToStreamEvents = () => {
  XJS.ChannelManager.on('stream-start', streamInfo => {
    if (streamInfo.error === false) {
      streamInfo.channel.getName()
      .then(name => {
        if (name.includes('Facebook')) {
          const cleanFacebookName = name.split('-')[1].trim();
          setFacebookName(cleanFacebookName);
        }
      });      
    }
  });

  /*XJS.ChannelManager.on('stream-end', () => {
    setFacebookName();    
  });*/
}