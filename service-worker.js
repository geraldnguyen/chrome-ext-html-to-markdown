function sendCommandToTab(tab, command, responseCallback) {
  return chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ['contentScript.js'],
    }, 
    function() {
      var port = chrome.tabs.connect(tab.id, {name: "service-worker"});

      port.postMessage(command);
      port.onMessage.addListener(responseCallback);
    }
  );  
}

function copyToClipboard(tab, text) {
  console.log("Copying", text, "to clipboard");

  sendCommandToTab(tab, {type: 'copy-to-clipboard', text}, function(response) {
    console.log(response);
  });
}

function copySelection(tab) {
  sendCommandToTab(tab, { type: 'copy-selection' }, function(response) {
    console.log(response);
  });
}

function linkToMarkdown(text, url) {
  return `[${text}](${url})`;
}

const copyLinkCommand = 'html-to-markdown-copy-link';
const copyImageCommand = 'html-to-markdown-copy-image';
const copySelectionCommand = 'html-to-markdown-copy-selection';

const contextMenus = [
  {
    id: copyLinkCommand,
    title: "Convert link to markdown and copy",
    type: 'normal',
    contexts: ['link'],
  },
  {
    id: copyImageCommand,
    title: "Convert image tag to markdown and copy",
    type: 'normal',
    contexts: ['image'],
  },
  {
    id: copySelectionCommand,
    title: "Convert selection to markdown and copy",
    type: 'normal',
    contexts: ['selection'],
  },
];

function handleContextMenuClick(selectionInfo, tab) {
  const { menuItemId } = selectionInfo;

  switch (menuItemId) {
    case copyLinkCommand: {
      const { selectionText, linkUrl } = selectionInfo;
      const md = linkUrl ? linkToMarkdown(selectionText, linkUrl) : selectionText;
      copyToClipboard(tab, md); 
      break;
    }
    case copyImageCommand: {
      const { srcUrl } = selectionInfo;
      const md = `![](${srcUrl})`;
      copyToClipboard(tab, md); 
      break;
    }
    case copySelectionCommand: {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: ['turndown.js'],
        },
        function() {
          copySelection(tab);
        }
      );
      break;
    }
  }
}

chrome.runtime.onInstalled.addListener(() => {
  contextMenus.forEach(it => chrome.contextMenus.create(it));
});

chrome.contextMenus.onClicked.addListener(handleContextMenuClick);
