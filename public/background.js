// send the url to contentScript of the current webpage
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete')
    {
        const siteUrl = tab.url;

        chrome.tabs.sendMessage(tabId, {
            type : "NEW",
            myUrl: siteUrl
        });
    }
  });