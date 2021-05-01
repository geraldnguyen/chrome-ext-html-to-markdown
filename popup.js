
function convertHtmlToMarkdown(value) {
  return getOptions().then(options => {
    var turndownService = new TurndownService(options); 
    return turndownService.turndown(value);
  });
}

document.getElementById("convertBtn").addEventListener("click", function() {
  convertHtmlToMarkdown(document.getElementById("htmlTA").value)
  .then(markdown => {
    document.getElementById("markdownTA").value = markdown;
  });
});
