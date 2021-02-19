function saveToClipboard(text) {
  return navigator.clipboard.writeText(text);
}


chrome.runtime.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    console.log("Received message", msg);

    switch (msg.type) {
      case 'copy-to-clipboard': {
        saveToClipboard(msg.text)
          .then(() => port.postMessage("Done: " + msg.text)); 
        break;
      }
      case 'copy-selection': {
        console.log('execute command copy')
        var turndownService = new TurndownService();

        document.execCommand('copy');
        navigator.clipboard.read()
          .then(items => items[0])
          .then(item => item.getType('text/html'))
          .then(blob => blob.text())
          .then(html => turndownService.turndown(html))
          .then(markdown => saveToClipboard(markdown));
      }
      // case 'view-clipboard': 
      //   viewClipboard()
      //     .then(value => port.postMessage(value)); 
      //   break;
    }
  });
});

// next time:

// DOMException: Document is not focused
// function viewClipboard() {
//   console.log("Viewing clipboard")
//   navigator.permissions.query({name: "clipboard-read"}).then(result => {
//     // If permission to read the clipboard is granted or if the user will
//     // be prompted to allow it, we proceed.
  
//     if (result.state == "granted" || result.state == "prompt") {
//       return navigator.clipboard.read();
//     }
//     else return Promise.resolve("[Require clipboard-read permission]");
//   });
// }