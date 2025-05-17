import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const DailyGoalSetting = () => {
    const [goal, setGoal] = useState<number>(0);
    const [goalTrackingEnabled, setGoalTrackingEnabled] = useState<boolean>(false);
    const [timeSpentOnGoal, setTimeSpentOnGoal] = useState<number>(0);

    const navigate = useNavigate();

    // ✅ Load stored values from Chrome storage
    useEffect(() => {
        chrome.storage.local.get(["dailyGoal", "goalTrackingEnabled", "timeSpentOnGoal"], (data) => {
            if (data.dailyGoal) setGoal(data.dailyGoal);
            if (data.goalTrackingEnabled !== undefined) setGoalTrackingEnabled(data.goalTrackingEnabled);
            if (data.timeSpentOnGoal) setTimeSpentOnGoal(data.timeSpentOnGoal);
        });

        // ✅ Listen for changes in time tracking
        const handleStorageChange = (changes: Record<string, chrome.storage.StorageChange>) => {
            if (changes.timeSpentOnGoal) {
                setTimeSpentOnGoal(changes.timeSpentOnGoal.newValue || 0);
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    }, []);

    // ✅ Save Goal to Chrome Storage
    const saveGoal = () => {
        chrome.storage.local.set({ dailyGoal: goal });
    };

    // ✅ Toggle Goal Tracking
    const toggleTracking = () => {
        const newState = !goalTrackingEnabled;
        setGoalTrackingEnabled(newState);
        chrome.storage.local.set({ goalTrackingEnabled: newState });
    };

    // ✅ Reset Time Spent (FIXED)
    const resetTimeSpent = () => {
        chrome.storage.local.set({ timeSpentOnGoal: 0 }, () => {
            chrome.storage.local.get("timeSpentOnGoal", (data) => {
                setTimeSpentOnGoal(data.timeSpentOnGoal || 0); // ✅ Ensure state updates properly
            });
        });
        chrome.runtime.sendMessage({ action: "resetTimer" });
    };

    // ✅ Format time in `mm min ss sec`
    const formatTime = (ms: number): string => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        return `${minutes} min ${seconds % 60} sec`;
    };

    return (
        <motion.div
            className="card"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 >Daily Goal Setting</h1>
            <p id="itemDescription">Allow users to set specific time-based goals for productive work. Notify users when they reach/exceed their goals.</p>

            {/* Input for setting goal */}
            <label htmlFor="input">Enter Goal (minutes) </label>
            <motion.input
                id="input"
                className="input"
                type="number"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                placeholder="Enter Goal (minutes)"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileFocus={{ scale: 1.05, borderColor: "#4facfe" }}
            />

            {/* Save Goal Button */}
            <motion.button
                className="button"
                onClick={saveGoal}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1, backgroundColor: "#4facfe", color: "#fff" }}
                whileTap={{ scale: 0.95 }}
            >
                Save Goal
            </motion.button>

            {/* Toggle Goal Tracking */}
            <motion.button
                className={`button ${goalTrackingEnabled ? "enabled" : "disabled"}`}
                onClick={toggleTracking}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1, backgroundColor: goalTrackingEnabled ? "#ff4f4f" : "#4facfe", color: "#fff" }}
                whileTap={{ scale: 0.95 }}
            >
                {goalTrackingEnabled ? "Disable Tracking" : "Enable Tracking"}
            </motion.button>

            {/* Display Time Spent */}
            <motion.div
                className="goal-progress"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3>Time Spent: {formatTime(timeSpentOnGoal)}</h3>
            </motion.div>

            {/* Reset Button (Fixed) */}
            <motion.button
                onClick={() => resetTimeSpent()}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.1, backgroundColor: "#ff4757", color: "#fff" }}
                whileTap={{ scale: 0.95 }}
            >
                🔄 Reset Time
            </motion.button>

            <motion.button
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileFocus={{ scale: 1.05, borderColor: "#4facfe" }}
                whileHover={{ scale: 1.1, backgroundColor: "#4facfe", color: "#fff" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
            >
                {"Go to Home"}
            </motion.button>

        </motion.div>
    );
};
