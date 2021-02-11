function copyToClipboard(tab, text) {
  console.log("Copying", text, "to clipboard");

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ['contentScript.js'],
    }, 
    function() {
      var port = chrome.tabs.connect(tab.id, {name: "service-worker"});

      port.postMessage({type: 'copy-to-clipboard', text});
      port.onMessage.addListener(function(response) {
        console.log(response);
      });
    }
    // () => chrome.tabs.sendMessage(tab.id, {type: 'copy-to-clipboard', text}, console.log)
  );  
}

function linkToMarkdown(text, url) {
  return `[${text}](${url})`;
}


const copyLinkCommand = 'html-to-markdown-copy-link';

const contextMenus = [
  {
    id: copyLinkCommand,
    title: "Convert link to markdown and copy",
    type: 'normal',
    contexts: ['selection'],
  },
];

function handleContextMenuClick(selectionInfo, tab) {
  const { menuItemId, selectionText, linkUrl } = selectionInfo;

  switch (menuItemId) {
    case copyLinkCommand: 
      const md = linkUrl ? linkToMarkdown(selectionText, linkUrl) : selectionText;
      copyToClipboard(tab, md); 
      break;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  contextMenus.forEach(it => chrome.contextMenus.create(it));
});

chrome.contextMenus.onClicked.addListener(handleContextMenuClick);
