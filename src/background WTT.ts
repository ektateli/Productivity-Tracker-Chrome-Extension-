// Website Time Tracking

let activeTab: string | null = null;
const timeSpent: Record<string, number> = {};
let trackingEnabled = true; // Default: Tracking ON

// ✅ Load Tracking State from Storage
chrome.storage.local.get("trackingEnabled", (data) => {
  if (data.trackingEnabled !== undefined) {
    trackingEnabled = data.trackingEnabled;
  }
});

// ✅ Function to Track Active Tab
const updateActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    const url = new URL(tab.url);
    activeTab = url.hostname !== "newtab" ? url.hostname : null;
  }
};

// ✅ Function to Update Storage
const updateStorage = () => {
  if (trackingEnabled && activeTab) {
    timeSpent[activeTab] = (timeSpent[activeTab] || 0) + 1000;
    chrome.storage.local.set({ timeSpent });
  }
};

// ✅ Use `chrome.runtime.onStartup` to Reattach Listeners on Extension Reload
chrome.runtime.onStartup.addListener(() => {
  console.log("Extension restarted");
  updateActiveTab();
});

// ✅ Ensure Listeners Stay Active
chrome.tabs.onActivated.addListener(updateActiveTab);
chrome.tabs.onUpdated.addListener(updateActiveTab);
chrome.windows.onFocusChanged.addListener(updateActiveTab);
chrome.storage.onChanged.addListener((changes) => {
  if (changes.trackingEnabled) {
    trackingEnabled = changes.trackingEnabled.newValue;
  }
});

// ✅ Run Timer Every Second Without Invalidating Context
setInterval(updateStorage, 1000);


// For Daily Goal Setting



