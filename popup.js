var turndownService = new TurndownService(); 

document.getElementById("htmlTA").onchange = function(e) {
  const markdown = turndownService.turndown(e.target.value);
  document.getElementById("markdownTA").value = markdown;
}


// const message = { type: 'view-clipboard' };

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   const tab = tabs[0];

//   chrome.scripting.executeScript(
//     {
//       target: { tabId: tab.id },
//       files: ['contentScript.js'],
//     }, 
//     function() {
//       var port = chrome.tabs.connect(tab.id, {name: "popup"});

//       console.log("post message", message)
//       port.postMessage(message);
//       port.onMessage.addListener(function(response) {
//         console.log("expecting value", response)
//         document.getElementById('clipboard-content').innerText = response;
//       });
//     }
//   );
// });
