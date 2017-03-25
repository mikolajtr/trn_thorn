var doc = document.documentElement.outerHTML;

chrome.runtime.sendMessage({token: "doc"}, function(response) {

});
