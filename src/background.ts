// ✅ Website Time Tracking (Independent)
let activeTab: string | null = null;
const timeSpent: Record<string, number> = {};
let trackingEnabled = false; // Default: Tracking OFF

// ✅ Daily Goal Tracking (Independent)
let dailyGoal = 0;
let goalTrackingEnabled = false; // Separate toggle for Daily Goal tracking
let timeSpentOnGoal = 0;
let goalNotificationSent = false; // ✅ Prevent repeated notifications

// ✅ Load Stored Values
chrome.storage.local.get(
  ["trackingEnabled", "timeSpent", "dailyGoal", "goalTrackingEnabled", "timeSpentOnGoal"],
  (data) => {
    if (data.trackingEnabled !== undefined) trackingEnabled = data.trackingEnabled;
    if (data.timeSpent) Object.assign(timeSpent, data.timeSpent);
    if (data.dailyGoal) dailyGoal = data.dailyGoal;
    if (data.goalTrackingEnabled !== undefined) goalTrackingEnabled = data.goalTrackingEnabled;
    if (data.timeSpentOnGoal) timeSpentOnGoal = data.timeSpentOnGoal;
  }
);

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

// ✅ Update Daily Goal Time Tracking
const updateGoalTimeTracking = () => {
  if (goalTrackingEnabled) {
    timeSpentOnGoal += 1000;
    chrome.storage.local.set({ timeSpentOnGoal });

    // ✅ Notify Only Once When Goal is Reached
    if (dailyGoal > 0 && timeSpentOnGoal >= dailyGoal * 60000 && !goalNotificationSent) {
      try {
        chrome.notifications.create({
          type: "basic",
          iconUrl: chrome.runtime.getURL("icons/icon.png"),
          title: "🎯 Goal Reached!",
          message: `You've completed ${dailyGoal} minutes of work! 🎉 Keep going! 🚀`,
        });
      } catch (error) {
        console.warn("⚠️ Notification Error: Extension context invalidated.");
      }

      goalNotificationSent = true; // ✅ Prevent further notifications
    }
  }
};

// ✅ Reset Time Tracking Properly
const resetTimeTracking = () => {
  console.log("⏳ Resetting time tracking...");
  timeSpentOnGoal = 0;
  Object.keys(timeSpent).forEach((key) => (timeSpent[key] = 0));

  chrome.storage.local.set({ timeSpent: {}, timeSpentOnGoal: 0 }, () => {
    console.log("⏳ Time tracking reset!");
  });

  goalNotificationSent = false; // ✅ Reset notification flag

  try {
    chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icons/icon.png"),
      title: "🔄 Timer Reset",
      message: "All tracked time has been reset! ⏳",
    });
  } catch (error) {
    console.warn("⚠️ Notification Error: Extension context invalidated.");
  }
};

// ✅ Handle Message from Popup or Content Script
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === "resetTimer") {
    resetTimeTracking();
    sendResponse({ status: "success" });
  }
});

// ✅ Handle Storage Changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.trackingEnabled) {
    trackingEnabled = changes.trackingEnabled.newValue;
  }
  if (changes.dailyGoal) {
    dailyGoal = changes.dailyGoal.newValue;
    goalNotificationSent = false; // ✅ Reset notification when goal changes
  }
  if (changes.goalTrackingEnabled) {
    goalTrackingEnabled = changes.goalTrackingEnabled.newValue;
  }
});

// ✅ Ensure Active Tab is Tracked Correctly
chrome.runtime.onStartup.addListener(updateActiveTab);
chrome.tabs.onActivated.addListener(updateActiveTab);
chrome.tabs.onUpdated.addListener(updateActiveTab);
chrome.windows.onFocusChanged.addListener(updateActiveTab);

// ✅ Run Both Trackers Independently Every Second
setInterval(updateWebsiteTimeTracking, 1000);
setInterval(updateGoalTimeTracking, 1000);
