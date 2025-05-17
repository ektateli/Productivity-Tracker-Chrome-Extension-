chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab?.url) {
      const urlObj = new URL(tab.url);
      const domain = urlObj.hostname;
      chrome.storage.local.set({ activeDomain: domain });
    //   console.log("Active Domain:", domain);
    }
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
      const urlObj = new URL(tab.url);
      const domain = urlObj.hostname;
      chrome.storage.local.set({ activeDomain: domain });
    //   console.log("Tab Updated - New Domain:", domain);
    }
  });
  