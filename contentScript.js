function saveToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

const defaultOptions = {
  headingStyle: 'setext',
  hr: "***",
  bulletListMarker: "*",
  codeBlockStyle: "indented",
  fence: "```",
  emDelimiter: "_",
  strongDelimiter: "**",
  linkStyle: "inlined",
  linkReferenceStyle: "full"
};

function getOptions() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(defaultOptions, (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
      return resolve(items);
    });
  });
}

function convertHtmlToMarkdown(value) {
  return getOptions().then(options => {
    var turndownService = new TurndownService(options); 
    return turndownService.turndown(value);
  });
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
          .then(html => convertHtmlToMarkdown(html))
          .then(markdown => saveToClipboard(markdown));
      }
    }
  });
});

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