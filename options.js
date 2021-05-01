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

function saveOptions() {
  const options = {};
  Object.keys(defaultOptions).forEach(key => {
    value = document.getElementById(key).value;
    options[key] = value;
  });

  chrome.storage.sync.set(options, function() {
    // Update status to let user know options were saved.
    var saveStatus = document.getElementById('saveStatus');
    saveStatus.textContent = 'Options saved.';
    setTimeout(function() {
      saveStatus.textContent = '';
    }, 1000);
  });
}

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

function restoreOptions() {
  getOptions().then(items => {
    for (const [key, value] of Object.entries(items)) {
      document.getElementById(key).value = value;
    }
  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);

Object.keys(defaultOptions).forEach(key => {
  document.getElementById(key).addEventListener('change',saveOptions);;
});