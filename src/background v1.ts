// ✅ Website Time Tracking (Independent)
let activeTab: string | null = null;
const timeSpent: Record<string, number> = {};
let trackingEnabled = false; // Default: Tracking OFF

// ✅ Daily Goal Tracking (Independent)
let dailyGoal = 0;
let goalTrackingEnabled = false; // Separate toggle for Daily Goal tracking
let timeSpentOnGoal = 0;

// ✅ Load Stored Values
chrome.storage.local.get(["trackingEnabled", "timeSpent", "dailyGoal", "goalTrackingEnabled", "timeSpentOnGoal"], (data) => {
  if (data.trackingEnabled !== undefined) trackingEnabled = data.trackingEnabled;
  if (data.timeSpent) Object.assign(timeSpent, data.timeSpent);
  if (data.dailyGoal) dailyGoal = data.dailyGoal;
  if (data.goalTrackingEnabled !== undefined) goalTrackingEnabled = data.goalTrackingEnabled;
  if (data.timeSpentOnGoal) timeSpentOnGoal = data.timeSpentOnGoal;
});

// ✅ Function to Track Active Tab (For Website Tracking)
const updateActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    const url = new URL(tab.url);
    activeTab = url.hostname !== "newtab" ? url.hostname : null;
  }
};

// ✅ Update Website Time Tracking
const updateWebsiteTimeTracking = () => {
  if (trackingEnabled && activeTab) {
    timeSpent[activeTab] = (timeSpent[activeTab] || 0) + 1000;
    chrome.storage.local.set({ timeSpent });
  }
};

let goalNotificationSent = false; // ✅ Prevent repeated notifications

const updateGoalTimeTracking = () => {
  if (goalTrackingEnabled) {
    timeSpentOnGoal += 1000;
    chrome.storage.local.set({ timeSpentOnGoal });

    // ✅ Notify Only Once When Goal is Reached
    if (dailyGoal > 0 && timeSpentOnGoal >= dailyGoal * 60000 && !goalNotificationSent) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: chrome.runtime.getURL("icons/icon.png"),
        title: "🎯 Goal Reached!",
        message: `You've completed ${dailyGoal} minutes of work! 🎉 Keep going! 🚀`,
      });

      goalNotificationSent = true; // ✅ Prevent further notifications
    }
  }
};

// ✅ Reset Notification Flag When Timer is Reset
const resetTimeTracking = () => {
  timeSpentOnGoal = 0; 
  Object.keys(timeSpent).forEach((key) => (timeSpent[key] = 0)); 

  chrome.storage.local.set({ timeSpent: {}, timeSpentOnGoal: 0 }, () => {
    console.log("⏳ Time tracking reset!");
  });

  goalNotificationSent = false; // ✅ Allow notifications again after reset

  // chrome.notifications.create({
  //   type: "basic",
  //   iconUrl: chrome.runtime.getURL("icons/icon.png"),
  //   title: "🔄 Timer Reset",
  //   message: "All tracked time has been reset! ⏳",
  // });
};


// ✅ Add a Listener for Reset Button (Popup or Content Script)
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === "resetTimer") {
    resetTimeTracking();
    sendResponse({ status: "success" });
  }
});


// ✅ Listeners (Ensuring Independence)
chrome.runtime.onStartup.addListener(updateActiveTab);
chrome.tabs.onActivated.addListener(updateActiveTab);
chrome.tabs.onUpdated.addListener(updateActiveTab);
chrome.windows.onFocusChanged.addListener(updateActiveTab);
chrome.storage.onChanged.addListener((changes) => {
  if (changes.trackingEnabled) trackingEnabled = changes.trackingEnabled.newValue;
  if (changes.dailyGoal) dailyGoal = changes.dailyGoal.newValue;
  if (changes.goalTrackingEnabled) goalTrackingEnabled = changes.goalTrackingEnabled.newValue;
});

// ✅ Run Both Trackers Independently Every Second
setInterval(updateWebsiteTimeTracking, 1000);
setInterval(updateGoalTimeTracking, 1000);
